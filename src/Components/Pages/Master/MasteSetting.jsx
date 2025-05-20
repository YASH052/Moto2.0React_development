import { Grid } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../Common/BreadcrumbsHeader";
import TransationCard from "./Transaction/TransationCard";

const appSettingsTypes = [
  { title: "WEB", link: "/web-menu-setting" },
  { title: "MOBILE", link: "/mobile-menu-setting" },
];

const helpTypes = [
  { title: "FEEDBACK", link: "#" },
  { title: "TUTORIAL", link: "#" },
  { title: "PRODUCT DOCUMENTATION", link: "#" },
];

const organizationTypes = [
  { title: "COMPANY INFO", link: "#" },
  { title: "AGENCY", link: "/add-agancy" },
  { title: "GEOGRAPHY", link: "/geography-bulk-upload" },
  { title: "ANNOUNCEMENT", link: "/banner" },
  { title: "HIERARCHY", link: "/org-people" },
  { title: "QUERY", link: "#" },
];

const channelTypes = [
  { title: "CHANNEL", link: "/add-sales-channel" },
  { title: "RETAILER", link: "/add-retailer" },
];

const peopleTypes = [
  { title: "ORG PEOPLE", link: "/org-people" },
  { title: "ISP", link: "/add-isp" },
  { title: "RANKING WEIGHTAGE", link: "/ranking-weightage" },
  { title: "SEARCH", link: "/search" },
  { title: "SALESMAN", link: "/create-salesman" },
];

const productTypes = [
  { title: "BRAND", link: "/brand" },
  { title: "CATEGORY", link: "/category" },
  { title: "SUB CATEGORY", link: "/sub-category" },
  { title: "MODEL", link: "/model" },
  { title: "COLOR", link: "/color" },
  { title: "SKU", link: "/sku" },
  // { title: "FOCUS MODEL", link: "/focus-model" },
  // { title: "PRICE", link: "/create-price" },
  // { title: "PRE BOOKING", link: "/prebooking-sku-create" },
  // { title: "UPLOAD", link: "/product-bulk-upload" },
];

const moduleTypes = [
  { title: "INVENTORY", link: "/grn" },
  { title: "FINANCE", link: "/unblock-finance" },
  { title: "ATTENDANCE", link: "/view-attendance-report" },
  { title: "MERCHANDIZING", link: "/merchandizing-report" },
  { title: "COMPETITION", link: "/competiton-upload" },
  { title: "L & D", link: "/lnd" },
  // { title: "BRAND", link: "/l1l2-issue" },
];

const reportTypes = [
  { title: "SALES REPORT", link: "/sales-report" },
  { title: "ISP SALES REPORT", link: "/isp-sales-report" },
  { title: "UNIQUE SALES REPORT", link: "/unique-sales-report" },
  { title: "PRIMARY TO TERTIARY TRACK", link: "/primary-tertiary-track" },
  { title: "COMPETITION SALES REPORT", link: "/competition-sales-report" },
  { title: "COUNTER SHARE REPORT", link: "/counter-share-report" },
 


];

const MasterSetting = () => {
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          paddingBottom: 1,
        }}
      >
        <Grid item xs={12} mt={0} mb={0} ml={1} pr={3}>
          <BreadcrumbsHeader pageTitle="Settings" />
        </Grid>
      </Grid>

      <Grid container spacing={0} p={1}>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={appSettingsTypes} title="App Settings" isClickable={false} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={helpTypes} title="Help" isClickable={false} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={organizationTypes} title="Organization" isClickable={true} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={channelTypes} title="Channel" isClickable={false} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={peopleTypes} title="People" isClickable={false} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={productTypes} title="Product" isClickable={false} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={moduleTypes} title="Module" isClickable={true} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={reportTypes} title="Reports" isClickable={true} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MasterSetting;
