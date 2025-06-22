import React, { type ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";


interface AuthState {
  accessToken: string;
  user: any | null;
  userRole: string | "";
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (data: {
    access_token: string;
    user: any;
    user_role: string;
  }) => void;
  verifyToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initializeAuthState = (): AuthState => ({
    accessToken: sessionStorage.getItem("access_token") || "",
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : "",
    userRole: localStorage.getItem("user_role")
      ? JSON.parse(localStorage.getItem("user_role")!)
      : "",
  });

  const [auth, setAuth] = useState<AuthState>(initializeAuthState);

  useEffect(() => {
    // Sync state with sessionStorage/localStorage on change
    if (auth.accessToken) {
      sessionStorage.setItem("access_token", auth.accessToken);
    } else {
      sessionStorage.removeItem("access_token");
    }

    if (auth.user) {
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      localStorage.removeItem("user");
    }

    if (auth.userRole) {
      localStorage.setItem("user_role", JSON.stringify(auth.userRole));
    } else {
      localStorage.removeItem("user_role");
    }
  }, [auth]);

  const login = (data: {
    access_token: string;
    user: {};
    user_role: string;
  }) => {
    setAuth({
      accessToken: data.access_token,
      user: data.user,
      userRole: data.user_role,
    });
  };


  const verifyToken = async (token: string): Promise<boolean> => {
    if (!token) return false;

    try {
      // Example: Validate token with an API endpoint
      const response = await fetch("/api/verify-token", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;
};
