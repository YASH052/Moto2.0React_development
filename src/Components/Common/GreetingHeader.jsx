import { Grid, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DARK_PURPLE, SECONDARY_BLUE } from "./colors";

const GreetingHeader = () => {
  const [log, setLog] = useState(() => {
    const storedLog = localStorage.getItem("log");
    return storedLog ? JSON.parse(storedLog) : null;
  });

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get current formatted time
  const getCurrentFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' }).toUpperCase();
    const year = now.getFullYear();
    
    return `${formattedHours}:${formattedMinutes} ${ampm}, ${day} ${month} ${year}`;
  };

  // Watch for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLog = localStorage.getItem("log");
      if (storedLog) {
        setLog(JSON.parse(storedLog));
      }
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also check for changes periodically (every 5 seconds)
    const interval = setInterval(handleStorageChange, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Grid item xs={12} mt={1} mb={0} ml={1}>
      <Grid item xs={12} md={12} lg={12} mt={2}>
        <Stack direction="row" spacing={0}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              letterSpacing: "0%",
            }}
            color={DARK_PURPLE}
          >
            {`${getGreeting()} ${log?.userName || ""}`}
          </Typography>
        </Stack>
        <Stack>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "10px",
              lineHeight: "100%",
              letterSpacing: "4%",
              textTransform: "uppercase",
              color: SECONDARY_BLUE,
              m: 1,
            }}
          >
            {`LAST LOGIN : ${log?.lastLoginTime || getCurrentFormattedTime()}`}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default GreetingHeader;
