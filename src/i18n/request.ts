import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({requestLocale}) => {
  // Static for now, we'll change this later
//   const locale = "th";
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

/**
 * creates a request-scoped configuration object, which you can use
 * to provide messages and other options based on the user’s locale to Server Components.
 */
