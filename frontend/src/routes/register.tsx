import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, Mail, Phone, User, Ticket, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, Field } from "@/components/site/auth-shell";
import { apiRegister, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — NexaInvest" },
      {
        name: "description",
        content:
          "Register with email and mobile, get your own referral code and start earning automated daily ROI.",
      },
      { property: "og:title", content: "Create your account — NexaInvest" },
      {
        property: "og:description",
        content: "Get your referral code and start earning daily ROI on NexaInvest.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate        = useNavigate();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    referralCode: "",
  });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const { user } = await apiRegister({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        ...(form.referralCode ? { referralCode: form.referralCode } : {}),
      });
      await refreshUser();
      const refCode = user?.referralCode ? ` Your referral code is ${user.referralCode}.` : "";
      toast.success(`Account created!${refCode}`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors?.length) {
          const byField: Record<string, string> = {};
          for (const fe of err.errors) byField[fe.field] = fe.message;
          setFieldErrors(byField);
        } else {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register in under a minute and get your referral code instantly."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Field
          icon={<User className="size-4" />}
          label="Full name"
          type="text"
          name="fullName"
          placeholder="Aarav Sharma"
          value={form.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
          error={fieldErrors["fullName"]}
        />
        <Field
          icon={<Mail className="size-4" />}
          label="Email"
          type="email"
          name="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          error={fieldErrors["email"]}
        />
        <Field
          icon={<Phone className="size-4" />}
          label="Mobile number"
          type="tel"
          name="mobile"
          placeholder="+91 98765 43210"
          value={form.mobile}
          onChange={handleChange}
          required
          autoComplete="tel"
          error={fieldErrors["mobile"]}
        />
        <Field
          icon={<Lock className="size-4" />}
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          error={fieldErrors["password"]}
        />
        <Field
          icon={<Ticket className="size-4" />}
          label="Referral code (optional)"
          type="text"
          name="referralCode"
          placeholder="NEXA-XXXXX"
          value={form.referralCode}
          onChange={handleChange}
          autoComplete="off"
          error={fieldErrors["referralCode"]}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="text-foreground hover:text-primary">
          Login
        </Link>
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to home
      </Link>
    </AuthShell>
  );
}
