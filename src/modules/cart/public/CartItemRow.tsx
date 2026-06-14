"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ProductType } from "@/modules/product/types/product.type";
import { ICartItem } from "../types/cart.type";

interface IProps {
  item: ICartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: IProps) {
  const hasDiscount =
    typeof item.salePrice === "number" &&
    item.salePrice > 0 &&
    item.salePrice < item.basePrice;
  const unitPrice = hasDiscount ? item.salePrice! : item.basePrice;
  const lineTotal = unitPrice * item.quantity;

  const detailsHref =
    item.type === ProductType.COMBO
      ? `/combo-product-details/${item.slug}`
      : `/product-details/${item.slug}`;

  return (
    <div className="flex gap-4 py-6 border-b border-neutralPrimary-300">
      <Link href={detailsHref} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-lg overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="128px"
            className="object-contain p-3"
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <Link href={detailsHref}>
              <p className="text-slate-800 font-medium hover:text-primary-600 transition-colors line-clamp-2">
                {item.name}
              </p>
            </Link>
            <p className="text-slate-400 text-sm">
              {unitPrice.toFixed(2)}฿
            </p>
            {item.size && (
              <p className="text-slate-500 text-sm">
                Size: <span className="text-slate-700">{item.size}</span>
              </p>
            )}
          </div>

          <p className="text-slate-900 font-semibold whitespace-nowrap">
            ฿{lineTotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex items-center border border-slate-200 rounded">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Decrease quantity"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-medium text-slate-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              aria-label="Increase quantity"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-sm text-slate-500 hover:text-rose-500 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Remove item
          </button>
        </div>
      </div>
    </div>
  );
}
