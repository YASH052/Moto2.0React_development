import React from "react";
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
import { PRIMARY_BLUE2, LIGHT_GRAY2, DARK_PURPLE, PRIMARY_LIGHT_PURPLE2 } from "../../colors";
import NuralAutocomplete from "../../../Pages/NuralCustomComponents/NuralAutocomplete";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FocusModelPerformance = ({ height = "300px" }) => {
  const [selectedProduct, setSelectedProduct] = React.useState("ALL PRODUCTS");

  const metrics = {
    growth: -15.1,
    lmtd: 450,
    mtd: 450,
    qtd: 450,
    ytd: 450,
  };

  const chartData = {
    labels: ["JAN", "MAR", "MAY", "JUN"],
    datasets: [
      {
        data: [3000, 4000, 7000, 8500],
        borderColor: "#ccc",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        data: [null, 4000],
        borderColor: "#00D2D2",
        pointBackgroundColor: "#00D2D2",
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 16000,
        ticks: {
          stepSize: 4000,
          callback: function (value) {
            return value === 0 ? "0" : value / 1000 + "K";
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
          color: PRIMARY_BLUE2
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
          color: PRIMARY_BLUE2
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#00D2D2",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          size: 12,
          weight: "normal",
        },
        bodyFont: {
          size: 12,
          weight: "normal",
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (context) {
            const date = context[0].label;
            if (date === "MAR") {
              return "16/03/24";
            }
            return date;
          },
          label: function (context) {
            return `₹${context.parsed.y}`;
          },
        },
        position: "average",
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
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
        spacing={4}
       
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12}  mt={1.5} md={9} lg={9} xl={9}>
          <NuralAutocomplete
            options={["ALL PRODUCTS"]}
            placeholder="ALL PRODUCTS"
            width="100%"
            backgroundColor={LIGHT_GRAY2}
          />
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={3}>
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
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: DARK_PURPLE,
                  mt: 0.5,
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
                  p: "5px",
                  borderRadius: "25px",
                  mt: 0.5,
                  display: "inline-block",
                }}
              >
                {metrics.growth}%
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: DARK_PURPLE,
                }}
              >
                LMTD
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {metrics.lmtd}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: DARK_PURPLE,
                }}
              >
                MTD
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {metrics.mtd}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: DARK_PURPLE,
                }}
              >
                QTD
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {metrics.qtd}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: DARK_PURPLE,
                }}
              >
                YTD
              </Typography>
              <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                {metrics.ytd}
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

          <Box sx={{ height: "250px" }}>
            <Line data={chartData} options={options} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FocusModelPerformance;
