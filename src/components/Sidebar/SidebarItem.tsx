import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <>
      <li className="list-none">
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${isItemActive ? "bg-logodarkblue dark:bg-meta-4" : ""} group relative flex items-center gap-2.5 rounded-md px-4 py-2 text-2xl font-normal text-bodydark1 duration-300 ease-in-out hover:bg-logolightblue dark:hover:bg-meta-4`}
        >
          {item.icon}
          {item.label}
        </Link>
      </li>
    </>
  );
};

export default SidebarItem;
