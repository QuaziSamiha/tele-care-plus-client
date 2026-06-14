# Error Handling System

## Overview

This document is the single source of truth for the error handling architecture of this project. Every decision made here — what files exist, why they exist, and how they connect — is documented so any engineer can understand, extend, or debug the system without reading every file.

---

## Core Principle

> Every error has an audience. The **user** sees a clean, actionable page. The **ops team** sees a structured log with a trace ID. The **app** recovers gracefully without a full crash.

Three rules that follow from this:

1. **Never expose internals to the client** — no stack traces, no DB connection strings, no file paths
2. **Single source of truth** — all HTTP status-to-action mapping lives in one place (`errorRouter.ts`), not scattered across components
3. **Typed errors, not string matching** — `instanceof ForbiddenError` is reliable; `error.message === "forbidden"` is not

---

## File Map

```
src/
├── types/
│   └── error.types.ts              ← Error class hierarchy (AppError + 7 child classes)
│
├── lib/
│   └── utils/
│       └── errorRouter.ts          ← Central routing utility (status code → error page URL)
│
├── components/
│   └── Error/
│       ├── index.ts                ← Barrel export for all error components
│       ├── ErrorPageLayout.tsx     ← Shared visual shell for all error pages
│       ├── ErrorBoundary.tsx       ← React class component (section-level isolation)
│       ├── Unauthorized.tsx        ← 401 component
│       ├── Forbidden.tsx           ← 403 component
│       ├── NetworkError.tsx        ← Network/offline component
│       ├── ServerError.tsx         ← 500 component
│       ├── MaintenanceError.tsx    ← 503 component
│       └── RateLimitError.tsx      ← 429 component with live countdown
│
├── app/
│   ├── global-error.tsx            ← Root-level Next.js error boundary (catches layout crashes)
│   ├── not-found.tsx               ← Global 404 page for ALL unmatched URL paths (routing level)
│   └── [locale]/
│       ├── error.tsx               ← Segment-level Next.js error boundary (catches page crashes)
│       ├── not-found.tsx           ← Locale 404 page for explicit notFound() calls (content level)
│       └── (ErrorPage)/
│           ├── unauthorized/page.tsx
│           ├── forbidden/page.tsx
│           ├── network-error/page.tsx
│           ├── maintenance/page.tsx
│           ├── error/page.tsx
│           └── rate-limit/page.tsx
│
├── constants/
│   └── routes.constants.ts         ← Error routes added to PUBLIC (middleware bypass)
│
├── lib/
│   └── axios/
│       └── axiosInstance.ts        ← Response interceptor: routes 401 → /unauthorized, network errors (!response) → /network-error
│
└── hooks/
    └── api/
        ├── useGet.ts               ← throwOnError routes 403/429/503 and surfaces 5xx to boundary; retry disabled for statusCode 0
        └── useGetAll.ts            ← catch block skips toast for statusCode 0; retry disabled for statusCode 0
```

---

## Error Taxonomy

Every error this application can encounter, what it means, and how the system handles it:

| Error Class | Status | Meaning | User Action | Route |
|---|---|---|---|---|
| `UnauthorizedError` | 401 | Not logged in | Sign in | `/unauthorized?from=<path>` |
| `ForbiddenError` | 403 | Logged in, no permission | Contact admin | `/forbidden` |
| `NotFoundError` | 404 | Resource does not exist | Go home / search | `app/not-found.tsx` (unmatched routes) · `[locale]/not-found.tsx` (explicit `notFound()` call) |
| `RateLimitError` | 429 | Too many requests | Wait, then retry | `/rate-limit` |
| `ServerError` | 500 | Unhandled backend exception | Retry | `/error` |
| `MaintenanceError` | 503 | Planned downtime | Check again later | `/maintenance` |
| `NetworkError` | 0 | No internet / DNS / timeout | Retry | `/network-error` |
| *(React render crash)* | N/A | Component threw during render | Retry segment | `error.tsx` / `global-error.tsx` |

### The `not-found.tsx` vs `app/not-found.tsx` Distinction

This is one of the most misunderstood file conventions in the Next.js App Router. The two files look similar but serve completely different purposes and trigger under completely different conditions.

```
app/
├── not-found.tsx              ← catches UNMATCHED ROUTES (routing level)
└── [locale]/
    └── not-found.tsx          ← catches notFound() CALLS (content level)
```

**`app/[locale]/not-found.tsx` — Content-level 404**

Triggered **only** when `notFound()` is explicitly called from within a page or layout inside that segment. Examples:

```ts
// product-details/[slug]/page.tsx
const product = await fetchProduct(params.slug);
if (!product) notFound();  // ← triggers [locale]/not-found.tsx
```

```ts
// order/[id]/page.tsx
const order = await fetchOrder(params.id);
if (order.userId !== session.userId) notFound();  // ← triggers [locale]/not-found.tsx
```

This file is for **"the data doesn't exist"** scenarios — the route itself matched, but the content behind it is missing or inaccessible.

**`app/not-found.tsx` — Route-level 404**

Triggered when a URL **does not match any page file** in the entire app. No layout renders, no page renders — Next.js handles it at the routing layer before any component code runs. Examples:

