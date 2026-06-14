"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { PROMO_CODES } from "../constants/checkout.constants";
import { IPromoCode } from "../types/checkout.type";

interface IProps {
  appliedPromo: IPromoCode | null;
  onApply: (promo: IPromoCode) => void;
  onClear: () => void;
}

export default function PromoCodeInput({
  appliedPromo,
  onApply,
  onClear,
}: IProps) {
  const [code, setCode] = useState("");

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error("Enter a promo code");
      return;
    }
    const match = PROMO_CODES.find(
      (promo) => promo.code.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!match) {
      toast.error("Invalid promo code");
      return;
    }
    onApply(match);
    toast.success(`Promo applied: ${match.label}`);
    setCode("");
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-slate-800 text-sm font-semibold md:pl-2">
        Promo code
      </label>

      <div className="flex items-stretch gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="flex-1 outline-none font-normal text-neutral-700 placeholder:text-neutral-400 text-sm bg-neutral-100 border border-neutral-300 rounded p-3"
        />
        <button
          type="button"
          onClick={handleApply}
          className="bg-mauve-700 hover:bg-primary-600 transition-colors text-white font-semibold px-8 rounded cursor-pointer"
        >
          Apply
        </button>
      </div>

      {appliedPromo && (
        <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-md px-4 py-2.5">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-primary-600" />
            <span className="text-mauve-800 text-sm font-medium">
              {appliedPromo.code} · {appliedPromo.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove promo code"
            className="text-mauve-800 hover:text-rose-500 cursor-pointer transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
