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

const SelectGroupTwo: React.FC<any> = ({ photos, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [value, setValue] = useState<number>(-1);
  const [images, setImages] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
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

    const jsonPath = jsonPaths?.find((path) => path.includes(jsonFileName));

    if (jsonPath) {
      try {
        const response = await fetch(jsonPath);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data); 
        } else {
          console.error("Failed to fetch JSON data:", response.statusText);
          setJsonData(null);
        }
      } catch (error) {
        console.error("Error fetching JSON data:", error);
        setJsonData(null);
      }
    } else {
      setJsonData(null); 
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
      normalizeFilename(photo.name).toLowerCase().includes(searchTerm),
    ),
  );

  const safeImagePath = (path: string) => {
    return path.replace(/#/g, "%23"); // Replaces all instances of `#` with `%23` to resolve bug
  };

  // function to format the title with : and | symbols for better readability
  const formatTitle = (title: string) => {
    const flowIdMatch = title.match(/#(\d+)/);
    const actualPredictedMatch = title.match(
      /Actual\s+(.*?)\s+Predicted\s+(.*)/,
    );

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
                    ?.name,
                ),
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
                  ?.path || "",
              )}
              alt="Selected Image"
              width={0} // Allow image to take its natural width
              height={0} // Allow image to take its natural height
              style={{ width: "auto", height: "auto" }} // Allow image to display in its natural size
              unoptimized // Prevent Next.js from optimizing the image, preserving original quality and size
            />
          ) : (
            <p className="text-gray-500">Nothing selected</p>
          )}
        </div>
        {selectedOption && jsonData && <JsonTable jsonData={jsonData} />}
      </div>
    </div>
  );
};

export default SelectGroupTwo;
