import React, { ReactNode } from "react";
import { GiCardRandom } from "react-icons/gi"; // Example icon for cards
import { FaCat } from "react-icons/fa"; // Example icon for cats

interface CardDataStatsProps {
  title: string;
  total: string;
  disabled: boolean;
  rate: any;
  selected: boolean;
  iconType: "cards" | "cats";
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
  // Format the title to replace underscores with spaces
  const formattedTotal = total.split("_").join(" ");

  // Determine the icon based on the type of category
  const renderIcon = () => {
    if (iconType === "cards") {
      return <GiCardRandom className="text-2xl" />;
    } else if (iconType === "cats") {
      return <FaCat className="text-2xl" />;
    }
    return null;
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
          <h6 className="text-sm">{title}</h6> {/* Use formattedTitle here */}
        </div>
      </div>
      <div className="ml-auto">{rate}</div>
    </div>
  );
};

export default CardDataStats;
