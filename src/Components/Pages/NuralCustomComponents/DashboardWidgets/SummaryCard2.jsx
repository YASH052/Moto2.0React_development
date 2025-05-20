import React from "react";
import { Box, Typography } from "@mui/material";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";

const SummaryCard2 = ({ title, data }) => {
  return (
    <Box
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "12px",
        padding: "20px 14px",
        marginTop: "10px",
        // width: "210px",

        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "12px",
          marginBottom: "18px",
        }}
      >
        {title}
      </Typography>
      {data.map((item, idx) => (
        <Box
          key={item.label}
          sx={{ marginBottom: idx < data.length - 1 ? "12px" : 0 }}
        >
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 500,
              fontSize: "10px",
              color: DARK_PURPLE,

              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "14px",
              color: "#3B4CB8",
              lineHeight: 1.1,
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SummaryCard2;
