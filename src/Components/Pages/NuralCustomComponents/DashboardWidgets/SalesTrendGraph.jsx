import React from "react";
import { Box, Grid, Typography } from "@mui/material";
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
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import {
  transformGraphData,
  formatCurrencyValue,
} from "../../../Common/utils/transformGraphData";

const SalesTrendGraph = ({
  data,
  title,
  height,
  width,
  paperBgColor = LIGHT_GRAY2,
  titleColor = PRIMARY_BLUE2,
  titleSize = "10px",
  tooltipBgColor = AQUA,
  tooltipTextColor = AQUA_DARK,
  tooltipFontSize = "14px",
  gridColor = MEDIUM_BLUE,
  referenceLineColor = "#00D1D1",
  axisColor = PRIMARY_BLUE2,
  axisFontSize = "8px",
  lineWidth = 2,
  dotColor = "#00D1D1",
  dotSize = "8px",
  indicatorSize = 12,
  indicatorColor = DARK_PURPLE,
  indicatorTextSize = "12px",
  paperPadding = 2,
  paperBorderRadius = 2,
  period = "day",
  showLegend = true,
  subtitle = "",
  caseType = "",
}) => {
  const [activeDate, setActiveDate] = React.useState(null);

  const transformedData = transformGraphData(data, period, caseType);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      setActiveDate(label);

      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
      };

      return (
        <Box
          sx={{
            backgroundColor: tooltipBgColor,
            p: 1.5,
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: "700", mb: 1 }}>
            {formatDate(data.date)}
          </Typography>
          {caseType === "asp" ? (
            <Typography sx={{ fontSize: "12px", color: tooltipTextColor }}>
              {(data.asp || 0).toLocaleString()}
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: "12px", color: tooltipTextColor }}>
                {formatCurrencyValue(data.sale)}
              </Typography>
            </>
          )}
        </Box>
      );
    }
    setActiveDate(null);
    return null;
  };

  // If no data or empty array, show empty state
  if (!transformedData || transformedData.length === 0) {
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: titleSize,
                color: titleColor,
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "gray",
                mt: 2,
              }}
            >
              No data available
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

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
          <Grid container>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontSize: titleSize,
                  color: titleColor,
                  fontWeight: 700,
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "8px",
                  lineHeight: "100%",
                  letterSpacing: "4%",
                  textTransform: "uppercase",
                  color: "gray",
                  mb: 1,
                }}
              >
                {subtitle}
              </Typography>
            </Grid>
          </Grid>

          <ResponsiveContainer width="100%" height="95%">
            <LineChart
              data={transformedData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              onMouseLeave={() => setActiveDate(null)}
            >
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="3 3"
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
                interval={0}
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: axisFontSize }}
                tickFormatter={(value) => {
                  if (caseType === "asp") {
                    return `₹${value.toLocaleString()}`;
                  } else {
                    return formatCurrencyValue(value);
                  }
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line
                type="monotone"
                dataKey={caseType === "asp" ? "asp" : "sale"}
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
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={indicatorSize}
                  wrapperStyle={{
                    fontSize: indicatorTextSize,
                    color: indicatorColor,
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