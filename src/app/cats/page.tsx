"use client";
import React from "react";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import CardDataStats from "@/components/CardDataStats";
import { usePathname } from "next/navigation";

const ECommerce: React.FC = () => {
  const [selectedOption, setIsOptionSelected] = React.useState<string>("");
  const importAll = (context: any) =>
    context.keys().map((key: string) => context(key).default);

  const path = usePathname();

  React.useEffect(() => {
    fetch("/api/getFolderNames")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.folders); // Output the list of folders
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  }, [path]);

  const randomPhotos = importAll(
    require.context(
      `../../../public/images/cards/`,
      false,
      /\.(?:jpg|jpeg|png|gif|webp)$/,
    ),
  );

  const cats = importAll(
    require.context(
      `../../../public/images/cats/`,
      false,
      /\.(?:jpg|jpeg|png|gif|webp)$/,
    ),
  );
  function multiculti(variable: string) {
    setIsOptionSelected(variable);
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-4 bg-center  md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        {/*  */}
        <button onClick={() => multiculti("Male")}>
          <CardDataStats
            title="Total views"
            total="$3.456K"
            rate={
              <input
                checked={selectedOption === "Male"}
                className="cursor-pointer"
                onChange={() => multiculti("Male")}
                type="radio"
                value="Male"
              />
            }
          >
            <div>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </div>
            <div></div>
          </CardDataStats>
        </button>
        <button onClick={() => multiculti("Female")}>
          <CardDataStats
            title="Total Profit"
            total="$45,2K"
            rate={
              <input
                className="cursor-pointer "
                checked={selectedOption === "Female"}
                onChange={() => multiculti("Female")}
                type="radio"
                value="Female"
              />
            }
          >
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
                fill=""
              />
              <path
                d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
                fill=""
              />
              <path
                d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </button>
      </div>
      <div>
        <SelectGroupTwo
          photos={
            selectedOption == "Male" && selectedOption
              ? [randomPhotos, 1]
              : [cats, 2]
          }
        />
      </div>
    </>
  );
};

export default ECommerce;
