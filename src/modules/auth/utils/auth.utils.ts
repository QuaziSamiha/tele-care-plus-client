import { ACCESS_TOKEN_KEY } from "@/modules/auth/constants/auth.constants";
import { cookieHelper } from "@/lib/utils/cookies.utils";
import type { IDecodedToken } from "../types/auth.types";
import { getDecodedToken } from "./jwt.utils";

export function getUserInfo(): IDecodedToken | null {
  const token = cookieHelper.get(ACCESS_TOKEN_KEY);
  if (token) {
    return getDecodedToken<IDecodedToken>(token);
  }
  return null;
}

//* PRESENCE OF ANY ACCESS TOKEN IS THE MINIMUM SIGNAL FOR "LOGGED IN" — EXPIRY IS CAUGHT BY THE INTERCEPTOR
export function isLoggedIn(): boolean {
  return !!cookieHelper.get(ACCESS_TOKEN_KEY);
}
