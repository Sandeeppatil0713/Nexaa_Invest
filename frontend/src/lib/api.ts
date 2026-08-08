/**
 * Lightweight API client for NexaInvest backend.
 *
 * Base URL is read from VITE_API_BASE_URL (default: http://localhost:5000).
 * The JWT token is stored in localStorage under "nexa_token".
 * All requests include credentials (cookie) as well.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000";

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const TOKEN_KEY = "nexa_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, signal } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    signal,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new ApiError("Server returned an invalid response", res.status);
  }

  if (!res.ok) {
    throw new ApiError(
      (data.message as string) ?? "Request failed",
      res.status,
      data.errors as { field: string; message: string }[] | undefined,
    );
  }

  return data as T;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export type User = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  referralCode: string;
  walletBalance: number;
  totalRoi: number;
  levelIncome: number;
  role: string;
  emailVerified: boolean;
};

type AuthResponse = { success: true; token: string; user: User };

export async function apiRegister(payload: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string;
}): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  setToken(res.token);
  return res;
}

export async function apiLogin(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
  setToken(res.token);
  return res;
}

export async function apiLogout() {
  await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  clearToken();
}

export async function apiMe(): Promise<{ success: true; user: User }> {
  return apiFetch("/api/auth/me");
}

// ─── Dashboard data ────────────────────────────────────────────────────────────
export async function apiGetProfile() {
  return apiFetch<{ success: true; user: User & { downlineCount: number } }>("/api/user/profile");
}

export async function apiGetWallet() {
  return apiFetch<{
    success: true;
    wallet: { balance: number; totalRoi: number; levelIncome: number };
    transactions: unknown[];
  }>("/api/user/wallet");
}

export async function apiGetInvestments() {
  return apiFetch<{ success: true; investments: unknown[] }>("/api/investments");
}

export async function apiCreateInvestment(payload: { plan: string; amount: number }) {
  return apiFetch<{ success: true; investment: unknown }>("/api/investments", {
    method: "POST",
    body: payload,
  });
}

export async function apiGetRoiHistory(page = 1) {
  return apiFetch<{ success: true; records: unknown[]; pagination: unknown }>(
    `/api/roi/history?page=${page}`,
  );
}

export async function apiGetReferralIncome(page = 1) {
  return apiFetch<{ success: true; records: unknown[]; pagination: unknown }>(
    `/api/referral/income?page=${page}`,
  );
}

export async function apiGetReferralTree() {
  return apiFetch<{ success: true; tree: unknown[]; totalDownline: number }>(
    "/api/referral/tree",
  );
}

export async function apiGetTransactions(page = 1) {
  return apiFetch<{ success: true; transactions: unknown[]; pagination: unknown }>(
    `/api/transactions?page=${page}`,
  );
}

export async function apiWithdraw(amount: number) {
  return apiFetch<{ success: true; message: string; transaction: unknown }>(
    "/api/user/withdraw",
    { method: "POST", body: { amount } },
  );
}

// ─── Email verification ────────────────────────────────────────────────────────
export async function apiSendOtp() {
  return apiFetch<{ success: true; message: string }>("/api/auth/send-otp", {
    method: "POST",
  });
}

export async function apiVerifyOtp(otp: string) {
  return apiFetch<{ success: true; message: string }>("/api/auth/verify-otp", {
    method: "POST",
    body: { otp },
  });
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
export async function apiSubscribe(email: string) {
  return apiFetch<{ success: true; message: string }>("/api/subscribe", {
    method: "POST",
    body: { email },
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export type GrowthPoint = { month: string; investment: number; wallet: number; referral: number };
export type RoiPoint    = { day: string; date: string; roi: number };

export async function apiGetAnalytics() {
  return apiFetch<{ success: true; growthData: GrowthPoint[]; roiTrend: RoiPoint[] }>(
    "/api/analytics",
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export async function apiRunRoi() {
  return apiFetch<{ success: true; message: string; credited: number; skipped: number }>(
    "/api/admin/run-roi?force=true",
    { method: "POST" },
  );
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export type RazorpayOrderResponse = {
  success: true;
  orderId: string;
  amount: number;      // paise
  currency: string;
  keyId: string;
  user: { name: string; email: string };
};

export async function apiCreateOrder(payload: { plan: string; amount: number }) {
  return apiFetch<RazorpayOrderResponse>("/api/payments/create-order", {
    method: "POST",
    body: payload,
  });
}

export async function apiVerifyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: string;
  amount: number;
}) {
  return apiFetch<{ success: true; investment: unknown }>("/api/payments/verify", {
    method: "POST",
    body: payload,
  });
}
