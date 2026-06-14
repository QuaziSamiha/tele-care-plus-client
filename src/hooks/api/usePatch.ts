import { apiService } from "@/services/api.service";
import { IGenericErrorResponse, IResponseSuccess } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePatch = <T>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  onError?: (error: IGenericErrorResponse) => void,
) => {
  return useMutation({
    // We pass "PATCH" instead of "POST" here
    mutationFn: (data: Record<string, unknown> | FormData) =>
      apiService.mutation("PATCH", endpoint, data) as Promise<IResponseSuccess>,

    onSuccess: (response: IResponseSuccess) => {
      const { statusCode, message, data } = response;
      
      if (statusCode >= 200 && statusCode < 300) {
        toast.success(message || "Updated successfully");
      } else if (statusCode >= 400 && statusCode < 500) {
        if (Array.isArray(message)) {
          message.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(message ?? "Update failed");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }

      if (onSuccess) {
        onSuccess(data as T);
      }
    },

    onError: (error: IGenericErrorResponse) => {
      toast.error(error.message || "An error occurred");
      if (onError) onError(error);
    },
  });
};