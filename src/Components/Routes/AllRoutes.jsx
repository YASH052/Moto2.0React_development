import { Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import DashboardRouter from "./DashboardRouter";
import BrandDashboardRouter from "./BrandDashboardRouter";
import Dashboard from "../Pages/Dashboard/Dashboard";
import { useEffect, useState } from "react";

// Public Pages
import NotFound from "../Pages/NotFound/NotFound";
import LoginForm from "../Pages/Auth/Login/LoginForm";
import ForgotPasswordForm from "../Pages/Auth/ForgotPasswordForm";
import ResetPasswordForm from "../Pages/Auth/ResetPasswordForm";
import ManageTask from "../Pages/Master/Module/Merchandizing/ManageTask/ManageTask.jsx";
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
import UniqueSalesReport from "../Pages/Master/Reports/UniqueSalesReport";
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
import UserTracking from "../Pages/Master/Reports/UserTracking";
import UserLaggards from "../Pages/Master/Reports/UserLaggards";
import UserLastLogin from "../Pages/Master/Reports/UserLastLogin";
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
import StockReport from "../Pages/Master/Reports/StockReport";
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
import RATAttendance from "../Pages/Dashboard/attendance Dashboard/RATAttendance.jsx";

import RATTarget from "../Pages/Dashboard/RATTarget.jsx";
import RATIncentive from "../Pages/Dashboard/RATIncentive.jsx";

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


import LnDAssessmentReport from "../Pages/Master/Module/L&D/L&DAssessment/LnDAssessmentReport.jsx";
import TargetVsAchievementReport from "../Pages/Master/Reports/TargetVsAchievementReport.jsx";

import RelApiStatus from "../Pages/Master/Others/RelApiStatus.jsx";
import RATBrandDashboard from "../Pages/Dashboard/RATBrandDashboard.jsx";

import Survey from "../Pages/Master/Survey/Survey.jsx";


import FeedbackReport from "../Pages/Master/Reports/FeedbackReport.jsx";
import Gtn from "../Pages/Master/Module/Finance/Gtn.jsx";
import GTNPayoutReport from "../Pages/Master/Module/Finance/GTNPayoutReport.jsx";
import DemoAuditReport from "../Pages/Master/Retail/DemoAuditReport.jsx";


const ALL_ROUTES = (appProps = {}) => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('log');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserType(parsedData.userType);
    }
  }, []);

  return [
    // Public Routes:
    {
      element: <PublicRoute {...appProps} />,
      children: [
        { path: "/login", element: <LoginForm {...appProps} /> },
        { path: "/login1", element: <LoginFormHome {...appProps} /> },
        {
          path: "/forgot-password",
          element: <ForgotPasswordForm {...appProps} />,
        },
        { path: "/reset-password", element: <ResetPasswordForm {...appProps} /> },
        { path: "/test", element: <TestCompo {...appProps} /> },
        { path: "/change-password", element: <ChangePassword {...appProps} /> },
      ],
    },

    // Private Routes Part 1 (Dashboard related)
    {
      element: <PrivateRoute {...appProps} />,
      children: [
        { index: true, element: <DashboardRouter {...appProps} /> },
        { path: "/dashboard", element: <DashboardRouter {...appProps} /> },
        { path: "/brand-dashboard", element: <BrandDashboardRouter {...appProps} /> },
        { path: "/rat-attendance", element: <RATAttendance {...appProps} /> },
        { path: "/rat-incentive", element: <RATIncentive {...appProps} /> },
        { path: "/rat-target", element: <RATTarget {...appProps} /> },
        {
          path: "/channels-dashboard",
          element: <ChannelsDashBoard {...appProps} />,
        },
        {
          path: "/inventory-dashboard",
          element: <InventoryDashBoard {...appProps} />,
        },
        {
          path: "/rat-inventory-dashboard",
          element: <RATInventory {...appProps} />,
        },
        {
          path: "/rat-channel-dashboard",
          element: <RATChannelDashBoard {...appProps} />,
        },
        {
          path: "/availability-dashboard",
          element: <AvailabilityDashboard {...appProps} />,
        },
      ],
    },
    // Standalone RAT Availability route
    { path: "/rat-availability", element: <RATAvailability {...appProps} /> },

// <<<<<<< Development
    // Private Routes Part 2 (Settings and Master Data)
    {
      element: <PrivateRoute {...appProps} />,
      children: [
        { path: "/settings", element: <MasterSetting {...appProps} /> },
        { path: "/transaction", element: <Transactions {...appProps} /> },
        {
          path: "/primary-transaction",
          element: <PrimaryTransactionUpload {...appProps} />,
        },
        {
          path: "/intermediary-sale",
          element: <IntermediarySale {...appProps} />,
        },
        {
          path: "/secondary-sale-return",
          element: <SecondarySaleReturn {...appProps} />,
        },
        { path: "/product", element: <Product {...appProps} /> },
        { path: "/target", element: <Target {...appProps} /> },
        { path: "/view-target", element: <ViewTarget {...appProps} /> },
        { path: "/price", element: <Pricemaster {...appProps} /> },
        { path: "/add-agancy", element: <AddAgancy {...appProps} /> },
        { path: "/search-agancy", element: <ViewAgency {...appProps} /> },
        { path: "/isp-upload", element: <IspUpload {...appProps} /> },
        { path: "/add-isp", element: <AddIsp {...appProps} /> },
        { path: "/isp-approval", element: <IspApproval {...appProps} /> },
        { path: "/view-retailer", element: <RetailerView {...appProps} /> },
        {
          path: "/sales-bulk-upload",
          element: <SalesBulkUpload {...appProps} />,
        },
        { path: "/reports", element: <Reports {...appProps} /> },
        {
          path: "/primary-to-tertiary",
          element: <PrimaryToTertiary {...appProps} />,
        },
        { path: "/sales-report", element: <SaleReports {...appProps} /> },
        {
          path: "/retailer-excelUpload",
          element: <RetailerExcel {...appProps} />,
        },
        {
          path: "/sales-channel-view",
          element: <SalesChannelView {...appProps} />,
        },
        { path: "/sap-integration", element: <SAPIntegiration {...appProps} /> },
        { path: "/rel-api-status", element: <RelApiStatus {...appProps} /> },
        { path: "/add-retailer", element: <AddRetailer {...appProps} /> },
        {
          path: "/add-sales-channel",
          element: <AddSalesChannel {...appProps} />,
        },
        { path: "/sales-excel", element: <SalesExcel {...appProps} /> },
        { path: "/isp-sales-report", element: <IspSaleReport {...appProps} /> },
        {
          path: "/counter-share-report",
          element: <CounterShareReport {...appProps} />,
        },
        {
          path: "/competition-sales-report",
          element: <CompetitonSalesReport {...appProps} />,
        },
        {
          path: "/view-attendance-report",
          element: <ViewAttendanceReport {...appProps} />,
        },
        { path: "/leave-report", element: <LeaveReport {...appProps} /> },
        {
          path: "/stock-adjustment-upload",
          element: <StockAdjustmentUpload {...appProps} />,
        },
        {
          path: "/stock-adjustment-report",
          element: <StockAdjustmentReport {...appProps} />,
        },
        {
          path: "/pre-booking-report",
          element: <PreBookingReport {...appProps} />,
        },
        {
          path: "/merchandizing-report",
          element: <MerchandizingReport {...appProps} />,
        },
        { path: "/ranking-report", element: <RankingReport {...appProps} /> },
        {
          path: "/attendance-upload",
          element: <AttendanceUpload {...appProps} />,
        },
        {
          path: "/balance-leave-bulk",
          element: <BalanceLeaveBulk {...appProps} />,
        },
        {
          path: "/activation-file-received",
          element: <ActivationFileRecieved {...appProps} />,
        },
        {
          path: "/intermediary-sale-return",
          element: <IntermediarySaleReturn {...appProps} />,
        },
        {
          path: "/ranking-weightage",
          element: <RankingWeightageCreate {...appProps} />,
        },
        { path: "/brand", element: <BrandPage {...appProps} /> },
        { path: "/category", element: <CategoryPage {...appProps} /> },
        { path: "/sub-category", element: <SubCategory {...appProps} /> },
        {
          path: "/prebooking-sku-create",
          element: <PrebookingSKUcreate {...appProps} />,
        },
        {
          path: "/prebooking-sku-view",
          element: <PrebookingSKUview {...appProps} />,
        },
        { path: "/create-scheme", element: <CreateScheme {...appProps} /> },
        { path: "/view-scheme", element: <ViewScheme {...appProps} /> },
        { path: "/sku", element: <SKU {...appProps} /> },
        { path: "/model", element: <Model {...appProps} /> },
        { path: "/focus-model-report", element: <FocusModel {...appProps} /> },
        { path: "/city", element: <City {...appProps} /> },
        { path: "/state", element: <State {...appProps} /> },
        { path: "/country", element: <Country {...appProps} /> },
        { path: "/region", element: <Region {...appProps} /> },
        { path: "/area", element: <Area {...appProps} /> },
        {
          path: "/geography-bulk-upload",
          element: <GeographyBulkUpload {...appProps} />,
        },
        {
          path: "/reddington-bulk-upload",
          element: <ReddingtonUpload {...appProps} />,
        },
        { path: "/competition-brand", element: <Brand {...appProps} /> },
        { path: "/competition-category", element: <Category {...appProps} /> },
        { path: "/competition-model", element: <CompModel {...appProps} /> },
        {
          path: "/product-bulk-upload",
          element: <ProductBulkUpload {...appProps} />,
        },
        { path: "/color", element: <Color {...appProps} /> },
        { path: "/l1l2-issue", element: <L1L2Issue {...appProps} /> },
        { path: "/competiton-upload", element: <CompUpload {...appProps} /> },
        { path: "/competition-price-band", element: <PriceBand {...appProps} /> },
        { path: "/serial-no-moment", element: <SerialNoMoment {...appProps} /> },
        {
          path: "/view-sales-channel-stock-sb",
          element: <ViewSalesChannelStockSB {...appProps} />,
        },
        {
          path: "/stock-adjust-upload",
          element: <StockAdjustUpload {...appProps} />,
        },
        { path: "/unblock-finance", element: <UnblockFinance {...appProps} /> },
        { path: "/module", element: <Module {...appProps} /> },
        { path: "/leave-type", element: <LeaveType {...appProps} /> },
        { path: "/leave-allocation", element: <LeaveAllocation {...appProps} /> },
        { path: "/manage", element: <Manage {...appProps} /> },
        { path: "/create-salesman", element: <SalesMan {...appProps} /> },
        { path: "/redington-file", element: <RedingtonFile {...appProps} /> },
        { path: "/demo-conversion", element: <DemoConversion {...appProps} /> },
        {
          path: "/demo-conversion-list",
          element: <DemoConversionList {...appProps} />,
        },
        { path: "/secondary-sale", element: <SecondarySale {...appProps} /> },
        {
          path: "/sales-channel-stock",
          element: <SalesChannelStockSB {...appProps} />,
        },
        { path: "/user-laggards", element: <UserLaggards {...appProps} /> },
        {
          path: "/org-hierarchy-mapping-report",
          element: <OrganisationHierarchyReport {...appProps} />,
        },
        { path: "/org-people", element: <AddOrganisation {...appProps} /> },
        { path: "/redington-upload", element: <RegingtonUpload {...appProps} /> },
        {
          path: "/primary-sale-return",
          element: <PrimarySaleReturn {...appProps} />,
        },
        {
          path: "/download-stock-report",
          element: <DownloadStockReport {...appProps} />,
        },
        { path: "/rel-store-reports", element: <StoreReports {...appProps} /> },
        { path: "/banner", element: <Banner {...appProps} /> },
        {
          path: "/l1l2-issue-report",
          element: <L1L2IssueReport {...appProps} />,
        },
        { path: "/audit-report", element: <AuditReport {...appProps} /> },
        { path: "/manage-audit", element: <ManageAudit {...appProps} /> },
        { path: "/ai-norms", element: <AInorms {...appProps} /> },
        {
          path: "/stock-adjustment-reason",
          element: <StockAdjustmentReason {...appProps} />,
        },
        { path: "/grn", element: <Grn {...appProps} /> },
        { path: "/report-queue", element: <ReportQueue {...appProps} /> },
        {
          path: "/finance-api-block",
          element: <FinanceApiBlock {...appProps} />,
        },
        { path: "/servify-offer", element: <ServifyOffer {...appProps} /> },
        { path: "/lnd-category", element: <LnDCategory {...appProps} /> },
        {
          path: "/lnd-assessment-report",
          element: <LnDAssessmentReport {...appProps} />,
        },
        { path: "/demo-planogram", element: <DemoCat {...appProps} /> },
        { path: "/mez-audit", element: <MezAudit {...appProps} /> },
        { path: "/isp-audit", element: <IspAudit {...appProps} /> },
        { path: "/visibility-audit", element: <VisibilityAudit {...appProps} /> },
        { path: "/store-ops", element: <StoreOps {...appProps} /> },
        { path: "/ri-weightage", element: <RIAuditScore {...appProps} /> },
        { path: "/organization", element: <Organization {...appProps} /> },
        { path: "/bulletin", element: <Bulletin {...appProps} /> },
        { path: "/pan", element: <PAN {...appProps} /> },
        { path: "/gst", element: <GST {...appProps} /> },
        { path: "/registration", element: <Registration {...appProps} /> },
        { path: "/cin", element: <CIN {...appProps} /> },
        { path: "/roles-entity", element: <RolesEntity {...appProps} /> },
        { path: "/team-roles", element: <TeamRoles {...appProps} /> },
        { path: "/reporting", element: <Reporting {...appProps} /> },
        { path: "/relations", element: <Relations {...appProps} /> },
        { path: "/view", element: <View {...appProps} /> },
        { path: "/q-category", element: <QCategory {...appProps} /> },
        { path: "/q-mapping", element: <QMapping {...appProps} /> },
        { path: "/web-menu-setting", element: <WebMenuMapping {...appProps} /> },
        {
          path: "/mobile-menu-setting",
          element: <MobileMenuMapping {...appProps} />,
        },
        {
          path: "/target-vs-achievement-report",
          element: <TargetVsAchievementReport {...appProps} />,
        },
        { path: "/survey", element: <Survey {...appProps} /> },
        {
          path: "/feedback-report",
          element: <FeedbackReport {...appProps} />,
        },
        {
          path: "/merchandizing-report",
          element: <MerchandizingReport {...appProps} />,
        },
   {
          path: "/unique-sales-report",
          element: <UniqueSalesReport {...appProps} />,
        },	
        { path: "/user-lastlogin", element: <UserLastLogin {...appProps} /> },
        { path: "/user-tracking", element: <UserTracking {...appProps} /> },
        { path: "/gtn", element: <Gtn {...appProps} /> },
        { path: "/gtn-payout-report", element: <GTNPayoutReport {...appProps} /> },
        { path: "/demo-audit-report", element: <DemoAuditReport {...appProps} /> },
      ],
    },


    // Default and Not Found Routes
    { path: "/404", element: <NotFound {...appProps} /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ];
};

export default ALL_ROUTES;
