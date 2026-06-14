"use client";

import { Link } from "@/i18n/navigation";

interface IProps {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  estimatedTotal: number;
  disabled?: boolean;
}

export default function OrderSummary({
  subtotal,
  discount,
  deliveryCharge,
  estimatedTotal,
  disabled,
}: IProps) {
  return (
    <aside className="w-full lg:w-96 shrink-0">
      <div className="border border-neutralPrimary-300 rounded-xl p-6 lg:sticky lg:top-32">
        <h2 className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-6">
          Order Summary
        </h2>

        <div className="flex flex-col gap-4 text-sm">
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

        <div className="my-5 border-t border-neutralPrimary-300" />

        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-900 font-semibold text-lg">
            Estimated Total
          </span>
          <span className="text-slate-900 font-bold text-lg">
            ฿{estimatedTotal.toFixed(2)}
          </span>
        </div>

        {disabled ? (
          <button
            type="button"
            disabled
            className="w-full bg-neutral-200 text-neutral-400 font-semibold py-3 rounded-md cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        ) : (
          <Link
            href="/checkout"
            className="block w-full text-center bg-mauve-700 hover:bg-primary-600 transition-colors text-white font-semibold py-3 rounded-md"
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
    </aside>
  );
}
