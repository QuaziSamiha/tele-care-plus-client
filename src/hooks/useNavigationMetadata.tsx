"use client";

import { useParams, usePathname } from "next/navigation";

/**
 * Custom hook to extract path and locale metadata.
 * Useful for active link styling and locale-aware routing.
 */
export const useNavigationMetadata = () => {
  const pathName = usePathname();
  const params = useParams();

  // Ensure we safely cast the locale, defaulting to a string
  const currentLocale = (params?.locale as string) || "en";

  /**
   * Helper to check if a specific dashboard path is active.
   * Handles the locale prefix automatically.
   */
  const isPathActive = (href: string) => {
    // Matches both localized paths and root-relative paths
    return pathName === `/${currentLocale}${href}` || pathName === href;
  };
  const isHome = pathName.endsWith(`/${currentLocale}`) || pathName === `/${currentLocale}`;

  return {
    pathName,
    currentLocale,
    isPathActive,
    params,
    isHome
  };
};
