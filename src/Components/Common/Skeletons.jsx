import React from "react";
import { Box, Grid, Skeleton, TableCell, TableRow } from "@mui/material";
import { LIGHT_GRAY2, SKELETON_GRAY } from "./colors";

export const FormSkeleton = () => {
  return (
    <Grid container spacing={2}>
      {/* First Row */}
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          gap: { xs: 2, sm: 3, md: 0 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Skeleton
            animation="wave"
            variant="text"
            height={"100px"}
            sx={{ mt: 2, backgroundColor: SKELETON_GRAY }}
          />
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          gap: { xs: 2, sm: 3, md: 0 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={5} md={4} key={item}>
            <Skeleton
              animation="wave"
              variant="text"
              width={80}
              height={20}
              sx={{ mb: 1, backgroundColor: SKELETON_GRAY }}
            />
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="100%"
              height={36}
              sx={{ borderRadius: 1, backgroundColor: SKELETON_GRAY }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Button Row */}
      <Grid
        container
        spacing={2}
        sx={{
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Grid item xs={12} sm={2} md={1}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={36}
            sx={{ borderRadius: 1, backgroundColor: LIGHT_GRAY2 }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={11}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="100%"
            height={36}
            sx={{ borderRadius: 1, backgroundColor: LIGHT_GRAY2 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const TableRowSkeleton = ({ columns }) => (
  <TableRow>
    {Array(columns)
      .fill(0)
      .map((_, index) => (
        <TableCell key={index} sx={{ padding: "8px" }}>
          <Box
            sx={{
              height: "20px",
              bgcolor: "rgba(0, 0, 0, 0.06)",
              borderRadius: "4px",
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.6 },
                "50%": { opacity: 0.3 },
                "100%": { opacity: 0.6 },
              },
            }}
          />
        </TableCell>
      ))}
  </TableRow>
);

// Add TableRowSkeleton here if needed
