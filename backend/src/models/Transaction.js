import mongoose from "mongoose";
import crypto from "crypto";

const TYPES = [
  "roi_credit",
  "referral_income",
  "investment",
  "withdrawal",
  "deposit",
];

const STATUSES = ["success", "processed", "pending", "failed"];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ref: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
      enum: TYPES,
      required: true,
    },
    /** Positive = credit, negative = debit */
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "success",
    },
    /** Optional reference to the related Investment / RoiHistory / ReferralIncome doc */
    relatedDoc: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// ─── Auto-generate TXN reference ─────────────────────────────────────────────
transactionSchema.pre("save", function () {
  if (!this.ref) {
    // 4 random bytes = ~4 billion unique values — collision-safe
    this.ref = "TXN-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }
});

transactionSchema.index({ user: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
