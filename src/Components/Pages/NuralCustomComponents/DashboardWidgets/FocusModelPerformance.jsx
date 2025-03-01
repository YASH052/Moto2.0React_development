import React, { useState } from "react";
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
import SalesMetricsGrid from "./SalesMetricsGrid";
import SalesTrendGraph from "./SalesTrendGraph";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FocusModelPerformance = ({ data }) => {
  const [selectedPriceBand, setSelectedPriceBand] = useState("ALL");

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

  const brandData = {
    MOTOROLA: { share: "140.15K", percentage: "17%" },
    VIVO: { share: "169K", percentage: "14%" },
    SAMSUNG: { share: "151K", percentage: "18%" },
    OPPO: { share: "150K", percentage: "21%" },
    REALME: { share: "90K", percentage: "8%" },
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "MOTOROLA",
        data: [4000, 5000, 8000, 9000, 8500, 9500, 10000],
        borderColor: "#4285F4",
        tension: 0.4,
      },
      {
        label: "SAMSUNG",
        data: [3000, 4500, 7000, 8000, 8000, 8500, 9000],
        borderColor: "#34A853",
        tension: 0.4,
      },
      // Add more datasets as needed
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 16000,
        ticks: {
          stepSize: 4000,
        },
      },
    },
  };

  return (
    <Card
      sx={{
        pt: 2,
        pb: 4,
        pl: 2,
        pr: 2,
        height: "200px",
        backgroundColor: LIGHT_GRAY2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "13.66px",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          Focus Model Performance
        </Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <SalesTrendGraph
            width="400px"
            height="230px"
            paperBgColor={LIGHT_GRAY2}
            gap="15px"
            borderRadius="8px"
            data={data}
            title="Last 6 Months Trend"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Box sx={{ width: '60%' }}>
              <NuralAutocomplete
                placeholderText="ALL PRODUCTS"
                width="100%"
                backgroundColor={LIGHT_GRAY2}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
          </Box>

          <Grid container spacing={2} p={2} justifyContent="center">
            {Object.entries(brandData).map(([brand, data], index) => (
              <Grid
                item
                xs={4}
                md={4}
                lg={4}
                xl={4}
                key={brand}
                mt={1}
                sx={{
                  textAlign: "center",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    display: index > 0 && index % 3 !== 0 ? "block" : "none",
                    position: "absolute",
                    left: 0,
                    top: "25%",
                    height: "50%",
                    width: "1px",
                    backgroundColor: "rgb(188, 186, 186)",
                  },
                  pb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: "8px",
                    color: DARK_PURPLE,
                  }}
                >
                  {brand}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_PURPLE,
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "19.12px",
                    letterSpacing: "0%",
                    textAlign: "center",
                  }}
                >
                  {data.share}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: DARK_PURPLE,
                    fontSize: "9px",
                    lineHeight: "10.93px",
                    letterSpacing: "4%",
                    textAlign: "center",
                  }}
                >
                  {data.percentage}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default FocusModelPerformance;
