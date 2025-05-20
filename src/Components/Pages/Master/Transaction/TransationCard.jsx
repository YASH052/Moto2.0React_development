import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";
import { Link, useNavigate } from "react-router-dom";

const TransationCard = ({ salesTypes, title, isClickable = false }) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} md={12} lg={12} p={1}>
      <Card
        sx={{
          boxShadow: "none",
          bgcolor: LIGHT_GRAY2,
          p: 2,
          Width: 568,
          height: "250px",
          borderRadius: "8px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "end", mt: 0, mb: 3 }}>
          <img
            width={80}
            height={80}
            src={"./Images/Reports.svg"}
            alt="transaction"
          />
        </Box>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            color={DARK_PURPLE}
            onClick={() => isClickable && navigate(`/${title}`)}
            sx={{
              mb: 2,
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              letterSpacing: "0%",
              cursor: isClickable ? "pointer" : "not-allowed",
              // opacity: isClickable ? 1 : 0.7,
            }}
          >
            {title}
          </Typography>
          <Grid
            container
            spacing={1}
            mb={-3}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(3, auto)",
              gap: " 0px 100px",
            }}
          >
            {salesTypes.map((sale, index) => (
              <Grid item key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #E2E7F6",
                    p: 0.5,
                    fontWeight: 700,
                    gap: "8px",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      borderRadius: 1,
                    },
                  }}
                >
                  <Link
                    style={{
                      display: "flex",
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      textAlign: "left",
                      color: DARK_PURPLE,
                      textDecoration: "none",
                      flex: 1,
                    }}
                    to={sale.link}
                  >
                    {sale.title}
                    &nbsp; &nbsp;
                    <Box>
                      <ArrowForwardIosIcon
                        color={DARK_PURPLE}
                        sx={{ fontSize: "0.8rem" }}
                      />
                    </Box>
                  </Link>
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
