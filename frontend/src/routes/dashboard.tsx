import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Wallet,
  TrendingUp,
  Users,
  PiggyBank,
  LayoutDashboard,
  Briefcase,
  GitBranch,
  History,
  Settings,
  User,
  Bell,
  Copy,
  LogOut,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Mail,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Logo } from "@/components/site/navbar";
import { StatCard, Panel, DataTable, StatusPill, ReferralTree } from "@/components/dashboard/pieces";
import {
  InvestmentGrowthChart,
  RoiTrendChart,
  WalletGrowthChart,
  ReferralEarningsChart,
} from "@/components/dashboard/charts";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/site/motion-primitives";
import {
  apiGetProfile,
  apiGetInvestments,
  apiGetRoiHistory,
  apiGetReferralIncome,
  apiGetTransactions,
  apiGetReferralTree,
  apiSendOtp,
  apiVerifyOtp,
  ApiError,
  apiRunRoi,
  apiGetAnalytics,
  type GrowthPoint,
  type RoiPoint,
} from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NexaInvest Portfolio & ROI Analytics" },
      {
        name: "description",
        content:
          "Track wallet balance, active investments, daily ROI, level income, referral tree and transaction history in one place.",
      },
    ],
  }),
  component: Dashboard,
});

// ─── Nav tabs ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Overview",      icon: LayoutDashboard },
  { label: "Investments",   icon: Briefcase       },
  { label: "Wallet",        icon: Wallet          },
  { label: "Referral Tree", icon: GitBranch       },
  { label: "ROI History",   icon: History         },
  { label: "Profile",       icon: User            },
  { label: "Settings",      icon: Settings        },
] as const;

