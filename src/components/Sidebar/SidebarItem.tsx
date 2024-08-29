import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const pathname = usePathname();

  const isActive = pathname === item.route;

  const handleClick = () => {
    setPageName(item.label.toLowerCase());
  };

  return (
    <li className="list-none mb-2"> {/* Adjusted margin-bottom to a smaller value */}
      <Link
        href={item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-blue-500 hover:text-white ${
          isActive ? "text-white bg-blue-500" : "text-gray-400"
        }`}
      >
        {item.icon}
        {item.label}
      </Link>
    </li>
  );
};

export default SidebarItem;
