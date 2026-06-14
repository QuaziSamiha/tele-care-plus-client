import { IAdminUser } from "@/modules/user/types/user.types";

export enum ProductType {
  SIMPLE = "SIMPLE",
  VARIABLE = "VARIABLE",
  COMBO = "COMBO",
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
  DRAFT = "DRAFT",
  HIDDEN = "HIDDEN",
}

export enum DiscountType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
}

export interface IProductImage {
  id: number;
  url: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  iconUrl?: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  isActive: boolean;
  variantId: number;
  productId: number;
}

export interface IProductVariant {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  nameTh?: string;
  descriptionTh?: string;
  shortDescTh?: string;
  size?: string;
  price: number;
  discountType?: string;
  discountValue?: number;
  salePrice?: number;
  costPerItem?: number;
  quantity?: number;
  stockStatus: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  attributes?: unknown;
  isDefault: boolean;
  productId: number;
  images?: IProductImage;
}

export interface IProduct {
  id: number;
  sid: string;
  name: string;
  nameTh?: string;
  slug: string;
  sku?: string;
  barcode?: string;
  description?: string;
  descriptionTh?: string;
  shortDescription?: string;
  shortDescTh?: string;
  type: ProductType;
  status: ProductStatus;
  isFeatured: boolean;
  hasVariants: boolean;
  basePrice: number;
  discountType?: string;
  discountValue?: number;
  salePrice?: number;
  costPrice?: number;
  quantity: number;
  totalStock: number;
  stockStatus: StockStatus;
  weight?: number;
  dimensions?: Record<string, unknown>;
  seoMetadata?: Record<string, unknown>;
  tags: string[];
  dosage?: string;
  dosageTh?: string;
  ingredients?: string;
  ingredientsTh?: string;
  healthBenefits?: string;
  healthBenefitsTh?: string;
  warning?: string;
  warningTh?: string;
  storageInstructions?: string;
  storageInstructionsTh?: string;
  origin?: string;
  genericName?: string;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
  images: IProductImage[];
  variants: IProductVariant[];
  createdAt: Date | string;
  updatedAt: Date | string;
  createdByUser?: IAdminUser;
  updatedByUser?: IAdminUser | null;
  launchedByUser?: IAdminUser | null;
}

export interface IProductFilter {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
