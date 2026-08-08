import mongoose from "mongoose";

const referralIncomeSchema = new mongoose.Schema(
  {
    /** The user who receives the credit */
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    /** The downline user whose investment triggered this credit */
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** The investment that triggered this credit */
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    level: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

referralIncomeSchema.index({ recipient: 1, createdAt: -1 });

const ReferralIncome = mongoose.model("ReferralIncome", referralIncomeSchema);
export default ReferralIncome;
