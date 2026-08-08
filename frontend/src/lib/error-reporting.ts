/**
 * Error reporting utility for NexaInvest.
 *
 * In production, wire VITE_ERROR_REPORTING_ENDPOINT to your own error
 * collection backend (e.g. a /api/errors server function, Sentry DSN proxy,
 * or any HTTPS ingest). When the env var is absent the reporter only logs to
 * the console — zero external traffic.
 */

type ErrorSeverity = "error" | "warning" | "info";

type ErrorContext = Record<string, unknown>;

type ErrorPayload = {
  message: string;
  stack?: string;
  route: string;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: string;
  userAgent: string;
};

function buildPayload(
  error: unknown,
  context: ErrorContext,
  severity: ErrorSeverity,
): ErrorPayload {
  const message =
    error instanceof Response
      ? `HTTP ${error.status}${error.url ? ` — ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  const stack = error instanceof Error ? error.stack : undefined;

  return {
    message,
    ...(stack !== undefined && { stack }),
    route: typeof window !== "undefined" ? window.location.pathname : "server",
    severity,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
  };
}

function sendToEndpoint(payload: ErrorPayload): void {
  const endpoint = import.meta.env.VITE_ERROR_REPORTING_ENDPOINT as string | undefined;
  if (!endpoint) return;

  // Use sendBeacon when available so the report survives page unloads.
  const body = JSON.stringify(payload);
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
  } else {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // fire-and-forget; don't await
    }).catch(() => {
      // swallow — reporting must never crash the app
    });
  }
}

/**
 * Report an error from any React error boundary or async handler.
 *
 * @param error  The caught error (Error, Response, or unknown value).
 * @param context Extra key/value pairs that help diagnose the issue.
 * @param severity Optional severity level; defaults to "error".
 */
export function reportError(
  error: unknown,
  context: ErrorContext = {},
  severity: ErrorSeverity = "error",
): void {
  if (typeof window === "undefined") {
    // Server-side: just log — no browser APIs available.
    console.error("[NexaInvest error]", error, context);
    return;
  }

  const payload = buildPayload(error, context, severity);

  // Always surface in devtools during development.
  if (import.meta.env.DEV) {
    console.group(`[NexaInvest ${payload.severity}] ${payload.message}`);
    console.error(error);
    if (Object.keys(context).length) console.table(context);
    console.groupEnd();
  }

  sendToEndpoint(payload);
}
