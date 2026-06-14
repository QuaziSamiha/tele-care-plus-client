"use client";
import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import SubmitButton from "@/components/shared/form/SubmitButton";
import { IModal } from "@/types/share-component.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import SingleMediaInput from "@/components/shared/form/fileFields/SingleMediaInput";
import { BlogFormData, blogSchema } from "../schemas/blog.schema";
import { usePost } from "@/hooks/api/usePost";
import { BLOG_API } from "@/constants/api";
import { TextEditor } from "@/components/shared/form/TextEditor";

const BLOG_CATEGORY_OPTIONS = [
  { id: "Patient Stories", name: "Patient Stories" },
  { id: "Wellness Guides", name: "Wellness Guides" },
  { id: "Product Reviews", name: "Product Reviews" },
];

const BLOG_STATUS_OPTIONS = [
  { id: "PUBLISHED", name: "Published" },
  { id: "DRAFT", name: "Draft" },
  { id: "ARCHIVED", name: "Archived" },
];

export default function AddBlog({ setOpen, refetch }: IModal) {
  const { control, trigger, handleSubmit } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "DRAFT",
    },
  });

  const { mutate: addBlog, isPending } = usePost(
    BLOG_API.paths.CREATE,
    (data) => {
      console.log("Blog created successfully:", data);
      setOpen?.(false);
      refetch?.();
    },
    (error) => {
      console.error("Blog creation failed:", error);
    },
  );

  const onSubmit: SubmitHandler<BlogFormData> = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.blogCategory) {
      formData.append("blogCategory", data.blogCategory);
    }
    if (data.status) {
      formData.append("status", data.status);
    }

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    
    addBlog(formData);
  };

  return (
    <section className="p-6 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <p className="text-2xl font-semibold text-slate-800">Add Blog</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 w-full">
            <InputField
              labelName="Blog Title"
              name="title"
              placeholderText="Enter blog title..."
              control={control}
              trigger={trigger}
              isRequired
            />
            <SingleSelectSearch
              labelName="Blog Category"
              name="blogCategory"
              control={control}
              options={BLOG_CATEGORY_OPTIONS}
            />
            <SingleSelectSearch
              labelName="Status"
              name="status"
              control={control}
              options={BLOG_STATUS_OPTIONS}
            />
          </div>
          <div className="w-full">
             <SingleMediaInput
              name="image"
              label="Blog Image"
              control={control}
              maxFileSize={5 * 1024 * 1024} // 5MB
              acceptedFileTypes={["image/*"]}
            />
          </div>
        </div>

        <div className="w-full">
          <TextEditor
            labelName="Write the text"
            name="content"
            control={control}
            trigger={trigger}
            isRequired
            placeholderText="Write text here..."
          />
        </div>

        <div className="flex items-end justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setOpen?.(false)}
            className="border border-neutral-300 font-semibold text-sm text-neutral-600 rounded-md cursor-pointer px-6 py-2.5 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <SubmitButton
            submitTitle="Save"
            isPending={isPending}
            buttonWidth="w-fit"
          />
        </div>
      </form>
    </section>
  );
}
