import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  PRIMARY_BLUE2,
  LIGHT_GRAY2,
  LIGHT_GRAY3,
  DARK_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
  AQUA_DARK,
  AQUA,
} from "../../colors";
import NuralAutocomplete from "../../../Pages/NuralCustomComponents/NuralAutocomplete";
import { GetFocusModelGroupDropDown } from "../../../Api/Api";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const titleStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "8px",
  lineHeight: "100%",
  letterSpacing: "0%",
  textAlign: "center",
  color: PRIMARY_BLUE2,
};

const valueStyle = {
  fontSize: "14px",
  fontWeight: 700,
  color: DARK_PURPLE,
};

const FocusModelPerformance = ({
  focusModelData,
  focusModelGraphData,
  onModelChange,
}) => {
  // console.log("focusModelData", focusModelData);
  // console.log("focusModelGraphData=>>>>>>>", focusModelGraphData);
  const [selectedProduct, setSelectedProduct] = React.useState("ALL PRODUCTS");
  const [focusModelGroupDropDown, setFocusModelGroupDropDown] = React.useState(
    []
  );
  const [selectedFocusModelGroup, setSelectedFocusModelGroup] =
    React.useState(null);
  const [selectedMetricType, setSelectedMetricType] = useState("QTY");

  const metrics = useMemo(() => {
    const data = focusModelData?.[0];
    if (!data) {
      return {
        growth: 0,
        lmtd: 0,
        mtd: 0,
        qtd: 0,
        ytd: 0,
      };
    }
    if (selectedMetricType === "QTY") {
      return {
        growth: data.mtdQtyGwth || 0,
        lmtd: data.lmtdqty || 0,
        mtd: data.mtdqty || 0,
        qtd: data.qtdqty || 0,
        ytd: data.ytdqty || 0,
      };
    } else {
      return {
        growth: data.mtdSaleGwth || 0,
        lmtd: data.lmtdSale || 0,
        mtd: data.mtdSale || 0,
        qtd: data.qtdSale || 0,
        ytd: data.ytdSale || 0,
      };
    }
  }, [focusModelData, selectedMetricType]);

  useEffect(() => {
    fetchFocusModelGroupDropDown();
  }, []);

  const fetchFocusModelGroupDropDown = async () => {
    try {
      const res = await GetFocusModelGroupDropDown();
      if (res.statusCode == 200) {
        setFocusModelGroupDropDown(res.focusModelDropdownList);
      } else {
        setFocusModelGroupDropDown([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = useMemo(() => {
    const graphData = focusModelGraphData;
    if (!graphData || graphData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = graphData.map((item) => item.monthName);
    const dataPoints = graphData.map((item) => item.monthSale);

    const highlightIndex = graphData.length - 1;
    const highlightValue = dataPoints[highlightIndex];
    const highlightLabel = labels[highlightIndex];

    const highlightData = Array(graphData.length).fill(null);
    if (highlightIndex >= 0) {
      if (highlightIndex > 0) {
        highlightData[highlightIndex - 1] = dataPoints[highlightIndex - 1];
      }
      highlightData[highlightIndex] = highlightValue;
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Value",
          data: dataPoints,
          borderColor: LIGHT_GRAY3,
          tension: 0.4,
          pointRadius: (context) =>
            context.dataIndex === highlightIndex ? 6 : 0,
          pointBackgroundColor: (context) =>
            context.dataIndex === highlightIndex ? AQUA : 'transparent',
          pointBorderColor: (context) =>
            context.dataIndex === highlightIndex ? '#00D2D2' : 'transparent',
          pointBorderWidth: (context) =>
            context.dataIndex === highlightIndex ? 2 : 0,
          borderWidth: 1.5,
        },
      ],
    };
  }, [focusModelGraphData, LIGHT_GRAY3]);

  const options = useMemo(() => {
    const graphData = focusModelGraphData;
    const dataPoints = graphData?.map((item) => item.monthSale) || [];

    const maxValue = dataPoints.length > 0 ? Math.max(...dataPoints) : 0;
    const yAxisMax =
      maxValue === 0 ? 100 : Math.ceil((maxValue * 1.2) / 1000) * 1000;
    const stepSize = yAxisMax / 4;

    const highlightIndex = graphData ? graphData.length - 1 : -1;
    const highlightLabel =
      highlightIndex >= 0 ? graphData[highlightIndex].monthName : null;
    const highlightFullDate =
      highlightIndex >= 0 ? graphData[highlightIndex].monthStartDate : null;

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: yAxisMax,
          ticks: {
            stepSize: stepSize,
            callback: function (value) {
              if (value >= 1000000) return `₹${(value / 1000000).toFixed(2)}M`;
              if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
              return `₹${value}`;
            },
            color: PRIMARY_BLUE2,
            font: {
              size: 10,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
            drawTicks: true,
          },
          border: {
            display: true,
            color: PRIMARY_BLUE2,
          },
        },
        x: {
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
            drawTicks: true,
          },
          ticks: {
            callback: function (value, index) {
              const label = this.getLabelForValue(value);
              return label === "MAR" ? label : label;
            },
            color: (context) => {
              const label = context.tick.label;
              return label === "MAR" ? "#00D2D2" : PRIMARY_BLUE2;
            },
            font: {
              size: 10,
            },
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
          backgroundColor: "#00D2D2",
          titleColor: AQUA_DARK,
          bodyColor: AQUA_DARK,
          titleFont: {
            size: 12,
            weight: "normal",
          },
          bodyFont: {
            size: 12,
            weight: "bold",
          },
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function (context) {
              const label = context[0].label;
              const dataItem = graphData?.find(
                (item) => item.monthName === label
              );
              if (dataItem?.monthStartDate) {
                try {
                  const date = new Date(
                    dataItem.monthStartDate.replace(/-/g, " ")
                  );
                  return format(date, "dd/MM/yy");
                } catch (e) {
                  return label;
                }
              }
              return label;
            },
            label: function (context) {
              if (context.datasetIndex === 0) {
                const value = context.parsed.y;
                if (value >= 1000000)
                  return `₹${(value / 1000000).toFixed(2)}M`;
                if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
                return `₹${value.toLocaleString("en-IN")}`;
              }
              return null;
            },
          },
          position: "average",
          filter: function (tooltipItem) {
            return tooltipItem.datasetIndex === 0;
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    };
  }, [focusModelGraphData, PRIMARY_BLUE2]);

  const formatMetricValue = (value) => {
    if (selectedMetricType === "QTY") {
      return value.toLocaleString("en-IN");
    } else {
      if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
      return `₹${value}`;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: "88%",
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "8px",
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
          color: PRIMARY_BLUE2,
          mb: 2,
        }}
      >
        Focus Model Performance
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Grid item xs={12} sm={6} md={8} lg={8}>
          <NuralAutocomplete
            label="Focus Model Group"
            options={focusModelGroupDropDown}
            placeholder="ALL PRODUCTS"
            width="100%"
            getOptionLabel={(option) => option.modelName || ""}
            isOptionEqualToValue={(option, value) =>
              option?.modelID === value?.modelID
            }
            value={selectedFocusModelGroup}
            onChange={(event, newValue) => {
              setSelectedFocusModelGroup(newValue);
              if (onModelChange) {
                onModelChange(newValue?.modelID || 0, newValue);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end'} }}>
            <Button
              variant={selectedMetricType === "QTY" ? "contained" : "outlined"}
              size="small"
              onClick={() => setSelectedMetricType("QTY")}
              sx={{
                backgroundColor:
                  selectedMetricType === "QTY" ? DARK_PURPLE : LIGHT_GRAY2,
                color: selectedMetricType === "QTY" ? "#fff" : DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                border:
                  selectedMetricType === "QTY"
                    ? "none"
                    : `1px solid ${DARK_PURPLE}`,

                "&:focus": {
                  outline: "none",
                },
              }}
            >
              QTY
            </Button>
            <Button
              size="small"
              variant={selectedMetricType === "VAL" ? "contained" : "outlined"}
              onClick={() => setSelectedMetricType("VAL")}
              sx={{
                backgroundColor:
                  selectedMetricType === "VAL" ? DARK_PURPLE : LIGHT_GRAY2,
                color: selectedMetricType === "VAL" ? "#fff" : DARK_PURPLE,
                fontSize: "8px",
                fontWeight: 700,
                borderRadius: "40px",
                padding: "4px 12px",
                minWidth: "unset",
                border:
                  selectedMetricType === "VAL"
                    ? "none"
                    : `1px solid ${DARK_PURPLE}`,

                "&:focus": {
                  outline: "none",
                },
              }}
            >
              VAL
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "8px",
              lineHeight: "100%",
              letterSpacing: "4%",
              textTransform: "uppercase",
              color: PRIMARY_LIGHT_PURPLE2,
              mt: 2,
            }}
          >
            LAST MTD VS MTD
          </Typography>

          <Box
            sx={{ display: "flex", gap: 4, justifyContent: "center", my: 2 }}
          >
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "8px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: PRIMARY_BLUE2,
                  mt: 0.7,
                }}
              >
                GROWTH
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: PRIMARY_BLUE2,
                  color: "#fff",
                  p: "2px",
                  borderRadius: "25px",
                  mt: 0.5,
                  display: "inline-block",
                  minWidth: "50px",
                  textAlign: "center",
                }}
              >
                {metrics.growth.toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={titleStyle}>
                LMTD
              </Typography>
              <Typography sx={valueStyle}>
                {formatMetricValue(metrics.lmtd)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={titleStyle}>
                MTD
              </Typography>
              <Typography sx={valueStyle}>
                {formatMetricValue(metrics.mtd)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={titleStyle}>
                QTD
              </Typography>
              <Typography sx={valueStyle}>
                {formatMetricValue(metrics.qtd)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" sx={titleStyle}>
                YTD
              </Typography>
              <Typography sx={valueStyle}>
                {formatMetricValue(metrics.ytd)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={12} lg={12} xl={12} mt={3}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "8px",
              lineHeight: "100%",
              letterSpacing: "4%",
              textTransform: "uppercase",
              color: PRIMARY_LIGHT_PURPLE2,
              mt: 1,
            }}
          >
            LAST 6 MONTHS TREND
          </Typography>

          <Box sx={{ height: "220px" }}>
            {chartData.labels && chartData.labels.length > 0 ? (
              <Line data={chartData} options={options} />
            ) : (
              <Typography
                sx={{ textAlign: "center", mt: 4, color: PRIMARY_BLUE2 }}
              >
                No graph data available.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FocusModelPerformance;
