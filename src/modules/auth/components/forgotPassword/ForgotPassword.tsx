"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ForgotPasswordFormValues,
  ForgotPasswordSchema,
} from "../../schemas/forgot-password.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/shared/form/InputField";
import { Link } from "@/i18n/navigation";
import SubmitButton from "@/components/shared/form/SubmitButton";

export default function ForgotPassword() {
  const t = useTranslations("Auth");
  const { trigger, control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full `max-w-[480px]` mx-auto space-y-8">
      {/* Header Section */}
      <header className="text-start space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-textPrimary">
          Forgot Password
        </h1>
        <p className="text-muted-foreground">
          Enter Your email to to change your password & get verification code
        </p>
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

        <Link href="otp-verification">
          <SubmitButton
            // isPending={isPending}
            submitTitle="Next"
          />
        </Link>
      </form>

      {/* Footer Link */}
      <footer className="text-center text-sm">
        <span className="text-muted-foreground">Back to</span>
        <Link href="/signin" className="ml-1 font-semibold text-mauve-800">
          {/* {t("signUpLink")} */}
          Sign In
        </Link>
      </footer>
    </div>
  );
}
