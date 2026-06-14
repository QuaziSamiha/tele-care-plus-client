"use client";

import { Link } from "@/i18n/navigation";
import { useNavigationMetadata } from "@/hooks/useNavigationMetadata";
import { DASHBOARD_LINKS } from "@/constants/navigation";
import { IDashboardNavLink } from "@/types/navigation.type";

export default function DashboardSidebar() {
  const { currentLocale, pathName } = useNavigationMetadata();

  return (
    <aside className="fixed bg-white flex flex-col gap-2 p-4 w-60 border-r border-slate-300 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      {DASHBOARD_LINKS.map((link) => (
        <NavItem
          key={link.href}
          item={link}
          pathName={pathName}
          currentLocale={currentLocale}
        />
      ))}
    </aside>
  );
}

function NavItem({
  item,
  pathName,
  currentLocale,
}: {
  item: IDashboardNavLink;
  pathName: string;
  currentLocale: string;
}) {
  const { label, href, icon: Icon, path } = item;

  return (
    <Link
      href={href}
      className={`${pathName === `/${currentLocale}${path}` ? "bg-mauve-800 text-white" : "text-slate-800"} hover:bg-mauve-600 hover:text-white flex items-center gap-3 p-3 font-semibold rounded-lg transition-colors duration-200`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
