"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import normalizeFilename from "@/js/normalize";

const SelectGroupTwo: React.FC<any> = ({ photos, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [value, setValue] = useState<number>(-1);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [images, setImages] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function test(photosValue: any) {
      if (photosValue[1] !== value) {
        setValue(photosValue[1]);
        setSelectedOption("");
        setImages(photosValue[0]);
      }
    }
    if (!isLoading) {
      const photosValue = photos();
      test(photosValue);
    }
  }, [photos, value, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setDropdownOpen(true); // Open the dropdown when typing
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setDropdownOpen(false); // Close the dropdown when an option is selected
    changeTextColor();
  };

  // Function to extract the numerical part from a filename and sort based on it
  const sortImagesNumerically = (images: any[]) => {
    return images.sort((a, b) => {
      const numA = parseInt(a.name.match(/\d+/), 10);
      const numB = parseInt(b.name.match(/\d+/), 10);
      return numA - numB;
    });
  };

  const filteredImages = sortImagesNumerically(
    images.filter((photo: any) =>
      normalizeFilename(photo.name).toLowerCase().includes(searchTerm)
    )
  );

  // Get the selected image index
  const selectedImageIndex = filteredImages.findIndex(
    (photo: any) => photo.name === selectedOption
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-stroke rounded focus:outline-none focus:border-primary"
        />
      </div>

      <div className="relative z-20 mb-4" ref={dropdownRef}>
        <div
          className="custom-select-container bg-white dark:bg-form-input border border-stroke rounded px-4 py-3 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedOption
            ? `Flow ID #${selectedImageIndex}. ${normalizeFilename(
                images.find((photo: any) => photo.name === selectedOption)?.name
              )}`
            : "Select"}
        </div>
        {dropdownOpen && (
          <div className="absolute z-30 mt-1 w-full bg-white border border-stroke rounded shadow-lg max-h-60 overflow-auto">
            {filteredImages.length > 0 ? (
              filteredImages.map((photo: any, index: any) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleOptionSelect(photo.name)}
                >
                  {`Flow ID #${index}. ${normalizeFilename(photo.name)}`}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div className="relative flex justify-center items-center overflow-auto">
          {selectedOption ? (
            <>
              <div className="absolute top-0 left-0 p-2 bg-gray-800 text-white rounded-full">
                Flow ID #{selectedImageIndex}
              </div>
              <Image
                src={
                  images?.find((photo: any) =>
                    photo.name === selectedOption ? photo.path : null
                  ).path
                }
                alt="Selected Image"
                width={0} // Allow image to take its natural width
                height={0} // Allow image to take its natural height
                style={{ width: 'auto', height: 'auto' }} // Allow image to display in its natural size
                unoptimized // Prevent Next.js from optimizing the image, preserving original quality and size
              />
            </>
          ) : (
            <p className="text-gray-500">Nothing selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectGroupTwo;