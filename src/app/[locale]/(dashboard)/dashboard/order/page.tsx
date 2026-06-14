import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Orders | ${APP_NAME}`,
  description: "Manage customer orders in Essence Lab.",
};

const DynamicManageOrder = dynamic(
  () => import("@/modules/order/dashboard/Order"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageOrderPage() {
  return <DynamicManageOrder />;
}
