import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Typography, Box, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  AQUA,
  LIGHT_GRAY,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "./colors";

const data = [
  { product: "P1", days: 15 },
  { product: "P2", days: 10 },
  { product: "P3", days: 15 },
  { product: "P4", days: 9 },
  { product: "P5", days: 5 },
  { product: "P6", days: 10 },
  { product: "P7", days: 16 },
  { product: "P8", days: 10 },
  { product: "P9", days: 12 },
  { product: "P10", days: 7 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: AQUA,
          padding: "8px",
          borderRadius: "4px",
          border: "none",
        }}
      >
        <Typography sx={{ color: "#fff", fontSize: "14px" }}>
          PRODUCT {label}
        </Typography>
        <Typography sx={{ color: "#fff", fontSize: "14px" }}>
          {payload[0].value} DAYS
        </Typography>
      </Box>
    );
  }
  return null;
};

const ShelfLifeGraph = () => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "8px",
        backgroundColor: LIGHT_GRAY2,
        // height: "400px",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            marginRight: "8px",
          }}
        >
          Shelf Life
        </Typography>
        <InfoIcon sx={{ fontSize: "16px", color: "#666" }} />
      </Box>
      <Box sx={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="none"
              vertical={false}
              stroke={MEDIUM_BLUE}
            />
            <XAxis
              dataKey="product"
              axisLine={{ stroke: PRIMARY_BLUE2 }}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={{ stroke: PRIMARY_BLUE2, strokeWidth: 1 }}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              orientation="left"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={5} stroke={PRIMARY_BLUE2} strokeWidth={0} />
            <Bar
              dataKey="days"
              fill="#D9D9D9"
              radius={[2, 2, 0, 0]}
              barSize={12}
              isAnimationActive={false}
              onMouseEnter={() => {}}
              onMouseOver={() => {}}
              onMouseMove={() => {}}
              style={{ cursor: "default" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
     
    </Paper>
  );
};

export default ShelfLifeGraph;
