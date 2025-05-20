import React, { useEffect, useState } from "react";
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
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import {
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  LIGHT_GRAY3,
} from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";
import { GetPriceBandDropDown } from "../../../Api/Api";
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

// Helper function to generate random colors for chart lines
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CounterShare = ({
  priceBandData = [],
  priceBrandGraph = [],
  onPriceBandChange,
}) => {
  //   console.log("priceBrandGraph", priceBrandGraph);
  //   console.log("priceBandData", priceBandData);
  const [selectedPriceBand, setSelectedPriceBand] = useState("ALL");
  const [priceBandDropDown, setPriceBandDropDown] = useState([]);

  useEffect(() => {
    fetchPriceBandDropDown();
  }, []);

  const fetchPriceBandDropDown = async () => {
    try {
      const res = await GetPriceBandDropDown();
      if (res.statusCode == 200) {
        setPriceBandDropDown(res.priceBandDropdownList);
      } else {
        setPriceBandDropDown([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Process priceBrandGraph data for the chart
  const processChartData = (graphData) => {
    if (!graphData || graphData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Extract unique months and sort them (assuming monthName is like 'Jan', 'Feb')
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = [...new Set(graphData.map((item) => item.monthName))].sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );

    // Group data by brand
    const brands = {};
    graphData.forEach((item) => {
      if (!brands[item.brandName]) {
        const isLastMonth = (context) =>
          context.dataIndex === labels.length - 1; // Helper to check if it's the last point

        brands[item.brandName] = {
          label: item.brandName,
          data: Array(labels.length).fill(null), // Initialize data array for the brand
          borderColor: LIGHT_GRAY3,
          borderWidth: 1.5,
          tension: 0.4,
          pointRadius: (context) => (isLastMonth(context) ? 6 : 0), // Larger radius for the last point
          pointHoverRadius: (context) => (isLastMonth(context) ? 8 : 6), // Adjust hover radius too
          pointBackgroundColor: (context) =>
            isLastMonth(context) ? "#00D2D2" : LIGHT_GRAY3, // Highlight color for last point
          pointBorderColor: (context) =>
            isLastMonth(context) ? "#00D2D2" : LIGHT_GRAY3, // Highlight color for last point border
        };
      }
      const monthIndex = labels.indexOf(item.monthName);
      if (monthIndex !== -1) {
        brands[item.brandName].data[monthIndex] = item.monthSale;
      }
    });

    return {
      labels,
      datasets: Object.values(brands),
    };
  };

  const chartData = processChartData(priceBrandGraph);

  // Find max value for chart scale
  const maxSale = Math.max(...priceBrandGraph.map((item) => item.monthSale), 0);
  const chartMaxY =
    maxSale > 0 ? Math.ceil(maxSale / 4000) * 4000 + 4000 : 16000; // Ensure max is a multiple of 4k + buffer

  const options = {
    responsive: true,

    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // You might want to display legend if multiple brands
      },
      tooltip: {
        mode: "index",
        intersect: false,
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
            const dataItem = priceBrandGraph?.find(
              (item) => item.monthName === label
            );
            if (dataItem?.monthStartDate) {
              try {
                const date = new Date(
                  dataItem.monthStartDate.replace(/-/g, " ")
                );
                return format(date, "dd/MM/yy");
              } catch (e) {
                console.error("Error formatting date:", e);
                return label;
              }
            }
            return label;
          },
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = context.parsed.y;
            if (value !== null) {
              if (value >= 1000000)
                label += `₹${(value / 1000000).toFixed(2)}M`;
              else if (value >= 1000) label += `₹${(value / 1000).toFixed(2)}K`;
              else label += `₹${value.toLocaleString("en-IN")}`;
            }
            return label;
          },
        },
        position: "average",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: chartMaxY,
        ticks: {
          stepSize: chartMaxY / 4,
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
        border: {
          display: true,
          color: PRIMARY_BLUE2,
        },
      },
    },
  };

  // Find Motorola data for the featured box
  const motorolaData = priceBandData.find(
    (brand) => brand.brandName?.toUpperCase() === "MOTOROLA"
  );

  return (
    <Card
      sx={{
        pt: 2,
        pb: 4,
        pl: 2,
        pr: 2,
        height: "85%",
        backgroundColor: LIGHT_GRAY2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: PRIMARY_BLUE2,
          fontSize: "10px",
          fontWeight: 700,
          mb: 2,
        }}
      >
        Counter Share
      </Typography>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <NuralAutocomplete
          label="PRICE BAND"
          options={priceBandDropDown}
          placeholder="PRICE BAND"
          width="100%"
          getOptionLabel={(option) => option.priceBandCode || ""}
          isOptionEqualToValue={(option, value) =>
            option?.priceBandID === value?.priceBandID
          }
          onChange={(event, newValue) => {
            setSelectedPriceBand(newValue);
            if (onPriceBandChange) {
              onPriceBandChange(newValue?.priceBandID || 0, newValue); // Call the passed onChange handler
            }
          }}
          value={selectedPriceBand}
        />
      </Grid>
      <Grid container spacing={2}>
        {/* Featured Brand (Motorola) */}
        {motorolaData && (
          <Grid item xs={12} md={5} lg={5} xl={5} mt={5}>
            <Box
              sx={{
                backgroundColor: MEDIUM_BLUE,
                width: 158.3330078125,
                height: 106,
                gap: 0,
                borderRadius: 1,
                paddingRight: 1,
                paddingLeft: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: DARK_PURPLE, fontSize: "8px" }}>
                {motorolaData.brandName.toUpperCase()}
              </Typography>
              <Typography
                sx={{
                  color: DARK_PURPLE,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {/* Format mtdSale as needed */}
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(motorolaData.mtdSale)}
                {/* {(motorolaData.mtdSale / 1000).toFixed(2)}K */}
              </Typography>
              <Typography sx={{ color: DARK_PURPLE, fontSize: "8px" }}>
                {motorolaData.salePercent?.toFixed(0)}%
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Other Brands */}
        <Grid item xs={12} md={7} lg={7} xl={7}>
          <Grid container spacing={1} justifyContent="center">
            {priceBandData
              .filter((brand) => brand.brandName?.toUpperCase() !== "MOTOROLA")
              .map((brand) => (
                <Grid item xs={3} key={brand.brandName}>
                  {" "}
                  {/* Ensure unique key */}
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%", // Ensure consistent height
                    }}
                  >
                    <Typography
                      sx={{ color: DARK_PURPLE, fontSize: "8px", mb: 0.5 }}
                    >
                      {brand.brandName?.toUpperCase()}
                    </Typography>
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "14px", // Make font size consistent
                        fontWeight: "bold",
                        mb: 0.5,
                      }}
                    >
                      {/* Format mtdSale as needed */}
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(brand.mtdSale)}
                      {/* {(brand.mtdSale / 1000).toFixed(0)}K */}
                    </Typography>
                    <Typography sx={{ color: DARK_PURPLE, fontSize: "12px" }}>
                      {brand.salePercent?.toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} pb={2} mt={1}>
          {" "}
          {/* Added slight top margin */}
          <Typography
            sx={{
              color: DARK_PURPLE,
              fontSize: "8px",
              mb: 1,
              opacity: 0.7,
            }}
          >
            {chartData.labels.length > 0
              ? `LAST ${chartData.labels.length} MONTHS`
              : "MONTHLY TREND"}
          </Typography>
          <Box sx={{ height: "200px" }}>
            {chartData.datasets.length > 0 ? (
              <Line data={chartData} options={options} />
            ) : (
              <Typography
                sx={{ textAlign: "center", color: DARK_PURPLE, mt: 5 }}
              >
                No chart data available.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CounterShare;
