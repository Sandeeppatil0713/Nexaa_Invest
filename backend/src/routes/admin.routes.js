import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { runDailyRoi } from "../jobs/roiCron.js";

const router = Router();

/**
 * POST /api/admin/run-roi
 * Manually trigger the daily ROI job.
 * Requires admin role — set role:"admin" on your user in MongoDB to use this.
 *
 * For dev convenience, also accepts ?force=true to bypass the admin check.
 */
router.post("/run-roi", protect, async (req, res, next) => {
  try {
    const isDev   = process.env.NODE_ENV !== "production";
    const isAdmin = req.user?.role === "admin";
    const force   = req.query.force === "true" && isDev;

    if (!isAdmin && !force) {
      return res.status(403).json({ success: false, message: "Admin access required. Add ?force=true in development." });
    }

    console.log(`🔧  Manual ROI trigger by ${req.user.email}`);
    const result = await runDailyRoi();

    res.json({
      success: true,
      message: `ROI job complete — credited: ${result.credited}, skipped: ${result.skipped}`,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
