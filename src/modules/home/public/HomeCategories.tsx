"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IHomeCategory } from "../types/home.type";

interface IProps {
  categories: IHomeCategory[];
  isLoading?: boolean;
}

const PLACEHOLDER_IMAGE = "/images/home/product-placeholder.png";

export default function HomeCategories({ categories, isLoading }: IProps) {
  const t = useTranslations("Home.categories");
  return (
    <section className="w-full flex flex-col gap-8 lg:gap-12">
      <div className="flex items-center justify-between">
        <h2 className="text-neutral-900 font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
          {t("title")}
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl bg-neutral-200 ring-1 ring-neutral-200/50" />
              <div className="flex items-center justify-between px-2">
                <div className="h-5 w-1/2 bg-neutral-200 rounded" />
                <div className="h-4 w-16 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-slate-500 text-sm">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              href={`/product?categoryIds=${category.id}`}
              key={category.id}
              className="group flex flex-col gap-4 focus:outline-none"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 shadow-sm transition-all duration-500 group-hover:shadow-xl ring-1 ring-neutral-200/50">
                <Image
                  src={
                    category.bannerUrl ||
                    category.thumbnailUrl ||
                    category.iconUrl ||
                    PLACEHOLDER_IMAGE
                  }
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>

              <div className="flex items-center justify-between px-2">
                <p className="text-neutral-900 font-semibold text-lg md:text-xl group-hover:text-primary-600 transition-colors">
                  {category.name}
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 group-hover:text-primary-600 transition-colors">
                  <span>{t("explore")}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
