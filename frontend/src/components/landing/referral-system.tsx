import { motion } from "motion/react";
import { ArrowDown, Users } from "lucide-react";
import { Reveal, SectionHeading, GlassCard } from "@/components/site/motion-primitives";

const levels = [
  { label: "You", desc: "Direct investor", rate: "—", count: "1", tone: "brand" },
  { label: "Level 1", desc: "Direct referrals", rate: "5%", count: "12 partners", tone: "primary" },
  { label: "Level 2", desc: "Referrals of referrals", rate: "3%", count: "48 partners", tone: "primary" },
  { label: "Level 3", desc: "Third generation", rate: "2%", count: "126 partners", tone: "accent" },
  { label: "Level 4", desc: "Fourth generation", rate: "1%", count: "310 partners", tone: "accent" },
];

export function ReferralSystem() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute right-0 top-1/4 size-[30rem] rounded-full bg-primary/12 blur-[150px]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Referral System"
          title={
            <>
              Income flows <span className="text-gradient">upward</span> through your network
            </>
          }
          subtitle="Every investment made by your downline generates level income for eligible upline users."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            {levels.map((l, i) => (
              <Reveal key={l.label} delay={i * 0.08}>
                <div className="flex flex-col items-center">
                  <div
                    className={`glass gradient-border flex w-full items-center justify-between rounded-2xl p-4 transition-transform duration-300 hover:scale-[1.02] ${
                      i === 0 ? "glow-primary border-primary/40" : ""
                    }`}
                    style={{ width: `${100 - i * 5}%` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-9 place-items-center rounded-xl ${
                          l.tone === "brand"
                            ? "bg-brand text-primary-foreground"
                            : l.tone === "primary"
                              ? "bg-primary/15 text-primary"
                              : "bg-accent/15 text-accent"
                        }`}
                      >
                        <Users className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{l.label}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-accent">{l.rate}</p>
                      <p className="text-[11px] text-muted-foreground">{l.count}</p>
                    </div>
                  </div>

                  {i < levels.length - 1 ? (
                    <motion.span
                      animate={{ y: [0, 5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="my-1 text-muted-foreground"
                    >
                      <ArrowDown className="size-4" />
                    </motion.span>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="space-y-4">
            <GlassCard>
              <h3 className="text-lg font-semibold">How level income is credited</h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  "A downline user creates a new investment.",
                  "The service traverses the referral hierarchy upward.",
                  "Each eligible upline receives a percentage by level.",
                  "Wallet balance and level income totals are updated.",
                  "A referral income record is stored for full auditability.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-secondary/70 text-xs font-semibold text-foreground">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
              <GlassCard>
                <p className="text-xs text-muted-foreground">Network Earnings</p>
                <p className="font-display mt-1 text-2xl font-semibold text-gradient">₹48,600</p>
              </GlassCard>
              <GlassCard>
                <p className="text-xs text-muted-foreground">Total Downline</p>
                <p className="font-display mt-1 text-2xl font-semibold">496</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
