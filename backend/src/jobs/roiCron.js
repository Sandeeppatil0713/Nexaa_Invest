import cron from "node-cron";
import Investment, { PLANS, REFERRAL_RATES } from "../models/Investment.js";
import User from "../models/User.js";
import RoiHistory from "../models/RoiHistory.js";
import ReferralIncome from "../models/ReferralIncome.js";
import Transaction from "../models/Transaction.js";

/**
 * Process a single active investment — no sessions (M0 Atlas doesn't support them).
 * Idempotency is enforced by the unique compound index on (investment, creditDate).
 * Returns true if credited, false if already done or skipped.
 */
async function processInvestment(investment, creditDate) {
  // Guard: skip if already credited today
  const alreadyCredited = await RoiHistory.exists({
    investment: investment._id,
    creditDate,
  });
  if (alreadyCredited) return false;

  const roiAmount = parseFloat(
    ((investment.amount * investment.dailyRoiPercent) / 100).toFixed(2),
  );

  try {
    // 1. Store ROI history — unique index prevents duplicate on retry
    await RoiHistory.create({
      user:       investment.user,
      investment: investment._id,
      amount:     roiAmount,
      creditDate,
      status:     "credited",
    });

    // 2. Credit investor wallet
    await User.findByIdAndUpdate(investment.user, {
      $inc: { walletBalance: roiAmount, totalRoi: roiAmount },
    });

    // 3. Update investment running total
    await Investment.findByIdAndUpdate(investment._id, {
      $inc: { totalRoiCredited: roiAmount },
    });

    // 4. Record transaction
    await Transaction.create({
      user:       investment.user,
      type:       "roi_credit",
      amount:     roiAmount,
      status:     "success",
      relatedDoc: investment._id,
      note:       `Daily ROI — ${investment.plan}`,
    });

    // 5. Distribute referral income upline
    await distributeReferralForRoi(investment.user, investment, roiAmount);

    // 6. Mark completed if maturity date reached
    if (new Date(investment.endDate) <= creditDate) {
      await Investment.findByIdAndUpdate(investment._id, { status: "completed" });
    }

    return true;
  } catch (err) {
    // Duplicate-key = already credited (race condition) — safe to ignore
    if (err.code === 11000) return false;
    console.error(`❌  ROI job error for investment ${investment._id}:`, err.message);
    return false;
  }
}

/**
 * Walk upline up to 4 levels and credit referral commissions on ROI.
 */
async function distributeReferralForRoi(investorId, investment, roiAmount) {
  const plan = PLANS[investment.plan];
  if (!plan) return;

  let currentUserId = investorId;

  for (let level = 1; level <= plan.referralLevels; level++) {
    const current = await User.findById(currentUserId).select("referredBy");
    if (!current?.referredBy) break;

    const uplineId   = current.referredBy;
    const rate       = REFERRAL_RATES[level - 1];
    const commission = parseFloat((roiAmount * rate).toFixed(2));

    await User.findByIdAndUpdate(uplineId, {
      $inc: { walletBalance: commission, levelIncome: commission },
    });

    const refIncome = await ReferralIncome.create({
      recipient:  uplineId,
      fromUser:   investorId,
      investment: investment._id,
      level,
      amount:     commission,
    });

    await Transaction.create({
      user:       uplineId,
      type:       "referral_income",
      amount:     commission,
      status:     "success",
      relatedDoc: refIncome._id,
      note:       `Level ${level} ROI referral`,
    });

    currentUserId = uplineId;
  }
}

/**
 * Main daily ROI runner — processes all active investments.
 * Exported so it can be triggered manually via API or tests.
 */
export async function runDailyRoi() {
  const today = new Date();
  // Normalise to UTC midnight so the idempotency key is day-stable
  const creditDate = new Date(today);
  creditDate.setUTCHours(0, 0, 0, 0);

  console.log(`⏰  Daily ROI cron started — ${today.toISOString()}`);

  const activeInvestments = await Investment.find({
    status:  "active",
    endDate: { $gte: creditDate },
  }).lean();

  if (!activeInvestments.length) {
    console.log("   No active investments to process.");
    return { credited: 0, skipped: 0 };
  }

  let credited = 0;
  let skipped  = 0;

  for (const inv of activeInvestments) {
    const ok = await processInvestment(inv, creditDate);
    if (ok) credited++;
    else    skipped++;
  }

  console.log(`✅  Daily ROI done — credited: ${credited}, skipped: ${skipped}`);
  return { credited, skipped };
}

/**
 * Register the midnight cron schedule.
 */
export function startRoiCron() {
  cron.schedule("0 0 * * *", () => {
    runDailyRoi().catch((err) => console.error("ROI cron uncaught error:", err));
  });
  console.log("📅  Daily ROI cron registered (runs at 00:00 every day)");
}
