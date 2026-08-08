import { sendEmail } from "../config/mailer.js";
import {
  welcomeTemplate,
  emailVerificationTemplate,
  paymentConfirmationTemplate,
  subscribeConfirmTemplate,
} from "./templates.js";

// ─── 1. Welcome email (on registration) ──────────────────────────────────────
export async function sendWelcomeEmail(user) {
  await sendEmail({
    to:      user.email,
    name:    user.fullName,
    subject: `Welcome to NexaInvest, ${user.fullName.split(" ")[0]}! 🎉`,
    html:    welcomeTemplate({
      fullName:     user.fullName,
      referralCode: user.referralCode,
      email:        user.email,
    }),
  });
}

// ─── 2. Email verification OTP ────────────────────────────────────────────────
export async function sendVerificationEmail(user, otp) {
  await sendEmail({
    to:      user.email,
    name:    user.fullName,
    subject: `${otp} is your NexaInvest verification code`,
    html:    emailVerificationTemplate({
      fullName: user.fullName,
      otp,
    }),
  });
}

// ─── 3. Payment / investment confirmation ─────────────────────────────────────
export async function sendPaymentConfirmationEmail(user, investment) {
  await sendEmail({
    to:      user.email,
    name:    user.fullName,
    subject: `✅ Investment of ₹${Number(investment.amount).toLocaleString("en-IN")} Confirmed — NexaInvest`,
    html:    paymentConfirmationTemplate({
      fullName:     user.fullName,
      plan:         investment.plan,
      amount:       investment.amount,
      dailyRoi:     investment.dailyRoiPercent,
      startDate:    investment.startDate,
      endDate:      investment.endDate,
      paymentId:    investment.razorpayPaymentId ?? "N/A",
      referralCode: user.referralCode,
    }),
  });
}

// ─── 4. Newsletter subscription confirmation ──────────────────────────────────
export async function sendSubscribeConfirmEmail(email) {
  await sendEmail({
    to:      email,
    name:    email,
    subject: "You're subscribed to NexaInvest updates 📬",
    html:    subscribeConfirmTemplate({ email }),
  });
}
