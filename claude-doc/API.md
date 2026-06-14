# API Constants — Architecture & Usage Guide

## Overview

All backend API endpoint paths and React Query cache keys are centralized under `src/constants/api/`. This system eliminates hardcoded strings scattered across services and hooks, enforces consistent leading slashes, enables one-line API versioning, and co-locates cache keys with the routes they belong to.

---

## File Structure

```
src/constants/api/
  _version.ts       ← internal versioning utility (never import outside this folder)
  auth.api.ts       ← /auth/* paths (login, social, refresh, logout)
  user.api.ts       ← /user/* paths
  category.api.ts   ← /category/* paths + React Query keys
  product.api.ts    ← /product/* paths + React Query keys
  order.api.ts      ← /order/* paths + React Query keys
  blog.api.ts       ← /blog/* paths + React Query keys
  contact.api.ts    ← /contact/* paths + React Query keys
  index.ts          ← barrel: assembles + exports API and named domain objects
```

**Rule:** Every new domain gets its own `<domain>.api.ts` file. Never add paths directly to `index.ts`.

---

## Concept 1 — Single Source of Truth

Before this system, endpoint strings were hardcoded at every call site:

```ts
// scattered across services and hooks — fragile
axiosInstance.post("/auth/login", credentials);
axiosInstance.post("/auth/social-auth", data);
axios.post(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, ...);
```

If the backend renames `/auth/login` to `/auth/signin`, every file must be hunted down manually. A missed one is a silent runtime bug.

Now every path has a single home:

```ts
// auth.api.ts
export const AUTH_API = {
  paths: {
    LOGIN:   v("/auth/login"),
    SOCIAL:  v("/auth/social-auth"),
    REFRESH: v("/auth/refresh"),
    LOGOUT:  v("/auth/logout"),
  },
} as const;
```

Renaming a route is a one-character change in one file.

---

## Concept 2 — `as const` for Literal Type Safety

Without `as const`, TypeScript widens all string values to the `string` type:

```ts
// without as const — TypeScript sees: { paths: { LOGIN: string } }
const AUTH_API = { paths: { LOGIN: "/auth/login" } };

// with as const — TypeScript sees: { readonly paths: { readonly LOGIN: "/auth/login" } }
const AUTH_API = { paths: { LOGIN: "/auth/login" } } as const;
```

The benefit: if you mistype `AUTH_API.paths.LOGINN`, TypeScript throws a compile-time error — the bug is caught before the browser ever runs the code.

**Note:** `as const` applies to static (non-function) values. Dynamic route functions like `BY_SLUG: (slug) => ...` are typed by TypeScript inference — the literal return type `` `/category/category-by-slug/${string}` `` is preserved automatically.

---

## Concept 3 — API Versioning Utility (`_version.ts`)

```ts
// _version.ts
export const v = <T extends string>(path: T): T => path;
```

`v()` is currently a pass-through — it returns the path unchanged. Its purpose is future-proofing.

**When the backend introduces versioning**, change this one line:

```ts
// Before
export const v = <T extends string>(path: T): T => path;

// After — every route in the entire codebase gains the /v1 prefix automatically
export const v = <T extends string>(path: T) => `/v1${path}` as `/v1${T}`;
```

Zero other changes needed across the codebase.

**Why `_` prefix on the filename?**
The underscore signals that `_version.ts` is an internal implementation detail of the `constants/api/` module. It is never imported outside this folder. Consumers only ever import from `index.ts`.

**Why keep it in `constants/api/` and not in a global utils folder?**
Nothing outside this folder ever needs `v()` — consumers only see already-built path strings. Placing it in a global utils folder would expose an internal detail globally and imply it's a general-purpose utility, which it is not.

---

## Concept 4 — Co-located React Query Keys

Domains with GET endpoints carry their React Query cache keys inside the same object as their paths:

```ts
// category.api.ts
export const CATEGORY_API = {
  paths: {
    ALL:         v("/category/all-categories"),
    BY_SLUG:     (slug: string) => v(`/category/category-by-slug/${slug}`),
    ...
  },
  keys: {
    ALL:         ["categories"] as const,
    BY_SLUG:     (slug: string) => ["categories", "detail", slug] as const,
    ALL_ACTIVE:  ["categories", "active"] as const,
    ACTIVE_ROOT: ["categories", "active-root"] as const,
  },
} as const;
```

**Why co-locate keys with paths?**

Without co-location, keys and paths drift apart. A developer renames `/category/all-categories` to `/category/categories` and updates `paths.ALL`, but forgets the key `["categories"]` lives in a separate file. The cache never invalidates. Data goes stale silently.

