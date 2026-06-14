"use client";

import {
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  useController,
} from "react-hook-form";

interface ISwitchField<T extends FieldValues> {
  labelName: string;
  description?: string;
  name: Path<T>;
  control: Control<T>;
  defaultValue?: boolean;
  disabled?: boolean;
}

export default function SwitchField<T extends FieldValues>({
  labelName,
  description,
  name,
  control,
  defaultValue,
  disabled,
}: ISwitchField<T>) {
  const {
    field: { value, onChange },
  } = useController<T>({
    name,
    control,
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });

  const checked = Boolean(value);

  return (
    <label
      className={`flex items-center justify-between gap-3 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-neutralPrimary-800 text-sm font-semibold">
          {labelName}
        </span>
        {description && (
          <span className="text-xs text-neutral-500 leading-snug">
            {description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
            checked ? "text-emerald-600" : "text-neutral-400"
          }`}
        >
          {checked ? "On" : "Off"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            checked
              ? "bg-emerald-500 focus:ring-emerald-400"
              : "bg-slate-300 focus:ring-slate-400"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </label>
  );
}
