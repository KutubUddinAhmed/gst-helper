import React, { type ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";


interface AuthContextType {
  auth: {
    accessToken: string;
    user: string | "";
    userRole: string | "";
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{
      accessToken: string;
      user: string | "";
      userRole: string | "";
    }>
  >;
  login: (data: any) => void;
  logout: () => void;
}



const AuthContext = createContext <AuthContextType | "">("");


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [auth, setAuth] = useState({
    accessToken: sessionStorage.getItem("access_token") || "",
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : "",
    userRole: localStorage.getItem("user_role")
      ? JSON.parse(localStorage.getItem("user_role")!)
      : "",
  });
  



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
      localStorage.setItem('user_role', JSON.stringify(auth.userRole));
    } else {
      localStorage.removeItem('user_role');
    }
 
  }, [auth])



  const login = (data : any) => {
    setAuth({
      accessToken: data.access_token,
      user: data.user,
      userRole: data.user_role,
    });
  }

  const logout = () => {
    setAuth({ accessToken: "", user: "", userRole: "" });
    sessionStorage.clear();
    localStorage.clear();
    Cookies.remove('refresh_token');
  };




return (
  <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
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
