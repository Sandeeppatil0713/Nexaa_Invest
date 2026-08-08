import { motion } from "motion/react";
import { Check, UserPlus, LogIn, Briefcase, CalendarClock, Users, LineChart } from "lucide-react";
import { Reveal, SectionHeading, GlassCard } from "@/components/site/motion-primitives";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    points: [
      "Create an account using email, mobile number and password.",
      "Generate your own referral code.",
      "Optionally register using another user's referral code.",
    ],
  },
  {
    icon: LogIn,
    title: "Login",
    points: ["Authenticate securely using JWT.", "Access your private dashboard."],
  },
  {
    icon: Briefcase,
    title: "Invest",
    points: [
      "Choose an investment plan.",
      "Enter your investment amount.",
      "Investment becomes Active immediately.",
    ],
  },
  {
    icon: CalendarClock,
    title: "Earn Daily ROI",
    points: [
      "Every day at midnight a scheduler calculates ROI.",
      "Wallet gets updated automatically.",
      "ROI history is stored for every credit.",
    ],
  },
  {
    icon: Users,
    title: "Referral Earnings",
    points: [
      "Invite friends using your referral code.",
      "When referrals invest, level income is generated.",
      "Eligible upline users are credited instantly.",
    ],
  },
  {
    icon: LineChart,
    title: "Track Everything",
    points: [
      "Wallet, investments, daily ROI and referral income.",
      "Investment history, ROI history and referral tree.",
      "Beautiful charts for every metric.",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute top-1/3 -left-32 size-[28rem] rounded-full bg-accent/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              From signup to <span className="text-gradient">daily payouts</span>
            </>
          }
          subtitle="Six steps that describe the complete lifecycle of a NexaInvest account."
        />

        <div className="relative mt-16">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 left-[19px] w-px origin-top bg-gradient-to-b from-primary via-primary/40 to-accent md:left-1/2"
          />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div
                  className={`relative flex gap-6 md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden flex-1 md:block" />

                  <span className="bg-brand relative z-10 mt-1 grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_rgba(59,130,246,0.9)] md:mt-0">
                    {i + 1}
                  </span>

                  <div className="flex-1">
                    <GlassCard className="group">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-secondary/70 text-accent transition-transform group-hover:scale-110">
                          <s.icon className="size-4.5" />
                        </span>
                        <h3 className="text-lg font-semibold">{s.title}</h3>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {s.points.map((p) => (
                          <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
