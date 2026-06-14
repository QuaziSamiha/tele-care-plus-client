import { apiService } from "@/services/api.service";
import { IGenericErrorResponse, IResponseSuccess } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePost = <T>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  onError?: (error: IGenericErrorResponse) => void,
) => {
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) =>
      apiService.mutation("POST", endpoint, data) as Promise<IResponseSuccess>,

    onSuccess: (response: IResponseSuccess) => {
      const { statusCode, message, data } = response;
      const isSuccess = statusCode >= 200 && statusCode < 300;

      if (isSuccess) {
        toast.success(message || "Operation successful");
      } else if (statusCode >= 400 && statusCode < 500) {
        if (Array.isArray(message)) {
          message.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error(message ?? "Action failed");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }

      if (isSuccess && onSuccess) {
        onSuccess(data as T);
      }
    },

    onError: (error: IGenericErrorResponse) => {
      toast.error(error.message);
      if (onError) onError(error);
    },
  });
};
