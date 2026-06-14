# Phase 1 — Full Codebase Audit Report

**Project:** Essence Lab / Thai Health Products (THP)
**Audit Date:** 2026-06-08
**Stack:** Next.js 16 · React 19 · TypeScript (strict) · TanStack Query · Axios · NextAuth · next-intl · Tailwind CSS v4 · shadcn/ui · Zod · React Hook Form

---

## Project Overview

| Metric | Value |
|--------|-------|
| Total TS/TSX Files | ~267 |
| App Routes | 40+ |
| Business Modules | 20 |
| UI Components | 50+ (including shadcn/ui) |
| Custom Hooks | 6 |
| Type Definition Files | 5 |
| i18n Message Files | 2 (EN, TH) |
| Constants Files | 2 |
| Providers | 3 |
| Estimated Lines of Code | 15,000+ |

---

## Root Configuration Summary

### package.json

- Name: `thai-health-product` v0.1.0
- Key dependencies:

| Purpose | Package | Version |
|---------|---------|---------|
| Framework | next | 16.2.2 |
| UI Library | react / react-dom | 19.2.4 |
| Styling | tailwindcss | v4 |
| Data Fetching | @tanstack/react-query | 5.100.9 |
| Tables | @tanstack/react-table | 8.21.3 |
| HTTP Client | axios | 1.15.2 |
| Forms | react-hook-form | 7.73.1 |
| Validation | zod | 4.3.6 |
| Auth | next-auth | 4.24.14 |
| i18n | next-intl | 4.9.1 |
| UI Atoms | shadcn/ui (custom) | — |
| UI Base | radix-ui | 1.4.3 |
| Icons | lucide-react | 1.11.0 |
| Icons (duplicate) | react-icons | 5.6.0 |
| Dates | dayjs | 1.11.20 |
| Utilities | lodash-es | 4.18.1 |
| Notifications | react-toastify | 11.1.0 |
| Cookies | js-cookie | 3.0.5 |
| JWT | jwt-decode | 4.0.0 |
| CVA | class-variance-authority | 0.7.1 |
| Tailwind Merge | tailwind-merge | 3.5.0 |
| Carousel (duplicate) | embla-carousel | 8.6.0 |
| Carousel (duplicate) | keen-slider | 6.8.6 |
| Rich Text | react-quill | 3.8.3 |
| OTP Input | input-otp | 1.4.2 |

### tsconfig.json

- Target: ES2017
- Strict mode: enabled
- Path alias: `@/*` → `./src/*`
- Module resolution: bundler
- Plugins: next

### next.config.ts

- next-intl plugin integrated
- Image optimization disabled in dev, enabled in prod
- Remote image patterns: `localhost:5001`, three hardcoded office IPs, `api.thaihealth.com`
- App environment detection via `NEXT_PUBLIC_APP_ENV` > `NODE_ENV`

### ESLint

- next/core-web-vitals preset
- TypeScript support enabled

### Tailwind CSS v4

- No `tailwind.config.js` — uses CSS-based configuration in `globals.css`
- PostCSS plugin: `@tailwindcss/postcss`

---

## Folder Structure

