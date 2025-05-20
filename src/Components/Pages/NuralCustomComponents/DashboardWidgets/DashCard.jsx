import React from "react";
import { Box, Typography } from "@mui/material";
import { DARK_PURPLE, ERROR_RED, ERROR_RED2 } from "../../../Common/colors";

const DashCard = ({ title, value, change }) => {
  // Convert values to numbers, handling potential string values or special characters
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : Number(value);
  const numericChange = typeof change === 'string' ? parseFloat(change.replace(/[^0-9.-]+/g, '')) : Number(change);
  
  const isNegative = numericValue < 0 || numericChange < 0;
  
  return (
    <Box
      sx={{
        backgroundColor: isNegative ? ERROR_RED : "#E8ECF7",
        borderRadius: "8px",
        gap: "4px",
        padding: "8px",
        // width: "210px",
        height: "94px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        gap:"10px"
      }}
    >
      <Typography
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "10px",
          lineHeight: "100%",
          letterSpacing: "0%",
          textAlign: "start",
          color: isNegative ? ERROR_RED2 : "inherit"
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "100%",
          letterSpacing: "0%",
          textAlign: "start",
          color: isNegative ? ERROR_RED2 : DARK_PURPLE,

        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Manrope",
          fontWeight: 400,
          fontSize: "10px",
          lineHeight: "100%",
          letterSpacing: "4%",
          textAlign: "start",
          textTransform: "uppercase",
          color: isNegative ? ERROR_RED2 : (numericChange < 0 ? "red" : "green"),
        }}
      >
        {change}
      </Typography>
    </Box>
  );
};

export default DashCard;
