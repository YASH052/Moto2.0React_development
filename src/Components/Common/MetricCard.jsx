import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  PRIMARY_BLUE,
  LIGHT_BLUE,
  SUCCESS_GREEN2,
  DARK_GRAY,
  ERROR_RED2, // Import the red color for text
  ERROR_RED,
  ERROR_MSSG, // Import the red color for background
} from "./colors"; // Assuming colors.js is in the same directory

// Helper function to determine the color based on the change value

// Helper function to format numbers using International numbering system (K, M, B) and commas
const formatNumberIndianSystem = (value) => {
  const num = Number(value);
  if (isNaN(num)) {
    return value; // Return original value if it's not a number
  }

  const absNum = Math.abs(num);
  let formattedValue;
  const sign = num < 0 ? "-" : ""; // Preserve sign

  if (absNum >= 1000000000) {
    // Billions
    formattedValue = sign + (absNum / 1000000000).toFixed(1) + " B";
  } else if (absNum >= 1000000) {
    // Millions
    formattedValue = sign + (absNum / 1000000).toFixed(1) + " M";
  } else if (absNum >= 1000) {
    // Thousands
    formattedValue = sign + (absNum / 1000).toFixed(1) + " K";
  } else {
    // Less than 1000
    // Use locale formatting, handles negative signs and potential commas correctly.
    // Using 'en-US' for standard comma separation, can be changed if needed.
    formattedValue = num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return formattedValue;
};

const MetricCard = ({
  type,
  title,
  primaryValue,
  primaryChange,
  secondaryValue,
  secondaryChange,
  onClick,
  style,
}) => {
  // Determine if any change value is negative
  const isNegativeChange = (value) =>
    typeof value === "string" && value.startsWith("-");

  const isAnyChangeNegative =
    isNegativeChange(primaryChange) || isNegativeChange(secondaryChange);

  // Determine colors based on whether any change is negative
  const cardBackgroundColor =
    type == "rat"
      ? ERROR_MSSG
      : type == "rat2"
      ? ERROR_RED
      : isAnyChangeNegative
      ? ERROR_RED
      : LIGHT_BLUE;
  const baseTextColor =
    type == "rat"
      ? ERROR_RED
      : type == "rat2"
      ? ERROR_RED2
      : isAnyChangeNegative
      ? ERROR_RED2
      : PRIMARY_BLUE;
  const changeTextColor =
    type == "rat"
      ? ERROR_RED
      : type == "rat2"
      ? ERROR_RED2
      : isAnyChangeNegative
      ? ERROR_RED2
      : SUCCESS_GREEN2;

  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: cardBackgroundColor,
        color: baseTextColor, // Set base text color dynamically
        // width: 240,
        height: "120px",
        borderRadius: 2,
        boxShadow: 'none',
        cursor: onClick ? 'pointer' : 'default',
        // p: 2, // Padding using MUI system units (1 unit = 8px)
        ...style,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            mt: -1,
            letterSpacing: 0,
            color: baseTextColor, // Apply base text color
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {title}
        </Typography>

        <div>
          {" "}
          {/* Using inline style for margin */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: 2,
              letterSpacing: 0,
              textAlign: "start",
              color: baseTextColor, // Apply base text color
            }}
          >
            {formatNumberIndianSystem(primaryValue)}
            {(type === "rat" || type === "rat2") && (
              <span
                style={{ fontSize: "25px", position: "absolute", right: "30px" }}
              >
                {">"}
              </span>
            )}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: changeTextColor,
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "8px",
              lineHeight: 1,
              letterSpacing: "4%",
              textAlign: "start",
              textTransform: "uppercase",
            }}
          >
            {" "}
            {/* Example: Using SUCCESS_GREEN2 */}
            {primaryChange}
          </Typography>
        </div>

        <div>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: 2,
              letterSpacing: 0,
              textAlign: "start",
              color: baseTextColor, // Apply base text color
            }}
          >
            {formatNumberIndianSystem(parseFloat(secondaryValue)) || 0}
            {/* {console.log("secondaryValue", typeof secondaryValue)} */}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: changeTextColor,
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "8px",
              lineHeight: 1,
              letterSpacing: "4%",
              textAlign: "start",
              textTransform: "uppercase",
            }}
          >
            {" "}
            {/* Example: Using SUCCESS_GREEN2 */}
            {secondaryChange}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
