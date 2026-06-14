"use client";

import { FieldValues, Path, PathValue, useController } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { IInputField } from "@/types/form.type";

export default function InputField<
  T extends FieldValues,
  Type extends "text" | "number" | "email",
>({
  labelName,
  inputType = "text" as Type,
  IconComponent,
  placeholderText,
  name,
  control,
  trigger,
  disabled,
  isRequired,
  defaultValue,
  isLoading = false,
  requiredMessage = "This field is required.",
  autoFocus = false,
  onKeyDown,
  onPaste,
  inputRef,
}: IInputField<T, Type>) {
  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: isRequired ? { required: requiredMessage } : {},
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputType === "number") {
      const raw = e.target.value;
      const next = raw === "" ? null : Number(raw);
      // const next = raw === "" ? undefined : Number(raw);
      field.onChange(next);
    } else {
      field.onChange(e.target.value);
    }
    trigger?.(field.name);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 w-full relative">
        <div>
          <label className="text-slate-800 text-sm font-semibold md:pl-2">
            {labelName}
            {isRequired && !disabled && (
              <span className="text-red-500 px-0.5 text-base">*</span>
            )}
          </label>
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 border border-neutral-300 p-3 rounded w-full">
          {/* <div className="flex items-center gap-2 border border-neutral-300 py-2.5 px-3 rounded-md w-full"> */}
            {/* Icon placeholder */}
            <Skeleton className="h-4 w-4 rounded-sm" />

            {/* Input text placeholder */}
            <Skeleton className="h-4 w-full rounded-sm" />
          </div>
        ) : (
          <div className="flex items-center bg-neutral-100 gap-2 border border-neutral-300 disabled:border-neutral-100 p-3 rounded w-full disabled:cursor-not-allowed">
          {/* <div className="flex items-center bg-neutral-100 gap-2 border border-neutral-300 disabled:border-neutral-100 py-2.5 px-3 rounded-md w-full disabled:cursor-not-allowed"> */}
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <input
              ref={inputRef}
              className="outline-none font-normal text-neutral-700 placeholder:text-neutral-400 text-sm w-full disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type={inputType}
              placeholder={placeholderText}
              value={field.value ?? ""}
              onChange={handleChange}
              name={field.name}
              disabled={disabled}
              onWheel={(e) => e.currentTarget.blur()}
              autoFocus={autoFocus}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
            />
          </div>
        )}
        <div>
          {fieldState.error && !disabled && (
            <p className="text-red-500 text-xs font-medium pl-2 absolute `bottom-[-24px]` left-0">
              {fieldState.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
