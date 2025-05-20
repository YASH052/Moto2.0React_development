import { Box, Typography, Grid, Paper } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { Bar } from "react-chartjs-2";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  MEDIUM_BLUE,
} from "../../../Common/colors";

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
      ticks: {
        font: {
          family: "Manrope",
          size: 10,
        },
        callback: function (value) {
          return value >= 1000 ? value / 1000 + "K" : value;
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
          if (context.datasetIndex === 0) {
            const dataIndex = context.dataIndex;
            const datasets = context.chart.data.datasets;

            const presentValue = datasets[0]?.data[dataIndex] ?? 'N/A';
            const absentValue = datasets[1]?.data[dataIndex] ?? 'N/A';
            const lateValue = datasets[2]?.data[dataIndex] ?? 'N/A';

            return [
              `PRESENT: ${presentValue}`,
              `ABSENT: ${absentValue}`,
              `LATE: ${lateValue}`,
            ];
          }
          return null;
        },
      },
      backgroundColor: "#05CFD3",
      bodyColor: "#026668",
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
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const AttendanceChartWithData = ({ ispGraphList = [] }) => {
  const [selectedDayData, setSelectedDayData] = useState({});

  useEffect(() => {
    if (ispGraphList.length > 0) {
      setSelectedDayData(ispGraphList[ispGraphList.length - 1]);
    }
  }, [ispGraphList]);

  const labels = ispGraphList.map((item) => item.dayName.substring(0, 3));
  const presentData = ispGraphList.map((item) => item.present);
  const absentData = ispGraphList.map((item) => item.absent);
  const lateData = ispGraphList.map((item) => item.late);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Present",
        data: presentData,
        backgroundColor: "#32499F",
        hoverBackgroundColor: "#05CFD3",
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        borderRadius: 4,
      },
      {
        label: "Absent",
        data: absentData,
        backgroundColor: "#8D9EDB",
        hoverBackgroundColor: "#6FF9FC",
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        borderRadius: 4,
      },
      {
        label: "Late",
        data: lateData,
        backgroundColor: "#23346F",
        hoverBackgroundColor: "#039194",
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        borderRadius: 4,
      },
    ],
  };

  const handleChartClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const dataIndex = elements[0].index;
      if (ispGraphList[dataIndex]) {
        setSelectedDayData(ispGraphList[dataIndex]);
      }
    }
  };

  let formattedDate = "N/A";
  if (selectedDayData.date) {
    try {
      const dateObj = new Date(selectedDayData.date);
      if (!isNaN(dateObj.getTime())) {
        const day = dateObj.getDate();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
        formattedDate = `${selectedDayData.dayName || ''}, ${day}${suffix} ${dateObj.toLocaleString('default', { month: 'long' }).toUpperCase()} ${dateObj.getFullYear()}`.toUpperCase();
      } else {
         formattedDate = selectedDayData.dayName ? `${selectedDayData.dayName.toUpperCase()}, INVALID DATE` : "INVALID DATE";
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      formattedDate = selectedDayData.dayName ? `${selectedDayData.dayName.toUpperCase()}, DATE ERROR` : "DATE ERROR";
    }
  }

  const dynamicOptions = {
    ...options,
    onClick: handleChartClick,
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
          ISP Attendance Trend
        </Typography>
      </Grid>

      <Grid item xs={12} md={12} lg={12} xl={12} p={1}>
        <Grid container spacing={0} alignItems="space-between">
          <Grid item xs={6} md={6} lg={6} xl={6} p={2}>
            <Box
              sx={{
                height: 200,
                width: "100%",
                "& canvas": {
                  borderLeft: "1px solid #E0E0E0",
                  borderRight: "1px solid #E0E0E0",
                },
              }}
            >
              <Bar options={dynamicOptions} data={chartData} />
            </Box>
          </Grid>
          <Grid item xs={6} md={6} lg={6} xl={6}>
            <Paper
              sx={{
                backgroundColor: MEDIUM_BLUE,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: 10,
                  lineHeight: "100%",
                  letterSpacing: "4%",
                  textTransform: "uppercase",
                }}
                marginBottom={3}
              >
                {formattedDate}
              </Typography>
              <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid
                  item
                  xs={3}
                  sx={{ borderRight: "1px solid black", marginLeft: "100px" }}
                >
                  <Typography variant="caption" color={PRIMARY_BLUE2} >
                    PRESENT
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.present ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ borderRight: "1px solid black" }} >
                  <Typography variant="caption" color={PRIMARY_BLUE2} >
                    ABSENT
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.absent ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3} >
                  <Typography variant="caption" color={PRIMARY_BLUE2} >
                    LATE
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.late ?? '-'}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={3}
                  marginTop={2}
                  sx={{ borderRight: "1px solid black" }}
                >
                  <Typography
                    variant="caption"
                    color={PRIMARY_BLUE2}
                    marginLeft={4}
                  >
                    LEAVE
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    marginLeft={4}
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.leave ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3} marginTop={2} sx={{ borderRight: "1px solid black" }} >
                  <Typography variant="caption" color={PRIMARY_BLUE2} >
                    WEEKLY OFF
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.weeklyOff ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3} marginTop={2} >
                  <Typography variant="caption" color={PRIMARY_BLUE2} >
                    STORE CLOSED
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_BLUE2}
                  >
                    {selectedDayData.closed ?? '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

AttendanceChartWithData.propTypes = {
  ispGraphList: PropTypes.array.isRequired,
};

export default AttendanceChartWithData;
