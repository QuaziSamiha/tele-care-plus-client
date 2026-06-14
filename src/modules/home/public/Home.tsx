"use client";

import { Link } from "@/i18n/navigation";
import Hero from "./Hero";
import Image from "next/image";
import HomeCategories from "./HomeCategories";
import PromotionProduct from "./promotionProduct/PromotionProduct";
import HomeComboProduct from "./HomeComboProduct";
import HomeProductSection from "./HomeProductSection";
import ContinuousCarousel from "@/components/shared/carousel/ContinuousCarousel";
import HomeBlogs from "./HomeBlogs";
import CustomerFeedback from "./CustomerFeedback";
import { useTranslations } from "next-intl";
import { useGetHomeData } from "../hooks/usePublicHome";

export default function Home() {
  const t = useTranslations("Home");
  const { data, isLoading } = useGetHomeData();
  const home = data?.data;

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 pb-12 bg-neutral-50/30">
      <Hero />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 flex flex-col gap-16 sm:gap-20 lg:gap-32">
        <Link
          href="/"
          className="block group overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-700 ring-1 ring-neutral-200/50"
        >
          <div className="relative w-full h-[140px] sm:h-[180px] md:h-[200px] lg:h-[200px] xl:h-[200px]">
            <Image
              src="/images/home/promo-banner.png"
              fill
              alt={t("promoBannerAlt")}
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </Link>

        <HomeCategories
          categories={home?.categories ?? []}
          isLoading={isLoading}
        />
        <PromotionProduct />
        <HomeComboProduct
          products={home?.comboProducts ?? []}
          isLoading={isLoading}
        />
        <HomeProductSection
          title={t("featured.title")}
          products={home?.featuredProducts ?? []}
          isLoading={isLoading}
        />
        <HomeProductSection
          title={t("best.title")}
          products={home?.bestProducts ?? []}
          isLoading={isLoading}
        />
      </main>

      <section className="flex flex-col gap-16 sm:gap-20 lg:gap-32 mt-8 w-full overflow-hidden">
        <ContinuousCarousel />
        <HomeBlogs />
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 mb-16 md:mb-24 flex flex-col gap-16 sm:gap-20 lg:gap-32">
        <CustomerFeedback />
      </section>
    </div>
  );
}

