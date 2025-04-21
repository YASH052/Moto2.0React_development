import React from "react";
import { Grid, Typography } from "@mui/material";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import {
  LIGHT_GRAY2,
  DARK_PURPLE,
  PRIMARY_BLUE2,
  MEDIUM_BLUE,
} from "../../../../../Common/colors";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../../../NuralCustomComponents/NuralFileUpload";
import NuralUploadFormat from "../../../../NuralCustomComponents/NuralUploadFormat";
import NuralUploadStatus from "../../../../NuralCustomComponents/NuralUploadStatus";
import { headTitle } from "../../../../../Common/commonstyles";

const AddTask = ({
  saveClicked,
  templates,
  labelStyle,
  options,
}) => {
  return (
    <>
      {saveClicked && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <NuralFileUpload backgroundColor={LIGHT_GRAY2} />
            </Grid>
            <Grid item xs={6}>
              <NuralUploadFormat title="UPLOAD FORMAT" />
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={6}>
              <NuralAccordion
                titleColor={DARK_PURPLE}
                buttonColor={PRIMARY_BLUE2}
                buttonBg={MEDIUM_BLUE}
                backgroundColor={LIGHT_GRAY2}
                width="100%"
                referenceIcon1={"./Icons/downloadIcon.svg"}
                referenceIcon2={"./Icons/downloadIcon.svg"}
                title="TEMPLATES"
                templates={templates}
                buttons={true}
              />
            </Grid>
            <Grid item xs={6}>
              <NuralUploadStatus
                status="success"
                title="UPLOAD SUCCESS"
                actionText="VIEW FILE"
                onAction={() => console.log("View clicked")}
                width="100%"
              />
            </Grid>
          </Grid>
        </>
      )}
      {!saveClicked && (
        <Grid
          xs={12}
          borderRadius={2}
          padding={2}
          backgroundColor={LIGHT_GRAY2}
        >
          {/* First Row - 3 NuralAutocomplete */}
          <Typography
            variant="h5"
            sx={headTitle}
          >
            Add Task
          </Typography>

          <Grid item xs={12} md={6} lg={6} mb={2}>
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
              SELECT MODE
            </Typography>
            <NuralRadioButton
              // onChange={handleFormatChange}
              options={[
                { value: "interface", label: "Interface" },
                { value: "batch", label: "Batch" },
              ]}
              // value={selectedFormat}
              width="100%"
              gap="15px"
              marginLeft="-15px"
            />
          </Grid>

          <Grid
            container
            spacing={2}
            mb={2}
            sx={{
              gap: { xs: 0, sm: 0, md: 0 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Grid item xs={12} sm={4} md={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                TASK TYPE
              </Typography>
              <NuralAutocomplete
                label="SKU"
                options={options}
                placeholder="SELECT"
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                TASK TYPE
              </Typography>
              <NuralAutocomplete
                label="SKU"
                options={options}
                placeholder="SELECT"
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                TASK TYPE
              </Typography>
              <NuralAutocomplete
                label="SKU"
                options={options}
                placeholder="SELECT"
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                DESCRIPTION
              </Typography>
              <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                DUE DATE
              </Typography>
              <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                NEED TO VERIFY
              </Typography>
              <NuralAutocomplete
                label="SKU"
                options={options}
                placeholder="SELECT"
                width="100%"
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddTask; 