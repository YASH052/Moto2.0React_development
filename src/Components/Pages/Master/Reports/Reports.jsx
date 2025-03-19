import { Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import { DARK_PURPLE } from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";
import TransationCard from "../Transaction/TransationCard";

const salesReports = [
  { title: "SALES REPORT", link: "/sales-report" },
  { title: "ISP SALES REPORT", link: "/isr-sales-report" },
  { title: "UNIQUE SALES REPORT", link: "/unique-sales-report" },
  { title: "PRIMARY TO TERTIARY TRACK", link: "/primary-tertiary-track" },
  { title: "COMPETITION SALES REPORT", link: "/competition-sales-report" },
  { title: "COUNTER SHARE REPORT", link: "/counter-share-report" },
];

const stockReports = [
  { title: "STOCK REPORT", link: "/stock-report" },
  { title: "SALESCHANNEL STOCK SB", link: "/saleschannel-stock-sb" },
  { title: "STOCK ADJUSTMENT REPORT", link: "/stock-adjustment-report" },
  { title: "SERIAL NO. MOVEMENT", link: "/serial-no-movement" },
];

const appReports = [
  { title: "L&D ASSESSMENT REPORT", link: "/ld-assessment-report" },
  { title: "FEEDBACK REPORT", link: "/feedback-report" },
  { title: "MERCHANDIZING REPORT", link: "/merchandizing-report" },
  { title: "SURVEY REPORT", link: "/survey-report" },
  { title: "PRE BOOKING REPORT", link: "/pre-booking-report" },
];

const retailReports = [
  { title: "DEMO AUDIT REPORT", link: "/demo-audit-report" },
  { title: "FIXTURE AUDIT REPORT", link: "/fixture-audit-report" },
  { title: "VISIBILITY AUDIT REPORT", link: "/visibility-audit-report" },
  { title: "COMPETITION ASSET REPORT", link: "/competition-asset-report" },
  { title: "DEMO PRODUCTIVITY REPORT", link: "/demo-productivity-report" },
];

const targetIncentiveReports = [
  { title: "TARGET VS ACHIEVEMENT REPORT", link: "/target-achievement-report" },
  { title: "SCHEME REPORT", link: "/scheme-report" },
];

const miscReports = [
  { title: "ACTIVATION FILE RECEIVED", link: "/activation-file-received" },
  { title: "SAP INTEGRATION FILE", link: "/sap-integration-file" },
];

const attendanceReports = [
  { title: "ATTENDANCE REPORT", link: "/view-attendance-report" },
  { title: "LEAVE REPORT", link: "/leave-report" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = React.useState("primary");

  const tabs = [
    { label: "Primary", value: "primary" },
    { label: "Intermediary", value: "intermediary" },
    { label: "Secondary", value: "secondary" },
    { label: "Tertiary", value: "tertiary" },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

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
          <TransationCard
            salesTypes={targetIncentiveReports}
            title="Target & Incentive"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={miscReports} title="Misc" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={attendanceReports} title="Attendance" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Reports;
