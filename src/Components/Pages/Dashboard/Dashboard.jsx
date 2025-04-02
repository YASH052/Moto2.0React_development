import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
            marginBottom: "1rem",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to Moto 2.0
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          {/* Your next-generation motorcycle management platform */}
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
