import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta: string;
  icon: ReactNode;
  tone?: "primary" | "accent" | "success";
}) {
  return (
    <div className="glass gradient-border rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            tone === "primary" && "bg-primary/15 text-primary",
            tone === "accent"  && "bg-accent/15 text-accent",
            tone === "success" && "bg-success/15 text-success",
          )}
        >
          {icon}
        </span>
        <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] text-success">
          {delta}
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle ? <span className="text-xs text-muted-foreground">{subtitle}</span> : null}
      </div>
      {children}
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────
export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th key={c} className="pb-3 text-xs font-medium text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30"
            >
              {r.map((cell, j) => (
                <td
                  key={j}
                  className="py-3 text-muted-foreground first:font-medium first:text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── StatusPill ───────────────────────────────────────────────────────────────
export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Active" || status === "Success" || status === "Credited"
      ? "bg-success/15 text-success"
      : status === "Processed"
        ? "bg-primary/15 text-primary"
        : "bg-secondary text-muted-foreground";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", tone)}>
      {status}
    </span>
  );
}

// ─── ReferralTree ─────────────────────────────────────────────────────────────
type LiveTreeNode = {
  _id: string;
  fullName: string;
  referralCode?: string;
  totalRoi?: number;
  level: number;
  children: LiveTreeNode[];
};

function LiveTreeBranch({ node }: { node: LiveTreeNode }) {
  return (
    <li className="relative pl-6">
      <span className="absolute top-0 left-0 h-full w-px bg-border" />
      <span className="absolute top-5 left-0 h-px w-4 bg-border" />
      <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 transition-colors hover:border-primary/40">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg",
            node.level === 1 ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
          )}
        >
          <Users className="size-3.5" />
        </span>
        <div>
          <p className="text-sm font-medium">{node.fullName}</p>
          <p className="text-[11px] text-muted-foreground">
            Level {node.level}
            {node.totalRoi !== undefined && node.totalRoi > 0
              ? ` · ₹${node.totalRoi.toLocaleString("en-IN")} ROI`
              : ""}
          </p>
        </div>
      </div>
      {node.children.length > 0 && (
        <ul className="mt-2 space-y-2">
          {node.children.map((c) => (
            <LiveTreeBranch key={c._id} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ReferralTree({
  tree,
  totalDownline,
  referralCode,
  userName,
}: {
  tree?: unknown[];
  totalDownline?: number;
  referralCode?: string;
  userName?: string;
}) {
  const nodes = (tree ?? []) as LiveTreeNode[];

  return (
    <div>
      {/* Root — the logged-in user */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5">
        <span className="bg-brand grid size-8 place-items-center rounded-lg text-primary-foreground">
          <Users className="size-3.5" />
        </span>
        <div>
          <p className="text-sm font-medium">{userName ?? "You"}</p>
          {referralCode && (
            <p className="text-[11px] text-muted-foreground">
              Referral code · {referralCode}
            </p>
          )}
        </div>
        {totalDownline !== undefined && totalDownline > 0 && (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {totalDownline} downline
          </span>
        )}
      </div>

      {nodes.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No referrals yet. Share your code to grow your network.
        </p>
      ) : (
        <ul className="space-y-2">
          {nodes.map((n) => (
            <LiveTreeBranch key={n._id} node={n} />
          ))}
        </ul>
      )}
    </div>
  );
}
