# Middleware → Proxy Migration

## What Changed

In Next.js 16, the `middleware` file convention was deprecated and replaced with `proxy`. The functionality is identical — only the naming convention changed.

## Files Changed

| Action | File |
|--------|------|
| Deleted | `src/middleware.ts` |
| Created | `src/proxy.ts` |

## Code Diff

**Before (`src/middleware.ts`)**
```ts
export default function middleware(req: NextRequest) {
  // ...
}
```

**After (`src/proxy.ts`)**
```ts
export function proxy(req: NextRequest) {
  // ...
}
```

Two things changed:
1. File renamed from `middleware.ts` → `proxy.ts`
2. Function changed from `export default function middleware` → `export function proxy` (named export, not default)

Everything else — RBAC logic, i18n setup, route checks, cookie handling, and matcher config — remained exactly the same.

## What the Proxy Does

The `src/proxy.ts` file runs before every matched request and handles:

### Internationalization (i18n)
Initializes `next-intl` middleware to handle multi-language routing between English (`/en`) and Thai (`/th`).

### Authentication
Reads `accessToken` and `refreshToken` from cookies. Decodes the JWT to extract the user's `role` and expiry (`exp`).

### Role-Based Access Control (RBAC)

| Rule | Condition | Action |
|------|-----------|--------|
| 1 | Logged-in user visits an auth page (`/signin`, `/signup`) | Redirect ADMIN → `/dashboard/admin-dashboard`, CUSTOMER → `/my-account` |
| 2 | Access token expired but refresh token exists | Allow through (client handles refresh) |
| 3 | Route is public | Allow through |
| 4 | ADMIN or CUSTOMER visits `/` | Redirect to their respective home |
| 5 | Non-ADMIN visits an admin route | Redirect to `/` |
| 6 | (Optional, commented out) Non-logged-in visits customer route | Redirect to `/login` |

### Matcher Config

```ts
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(th|en)/:path*",
  ],
};
```

Runs on all routes except API routes, Next.js internals, and static files.

## Reference

- Next.js 16 proxy docs: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- Official deprecation notice: https://nextjs.org/docs/messages/middleware-to-proxy

---

## Incident Report & Root Cause Analysis

### Symptom

Visiting `localhost:3000/en` returned the default Next.js 404 page (black background, "This page could not be found.") instead of the application's home page. Even for genuinely missing routes, the custom `not-found.tsx` at `src/app/[locale]/not-found.tsx` was never shown — only the built-in fallback.

---

### Issue 1 — Misdiagnosis: Creating `src/middleware.ts`

**What happened:**

The initial diagnosis concluded that `proxy.ts` was not being picked up by Next.js, and that the routing was broken because no middleware was running. A `src/middleware.ts` file was created to re-export the `proxy` function:

```ts
// src/middleware.ts (WRONG — do not recreate)
export { proxy as middleware, config } from "./proxy";
```

**Why this was wrong:**

Next.js 16 deprecated `middleware.ts` entirely and replaced it with `proxy.ts`. The framework now **only** looks for `proxy.ts`. Having both files simultaneously triggers a hard error:

```
Unhandled Rejection: Error: Both middleware file "./src/middleware.ts" and proxy file
"./src/proxy.ts" are detected. Please use "./src/proxy.ts" only.
```

`proxy.ts` was always being picked up correctly. The 404 was caused by something else entirely.

**Fix:** Delete `src/middleware.ts`.

**Lesson:** In Next.js 16, `proxy.ts` replaces `middleware.ts` completely. The file name, function name (`proxy` not `middleware`), and export style (named export, not default) all changed. Never create `middleware.ts` in a Next.js 16+ project.

---

### Issue 2 — The Real 404 Cause: next-intl Locale Resolution Without `setRequestLocale`

**The locale resolution chain in next-intl v4:**

When a Server Component calls `getMessages()` or `getLocale()`, next-intl resolves the locale through this chain (in order):

```
1. getCachedRequestLocale()     ← set explicitly by setRequestLocale(locale)
2. headers().get("X-NEXT-INTL-LOCALE")   ← set by the intl middleware in proxy.ts
```

If both return nothing, the `getRequestConfig` callback receives `requestLocale = undefined`. Depending on the implementation, this either falls back to `defaultLocale` or throws.

