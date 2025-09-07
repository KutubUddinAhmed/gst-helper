import React, { useEffect, useState } from "react";
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
  const { auth, verifyToken } = useAuth(); // Assume `verifyToken` checks the token validity
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Await verification of the token
        const isValid = await verifyToken(auth.accessToken);
        setIsAuthorized(
          isValid &&
            (!allowedRoles || allowedRoles.includes(auth.userRole || ""))
        );
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [auth.accessToken, auth.userRole, allowedRoles, verifyToken]);



  // Show a loading indicator while waiting for the token verification
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a spinner or appropriate loader
  }

  // Redirect if unauthorized
  if (!isAuthorized) {
    return <Navigate to={auth.accessToken ? "/unauthorized" : "/login"} />;
  }

  // Render the protected component if authorized
  return <>{children}</>;
};


export default ProtectedRoute;
