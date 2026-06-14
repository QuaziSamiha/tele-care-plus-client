"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IImageInput, IImagePreview, TImageInput } from "@/types/form.type";

//? Helper function to get image name
const getImageName = (image: TImageInput): string => {
  if (image instanceof File) return image.name;
  if (typeof image === "string") return image.split("/").pop() || image;
  if (image.name) return image.name;
  if (typeof image === "object" && "filePath" in image) {
    return image.filePath.split("/").pop() || `Image_${image.attachId}`;
  }
  return "Image";
};

//? Helper function to get image URL for preview
const getImageUrl = (image: TImageInput): string => {
  if (image instanceof File) {
    return URL.createObjectURL(image); //? To show a preview, a temporary blob URL that the browser can render as an image.
  }
  if (typeof image === "string") return image;
  return image.filePath; //? If it’s not a File, it’s likely an image fetched from the backend.
};

export default function MultipleImageInput<T extends FieldValues>({
  label,
  name,
  control,
  isRequired = false,
  maxFileSize,
  multiple = true,
  // onEdit,
  onRemoveImage,
}: IImageInput<T>) {
  const [selectedImages, setSelectedImages] = useState<TImageInput[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const MAX_FILE_SIZE = maxFileSize ?? 10 * 1024 * 1024; // Default to 10MB
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: isRequired ? `${label} is required` : false,
    },
  });

  // Load existing images from form value
  useEffect(() => {
    if (value && Array.isArray(value)) {
      const normalizedImages: TImageInput[] = value.map(
        (image: TImageInput): TImageInput => {
          if (image instanceof File) return image;
          if (typeof image === "string") return image;
          return {
            ...image,
            name: getImageName(image),
          } as IImagePreview;
        },
      );
      setSelectedImages(normalizedImages);

      // Generate preview URLs
      const urls = normalizedImages.map(getImageUrl);
      setPreviewUrls(urls);
    }
  }, [value]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validImages: File[] = [];
    let hasSizeError = false;
    let hasTypeError = false;

    // Validate each file
    Array.from(files).forEach((file) => {
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        hasTypeError = true;
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        hasSizeError = true;
        return;
      }

      validImages.push(file);
    });

    if (hasTypeError) {
      toast.error(
        "Only image files are allowed (PNG, JPG, JPEG, GIF, WebP, etc.)",
      );
    }

    if (hasSizeError) {
      toast.error(
        `Some images exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      );
    }

    if (validImages.length > 0) {
      const updatedImages = multiple
        ? [...selectedImages, ...validImages]
        : validImages;

      setSelectedImages(updatedImages);
      onChange(updatedImages);

      // Generate new preview URLs
      const newUrls = updatedImages.map(getImageUrl);
      setPreviewUrls(newUrls);
    }

    e.target.value = "";
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleDelete = (index: number) => {
    const deletedImage = selectedImages[index];

    if (
      !(deletedImage instanceof File) &&
      typeof deletedImage === "object" &&
      "attachId" in deletedImage &&
      deletedImage.attachId &&
      onRemoveImage
    ) {
      onRemoveImage(deletedImage.attachId);
    }

    // Revoke blob URL (cleanup)
    if (previewUrls[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    // Update state
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedImages(updatedImages);
    setPreviewUrls(updatedUrls);
    onChange(updatedImages);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* ================= LABEL ============= */}
      <label className="text-slate-800 text-sm font-semibold md:pl-2">
        {label}{" "}
        {isRequired && (
          <span className="text-red-500 text-base px-0.5">*</span>
        )}
      </label>

      <div className="w-full">
        <div className="min-h-40 bg-gray-50 border-2 border-dashed border-slate-300 rounded py-6 px-4">
          {selectedImages.length === 0 ? (
            // Show upload prompt when no images
            <div className="flex items-center justify-center h-32">
              <div className="flex flex-col gap-4 items-center">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <ImageIcon size={24} className="text-primary-500" />
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  Click to Add {label}
                </p>
                {/* ============== Add Button ==============  */}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="cursor-pointer mt-2 px-4 py-2 bg-mauve-700 text-white rounded transition-colors duration-200 flex items-center gap-2"
                >
                  <Upload size={16} />
                  Add {label}
                </button>
              </div>
            </div>
          ) : (
            // Show images in the middle with delete button only
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="px-3 py-1.5 bg-mauve-700 text-white text-sm rounded transition-colors duration-200 flex items-center gap-2"
                >
                  <Upload size={14} />
                  Add More
                </button>
              </div>

              {/* ============== IMAGE PREVIEW ==============  */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((image, index) => {
                  return (
                    <div
                      key={
                        image instanceof File
                          ? `${image.name}-${index}`
                          : typeof image === "object" &&
                              "attachId" in image &&
                              image.attachId
                            ? `${image.attachId}-${index}`
                            : `${getImageName(image)}-${index}`
                      }
                      className="relative border border-gray-200 rounded overflow-hidden bg-white shadow-sm"
                    >
                      {/* ========= DELETE BUTTON ==============  */}
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="cursor-pointer absolute right-2 top-2 z-10 p-1.5 bg-white hover:bg-red-50 rounded-full transition-colors duration-200 shadow-md"
                        title="Delete image"
                      >
                        <X size={14} className="text-red-500" />
                      </button>

                      {/* Image Preview */}
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={previewUrls[index] || "/placeholder.svg"}
                          alt={getImageName(image)}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <input
            id={`image-input-${name}`}
            hidden
            type="file"
            accept="image/*"
            multiple={multiple}
            ref={inputRef}
            onChange={handleImageChange}
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs font-medium pl-2 mt-1">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
