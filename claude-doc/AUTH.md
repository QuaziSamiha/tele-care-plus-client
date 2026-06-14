# Auth Module — Technical Documentation

> **Scope:** Authentication system covering sign-up, sign-in, token management, automatic token refresh, and Google OAuth. Written for developers joining the project or revisiting this module after time away.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [Core Concept — Dual-Token Strategy](#3-core-concept--dual-token-strategy)
4. [Sign-Up Flow](#4-sign-up-flow)
5. [Sign-In Flow](#5-sign-in-flow)
6. [Automatic Token Refresh](#6-automatic-token-refresh)
7. [Social Auth (Google OAuth)](#7-social-auth-google-oauth)
8. [Validation Schemas](#8-validation-schemas)
9. [API & HTTP Layer](#9-api--http-layer)
10. [Auth Layout & Hero Panel](#10-auth-layout--hero-panel)
11. [Auth Route Loading State](#11-auth-route-loading-state)
12. [Auth Page Architecture](#12-auth-page-architecture)
13. [Security Decisions](#13-security-decisions)
14. [Type Reference](#14-type-reference)
15. [What Is Not Yet Complete](#15-what-is-not-yet-complete)

---

## 1. Architecture Overview

The auth system is split across three distinct layers that have clearly separated responsibilities:

```
┌─────────────────────────────────────────────────────────────┐
│  UI LAYER                                                   │
│  src/modules/auth/components/                               │
│  SignUp · SignIn · ForgotPassword · OtpVerification         │
│  React Hook Form + Zod — client-side only                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  HOOK / SERVICE LAYER                                       │
│  src/modules/auth/hooks/                                    │
│  useSignUp · useLogin · useSocialAuth                       │
│  src/modules/auth/services/auth.service.ts                  │
│  React Query mutations — wraps all API calls                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  HTTP / TOKEN LAYER                                         │
│  src/lib/axios/axiosInstance.ts                             │
│  src/modules/auth/actions/auth.actions.ts  (Server Actions) │
│  Axios instance + interceptors + Next.js cookie management  │
└─────────────────────────────────────────────────────────────┘
```

**Key architectural decision:** The backend (NestJS) is the single source of truth for authentication. NextAuth is used only as an OAuth handshake provider for Google — its session is cleared immediately after the backend JWT is obtained. Every protected API call uses the NestJS-issued JWT, not a NextAuth session.

---

## 2. File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   ├── _components/
│   │   │   │   └── AuthHeroPanel.tsx       ← decorative left panel, private to this route group
│   │   │   ├── layout.tsx                  ← structural shell only (no font/CSS imports)
│   │   │   ├── loading.tsx                 ← Suspense skeleton for all auth pages (group-level)
│   │   │   ├── signup/page.tsx
│   │   │   ├── signin/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── otp-verification/page.tsx
│   │   └── layout.tsx                      ← ROOT LAYOUT: fonts, globals.css, providers
│   └── api/auth/[...nextauth]/route.ts     ← NextAuth API handler
│
├── modules/auth/
│   ├── actions/
│   │   └── auth.actions.ts                 ← Server Actions: read/write HTTP-only cookies
│   ├── components/
│   │   ├── signup/SignUp.tsx
│   │   ├── signin/SignIn.tsx
│   │   ├── forgotPassword/ForgotPassword.tsx
│   │   └── otpVerification/OtpVerification.tsx
│   ├── config/
│   │   └── auth.config.ts                  ← NextAuth configuration (Google provider)
│   ├── constants/
│   │   └── auth.constants.ts               ← cookie key names
│   ├── hooks/
│   │   ├── useLogin.ts
│   │   ├── useSignUp.ts
│   │   └── useSocialAuth.ts
│   ├── schemas/
│   │   ├── signup.schema.ts
│   │   ├── signin.schema.ts
│   │   └── forgot-password.schema.ts
│   ├── services/
│   │   └── auth.service.ts                 ← login · socialLogin · getNewAccessToken · logout
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── next-auth.d.ts                  ← NextAuth type augmentation
│   └── utils/
│       ├── auth.utils.ts                   ← getUserInfo · isLoggedIn
│       └── jwt.utils.ts                    ← client-side JWT decode (no verification)
│
├── lib/
│   ├── axios/axiosInstance.ts              ← Axios instance + request/response interceptors
│   ├── schemas/phone.schema.ts             ← reusable Thai phone Zod validator
│   └── utils/cookies.utils.ts             ← js-cookie wrapper (get + remove only)
│
├── constants/
│   ├── common.constants.ts                 ← APP_NAME and shared constants
│   └── api/
│       ├── auth.api.ts                     ← AUTH_API paths (login · social · refresh · logout)
│       ├── user.api.ts                     ← USER_API paths (create-user)
│       └── _version.ts                     ← single-point API version prefix utility
│
├── config/
│   └── env.config.ts                       ← T3 Env — typed, validated environment variables
│
└── services/
    └── api.service.ts                      ← generic mutation wrapper used by usePost
```

---

## 3. Core Concept — Dual-Token Strategy

This is the most important concept in the auth system. Understanding it explains every decision about cookies, server actions, and the axios interceptor.

```
┌─────────────────────────────────┬──────────────────────────────────────────┐
│  ACCESS TOKEN                   │  REFRESH TOKEN                           │
├─────────────────────────────────┼──────────────────────────────────────────┤
│  Cookie name: "accessToken"     │  Cookie name: "refreshToken"             │
│  httpOnly: false                │  httpOnly: true                          │
│  secure: true (prod only)       │  secure: true (prod only)                │
│  sameSite: "lax"                │  sameSite: "lax"                         │
├─────────────────────────────────┼──────────────────────────────────────────┤
│  Readable by browser JavaScript │  INVISIBLE to browser JavaScript         │
│  → Axios interceptor reads it   │  → Only readable via Next.js Server      │
│    and attaches it to every     │    Actions (cookies() API)               │
│    API request as Bearer token  │  → Sent automatically with requests      │
│                                 │    because withCredentials: true         │
├─────────────────────────────────┼──────────────────────────────────────────┤
│  Short-lived (backend decides   │  Long-lived                              │
│  expiry)                        │  Used only to get a new access token     │
└─────────────────────────────────┴──────────────────────────────────────────┘
```

**Why two separate cookies instead of one?**

A single HTTP-only cookie for everything would be more secure against XSS but would require server-side middleware to attach the token to every API call. The split approach allows the Axios interceptor (running in the browser) to read and attach the access token, while the refresh token stays completely inaccessible to any JavaScript — including malicious scripts injected via XSS.

**Why Server Actions for cookie writes?**

Browser JavaScript cannot set an `httpOnly` cookie. Only the server can. Next.js Server Actions (`"use server"`) run on the server, giving access to the `cookies()` API from `next/headers`. The `refreshCreate` and `accessTokenCreate` server actions are the only place tokens are written.

```typescript
// src/modules/auth/actions/auth.actions.ts

export async function refreshCreate(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_KEY, token, {
    httpOnly: true,   // ← browser JS cannot read or steal this
    secure: IS_PRODUCTION,
    sameSite: "lax",
  });
}

export async function accessTokenCreate(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, token, {
    httpOnly: false,  // ← Axios interceptor must be able to read this
    secure: IS_PRODUCTION,
    sameSite: "lax",
  });
}
```

**Why `cookieHelper` only has `get` and `remove`, not `set`?**

`cookieHelper` uses `js-cookie` (a browser-side library). Writing tokens from the browser would bypass the server and could not set `httpOnly`. The `set` method is intentionally absent — all writes go through server actions.

---

## 4. Sign-Up Flow

Sign-up creates a new user account. No token is returned on success — the user is redirected to sign in.

### Flow Diagram

```
/signup page
    │
    ▼
SignUp.tsx  (react-hook-form + zodResolver)
    │
    │  handleSubmit → onSubmit(formData)
    │
    │  Payload transform (schema field → API field):
    │    name          → profile.firstName
    │    email         → email
    │    phone         → phone
    │    password      → password
    │    confirmPassword → (dropped, never sent)
    │
    ▼
useSignUp(onSuccess)
    │  thin wrapper around usePost(USER_API.paths.CREATE)
    ▼
apiService.mutation("POST", "/user/create-user", payload)
    │
    ▼
axiosInstance POST /user/create-user
    │  No Authorization header (new user has no token)
    │
    ├── HTTP 2xx → usePost.onSuccess
    │               toast.success(message)
    │               onSuccess(data) → router.push("/signin")
    │
    └── HTTP 4xx/5xx → axiosInstance response interceptor
                        normalizes error → IGenericErrorResponse
                        usePost.onError → toast.error(message)
                        form stays usable, user remains on /signup
```

### Validation Rules (signup.schema.ts)

| Field | Rule | Error message |
|---|---|---|
| name | required, min 1 char | "Name is required" |
| email | required, valid email format | "Email is required" / "Invalid email address" |
| phone | Thai phone format (see below) | "Phone must be a valid Thai format..." |
| password | min 6 characters | "Password must be at least 6 characters long" |
| confirmPassword | must match password (cross-field `.refine`) | "Password not matched" |

**Thai Phone Format (`src/lib/schemas/phone.schema.ts`)**

Accepts three patterns after stripping spaces, dashes, and parentheses:

```
Mobile:        0[689]\d{8}     →  e.g. 0812345678
Landline:      0[2-57]\d{7}    →  e.g. 021234567
International: \+66\d{8,9}     →  e.g. +66812345678
```

This validator is exported as a reusable Zod schema (`thaiPhoneSchema`) and can be composed into any other schema that needs phone validation.

---

## 5. Sign-In Flow

Sign-in authenticates credentials and stores both tokens in cookies, then redirects by role.

### Flow Diagram

```
/signin page
    │
    ▼
SignIn.tsx  (react-hook-form + zodResolver)
    │
    ▼
useLogin(onSuccess)
    │  useMutation wrapping authService.login()
    ▼
authService.login(credentials)
    │  POST /auth/login  (no Authorization header — interceptor skips login endpoint)
    │
    ├── HTTP 2xx → response: { access_token, refresh_token }
    │               ↓
    │               Promise.all([
    │                 refreshCreate(refresh_token),   ← server action, sets httpOnly cookie
    │                 accessTokenCreate(access_token) ← server action, sets readable cookie
    │               ])
    │               ↓
    │               onSuccess(access_token) called
    │               ↓
    │               SignIn.tsx decodes JWT → reads role
    │               ↓
    │               role === "ADMIN"    → router.push("/dashboard/admin-dashboard")
    │               role === "CUSTOMER" → router.push("/my-account")
    │               ↓
    │               toast.success("Logged in successfully")
    │
    └── HTTP 4xx/5xx → toast.error(error.message)
```

### Role-Based Redirect

After login, the access token is decoded client-side using `jwtDecode` (no signature verification — the backend already validated it). The `role` field inside the payload determines where the user lands:

```typescript
// src/modules/auth/utils/jwt.utils.ts
export const getDecodedToken = <T extends object>(token: string): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
};
```

```typescript
// IDecodedToken shape
{
  sub: number;       // user ID
  email: string;
  role: "ADMIN" | "CUSTOMER" | null;
  name?: string;
  iat?: number;
  exp: number;
}
```

### Checking Auth State Anywhere in the App

```typescript
import { isLoggedIn, getUserInfo } from "@/modules/auth/utils/auth.utils";

isLoggedIn();   // true if access token cookie exists
getUserInfo();  // returns decoded IDecodedToken or null
```

> **Note:** `isLoggedIn()` only checks for the presence of the cookie, not expiry. Expiry is handled automatically by the axios interceptor via the token refresh flow.

---

## 6. Automatic Token Refresh

The most technically complex part of the auth system. When any API request returns a 401 (token expired), the interceptor transparently fetches a new access token and retries the original request — without the calling component knowing anything happened.

### The Problem This Solves

Without this, every expired-token situation would log the user out, forcing them to sign in again. With it, the session is silently extended as long as the refresh token is valid.

### How It Works

```
Any API request → 401 Unauthorized
        │
        ├── Is a refresh already in progress?
        │     YES → queue this request (add to refreshSubscribers[])
        │            wait for onRefreshed() to replay it with the new token
        │
        └── NO → set isRefreshing = true, set _retry = true on this request
                  │
                  ▼
                  authService.getNewAccessToken()
                  │  Uses raw axios (NOT axiosInstance) to POST /auth/refresh
                  │  Why raw axios? → axiosInstance's response interceptor would
                  │  catch a 401 on /auth/refresh and trigger another refresh,
                  │  creating an infinite loop. Raw axios breaks the cycle.
                  │
                  ├── Refresh SUCCESS
                  │     accessTokenCreate(newToken)  ← update cookie
                  │     onRefreshed(newToken)         ← replay all queued requests
                  │     retry original request        ← transparent to the component
                  │     isRefreshing = false
                  │
                  └── Refresh FAILED (refresh token also expired)
                        authService.logout()          ← clear both cookies
                        isRefreshing = false
                        user must sign in again
```

### Why Raw Axios for the Refresh Call

```typescript
// src/modules/auth/services/auth.service.ts

getNewAccessToken: async () => {
  const refreshToken = cookieHelper.get(REFRESH_TOKEN_KEY);
  return axios.post(                    // ← plain axios, NOT axiosInstance
    `${env.NEXT_PUBLIC_API_BASE_URL}${AUTH_API.paths.REFRESH}`,
    { refreshToken },
  );
},
```

`axiosInstance` has a response interceptor that triggers on every 401. If the refresh endpoint itself returns 401, using `axiosInstance` would trigger the interceptor again, which would call `getNewAccessToken` again — infinite loop. Using raw `axios` bypasses the interceptor entirely.

### The Request Queue Pattern

When a token expires, multiple requests may be in-flight simultaneously. Without the queue, all of them would try to refresh at the same time, causing multiple concurrent refresh calls and race conditions.

```typescript
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];          // clear the queue after replay
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}
```

Only the first 401 triggers a refresh. Every subsequent 401 that arrives while `isRefreshing === true` is parked in the queue. Once the new token arrives, `onRefreshed()` replays all queued requests at once.

---

## 7. Social Auth (Google OAuth)

Social auth uses a two-system handshake: NextAuth handles the Google OAuth protocol, then the result is immediately forwarded to the NestJS backend to get a NestJS JWT.

### Architecture Decision

NextAuth session is **not** used as the app's auth mechanism. It is used solely as a convenient Google OAuth handler. Once the NestJS tokens are obtained, the NextAuth session is cleared (`signOut({ redirect: false })`), making the NestJS JWT the single source of truth.

### Flow Diagram

```
User clicks "Continue with Google"
    │
    ▼
signIn("google") from next-auth/react
    │  NextAuth handles Google OAuth redirect + callback
    ▼
NextAuth session populated with Google data
    │  (email, name, image, provider, providerId)
    ▼
useSocialAuth hook detects status === "authenticated"
    │  Fires only once per session (hasSyncedRef prevents repeat calls)
    ▼
authService.socialLogin(payload)
    │  POST /auth/social-auth
    │  Payload: { email, firstName, providerId, provider, image }
    │
    ├── SUCCESS → Promise.all([refreshCreate, accessTokenCreate])
    │             signOut({ redirect: false })   ← NextAuth session cleared
    │             onSuccess() → router.push("/dashboard")
    │
    └── FAILURE → toast.error(message)
                  signOut({ redirect: false })   ← clear failed session
```

### NextAuth Configuration

```typescript
// src/modules/auth/config/auth.config.ts

callbacks: {
  async jwt({ token, account }) {
    // account is only present on first sign-in
    // persist provider data into JWT at that point
    if (account) {
      token.provider = account.provider;
      token.idToken = account.id_token;
    }
    return token;
  },
  async session({ session, token }) {
    // only expose what client components need
    // never forward the full JWT to the client
    session.provider = token.provider ?? "";
    session.sub = token.sub ?? "";
    return session;
  },
},
```

> **Current status:** Social auth UI (Google button) is commented out in `SignUp.tsx` and `SignIn.tsx`. The hook and service are fully implemented and tested. Re-enabling requires uncommenting the button and the `signIn("google")` call.

---

## 8. Validation Schemas

All schemas live in `src/modules/auth/schemas/` and use Zod. They are inferred to TypeScript types so form values and API payloads are always in sync.

### Signup Schema

```typescript
// src/modules/auth/schemas/signup.schema.ts

export const signUpSchema = z.object({
  name:            z.string().min(1),
  email:           z.string().min(1).email(),
  phone:           thaiPhoneSchema,             // from src/lib/schemas/phone.schema.ts
  password:        z.string().min(6),
  confirmPassword: z.string().min(1),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Password not matched", path: ["confirmPassword"] }
);

export type SignUpFormValues = z.infer<typeof signUpSchema>;
```

### Signin Schema

```typescript
export const SignInSchema = z.object({
  email:    z.string().min(1).email(),
  password: z.string().min(6),
});
```

### Forgot Password Schema

```typescript
export const ForgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
});
```

### Composing the Phone Validator

`thaiPhoneSchema` is exported separately from `src/lib/schemas/phone.schema.ts` so it can be reused in any schema that needs a phone field — not just auth:

```typescript
import { thaiPhoneSchema } from "@/lib/schemas/phone.schema";

const checkoutSchema = z.object({
  phone: thaiPhoneSchema,
  // ...
});
```

---

## 9. API & HTTP Layer

### API Path Constants

All API paths are defined as `as const` objects inside `src/constants/api/`. This means:
- Paths are string literals (TypeScript narrows them to their exact values)
- No magic strings anywhere in the app
- Renaming an endpoint is a single change in one file

```typescript
// src/constants/api/auth.api.ts
export const AUTH_API = {
  paths: {
    LOGIN:   "/auth/login",
    SOCIAL:  "/auth/social-auth",
    REFRESH: "/auth/refresh",
    LOGOUT:  "/auth/logout",
  },
} as const;
```

### API Versioning Hook

`src/constants/api/_version.ts` exports a `v()` utility that prepends a version prefix to every path. Currently a no-op — but enabling versioning across the entire app is a one-line change:

```typescript
// CURRENT: no prefix
export const v = <T extends string>(path: T): T => path;

// TO ENABLE v1 — change only this line:
export const v = <T extends string>(path: T) => `/v1${path}` as `/v1${T}`;
```

Every API constant uses `v()`, so the change propagates automatically.

### Generic Post Hook (`usePost`)

`src/hooks/api/usePost.ts` is a typed React Query mutation wrapper used by `useSignUp` and other non-auth mutation hooks:

```
Component
  → usePost<T>(endpoint, onSuccess?, onError?)
    → apiService.mutation("POST", endpoint, data)
      → axiosInstance(...)
        → response interceptor normalizes errors
      → onSuccess fires only when statusCode 2xx
      → onError fires on HTTP error or interceptor rejection
```

The generic `<T>` is the type of the `data` field inside the success response. For sign-up, it is the created user object.

### Axios Instance Configuration

```
baseURL:         env.NEXT_PUBLIC_API_BASE_URL   (default: http://localhost:5001/api/v1)
timeout:         60 000 ms
withCredentials: true   ← sends cookies cross-origin (needed for refresh token)
```

**Request interceptor** attaches the Bearer token to every request, skipping `/auth/login` and `/auth/refresh` (which must not carry a stale or absent token).

**Response interceptor** on error:
1. Handles 401 with the queue-based refresh mechanism described in Section 6
2. Normalizes all errors to `IGenericErrorResponse` so components never have to handle raw Axios errors

---

## 10. Auth Layout & Hero Panel

### Structure

The `(auth)` route group has two files working together:

**`layout.tsx`** — structural shell only:
```
flex h-screen overflow-hidden
├── <AuthHeroPanel />       ← desktop-only left column
└── right column
    └── <main>
        └── <div max-w-120>
            └── {children}  ← signin / signup / otp / forgot-password form
```

**`_components/AuthHeroPanel.tsx`** — purely presentational left panel:
- Background image (`login.png`)
- Logo + brand name overlay (top-left)
- Brand tagline overlay (bottom-left)
- Hidden below `lg` breakpoint (`max-lg:hidden`)
- Zero business logic, zero hooks, zero state

### Why `_components/` and Not `modules/auth/components/`

`modules/auth/components/` contains domain flow components (SignUp, SignIn, ForgotPassword, OtpVerification) — components that own hooks, form state, and API calls.

`AuthHeroPanel` is layout chrome. It has no domain behavior. The `_components/` folder is the Next.js App Router convention for route-private sub-components that are not route segments. The underscore prefix is a self-documenting constraint: *"this component is private to the `(auth)` route group."*

### Font and Globals Are in Root Layout Only

`src/app/[locale]/layout.tsx` is the single place where:
- `globals.css` is imported
- `Poppins` is instantiated and applied via `poppins.variable` on `<html>`
- `antialiased` is applied

The auth layout imports none of these. They cascade down from the root layout automatically.

---

## 11. Auth Route Loading State

### What It Is

`src/app/[locale]/(auth)/loading.tsx` is a Next.js App Router convention file. Placing it inside the `(auth)` route group causes Next.js to automatically wrap `{children}` in a `<Suspense>` boundary. The loading component renders inside that boundary while the page chunk is being fetched or rendered.

### Why One File Covers All Four Auth Pages

A single `loading.tsx` at the group level applies to every page inside `(auth)/` — signup, signin, forgot-password, and otp-verification. All four forms share the same visual shape (heading + fields + button), so one generic skeleton is accurate for all of them. Four individual `loading.tsx` files would be near-identical and harder to maintain.

### What Stays Visible During Loading

Because `loading.tsx` only wraps `{children}`, the layout shell mounts immediately and stays stable throughout navigation:

```
AuthLayout renders immediately — never re-renders
├── AuthHeroPanel      ← always visible, zero flicker
└── <main>
    └── <div max-w-120>
        └── <Suspense fallback={<AuthLoading />}>
                └── {children}   ← only this slot shows the skeleton
            </Suspense>
```

The hero panel on the left is never part of the Suspense boundary, so it never flashes or disappears during page transitions.

### When the Skeleton Shows

| Scenario | Without `loading.tsx` | With `loading.tsx` |
|---|---|---|
| First visit on slow connection | Right column blank until JS loads | Form skeleton appears immediately |
| Client-side navigation between auth pages (`/signin` → `/signup`) | Brief white flash in the right column | Smooth skeleton → form transition |
| JS bundle loading for the page chunk | No indicator | User sees a meaningful placeholder |

### The Skeleton Design

```tsx
// src/app/[locale]/(auth)/loading.tsx

export default function AuthLoading() {
  return (
    <div className="w-full max-w-120 mx-auto space-y-8 animate-pulse">
      {/* heading rows */}
      <div className="space-y-3">
        <div className="h-9 w-3/4 rounded-lg bg-neutral-200" />
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
      </div>
      {/* three field rows — visual midpoint between signin (2) and signup (5) */}
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-neutral-200" />   {/* label */}
            <div className="h-11 w-full rounded-lg bg-neutral-200" />  {/* input */}
          </div>
        ))}
      </div>
      {/* submit button */}
      <div className="h-11 w-full rounded-lg bg-neutral-300" />
    </div>
  );
}
```

**Design decisions:**
- `animate-pulse` — CSS-only Tailwind utility, no JavaScript needed, no `"use client"` required
- Three field rows — signin has 2 fields, signup has 5; three is the visual midpoint that looks correct for both
- `bg-neutral-300` on the button — slightly darker than field skeletons to preserve visual hierarchy
- No spinner — a spinner floating in an otherwise empty form panel looks broken; a form-shaped skeleton communicates exactly what is loading

---

## 12. Auth Page Architecture

### The Pattern Every Auth Page Follows

All four auth pages (`signup`, `signin`, `forgot-password`, `otp-verification`) follow an identical structure:

```tsx
// src/app/[locale]/(auth)/signup/page.tsx

import type { Metadata } from "next";
import SignUp from "@/modules/auth/components/signup/SignUp";

export const metadata: Metadata = {
  title: "Sign Up | Essence Lab",
  description: "Create your Essence Lab account to access science-backed healthcare products.",
};

export default function SignUpPage() {
  return <SignUp />;
}
```

This 10-line file is intentional, not lazy. It is the correct App Router page pattern.

### Why the Page Is a Server Component

No `"use client"` directive appears on the page. This means it is a **React Server Component (RSC)** by default. The page shell renders on the server — zero JavaScript is sent to the browser for the page itself. Only the imported `<SignUp />` client component ships JS to the browser.

```
Server renders:          Client receives:
SignUpPage (RSC)    →    HTML shell (instant)
  └── <SignUp />   →    <SignUp /> JS bundle (interactive form)
```

This separation gives the fastest possible Time to First Byte while keeping full interactivity for the form.

### Why `dynamic()` and `React.lazy()` Are Not Used

Three conditions justify explicit lazy loading with `next/dynamic`. `<SignUp />` meets none of them:

| Condition | Justifies `dynamic()` | Does `<SignUp />` qualify? |
|---|---|---|
| Heavy dependency (chart library, rich text editor, map) | Yes | No — RHF + Zod are already in the bundle |
| Browser-only APIs that break SSR (`window`, `document`) | Yes — use `{ ssr: false }` | No — RHF and Zod are SSR-safe |
| Conditionally rendered component (modal, drawer) | Yes — defer until first open | No — always rendered immediately |

Beyond those three conditions, `dynamic()` is unnecessary because **Next.js App Router automatically code-splits every Client Component**. When a Server Component imports a Client Component, the bundler creates a separate JS chunk for it. `<SignUp />` is already in its own chunk without any manual intervention.

### Why `loading.tsx` Replaces Component-Level `<Suspense>`

The `loading.tsx` at the route group level already wraps `{children}` — which includes this page — inside a `<Suspense>` boundary. Adding another `<Suspense>` or a `dynamic()` loading state inside the page would create a redundant nested boundary:

```
(auth)/loading.tsx                 ← Suspense boundary already here
└── SignUpPage                     ← this page is already inside Suspense
    └── <SignUp />                 ← no additional Suspense needed
```

The correct place for the loading skeleton is at the layout level, once, for all auth pages — not duplicated in each page file.

### `import type` for Type-Only Imports

`Metadata` is a TypeScript type, not a runtime value. Using `import type` is the correct approach:

```typescript
import type { Metadata } from "next";  // ✅ stripped at build time, never reaches the bundle
import { Metadata } from "next";       // ❌ treated as a value import — unnecessary bundle overhead
```

This applies to any import used only for type annotations. TypeScript's `verbatimModuleSyntax` compiler option enforces this automatically when enabled.

### Metadata Override Pattern

The auth `layout.tsx` defines fallback metadata:

```typescript
// layout.tsx — fallback for any auth page that forgets to set metadata
export const metadata: Metadata = {
  title: "Auth | Essence Lab",
  description: "Secure access to Essence Lab e-commerce.",
};
```

Each page overrides this with its own specific title and description. Next.js merges metadata from layout → page, with the page always winning on conflicts:

| Page | Title in browser tab |
|---|---|
| `/signup` | Sign Up \| Essence Lab |
| `/signin` | Sign In \| Essence Lab |
| `/forgot-password` | Forgot Password \| Essence Lab |
| `/otp-verification` | OTP Verification \| Essence Lab |
| Any future page without metadata | Auth \| Essence Lab ← fallback from layout |

### When This Pattern Would Change

The current pattern (static metadata + thin page + no data fetching) is correct for all auth pages as they stand today. It would change under two specific future requirements:

| Future requirement | What changes |
|---|---|
| Page needs user-specific title (e.g., "Welcome back, Alex") | `export const metadata` → `export async function generateMetadata({ params })` |
| Component needs to be loaded only after user interaction (e.g., a heavy onboarding wizard) | Wrap only that component in `dynamic(() => import(...), { loading: () => <Skeleton /> })` |

Neither applies to sign-up, sign-in, forgot-password, or OTP — so the current pattern holds.

---

## 13. Security Decisions

| Decision | Reason |
|---|---|
| Refresh token in `httpOnly` cookie | Cannot be read by JavaScript → immune to XSS token theft |
| Access token in non-`httpOnly` cookie | Must be readable by Axios interceptor in the browser |
| Cookie writes via Server Actions only | Browser JS cannot set `httpOnly` — server-side write is the only option |
| `secure: true` in production | Token cookies travel only over HTTPS in production |
| `sameSite: "lax"` | Blocks cross-site request forgery while allowing normal top-level navigation |
| `withCredentials: true` on axiosInstance | Ensures cookies are sent with cross-origin requests to the API server |
| Raw axios for refresh endpoint | Breaks the interceptor loop — prevents infinite 401 cycle |
| JWT decoded client-side without verification | Verification is the backend's job. The frontend reads `role` and `exp` for UX only. An attacker forging a JWT would be rejected by the backend on the next request. |
| NextAuth session cleared after social login | Prevents two competing auth sessions. NestJS JWT is the sole authority. |
| `IS_PRODUCTION` flag for `secure` cookie | `secure: true` requires HTTPS — breaks `localhost` in development |

---

## 14. Type Reference

```typescript
// src/modules/auth/types/auth.types.ts

type TUserRole      = "ADMIN" | "CUSTOMER" | null;
type TAuthProvider  = "GOOGLE" | "FACEBOOK" | "APPLE" | null;

interface IDecodedToken {
  sub:    number;       // user ID (JWT subject claim)
  email:  string;
  role:   TUserRole;
  name?:  string;
  iat?:   number;       // issued at
  exp:    number;       // expiration timestamp
}

interface ILoginCredentials {
  email:    string;
  password: string;
}

interface ISocialLoginPayload {
  email:      string;
  firstName:  string;
  lastName?:  string;
  providerId: string;
  provider:   string;
  image?:     string;
}

interface IAuthTokens {
  access_token:  string;
  refresh_token: string;
}

interface IRefreshTokenResponse {
  accessToken: string;   // flat shape — not wrapped in IGenericResponse
}
```

**Important:** Login and social-login endpoints return `{ access_token, refresh_token }` (snake_case). The refresh endpoint returns `{ accessToken }` (camelCase). These are different shapes — handle them separately.

---

## 15. What Is Not Yet Complete

| Feature | Status | Location |
|---|---|---|
| OTP Verification | UI built, no backend wired | `src/modules/auth/components/otpVerification/OtpVerification.tsx` |
| Forgot Password | Navigates to `/otp-verification`, no API call | `src/modules/auth/components/forgotPassword/ForgotPassword.tsx` |
| Social Auth UI | Hook + service complete, button commented out | `SignUp.tsx` + `SignIn.tsx` — uncomment button + `signIn("google")` call |
| Password max length | No upper bound on password field | `signup.schema.ts` — add `z.string().min(6).max(64)` |
| Logout endpoint call | `authService.logout()` deletes cookies but does not call `POST /auth/logout` on the backend | `auth.service.ts` — wire up `AUTH_API.paths.LOGOUT` |
| Token expiry on cookie | Cookie has no `maxAge` — expires when browser closes | `auth.actions.ts` — add `maxAge` matching the backend's token TTL |
