import { Grid, Typography, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
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

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import {
  fetchCategoryList,
  GetModelListForDropdown,
  GetRelianceStoreType,
  GetRelStoreStockReport,
  GetRetailerListDrpdown,
  GetSalesChannelType,
  GetSalesChannelTypedropdown,
  GetSKUListForDropdown,
  GetStateListForDropdown,
} from "../../../Api/Api";
import { getTodaysDate } from "../../../Common/commonFunction";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton } from "../../../Common/Skeletons";

const TableRowSkeleton = ({ columns }) => {
  return (
    <TableRow>
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <TableCell key={index} sx={{ ...rowstyle }}>
            <Skeleton variant="text" width="80%" height={20} />
          </TableCell>
        ))}
    </TableRow>
  );
};

const StoreReports = () => {
  const [activeTab, setActiveTab] = React.useState("rel-store-stock");
  const [tableData, setTableData] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [channelDropdown, setChannelDropdown] = React.useState([]);
  const [stateDropdown, setStateDropdown] = React.useState([]);
  const [countryDropdown, setCountryDropdown] = React.useState([]);
  const [skuDropdown, setSkuDropdown] = React.useState([]);
  const [modelDropdown, setModelDropdown] = React.useState([]);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [channelTypeDropdown, setChannelTypeDropdown] = React.useState([]);
  const [searchParams, setSearchParams] = useState({
    retailerId: 0,
    relianceStoreType: "",
    stateId: 0,
    productCategoryId: 0,
    modelId: 0,
    skuId: 0,
    closingOnDate: getTodaysDate(),
    pageIndex: 1,
    pageSize: 10,
    showZeroQuantity: 0,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [jumpToPageInput, setJumpToPageInput] = useState("");

  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isChannelTypeLoading, setIsChannelTypeLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isSkuLoading, setIsSkuLoading] = useState(false);
  const [isStateLoading, setIsStateLoading] = useState(false);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = React.useState(true);
  const [showTable, setShowTable] = React.useState(false);

  const tabs = [
    { label: "Stock Report", value: "stock-report" },
    { label: "Stock Adjustment Report", value: "stock-adjustment-report" },
    { label: "Saleschannel Stock SB", value: "saleschannel-stock-sb" },
    { label: "Serial No. Movement", value: "serial-no-moment" },
    { label: "REL Store Stock", value: "rel-store-stock" },
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

  // --- Pagination Handlers --- START ---
  // Handles page change from pagination controls (next/prev buttons)
  const handleChangePage = (event, newPage) => {
    console.log("Changing to page:", newPage + 1); // Log the 1-based page number
    setPage(newPage); // Update local page state (0-indexed)
    const newSearchParams = {
      ...searchParams,
      pageIndex: newPage + 1, // Update searchParams for API (1-indexed)
    };
    console.log("Updating searchParams for pagination:", newSearchParams);
    setSearchParams(newSearchParams);
  };

  // Handles rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log("Changing rows per page to:", newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    const newSearchParams = {
      ...searchParams,
      pageSize: newRowsPerPage,
      pageIndex: 1, // Reset to page 1 for API
    };
    console.log("Updating searchParams for rows per page:", newSearchParams);
    setSearchParams(newSearchParams);
  };

  // Handle input change for jump to page
  const handleJumpToPageInputChange = (event) => {
    const value = event.target.value;
    setJumpToPageInput(value); // Update input value without changing page
  };

  // Handle actual page jump when confirmed
  const handleJumpToPageSubmit = () => {
    const newPageInput = parseInt(jumpToPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    console.log(
      "Jump to page input:",
      newPageInput,
      "Total pages:",
      totalPages
    );

    if (
      !isNaN(newPageInput) &&
      newPageInput >= 1 &&
      newPageInput <= totalPages
    ) {
      const newPageZeroIndexed = newPageInput - 1;
      setPage(newPageZeroIndexed);
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: newPageInput, // API uses 1-based index
        pageSize: rowsPerPage,
      }));
    } else {
      console.log("Invalid page number input:", newPageInput);
      setJumpToPageInput(page + 1); // Reset input to current page
    }
  };

  // Handle "Jump to First" click
  const handleJumpToFirst = () => {
    console.log("Jumping to first page");
    setPage(0);
    const newSearchParams = {
      ...searchParams,
      pageIndex: 1,
    };
    console.log("Updating searchParams for first page:", newSearchParams);
    setSearchParams(newSearchParams);
  };

  // Handle "Jump to Last" click
  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    console.log("Jumping to last page:", lastPage + 1);
    setPage(lastPage);
    const newSearchParams = {
      ...searchParams,
      pageIndex: lastPage + 1,
    };
    console.log("Updating searchParams for last page:", newSearchParams);
    setSearchParams(newSearchParams);
  };
  // --- Pagination Handlers --- END ---

  const handleSort = (columnName) => {
    console.log("Sorting column:", columnName);
    let newDirection = "asc";
    let newSortKey = columnName;

    // Cycle through sort states: asc -> desc -> none
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        newDirection = "desc";
      } else {
        // If current direction is desc, next click removes sort
        newDirection = null;
        newSortKey = null;
      }
    }

    console.log("New sort config:", {
      key: newSortKey,
      direction: newDirection,
    });

    // Update local state for immediate UI feedback
    setSortConfig({ key: newSortKey, direction: newDirection });

    // Update searchParams to trigger API refetch with new sorting
    const newSearchParams = {
      ...searchParams,
      pageIndex: 1, // Reset to first page when sorting changes
    };

    console.log("Updating searchParams:", newSearchParams);
    setSearchParams(newSearchParams);
    setPage(0); // Reset local page state as well

    // If we want to do client-side sorting while waiting for API response
    if (newSortKey && newDirection) {
      const sortedData = [...filteredRows].sort((a, b) => {
        const aValue = (a[newSortKey]?.toString() || "").toLowerCase();
        const bValue = (b[newSortKey]?.toString() || "").toLowerCase();

        if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredRows(sortedData);
    } else {
      // If sorting is removed, restore original data order
      setFilteredRows([...tableData]);
    }
  };

  useEffect(() => {
    // Only fetch when not in loading state
    FetchTableData();
  }, [page, rowsPerPage, flag]);

  const FetchTableData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching data with params:", searchParams);
      const res = await GetRelStoreStockReport(searchParams);
      console.log("API Response:", res);
      if (res.statusCode == 200) {
        setTableData(res.stockItemList || []);
        setFilteredRows(res.stockItemList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || 500);
      setTitle(error.message || "Internal Server Error");
      console.log("error fetching data", error);
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelDropdown();
    fetchStateDropdown();
    fetchCountryDropdown();
    // Simulate form loading
    const timer = setTimeout(() => {
      setIsFormLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchCountryDropdown = async () => {
    setIsCountryLoading(true);
    let body = {
      brandID: 0,
      categoryID: 0,
    };

    try {
      let res = await fetchCategoryList(body);
      if (res.statusCode == 200) {
        setCountryDropdown(res.productCategoryDropdownList || []);
      } else {
        setCountryDropdown([]);
      }
    } catch (error) {
      console.log("error fetching country dropdown", error);
      setCountryDropdown([]);
    } finally {
      setIsCountryLoading(false);
    }
  };

  const fetchStateDropdown = async () => {
    setIsStateLoading(true);
    let body = {
      countryID: 1,
      regionID: 0,
      stateID: 0,
    };
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDropdown(res.stateDropdownList || []);
      } else {
        setStateDropdown([]);
      }
    } catch (error) {
      console.log("error fetching state dropdown", error);
      setStateDropdown([]);
    } finally {
      setIsStateLoading(false);
    }
  };

  const fetchChannelTypeDropdown = async (value) => {
    setIsChannelTypeLoading(true);
    let body = {
      retailerID: 0,
      callType: 1,
      relianceStoreType: value,
    };
    try {
      let res = await GetRetailerListDrpdown(body);
      if (res.statusCode == 200) {
        setChannelTypeDropdown(res.retailerMasterList || []);
      } else {
        setChannelTypeDropdown([]);
      }
    } catch (error) {
      console.log("error fetching channel dropdown", error);
      setChannelTypeDropdown([]);
    } finally {
      setIsChannelTypeLoading(false);
    }
  };
  const fetchChannelDropdown = async () => {
    try {
      let res = await GetRelianceStoreType();
      if (res.statusCode == 200) {
        setChannelDropdown(res.relianceRetailerType || []);
      } else {
        setChannelDropdown([]);
      }
    } catch (error) {
      console.log("error fetching channel dropdown", error);
      setChannelDropdown([]);
    }
  };

  const handleSearch = (searchValues) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
    setPage(0);
  };

  const handleSearchClick = () => {
    // Reset to first page when searching
    setPage(0);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
    setFlag(!flag);
    setShowTable(true);
  };

  const handleCancelClick = async () => {
    // First reset all dropdown states
    setModelDropdown([]);
    setSkuDropdown([]);
    setChannelTypeDropdown([]);
    setShowStatus(false); // Hide status model on cancel
    setShowTable(false); // Hide table on cancel

    // Then reset search parameters
    const defaultParams = {
      retailerId: 0,
      relianceStoreType: "",
      stateId: 0,
      productCategoryId: 0,
      modelId: 0,
      skuId: 0,
      closingOnDate: getTodaysDate(),
      pageIndex: 1,
      pageSize: 10,
      showZeroQuantity: 0,
    };

    // Update search params and page in a single state update
    setSearchParams(defaultParams);
    setPage(0);
    setFlag(!flag);
  };

  const fetchModelDropdown = async (categoryId) => {
    setIsModelLoading(true);
    let body = {
      categoryID: categoryId,
      modelID: 0,
      subCategoryID: 0,
      brandID: 0,
    };
    try {
      let res = await GetModelListForDropdown(body);
      if (res.statusCode == 200) {
        setModelDropdown(res.modelDropdownList || []);
      } else {
        setModelDropdown([]);
      }
    } catch (error) {
      console.log("error fetching model dropdown", error);
      setModelDropdown([]);
    } finally {
      setIsModelLoading(false);
    }
  };

  const fetchSkuDropdown = async (modelId) => {
    setIsSkuLoading(true);
    let body = {
      skuID: 0,
      categoryID: 0,
      modelID: modelId,
      subCategoryID: 0,
      brandID: 0,
    };

    try {
      let res = await GetSKUListForDropdown(body);
      if (res.statusCode == 200) {
        setSkuDropdown(res.skuDropdownList || []);
      } else {
        setSkuDropdown([]);
      }
    } catch (error) {
      console.log("error fetching sku dropdown", error);
      setSkuDropdown([]);
    } finally {
      setIsSkuLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    // Handle parent dropdown clearing and child reset
    if (field === "relianceStoreType") {
      if (value) {
        fetchChannelTypeDropdown(value);
      } else {
        setChannelTypeDropdown([]);
        setSearchParams((prev) => ({
          ...prev,
          retailerId: 0,
        }));
      }
    }
    if (field === "categoryId") {
      if (value) {
        fetchModelDropdown(value);
        // Clear model and SKU values when category changes
        setSearchParams((prev) => ({
          ...prev,
          modelId: 0,
          skuId: 0,
        }));
        setModelDropdown([]);
        setSkuDropdown([]);
      } else {
        setModelDropdown([]);
        setSkuDropdown([]);
        setSearchParams((prev) => ({
          ...prev,
          modelId: 0,
          skuId: 0,
        }));
      }
    }
    if (field === "modelId") {
      if (value) {
        fetchSkuDropdown(value);
        // Clear SKU value when model changes
        setSearchParams((prev) => ({
          ...prev,
          skuId: 0,
        }));
        setSkuDropdown([]);
      } else {
        setSkuDropdown([]);
        setSearchParams((prev) => ({
          ...prev,
          skuId: 0,
        }));
      }
    }
    if (field === "stateId") {
      if (!value) {
        setSearchParams((prev) => ({
          ...prev,
          stateId: 0,
        }));
      }
    }
    if (field === "closingOnDate") {
      // Format date to YYYY-MM-DD
      const formattedDate = value
        ? new Date(value).toISOString().split("T")[0]
        : getTodaysDate();
      setSearchParams((prev) => ({
        ...prev,
        [field]: formattedDate,
      }));
      return;
    }

    // Update the search parameter
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to get today's date in YYYY-MM-DD format
  const downloadExcel = async () => {
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    try {
      setIsDownloadLoading(true);
      let res = await GetRelStoreStockReport(body);
      if (res.statusCode == 200) {
        console.log("res", res);
      } else {
        console.log("error", res);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const tableColumns = [
    { id: "salesChannelTypeName", label: "CHANNEL TYPE", sortable: true },
    { id: "salesChannelName", label: "NAME", sortable: true },
    { id: "retailerCode", label: "CODE", sortable: true },
    { id: "parentSalesChannel", label: "PARENT CHANNEL", sortable: true },
    { id: "regionName", label: "REGION", sortable: true },
    { id: "state", label: "STATE", sortable: false },
    { id: "productCategoryName", label: "CATEGORY", sortable: false },
    { id: "modelName", label: "MODEL", sortable: false },
    { id: "skuCode", label: "SKU", sortable: false },
    { id: "stockBinTypeDesc", label: "BIN", sortable: false },
    { id: "quantity", label: "QUANTITY", sortable: false },
  ];

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10000,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={0} mb={0} pr={2} ml={1}>
            <BreadcrumbsHeader pageTitle="Stock Reports" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={0}
          lg={12}
          mt={0}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            {isFormLoading ? (
              <FormSkeleton />
            ) : (
              <Grid
                container
                spacing={0}
                direction="column"
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  p: 2,
                  borderRadius: "8px",
                  mt: 0.5,
                  ml: 0.2,
                }}
              >
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      mb: 3,
                      mt: 1,
                    }}
                  >
                    Stock Report
                  </Typography>

                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        CHANNEL TYPE
                      </Typography>
                      <NuralAutocomplete
                        label="Channel Type"
                        options={channelDropdown}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) =>
                          option.relianceStoreType || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.relianceStoreType === value?.relianceStoreType
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "relianceStoreType",
                            newValue?.relianceStoreType || null,
                            newValue
                          );
                        }}
                        value={
                          channelDropdown.find(
                            (option) =>
                              option.relianceStoreType ===
                              searchParams.relianceStoreType
                          ) || null
                        }
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
                        CHANNEL NAME
                      </Typography>
                      <NuralAutocomplete
                        label="Channel Name"
                        options={channelTypeDropdown}
                        placeholder="SELECT"
                        width="100%"
                        loading={isChannelTypeLoading}
                        getOptionLabel={(option) => option.retailerName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "retailerId",
                            newValue?.retailerId || 0
                          );
                        }}
                        value={
                          channelTypeDropdown.find(
                            (option) =>
                              option.retailerId === searchParams.retailerId
                          ) || null
                        }
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
                        REGION
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Region"
                        options={options}
                        placeholder="SELECT"
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
                        STATE
                      </Typography>
                      <NuralAutocomplete
                        label="State"
                        options={stateDropdown}
                        placeholder="SELECT"
                        width="100%"
                        loading={isStateLoading}
                        getOptionLabel={(option) => option.stateName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.stateID === value?.stateID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("stateId", newValue?.stateID || 0);
                        }}
                        value={
                          stateDropdown.find(
                            (option) => option.stateID === searchParams.stateId
                          ) || null
                        }
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
                        CLOSING AS ON DATE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        name="closingDate"
                        value={searchParams.closingOnDate}
                        onChange={(date) => {
                          handleSearchChange("closingOnDate", date);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        options={countryDropdown}
                        placeholder="SELECT"
                        width="100%"
                        loading={isCountryLoading}
                        getOptionLabel={(option) => option.categoryName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.categoryID === value?.categoryID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "categoryId",
                            newValue?.categoryID || 0
                          );
                        }}
                        value={
                          countryDropdown.find(
                            (option) =>
                              option.categoryID === searchParams.categoryId
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        options={modelDropdown}
                        placeholder="SELECT"
                        width="100%"
                        loading={isModelLoading}
                        getOptionLabel={(option) => option.modelName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.modelID === value?.modelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("modelId", newValue?.modelID || 0);
                        }}
                        value={
                          modelDropdown.find(
                            (option) => option.modelID === searchParams.modelId
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        label="Sku"
                        options={skuDropdown}
                        placeholder="SELECT"
                        width="100%"
                        loading={isSkuLoading}
                        getOptionLabel={(option) => option.skuCode || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.skuID === value?.skuID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("skuId", newValue?.skuID || 0);
                        }}
                        value={
                          skuDropdown.find(
                            (option) => option.skuID === searchParams.skuId
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        SHOW ZERO QUANTITY STOCK
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Show Zero Quantity Stock"
                        options={[
                          { label: "Yes", value: 1 },
                          { label: "No", value: 0 },
                        ]}
                        placeholder="SELECT"
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "showZeroQuantity",
                            newValue?.value || 0
                          );
                        }}
                        value={
                          [
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                          ].find(
                            (option) =>
                              option.value === searchParams.showZeroQuantity
                          ) || null
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={3} md={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancelClick}
                        width="100%"
                        disabled={isFormLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={7} md={11}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        height="36px"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
                        fontSize="12px"
                        onClick={handleSearchClick}
                        disabled={isFormLoading}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} pr={4} mt={-2}>
          {showStatus && (
            <StatusModel width="100%" status={status} title={title} />
          )}
        </Grid>

        {!showStatus && showTable && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 100px)",
                overflow: "auto",
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
                        zIndex: 1100,
                        borderBottom: "none",
                      }}
                    >
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
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                    <TableCell
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        onClick={() => handleSort("salesChannelTypeName")}
                        sx={{ cursor: "pointer" }}
                      >
                        <Grid item>CHANNEL TYPE</Grid>
                        <Grid
                          item
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {sortConfig.key === "salesChannelTypeName" ? (
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
                      </Grid>
                    </TableCell>
                    {[
                      { id: "salesChannelName", label: "NAME", sortable: true },
                      { id: "retailerCode", label: "CODE", sortable: true },
                      {
                        id: "parentSalesChannel",
                        label: "PARENT CHANNEL",
                        sortable: true,
                      },
                      { id: "regionName", label: "REGION", sortable: true },
                      { id: "state", label: "STATE", sortable: false },
                      {
                        id: "productCategoryName",
                        label: "CATEGORY",
                        sortable: false,
                      },
                      { id: "modelName", label: "MODEL", sortable: false },
                      { id: "skuCode", label: "SKU", sortable: false },
                      { id: "stockBinTypeDesc", label: "BIN", sortable: false },
                      { id: "quantity", label: "QUANTITY", sortable: false },
                    ].map(({ id, label, sortable }) => (
                      <TableCell
                        key={id}
                        onClick={sortable ? () => handleSort(id) : undefined}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: sortable ? "pointer" : "default",
                          position: "sticky",
                          top: "48px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{label}</Grid>
                          {sortable && (
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {sortConfig.key === id ? (
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
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => (
                          <TableRowSkeleton
                            key={index}
                            columns={tableColumns.length}
                          />
                        ))
                    : filteredRows.map((row, index) => (
                        <TableRow key={row.skuCode + index}>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.salesChannelTypeName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.salesChannelName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.retailerCode}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.parentSalesChannel}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.regionName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.state}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.productCategoryName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.modelName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.skuCode}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.stockBinTypeDesc}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>

              <Grid container sx={tablePaginationStyle}>
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
                      {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)}{" "}
                      PAGES
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
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
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
                            backgroundColor:
                              rowsPerPage === value
                                ? PRIMARY_BLUE2
                                : "transparent",
                            color:
                              rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
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
                      cursor: page === 0 ? "not-allowed" : "pointer",
                      opacity: page === 0 ? 0.5 : 1,
                    }}
                    onClick={page === 0 ? undefined : handleJumpToFirst}
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
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
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
                      cursor:
                        page >= Math.ceil(totalRecords / rowsPerPage) - 1
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        page >= Math.ceil(totalRecords / rowsPerPage) - 1
                          ? 0.5
                          : 1,
                    }}
                    onClick={
                      page >= Math.ceil(totalRecords / rowsPerPage) - 1
                        ? undefined
                        : handleJumpToLast
                    }
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    value={jumpToPageInput}
                    onChange={handleJumpToPageInputChange}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleJumpToPageSubmit();
                      }
                    }}
                    style={jumpToPageStyle}
                  />
                  <Grid
                    mt={1}
                    onClick={handleJumpToPageSubmit}
                    style={{ cursor: "pointer" }}
                  >
                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          </Grid>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 12,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
            transition: "filter 0.3s ease",
          },
          "& .export-button": {
            filter: "none !important",
          },
        }}
      >
        <NuralActivityPanel>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            xl={12}
            mt={2}
            mb={2}
            className="export-button"
          >
            <NuralExport
              downloadExcel={downloadExcel}
              isDownloadLoading={isDownloadLoading}
              title="Export"
              views={""}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default StoreReports;
