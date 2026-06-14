"use client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import LogoIcon from "@/components/shared/logo/LogoIcon";
import DashboardSidebar from "./DashboardSidebar";
import UserAccountDropdown from "@/components/shared/dropdown/UserAccountDropdown";
import { Link } from "@/i18n/navigation";

export default function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border">
      <div className="px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 py-4">
          {/* ===== LOGO ======= */}
          <Link href={"/"} className="flex gap-2">
            <LogoIcon className="w-16 h-16 text-mauve-800" />
            <div className="mt-4 text-mauve-800 font-semibold">
              ESSENCE <br />
              LAB
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <UserAccountDropdown />

            {/* ========== Mobile Menu Button ========== */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
      </div>
      {isMenuOpen && <DashboardSidebar />}
    </nav>
  );
}
