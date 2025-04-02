import { Grid, Typography, Button, Link } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
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
import { useNavigate } from "react-router-dom";

const PrebookingSKUcreate = () => {
  const [activeTab, setActiveTab] = React.useState("prebooking-sku-create");
  const navigate = useNavigate();
  const tabs = [
    { label: "Add SKU", value: "prebooking-sku-create" },
    { label: "Search", value: "prebooking-sku-view" },
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
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Update the dummy data generator
  const generateDummyData = () => {
    const targetTypes = ["Type A", "Type B", "Type C"];
    const categories = ["Category 1", "Category 2", "Category 3"];
    const targetFors = ["Sales", "Revenue", "Units"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        targetName: `Target ${index + 1}`,
        targetFor: targetFors[Math.floor(Math.random() * targetFors.length)],
        targetFrom: new Date(
          2024,
          Math.floor(Math.random() * 12),
          1
        ).toLocaleDateString(),
        targetTo: new Date(
          2024,
          Math.floor(Math.random() * 12),
          28
        ).toLocaleDateString(),
        targetCategory:
          categories[Math.floor(Math.random() * categories.length)],
        targetType: targetTypes[Math.floor(Math.random() * targetTypes.length)],
        targetBasedOn: `Metric ${index + 1}`,
        target: Math.floor(Math.random() * 1000),
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

  // Update the handleSort function
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

  // Update the handleSearch function
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.isp ||
          row.column1.toLowerCase().includes(searchValues.isp.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.city ||
          row.column2
            .toLowerCase()
            .includes(searchValues.city.toLowerCase())) &&
        (!searchValues.product ||
          row.column7
            .toLowerCase()
            .includes(searchValues.product.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0);
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    const searchValues = {
      isp: document.querySelector('[placeholder="Select"]')?.value || "",
      fromDate: document.querySelector('[placeholder="Select"]')?.value || "",
      toDate: document.querySelector('[placeholder="DD/MM/YY"]')?.value || "",
      state: document.querySelector('[label="State"]')?.value || "",
      city: document.querySelector('[label="City"]')?.value || "",
      product:
        document.querySelector('[placeholder="Select"]')?.lastValue || "",
    };
    handleSearch(searchValues);
  };

  const handleReset = () => {
    // Reset all filters
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset the table to show all rows
    setFilteredRows(rows);
    setPage(0);
    setSortConfig({ key: null, direction: null });
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
          <BreadcrumbsHeader pageTitle="Pre Booking SKU" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
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
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2 title="Add" backgroundColor={LIGHT_GRAY2}>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      label="Category"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      SUB CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      label="Sub Category"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>{" "}
                  <Grid item xs={12} sm={12} md={3}>
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
                      label="Model"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      SKU
                    </Typography>
                    <NuralAutocomplete
                      label="SKU"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      START DATE
                    </Typography>
                    <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      END DATE
                    </Typography>
                    <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                  </Grid>
                </Grid>
                {/* Second Row */}

                {/* Third Row - Buttons */}
              </NuralAccordion2>
              <Grid item mt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => console.log("Cancel clicked")}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="SAVE"
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

      {/* Add this after the NuralAccordion2 component */}
    </Grid>
  );
};

export default PrebookingSKUcreate;
