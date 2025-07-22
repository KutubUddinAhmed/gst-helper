import Cookies from "js-cookie";
import React, { type ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
const base_url = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  accessToken: string;
  user: any | null;
  userRole: string | "";
}


interface LoginData {
  email: string;
  password: string;
}


interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (data: LoginData) => Promise<boolean>;
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



  const login = async ({ email, password }: LoginData): Promise<boolean> => {
    try {
      const response = await fetch(`${base_url}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const userRole = "accountant"; // or derive from data

      setAuth({
        accessToken: data.access_token,
        user: data.user,
        userRole,
      });

      sessionStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_role", userRole);

      Cookies.set("refresh_token", data.refresh_token, {
        path: "/",
        secure: true,
        sameSite: "strict",
        expires: 7,
      });

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
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
