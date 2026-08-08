import {
  SectionHeading,
  StaggerGrid,
  StaggerItem,
  GlassCard,
} from "@/components/site/motion-primitives";

const apiGroups = [
  {
    title: "Authentication APIs",
    endpoints: [
      { method: "POST", path: "/api/auth/register", desc: "Create account + referral code" },
      { method: "POST", path: "/api/auth/login", desc: "Issue JWT access token" },
    ],
  },
  {
    title: "Investment APIs",
    endpoints: [
      { method: "POST", path: "/api/investment", desc: "Create a new investment" },
      { method: "GET", path: "/api/investments", desc: "List investments of user" },
    ],
  },
  {
    title: "Dashboard APIs",
    endpoints: [{ method: "GET", path: "/api/dashboard", desc: "Wallet, ROI & summary metrics" }],
  },
  {
    title: "Referral APIs",
    endpoints: [
      { method: "GET", path: "/api/referrals", desc: "Referral income records" },
      { method: "GET", path: "/api/referral-tree", desc: "Downline hierarchy up to L4" },
    ],
  },
];

const methodTone: Record<string, string> = {
  POST: "bg-accent/15 text-accent",
  GET: "bg-primary/15 text-primary",
};

export function ApiShowcase() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="API Architecture"
        title={
          <>
            A clean <span className="text-gradient">REST surface</span>
          </>
        }
        subtitle="Predictable resources, consistent responses and centralized error handling."
      />

      <StaggerGrid className="mt-14 grid gap-4 md:grid-cols-2">
        {apiGroups.map((g) => (
          <StaggerItem key={g.title}>
            <GlassCard className="h-full">
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <div className="mt-4 space-y-2">
                {g.endpoints.map((e) => (
                  <div
                    key={e.path}
                    className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 transition-colors hover:border-primary/40"
                  >
                    <span
                      className={`rounded-md px-2 py-1 font-mono text-[11px] font-semibold ${methodTone[e.method]}`}
                    >
                      {e.method}
                    </span>
                    <code className="font-mono text-xs text-foreground">{e.path}</code>
                    <span className="ml-auto hidden text-[11px] text-muted-foreground sm:block">
                      {e.desc}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <StaggerItem className="mt-4">
        <GlassCard hover={false}>
          <p className="text-xs text-muted-foreground">Sample response · GET /api/dashboard</p>
          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
            {`{
  "walletBalance": 124800,
  "totalInvestment": 620000,
  "totalRoi": 96480,
  "levelIncome": 48600,
  "activeInvestments": 3,
  "lastRoiCreditedAt": "2026-08-03T00:00:00.000Z"
}`}
          </pre>
        </GlassCard>
      </StaggerItem>
    </section>
  );
}

const collections = [
  {
    name: "Users",
    fields: [
      "fullName",
      "email (unique, indexed)",
      "mobile",
      "password (hashed)",
      "referralCode (unique)",
      "referredBy",
      "walletBalance",
      "totalRoi",
      "levelIncome",
      "status",
    ],
  },
  {
    name: "Investments",
    fields: ["user (ref)", "amount", "plan", "dailyRoi", "startDate", "endDate", "status"],
  },
  {
    name: "ROI History",
    fields: ["investment (ref)", "user (ref)", "amount", "date (indexed)", "status"],
  },
  {
    name: "Referral Income",
    fields: ["receiver (ref)", "generatedBy (ref)", "level", "amount", "date"],
  },
];

export function DatabaseArchitecture() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/4 top-0 size-[26rem] rounded-full bg-accent/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Database"
          title={
            <>
              Four collections, <span className="text-gradient">clear relationships</span>
            </>
          }
          subtitle="Indexed Mongoose models designed for reporting and idempotent automation."
        />

        <StaggerGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <StaggerItem key={c.name}>
              <GlassCard className="h-full">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-display text-sm font-semibold">{c.name}</h3>
                  <span className="font-mono text-[10px] text-muted-foreground">collection</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {c.fields.map((f) => (
                    <li key={f} className="font-mono text-[11px] text-muted-foreground">
                      · {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
