import { Link } from "@tanstack/react-router";
import { ArrowRight, Wallet, TrendingUp, Users, PiggyBank } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/motion-primitives";
import { StatCard, Panel } from "@/components/dashboard/pieces";
import { InvestmentGrowthChart, RoiTrendChart } from "@/components/dashboard/charts";

export function DashboardPreview() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute -left-20 top-1/3 size-[30rem] rounded-full bg-primary/12 blur-[150px]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Dashboard"
          title={
            <>
              Your entire portfolio, <span className="text-gradient">one screen</span>
            </>
          }
          subtitle="Wallet, investments, ROI, level income, charts, histories and referral tree."
        />

        <Reveal className="mt-14">
          <div className="glass rounded-3xl p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Wallet Balance" value="₹1,24,800" delta="+1.8%" icon={<Wallet className="size-4.5" />} />
              <StatCard label="Total Investment" value="₹6,20,000" delta="3 active" icon={<PiggyBank className="size-4.5" />} tone="accent" />
              <StatCard label="Total ROI Earned" value="₹96,480" delta="+₹9,750 today" icon={<TrendingUp className="size-4.5" />} tone="success" />
              <StatCard label="Level Income" value="₹48,600" delta="496 downline" icon={<Users className="size-4.5" />} tone="accent" />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Panel title="Investment Growth" subtitle="Last 8 months">
                <InvestmentGrowthChart />
              </Panel>
              <Panel title="ROI Trend" subtitle="Last 7 days">
                <RoiTrendChart />
              </Panel>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8 text-center" delay={0.1}>
          <Link
            to="/dashboard"
            className="bg-brand group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.9)]"
          >
            Explore the full dashboard
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
