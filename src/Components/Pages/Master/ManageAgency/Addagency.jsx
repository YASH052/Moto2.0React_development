import { Grid, Typography } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  MEDIUM_BLUE
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import { Search, FileDownload } from "@mui/icons-material";

const tabs = [
  { label: "Add Agency", value: "addAgency" },
  { label: "Search", value: "searchAgency" },
];

const AddAgancy = () => {
  const [activeTab, setActiveTab] = React.useState("addAgency");

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Grid container spacing={0}>
        {" "}
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
            zIndex: 1200,
            backgroundColor: "#fff",
            ml: 1,
            pb: 1,
          }}
        >
          <BreadcrumbsHeader pageTitle="Manage Agency" />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={12}
          sx={{
            position: "sticky",
            top: "48px",
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
        {activeTab === "addAgency" && (
          <Grid container spacing={2}>
            {/* Agency Details */}
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Agency Details"
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
                          Agency name
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
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
                          Agency code
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>

            {/* Contact Details */}
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Contact Details"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Grid container spacing={2} mt={1}>
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
                          Contact Person
                        </Typography>
                        <NuralTextField
                          width="87%"
                          placeholder="xxxxx"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
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
                          Mobile No.
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
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
                          Email
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
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
                          Username
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
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
                          Password
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxx"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12}>
                        <NuralButton
                          text="ADD CONTACT +"
                          backgroundColor={PRIMARY_BLUE2}
                          variant="contained"
                          onClick={() => console.log("Add Contact clicked")}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid container spacing={1} sx={{ margin: 2 }}>
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
                  text="CREATE"
                  backgroundColor={AQUA}
                  variant="contained"
                  onClick={() => console.log("Upload clicked")}
                  width="100%"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
        {activeTab === "searchAgency" && (
          <Grid item xs={12} md={12} lg={12} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Contact Details"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3} lg={3}>
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
                       Agency Name
                      </Typography>
                      <NuralAutocomplete
                        placeholder="Select"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
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
                       Agency Code
                      </Typography>
                      <NuralTextField
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
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
                       mobile no.
                      </Typography>
                      <NuralTextField
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
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
                     username
                      </Typography>
                      <NuralTextField
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} mt={1} alignItems="center">
                    {/* First button - 20% width */}
                    <Grid item xs={12} md={1} lg={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={() => console.log("Upload clicked")}
                        width="100%"
                      />
                    </Grid>

                    {/* Second button - 40% width */}
                    <Grid item xs={12} md={4} lg={4}>
                      <NuralButton
                        text="SEARCH"
                        backgroundColor={PRIMARY_BLUE2}
                        variant="contained"
                        onClick={() => console.log("Add Contact clicked")}
                        width="100%"
                        startIcon={<Search />}
                      />
                    </Grid>

                    {/* Third button - 40% width */}
                    <Grid item xs={12} md={4} lg={4}>
                      <NuralButton
                        text="EXPORT"
                        backgroundColor={MEDIUM_BLUE}
                        variant="contained"
                        onClick={() => console.log("Add Contact clicked")}
                        width="100%"
                        endIcon={<FileDownload />}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AddAgancy;
