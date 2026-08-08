import "dotenv/config";

const BASE = "http://localhost:5000";

// Try all known test accounts
const accounts = [
  { email: "rocksandeep0713@gmail.com", passwords: ["Sandeep@1234", "password123", "123456789", "sandeep123"] },
  { email: "sandeepspatil987@gmail.com", passwords: ["password123", "Sandeep@1234"] },
  { email: "finaltest@nexainvest.com",   passwords: ["password123"] },
];

let token = null;
let foundEmail = null;

for (const acc of accounts) {
  for (const pwd of acc.passwords) {
    const r = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: acc.email, password: pwd }),
    });
    const d = await r.json();
    if (d.success) {
      token = d.token;
      foundEmail = acc.email;
      console.log(`✅ Login OK: ${acc.email} (password: ${pwd})`);
      console.log(`   wallet: ₹${d.user.walletBalance} | roi: ₹${d.user.totalRoi}`);
      break;
    }
  }
  if (token) break;
}

if (!token) {
  console.log("❌ Could not login with any known account. Please register a new one.");
  process.exit(1);
}

// Test analytics
const ar = await fetch(`${BASE}/api/analytics`, {
  headers: { Authorization: `Bearer ${token}` },
});
const ad = await ar.json();
console.log("\n=== Analytics ===");
console.log("growthData:", JSON.stringify(ad.growthData, null, 2));
console.log("roiTrend:",   JSON.stringify(ad.roiTrend,   null, 2));
