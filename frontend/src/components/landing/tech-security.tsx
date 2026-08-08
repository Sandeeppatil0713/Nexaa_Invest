import {
  ShieldCheck,
  Lock,
  KeyRound,
  UserCog,
  FileCheck2,
  ServerCog,
  Gauge,
  Repeat2,
} from "lucide-react";
import {
  SectionHeading,
  StaggerGrid,
  StaggerItem,
  GlassCard,
} from "@/components/site/motion-primitives";

const stack = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "JWT",
  "Node Cron",
  "Tailwind CSS",
  "Framer Motion",
  "Mongoose",
];

export function TechStack() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Built with a modern stack
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-3">
            {[...stack, ...stack].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="glass rounded-2xl px-6 py-3 text-sm font-medium whitespace-nowrap text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const security = [
  { icon: KeyRound, title: "JWT Authentication", desc: "Signed access tokens with expiry and refresh strategy." },
  { icon: Lock, title: "Encrypted Passwords", desc: "bcrypt hashing with per-user salt rounds." },
  { icon: ShieldCheck, title: "Protected Routes", desc: "Auth middleware guards every private endpoint." },
  { icon: UserCog, title: "Role Based Authorization", desc: "User and admin scopes enforced server-side." },
  { icon: FileCheck2, title: "MongoDB Validation", desc: "Strict Mongoose schemas reject malformed payloads." },
  { icon: ServerCog, title: "Secure APIs", desc: "Rate limiting, CORS policy, helmet headers and sanitisation." },
  { icon: Gauge, title: "Optimized Queries", desc: "Compound indexes and lean projections on hot paths." },
  { icon: Repeat2, title: "Transaction Safety", desc: "Atomic updates keep wallets and history consistent." },
];

export function Security() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SectionHeading
        eyebrow="Security"
        title={
          <>
            Built <span className="text-gradient">secure by default</span>
          </>
        }
        subtitle="Money movement demands hard guarantees at every layer of the stack."
      />

      <StaggerGrid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {security.map((s) => (
          <StaggerItem key={s.title}>
            <GlassCard className="group h-full">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary/70 text-accent transition-transform duration-300 group-hover:scale-110">
                <s.icon className="size-4.5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
