import {
  ShieldCheck,
  Briefcase,
  CalendarClock,
  Network,
  Wallet,
  History,
  BarChart3,
  GitBranch,
  MonitorSmartphone,
  Zap,
  Database,
  Timer,
} from "lucide-react";
import {
  Counter,
  GlassCard,
  SectionHeading,
  StaggerGrid,
  StaggerItem,
} from "@/components/site/motion-primitives";

const stats = [
  { value: 50, suffix: "K+", label: "Active Investors", prefix: "" },
  { value: 120, suffix: "M+", label: "Investments", prefix: "₹" },
  { value: 25, suffix: "M+", label: "ROI Distributed", prefix: "₹" },
  { value: 150, suffix: "+", label: "Countries", prefix: "" },
];

export function Stats() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-14">
      <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4 md:p-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-semibold md:text-4xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs tracking-wide text-muted-foreground uppercase md:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: ShieldCheck, title: "Secure JWT Authentication", desc: "Stateless token auth with hashed passwords and protected routes." },
  { icon: Briefcase, title: "Investment Management", desc: "Create, track and mature investments across multiple plan tiers." },
  { icon: CalendarClock, title: "Daily Automated ROI", desc: "A midnight scheduler credits ROI to every active investment." },
  { icon: Network, title: "Referral Network", desc: "Unique referral codes with multi-level income distribution." },
  { icon: Wallet, title: "Wallet Management", desc: "Real-time balance, credits, debits and payout requests." },
  { icon: History, title: "ROI History", desc: "Every payout stored with date, amount and investment reference." },
  { icon: BarChart3, title: "Investment Analytics", desc: "Growth, ROI trend and earnings charts powered by Recharts." },
  { icon: GitBranch, title: "Referral Tree", desc: "Visualise your downline up to 4 levels with live earnings." },
  { icon: MonitorSmartphone, title: "Responsive Dashboard", desc: "Pixel-perfect from 360px mobile to ultrawide desktop." },
  { icon: Zap, title: "Fast API", desc: "Lean REST endpoints with centralized error handling." },
  { icon: Database, title: "MongoDB Database", desc: "Indexed Mongoose models with strict schema validation." },
  { icon: Timer, title: "Cron Job Automation", desc: "Idempotent jobs that never double-credit a single day." },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="Features"
        title={
          <>
            Everything you need to run an{" "}
            <span className="text-gradient">investment network</span>
          </>
        }
        subtitle="Production-grade building blocks across authentication, investments, automation and analytics."
      />

      <StaggerGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <GlassCard className="group h-full">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary/70 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
