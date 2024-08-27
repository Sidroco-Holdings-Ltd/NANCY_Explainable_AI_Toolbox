import React, { useEffect, useState } from "react";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import Image from "next/image"; // Import Image for the logo

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await fetch("/api/getFolderNames");
      const data = await response.json();
      setFolders(data.answer);
    };

    fetchFolders();
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center p-6">
          <Image
            src="/logo/logo.png" // Use the correct path to your logo
            alt="Nancy Logo"
            width={120} // Adjust the width as needed
            height={120} // Adjust the height as needed
          />
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <ul className="pl-4">
              {folders.map((folder, index) => (
                <SidebarItem
                  key={index}
                  item={{
                    icon: null, // Remove icon if not needed
                    label: folder.replace(/[_-]/g, " "),
                    route: `/dashboard/${folder}`,
                  }}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
