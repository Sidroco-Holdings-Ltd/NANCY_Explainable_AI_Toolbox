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

interface ImageObject {
  name: string;
  path: string;
  width: number;
  height: number;
}

interface NestedFolderStructure {
  [subfolder: string]: ImageObject[];
}

interface SelectGroupTwoProps {
  photos: () => any;
  isLoading: boolean;
  selectedOption?: string;
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({ photos, isLoading, selectedOption: externalSelectedOption }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedSubfolder, setSelectedSubfolder] = useState<string | null>(null);
  const [value, setValue] = useState<number>(-1);
  const [images, setImages] = useState<any>({});
  const [subfolders, setSubfolders] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<ImageObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [newJsonData, setNewJsonData] = useState<NewJsonData | null>(null);
  const [activeTable, setActiveTable] = useState<string>(""); // Default active table
  const [jsonPaths, setJsonPaths] = useState<string[]>([]);
  const [hasNestedStructure, setHasNestedStructure] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load photo data
  useEffect(() => {
    const loadPhotos = async (photosValue: any) => {
      if (photosValue[1] !== value) {
        setValue(photosValue[1]);
        setSelectedOption("");
        setSelectedSubfolder(null);
        
        const photoData = photosValue[0];
        setImages(photoData);
        setJsonPaths(photosValue[2]);
        
        // Check if we have a nested structure (sub-subfolders)
        const hasNested = photoData && 
                         typeof photoData === 'object' && 
                         Object.keys(photoData).length > 0 &&
                         !Array.isArray(photoData);
        
        setHasNestedStructure(hasNested);
        
        if (hasNested) {
          // Get list of sub-subfolders
          setSubfolders(Object.keys(photoData));
          setCurrentImages([]);
        } else {
          // Regular array of images
          setSubfolders([]);
          setCurrentImages(Array.isArray(photoData) ? photoData : []);
        }
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

  // Handle subfolder selection from dropdown
  const handleSubfolderSelect = (subfolder: string) => {
    setSelectedSubfolder(subfolder);
    setDropdownOpen(false);
    
    if (hasNestedStructure && images && typeof images === 'object') {
      // Set current images to the selected sub-subfolder's images
      const subfolderData = images[subfolder];
      if (subfolderData && typeof subfolderData === 'object') {
        setCurrentImages(Array.isArray(subfolderData) ? subfolderData : []);
      }
    }
  };

  // Handle image selection
  const handleImageSelect = async (imageName: string) => {
    setSelectedOption(imageName);

    const baseFileName = imageName.replace(/\.(png|jpg|jpeg)$/i, "");
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

  // Sort subfolders or images alphabetically/numerically
  const sortItems = (items: string[]) => {
    return items.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      return a.localeCompare(b);
    });
  };

  // Format display name
  const formatDisplayName = (name: string) => {
    return name.replace(/[_-]/g, " ");
  };

  // Sanitize image paths
  const safeImagePath = (path: string) => path.replace(/#/g, "%23");

  // Filter subfolders based on search term
  const filteredSubfolders = subfolders.filter(folder => 
    formatDisplayName(folder).toLowerCase().includes(searchTerm)
  );

  // Get the current image to display
  const getCurrentDisplayImage = () => {
    if (!selectedOption) return null;
    
    // Find the image in the current images
    const image = currentImages.find(img => img.name === selectedOption);
    return image ? image.path : null;
  };

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

      {hasNestedStructure ? (
        // Subfolder dropdown for nested structure
        <div className="relative z-20 mb-4" ref={dropdownRef}>
          <div
            className="custom-select-container cursor-pointer rounded border border-stroke bg-white px-4 py-3 dark:bg-form-input"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedSubfolder
              ? formatDisplayName(selectedSubfolder)
              : "Select Subfolder"}
          </div>
          {dropdownOpen && (
            <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded border border-stroke bg-white shadow-lg">
              {filteredSubfolders.length > 0 ? (
                sortItems(filteredSubfolders).map((subfolder, index) => (
                  <div
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-4 py-2"
                    onClick={() => handleSubfolderSelect(subfolder)}
                  >
                    {formatDisplayName(subfolder)}
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
      ) : (
        // Standard image selection dropdown for non-nested structure
        <div className="relative z-20 mb-4" ref={dropdownRef}>
          <div
            className="custom-select-container cursor-pointer rounded border border-stroke bg-white px-4 py-3 dark:bg-form-input"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedOption
              ? normalizeFilename(selectedOption)
              : "Select Image"}
          </div>
          {dropdownOpen && (
            <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded border border-stroke bg-white shadow-lg">
              {currentImages.length > 0 ? (
                currentImages.map((image, index) => (
                  <div
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-4 py-2"
                    onClick={() => handleImageSelect(image.name)}
                  >
                    {normalizeFilename(image.name)}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 px-4 py-2">
                  {selectedSubfolder ? "No images found in this folder" : "Please select a subfolder first"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Display selected images from subfolder */}
      {selectedSubfolder && hasNestedStructure && currentImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Images in {formatDisplayName(selectedSubfolder)}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((image, index) => (
              <div 
                key={index} 
                className={`cursor-pointer rounded-lg border p-2 ${selectedOption === image.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleImageSelect(image.name)}
              >
                <div className="aspect-square relative overflow-hidden rounded mb-2">
                  <Image
                    src={safeImagePath(image.path)}
                    alt={normalizeFilename(image.name)}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-center truncate">{normalizeFilename(image.name)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content - Selected Image Display */}
      <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="relative flex items-center justify-center overflow-auto">
          {selectedOption && getCurrentDisplayImage() ? (
            <Image
              src={safeImagePath(getCurrentDisplayImage() || "")}
              alt={`Selected Image: ${formatDisplayName(selectedOption)}`}
              width={0}
              height={0}
              style={{ width: "auto", height: "auto" }}
              unoptimized
            />
          ) : (
            <p className="text-gray-500">
              {hasNestedStructure && !selectedSubfolder 
                ? "Please select a subfolder first" 
                : "No image selected"}
            </p>
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
