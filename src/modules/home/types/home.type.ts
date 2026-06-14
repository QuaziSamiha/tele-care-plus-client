import { IProduct } from "@/modules/product/types/product.type";

export interface IHomeCategory {
  id: number;
  name: string;
  nameTh?: string;
  slug: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  productCount: number;
}

export interface IHomeData {
  categories: IHomeCategory[];
  comboProducts: IProduct[];
  featuredProducts: IProduct[];
  bestProducts: IProduct[];
}
