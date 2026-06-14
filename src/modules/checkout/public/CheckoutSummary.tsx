"use client";

import Image from "next/image";
import { ICartItem } from "@/modules/cart/types/cart.type";

interface IProps {
  items: ICartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
}

export default function CheckoutSummary({
  items,
  subtotal,
  discount,
  deliveryCharge,
  total,
}: IProps) {
  return (
    <aside className="w-full">
      <div className="border border-neutralPrimary-300 rounded-xl p-6 lg:sticky lg:top-32">
        <h2 className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-6">
          Order Summary
        </h2>

        <div className="flex flex-col divide-y divide-neutralPrimary-300">
          {items.map((item) => {
            const hasDiscount =
              typeof item.salePrice === "number" &&
              item.salePrice > 0 &&
              item.salePrice < item.basePrice;
            const unitPrice = hasDiscount ? item.salePrice! : item.basePrice;
            const lineTotal = unitPrice * item.quantity;

            return (
              <div key={item.id} className="flex gap-3 py-4 first:pt-0">
                <div className="relative w-16 h-16 shrink-0 bg-neutral-100 rounded-md overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-slate-800 text-sm font-medium line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-slate-900 font-semibold text-sm whitespace-nowrap">
                      ฿{lineTotal.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-slate-400 text-xs">
                    ฿{unitPrice.toFixed(2)}
                  </p>
                  {item.size && (
                    <p className="text-slate-500 text-xs">
                      Size:{" "}
                      <span className="text-slate-700">{item.size}</span>
                    </p>
                  )}
                  <p className="text-slate-500 text-xs">x {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-neutralPrimary-300 mt-2 pt-5 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-900 font-medium">
              ฿{subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Discount</span>
            <span className="text-slate-900 font-medium">
              {discount > 0 ? `-฿${discount.toFixed(2)}` : "฿0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Delivery Charge</span>
            <span className="text-slate-900 font-medium">
              ฿{deliveryCharge.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="border-t border-neutralPrimary-300 mt-5 pt-5 flex items-center justify-between">
          <span className="text-slate-900 font-semibold text-lg">Total</span>
          <span className="text-slate-900 font-bold text-lg">
            ฿{total.toFixed(2)}
          </span>
        </div>
      </div>
    </aside>
  );
}
