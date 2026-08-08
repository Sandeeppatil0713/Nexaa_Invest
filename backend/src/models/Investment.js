import mongoose from "mongoose";

/**
 * Investment Plans config — single source of truth for ROI rates, durations,
 * and referral level access.
 */
export const PLANS = {
  Starter: {
    name: "Starter",
    dailyRoiPercent: 1.0,
    durationDays: 90,
    minAmount: 5000,
    maxAmount: 49999,
    referralLevels: 1, // eligible to earn from level-1 only
  },
  Professional: {
    name: "Professional",
    dailyRoiPercent: 1.5,
    durationDays: 120,
    minAmount: 50000,
    maxAmount: 499999,
    referralLevels: 3, // levels 1-3
  },
  Enterprise: {
    name: "Enterprise",
    dailyRoiPercent: 1.8,
    durationDays: 180,
    minAmount: 500000,
    maxAmount: Infinity,
    referralLevels: 4, // levels 1-4
  },
};

/**
 * Referral commission rates per level (index 0 = level 1).
 */
export const REFERRAL_RATES = [0.05, 0.03, 0.02, 0.01]; // 5%, 3%, 2%, 1%

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: Object.keys(PLANS),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1000, "Minimum investment is ₹1,000"],
    },
    dailyRoiPercent: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },
    totalRoiCredited: {
      type: Number,
      default: 0,
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ─── Compound index for cron queries ─────────────────────────────────────────
investmentSchema.index({ status: 1, endDate: 1 });

const Investment = mongoose.model("Investment", investmentSchema);
export default Investment;
