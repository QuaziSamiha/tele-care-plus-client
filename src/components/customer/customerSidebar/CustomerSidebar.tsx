"use client";

import { useNavigationMetadata } from "@/hooks/useNavigationMetadata";
import { Link, useRouter } from "@/i18n/navigation";
import { authService } from "@/modules/auth/services/auth.service";
import { BsBox } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi2";
import { IoMdHeartEmpty } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";

export default function CustomerSidebar() {
  const { currentLocale, pathName } = useNavigationMetadata();
  const router = useRouter();
  const handleLogout = async () => {
    await authService.logout();
    router.replace("/signin");
  };
  return (
    <section className="lg:w-1/5 border border-neutralPrimary-300 rounded-2xl p-3">
      <div className="flex flex-col gap-3">
        <Link href="/my-account">
          <div
            className={`${
              pathName === `/${currentLocale}/my-account`
                ? "bg-mauve-700 text-white"
                : "text-mauve-800"
            } hover:bg-neutral-100 hover:text-mauve-800 flex items-center gap-3 p-4 font-semibold rounded-lg cursor-pointer`}
          >
            <HiOutlineUser className="font-semibold w-5 h-5" />
            <p>Account Information</p>
          </div>
        </Link>
        <Link href="/my-order">
          <div
            className={`${
              pathName === `/${currentLocale}/my-order`
                ? "bg-mauve-700 text-white"
                : "text-mauve-800"
            } hover:bg-neutral-100 hover:text-mauve-800 flex items-center gap-3 p-4 font-semibold rounded-lg cursor-pointer`}
          >
            <BsBox className="font-semibold w-5 h-5" />
            <p>Order</p>
          </div>
        </Link>
        <Link href="/wishlist">
          <div
            className={`${
              pathName === `/${currentLocale}/wishlist`
                ? "bg-mauve-700 text-white"
                : "text-mauve-800"
            } hover:bg-neutral-100 hover:text-mauve-800 flex items-center gap-3 p-4 font-semibold rounded-lg cursor-pointer`}
          >
            <IoMdHeartEmpty className="font-semibold w-5 h-5" />
            <p>Wishlist</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="text-mauve-800 hover:bg-neutral-100 hover:text-mauve-800 flex items-center gap-3 p-4 font-semibold w-full rounded-lg cursor-pointer"
        >
          <LuLogOut className="font-semibold w-5 h-5" />
          <p>Logout</p>
        </button>
      </div>
    </section>
  );
}
