import { IAdminUser } from "@/modules/user/types/user.types";

export enum ComboStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
  HIDDEN = "HIDDEN",
}

export interface IComboImage {
  id: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}

export interface IComboItemProduct {
  id: number;
  name: string;
  slug: string;
  categoryId?: number;
  categoryName?: string;
  primaryImageUrl?: string;
}

export interface IComboItemVariant {
  id: number;
  name: string;
  size?: string;
  price: number;
}

export interface IComboItem {
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice?: number;
  displayOrder: number;
  product?: IComboItemProduct;
  variant?: IComboItemVariant;
}

export interface ICombo {
  id: number;
  sid: string;
  title: string;
  titleTh?: string;
  slug: string;

  shortDescription?: string;
  shortDescTh?: string;
  description?: string;
  descriptionTh?: string;

  totalPrice: number;
  comboPrice: number;

  startsAt?: string | Date;
  endsAt?: string | Date;

  status: ComboStatus;
  isFeatured: boolean;

  seoMetadata?: Record<string, unknown>;
  images: IComboImage[];
  items: IComboItem[];

  createdAt: string | Date;
  updatedAt: string | Date;
  createdByUser?: IAdminUser;
  updatedByUser?: IAdminUser | null;
}
