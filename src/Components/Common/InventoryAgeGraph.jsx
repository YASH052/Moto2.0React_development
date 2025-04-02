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
  LIGHT_GRAY2,
  DARK_PURPLE,
  PRIMARY_BLUE2,
  MEDIUM_BLUE,
} from "./colors";

const data = [
  { product: "P1", days: 15 },
  { product: "P2", days: 10 },
  { product: "P3", days: 15 },
  { product: "P4", days: 9 },
  { product: "P5", days: 6 },
  { product: "P6", days: 10 },
  { product: "P7", days: 16 },
  { product: "P8", days: 10 },
  { product: "P9", days: 12 },
  { product: "P10", days: 7 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isHighlighted = label === "P5";
    return (
      <Box
        sx={{
          backgroundColor: isHighlighted ? AQUA : AQUA,
          padding: "8px",
          borderRadius: "4px",
          border: "none",
        }}
      >
        <Typography sx={{ color: isHighlighted ? "#fff" : "#fff" , fontSize: "14px" }}>
          {isHighlighted ? "PRODUCT 1" : `PRODUCT ${label.substring(1)}`}
        </Typography>
        <Typography sx={{ color: isHighlighted ? "#fff" : "#fff" , fontSize: "14px" }}>
          {payload[0].value} DAYS
        </Typography>
      </Box>
    );
  }
  return null;
};

const InventoryAgeGraph = () => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "8px",
        backgroundColor: LIGHT_GRAY2,
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
          Inventory Age [Primary to Tertiary]
        </Typography>
        <InfoIcon sx={{ fontSize: "16px", color: "#666" }} />
      </Box>
      <Box sx={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            barSize={12}
            layout="vertical"
          >
            <CartesianGrid
              horizontal={false}
              stroke={MEDIUM_BLUE}
              opacity={0.1}
            />
            <XAxis
              type="number"
              axisLine={{ stroke: PRIMARY_BLUE2, strokeWidth: 1 }}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              tickFormatter={(value) => {
                if (value === 0) return '<15';
                if (value === 15) return '15-30';
                if (value === 30) return '31-45';
                if (value === 45) return '46-60';
                if (value === 60) return '>60';
                return value;
              }}
            />
            <YAxis
              dataKey="product"
              type="category"
              axisLine={{ stroke: PRIMARY_BLUE2, strokeWidth: 1 }}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={15} stroke={MEDIUM_BLUE} />
            <ReferenceLine x={30} stroke={MEDIUM_BLUE} />
            <ReferenceLine x={45} stroke={MEDIUM_BLUE} />
            <ReferenceLine x={60} stroke={MEDIUM_BLUE} />
            <Bar
              dataKey="days"
              fill="#D9D9D9"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
    </Paper>
  );
};

export default InventoryAgeGraph; 