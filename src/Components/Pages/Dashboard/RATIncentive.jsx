import { Grid, Typography, Button, Stack, Paper } from "@mui/material";
import React from "react";
import ISPZeroSaleTable from "./ISPZeroSaleTable";

import {
  AQUA_DARK2,
  BLUE_COLOR,
  DARK_PURPLE,
  SECONDARY_BLUE,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../Common/TabsBar";

import FocusModelPerformanceIncentive from "../../Common/NuralCustomComponents/DashboardWidgets/FocusModelPerformanceIncentive.jsx";

const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];

const RATIncentive = () => {
  const [activeTab, setActiveTab] = React.useState("incentive");
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
  const navigate = useNavigate();

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

  const stats = [
    {
      title: "Total Incentive Payout",
      value: "₹1.5L",
      change: "+5.2% VS PREV. YEAR",
    },
    { title: "Yearly Growth", value: "23%", change: "+11% VS PREV. YEAR" },
  ];

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

        <Grid item xs={12} md={8} lg={8} xl={8} pl={1} pr={1}>
          <FocusModelPerformanceIncentive data={data} />
        </Grid>
        <Grid container spacing={2} xl={4} lg={4} md={4} sm={12}>
          {stats.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",

                  backgroundColor: "#e8ecf9",
                  borderRadius: 2,
                  padding: 2,
                  margin: 1,
                  height: "90%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    color: BLUE_COLOR,
                    marginTop: "80%",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="h5" sx={{ my: 0, color: DARK_PURPLE }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" sx={{ color: AQUA_DARK2 }}>
                  {item.change}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12} pl={1} pr={1}>
          <ISPZeroSaleTable />
        </Grid>
      </Grid>
    </>
  );
};

export default RATIncentive;
