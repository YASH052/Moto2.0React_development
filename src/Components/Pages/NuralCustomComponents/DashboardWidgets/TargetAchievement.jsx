import React from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
} from "../../../Common/colors";

const CircularProgressWithLabel = ({ value, mainText, subText, label }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={160}
          thickness={4}
          sx={{
            color: SECONDARY_BLUE,
          }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={160}
          thickness={4}
          sx={{
            color: DARK_PURPLE,
            position: "absolute",
            left: 0,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,

            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: DARK_PURPLE,
              lineHeight: 1.2,
            }}
          >
            {mainText}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "8px",
              color: PRIMARY_BLUE2,
              marginTop: "4px",
            }}
          >
            {subText}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: DARK_PURPLE,
              marginTop: "4px",
            }}
          >
            {value}%
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "8px",
              color: PRIMARY_BLUE2,
              textTransform: "uppercase",
              marginTop: "4px",
            }}
          >
            ACHIEVED
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "8px",
          color: SECONDARY_BLUE,
          marginTop: "12px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const TargetAchievement = () => {
  return (
    <Grid
      container
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "8px",
        p: 2,
      
      }}
    >
      <Grid item xs={12}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "10px",
            fontWeight: 700,
            color: PRIMARY_BLUE2,
            marginBottom: "20px",
          }}
        >
          Target Achievement [MTD]
        </Typography>
      </Grid>

      <Grid container spacing={1} justifyContent="space-around" alignItems="center">
        <Grid item>
          <CircularProgressWithLabel
            value={62}
            mainText="930/1500"
            subText="UNITS"
            label="VOLUME"
          />
        </Grid>
        <Grid item>
          <CircularProgressWithLabel
            value={58}
            mainText="₹2.6L/₹4.5L"
            subText="UNITS"
            label="VALUE"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TargetAchievement;
