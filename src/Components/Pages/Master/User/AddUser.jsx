import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import { useNavigate } from "react-router-dom";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
];

const AddUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("add-user");
  
  const tabbs = [
    { label: "Add Location", value: "add-location" },
    { label: "View Location", value: "view-location" },
    { label: "Add User", value: "add-user" },
    { label: "View User", value: "view-user" },
  ];


  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case "add-location":
        navigate("/add-location");
        break;
      case "view-location":
        navigate("/view-location");
        break;
      case "add-user":
        navigate("/add-user");
        break;
      case "view-user":
        navigate("/view-user");
        break;
      default:
        break;
    }
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const regions = ["North", "South", "East", "West", "Central"];
    const states = [
      "Maharashtra",
      "Gujarat",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ];
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

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Enhanced sorting function
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

  // Add search/filter functionality
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.saleType ||
          row.column1
            .toLowerCase()
            .includes(searchValues.saleType.toLowerCase())) &&
        (!searchValues.region ||
          row.column2
            .toLowerCase()
            .includes(searchValues.region.toLowerCase())) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.serialType ||
          row.column6
            .toLowerCase()
            .includes(searchValues.serialType.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0); // Reset to first page when filtering
  };

  // Update the search button click handler
  const handleSearchClick = () => {
    const searchValues = {
      saleType: document.querySelector('[name="saleType"]')?.value || "",
      region: document.querySelector('[name="region"]')?.value || "",
      state: document.querySelector('[name="state"]')?.value || "",
      fromDate: document.querySelector('[name="fromDate"]')?.value || "",
      toDate: document.querySelector('[name="toDate"]')?.value || "",
      serialType: document.querySelector('[name="serialType"]')?.value || "",
    };
    handleSearch(searchValues);
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
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
          <BreadcrumbsHeader pageTitle="Add User" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Rest of the content */}
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2 title="Create User">
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={5} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        USER ROLE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="User Role"
                        options={options}
                        placeholder="Select"
                      />
                    </Grid>
                    <Grid item xs={12} sm={5} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        REPORTING HEIRARCHY
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Reporting Hierarchy"
                        options={options}
                        placeholder="Select"
                      />
                    </Grid>{" "}
                  </Grid>
                </NuralAccordion2>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2 title="User Details">
                  <Grid container spacing={4} pl={0} pr={10}>
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        NAME
                      </Typography>
                      <NuralTextField placeholder="Enter Name" width="100%" />
                    </Grid>
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        MOBILE NO.
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Mobile No."
                        width="100%"
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ALTERNATE MOBILE NO.
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Alternate Mobile No."
                        width="100%"
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        EMAIL ID
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Email ID"
                        width="100%"
                      />
                    </Grid>{" "}
                  </Grid>

                  <Grid container spacing={4} pl={0} pr={10} mt={0.5}>
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        LOGIN ID
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Login ID"
                        width="100%"
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={5} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        PASSWORD
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Password"
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralUploadStatus
                  width="99%"
                  status="success"
                  title="New Upload Verified"
                  actionText="RETRY UPLOAD"
                  height="150px"
                  onAction={() => console.log("Retry clicked")}
                />
              </Grid>

              <Grid
                container
                spacing={1}
                mt={0.5}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <NuralButton
                    text="CANCEL"
                    variant="outlined"
                    color={PRIMARY_BLUE2}
                    fontSize="12px"
                    height="36px"
                    borderColor={PRIMARY_BLUE2}
                    onClick={() => console.log("Upload clicked")}
                    width="100%"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <NuralButton
                    text="SAVE"
                    variant="contained"
                    color={PRIMARY_BLUE2}
                    fontSize="12px"
                    height="36px"
                    backgroundColor={AQUA}
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

export default AddUser;
