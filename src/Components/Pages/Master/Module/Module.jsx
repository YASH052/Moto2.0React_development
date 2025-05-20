import { Grid } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TransationCard from "../Transaction/TransationCard";

const inventoryTypes = [
  { title: "AI NORMS", link: "/ai-norms" },
  { title: "STOCK ADJUSTMENT REASON", link: "/stock-adjustment-reason" },
  { title: "GRN", link: "/grn" },
  { title: "DEMO CONVERSION", link: "/demo-conversion" },
];

const financeTypes = [
  { title: "FINANCE API BLOCK ACCESS", link: "/finance-api-block" },
  { title: "SERVIFY OFFER", link: "/servify-offer" },
  { title: "GTN", link: "/gtn" },
  { title: "GTN PAYOUT REPORT", link: "/gtn-payout-report" },
];

const attendanceTypes = [
  { title: "LEAVE TYPE", link: "/leave-type" },
  { title: "LEAVE ALLOCATION", link: "/leave-allocation" },
  { title: "MANAGE", link: "/manage" },
];

const merchandizingTypes = [
  { title: "TASK TYPE", link: "/task-type" },
  { title: "MANAGE TASK", link: "/manage-task" },
];

const competitionTypes = [
  { title: "BRAND", link: "/competition-brand" },
  { title: "CATEGORY", link: "/competition-category" },
  { title: "MODEL", link: "/competition-model" },
  { title: "PRICE BAND", link: "/competition-price-band" },
  { title: "UPLOAD", link: "/competiton-upload" },
];

const brandTypes = [
  { title: "DEMO PLANOGRAM", link: "/demo-planogram" },
  { title: "L1/L2 ISSUE", link: "/l1l2-issue" },
  { title: "MANAGE AUDIT", link: "/manage-audit" },
  // { title: "MEZ AUDIT", link: "/mez-audit" },
  // { title: "ISP AUDIT", link: "/isp-audit" },
  // { title: "VISIBILITY AUDIT", link: "/visibility-audit" },
  // { title: "STORE OPS", link: "/store-ops" },
];

const lndTypes = [
  { title: "CATEGORY", link: "/lnd-category" },
  { title: "ASSESSMENT", link: "/lnd-assessment-report" },
];

const Module = () => {
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Module" />
        </Grid>
      </Grid>

      <Grid container spacing={0} p={1}>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={inventoryTypes} title="Inventory" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={financeTypes} title="Finance" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={attendanceTypes} title="Attendance" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard
            salesTypes={merchandizingTypes}
            title="Merchandizing"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={competitionTypes} title="Competition" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={brandTypes} title="Brand" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={lndTypes} title="L & D" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Module;
