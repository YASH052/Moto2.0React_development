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
import StatusModel from "../../../Common/StatusModel";
const options = [
  { value: "all", label: "ALL" },
  { value: "custom", label: "CUSTOM" },
];


const templates = [
  {
    name: "Template 1",
    onView: () => console.log("Reference Data 1"),
    onDownload: () => console.log("Download Reference Data 1"),
  },
];
const SalesMan = () => {
  const [activeTab, setActiveTab] = React.useState("create-salesman");
  const [tabbs, setTabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "create-salesman" },
  ]);
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
            <BreadcrumbsHeader pageTitle="People" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabbs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12} sx={{ pr: 2, mb: 0 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="Create" backgroundColor={LIGHT_GRAY2}>
                  {/* First Row - 1 TextField + 2 Dropdowns */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        SALES CHANNEL
                      </Typography>
                      <NuralAutocomplete
                        placeholder="SELECT"
                        width="100%"
                        options={[]}
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        SALESMAN NAME
                      </Typography>
                      <NuralTextField
                        placeholder="ENTER SALES MAN NAME"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        MOBILE NO.
                      </Typography>
                      <NuralTextField
                        placeholder="ENTER MOBILE NUMBER"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        EMAIL ID
                      </Typography>
                      <NuralTextField
                        placeholder="ENTER EMAIL ID"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
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
                        ADDRESS LINE 1
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER ADDRESS LINE 1"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
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
                        ADDRESS LINE 2
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER ADDRESS LINE 2"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                <Grid container spacing={2} sx={{ marginTop: 0, pr: 2 }}>
                  {/* Left Side - Templates Accordion */}
                  <Grid item xs={12} md={12} lg={12}>
                    <StatusModel
                      title="Successfully Saved"
                      status="200"
                      width="100%"
                      buttonText="Save"
                      onButtonClick={() => console.log("Save clicked")}
                    />
                  </Grid>

                  {/* Right Side - File Upload */}
                </Grid>
                <Grid container spacing={1} mt={1} mb={2}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => console.log("Cancel clicked")}
                      width="98%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="PROCEED"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={() => console.log("Proceed clicked")}
                      width="98%"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <NuralAccordion2
                      title="View"
                      backgroundColor={LIGHT_GRAY2}
                    ></NuralAccordion2>
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

export default SalesMan;
