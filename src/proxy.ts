import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ROUTE_CONFIG } from "./constants/routes.constants";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "./modules/auth/constants/auth.constants";
import { IDecodedToken, TUserRole } from "./modules/auth/types/auth.types";
import { getDecodedToken } from "./modules/auth/utils/jwt.utils";

//* INITIALIZE next-intl MIDDLEWARE - TO HANDLE MULTI LANGUAGE ROUTING (CUSTOM CONFIGURATION)
const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
  //* SERVER ACTIONS CARRY A "Next-Action" HEADER. RETURNING ANY REDIRECT OR REWRITE HERE
  //* GIVES THE RSC FLIGHT CLIENT AN HTML PAGE INSTEAD OF A BINARY PAYLOAD, WHICH CAUSES
  //* "AN UNEXPECTED RESPONSE WAS RECEIVED FROM THE SERVER" IN THE BROWSER.
  //* RBAC IS ENFORCED AT THE PAGE-NAVIGATION LEVEL (GET REQUESTS) — NOT ON ACTION CALLS.
  if (req.headers.has("Next-Action")) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(req);

  const { pathname } = req.nextUrl;

  const path: string = pathname.replace(/^\/(en|th)(\/|$)/, "/"); //* REMOVE LOCALE PREFIX (/en, /th)

  const accessToken = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_KEY)?.value;

  let userRole: TUserRole = null;
  let isExpired = false;
  let isLoggedIn = Boolean(accessToken);

  if (accessToken) {
    const decoded = getDecodedToken<IDecodedToken>(accessToken);

    if (decoded) {
      userRole = decoded.role as TUserRole;
      isExpired = decoded.exp * 1000 < Date.now();
    } else {
      userRole = null;
      isLoggedIn = false;
    }
  }

  // ==============================
  // * ROUTE CHECKS
  // ==============================

  const isDynamicPublicRoute: boolean =
    path.startsWith("/product-details/") ||
    path.startsWith("/blog-details/") ||
    path.startsWith("/combo-product-details/");

  const isPublic: boolean =
    ROUTE_CONFIG.PUBLIC.some((route) => route === path) || isDynamicPublicRoute;

  const isAdminPath: boolean = ROUTE_CONFIG.ADMIN.some((route) =>
    path.startsWith(route),
  );

  const isCustomerPath: boolean = ROUTE_CONFIG.CUSTOMER.some((route) =>
    path.startsWith(route),
  );

  // ==============================
  // * RBAC RULES
  // ==============================

  // * Rule 1: Prevent logged-in users from visiting auth pages
  if (isLoggedIn && ROUTE_CONFIG.AUTH.some((route) => route === path)) {
    return NextResponse.redirect(
      new URL(
        userRole === "ADMIN" ? "/dashboard/admin-dashboard" : "/my-account",
        req.url,
      ),
    );
  }

  // ✅ Rule 2: Allow expired token if refresh token exists
  if (isExpired && refreshToken) {
    return intlResponse;
  }

  // ✅ Rule 3: Public routes always allowed
  if (isPublic) {
    return intlResponse;
  }

  // * Rule 4: Redirect ADMIN → dashboard (from home)
  if (isLoggedIn && userRole === "ADMIN" && path === "/") {
    return NextResponse.redirect(
      new URL("/dashboard/admin-dashboard", req.url),
    );
  }

  if (isLoggedIn && userRole === "CUSTOMER" && path === "/") {
    return NextResponse.redirect(
      new URL("/my-account", req.url),
    );
  }

  // * Rule 5: PROTECT ADMIN ROUTES — DISTINGUISH BETWEEN "NOT LOGGED IN" AND "WRONG ROLE"
  //* UNAUTHENTICATED → /unauthorized (NEEDS TO SIGN IN FIRST)
  //* AUTHENTICATED BUT NOT ADMIN → /forbidden (SIGNED IN, BUT NO PERMISSION)
  if (isAdminPath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/unauthorized?from=${encodeURIComponent(path)}`, req.url),
      );
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  //* Rule 6: PROTECT CUSTOMER ROUTES — REQUIRE AUTHENTICATION AND CUSTOMER ROLE
  //* UNAUTHENTICATED → /unauthorized (MUST SIGN IN FIRST)
  //* AUTHENTICATED BUT NOT CUSTOMER (E.G. ADMIN) → /forbidden (SIGNED IN, BUT WRONG ROLE)
  if (isCustomerPath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/unauthorized?from=${encodeURIComponent(path)}`, req.url),
      );
    }
    if (userRole !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return intlResponse;
}

// ==============================
// * Matcher Config
// ==============================
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/",
    "/(th|en)/:path*",
  ],
};
