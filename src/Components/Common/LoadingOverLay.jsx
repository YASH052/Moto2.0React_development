import { Grid } from "@mui/material";
import React from "react";

const LoadingOverLay = () => {
  return (
    <Grid
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  ></Grid>
  );
};

export default LoadingOverLay;
