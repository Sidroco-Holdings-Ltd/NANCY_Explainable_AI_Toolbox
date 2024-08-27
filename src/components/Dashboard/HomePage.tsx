import React, { useEffect } from "react";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import CardDataStats from "../CardDataStats";
import { usePathname } from "next/navigation";
import LogoLoader from "./LogoLoader";
import NotFoundImage from "../../app/error-404";

const HomePage: React.FC = () => {
  const [selectedOption, setIsOptionSelected] = React.useState<string>("");
  const [images, setImages] = React.useState<any>([]);
  const [imagesKey, setImagesKey] = React.useState<any>([]);
  const [flag, setFlag] = React.useState<boolean>(true);
  const [empty, setEmpty] = React.useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    async function fetchFolders() {
      console.log("Fetching folders...");
      await fetch(`/api/getSubFolderNames/${path.split("/")[2]}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Data:", data);
          setImages(data.answer);
          setImagesKey(Object.keys(data.answer));
          setFlag(false);

          // Automatically select the first category if it exists and has data
          const firstValidKey = Object.keys(data.answer).find(
            (key) => data.answer[key] && data.answer[key].length > 0
          );
          if (firstValidKey) {
            setIsOptionSelected(firstValidKey);
          } else {
            setEmpty(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching folders:", error);
          setEmpty(true);
        });
    }

    fetchFolders();
  }, [path]);

  console.log("imagesKey:", imagesKey);
  console.log("images:", images);

  function multiculti(variable: string) {
    setIsOptionSelected(variable);
  }

  return (
    <>
      {empty ? (
        <div>
          <NotFoundImage />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex space-x-0 w-full mb-2 gap-2">
            {imagesKey[0] && images[imagesKey[0]].length > 0 && ( // Check if the array has items
              <button
                onClick={() => multiculti(imagesKey[0])}
                className="flex-1"
              >
                <CardDataStats
                  title="cards"
                  total={
                    imagesKey[0] !== undefined && images[imagesKey[0]].length > 0
                      ? imagesKey[0]
                      : "NO DATA"
                  }
                  disabled={images[imagesKey[0]].length === 0}
                  selected={selectedOption === imagesKey[0]}
                  iconType="cards"
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
            {imagesKey[1] && images[imagesKey[1]].length > 0 && ( // Check if the array has items
              <button
                onClick={() => multiculti(imagesKey[1])}
                className="flex-1"
              >
                <CardDataStats
                  title="cats"
                  total={
                    imagesKey[1] !== undefined && images[imagesKey[1]].length > 0
                      ? imagesKey[1]
                      : "No DATA"
                  }
                  disabled={images[imagesKey[1]].length === 0}
                  selected={selectedOption === imagesKey[1]}
                  iconType="cats"
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
            {flag ? (
              <LogoLoader />
            ) : (
              <SelectGroupTwo
                photos={() => {
                  return selectedOption === imagesKey[0]
                    ? [images[imagesKey[0]], 1]
                    : [images[imagesKey[1]], 2];
                }}
                isLoading={flag}
                selectedOption={selectedOption}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
