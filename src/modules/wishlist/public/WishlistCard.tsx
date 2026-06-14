"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";
import { FiTrash2 } from "react-icons/fi";
import { ProductType } from "@/modules/product/types/product.type";
import { IWishlistItem } from "../types/wishlist.type";

interface IProps {
  item: IWishlistItem;
  onRemove: (id: number) => void;
}

export default function WishlistCard({ item, onRemove }: IProps) {
  const hasDiscount =
    typeof item.salePrice === "number" &&
    item.salePrice > 0 &&
    item.salePrice < item.basePrice;

  const detailsHref =
    item.type === ProductType.COMBO
      ? `/combo-product-details/${item.slug}`
      : `/product-details/${item.slug}`;

  return (
    <div className="group relative flex flex-col gap-3 border border-neutralPrimary-300 rounded-xl p-3 hover:shadow-md transition-shadow">
      <Link href={detailsHref} className="block">
        <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={300}
            height={300}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <button
        type="button"
        aria-label="Remove from wishlist"
        onClick={() => onRemove(item.id)}
        className="absolute top-5 right-5 p-1.5 bg-white border border-neutral-200 rounded-full hover:border-rose-400 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <FiTrash2 className="h-4 w-4 text-rose-500" />
      </button>

      <div className="flex flex-col gap-1.5">
        <Link href={detailsHref}>
          <p className="line-clamp-2 text-sm font-medium text-slate-800 hover:text-primary-600 transition-colors">
            {item.name}
          </p>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-slate-900">
                ฿{item.salePrice!.toFixed(2)}
              </span>
              <span className="text-slate-400 line-through text-xs">
                ฿{item.basePrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-slate-900">
              ฿{item.basePrice.toFixed(2)}
            </span>
          )}
        </div>

        <Link
          href={detailsHref}
          className="mt-2 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors"
        >
          <CgShoppingCart className="w-4 h-4" />
          View Product
        </Link>
      </div>
    </div>
  );
}
