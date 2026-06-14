import Cookies from "js-cookie";

export const cookieHelper = {
  get: (key: string): string | undefined => Cookies.get(key),
  //   set: (key: string, value: string, options?: Cookies.CookieAttributes) =>
  //     Cookies.set(key, value, { secure: true, sameSite: "lax", ...options }),
  remove: (key: string) => Cookies.remove(key),
};
