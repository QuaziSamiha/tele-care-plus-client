"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContactSendMessageFormValues,
  ContactSendMessageSchema,
} from "../schemas/contact.send-message.schema";
import InputField from "@/components/shared/form/InputField";
import TextAreaField from "@/components/shared/form/TextAreaField";
import { useTranslations } from "next-intl";
import { usePost } from "@/hooks/api/usePost";
import { CONTACT_API } from "@/constants/api";

export default function ContactForm() {
  const t = useTranslations("ContactPage");

  const { trigger, control, handleSubmit, reset } =
    useForm<ContactSendMessageFormValues>({
      resolver: zodResolver(ContactSendMessageSchema),
      defaultValues: { name: "", email: "", phone: "", message: "" },
    });

  const { mutate, isPending } = usePost(CONTACT_API.paths.SEND, () => {
    reset();
  });

  const onSubmit: SubmitHandler<ContactSendMessageFormValues> = (data) => {
    mutate(data as unknown as Record<string, unknown>);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <InputField
          name="name"
          inputType="text"
          labelName={t("nameLabel")}
          placeholderText={t("namePlaceholder")}
          control={control}
          trigger={trigger}
          isRequired
        />

        <InputField
          labelName={t("phoneLabel")}
          placeholderText={t("phonePlaceholder")}
          name="phone"
          inputType="text"
          control={control}
          trigger={trigger}
        />

        <InputField
          labelName={t("emailLabel")}
          name="email"
          placeholderText={t("emailPlaceholder")}
          inputType="email"
          control={control}
          trigger={trigger}
          isRequired
        />

        <TextAreaField
          labelName={t("messageLabel")}
          placeholderText={t("messagePlaceholder")}
          name="message"
          control={control}
          trigger={trigger}
          rowNo={24}
          isRequired
        />

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full bg-mauve-700 rounded-md text-textPrimary font-semibold text-base py-2.5 px-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : t("sendButton")}
        </button>
      </form>
    </div>
  );
}
