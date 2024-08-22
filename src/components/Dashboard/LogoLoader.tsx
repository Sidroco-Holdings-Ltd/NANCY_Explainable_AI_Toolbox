import React from "react";
import Image from "next/image";
import Logo from "../../../public/logo/logo.png"; // Adjust the path as necessary

const LogoLoader = () => {
  return (
    <div className="dark:bg-gray-900 flex h-screen items-center justify-center bg-white">
      <div className="text-center" style={{ marginTop: "-30%" }}>
        {" "}
        {/* Adjust margin to move the logo up */}
        <Image
          src={Logo}
          alt="Loading..."
          width={150} // Size of the logo
          height={150} // Size of the logo
          className="mx-auto animate-spin" // Tailwind's built-in spin animation
        />
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-xl">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LogoLoader;
