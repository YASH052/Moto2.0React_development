import React, { useState, useEffect } from "react";
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
          return `Value: ${context.parsed.y.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value;
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

const ChannelDistributorSales = ({
  distributorSaleQuantityList,
  distributorSaleValueList,
  mtdDistributorSaleQuantityList,
  mtdDistributorSaleValueList,
  distributorSaleDropdownList,
  setValue,
}) => {
  const [selectedDistributor, setSelectedDistributor] = useState(0);
  const [selectedMode, setSelectedMode] = useState("QTY");

  useEffect(() => {
    // Remove the logic that sets the initial distributor
    // if (distributorSaleDropdownList && distributorSaleDropdownList.length > 0 && !selectedDistributor) {
    //   const initialDistributor = distributorSaleDropdownList[0];
    //   setSelectedDistributor(initialDistributor); // <-- REMOVE THIS LINE
    //   setValue(initialDistributor?.disID); // <-- REMOVE THIS LINE
    // }
    // The useEffect hook might still be needed for other purposes,
    // or it can be removed entirely if its only purpose was to set the initial value.
    // For now, I'll comment it out, but you might remove it completely if not needed.
  }, [distributorSaleDropdownList, setValue, selectedDistributor]);

  const chartDataSource = selectedMode === "QTY" ? distributorSaleQuantityList : distributorSaleValueList;
  const mtdDataSource = selectedMode === "QTY" ? mtdDistributorSaleQuantityList : mtdDistributorSaleValueList;

  const chartLabels = chartDataSource?.map(item => item.month) || [];
  const chartValues = chartDataSource?.map(item => selectedMode === "QTY" ? item.qty : item.sale) || [];

  const dynamicChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: selectedMode === 'QTY' ? 'Quantity' : 'Value',
        data: chartValues,
        borderColor: AQUA,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
    ],
  };

  const currentMtdData = mtdDataSource?.[0] || {};

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num?.toString() || '0';
  };

  // Prepare MTD data entries for mapping, needed for index access
  const mtdEntries = Object.entries(currentMtdData);

  return (
    <Box sx={{ p: 2, backgroundColor: LIGHT_GRAY2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12} md={10} lg={9.5} xl={9.5}>
          <NuralAutocomplete
            options={distributorSaleDropdownList || []}
            placeholder="Select Distributor"
            getOptionLabel={(option) => option?.disName || ""}
            isOptionEqualToValue={(option, value) =>
              option?.disID === value?.disID
            }
            onChange={(event, newValue) => {
              console.log("newValueonchnage", newValue);
              setValue(newValue?.disID || 0);
              setSelectedDistributor(newValue || 0);
            }}
            value={selectedDistributor}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2} xl={2}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end'} }}>
            <Button
              variant={selectedMode === "QTY" ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedMode("QTY")}
              sx={{
                backgroundColor: selectedMode === "QTY" ? DARK_PURPLE : LIGHT_GRAY2,
                color: selectedMode === "QTY" ? WHITE : DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                border: selectedMode === "QTY" ? "none" : `1px solid ${DARK_PURPLE}`,
                "&:hover": {
                  backgroundColor: selectedMode === "QTY" ? "#2F3BC9" : LIGHTAQUA,
                },
              }}
            >
              QTY
            </Button>
            <Button
              variant={selectedMode === "VAL" ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedMode("VAL")}
              sx={{
                backgroundColor: selectedMode === "VAL" ? DARK_PURPLE : LIGHT_GRAY2,
                color: selectedMode === "VAL" ? WHITE : DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                border: selectedMode === "VAL" ? "none" : `1px solid ${DARK_PURPLE}`,
                "&:hover": {
                  backgroundColor: selectedMode === "VAL" ? "#2F3BC9" : LIGHTAQUA,
                },
              }}
            >
              VAL
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ height: "150px", mt: 0 }}>
        <Grid item xs={12} md={12} lg={12} xl={12} m={'auto'}>
          <Line data={dynamicChartData} options={options} />
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          p: 2,
          mt: 4,
          backgroundColor: MEDIUM_BLUE,
          borderRadius: 2,
          minHeight: "100px",
        }}
      >
        <Grid item xs={12}>
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
              mb: 1,
            }}
          >
            {`${selectedDistributor?.disName || 'Distributor'} MTD Sales (${selectedMode})`}
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={1} justifyContent="center" alignItems="center" sx={{ flexWrap: 'nowrap' }}>
          {mtdEntries.length > 0 ? (
            mtdEntries.map(([brandKey, value], index) => (
                <Grid item xs="auto" key={brandKey} sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      borderRight: index < mtdEntries.length - 1 ? `1px solid ${DARK_PURPLE}` : "none",
                    }}
                  >
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "8px",
                        mb: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {brandKey}
                    </Typography>
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "14px",
                        fontWeight: "bold",
                        mb: 0.5,
                      }}
                    >
                      {formatNumber(value)}
                    </Typography>
                  </Box>
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
               <Typography sx={{textAlign: 'center', color: DARK_PURPLE, mt: 2}}>No MTD data available.</Typography>
             </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChannelDistributorSales;
