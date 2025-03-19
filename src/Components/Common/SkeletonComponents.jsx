import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { LIGHT_GRAY2, MEDIUM_BLUE, SKELETON_GRAY } from "./colors";

// Define the skeleton gray color constant

// File Upload Component Skeleton
export const FileUploadSkeleton = () => (
  <Grid container spacing={2} direction="column">
    <Grid item>
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>
    <Grid item>
      <Skeleton variant="rectangular" width="100%" height={80} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>
    <Grid item>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={6}>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

// Accordion File Upload Skeleton
export const AccordionFileUploadSkeleton = ({ sx }) => (
  <Grid container spacing={0}>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>
    <Grid item xs={12} sx={{ mt: 1 }}>
      <Skeleton variant="text" width={80} height={20} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>
    <Grid item xs={12} sx={{ mt: 1 }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Skeleton
            variant="circular"
            sx={{ backgroundColor: SKELETON_GRAY }}
            width={24}
            height={24}
          />
        </Grid>
        <Grid item xs>
          <Skeleton variant="text" width="60%" height={24} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
        <Grid item>
          <Skeleton variant="rectangular" width={24} height={24} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

// Upload Page Skeleton
export const UploadPageSkeleton = () => (
  <Grid container spacing={0}>
    {/* Breadcrumb Skeleton */}
    <Grid item xs={12} md={6} lg={12} mt={1} mb={0} sx={{ ml: 1 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>

    {/* Tabs Skeleton */}
    <Grid item xs={12} md={6} lg={12}>
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>

    <Grid container spacing={0} lg={12} mt={1}>
      {/* Left Column */}
      <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
        <Grid container spacing={2} direction="column">
          {/* Upload Format Skeleton */}
          <Grid item>
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>
          {/* Templates Skeleton */}
          <Grid item>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>
        </Grid>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
        <FileUploadSkeleton />
      </Grid>
    </Grid>
  </Grid>
);

export const LoadingSkeleton = () => {
  return (
    <Grid container spacing={0} lg={12} mt={{ xs: 0, md: 1 }} sx={{ position: "relative", zIndex: 1 }}>
      <Grid item xs={12} sx={{ p: { xs: 2, sm: 2 } }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Box sx={{ bgcolor: LIGHT_GRAY2, p: 2, borderRadius: '4px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="text" width={200} height={30} />
              </Box>
              
              <Grid container spacing={2} mb={2}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: LIGHT_GRAY2, p: 2, borderRadius: '4px' }}>
                    <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                          <Skeleton variant="rectangular" width="100%" height={40} />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={2} md={1}>
                  <Skeleton variant="rectangular" width="100%" height={36} />
                </Grid>
                <Grid item xs={12} sm={10} md={11}>
                  <Skeleton variant="rectangular" width="100%" height={36} />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

// Template List Skeleton
export const TemplateListSkeleton = ({ count = 3 }) => (
  <Grid container spacing={1} direction="column">
    {[...Array(count)].map((_, index) => (
      <Grid item key={index}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Skeleton variant="text" width="60%" height={24} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>
          <Grid item>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ backgroundColor: SKELETON_GRAY }} />
          </Grid>
        </Grid>
      </Grid>
    ))}
  </Grid>
);

// Status Model Skeleton
export const StatusModelSkeleton = () => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" width="100%" height={80} sx={{ backgroundColor: SKELETON_GRAY }} />
    </Grid>
  </Grid>
);

// Content Only Skeleton
export const UploadContentSkeleton = () => (
  <Grid container spacing={0} lg={12}>
    {/* Left Column */}
    <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
      <Grid container spacing={2} direction="column">
        {/* Upload Format Skeleton */}
        <Grid item>
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
        {/* Templates Skeleton */}
        <Grid item>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ backgroundColor: SKELETON_GRAY }} />
        </Grid>
      </Grid>
    </Grid>

    {/* Right Column */}
    <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
      <FileUploadSkeleton />
    </Grid>
  </Grid>
);
