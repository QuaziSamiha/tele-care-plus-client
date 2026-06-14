import { axiosInstance } from "@/lib/axios/axiosInstance";
import { IGenericErrorResponse } from "@/types/response.type";
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

type CustomQueryOptions<T> = Omit<
  UseQueryOptions<T, IGenericErrorResponse, T, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetAll = <T>(
  endpoint: string,
  queryKey: string[],
  queryParams?: Record<string, unknown>,
  options?: CustomQueryOptions<T>,
  shouldFetch: boolean = true,
) => {
  return useQuery<T, IGenericErrorResponse>({
    queryKey,
    queryFn: async (): Promise<T> => {
      try {
        const response = await axiosInstance.get<T>(endpoint, {
          params: queryParams,
        });
        return response.data as T;
      } catch (error) {
        const err = error as IGenericErrorResponse;

        //* NETWORK ERRORS (statusCode 0) ARE HANDLED BY THE AXIOS INTERCEPTOR —
        //* navigateToErrorPage(0) IS ALREADY IN FLIGHT. SKIP THE TOAST TO AVOID
        //* A FLASH BEFORE THE PAGE NAVIGATES AWAY.
        if (err?.statusCode !== 0) {
          toast.error(err?.message || "Failed to fetch data.");
        }

        throw error;
      }
    },
    enabled: shouldFetch,
    //* NEVER RETRY NETWORK ERRORS — server is unreachable, retries only flood the console
    //* AND re-trigger the interceptor on each attempt
    retry: (failureCount, error) => {
      if ((error as IGenericErrorResponse)?.statusCode === 0) return false;
      return failureCount < 3;
    },
    ...options,
  });
};

// import { axiosInstance } from "@/lib/axios/axiosInstance";
// import { IGenericErrorResponse } from "@/types/response.type";
// import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// type CustomQueryOptions<T> = Omit<
//   UseQueryOptions<T, IGenericErrorResponse, T, QueryKey>,
//   "queryKey" | "queryFn"
// >;

// export const useGetAll = <T>(
//   endpoint: string,
//   queryKey: string[],
//   queryParams?: Record<string, unknown>,
//   options?: CustomQueryOptions<T>,
//   shouldFetch: boolean = true,
// ) => {
//   return useQuery<T, IGenericErrorResponse>({
//     queryKey,
//     queryFn: async (): Promise<T> => {
//       try {
//         const response = await axiosInstance.get<T>(endpoint, {
//           params: queryParams,
//         });
//         return response as T;
//       } catch (error) {
//         if (error instanceof Error) {
//           toast.error(error.message || "Failed to fetch data.");
//         } else {
//           toast.error("Failed to fetch data.");
//         }
//         throw error;
//       }
//     },
//     enabled: shouldFetch,
//     ...options,
//   });
// };
