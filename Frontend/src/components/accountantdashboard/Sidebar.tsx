import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Dashboard, Groups3Outlined, LogoutOutlined, Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import Cookies from "js-cookie";


const SidePanel: React.FC = () => {

  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    Cookies.remove("refresh_token");

    navigate("/login")
  };

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
              to="/dashboard"
              end
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
            <button
              type="button"
              onClick={logout}
              className="flex items-center space-x-3 p-3 rounded-lg w-full text-left hover:bg-purple-600"
            >
              <LogoutOutlined fontSize="small" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidePanel;
