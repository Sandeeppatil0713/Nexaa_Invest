import { Router } from "express";
import { body } from "express-validator";
import {
  createOrder,
  verifyPayment,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { runValidators } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// ─── POST /api/payments/create-order ─────────────────────────────────────────
// Protected — user must be logged in to create an order
router.post(
  "/create-order",
  protect,
  runValidators(
    body("plan")
      .isIn(["Starter", "Professional", "Enterprise"])
      .withMessage("Plan must be Starter, Professional or Enterprise"),
    body("amount")
      .isNumeric().withMessage("Amount must be a number")
      .custom((v) => Number(v) > 0).withMessage("Amount must be positive"),
  ),
  createOrder,
);

// ─── POST /api/payments/verify ────────────────────────────────────────────────
// Protected — verifies Razorpay signature and activates the investment
router.post(
  "/verify",
  protect,
  runValidators(
    body("razorpay_order_id").notEmpty().withMessage("Order ID required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID required"),
    body("razorpay_signature").notEmpty().withMessage("Signature required"),
    body("plan")
      .isIn(["Starter", "Professional", "Enterprise"])
      .withMessage("Valid plan required"),
    body("amount")
      .isNumeric().withMessage("Amount must be a number"),
  ),
  verifyPayment,
);

// ─── POST /api/payments/webhook ───────────────────────────────────────────────
// Public — Razorpay calls this; signature validated inside the handler
router.post("/webhook", handleWebhook);

export default router;
