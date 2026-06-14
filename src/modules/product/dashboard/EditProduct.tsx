"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import InputField from "@/components/shared/form/InputField";
import { TextEditor } from "@/components/shared/form/TextEditor";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SwitchField from "@/components/shared/form/SwitchField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import {
  updateProductSchema,
  UpdateProductFormData,
} from "../schemas/product.schema";
import { usePatch } from "@/hooks/api/usePatch";
import useAdminProduct from "../hooks/useAdminProduct";
import { PRODUCT_API } from "@/constants/api";
import { COMMON_STATUS_OPTIONS } from "@/constants/common.constants";
import { IProduct } from "../types/product.type";
import MultipleImageInput from "@/components/shared/form/fileFields/MultipleMediaInput";
import ProductVariation from "./ProductVariant";

const PRODUCT_TYPE_OPTIONS = [
  { id: "SIMPLE", name: "Simple" },
  { id: "VARIABLE", name: "Variable" },
  { id: "BUNDLE", name: "Bundle" },
  { id: "DIGITAL", name: "Digital" },
];

export default function EditProduct({ data, setOpen, refetch }: IModal) {
  const product = data as IProduct;
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const { productCategories, productCategoryLoading } = useAdminProduct();

  const methods = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product?.name,
      nameTh: product?.nameTh ?? "",
      sku: product?.sku ?? "",
      barcode: product?.barcode ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      dosage: product?.dosage ?? "",
      ingredients: product?.ingredients ?? "",
      healthBenefits: product?.healthBenefits ?? "",
      warning: product?.warning ?? "",
      storageInstructions: product?.storageInstructions ?? "",
      genericName: product?.genericName ?? "",
      origin: product?.origin ?? "",
      type: product?.type ?? "",
      status: product?.status ?? "ACTIVE",
      isFeatured: product?.isFeatured ?? false,
      categoryId: product?.categoryId ? String(product.categoryId) : "",
      variants: product?.variants?.map((v) => ({
        size: v.size ?? "",
        price: v.price,
        discountType: (v.discountType as "PERCENTAGE" | "FIXED") ?? undefined,
        discountValue: v.discountValue ?? 0,
        salePrice: v.salePrice ?? undefined,
        costPerItem: v.costPerItem ?? undefined,
        quantity: v.quantity ?? 0,
        sku: v.sku ?? "",
        barcode: v.barcode ?? "",
        isDefault: v.isDefault,
      })) ?? [{ size: "", price: 0, discountValue: 0 }],
      productImages:
        product.images?.map((img) => ({
          filePath: img.url,
          name: img.altText || "Product image",
          attachId: img.id,
        })) || [],
    },
  });

  const {
    control,
    trigger,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = methods;

  // ======== HANDLE IMAGE REMOVE ===========
  const handleRemoveImage = (attachId: number) => {
    setRemovedImageIds((prev) => [...prev, attachId]);
  };

  const { mutate: updateProduct, isPending } = usePatch(
    PRODUCT_API.paths.UPDATE(product?.id ?? 0),
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (error) => console.error("Failed to update product:", error),
  );

  const onSubmit: SubmitHandler<UpdateProductFormData> = (data) => {
    if (!isDirty) {
      toast.info("No changes detected!");
      setOpen?.(false);
      return;
    }

    const formData = new FormData();

    if (dirtyFields.name && data.name) formData.append("name", data.name);
    if (dirtyFields.nameTh && data.nameTh !== undefined)
      formData.append("nameTh", data.nameTh);
    if (dirtyFields.sku && data.sku !== undefined)
      formData.append("sku", data.sku);
    if (dirtyFields.barcode && data.barcode !== undefined)
      formData.append("barcode", data.barcode);
    if (dirtyFields.shortDescription && data.shortDescription !== undefined)
      formData.append("shortDescription", data.shortDescription);
    if (dirtyFields.description && data.description !== undefined)
      formData.append("description", data.description);
    if (dirtyFields.dosage && data.dosage !== undefined)
      formData.append("dosage", data.dosage);
    if (dirtyFields.ingredients && data.ingredients !== undefined)
      formData.append("ingredients", data.ingredients);
    if (dirtyFields.healthBenefits && data.healthBenefits !== undefined)
      formData.append("healthBenefits", data.healthBenefits);
    if (dirtyFields.warning && data.warning !== undefined)
      formData.append("warning", data.warning);
    if (
      dirtyFields.storageInstructions &&
      data.storageInstructions !== undefined
    )
      formData.append("storageInstructions", data.storageInstructions);
    if (dirtyFields.genericName && data.genericName !== undefined)
      formData.append("genericName", data.genericName);
    if (dirtyFields.origin && data.origin !== undefined)
      formData.append("origin", data.origin);
    if (dirtyFields.type && data.type) formData.append("type", data.type);
    if (dirtyFields.status && data.status)
      formData.append("status", data.status);
    if (dirtyFields.isFeatured)
      formData.append("isFeatured", data.isFeatured ? "true" : "false");
    if (dirtyFields.categoryId && data.categoryId)
      formData.append("categoryId", data.categoryId);

    if (dirtyFields.variants) {
      const validVariants = (data.variants ?? []).filter(
        (v) => v.size || (v.price ?? 0) > 0,
      );
      if (validVariants.length > 0) {
        formData.append("variants", JSON.stringify(validVariants));
        const basePrice = validVariants[0]?.price ?? 0;
        formData.append("basePrice", String(basePrice));
      }
    }

    if (
      dirtyFields.productImages &&
      data.productImages &&
      data.productImages.length > 0
    ) {
      data.productImages.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    if (removedImageIds.length > 0) {
      formData.append("deleteImageIds", JSON.stringify(removedImageIds));
    }

    updateProduct(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <div className="sticky top-0 z-20 bg-white py-4">
        <p className="text-2xl font-semibold text-slate-800">Edit Product</p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-6 items-start"
        >
          {/* ── Left Column ── */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Images */}
            <div className="bg-white p-6 border border-neutralPrimary-300 rounded-lg">
              <MultipleImageInput
                label="Product Image"
                name="productImages"
                control={control}
                isRequired={true}
                multiple={true}
                maxFileSize={5 * 1024 * 1024} // 5MB
                onRemoveImage={handleRemoveImage}
              />
            </div>
            {/* General Info */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1">
                General Information
              </p>
              <InputField
                labelName="Product Name"
                name="name"
                placeholderText="Enter product name..."
                control={control}
                trigger={trigger}
              />

              {/* Variants */}
              <ProductVariation />

              <TextEditor
                labelName="Short Description"
                name="shortDescription"
                control={control}
                trigger={trigger}
                placeholderText="Write short description here..."
              />
              <TextEditor
                labelName="Description"
                name="description"
                control={control}
                trigger={trigger}
                placeholderText="Write description here..."
              />
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1">
                Additional Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                <TextEditor
                  labelName="Dosage"
                  name="dosage"
                  control={control}
                  trigger={trigger}
                  placeholderText="Write dosage here..."
                />
                <TextEditor
                  labelName="Ingredients"
                  name="ingredients"
                  control={control}
                  trigger={trigger}
                  placeholderText="Write ingredients here..."
                />
                <TextEditor
                  labelName="Health Benefits"
                  name="healthBenefits"
                  control={control}
                  trigger={trigger}
                  placeholderText="Write health benefits here..."
                />
                <TextEditor
                  labelName="Warning"
                  name="warning"
                  control={control}
                  trigger={trigger}
                  placeholderText="Write warning here..."
                />
                <SingleSelectSearch
                  labelName="Product Type"
                  name="type"
                  control={control}
                  options={PRODUCT_TYPE_OPTIONS}
                />
                <TextEditor
                  labelName="Storage Instructions"
                  name="storageInstructions"
                  control={control}
                  trigger={trigger}
                  placeholderText="Write storage instructions here..."
                />
                <InputField
                  labelName="Generic Name"
                  name="genericName"
                  placeholderText="Enter generic name..."
                  control={control}
                  trigger={trigger}
                />
                <InputField
                  labelName="SKU"
                  name="sku"
                  placeholderText="Enter SKU..."
                  control={control}
                  trigger={trigger}
                />
                <InputField
                  labelName="Origin"
                  name="origin"
                  placeholderText="Enter origin country..."
                  control={control}
                  trigger={trigger}
                />
                <InputField
                  labelName="Barcode"
                  name="barcode"
                  placeholderText="Enter barcode..."
                  control={control}
                  trigger={trigger}
                />
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="w-60 shrink-0 flex flex-col gap-4 sticky top-0">
            <SingleSelectSearch
              labelName="Category"
              name="categoryId"
              control={control}
              options={productCategories}
              isLoading={productCategoryLoading}
            />
            <SingleSelectSearch
              labelName="Status"
              name="status"
              control={control}
              options={[...COMMON_STATUS_OPTIONS]}
            />
            <div className="border border-neutral-200 rounded-lg p-3">
              <SwitchField
                labelName="Featured Product"
                description="Highlight this product on the storefront"
                name="isFeatured"
                control={control}
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <SubmitButton
                submitTitle="Update Product"
                isPending={isPending}
                buttonWidth="w-full"
              />
              <button
                type="button"
                onClick={() => setOpen?.(false)}
                className="w-full border border-neutral-300 font-semibold text-base text-neutral-600 rounded cursor-pointer px-5 py-2.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