```
src/
├── actions/                    Server Actions (cookie management)
│   └── auth.actions.ts
├── app/                        Next.js App Router
│   ├── api/auth/[...nextauth]/ NextAuth API route
│   └── [locale]/               i18n dynamic segment
│       ├── (auth)/             Auth routes: signin, signup, forgot-password, otp
│       ├── (customer)/         Authenticated customer: my-account, my-order, wishlist
│       ├── (dashboard)/        Admin: 12 modules
│       │   └── dashboard/
│       │       ├── admin-dashboard/
│       │       ├── blog/, category/, combo/, contact/
│       │       ├── home/, inventory/, order/, product/
│       │       ├── set-up/, support/, user/
│       ├── (public)/           Customer-facing: product, blog, combo, contact, cart
│       ├── layout.tsx          Root layout with all providers
│       ├── loading.tsx         Global loading state
│       └── not-found.tsx
├── components/
│   ├── ui/                     shadcn/ui base components (18 files)
│   ├── shared/                 Reusable cross-feature components (11 subdirectories)
│   │   ├── button/
│   │   ├── carousel/
│   │   ├── common/
│   │   ├── customTab/
│   │   ├── dropdown/
│   │   ├── footer/
│   │   ├── form/
│   │   ├── loading/
│   │   ├── modal/
│   │   ├── navbar/
│   │   ├── pagination/
│   │   ├── productSection/
│   │   ├── quantityCounter/
│   │   ├── table/tanstackTable/
│   │   └── tooltip/
│   ├── customer/               Customer-specific components
│   └── dashboard/              Admin-only components
├── config/
│   ├── authOptions.ts          NextAuth config (Google provider)
│   └── envConfig.ts            Environment variable exports
├── constants/
│   ├── auth.constants.ts       Token key names
│   └── navigation.ts           Nav link definitions with icons
├── hooks/
│   ├── api/
│   │   ├── useGet.ts
│   │   ├── useGetAll.ts
│   │   ├── usePost.ts
│   │   └── usePatch.ts
│   ├── table/
│   │   └── useTableModals.tsx
│   └── useNavigationMetadata.tsx
├── i18n/
│   └── routing.ts              next-intl config
├── lib/
│   ├── axios/axiosInstance.ts  Axios with auth interceptors and token refresh
│   ├── schemas/phone.schema.ts Thai phone Zod schema
│   ├── utils/
│   │   ├── cookies.utils.ts
│   │   ├── string.utils.ts
│   │   └── truncateText.ts
│   └── utils.ts                cn() — clsx + tailwind-merge
├── messages/
│   ├── en.json                 English translations
│   └── th.json                 Thai translations
├── modules/                    Domain-driven modules (20 total)
│   ├── adminDashboard/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── blog/
│   ├── cart/
│   ├── category/
│   ├── checkout/
│   ├── combo/
│   ├── comboProduct/
│   ├── contact/
│   ├── home/
│   ├── inventory/
│   ├── order/
│   ├── product/
│   ├── setUp/
│   ├── support/
│   ├── user/
│   └── wishlist/
├── providers/
│   ├── NextAuthProvider.tsx
│   ├── QueryProvider.tsx
│   └── TanstackProvider.tsx    (legacy/duplicate — to be removed)
├── services/
│   └── api.service.ts          Centralized mutation handler
├── styles/
│   └── globals.css
├── types/
│   ├── common.types.ts
│   ├── form.type.ts
│   ├── navigation.type.ts
│   ├── response.type.ts
│   └── share-component.type.ts
└── middleware.ts               MISSING — critical security gap
```

---

## Module Inventory

Each module follows this internal pattern:

```
module/
├── hooks/       Module-specific React hooks (TanStack Query)
├── types/       TypeScript interfaces and enums
├── schemas/     Zod validation schemas
├── services/    API calls via axiosInstance
├── components/  Module UI components
├── public/      Customer-facing components
└── dashboard/   Admin-facing components
```

### Key Module Details

