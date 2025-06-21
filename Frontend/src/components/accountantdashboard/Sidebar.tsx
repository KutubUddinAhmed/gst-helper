import React from "react";
import { NavLink } from "react-router-dom";
import {
  Dashboard,
  BarChart,
  People,
  Logout as LogoutIcon,
  Groups3Outlined,
  Person,
} from "@mui/icons-material";

const SidePanel: React.FC = () => {
  return (
    <div className="w-72 min-h-full bg-gradient-to-b from-purple-500 to-purple-700 p-4 flex-shrink-0 text-white border-r-2 border-purple-400">
      {/* Logo Section */}
      <div className="mb-6 flex items-center space-x-2">
        <div className="bg-white text-purple-500 w-10 h-10 flex items-center justify-center rounded-full">
          <span className="font-bold text-sm">GH</span>
        </div>
        <h1 className="text-2xl font-bold">GST Helper</h1>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg ${
                  isActive ? "bg-white text-purple-600" : "hover:bg-purple-600"
                }`
              }
            >
              <Dashboard fontSize="small" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="vendor"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg ${
                  isActive ? "bg-white text-purple-600" : "hover:bg-purple-600"
                }`
              }
            >
              <Groups3Outlined fontSize="small" />
              <span>Vendor</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg ${
                  isActive ? "bg-white text-purple-600" : "hover:bg-purple-600"
                }`
              }
            >
              <Person fontSize="small" />
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg ${
                  isActive ? "bg-white text-purple-600" : "hover:bg-purple-600"
                }`
              }
            >
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
