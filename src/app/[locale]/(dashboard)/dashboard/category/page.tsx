import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Category | ${APP_NAME}`,
  description: "Manage product categories in Essence Lab.",
};

const DynamicAdminCategory = dynamic(
  () => import("@/modules/category/dashboard/Category"),
  {
    loading: () => <LoadingPage />,
  }
);

export default function AdminCategoryPage() {
  return <DynamicAdminCategory />;
}
