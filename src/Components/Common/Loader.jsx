import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { AQUA } from "./colors";

const Loader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: AQUA,
        }}
      />
    </Box>
  );
};

export default Loader;
