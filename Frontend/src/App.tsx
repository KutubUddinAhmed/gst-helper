import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AccountantDashboard from "../src/components/accountantdashboard/AccountantDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import DefaultLayout from "./components/layout/DefaultLayout";
import Vendor from "./components/Vendor/Vendors";
import VendorProfile from "./components/Vendor/VendorProfile";
import AuthPage from "./components/auth/AuthPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AccountantDashboard />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="vendor/:user_id" element={<VendorProfile />} />
        </Route>

        {/* Authentication and Default Layout */}
        <Route path="/" element={<DefaultLayout />}>
          <Route path="login" element={<AuthPage />} />
          <Route path="signup" element={<AuthPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
