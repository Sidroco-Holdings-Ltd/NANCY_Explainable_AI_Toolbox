import React, { ReactNode } from "react";
import { FaFolder } from "react-icons/fa"; // Import a folder icon

interface CardDataStatsProps {
  title: string;
  total: string;
  disabled: boolean;
  rate: any;
  selected: boolean;
  iconType: "cards" | "cats"; // You can keep these as placeholders
  children?: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  disabled,
  rate,
  selected,
  iconType,
  children,
}) => {
  const formattedTotal = total.split("_").join(" ");

  const renderIcon = () => {
    return <FaFolder className="text-2xl" />; // Use the folder icon for both types
  };

  return (
    <div
      className={`duration-400 relative flex cursor-pointer items-center justify-between overflow-hidden rounded-md p-4 shadow-lg transition-all ease-in-out
        ${disabled ? "bg-gray-200 cursor-not-allowed opacity-50" : ""}
        ${selected ? "border-4 border-[#145cff] bg-[#5487ff] text-white" : "border-4 border-[#afc7ff] bg-[#afc7ff] text-black hover:border-[#447dff] hover:bg-[#8faeff]"}`}
    >
      <div className="flex items-center">
        <div className="bg-gray-200 dark:bg-gray-700 mr-2 flex h-10 w-10 items-center justify-center rounded-full">
          {renderIcon()}
        </div>
        <div className="flex flex-col">
          <h4 className="text-left text-xl font-bold">{formattedTotal}</h4>
          <h6 className="text-sm">{title}</h6>
        </div>
      </div>
      <div className="ml-auto">{rate}</div>
    </div>
  );
};

export default CardDataStats;
