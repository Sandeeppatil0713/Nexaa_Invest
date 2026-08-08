import User from "../models/User.js";
import { sendToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { sendWelcomeEmail, sendVerificationEmail } from "../emails/emailService.js";

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export async function register(req, res, next) {
  try {
    const { fullName, email, mobile, password, referralCode } = req.body;

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
      if (!referrer) return next(new AppError("Invalid referral code", 400));
      referredBy = referrer._id;
    }

    const user = await User.create({ fullName, email, mobile, password, referredBy });

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(user).catch((err) =>
      console.error("Welcome email failed:", err?.message),
    );

    sendToken(res, user, 201);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's select:false in the schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Account has been deactivated", 403));
    }

    sendToken(res, user);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export function logout(_req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError("User not found", 404));
    res.json({ success: true, user: user.toPublic() });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// Generates a 6-digit OTP, stores hashed version, sends email
export async function sendOtp(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+emailOtp +emailOtpExpiry");
    if (!user) return next(new AppError("User not found", 404));
    if (user.emailVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    const otp    = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailOtp       = otp;
    user.emailOtpExpiry = expiry;
    await user.save();

    await sendVerificationEmail(user, otp);

    res.json({ success: true, message: `Verification code sent to ${user.email}` });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
export async function verifyOtp(req, res, next) {
  try {
    const { otp } = req.body;
    if (!otp) return next(new AppError("OTP is required", 400));

    const user = await User.findById(req.user._id).select("+emailOtp +emailOtpExpiry");
    if (!user) return next(new AppError("User not found", 404));

    if (user.emailVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }
    if (!user.emailOtp || !user.emailOtpExpiry) {
      return next(new AppError("No OTP found. Request a new one.", 400));
    }
    if (new Date() > user.emailOtpExpiry) {
      return next(new AppError("OTP has expired. Request a new one.", 400));
    }
    if (otp.trim() !== user.emailOtp) {
      return next(new AppError("Invalid OTP", 400));
    }

    user.emailVerified  = true;
    user.emailOtp       = null;
    user.emailOtpExpiry = null;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
}
