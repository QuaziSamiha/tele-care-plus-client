"use client";

import { Link } from "@/i18n/navigation";
import ProductCard from "@/modules/product/public/product/ProductCard";
import { IProduct } from "@/modules/product/types/product.type";
import { useTranslations } from "next-intl";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface IProps {
  products: IProduct[];
  isLoading?: boolean;
}

export default function HomeComboProduct({ products, isLoading }: IProps) {
  const t = useTranslations("Home");
  return (
    <section className="w-full flex flex-col gap-8 lg:gap-12">
      <div className="flex items-end justify-between">
        <h2 className="text-neutral-900 font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
          {t("combo.title")}
        </h2>
        <Link
          href="/product?productType=COMBO"
          className="group flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-neutral-200 text-sm sm:text-base font-semibold text-neutral-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <span>{t("section.viewAll")}</span>
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
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-slate-500 text-sm">{t("combo.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={`${product.type}-${product.id}`}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}
