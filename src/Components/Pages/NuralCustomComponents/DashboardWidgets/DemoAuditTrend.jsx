import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const LIGHT_BLUE_BG = "#E7ECFA";

const monthLabels = ["CURRENT", "M-1", "M-2", "M-3", "M-4", "M-5"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: AQUA,
          color: "#fff",
          borderRadius: 2,
          px: 2,
          py: 0.5,
          minWidth: 60,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
          {label.toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mt: -0.5 }}>
          {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const DemoAuditTrend = ({ title, trendData, auditData }) => {
  // Transform trendData for the line chart
  const chartData =
    trendData?.map((item) => ({
      month: item.month,
      value:
        item.demoScore ||
        item.mezScore ||
        item.visibilityScore ||
        item.ispScore,
    })) || [];

  // Transform auditData for the last 6 months section
  const last6Months = auditData
    ? [
        auditData.current,
        auditData.m_1,
        auditData.m_2,
        auditData.m_3,
        auditData.m_4,
        auditData.m_5,
      ]
    : [0, 0, 0, 0, 0, 0];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 1,
        background: LIGHT_BLUE_BG,
        height: "95%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 12,
            color: DARK_PURPLE,
            mb: 1,
            pl: 1,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ width: "100%", height: 160, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid stroke="#D6DFF6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: DARK_PURPLE }}
                axisLine={{ stroke: DARK_PURPLE, strokeWidth: 1 }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 80]}
                tick={{ fontSize: 12, fill: DARK_PURPLE }}
                axisLine={{ stroke: DARK_PURPLE, strokeWidth: 1 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={DARK_PURPLE}
                strokeWidth={0.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 0,
          background: MEDIUM_BLUE,
          borderRadius: 2,
          p: 1,
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 10,
            color: DARK_PURPLE,
            letterSpacing: 0.5,
          }}
        >
          LAST 6 MONTHS
        </Typography>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          gap={1}
          width={"60%"}
          margin={"auto"}
        >
          {monthLabels.map((label, idx) => (
            <React.Fragment key={label}>
              <Grid item xs={3} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: 9,
                    color: PRIMARY_BLUE2,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: label === "CURRENT" ? PRIMARY_BLUE2 : DARK_PURPLE,
                    fontWeight: 700,
                    mt: 0.5,
                  }}
                >
                  {last6Months[idx] || 0}
                </Typography>
              </Grid>
              {idx < monthLabels.length - 1 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 0, borderColor: DARK_PURPLE, height: 36 }}
                />
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default DemoAuditTrend;
