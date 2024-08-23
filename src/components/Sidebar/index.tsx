import React, { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

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
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="items-left flex justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            {/* Sidebar toggle button SVG */}
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <div>
              <div className="flex items-center gap-2.5 w-full text-left px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-logolightblue dark:hover:bg-meta-4">
                <FaFolder />
                <span>Folders</span>
              </div>
              {/* Dropdown content always visible */}
              <ul className="pl-8">
                {folders.map((folder, index) => (
                  <SidebarItem
                    key={index}
                    item={{
                      icon: <FaFolder />,
                      label: folder.replace(/[_-]/g, " "),
                      route: `/dashboard/${folder}`,
                    }}
                    pageName={pageName}
                    setPageName={setPageName}
                  />
                ))}
              </ul>
            </div>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;

