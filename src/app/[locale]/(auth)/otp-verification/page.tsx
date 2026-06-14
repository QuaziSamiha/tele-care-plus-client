
import OTPVerification from "@/modules/auth/components/otpVerification/OtpVerification";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "OTP Verification | Essence Lab",
  description: "OTP Verification at Essence Lab",
};

export default function OtpVerificationPage() {
  return <OTPVerification />;
}
