import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_BLUE,
  WHITE,
  BLACK,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";

const tabs = [
  { label: "Add Target", value: "addtarget" },
  { label: "Search", value: "search" },
];

const Target = () => {
  const [activeTab, setActiveTab] = React.useState("addtarget");
  const [selectedValue1, setSelectedValue1] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Grid container spacing={0}>
        {" "}
        <Grid
          item
          xs={12}
          md={6}
          lg={12}
          mt={1}
          mb={0}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            backgroundColor: "#fff",
            ml: 1,
            pb: 1,
          }}
        >
          <BreadcrumbsHeader pageTitle="Target" />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={12}
          sx={{
            position: "sticky",
            top: "48px",
            zIndex: 1200,
            backgroundColor: "#fff",
            pb: 1,
            ml: 1,
          }}
        >
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="Create Target">
                  {/* First Row - 1 TextField + 2 Dropdowns */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET NAME</Typography>
                       <NuralTextField
                            placeholder="xxxxx"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET FOR</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                        onChange={(event, newValue) =>
                          setSelectedValue1(newValue)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET ON</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                        onChange={(event, newValue) =>
                          setSelectedValue2(newValue)
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row - 4 Dropdowns */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>SCOPE</Typography>
                 <NuralRadioButton
  options={[
    { value: "all", label: "ALL" },
    { value: "custom", label: "CUSTOM" }
  ]}
  // value={selectedValue}
  // onChange={(event) => setSelectedValue(event.target.value)}
  fullWidth
  sx={{ height: "40px" }}
/>

                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>REGION</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>STATE</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>CITY</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                      />
                    </Grid>
                  </Grid>

                  {/* Third Row - 2 Dropdowns + 2 TextFields */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET TYPE</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET BASED ON</Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        fullWidth
                        sx={{ height: "40px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET FROM</Typography>
                       <NuralTextField
                            placeholder="xxxxx"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography  variant="h6"
                                                sx={{
                                                  color: DARK_PURPLE,
                                                  fontFamily: "Manrope",
                                                  fontWeight: 400,
                                                  fontSize: "10px",
                                                  lineHeight: "13.66px",
                                                  letterSpacing: "4%",
                                                  mb: 1,
                                                }}>TARGET TO</Typography>
                      <NuralTextField
                            placeholder="xxxxx"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>




      <Grid container spacing={2} sx={{ marginTop: 2 }}>
  {/* Left Side - Templates Accordion */}
  <Grid item xs={12} md={6} lg={6}>
    <NuralAccordion2 title="Templates" backgroundColor={LIGHT_GRAY2} />
  </Grid>

  {/* Right Side - File Upload */}
  <Grid item xs={12} md={6} lg={6}>
    <NuralFileUpload />
  </Grid>
</Grid>


<Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
  {/* First Dropdown */}
  <Grid item xs={12} sm={4} md={4} lg={4}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      First Dropdown
    </Typography>
    <NuralAutocomplete placeholder="Select" fullWidth />
  </Grid>

  {/* Second Dropdown */}
  <Grid item xs={12} sm={4} md={4} lg={4}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      Second Dropdown
    </Typography>
    <NuralAutocomplete placeholder="Select" fullWidth />
  </Grid>

  {/* Third Dropdown */}
  <Grid item xs={12} sm={4} md={4} lg={4}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      Third Dropdown
    </Typography>
    <NuralAutocomplete placeholder="Select" fullWidth />
  </Grid>

  {/* Fourth Dropdown */}
  <Grid item xs={12} sm={6} md={6} lg={6}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      Fourth Dropdown
    </Typography>
    <NuralAutocomplete placeholder="Select" fullWidth />
  </Grid>

  {/* Fifth Dropdown */}
  <Grid item xs={12} sm={6} md={6} lg={6}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      Fifth Dropdown
    </Typography>
    <NuralAutocomplete placeholder="Select" fullWidth />
  </Grid>

  {/* First TextField */}
  <Grid item xs={12} sm={6} md={6} lg={6}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      First TextField
    </Typography>
    <NuralTextField placeholder="Enter Text" fullWidth />
  </Grid>

  {/* Second TextField */}
  <Grid item xs={12} sm={6} md={6} lg={6}>
    <Typography variant="h6" sx={{ color: DARK_PURPLE, mb: 1 }}>
      Second TextField
    </Typography>
    <NuralTextField placeholder="Enter Text" fullWidth />
  </Grid>
</Grid>

    </>
  );
};

export default Target;
