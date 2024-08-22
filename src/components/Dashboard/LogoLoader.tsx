import React from "react";
import Image from "next/image";
import Logo from "../../../public/images/logo/logo.png"; // Adjust the path as necessary

const LogoLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="text-center" style={{ marginTop: '-30%' }}> {/* Adjust margin to move the logo up */}
        <Image
          src={Logo}
          alt="Loading..."
          width={150} // Size of the logo
          height={150} // Size of the logo
          className="mx-auto animate-spin" // Tailwind's built-in spin animation
        />
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default LogoLoader;
