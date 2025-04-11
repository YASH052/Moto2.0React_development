import { Grid, Typography, Button, Stack } from "@mui/material";
import React from "react";

import {
  AQUA,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
  WHITE_COLOR,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../Common/TabsBar";

import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import NuralDistributorSales from "../NuralCustomComponents/NuralDistributorSales";
import DistributorInventoryChart from "../NuralCustomComponents/DashboardWidgets/DistributorInventoryChart";
import ProductSalesChart from "../NuralCustomComponents/DashboardWidgets/ProductSalesChart";
import RetailerSalesChart from "../NuralCustomComponents/DashboardWidgets/RetailerSalesChart";
import ISPZeroSaleTable from "./ISPZeroSaleTable";
import GraphWithTable from "../NuralCustomComponents/DashboardWidgets/GraphWithTable";
import DistributorInventoryChart2 from "../NuralCustomComponents/DashboardWidgets/DistributerInventoryChart2";
const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];
const salesMetrics = [
  {
    title: "Yesterday Sales",
    value: "₹14,200",
    trend: 5.2,
    comparedTo: "VS PREV. DAY",
    backgroundColor: "#F8F7FF",
  },

  {
    title: "MTD Sales",
    value: "₹2,85,400",
    trend: -12.3,
    comparedTo: "VS PREV. MONTH",
    backgroundColor: "#F8F7FF",
  },
  {
    title: "YTD Sales",
    value: "₹14.85Cr",
    trend: -2.7,
    comparedTo: "VS PREV. YEAR",
    backgroundColor: "#FFF1F1",
  },
  {
    title: "ISPs Present Yesterday",
    value: "115/124",
    trend: 92,
    comparedTo: "ATTENDANCE",
    subtitle: "93% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
];
const InventoryDashBoard = () => {
  const [activeTab, setActiveTab] = React.useState("inventory");

  const tabs = [
    { label: "Business", value: "business" },
    { label: "Channels", value: "channels" },
    { label: "Availability", value: "availability" },
    { label: "Brand", value: "brand" },
    { label: "Inventory", value: "inventory" },
  ];
  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination

  // Replace the existing dummy data with this more realistic data

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",

          // pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
        }}
      >
        {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
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
            <Grid item xs={12} md={12} lg={12} mt={2}>
              <Stack direction="row" spacing={0}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "28px",
                    letterSpacing: "0%",
                  }}
                  color={DARK_PURPLE}
                >
                  Good Afternoon Name Surname
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "100%",
                    letterSpacing: "4%",
                    textTransform: "uppercase",
                    color: SECONDARY_BLUE,
                    m: 1,
                  }}
                >
                  LAST LOGIN : 120:05 PM, 20 MARCH 2025
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Rest of the content */}
        <Grid
          container
          spacing={0}
          lg={12}
          mt={1}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={0} direction="column">
              <Grid item>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="All NSM"
                      options={options}
                      placeholder="ALL NSM"
                      backgroundColor={WHITE}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="ALL RSM"
                      options={options}
                      backgroundColor={WHITE}
                      placeholder="ALL RSM"
                    />
                  </Grid>
                </Grid>

                {/* Add Product Sales Chart */}
                <Grid container spacing={4} mb={2}>
                  <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DistributorInventoryChart />
                  </Grid>
                  <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DistributorInventoryChart2 />
                  </Grid>
                  <Grid item xs={12} md={4} lg={4} xl={4}>
                    <DistributorInventoryChart />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <RetailerSalesChart />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} xl={6}>
                  <GraphWithTable/>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Grid
                      container
                      spacing={0}
                      ml={2}
                      mt={2}
                      pr={2}
                      mb={2}
                    ></Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <ISPZeroSaleTable />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <ISPZeroSaleTable />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <ISPZeroSaleTable />
                </Grid>
                {/* Add Distributor Sales Chart */}
              </Grid>
            </Grid>
          </Grid>

          {/* Add ISP Zero Sale Table */}
        </Grid>
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            marginLeft: "10px",
            fontSize: "10px",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: WHITE_COLOR,
            p: 2,
          }}
        >
          <b>NOTE:</b>
          <br></br>
          1. All Data shown here is based on Activation of Mobile Handset.
          <br></br>
          2. Primary Column = Purchase Data. <br></br>
          3. Sale Column = Month Till Date [MTD] Activation Data [Qty/Value].{" "}
          <br></br>
          4. DRR [MTD Daily Run Rate] = Activation Count/ No of Days. <br></br>
          5. LMTD [Last Month Till Date Data]. <br></br>
          6. SOH [Stock in Hand] = Primary- Activation. <br></br>
          7. WOI [Week of Inventory] = Stock on Hand [SOH]/ Daily Run Rate [DRR]
          * 7 [days].<br></br>
          8. M: Current Month ; M-1: one Month Ago; M-2:Two Months Ago ; M-3:
          Three Months Ago. <br></br>
          9. TOP 10 Product and TOP 10 Retailer Shown on the Basis of Activation
          Sale.
        </Typography>
      </Grid>
    </>
  );
};

export default InventoryDashBoard;
