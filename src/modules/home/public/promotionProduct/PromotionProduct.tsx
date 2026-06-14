"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PromotionProduct() {
  const t = useTranslations("Home.promo");
  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 md:gap-8">
        
        {/* Card 1 */}
        <div className="group flex-1 flex flex-col justify-center bg-secondary-50 hover:bg-secondary-100/80 rounded-3xl overflow-hidden transition-colors duration-500 border border-secondary-100">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between p-8 sm:p-10 lg:p-12 gap-8 h-full">
            
            {/* Text Content */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-6 w-full sm:w-1/2">
              <div className="flex flex-col gap-2">
                <span className="inline-block px-4 py-1.5 bg-white text-secondary-600 text-xs font-bold uppercase tracking-wider rounded-full w-fit max-sm:mx-auto shadow-sm">
                  {t("limitedOffer")}
                </span>
                <p className="text-slate-800 text-3xl lg:text-4xl font-bold tracking-tight mt-2">
                  {t("productTitle")}
                </p>
                <p className="text-slate-500 text-sm md:text-base">{t("subtitle")}</p>
              </div>
              <p className="text-text-error font-extrabold text-3xl md:text-4xl">
                ฿10.00-฿55.00
              </p>
              <Link
                href="/"
                className="mt-2 bg-mauve-700 text-slate-900 px-8 py-3.5 rounded-full font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("buyNow")}
              </Link>
            </div>
            
            {/* Image */}
            <div className="relative w-full sm:w-1/2 h-[240px] sm:h-[280px] lg:h-[320px]">
              <Image
                src="/images/home/promo-product1.png"
                alt="Promotion Product"
                fill
                className="object-contain object-center group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
              />
            </div>
            
          </div>
        </div>

        {/* Card 2 */}
        <div className="group flex-1 flex flex-col justify-center bg-secondary-50 hover:bg-secondary-100/80 rounded-3xl overflow-hidden transition-colors duration-500 border border-secondary-100">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between p-8 sm:p-10 lg:p-12 gap-8 h-full">
            
            {/* Text Content */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-6 w-full sm:w-1/2">
              <div className="flex flex-col gap-2">
                <span className="inline-block px-4 py-1.5 bg-white text-secondary-600 text-xs font-bold uppercase tracking-wider rounded-full w-fit max-sm:mx-auto shadow-sm">
                  {t("bestSeller")}
                </span>
                <p className="text-slate-800 text-3xl lg:text-4xl font-bold tracking-tight mt-2">
                  {t("productTitle")}
                </p>
                <p className="text-slate-500 text-sm md:text-base">{t("subtitle")}</p>
              </div>
              <p className="text-text-error font-extrabold text-3xl md:text-4xl">
                ฿10.00-฿55.00
              </p>
              <Link
                href="/"
                className="mt-2 bg-mauve-700 text-slate-900 px-8 py-3.5 rounded-full font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                {t("buyNow")}
              </Link>
            </div>
            
            {/* Image */}
            <div className="relative w-full sm:w-1/2 h-[240px] sm:h-[280px] lg:h-[320px]">
              <Image
                src="/images/home/promo-product2.png"
                alt="Promotion Product"
                fill
                className="object-contain object-center group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-xl"
              />
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
