import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AccountantDashboard from "../src/components/accountantdashboard/AccountantDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import DefaultLayout from "./components/layout/DefaultLayout";
import Vendor from "./components/Vendor/Vendors";
import VendorProfile from "./components/Vendor/VendorProfile";
import AuthPage from "./components/auth/AuthPage";
import UnauthorizedPage from "./components/auth/UnauthorizedPage"
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import AccountantProfile from "./components/profile/AccountantProfile";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DefaultLayout />}>
          <Route path="login" element={<AuthPage />} />
          {/* <Route path="signup" element={<AuthPage />} /> */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["accountant", "superuser"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountantDashboard />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="vendor/:user_id" element={<VendorProfile />} />
          <Route path="profile" element={<AccountantProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
