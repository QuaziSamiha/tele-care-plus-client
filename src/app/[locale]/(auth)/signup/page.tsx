
import { APP_NAME } from "@/constants/common.constants";
import SignUp from "@/modules/auth/components/signup/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign Up | ${APP_NAME}`,
  description: `Sign Up at ${APP_NAME}`,
};

export default function SignUpPage() {
  return <SignUp />;
}
