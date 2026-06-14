import { TImageInput } from "@/types/form.type";

export const mediaHelpers = {
  getImageName: (image: TImageInput): string => {
    if (image instanceof File) return image.name;
    if (typeof image === "string") return image.split("/").pop() || image;
    if (image.name) return image.name;
    if (typeof image === "object" && "filePath" in image) {
      return image.filePath.split("/").pop() || `Media_${image.attachId}`;
    }
    return "Media";
  },

  getImageUrl: (image: TImageInput): string => {
    if (image instanceof File) {
      return URL.createObjectURL(image); //? To show a preview, a temporary blob URL that the browser can render as an image.
    }
    if (typeof image === "string") return image;
    return image.filePath; //? If it's not a File, it's likely an image fetched from the backend.
  },

  
  //? Helper function to get file extension
  getFileExtension : (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  },
  
  //? Helper function to check if file is an image
//   isImageFile : (file: File): boolean => {
//     return file.type.startsWith("image/");
//   },
  
//   //? Helper function to check if file is a video
//   isVideoFile:(file: File): boolean => {
//     return file.type.startsWith("video/");
//   },
  
//   //? Helper function to get file type icon
//   getFileIcon :(file: TImageInput): React.ReactNode => {
//     if (file instanceof File) {
//       if (isImageFile(file)) {
//         return <ImageIcon className="text-greenPrimary-500" />;
//       } else if (isVideoFile(file)) {
//         return <FileIcon className="text-blue-500" />;
//       }
//       return <FileIcon className="text-gray-500" />;
//     }
  
//     // For existing files from backend
//     const url =
//       typeof file === "string"
//         ? file
//         : typeof file === "object" && "filePath" in file
//           ? file.filePath
//           : "";
//     const extension = url ? getFileExtension(url) : "";
  
//     if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
//       return <ImageIcon className="text-greenPrimary-500" />;
//     }
//     return <FileIcon className="text-gray-500" />;
//   },
  
};
