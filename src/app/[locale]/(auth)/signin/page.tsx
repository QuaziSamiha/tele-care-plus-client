import SignIn from "@/modules/auth/components/signin/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Essence Lab",
  description: "Sign In at Essence Lab",
};

export default function SignInPage() {
  return <SignIn />;
}

/**
 * Since the Login page is a primary entry point, users usually navigate here intentionally.
 * If your Login component isn't exceptionally large (e.g., doesn't include heavy 3D libraries or
 * massive data charts), a standard import is often fine. However, if you are using many heavy icons
 * or complex validation schemas, keeping it dynamic is a smart move for performance scores.
 */
