/**
 * Backfill ROI for all active investments from a start date to today.
 * Run once:  node scripts/backfill-roi.js
 */
import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);

const Investment  = (await import("../src/models/Investment.js")).default;
const User        = (await import("../src/models/User.js")).default;
const RoiHistory  = (await import("../src/models/RoiHistory.js")).default;
const Transaction = (await import("../src/models/Transaction.js")).default;

// Credit from this date up to and including today
const START_DATE = new Date("2026-08-05");
const END_DATE   = new Date(); // today = Aug 8
END_DATE.setUTCHours(0, 0, 0, 0);

// Build array of dates to backfill
const dates = [];
for (let d = new Date(START_DATE); d <= END_DATE; d.setDate(d.getDate() + 1)) {
  const creditDate = new Date(d);
  creditDate.setUTCHours(0, 0, 0, 0);
  dates.push(new Date(creditDate));
}

console.log(`Backfilling ROI for ${dates.length} day(s): ${dates.map(d => d.toDateString()).join(", ")}`);

let totalCredited = 0;
let totalSkipped  = 0;

const activeInvestments = await Investment.find({ status: "active" }).lean();
console.log(`Found ${activeInvestments.length} active investments\n`);

for (const inv of activeInvestments) {
  for (const creditDate of dates) {
    // Skip if this investment started after this credit date
    if (new Date(inv.startDate) > creditDate) continue;

    // Skip if already credited
    const already = await RoiHistory.exists({ investment: inv._id, creditDate });
    if (already) { totalSkipped++; continue; }

    const roiAmount = parseFloat(((inv.amount * inv.dailyRoiPercent) / 100).toFixed(2));

    try {
      await RoiHistory.create({
        user:       inv.user,
        investment: inv._id,
        amount:     roiAmount,
        creditDate,
        status:     "credited",
      });

      await User.findByIdAndUpdate(inv.user, {
        $inc: { walletBalance: roiAmount, totalRoi: roiAmount },
      });

      await Investment.findByIdAndUpdate(inv._id, {
        $inc: { totalRoiCredited: roiAmount },
      });

      await Transaction.create({
        user:       inv.user,
        type:       "roi_credit",
        amount:     roiAmount,
        status:     "success",
        relatedDoc: inv._id,
        note:       `Daily ROI — ${inv.plan} (backfill ${creditDate.toDateString()})`,
      });

      totalCredited++;
      console.log(`✅  ₹${roiAmount} → plan: ${inv.plan} | date: ${creditDate.toDateString()}`);
    } catch (err) {
      if (err.code === 11000) { totalSkipped++; continue; } // already exists
      console.error(`❌  Error for ${inv._id} on ${creditDate.toDateString()}:`, err.message);
    }
  }
}

// Print final balances for your accounts
const yourEmails = ["rocksandeep0713@gmail.com", "sandeepspatil987@gmail.com"];
const users = await User.find({ email: { $in: yourEmails } })
  .select("email walletBalance totalRoi");

console.log("\n─── Final Wallet Balances ─────────────────────────");
for (const u of users) {
  console.log(`  ${u.email}`);
  console.log(`    Wallet: ₹${u.walletBalance.toLocaleString("en-IN")}`);
  console.log(`    Total ROI: ₹${u.totalRoi.toLocaleString("en-IN")}`);
}

console.log(`\nDone — credited: ${totalCredited}, skipped (already done): ${totalSkipped}`);
await mongoose.disconnect();
