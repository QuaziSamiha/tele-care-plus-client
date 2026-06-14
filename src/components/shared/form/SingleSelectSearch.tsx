"use client";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldValues, Path, PathValue, useController } from "react-hook-form";
import { Search } from "lucide-react";
import { ISingleSelectSearch } from "@/types/form.type";

const SingleSelectSearch = <T extends FieldValues>({
  labelName,
  name,
  options = [],
  control,
  isRequired = false,
  isLoading = false,
  defaultValue,
  isDisabled = false,
  onSelectionChange,
}: ISingleSelectSearch<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<T>({
    name: name as Path<T>,
    control,
    rules: { required: isRequired ? "This field is required" : false },
    defaultValue: defaultValue as PathValue<T, Path<T>>,
  });


  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 w-full relative">
        <label className="text-slate-800 text-sm font-semibold md:pl-2">
          {labelName}
          {isRequired && (
            <span className="text-red-500 px-0.5 text-base">*</span>
          )}
        </label>

        {isLoading ? (
          <Skeleton className="w-full h-11 bg-slate-50" />
        ) : (
          <>
            <Select
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                  setSearchTerm("");
                }
              }}
              value={value ? String(value) : ""}
              onValueChange={(selectedValue) => {
                onChange(selectedValue);
                if (onSelectionChange) {
                  const selectedOption = options.find(
                    (opt) => String(opt.id) === selectedValue,
                  );
                  if (selectedOption) {
                    onSelectionChange(selectedValue, selectedOption.name);
                  }
                }
              }}
            >
              <SelectTrigger
                disabled={isDisabled}
                className="min-h-11 px-3 py-1 text-sm text-slate-800 rounded bg-neutral-100 border border-neutral-300 cursor-pointer flex items-center gap-2 overflow-hidden "
              >
                <SelectValue placeholder={labelName} />
              </SelectTrigger>

              <SelectContent className="z-50 p-0 absolute min-w-full border border-neutral-300 rounded">
                {/* Search Bar */}
                <div className="px-2 border-b border-neutral-300 sticky top-0 bg-white z-10">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 text-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-8 pr-2 py-2 rounded-md focus:outline-none text-sm placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSearchTerm(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDownCapture={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Filtered Options */}
                <div className="max-h-60 overflow-y-auto scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={String(option.id)}
                        className={`cursor-pointer hover:bg-gray-100 my-1 ${
                          String(value) === String(option.id)
                            ? "bg-mauve-700/10 text-mauve-800 text-sm"
                            : "text-sm text-slate-700"
                        }`}
                      >
                        {option.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-slate-700 text-center">
                      No options found
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>

            {error && (
              <p className="text-red-500 text-xs font-medium px-2 absolute -bottom-6 left-0">
                {error.message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleSelectSearch;
