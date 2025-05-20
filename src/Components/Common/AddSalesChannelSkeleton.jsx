import { Grid, Typography, Skeleton } from "@mui/material";
import React from "react";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SKELETON_GRAY,
} from "./colors";
import NuralAccordion2 from "../Pages/NuralCustomComponents/NuralAccordion2";

const AddSalesChannelSkeleton = ({ title }) => {
  return (
    <Grid container spacing={0} mb={2}>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 1000,
          paddingBottom: 1,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            lg={12}
            mt={3}
            sx={{
              ml: 1,
            }}
          >
            <Skeleton variant="text" width={200} height={32} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <Skeleton variant="rectangular" height={48} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={0} lg={12} mt={1}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Organization Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Grid item xs={12} md={6} lg={6} key={item}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width={150} sx={{ backgroundColor: SKELETON_GRAY }} />
                      </Typography>
                      <Skeleton variant="rectangular" height={56} sx={{ backgroundColor: SKELETON_GRAY }} />
                    </Grid>
                  ))}
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralAccordion2
                title={title}
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                    <Grid item xs={12} md={6} lg={6} key={item}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width={150} sx={{ backgroundColor: SKELETON_GRAY }} />
                      </Typography>
                      <Skeleton variant="rectangular" height={56} sx={{ backgroundColor: SKELETON_GRAY }} />
                    </Grid>
                  ))}
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Business Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      <Skeleton variant="text" width={150} sx={{ backgroundColor: SKELETON_GRAY }} />
                    </Typography>
                    <Skeleton variant="rectangular" height={56} sx={{ backgroundColor: SKELETON_GRAY }} />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
              <NuralAccordion2
                title="Banking Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Grid item xs={12} md={6} lg={6} key={item}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width={150} sx={{ backgroundColor: SKELETON_GRAY }} />
                      </Typography>
                      <Skeleton variant="rectangular" height={56} sx={{ backgroundColor: SKELETON_GRAY }} />
                    </Grid>
                  ))}
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
              <NuralAccordion2
                title="KYC Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  {[1, 2].map((item) => (
                    <Grid item xs={12} md={6} lg={6} key={item}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width={150} sx={{ backgroundColor: SKELETON_GRAY }} />
                      </Typography>
                      <Skeleton variant="rectangular" height={56} sx={{ backgroundColor: SKELETON_GRAY }} />
                    </Grid>
                  ))}
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={6}>
                  <Skeleton variant="rectangular" height={40} sx={{ backgroundColor: SKELETON_GRAY }} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <Skeleton variant="rectangular" height={40} sx={{ backgroundColor: SKELETON_GRAY }} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddSalesChannelSkeleton; 