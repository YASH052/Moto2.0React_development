import { Grid, Typography, Checkbox, Box, Button } from "@mui/material";
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
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
// import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
// import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import { Search, FileDownload } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import { useNavigate } from "react-router-dom";

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
const generateDummyData = () => {
  const regions = ["North", "South", "East", "West", "Central"];
  const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi"];
  const saleTypes = ["Direct", "Distributor", "Online", "Retail"];
  const serialTypes = ["A123", "B456", "C789", "D012", "E345"];

  return Array(50)
    .fill()
    .map((_, index) => ({
      id: `${1000 + index}`,
      column1: saleTypes[Math.floor(Math.random() * saleTypes.length)],
      column2: regions[Math.floor(Math.random() * regions.length)],
      column3: states[Math.floor(Math.random() * states.length)],
      column4: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toLocaleDateString(),
      column5: Math.floor(Math.random() * 10000000),
      column6: serialTypes[Math.floor(Math.random() * serialTypes.length)],
      column7: `Product-${Math.floor(Math.random() * 100)}`,
      column8: Math.floor(Math.random() * 100),
      column9: `Status-${Math.floor(Math.random() * 3)}`,
    }));
};
const tabs = [
  { label: "Price List Name", value: "create-price" },
  { label: "Price List", value: "price-list-name" },
  { label: "Search", value: "price-list-view" },
];

const ListItem = ["COUNTRY", "STATE"];

const ListItemTwo = ["PRICE LIST", "PRICE"];

const AdditionalOptions = ["OPTION 1", "OPTION 2", "OPTION 3", "OPTION 4"];

const options = ["Country 1", "Country 2", "Country 3"];

const PriceListName = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("price-list-name");
  const [selectedValue, setSelectedValue] = useState("Country 1");
  const [selectedType, setSelectedType] = useState("PRICE LIST");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...rows]); // Reset to original order
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      const aValue = a[columnName].toString().toLowerCase();
      const bValue = b[columnName].toString().toLowerCase();

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedRows);
  };

  return (
    <>
      <Grid container spacing={0}>
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
            <BreadcrumbsHeader pageTitle="Price Master" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
        
          <>
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Add Price List"
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
                          PRICE LIST
                        </Typography>
                        <NuralTextField
                          width="100%"
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
                          EFFECTIVE DATE
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="xxxxx"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <NuralFileUpload />
            </Grid>

            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2, marginTop: 2 }}>
              <Grid container spacing={2} direction="column">
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

            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container direction="column">
                <Grid item sx={{ width: "100%", height: "auto", p: 2 }}>
                  {/* Upload Status Component */}
                  <NuralUploadStatus
                    status="success"
                    title="Upload Successful"
                    actionText="VIEW FILE"
                    onAction={() => console.log("View File Clicked")}
                    width="100%"
                    height="228px"
                  />

                  {/* Buttons Section */}
                  <Grid container spacing={1} sx={{ marginTop: 0 }}>
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
                        onClick={() => console.log("Create clicked")}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
       
      </Grid>
    </>
  );
};

export default PriceListName;
