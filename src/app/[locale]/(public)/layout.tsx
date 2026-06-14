import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-between h-screen w-full">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </main>
  );
}
