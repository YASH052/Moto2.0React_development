import { Grid, Typography, Button, Stack, Paper, Box } from "@mui/material";
import React from "react";
import ISPZeroSaleTable from "./ISPZeroSaleTable";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";
import BreadcrumbsHeader from "../../Common/BreadcrumbsHeader";
import TabsBar from "../../Common/TabsBar";
import NuralAccordion2 from "../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../NuralCustomComponents/NuralCalendar";
import NuralButton from "../NuralCustomComponents/NuralButton";
import NuralTextButton from "../NuralCustomComponents/NuralTextButton";
import SalesTrendGraph from "../NuralCustomComponents/DashboardWidgets/SalesTrendGraph";
import TargetAchievement from "../NuralCustomComponents/DashboardWidgets/TargetAchievement";
import AttendanceChart from "../NuralCustomComponents/DashboardWidgets/AttendanceChart.jsx";
import AttendanceCard from "../NuralCustomComponents/DashboardWidgets/AttendanceCard.jsx";
import CounterShare from "../NuralCustomComponents/DashboardWidgets/CounterShare";
import {
  weeklyData,
  monthlyData,
  yearlyData,
  rankings,
} from "../NuralCustomComponents/TestCompo.jsx";

import SalesMetricsGrid from "../NuralCustomComponents/DashboardWidgets/SalesMetricsGrid";
import RankingNSM from "../NuralCustomComponents/DashboardWidgets/RankingNSM.jsx";
import RankingCard from "../NuralCustomComponents/DashboardWidgets/RankingCard.jsx";

import FocusModelPerformance from "../../Common/NuralCustomComponents/DashboardWidgets/FocusModelPerformance.jsx";
import DistributorInventoryChart from "../NuralCustomComponents/DashboardWidgets/DistributorInventoryChart.jsx";
import styled from "styled-components";
import RetailerSalesChart from "../NuralCustomComponents/DashboardWidgets/RetailerSalesChart.jsx";
import GraphWithTable from "../NuralCustomComponents/DashboardWidgets/GraphWithTable.jsx";
import AttendanceChartWithData from "../NuralCustomComponents/DashboardWidgets/AttendanceChartwithData.jsx";
import SalesDonutChart from "../NuralCustomComponents/DashboardWidgets/SalesDonutChart.jsx";
import TargetChart from "../NuralCustomComponents/DashboardWidgets/TargetChart.jsx";
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
const RATTarget = () => {
  const [activeTab, setActiveTab] = React.useState("target");

  const tabs = [
    { label: "Business", value: "business" },
    { label: "Channels", value: "channels" },
    { label: "Availability", value: "availability" },

    { label: "Brand", value: "brand" },
    { label: "Attendance", value: "attendance" },
    { label: "Inventory", value: "inventory" },
    { label: "Target", value: "target" },
    { label: "Incentive", value: "incentive" },
  ];
   const tabRoutes = {
     business: "/business-dashboard",
     channels: "/channel-performance",
     availability: "/availability-overview",
     attendance: "/rat-attendance",
     inventory: "/rat-inventory-dashboard",
     brand: "/brand-monitor",
     target: "/rat-target",
     incentive: "/rat-incentive",
   };
   const handleTabChange = (newValue) => {
     setActiveTab(newValue);
     const route = tabRoutes[newValue];
     if (route) {
       navigate(route);
     }
   };
   {
     tabs.map((tab) => (
       <Button
         key={tab.value}
         variant={activeTab === tab.value ? "contained" : "outlined"}
         onClick={() => handleTabChange(tab.value)}
       >
         {tab.label}
       </Button>
     ));
   }
  const dataCards = [
    {
      title: "Total Volume",
      value: "930/1500 Units",
      subText: "62% OF TARGET",
    },
    {
      title: "Monthly Volume",
      value: "930/1500 Units",
      subText: "62% OF TARGET",
    },
    {
      title: "Total Value",
      value: "₹2.6L/4.5L",
      subText: "58% OF TARGET",
    },
    {
      title: "Monthly Value",
      value: "₹2.6L/4.5L",
      subText: "58% OF TARGET",
    },
  ];
  const autocompleteOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
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
 
  const CenterText = styled("div")({
    position: "absolute",
    top: "50%",
    left: "45%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    "& h2": {
      margin: 0,
      fontSize: "24px",
      fontWeight: "bold",
      color: DARK_PURPLE,
    },
    "& p": {
      margin: 0,
      fontSize: "12px",
      color: DARK_PURPLE,
      opacity: 0.7,
    },
  });

  return (
    <>
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
                      label="All ASM"
                      options={options}
                      placeholder="ALL ASM"
                      backgroundColor={WHITE}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="ALL TSM"
                      options={options}
                      backgroundColor={WHITE}
                      placeholder="ALL TSM"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="ALL ISP"
                      options={options}
                      backgroundColor={WHITE}
                      placeholder="ALL ISP"
                    />
                  </Grid>
                </Grid>

                {/* Third Row - Buttons */}
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} p={0}>
            {" "}
            <Grid container spacing={2} md={4} lg={4} xl={4} sx={{ p: 1 }}>
              {dataCards.map((card, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: "#e8edfb",
                      height: "90%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      {card.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="info.main"
                      fontWeight={500}
                    >
                      {card.subText}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={data}
                title="Sales Trend"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={2} md={2} lg={2} xl={2}>
              <Paper
                sx={{
                  marginLeft: 3,
                  backgroundColor: LIGHT_GRAY2,
                  p: 3,
                  width: "165%", // Adjust based on your layout
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Category Target
                </Typography>
                <NuralAutocomplete
                  options={autocompleteOptions}
                  getOptionLabel={(option) => option.label}
                  placeholder="Select an option"
                  marginBottom="8px"
                />
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {/* Top Row */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Target Vol
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      165
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="center"
                    >
                      Volume Achieved
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      12
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      volume %
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      15
                    </Typography>
                  </Grid>

                  {/* Bottom Row */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Target Value
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      5
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Value Ach.
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      21
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Value ACH %
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      2
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: 3 }}>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              xl={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingInlineStart: 2,
              }}
            >
              <TargetChart title="Daily Target" />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              xl={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingInlineStart: 2,
              }}
            >
              <TargetChart title="Monthly Target" />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              xl={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingInlineStart: 2,
              }}
            >
              <TargetChart title="Quarterly Target" />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              xl={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingInlineStart: 2,
                paddingInlineEnd: 2,
              }}
            >
              <TargetChart title="Yearly Target" />
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <ISPZeroSaleTable />
            </Grid>
          </Grid>
        
        </Grid>
      </Grid>
    </>
  );
};

export default RATTarget;
