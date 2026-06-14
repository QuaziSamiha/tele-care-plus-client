"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as string;

  // console.log(currentLocale)
  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "th" : "en";

    // * router.replace will change /en/product to /th/product while keeping the same page and scroll position.
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="gap-2 font-bold text-slate-700 flex items-center bg-white py-0.5 px-2 rounded cursor-pointer"
    >
      <Globe className="w-4 h-4" />
      {currentLocale.toUpperCase()}
    </button>
  );
}
