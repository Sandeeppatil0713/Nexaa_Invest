import { Star, Quote } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import {
  SectionHeading,
  StaggerGrid,
  StaggerItem,
  GlassCard,
} from "@/components/site/motion-primitives";

const reviews = [
  {
    name: "Ananya Rao",
    role: "Professional plan · 14 months",
    text: "The daily ROI credit is like clockwork — I can see the exact payout at midnight and the history never has a gap. The dashboard is genuinely the best I've used.",
  },
  {
    name: "Marcus Feld",
    role: "Enterprise plan · 2 years",
    text: "Referral tree visualisation made my network transparent for the first time. I know exactly which level each rupee came from.",
  },
  {
    name: "Priya Nair",
    role: "Starter plan · 8 months",
    text: "Started small to test it out. Withdrawals were smooth, wallet always matched the ROI history down to the paisa.",
  },
  {
    name: "David Okoye",
    role: "Professional plan · 11 months",
    text: "Clean interface, no hidden fees, and the analytics charts help me time top-ups. Support replied within the hour.",
  },
  {
    name: "Sofia Marino",
    role: "Enterprise plan · 3 years",
    text: "Managing a 400-person downline used to be a spreadsheet nightmare. Now it's four clicks.",
  },
  {
    name: "Rahul Mehta",
    role: "Professional plan · 6 months",
    text: "What sold me was the transparency — every credit is auditable and duplicates simply never happen.",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="Testimonials"
        title={
          <>
            Trusted by <span className="text-gradient">50,000+ investors</span>
          </>
        }
        subtitle="Real feedback from people compounding daily with NexaInvest."
      />

      <StaggerGrid className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <StaggerItem key={r.name}>
            <GlassCard className="flex h-full flex-col">
              <Quote className="size-6 text-primary/50" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="bg-brand grid size-10 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}

const faqs = [
  {
    q: "How does ROI work?",
    a: "Each plan defines a fixed daily ROI percentage. Every night at 12:00 AM a scheduler finds all active investments, multiplies the invested amount by the daily rate, credits your wallet and writes an immutable ROI history record.",
  },
  {
    q: "How are referrals calculated?",
    a: "When someone in your downline invests, the system walks the referral hierarchy upward and credits eligible upline users: 5% at level 1, 3% at level 2, 2% at level 3 and 1% at level 4, depending on your plan tier.",
  },
  {
    q: "Is my wallet secure?",
    a: "Wallet updates run as atomic database operations alongside their history records, so balances can never drift. Passwords are bcrypt-hashed and every private route is protected by JWT auth middleware.",
  },
  {
    q: "How often is ROI credited?",
    a: "Once per day, at midnight, for as long as an investment stays Active. A unique index on the (investment, date) pair guarantees a day can never be credited twice.",
  },
  {
    q: "Can I track my earnings?",
    a: "Yes. The dashboard shows wallet balance, total investment, total ROI, level income, growth charts, and complete tables for investment history, ROI history, referral income and your referral tree.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="FAQ"
        title={
          <>
            Questions, <span className="text-gradient">answered</span>
          </>
        }
      />

      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <div
            key={f.q}
            className="glass gradient-border overflow-hidden rounded-2xl transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold md:text-base">{f.q}</span>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  open === i ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === i ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
