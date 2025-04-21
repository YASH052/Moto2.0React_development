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
import TestCompo from "../Pages/NuralCustomComponents/TestCompo.jsx";
import Transactions from "../Pages/Master/Transaction/Transactions";
import PrimaryTransactionUpload from "../Pages/Master/Transaction/PrimaryTransactionUpload";
import IspUpload from "../Pages/Master/Isp/IspUpload";
import AddIsp from "../Pages/Master/Isp/AddIsp";
import AddAgancy from "../Pages/Master/ManageAgency/Addagency";
import Pricemaster from "../Pages/Master/PriceMaster/Pricemaster";
import Reports from "../Pages/Master/Reports/Reports";
import SaleReports from "../Pages/Master/Reports/SaleReports";
import RetailerExcel from "../Pages/Master/SalesChannel/RetailerExcel";

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
import CompetitonSalesReport from "../Pages/Master/Reports/CompetitonSalesReport";
import ViewAttendanceReport from "../Pages/Master/Reports/ViewAttendanceReport";
import PriceBand from "../Pages/Master/Competiton/PriceBand";
import Brand from "../Pages/Master/Competiton/Brand";

import Category from "../Pages/Master/Competiton/Category";
import CompModel from "../Pages/Master/Competiton/CompModel";
import CompUpload from "../Pages/Master/Competiton/CompUpload";

import PrimaryToTertiary from "../Pages/Master/Reports/PrimaryToTertiary";

import ViewSalesChannelStockSB from "../Pages/Master/Reports/ViewSalesChannelStockSB";
import StockAdjustUpload from "../Pages/Master/Reports/StockAdjustUpload";
import UnblockFinance from "../Pages/Master/Reports/UnblockFinance";
import Module from "../Pages/Master/Module/Module";
import LeaveType from "../Pages/Master/Attendance/LeaveType";
import LeaveAllocation from "../Pages/Master/Attendance/LeaveAllocation";
import Manage from "../Pages/Master/Attendance/Manage";
import City from "../Pages/Master/Geography/city";
import StockAdjustmentReport from "../Pages/Master/Reports/StockAdjustmentReport";
import SalesMan from "../Pages/Master/People/SalesMan";
import AddOrganisation from "../Pages/Master/People/AddOrganisation";
import UserLaggards from "../Pages/Master/Reports/UserLaggards";
import OrganisationHierarchyReport from "../Pages/Master/Reports/OrganisationHierarchyReport";
import Color from "../Pages/Master/Product/Color";
import L1L2Issue from "../Pages/Master/Module/Brand/L1L2Issue";
import ProductBulkUpload from "../Pages/Master/Product/ProductBulkUpload";

