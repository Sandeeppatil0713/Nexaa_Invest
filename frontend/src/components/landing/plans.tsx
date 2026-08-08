"use client";

import { useState } from "react";
import { Check, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  SectionHeading,
  StaggerGrid,
  StaggerItem,
} from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useRazorpay } from "@/hooks/use-razorpay";
import { useQueryClient } from "@tanstack/react-query";

const plans = [
  {
    name:     "Starter"      as const,
    amount:   "₹5,000",
    minAmt:   5000,
    range:    "₹5,000 – ₹49,999",
    roi:      "1.0%",
    duration: "90 days",
    returns:  "₹9,500",
    features: [
      "Daily ROI credited at 12:00 AM",
      "Level 1 referral income (5%)",
      "Wallet + ROI history",
      "Email support",
    ],
    featured: false,
  },
  {
    name:     "Professional" as const,
    amount:   "₹50,000",
    minAmt:   50000,
    range:    "₹50,000 – ₹4,99,999",
    roi:      "1.5%",
    duration: "120 days",
    returns:  "₹1,40,000",
    features: [
      "Everything in Starter",
      "Level 1–3 referral income (5/3/2%)",
      "Advanced analytics & charts",
      "Priority support",
    ],
    featured: true,
  },
  {
    name:     "Enterprise"   as const,
    amount:   "₹5,00,000",
    minAmt:   500000,
    range:    "₹5,00,000+",
    roi:      "1.8%",
    duration: "180 days",
    returns:  "₹21,20,000",
    features: [
      "Everything in Professional",
      "Level 1–4 referral income (5/3/2/1%)",
      "Dedicated relationship manager",
      "Custom payout schedule",
    ],
    featured: false,
  },
];

export function Plans() {
  const navigate      = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient   = useQueryClient();
  const [loading, setLoading] = useState<string | null>(null);

  const { openCheckout } = useRazorpay({
    onSuccess: (investment) => {
      setLoading(null);
      toast.success("Investment activated! Daily ROI starts tonight at midnight.");
      // Invalidate dashboard queries so data refreshes
      void queryClient.invalidateQueries({ queryKey: ["investments"] });
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate({ to: "/dashboard" });
    },
    onError: (message) => {
      setLoading(null);
      if (message !== "Payment cancelled") toast.error(message);
    },
  });

  async function handleInvest(plan: (typeof plans)[number]) {
    if (!isAuthenticated) {
      toast.info("Please login or register first");
      navigate({ to: "/register" });
      return;
    }
    setLoading(plan.name);
    await openCheckout(plan.name, plan.minAmt);
  }

  return (
    <section id="plans" className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="Investment Plans"
        title={
          <>
            Pick a plan, earn <span className="text-gradient">every single day</span>
          </>
        }
        subtitle="Transparent ROI, fixed durations and predictable expected returns."
      />

      <StaggerGrid className="mt-14 grid gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <StaggerItem key={p.name}>
            <div
              className={cn(
                "glass gradient-border relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5",
                p.featured && "glow-primary border-primary/40",
              )}
            >
              {p.featured && (
                <span className="bg-brand absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  <Sparkles className="size-3" /> Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.range}</p>

              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-4xl font-semibold">{p.amount}</span>
                <span className="pb-1.5 text-xs text-muted-foreground">min. investment</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-secondary/30 p-3 text-center">
                <div>
                  <p className="text-sm font-semibold text-accent">{p.roi}</p>
                  <p className="text-[11px] text-muted-foreground">Daily ROI</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.duration}</p>
                  <p className="text-[11px] text-muted-foreground">Duration</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-success">{p.returns}</p>
                  <p className="text-[11px] text-muted-foreground">Expected</p>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={loading === p.name}
                onClick={() => handleInvest(p)}
                className={cn(
                  "group mt-7 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60",
                  p.featured
                    ? "bg-brand text-primary-foreground"
                    : "border border-border bg-secondary/50 text-foreground hover:border-primary/50",
                )}
              >
                {loading === p.name ? (
                  <><Loader2 className="size-4 animate-spin" /> Processing…</>
                ) : (
                  <>Invest Now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      {/* Test mode notice */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        🔒 Payments powered by Razorpay · Test mode active · UPI ID{" "}
        <span className="font-mono">success@razorpay</span> is pre-filled — just click Pay
      </p>
    </section>
  );
}
