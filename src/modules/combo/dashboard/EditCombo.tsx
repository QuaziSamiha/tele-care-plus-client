"use client";

import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SwitchField from "@/components/shared/form/SwitchField";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { TextEditor } from "@/components/shared/form/TextEditor";
import MultipleImageInput from "@/components/shared/form/fileFields/MultipleMediaInput";
import { IModal } from "@/types/share-component.type";
import { usePatch } from "@/hooks/api/usePatch";
import { COMMON_STATUS_OPTIONS } from "@/constants/common.constants";
import { COMBO_API } from "@/constants/api";
import {
  updateComboSchema,
  UpdateComboFormData,
} from "../schemas/combo.schema";
import useAdminCombo from "../hooks/useAdminCombo";
import ComboItems from "./ComboItems";
import { ICombo } from "../types/combo.type";

interface ComboItemDraft {
  categoryId?: string | number;
  productId?: string | number;
  variantId?: string | number;
  quantity?: number;
}

function toDateInputValue(d?: string | Date): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditCombo({ data, setOpen, refetch }: IModal) {
  const combo = data as ICombo;
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const { productOptions, productOptionsLoading } = useAdminCombo();

  const methods = useForm<UpdateComboFormData>({
    resolver: zodResolver(
      updateComboSchema,
    ) as unknown as Resolver<UpdateComboFormData>,
    defaultValues: {
      title: combo?.title,
      shortDescription: combo?.shortDescription ?? "",
      shortDescTh: combo?.shortDescTh ?? "",
      description: combo?.description ?? "",
      descriptionTh: combo?.descriptionTh ?? "",
      comboPrice: combo?.comboPrice ?? 0,
      startsAt: toDateInputValue(combo?.startsAt),
      endsAt: toDateInputValue(combo?.endsAt),
      status: combo?.status ?? "DRAFT",
      isFeatured: combo?.isFeatured ?? false,
      items:
        combo?.items?.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
          // UI-only helper so the category dropdown is pre-selected
          categoryId: it.product?.categoryId,
        })) ?? [{ quantity: 1 } as never],
      comboImages:
        combo?.images?.map((img) => ({
          filePath: img.url,
          name: img.altText || "Combo image",
          attachId: img.id,
        })) ?? [],
    },
  });

  const {
    control,
    trigger,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = methods;

  const { mutate: updateCombo, isPending } = usePatch(
    COMBO_API.paths.UPDATE(combo?.id ?? 0),
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (err) => console.error("Failed to update combo:", err),
  );

  const handleRemoveImage = (attachId: number) => {
    setRemovedImageIds((prev) => [...prev, attachId]);
  };

  const onSubmit: SubmitHandler<UpdateComboFormData> = (data) => {
    if (!isDirty && removedImageIds.length === 0) {
      toast.info("No changes detected!");
      setOpen?.(false);
      return;
    }

    const formData = new FormData();

    if (dirtyFields.title && data.title) formData.append("title", data.title);
    if (dirtyFields.shortDescription && data.shortDescription !== undefined)
      formData.append("shortDescription", data.shortDescription);
    if (dirtyFields.shortDescTh && data.shortDescTh !== undefined)
      formData.append("shortDescTh", data.shortDescTh);
    if (dirtyFields.description && data.description !== undefined)
      formData.append("description", data.description);
    if (dirtyFields.descriptionTh && data.descriptionTh !== undefined)
      formData.append("descriptionTh", data.descriptionTh);

    if (dirtyFields.comboPrice && data.comboPrice !== undefined)
      formData.append("comboPrice", String(data.comboPrice));

    if (dirtyFields.startsAt)
      formData.append(
        "startsAt",
        data.startsAt ? new Date(data.startsAt).toISOString() : "",
      );
    if (dirtyFields.endsAt)
      formData.append(
        "endsAt",
        data.endsAt ? new Date(data.endsAt).toISOString() : "",
      );

    if (dirtyFields.status && data.status)
      formData.append("status", data.status);
    if (dirtyFields.isFeatured !== undefined)
      formData.append("isFeatured", data.isFeatured ? "true" : "false");

    if (dirtyFields.items) {
      const items = (data.items as ComboItemDraft[] | undefined)?.filter(
        (it) => it.productId,
      );
      if (items && items.length > 0) {
        formData.append(
          "items",
          JSON.stringify(
            items.map((it) => ({
              productId: Number(it.productId),
              variantId: it.variantId ? Number(it.variantId) : undefined,
              quantity: Number(it.quantity ?? 1) || 1,
            })),
          ),
        );
      }
    }

    if (dirtyFields.comboImages && data.comboImages) {
      data.comboImages.forEach((file) => {
        if (file instanceof File) formData.append("images", file);
      });
    }

    if (removedImageIds.length > 0) {
      formData.append("deleteImageIds", JSON.stringify(removedImageIds));
    }

    updateCombo(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-6 w-full">
      <div className="sticky top-0 z-20 bg-white py-4">
        <p className="text-2xl font-semibold text-slate-800">Edit Combo</p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-6 items-start"
        >
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1 mb-3">
                Combo Product Images
              </p>
              <MultipleImageInput
                label="Combo Images"
                name="comboImages"
                control={control}
                multiple
                maxFileSize={5 * 1024 * 1024}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            <ComboItems
              productOptions={productOptions}
              isLoading={productOptionsLoading}
            />

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
              />
              <InputField
                labelName="Combo Price"
                inputType="number"
                name="comboPrice"
                placeholderText="0.00"
                control={control}
                trigger={trigger}
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
                submitTitle="Update Combo"
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
