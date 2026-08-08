# NexaInvest — Agent & Contributor Guide

## Project overview

NexaInvest is a premium investment & referral platform built with:

- **React 19** + **TanStack Start** (SSR) + **TanStack Router** (file-based routing)
- **Vite 8** with `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`
- **Tailwind CSS v4** — dark glassmorphism design system
- **Radix UI** primitives + shadcn/ui component conventions
- **TanStack Query v5** for data fetching
- **React Hook Form + Zod** for forms & validation
- **Recharts** for analytics charts
- **Lucide React** for icons
- **Sonner** for toast notifications

## Routing

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts`.  
**Never edit `routeTree.gen.ts` manually** — it is regenerated on every `vite dev` / `vite build`.

| Path | File |
|------|------|
| `/` | `src/routes/index.tsx` |
| `/dashboard` | `src/routes/dashboard.tsx` |
| `/login` | `src/routes/login.tsx` |
| `/register` | `src/routes/register.tsx` |

## Adding a new route

Create `src/routes/<name>.tsx` and export a `Route` created with `createFileRoute("/<name>")`.  
TanStack Router picks it up automatically on the next dev server restart.

## Component conventions

- **`src/components/ui/`** — raw Radix-based primitives (shadcn/ui pattern). Keep these unstyled and reusable.
- **`src/components/site/`** — shell components (Navbar, Footer, auth shells).
- **`src/components/landing/`** — landing page sections.
- **`src/components/dashboard/`** — dashboard-specific charts and stat pieces.

## Error reporting

`src/lib/error-reporting.ts` exports `reportError(error, context?, severity?)`.  
Set `VITE_ERROR_REPORTING_ENDPOINT` in your `.env` to forward payloads to your own ingest.  
In development, errors are printed to the browser console only — no external requests.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_ERROR_REPORTING_ENDPOINT` | Optional HTTPS URL for error ingest |
| `VITE_API_BASE_URL` | Backend API base URL |

Prefix all client-side variables with `VITE_`. Server-only variables (no prefix) are available in server functions but never sent to the browser.

## Running locally

```sh
bun install
bun run dev        # development server with HMR
bun run build      # SSR production build
bun run preview    # preview the production build
bun run lint       # ESLint
bun run format     # Prettier
```

## Git hygiene

- Commit small, focused changes.
- Never force-push or amend commits that are already on `main`.
- Keep `main` in a deployable state at all times.
