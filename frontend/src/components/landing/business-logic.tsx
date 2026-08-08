import { motion } from "motion/react";
import {
  Clock,
  Search,
  Calculator,
  Wallet,
  Save,
  Share2,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import {
  SectionHeading,
  StaggerGrid,
  StaggerItem,
  GlassCard,
} from "@/components/site/motion-primitives";

const steps = [
  { icon: Clock, title: "Runs at 12:00 AM", desc: "node-cron triggers the daily ROI job in UTC-aware scheduling." },
  { icon: Search, title: "Finds Active Investments", desc: "Indexed query on status = active and endDate >= today." },
  { icon: Calculator, title: "Calculates ROI", desc: "amount × dailyRoi ÷ 100 computed per investment document." },
  { icon: Wallet, title: "Updates Wallet", desc: "Atomic $inc on walletBalance and totalRoi fields." },
  { icon: Save, title: "Stores ROI History", desc: "One immutable record per investment, per day." },
  { icon: Share2, title: "Distributes Referral Income", desc: "Traverses upline levels and credits eligible users." },
  { icon: ShieldAlert, title: "Prevents Duplicate Credits", desc: "Unique compound index on (investment, date) keeps it idempotent." },
];

export function BusinessLogic() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="Automation"
        title={
          <>
            The <span className="text-gradient">daily scheduler</span>, step by step
          </>
        }
        subtitle="A deterministic, idempotent workflow that runs unattended every night."
      />

      <StaggerGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <StaggerItem key={s.title} className="relative">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/70 text-primary">
                  <s.icon className="size-4.5" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </GlassCard>
            {i < steps.length - 1 ? (
              <motion.span
                animate={{ x: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                className="absolute top-1/2 -right-3 hidden -translate-y-1/2 text-primary lg:block"
              >
                <ChevronRight className="size-5" />
              </motion.span>
            ) : null}
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
