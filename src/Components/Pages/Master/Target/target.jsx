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
import { useNavigate } from "react-router-dom";
const options = [
  { value: "all", label: "ALL" },
  { value: "custom", label: "CUSTOM" },
];
const tabs = [
  { label: "Add Target", value: "target" },
  { label: "Search", value: "view-target" },
];

const templates = [
  {
    name: "Template 1",
    onView: () => console.log("Reference Data 1"),
    onDownload: () => console.log("Download Reference Data 1"),
  },
];
const Target = () => {
  const [activeTab, setActiveTab] = React.useState("target");
  const [selectedValue1, setSelectedValue1] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ position: "relative" }}>
        {" "}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Target" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12} sx={{ pr: 2, mb: 0 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Create Target"
                  backgroundColor={LIGHT_GRAY2}
                >
                  {/* First Row - 1 TextField + 2 Dropdowns */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
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
                        TARGET NAME
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                        TARGET FOR
                      </Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        width="100%"
                        onChange={(event, newValue) =>
                          setSelectedValue1(newValue)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                        TARGET ON
                      </Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        width="100%"
                        onChange={(event, newValue) =>
                          setSelectedValue2(newValue)
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row - 4 Dropdowns */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: DARK_PURPLE,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                          }}
                        >
                          SCOPE
                        </Typography>
                        <NuralRadioButton
                          label="Store Type"
                          options={options}
                          width="100%"
                          fontSize="10px"
                          onChange={(value) => console.log(value)}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        REGION
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        STATE
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        CITY
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                  </Grid>

                  {/* Third Row - 2 Dropdowns + 2 TextFields */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={3}>
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
                        TARGET TYPE
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        TARGET BASED ON
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        TARGET FROM
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                        TARGET TO
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                <Grid container spacing={2} sx={{ marginTop: 0, pr: 2 }}>
                  {/* Left Side - Templates Accordion */}
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralAccordion
                      titleColor={DARK_PURPLE}
                      buttonColor={PRIMARY_BLUE2}
                      buttonBg={MEDIUM_BLUE}
                      backgroundColor={LIGHT_GRAY2}
                      width="100%"
                      referenceIcon1={"./Icons/downloadIcon.svg"}
                      referenceIcon2={"./Icons/downloadIcon.svg"}
                      title="Templates"
                      templates={templates}
                      buttons={true}
                      eye={false}
                    />
                  </Grid>

                  {/* Right Side - File Upload */}
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralFileUpload />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={1} mb={2}>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => console.log("Cancel clicked")}
                      width="98%"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="PROCEED"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={() => console.log("Proceed clicked")}
                      width="98%"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Target;
