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
import { CategoryFormData, categorySchema } from "../schemas/category.schema";
import { usePost } from "@/hooks/api/usePost";
import { CATEGORY_API } from "@/constants/api";

export default function AddCategory({ setOpen, refetch }: IModal) {
  const { rootCategories, rootCategoryLoading } = useCategory();

  const { control, trigger, handleSubmit } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const { mutate: addCategory, isPending } = usePost(
    CATEGORY_API.paths.CREATE,
    (data) => {
      console.log("Account created successfully:", data);
      setOpen?.(false);
      refetch?.();
    },
    (error) => {
      console.error("Signup failed:", error);
    },
  );

  const onSubmit: SubmitHandler<CategoryFormData> = (data) => {
    console.log(data);
    const formData = new FormData();

    // 1. Append text fields
    formData.append("name", data.categoryName);
    formData.append("status", data.status || "ACTIVE");

    if (data.parentId) {
      formData.append("parentId", data.parentId.toString());
    }

    if (data.image instanceof File) {
      formData.append("bannerImage", data.image);
    }
    addCategory(formData);
  };
  return (
    <section className="p-6 flex flex-col gap-4 w-full">
      <p className="text-2xl font-semibold text-slate-800">Add Category</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InputField
          labelName="Category Name"
          name="categoryName"
          placeholderText="Enter category name..."
          control={control}
          trigger={trigger}
          isRequired
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
          />
        </div>
        <SingleMediaInput
          name="image"
          label="Image"
          control={control}
          maxFileSize={5 * 1024 * 1024} // 5MB
          acceptedFileTypes={["image/*"]} // Only images
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
            submitTitle="Add Category"
            isPending={isPending}
            buttonWidth="w-fit"
          />
        </div>
      </form>
    </section>
  );
}
