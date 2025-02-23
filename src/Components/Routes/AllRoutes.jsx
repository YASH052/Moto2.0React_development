import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";

// Public Pages
import NotFound from "../Pages/NotFound/NotFound";
import LoginForm from "../Pages/Auth/Login/LoginForm";
import ForgotPasswordForm from "../Pages/Auth/ForgotPasswordForm";
import ResetPasswordForm from "../Pages/Auth/ResetPasswordForm";

// Private Pages
import TestCompo from "../Pages/NuralCustomComponents/TestCompo";
import Transactions from "../Pages/Master/Transaction/Transactions";
import PrimaryTransactionUpload from "../Pages/Master/Transaction/PrimaryTransactionUpload";
import IspUpload from "../Pages/Master/Isp/IspUpload";
import AddIsp from "../Pages/Master/Isp/AddIsp";
import AddAgancy from "../Pages/Master/ManageAgency/Addagency";
import Pricemaster from "../Pages/Master/PriceMaster/Pricemaster";
import Reports from "../Pages/Master/Reports/Reports";
import SaleReports from "../Pages/Master/Reports/SaleReports";
import RetailerExcel from "../Pages/Master/SalesChannel/RetailerExcel";
import SalesChannelView from "../Pages/Master/SalesChannel/SalesChannelView";
import AddRetailer from "../Pages/Master/SalesChannel/AddRetailer";
import AddSalesChannel from "../Pages/Master/SalesChannel/AddSalesChannel";
import LoginFormHome from "../Pages/Auth/Login/LoginFormHome";
const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/login1" element={<LoginFormHome />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/test" element={<TestCompo />} />
      </Route>

      {/* Private Routes */}
      {/* <Route element={<PrivateRoute />}> */}
      <Route path="/" element={<Dashboard />} />

      {/* </Route> */}

      <Route path="/transaction" element={<Transactions />} />
      <Route
        path="/primary-transaction"
        element={<PrimaryTransactionUpload />}
      />
       <Route path="/price-master" element={<Pricemaster />} />
        <Route path="/add-agancy" element={<AddAgancy />} />
      <Route path="/isp-upload" element={<IspUpload />} />
      <Route path="/add-isp" element={<AddIsp />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/sales-report" element={<SaleReports />} />
      <Route path="/retailer-excelUpload" element={<RetailerExcel />} />
      <Route path="/sales-channel-view" element={<SalesChannelView />} />
      <Route path="/add-retailer" element={<AddRetailer />} />
      <Route path="/add-sales-channel" element={<AddSalesChannel />} />
      {/* Default and Not Found Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AllRoutes;
