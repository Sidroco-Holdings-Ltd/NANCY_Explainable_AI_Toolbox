import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import NotFoundImage from "../../app/error-404";
import CardDataStats from "../CardDataStats";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import LogoLoader from "./LogoLoader";

const HomePage: React.FC = () => {
  const [selectedOption, setIsOptionSelected] = useState<string>("");
  const [images, setImages] = useState<any>([]);
  const [imagesKey, setImagesKey] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Controls loader visibility
  const [empty, setEmpty] = useState<boolean>(false);
  const [jsons, setJsons] = useState<any>([]);
  const [isNewFolder, setIsNewFolder] = useState<boolean>(false);
  const [specificSubfolder, setSpecificSubfolder] = useState<string | null>(null);

  const path = usePathname();
  const searchParams = useSearchParams();
  const subfolder = searchParams.get('subfolder');

  useEffect(() => {
    // Function to fetch data and apply minimum delay
    const fetchDataWithDelay = async () => {
      const delay = new Promise<void>((resolve) => setTimeout(resolve, 1000)); // x-second delay
      try {
        const folderName = path.split("/")[2];
        setIsNewFolder(folderName === "New_folder");
        
        // Check if we have a subfolder param and we're in New_folder
        if (folderName === "New_folder" && subfolder) {
          setSpecificSubfolder(subfolder);
        }
        
        const response = await fetch(
          `/api/getSubFolderNames/${folderName}`,
        );
        const data = await response.json();
        setImages(data.answer);
        setImagesKey(Object.keys(data.answer));

        // Prepare to store JSON paths corresponding to the images
        const jsonPaths: string[][] = []; // Initialize as an array of string arrays

        // Iterate over each subfolder and extract JSON paths
        Object.keys(data.answer).forEach((subfolderKey) => {
          const subfolderData = data.answer[subfolderKey];
          
          // Handle nested subfolder structure
          if (typeof subfolderData === 'object' && !Array.isArray(subfolderData)) {
            // For nested structure, collect all image paths across all sub-subfolders
            const allSubfolderPaths: string[] = [];
            
            Object.keys(subfolderData).forEach(subSubfolderKey => {
              const imageArray = subfolderData[subSubfolderKey];
              const subSubfolderPaths = imageArray.map((image: any) => {
                return image.path.replace(/\.(png|jpg|jpeg)$/i, ".json");
              });
              allSubfolderPaths.push(...subSubfolderPaths);
            });
            
            jsonPaths.push(allSubfolderPaths);
          } else {
            // Regular image array
            const subfolderImages = data.answer[subfolderKey];
            const subfolderJsonPaths = subfolderImages.map((image: any) => {
              return image.path.replace(/\.(png|jpg|jpeg)$/i, ".json");
            });
            jsonPaths.push(subfolderJsonPaths);
          }
        });

        setJsons(jsonPaths);
        
        // If we have a specific subfolder for New_folder, use that
        if (folderName === "New_folder" && subfolder && data.answer[subfolder]) {
          setIsOptionSelected(subfolder);
        } else {
          // Otherwise use the first valid key
          const firstValidKey = Object.keys(data.answer).find(
            (key) => data.answer[key] && 
                    (Array.isArray(data.answer[key]) ? 
                      data.answer[key].length > 0 : 
                      Object.keys(data.answer[key]).length > 0)
          );
          
          if (firstValidKey) {
            setIsOptionSelected(firstValidKey);
          } else {
            setEmpty(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmpty(true);
      }

      await delay; // Wait for at least 1 second before setting loading to false
      setIsLoading(false); // Hide the loader
    };

    fetchDataWithDelay();
  }, [path, subfolder]);

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
      title: "    ",
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
          {/* Only show subfolder selection cards if NOT in New_folder or there's no subfolder selected */}
          {(!isNewFolder || !subfolder) && (
            <div className="mb-2 flex w-full gap-2 space-x-0">
              {imagesKey.map((key: string, index: number) => {
                const hasContent = Array.isArray(images[key]) 
                  ? images[key].length > 0 
                  : Object.keys(images[key]).length > 0;
                  
                return hasContent && (
                  <button
                    key={index}
                    onClick={() => multiculti(key)}
                    className="flex-1"
                  >
                    <CardDataStats
                      title={parseFolderName(key).title}
                      total={parseFolderName(key).total}
                      disabled={!hasContent}
                      selected={selectedOption === key}
                      rate={
                        <input
                          className="cursor-pointer"
                          checked={selectedOption === key}
                          onChange={() => multiculti(key)}
                          type="radio"
                          value={key}
                        />
                      }
                    />
                  </button>
                );
              })}
            </div>
          )}
          <div>
            <SelectGroupTwo
              photos={() => {
                const selectedIndex = imagesKey.indexOf(selectedOption);
                return [images[selectedOption], selectedIndex + 1, jsons[selectedIndex]];
              }}
              isLoading={isLoading}
              //selectedOption={selectedOption}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
