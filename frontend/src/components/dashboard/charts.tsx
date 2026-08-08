import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GrowthPoint, RoiPoint } from "@/lib/api";

const axisProps = {
  stroke: "oklch(0.68 0.015 258)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.11 0.008 260)",
    border: "1px solid oklch(1 0 0 / 12%)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "oklch(0.97 0.005 250)",
  },
  labelStyle: { color: "oklch(0.68 0.015 258)" },
  cursor: { stroke: "oklch(1 0 0 / 12%)" },
};

const fmt = (v: number) =>
  v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`;

export function InvestmentGrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: -18, right: 6, top: 8 }}>
        <defs>
          <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={fmt} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Investment"]} />
        <Area
          type="monotone"
          dataKey="investment"
          stroke="oklch(0.62 0.19 258)"
          strokeWidth={2}
          fill="url(#gradInvest)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RoiTrendChart({ data }: { data: RoiPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ left: -18, right: 6, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={fmt} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Daily ROI"]} />
        <Line
          type="monotone"
          dataKey="roi"
          stroke="oklch(0.74 0.17 55)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "oklch(0.74 0.17 55)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WalletGrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: -18, right: 6, top: 8 }}>
        <defs>
          <linearGradient id="gradWallet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={fmt} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Wallet"]} />
        <Area
          type="monotone"
          dataKey="wallet"
          stroke="oklch(0.72 0.17 155)"
          strokeWidth={2}
          fill="url(#gradWallet)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ReferralEarningsChart({ data }: { data: GrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ left: -18, right: 6, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={fmt} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Referral"]} />
        <Bar dataKey="referral" fill="oklch(0.74 0.17 55)" radius={[6, 6, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
