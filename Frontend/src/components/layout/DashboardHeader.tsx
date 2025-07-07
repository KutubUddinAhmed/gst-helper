import React from "react";
import { Search } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";

import Breadcrumbs from "./Breadcrumbs";
import { SidebarTrigger } from "../../../components/components/ui/sidebar";

function DashboardHeader() {
  return (
    <div className="flex items-center justify-between py-2 md:py-3 min-w-full 2xl:max-w-[90vw]">
      {/* Left Section */}
      <div className="flex items-center gap-1.5  md:text-sm md:font-semibold">
        <SidebarTrigger  />
        <Breadcrumbs />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border-1 border-gray-800 md:py-2 rounded-sm md:rounded-md px-2 sm:px-4 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-black w-[150px] md:w-[300px] placeholder:text-xs md:placeholder:text-lg"
          />
          <Search className="absolute right-0 sm:right-2 top-1/2 transform -translate-y-1/2 text-black p-1 sm:p-0 " />
        </div>

        {/* Profile Icon */}
        <AccountCircle className="cursor-pointer text-white hover:text-gray-900/70 transition duration-200 md:min-h-[45px] md:min-w-[45px] rounded-full" />
      </div>
    </div>
  );
}

export default DashboardHeader;
