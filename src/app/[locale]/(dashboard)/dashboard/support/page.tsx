import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Support | ${APP_NAME}`,
  description: "Manage customer support requests in Essence Lab.",
};

const DynamicManageSupport = dynamic(
  () => import("@/modules/support/dashboard/Support"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageSupportPage() {
  return <DynamicManageSupport />;
}
