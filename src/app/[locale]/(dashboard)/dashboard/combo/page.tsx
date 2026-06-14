import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Combo Products | ${APP_NAME}`,
  description: "Manage combo product bundles in Essence Lab.",
};

const DynamicManageCombo = dynamic(
  () => import("@/modules/combo/dashboard/Combo"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function ManageComboPage() {
  return <DynamicManageCombo />;
}
