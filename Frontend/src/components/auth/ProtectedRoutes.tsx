import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AppProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: Specify allowed roles for this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { auth } = useAuth();

  // Check if the user is authenticated
  if (!auth.accessToken) {
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(auth.userRole || "")) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
