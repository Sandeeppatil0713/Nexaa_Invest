import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { AppError } from "../utils/AppError.js";

// ─── GET /api/user/profile ────────────────────────────────────────────────────
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("referredBy", "fullName referralCode");
    if (!user) return next(new AppError("User not found", 404));

    const downlineCount = await User.countDocuments({ referredBy: req.user._id });

    res.json({ success: true, user: { ...user.toPublic(), downlineCount } });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/user/wallet ─────────────────────────────────────────────────────
export async function getWallet(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("walletBalance totalRoi levelIncome");
    const recentTxns = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      wallet: {
        balance:     user.walletBalance,
        totalRoi:    user.totalRoi,
        levelIncome: user.levelIncome,
      },
      transactions: recentTxns,
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/user/withdraw ──────────────────────────────────────────────────
export async function requestWithdrawal(req, res, next) {
  try {
    const withdrawAmount = Number(req.body.amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return next(new AppError("Invalid withdrawal amount", 400));
    }

    // Atomic decrement — only succeeds if balance is sufficient
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, walletBalance: { $gte: withdrawAmount } },
      { $inc: { walletBalance: -withdrawAmount } },
      { new: true },
    );

    if (!user) {
      return next(new AppError("Insufficient wallet balance", 400));
    }

    const txn = await Transaction.create({
      user:   user._id,
      type:   "withdrawal",
      amount: -withdrawAmount,
      status: "processed",
      note:   "Withdrawal request",
    });

    res.json({ success: true, message: "Withdrawal request submitted", transaction: txn });
  } catch (err) {
    next(err);
  }
}
