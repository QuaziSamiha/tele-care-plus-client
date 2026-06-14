import ForgotPassword from "@/modules/auth/components/forgotPassword/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Essence Lab",
  description: "Forgot Password at Essence Lab",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
