import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Products | ${APP_NAME}`,
  description: "Manage products in Essence Lab.",
};

const DynamicManageProduct = dynamic(
  () => import("@/modules/product/dashboard/Product"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageProductPage() {
  return <DynamicManageProduct />;
}
