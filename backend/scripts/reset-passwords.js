/**
 * Reset passwords for test accounts so we can verify analytics.
 * Run once: node scripts/reset-passwords.js
 * New password for all: Test@12345
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

await mongoose.connect(process.env.MONGO_URI);
const User = (await import("../src/models/User.js")).default;

const NEW_PASSWORD = "Test@12345";
const salt = await bcrypt.genSalt(12);
const hashed = await bcrypt.hash(NEW_PASSWORD, salt);

const emails = ["rocksandeep0713@gmail.com", "sandeepspatil987@gmail.com"];
for (const email of emails) {
  const r = await User.updateOne({ email }, { $set: { password: hashed } });
  console.log(`${email}: ${r.modifiedCount ? "✅ password reset" : "⚠️  not found"}`);
}

console.log(`\nNew password for all accounts: ${NEW_PASSWORD}`);
await mongoose.disconnect();
