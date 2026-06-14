import { IconType } from "react-icons/lib";

export interface IDashboardNavLink {
  label: string;
  href: string;
  icon: IconType;
  path: string;
}

export interface INavLink {
  href: string;
  label: string;
}
