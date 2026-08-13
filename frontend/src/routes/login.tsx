import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell, Field } from "@/components/site/auth-shell";
import { apiLogin, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — NexaInvest" },
      {
        name: "description",
        content: "Sign in securely to your NexaInvest account and access your investment dashboard.",
      },
      { property: "og:title", content: "Login — NexaInvest" },
      { property: "og:description", content: "Secure JWT sign-in to your investment dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate     = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user } = await apiLogin({ email, password });
      await refreshUser();
      const firstName = user?.fullName && typeof user.fullName === "string" ? user.fullName.trim().split(" ")[0] : "User";
      toast.success(`Welcome back, ${firstName}!`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your dashboard.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Field
          icon={<Mail className="size-4" />}
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Field
          icon={<Lock className="size-4" />}
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="text-foreground hover:text-primary">
          Create an account
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
