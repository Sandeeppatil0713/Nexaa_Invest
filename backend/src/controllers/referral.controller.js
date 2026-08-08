import User from "../models/User.js";
import ReferralIncome from "../models/ReferralIncome.js";
import { AppError } from "../utils/AppError.js";

// ─── GET /api/referral/income ──────────────────────────────────────────────────
export async function getReferralIncome(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const [records, total] = await Promise.all([
      ReferralIncome.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("fromUser", "fullName referralCode")
        .populate("investment", "plan amount"),
      ReferralIncome.countDocuments({ recipient: req.user._id }),
    ]);

    res.json({
      success: true,
      records,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/referral/tree ────────────────────────────────────────────────────
export async function getReferralTree(req, res, next) {
  try {
    const MAX_LEVELS = 4;

    async function buildTree(userId, currentLevel) {
      if (currentLevel > MAX_LEVELS) return [];

      const children = await User.find({ referredBy: userId }).select(
        "fullName referralCode walletBalance totalRoi createdAt",
      );

      return Promise.all(
        children.map(async (child) => ({
          _id: child._id,
          fullName: child.fullName,
          referralCode: child.referralCode,
          totalRoi: child.totalRoi,
          level: currentLevel,
          joinedAt: child.createdAt,
          children: await buildTree(child._id, currentLevel + 1),
        })),
      );
    }

    const tree = await buildTree(req.user._id, 1);

    // Flatten for count summary
    function countNodes(nodes) {
      return nodes.reduce(
        (acc, n) => acc + 1 + countNodes(n.children),
        0,
      );
    }

    res.json({
      success: true,
      tree,
      totalDownline: countNodes(tree),
    });
  } catch (err) {
    next(err);
  }
}