**auth/**
- Services: `login()`, `socialLogin()`, `getNewAccessToken()`, `logout()`
- Hooks: `useLogin`, `useSocialAuth`
- Types: `IDecodedToken`, `TUserRole` (ADMIN | CUSTOMER)
- Schemas: SignIn, SignUp, ForgotPassword (Zod)

**user/**
- `useUser()` hook — decodes JWT and returns `currentUser`, `isAdmin`, `isCustomer`, `isAuthenticated`, `role`, `name`
- Bug: memoized on mount only; does not re-decode when session changes

**product/**
- Types: `ProductType` (SIMPLE | VARIABLE | COMBO), `ProductStatus`, `StockStatus`, `DiscountType`
- `IProduct`: 40+ fields (bilingual, pricing, images, variants)
- Hooks: `useAdminProduct()`, `useGetProductOptions()`

**cart/**
- Storage: localStorage only (no backend sync)
- Generates composite ID: `productId:variantId`
- Computed: subtotal, discount, deliveryCharge, estimatedTotal, totalQuantity
- Hydration: `isHydrated` flag pattern (SSR-unsafe — see SM2)
- Cross-tab sync via custom `thp:cart:change` event

**category/**
- Types: `ICategory` (bilingual, hierarchical, SEO metadata, featured flag)
- Type conflict: `IOptionCategory` (simple) vs `ICategory` (full) used inconsistently

**Shared Type Definitions**

`response.type.ts`:
```typescript
IMeta             { totalItems, itemCount, itemsPerPage, totalPages, currentPage }
IResponseSuccess  { statusCode, success, message, data, meta? }
IGenericErrorResponse { statusCode, message, errorMessages, success }
IGenericResponse<T>   { success, statusCode, message, data: T }
```

`form.type.ts`: `IInputField`, `IPasswordField`, `ISubmitButton`, `ITextArea`, `TImageInput`, `IImageInput`, `IMediaInput`, `ISingleSelectOption`, `ISingleSelectSearch`, `ITextEditor`

`share-component.type.ts`: `ICustomTable`, `ITablePagination`, `ITableModals`, `ICustomTooltip`, `ICustomModalPrimary`, `IAddButton`, `ITabList`, `ITabContent`, `ICustomTabGroup`

---

## API & Data Layer

### Axios Instance (`lib/axios/axiosInstance.ts`)

- Base URL: `NEXT_PUBLIC_API_BASE_URL`
- Timeout: 60 seconds
- Request interceptor: attaches `Authorization: Bearer {accessToken}` to non-auth endpoints
- Response interceptor:
  - On 401: queues failed requests, calls `getNewAccessToken()`, retries all queued requests
  - On refresh failure: clears session, logs out
  - Standardizes all errors to `IGenericErrorResponse`

### API Hooks (`hooks/api/`)

| Hook | Purpose | Signature |
|------|---------|-----------|
| `useGet<T>` | Fetch single resource | `(endpoint, queryKey[], queryParams?, shouldFetch?, options?)` |
| `useGetAll<T>` | Fetch paginated list | `(endpoint, queryKey[], queryParams?, options?, shouldFetch?)` |
| `usePost<T>` | Create resource | `(endpoint, onSuccess?, onError?)` |
| `usePatch<T>` | Update resource | `(endpoint, onSuccess?, onError?)` |

### Service Layer

`services/api.service.ts`: `mutation(method, endpoint, data)` — centralized handler for POST / PATCH / PUT / DELETE.

`modules/auth/services/auth.service.ts`: Module-level service with `login()`, `socialLogin()`, `getNewAccessToken()`, etc.

**Conflict:** Two different service patterns exist and are not unified.

### React Query

- `QueryProvider.tsx` wraps app with `QueryClientProvider`
- No global `defaultOptions` set — every mount refetches (no `staleTime`)
- `ReactQueryDevtools` included in dev

---

## Authentication

- Provider: NextAuth v4 with Google OAuth
- Strategy: JWT
- Callbacks: `jwt` (attach provider + idToken), `session` (expose provider, sub, token to client)
- Custom sign-in page: `/signin`
- Server-side cookies managed via `src/actions/auth.actions.ts` (uses Next.js `cookies()` API)
- Token keys: `ACCESS_TOKEN_KEY = "accessToken"`, `REFRESH_TOKEN_KEY = "refreshToken"` (in `constants/auth.constants.ts`)

---

## i18n

- Library: next-intl v4.9.1
- Locales: `["en", "th"]`
- Default locale: `"en"`
- Locale prefix: `"always"` (e.g. `/en/product`, `/th/product`)
- Server: `getMessages()` in layouts
- Client: `useTranslations()` in `"use client"` components

---

## Audit Findings

### Severity Key

- `CRITICAL` — Exploitable security hole or guaranteed runtime crash in production
- `MAJOR` — Significant quality, performance, or correctness issue
- `MINOR` — Code quality, DX, or maintainability issue

---

### Security

| ID | Issue | Severity |
|----|-------|----------|
| S1 | No `middleware.ts` — `/dashboard/*` routes have zero server-side protection | `CRITICAL` |
| S2 | RBAC is client-side only via `useUser()` — admin UI briefly renders for all users | `CRITICAL` |
| S3 | Three hardcoded office IP addresses committed to `next.config.ts` | `MAJOR` |
| S4 | `envConfig.ts` exports server-only secrets (`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`) from a file importable by client components | `MAJOR` |
| S5 | No CSRF protection audit on non-auth POST mutations | `MINOR` |

**Fix for S1 + S2:** Implement `src/middleware.ts` using `next-auth` `withAuth` + `next-intl` `createMiddleware`. Protect `/dashboard/*` (ADMIN only) and `/[locale]/(customer)/*` (authenticated users).

**Fix for S4:** Split config into `config/server.config.ts` (server-only, never imported in client) and `config/client.config.ts` (`NEXT_PUBLIC_` vars only).

---

### Architecture

| ID | Issue | Severity |
|----|-------|----------|
| A1 | Two conflicting service layers: `src/services/api.service.ts` vs module-level services | `MAJOR` |
| A2 | `TanstackProvider.tsx` is a duplicate of `QueryProvider.tsx` — dead legacy code | `MAJOR` |
| A3 | All providers stacked in root `layout.tsx` — no layered strategy | `MINOR` |
| A4 | Cart and Wishlist are localStorage-only — no backend sync, no cross-device support | `MAJOR` |
| A5 | Axios refresh failure path does not reliably clear all auth state | `MAJOR` |

---

### Component Quality

| ID | Issue | Severity |
|----|-------|----------|
| C1 | `useUser()` memoizes JWT decode on mount only — does not update on login/logout | `CRITICAL` |
| C2 | Providers assembled inline in `layout.tsx` instead of a dedicated `Providers.tsx` | `MINOR` |
| C3 | No `error.tsx` at any route group level — one crash takes down the full page | `MAJOR` |
| C4 | `loading.tsx` only at root level — route segments that fetch data have no loading UI | `MAJOR` |
| C5 | `UnderDevelopment.tsx` placeholder components ship in production bundle | `MINOR` |

---

### Data Fetching

| ID | Issue | Severity |
|----|-------|----------|
| D1 | Public listing pages (`/product`, `/blog`, `/category`) use client-side hooks instead of Server Components — bad for SEO and performance | `MAJOR` |
| D2 | No `staleTime` / `gcTime` set globally in `QueryClient` — every component mount triggers a refetch | `MAJOR` |
| D3 | Axios token refresh uses subscriber queue with no timeout or cancellation fallback | `MAJOR` |
| D4 | `useGet` and `useGetAll` are near-identical — unnecessary duplication | `MINOR` |
| D5 | Only one `<Suspense>` boundary exists (product page) — no streaming fallbacks elsewhere | `MAJOR` |

---

### State Management

| ID | Issue | Severity |
|----|-------|----------|
| SM1 | `useUser()` called independently in multiple components — JWT decoded redundantly on each render | `MAJOR` |
| SM2 | Cart `isHydrated` pattern is not SSR-safe — should use `useSyncExternalStore` | `MAJOR` |
| SM3 | No optimistic updates on mutations — UI waits for full server round-trip | `MINOR` |
| SM4 | Wishlist likely has same SSR hydration issue as cart | `MAJOR` |

---

### Type Safety

| ID | Issue | Severity |
|----|-------|----------|
| T1 | `useGet<T>` / `useGetAll<T>` return `T \| undefined` — callers often skip null checks | `MAJOR` |
| T2 | `envConfig.ts` uses raw `process.env` without Zod validation — missing vars silently become `undefined` | `MAJOR` |
| T3 | `ICategory` vs `IOptionCategory` type mismatch — product hooks and forms use incompatible shapes invisibly | `MAJOR` |
| T4 | Deeply generic form field types (`IInputField<T, Type>`) weaken IDE autocomplete | `MINOR` |
| T5 | No Zod validation on API responses — backend schema changes silently break the frontend | `CRITICAL` |

---

### Performance

| ID | Issue | Severity |
|----|-------|----------|
| P1 | All dashboard module components are eagerly imported — admin bundle ships to all users | `MAJOR` |
| P2 | `next/image` disabled in dev — optimization untested, layout shifts appear in production | `MAJOR` |
| P3 | Both `lucide-react` and `react-icons` installed — doubled icon bundle | `MINOR` |
| P4 | Both `embla-carousel` and `keen-slider` installed — doubled carousel bundle | `MINOR` |
| P5 | No `generateMetadata()` or `generateStaticParams()` on public pages — no SEO | `MAJOR` |
| P6 | `QueryClient` created without `defaultOptions` — aggressive refetching | `MINOR` |

---

### Developer Experience

| ID | Issue | Severity |
|----|-------|----------|
| DX1 | No barrel exports (`index.ts`) — imports require knowing exact file paths | `MAJOR` |
| DX2 | Zero JSDoc on exported functions, hooks, and components | `MINOR` |
| DX3 | No Prettier config — formatting inconsistent across files | `MINOR` |
| DX4 | No `lint-staged` + `husky` — bad code can be committed unchecked | `MINOR` |
| DX5 | Mixed export styles — some default exports, some named, no consistent pattern | `MINOR` |
| DX6 | Zero test files — no Vitest/Jest config exists | `MAJOR` |

---

### Styling

| ID | Issue | Severity |
|----|-------|----------|
| ST1 | Some components use raw string concatenation instead of `cn()` | `MINOR` |
| ST2 | No design token system — colors, spacing, shadows are hardcoded Tailwind class strings | `MAJOR` |
| ST3 | `lucide-react` and `react-icons` render differently at same size values | `MINOR` |

---

### Accessibility

| ID | Issue | Severity |
|----|-------|----------|
| AC1 | Some form fields missing associated `<label>` elements — screen readers cannot associate labels | `MAJOR` |
| AC2 | Interactive `<div>` elements used instead of `<button>` — no keyboard access | `MAJOR` |
| AC3 | No skip-to-content link — keyboard users tab through full navbar on every page | `MINOR` |
| AC4 | Several images missing meaningful `alt` text | `MAJOR` |

---

## Summary Scorecard

| Category | Critical | Major | Minor |
|----------|----------|-------|-------|
| Security | 2 | 2 | 1 |
| Architecture | 0 | 4 | 1 |
| Component Quality | 1 | 3 | 1 |
| Data Fetching | 0 | 4 | 1 |
| State Management | 0 | 3 | 1 |
| Type Safety | 1 | 3 | 1 |
| Performance | 0 | 3 | 3 |
| Developer Experience | 0 | 2 | 4 |
| Styling | 0 | 1 | 2 |
| Accessibility | 0 | 3 | 1 |
| **TOTAL** | **4** | **28** | **16** |

---

## What the Project Does Well

- Clean domain-driven module structure across 20 business modules
- TypeScript strict mode enabled throughout
- Zod + React Hook Form on all forms
- TanStack Query for server state (correct choice)
- JWT token refresh with queue pattern in Axios interceptor
- Bilingual i18n with next-intl (EN + TH)
- shadcn/ui + Tailwind v4 (modern UI stack)
- Route groups for layout isolation without affecting URL structure
- Composite cart item IDs (`productId:variantId`) for variant support
- Cross-tab cart sync via custom DOM events

---

## Proposed Execution Order

Dependency-aware, safest to most impactful:

| Priority | Phase | Key Tasks |
|----------|-------|-----------|
| 1 | Foundation | Env config Zod validation, remove `TanstackProvider`, add Prettier, add lint-staged |
| 2 | Security | `middleware.ts` with RBAC, split server/client config, fix `useUser` refresh bug |
| 3 | API Layer | Zod response parsing, unify service patterns, fix Axios refresh queue timeout |
| 4 | State | `UserContext` provider, SSR-safe cart/wishlist with `useSyncExternalStore` |
| 5 | Components | Error boundaries (`error.tsx`), per-segment `loading.tsx`, barrel exports (`index.ts`) |
| 6 | Performance | Dynamic imports for dashboard, `generateMetadata()`, remove duplicate libraries |
| 7 | Styling | Design tokens in `globals.css`, enforce `cn()`, standardize icon usage |
| 8 | Testing | Vitest setup, tests for critical hooks (`useUser`, `useCart`) and utilities |
| 9 | Docs | JSDoc on all public APIs, README overhaul |

---

## Open Questions Before Implementation

1. Should Cart and Wishlist be synced to a backend API, or remain client-side (localStorage)?
2. Are any modules currently under active development that should not be touched?
3. Should the icon library be standardized to `lucide-react` (remove `react-icons`)?
4. Should the carousel library be standardized to `embla-carousel` (remove `keen-slider`)?
5. Is Vitest the preferred test runner, or is Jest required?
