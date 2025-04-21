import { Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";

import TransationCard from "../Transaction/TransationCard";

const salesReports = [
  { title: "SALES REPORT", link: "/sales-report" },
  { title: "ISP SALES REPORT", link: "/isp-sales-report" },
  { title: "UNIQUE SALES REPORT", link: "/unique-sales-report" },
  { title: "PRIMARY TO TERTIARY TRACK", link: "/primary-to-tertiary" },
  { title: "FOCUS MODEL REPORT", link: "/focus-model-report" },
];

const stockReports = [
  { title: "STOCK REPORT", link: "/stock-report" },
  { title: "SALESCHANNEL STOCK SB", link: "/saleschannel-stock-sb" },
  { title: "STOCK ADJUSTMENT REPORT", link: "/stock-adjustment-report" },
  { title: "SERIAL NO. MOVEMENT", link: "/serial-no-moment" },
];

const appReports = [
  { title: "L&D ASSESSMENT REPORT", link: "#" },
  { title: "FEEDBACK REPORT", link: "#" },
  { title: "MERCHANDIZING REPORT", link: "merchandizing-report" },
  { title: "SURVEY REPORT", link: "#" },
  { title: "PRE BOOKING REPORT", link: "prebooking-report" },
  { title: "RANKING REPORT", link: "/ranking-report" },
];

const retailReports = [
  { title: "DEMO AUDIT REPORT", link: "/demo-audit-report" },
  { title: "DEMO PRODUCTIVITY REPORT", link: "/demo-productivity-report" },
  { title: "L1 L2 ISSUE REPORT", link: "/l1l2-issue-report" },
  { title: "AUDIT REPORT", link: "/audit-report" },
];

const targetIncentiveReports = [
  { title: "TARGET VS ACHIEVEMENT REPORT", link: "#" },
  { title: "SCHEME REPORT", link: "/#" },
];

const miscReports = [
  { title: "ACTIVATION FILE RECEIVED", link: "/activation-file-received" },
  { title: "SAP INTEGRATION FILE", link: "/sap-integration" },
  { title: "RELIANCE API STATUS", link: "/reliance-api-status" },
  { title: "LOG REPORT", link: "/log-report" },
];

const attendanceReports = [
  { title: "ATTENDANCE REPORT", link: "/view-attendance-report" },
  { title: "LEAVE REPORT", link: "/leave-report" },
  { title: "OUT OF FENCE REPORT", link: "/out-of-fence-report" },
];

const userReports = [
  { title: "ORG HIERARCHY MAPPING REPORT", link: "/organization-hierarchy-report" },
  { title: "LAST LOGIN REPORT", link: "/last-login-report" },
  { title: "USER LAGGARD REPORT", link: "/user-laggards" },
  { title: "USER TRACK", link: "/user-track" },
  { title: "REPORT QUEUE", link: "/report-queue" },
];

const Reports = () => {


  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        mt={1}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          p: 2,
          // borderBottom: '1px solid #eee'
        }}
      >
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Reports" />
        </Grid>
      </Grid>

      <Grid container spacing={0} p={1}>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={salesReports} title="Sales" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={stockReports} title="Stock" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={appReports} title="App" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={retailReports} title="Retail" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={targetIncentiveReports} title="Target & Incentive" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={miscReports} title="Misc" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={attendanceReports} title="Attendance" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={userReports} title="User Reports" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Reports;
