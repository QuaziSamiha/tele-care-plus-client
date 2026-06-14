// * SHARED AUTH LAYOUT
import { Metadata } from "next";
import { ReactNode } from "react";
import AuthHeroPanel from "./_components/AuthHeroPanel";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Auth | ${APP_NAME}`,
  description: "Secure access to your Essence Lab account.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AuthHeroPanel />
      <div className="flex w-full flex-col lg:w-1/2 bg-white">
        <main className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 overflow-y-auto">
          <div className="mx-auto w-full max-w-120">{children}</div>
        </main>
      </div>
    </div>
  );
}
