"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineUser } from "react-icons/hi2";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { MdOutlineDashboardCustomize } from "react-icons/md";

import { LuUser } from "react-icons/lu"; // Your original icon
import { useNavigationMetadata } from "@/hooks/useNavigationMetadata";
import { useUser } from "@/modules/user/hooks/useUser";
import { authService } from "@/modules/auth/services/auth.service";
import { formatEnumString } from "@/lib/utils/string.utils";
import { useEffect, useState } from "react";

export default function UserAccountDropdown() {
  const [mounted, setMounted] = useState(false);
  const isUserEmployee = true;
  const isUserAdmin = true;
  const { isAdmin, role, name } = useUser();
  const isCurrentUserLoading = false;

  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();
  const { currentLocale, isHome, pathName } = useNavigationMetadata();
  const isDashboard = pathName.startsWith(`/${currentLocale}/dashboard`)
    ? true
    : false;
  const handleLogout = async () => {
    await authService.logout();
    router.replace("/signin");
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none flex items-center gap-3 space-x-1 text-slate-800 text-lg font-medium cursor-pointer">
          {isCurrentUserLoading ? (
            <Skeleton className="bg-gray-100 h-4" />
          ) : !isUserAdmin && !isUserEmployee ? (
            <LuUser
              className={`${!isHome ? "text-slate-700" : "text-white"}  w-6 h-6`}
            />
          ) : (
            <div className="flex items-center gap-3">
              <LuUser
                className={`${!isHome ? "text-slate-700" : "text-white"}  w-6 h-6`}
              />{" "}
              {isCurrentUserLoading ? (
                <Skeleton className="bg-gray-100 h-2 w-fit" />
              ) : (
                <div className="max-md:hidden flex flex-col items-start justify-start gap-0.5">
                  <p
                    className={`text-sm font-semibold ${isDashboard || !isHome ? "text-slate-800" : "text-white"}`}
                  >
                    {name}
                  </p>
                  <p
                    className={`text-xs font-medium text-slate-400 capitalize ${isDashboard || !isHome ? "text-slate-400" : "text-white"}`}
                  >
                    {mounted ? formatEnumString(role || "") : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-100000 w-fit mt-2">
          <div className="p-2.5">
            {/* {!isUserAdmin && !isUserEmployee && ( */}
            {!isAdmin && (
              <Link href={`/${currentLocale}/my-account`}>
                <DropdownMenuItem className="flex items-center gap-3 text-slate-700 cursor-pointer">
                  <HiOutlineUser className="font-semibold w-6 h-6" />
                  <p className="font-medium text-slate-700">View Profile</p>
                </DropdownMenuItem>
              </Link>
            )}
            {/* {(isUserAdmin || isUserEmployee) && ( */}
            {isAdmin && (
              <Link href={`/${currentLocale}/dashboard/admin-dashboard`}>
                <DropdownMenuItem className="flex items-center gap-3 text-slate-700 cursor-pointer">
                  <MdOutlineDashboardCustomize className="font-semibold w-6 h-6" />
                  <p className="font-medium text-slate-700">Dashboard</p>
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem
              className="flex items-center gap-3 text-slate-700 cursor-pointer"
              onClick={handleLogout}
            >
              <LuLogOut className="font-semibold w-6 h-6" />
              <p className="font-medium text-slate-700">Logout</p>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
