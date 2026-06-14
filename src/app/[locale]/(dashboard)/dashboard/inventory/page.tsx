import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Inventory | ${APP_NAME}`,
  description: "Manage inventory and stock levels in Essence Lab.",
};

const DynamicInventory = dynamic(
  () => import("@/modules/inventory/dashboard/Inventory"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function ManageInventoryPage() {
  return <DynamicInventory />;
}
