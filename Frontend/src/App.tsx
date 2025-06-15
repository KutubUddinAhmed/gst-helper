import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AccountantDashboard from "../src/components/accountantdashboard/AccountantDashboard";
import Layout from "./components/layout/Layout";
import Vendor from "./components/Vendor/Vendors";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AccountantDashboard />} />
          <Route path="/vendor" element={<Vendor />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
