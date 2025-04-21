import { Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  rowstyle,
  tableHeaderStyle,
  titleStyle,
} from "../../../Common/commonstyles";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
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
import { useNavigate } from "react-router-dom";
import NuralPagination from "../../../Common/NuralPagination";
import { getbrandlist, managebrandMaster } from "../../../Api/Api";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import StatusModel from "../../../Common/StatusModel";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";

const FocusModel = () => {
  const [activeTab, setActiveTab] = React.useState("focus-model");

  // Add modelFields array
  const modelFields = Array.from({ length: 8 }, (_, index) => ({
    id: `model-${index + 1}`,
    label: "MODEL/SKU",
    placeholder: "MODEL"
  }));

  const tabbs = [
    { label: "Upload", value: "product-bulk-upload" },
    { label: "Brand", value: "brand" },
    { label: "Category", value: "category" },
    { label: "Sub Category", value: "sub-category" },
    { label: "Model", value: "model" },
    { label: "Color", value: "color" },
    { label: "SKU", value: "sku" },
    { label: "Focus Model", value: "focus-model" },
    { label: "Price", value: "price" },
    { label: "Pre Booking", value: "prebooking-sku-create" },
  ];
  const navigate = useNavigate();
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

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const storeCategories = [
      "Premium",
      "Standard",
      "Budget",
      "Elite",
      "Express",
    ];
    const demoTypes = [
      "In-Store",
      "Window",
      "Counter",
      "Display",
      "Interactive",
    ];
    const units = [
      "Galaxy S21",
      "iPhone 13",
      "Xperia 1",
      "Pixel 6",
      "OnePlus 9",
    ];
    const statuses = ["Active", "Inactive", "Pending"];

    return Array(10)
      .fill()
      .map((_, index) => ({
        sNo: index + 1,
        storeCategory:
          storeCategories[Math.floor(Math.random() * storeCategories.length)],
        demoType: demoTypes[Math.floor(Math.random() * demoTypes.length)],
        unit1: units[Math.floor(Math.random() * units.length)],
        unit2: units[Math.floor(Math.random() * units.length)],
        unit3: units[Math.floor(Math.random() * units.length)],
        unit4: units[Math.floor(Math.random() * units.length)],
        unit5: units[Math.floor(Math.random() * units.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  // Column definitions for the table header
  const columns = [
    { id: "sNo", label: "S.NO", minWidth: 60 },
    { id: "storeCategory", label: "STORE CATEGORY", minWidth: 130 },
    { id: "demoType", label: "DEMO TYPE", minWidth: 130 },
    { id: "unit1", label: "UNIT 1", minWidth: 120 },
    { id: "unit2", label: "UNIT 2", minWidth: 120 },
    { id: "unit3", label: "UNIT 3", minWidth: 120 },
    { id: "unit4", label: "UNIT 4", minWidth: 120 },
    { id: "unit5", label: "UNIT 5", minWidth: 120 },
    { id: "status", label: "STATUS", minWidth: 100 },
    { id: "edit", label: "EDIT", minWidth: 80 },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return {
          color: "#00C950",
          backgroundColor: "#E6F9ED",
        };
      case "Inactive":
        return {
          color: "#FF3A29",
          backgroundColor: "#FFEDEB",
        };
      case "Pending":
        return {
          color: "#FFB200",
          backgroundColor: "#FFF5E6",
        };
      default:
        return {
          color: "#666666",
          backgroundColor: "#F5F5F5",
        };
    }
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
    // Add your edit logic here
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          // Add padding to make space for activity panel
        }}
      >
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
          <Grid item xs={12} mt={0} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Focus Model" />
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
          <Grid item xs={11.8} sx={{ p: { xs: 1, sm: 2,  } }}>
            <Grid
              container
              spacing={1}
              direction="column"
              sx={{
                backgroundColor: LIGHT_GRAY2,
                p: 2,
                borderRadius: "8px",
                mt: 0.5,
                ml: 0.1,
              }}
            >
              <Grid item pr={2} spacing={2}>
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
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TYPE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={[]}
                      placeholder="SELECT"
                    />
                  </Grid>
                </Grid>

                {/* MODEL/SKU Selection Fields */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={2}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                  }}
                >
                  {modelFields.map((field) => (
                    <Grid item xs={12} sm={6} md={3} lg={3} key={field.id}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        {field.label}
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder={field.placeholder}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} my={2}>
              <Grid item xs={12} md={6} lg={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  borderColor={PRIMARY_BLUE2}
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <NuralButton
                  text="SAVE"
                  backgroundColor={AQUA}
                  variant="contained"
                  width="100%"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Add this after the NuralAccordion2 component */}
      </Grid>
    </>
  );
};

export default FocusModel;
