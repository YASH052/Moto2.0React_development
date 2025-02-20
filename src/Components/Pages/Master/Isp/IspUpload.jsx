import { Divider, Grid, Stack, Typography } from "@mui/material";
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
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
const IspUpload = () => {
  const [activeTab, setActiveTab] = React.useState("addIsp");

  const tabs = [
    { label: "Add Isp", value: "addIsp" },
    { label: "Search", value: "searchIsp" },
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
          ml: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Isp" />
      </Grid>

      <Grid item xs={12} md={6} lg={12}>
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>

      <Grid container spacing={2} lg={12} mt={1}>
        <Grid item xs={10} md={6} lg={6}>
          <NuralUploadFormat title="Upload Format" backgroundColor={LIGHT_GRAY2} />
        </Grid>
        <Grid item xs={10} md={6} lg={6}>
          <NuralFileUpload backgroundColor={LIGHT_GRAY2} />
        </Grid>
        <Grid item xs={10} md={6} lg={6}>
          <NuralAccordion
            titleColor={DARK_PURPLE}
            buttonColor={PRIMARY_BLUE2}
            buttonBg={MEDIUM_BLUE}
            width="100%"
            referenceIcon1={"./Icons/downloadIcon.svg"}
            referenceIcon2={"./Icons/downloadIcon.svg"}
            title="Templates"
            templates={templates}
          />
        </Grid>
        <Grid item xs={10} md={6} lg={5.85}>
          <NuralUploadStatus
            width="100%"
            status="success"
            title="New Upload Verified"
            actionText="RETRY UPLOAD"
            onAction={() => console.log("Retry clicked")}
          />
          <Grid container spacing={1} mt={0.5}>
            <Grid item xs={10} md={6} lg={6}>
              <NuralButton
                text="CANCEL"
                variant="outlined"
                borderColor={PRIMARY_BLUE2}
                onClick={() => console.log("Upload clicked")}
                width="100%"
              />
            </Grid>
            <Grid item xs={10} md={6} lg={6}>
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
  );
};

export default IspUpload;