With co-location, the key is right next to the path. You cannot update one without seeing the other.

**Mutation-only domains (auth, user) have no `keys` object** — they never need cache invalidation because they never populate a query cache.

---

## Concept 5 — Domain-Split File Structure

All paths used to live in one flat file. At scale, a single file:
- Becomes hundreds of lines
- Creates merge conflicts when multiple developers add routes simultaneously
- Makes the scope of a change unclear ("I only changed contact routes, why is auth in this diff?")

Each domain owns its own file. Adding a new domain never touches existing files.

**Adding a new domain — full steps:**

1. Create `src/constants/api/<domain>.api.ts`:

```ts
import { v } from "./_version";

export const REVIEW_API = {
  paths: {
    ALL:    v("/review/all-reviews"),
    CREATE: v("/review/create-review"),
    BY_ID:  (id: string | number) => v(`/review/review-by-id/${id}`),
    DELETE: (id: string | number) => v(`/review/delete-review/${id}`),
  },
  keys: {
    ALL:   ["reviews"] as const,
    BY_ID: (id: string | number) => ["reviews", "detail", String(id)] as const,
  },
} as const;
```

2. Register it in `index.ts`:

```ts
export { REVIEW_API } from "./review.api";
import { REVIEW_API } from "./review.api";

export const API = {
  ...existing,
  REVIEW: REVIEW_API,
} as const;
```

That is the complete process. No other files need changing.

---

## Concept 6 — Barrel Index (`index.ts`)

`index.ts` serves two purposes:

**A. Clean import paths for consumers**

```ts
// Without barrel — consumers must know internal file locations
import { AUTH_API } from "@/constants/api/auth.api";
import { PRODUCT_API } from "@/constants/api/product.api";

// With barrel — one import path, always stable
import { API } from "@/constants/api";
import { AUTH_API, PRODUCT_API } from "@/constants/api";
```

**B. Internal files can be renamed freely**

Renaming `auth.api.ts` → `authentication.api.ts` only requires updating `index.ts`. Every consumer's import path remains `@/constants/api` — no ripple changes.

**C. Controls the public surface**

`_version.ts` is intentionally absent from `index.ts`. Consumers cannot import it. The folder has an explicit inside and an explicit outside.

---

## Usage Reference

### In a service (mutation path)

```ts
import { AUTH_API } from "@/constants/api";

const response = await axiosInstance.post(AUTH_API.paths.LOGIN, credentials);
```

### In a hook (GET path + query key)

```ts
import { CATEGORY_API } from "@/constants/api";

useGetAll(
  CATEGORY_API.paths.ALL,
  CATEGORY_API.keys.ALL,
);
```

### Dynamic route (parameterized path + key)

```ts
import { CATEGORY_API } from "@/constants/api";

useGet(
  CATEGORY_API.paths.BY_SLUG(slug),
  CATEGORY_API.keys.BY_SLUG(slug),
);
```

### Cache invalidation after mutation

```ts
import { PRODUCT_API } from "@/constants/api";

queryClient.invalidateQueries({ queryKey: PRODUCT_API.keys.ALL });
```

### When one file needs multiple domains

```ts
import { API } from "@/constants/api";

axiosInstance.post(API.AUTH.paths.LOGIN, credentials);
useGetAll(API.CATEGORY.paths.ALL, API.CATEGORY.keys.ALL);
```

---

## Complete Domain Reference

| Domain | File | Has Keys |
|--------|------|----------|
| `API.AUTH` | `auth.api.ts` | No — mutations only |
| `API.USER` | `user.api.ts` | No — mutations only |
| `API.CATEGORY` | `category.api.ts` | Yes |
| `API.PRODUCT` | `product.api.ts` | Yes |
| `API.ORDER` | `order.api.ts` | Yes |
| `API.BLOG` | `blog.api.ts` | Yes |
| `API.CONTACT` | `contact.api.ts` | Yes |

---

## Design Decisions

| Decision | Reason |
|----------|--------|
| Leading `/` on all paths | Consistent with axios `baseURL` setup — no ambiguity |
| `paths` and `keys` as sub-objects | Separates concerns within a domain; `as const` works cleanly on static sub-objects |
| Functions for dynamic routes | Parameterized paths cannot be `as const` literals — functions with TypeScript inference are the correct model |
| `_version.ts` stays in `constants/api/` | It is an implementation detail, not a general utility — the `_` prefix enforces this |
| `onLogout` required (not optional) in `authService.logout` | Services must not touch `window` or the router — navigation is always the caller's responsibility |
