import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
} from "../../../Common/colors";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { Search } from "@mui/icons-material";

const tabs = [
  { label: "Upload", value: "upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "SubCategory" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
];

const Product = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Breadcrumbs Header */}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            backgroundColor: "#fff",
            pb: 1,
          }}
        >
          <BreadcrumbsHeader pageTitle="Product" />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: "48px",
            zIndex: 1200,
            backgroundColor: "#fff",
            pb: 1,
          }}
        >
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2 title="Create" backgroundColor={LIGHT_GRAY2}>
                <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      BAND
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      SUB CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL TYPE
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL MODE
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL NAME
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Text"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL CODE
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Text"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ margin: 2 }}>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => console.log("Upload clicked")}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="SAVE"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={() => console.log("Upload clicked")}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2 title="Create" backgroundColor={LIGHT_GRAY2}>
                <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      SUB CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL TYPE
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL MODE
                    </Typography>
                    <NuralAutocomplete
                      placeholder="Select"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL NAME
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Text"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MODEL CODE
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Text"
                      fullWidth
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ margin: 2 }}>
                  <Grid item xs={12} sm={3}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      sx={{
                        borderColor: PRIMARY_BLUE2,
                        color: PRIMARY_BLUE2,
                        backgroundColor: "transparent",
                        width: "100%",
                        borderRadius: "10px",
                      }}
                      onClick={() => console.log("Cancel clicked")}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <NuralButton
                      text={
                        <>
                          <Search sx={{ mr: 1 }} /> SAVE
                        </>
                      }
                      backgroundColor={AQUA}
                      variant="contained"
                      sx={{
                        width: "100%",
                        color: WHITE,
                        borderRadius: "10px",
                        backgroundColor: PRIMARY_BLUE2,
                      }}
                      onClick={() => console.log("Save clicked")}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Product;
