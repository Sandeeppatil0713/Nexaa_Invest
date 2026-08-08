import Investment from "../models/Investment.js";
import RoiHistory from "../models/RoiHistory.js";
import ReferralIncome from "../models/ReferralIncome.js";
import Transaction from "../models/Transaction.js";

// ─── GET /api/analytics ────────────────────────────────────────────────────────
// Returns all chart data for the logged-in user.
export async function getAnalytics(req, res, next) {
  try {
    const userId = req.user._id;
    const now    = new Date();

    // ── 1. Investment growth — cumulative amount invested per month (last 8) ──
    const investmentByMonth = await Investment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year:  { $year:  "$startDate" },
            month: { $month: "$startDate" },
          },
          totalInvested: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 },
    ]);

    // ── 2. ROI trend — daily ROI credits for last 7 days ─────────────────────
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const roiByDay = await RoiHistory.aggregate([
      {
        $match: {
          user:       userId,
          creditDate: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id:       "$creditDate",
          totalRoi:  { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── 3. Referral earnings per month (last 8) ───────────────────────────────
    const referralByMonth = await ReferralIncome.aggregate([
      { $match: { recipient: userId } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalReferral: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 },
    ]);

    // ── 4. Wallet growth — cumulative ROI credited per month ─────────────────
    const walletByMonth = await RoiHistory.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year:  { $year:  "$creditDate" },
            month: { $month: "$creditDate" },
          },
          totalRoi: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 },
    ]);

    // ── 5. Build unified month labels ─────────────────────────────────────────
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Collect all unique year-month keys
    const monthKeySet = new Set();
    [...investmentByMonth, ...walletByMonth, ...referralByMonth].forEach((r) => {
      monthKeySet.add(`${r._id.year}-${r._id.month}`);
    });

    // If no real data yet, build last 8 months as placeholders
    if (monthKeySet.size === 0) {
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        monthKeySet.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
      }
    }

    const sortedKeys = [...monthKeySet].sort((a, b) => {
      const [ay, am] = a.split("-").map(Number);
      const [by, bm] = b.split("-").map(Number);
      return ay !== by ? ay - by : am - bm;
    }).slice(-8); // keep last 8

    // Build lookup maps
    const invMap = Object.fromEntries(
      investmentByMonth.map((r) => [`${r._id.year}-${r._id.month}`, r.totalInvested]),
    );
    const walletMap = Object.fromEntries(
      walletByMonth.map((r) => [`${r._id.year}-${r._id.month}`, r.totalRoi]),
    );
    const refMap = Object.fromEntries(
      referralByMonth.map((r) => [`${r._id.year}-${r._id.month}`, r.totalReferral]),
    );

    // Build cumulative growth data
    let cumInvestment = 0;
    let cumWallet     = 0;
    let cumReferral   = 0;

    const growthData = sortedKeys.map((key) => {
      const [, month] = key.split("-").map(Number);
      cumInvestment += invMap[key]    ?? 0;
      cumWallet     += walletMap[key] ?? 0;
      cumReferral   += refMap[key]    ?? 0;
      return {
        month:      MONTHS[(month - 1) % 12],
        investment: cumInvestment,
        wallet:     cumWallet,
        referral:   cumReferral,
      };
    });

    // ── 6. Build 7-day ROI trend ──────────────────────────────────────────────
    const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const roiMap = Object.fromEntries(
      roiByDay.map((r) => [r._id.toISOString().slice(0, 10), r.totalRoi]),
    );

    const roiTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      roiTrend.push({
        day: DAYS[d.getDay()],
        date: key,
        roi: roiMap[key] ?? 0,
      });
    }

    res.json({ success: true, growthData, roiTrend });
  } catch (err) {
    next(err);
  }
}
