import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Users | ${APP_NAME}`,
  description: "Manage user accounts in Essence Lab.",
};

const DynamicManageUser = dynamic(
  () => import("@/modules/user/dashboard/User"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageUserPage() {
  return <DynamicManageUser />;
}
