import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DARK_PURPLE } from "../../Common/colors";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "120px",
          fontWeight: 700,
          color: DARK_PURPLE,
          marginBottom: "16px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        COMING SOON
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontSize: "24px",
          fontWeight: 600,
          color: DARK_PURPLE,
          marginBottom: "24px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        Page is under development
      </Typography>

      {/* <Typography
        sx={{
          fontSize: "16px",
          color: "rgba(50, 73, 159, 0.7)",
          marginBottom: "32px",
          textAlign: "center",
          maxWidth: "500px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        The page you are looking for is under development.
      </Typography> */}

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: DARK_PURPLE,
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "40px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "Manrope, sans-serif",
          "&:hover": {
            backgroundColor: "rgba(50, 73, 159, 0.9)",
          },
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
