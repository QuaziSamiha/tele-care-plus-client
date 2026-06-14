import { IAdminUser } from "@/modules/user/types/user.types";

/**
 * Category Status Enum matching Prisma CategoryProductStatus
 */
export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
  DRAFT = "DRAFT",
  HIDDEN = "HIDDEN",
}

/**
 * CORE CATEGORY INTERFACE
 * Representing the Essence Lab Category entity.
 */
export interface ICategory {
  id: number;
  sid: string; // UUID string
  status: CategoryStatus;

  // Primary Content (English)
  name: string;
  slug: string;
  description: string | null;

  // Secondary Content (Thai)
  nameTh: string | null;
  descriptionTh: string | null;

  // Hierarchy
  parentId: number | null;
  level: number;

  // Optimized Images
  thumbnailUrl: string | null;
  bannerUrl: string;
  iconUrl: string | null;

  // UI & SEO Metadata
  displayOrder: number;
  isFeatured: boolean;
  productCount: number;

  metaTitle: string | null;
  metaDescription: string | null;
  metaTitleTh: string | null;
  metaDescriptionTh: string | null;

  // Audit Trail
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: number | null;
  updatedBy: number | null;

  // Derived counts
  childrenCount: number;

  // Relations (Optional based on include logic)
  parent?: ICategory | null;
  children?: ICategory[];
  createdByUser?: IAdminUser | null;
  updatedByUser?: IAdminUser | null;
}

export interface IOptionCategory {
  id: number;
  name: string;
}
