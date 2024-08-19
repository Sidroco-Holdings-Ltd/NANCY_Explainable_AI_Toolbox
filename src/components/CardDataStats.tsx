import React, { ReactNode } from "react";
import { GiCardRandom } from "react-icons/gi"; // Example icon for cards
import { FaCat } from "react-icons/fa"; // Example icon for cats

interface CardDataStatsProps {
  title: string;
  total: string;
  disabled: boolean;
  rate: any;
  selected: boolean;
  iconType: 'cards' | 'cats';  
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
  // Determine the icon based on the type of category
  const renderIcon = () => {
    if (iconType === 'cards') {
      return <GiCardRandom className="text-2xl" />;
    } else if (iconType === 'cats') {
      return <FaCat className="text-2xl" />;
    }
    return null;
  };

  return (
    <div
      className={`relative flex justify-between items-center rounded-md p-4 shadow-lg transition-all duration-400 ease-in-out overflow-hidden cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200' : ''}
        ${selected ? 'bg-[#5487ff] border-4 border-[#145cff] text-white' : 'bg-[#afc7ff] border-4 border-[#afc7ff] text-black hover:bg-[#8faeff] hover:border-[#447dff]'}`}
    >
      <div className="flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 mr-2">
          {renderIcon()}
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-bold">{total}</h4>
          <span className="text-sm">{title}</span>
        </div>
      </div>
      <div className="ml-auto">{rate}</div>
    </div>
  );
};

export default CardDataStats;
