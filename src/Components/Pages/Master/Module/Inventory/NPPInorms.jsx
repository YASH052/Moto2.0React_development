import { Grid, Typography, Button, Chip, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../../Common/colors";

import NuralButton from "../../../NuralCustomComponents/NuralButton";
import { labelStyle, titleStyle } from "../../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";

import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../../NuralCustomComponents/NuralCalendar";

const NPPInorms = () => {
  const [activeTab, setActiveTab] = React.useState("ai-norms");
  const radioOptions = [
    { value: "yes", label: "Interface" },
    { value: "no", label: "Batch" },
  ];

  return (
    <>
      {/* Rest of the content */}

      <Grid item xs={12}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <NuralAccordion2 title="NPPI Norms" backgroundColor={LIGHT_GRAY2}>
              <Typography variant="h6" sx={titleStyle}>
                Create
              </Typography>
              {/* First Row - Store Category and Demo Type */}
              <Grid
                container
                spacing={2}
                mb={2}
                sx={{
                  gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Grid item xs={12} md={12} lg={12} mb={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 0,
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
                    label="Store Type"
                    options={radioOptions}
                    value={radioOptions[0].value}
                    width="100%"
                    fontWeight={400}
                    fontSize="12px"
                    onChange={(value) => console.log(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    SCR CATEGORY
                  </Typography>
                  <NuralAutocomplete
                    width="100%"
                    placeholder="SELECT"
                    options={[]}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    MODEL
                  </Typography>
                  <NuralAutocomplete
                    width="100%"
                    placeholder="SELECT"
                    options={[]}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    NO. OF UNITS
                  </Typography>
                  <NuralTextField
                    width="100%"
                    placeholder="ENTER NO. OF UNITS"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    FROM DATE
                  </Typography>
                  <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                </Grid>{" "}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    TO DATE
                  </Typography>
                  <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                </Grid>
              </Grid>

              {/* Unit Selection Fields */}
            </NuralAccordion2>

            <Grid container spacing={1} mt={2}>
              <Grid item xs={6} md={6} lg={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  borderColor={PRIMARY_BLUE2}
                  width="100%"
                />
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                <NuralButton
                  text="PROCEED"
                  backgroundColor={AQUA}
                  variant="contained"
                  width="100%"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NPPInorms;
