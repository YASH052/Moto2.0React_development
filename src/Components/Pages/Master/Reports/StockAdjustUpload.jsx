import { Grid, Typography } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";

import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_PURPLE,
  marginBottom: "5px",
  fontWeight: 400,
};
const StockAdjustUpload = () => {
  const [activeTab, setActiveTab] = React.useState("stock-adjust-upload");
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const navigate = useNavigate();


  const tabs = [
    { label: "Stock Adjustment Upload", value: "stock-adjust-upload" },
  ];

  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("View Template 1"),
      onDownload: () => console.log("Download Template 1"),
    },
    {
      name: "Template 2",
      onView: () => console.log("View Template 2"),
      onDownload: () => console.log("Download Template 2"),
    },
    {
      name: "Template 3",
      onView: () => console.log("View Template 3"),
      onDownload: () => console.log("Download Template 3"),
    },
    {
      name: "Template 4",
      onView: () => console.log("View Template 4"),
      onDownload: () => console.log("Download Template 4"),
    },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <Grid container spacing={0} position="relative">
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
          <BreadcrumbsHeader pageTitle="Others" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={0} lg={12} mt={2}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Stock Adjustment Upload"
                backgroundColor={LIGHT_GRAY2}
                width="100%"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      DATE
                    </Typography>
                    <NuralCalendar placeholder="DD/MMM/YYYY" />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      CHANNEL TYPE
                    </Typography>
                    <NuralAutocomplete
                      options={[
                        "Nural Network",
                        "Deep Learning",
                        "Machine Learning",
                      ]}
                      placeholder="SELECT"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      REASON
                    </Typography>
                    <NuralAutocomplete
                      options={[
                        "Nural Network",
                        "Deep Learning",
                        "Machine Learning",
                      ]}
                      placeholder="SELECT"
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} mt={1}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      REMARKS
                    </Typography>
                    <NuralTextField
                      placeholder="ENTER REMARKS"
                      backgroundColor={LIGHT_GRAY2}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
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

        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          sx={{ pr: 2, mt: { xs: 2, sm: 2, md: 0, lg: 0 } }}
        >
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

export default StockAdjustUpload;
