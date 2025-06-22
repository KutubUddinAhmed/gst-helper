import React from "react";
import { Search } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";

function DashboardHeader() {
  return (
    <div className="bg-black text-white flex items-center justify-between px-4 py-3">
      {/* Left Section */}
      <div className="text-lg font-bold">Welcome, User!</div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Profile Icon */}
        <AccountCircle className="text-3xl cursor-pointer hover:text-gray-400" />
      </div>
    </div>
  );
}

export default DashboardHeader;
