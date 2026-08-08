import Razorpay from "razorpay";

/**
 * Singleton Razorpay instance.
 * Reads credentials from env at startup so they're validated early.
 */
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
