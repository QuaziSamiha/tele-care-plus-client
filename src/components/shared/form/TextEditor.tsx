"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ITextEditor } from "@/types/form.type";
import { useEffect } from "react";
import {
  type FieldValues,
  type Path,
  type PathValue,
  useController,
} from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const formats = ["size", "bold", "underline", "list"];

export function TextEditor<T extends FieldValues>({
  labelName,
  placeholderText,
  name,
  control,
  trigger,
  isRequired,
  disabled,
  defaultValue,
  requiredMessage = "This field is required.",
  isLoading,
}: ITextEditor<T>) {
  const { field, fieldState } = useController<T>({
    name: name as Path<T>,
    control,
    rules: isRequired ? { required: requiredMessage } : {},
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });

  useEffect(() => {
    if (field.value !== undefined) {
      field.onChange(field.value);
    }
  }, [field.value]);

  const handleChange = (content: string) => {
    field.onChange(content);
    if (trigger) {
      trigger(field.name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24 md:ml-2" />
        <Skeleton className="h-[150px] w-full rounded-md" />{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-neutralPrimary-800 text-sm font-semibold md:pl-2">
        {labelName}
        {isRequired && !disabled && (
          <span className="text-destructive-500 px-0.5 text-base">*</span>
        )}{" "}
      </label>
      <div className="quill-container">
        <ReactQuill
          theme="snow"
          value={field.value || ""}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholderText}
          className="text-editor w-full"
        />
      </div>
      {fieldState?.error && !disabled && (
        <p className="text-destructive-500 text-sm pl-2 -mt-1">
          {fieldState?.error?.message}
        </p>
      )}
    </div>
  );
}

/**
 * <TextEditor
              labelName="Overview"
              name="overview"
              control={control}
              trigger={trigger}
            />
 */
