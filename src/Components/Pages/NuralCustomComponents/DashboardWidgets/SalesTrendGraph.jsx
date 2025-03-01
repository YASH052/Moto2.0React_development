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
}) => {
  const [activeDate, setActiveDate] = React.useState(null);

  // Custom tooltip component
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
          <Typography sx={{ fontSize: "12px" }}>{label}</Typography>
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
                vertical={true}
                horizontal={true}
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
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: axisFontSize }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              {["total", "nsm1"].map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key === "total" ? "TOTAL" : "NSM 1"}
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
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SalesTrendGraph;
