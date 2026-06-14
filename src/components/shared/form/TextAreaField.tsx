import { Textarea } from "@/components/ui/textarea";
import { ITextArea } from "@/types/form.type";
import { FieldValues, Path, PathValue, useController } from "react-hook-form";

const TextAreaField = <T extends FieldValues>({
  labelName,
  placeholderText,
  name,
  control,
  trigger,
  rowNo = 16,
  isRequired,
  disabled,
  defaultValue,
  requiredMessage = "This field is required.",
  isLoading = false,
}: ITextArea<T>) => {
  const { field, fieldState } = useController<T>({
    name: name as Path<T>,
    control,
    rules: isRequired ? { required: requiredMessage } : {},
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e.target.value);
    if (trigger) {
      trigger(field.name);
    }
  };

  // 🦴 Skeleton Loader
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full animate-pulse">
        <div className="h-4 w-1/3 bg-neutral-200 rounded"></div>
        <div
          className={`w-full h-[${rowNo * 12}px] bg-neutral-200 rounded`}
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="text-slate-800 font-semibold text-sm pl-2">
        {labelName}
        {isRequired && !disabled && (
          <span className="text-red-500 text-base px-0.5">*</span>
        )}
      </label>

      <Textarea
        id={String(name)}
        placeholder={placeholderText}
        disabled={disabled}
        name={field.name}
        value={field.value ?? ""}
        onChange={handleChange}
        rows={rowNo}
        className="w-full border rounded p-2 resize-none"
      />

      {/* Error Message */}
      {fieldState?.error && !disabled && (
        <p className="text-red-500 text-xs font-medium pl-2 absolute bottom-[-24px] left-0">
          {fieldState?.error?.message}
        </p>
      )}
    </div>
  );
};

export default TextAreaField;
