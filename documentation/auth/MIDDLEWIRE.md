This code is a **Next.js Middleware** file (`middleware.ts`). In Next.js, middleware intercepts incoming HTTP requests before they are completed. This specific middleware is doing three main things:

1. **Internationalization (i18n):** Handling multi-language routing (e.g., `/en/home` vs `/th/home`).
2. **Authentication:** Checking if a user is logged in by looking at their JWT cookies.
3. **Authorization (RBAC):** Restricting access to certain routes based on whether the user is an `ADMIN`, `CUSTOMER`, or a guest.

Here is a step-by-step breakdown of how the code works:

### 1. Initialization and i18n

```typescript
// ✅ Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);
```

This initializes the `next-intl` middleware using your custom `routing` configuration. This handles redirecting users to their preferred language (like Thai or English) and setting up language cookies/headers.

### 2. The Core Middleware Function

```typescript
export function middleware(req: NextRequest) {
  // ✅ Run intl middleware FIRST
  const intlResponse = intlMiddleware(req);
```

When a request comes in, the _first_ thing it does is pass the request through the internationalization middleware. The result (`intlResponse`) is stored. This ensures that any redirects or responses we send later maintain the correct language headers.

### 3. Extracting Authentication Data (Tokens)

```typescript
  const accessToken = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY)?.value;
  // ...
  if (accessToken) {
    try {
      const { role, exp } = jwtDecode<IDecodedToken>(accessToken);
      userRole = role;
      isExpired = exp * 1000 < Date.now();
    } catch { ... }
  }
```

The middleware grabs the `accessToken` and `refreshToken` from the user's cookies.
If an access token exists, it uses `jwt-decode` to read the payload without needing a secret key. It extracts:

- `role`: The user's role (e.g., "ADMIN" or "CUSTOMER").
- `exp`: The expiration time to check if the token is already expired (`isExpired`).

### 4. Categorizing the Route

```typescript
const isDynamicPublicRoute = pathname.startsWith("/product-details/");
const isPublic =
  (ROUTE_CONFIG.PUBLIC as readonly string[]).includes(pathname) ||
  isDynamicPublicRoute;
const isAdminPath = ROUTE_CONFIG.ADMIN.some((route) =>
  pathname.startsWith(route),
);
const isCustomerPath = ROUTE_CONFIG.CUSTOMER.some((route) =>
  pathname.startsWith(route),
);
```

It looks at the requested URL (`req.nextUrl.pathname`) and checks it against lists defined in your `ROUTE_CONFIG`:

- **Public routes:** Anyone can view these (e.g., the homepage, or dynamic paths like `/product-details/123`).
- **Admin routes:** Paths meant only for administrators.
- **Customer routes:** Paths meant only for logged-in customers.

### 5. Role-Based Access Control (RBAC) Rules

This is where the traffic directing happens based on the rules:

- **Rule A (No Auth Pages for Logged-In Users):** If a user is already logged in and tries to go to a login or register page, they are redirected away. Admins are sent to `/dashboard`, and others to `/` (home).
- **Rule B (Silent Token Refresh Allow):** If the access token is expired, but they have a refresh token, it lets the request through. _(Note: This usually implies your client-side code or an API route will handle generating the new token shortly after)._
- **Rule C (Allow Public Access):** If the route is marked as public, let them through immediately by returning the `intlResponse`.
- **Rule E (Protect Admin Pages):** If the route is an Admin path, but the user's role is _not_ `"ADMIN"`, they are kicked back to the home page (`/`).
- **Rule F (Protect Customer Pages):** If the route is a Customer path, but the user is _not_ a `"CUSTOMER"`:
  - If they are an Admin, they get sent to the Admin dashboard.
  - Otherwise, they get sent to the home page.

If none of the blocking rules hit, it defaults to returning the `intlResponse`, allowing the request to proceed normally.

### 6. The Matcher Configuration

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(th|en)/:path*",
  ],
};
```

This tells Next.js **when** to run this middleware.

- It explicitly **ignores** internal Next.js requests, API routes (`/api/*`), static files (like images or CSS), and the favicon. This is crucial for performance so the middleware doesn't run on every single image load.
- It explicitly **runs** on the root URL (`/`) and all language-prefixed URLs (`/th/...` or `/en/...`).
