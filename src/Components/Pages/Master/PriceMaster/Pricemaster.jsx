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
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";

const tabs = [
  { label: "Price List Name", value: "pricelistname" },
  { label: "Price List", value: "pricelist" },
  { label: "Search", value: "search" },
];

const ListItem = ["country", "state"];

const options = ["Country 1", "Country 2", "Country 3", "Country 4"];

const Pricemaster = () => {
  const [activeTab, setActiveTab] = React.useState("pricelistname");
  const [selectedValue, setSelectedValue] = useState("Country 1");

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
          <BreadcrumbsHeader pageTitle="Price Master" />
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
        {activeTab === "pricelistname" && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Agency Details"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      {/* First Dropdown */}
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
                          AGENCY CODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          backgroundColor={LIGHT_BLUE}
                          options={ListItem}
                          fullWidth={true}
                          sx={{ height: "40px" }}
                          onChange={(event, newValue) =>
                            setSelectedValue(newValue)
                          }
                        />
                      </Grid>

                      {/* Second Field - Conditionally Rendered */}
                      {selectedValue === "state" ? (
                        // If "state" is selected, show another dropdown
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
                            placeholder="country"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                        </Grid>
                      ) : (
                        // If "country" is selected, show only the text field
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
                            Agency Name
                          </Typography>
                          <NuralTextField
                            placeholder="xxxxx"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                        </Grid>
                      )}

                      {/* If "state" is selected, move the text field to the next row */}
                      {selectedValue === "state" && (
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
                            Agency Name
                          </Typography>
                          <NuralTextField
                            placeholder="xxxxx"
                            backgroundColor={LIGHT_BLUE}
                            fullWidth={true}
                            sx={{ height: "40px" }}
                          />
                        </Grid>
                      )}
                    </Grid>

                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      {/* First Dropdown */}
                      <Grid item xs={12} md={6} lg={6}>


                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between", // 🔹 Space between both texts
                            alignItems: "center", // 🔹 Align vertically in center
                            marginTop: 2, // 🔹 Space from top
                          }}
                        >
                          {/* Left Side - COUNTRY MAPPING */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "13.66px",
                              letterSpacing: "4%",
                            }}
                          >
                            COUNTRY MAPPING
                          </Typography>

                          {/* Right Side - SELECT ALL */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "13.66px",
                              letterSpacing: "4%",
                            }}
                          >
                            SELECT ALL
                          </Typography>
                        </Box>

                        <Grid
                          container
                          spacing={2}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {options.map((option, index) => (
                            <Grid
                              item
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {/* Checkbox */}
                              <Checkbox
                                checked={selectedValue === option}
                                onChange={() => setSelectedValue(option)}
                                sx={{
                                  "&.Mui-checked": {},
                                  borderRadius: "4px",
                                }}
                              />

                              {/* Country Name with Blue Background When Selected */}
                              <Typography
                                sx={{
                                  color:
                                    selectedValue === option ? WHITE : BLACK,
                                  backgroundColor:
                                    selectedValue === option
                                      ? PRIMARY_BLUE
                                      : "transparent",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "16px",
                                  fontWeight: 500,
                                  width: "120px",
                                  textAlign: "center",
                                }}
                              >
                                {option}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
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
                  text="SAVE"
                  backgroundColor={AQUA}
                  variant="contained"
                  onClick={() => console.log("Upload clicked")}
                  width="100%"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Pricemaster;
