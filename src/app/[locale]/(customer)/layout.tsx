import CustomerSidebar from "@/components/customer/customerSidebar/CustomerSidebar";
import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-between h-screen w-full">
      <Navbar />
      <main className="container mx-auto">
        <section className="flex items-start gap-6 py-14 lg:mt-20">
          <CustomerSidebar />
          {children}
        </section>
      </main>
      <Footer />
    </main>
  );
}
