"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import normalizeFilename from "@/js/normalize";

const SelectGroupTwo: React.FC<any> = ({ photos, isLoading }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [value, setValue] = useState<number>(-1);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [images, setImages] = useState<any>([]);

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

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div>
      <div className="custom-select-container relative z-20 bg-white dark:bg-form-input">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select
          </option>
          {!isLoading ? (
            images.map((photo: any, index: any) => (
              <option
                key={index}
                value={photo.name}
                className="text-body dark:text-bodydark"
              >
                {normalizeFilename(photo.name)}
              </option>
            ))
          ) : (
            <></>
          )}
        </select>
      </div>

      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
        <div>
          <div className="relative flex h-full w-full items-center justify-center rounded-sm border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {selectedOption ? (
              <Image
                src={
                  images?.find((photo: any) =>
                    photo.name == selectedOption ? photo.path : null,
                  ).path
                }
                alt="Selected Image"
                layout="responsive" // Ensure the image is responsive
                width={100} // Tailwind classes will handle width
                height={0} // Set to 0, height will be adjusted by the container
                className="w-full h-auto object-cover"  // Tailwind classes for full width and auto height
              />
            ) : (
              <p className="text-gray-500">Nothing selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectGroupTwo;