import MasterSetting from "../Pages/Master/MasteSetting";
import LeaveReport from "../Pages/Master/Reports/LeaveReport";
import State from "../Pages/Master/Geography/State";
import GeographyBulkUpload from "../Pages/Master/Geography/GeographyBulkUpload";
import ViewAgency from "../Pages/Master/ManageAgency/ViewAgency";
import SalesChannelView from "../Pages/Master/SalesChannel/SalesChannelView";
import RetailerView from "../Pages/Master/SalesChannel/RetailerView";
import SAPIntegiration from "../Pages/Master/Others/SAPIntegiration";
import IntermediarySale from "../Pages/Master/Transaction/IntermediarySale";
import SecondarySaleReturn from "../Pages/Master/Transaction/SecondrySaleReturn";
import IntermediarySaleReturn from "../Pages/Master/Transaction/IntermediarySaleReturn";
import { ChangePassword } from "../Pages/Auth/ChangePassword";
import { RankingWeightageCreate } from "../Pages/Master/People/RankingWeightageCreate";
import RegingtonUpload from "../Pages/Master/Reports/RedingtonUpload";
import PrimarySaleReturn from "../Pages/Master/Transaction/PrimarySaleReturn";
import DownloadStockReport from "../Pages/Master/Reports/DownloadStockReport";
import Banner from "../Pages/Master/Organization/Announcement/Banner";
import L1L2IssueReport from "../Pages/Master/Retail/L1L2IssueReport";
import AInorms from "../Pages/Master/Module/Inventory/AInorms";
import StockAdjustmentReason from "../Pages/Master/Module/Inventory/StockAdjustmentReason";
import Grn from "../Pages/Master/Module/Inventory/Grn";
import FinanceApiBlock from "../Pages/Master/Module/Finance/FinanceApiBlock";
import ServifyOffer from "../Pages/Master/Module/Finance/ServifyOffer";
import LnDCategory from "../Pages/Master/Module/L&D/LnDCategory";
import DemoCat from "../Pages/Master/Module/Brand/DemoCat";
import MezAudit from "../Pages/Master/Module/Brand/MezAudit";
import IspAudit from "../Pages/Master/Module/Brand/IspAudit";
import VisibilityAudit from "../Pages/Master/Module/Brand/VisibilityAudit";
import StoreOps from "../Pages/Master/Module/Brand/StoreOps";
import Organization from "../Pages/Master/Organization/Organization";
import Bulletin from "../Pages/Master/Organization/Bulletin/Bulletin";
import PAN from "../Pages/Master/Organization/CompanyInfo/PAN";
import GST from "../Pages/Master/Organization/CompanyInfo/GST";
import Registration from "../Pages/Master/Organization/CompanyInfo/Registration";
import CIN from "../Pages/Master/Organization/CompanyInfo/CIN";
import Country from "../Pages/Master/Geography/Country";
import Region from "../Pages/Master/Geography/Region";
import Area from "../Pages/Master/Geography/Area";
import RolesEntity from "../Pages/Master/Organization/Hierarchy/RolesEntity";
import TeamRoles from "../Pages/Master/Organization/Hierarchy/TeamRoles";
import Reporting from "../Pages/Master/Organization/Hierarchy/Reporting";
import Relations from "../Pages/Master/Organization/Hierarchy/Relations";
import View from "../Pages/Master/Organization/Hierarchy/View";
import QCategory from "../Pages/Master/Organization/Query/QCategory";
import QMapping from "../Pages/Master/Organization/Query/QMapping";

import HoDashboard from "../Pages/Dashboard/HoDashboard";
import RATDashboard from "../Pages/Dashboard/RATDashboard.jsx";
import ChannelsDashBoard from "../Pages/Dashboard/ChannelsDashBoard.jsx";
import RATChannelDashBoard from "../Pages/Dashboard/RATChannelDasboard.jsx";
import AvailabilityDashboard from "../Pages/Dashboard/AvailabilityDashboard.jsx";
import RATAvailability from "../Pages/Dashboard/RATAvailability.jsx";

import InventoryDashBoard from "../Pages/Dashboard/InventoryDashboard.jsx";
import RATInventory from "../Pages/Dashboard/RATInventory.jsx";
import RATAttendance from "../Pages/Dashboard/RATAttendance.jsx";

import RATTarget from "../Pages/Dashboard/RATTarget.jsx";
import RATIncentive from "../Pages/Dashboard/RATIncentive.jsx";
// import RATInventory from "../Pages/NuralCustomComponents/DashboardWidgets/RATInventory.jsx";

import AttendanceUpload from "../Pages/Master/Attendance/AttendanceUpload.jsx";
import BalanceLeaveBulk from "../Pages/Master/Attendance/BalanceLeaveBulk.jsx";
import AuditReport from "../Pages/Master/Retail/AuditReport.jsx";
import WebMenuMapping from "../Pages/Master/AppsSetting/WebMenuMapping.jsx";
import MobileMenuMapping from "../Pages/Master/AppsSetting/MobileMenuMapping.jsx";

import ReddingtonUpload from "../Pages/Master/Reddington/ReddingtonUpload.jsx";

