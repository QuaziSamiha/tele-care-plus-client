import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Home | ${APP_NAME}`,
  description: "Manage homepage content in Essence Lab.",
};

const DynamicManageHome = dynamic(
  () => import("@/modules/home/dashboard/Home"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageHomePage() {
  return <DynamicManageHome />;
}
