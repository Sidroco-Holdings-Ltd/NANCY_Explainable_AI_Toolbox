import Link from "next/link";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11 min-h-[80px]">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <Link className="block flex-shrink-0 lg:hidden" href="/">
          </Link>
        </div>
        <div className="text-center w-full">
          <h1 className="text-xl font-bold">NANCY XAI Visualisation Dashboard</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
