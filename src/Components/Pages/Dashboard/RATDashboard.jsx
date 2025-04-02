import { Grid, Typography, Button, Stack } from "@mui/material";
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
import AttendanceCard from "../NuralCustomComponents/DashboardWidgets/AttendanceCard.jsx";
import FocusModelPerformance from "../../Common/NuralCustomComponents/DashboardWidgets/FocusModelPerformance.jsx";
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
const RATDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("business");

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

                {/* Third Row - Buttons */}
              </Grid>
            </Grid>
          </Grid>
        
          <Grid container spacing={0} ml={2} p={0}>
            {" "}
            <Grid item xs={12} md={6} lg={6} xl={6}>
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
            <Grid item xs={12} md={4} lg={3} xl={3} ml={2}>
              <SalesMetricsGrid metrics={salesMetrics} />
            </Grid>
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <ISPZeroSaleTable />
            </Grid>
          </Grid>
          {/* Add Target Achievement section */}

          <Grid container spacing={2} ml={0} mt={0.5} pr={2}>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={weeklyData}
                title="Sales Trend [Week]"
                period="week"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={monthlyData}
                title="Sales Trend [Month]"
                period="month"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={yearlyData}
                title="Sales Trend [Year]"
                period="year"
                showLegend={false}
              />
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} mt={2} pr={2}>
            <Grid item xs={12} md={4} spacing={2} lg={4} xl={4} pr={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                  <TargetAchievement />
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                  <SalesTrendGraph
                    height="248px"
                    paperBgColor={LIGHT_GRAY2}
                    gap="15px"
                    borderRadius="8px"
                    data={monthlyData}
                    title="Sales Trend [Month]"
                    period="month"
                    showLegend={false}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4} pl={1} pr={1}>
              <FocusModelPerformance data={data} />
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4} pl={1.5}>
              <CounterShare />
            </Grid>
          </Grid>
          <Grid container spacing={1} ml={2} mt={-3} pr={2}>
            <Grid item xs={12} md={3} lg={3} pr={1} xl={3}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={yearlyData}
                title="ASP Trend [Year]"
                period="year"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3} pr={1} xl={3}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={yearlyData}
                title="ASP Trend [Year]"
                period="year"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={2} lg={2} xl={2}>
              <RankingCard
                title="Ranking"
                width="100%"
                data={rankings}
                height="130px"
                backgroundColor={LIGHTAQUA}
                titleColor={"#026668"}
                dateColor={"#026668"}
                scoreColor={"#026668"}
                rankNumberColor={"#05CFD3"}
              />
              <AttendanceCard
                mt={0.8}
                present={115}
                total={143}
                width="100%"
                backgroundColor={LIGHT_GRAY2}
                titleColor={DARK_PURPLE}
                valueColor={DARK_PURPLE}
                percentageColor={PRIMARY_BLUE2}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <RankingNSM title="Ranking" data={rankings} />
            </Grid>
          </Grid>

          {/* Add ISP Zero Sale Table */}
        </Grid>
      </Grid>
    </>
  );
};

export default RATDashboard;
