import LoadingPage from "@/components/shared/loading/LoadingPage";
import MyAccount from "@/modules/user/myAccount/MyAccount";
import { Suspense } from "react";

export default function MyAccountPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MyAccount />
    </Suspense>
  );
}
