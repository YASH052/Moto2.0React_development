import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import {
  DARK_PURPLE,
  PRIMARY_BLUE2,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  LIGHT_BLUE,
} from "./colors";

const ProductAvailabilityCard = ({
  productName,
  scrCompliance,
  zeroStock,
  inventory,
  totalStock,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "12px",
        
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "14px",
          color: DARK_PURPLE,
          mb: 2,
        }}
      >
        {productName}
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
        <Box sx={{ flex: 1, gap: 2 }}>
          <Box sx={{mb:2}}>
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "10px",
                color: PRIMARY_BLUE2,
              }}
            >
              SCR COMPLIANCE
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: DARK_PURPLE,
                  minWidth: "45px",
                }}
              >
                {scrCompliance}%
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: "14px",
                  backgroundColor: "#8D9EDB",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: `${scrCompliance}%`,
                    height: "100%",
                    backgroundColor: PRIMARY_BLUE2,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontSize: "10px",
                color: PRIMARY_BLUE2,
              }}
            >
              ZERO STOCK
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: DARK_PURPLE,
                  minWidth: "45px",
                }}
              >
                {zeroStock}%
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: "14px",
                  backgroundColor: "#8D9EDB",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: `${zeroStock}%`,
                    height: "100%",
                    backgroundColor: PRIMARY_BLUE2,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "80px",
            height: "90px",
            backgroundColor: PRIMARY_BLUE2,
            borderRadius: "8px",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          backgroundColor: MEDIUM_BLUE,
          p: 1,
          borderRadius: "8px",
          
        }}
      >
        <Grid >
          <Typography
            sx={{
              fontSize: "12px",
              color: DARK_PURPLE,
            }}
          >
            INVENTORY
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: DARK_PURPLE,
            }}
          >
            {inventory} Weeks
          </Typography>
        </Grid>
        <Grid sx={{borderRight: `1px solid ${DARK_PURPLE}`}}></Grid>
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              color: DARK_PURPLE,
            }}
          >
            TOTAL STOCK
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: DARK_PURPLE,
            }}
          >
            {totalStock}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductAvailabilityCard;
