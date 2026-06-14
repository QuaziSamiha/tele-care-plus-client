"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SignInFormValues, SignInSchema } from "../../schemas/signin.schema";
import InputField from "@/components/shared/form/InputField";
import PasswordField from "@/components/shared/form/PasswordField";
import { Link, useRouter } from "@/i18n/navigation";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { useLogin } from "../../hooks/useLogin";
import { useSocialAuth } from "../../hooks/useSocialAuth";
import { getDecodedToken } from "../../utils/jwt.utils";
import type { IDecodedToken } from "../../types/auth.types";

export default function SignIn() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();

  //* READ callbackUrl FROM THE URL — SET BY Unauthorized.tsx WHEN REDIRECTING HERE
  //* SECURITY: ONLY ACCEPT RELATIVE PATHS (STARTS WITH "/") — PREVENTS OPEN REDIRECT ATTACKS
  //* OPEN REDIRECT: ATTACKER CRAFTS /signin?callbackUrl=https://evil.com → USER LANDS ON EVIL SITE
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = rawCallback?.startsWith("/") ? rawCallback : null;

  const redirectAfterLogin = (token: string): void => {
    //* IF A callbackUrl EXISTS, HONOR IT — USER IS RETURNED TO WHERE THEY ORIGINALLY WANTED TO GO
    //* FALLBACK: REDIRECT BY ROLE WHEN NO callbackUrl IS PRESENT (NORMAL LOGIN FLOW)
    if (callbackUrl) {
      router.push(callbackUrl);
      return;
    }
    const decoded = getDecodedToken<IDecodedToken>(token);
    router.push(decoded?.role === "ADMIN" ? "/dashboard/admin-dashboard" : "/my-account");
  };

  const { mutate: login, isPending } = useLogin(redirectAfterLogin);
  const { isPending: isSocialPending } = useSocialAuth(redirectAfterLogin);

  const { trigger, control, handleSubmit } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
    login(data);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: window.location.href });
  };

  return (
    <div className="w-full max-w-120 mx-auto space-y-8">
      {/* Header Section */}
      <header className="text-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-textPrimary">
          {t("signInTitle")}
        </h1>
        <p className="text-muted-foreground">{t("signInSubtitle")}</p>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          labelName={t("email")}
          name="email"
          placeholderText={t("emailPlaceholder")}
          inputType="email"
          control={control}
          trigger={trigger}
          isRequired
        />
        <PasswordField
          labelName={t("password")}
          name="password"
          placeholderText={t("passwordPlaceholder")}
          control={control}
          trigger={trigger}
          isRequired
        />
        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-mauve-800 hover:text-greenPrimary-600 font-medium text-sm cursor-pointer"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <SubmitButton isPending={isPending} submitTitle={t("signInButton")} />
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="grow border-t border-neutral-200"></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-backgroundPrimary px-2 text-muted-foreground">
            {t("orContinueWith")}
          </span>
        </div>
        <div className="grow border-t border-neutral-200"></div>
      </div>

      {/* Social Button */}
      <button
        type="button"
        disabled={isSocialPending}
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-2.5 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
      >
        <FcGoogle className="text-xl" />
        <span>{isSocialPending ? t("syncing") : t("signInGoogle")}</span>
      </button>

      {/* Footer Link */}
      <footer className="text-center text-sm">
        <span className="text-muted-foreground">{t("noAccount")}</span>
        <Link href="/signup" className="ml-1 font-semibold text-mauve-800">
          {t("signUpLink")}
        </Link>
      </footer>
    </div>
  );
}
