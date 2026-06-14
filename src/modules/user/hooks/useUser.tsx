"use client";

import { useMemo } from "react";
import type { IDecodedToken } from "@/modules/auth/types/auth.types";
import { getUserInfo } from "@/modules/auth/utils/auth.utils";

//* RETRIEVES AND MEMOIZES CURRENT USER STATE FROM THE DECODED ACCESS TOKEN
export function useUser() {
  const currentUser = useMemo((): IDecodedToken | null => {
    return getUserInfo();
  }, []);

  return {
    currentUser,
    userId: currentUser?.sub ?? null,
    role: currentUser?.role ?? null,
    name: currentUser?.name ?? null,
    isAdmin: currentUser?.role === "ADMIN",
    isCustomer: currentUser?.role === "CUSTOMER",
    isAuthenticated: !!currentUser,
  };
}
