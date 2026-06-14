import { useGetAll } from "@/hooks/api/useGetAll";
import { IHomeData } from "../types/home.type";
import { PRODUCT_API } from "@/constants/api";

export function useGetHomeData() {
  return useGetAll<{ data: IHomeData }>(PRODUCT_API.paths.HOME, PRODUCT_API.keys.HOME);
}
