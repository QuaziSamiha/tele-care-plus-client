
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="top-0 fixed w-full z-[9999] bg-white">
        <DashboardNavbar />
      </div>
      <div className="flex bg-neutral-50 mt-20 min-h-screen">
        <div className="max-lg:hidden">
          <DashboardSidebar />
        </div>
        <main className="lg:ml-64 flex-1 overflow-y-auto max-lg:p-6 lg:pr-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
