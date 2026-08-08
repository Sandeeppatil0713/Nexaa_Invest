import Subscriber from "../models/Subscriber.js";
import { sendSubscribeConfirmEmail } from "../emails/emailService.js";

// ─── POST /api/subscribe ──────────────────────────────────────────────────────
export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        sendSubscribeConfirmEmail(email);
        return res.json({ success: true, message: "Welcome back! You've been re-subscribed." });
      }
      return res.json({ success: true, message: "You're already subscribed!" });
    }

    await Subscriber.create({ email });
    sendSubscribeConfirmEmail(email).catch((err) =>
      console.error("Subscribe email failed:", err?.message),
    );

    res.status(201).json({ success: true, message: "Subscribed successfully! Check your inbox." });
  } catch (err) {
    next(err);
  }
}
