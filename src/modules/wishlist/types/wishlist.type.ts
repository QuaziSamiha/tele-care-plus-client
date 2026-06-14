import { ProductType } from "@/modules/product/types/product.type";

export interface IWishlistItem {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  salePrice?: number;
  type: ProductType;
  addedAt: string;
}
