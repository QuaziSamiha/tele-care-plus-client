import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Set Up | ${APP_NAME}`,
  description: "Configure Essence Lab store settings.",
};

const DynamicManageSetUp = dynamic(
  () => import("@/modules/setUp/SetUp"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageSetUpPage() {
  return <DynamicManageSetUp />;
}
