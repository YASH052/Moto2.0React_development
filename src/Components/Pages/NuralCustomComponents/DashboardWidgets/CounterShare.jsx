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
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CounterShare = ({ data }) => {
  const [selectedPriceBand, setSelectedPriceBand] = useState("ALL");

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

  const brandData = {
    MOTOROLA: { share: "140.15K", percentage: "17%" },
    VIVO: { share: "169K", percentage: "14%" },
    SAMSUNG: { share: "151K", percentage: "18%" },
    OPPO: { share: "150K", percentage: "21%" },
    REALME: { share: "90K", percentage: "8%" },
    XIAOMI: { share: "78K", percentage: "5%" },
    APPLE: { share: "71K", percentage: "4%" },
    OTHERS: { share: "139K", percentage: "23%" },
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Line 1",
        data: [8000, 9000, 7500, 6500, 9000, 11000, 12500],
        borderColor: PRIMARY_BLUE2,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "Line 2",
        data: [4000, 4500, 4000, 5500, 7000, 8500, 9000],
        borderColor: PRIMARY_BLUE2,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "Line 3",
        data: [3000, 3500, 2000, 3000, 4500, 2500, 2000],
        borderColor: PRIMARY_BLUE2,
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
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
          color: DARK_PURPLE
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
          color: DARK_PURPLE
        }
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
        height: "85%",
        backgroundColor: LIGHT_GRAY2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: PRIMARY_BLUE,
          fontSize: "16px",
          fontWeight: 700,
          mb: 2,
        }}
      >
        Counter Share
      </Typography>

      <Box sx={{ mb: 3 }}>
        <NuralAutocomplete
          placeholder="ALL PRICE BANDS"
          width="100%"
          options={[]}
          backgroundColor={LIGHT_GRAY2}
        />
      </Box>

      <Grid container spacing={2}>
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
              MOTOROLA
            </Typography>
            <Typography
              sx={{
                color: DARK_PURPLE,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              140.15K
            </Typography>
            <Typography sx={{ color: DARK_PURPLE, fontSize: "8px" }}>
              17%
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={7} xl={7} >
          <Grid container spacing={1} justifyContent="center">
            {Object.entries(brandData)
              .filter(([brand]) => brand !== "MOTOROLA")
              .map(([brand, data]) => (
                <Grid item xs={3} key={brand}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
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
                    <Typography sx={{ color: DARK_PURPLE, fontSize: "12px" }}>
                      {data.percentage}
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12} pb={2}>
          <Typography
            sx={{
              color: DARK_PURPLE,
              fontSize: "8px",
              mb: 1,
              opacity: 0.7,
            }}
          >
            LAST 6 MONTHS
          </Typography>
          <Box sx={{ height: "200px" }}>
            <Line data={chartData} options={options} />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CounterShare;
