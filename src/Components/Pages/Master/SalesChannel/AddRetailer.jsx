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
import NuralKYCAccordion from "../../NuralCustomComponents/NuralKYCAccordion";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { useNavigate } from "react-router-dom";

//   {
//     name: "Reference Data 1",
//     onView: () => console.log("Reference Data 1"),
//     onDownload: () => console.log("Download Reference Data 1"),
//   },
//   {
//     name: "Reference Data 2",
//     onView: () => console.log("Reference Data 2"),
//     onDownload: () => console.log("Download Reference Data 2"),
//   },
//   {
//     name: "Reference Data 3",
//     onView: () => console.log("Reference Data 3"),
//     onDownload: () => console.log("Download Reference Data 3"),
//   },
//   {
//     name: "Reference Data 4",
//     onView: () => console.log("Reference Data 4"),
//     onDownload: () => console.log("Download Reference Data 4"),
//   },
// ];
const tabs = [
  { label: "Bulk Upload", value: "sales-bulk-upload" },
  { label: "Add Saleschannel", value: "add-sales-channel" },
  { label: "Add Retailer", value: "add-retailer" },
  { label: "Search", value: "search" },
  { label: "Approve Saleschannel", value: "approveSaleschannel" },
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

const fields = [
  {
    label: "PAN NO.",
    placeholder: "XXXXXXXXXXXXX",
    name: "pan",
    value: "",
    onChange: () => {},
    fileName: "File Name",
    onFileSelect: () => {},
  },
  {
    label: "GST NO.",
    placeholder: "XXXXXXXXXXXXX",
    name: "gst",
    value: "",
    onChange: () => {},
    fileName: "File Name",
    onFileSelect: () => {},
  },
];
const AddRetailer = () => {
  const [activeTab, setActiveTab] = React.useState("add-retailer");
  const [selectedFormat, setSelectedFormat] = React.useState("interface");

  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-retailer");
    } else if (value === "batch") {
      navigate("/retailer-excelUpload");
    }
  };

  return (
    <Grid container spacing={0}>
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
        <Grid item xs={12} mt={3} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Sales" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} lg={12} mt={-1}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 0 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Organization Details"
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
                      RETAILER TYPE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                        mb: 1,
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
                      RETAILER CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                        mb: 1,
                      }}
                    >
                      ISD ON COUNTER
                    </Typography>
                    <NuralRadioButton
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      width="100%"
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
                      PARENT SALES CHANNEL
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                        mb: 1,
                      }}
                    >
                      IS CHILD
                    </Typography>
                    <NuralRadioButton
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      margin="0px"
                      width="100%"
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
                      REPORTING HIERARCHY NAME
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                        mb: 1,
                      }}
                    >
                      SALESMAN
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

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
                      CONTACT PERSON
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

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
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      OPENING STOCK DATE
                    </Typography>
                    <NuralCalendar
                      width="87%"
                      placeholder="01/12/24"
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
                      COUNTER POTENTIAL (VALUE)
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      COUNTER POTENTIAL (VOLUME)
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
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
                      NAME OF BANK
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      ACCOUNT HOLDER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      BANK ACCOUNT NUMBER
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      BRANCH LOCATION
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      IFSC CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Retailer Details"
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
                      RETAILER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      RETAILER CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="AUTO-GENERATED"
                      backgroundColor={LIGHT_BLUE}
                      disabled
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
                      MOBILE NO.
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      COUNTRY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                      STATE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                      CITY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={options2}
                      placeholder="SELECT"
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
                      PIN CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      ADDRESS LINE 1
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

                  <Grid item xs={12}>
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
                      ADDRESS LINE 2
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralAccordion2
                title="Geolocation"
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
                      LATITUDE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
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
                      LONGITUDE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralKYCAccordion fields={fields} />
            </Grid>

            <Grid item>
              <Grid container spacing={1}>
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
                    text="PROCEED"
                    backgroundColor={AQUA}
                    variant="contained"
                    onClick={() => console.log("Proceed clicked")}
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

export default AddRetailer;
