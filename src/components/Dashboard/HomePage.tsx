import React, { useEffect, useState } from "react";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import CardDataStats from "../CardDataStats";
import { usePathname } from "next/navigation";
import LogoLoader from "./LogoLoader";
import NotFoundImage from "../../app/error-404";

const HomePage: React.FC = () => {
  const [selectedOption, setIsOptionSelected] = useState<string>("");
  const [images, setImages] = useState<any>([]);
  const [imagesKey, setImagesKey] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Controls loader visibility
  const [empty, setEmpty] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    // Function to fetch data and apply minimum delay
    const fetchDataWithDelay = async () => {
      const delay = new Promise<void>((resolve) => setTimeout(resolve, 1000)); // x-second delay
      try {
        const response = await fetch(`/api/getSubFolderNames/${path.split("/")[2]}`);
        const data = await response.json();
        setImages(data.answer);
        setImagesKey(Object.keys(data.answer));

        const firstValidKey = Object.keys(data.answer).find(
          (key) => data.answer[key] && data.answer[key].length > 0,
        );

        if (firstValidKey) {
          setIsOptionSelected(firstValidKey);
        } else {
          setEmpty(true);
        }
      } catch (error) {
        setEmpty(true);
      }

      await delay; // Wait for at least 5 seconds before setting loading to false
      setIsLoading(false); // Hide the loader
    };

    fetchDataWithDelay();
  }, [path]);

  function multiculti(variable: string) {
    setIsOptionSelected(variable);
  }

  function parseFolderName(folderName: string) {
    const matches = folderName.match(/(.*)\s\[(.*)\]/);
    if (matches) {
      return {
        total: matches[1].trim(),
        title: matches[2].trim(),
      };
    }
    return {
      total: folderName,
      title: "Unknown",
    };
  }

  return (
    <>
      {isLoading ? ( 
        <LogoLoader />
      ) : empty ? (
        <div>
          <NotFoundImage />
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-2 flex w-full gap-2 space-x-0">
            {imagesKey[0] &&
              images[imagesKey[0]].length > 0 && (
                <button
                  onClick={() => multiculti(imagesKey[0])}
                  className="flex-1"
                >
                  <CardDataStats
                    title={parseFolderName(imagesKey[0]).title}
                    total={parseFolderName(imagesKey[0]).total}
                    disabled={images[imagesKey[0]].length === 0}
                    selected={selectedOption === imagesKey[0]}
                    rate={
                      <input
                        className="cursor-pointer"
                        checked={selectedOption === imagesKey[0]}
                        onChange={() => multiculti(imagesKey[0])}
                        type="radio"
                        value="Male"
                      />
                    }
                  />
                </button>
              )}
            {imagesKey[1] &&
              images[imagesKey[1]].length > 0 && (
                <button
                  onClick={() => multiculti(imagesKey[1])}
                  className="flex-1"
                >
                  <CardDataStats
                    title={parseFolderName(imagesKey[1]).title}
                    total={parseFolderName(imagesKey[1]).total}
                    disabled={images[imagesKey[1]].length === 0}
                    selected={selectedOption === imagesKey[1]}
                    rate={
                      <input
                        className="cursor-pointer"
                        checked={selectedOption === imagesKey[1]}
                        onChange={() => multiculti(imagesKey[1])}
                        type="radio"
                        value="Female"
                      />
                    }
                  />
                </button>
              )}
          </div>
          <div>
            <SelectGroupTwo
              photos={() => {
                return selectedOption === imagesKey[0]
                  ? [images[imagesKey[0]], 1]
                  : [images[imagesKey[1]], 2];
              }}
              isLoading={isLoading}
              selectedOption={selectedOption}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
