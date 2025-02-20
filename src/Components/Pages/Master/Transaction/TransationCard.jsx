import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";

const TransationCard = ({ salesTypes, title }) => {
  return (
    <Grid item xs={12} md={12} lg={12} p={1}>
      <Card
        sx={{
          bgcolor: LIGHT_GRAY2,
          p: 2,
          Width: 568,
          height: 270,
          borderRadius: "8px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", mt: 5 }}>
          <img
            width={80}
            height={80}
            src={"./Icons/module.svg"}
            alt="transaction"
          />
        </Box>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            color={DARK_PURPLE}
            sx={{
              mb: 2,
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              letterSpacing: "0%",
            }}
          >
            {title}
          </Typography>
          <Grid container spacing={0}>
            {salesTypes.map((sale, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #E2E7F6",
                    p: 0,

                    fontWeight: 700,
                    gap: "8px",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      borderRadius: 1,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color={DARK_PURPLE}
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      textAlign: "center",
                    }}
                  >
                    {sale.title}
                  </Typography>
                  &nbsp;
                  <ArrowForwardIosIcon
                    color={DARK_PURPLE}
                    sx={{ fontSize: "0.8rem" }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TransationCard;
