import type { Metadata } from "next";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import dynamic from "next/dynamic";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Contact | ${APP_NAME}`,
  description: "Manage customer contact submissions in Essence Lab.",
};

const DynamicManageContact = dynamic(
  () => import("@/modules/contact/dashboard/Contact"),
  {
    loading: () => <LoadingPage />,
  },
);
export default function ManageContactPage() {
  return <DynamicManageContact />;
}
