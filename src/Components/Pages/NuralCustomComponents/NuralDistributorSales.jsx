import React from "react";
import { Line } from "react-chartjs-2";

import {
  Box,
  Typography,
  Select,
  MenuItem,
  Paper,
  Grid,
  Button,
} from "@mui/material";

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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NuralAutocomplete from "./NuralAutocomplete";
import SalesTrendGraph from "./DashboardWidgets/SalesTrendGraph";
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

const brandData = {
  PRIMARY: { share: "140.15K", percentage: "17%" },
  SECONDARY: { share: "169K", percentage: "14%" },
  TERTIARY: { share: "151K", percentage: "18%" },
  DRR: { share: "150K", percentage: "21%" },
  LMTD: { share: "90K", percentage: "8%" },
};

const chartData = {
  labels: months,
  datasets: [
    {
      label: "",
      data: [8000, 9000, 7500, 6500, 9000, 11000, 12500],
      borderColor: AQUA,
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
    {
      label: "",
      data: [4000, 4500, 4000, 5500, 7000, 8500, 9000],
      borderColor: SECONDARY_BLUE,
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
    {
      label: "",
      data: [3000, 3500, 2000, 3000, 4500, 2500, 2000],
      borderColor: DARK_PURPLE,
      borderWidth: 1.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: WHITE,
      titleColor: DARK_PURPLE,
      bodyColor: DARK_PURPLE,
      borderColor: LIGHT_GRAY2,
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: function (context) {
          return `₹${context.parsed.y}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 16000,
      ticks: {
        stepSize: 4000,
        callback: function (value) {
          return value === 0 ? "0" : `${value / 1000}k`;
        },
        color: DARK_PURPLE,
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: DARK_PURPLE,
      },
    },
  },
};
const NuralDistributorSales = () => {
  const [selectedDistributor, setSelectedDistributor] =
    React.useState("DIST. 1");

  const data = [
    { month: "JAN", primary: 4000, secondary: 2400, tertiary: 2800 },
    { month: "FEB", primary: 4500, secondary: 3800, tertiary: 3200 },
    { month: "MAR", primary: 8500, secondary: 7300, tertiary: 6800 },
    { month: "APR", primary: 8000, secondary: 7900, tertiary: 8100 },
  ];

  const salesData = {
    PRIMARY: "328.64K",
    SECONDARY: "236.5K",
    TERTIARY: "377.47K",
    DRR: "13.02K",
    LMTD: "397.14K",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: WHITE,
            p: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <Typography sx={{ color: DARK_PURPLE }}>{`${label}`}</Typography>
          <Typography sx={{ color: AQUA }}>{`₹${payload[0].value}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 2, backgroundColor: LIGHT_GRAY2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          Distributor Sales
        </Typography>
      </Box>
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={10} lg={10} xl={10}>
          <NuralAutocomplete
            options={["DIST. 1", "DIST. 2", "DIST. 3"]}
            placeholder="DIST. 1"
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2  } lg={2} xl={2}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                "&:hover": {
                  backgroundColor: "#2F3BC9",
                },
              }}
            >
              QTY
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                border: "none",
                "&:hover": {
                  backgroundColor: "#2F3BC9",
                },
              }}
            >
              VAL
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ height: "150px", mt: 2 }}>
        <Grid item xs={12} md={11} lg={11} xl={11} m={'auto'}>
          <Line data={chartData} options={options} />
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: MEDIUM_BLUE,
          borderRadius: 2,
          justifyContent: "center",

          height: "150px",
        }}
      >
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "10px",
              lineHeight: "100%",
              letterSpacing: "0%",
              color: DARK_PURPLE,
              textAlign: "start",
            }}
          >
            DIST 1. SALES
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <Grid container spacing={1} justifyContent="center">
            {Object.entries(brandData)
              .filter(([brand]) => brand !== "MOTOROLA")
              .map(([brand, data]) => (
                <Grid item xs={4} key={brand}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 0,
                      mb: 0.5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      borderRight:
                        brand !== "LMTD" ? `1px solid ${DARK_PURPLE}` : "none",
                    }}
                  >
                    <Typography
                      sx={{ color: DARK_PURPLE, fontSize: "8px", mb: 0.5 }}
                    >
                      {brand}
                    </Typography>
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "14px",
                        fontWeight: "bold",
                        mb: 0.5,
                      }}
                    >
                      {data.share}
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NuralDistributorSales;
