"use client";

import {
  type Control,
  type UseFormTrigger,
  type UseFormSetValue,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import InputField from "@/components/shared/form/InputField";
import { IProductOption } from "@/modules/product/hooks/useAdminProduct";

type AnyForm = Record<string, unknown>;

interface ComboItemRowProps {
  control: Control<AnyForm>;
  trigger: UseFormTrigger<AnyForm>;
  setValue: UseFormSetValue<AnyForm>;
  index: number;
  onRemove: () => void;
  removeDisabled: boolean;
  productOptions: IProductOption[];
  isLoading?: boolean;
  takenPairs: Set<string>;
  takenProductsNoVariant: Set<string>;
}

function ComboItemRow({
  control,
  trigger,
  setValue,
  index,
  onRemove,
  removeDisabled,
  productOptions,
  isLoading,
  takenPairs,
  takenProductsNoVariant,
}: ComboItemRowProps) {
  const productId = useWatch({
    control,
    name: `items.${index}.productId` as never,
  }) as unknown as number | string | undefined;

  const product = productOptions.find(
    (p) => String(p.id) === String(productId),
  );

  const productOptionItems = productOptions
    .filter((p) => {
      const pHasVariants = !!p.variants?.length;
      if (pHasVariants) {
        const allVariantsTaken = p.variants!.every((v) =>
          takenPairs.has(`${p.id}::${v.id}`),
        );
        return !allVariantsTaken || String(p.id) === String(productId);
      }
      return (
        !takenProductsNoVariant.has(String(p.id)) ||
        String(p.id) === String(productId)
      );
    })
    .map((p) => ({ id: p.id, name: p.name }));

  const variantOptions =
    product?.variants
      ?.filter((v) => !takenPairs.has(`${product.id}::${v.id}`))
      .map((v) => ({
        id: v.id,
        name: v.size ? v.size : v.name,
      })) ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_40px] gap-3 items-end">
      <SingleSelectSearch
        labelName="Product"
        name={`items.${index}.productId` as never}
        control={control as unknown as Control<AnyForm>}
        options={productOptionItems}
        isLoading={isLoading}
        onSelectionChange={() => {
          setValue(`items.${index}.variantId` as never, undefined as never, {
            shouldDirty: true,
          });
        }}
      />
      <SingleSelectSearch
        labelName="Size"
        name={`items.${index}.variantId` as never}
        control={control as unknown as Control<AnyForm>}
        options={variantOptions}
        isDisabled={variantOptions.length === 0}
      />
      <InputField
        labelName="Qty"
        inputType="number"
        name={`items.${index}.quantity` as never}
        placeholderText="1"
        control={control as unknown as Control<AnyForm>}
        trigger={trigger as unknown as UseFormTrigger<AnyForm>}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={removeDisabled}
        className={`w-9 h-11 mb-1 rounded flex items-center justify-center text-sm transition-colors ${
          removeDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer"
        }`}
        title={removeDisabled ? "Cannot remove the last item" : "Remove item"}
      >
        <MdDelete fontSize={20} className="text-red-700" />
      </button>
    </div>
  );
}

interface IProps {
  productOptions: IProductOption[];
  isLoading?: boolean;
}

export default function ComboItems({ productOptions, isLoading }: IProps) {
  const { control, trigger, setValue } = useFormContext<AnyForm>();

  const { fields, append, remove } = useFieldArray({
    control: control as unknown as Control<AnyForm>,
    name: "items" as never,
  });

  const watchedItems = useWatch({
    control: control as unknown as Control<AnyForm>,
    name: "items" as never,
  }) as unknown as
    | {
        productId?: number | string;
        variantId?: number | string;
      }[]
    | undefined;

  const addItem = () => {
    append({
      productId: undefined,
      variantId: undefined,
      quantity: 1,
    } as never);
  };

  const handleRemove = (idx: number) => {
    if (fields.length > 1) remove(idx);
  };

  const buildTaken = (excludeIdx: number) => {
    const pairs = new Set<string>();
    const productsNoVariant = new Set<string>();
    (watchedItems ?? []).forEach((it, i) => {
      if (i === excludeIdx) return;
      if (!it?.productId) return;
      if (it.variantId) {
        pairs.add(`${it.productId}::${it.variantId}`);
      } else {
        productsNoVariant.add(String(it.productId));
      }
    });
    return { pairs, productsNoVariant };
  };

  return (
    <div className="bg-white p-6 border border-slate-300 rounded flex flex-col gap-5">
      <p className="font-semibold text-slate-800 text-lg">Products</p>

      {fields.map((field, idx) => {
        const { pairs, productsNoVariant } = buildTaken(idx);
        return (
          <ComboItemRow
            key={field.id}
            control={control as unknown as Control<AnyForm>}
            trigger={trigger as unknown as UseFormTrigger<AnyForm>}
            setValue={setValue as unknown as UseFormSetValue<AnyForm>}
            index={idx}
            onRemove={() => handleRemove(idx)}
            removeDisabled={fields.length === 1}
            productOptions={productOptions}
            isLoading={isLoading}
            takenPairs={pairs}
            takenProductsNoVariant={productsNoVariant}
          />
        );
      })}

      <button
        type="button"
        onClick={addItem}
        className="self-start flex items-center gap-2 px-4 py-2.5 rounded border border-slate-300 text-slate-700 hover:bg-neutral-50 cursor-pointer text-sm font-medium"
      >
        <MdAdd fontSize={18} /> Add Product
      </button>
    </div>
  );
}
