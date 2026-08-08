import RoiHistory from "../models/RoiHistory.js";

// ─── GET /api/roi/history ──────────────────────────────────────────────────────
export async function getRoiHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const [records, total] = await Promise.all([
      RoiHistory.find({ user: req.user._id })
        .sort({ creditDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("investment", "plan amount"),
      RoiHistory.countDocuments({ user: req.user._id }),
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
