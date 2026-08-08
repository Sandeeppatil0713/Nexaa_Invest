import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type User, apiMe, apiLogout, clearToken, getToken } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────
type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" };

type AuthContextValue = {
  authState: AuthState;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Call after a successful login/register to load the user */
  refreshUser: () => Promise<void>;
  /** Logs out, clears token, sets state to unauthenticated */
  logout: () => Promise<void>;
};

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setAuthState({ status: "unauthenticated" });
      return;
    }
    try {
      const { user } = await apiMe();
      setAuthState({ status: "authenticated", user });
    } catch {
      clearToken();
      setAuthState({ status: "unauthenticated" });
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAuthState({ status: "unauthenticated" });
  }, []);

  // Bootstrap: check token on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: AuthContextValue = {
    authState,
    user: authState.status === "authenticated" ? authState.user : null,
    isAuthenticated: authState.status === "authenticated",
    isLoading: authState.status === "loading",
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
