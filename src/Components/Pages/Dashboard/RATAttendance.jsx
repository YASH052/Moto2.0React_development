import { Grid, Typography, Button, Stack, Paper } from "@mui/material";
import React from "react";
import ISPZeroSaleTable from "./ISPZeroSaleTable";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
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
import  AttendanceCard from "../NuralCustomComponents/DashboardWidgets/AttendanceCard.jsx";
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
const RATAttendance = () => {
  const [activeTab, setActiveTab] = React.useState("attendance");

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
    const route = tabRoutes[newValue];
    if (route) {
      navigate(route);
    }
  };
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
            <Grid item xs={9} md={9} lg={9} xl={9}>
              <AttendanceChart />
            </Grid>
            <Grid item xs={3} md={3} lg={3} xl={3}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  backgroundColor: LIGHT_GRAY2, // light blue background
                  p: 4,
                  marginLeft: 3,
                  marginRight: 3,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  ISP Time Analysis
                </Typography>

                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography variant="caption">AVG. CHECK-IN</Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      9:15 AM
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      AVG. CHECK-OUT
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      6:45 PM
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="caption" color="text.secondary"fontSize={10}>
                      AVG. BREAK
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      28 Mins.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={2} md={2} lg={2} xl={2}>
            <Paper
              //   elevation={3}
              sx={{
                borderRadius: 3,
                backgroundColor: LIGHT_GRAY2, // light blue background
                p: 2,
                marginLeft: 2,
                marginRight: 3,
                marginTop: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ISP Compliance
              </Typography>

              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="caption" fontSize={10}                   >
                    LATE CHECK-INS
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    3
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={10}
                  >
                    EARLY CHECK-OUTS
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    6
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={10}
                  >
                    EXTENDED BREAKS &gt; 1 HOUR
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    28 Mins.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={2} md={2} lg={2} xl={2}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                backgroundColor: LIGHT_GRAY2, // light blue background
                p: 2,
                marginLeft: 1,
                marginRight: 3,
                marginTop: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ISP Leave analysis
              </Typography>

              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="caption">AVG. Leave duration</Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    2.3 days
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="caption" color="text.secondary">
                    Leave utilization
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    45%
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="caption" color="text.secondary">
                    Unplanned leaves
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    12%
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            xs={7}
            md={7}
            lg={7}
            xl={7}
            sx={{ marginRight: "0px", marginLeft: "0px" }}
          >
            <AttendanceChartWithData />
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <ISPZeroSaleTable />
            </Grid>
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <ISPZeroSaleTable />
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

export default RATAttendance;
