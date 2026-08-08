import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Twitter, Github, Linkedin, Send, Youtube, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./navbar";
import { apiSubscribe, ApiError } from "@/lib/api";

const groups = [
  {
    title: "Company",
    items: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Product",
    items: ["Features", "Pricing", "Dashboard", "Documentation"],
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms", "Support", "Security"],
  },
];

function SubscribeForm() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await apiSubscribe(email);
      toast.success(res.message);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-5 py-3.5">
        <CheckCircle2 className="size-5 shrink-0 text-success" />
        <div>
          <p className="text-sm font-medium text-foreground">You're subscribed!</p>
          <p className="text-xs text-muted-foreground">Check your inbox for a confirmation email.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        disabled={loading}
        className="h-12 flex-1 rounded-xl border border-input bg-secondary/40 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-brand inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>Subscribe <Send className="size-4" /></>
        )}
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-semibold md:text-3xl">
                Get product updates & market insights
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Join 30,000+ investors. No spam, unsubscribe anytime.
              </p>
            </div>
            <SubscribeForm />
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              NexaInvest is an investment & referral platform delivering automated daily
              ROI, transparent wallets and multi-level network earnings.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold">{g.title}</h4>
              <ul className="mt-4 space-y-3">
                {g.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NexaInvest. All rights reserved.</p>
          <p>
            Investments are subject to market risk. ·{" "}
            <Link to="/dashboard" className="hover:text-foreground">
              Open dashboard
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
