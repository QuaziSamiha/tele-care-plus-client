"use client";

import { useTranslations } from "next-intl";
import { LuMail } from "react-icons/lu";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useContactInfo } from "../hooks/useContact";

export default function ContactInfoPanel() {
  const t = useTranslations("ContactPage");
  const { data: response, isLoading } = useContactInfo();
  const info = response?.data;

  const heading = info?.heading ?? t("sectionTitle");
  const description = info?.description ?? `${t("desc1")}\n\n${t("desc2")}`;
  const hotlineLabel = info?.hotline
    ? `Hotline Number : ${info.hotline}`
    : t("hotline");
  const lineId = info?.lineId ?? t("phone");
  const email = info?.email ?? t("email");

  if (isLoading) {
    return (
      <div className="w-full lg:w-2/5 order-1 lg:order-2 flex flex-col gap-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/5 order-1 lg:order-2 flex flex-col gap-6 text-slate-600">
      <h2 className="text-2xl font-bold text-slate-800">{heading}</h2>

      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
        {description}
      </p>

      <div className="bg-[#344154] text-white px-6 py-4 rounded-sm inline-block w-fit mt-2">
        <p className="font-medium tracking-wide">{hotlineLabel}</p>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="text-slate-500">
            <BiMessageRoundedDetail size={22} />
          </div>
          <p className="font-medium text-slate-800">{lineId}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-500">
            <LuMail size={22} />
          </div>
          <p className="font-medium text-slate-800">{email}</p>
        </div>
      </div>
    </div>
  );
}
