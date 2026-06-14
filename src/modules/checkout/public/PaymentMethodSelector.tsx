"use client";

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { PAYMENT_METHODS } from "../constants/checkout.constants";
import { PaymentMethod } from "../types/checkout.type";

interface IProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
}

export default function PaymentMethodSelector<T extends FieldValues>({
  name,
  control,
}: IProps<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<T>({
    name,
    control,
    rules: { required: "Please select a payment method" },
  });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-slate-500 text-sm">
        All transaction are secure and encripted
      </p>

      <div className="flex flex-col gap-3 mt-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = value === method.value;
          return (
            <label
              key={method.value}
              className={`flex items-center gap-3 border rounded-md px-5 py-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary-500 bg-primary-50/40"
                  : "border-neutralPrimary-300 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name={name as string}
                value={method.value}
                checked={isSelected}
                onChange={() => onChange(method.value as PaymentMethod)}
                className="sr-only"
              />
              <span
                className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-primary-500" : "border-slate-300"
                }`}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-mauve-700" />
                )}
              </span>
              <span className="text-slate-800 font-medium text-sm">
                {method.label}
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-medium pl-2">{error.message}</p>
      )}
    </div>
  );
}
