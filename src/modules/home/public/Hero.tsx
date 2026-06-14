"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GoStarFill } from "react-icons/go";

export default function Hero() {
  const t = useTranslations("Home.hero");

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-neutral-950">

      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/home/hero1.png"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-20 w-full container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[100dvh] flex flex-col justify-between py-20 sm:py-24 lg:py-32">

        {/* SOCIAL PROOF — TOP LEFT */}
        <div className="flex items-center gap-4 mt-8 sm:mt-4 lg:mt-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <AvatarGroup className="grayscale hover:grayscale-0 transition-all duration-500 -space-x-3">
            <Avatar className="border-2 border-white/30 shadow-xl w-10 h-10 sm:w-12 sm:h-12 hover:-translate-y-1 transition-transform">
              <AvatarImage src="https://github.com/shadcn.png" alt="Customer" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white/30 shadow-xl w-10 h-10 sm:w-12 sm:h-12 hover:-translate-y-1 transition-transform">
              <AvatarImage src="https://github.com/maxleiter.png" alt="Customer" />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white/30 shadow-xl w-10 h-10 sm:w-12 sm:h-12 hover:-translate-y-1 transition-transform">
              <AvatarImage src="https://github.com/evilrabbit.png" alt="Customer" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-mauve-200">
              <GoStarFill className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 drop-shadow-md" />
              <p className="text-sm sm:text-base font-medium drop-shadow-md tracking-wide">
                {t("rated")}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-mauve-400 font-light drop-shadow-md">
              {t("lovedBy")}
            </p>
          </div>
        </div>

        {/* TITLE AND CTA — BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16 mt-auto">

          {/* BOTTOM LEFT: EYEBROW + HEADLINE */}
          <div className="max-w-3xl flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 ease-out fill-mode-both">

            <div className="flex items-start gap-3 mb-5 sm:mb-7">
              <span className="mt-1.5 h-px w-8 bg-mauve-700 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <p className="text-mauve-600 text-[0.6rem] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                  {t("eyebrowLine1")}
                </p>
                <p className="text-mauve-600 text-[0.6rem] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                  {t("eyebrowLine2")}
                </p>
              </div>
            </div>

            <h1 className="flex flex-col">
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-light tracking-tight drop-shadow-2xl leading-[1.1] text-mauve-100">
                {t("titleTop")}
              </span>
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-bold tracking-tighter drop-shadow-2xl leading-[1.1] text-transparent bg-clip-text bg-linear-to-r from-mauve-100 via-mauve-300 to-mauve-500">
                {t("titleBottom")}
              </span>
            </h1>
          </div>

          {/* BOTTOM RIGHT: SUBTITLE + CTA */}
          <div className="flex flex-col gap-6 lg:items-end text-left lg:text-right max-w-xl lg:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 ease-out fill-mode-both">
            <p className="text-mauve-300 text-base sm:text-lg lg:text-xl leading-relaxed drop-shadow-md font-light italic">
              {t("subtitle")}
            </p>
            <Link
              href="/product"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-mauve-700 px-8 py-4 sm:px-10 sm:py-5 font-semibold text-neutral-900 transition-all duration-300 hover:bg-mauve-600 hover:shadow-[0_0_40px_rgba(var(--mauve-500),0.4)] hover:-translate-y-1 active:translate-y-0"
            >
              <span className="text-sm sm:text-base tracking-wider uppercase">
                {t("cta")}
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
