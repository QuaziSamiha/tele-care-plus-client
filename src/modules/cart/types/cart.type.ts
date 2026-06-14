import { ProductType } from "@/modules/product/types/product.type";

export interface ICartItem {
  id: string;
  productId: number;
  variantId?: number;
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  salePrice?: number;
  size?: string;
  type: ProductType;
  quantity: number;
  addedAt: string;
}
