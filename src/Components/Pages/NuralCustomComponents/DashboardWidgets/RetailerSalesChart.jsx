import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, Grid, Button } from "@mui/material";

import { Bar } from "react-chartjs-2";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  DARK_PURPLE,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";

const data = [
  { period: "P1", value: 35000, secondValue: 25000 },
  { period: "P2", value: 58000, secondValue: 35000 },
  { period: "P3", value: 48000, secondValue: 35000 },
  {
    period: "P4",
    value: 35000,
    secondValue: 35000,
    special: true,
    tooltipData: { tertiary: 25, lmtd: 40, activation: 60 },
  },
  { period: "P5", value: 45000, secondValue: 35000 },
  { period: "P6", value: 55000, secondValue: 35000 },
  { period: "P7", value: 55000, secondValue: 35000 },
  { period: "P8", value: 55000, secondValue: 35000 },
  { period: "P9", value: 58000, secondValue: 35000 },
  { period: "P10", value: 58000, secondValue: 35000 },
];

const brandData = [
  { id: 1, name: "PRIMARY", value: "140.15K" },
  { id: 2, name: "SECONDARY", value: "169K" },
  { id: 3, name: "TERTIARY", value: "151K" },
  { id: 4, name: "DRR", value: "150K" },
  { id: 5, name: "LMTD", value: "150K" },
  { id: 6, name: "ACTIVATION", value: "150K" },
  { id: 7, name: "NORMAL", value: "150K" },
];

const databar = {
  labels: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"],
  datasets: [
    {
      data: [
        58000, 58000, 48000, 35000, 45000, 55000, 55000, 55000, 58000, 58000,
      ],
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index === 3 ? "#00CED1" : "#DFDDDE";
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderRadius: 4,
    },
    {
      data: [
        35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000,
      ],
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index === 3 ? "#80E6E6" : "#E8E8E8";
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderRadius: 4,
    },
  ],
};
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: true,
        drawBorder: true,
        borderColor: PRIMARY_BLUE2,
        borderWidth: 1,
        drawOnChartArea: true,
        drawTicks: false,
      },
      ticks: {
        font: {
          family: "Manrope",
          size: 10,
        },
        color: PRIMARY_BLUE2,
      },
      border: {
        display: true,
        color: PRIMARY_BLUE2,
      },
    },
    y: {
      beginAtZero: true,
      max: 80000,
      ticks: {
        stepSize: 20000,
        font: {
          family: "Manrope",
          size: 10,
        },
        callback: function (value) {
          return value / 1000 + "K";
        },
        color: PRIMARY_BLUE2,
      },
      grid: {
        color: "#E0E0E0",
        drawBorder: false,
        borderDash: [3, 3],
      },
      border: {
        display: true,
        color: PRIMARY_BLUE2,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      position: "nearest",
      callbacks: {
        title: () => "",
        label: (context) => {
          const index = context.dataIndex;
          if (index === 3) {
            return ["TERTIARY 25", "LMTD 40", "ACTIVATION 60"];
          }
          return [];
        },
      },
      backgroundColor: "white",
      titleColor: "#666666",
      bodyColor: "#00CED1",
      borderColor: "#E0E0E0",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      bodyFont: {
        size: 12,
        family: "Manrope",
      },
      bodySpacing: 6,
      yAlign: "bottom",
      xAlign: "center",
    },
  },
  onClick: (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index;
      setSelectedBar(index);
    }
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const RetailerSalesChart = () => {
  const [selectedRetailer, setSelectedRetailer] = useState("RETAILER 4");
  const [viewMode, setViewMode] = useState("group");
  const [selectedBar, setSelectedBar] = useState(3);
  const [selectedDistributor, setSelectedDistributor] = useState("DIST. 1");
  const [activeButtons, setActiveButtons] = useState({
    group: true,
    individual: false,
    top: true,
    bottom: false
  });

  const handleButtonClick = (buttonType) => {
    if (buttonType === 'group' || buttonType === 'individual') {
      setActiveButtons({
        ...activeButtons,
        group: buttonType === 'group',
        individual: buttonType === 'individual'
      });
      setViewMode(buttonType);
    } else {
      setActiveButtons({
        ...activeButtons,
        top: buttonType === 'top',
        bottom: buttonType === 'bottom'
      });
    }
  };

  return (
    <Grid
      container
      spacing={2}
      mt={2}
      ml={0}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: 2,
      }}
    >
      <Grid item xs={12} md={12} lg={12} xl={12} p={0}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: 10,
            lineHeight: "100%",
            letterSpacing: "0%",
            color: PRIMARY_BLUE2,
          }}
        >
          Retailer Sales
        </Typography>
      </Grid>

      <Grid item xs={12} md={12} lg={12} xl={12} p={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Grid container spacing={1}>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.group ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.group ? DARK_PURPLE : "transparent",
                    color: activeButtons.group ? "white" : DARK_PURPLE,
                    border: activeButtons.group ? `1px solid ${DARK_PURPLE}` : "none",
                    "&:hover": {
                      bgcolor: activeButtons.group ? "#2F3BC9" : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("group")}
                >
                  GROUP
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.individual ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.individual ? DARK_PURPLE : "transparent",
                    color: activeButtons.individual ? "white" : DARK_PURPLE,
                    border: activeButtons.individual ? `1px solid ${DARK_PURPLE}` : "none",
                    "&:hover": {
                      bgcolor: activeButtons.individual ? "#2F3BC9" : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("individual")}
                >
                  INDIVIDUAL
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.top ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.top ? DARK_PURPLE : "transparent",
                    color: activeButtons.top ? "white" : DARK_PURPLE,
                    border: activeButtons.top ? `1px solid ${DARK_PURPLE}` : "none",
                    "&:hover": {
                      bgcolor: activeButtons.top ? "#2F3BC9" : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("top")}
                >
                  TOP 10
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.bottom ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.bottom ? DARK_PURPLE : "transparent",
                    color: activeButtons.bottom ? "white" : DARK_PURPLE,
                    border: activeButtons.bottom ? `1px solid ${DARK_PURPLE}` : "none",
                    "&:hover": {
                      bgcolor: activeButtons.bottom ? "#2F3BC9" : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("bottom")}
                >
                  BOTTOM 10
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={10} xl={10}>
            <NuralAutocomplete
              options={["RETAILER 1", "RETAILER 2", "RETAILER 3"]}
              placeholder="RETAILER 4"
              value={selectedRetailer}
              onChange={(e) => setSelectedRetailer(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2} xl={2}>
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

          <Grid item xs={12} md={12} lg={12} xl={12} p={2}>
            <Box
              sx={{
                height: 165,
                width: "100%",
                "& canvas": {
                  borderLeft: "1px solid #E0E0E0",
                  borderRight: "1px solid #E0E0E0",
                },
              }}
            >
              <Bar options={options} data={databar} />
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{
            p: 2,
            mt: 1,
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
                RETAILER 4.
            </Typography>
          </Grid>
          <Grid item xs={12} md={10} lg={10} xl={10}>
            <Grid
              container
              spacing={0}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                mt: 1,
              }}
            >
              {brandData.map((item, index) => (
                <Grid
                  item
                  xs={12 / 7}
                  md={3}
                  key={item.id}
                  sx={{
                    textAlign: "center",
                    position: "relative",
                    "&::after":
                      index < brandData.length - 1
                        ? {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            top: "15%",
                            height: "70%",
                            width: "1px",
                            backgroundColor: PRIMARY_BLUE2,
                          }
                        : {},
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "8px",
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RetailerSalesChart;
