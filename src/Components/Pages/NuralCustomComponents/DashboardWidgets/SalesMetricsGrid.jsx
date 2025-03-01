import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DARK_PURPLE,
  ERROR_RED,
  ERROR_RED2,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const MetricCard = styled(Paper)(({ theme, color }) => ({
  width: "180.75px",
  height: "92px",
  padding: "8px 12px",
  borderRadius: "8px",
   
  backgroundColor: LIGHT_GRAY2,
}));

const SalesMetricsGrid = ({ metrics }) => {
  // If odd number of metrics, separate the last one
  const lastMetric = metrics.length % 2 !== 0 ? metrics[metrics.length - 1] : null;
  const regularMetrics = lastMetric ? metrics.slice(0, -1) : metrics;
  
  // Split remaining metrics into odd and even positions
  const firstRow = regularMetrics.filter((_, index) => index % 2 === 0);
  const secondRow = regularMetrics.filter((_, index) => index % 2 === 1);

  return (
    <Grid container sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <Box sx={{ 
        display: 'flex',
        gap: '16px',
      }}>
        {/* Left side - Regular cards */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* First Row */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
          }}>
            {firstRow.map((metric, index) => (
              <MetricCard key={index * 2} color={metric.backgroundColor} 
              sx={{
                backgroundColor: metric.trend > 0 ? "" : ERROR_RED
              }}>
                <Typography
                  variant="body2"
                  color={metric.titleColor || "text.secondary"}
                  sx={{
                    mt: 1,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    textAlign: "start",
                    color:  metric.trend > 0 ? DARK_PURPLE : ERROR_RED2,
                  }}
                >
                  {metric.title}
                </Typography>

                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    fontSize: "24px",
                    color:  metric.trend > 0 ? DARK_PURPLE : ERROR_RED2,

                  }}
                >
                  {metric.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: metric.trend > 0 ? "success.main" : "error.main",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      textAlign: "center",
                    }}
                  >
                    {metric.trend > 0 ? "+" : ""}
                    {metric.trend}% {metric.comparedTo}
                  </Typography>
                </Box>
              </MetricCard>
            ))}
          </Box>

          {/* Second Row */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
          }}>
            {secondRow.map((metric, index) => (
              <MetricCard key={(index * 2) + 1} color={metric.backgroundColor}>
                <Typography
                  variant="body2"
                  color={metric.titleColor || "text.secondary"}
                  sx={{
                    mt: 1,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    textAlign: "start",
                    color: PRIMARY_BLUE2,
                  }}
                >
                  {metric.title}
                </Typography>

                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    fontSize: "24px",
                    color: DARK_PURPLE,
                  }}
                >
                  {metric.value}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: metric.trend > 0 ? "success.main" : "error.main",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      textAlign: "center",
                    }}
                  >
                    {metric.trend > 0 ? "+" : ""}
                    {metric.trend}% {metric.comparedTo}
                  </Typography>
                </Box>
              </MetricCard>
            ))}
          </Box>
        </Box>

        {/* Last card spanning two rows if exists */}
        {lastMetric && (
          <MetricCard 
            color={lastMetric.backgroundColor}
            sx={{ 
              height: '215px',  // Adjust height to span two rows + gap
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="body2"
              color={lastMetric.titleColor || "text.secondary"}
              sx={{
                mt: 1,
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "10px",
                lineHeight: "13.66px",
                letterSpacing: "4%",
                textAlign: "start",
                color: PRIMARY_BLUE2,
              }}
            >
              {lastMetric.title}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                mt: 1,
                fontWeight: "bold",
                fontSize: "24px",
                color: DARK_PURPLE,
              }}
            >
              {lastMetric.value}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: lastMetric.trend > 0 ? "success.main" : "error.main",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "13.66px",
                  letterSpacing: "4%",
                  textAlign: "center",
                }}
              >
                {lastMetric.trend > 0 ? "+" : ""}
                {lastMetric.trend}% {lastMetric.comparedTo}
              </Typography>
            </Box>
          </MetricCard>
        )}
      </Box>
    </Grid>
  );
};

export default SalesMetricsGrid;
