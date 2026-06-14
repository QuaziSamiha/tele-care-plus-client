// * Define supported languages here
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"],

  // Default language if none is specified in the URL
  defaultLocale: "en",

  // This ensures that the default locale is always prefixed in the URL (optional but recommended)
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
