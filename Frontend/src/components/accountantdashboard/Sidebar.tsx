import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Dashboard,
  Groups3Outlined,
  LogoutOutlined,
  Person,
  Menu,
  CloseOutlined,
} from "@mui/icons-material";
import Cookies from "js-cookie";

const SidePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    Cookies.remove("refresh_token");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`min-h-screen bg-gradient-to-b from-purple-500 to-purple-700 p-4 flex-shrink-0 text-white border-r-2 border-purple-400 transition-all duration-400 ${
          isOpen ? "w-60 md:w-72" : "w-16  flex flex-col items-center"
        }`}
      >
        {/* Logo Section */}
        <div className="mb-6 flex items-center justify-center md:justify-start space-x-2">
          <div
            className={`bg-white text-purple-500  flex items-center justify-center rounded-full ${
              isOpen ? "h-10 w-10" : "h-8 w-8"
            }`}
          >
            <span className="font-bold md:text-sm">GH</span>
          </div>
          {isOpen && (
            <h1 className="text-xl md:text-2xl font-bold">GST Helper</h1>
          )}
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-1 md:p-3 rounded-lg ${
                    isActive
                      ? "bg-white text-purple-600"
                      : "hover:bg-purple-600"
                  }`
                }
              >
                <Dashboard fontSize="small" />
                {isOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vendor"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 md:p-3 rounded-lg ${
                    isActive
                      ? "bg-white text-purple-600"
                      : "hover:bg-purple-600"
                  }`
                }
              >
                <Groups3Outlined fontSize="small" />
                {isOpen && <span>Vendor</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 md:p-3 rounded-lg ${
                    isActive
                      ? "bg-white text-purple-600"
                      : "hover:bg-purple-600"
                  }`
                }
              >
                <Person fontSize="small" />
                {isOpen && <span>Profile</span>}
              </NavLink>
            </li>
            <li>
              <button
                type="button"
                onClick={logout}
                className="flex items-center space-x-3 p-2 md:p-3 rounded-lg w-full text-left hover:bg-purple-600"
              >
                <LogoutOutlined fontSize="small" />
                {isOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 ${
          isOpen ? "left-64 md:left-80" : "left-20"
        } z-20 bg-purple-500 p-2 rounded-full text-white shadow-md hover:bg-purple-600 focus:outline-none transition-all`}
      >
        {isOpen ? (
          <CloseOutlined fontSize="small" />
        ) : (
          <Menu fontSize="small" />
        )}
      </button>
    </div>
  );
};

export default SidePanel;
