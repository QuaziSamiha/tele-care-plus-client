"use client";

import { useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import UserAccountDropdown from "../dropdown/UserAccountDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchProductsDialog from "./SearchProductsDialog";
import { useNavigationMetadata } from "@/hooks/useNavigationMetadata";
import { NAV_LINKS } from "@/constants/navigation";
import { useUser } from "@/modules/user/hooks/useUser";
import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import { useCart } from "@/modules/cart/hooks/useCart";
import LogoIcon from "@/components/shared/logo/LogoIcon";

//* EMPTY SUBSCRIBE — REQUIRED BY useSyncExternalStore TO DETECT CLIENT HYDRATION WITHOUT useState/useEffect
const emptySubscribe = () => () => {};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  //* RETURNS FALSE ON SERVER AND TRUE ON CLIENT — PREVENTS AUTH UI HYDRATION MISMATCH
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const { currentLocale, pathName } = useNavigationMetadata();
  const isHome = pathName.endsWith(`/${currentLocale}`);
  const { isAuthenticated } = useUser();
  const { count: wishlistCount, isHydrated: wishlistHydrated } = useWishlist();
  const { totalQuantity: cartCount, isHydrated: cartHydrated } = useCart();
  const t = useTranslations("Navbar");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-1000 border-b backdrop-blur-sm w-full transition-all ${
        isHome
          ? "bg-transparent border-white"
          : "bg-mauve-700/5 border-neutral-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 py-4">

          {/* LOGO */}
          <Link href="/" locale={currentLocale} className="flex items-center gap-2">
            <LogoIcon className={`transition-colors text-mauve-700`} />
            <div className="text-mauve-800 text-xl font-semibold">Essence <br /> Lab</div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={t(link.label as "Home" | "Product" | "Blog" | "Contact")}
                currentLocale={currentLocale}
                pathName={pathName}
                isHome={isHome}
              />
            ))}
          </nav>

          <div className="flex items-center space-x-4">

            <SearchProductsDialog isHome={isHome} />

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              locale={currentLocale}
              aria-label="Wishlist"
              className="relative inline-flex items-center"
            >
              <IoMdHeartEmpty
                className={`w-6 h-6 ${isHome ? "text-white" : "text-mauve-800"}`}
              />
              {wishlistHydrated && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-mauve-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* SHOPPING BAG */}
            <Link
              href="/my-cart"
              locale={currentLocale}
              aria-label="My Cart"
              className="relative inline-flex items-center"
            >
              <LiaShoppingBagSolid
                className={`w-6 h-6 ${isHome ? "text-white" : "text-mauve-800"}`}
              />
              {cartHydrated && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-mauve-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* USER SECTION */}
            {mounted && isAuthenticated ? (
              <UserAccountDropdown />
            ) : (
              <Link href="/signin" locale={currentLocale}>
                <button
                  className={`text-base cursor-pointer max-sm:hidden hover:text-white transition-colors ${
                    isHome ? "text-white text-shadow-lg/70" : "text-mauve-800"
                  }`}
                >
                  {t("login")}
                </button>
              </Link>
            )}

            <LanguageSwitcher />

            {/* MOBILE MENU TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 bg-transparent backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={t(link.label as "Home" | "Product" | "Blog" | "Contact")}
                  mobile
                  onClick={() => setIsMenuOpen(false)}
                  currentLocale={currentLocale}
                  pathName={pathName}
                  isHome={isHome}
                />
              ))}
              {(!mounted || !isAuthenticated) && (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/signin"
                  className="text-white text-lg font-medium text-shadow-lg/70"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  currentLocale: string;
  pathName: string;
  isHome: boolean;
  onClick?: () => void;
  mobile?: boolean;
}

const NavLink = ({
  href,
  label,
  currentLocale,
  pathName,
  isHome,
  onClick,
  mobile,
}: NavLinkProps) => {
  const fullHref = href === "/" ? `/${currentLocale}` : `/${currentLocale}${href}`;
  const isActive = pathName === fullHref;

  const baseStyles = mobile
    ? `text-lg font-medium ${isHome ? "text-white" : "text-mauve-800"}`
    : `text-base hover:underline hover:underline-offset-4 cursor-pointer transition-colors ${
        isActive ? "underline underline-offset-4" : ""
      } ${!isHome ? "text-mauve-800" : "text-white text-shadow-lg/70"}`;

  return (
    <Link href={href} locale={currentLocale} onClick={onClick} className={baseStyles}>
      {label}
    </Link>
  );
};
