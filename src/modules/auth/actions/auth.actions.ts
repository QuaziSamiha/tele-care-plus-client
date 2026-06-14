"use server";

import { cookies } from "next/headers";
import { REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY } from "../constants/auth.constants";

//* NODE_ENV IS SET AUTOMATICALLY BY NEXT.JS — SAFE TO READ DIRECTLY IN SERVER-ONLY FILES
const IS_PRODUCTION = process.env.NODE_ENV === "production";

//* SETTERS

export async function refreshCreate(token: string) {
  const cookieStore = await cookies();
  //* HTTP ONLY TRUE — REFRESH TOKEN MUST NOT BE ACCESSIBLE FROM JAVASCRIPT (XSS PROTECTION)
  cookieStore.set(REFRESH_TOKEN_KEY, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
  });
}

export async function accessTokenCreate(token: string) {
  const cookieStore = await cookies();
  //* HTTP ONLY FALSE — ACCESS TOKEN MUST BE READABLE BY THE AXIOS INTERCEPTOR IN THE BROWSER
  cookieStore.set(ACCESS_TOKEN_KEY, token, {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: "lax",
  });
}

//* DELETE OPERATIONS

export async function refreshDelete() {
  (await cookies()).delete(REFRESH_TOKEN_KEY);
}

export async function accessTokenDelete() {
  (await cookies()).delete(ACCESS_TOKEN_KEY);
}

//* GETTERS

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}
