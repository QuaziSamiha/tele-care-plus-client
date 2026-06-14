"use client";

import { useGet } from "@/hooks/api/useGet";
import { useGetAll } from "@/hooks/api/useGetAll";
import { usePatch } from "@/hooks/api/usePatch";
import { IContactInfo, IContactMessage } from "../types/contact.types";
import { IGenericResponse, IMeta } from "@/types/response.type";
import { CONTACT_API } from "@/constants/api";

export const useContactInfo = () => {
  return useGet<IGenericResponse<IContactInfo>>(
    CONTACT_API.paths.INFO,
    CONTACT_API.keys.INFO,
  );
};

export const useContactMessages = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useGetAll<{ data: IContactMessage[]; meta: IMeta }>(
    CONTACT_API.paths.MESSAGES,
    [...CONTACT_API.keys.MESSAGES, JSON.stringify(params)],
    { page: params.page ?? 1, limit: params.limit ?? 10, search: params.search },
  );
};

export const useUpdateContactInfo = (onSuccess?: (data: IContactInfo) => void) => {
  return usePatch<IContactInfo>(CONTACT_API.paths.INFO, onSuccess);
};
