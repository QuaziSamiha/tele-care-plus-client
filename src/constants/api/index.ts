//* NAMED EXPORTS — IMPORT INDIVIDUAL DOMAIN OBJECTS WHEN ONLY ONE DOMAIN IS NEEDED
//* E.G.: import { AUTH_API } from "@/constants/api"
export { AUTH_API } from "./auth.api";
export { USER_API } from "./user.api";
export { CATEGORY_API } from "./category.api";
export { PRODUCT_API } from "./product.api";
export { ORDER_API } from "./order.api";
export { BLOG_API } from "./blog.api";
export { CONTACT_API } from "./contact.api";
export { COMBO_API } from "./combo.api";
export { INVENTORY_API } from "./inventory.api";

//* ASSEMBLED OBJECT — USE WHEN ACCESSING MULTIPLE DOMAINS IN ONE FILE
//* E.G.: import { API } from "@/constants/api"
import { AUTH_API } from "./auth.api";
import { USER_API } from "./user.api";
import { CATEGORY_API } from "./category.api";
import { PRODUCT_API } from "./product.api";
import { ORDER_API } from "./order.api";
import { BLOG_API } from "./blog.api";
import { CONTACT_API } from "./contact.api";
import { COMBO_API } from "./combo.api";
import { INVENTORY_API } from "./inventory.api";

export const API = {
  AUTH: AUTH_API,
  USER: USER_API,
  CATEGORY: CATEGORY_API,
  PRODUCT: PRODUCT_API,
  ORDER: ORDER_API,
  BLOG: BLOG_API,
  CONTACT: CONTACT_API,
  COMBO: COMBO_API,
  INVENTORY: INVENTORY_API,
} as const;