import ReportQueue from "../Pages/Master/Reports/ReportQueue.jsx";
import DemoConversion from "../Pages/Master/Others/DemoConversion.jsx";
import StoreReports from "../Pages/Master/Reports/StoreReports.jsx";
import IspApproval from "../Pages/Master/Isp/IspApproval.jsx";
import PreBookingReport from "../Pages/Master/Reports/PreBookingReport.jsx";
import MerchandizingReport from "../Pages/Master/Reports/MerchandizingReport.jsx";
import RankingReport from "../Pages/Master/Reports/RankingReport.jsx";
import ManageAudit from "../Pages/Master/Module/Brand/ManageAudit.jsx";
import FocusModel from "../Pages/Master/Product/FocusModel.jsx";
import RIAuditScore from "../Pages/Master/Module/Brand/RIAuditScore.jsx";
import DemoConversionList from "../Pages/Master/Others/DemoConversionList.jsx";

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
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ho-dashboard" element={<HoDashboard />} />
        <Route path="/rat-dashboard" element={<RATDashboard />} />
        <Route path="/rat-attendance" element={<RATAttendance />} />
        <Route path="/rat-incentive" element={<RATIncentive />} />
        <Route path="/rat-target" element={<RATTarget />} />
        <Route path="/channels-dashboard" element={<ChannelsDashBoard />} />
        <Route path="/inventory-dashboard" element={<InventoryDashBoard />} />
        <Route path="/rat-inventory-dashboard" element={<RATInventory />} />
        <Route
          path="/rat-channel-dashboard"
          element={<RATChannelDashBoard />}
        />
        <Route
          path="/availability-dashboard"
          element={<AvailabilityDashboard />}
        />
      </Route>
      <Route path="/rat-availability" element={<RATAvailability />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/settings" element={<MasterSetting />} />
        <Route path="/transaction" element={<Transactions />} />
        <Route
          path="/primary-transaction"
          element={<PrimaryTransactionUpload />}
        />
        <Route path="/intermediary-sale" element={<IntermediarySale />} />
        <Route
          path="/secondary-sale-return"
          element={<SecondarySaleReturn />}
        />
        <Route path="/product" element={<Product />} />
        <Route path="/target" element={<Target />} />
        <Route path="/view-target" element={<ViewTarget />} />
        <Route path="/price" element={<Pricemaster />} />
        <Route path="/add-agancy" element={<AddAgancy />} />
        <Route path="/search-agancy" element={<ViewAgency />} />
        <Route path="/isp-upload" element={<IspUpload />} />
        <Route path="/add-isp" element={<AddIsp />} />

        <Route path="/isp-approval" element={<IspApproval />} />
        <Route path="/view-retailer" element={<RetailerView />} />
        <Route path="/sales-bulk-upload" element={<SalesBulkUpload />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/primary-to-tertiary" element={<PrimaryToTertiary />} />
        <Route path="/sales-report" element={<SaleReports />} />
        <Route path="/retailer-excelUpload" element={<RetailerExcel />} />
        <Route path="/sales-channel-view" element={<SalesChannelView />} />
        <Route path="/sap-integration" element={<SAPIntegiration />} />
        <Route path="/add-retailer" element={<AddRetailer />} />
        <Route path="/add-sales-channel" element={<AddSalesChannel />} />
        <Route path="/sales-excel" element={<SalesExcel />} />
        <Route path="/isp-sales-report" element={<IspSaleReport />} />
        <Route path="/counter-share-report" element={<CounterShareReport />} />
        <Route
          path="/competition-sales-report"
          element={<CompetitonSalesReport />}
        />
        <Route
          path="/view-attendance-report"
          element={<ViewAttendanceReport />}
        />
        <Route path="/leave-report" element={<LeaveReport />} />
        <Route
          path="/stock-adjustment-upload"
          element={<StockAdjustmentUpload />}
        />
        <Route
          path="/stock-adjustment-report"
          element={<StockAdjustmentReport />}
        />
        <Route path="/pre-booking-report" element={<PreBookingReport />} />
        <Route path="/merchandizing-report" element={<MerchandizingReport />} />
        <Route path="/ranking-report" element={<RankingReport />} />

        <Route path="/attendance-upload" element={<AttendanceUpload />} />
        <Route path="/balance-leave-bulk" element={<BalanceLeaveBulk />} />
        <Route
          path="/activation-file-received"
          element={<ActivationFileRecieved />}
        />
        <Route
          path="/intermediary-sale-return"
          element={<IntermediarySaleReturn />}
        />
        <Route path="/ranking-weightage" element={<RankingWeightageCreate />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/sub-category" element={<SubCategory />} />
        <Route
          path="/prebooking-sku-create"
          element={<PrebookingSKUcreate />}
        />
        <Route path="/prebooking-sku-view" element={<PrebookingSKUview />} />
        <Route path="/create-scheme" element={<CreateScheme />} />
        <Route path="/view-scheme" element={<ViewScheme />} />
        <Route path="/sku" element={<SKU />} />
        <Route path="/model" element={<Model />} />
        <Route path="/focus-model" element={<FocusModel />} />
        <Route path="/city" element={<City />} />
        <Route path="/state" element={<State />} />
        <Route path="/country" element={<Country />} />
        <Route path="/region" element={<Region />} />
        <Route path="/area" element={<Area />} />
        <Route
          path="/geography-bulk-upload"
          element={<GeographyBulkUpload />}
        />
        <Route path="/reddington-bulk-upload" element={<ReddingtonUpload />} />
        <Route path="/competition-brand" element={<Brand />} />
        <Route path="/competition-category" element={<Category />} />
        <Route path="/competition-model" element={<CompModel />} />
        <Route path="/product-bulk-upload" element={<ProductBulkUpload />} />
        <Route path="/color" element={<Color />} />
        <Route path="/l1l2-issue" element={<L1L2Issue />} />
        <Route path="/competiton-upload" element={<CompUpload />} />
        <Route path="/competition-price-band" element={<PriceBand />} />
        <Route path="/serial-no-moment" element={<SerialNoMoment />} />
        <Route
          path="/view-sales-channel-stock-sb"
          element={<ViewSalesChannelStockSB />}
        />
        <Route path="/stock-adjust-upload" element={<StockAdjustUpload />} />
        <Route path="/unblock-finance" element={<UnblockFinance />} />
        <Route path="/module" element={<Module />} />
        <Route path="/leave-type" element={<LeaveType />} />
        <Route path="/leave-allocation" element={<LeaveAllocation />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/create-salesman" element={<SalesMan />} />
        <Route path="/redington-file" element={<RedingtonFile />} />
        <Route path="/demo-conversion" element={<DemoConversion />} />
        <Route path="/demo-conversion-list" element={<DemoConversionList />} />

        <Route path="/secondary-sale" element={<SecondarySale />} />
        <Route path="/sales-channel-stock" element={<SalesChannelStockSB />} />
        <Route path="/user-laggards" element={<UserLaggards />} />
        <Route
          path="/org-hierarchy-mapping-report"
          element={<OrganisationHierarchyReport />}
        />
        <Route path="/org-people" element={<AddOrganisation />} />
        <Route path="/redington-upload" element={<RegingtonUpload />} />
        <Route path="/primary-sale-return" element={<PrimarySaleReturn />} />
        <Route
          path="/download-stock-report"
          element={<DownloadStockReport />}
        />
        <Route path="/rel-store-reports" element={<StoreReports />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/l1l2-issue-report" element={<L1L2IssueReport />} />
        <Route path="/audit-report" element={<AuditReport />} />
        <Route path="/manage-audit" element={<ManageAudit />} />

        <Route path="/ai-norms" element={<AInorms />} />
        <Route
          path="/stock-adjustment-reason"
          element={<StockAdjustmentReason />}
        />
        <Route path="/grn" element={<Grn />} />

        <Route path="/report-queue" element={<ReportQueue />} />
        <Route path="/finance-api-block" element={<FinanceApiBlock />} />
        <Route path="/servify-offer" element={<ServifyOffer />} />

        <Route path="/lnd-category" element={<LnDCategory />} />

        <Route path="/demo-categorization" element={<DemoCat />} />

        <Route path="/mez-audit" element={<MezAudit />} />
        <Route path="/isp-audit" element={<IspAudit />} />
        <Route path="/visibility-audit" element={<VisibilityAudit />} />
        <Route path="/store-ops" element={<StoreOps />} />
        <Route path="/riaudit-score" element={<RIAuditScore />} />

        <Route path="/organization" element={<Organization />} />

        <Route path="/bulletin" element={<Bulletin />} />

        <Route path="/pan" element={<PAN />} />
        <Route path="/gst" element={<GST />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/cin" element={<CIN />} />

        <Route path="/roles-entity" element={<RolesEntity />} />
        <Route path="/team-roles" element={<TeamRoles />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/relations" element={<Relations />} />
        <Route path="/view" element={<View />} />

        <Route path="/q-category" element={<QCategory />} />
        <Route path="/q-mapping" element={<QMapping />} />
        <Route path="/web-menu-setting" element={<WebMenuMapping />} />
        <Route path="/mobile-menu-setting" element={<MobileMenuMapping />} />
      </Route>

      {/* Default and Not Found Routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AllRoutes;