```
/en/djnjfd          ← no file matches → app/not-found.tsx
/en/typo-in-path    ← no file matches → app/not-found.tsx
/completely/wrong   ← no file matches → app/not-found.tsx
```

> From the Next.js 16 docs: *"In addition to catching expected notFound() errors, the root `app/not-found.js` file handles any unmatched URLs for your whole application."*

**Why `[locale]/not-found.tsx` alone was NOT enough**

Before `app/not-found.tsx` was created, visiting `/en/djnjfd` showed the default Next.js 404 (black background, "This page could not be found."). The reason:

1. `[locale]/not-found.tsx` only activates after its **parent layout has successfully mounted**
2. For a route-level miss (no matching file), Next.js never enters the `[locale]` rendering tree at all
3. Next.js looks for the nearest `not-found.tsx` up the tree — `[locale]/not-found.tsx` is a sibling of `[locale]/page.tsx`, not an ancestor of the route root
4. No `app/not-found.tsx` existed → Next.js fell back to its built-in default

**The `global-not-found.tsx` Alternative (experimental)**

Next.js 16 also introduced `app/global-not-found.tsx` as an experimental option, enabled via:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
};
```

Unlike `app/not-found.tsx`, the global variant **completely bypasses the rendering pipeline** — no layouts, no providers, nothing. It is the recommended option when the app root is a dynamic segment (like this project's `[locale]`). The tradeoff is that the file must return a full `<html>/<body>` document with its own styles and fonts:

```tsx
// app/global-not-found.tsx
import '../styles/globals.css'
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>...</body>
    </html>
  );
}
```

This project uses `app/not-found.tsx` (no experimental flag needed) because the `[locale]` layout does not crash before the not-found handler, making the simpler option viable.

**Three-file not-found hierarchy in this project**

```
URL: /en/djnjfd  (no matching page file)
  → app/not-found.tsx                     ← handles it (routing level)

URL: /en/product-details/deleted-slug     (page exists, data does not)
  → product-details/[slug]/page.tsx calls notFound()
  → app/[locale]/not-found.tsx            ← handles it (content level)

URL: /en (home page crashes due to layout error)
  → app/global-error.tsx                  ← handles it (root layout crash)
