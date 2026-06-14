/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { accessTokenCreate, refreshCreate } from "@/modules/auth/actions/auth.actions";

export const useSocialAuth = (onSuccess?: (token: string) => void) => {
  const { data: session, status } = useSession();
  const hasSyncedRef = useRef(false);

  const mutation = useMutation({
    mutationFn: authService.socialLogin,
    onSuccess: async (data) => {
      hasSyncedRef.current = true;
      const { access_token, refresh_token } = data.data;

      await Promise.all([
        refreshCreate(refresh_token),
        accessTokenCreate(access_token),
      ]);

      toast.success("Login successful!");

      // Clear NextAuth session — NestJS JWT is the sole auth authority from this point
      await signOut({ redirect: false });

      onSuccess?.(access_token);
    },
    onError: (error: any) => {
      hasSyncedRef.current = true;
      const message =
        error?.message ||
        error?.errorMessages ||
        error?.response?.data?.message ||
        "Social login failed";
      toast.error(message);
      void signOut({ redirect: false });
    },
  });

  useEffect(() => {
    if (
      !hasSyncedRef.current &&
      status === "authenticated" &&
      session?.user &&
      !mutation.isSuccess &&
      !mutation.isPending
    ) {
      const provider = (session as any).provider?.toUpperCase() || "GOOGLE";
      mutation.mutate({
        email: session.user.email!,
        firstName: session.user.name || "User",
        providerId: (session as any).token?.sub || session.user.email!,
        provider,
        image: session.user.image || "",
      });
    }
  }, [status, session, mutation]);

  return mutation;
};
