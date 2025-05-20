import { Grid, Typography, Button, Link, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import EditIcon from "@mui/icons-material/Edit";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import StatusModel from "../../../Common/StatusModel";
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
import VisibilityIcon from "@mui/icons-material/Visibility";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { iconButtonStyle, tableHeaderStyle, toggleSectionStyle } from "../../../Common/commonstyles";
import { GetModelListForDropdown, GetSKUListForDropdown, UpdateStatusSkuPreBooking, GetSkuPreBookingDetailList } from "../../../Api/Api";
import { scrollToTop } from "../../../Common/commonFunction";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const PrebookingSKUview = ({ onEdit }) => {
  const [modelList, setModelList] = React.useState([])
  const [skuList, setSKUList] = React.useState([])
  const [skuPreBookingDetailList, setSkuPreBookingDetailList] = React.useState([])
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [selectedRowSummaryData, setSelectedRowSummaryData] = useState([]);
  const [showSearchStatus, setShowSearchStatus] = useState(false);
  const [searchStatus, setSearchStatus] = useState(0);
  const [searchMessage, setSearchMessage] = useState("");
  const [isListLoading, setIsListLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const SKELETON_ROWS = 10;
  const [searchParams, setSearchParams] = React.useState({
    modelId: 0,
    skuId: 0,
    startDate: null,//"2025-03-12",
    endDate: null,//"2025-03-12",
    pageIndex: 1,
    pageSize: 10
  });


  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = {
    categories: [
      "Electronics",
      "Appliances",
      "Mobile Phones",
      "Computers",
      "Home Entertainment",
    ],
    subcategories: [
      "Smartphones",
      "Laptops",
      "Tablets",
      "Smart TVs",
      "Refrigerators",
      "Washing Machines",
      "Air Conditioners",
    ],
    models: [
      "iPhone 15",
      "MacBook Pro",
      "Samsung RF28",
      "iPad Air",
      "LG Front Load",
      "Sony Bravia",
      "Dell XPS",
    ],
    skus: [
      "IP15-128-BLK",
      "MBP-14-SLV",
      "RF28-BLK",
      "IPA-256-GRY",
      "LGFL-8KG-WHT",
      "SB-65-BLK",
      "XPS-15-SLV",
    ],
    colors: ["Black", "White", "Silver", "Space Gray", "Blue", "Red", "Gold"],
  };



  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Update the generateDummyData function
  const generateDummyData = () => {
    const getRandomDate = () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 11, 31);
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      ).toLocaleDateString();
    };

    const dummyData = [
      {
        category: "Electronics",
        subCategory: "Smartphones",
        model: "iPhone 15",
        sku: "IP15-128-BLK",
        color: "Black",
        startDate: "01/01/2024",
        endDate: "03/31/2024",
        status: true,
      },
      {
        category: "Electronics",
        subCategory: "Laptops",
        model: "MacBook Pro",
        sku: "MBP-14-SLV",
        color: "Silver",
        startDate: "02/01/2024",
        endDate: "04/30/2024",
        status: false,
      },
      {
        category: "Appliances",
        subCategory: "Refrigerators",
        model: "Samsung RF28",
        sku: "RF28-BLK",
        color: "Black",
        startDate: "01/15/2024",
        endDate: "05/15/2024",
        status: true,
      },
      {
        category: "Electronics",
        subCategory: "Tablets",
        model: "iPad Air",
        sku: "IPA-256-GRY",
        color: "Space Gray",
        startDate: "03/01/2024",
        endDate: "06/30/2024",
        status: true,
      },
      {
        category: "Appliances",
        subCategory: "Washing Machines",
        model: "LG Front Load",
        sku: "LGFL-8KG-WHT",
        color: "White",
        startDate: "02/15/2024",
        endDate: "05/31/2024",
        status: false,
      },
    ];
    return [
      ...dummyData,
      ...Array(45)
        .fill()
        .map(() => ({
          category:
            options.categories[
            Math.floor(Math.random() * options.categories.length)
            ],
          subCategory:
            options.subcategories[
            Math.floor(Math.random() * options.subcategories.length)
            ],
          model:
            options.models[Math.floor(Math.random() * options.models.length)],
          sku: options.skus[Math.floor(Math.random() * options.skus.length)],
          color:
            options.colors[Math.floor(Math.random() * options.colors.length)],
          startDate: getRandomDate(),
          endDate: getRandomDate(),
          status: Math.random() > 0.5,
        })),
    ];
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const fetchInitialData = async () => {
    setIsListLoading(true);
    try {
      const response = await GetSkuPreBookingDetailList(searchParams);
      if (response && response.statusCode == 200) {
        setSkuPreBookingDetailList(response.preBookingDetailsList || []);
        setTotalRecords(response.totalRecords || 0);

      } else {
        setSkuPreBookingDetailList([]);
      }
    } catch (error) {
      setSkuPreBookingDetailList([]);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await fetchInitialData({
      ...searchParams,
      pageIndex: newPage + 1,
      pageSize: rowsPerPage,
    })
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    await fetchInitialData({
      ...searchParams,
      pageIndex: 1,
      pageSize: newRowsPerPage,
    })
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
      // Map column names to their corresponding data properties
      const columnMap = {
        category: "category",
        subcategory: "subCategory", // Map "subcategory" to "subCategory"
        model: "model",
        sku: "sku",
        color: "color",
        startdate: "startDate",
        enddate: "endDate",
      };

      // Get the actual property name from the map
      const propertyName = columnMap[columnName.toLowerCase()];

      if (!a[propertyName]) return 1;
      if (!b[propertyName]) return -1;

      const aValue = a[propertyName].toString().toLowerCase();
      const bValue = b[propertyName].toString().toLowerCase();

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


  const handleSearchClick = async () => {
    setIsListLoading(true);
    console.log(searchParams, "searchParams")
    try {
      const response = await GetSkuPreBookingDetailList(searchParams);
      if (response.statusCode == 200) {
        setSkuPreBookingDetailList(response.preBookingDetailsList);
      }
      else {
        setSkuPreBookingDetailList([])
      }
      setShowSummaryTable(false);
      setSelectedRowSummaryData([]);
    } catch (error) {
      console.log(error, "error")
    } finally {
      setIsListLoading(false);
    }
  }

  const handleReset = async () => {
    const defaultParams = {
      modelId: 0,
      skuId: 0,
      startDate: null,
      endDate: null,
      pageIndex: 1,
      pageSize: 10
    };

    setSearchParams(defaultParams);
    setShowSummaryTable(false);
    setSelectedRowSummaryData([]);
    setSKUList([]);
    setPage(0);
    setSortConfig({ key: null, direction: null });

    const response = await GetSkuPreBookingDetailList(defaultParams);
    setSkuPreBookingDetailList(response?.preBookingDetailsList || []);
  };


  const handleSearchChange = (field, value) => {
    setIsListLoading(true);
    let formattedValue = value;
    let updatedSearchParams = { ...searchParams };

    // Format dates to YYYY-MM-DD
    if (field === 'startDate' || field === 'endDate') {
      if (value) {
        const date = new Date(value);
        formattedValue = date.toISOString().split('T')[0]; // This gives YYYY-MM-DD format
      } else {
        formattedValue = 0;
      }
    }

    updatedSearchParams = {
      ...updatedSearchParams,
      [field]: formattedValue,
    };


    setSearchParams(updatedSearchParams);
    setIsListLoading(false);


  };

  
  const GetModelListDropdown = async () => {

    const body = {
      categoryID: 0,
      modelID: searchParams.modelId,
      subCategoryID: 0,
      brandID: 0
    }

    try {
      const response = await GetModelListForDropdown(body)
      if (response.statusCode == 200) {
        setModelList(response.modelDropdownList)
        // GetSKUListForDropdown();
      }
      else {
        setModelList([])
      }
    } catch (error) {
      console.log(error, "error")
    }
  }

  const GetSKUListDropdown = async () => {
    const body = {

      modelID: searchParams.modelId,
      categoryID: 0,
      subCategoryID: 0,
      brandID: 0,
      skuID: 0
    }
    // console.log(body, "body")
    try {
      const response = await GetSKUListForDropdown(body)
      if (response.statusCode == 200) {
        console.log(response.skuDropdownList, "response.skuDropdownList")
        setSKUList(response.skuDropdownList)
      }
      else {
        setSKUList([])
      }
    } catch (error) {
      console.log(error, "error")
    }

  }



  const handleStatusChange = async (preBookingMasterID) => {
    // Find the current status of the item being changed
    const currentItem = skuPreBookingDetailList.find(
      (item) => item.preBookingMasterID === preBookingMasterID
    );
    if (!currentItem) return; // Item not found, should not happen

    const currentStatus = currentItem.status;
    const newStatus = currentStatus === 1 ? 0 : 1; // Calculate the new status locally

    let body = {
      preBookingMasterID: preBookingMasterID,
      // It seems the API might handle the toggle internally,
      // but if it requires the new status, you'd add it here:
      // status: newStatus
    };

    // Consider adding a loading state for the specific row or the whole table
    // setIsLoading(true); 

    try {
      const res = await UpdateStatusSkuPreBooking(body);
      if (res.statusCode == 200) {
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);

        // Update the local state immediately to reflect the change
        setSkuPreBookingDetailList((prevList) =>
          prevList.map((item) =>
            item.preBookingMasterID === preBookingMasterID
              ? { ...item, status: newStatus } // Update the status of the matched item
              : item
          )
        );

        setTimeout(() => {
          setShowSearchStatus(false);
          setSearchStatus("");
          setSearchMessage("");
        }, 3000);
      } else {
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);
        // Optional: If the API fails, revert the visual state if you optimistically updated it
      }
    } catch (error) {
      console.log(error, "error");
      setShowSearchStatus(true);
      setSearchStatus(error.statusCode || 500); // Use a default error code if needed
      setSearchMessage(error.statusMessage || "Failed to update status."); // Provide a generic message
      // Optional: Revert visual state on catch
    } finally {
      // setIsLoading(false);
    }
  };

  const handleEdit = (row) => {
    console.log("Editing row in View:", row);
    if (onEdit) {
      onEdit(row); // Call the callback prop passed from the parent
    }
    scrollToTop();
  };


  useEffect(() => {

    GetModelListDropdown();
    fetchInitialData();

  }, []);


  useEffect(() => {
    if (searchParams.modelId) {
      GetSKUListDropdown();
    }
  }, [searchParams.modelId]);


  useEffect(() => {
    if (!searchParams.modelId) {
      setSKUList([]);
      // Optionally reset skuId in searchParams if not already handled elsewhere
      // setSearchParams(prev => ({ ...prev, skuId: null }));
    }
  }, [searchParams.modelId]);

  return (
    <Grid container spacing={2} sx={{ position: "relative", p: { xs: 1, sm: 2 } }}>

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
              <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
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
                  <Grid item xs={12} sm={6} md={6}>
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
                      options={modelList}
                      placeholder="SELECT"
                      width="100%"

                      getOptionLabel={(option) => option.modelName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.modelID === value?.modelID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("modelId", newValue?.modelID || null);
                      }}
                      value={
                        modelList.find(
                          (option) => option.modelID === searchParams.modelId
                        ) || null
                      }
                    />


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
                      SKU
                    </Typography>
                    {/* <NuralAutocomplete
                      label="sku"
                      options={options.subcategories}
                      placeholder="SELECT"
                      width="100%"
                    /> */}
                    <NuralAutocomplete
                      label="SKU"
                      options={skuList}
                      placeholder="SELECT"
                      width="100%"
                      disabled={!searchParams.modelId} // Disable if no model is selected
                      getOptionLabel={(option) => option.skuName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.skuID === value?.skuID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("skuId", newValue?.skuID || null);
                      }}
                      value={
                        // Ensure value is null if the selected skuId is not in the current skuList
                        skuList.find(
                          (option) => option.skuID === searchParams.skuId
                        ) || null
                      }
                    />

                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                ></Grid>
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
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      value={searchParams.startDate}
                      onChange={(date) => handleSearchChange("startDate", date)}
                    />
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
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      value={searchParams.endDate}
                      onChange={(date) => handleSearchChange("endDate", date)}
                    />
                  </Grid>
                </Grid>
                {/* Second Row */}

                {/* Third Row - Buttons */}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    // gap: { xs: 2, sm: 2 },
                  }}
                >
                  <Grid item xs={12} sm={2} md={1}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleReset}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={10} md={11}>
                    <NuralTextButton
                      icon={"./Icons/searchIcon.svg"}
                      iconPosition="right"
                      height="36px"
                      backgroundColor={PRIMARY_BLUE2}
                      color="#fff"
                      width="100%"
                      fontSize="12px"
                      onClick={handleSearchClick}
                    >
                      SEARCH
                    </NuralTextButton>
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Add this after the NuralAccordion2 component */}

      {showSearchStatus && (
        <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
          <StatusModel
            width="100%"
            status={searchStatus}
            title={searchMessage}
          />
        </Grid>
      )}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(120vh - 180px)", // Adjusted to account for headers
            overflow: "auto",
            position: "relative",
            "& .MuiTable-root": {
              borderCollapse: "separate",
              borderSpacing: 0,
            },
          }}
        >
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={11}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    borderBottom: "none",
                    boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "14px",
                          lineHeight: "19.12px",
                          letterSpacing: "0%",
                          color: PRIMARY_BLUE2,
                          p: 1,
                        }}
                      >
                        List
                      </Typography>
                    </Grid>

                  </Grid>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    top: "45px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 100,
                    width: "50px",
                    padding: "8px 16px",
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                {[
                  { label: "CATEGORY", key: "category" },
                  { label: "SUB CATEGORY", key: "subcategory" },
                  { label: "MODEL", key: "model" },
                  { label: "COLOR", key: "color" },
                  { label: "START DATE", key: "startdate" },
                  { label: "END DATE", key: "enddate" },
                  { label: "SKU", key: "sku" },

                  { label: "STATUS", sortable: false },
                  { label: "EDIT", sortable: false },
                ].map((header, index) => (
                  <TableCell
                    key={header.label}
                    onClick={() =>
                      header.sortable !== false && handleSort(header.key)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: header.sortable !== false ? "pointer" : "default",
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 100,
                      padding: "8px 16px",
                      minWidth: header.label === "EDIT" ? "60px" : "100px",
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>{header.label}</Grid>
                      {header.sortable !== false && (
                        <Grid
                          item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === header.key ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            )
                          ) : (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              sx={{ height: 16, width: 16 }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Array(SKELETON_ROWS)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton key={index} columns={13} />
                      ))
                  ) */}
            <TableBody>
              {isListLoading ? (
                Array(SKELETON_ROWS)
                  .fill(0)
                  .map((_, index) => (
                    <TableRowSkeleton key={index} columns={13} />
                  ))
              ) : (
                skuPreBookingDetailList
                  .map((row, index) => (
                    <TableRow
                      key={row.preBookingMasterID || index}
                      sx={{
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          width: "50px",
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.category || "Column 1"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.subcategory || "Column 1"}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.model || "Column 1"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.colorName || "Column 1"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.startDate || "Column 1"}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.endDate || "Column 1"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}



                      >
                        <span
                          onClick={() => {
                            const detailData = row.preBookingSkuDetailedList || [];
                            setSelectedRowSummaryData(detailData);
                            setShowSummaryTable(true);

                          }}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}

                        >
                          View
                          <IconButton title="View Details" sx={iconButtonStyle}>
                            <VisibilityIcon
                              sx={{
                                ...iconButtonStyle
                              }} />
                          </IconButton>
                        </span>


                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px"
                        }}
                      >
                        <Switch
                          checked={row.status == 1}
                          onChange={() => handleStatusChange(row.preBookingMasterID)}

                          sx={{
                            ...toggleSectionStyle,
                            "& .MuiSwitch-thumb": {
                              backgroundColor:
                                row.status == 1 ? PRIMARY_BLUE2 : DARK_PURPLE,
                            },

                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "60px",
                        }}
                      >
                        <IconButton size="small" onClick={() => handleEdit(row)} sx={{ ...iconButtonStyle }}>
                          <EditIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2, }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          {/* Custom Pagination */}
          <Grid
            container
            sx={{
              p: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid item>
              <Typography
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "13.66px",
                  letterSpacing: "4%",
                  textAlign: "center",
                }}
                variant="body2"
                color="text.secondary"
              >
                TOTAL RECORDS:{" "}
                <span style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}>
                  {totalRecords} /{" "}
                  {Math.ceil(totalRecords / rowsPerPage)} PAGES
                </span>
              </Typography>
            </Grid>

            <Grid item>
              <Grid
                container
                spacing={1}
                sx={{
                  maxWidth: 300,
                  ml: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  //   gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1.5,
                    fontSize: "10px",
                    color: PRIMARY_BLUE2,
                    fontWeight: 600,
                  }}
                >
                  SHOW :
                </Typography>
                {[10, 25, 50, 100].map((value) => (
                  <Grid item key={value}>
                    <Button
                      onClick={() =>
                        handleChangeRowsPerPage({ target: { value } })
                      }
                      sx={{
                        minWidth: "25px",
                        height: "24px",
                        padding: "4px",
                        borderRadius: "50%",
                        // border: `1px solid ${PRIMARY_BLUE2}`,
                        backgroundColor:
                          rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                        color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                        fontSize: "12px",
                        "&:hover": {
                          backgroundColor:
                            rowsPerPage === value
                              ? PRIMARY_BLUE2
                              : "transparent",
                        },
                        mx: 0.5,
                      }}
                    >
                      {value}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: PRIMARY_BLUE2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "8px",
                  lineHeight: "10.93px",
                  letterSpacing: "4%",
                  textAlign: "center",
                }}
              >
                JUMP TO FIRST
              </Typography>
              <IconButton
                onClick={() => handleChangePage(null, page - 1)}
                disabled={page === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                PAGE {page + 1}
              </Typography>

              <IconButton
                onClick={() => handleChangePage(null, page + 1)}
                disabled={
                  page >= Math.ceil(totalRecords / rowsPerPage) - 1
                }
              >
                <NavigateNextIcon />
              </IconButton>

              <Typography
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "8px",
                  lineHeight: "10.93px",
                  letterSpacing: "4%",
                  textAlign: "center",
                }}
                variant="body2"
              >
                JUMP TO LAST
              </Typography>
              <input
                type="number"
                placeholder="Jump to page"
                min={1}
                max={Math.ceil(totalRecords / rowsPerPage)}
                // value={page + 1}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value, 10) - 1;
                  if (
                    newPage >= 0 &&
                    newPage < Math.ceil(totalRecords / rowsPerPage)
                  ) {
                    setPage(newPage);
                  }
                }}
                style={{
                  width: "100px",
                  height: "24px",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                }}
              />
              <Grid mt={1}>
                <img src="./Icons/footerSearch.svg" alt="arrow" />
              </Grid>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>

      {/* Conditionally render the Summary table */}
      {showSummaryTable && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(120vh - 180px)", // Adjusted to account for headers
              overflow: "auto",
              position: "relative",
              "& .MuiTable-root": {
                borderCollapse: "separate",
                borderSpacing: 0,
              },
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={11}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
                      borderBottom: "none",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Manrope",
                            fontWeight: 700,
                            fontSize: "14px",
                            lineHeight: "19.12px",
                            letterSpacing: "0%",
                            color: PRIMARY_BLUE2,
                            p: 1,
                          }}
                        >
                          Summary
                        </Typography>
                      </Grid>

                    </Grid>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  <TableCell
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 100,
                      width: "50px",
                      padding: "8px 16px",
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid item>S.NO</Grid>
                    </Grid>
                  </TableCell>
                  {[
                    { label: "SKU NAME", key: "skuName" },
                    { label: "COLOR CODE", key: "colorCode" },
                    { label: "SKU CODE", key: "skuCode" },
                    { label: "COLOR NAME", key: "colorName" },
                    // { label: "PREBOOKING AMOUNT", key: "preBookingAmount" },

                    { label: "STATUS", sortable: false },
                    // { label: "EDIT", sortable: false },
                  ].map((header, index) => (
                    <TableCell
                      key={header.label}
                      onClick={() =>
                        header.sortable !== false && handleSort(header.key)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: header.sortable !== false ? "pointer" : "default",
                        position: "sticky",
                        top: "45px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 100,
                        padding: "8px 16px",
                        minWidth: header.label === "EDIT" ? "60px" : "100px",
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{header.label}</Grid>
                        {header.sortable !== false && (
                          <Grid
                            item sx={{ display: "flex", alignItems: "center" }}>
                            {sortConfig.key === header.key ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUpwardIcon
                                  sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                                />
                              ) : (
                                <ArrowDownwardIcon
                                  sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                                />
                              )
                            ) : (
                              <Grid
                                container
                                direction="column"
                                alignItems="center"
                                sx={{ height: 16, width: 16 }}
                              >
                                <ArrowUpwardIcon
                                  sx={{ fontSize: 12, color: "grey.400" }}
                                />
                                <ArrowDownwardIcon
                                  sx={{ fontSize: 12, color: "grey.400" }}
                                />
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>


              <TableBody>
                {selectedRowSummaryData
                  .map((row, index) => (
                    <TableRow
                      key={row.skuID || index} // Use a unique key like skuID if available
                      sx={{
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          width: "50px",
                        }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.skuName || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.colorCode || "N/A"}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.skuCode || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >
                        {row.colorName || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "8px 16px",
                          fontSize: "10px",
                          textAlign: "left",
                          minWidth: "100px",
                        }}
                      >

                        {row.currentStatus}
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Custom Pagination */}
            <Grid
              container
              sx={{
                p: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Grid item>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    textAlign: "center",
                  }}
                  variant="body2"
                  color="text.secondary"
                >
                  TOTAL RECORDS:{" "}
                  <span style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}>
                    {selectedRowSummaryData.length} /{" "}
                    {Math.ceil(selectedRowSummaryData.length / rowsPerPage)} PAGES
                  </span>
                </Typography>
              </Grid>

              <Grid item>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    maxWidth: 300,
                    ml: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    //   gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1.5,
                      fontSize: "10px",
                      color: PRIMARY_BLUE2,
                      fontWeight: 600,
                    }}
                  >
                    SHOW :
                  </Typography>
                  {[10, 25, 50, 100].map((value) => (
                    <Grid item key={value}>
                      <Button
                        onClick={() =>
                          handleChangeRowsPerPage({ target: { value } })
                        }
                        sx={{
                          minWidth: "25px",
                          height: "24px",
                          padding: "4px",
                          borderRadius: "50%",
                          // border: `1px solid ${PRIMARY_BLUE2}`,
                          backgroundColor:
                            rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                          color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                          fontSize: "12px",
                          "&:hover": {
                            backgroundColor:
                              rowsPerPage === value
                                ? PRIMARY_BLUE2
                                : "transparent",
                          },
                          mx: 0.5,
                        }}
                      >
                        {value}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: PRIMARY_BLUE2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "10.93px",
                    letterSpacing: "4%",
                    textAlign: "center",
                  }}
                >
                  JUMP TO FIRST
                </Typography>
                <IconButton
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  PAGE {page + 1}
                </Typography>

                <IconButton
                  onClick={() => setPage(page + 1)}
                  disabled={
                    page >= Math.ceil(selectedRowSummaryData.length / rowsPerPage) - 1
                  }
                >
                  <NavigateNextIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "10.93px",
                    letterSpacing: "4%",
                    textAlign: "center",
                  }}
                  variant="body2"
                >
                  JUMP TO LAST
                </Typography>
                <input
                  type="number"
                  placeholder="Jump to page"
                  min={1}
                  max={Math.ceil(selectedRowSummaryData.length / rowsPerPage)}
                  // value={page + 1}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value, 10) - 1;
                    if (
                      newPage >= 0 &&
                      newPage < Math.ceil(selectedRowSummaryData.length / rowsPerPage)
                    ) {
                      setPage(newPage);
                    }
                  }}
                  style={{
                    width: "100px",
                    height: "24px",
                    paddingRight: "8px",
                    paddingLeft: "8px",
                    borderRadius: "8px",
                    borderWidth: "1px",
                    border: `1px solid ${PRIMARY_BLUE2}`,
                  }}
                />
                <Grid mt={1}>
                  <img src="./Icons/footerSearch.svg" alt="arrow" />
                </Grid>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>
      )} {/* End of conditional rendering */}

    </Grid>
  );
};

export default PrebookingSKUview;
