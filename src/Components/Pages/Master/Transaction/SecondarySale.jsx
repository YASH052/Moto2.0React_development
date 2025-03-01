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
import { useNavigate } from "react-router-dom";

const SecondarySale = () => {
  const [activeTab, setActiveTab] = React.useState("secondary-sale");
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const navigate = useNavigate();

  const options = [
    { value: "interface", label: "Interface" },
    { value: "batch", label: "Batch" },
  ];
  const tabs = [
    { label: "Primary", value: "primary-transaction" },
    { label: "Intermediate", value: "intermediate-sale" },
    { label: "Secondary", value: "secondary-sale" },
    { label: "Tertiary", value: "tertiary-sale" },
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
        <BreadcrumbsHeader pageTitle="Sales" />
      </Grid>

      <Grid item xs={12} md={6} lg={12}>
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
              <NuralUploadFormat
                title="Upload Format"
                onChange={handleFormatChange}
                backgroundColor={LIGHT_GRAY2}
                options={options}
                value={selectedFormat}
              />
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
                eye={true}
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

export default SecondarySale;
