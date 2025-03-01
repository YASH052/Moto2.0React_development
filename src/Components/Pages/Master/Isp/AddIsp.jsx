import { Grid, Typography } from "@mui/material";
import React from "react";
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import { useNavigate } from "react-router-dom";
const templates = [
  {
    name: "Reference Data 1",
    onView: () => console.log("Reference Data 1"),
    onDownload: () => console.log("Download Reference Data 1"),
  },
  {
    name: "Reference Data 2",
    onView: () => console.log("Reference Data 2"),
    onDownload: () => console.log("Download Reference Data 2"),
  },
  {
    name: "Reference Data 3",
    onView: () => console.log("Reference Data 3"),
    onDownload: () => console.log("Download Reference Data 3"),
  },
  {
    name: "Reference Data 4",
    onView: () => console.log("Reference Data 4"),
    onDownload: () => console.log("Download Reference Data 4"),
  },
];
const tabs = [
  { label: "Add Isp", value: "addIsp" },
  { label: "Search", value: "searchIsp" },
];
const options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const options2 = [
  "Nural Network",
  "Deep Learning",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
];

const AddIsp = () => {
  const [activeTab, setActiveTab] = React.useState("addIsp");
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-isp");
    } else if (value === "batch") {
      navigate("/isp-upload");
    }
  };

  return (
    <Grid container spacing={0}>
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
          zIndex: 1200, // Higher z-index
          backgroundColor: "#fff", // Add background color
          ml: 1,
          pb: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="ISP" />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        sx={{
          position: "sticky",
          top: "48px", // Adjust this value based on your Breadcrumbs height
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

      <Grid container spacing={0} lg={12} mt={1}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Store Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      STORE CODE
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Store Code"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                      }}
                    >
                      SELECT MODE
                    </Typography>
                    <NuralRadioButton
                      onChange={handleFormatChange}
                      options={[
                        { value: "interface", label: "Interface" },
                        { value: "batch", label: "Batch" },
                      ]}
                      value={selectedFormat}
                      width="100%"
                      gap="5px"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      STORE NAME
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Store Code"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                      }}
                    >
                      SELECT MODE
                    </Typography>
                    <Grid item xs={12} md={6} lg={6} ml={2} mt={1}>
                      <NuralAutocomplete
                        options={options2}
                        placeholder="Select Store"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralAccordion
                titleColor={DARK_PURPLE}
                backgroundColor={LIGHT_GRAY2}
                buttonColor={PRIMARY_BLUE2}
                buttonBg={MEDIUM_BLUE}
                width="100%"
                referenceIcon1={"./Icons/downloadIcon.svg"}
                referenceIcon2={"./Icons/downloadIcon.svg"}
                title="Reference Data"
                buttons={false}
                templates={templates}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Personal Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      ISP NAME
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Isp Name"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      ISP CODE
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Isp Code"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      MOBILE NUMBER
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Mobile Number"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      EMAIL ID
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Email Id"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      JOINING DATE
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Joining Date"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      AGENCY
                    </Typography>
                    <NuralAutocomplete
                      options={options2}
                      placeholder="Select Agency"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      USERNAME
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Username"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      PASSWORD
                    </Typography>
                    <NuralTextField
                      placeholder="Enter Password"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
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
                        mb: 1,
                      }}
                    >
                      IMEI
                    </Typography>
                    <NuralTextField
                      width="87%"
                      placeholder="Enter IMEI"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
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
                    text="PROCEED"
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
    </Grid>
  );
};

export default AddIsp;
