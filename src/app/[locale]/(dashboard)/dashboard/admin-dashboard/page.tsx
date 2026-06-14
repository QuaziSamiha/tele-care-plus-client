import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Admin Dashboard | ${APP_NAME}`,
  description: "Overview of Essence Lab store analytics and activity.",
};

const DynamicAdminDashboard = dynamic(
  () => import("@/modules/adminDashboard/AdminDashboard"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function DashboardPage() {
  return <DynamicAdminDashboard />;
}
