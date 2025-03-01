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
import Target from "../Pages/Master/Target/target";
import Product from "../Pages/Master/Product/product";
import AddUser from "../Pages/Master/User/AddUser";
import ViewUser from "../Pages/Master/User/ViewUser";
import AddLocation from "../Pages/Master/User/AddLocation";
import ViewLoaction from "../Pages/Master/User/ViewLocation";
import IspSaleReport from "../Pages/Master/Reports/IspSaleReport";
import CounterShareReport from "../Pages/Master/Reports/CounterShareReport";
import StockAdjustmentUpload from "../Pages/Master/Others/StockAdjustmentUpload";
import SecondarySale from "../Pages/Master/Transaction/SecondarySale";
import SalesChannelStockSB from "../Pages/Master/Reports/SalesChannelStockSB";
import ActivationFileRecieved from "../Pages/Master/Reports/ActivationFileRecieved";
import RedingtonFile from "../Pages/Master/Reports/RedingtonFile";
import SalesBulkUpload from "../Pages/Master/SalesChannel/SalesBulkUpload";
import SalesExcel from "../Pages/Master/SalesChannel/SalesExcel";
import SerialNoMoment from "../Pages/Master/Reports/SerialNoMoment";
import ViewTarget from "../Pages/Master/Target/ViewTarget";
import PrebookingSKUcreate from "../Pages/Master/PrebookingSKU/PrebookingSKUcreate";
import PrebookingSKUview from "../Pages/Master/PrebookingSKU/PrebookingSKUview";
import CreateScheme from "../Pages/Master/Scheme/CreateScheme";
import ViewScheme from "../Pages/Master/Scheme/ViewScheme";
import SKU from "../Pages/Master/Product/SKU";
import Model from "../Pages/Master/Product/Model";

import SubCategory from "../Pages/Master/Product/SubCategory";
import BrandPage from "../Pages/Master/Product/BrandPage";
import CategoryPage from "../Pages/Master/Product/CategoryPage";
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
      <Route path="/product" element={<Product />} />
      <Route path="/target" element={<Target />} />
      <Route path="/view-target" element={<ViewTarget />} />
      <Route path="/price-master" element={<Pricemaster />} />
      <Route path="/add-agancy" element={<AddAgancy />} />
      <Route path="/isp-upload" element={<IspUpload />} />
      <Route path="/add-isp" element={<AddIsp />} />
      <Route path="/sales-bulk-upload" element={<SalesBulkUpload />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/sales-report" element={<SaleReports />} />
      <Route path="/retailer-excelUpload" element={<RetailerExcel />} />
      <Route path="/sales-channel-view" element={<SalesChannelView />} />
      <Route path="/add-retailer" element={<AddRetailer />} />
      <Route path="/add-sales-channel" element={<AddSalesChannel />} />
      <Route path="/sales-excel" element={<SalesExcel />} />
      <Route path="/isp-sales-report" element={<IspSaleReport />} />
      <Route path="/counter-share-report" element={<CounterShareReport />} />
      <Route
        path="/stock-adjustment-upload"
        element={<StockAdjustmentUpload />}
      />
      <Route
        path="/activation-file-received"
        element={<ActivationFileRecieved />}
      />
      <Route path="/brand" element={<BrandPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/sub-category" element={<SubCategory />} />
      <Route path="/prebooking-sku-create" element={<PrebookingSKUcreate />} />
      <Route path="/prebooking-sku-view" element={<PrebookingSKUview />} />
      <Route path="/create-scheme" element={<CreateScheme />} />
      <Route path="/view-scheme" element={<ViewScheme />} />
      <Route path="/sku" element={<SKU />} />
      <Route path="/model" element={<Model />} />

      <Route path="/serial-no-moment" element={<SerialNoMoment />} />
      <Route path="/redington-file" element={<RedingtonFile />} />
      <Route path="/secondary-sale" element={<SecondarySale />} />
      <Route path="/sales-channel-stock" element={<SalesChannelStockSB />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/view-user" element={<ViewUser />} />
      <Route path="/add-location" element={<AddLocation />} />
      <Route path="/view-location" element={<ViewLoaction />} />
      {/* Default and Not Found Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AllRoutes;
