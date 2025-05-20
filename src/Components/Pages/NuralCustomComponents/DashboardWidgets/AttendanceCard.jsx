import React from "react";
import { Card, Typography, Box, colors } from "@mui/material";
import {
  AQUA_DARK2,
  DARK_PURPLE,
  GREEN_COLOR,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const AttendanceCard = ({
  growth,
  mt,
  title = "ISPs Present Yesterday",
  present = 115,
  total = 143,
  // Style props with default values
  backgroundColor = LIGHT_GRAY2,
  titleColor = DARK_PURPLE,
  valueColor = DARK_PURPLE,
  percentageColor = PRIMARY_BLUE2,
  cardStyles = {
    padding: 1,
    borderRadius: 2,
    minWidth: "144px",
    minHeight: "60px",
  },
  titleStyles = {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "0.04em",
  },
  valueStyles = {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "32.78px",
  },
  percentageStyles = {
    fontFamily: "Manrope",
    color:AQUA_DARK2,
    fontWeight: 700,
    fontSize: "8px",
    lineHeight: "13.66px",
    letterSpacing: "0.04em",
  },
}) => {
  return (
    <Card sx={{ ...cardStyles, backgroundColor, mt }}>
      <Box sx={{ p: 0.5 }}>
        <Typography sx={{ ...titleStyles, color: titleColor }}>
          {title}
        </Typography>

        <Typography sx={{ ...valueStyles, color: valueColor }}>
          {present}
        </Typography>

        <Typography sx={{ ...percentageStyles }}>
          {growth}% ATTENDANCE
        </Typography>
      </Box>
    </Card>
  );
};

export default AttendanceCard;
