"use client";

import {
  useForm,
  SubmitHandler,
  FormProvider,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SwitchField from "@/components/shared/form/SwitchField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { TextEditor } from "@/components/shared/form/TextEditor";
import MultipleImageInput from "@/components/shared/form/fileFields/MultipleMediaInput";
import { IModal } from "@/types/share-component.type";
import { usePost } from "@/hooks/api/usePost";
import { COMMON_STATUS_OPTIONS } from "@/constants/common.constants";
import { COMBO_API } from "@/constants/api";
import { comboSchema, ComboFormData } from "../schemas/combo.schema";
import useAdminCombo from "../hooks/useAdminCombo";
import ComboItems from "./ComboItems";

interface ComboItemDraft {
  categoryId?: string | number;
  productId?: string | number;
  variantId?: string | number;
  quantity?: number;
}

export default function AddCombo({ setOpen, refetch }: IModal) {
  const { productOptions, productOptionsLoading } = useAdminCombo();

  const methods = useForm<ComboFormData>({
    resolver: zodResolver(comboSchema) as unknown as Resolver<ComboFormData>,
    defaultValues: {
      status: "DRAFT",
      isFeatured: false,
      comboPrice: 0,
      items: [{ quantity: 1 } as never],
    },
  });

  const { control, trigger, handleSubmit } = methods;

  const { mutate: createCombo, isPending } = usePost(
    COMBO_API.paths.CREATE,
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (err) => console.error("Failed to create combo:", err),
  );

  const onSubmit: SubmitHandler<ComboFormData> = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    if (data.shortDescription)
      formData.append("shortDescription", data.shortDescription);
    if (data.shortDescTh) formData.append("shortDescTh", data.shortDescTh);
    if (data.description) formData.append("description", data.description);
    if (data.descriptionTh) formData.append("descriptionTh", data.descriptionTh);

    formData.append("comboPrice", String(data.comboPrice));
    formData.append("status", data.status ?? "DRAFT");
    formData.append("isFeatured", data.isFeatured ? "true" : "false");

    if (data.startsAt) formData.append("startsAt", new Date(data.startsAt).toISOString());
    if (data.endsAt) formData.append("endsAt", new Date(data.endsAt).toISOString());

    const items = (data.items as ComboItemDraft[])
      .filter((it) => it.productId)
      .map((it) => ({
        productId: Number(it.productId),
        variantId: it.variantId ? Number(it.variantId) : undefined,
        quantity: Number(it.quantity ?? 1) || 1,
      }));
    formData.append("items", JSON.stringify(items));

    (data.comboImages ?? []).forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });

    createCombo(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <p className="text-2xl font-semibold text-slate-800">Add Combo Product</p>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-6 items-start"
        >
          {/* ── Left Column ── */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Images */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1 mb-3">
                Combo Product Images
              </p>
              <MultipleImageInput
                label="Combo Images"
                name="comboImages"
                control={control}
                isRequired
                multiple
                maxFileSize={5 * 1024 * 1024}
              />
            </div>

            {/* Products picker */}
            <ComboItems
              productOptions={productOptions}
              isLoading={productOptionsLoading}
            />

            {/* General Info */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1">
                General Information
              </p>
              <InputField
                labelName="Combo Title"
                name="title"
                placeholderText="Enter combo title..."
                control={control}
                trigger={trigger}
                isRequired
              />
              <InputField
                labelName="Combo Price"
                inputType="number"
                name="comboPrice"
                placeholderText="0.00"
                control={control}
                trigger={trigger}
                isRequired
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-800 text-sm font-semibold md:pl-2">
                    Starts At
                  </label>
                  <input
                    type="date"
                    {...methods.register("startsAt")}
                    className="border border-neutral-300 bg-neutral-100 p-3 rounded text-sm text-slate-700 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-800 text-sm font-semibold md:pl-2">
                    Ends At
                  </label>
                  <input
                    type="date"
                    {...methods.register("endsAt")}
                    className="border border-neutral-300 bg-neutral-100 p-3 rounded text-sm text-slate-700 outline-none"
                  />
                  {methods.formState.errors.endsAt && (
                    <p className="text-red-500 text-xs font-medium pl-2">
                      {methods.formState.errors.endsAt.message as string}
                    </p>
                  )}
                </div>
              </div>
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
          </div>

          {/* ── Right Sidebar ── */}
          <div className="w-60 shrink-0 flex flex-col gap-4 sticky top-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1">
              Combo Status
            </p>
            <SingleSelectSearch
              labelName="Status"
              name="status"
              control={control}
              options={[...COMMON_STATUS_OPTIONS]}
            />
            <div className="border border-neutral-200 rounded-lg p-3">
              <SwitchField
                labelName="Featured Combo"
                description="Highlight this combo on the storefront"
                name="isFeatured"
                control={control}
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <SubmitButton
                submitTitle="Save Combo"
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
