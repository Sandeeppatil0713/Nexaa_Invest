import Investment, { PLANS, REFERRAL_RATES } from "../models/Investment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import ReferralIncome from "../models/ReferralIncome.js";
import { AppError } from "../utils/AppError.js";

// ─── GET /api/investments ──────────────────────────────────────────────────────
export async function getInvestments(req, res, next) {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, investments });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/investments/:id ──────────────────────────────────────────────────
export async function getInvestmentById(req, res, next) {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, user: req.user._id });
    if (!investment) return next(new AppError("Investment not found", 404));
    res.json({ success: true, investment });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/investments (direct, no payment — kept for admin/testing) ──────
export async function createInvestment(req, res, next) {
  try {
    const { plan: planName, amount } = req.body;
    const investAmount = Number(amount);

    const plan = PLANS[planName];
    if (!plan) return next(new AppError("Invalid plan selected", 400));

    if (investAmount < plan.minAmount) {
      return next(new AppError(
        `Minimum investment for ${planName} is ₹${plan.minAmount.toLocaleString("en-IN")}`, 400,
      ));
    }
    if (plan.maxAmount !== Infinity && investAmount > plan.maxAmount) {
      return next(new AppError(
        `Maximum investment for ${planName} is ₹${plan.maxAmount.toLocaleString("en-IN")}`, 400,
      ));
    }

    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const investment = await Investment.create({
      user:            req.user._id,
      plan:            planName,
      amount:          investAmount,
      dailyRoiPercent: plan.dailyRoiPercent,
      durationDays:    plan.durationDays,
      startDate,
      endDate,
    });

    await Transaction.create({
      user:       req.user._id,
      type:       "investment",
      amount:     -investAmount,
      status:     "success",
      relatedDoc: investment._id,
      note:       `${planName} plan investment`,
    });

    await distributeReferralIncome(req.user._id, investment, investAmount, plan);

    res.status(201).json({ success: true, investment });
  } catch (err) {
    next(err);
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
async function distributeReferralIncome(userId, investment, investAmount, plan) {
  let currentUserId = userId;

  for (let level = 1; level <= plan.referralLevels; level++) {
    const current = await User.findById(currentUserId).select("referredBy");
    if (!current?.referredBy) break;

    const uplineId   = current.referredBy;
    const rate       = REFERRAL_RATES[level - 1];
    const commission = parseFloat((investAmount * rate).toFixed(2));

    await User.findByIdAndUpdate(uplineId, {
      $inc: { walletBalance: commission, levelIncome: commission },
    });

    const refIncome = await ReferralIncome.create({
      recipient:  uplineId,
      fromUser:   userId,
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
      note:       `Level ${level} referral income`,
    });

    currentUserId = uplineId;
  }
}
