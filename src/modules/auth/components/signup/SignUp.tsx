"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import InputField from "@/components/shared/form/InputField";
import PasswordField from "@/components/shared/form/PasswordField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { Link, useRouter } from "@/i18n/navigation";
import { SignUpFormValues, signUpSchema } from "../../schemas/signup.schema";
import { useSignUp } from "../../hooks/useSignUp";
import { useSocialAuth } from "../../hooks/useSocialAuth";
import { getDecodedToken } from "../../utils/jwt.utils";
import type { IDecodedToken } from "../../types/auth.types";

export default function SignUp() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const { trigger, control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: createNewUser, isPending } = useSignUp(
    () => router.push("/signin"),
  );

  const { isPending: isSocialPending } = useSocialAuth((token) => {
    const decoded = getDecodedToken<IDecodedToken>(token);
    router.push(decoded?.role === "ADMIN" ? "/dashboard/admin-dashboard" : "/my-account");
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    createNewUser({
      email: data.email,
      password: data.password,
      phone: data.phone,
      profile: { firstName: data.name },
    });
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: window.location.href });
  };

  return (
    <div className="w-full max-w-120 mx-auto space-y-8">
      {/* Header Section */}
      <header className="text-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-textPrimary">
          {t("signUpTitle")}
        </h1>
        <p className="text-muted-foreground">{t("signUpSubtitle")}</p>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          labelName={t("name")}
          name="name"
          placeholderText={t("namePlaceholder")}
          inputType="text"
          control={control}
          trigger={trigger}
          isRequired
        />
        <InputField
          labelName={t("email")}
          name="email"
          placeholderText={t("emailPlaceholder")}
          inputType="email"
          control={control}
          trigger={trigger}
          isRequired
        />
        <InputField
          labelName={t("phone")}
          placeholderText={t("phonePlaceholder")}
          name="phone"
          inputType="text"
          control={control}
          trigger={trigger}
        />
        <PasswordField
          labelName={t("password")}
          name="password"
          placeholderText={t("passwordPlaceholder")}
          control={control}
          trigger={trigger}
          isRequired
        />
        <PasswordField
          labelName={t("confirmPassword")}
          placeholderText={t("confirmPasswordPlaceholder")}
          name="confirmPassword"
          control={control}
          trigger={trigger}
          isRequired
        />
        <SubmitButton isPending={isPending} submitTitle={t("nextButton")} />
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
        onClick={handleGoogleSignUp}
        className="w-full flex items-center justify-center gap-3 py-2.5 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
      >
        <FcGoogle className="text-xl" />
        <span>{isSocialPending ? t("syncing") : t("signUpGoogle")}</span>
      </button>

      {/* Footer Link */}
      <footer className="text-center text-sm">
        <span className="text-muted-foreground">{t("alreadyHaveAccount")}{" "}</span>
        <Link href="/signin" className="ml-1 font-semibold text-mauve-800">
          {t("signInLink")}
        </Link>
      </footer>
    </div>
  );
}
