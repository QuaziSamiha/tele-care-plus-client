"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { GoStarFill } from "react-icons/go";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { testimonials } from "../data/home.data";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const empty = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <GoStarFill key={`f${i}`} className="text-yellow-400" />
      ))}
      {hasHalf && <FaRegStarHalfStroke className="text-yellow-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <GoStarFill key={`e${i}`} className="text-slate-300" />
      ))}
    </div>
  );
}

function AvatarRow({ src, name, address }: { src: string; name: string; address: string }) {
  return (
    <div className="flex items-center gap-4 mt-auto">
      <div className="relative h-12 w-12 shrink-0">
        <Image src={src} alt={name} fill className="rounded-full object-cover" />
      </div>
      <div>
        <p className="text-slate-900 font-bold">{name}</p>
        <p className="text-slate-500 text-xs">{address}</p>
      </div>
    </div>
  );
}

export default function CustomerFeedback() {
  const t = useTranslations("Home.feedback");
  const [t0, t1, t2, t3, t4] = testimonials;

  return (
    <section className="py-14 px-4 mx-auto">
      <div className="w-full flex flex-col gap-2.5 justify-center items-center mb-10">
        <p className="text-lg text-slate-500 font-medium tracking-wide">
          {t("eyebrow")}
        </p>
        <h2 className="text-center text-slate-800 font-bold text-3xl md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
      </div>

      {/*
        Mobile  (default)  : 1 col — all cards stacked
        Tablet  (sm 640px) : 2 col — Featured full-width, others paired
        Desktop (xl 1280px): 4 col — complex bento layout
          Row 1: [Featured] [Somchai] [Daniel ×2]
          Row 2: [Featured] [Anan   ×2] [Sophie]
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* ── FEATURED ── Dr. Kavitra (tall green card) */}
        <div className="sm:col-span-2 xl:col-span-1 xl:row-span-2 bg-emerald-50 rounded-sm border border-emerald-100 overflow-hidden flex flex-col justify-between">
          <div className="p-8 flex flex-col gap-6">
            <StarRating rating={t0.ratings} />
            <p className="text-slate-800 leading-relaxed italic">
              {t0.description}
            </p>
            <div>
              <p className="text-slate-900 font-bold">{t0.name}</p>
              <p className="text-slate-500 text-sm">{t0.address}</p>
            </div>
          </div>
          {/* xl: overflow image; mobile/sm: centred image */}
          <div className="flex justify-center pb-6 px-8 xl:justify-start xl:pb-0 xl:px-8 xl:-mr-20 xl:-mt-12 xl:items-end">
            <Image
              src={t0.imageSrc}
              alt={t0.name}
              width={368}
              height={379}
              className="w-40 sm:w-56 xl:w-92 h-auto object-contain"
            />
          </div>
        </div>

        {/* ── STANDARD ── Somchai */}
        <div className="col-span-1 p-8 bg-neutral-50 rounded-sm border border-neutral-100 flex flex-col gap-6">
          <StarRating rating={t1.ratings} />
          <p className="text-slate-700 leading-relaxed line-clamp-4">
            {t1.description}
          </p>
          <AvatarRow src={t1.imageSrc} name={t1.name} address={t1.address} />
        </div>

        {/* ── WIDE ── Daniel (avatar on mobile/sm → absolute portrait image on xl) */}
        <div className="col-span-1 xl:col-span-2 xl:relative bg-neutral-50 rounded-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 flex flex-col gap-6 h-full xl:pr-40">
            <StarRating rating={t2.ratings} />
            <p className="text-slate-700 leading-relaxed">{t2.description}</p>

            {/* avatar — visible on mobile & sm */}
            <div className="xl:hidden">
              <AvatarRow src={t2.imageSrc} name={t2.name} address={t2.address} />
            </div>

            {/* name only — visible on xl (image takes the avatar role) */}
            <div className="hidden xl:block mt-auto">
              <p className="text-slate-900 font-bold">{t2.name}</p>
              <p className="text-slate-500 text-xs">{t2.address}</p>
            </div>
          </div>

          {/* portrait image — xl only, absolutely positioned on the right */}
          <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-1/3 h-full">
            <Image
              src={t2.imageSrc}
              alt={t2.name}
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* ── WIDE ── Anan */}
        <div className="col-span-1 xl:col-span-2 p-8 bg-neutral-50 rounded-sm border border-neutral-100 flex flex-col gap-6">
          <StarRating rating={t3.ratings} />
          <p className="text-slate-700 leading-relaxed line-clamp-4">
            {t3.description}
          </p>
          <AvatarRow src={t3.imageSrc} name={t3.name} address={t3.address} />
        </div>

        {/* ── STANDARD ── Sophie */}
        <div className="col-span-1 p-8 bg-neutral-50 rounded-sm border border-neutral-100 flex flex-col gap-6">
          <StarRating rating={t4.ratings} />
          <p className="text-slate-700 leading-relaxed line-clamp-4">
            {t4.description}
          </p>
          <AvatarRow src={t4.imageSrc} name={t4.name} address={t4.address} />
        </div>

      </div>
    </section>
  );
}
