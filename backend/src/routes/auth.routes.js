import { Router } from "express";
import { body } from "express-validator";
import { register, login, logout, getMe, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { runValidators } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  runValidators(
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("mobile")
      .trim().notEmpty().withMessage("Mobile number is required")
      .matches(/^\+?[\d\s\-]{7,15}$/).withMessage("Invalid mobile number"),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("referralCode").optional().trim(),
  ),
  register,
);

router.post(
  "/login",
  runValidators(
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ),
  login,
);

router.post("/logout", logout);
router.get("/me", protect, getMe);

// ─── Email verification (requires login) ─────────────────────────────────────
router.post("/send-otp", protect, sendOtp);
router.post(
  "/verify-otp",
  protect,
  runValidators(body("otp").trim().notEmpty().withMessage("OTP is required")),
  verifyOtp,
);

export default router;
