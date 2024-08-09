import React from "react";
import Image from "next/image";
import Logo from "../../../public/images/logo/logo.png"; // Adjust the path as necessary

const LogoLoader = () => {
  return (
    <div className="logo-loader">
      <Image
        src={Logo}
        alt="Loading..."
        width={100} // Adjust size if needed
        height={100} // Adjust size if needed
        className="animate-spin"
      />
    </div>
  );
};

export default LogoLoader;
