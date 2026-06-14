"use client";

import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import { usePost } from "@/hooks/api/usePost";
import { INVENTORY_API } from "@/constants/api";
import { useGetProductOptions } from "@/modules/product/hooks/useAdminProduct";
import { useGetBatchesForProduct } from "../hooks/useInventory";
import {
  RemoveStockFormData,
  removeStockSchema,
} from "../schemas/inventory.schema";

const REMOVAL_REASON_OPTIONS = [
  { id: "SALE", name: "Sold" },
  { id: "RETURN", name: "Return" },
  { id: "DAMAGE", name: "Damaged" },
  { id: "EXPIRED", name: "Expired" },
  { id: "ADJUSTMENT", name: "Adjustment" },
];

export default function RemoveProduct({ setOpen, refetch }: IModal) {
  const { data: optionsData, isLoading: isProductsLoading } =
    useGetProductOptions();
  const products = optionsData?.data ?? [];

  const { control, trigger, handleSubmit, setValue } =
    useForm<RemoveStockFormData>({
      resolver: zodResolver(removeStockSchema),
      defaultValues: {
        productId: "",
        variantId: "",
        batchId: "",
        quantity: 1,
        changeType: "DAMAGE",
        reason: "",
      },
    });

  const selectedProductId = useWatch({ control, name: "productId" });
  const selectedVariantId = useWatch({ control, name: "variantId" });

  const selectedProduct = products.find(
    (p) => String(p.id) === String(selectedProductId),
  );

  const variantOptions =
    selectedProduct?.variants?.map((v) => ({
      id: String(v.id),
      name: v.size ?? v.name,
    })) ?? [];

  // Reset variant + batch when product changes
  useEffect(() => {
    setValue("variantId", "");
    setValue("batchId", "");
  }, [selectedProductId, setValue]);

  // Reset batch when variant changes
  useEffect(() => {
    setValue("batchId", "");
  }, [selectedVariantId, setValue]);

  const { data: batchesData, isLoading: batchesLoading } =
    useGetBatchesForProduct(
      selectedProductId ? Number(selectedProductId) : undefined,
      selectedVariantId && selectedVariantId !== ""
        ? Number(selectedVariantId)
        : undefined,
    );

  const batchOptions =
    (batchesData?.data ?? [])
      .filter((b) => b.remaining > 0)
      .map((b) => ({
        id: String(b.id),
        name: `${b.batchNo} · ${b.remaining} left${
          b.expiryDate ? ` · exp ${dayjs(b.expiryDate).format("MMM DD, YYYY")}` : ""
        }`,
      }));

  const { mutate: removeStock, isPending } = usePost(
    INVENTORY_API.paths.REMOVE_STOCK,
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (error) => console.error("Failed to remove stock:", error),
  );

  const onSubmit: SubmitHandler<RemoveStockFormData> = (data) => {
    const batch = batchesData?.data?.find(
      (b) => String(b.id) === String(data.batchId),
    );
    if (batch && Number(data.quantity) > batch.remaining) {
      toast.error(`Only ${batch.remaining} unit(s) remaining in this batch`);
      return;
    }

    const payload = {
      productId: Number(data.productId),
      variantId:
        data.variantId && data.variantId !== ""
          ? Number(data.variantId)
          : undefined,
      batchId: Number(data.batchId),
      quantity: Number(data.quantity),
      changeType: data.changeType,
      reason: data.reason || undefined,
    };

    removeStock(payload as unknown as Record<string, unknown>);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <p className="text-2xl font-semibold text-slate-800">Remove Product</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelectSearch
            labelName="Product"
            name="productId"
            control={control}
            options={products.map((p) => ({ id: String(p.id), name: p.name }))}
            isLoading={isProductsLoading}
            isRequired
          />
          <SingleSelectSearch
            labelName="Product Size"
            name="variantId"
            control={control}
            options={variantOptions}
            isDisabled={!selectedProductId || variantOptions.length === 0}
          />
          <SingleSelectSearch
            labelName="Product Batch"
            name="batchId"
            control={control}
            options={batchOptions}
            isLoading={batchesLoading}
            isDisabled={!selectedProductId || batchOptions.length === 0}
            isRequired
          />
          <InputField
            labelName="Quantity"
            name="quantity"
            inputType="number"
            placeholderText="Enter quantity to remove"
            control={control}
            trigger={trigger}
            isRequired
          />
          <SingleSelectSearch
            labelName="Reason for Removal"
            name="changeType"
            control={control}
            options={REMOVAL_REASON_OPTIONS}
          />
          <InputField
            labelName="Note (optional)"
            name="reason"
            placeholderText="Additional details"
            control={control}
            trigger={trigger}
          />
        </div>

        <div className="flex items-end justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setOpen?.(false)}
            className="border border-neutral-300 font-semibold text-sm text-neutral-600 rounded px-6 py-2.5 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <SubmitButton
            submitTitle="Remove"
            isPending={isPending}
            buttonWidth="w-fit"
          />
        </div>
      </form>
    </section>
  );
}
