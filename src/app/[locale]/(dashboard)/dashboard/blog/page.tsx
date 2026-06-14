import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Blog | ${APP_NAME}`,
  description: "Manage blog posts in Essence Lab.",
};

const DynamicManageBlog = dynamic(
  () => import("@/modules/blog/dashboard/Blog"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageBlogPage() {
  return <DynamicManageBlog />;
}
