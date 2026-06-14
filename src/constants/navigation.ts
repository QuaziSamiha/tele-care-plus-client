//* THIS FILE CONTAINS : DASHBOARD_LINKS, PUBLIC_NAV_LINKS

import { BsBox, BsBoxSeam, BsBoxes } from "react-icons/bs";
import {
  MdOutlineContactMail,
  MdOutlineContactSupport,
  MdOutlineSettings,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { PiUserCircleGearFill } from "react-icons/pi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TbHomeCog, TbCategory } from "react-icons/tb";
import { TfiWrite } from "react-icons/tfi";
import { IDashboardNavLink, INavLink } from "@/types/navigation.type";

export const DASHBOARD_LINKS: IDashboardNavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin-dashboard",
    icon: RxDashboard,
    path: `/dashboard/admin-dashboard`,
  },
  {
    label: "Users",
    href: "/dashboard/user",
    icon: PiUserCircleGearFill,
    path: `/dashboard/user`,
  },
  {
    label: "Home",
    href: "/dashboard/home",
    icon: TbHomeCog,
    path: `/dashboard/home`,
  },
  {
    label: "Category",
    href: "/dashboard/category",
    icon: TbCategory,
    path: `/dashboard/category`,
  },
  {
    label: "Product",
    href: "/dashboard/product",
    icon: BsBox,
    path: `/dashboard/product`,
  },
  {
    label: "Combo Product",
    href: "/dashboard/combo",
    icon: BsBoxes,
    path: `/dashboard/combo`,
  },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: BsBoxSeam,
    path: `/dashboard/inventory`,
  },
  {
    label: "Order",
    href: "/dashboard/order",
    icon: AiOutlineUnorderedList,
    path: `/dashboard/order`,
  },
  {
    label: "Blog",
    href: "/dashboard/blog",
    icon: TfiWrite,
    path: `/dashboard/blog`,
  },
  {
    label: "Contact",
    href: "/dashboard/contact",
    icon: MdOutlineContactMail,
    path: `/dashboard/contact`,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: MdOutlineContactSupport,
    path: `/dashboard/support`,
  },
  {
    label: "Set Up",
    href: "/dashboard/set-up",
    icon: MdOutlineSettings,
    path: `/dashboard/set-up`,
  },
];

export const NAV_LINKS: INavLink[] = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
