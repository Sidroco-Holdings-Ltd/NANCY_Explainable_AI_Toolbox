"use client";

import React from "react";
import Image from "next/image";
import normalizeFilename from "@/js/normalize";
const ChartOne: React.FC = () => {
  const importAll = (context: any) =>
    context.keys().map((key: string) => context(key).default);

  const photos = importAll(
    require.context(
      `../../../public/images/cards/`,
      false,
      /\.(?:jpg|jpeg|png|gif|webp)$/,
    ),
  );
  console.log(photos[1].src, normalizeFilename(photos[1].src));

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        {photos.map((photo: any, index: any) => (
          <div
            key={index}
            className="relative flex h-full w-full items-center justify-center rounded-sm  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <Image
              src={photo}
              alt="card"
              className="h-full w-full rounded-sm border-none object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartOne;
