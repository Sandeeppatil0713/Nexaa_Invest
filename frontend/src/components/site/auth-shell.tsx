import type { ReactNode, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Logo } from "./navbar";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-16">
      <div className="grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_70%)]" />
      <div className="animate-float-slow pointer-events-none absolute -top-24 -left-20 size-[30rem] rounded-full bg-primary/20 blur-[150px]" />
      <div
        className="animate-float-slow pointer-events-none absolute -right-20 bottom-0 size-[26rem] rounded-full bg-accent/15 blur-[150px]"
        style={{ animationDelay: "-5s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative w-full max-w-md rounded-3xl p-8"
      >
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}

export function Field({
  icon,
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  required,
  autoComplete,
  error,
}: {
  icon: ReactNode;
  label: string;
  type: string;
  placeholder: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const isControlled = value !== undefined;

  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`mt-1.5 flex items-center gap-2 rounded-2xl border bg-secondary/30 px-4 transition-colors focus-within:border-primary ${
          error ? "border-destructive/60" : "border-input"
        }`}
      >
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required ?? false}
          autoComplete={autoComplete}
          {...(isControlled ? { value, onChange } : {})}
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </span>
      {error && (
        <span className="mt-1 block text-[11px] text-destructive">{error}</span>
      )}
    </label>
  );
}
