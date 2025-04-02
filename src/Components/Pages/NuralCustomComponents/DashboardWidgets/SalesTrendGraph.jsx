import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHT_GRAY3,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const SalesTrendGraph = ({
  // Data props
  data,
  // Style props
  title,
  height,
  width,
  paperBgColor = LIGHT_GRAY2, // LIGHT_GRAY2 default
  titleColor = PRIMARY_BLUE2, // PRIMARY_BLUE2 default
  titleSize = "10px",
  tooltipBgColor = AQUA, // AQUA default
  tooltipTextColor = "#0747A6",
  tooltipFontSize = "14px",
  gridColor = MEDIUM_BLUE, // MEDIUM_BLUE default
  referenceLineColor = "#00D1D1",
  axisColor = PRIMARY_BLUE2,
  axisFontSize = "8px", // LIGHT_GRAY3 default
  lineWidth = 2,
  dotColor = "#00D1D1",
  dotSize = "8px",
  indicatorSize = 12,
  indicatorColor = DARK_PURPLE,
  indicatorTextSize = "12px",
  paperPadding = 2,
  paperBorderRadius = 2,
  period = 'week', // Add new prop for time period
  showLegend = true, // Add new prop for legend visibility
}) => {
  const [activeDate, setActiveDate] = React.useState(null);

  // Add function to determine grid line intervals
  const getGridConfig = () => {
    switch (period) {
      case 'week':
        return {
          xTicks: 7, // Show 7 ticks for week view
          yTicks: 5,
          strokeDasharray: '3 3', // Dashed lines
        };
      case 'month':
        return {
          xTicks: 4, // Show 4 ticks for month view (one per week)
          yTicks: 5,
          strokeDasharray: '3 3',
        };
      case 'year':
        return {
          xTicks: 12, // Show 12 ticks for year view (one per month)
          yTicks: 5,
          strokeDasharray: '3 3',
        };
      default:
        return {
          xTicks: 7,
          yTicks: 5,
          strokeDasharray: '3 3',
        };
    }
  };

  const gridConfig = getGridConfig();

  // Add formatting logic based on period
  const formatXAxis = (value) => {
    switch (period) {
      case 'week':
        return `WEEK ${value}`;
      case 'month':
        // Convert month number to short month name
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[value - 1] || value;
      case 'year':
        return value;
      default:
        return value;
    }
  };

  // Custom tooltip component with period-specific formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      setActiveDate(label);
      return (
        <Box
          sx={{
            backgroundColor: tooltipBgColor,
            p: 1,
            borderRadius: "8px",
            minWidth: "80px",
            textAlign: "center",
            transform: "translateY(-20px)",
          }}
        >
          <Typography sx={{ fontSize: "12px" }}>
            {formatXAxis(label)}
          </Typography>
          <Typography
            sx={{
              color: tooltipTextColor,
              fontSize: tooltipFontSize,
              fontWeight: 600,
            }}
          >
            ₹{payload[0].value}
          </Typography>
        </Box>
      );
    }
    setActiveDate(null);
    return null;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          sx={{
            p: paperPadding,
            borderRadius: paperBorderRadius,
            height: height,
            width: width,
            backgroundColor: paperBgColor,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: titleSize,
              color: titleColor,
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <ResponsiveContainer width="100%" height="95%">
            <LineChart
              data={data}
              margin={{ top: 0, right: 20, left: -20, bottom: 5 }}
              onMouseLeave={() => setActiveDate(null)}
            >
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray={gridConfig.strokeDasharray}
                vertical={true}
                horizontal={true}
                tickCount={gridConfig.xTicks}
              />
              {activeDate && (
                <ReferenceLine
                  x={activeDate}
                  stroke={referenceLineColor}
                  strokeWidth={lineWidth}
                />
              )}
              <XAxis
                dataKey="date"
                axisLine={true}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: axisFontSize }}
                tickFormatter={formatXAxis}
                interval={0}
                tickCount={gridConfig.xTicks}
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: axisFontSize }}
                tickFormatter={(value) => `${value / 1000}K`}
                tickCount={gridConfig.yTicks}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              {data && data.length > 0 && Object.keys(data[0])
                .filter(key => key !== 'date')
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key === "total" ? "TOTAL" : key.toUpperCase()}
                    stroke={DARK_PURPLE}
                    strokeWidth={lineWidth}
                    dot={false}
                    activeDot={{
                      r: dotSize,
                      fill: dotColor,
                      stroke: dotColor,
                      strokeWidth: 0,
                    }}
                  />
                ))}
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={indicatorSize}
                  wrapperStyle={{
                    fontSize: indicatorTextSize,
                    color: indicatorColor || DARK_PURPLE,
                    paddingBottom: "10px",
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SalesTrendGraph;
