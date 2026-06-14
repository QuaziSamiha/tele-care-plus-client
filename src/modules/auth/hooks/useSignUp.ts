import { USER_API } from "@/constants/api";
import { usePost } from "@/hooks/api/usePost";
import type { IGenericErrorResponse } from "@/types/response.type";

export const useSignUp = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: IGenericErrorResponse) => void,
) => {
  return usePost(USER_API.paths.CREATE, onSuccess, onError);
};
