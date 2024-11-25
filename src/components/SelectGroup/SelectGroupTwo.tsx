import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import normalizeFilename from "@/js/normalize";
import JsonTable from "@/components/JsonTable";

interface JsonData {
  class: string;
  top_features: Array<{
    feature_name: string;
    importance: number;
    description: string;
  }>;
}

interface NewJsonData {
  class: string;
  analysis: string;
}

interface SelectGroupTwoProps {
  photos: () => any;
  isLoading: boolean;
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({ photos, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [value, setValue] = useState<number>(-1);
  const [images, setImages] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [newJsonData, setNewJsonData] = useState<NewJsonData | null>(null);
  const [activeTable, setActiveTable] = useState<string>("new"); // Default to new table
  const [jsonPaths, setJsonPaths] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function test(photosValue: any) {
      if (photosValue[1] !== value) {
        setValue(photosValue[1]);
        setSelectedOption("");
        setImages(photosValue[0]);
        setJsonPaths(photosValue[2]);
      }
    }
    if (!isLoading) {
      const photosValue = photos();
      test(photosValue);
    }
  }, [photos, value, isLoading, jsonData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setDropdownOpen(true);
  };

  const handleOptionSelect = async (value: string) => {
    setSelectedOption(value);
    setDropdownOpen(false);

    const baseFileName = value.replace(/\.(png|jpg|jpeg)$/i, "");
    const jsonFileName = `${baseFileName}.json`;

    setJsonData(null);
    setNewJsonData(null);

    const jsonPath = jsonPaths?.find((path) => path.includes(jsonFileName));

    let newJsonPath;
    if (jsonPath) {
      newJsonPath = jsonPath.replace(".json", "_analysis.json");
    }

    if (jsonPath) {
      try {
        const response = await fetch(jsonPath);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        }
      } catch {}
    }

    if (newJsonPath) {
      try {
        const response = await fetch(newJsonPath);
        if (response.ok) {
          const data = await response.json();
          setNewJsonData(data);
        }
      } catch {}
    }
  };

  const sortImagesNumerically = (images: any[]) => {
    return images.sort((a, b) => {
      const idA = parseInt(a.name.match(/\d+/)?.[0], 10);
      const idB = parseInt(b.name.match(/\d+/)?.[0], 10);
      return idA - idB;
    });
  };

  const filteredImages = sortImagesNumerically(
    images.filter((photo: any) =>
      normalizeFilename(photo.name).toLowerCase().includes(searchTerm)
    )
  );

  const safeImagePath = (path: string) => {
    return path.replace(/#/g, "%23");
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full rounded border border-stroke p-3 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="relative z-20 mb-4" ref={dropdownRef}>
        <div
          className="custom-select-container cursor-pointer rounded border border-stroke bg-white px-4 py-3 dark:bg-form-input"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedOption
            ? normalizeFilename(
                images.find((photo: any) => photo.name === selectedOption)?.name
              )
            : "Select"}
        </div>
        {dropdownOpen && (
          <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded border border-stroke bg-white shadow-lg">
            {filteredImages.length > 0 ? (
              filteredImages.map((photo: any, index: any) => (
                <div
                  key={index}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-4 py-2"
                  onClick={() => handleOptionSelect(photo.name)}
                >
                  {normalizeFilename(photo.name)}
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400 px-4 py-2">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="relative flex items-center justify-center overflow-auto">
          {selectedOption ? (
            <Image
              src={safeImagePath(
                images?.find((photo: any) => photo.name === selectedOption)
                  ?.path || ""
              )}
              alt="Selected Image"
              width={0}
              height={0}
              style={{ width: "auto", height: "auto" }}
              unoptimized
            />
          ) : (
            <p className="text-gray-500">Nothing selected</p>
          )}
        </div>

        {selectedOption && (newJsonData || jsonData) && (
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 mt-4">
            <div className="flex justify-center space-x-4 mb-4">
              {newJsonData && (
                <button
                  onClick={() => setActiveTable("new")}
                  className={`px-4 py-2 rounded ${
                    activeTable === "new"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Automated Analysis
                </button>
              )}
              {jsonData && (
                <button
                  onClick={() => setActiveTable("original")}
                  className={`px-4 py-2 rounded ${
                    activeTable === "original"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Importance Table
                </button>
              )}
            </div>
            {activeTable === "new" && newJsonData && (
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  {newJsonData.analysis}
                </p>
              </div>
            )}
            {activeTable === "original" && jsonData && (
              <JsonTable jsonData={jsonData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectGroupTwo;