type NavLabel = (typeof NAV_ITEMS)[number]["label"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name?: string) {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

// ─── Email verification banner + OTP modal ────────────────────────────────────
function EmailVerificationBanner({ onVerified }: { onVerified: () => void }) {
  const [step, setStep]         = useState<"banner" | "enter-otp">("banner");
  const [otp, setOtp]           = useState("");
  const [sending, setSending]   = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleSendOtp() {
    setSending(true);
    try {
      const res = await apiSendOtp();
      toast.success(res.message);
      setStep("enter-otp");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send OTP");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setVerifying(true);
    try {
      const res = await apiVerifyOtp(otp);
      toast.success(res.message);
      onVerified();
      setDismissed(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="glass relative rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      {step === "banner" ? (
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
            <Mail className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Verify your email address</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get investment confirmations and ROI alerts delivered to your inbox.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending}
            className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-60"
          >
            {sending ? <Loader2 className="size-3.5 animate-spin" /> : <Mail className="size-3.5" />}
            {sending ? "Sending…" : "Send verification code"}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
            <ShieldCheck className="size-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Enter the 6-digit code sent to your email</p>
            <p className="text-xs text-muted-foreground mt-0.5">Check your Mailtrap inbox · expires in 10 min</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-28 rounded-xl border border-input bg-secondary/30 px-3 py-2 text-center font-mono text-sm tracking-widest outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || otp.length !== 6}
              className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-60"
            >
              {verifying ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-3.5" />}
              {verifying ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("banner"); setOtp(""); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Resend
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-secondary/40 ${className ?? ""}`} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function Dashboard() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState<NavLabel>("Overview");

  // ── Queries ─────────────────────────────────────────────────────────────────
  const profileQ = useQuery({
    queryKey: ["profile"],
    queryFn: apiGetProfile,
    enabled: !!user,
  });

  const investQ = useQuery({
    queryKey: ["investments"],
    queryFn: apiGetInvestments,
    enabled: activeNav === "Investments" || activeNav === "Overview",
  });

  const roiQ = useQuery({
    queryKey: ["roi-history"],
    queryFn: () => apiGetRoiHistory(1),
    enabled: activeNav === "ROI History" || activeNav === "Overview",
  });

  const referralIncomeQ = useQuery({
    queryKey: ["referral-income"],
    queryFn: () => apiGetReferralIncome(1),
    enabled: activeNav === "Referral Tree" || activeNav === "Overview",
  });

  const txnQ = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiGetTransactions(1),
    enabled: activeNav === "Wallet" || activeNav === "Overview",
  });

  const treeQ = useQuery({
    queryKey: ["referral-tree"],
    queryFn: apiGetReferralTree,
    enabled: activeNav === "Referral Tree",
  });

  const analyticsQ = useQuery({
    queryKey: ["analytics"],
    queryFn:  apiGetAnalytics,
    enabled:  activeNav === "Overview",
  });

  // ── Derived chart data ──────────────────────────────────────────────────────
  const growthData  = (analyticsQ.data?.growthData  ?? []) as GrowthPoint[];
  const roiTrend    = (analyticsQ.data?.roiTrend    ?? []) as RoiPoint[];

  // ── Derived values ─────────────────────────────────────────────────────────
  const profile      = profileQ.data?.user;
  const displayUser  = profile ?? user;
  const walletBal    = profile?.walletBalance   ?? 0;
  const totalRoi     = profile?.totalRoi        ?? 0;
  const levelIncome  = profile?.levelIncome     ?? 0;
  const downline     = (profile as (typeof profile & { downlineCount?: number }) | null)?.downlineCount ?? 0;

  type InvestmentRecord = {
    _id: string;
    plan: string;
    amount: number;
    dailyRoiPercent: number;
    startDate: string;
    endDate: string;
    status: string;
    totalRoiCredited: number;
  };

  const investments = (investQ.data?.investments ?? []) as InvestmentRecord[];
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const activeCount   = investments.filter((i) => i.status === "active").length;

  type RoiRecord = {
    _id: string;
    amount: number;
    creditDate: string;
    status: string;
    investment: { plan: string; amount: number } | string;
  };
  const roiRecords = (roiQ.data?.records ?? []) as RoiRecord[];

  type ReferralRecord = {
    _id: string;
    level: number;
    amount: number;
    createdAt: string;
    fromUser: { fullName: string };
    investment: { plan: string };
  };
  const referralRecords = (referralIncomeQ.data?.records ?? []) as ReferralRecord[];

  type TxnRecord = {
    _id: string;
    ref: string;
    type: string;
    amount: number;
    createdAt: string;
    status: string;
  };
  const txnRecords = (txnQ.data?.transactions ?? []) as TxnRecord[];

  // ── Logout ──────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  }

  // ── Copy referral code ──────────────────────────────────────────────────────
  function copyCode() {
    const code = displayUser?.referralCode ?? "";
    navigator.clipboard.writeText(code).then(() => toast.success("Referral code copied!"));
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed -top-32 left-1/4 size-[32rem] rounded-full bg-primary/12 blur-[160px]" />
      <div className="pointer-events-none fixed right-0 bottom-0 size-[26rem] rounded-full bg-accent/10 blur-[160px]" />

      <div className="relative mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <div className="px-2 py-2">
            <Logo />
          </div>
          <nav className="mt-6 flex-1 space-y-1">
            {NAV_ITEMS.map((n) => (
              <button
                key={n.label}
                type="button"
                onClick={() => setActiveNav(n.label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  activeNav === n.label
                    ? "bg-primary/15 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </button>
            ))}
          </nav>

          <div className="space-y-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              <LogOut className="size-4" />
              Logout
            </button>
            <Link
              to="/"
              className="block rounded-xl border border-border px-3 py-2.5 text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to website
            </Link>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1 space-y-4">
          {/* Header */}
          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5">
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              {profileQ.isLoading ? (
                <Skeleton className="mt-1 h-7 w-40" />
              ) : (
                <h1 className="font-display text-2xl font-semibold">
                  {displayUser?.fullName ?? "—"}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              {displayUser?.referralCode && (
                <button
                  type="button"
                  onClick={copyCode}
                  className="hidden items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 transition-colors hover:border-primary/40 sm:flex"
                  title="Copy referral code"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {displayUser.referralCode}
                  </span>
                  <Copy className="size-3.5 text-muted-foreground" />
                </button>
              )}
              <button
                type="button"
                aria-label="Notifications"
                className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="size-4" />
              </button>
              <span className="bg-brand grid size-10 place-items-center rounded-xl text-sm font-semibold text-primary-foreground">
                {displayUser ? initials(displayUser.fullName) : "?"}
              </span>
            </div>
          </div>

          {/* Email verification banner — shown when email is not verified */}
          {profile && !(profile as typeof profile & { emailVerified?: boolean }).emailVerified && (
            <EmailVerificationBanner onVerified={() => void profileQ.refetch()} />
          )}

          {/* ── Overview tab ─────────────────────────────────────────────── */}
          {activeNav === "Overview" && (
            <>
              {/* Stat cards */}
              <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StaggerItem>
                  <StatCard
                    label="Wallet Balance"
                    value={profileQ.isLoading ? "…" : fmt(walletBal)}
                    delta={profileQ.isLoading ? "" : "+live"}
                    icon={<Wallet className="size-4.5" />}
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total Investment"
                    value={investQ.isLoading ? "…" : fmt(totalInvested)}
                    delta={`${activeCount} active`}
                    icon={<PiggyBank className="size-4.5" />}
                    tone="accent"
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Total ROI Earned"
                    value={profileQ.isLoading ? "…" : fmt(totalRoi)}
                    delta="auto daily"
                    icon={<TrendingUp className="size-4.5" />}
                    tone="success"
                  />
                </StaggerItem>
                <StaggerItem>
                  <StatCard
                    label="Level Income"
                    value={profileQ.isLoading ? "…" : fmt(levelIncome)}
                    delta={`${downline} downline`}
                    icon={<Users className="size-4.5" />}
                    tone="accent"
                  />
                </StaggerItem>
              </StaggerGrid>

              {/* Charts */}
              <Reveal className="grid gap-4 lg:grid-cols-2">
                <Panel title="Investment Growth" subtitle="Portfolio trend">
                  <InvestmentGrowthChart data={growthData} />
                </Panel>
                <Panel title="ROI Trend" subtitle="Last 7 days">
                  <RoiTrendChart data={roiTrend} />
                </Panel>
              </Reveal>

              <Reveal className="grid gap-4 lg:grid-cols-2">
                <Panel title="Wallet Growth" subtitle="Monthly ROI credited">
                  <WalletGrowthChart data={growthData} />
                </Panel>
                <Panel title="Referral Earnings" subtitle="Monthly">
                  <ReferralEarningsChart data={growthData} />
                </Panel>
              </Reveal>

              {/* Recent investments */}
              <Reveal>
                <Panel title="Recent Investments" subtitle="Latest plans">
                  {investQ.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                    </div>
                  ) : investments.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No investments yet.{" "}
                      <button
                        type="button"
                        onClick={() => setActiveNav("Investments")}
                        className="text-foreground hover:text-primary"
                      >
                        Start investing
                      </button>
                    </p>
                  ) : (
                    <DataTable
                      columns={["Plan", "Amount", "Daily ROI", "End Date", "Status"]}
                      rows={investments.slice(0, 5).map((i) => [
                        i.plan,
                        fmt(i.amount),
                        `${i.dailyRoiPercent}%`,
                        formatDate(i.endDate),
                        <StatusPill key={i._id} status={i.status.charAt(0).toUpperCase() + i.status.slice(1)} />,
                      ])}
                    />
                  )}
                </Panel>
              </Reveal>

              {/* Recent transactions */}
              <Reveal>
                <Panel title="Recent Transactions" subtitle="Last 30 days">
                  {txnQ.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                    </div>
                  ) : txnRecords.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <DataTable
                      columns={["Reference", "Type", "Amount", "Date", "Status"]}
                      rows={txnRecords.slice(0, 6).map((t) => [
                        t.ref,
                        t.type.replace("_", " "),
                        (t.amount >= 0 ? "+" : "") + fmt(t.amount),
                        formatDate(t.createdAt),
                        <StatusPill key={t._id} status={t.status.charAt(0).toUpperCase() + t.status.slice(1)} />,
                      ])}
                    />
                  )}
                </Panel>
              </Reveal>
            </>
          )}

          {/* ── Investments tab ──────────────────────────────────────────── */}
          {activeNav === "Investments" && (
            <Reveal>
              <Panel
                title="All Investments"
                subtitle={`${activeCount} active · ${investments.length} total`}
              >
                {investQ.isLoading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
                  </div>
                ) : investments.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No investments yet. Head to the landing page to choose a plan.
                  </p>
                ) : (
                  <DataTable
                    columns={["Plan", "Amount", "Daily ROI", "ROI Earned", "Start", "End", "Status"]}
                    rows={investments.map((i) => [
                      i.plan,
                      fmt(i.amount),
                      `${i.dailyRoiPercent}%`,
                      fmt(i.totalRoiCredited),
                      formatDate(i.startDate),
                      formatDate(i.endDate),
                      <StatusPill key={i._id} status={i.status.charAt(0).toUpperCase() + i.status.slice(1)} />,
                    ])}
                  />
                )}
              </Panel>
            </Reveal>
          )}

          {/* ── Wallet tab ───────────────────────────────────────────────── */}
          {activeNav === "Wallet" && (
            <>
              <StaggerGrid className="grid gap-4 sm:grid-cols-3">
                <StaggerItem>
                  <StatCard label="Wallet Balance" value={fmt(walletBal)} delta="available" icon={<Wallet className="size-4.5" />} />
                </StaggerItem>
                <StaggerItem>
                  <StatCard label="Total ROI" value={fmt(totalRoi)} delta="all time" icon={<TrendingUp className="size-4.5" />} tone="success" />
                </StaggerItem>
                <StaggerItem>
                  <StatCard label="Level Income" value={fmt(levelIncome)} delta="all time" icon={<Users className="size-4.5" />} tone="accent" />
                </StaggerItem>
              </StaggerGrid>

              <Reveal>
                <Panel title="Transaction History" subtitle="All time">
                  {txnQ.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                    </div>
                  ) : txnRecords.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No transactions yet.</p>
                  ) : (
                    <DataTable
                      columns={["Reference", "Type", "Amount", "Date", "Status"]}
                      rows={txnRecords.map((t) => [
                        t.ref,
                        t.type.replace(/_/g, " "),
                        (t.amount >= 0 ? "+" : "") + fmt(t.amount),
                        formatDate(t.createdAt),
                        <StatusPill key={t._id} status={t.status.charAt(0).toUpperCase() + t.status.slice(1)} />,
                      ])}
                    />
                  )}
                </Panel>
              </Reveal>
            </>
          )}

          {/* ── ROI History tab ──────────────────────────────────────────── */}
          {activeNav === "ROI History" && (
            <Reveal>
              <Panel title="ROI History" subtitle="All daily credits">
                {roiQ.isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                  </div>
                ) : roiRecords.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No ROI credited yet. ROI runs daily at midnight.
                  </p>
                ) : (
                  <DataTable
                    columns={["Date", "Plan", "Amount", "Status"]}
                    rows={roiRecords.map((r) => [
                      formatDate(r.creditDate),
                      typeof r.investment === "object" ? r.investment.plan : "—",
                      fmt(r.amount),
                      <StatusPill key={r._id} status="Credited" />,
                    ])}
                  />
                )}
              </Panel>
            </Reveal>
          )}

          {/* ── Referral Tree tab ────────────────────────────────────────── */}
          {activeNav === "Referral Tree" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Reveal>
                <Panel title="Your Downline Tree" subtitle="Up to 4 levels">
                  {treeQ.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                    </div>
                  ) : (
                    <ReferralTree
                      tree={treeQ.data?.tree}
                      totalDownline={treeQ.data?.totalDownline}
                      referralCode={displayUser?.referralCode}
                      userName={displayUser?.fullName}
                    />
                  )}
                </Panel>
              </Reveal>

              <Reveal>
                <Panel title="Referral Income" subtitle="By level">
                  {referralIncomeQ.isLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                    </div>
                  ) : referralRecords.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      No referral income yet. Share your code to start earning.
                    </p>
                  ) : (
                    <DataTable
                      columns={["From", "Level", "Amount", "Date"]}
                      rows={referralRecords.map((r) => [
                        r.fromUser?.fullName ?? "—",
                        `Level ${r.level}`,
                        fmt(r.amount),
                        formatDate(r.createdAt),
                      ])}
                    />
                  )}
                </Panel>
              </Reveal>
            </div>
          )}

          {/* ── Profile tab ─────────────────────────────────────────────── */}
          {activeNav === "Profile" && (
            <Reveal>
              <Panel title="Your Profile">
                {profileQ.isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10" />)}
                  </div>
                ) : displayUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-brand grid size-16 place-items-center rounded-2xl text-2xl font-bold text-primary-foreground">
                        {initials(displayUser.fullName)}
                      </span>
                      <div>
                        <p className="text-lg font-semibold">{displayUser.fullName}</p>
                        <p className="text-sm text-muted-foreground">{displayUser.email}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-border bg-secondary/20 p-4 sm:grid-cols-2">
                      {[
                        { label: "Email",        value: displayUser.email },
                        { label: "Mobile",       value: (displayUser as typeof displayUser & { mobile?: string }).mobile ?? "—" },
                        { label: "Referral Code", value: displayUser.referralCode },
                        { label: "Wallet Balance", value: fmt(walletBal) },
                        { label: "Total ROI",    value: fmt(totalRoi) },
                        { label: "Level Income", value: fmt(levelIncome) },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="mt-0.5 text-sm font-medium">{value}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={copyCode}
                      className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm transition-colors hover:border-primary/40"
                    >
                      <Copy className="size-4 text-muted-foreground" />
                      Copy referral code
                    </button>
                  </div>
                ) : null}
              </Panel>
            </Reveal>
          )}

          {/* ── Settings tab ────────────────────────────────────────────── */}
          {activeNav === "Settings" && (
            <Reveal>
              <Panel title="Settings">
                <div className="space-y-6">

                  {/* Dev tools */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Developer Tools
                    </p>
                    <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">Run Daily ROI Now</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Manually trigger the midnight ROI job for all active investments.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const r = await apiRunRoi();
                              toast.success(r.message);
                              void profileQ.refetch();
                              void investQ.refetch();
                            } catch (err) {
                              toast.error(err instanceof ApiError ? err.message : "Failed to run ROI");
                            }
                          }}
                          className="flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/25 transition-colors"
                        >
                          <TrendingUp className="size-4" />
                          Run ROI Job
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account
                    </p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/20"
                    >
                      <LogOut className="size-4" />
                      Logout of this account
                    </button>
                  </div>
                </div>
              </Panel>
            </Reveal>
          )}

          {/* ── Refresh button (mobile) ──────────────────────────────────── */}
          <div className="flex justify-center pb-4 lg:hidden">
            <button
              type="button"
              onClick={() => {
                void profileQ.refetch();
                toast.info("Refreshing data…");
              }}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground"
            >
              <RefreshCw className="size-3.5" /> Refresh
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
