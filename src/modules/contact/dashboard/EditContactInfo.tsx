"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import InputField from "@/components/shared/form/InputField";
import TextAreaField from "@/components/shared/form/TextAreaField";
import { IContactInfo, IUpdateContactInfoForm } from "../types/contact.types";
import { useUpdateContactInfo } from "../hooks/useContact";

interface Props {
  data?: IContactInfo;
  onClose: () => void;
}

export default function EditContactInfo({ data, onClose }: Props) {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, trigger } =
    useForm<IUpdateContactInfoForm>();

  useEffect(() => {
    if (data) {
      reset({
        hotline: data.hotline,
        lineId: data.lineId ?? "",
        email: data.email,
        heading: data.heading,
        description: data.description,
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useUpdateContactInfo(() => {
    void queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    onClose();
  });

  const onSubmit = (values: IUpdateContactInfoForm) => {
    mutate(values as unknown as Record<string, unknown>);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="hotline"
            control={control}
            trigger={trigger}
            labelName="Hotline Number"
            placeholderText="+66 2 123 4567"
            isRequired
          />
          <InputField
            name="lineId"
            control={control}
            trigger={trigger}
            labelName="Line ID"
            placeholderText="+66 2 123 4567"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="email"
            control={control}
            trigger={trigger}
            labelName="Email"
            inputType="email"
            placeholderText="info@example.com"
            isRequired
          />
          <InputField
            name="heading"
            control={control}
            trigger={trigger}
            labelName="Heading"
            placeholderText="Contact us & our team"
            isRequired
          />
        </div>

        {/* Description */}
        <TextAreaField
          name="description"
          control={control}
          trigger={trigger}
          labelName="Description"
          placeholderText="Enter contact description..."
          rowNo={5}
          isRequired
        />

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-neutral-300 text-neutral-600 font-semibold px-5 py-2.5 rounded cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#6a994e] hover:bg-[#588040] text-white font-semibold px-5 py-2.5 rounded cursor-pointer disabled:opacity-60 transition-colors"
          >
            {isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
