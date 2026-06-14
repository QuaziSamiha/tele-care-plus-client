import { axiosInstance } from "@/lib/axios/axiosInstance";

type HttpMethod = "POST" | "PATCH" | "PUT" | "DELETE";

export const apiService = {
  // A single method to handle all mutations (POST, PATCH, etc.)
  mutation: async (
    method: HttpMethod,
    endpoint: string,
    data: Record<string, unknown> | FormData,
  ) => {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
