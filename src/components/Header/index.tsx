import Link from "next/link";

import Image from "next/image";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image width={32} height={32} src={"/logo/logo.png"} alt="Logo" />
          </Link>
        </div>
        <Image
          width={80}
          height={80}
          src={"/logo/logo.png"}
          alt="Logo"
          className="m-0 p-0"
        />
        <Image
          width={70}
          height={70}
          src={"/logo/UOWMlogo.png"}
          alt="Logo"
          className="m-0 p-0"
        />
        <Image width={92} height={92} src={"/logo/sidroco.png"} alt="Logo" />
      </div>
    </header>
  );
};

export default Header;
