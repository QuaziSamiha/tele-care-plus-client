"use client";

import { IPasswordField } from "@/types/form.type";
import { useState } from "react";
import { FieldValues, useController } from "react-hook-form";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";

export default function PasswordField<T extends FieldValues>({
  labelName,
  placeholderText,
  name,
  control,
  trigger,
  disabled,
  isRequired,
  requiredMessage = "This field is required.",
}: IPasswordField<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { field, fieldState } = useController<T>({
    name,
    control,
    rules: isRequired ? { required: requiredMessage } : {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
    trigger?.(field.name);
  };

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="text-textPrimary text-sm font-semibold pl-2">
        {labelName}
        {isRequired && !disabled && (
          <span className="text-red-500 px-0.5 text-base">*</span>
        )}
      </label>
      <div className="flex items-center gap-2 border border-neutral-300 bg-neutral-100 py-2.5 px-3 rounded w-full">
        {/* <TbLockPause fontSize={20} className="text-blueActual" /> */}
        <input
          className="outline-none font-normal text-neutral-700 placeholder:text-neutral-400 text-sm w-full disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type={`${showPassword ? "text" : "password"}`}
          placeholder={placeholderText}
          value={field.value ?? ""}
          onChange={handleChange}
          name={field.name}
          disabled={disabled}
        />
        {showPassword ? (
          <FaEye
            onClick={() => setShowPassword(false)}
            className="text-textPrimary cursor-pointer"
            fontSize={20}
          />
        ) : (
          <BsFillEyeSlashFill
            onClick={() => setShowPassword(true)}
            className="text-textPrimary cursor-pointer"
            fontSize={20}
          />
        )}
      </div>
      <div>
        {fieldState.error && !disabled && (
          <p className="text-red-500 text-xs font-medium pl-2 absolute `bottom-[-24px]` left-0">
            {fieldState.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
