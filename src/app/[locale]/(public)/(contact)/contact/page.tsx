import type { Metadata } from "next";
import Contact from "@/modules/contact/public/Contact";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Contact | ${APP_NAME}`,
  description: "Get in touch with the Essence Lab team.",
};

export default function ContactUsPage() {
  return <Contact />;
}
