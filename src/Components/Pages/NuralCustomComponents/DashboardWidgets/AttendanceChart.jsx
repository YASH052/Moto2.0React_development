import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NuralAutocomplete from "../NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK2,
  DARK_PURPLE,
  ERROR_MSSG,
  ERROR_RED,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
  WHITE_COLOR,
} from "../../../Common/colors";
import SalesMetricsGrid from "./SalesMetricsGrid";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);
 const tileColors = [
   PRIMARY_BLUE2,
   ERROR_MSSG,
   ERROR_RED,
   MEDIUM_BLUE,
   MEDIUM_BLUE,
   MEDIUM_BLUE,
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
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "92%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  backgroundColor: LIGHT_GRAY2,
  borderRadius: "8px",
}));

const CenterText = styled("div")({
  position: "absolute",
  top: "50%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  "& h2": {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: DARK_PURPLE,
  },
  "& p": {
    margin: 0,
    fontSize: "12px",
    color: DARK_PURPLE,
    opacity: 0.7,
  },
});

const AttendanceChart = () => {
//   const distributors = ["DIST. 1", "DIST. 2", "DIST. 3", "DIST. 4", "DIST. 5"];
//   const [selectedDistributor, setSelectedDistributor] = React.useState(
//     distributors[0]
//   );

  const data = {
    labels: ["DIST. 1", "DIST. 2", "DIST. 3", "DIST. 4", "DIST. 5"],
    datasets: [
      {
        data: [90, 25, 15, 15, 50],
        backgroundColor: [
          AQUA_DARK2,
          ERROR_MSSG,
          MEDIUM_BLUE,
          PRIMARY_BLUE2,
          SECONDARY_BLUE,
        ],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          boxWidth: 6,
          boxHeight: 6,
          padding: 12,
          font: {
            size: 8,
            family: "Manrope",
          },
          color: DARK_PURPLE,
          usePointStyle: true,
          pointStyle: "circle",
          textAlign: "left",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: WHITE,
        titleColor: DARK_PURPLE,
        bodyColor: DARK_PURPLE,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <StyledCard>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: DARK_PURPLE,
          fontFamily: "Manrope",
          fontSize: "10px",
          lineHeight: "13.66px",
          letterSpacing: "0%",
          alignSelf: "flex-start",
          mb: 2,
        }}
      >
        ISP Attendance Overview
      </Typography>

      <Grid container spacing={2}>
        {/* Doughnut Chart Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ position: "relative", height: "250px" }}
        >
          <Doughnut data={data} options={options} />
          <CenterText>
            <h2>103.72K</h2>
            <p>4 WEEKS</p>
          </CenterText>
        </Grid>

        {/* Tiles Section in 2 rows x 3 columns */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: index >= 3 ? PRIMARY_BLUE2 : WHITE_COLOR,
                    paddingTop: "12px",
                    textAlign: "center",
                    borderRadius: "8px",
                    height: "80px",
                    marginTop: "10px",
                    cursor: "pointer",
                    backgroundColor: tileColors[index],
                  }}
                >
                  Present
                  <br />
                  23
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default AttendanceChart;
