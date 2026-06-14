import { IGenericErrorResponse } from "@/types/response.type";

/**
 * Derives the current locale from the browser URL path.
 * Falls back to "en" if the locale segment is not recognized.
 */
function getCurrentLocale(): string {
  if (typeof window === "undefined") return "en";
  const segment = window.location.pathname.split("/")[1];
  return segment === "en" || segment === "th" ? segment : "en";
}

/**
 * Performs a hard navigation to the appropriate error page.
 * Use this outside React context (e.g., axios interceptors).
 *
 * Deliberately uses window.location (not router.push) so that
 * auth state and stale React Query cache are fully reset on load.
 */
export function navigateToErrorPage(
  statusCode: number,
  fromPath?: string,
): void {
  if (typeof window === "undefined") return;

  const locale = getCurrentLocale();
  const from = encodeURIComponent(fromPath ?? window.location.pathname);

  const destinations: Record<number, string> = {
    0:   `/${locale}/network-error`,
    401: `/${locale}/unauthorized?from=${from}`,
    403: `/${locale}/forbidden`,
    429: `/${locale}/rate-limit`,
    503: `/${locale}/maintenance`,
  };

  const destination =
    destinations[statusCode] ??
    (statusCode >= 500 ? `/${locale}/error` : null);

  if (destination) {
    window.location.href = destination;
  }
}

/**
 * Maps an IGenericErrorResponse (from axios interceptor) to an
 * error page redirect. Call from React Query onError callbacks or
 * component-level catch blocks.
 */
export function handleApiError(
  error: IGenericErrorResponse,
  options?: {
    /** Skip redirect and return false so caller can handle differently */
    onlyRedirectOn?: number[];
  },
): boolean {
  const { statusCode } = error;
  const shouldRedirect =
    !options?.onlyRedirectOn ||
    options.onlyRedirectOn.includes(statusCode);

  if (shouldRedirect && [401, 403, 429, 503].includes(statusCode)) {
    navigateToErrorPage(statusCode);
    return true;
  }
  return false;
}
