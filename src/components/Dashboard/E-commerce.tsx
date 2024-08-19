import React, { useEffect } from "react";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import CardDataStats from "../CardDataStats";
import { usePathname } from "next/navigation";
import LogoLoader from "./LogoLoader";
import NotFoundImage from "../../app/error-404";

const ECommerce: React.FC = () => {
  const [selectedOption, setIsOptionSelected] = React.useState<string>("");
  const [images, setImages] = React.useState<any>([]);
  const [imagesKey, setImagesKey] = React.useState<any>([]);
  const [flag, setFlag] = React.useState<boolean>(true);
  const [empty, setEmpty] = React.useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    async function fetchFolders() {
      await fetch(`/api/getSubFolderNames/${path.split("/")[2]}`)
        .then((response) => response.json())
        .then((data) => {
          setImages(data.answer);
          setImagesKey(Object.keys(data.answer));
          setFlag(false);

          // Automatically select the first category if it exists
          if (Object.keys(data.answer).length > 0) {
            setIsOptionSelected(Object.keys(data.answer)[0]);
          }
        })
        .catch((error) => {
          setEmpty(true);
        });
    }

    fetchFolders();
  }, [path]);

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
          <div className="flex space-x-0 w-full mb-2 gap-2"> {/* Added small bottom margin */}
            <button
              onClick={() => multiculti(imagesKey[0])}
              className="flex-1"
            >
              <CardDataStats
                title="cards"
                total={imagesKey[0] ? imagesKey[0] : "NO DATA"}
                disabled={false}
                selected={selectedOption === imagesKey[0]}
                iconType="cards"
                rate={
                  <input
                    checked={selectedOption === imagesKey[0]}
                    className="cursor-pointer"
                    onChange={() => multiculti(imagesKey[0])}
                    type="radio"
                    value="Male"
                  />
                }
              />
            </button>
            <button
              onClick={() => multiculti(imagesKey[1])}
              className="flex-1"
            >
              <CardDataStats
                title="cats"
                total={
                  imagesKey[1] != undefined && imagesKey[1] != "empty"
                    ? imagesKey[1]
                    : "No DATA"
                }
                disabled={
                  imagesKey[1] != undefined && imagesKey[1] != "empty"
                    ? false
                    : true
                }
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
                disabled={!selectedOption}
                selectedOption={selectedOption} 
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ECommerce;