```

**Decision rule: which not-found file to call `notFound()` from**

Always call `notFound()` from the deepest segment where the miss is detected. Next.js walks up the tree and renders the nearest `not-found.tsx` ancestor:

```
If you call notFound() from [locale]/product-details/[slug]/page.tsx
  → Next.js looks for not-found.tsx at:
      1. app/[locale]/product-details/[slug]/not-found.tsx  (doesn't exist)
      2. app/[locale]/not-found.tsx                          ← renders this
      3. app/not-found.tsx                                   (would use if [locale] one absent)
```

---

### The 401 vs 403 Distinction

This is the most commonly confused pair in auth error handling:

```
401 Unauthorized → "Who are you?"    → User is NOT logged in     → Redirect to /signin
403 Forbidden    → "You can't do this" → User IS logged in        → Show /forbidden page
```

**Never redirect a 403 to the login page.** The user is already authenticated — forcing them to log in again is confusing and does not resolve the permission issue.

---

## Architecture Layers

The error system operates at four distinct layers. Each layer has a clear responsibility and does not overlap with the others.

```
┌─────────────────────────────────────────────────────┐
│  Layer 4 — React Render Layer                       │
│  global-error.tsx  ←  error.tsx  ←  ErrorBoundary  │
│  Catches JS exceptions thrown during component render│
└─────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────┐
│  Layer 3 — Page / Route Layer                       │
│  (ErrorPage)/* — Dedicated full-page error UIs      │
│  Each maps to one error type. Clean, user-facing.   │
└─────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────┐
│  Layer 2 — Hook / Query Layer                       │
│  useGet.ts — throwOnError callback                  │
│  Routes 403/429/503 → page, surfaces 5xx → boundary │
└─────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────┐
│  Layer 1 — Network / Interceptor Layer              │
│  axiosInstance.ts — response interceptor            │
│  Normalizes all errors to IGenericErrorResponse     │
│  Routes 401 (after refresh failure) → /unauthorized │
│  Routes network errors (!response) → /network-error │
└─────────────────────────────────────────────────────┘
```

---

## Error Type Hierarchy

All errors extend a single base class. This enables `instanceof` checks, consistent serialization, and stack traces.

```
Error (native JS)
└── AppError                    ← base: message + code + statusCode + toJSON()
    ├── UnauthorizedError       ← 401
    ├── ForbiddenError          ← 403
    ├── NotFoundError           ← 404
    ├── RateLimitError          ← 429
    ├── ServerError             ← 500
    ├── MaintenanceError        ← 503
    └── NetworkError            ← 0  (no HTTP status — never reached server)
```

### Why Classes, Not Plain Objects

```ts
// ✅ With class — type-safe routing at runtime
if (error instanceof ForbiddenError) navigateToErrorPage(403);
if (error instanceof NetworkError)   navigateToErrorPage(0);

// ❌ With plain object — fragile string matching
if (error.code === "FORBIDDEN") ...   // breaks if code changes
if (error.message.includes("forbidden")) ...  // breaks if wording changes
```

`instanceof` checks are the only reliable way to type-check errors at runtime. Plain objects cannot be checked this way.

### Why `Object.setPrototypeOf` Is Required

```ts
constructor(...) {
  super(message);
  Object.setPrototypeOf(this, new.target.prototype);
}
```

TypeScript compiles class inheritance to ES5 `function` + `prototype` when targeting older environments. When extending native built-ins like `Error`, the prototype chain is broken in compiled output. Without this line, `instanceof UnauthorizedError` returns `false` even when the error was created with `new UnauthorizedError()`. This is a silent, hard-to-diagnose bug.

---

## Central Error Router

`src/lib/utils/errorRouter.ts` is the **single source of truth** for mapping status codes to error page URLs.

```ts
// Used in: axiosInstance.ts, useGet.ts, any component that needs programmatic routing
navigateToErrorPage(403);         // → /[locale]/forbidden
navigateToErrorPage(401, path);   // → /[locale]/unauthorized?from=<path>
navigateToErrorPage(503);         // → /[locale]/maintenance
```

### Why `window.location.href` (Not `router.push`)

The router utility uses a hard navigation (full page reload) rather than client-side navigation. This is intentional for critical auth errors:

1. **Session reset** — after a 401 logout, React Query cache and auth state must be cleared. A soft navigation leaves stale state in memory.
2. **Auth state re-evaluation** — the new page load re-runs the middleware, which re-checks the session cookie.
3. **Predictability** — error redirects are rare, one-off events. Optimizing them for speed with `router.push` is premature and introduces complexity.

For non-critical errors (403, 429, 503), the same utility is used for consistency, even though soft navigation would work.

### The `statusCode: 0` Entry Is Non-Negotiable

The destinations map inside `navigateToErrorPage` must explicitly include `0`:

```ts
const destinations: Record<number, string> = {
  0:   `/${locale}/network-error`,   // ← must exist
  401: `/${locale}/unauthorized?from=${from}`,
  403: `/${locale}/forbidden`,
  429: `/${locale}/rate-limit`,
  503: `/${locale}/maintenance`,
};

const destination =
  destinations[statusCode] ??
  (statusCode >= 500 ? `/${locale}/error` : null);
```

**What happens if `0` is absent:**

1. `destinations[0]` → `undefined`
2. Fallback `statusCode >= 500` → `0 >= 500` → `false`
3. `destination = null`
4. `if (destination)` → false
5. `window.location.href` is never set → **navigation silently does nothing**

The user stays on the broken page with no error feedback. There is no console error, no thrown exception — just silence. This is the hardest class of bug to diagnose because the code path completes without any indication of failure.

The `statusCode >= 500` fallback exists for unmapped 5xx codes (e.g., 502), but `0 < 500` so network errors fall entirely outside its range.

### Locale Awareness

The router reads the current locale from `window.location.pathname`:

```ts
const locale = window.location.pathname.split("/")[1]; // "en" | "th"
```

This avoids importing next-intl into a non-React utility and keeps the function usable from anywhere (interceptors, outside React tree).

---

## React Error Boundaries

### Three Levels of Boundary Coverage

```
global-error.tsx         ← crashes in root layout (e.g., providers fail to initialize)
[locale]/error.tsx       ← crashes in any page under [locale] (most common)
<ErrorBoundary>          ← crashes in a specific widget/section (most granular)
```

Each level handles a different scope of failure. The goal is to minimize the blast radius: a broken chart widget should not crash the entire dashboard.

### `error.tsx` vs `global-error.tsx`

| | `error.tsx` | `global-error.tsx` |
|---|---|---|
| Scope | Page segment and below | Root layout itself |
| Must include `<html>/<body>` | No | **Yes** — replaces entire document |
| Has access to providers | Yes | **No** — providers may have crashed |
| External dependencies | Safe to use | **Minimal only** — no shared components |
| Receives `reset()` | Yes | Yes |

`global-error.tsx` uses inline styles (no Tailwind) and no shared components precisely because it renders when the root layout has crashed — any shared component that imports from the crashed layout would also fail.

### `ErrorBoundary` Props

```ts
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;  // custom fallback UI
  onError?: (error: Error, info: ErrorInfo) => void;          // monitoring hook
}
```

The `onError` prop is how the boundary integrates with external monitoring:

```tsx
<ErrorBoundary
  onError={(err, info) => Sentry.captureException(err, { extra: info })}
>
  <RevenueWidget />
</ErrorBoundary>
```

In development, errors are also logged to the console. In production, only the `onError` callback fires — no console noise.

### `ErrorBoundary` Must Be a Class Component

React does not support error boundaries as function components. The lifecycle methods `getDerivedStateFromError` and `componentDidCatch` are only available on class components. This is a React constraint, not a design choice.

```ts
// getDerivedStateFromError — STATIC, called during render to update state
static getDerivedStateFromError(error: Error): State {
  return { hasError: true, error };
}

// componentDidCatch — called after fallback is committed to DOM (side effects here)
componentDidCatch(error: Error, info: ErrorInfo): void {
  this.props.onError?.(error, info);
}
```

These two methods must not be confused:
- `getDerivedStateFromError` → **pure**, updates state, no side effects
- `componentDidCatch` → **impure**, correct place for logging and monitoring

---

## `ErrorPageLayout` — Shared Visual Shell

All error pages use `ErrorPageLayout` as their visual container. This ensures:

1. **Consistency** — every error page has identical spacing, typography, and structure
2. **Single update point** — changing the layout of all error pages means editing one file
3. **No duplication** — 6 error pages share ~40 lines of wrapper JSX

```ts
interface ErrorPageLayoutProps {
  icon: LucideIcon;
  iconBg: string;       // Tailwind class: "bg-amber-50/50"
  iconColor: string;    // Tailwind class: "text-amber-600"
  badge: string;        // "401 Error"
  badgeColor: string;   // Tailwind class: "text-amber-600"
  title: string;
  description: ReactNode;  // ReactNode, not string — allows conditional/formatted content
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
}
```

### Color Conventions

Each error type has a consistent color that signals severity at a glance:

| Error | Color | Tailwind | Reasoning |
|---|---|---|---|
| 401 Unauthorized | Amber | `text-amber-600` | Warning — recoverable, just log in |
| 403 Forbidden | Red | `text-red-600` | Danger — access denied |
| 500 Server Error | Rose | `text-rose-600` | Critical — server-side failure |
| 503 Maintenance | Indigo | `text-indigo-600` | Informational — planned, expected |
| Network Error | Slate | `text-slate-600` | Neutral — connectivity issue |
| 429 Rate Limit | Orange | `text-orange-600` | Caution — user action caused it |

---

## HTTP Interceptor Integration

`src/lib/axios/axiosInstance.ts` handles two error routing concerns:

### 1. Token Refresh (401 Flow)

```
Request fails with 401
  → Is a refresh already in progress?
      → Yes: queue this request, wait for refresh to complete, retry
      → No: attempt token refresh
          → Success: update token, retry original request
          → Failure: call authService.logout() + navigateToErrorPage(401)
```

The queuing mechanism (`refreshSubscribers`) prevents multiple simultaneous refresh calls when several requests fail at the same time.

### 2. Error Normalization

All non-2xx responses are normalized to `IGenericErrorResponse` before being thrown. This means every `catch` block in the codebase receives the same shape regardless of what the backend sends:

```ts
interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: string[] | string;
  success: boolean;
}
```

### 3. Network Error Detection

Network errors are a distinct failure class: the request left the client but **no HTTP response was ever received** — the server was unreachable, the connection was refused, DNS resolution failed, or the request timed out. Axios signals this condition by setting `error.response` to `undefined`.

The `!error.response` guard **must be the first check** in the response interceptor error callback:

```ts
async (error) => {
  //* MUST CHECK !error.response BEFORE status extraction
  //* Without this guard: status = undefined, then statusCode: undefined || 500
  //* — a network failure silently masquerades as a 500 server error
  if (!error.response) {
    navigateToErrorPage(0);
    return Promise.reject<IGenericErrorResponse>({
      statusCode: 0,
      message: "Network error. Unable to connect to the server.",
      success: false,
      errorMessages: "Network error",
    });
  }

  //* SAFE TO READ — response is guaranteed to exist past this point
  const status = error.response.status;
  const errorMessage = error.response.data?.message || "";
  // ...
}
```

**Why `statusCode: 0`?** There is no HTTP status code for "never reached the server." The value `0` is the conventional sentinel for this condition. It must be a number (not `null` or `undefined`) because all downstream code — `useGet`, `useGetAll`, `errorRouter` — type-checks against `statusCode` as a number.

**The `navigateToErrorPage(0)` call is synchronous.** The interceptor fires before any hook `catch` block runs. By the time `useGet.throwOnError` or `useGetAll.catch` receives `statusCode: 0`, the browser has already started navigating to `/network-error`.

---

## `useGet` Hook — Error Routing Strategy

`throwOnError` in `useGet` determines what happens when a query fails:

```
403 Forbidden      → navigateToErrorPage(403)  — hard redirect, do not toast
429 Rate Limit     → navigateToErrorPage(429)  — hard redirect, do not toast
503 Maintenance    → navigateToErrorPage(503)  — hard redirect, do not toast
5xx Server Error   → return true               — throw to nearest error.tsx boundary
4xx Other          → toast.error(message)      — stay on page, show notification
Network Error      → navigateToErrorPage(0)    — handled in axios interceptor (Layer 1), not here
```

> **Note on Network Errors:** Network errors (`ERR_CONNECTION_REFUSED`, timeout, DNS failure) are detected in the **axios interceptor** — `error.response` is `undefined` when no HTTP response was received. The interceptor calls `navigateToErrorPage(0)` and rejects with `statusCode: 0`. Hooks must skip toasting for `statusCode === 0` since the page is already navigating away. If a hook toasted unconditionally (before checking statusCode), the toast would flash briefly before the navigation completed.

The distinction between "redirect" and "throw to boundary" for 5xx is intentional:
- Redirecting to `/error` would lose the React Query cache and the user's current context
- Throwing to `error.tsx` shows the error page inline while preserving the URL, and provides a `reset()` function that retries the query without a full page reload

### Retry Strategy

Both `useGet` and `useGetAll` suppress React Query's automatic retry for `statusCode === 0`:

```ts
retry: (failureCount, error) => {
  if ((error as IGenericErrorResponse)?.statusCode === 0) return false;
  return failureCount < 3;
},
```

**Why this matters:** React Query's default retry policy fires up to 3 times on any failed query. For network errors, retries are pointless — if the server is unreachable, the second and third attempts will fail identically. More critically, each retry re-enters the axios interceptor, which calls `navigateToErrorPage(0)` again and fires another `Promise.reject`. This produces a waterfall of failed requests in DevTools and a cascade of redundant navigation calls. Suppressing retries for `statusCode === 0` ensures the interceptor fires exactly once per network failure.

---

## `useGetAll` Hook — Error Routing Strategy

`useGetAll` uses a `try/catch` inside `queryFn` instead of `throwOnError`. Its error routing behavior:

```
All errors → toast.error(message)   — BUT only when statusCode !== 0
statusCode 0 → skip toast           — navigation already in flight from axios interceptor
```

```ts
queryFn: async (): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(endpoint, { params: queryParams });
    return response.data as T;
  } catch (error) {
    const err = error as IGenericErrorResponse;
    //* SKIP TOAST FOR NETWORK ERRORS — interceptor already called navigateToErrorPage(0)
    //* Toasting here would cause a brief flash before the page navigates away
    if (err?.statusCode !== 0) {
      toast.error(err?.message || "Failed to fetch data.");
    }
    throw error;
  }
},
```

### Why `useGetAll` Uses `try/catch` Instead of `throwOnError`

`useGet` has access to `throwOnError` which receives the typed `IGenericErrorResponse` from React Query's error state. `useGetAll` wraps the error inside `queryFn` itself because it needs to toast on the broad class of "any API error" without differentiating by status code. The tradeoff is that this approach requires explicit `statusCode` checks wherever behavior should differ — specifically for `statusCode === 0`.

> **Extension note:** If `useGetAll` grows to need per-status routing (403 → redirect, 429 → redirect), consider migrating it to a `throwOnError` pattern matching `useGet`, rather than adding more conditionals to the catch block.

---

## Middleware — Error Pages as Public Routes

`src/constants/routes.constants.ts` — error routes are explicitly listed in `ROUTE_CONFIG.PUBLIC`:

```ts
PUBLIC: [
  // ... other public routes
  "/unauthorized",
  "/forbidden",
  "/network-error",
  "/maintenance",
  "/error",
  "/rate-limit",
]
```

**Why this matters:** Without this, the middleware's admin route guard could intercept an error page redirect and send the user in an infinite loop:

```
User (non-admin) hits 403 → redirected to /forbidden
Middleware sees /forbidden, no auth, not in PUBLIC → redirects to /
User hits 403 again → infinite loop
```

Error pages must always be reachable regardless of auth state.

---

## `RateLimitError` — Countdown Implementation

The 429 page implements a live countdown before allowing retry.

### Why `setInterval` Over `setTimeout` Chaining

The previous implementation chained `setTimeout` calls inside a `useEffect` that depended on `countdown`:

```ts
// ❌ Previous — chained setTimeout
useEffect(() => {
  if (countdown <= 0) {
    setCanRetry(true);  // ← setState inside effect triggered by state change = React error
    return;
  }
  const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
  return () => clearTimeout(timer);
}, [countdown]);
```

Problems:
1. **Cascading `setState`** — `setCanRetry(true)` called synchronously inside an effect that runs because `setCountdown` fired = React warning
2. **Two state variables for one concept** — `canRetry` is always `countdown <= 0`; storing it in state is redundant
3. **Timer drift** — each chained timeout includes event loop processing delay; after 30 ticks, the total time is noticeably more than 30 seconds

```ts
// ✅ Current — single setInterval, derived canRetry
const [countdown, setCountdown] = useState(WAIT_SECONDS);
const canRetry = countdown <= 0;  // derived — no useState

useEffect(() => {
  const timer = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) { clearInterval(timer); return 0; }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, []); // runs once on mount
```

---

## Network Error — Bug Investigation & Root Cause Analysis

### Symptom

When the backend server was down, the expected behavior was: all pages navigate to `/en/network-error`. The actual behavior was: a **"Failed to fetch data."** toast appeared briefly, and the user stayed on the broken page. No navigation occurred.

### Root Cause — Three Chained Bugs

The symptom was produced by three independent bugs that each masked or blocked the one before it. Fixing any one of them alone was insufficient.

---

#### Bug 1 — `axiosInstance.ts`: Network error masquerading as `statusCode: 500`

**Location:** `src/lib/axios/axiosInstance.ts` — response interceptor error callback

**Code before fix:**
```ts
async (error) => {
  const originalRequest = error.config;
  const status = error.response?.status;          // ← undefined when no response
  // ...
  const errorResponse: IGenericErrorResponse = {
    statusCode: status || 500,                    // ← undefined || 500 = 500
    // ...
  };
  return Promise.reject(errorResponse);
}
```

**What happened:** When the backend was down, `error.response` was `undefined` (axios behavior: no response object exists when the server never replied). Reading `error.response?.status` returned `undefined`. The fallback `undefined || 500` normalized the network error into a fake `statusCode: 500`.

`navigateToErrorPage` was never called for network errors at all — the interceptor just rejected with `{ statusCode: 500 }`, letting all downstream code treat it as a server error.

**Fix:**
```ts
async (error) => {
  if (!error.response) {
    navigateToErrorPage(0);
    return Promise.reject<IGenericErrorResponse>({
      statusCode: 0,
      message: "Network error. Unable to connect to the server.",
      success: false,
      errorMessages: "Network error",
    });
  }
  //* SAFE — error.response exists past this guard
  const status = error.response.status;
  // ...
}
```

---

#### Bug 2 — `errorRouter.ts`: `statusCode: 0` had no routing destination

**Location:** `src/lib/utils/errorRouter.ts` — `navigateToErrorPage` destinations map

**Code before fix:**
```ts
const destinations: Record<number, string> = {
  401: `/${locale}/unauthorized?from=${from}`,
  403: `/${locale}/forbidden`,
  429: `/${locale}/rate-limit`,
  503: `/${locale}/maintenance`,
  //* 0 was absent
};

const destination =
  destinations[statusCode] ??
  (statusCode >= 500 ? `/${locale}/error` : null);  // 0 >= 500 is false
```

**What happened:** Even after fixing Bug 1 so that `navigateToErrorPage(0)` was called, `destinations[0]` was `undefined`. The fallback `0 >= 500` evaluated to `false`. So `destination = null`. The `if (destination)` guard prevented `window.location.href` from ever being set. Navigation silently did nothing — no error, no exception, no log.

**Fix:**
```ts
const destinations: Record<number, string> = {
  0:   `/${locale}/network-error`,   // ← added
  401: `/${locale}/unauthorized?from=${from}`,
  403: `/${locale}/forbidden`,
  429: `/${locale}/rate-limit`,
  503: `/${locale}/maintenance`,
};
```

---

#### Bug 3 — `useGetAll.ts`: Unconditional toast fired for every error including `statusCode: 0`

**Location:** `src/hooks/api/useGetAll.ts` — `queryFn` catch block

**Code before fix:**
```ts
} catch (error) {
  if (error instanceof Error) {
    toast.error(error.message || "Failed to fetch data.");
  } else {
    toast.error("Failed to fetch data.");
  }
  throw error;
}
```

**What happened:** The catch block toasted unconditionally for every error type. It also used `instanceof Error` which is unreliable when the rejected value is a plain `IGenericErrorResponse` object (which is not a class instance). Even after Bugs 1 and 2 were fixed and navigation was in flight, this catch block fired a "Failed to fetch data." toast before the browser completed the navigation, producing a visible flash.

**Fix:**
```ts
} catch (error) {
  const err = error as IGenericErrorResponse;
  //* SKIP TOAST — navigation is already in flight from the axios interceptor
  if (err?.statusCode !== 0) {
    toast.error(err?.message || "Failed to fetch data.");
  }
  throw error;
}
```

---

#### Bug 4 — React Query retrying on network failure (cascade effect)

**Location:** `src/hooks/api/useGetAll.ts` and `src/hooks/api/useGet.ts`

**What happened:** React Query's default retry policy is 3 attempts. Each failed attempt re-entered the axios interceptor, re-called `navigateToErrorPage(0)`, and added another failed request to the Network tab. The waterfall of requests confused investigation (it looked like a CORS or auth loop) and added ~3–5 seconds of delay before the UI settled.

**Fix (both hooks):**
```ts
retry: (failureCount, error) => {
  if ((error as IGenericErrorResponse)?.statusCode === 0) return false;
  return failureCount < 3;
},
```

---

### Timeline of Symptoms (Before vs After Fix)

| Symptom | Before | After |
|---|---|---|
| Toast fires | "Failed to fetch data." — always | Never for network errors |
| Navigation | Does not happen | Immediately navigates to `/en/network-error` |
| Network tab | 3–4 failed requests (retry waterfall) | Exactly 1 failed request |
| Console | Multiple interceptor errors | Single interceptor error |
| User experience | Stuck on broken page with toast | Clean error page with retry option |

### Lessons

1. **Always guard `!error.response` before reading `error.response.status`.** Axios network errors set `response` to `undefined`. Any downstream code that reads `status` without this guard will silently misclassify the error.

2. **`0` does not satisfy `>= 500`.** If your routing logic uses a `>= 500` fallback for unregistered codes, `statusCode: 0` falls completely outside it. Always add `0` explicitly to the destinations map.

3. **Suppress retries for `statusCode: 0`.** A network failure will never succeed on retry. Retries only produce a flood of redundant interceptor invocations, each one re-triggering navigation.

4. **Chained bugs are hard to diagnose incrementally.** Fixing Bug 1 alone showed no visible change (Bug 2 still silently dropped navigation). Fixing Bug 2 alone showed no change (Bug 1 never called `navigateToErrorPage(0)`). All three bugs had to be fixed together for the symptom to resolve.

---

## Adding a New Error Type

When a new error scenario needs a dedicated page:

**Step 1 — Add the error class** in `src/types/error.types.ts`:
```ts
export class PaymentError extends AppError {
  constructor(message = "Payment processing failed") {
    super(message, "PAYMENT_ERROR", 402);
    this.name = "PaymentError";
  }
}
```

**Step 2 — Add the route** in `src/constants/routes.constants.ts`:
```ts
PUBLIC: [..., "/payment-error"]
```

**Step 3 — Add the destination** in `src/lib/utils/errorRouter.ts`:
```ts
const destinations: Record<number, string> = {
  // ...
  402: `/${locale}/payment-error`,
};
```

**Step 4 — Create the component** in `src/components/Error/PaymentError.tsx`:
```ts
export function PaymentError(): ReactNode {
  return (
    <ErrorPageLayout
      icon={CreditCard}
      iconBg="bg-yellow-50/50"
      iconColor="text-yellow-600"
      badge="402 Error"
      badgeColor="text-yellow-600"
      title="Payment Required"
      description="..."
      primaryAction={{ label: "Update Payment", href: "/billing" }}
    />
  );
}
```

**Step 5 — Create the page** in `src/app/[locale]/(ErrorPage)/payment-error/page.tsx`:
```ts
import { PaymentError } from "@/components/Error";
export default function PaymentErrorPage() { return <PaymentError />; }
```

**Step 6 — Export** from `src/components/Error/index.ts`.

---

## What Not to Do

These are the anti-patterns this system was specifically designed to prevent:

```ts
// ❌ Generic throw — no type, no status code, cannot be routed
throw new Error("Something went wrong");

// ❌ Status code checks scattered across components
if (error.status === 403) router.push("/forbidden");  // in every component

// ❌ Exposing internals to the user
toast.error(error.stack);
res.json({ error: "Connection refused postgresql://prod-db:5432" });

// ❌ Conflating 401 and 403
if (error.status === 401 || error.status === 403) router.push("/signin");
// 403 users are already signed in — this is confusing and wrong

// ❌ Swallowing errors silently
try { await fetchData(); } catch {}

// ❌ Two state variables for one derived concept
const [canRetry, setCanRetry] = useState(false);  // always === countdown <= 0

// ❌ Not checking !error.response before reading status
// Without the guard: status = undefined, then statusCode: undefined || 500
// Network errors silently masquerade as 500 server errors
const status = error.response?.status;  // wrong — must guard !error.response first
const statusCode = status || 500;       // hides the real failure type

// ❌ Toasting unconditionally in a catch block without checking statusCode
catch (error) {
  toast.error(error.message);  // fires even for statusCode 0 — brief flash before navigation
}

// ❌ Missing statusCode 0 in the errorRouter destinations map
// 0 >= 500 is false — the fallback condition does not catch it
// destination becomes null → window.location.href is never set → silent no-op
const destinations = { 401: "...", 403: "..." };  // 0 is not listed → navigation silently skips
```

---

## Testing the Error Handling System

### 1. Manual Testing — Visit Pages Directly

The fastest verification. All error pages are public routes — navigate to them directly without any setup:

```
http://localhost:3000/en/unauthorized
http://localhost:3000/en/forbidden
http://localhost:3000/en/network-error
http://localhost:3000/en/maintenance
http://localhost:3000/en/error
http://localhost:3000/en/rate-limit
```

Verify on each page:
- Correct icon, badge color, title, and description render
- Primary button navigates correctly (home, retry, sign-in)
- `/unauthorized?from=/dashboard` — the `from` param is preserved in the Sign In link
- `/rate-limit` — countdown ticks every second and the button enables at `0`

---

### 2. Triggering Each Error Through the App

**401 — Unauthorized**
```
1. Open DevTools → Application → Clear site data (removes auth cookies)
2. Navigate to a protected route: /en/my-account
3. Middleware detects no session → redirects to /en/unauthorized
```

**403 — Forbidden**
```
1. Sign in as a CUSTOMER account
2. Manually navigate to /en/dashboard/admin-dashboard
3. Middleware blocks non-admin → redirects to /
   (To reach /forbidden directly: call navigateToErrorPage(403) in browser console)
```

**500 — Triggers `error.tsx` boundary**
```tsx
// Temporarily add to any page component, then remove after testing:
export default function AnyPage() {
  throw new Error("Test render crash");
}
```

**`global-error.tsx` — Root layout crash**
```tsx
// Temporarily add to src/app/[locale]/layout.tsx, then IMMEDIATELY remove:
throw new Error("Layout crash test");
// Warning: this crashes the entire app until removed
```

**Network Error**
```
DevTools → Network tab → check "Offline"
→ Make any API call via a page action
→ Axios interceptor receives a network failure → navigateToErrorPage(0)
```

**`ErrorBoundary` — Section-level isolation**
```tsx
// Wrap any component temporarily to verify the boundary catches it:
function Bomb(): ReactNode { throw new Error("Widget crash"); }

<ErrorBoundary>
  <Bomb />
</ErrorBoundary>
// → Should show DefaultErrorFallback, rest of page stays intact
```

---

### 3. Simulate API Status Codes Without Touching the Backend

**Option A — Temporary test API route**

Create this file, use it, then delete it:

```ts
// src/app/api/test-error/route.ts
export function GET(req: Request): Response {
  const code = new URL(req.url).searchParams.get("code") ?? "500";
  return Response.json({ message: "test error" }, { status: Number(code) });
}
```

Then trigger it from any component:
```ts
// This fires throwOnError in useGet → routes based on status code
const { data } = useGet("/test-error?code=403", ["test-403"]);
// 403 → navigateToErrorPage(403) → /en/forbidden
// 503 → navigateToErrorPage(503) → /en/maintenance
// 500 → throws to error.tsx boundary
```

**Option B — Block requests in DevTools**
```
DevTools → Network → right-click any API request → "Block request URL"
→ All requests to that URL fail with a network error
→ Verifies the network error toast / redirect path
```

---

### 4. Automated Unit Tests

Install the testing stack:
```bash
yarn add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**`RateLimitError` — countdown and button state**
```ts
// src/components/Error/__tests__/RateLimitError.test.tsx
import { render, screen, act } from "@testing-library/react";
import { RateLimitError } from "../RateLimitError";

jest.useFakeTimers();

test("button is disabled with countdown label initially", () => {
  render(<RateLimitError />);
  expect(screen.getByRole("button")).toHaveTextContent("Wait 30s...");
});

test("button activates after full countdown", () => {
  render(<RateLimitError />);
  act(() => jest.advanceTimersByTime(30_000));
  expect(screen.getByRole("button")).toHaveTextContent("Try Again");
});
```

**`ErrorBoundary` — catch, fallback, and `onError` callback**
```ts
// src/components/Error/__tests__/ErrorBoundary.test.tsx
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

const Bomb = (): never => { throw new Error("test crash"); };

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test("renders default fallback when child throws", () => {
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
});

test("calls onError prop with the thrown error", () => {
  const onError = jest.fn();
  render(
    <ErrorBoundary onError={onError}>
      <Bomb />
    </ErrorBoundary>
  );
  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({ message: "test crash" }),
    expect.any(Object)
  );
});

test("renders custom fallback when provided", () => {
  render(
    <ErrorBoundary fallback={(err) => <p>Custom: {err.message}</p>}>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByText("Custom: test crash")).toBeInTheDocument();
});
```

**`errorRouter` — status code to URL mapping**
```ts
// src/lib/utils/__tests__/errorRouter.test.ts
import { navigateToErrorPage } from "../errorRouter";

beforeEach(() => {
  Object.defineProperty(window, "location", {
    value: { href: "", pathname: "/en/dashboard" },
    writable: true,
  });
});

test("routes 401 to /unauthorized with from param", () => {
  navigateToErrorPage(401, "/dashboard/orders");
  expect(window.location.href).toMatch("/en/unauthorized?from=");
});

test("routes 403 to /forbidden", () => {
  navigateToErrorPage(403);
  expect(window.location.href).toBe("/en/forbidden");
});

test("routes 429 to /rate-limit", () => {
  navigateToErrorPage(429);
  expect(window.location.href).toBe("/en/rate-limit");
});

test("routes 503 to /maintenance", () => {
  navigateToErrorPage(503);
  expect(window.location.href).toBe("/en/maintenance");
});

test("routes 500 to /error", () => {
  navigateToErrorPage(500);
  expect(window.location.href).toBe("/en/error");
});

test("routes 0 to /network-error", () => {
  navigateToErrorPage(0);
  expect(window.location.href).toBe("/en/network-error");
});

test("does nothing for non-error status codes", () => {
  navigateToErrorPage(200);
  expect(window.location.href).toBe("");
});
```

---

### 5. Pre-Deployment Verification Checklist

Run through every item manually before each release:

```
□ /en/djnjfd                Custom not-found UI (app/not-found.tsx) · NOT the black default
□ /en/product-details/x    If slug missing → notFound() → [locale]/not-found.tsx renders
□ /en/unauthorized          Amber icon · Sign In button · ?from= param preserved in link
□ /en/forbidden             Red icon · Back to Homepage only · NO sign-in button
□ /en/network-error         Slate icon · Retry button reloads the page
□ /en/maintenance           Indigo icon · Check Again reloads the page
□ /en/error                 Rose icon · Try Again reloads the page
□ /en/rate-limit            Orange icon · 30s countdown · button enables at 0
□ Throw in any page         error.tsx catches it · ServerError UI shown · reset() works
□ Throw in layout           global-error.tsx catches it · inline-styled fallback shown
□ ErrorBoundary wrapping    Only the wrapped section shows fallback · rest of page intact
□ Backend down (kill server) Home page navigates to /en/network-error · NO toast · single request in Network tab
□ Token expired (no cookie) After refresh failure → logout → /en/unauthorized
□ CUSTOMER visits /dashboard Middleware redirects to / · does NOT reach /forbidden
□ All error routes accessible without auth (no redirect loop)
```
