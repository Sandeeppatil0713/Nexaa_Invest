import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Counter } from "@/components/site/motion-primitives";

function FloatingLights() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]" />
      <div className="animate-float-slow absolute -top-32 -left-24 size-[34rem] rounded-full bg-primary/25 blur-[150px]" />
      <div
        className="animate-float-slow absolute -right-24 top-24 size-[30rem] rounded-full bg-accent/20 blur-[150px]"
        style={{ animationDelay: "-6s" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      {[...Array(18)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-1 rounded-full bg-primary/70"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 6 + (i % 5),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function MockCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  delta: string;
  tone: "primary" | "accent";
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span
          className={`grid size-8 place-items-center rounded-lg ${
            tone === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
          }`}
        >
          <Icon className="size-4" />
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-3 font-display text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-success">{delta}</p>
    </div>
  );
}

export function Hero() {
  const bars = [38, 52, 44, 68, 58, 82, 74, 96];

  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <FloatingLights />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-accent" />
            Automated daily ROI · Level income up to 4 levels
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl leading-[1.05] font-semibold sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Invest Smarter.
            <br />
            <span className="text-gradient">Earn Daily.</span>
            <br />
            Grow Together.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            A secure investment platform where users can invest in plans, earn daily ROI,
            build referral networks, and track everything from a beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/register"
              className="bg-brand group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.9)]"
            >
              Get Started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-transform duration-300 hover:scale-105"
            >
              <LayoutDashboard className="size-4" />
              View Dashboard
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative [perspective:1400px]"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="glass rounded-3xl p-5 shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Portfolio</p>
                <p className="font-display text-3xl font-semibold">
                  ₹<Counter value={842350} />
                </p>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                +18.4% MTD
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MockCard icon={Wallet} label="Wallet" value="₹1,24,800" delta="+₹2,140 today" tone="primary" />
              <MockCard icon={TrendingUp} label="Daily ROI" value="₹2,140" delta="1.8% / day" tone="accent" />
              <MockCard icon={Users} label="Referral Income" value="₹48,600" delta="+12 partners" tone="primary" />
              <MockCard icon={Sparkles} label="Active Plans" value="3 Plans" delta="Enterprise tier" tone="accent" />
            </div>

            <div className="glass mt-3 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Investment Growth</span>
                <span>Last 8 months</span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary/25 to-primary"
                    style={{
                      backgroundImage:
                        i > 5
                          ? "linear-gradient(to top, oklch(0.74 0.17 55 / 0.3), oklch(0.74 0.17 55))"
                          : "linear-gradient(to top, oklch(0.62 0.19 258 / 0.25), oklch(0.62 0.19 258))",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass absolute -bottom-8 -left-4 hidden rounded-2xl p-4 sm:block"
          >
            <p className="text-xs text-muted-foreground">ROI credited</p>
            <p className="font-display text-lg font-semibold text-success">+ ₹2,140.00</p>
            <p className="text-[11px] text-muted-foreground">Today · 12:00 AM cron</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
