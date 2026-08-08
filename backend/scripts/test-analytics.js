import "dotenv/config";
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGO_URI);

const User       = (await import("../src/models/User.js")).default;
const Investment = (await import("../src/models/Investment.js")).default;
const RoiHistory = (await import("../src/models/RoiHistory.js")).default;

// Find users with ROI
const users = await User.find({ totalRoi: { $gt: 0 } }).select("email walletBalance totalRoi levelIncome");
console.log("=== Users with ROI ===");
for (const u of users) {
  console.log(`  ${u.email} | wallet: ₹${u.walletBalance} | roi: ₹${u.totalRoi}`);
}

// Test analytics aggregation for first user with ROI
if (users.length > 0) {
  const uid = users[0]._id;
  console.log(`\n=== Analytics for ${users[0].email} ===`);

  const investByMonth = await Investment.aggregate([
    { $match: { user: uid } },
    { $group: { _id: { year: { $year: "$startDate" }, month: { $month: "$startDate" } }, total: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  console.log("Investment by month:", JSON.stringify(investByMonth));

  const roiByDay = await RoiHistory.aggregate([
    { $match: { user: uid } },
    { $group: { _id: "$creditDate", total: { $sum: "$amount" } } },
    { $sort: { _id: -1 } },
    { $limit: 7 },
  ]);
  console.log("ROI last 7 days:", JSON.stringify(roiByDay));

  const roiByMonth = await RoiHistory.aggregate([
    { $match: { user: uid } },
    { $group: { _id: { year: { $year: "$creditDate" }, month: { $month: "$creditDate" } }, total: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  console.log("ROI by month:", JSON.stringify(roiByMonth));
}

await mongoose.disconnect();
