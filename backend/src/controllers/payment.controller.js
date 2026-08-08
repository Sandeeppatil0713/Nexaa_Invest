import crypto from "crypto";
import razorpay from "../utils/razorpay.js";
import Investment, { PLANS, REFERRAL_RATES } from "../models/Investment.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import ReferralIncome from "../models/ReferralIncome.js";
import { AppError } from "../utils/AppError.js";
import { sendPaymentConfirmationEmail } from "../emails/emailService.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/create-order
// ─────────────────────────────────────────────────────────────────────────────
export async function createOrder(req, res, next) {
  try {
    const { plan: planName, amount } = req.body;
    const investAmount = Number(amount);

    const plan = PLANS[planName];
    if (!plan) return next(new AppError("Invalid plan selected", 400));

    if (investAmount < plan.minAmount) {
      return next(new AppError(
        `Minimum investment for ${planName} is ₹${plan.minAmount.toLocaleString("en-IN")}`, 400,
      ));
    }
    if (plan.maxAmount !== Infinity && investAmount > plan.maxAmount) {
      return next(new AppError(
        `Maximum investment for ${planName} is ₹${plan.maxAmount.toLocaleString("en-IN")}`, 400,
      ));
    }

    let order;
    try {
      order = await razorpay.orders.create({
        amount:   investAmount * 100,   // paise
        currency: "INR",
        receipt:  `nx_${req.user._id.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
        notes: {
          userId: req.user._id.toString(),
          plan:   planName,
          amount: investAmount.toString(),
        },
      });
    } catch (rzpErr) {
      const detail = rzpErr?.error?.description ?? rzpErr?.message ?? JSON.stringify(rzpErr);
      console.error("[Razorpay createOrder]", JSON.stringify(rzpErr, null, 2));
      return next(new AppError(`Payment gateway error: ${detail}`, 502));
    }

    res.status(201).json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      user:     { name: req.user.fullName, email: req.user.email },
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/verify
// Verifies Razorpay HMAC signature then activates the investment.
// Uses sequential writes — no transactions (M0 Atlas doesn't support them).
// Idempotency: duplicate order IDs are detected before any write.
// ─────────────────────────────────────────────────────────────────────────────
export async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan: planName,
      amount,
    } = req.body;

    // 1 ── Verify HMAC signature ──────────────────────────────────────────────
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return next(new AppError("Payment verification failed — invalid signature", 400));
    }

    // 2 ── Idempotency guard ──────────────────────────────────────────────────
    const existing = await Investment.findOne({ razorpayOrderId: razorpay_order_id });
    if (existing) {
      return res.json({ success: true, investment: existing, alreadyProcessed: true });
    }

    // 3 ── Validate plan ──────────────────────────────────────────────────────
    const investAmount = Number(amount);
    const plan = PLANS[planName];
    if (!plan) return next(new AppError("Invalid plan", 400));

    // 4 ── Create investment ──────────────────────────────────────────────────
    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const investment = await Investment.create({
      user:              req.user._id,
      plan:              planName,
      amount:            investAmount,
      dailyRoiPercent:   plan.dailyRoiPercent,
      durationDays:      plan.durationDays,
      startDate,
      endDate,
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // 5 ── Record debit transaction ───────────────────────────────────────────
    await Transaction.create({
      user:       req.user._id,
      type:       "investment",
      amount:     -investAmount,
      status:     "success",
      relatedDoc: investment._id,
      note:       `${planName} plan — ${razorpay_payment_id}`,
    });

    // 6 ── Distribute referral income upline ──────────────────────────────────
    await distributeReferralIncome(req.user._id, investment, investAmount, plan);

    // 7 ── Send payment confirmation email (fire-and-forget) ──────────────────
    sendPaymentConfirmationEmail(req.user, investment).catch((err) =>
      console.error("Payment confirmation email failed:", err?.message),
    );

    res.status(201).json({ success: true, investment });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// ─────────────────────────────────────────────────────────────────────────────
export async function handleWebhook(req, res) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const sig      = req.headers["x-razorpay-signature"];
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (sig !== expected) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }
    }

    const event = req.body;
    if (event.event === "payment.captured") {
      const orderId = event.payload?.payment?.entity?.order_id;
      const already = orderId ? await Investment.findOne({ razorpayOrderId: orderId }) : null;
      if (!already) {
        console.warn(`⚠️  Webhook: no investment for order ${orderId} — manual review needed`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ received: false });
  }
}

// ─── Helper: walk upline up to 4 levels and credit referral commissions ───────
async function distributeReferralIncome(userId, investment, investAmount, plan) {
  let currentUserId = userId;

  for (let level = 1; level <= plan.referralLevels; level++) {
    const current = await User.findById(currentUserId).select("referredBy");
    if (!current?.referredBy) break;

    const uplineId   = current.referredBy;
    const rate       = REFERRAL_RATES[level - 1];
    const commission = parseFloat((investAmount * rate).toFixed(2));

    await User.findByIdAndUpdate(uplineId, {
      $inc: { walletBalance: commission, levelIncome: commission },
    });

    const refIncome = await ReferralIncome.create({
      recipient:  uplineId,
      fromUser:   userId,
      investment: investment._id,
      level,
      amount:     commission,
    });

    await Transaction.create({
      user:       uplineId,
      type:       "referral_income",
      amount:     commission,
      status:     "success",
      relatedDoc: refIncome._id,
      note:       `Level ${level} referral income`,
    });

    currentUserId = uplineId;
  }
}
