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
  const [images, setImages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [newJsonData, setNewJsonData] = useState<NewJsonData | null>(null);
  const [activeTable, setActiveTable] = useState<string>(""); // Default active table
  const [jsonPaths, setJsonPaths] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load photo data
  useEffect(() => {
    const loadPhotos = async (photosValue: any) => {
      if (photosValue[1] !== value) {
        setValue(photosValue[1]);
        setSelectedOption("");
        setImages(photosValue[0]);
        setJsonPaths(photosValue[2]);
      }
    };

    if (!isLoading) {
      const photosValue = photos();
      loadPhotos(photosValue);
    }
  }, [photos, value, isLoading]);

  // Close dropdown if clicked outside
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
  }, []);

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setDropdownOpen(true);
  };

  // Handle option selection
  const handleOptionSelect = async (value: string) => {
    setSelectedOption(value);
    setDropdownOpen(false);

    const baseFileName = value.replace(/\.(png|jpg|jpeg)$/i, "");
    const jsonFileName = `${baseFileName}.json`;

    setJsonData(null);
    setNewJsonData(null);

    const jsonPath = jsonPaths.find((path) => path.includes(jsonFileName));
    const newJsonPath = jsonPath?.replace(".json", "_analysis.json");

    if (jsonPath) {
      try {
        const response = await fetch(jsonPath);
        if (response.ok) setJsonData(await response.json());
      } catch {
        console.error("Failed to load JSON data.");
      }
    }

    if (newJsonPath) {
      try {
        const response = await fetch(newJsonPath);
        if (response.ok) setNewJsonData(await response.json());
      } catch {
        console.error("Failed to load new JSON data.");
      }
    }
  };

  // Update active table based on data
  useEffect(() => {
    if (newJsonData) setActiveTable("new");
    else if (jsonData) setActiveTable("original");
  }, [newJsonData, jsonData]);

  // Sort images numerically
  const sortImagesNumerically = (images: any[]) =>
    images.sort((a, b) => {
      const idA = parseInt(a.name.match(/\d+/)?.[0], 10);
      const idB = parseInt(b.name.match(/\d+/)?.[0], 10);
      return idA - idB;
    });

  // Filter images based on search
  const filteredImages = sortImagesNumerically(
    images.filter((photo) =>
      normalizeFilename(photo.name).toLowerCase().includes(searchTerm)
    )
  );

  // Sanitize image paths
  const safeImagePath = (path: string) => path.replace(/#/g, "%23");

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full rounded border border-stroke p-3 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      <div className="relative z-20 mb-4" ref={dropdownRef}>
        <div
          className="custom-select-container cursor-pointer rounded border border-stroke bg-white px-4 py-3 dark:bg-form-input"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedOption
            ? normalizeFilename(
                images.find((photo) => photo.name === selectedOption)?.name
              )
            : "Select"}
        </div>
        {dropdownOpen && (
          <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded border border-stroke bg-white shadow-lg">
            {filteredImages.length > 0 ? (
              filteredImages.map((photo, index) => (
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

      {/* Content */}
      <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="relative flex items-center justify-center overflow-auto">
          {selectedOption ? (
            <Image
              src={safeImagePath(
                images?.find((photo) => photo.name === selectedOption)?.path ||
                  ""
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
            {/* Buttons */}
            <div className="flex mb-4 gap-2">
              {newJsonData && (
                <button
                  onClick={() => setActiveTable("new")}
                  className={`w-1/2 px-4 py-2 rounded shadow-md transition-all ${
                    activeTable === "new"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-gray-800"
                  }`}
                >
                  Automated Analysis (LLM powered)
                </button>
              )}
              {jsonData && (
                <button
                  onClick={() => setActiveTable("original")}
                  className={`${
                    newJsonData ? "w-1/2" : "w-full"
                  } px-4 py-2 rounded shadow-md transition-all ${
                    activeTable === "original"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-300 hover:text-gray-800"
                  }`}
                >
                  Importance Table
                </button>
              )}
            </div>

            {/* Table Content */}
            {activeTable === "new" && newJsonData && (
              <div>
                <p
                  className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: newJsonData.analysis
                      //.replace(/\*\s(.*?):/g, "• <strong>$1</strong>:") // Replace bullets
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"), // Bold text
                  }}
                />
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
