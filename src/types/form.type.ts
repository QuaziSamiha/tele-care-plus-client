import { ReactNode } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormTrigger,
} from "react-hook-form";
import { IconType } from "react-icons/lib";

// ============= THIS INPUT FIELD IS USEFUL FOR USE-FIELD-ARRAY ===================
export interface IInputField<
  T extends FieldValues,
  Type extends "text" | "number" | "email",
> {
  labelName?: string;
  inputType?: Type;
  IconComponent?: IconType | undefined;
  placeholderText?: string;
  name: Path<T>;
  control?: Control<T>;
  trigger?: UseFormTrigger<T>;
  disabled?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
  defaultValue?: Type extends "number" ? number : string;
  requiredMessage?: string;
  autoFocus?: boolean; // Add this line
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add this
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>; // Add this
}

// ============= PASSWORD FIELD ===================
export interface IPasswordField<T extends FieldValues> {
  labelName?: string;
  placeholderText: string;
  name: Path<T>;
  control?: Control<T>;
  trigger?: UseFormTrigger<T>;
  disabled?: boolean;
  isRequired?: boolean;
  requiredMessage?: string;
}

// ========= FORM SUBMIT BUTTON ==========
export interface ISubmitButton {
  submitTitle: string;
  bgColor?: string;
  hoverBgColor?: string;
  submittedForm?: string;
  buttonWidth?: string;
  isPending?: boolean;
}

// ============= TEXTAREA ===========
export interface ITextArea<T extends FieldValues> {
  labelName?: string;
  inputType?: string;
  placeholderText: string;
  rowNo?: number;
  name: Path<T>;
  control: Control<T>;
  trigger?: UseFormTrigger<T>;
  disabled?: boolean;
  isRequired?: boolean;
  defaultValue?: string;
  requiredMessage?: string;
  isLoading?: boolean;
}

// ============= SINGLE MEDIA INPUT FIELD =============
export type TImageInput =
  | File
  | string
  | IImagePreview
  | { filePath: string; name: string; attachId?: number };

export interface IImagePreview {
  attachId: number;
  filePath: string;
  fileSize: number;
  mimeType: string;
  name?: string;
}

export interface IImageInput<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  isRequired?: boolean;
  maxFileSize?: number;
  multiple?: boolean;
  onEdit?: (image: TImageInput, index: number) => void;
  onRemoveImage?: (attachId: number) => void;
}

export interface IMediaInput<T extends FieldValues> extends Omit<
  IImageInput<T>,
  "multiple" | "maxFileSize"
> {
  maxFileSize?: number;
  acceptedFileTypes?: string[]; // e.g., ['image/*', 'video/*']
  onRemove?: (media: TImageInput) => void;
}

// =============== SELECT SINGLE ITEM INPUT FIELD, THERE WILL BE SEARCH OPTION ===================
export interface ISingleSelectOption {
  id: string | number;
  name: string;
}

export interface ISingleSelectSearch<T extends FieldValues> {
  labelName: string;
  name: Path<T>;
  options: ISingleSelectOption[];
  control: Control<T>;
  isRequired?: boolean;
  isLoading?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  isDisabled?: boolean;
  onSelectionChange?: (id: string, name: string) => void;
}

// =========== TEXT EDITOR ===========
export interface ITextEditor<T extends FieldValues> {
  labelName?: string;
  placeholderText?: string;
  name: Path<T>;
  control: Control<T>;
  trigger?: UseFormTrigger<T>;
  disabled?: boolean;
  isRequired?: boolean;
  defaultValue?: string;
  requiredMessage?: string;
  isLoading?: boolean;
}
