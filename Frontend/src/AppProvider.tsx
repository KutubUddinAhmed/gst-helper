import React, { type ReactNode } from "react";

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default AppProvider;
