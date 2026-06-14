"use client";

import InputField from "@/components/shared/form/InputField";
import { useEffect } from "react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
  Control,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";

interface VariantRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: UseFormTrigger<any>;
  index: number;
  onRemove: () => void;
  removeDisabled: boolean;
}

function VariantRow({
  control,
  setValue,
  trigger,
  index,
  onRemove,
  removeDisabled,
}: VariantRowProps) {
  const price = useWatch({ control, name: `variants.${index}.price` });
  const discountValue = useWatch({
    control,
    name: `variants.${index}.discountValue`,
  });

  useEffect(() => {
    const p = Number(price) || 0;
    const d = Number(discountValue) || 0;
    const current = Math.max(0, p * (1 - d / 100));
    setValue(`variants.${index}.salePrice`, Number(current.toFixed(2)), {
      shouldDirty: true,
    });
  }, [price, discountValue, index, setValue]);

  return (
    <div className="flex gap-4 items-end w-full">
      <div className="flex items-center gap-3 w-full">
        <InputField
          labelName="Size"
          name={`variants.${index}.size` as const}
          placeholderText="e.g. 500ml, 30 tablets"
          control={control}
          trigger={trigger}
          isRequired
        />
        <InputField
          labelName="Base Price"
          inputType="number"
          name={`variants.${index}.price` as const}
          placeholderText="e.g. 250"
          control={control}
          trigger={trigger}
          isRequired
        />
        <InputField
          labelName="Discount Value (%)"
          inputType="number"
          name={`variants.${index}.discountValue` as const}
          placeholderText="0 - 100"
          control={control}
          trigger={trigger}
        />
        <InputField
          labelName="Current Price"
          name={`variants.${index}.salePrice` as const}
          inputType="number"
          placeholderText="Auto-calculated"
          control={control}
          trigger={trigger}
          disabled
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={removeDisabled}
        className={`w-8 h-8 mb-1.5 rounded flex items-center justify-center text-sm transition-colors ${
          removeDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"
        }`}
        title={
          removeDisabled
            ? "Cannot remove the last variation"
            : "Remove variation"
        }
      >
        <MdDelete fontSize={20} className="text-red-700" />
      </button>
    </div>
  );
}

export default function ProductVariation() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control, trigger, setValue } = useFormContext<any>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariation = () => {
    append({
      size: "",
      price: 0,
      discountValue: 0,
      salePrice: 0,
    });
  };

  const removeVariation = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const watchedVariants = useWatch({ control, name: "variants" }) as
    | Array<{ size?: string; price?: number | string }>
    | undefined;

  const addDisabled = (watchedVariants ?? []).some((v) => {
    const sizeEmpty = !v?.size || String(v.size).trim() === "";
    const priceEmpty =
      v?.price === undefined ||
      v?.price === null ||
      v?.price === "" ||
      Number(v?.price) <= 0;
    return sizeEmpty || priceEmpty;
  });

  return (
    <div className="bg-white p-6 border border-slate-300 rounded">
      <p className="font-semibold slate-800 text-lg mb-4">Variation</p>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <VariantRow
            key={field.id}
            control={control}
            setValue={setValue}
            trigger={trigger}
            index={index}
            onRemove={() => removeVariation(index)}
            removeDisabled={fields.length === 1}
          />
        ))}

        <button
          type="button"
          onClick={addVariation}
          disabled={addDisabled}
          title={
            addDisabled
              ? "Fill Size and Base Price before adding a new variation"
              : "Add another variation"
          }
          className={`flex items-center gap-2 px-4 py-3 rounded border transition-colors ${
            addDisabled
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-neutral-50 cursor-pointer"
          }`}
        >
          <MdAdd fontSize={18} /> Add Variation
        </button>
      </div>
    </div>
  );
}
