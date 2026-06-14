import { ITabContent, ITabList } from "@/types/share-component.type";
import ProductAdditionalInformation from "../public/productDetails/ProductAdditionalInformation";
import ProductDescription from "../public/productDetails/ProductDescription";
import ProductReviews from "../public/productDetails/ProductReviews";

export const PRODUCT_TYPE_OPTIONS = [
  { id: "SIMPLE", name: "Simple" },
  { id: "COMBO", name: "Combo" },
];

export const PRODUCT_DETAILS_TAB_LIST: ITabList[] = [
  { label: "Description", value: "description" },
  { label: "Additional information", value: "additionalInformation" },
  { label: "Reviews (2)", value: "reviews" },
];

export const PRODUCT_DETAILS_TAB_CONTENT: ITabContent[] = [
  { value: "description", content: <ProductDescription /> },
  { value: "additionalInformation", content: <ProductAdditionalInformation /> },
  { value: "reviews", content: <ProductReviews /> },
];
