"use client";

import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import useCategory from "../hooks/useCategory";
import { COMMON_STATUS_OPTIONS } from "@/constants/common.constants";
import SingleMediaInput from "@/components/shared/form/fileFields/SingleMediaInput";
import {
  UpdateCategoryFormData,
  updateCategorySchema,
} from "../schemas/category.schema";
import { toast } from "react-toastify";
import { ICategory } from "../types/category.type";
import { usePatch } from "@/hooks/api/usePatch";
import { CATEGORY_API } from "@/constants/api";

export default function EditCategory({
  data,
  setOpen,
  refetch,
  isLoading,
}: IModal) {
  const rowData = data as ICategory;
  const { rootCategories, rootCategoryLoading } = useCategory();

  const {
    control,
    trigger,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      categoryName: rowData?.name,
      parentId: rowData?.parentId?.toString(),
      status: rowData?.status,
      image: rowData?.bannerUrl ?? undefined,
    },
  });

  const { mutate: updateCategory, isPending } = usePatch(
    CATEGORY_API.paths.UPDATE(rowData.id),
    () => {
      setOpen?.(false);
      refetch?.();
    },
    (error) => {
      console.error("Update failed:", error);
    },
  );

  const onSubmit: SubmitHandler<UpdateCategoryFormData> = (data) => {
    if (!isDirty) {
      toast.info("No changes detected!");
      setOpen?.(false);
      return;
    }

    const formData = new FormData();

    if (dirtyFields.categoryName && data.categoryName !== undefined) {
      formData.append("name", data.categoryName);
    }
    if (dirtyFields.status && data.status !== undefined) {
      formData.append("status", data.status);
    }
    if (dirtyFields.parentId && data.parentId != null) {
      formData.append("parentId", data.parentId.toString());
    }
    if (dirtyFields.image && data.image instanceof File) {
      formData.append("bannerImage", data.image);
    }

    updateCategory(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-4 w-full">
      <p className="text-2xl font-semibold text-slate-800">Edit Category</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InputField
          labelName="Category Name"
          name="categoryName"
          placeholderText="Enter category name..."
          control={control}
          trigger={trigger}
          isLoading={isLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleSelectSearch
            labelName="Root Category"
            name="parentId"
            control={control}
            options={rootCategories}
            isLoading={rootCategoryLoading}
          />
          <SingleSelectSearch
            labelName="Status"
            name="status"
            control={control}
            options={[...COMMON_STATUS_OPTIONS]}
            isLoading={isLoading}
          />
        </div>
        <SingleMediaInput
          name="image"
          label="Banner Image"
          control={control}
          maxFileSize={5 * 1024 * 1024}
          acceptedFileTypes={["image/*"]}
        />
        <div className="flex items-end justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen?.(false)}
            className="border border-neutral-300 font-semibold text-base text-neutral-600 rounded cursor-pointer px-5 py-2.5"
          >
            Cancel
          </button>
          <SubmitButton
            submitTitle="Update Category"
            isPending={isPending}
            buttonWidth="w-fit"
          />
        </div>
      </form>
    </section>
  );
}
