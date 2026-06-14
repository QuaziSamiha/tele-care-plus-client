"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SwitchField from "@/components/shared/form/SwitchField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import { productSchema, ProductFormData } from "../schemas/product.schema";
import { usePost } from "@/hooks/api/usePost";
import { COMMON_STATUS_OPTIONS } from "@/constants/common.constants";
import { PRODUCT_API } from "@/constants/api";
import { PRODUCT_TYPE_OPTIONS } from "../constants/product.constants";
import MultipleImageInput from "@/components/shared/form/fileFields/MultipleMediaInput";
import ProductVariation from "./ProductVariant";
import useAdminProduct from "../hooks/useAdminProduct";
import { TextEditor } from "@/components/shared/form/TextEditor";

export default function AddProduct({ setOpen, refetch }: IModal) {
  const { productCategories, productCategoryLoading } = useAdminProduct();

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "ACTIVE",
      isFeatured: false,
      variants: [{ size: "", price: 0, discountValue: 0 }],
    },
  });

  const { control, trigger, handleSubmit } = methods;

  const { mutate: addProduct, isPending } = usePost(
    PRODUCT_API.paths.CREATE,
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (error) => console.error("Failed to create product:", error),
  );

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.nameTh) formData.append("nameTh", data.nameTh);
    if (data.sku) formData.append("sku", data.sku);
    if (data.barcode) formData.append("barcode", data.barcode);
    if (data.shortDescription)
      formData.append("shortDescription", data.shortDescription);
    if (data.description) formData.append("description", data.description);
    if (data.dosage) formData.append("dosage", data.dosage);
    if (data.ingredients) formData.append("ingredients", data.ingredients);
    if (data.healthBenefits)
      formData.append("healthBenefits", data.healthBenefits);
    if (data.warning) formData.append("warning", data.warning);
    if (data.storageInstructions)
      formData.append("storageInstructions", data.storageInstructions);
    if (data.genericName) formData.append("genericName", data.genericName);
    if (data.origin) formData.append("origin", data.origin);
    if (data.type) formData.append("type", data.type);
    formData.append("status", data.status ?? "ACTIVE");
    formData.append("isFeatured", data.isFeatured ? "true" : "false");
    formData.append("categoryId", data.categoryId);

    const validVariants = (data.variants ?? []).filter(
      (v) => v.size || (v.price ?? 0) > 0,
    );
    const basePrice = validVariants[0]?.price ?? 0;
    formData.append("basePrice", String(basePrice));

    if (validVariants.length > 0) {
      formData.append("variants", JSON.stringify(validVariants));
    }

    if (data.productImages && data.productImages.length > 0) {
      data.productImages.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    addProduct(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <p className="text-2xl font-semibold text-slate-800">Add Product</p>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-6 items-start"
        >
          {/* ── Left Column ── */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Images */}

            {/* <div className="bg-white p-6 border border-neutralPrimary-300 rounded-lg"> */}
            <MultipleImageInput
              label="Product Image"
              name="productImages"
              control={control}
              isRequired={true}
              multiple={true}
              maxFileSize={5 * 1024 * 1024} // 5MB
            />
            {/* </div> */}

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
                isRequired
              />
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
              </div>
              <TextEditor
                labelName="Storage Instructions"
                name="storageInstructions"
                control={control}
                trigger={trigger}
                placeholderText="Write storage instructions here..."
              />
              <SingleSelectSearch
                labelName="Product Type"
                name="type"
                control={control}
                options={PRODUCT_TYPE_OPTIONS}
              />
              <div className="grid grid-cols-2 gap-4">
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
              isRequired
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
            <div className="flex flex-col gap-4 pt-2">
              <SubmitButton
                submitTitle="Save Product"
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
