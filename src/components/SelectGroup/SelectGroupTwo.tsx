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

const SelectGroupTwo: React.FC<any> = ({ photos, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [value, setValue] = useState<number>(-1);
  const [images, setImages] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [newJsonData, setNewJsonData] = useState<NewJsonData | null>(null); // New state for _new data
  const [activeTable, setActiveTable] = useState<string>("original"); // Track active table
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

    // Find original JSON path
    const jsonPath = jsonPaths?.find((path) => path.includes(jsonFileName));

    let newJsonPath;
    if (jsonPath) {
      // Derive _new.json path from the original path
      newJsonPath = jsonPath.replace(".json", "_new.json");
    }

    // Debug paths
    console.log("Available JSON Paths:", jsonPaths);
    console.log("Looking for:", jsonFileName, "and corresponding _new.json file");
    console.log("Found JSON Path:", jsonPath);
    console.log("Derived _new JSON Path:", newJsonPath);

    // Fetch original JSON
    if (jsonPath) {
      try {
        const response = await fetch(jsonPath);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          console.error("Failed to fetch original JSON data:", response.statusText);
          setJsonData(null);
        }
      } catch (error) {
        console.error("Error fetching original JSON data:", error);
        setJsonData(null);
      }
    } else {
      console.error("Original JSON file not found.");
      setJsonData(null);
    }

    // Fetch _new JSON
    if (newJsonPath) {
      try {
        const response = await fetch(newJsonPath);
        if (response.ok) {
          const data = await response.json();
          setNewJsonData(data);
        } else {
          console.error("Failed to fetch _new JSON data:", response.statusText);
          setNewJsonData(null);
        }
      } catch (error) {
        console.error("Error fetching _new JSON data:", error);
        setNewJsonData(null);
      }
    } else {
      console.error("_new JSON file not found.");
      setNewJsonData(null);
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

  const formatTitle = (title: string) => {
    const flowIdMatch = title.match(/(\d+)/);
    const actualPredictedMatch = title.match(/Actual\s+(.*?)\s+Predicted\s+(.*)/);

    if (flowIdMatch && actualPredictedMatch) {
      const flowId = flowIdMatch[1];
      const actual = actualPredictedMatch[1];
      const predicted = actualPredictedMatch[2];

      return `Flow ID #${flowId} | Actual: ${actual} | Predicted: ${predicted}`;
    }

    return title;
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
            ? formatTitle(
                normalizeFilename(
                  images.find((photo: any) => photo.name === selectedOption)
                    ?.name
                )
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
                  {formatTitle(normalizeFilename(photo.name))}
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

      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
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
        {selectedOption && jsonData && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setActiveTable("original")}
                className={`mr-2 ${
                  activeTable === "original" ? "font-bold" : ""
                }`}
              >
                Original Table
              </button>
              <button
                onClick={() => setActiveTable("new")}
                className={activeTable === "new" ? "font-bold" : ""}
              >
                New Table
              </button>
            </div>
            {activeTable === "original" && <JsonTable jsonData={jsonData} />}
            {activeTable === "new" && newJsonData && (
              <table className="w-full table-auto border-collapse border border-stroke text-left">
                <thead>
                  <tr>
                    <th className="border border-stroke px-4 py-2">PROPERTY</th>
                    <th className="border border-stroke px-4 py-2">VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-stroke px-4 py-2">Class</td>
                    <td className="border border-stroke px-4 py-2">{newJsonData.class}</td>
                  </tr>
                  <tr>
                    <td className="border border-stroke px-4 py-2">Analysis</td>
                    <td className="border border-stroke px-4 py-2">{newJsonData.analysis}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectGroupTwo;
