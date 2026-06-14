"use client";

import {
  Control,
  SubmitHandler,
  UseFormSetValue,
  UseFormTrigger,
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import { usePost } from "@/hooks/api/usePost";
import { INVENTORY_API } from "@/constants/api";
import {
  IProductOption,
  useGetProductOptions,
} from "@/modules/product/hooks/useAdminProduct";
import {
  AddStockFormData,
  addStockSchema,
} from "../schemas/inventory.schema";

interface AddStockRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: UseFormTrigger<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  index: number;
  products: IProductOption[];
  productsLoading: boolean;
  onRemove: () => void;
  canRemove: boolean;
}

function AddStockRow({
  control,
  trigger,
  setValue,
  index,
  products,
  productsLoading,
  onRemove,
  canRemove,
}: AddStockRowProps) {
  const selectedProductId = useWatch({
    control,
    name: `items.${index}.productId`,
  }) as string | undefined;

  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId),
  );

  const variantOptions =
    selectedProduct?.variants?.map((v) => ({
      id: String(v.id),
      name: v.size ?? v.name,
    })) ?? [];

  // Reset variant when product changes
  useEffect(() => {
    setValue(`items.${index}.variantId`, "");
  }, [selectedProductId, index, setValue]);

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-white relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SingleSelectSearch
          labelName="Product Name"
          name={`items.${index}.productId`}
          control={control}
          options={products.map((p) => ({ id: String(p.id), name: p.name }))}
          isLoading={productsLoading}
          isRequired
        />
        <SingleSelectSearch
          labelName="Size"
          name={`items.${index}.variantId`}
          control={control}
          options={variantOptions}
          isDisabled={!selectedProductId || variantOptions.length === 0}
        />
        <InputField
          labelName="Quantity"
          name={`items.${index}.quantity`}
          inputType="number"
          placeholderText="Enter quantity"
          control={control}
          trigger={trigger}
          isRequired
        />
        <DateField
          control={control}
          name={`items.${index}.manufacturingDate`}
          label="Manufacturing date"
        />
        <DateField
          control={control}
          name={`items.${index}.expiryDate`}
          label="Expiry date"
        />
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center shadow"
          title="Remove row"
        >
          <MdDelete size={18} />
        </button>
      )}
    </div>
  );
}

function DateField({
  control,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
}) {
  const {
    field: { value, onChange },
  } = useController({ control, name });
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-slate-800 text-sm font-semibold md:pl-2">
          {label}
        </label>
        <input
          type="date"
          value={(value as string | undefined) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="bg-neutral-100 border border-neutral-300 rounded p-3 text-sm text-slate-700 outline-none w-full"
        />
      </div>
    </div>
  );
}

export default function AddStock({ setOpen, refetch }: IModal) {
  const { data: optionsData, isLoading: isProductsLoading } =
    useGetProductOptions();
  const products = optionsData?.data ?? [];

  const { control, trigger, handleSubmit, setValue } =
    useForm<AddStockFormData>({
      resolver: zodResolver(addStockSchema),
      defaultValues: {
        items: [
          {
            productId: "",
            variantId: "",
            quantity: 1,
            manufacturingDate: "",
            expiryDate: "",
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const formItems = useWatch({ control, name: "items" }) || [];
  const isAddDisabled = formItems.some(
    (item) => !item.productId || !item.quantity || Number(item.quantity) < 1
  );

  const { mutate: addStock, isPending } = usePost(
    INVENTORY_API.paths.ADD_STOCK,
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (error) => {
      console.error("Failed to add stock:", error);
    },
  );

  const onSubmit: SubmitHandler<AddStockFormData> = (data) => {
    const payload = {
      items: data.items.map((item) => ({
        productId: Number(item.productId),
        variantId:
          item.variantId && item.variantId !== ""
            ? Number(item.variantId)
            : undefined,
        quantity: Number(item.quantity),
        manufacturingDate: item.manufacturingDate || undefined,
        expiryDate: item.expiryDate || undefined,
      })),
    };

    // Validate dates
    for (const item of payload.items) {
      if (
        item.manufacturingDate &&
        item.expiryDate &&
        item.expiryDate < item.manufacturingDate
      ) {
        toast.error("Expiry date cannot be before manufacturing date");
        return;
      }
    }

    addStock(payload as unknown as Record<string, unknown>);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <p className="text-2xl font-semibold text-slate-800">Add Stock</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <AddStockRow
              key={field.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={control as unknown as Control<any>}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              trigger={trigger as unknown as UseFormTrigger<any>}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setValue={setValue as unknown as UseFormSetValue<any>}
              index={index}
              products={products}
              productsLoading={isProductsLoading}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={isAddDisabled}
          onClick={() =>
            append({
              productId: "",
              variantId: "",
              quantity: 1,
              manufacturingDate: "",
              expiryDate: "",
            })
          }
          className={`flex items-center gap-2 px-4 py-3 bg-white border rounded w-fit transition-colors ${
            isAddDisabled
              ? "text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
              : "text-slate-700 border-slate-300 hover:bg-neutral-50"
          }`}
        >
          <MdAdd size={18} /> Add
        </button>

        <div className="flex items-end justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setOpen?.(false)}
            className="border border-neutral-300 font-semibold text-sm text-neutral-600 rounded px-6 py-2.5 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <SubmitButton
            submitTitle="Add Stock"
            isPending={isPending}
            buttonWidth="w-fit"
          />
        </div>
      </form>
    </section>
  );
}
