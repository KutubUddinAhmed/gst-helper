import React from "react";
import {
  Dashboard as DashboardIcon,
  Groups3Outlined,
  LogoutOutlined,
  Person,
} from "@mui/icons-material";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "../../../components/components/ui/sidebar";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Vendors",
    url: "/dashboard/vendor",
    icon: Groups3Outlined,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: Person,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    Cookies.remove("refresh_token");
    navigate("/login");
  };

  const isActive = (url: string) => {
    return (
      location.pathname === url ||
      (url === "/dashboard" && location.pathname === "/")
    );
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent
        style={{
          background: "linear-gradient(to bottom, #080a2d, #121f54, #1e3d8d)",
        }}
      >
        <SidebarGroup>
          <SidebarGroupLabel
            className={`mb-6 text-white text-center mx-auto font-semibold transition-opacity`}
          >
            GST HELPER
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    className={() =>
                      `flex items-center gap-2 p-2 rounded cursor-pointer text-md ${
                        isActive(item.url)
                          ? "bg-white text-black"
                          : "hover:bg-blue-100/50 text-black"
                      }`
                    }
                  >
                    <item.icon
                      className={
                        isActive(item.url) ? "text-black" : "text-white"
                      }
                    />
                    <span
                      className={
                        isActive(item.url) ? "text-black" : "text-white"
                      }
                    >
                      {item.title}
                    </span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex items-center gap-2 w-full p-2 rounded hover:bg-red-400 text-white}`}
                >
                  <LogoutOutlined className="text-white" />
                  <span className="text-white">Logout</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
