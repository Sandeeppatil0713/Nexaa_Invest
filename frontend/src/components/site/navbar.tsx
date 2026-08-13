import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Hexagon, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { label: "Home",         href: "/#home"         },
  { label: "Features",     href: "/#features"     },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Plans",        href: "/#plans"        },
  { label: "FAQ",          href: "/#faq"          },
  { label: "Contact",      href: "/#contact"      },
];

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="bg-brand relative grid size-9 place-items-center rounded-xl shadow-[0_0_28px_-6px_rgba(59,130,246,0.8)]">
        <Hexagon className="size-4.5 text-primary-foreground" strokeWidth={2.4} />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Nexa<span className="text-gradient">Invest</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  }

  const initials =
    user?.fullName && typeof user.fullName === "string"
      ? user.fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")
      : "U";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500",
          scrolled ? "glass" : "border border-transparent",
        )}
      >
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop right — auth-aware */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-secondary/40" />
          ) : isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                Logout
              </button>
              <span className="bg-brand grid size-9 place-items-center rounded-xl text-xs font-bold text-primary-foreground">
                {initials}
              </span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_36px_-8px_rgba(59,130,246,0.9)]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-xl border border-border md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}

              <div className="mt-3 border-t border-border pt-3">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-brand grid size-8 place-items-center rounded-lg text-xs font-bold text-primary-foreground">
                        {initials}
                      </span>
                      <span className="text-sm font-medium">{user?.fullName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground"
                    >
                      <LogOut className="size-3.5" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-border py-2.5 text-center text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="bg-brand rounded-xl py-2.5 text-center text-sm font-semibold text-primary-foreground"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
