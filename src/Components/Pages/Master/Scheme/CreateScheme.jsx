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
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
const options = [
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
];
const tabs = [
  { label: "Add Scheme", value: "create-scheme" },
  { label: "Search", value: "view-scheme" },
];

const templates = [
  {
    name: "Template 1",
    onView: () => console.log("Reference Data 1"),
    onDownload: () => console.log("Download Reference Data 1"),
  },
  {
    name: "Template 2",
    onView: () => console.log("Reference Data 2"),
    onDownload: () => console.log("Download Reference Data 2"),
  },
  {
    name: "Template 3",
    onView: () => console.log("Reference Data 3"),
    onDownload: () => console.log("Download Reference Data 3"),
  },
  {
    name: "Template 4",
    onView: () => console.log("Reference Data 4"),
    onDownload: () => console.log("Download Reference Data 4"),
  },
];
const CreateScheme = () => {
  const [activeTab, setActiveTab] = React.useState("create-scheme");
  const [selectedFormat, setSelectedFormat] = React.useState("all");

  const [selectedValue1, setSelectedValue1] = useState("");
  const [selectedValue2, setSelectedValue2] = useState("");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("#");
    } else if (value === "batch") {
      navigate("#");
    }
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
            <BreadcrumbsHeader pageTitle="Scheme" />
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
                  title="Create Scheme"
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
                        SCHEME NAME
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
                        SCHEME FOR
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
                        SCHEME ON
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
                          onChange={handleFormatChange}
                          options={options}
                          value={selectedFormat}
                          width="100%"
                          gap="5px"
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
                        PREDEFINED TARGET
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
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
                        PAYOUT TYPE
                      </Typography>
                      <NuralAutocomplete placeholder="Select" width="100%" />
                    </Grid>
                    <Grid item xs={12} md={2}>
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
                        SCHEME FROM
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
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
                        SCHEME TO
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} mt={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={() => console.log("Cancel clicked")}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="NEXT"
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={() => console.log("Proceed clicked")}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                &nbsp;
                <NuralAccordion2 width="100%" title="Upload Users">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={2} direction="column">
                        <Grid item>
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
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
                      <Grid container spacing={2} direction="column">
                        <Grid item>
                          <NuralFileUpload backgroundColor={LIGHT_GRAY2} />
                        </Grid>
                        <Grid item>
                          <NuralUploadStatus
                            width="98%"
                            status="success"
                            title="New Upload Verified"
                            actionText="RETRY UPLOAD"
                            onAction={() => console.log("Retry clicked")}
                          />
                        </Grid>
                        <Grid item mt={-1}>
                          <Grid container spacing={1}>
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
                                text="NEXT"
                                backgroundColor={AQUA}
                                variant="contained"
                                onClick={() => console.log("Upload clicked")}
                                width="100%"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                &nbsp;
                <NuralAccordion2 width="100%" title="Upload SKU & Payout">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid container spacing={2} direction="column">
                        <Grid item>
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
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
                      <Grid container spacing={2} direction="column">
                        <Grid item>
                          <NuralFileUpload backgroundColor={LIGHT_GRAY2} />
                        </Grid>
                        <Grid item>
                          <NuralUploadStatus
                            width="98%"
                            status="success"
                            title="New Upload Verified"
                            actionText="RETRY UPLOAD"
                            onAction={() => console.log("Retry clicked")}
                          />
                        </Grid>
                        <Grid item mt={-1}>
                          <Grid container spacing={1}>
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
                                text="NEXT"
                                backgroundColor={AQUA}
                                variant="contained"
                                onClick={() => console.log("Upload clicked")}
                                width="100%"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateScheme;
