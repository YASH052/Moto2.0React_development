import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  AQUA_DARK2,
  DARK_PURPLE,
  ERROR_MSSG,
  ERROR_RED,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
  WHITE_COLOR,
} from "../../../Common/colors";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define the specific colors for the 5 chart segments
const chartSegmentColors = [
  AQUA_DARK2, // Present
  ERROR_MSSG, // Absent
  ERROR_RED, // Late (Changed from MEDIUM_BLUE based on user edits)
  SECONDARY_BLUE, // Leave
  "#8D9EDB", // Weekly Off (New Color)
];

// Labels for the first 5 chart segments
const firstFiveLabels = ["Present", "Absent", "Late", "Leave", "Weekly Off"];

// Corresponding keys in ISPOverviewList[0] for the first 5 segments
const firstFiveKeys = [
  "present",
  "absent",
  "late",
  "leave",
  "weeklyOff", // Added weeklyOff
];

// Colors used for the tiles (Order: Present, Absent, Late, Leave, Weekly Off, Closed)
// NOTE: This array definition is kept from the original code state provided in context,
// but the tiles themselves might use different colors based on their sx props.
const tileColors = [
  PRIMARY_BLUE2,
  ERROR_MSSG,
  ERROR_RED,
  MEDIUM_BLUE,
  MEDIUM_BLUE,
  MEDIUM_BLUE,
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
  top: "52%",
  left: "48%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: "aqua", // shared color
  "& .label": {
    fontSize: "10px",
  },
  "& .value": {
    fontSize: "24px",
  },
});

const AttendanceChart = ({ ISPOverviewList }) => {
  // Prepare chart data using the first 5 categories from ISPOverviewList
  const chartDataFirstFive =
    ISPOverviewList && ISPOverviewList.length > 0
      ? firstFiveKeys.map((key) => ISPOverviewList[0][key] || 0) // Default to 0
      : [0, 0, 0, 0, 0]; // Default to zeros if no data

  // Get the total present count for the center text
  const totalPresent =
    ISPOverviewList && ISPOverviewList.length > 0
      ? ISPOverviewList[0].present || 0
      : 0;

  // Configure chart options (rotation removed)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // rotation: rotation, // Rotation removed
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
            // Return the raw data value (the count)
            return context.raw || ''; // Use raw value, fallback to empty string
          },
        },
      },
    },
  };

  // Configure chart data object
  const data = {
    labels: firstFiveLabels, // Use labels for the first 5 categories
    datasets: [
      {
        data: chartDataFirstFive, // Use data for the first 5 categories
        backgroundColor: chartSegmentColors, // Use the specific 5 colors
        borderWidth: 0,
        cutout: "75%",
      },
    ],
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
            <div className="label" style={{ color: "#039194" }}>
              Present
            </div>
            <div className="value" style={{ color: "#039194" }}>
              {totalPresent}
            </div>
          </CenterText>
        </Grid>

        {/* Tiles Section in 2 rows x 3 columns */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={1}>
            {/* Attendance status tiles */}
            {ISPOverviewList && ISPOverviewList.length > 0 && (
              <>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: WHITE_COLOR,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[0],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Present
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].present}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: WHITE_COLOR,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[1],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Absent
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].absent}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: WHITE_COLOR,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[2],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Late
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].late}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: PRIMARY_BLUE2,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[3],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Leave
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].leave}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: PRIMARY_BLUE2,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[4],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Weekly Off
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].weeklyOff}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: PRIMARY_BLUE2,
                      paddingTop: "12px",
                      textAlign: "center",
                      borderRadius: "8px",
                      height: "80px",
                      marginTop: "10px",
                      cursor: "pointer",
                      backgroundColor: tileColors[5],
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      Closed
                    </span>
                    <br />

                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "28px",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                    >
                      {ISPOverviewList[0].closed}
                    </span>
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

AttendanceChart.propTypes = {
  ISPOverviewList: PropTypes.array,
};

export default AttendanceChart;
