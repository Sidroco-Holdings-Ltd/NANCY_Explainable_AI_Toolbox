"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  FaHome,
  FaUser,
  FaCog,
  FaChartBar,
  FaEnvelope,
  FaComments,
  FaImage,
  FaCamera,
  FaPalette,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"; // Import additional icons

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface Subfolder {
  name: string;
  path: string;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [folders, setFolders] = useState<string[]>([]);
  const [newFolderSubfolders, setNewFolderSubfolders] = useState<Subfolder[]>([]);
  const [newFolderExpanded, setNewFolderExpanded] = useState<boolean>(false);

  // Check if current path is in New_folder or its subfolders
  const isNewFolderActive = pathname.includes('/dashboard/New_folder');

  // Auto-expand New_folder dropdown when we're in that section
  useEffect(() => {
    if (isNewFolderActive) {
      setNewFolderExpanded(true);
    }
  }, [isNewFolderActive]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await fetch("/api/getFolderNames");
      const data = await response.json();
      setFolders(data.answer);
    };

    fetchFolders();
  }, []);

  // Fetch subfolders for New_folder
  useEffect(() => {
    const fetchNewFolderSubfolders = async () => {
      try {
        const response = await fetch("/api/getSubFolderNames/New_folder");
        if (response.ok) {
          const data = await response.json();
          if (data.answer) {
            const subfolderNames = Object.keys(data.answer);
            const subfolders = subfolderNames.map(name => ({
              name,
              path: `/dashboard/New_folder/${name}`
            }));
            setNewFolderSubfolders(subfolders);
          }
        }
      } catch (error) {
        console.error("Error fetching New_folder subfolders:", error);
      }
    };

    if (folders.includes("New_folder")) {
      fetchNewFolderSubfolders();
    }
  }, [folders]);

  const iconMapping: { [key: string]: any } = {
    brand: FaImage,
    cards: FaCamera,
    cats: FaComments,
    country: FaChartBar,
    cover: FaEnvelope,
    icon: FaCog,
    illustration: FaPalette,
    logo: FaUser,
  };

  // Toggle New_folder dropdown
  const toggleNewFolderDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewFolderExpanded(!newFolderExpanded);
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="items-left flex justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link replace={true} href="/" className="text-left">
            <Image
              width={140}
              height={18}
              src={"/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {folders.map((folder, index) => {
              // Special case for New_folder
              if (folder === "New_folder") {
                return (
                  <li key={index} className="list-none mb-2">
                    <div
                      className={`group relative flex items-center justify-between gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-blue-500 hover:text-white cursor-pointer ${
                        isNewFolderActive ? "text-white bg-blue-500" : "text-gray-400"
                      }`}
                    >
                      <Link
                        href={`/dashboard/${folder}`}
                        className="flex items-center gap-2.5 flex-grow"
                        onClick={(e) => {
                          if (newFolderSubfolders.length > 0) {
                            // Always prevent direct navigation - force subfolder selection
                            e.preventDefault();
                            setNewFolderExpanded(!newFolderExpanded);
                          }
                          setPageName(folder.replace(/[_-]/g, " ").toLowerCase());
                        }}
                      >
                        <FaFolder className="fill-current" />
                        <span>{folder.replace(/[_-]/g, " ")}</span>
                      </Link>
                      {newFolderSubfolders.length > 0 && (
                        <button
                          onClick={toggleNewFolderDropdown}
                          className="text-gray-400 hover:text-white"
                        >
                          {newFolderExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      )}
                    </div>
                    
                    {/* Subfolders dropdown */}
                    {newFolderExpanded && newFolderSubfolders.length > 0 && (
                      <ul className="mt-2 pl-6 space-y-2">
                        {newFolderSubfolders.map((subfolder, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              href={`/dashboard/New_folder?subfolder=${subfolder.name}`}
                              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium duration-300 ease-in-out hover:bg-blue-400 hover:text-white ${
                                pathname.includes(`subfolder=${subfolder.name}`) ? "text-white bg-blue-400" : "text-gray-400"
                              }`}
                              onClick={() => setPageName(subfolder.name.replace(/[_-]/g, " ").toLowerCase())}
                            >
                              <FaImage className="fill-current" size={14} />
                              {subfolder.name.replace(/[_-]/g, " ")}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Regular folder
              const Icon = iconMapping[folder] || '🔍'; 
              return (
                <SidebarItem
                  key={index}
                  item={{
                    icon: typeof Icon === 'string' ? <span className="text-xl">{Icon}</span> : <Icon className="fill-current" />,
                    label: folder.replace(/[_-]/g, " "), // normalize the folder name
                    route: `/dashboard/${folder}`,
                  }}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              );
            })}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