**Why the 404 was happening:**

The `[locale]/layout.tsx` was calling `getMessages()` without first calling `setRequestLocale(locale)`. In certain render conditions — particularly on the first cold request or during static analysis — Next.js does not guarantee that the proxy's response headers are visible in the RSC (React Server Component) context before the layout runs. If `headers().get("X-NEXT-INTL-LOCALE")` returns null and `getCachedRequestLocale()` is also empty, `getMessages()` throws an error.

When an error is thrown inside a layout **before** `notFound()` is reached, Next.js has no `error.tsx` boundary to catch it (error boundaries only wrap page content, not the root layout itself). The error propagates up and Next.js falls back to its built-in error handling, which — when no matching `app/not-found.tsx` exists at the root level — renders the default 404 page instead of the custom one.

**The second bug — wrong ordering in layout.tsx:**

```ts
// BEFORE (buggy order)
const messages = await getMessages();       // ← throws if locale context missing
if (!routing.locales.includes(locale)) {   // ← never reached on invalid locale
  notFound();
}
```

If an unsupported locale somehow reached the layout (e.g., a direct URL like `/fr`), `getMessages()` would be called first with an indeterminate locale. `notFound()` was unreachable because the throw happened before it. This also meant the custom not-found page could never render for invalid locales.

---

### Fix — `src/app/[locale]/layout.tsx`

**What changed:**

```ts
// Added import
import { getMessages, setRequestLocale } from "next-intl/server";
```

```ts
// AFTER (correct order)
const { locale } = await params;

// 1. Validate first — before loading anything locale-dependent
if (!routing.locales.includes(locale as never)) {
  notFound();
}

// 2. Seed the React cache so all Server Components in this tree can read the locale
setRequestLocale(locale);

// 3. Now safe to load messages — locale is guaranteed to be valid and cached
const messages = await getMessages();
```

**Why `setRequestLocale` matters:**

`setRequestLocale(locale)` writes the locale into React's per-request cache (via `React.cache`). Once set, any Server Component anywhere in the subtree — layouts, pages, server-only utilities — can call `getLocale()`, `getMessages()`, `getTranslations()`, etc. without needing the proxy to have set the HTTP header. This makes locale resolution deterministic and independent of middleware header propagation.

This is the recommended pattern in next-intl v4 and should be present in every locale layout and page that uses Server Component APIs.

**Why the ordering of `notFound()` matters:**

`notFound()` in Next.js throws a special `NEXT_NOT_FOUND` error. Next.js catches this internally and renders the nearest `not-found.tsx` in the component tree. For the `[locale]` segment, that is `src/app/[locale]/not-found.tsx`.

If any other exception is thrown before `notFound()`, that exception propagates differently — it triggers `error.tsx` or `global-error.tsx`, not the not-found handler. By moving `notFound()` to run before any locale-dependent calls, we guarantee the custom 404 page renders for any unrecognised locale segment.

---

### Why the Custom `not-found.tsx` Wasn't Showing

Even for completely unrecognised routes (e.g., `/en/nonexistent-page`), the custom `not-found.tsx` was not rendering because:

1. The `[locale]` layout was crashing before it could mount
2. A `not-found.tsx` at `app/[locale]/not-found.tsx` only activates after the parent layout successfully mounts — it is a **child** of that layout, not a sibling
3. With the layout crashing, Next.js skipped the entire `[locale]` segment tree and fell back to the root-level not-found handler
4. There is no `app/not-found.tsx` at the project root, so Next.js used its built-in default (the black-background 404 page)

Once the layout is stabilised with `setRequestLocale` and correct `notFound()` ordering, the custom not-found page will render correctly for all 404s within the `[locale]` segment.

---

### Summary of All Changes

| File | Change | Reason |
|------|--------|--------|
| `src/middleware.ts` | Deleted | Next.js 16 rejects this file when `proxy.ts` exists; caused a 500 conflict |
| `src/app/[locale]/layout.tsx` | Added `setRequestLocale(locale)` import and call | Ensures locale is in React cache before `getMessages()` runs; prevents layout crash |
| `src/app/[locale]/layout.tsx` | Moved `notFound()` before `getMessages()` | Ensures custom `not-found.tsx` renders for invalid locales instead of a thrown error |
