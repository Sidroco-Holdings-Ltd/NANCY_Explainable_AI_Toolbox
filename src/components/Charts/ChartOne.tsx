"use client";

import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Create a flexible importAll function that works both in webpack and tests
function importAll(context: any) {
  // If we're in a test environment and photos were passed in
  if (typeof context === 'object' && !context.keys) {
    return Object.keys(context).map(key => ({
      src: context[key]
    }));
  }
  
  // Normal webpack require.context environment
  if (context.keys) {
    return context.keys().map((item: string) => ({
      src: `/images/cards/${item.replace("./", "")}`,
    }));
  }
  
  // Fallback for tests
  return [];
}

let photos: { src: string }[] = [];

// Only run in browser environment to avoid SSR issues
if (typeof window !== 'undefined') {
  try {
    photos = importAll(
      require.context(
        `../../../public/images/cards/`,
        false,
        /\.(?:jpg|jpeg|png|gif|webp)$/,
      ),
    );
  } catch (e) {
    // Handle error or provide fallback
    console.warn("Error importing card images:", e);
    photos = [];
  }
}

const options: ApexOptions = {
  // ... existing options remain unchanged
};

interface ChartOneProps {
  // Special prop for testing
  __TEST_PHOTOS__?: { src: string }[];
}

const ChartOne: React.FC<ChartOneProps> = ({ __TEST_PHOTOS__ }) => {
  const [series, setSeries] = useState<ApexOptions['series']>([
    {
      name: "Product One",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
    },
    {
      name: "Product Two",
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
    },
  ]);

  // Use test photos if provided, otherwise use the imported photos
  const displayPhotos = __TEST_PHOTOS__ || photos;

  return (
    <div data-testid="chart-one" className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <span>Visitors Analytics</span>
        <label
          htmlFor="timeSelect"
          className="mb-2.5 block text-black dark:text-white"
        >
          Select year:
        </label>
        <select id="timeSelect" className="w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-4">
        {displayPhotos.map((photo, index) => (
          <div key={index} className="h-15 w-15 rounded-full">
            <Image
              src={photo.src}
              width={60}
              height={60}
              style={{ width: "auto", objectFit: "cover" }}
              alt={`card-image-${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartOne;
