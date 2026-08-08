import mongoose from "mongoose";

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    creditDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["credited"],
      default: "credited",
    },
  },
  { timestamps: true },
);

// ─── Unique index: one ROI credit per investment per day ──────────────────────
roiHistorySchema.index({ investment: 1, creditDate: 1 }, { unique: true });

const RoiHistory = mongoose.model("RoiHistory", roiHistorySchema);
export default RoiHistory;
