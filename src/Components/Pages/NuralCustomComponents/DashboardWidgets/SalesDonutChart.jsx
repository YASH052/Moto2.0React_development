import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NuralAutocomplete from "../NuralAutocomplete";
import { DARK_PURPLE, LIGHT_GRAY, LIGHT_GRAY2, PRIMARY_LIGHT_PURPLE2 } from "../../../Common/colors";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  backgroundColor: LIGHT_GRAY2,
  borderRadius: "8px",
}));

const CenterText = styled("div")({
  position: "absolute",
  top: "55%",
  left: "25%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  "& h2": {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },
  "& p": {
    margin: 0,
    fontSize: "12px",
    color: "#666",
  },
});

const SalesDonutChart = ({ data, brandData }) => {
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <StyledCard>
      <div style={{ position: "relative", height: "300px", width: "100%" }}>
        <Grid container spacing={2} p={1}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: DARK_PURPLE,
              fontFamily: "Manrope",
              fontSize: "10px",
              lineHeight: "13.66px",
              letterSpacing: "0%",
            }}
          >
            Sales by Channel
          </Typography>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ width: "60%" }}>
                <NuralAutocomplete
                  placeholderText="ALL CHANNELS"
                  width="100%"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: DARK_PURPLE,
                    fontSize: "8px",
                    fontWeight: 700,
                    borderRadius: "40px",
                    padding: "4px 12px",
                    minWidth: "unset",
                    "&:hover": {
                      backgroundColor: "#2F3BC9",
                    },
                  }}
                >
                  QTY
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    color: DARK_PURPLE,
                    fontSize: "8px",
                    fontWeight: 700,
                    borderRadius: "40px",
                    padding: "4px 12px",
                    minWidth: "unset",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#2F3BC9",
                    },
                  }}
                >
                  VAL
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Doughnut data={data} options={options} />
          </Grid>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: PRIMARY_LIGHT_PURPLE2,
              fontFamily: "Manrope",
              fontSize: "10px",
              lineHeight: "13.66px",
              letterSpacing: "0%",
              mt: 3,
            }}
          >
            ALL CHANNELS
          </Typography>
          <Grid container spacing={2} p={2} mt={-4}>
            {Object.entries(brandData).map(([brand, data], index) => (
              <Grid
                item
                xs={3}
                md={3}
                lg={3}
                xl={3}
                key={brand}
                mt={1}
                sx={{
                  textAlign: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    display: (index + 1) % 4 !== 0 ? "block" : "none",
                    position: "absolute",
                    right: 0,
                    top: "25%", // Adjust this value to control where the border starts
                    height: "50%", // Adjust this value to control border height
                    width: "1px",
                    backgroundColor: "rgb(188, 186, 186)",
                  },
                  pb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: "8px",
                    color: DARK_PURPLE,
                  }}
                >
                  {brand}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_PURPLE,
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "19.12px",
                    letterSpacing: "0%",
                    textAlign: "center",
                  }}
                >
                  {data.share}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: DARK_PURPLE,
                    fontSize: "9px",
                    // fontWeight: 400,
                    lineHeight: "10.93px",
                    letterSpacing: "4%",
                    textAlign: "center",
                  }}
                >
                  {data.percentage}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CenterText>
              <h2>21M</h2>
              <p>TOTAL SALES</p>
            </CenterText>
          </Grid>
        </Grid>
      </div>
    </StyledCard>
  );
};

export default SalesDonutChart;
