import { axiosInstance } from "@/lib/axios/axiosInstance";
import { navigateToErrorPage } from "@/lib/utils/errorRouter";
import { IGenericErrorResponse } from "@/types/response.type";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

type CustomQueryOptions<T> = Omit<
  UseQueryOptions<T, IGenericErrorResponse, T, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGet = <T>(
  endpoint: string,
  queryKey: string[],
  queryParams?: Record<string, unknown>,
  shouldFetch: boolean = true,
  options?: CustomQueryOptions<T>,
) => {
  return useQuery<T, IGenericErrorResponse>({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint, {
        params: queryParams,
      });
      return response.data;
    },
    enabled: shouldFetch,
    //* NEVER RETRY NETWORK ERRORS — server is unreachable, retries only flood the console
    retry: (failureCount, error) => {
      if ((error as IGenericErrorResponse)?.statusCode === 0) return false;
      return failureCount < 3;
    },
    throwOnError: (error) => {
      const { statusCode } = error as IGenericErrorResponse;

      if (statusCode === 403) {
        navigateToErrorPage(403);
        return false;
      }

      if (statusCode === 429) {
        navigateToErrorPage(429);
        return false;
      }

      if (statusCode === 503) {
        navigateToErrorPage(503);
        return false;
      }

      // 5xx: let the nearest error.tsx boundary handle it
      if (statusCode >= 500) {
        return true;
      }

      // 4xx and network errors: show a toast and stay on page
      const message =
        (error as IGenericErrorResponse).message ?? "Failed to fetch data.";
      toast.error(message);
      return false;
    },
    ...options,
  });
};
