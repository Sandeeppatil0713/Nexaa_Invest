import { useCallback } from "react";
import { apiCreateOrder, apiVerifyPayment } from "@/lib/api";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

/** Lazily load the Razorpay checkout script */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type UseRazorpayOptions = {
  onSuccess: (investment: unknown) => void;
  onError:   (message: string)    => void;
};

/**
 * Returns an `openCheckout(plan, amount)` function that:
 * 1. Calls backend to create a Razorpay order
 * 2. Opens the Razorpay checkout modal
 * 3. On payment success, verifies the signature server-side
 * 4. Calls onSuccess with the activated investment, or onError on failure
 */
export function useRazorpay({ onSuccess, onError }: UseRazorpayOptions) {
  const openCheckout = useCallback(
    async (plan: string, amount: number) => {
      // Load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        onError("Failed to load payment gateway. Check your connection and try again.");
        return;
      }

      let orderData;
      try {
        orderData = await apiCreateOrder({ plan, amount });
      } catch (err) {
        onError(err instanceof Error ? err.message : "Could not create payment order");
        return;
      }

      const options = {
        key:         orderData.keyId,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        "NexaInvest",
        description: `${plan} Investment Plan`,
        order_id:    orderData.orderId,
        prefill: {
          name:  orderData.user.name,
          email: orderData.user.email,
          vpa:   "success@razorpay",   // pre-fill UPI ID
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => onError("Payment cancelled"),
        },
        handler: async (response: {
          razorpay_order_id:   string;
          razorpay_payment_id: string;
          razorpay_signature:  string;
        }) => {
          try {
            const result = await apiVerifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan,
              amount,
            });
            onSuccess(result.investment);
          } catch (err) {
            onError(
              err instanceof Error
                ? err.message
                : "Payment verification failed. Contact support with your payment ID: " +
                  response.razorpay_payment_id,
            );
          }
        },
      };

      const rz = new window.Razorpay(options);
      rz.on("payment.failed", (resp: { error: { description: string } }) => {
        onError(resp.error.description ?? "Payment failed");
      });
      rz.open();
    },
    [onSuccess, onError],
  );

  return { openCheckout };
}
