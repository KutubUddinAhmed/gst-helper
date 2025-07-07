import React from "react";
import { Link, useLocation } from "react-router-dom";

const routeLabels: { [key: string]: string } = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/dashboard/vendor": "Vendors",
  "/dashboard/vendor/:user_id": "Vendor Profile",
  "/dashboard/profile": "Profile",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean); // Split path into segments

  // Rebuild path dynamically for each segment
  const breadcrumbLinks = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = routeLabels[path] || segment; // Fallback to segment if label is not defined

    return (
      <span key={path} className="flex items-center">
        {index > 0 && <span className="mx-2 sm:text-3xl">/</span>} {/* Separator */}
        <Link
          to={path}
          className="text-[#1f2937] text-[9px] sm:text-3xl hover:underline"
        >
          {label}
        </Link>
      </span>
    );
  });

  return (
    <div className="breadcrumbs flex items-center text-gray-600">
      {breadcrumbLinks}
    </div>
  );
};

export default Breadcrumbs;
