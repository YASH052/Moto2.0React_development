import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
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
import {
  GetStockReport,
  GetSalesChannelType,
  GetStateListForDropdown,
  GetEntityData,
  fetchCategoryList,
  GetModelListForDropdown,
  GetSKUListForDropdown,
  GetStockRetailerReportV2,
} from "../../../Api/Api";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";
// import { findPositionOfBar } from "recharts/types/util/ChartUtils";

const storeData = JSON.parse(localStorage.getItem("log"));
const baseEntityTypeID = storeData?.baseEntityTypeID;
const DownloadStockReport = () => {
  const [activeTab, setActiveTab] = React.useState("download-stock-report");
  const tabs = [
    { label: "Stock Report", value: "download-stock-report" },
    { label: "Stock Adjustment Report", value: "stock-adjustment-report" },
    { label: "Saleschannel Stock SB", value: "saleschannel-stock-sb" },
    { label: "Serial No. Movement", value: "serial-no-moment" },
    { label: "REL Store Stock", value: "rel-store-reports" },
  ];

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = ["Yes", "No"];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Get today's date (toDate)
  const today = new Date();

  // Add these states for pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [salesChannelTypes, setSalesChannelTypes] = React.useState([]);
  const [salesChannelID, setSalesChannelID] = useState([]);
  const [categories, setCategories] = React.useState([]);
  const [models, setModels] = React.useState([]);
  const [skus, setSKUs] = React.useState([]);
  const [states, setStates] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [isSearchInProgress, setIsSearchInProgress] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const SKELETON_ROWS = 10;
  const [status, setStatus] = useState(null);
  const [tittle, setTittle] = useState(null);

  const [searchParams, setSearchParams] = useState({
    dateTo: formatDate(today), //Mandatory Filter
    salesChannelTypeID: 0, //Mandatory Filter
    filePath: "", //StockReport7f5cf4d19151433a9f33db0f59674641.csv
    comingFrom: 0, //Non Mandatory Filter will be zero
    modelID: 0, //Non Mandatory
    skuID: 0, //Non Mandatory
    stateID: 0, //Non Mandatory
    wantZeroQuantity: 0, //1=zero values will come, 0 = exclude zero value data by default will be 0
    salesChannelID: 0, //Non Mandatory Saleschannel filter
    pageIndex: 1, //1-UI, -1-Excel to export
    pageSize: 10,
    productCategtoryID: 0, //Non Mandatory
    //Non Mandatory
  });

  // Add a new state for channel loading
  const [isChannelLoading, setIsChannelLoading] = useState(false);

  // Add new state variables for MODEL and SKU loading
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isSkuLoading, setIsSkuLoading] = useState(false);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
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

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    if (!searchParams.salesChannelTypeID) {
      console.log("errror", searchParams.salesChannelTypeID);
      setErrors((prev) => ({
        ...prev,
        salesChannelTypeID: "Sales Channel Type is required",
      }));
      return;
    }
    const searchValues = {
      ...searchParams,
    };

    setPage(1);
    setIsSearchLoading(true);
    setIsSearchInProgress(true);
    fetchData(searchValues);
    setStatus(null);
    setTittle(null);
  };

  // Update the handleReset function to also reset sorting
  const handleReset = () => {
    setSearchParams({
      ...searchParams,
      dateTo: formatDate(today),
      filePath: "",
      comingFrom: 0,
      modelID: 0,
      skuID: 0,
      stateID: 0,
      salesChannelTypeID: 0,
      salesChannelID: 0,
      productCategtoryID: 0,
      orgnHierarchyID: 0,
      wantZeroQuantity: 0,
      otherEntityType: baseEntityTypeID,
    });
    setSortConfig({ key: null, direction: null });
    setErrors({});
    setStatus(null);
    setTittle(null);
    setPage(1);
    setFilteredRows([]);
    setTotalRecords(0);
  };

  const fetchData = async () => {
    setIsTableLoading(true);

    try {
      let response;
      if (searchParams.salesChannelTypeID == 6) {
        const body = {
          ...searchParams,
          otherEntityType: baseEntityTypeID,
          pageIndex: page,
          pageSize: rowsPerPage,
        };
        response = await GetStockRetailerReportV2(body);
      } else {
        const body = {
          ...searchParams,
          orgnHierarchyID: 0,
          pageIndex: page,
          pageSize: rowsPerPage,
        };
        response = await GetStockReport(body);
      }

      if (response.statusCode == "200") {
        setFilteredRows(
          response.stockReportList || response.stockRetailerReportList || []
        );
        setTotalRecords(response.totalRecords || 0);
      } else if (response.statusCode === "404") {
        setFilteredRows([]);
        setTotalRecords(0);
        setStatus(response.statusCode);
        setTittle(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching stockReportList:", error);
      setStatus(error.response.data.statusCode);
      setTittle(error.response.data.statusMessage);
    } finally {
      setIsTableLoading(false);
      setIsSearchLoading(false);
      setIsSearchInProgress(false);
    }
  };

  const fetchSalesChannelTypes = async () => {
    setIsLoading(true);
    const body = {
      salesChannelTypeid: 0,
      forApproval: 0,
      loadRetailer: 1,
    };
    try {
      const response = await GetSalesChannelType(body);
      if (response.statusCode === "200") {
        setSalesChannelTypes(response.salesChannelTypeList || []);
      }
    } catch (error) {
      console.error("Error fetching sales channel types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesChannelID = async (value) => {
    setIsChannelLoading(true); // Set loading to true when starting the fetch
    const body = {
      entityTypeID: value,
    };
    console.log("body", body);
    try {
      const response = await GetEntityData(body);
      if (response.statusCode == "200") {
        console.log(
          "response.entityTypeWithEntityTypeIDList",
          response.entityTypeWithEntityTypeIDList
        );
        setSalesChannelID(response.entityTypeWithEntityTypeIDList || []);
      }
    } catch (error) {
      console.error("Error fetching sales channel ID:", error);
    } finally {
      setIsChannelLoading(false); // Set loading to false when fetch completes
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    const body = {
      brandID: 0,
      categoryID: 0,
    };
    try {
      const response = await fetchCategoryList(body);
      if (response.statusCode === "200") {
        setCategories(response.productCategoryDropdownList || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async (value) => {
    setIsModelLoading(true); // Set loading to true when starting
    const body = {
      categoryID: value,
      modelID: 0,
      subCategoryID: 0,
      brandID: 0,
    };
    try {
      const response = await GetModelListForDropdown(body);
      if (response.statusCode == "200") {
        setModels(response.modelDropdownList || []);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setIsModelLoading(false); // Set loading to false when complete
    }
  };

  const fetchSKUs = async (value) => {
    setIsSkuLoading(true); // Set loading to true when starting
    const body = {
      skuID: 0,
      categoryID: 0,
      modelID: value,
      subCategoryID: 0,
      brandID: 0,
    };
    try {
      const response = await GetSKUListForDropdown(body);
      if (response.statusCode == "200") {
        setSKUs(response.skuDropdownList || []);
      }
    } catch (error) {
      console.error("Error fetching SKUs:", error);
    } finally {
      setIsSkuLoading(false); // Set loading to false when complete
    }
  };

  const fetchStates = async () => {
    setIsLoading(true);
    const body = {
      countryID: 1,
      regionID: 0,
      stateID: 0,
    };
    try {
      const response = await GetStateListForDropdown(body);
      if (response.statusCode == "200") {
        setStates(response.stateDropdownList || []);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (field, value) => {
    console.log("field", field, "value", value);
    if (field == "salesChannelTypeID") {
      if (value != 0) {
        setSearchParams({
          ...searchParams,
          salesChannelTypeID: value,
        });
        await fetchSalesChannelID(value);
      } else {
        setSalesChannelID([]);
        setSearchParams({
          ...searchParams,
          salesChannelTypeID: 0,
          salesChannelID: 0,
        });
      }
    }
    if (field == "salesChannelID") {
      if (value != 0) {
        console.log("value", value);
        setSearchParams({
          ...searchParams,
          salesChannelID: value,
        });
      } else {
        setSearchParams({
          ...searchParams,
          salesChannelID: 0,
        });
      }
    }
    if (field == "stateID") {
      if (value != 0) {
        console.log("satteValue", value);
        setSearchParams({
          ...searchParams,
          stateID: value,
        });
      } else {
        setSearchParams({
          ...searchParams,
          stateID: 0,
        });
      }
    }
    if (field == "productCategtoryID") {
      if (value != 0) {
        setSearchParams({
          ...searchParams,
          productCategtoryID: value,
          modelID: 0,
          skuID: 0,
        });
        setModels([]);
        setSKUs([]);
        await fetchModels(value);
      } else {
        setModels([]);
        setSKUs([]);
        setSearchParams({
          ...searchParams,
          productCategtoryID: 0,
          modelID: 0,
          skuID: 0,
        });
      }
    }
    if (field == "modelID") {
      if (value != 0) {
        setSearchParams({
          ...searchParams,
          modelID: value,
          skuID: 0,
        });
        setSKUs([]);
        await fetchSKUs(value);
      } else {
        setSKUs([]);
        setSearchParams({
          ...searchParams,
          modelID: 0,
          skuID: 0,
        });
      }
    }
    if (field == "skuID") {
      if (value != 0) {
        setSearchParams({
          ...searchParams,
          skuID: value,
        });
      } else {
        setSearchParams({
          ...searchParams,
          skuID: 0,
        });
      }
    }
    if (field == "wantZeroQuantity") {
      setSearchParams({
        ...searchParams,
        wantZeroQuantity: value == "Yes" ? 1 : 0,
      });
    }
  };

  const handleFirstPage = () => {
    setPage(1);
    setSearchData((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  };

  const handleLastPage = () => {
    setPage(Math.ceil(totalRecords / rowsPerPage));
    setSearchData((prev) => ({
      ...prev,
      pageIndex: Math.ceil(totalRecords / rowsPerPage),
    }));
  };

  useEffect(() => {
    if (filteredRows.length > 0) {
      fetchData();
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsSearchLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchSalesChannelTypes(),
          fetchCategories(),
          fetchStates(),
        ]);
        const [SalesChannelTypes, CategoriesList, StatesList] = results;

        if (SalesChannelTypes.status === "fulfilled") {
          console.log("Sales channel types fetched successfully");
        } else {
          console.error(
            "Failed to fetch sales channel types:",
            SalesChannelTypes.reason
          );
        }

        if (CategoriesList.status === "fulfilled") {
          console.log("CategoriesList fetched successfully");
        } else {
          console.error(
            "Failed to fetch CategoriesList:",
            CategoriesList.reason
          );
        }

        if (StatesList.status === "fulfilled") {
          console.log("StatesList fetched successfully");
        } else {
          console.error("Failed to fetch StatesList:", StatesList.reason);
        }
      } catch (error) {
        console.error("Unexpected error during fetch:", error);
      } finally {
        setIsSearchLoading(false);
      }
    };
    fetchInitialData();
  }, []);

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

      {/* Rest of the content */}
      {isSearchLoading && filteredRows.length === 0 ? (
        <FormSkeleton />
      ) : (
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
                <NuralAccordion2
                  title="Sales Channel Stock SB"
                  backgroundColor={LIGHT_GRAY2}
                >
                  {/* First Row - Channel Type, Channel Name, Region, State */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 0, sm: 0, md: 0 },
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
                        CHANNEL TYPE <Required />
                      </Typography>
                      <NuralAutocomplete
                        label="Channel Type"
                        options={salesChannelTypes}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) =>
                          option.salesChannelTypeName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.salesChannelTypeID ===
                          value?.salesChannelTypeID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "salesChannelTypeID",
                            newValue?.salesChannelTypeID || 0,
                            newValue
                          );
                          if (errors.salesChannelTypeID) {
                            setErrors((prev) => ({
                              ...prev,
                              salesChannelTypeID: "",
                            }));
                          }
                        }}
                        value={
                          salesChannelTypes.find(
                            (option) =>
                              option.salesChannelTypeID ===
                              searchParams.salesChannelTypeID
                          ) || 0
                        }
                        error={!!errors.salesChannelTypeID}
                        // helperText={errors.salesChannelTypeID}
                      />
                      {errors.salesChannelTypeID && (
                        <Typography
                          sx={{
                            color: "error.main",
                            fontSize: "12px",
                            mt: 0.5,
                            ml: 1,
                          }}
                        >
                          {errors.salesChannelTypeID}
                        </Typography>
                      )}
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
                        options={salesChannelID}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) =>
                          option.salesChannelName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.salesChannelID === value?.salesChannelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "salesChannelID",
                            newValue?.salesChannelID || 0,
                            newValue
                          );
                        }}
                        value={
                          salesChannelID.find(
                            (option) =>
                              option.salesChannelID ===
                              searchParams.salesChannelID
                          ) || 0
                        }
                        loading={isChannelLoading}
                        disabled={isChannelLoading}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6} md={4} lg={4}>
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
                      label="Region"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid> */}

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
                        options={states}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.stateName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.stateID === value?.stateID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "stateID",
                            newValue?.stateID || 0,
                            newValue
                          );
                        }}
                        value={
                          states.find(
                            (option) => option.stateID === searchParams.stateID
                          ) || 0
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
                        onChange={(date) => {
                          if (date) {
                            setSearchParams((prev) => ({
                              ...prev,
                              dateTo: formatDate(date),
                            }));
                          }
                        }}
                        value={
                          searchParams.dateTo
                            ? new Date(searchParams.dateTo)
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row - Category, Model, SKU, Show Zero City Stock */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 0, sm: 0, md: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
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
                        options={categories}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.categoryName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.categoryID === value?.categoryID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "productCategtoryID",
                            newValue?.categoryID || 0,
                            newValue
                          );
                        }}
                        value={
                          categories.find(
                            (option) =>
                              option.categoryID ===
                              searchParams.productCategtoryID
                          ) || 0
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
                        options={models}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.modelName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.modelID === value?.modelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "modelID",
                            newValue?.modelID || 0,
                            newValue
                          );
                        }}
                        value={
                          models.find(
                            (option) => option.modelID === searchParams.modelID
                          ) || 0
                        }
                        loading={isModelLoading}
                        disabled={isModelLoading}
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
                        label="SKU"
                        options={skus}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.skuName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.skuID === value?.skuID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "skuID",
                            newValue?.skuID || 0,
                            newValue
                          );
                        }}
                        value={
                          skus.find(
                            (option) => option.skuID === searchParams.skuID
                          ) || 0
                        }
                        loading={isSkuLoading}
                        disabled={isSkuLoading}
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
                        SHOW ZERO QTY RECORDS
                      </Typography>
                      <NuralAutocomplete
                        label="Show Zero Qty Records"
                        options={options}
                        placeholder="SELECT"
                        width="100%"
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "wantZeroQuantity",
                            newValue || 0,
                            newValue
                          );
                        }}
                        value={
                          searchParams.wantZeroQuantity === 1 ? "Yes" : "No"
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* Third Row - Closing as on Date */}

                  {/* Fourth Row - Buttons */}
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
      )}

      {/* Add this after the NuralAccordion2 component */}

      <Grid container>
        {" "}
        {status != null ? (
          <Grid item xs={12} md={12} sx={{ px: 2 }}>
            <StatusModel
              width="99%"
              status={status}
              title={tittle}
              open={status !== null}
              onClose={() => {
                if (!isSearchInProgress) {
                  setStatus(null);
                  setTittle(null);
                }
              }}
              disabled={isSearchInProgress}
            />
          </Grid>
        ) : (
          filteredRows.length > 0 && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 320px)", // Adjusted to account for headers
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
                        colSpan={10}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          position: "sticky",
                          top: 0,
                          zIndex: 1100,
                          borderBottom: "none",
                          boxShadow: "0 2px 2px rgba(0,0,0,0.05)", // Add subtle shadow
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
                          top: "45px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
                          cursor: "pointer",
                        }}
                        onClick={() => handleSort("type")}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>TYPE</Grid>
                          <Grid
                            item
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {sortConfig.key === "type" ? (
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
                        { header: "NAME", key: "name" },
                        { header: "CODE", key: "code" },
                        { header: "PARENT CHANNEL", key: "parentChannel" },
                        // { header: "REGION", key: "region" },
                        { header: "STATE", key: "state" },
                        { header: "MODEL", key: "model" },
                        { header: "SKU", key: "sku" },
                        { header: "BIN", key: "bin" },
                        { header: "QUANTITY", key: "quantity" },
                      ].map(({ header, key }) => (
                        <TableCell
                          key={header}
                          onClick={() => handleSort(key)}
                          sx={{
                            ...tableHeaderStyle,
                            cursor: "pointer",
                            position: "sticky",
                            top: "45px",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 1000,
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>{header}</Grid>
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {sortConfig.key === key ? (
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
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isTableLoading
                      ? Array(SKELETON_ROWS)
                          .fill(0)
                          .map((_, index) => (
                            <TableRowSkeleton key={index} columns={10} />
                          ))
                      : filteredRows.map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.salesChannelTypeName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.salesChannelName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.salesChannelCode}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.parentSalesChannel}
                            </TableCell>
                            {/* <TableCell sx={{ ...rowstyle }}>{row.region}</TableCell> */}
                            <TableCell sx={{ ...rowstyle }}>
                              {row.state}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.modelName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.skuName}
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

                {/* Custom Pagination */}
                <Grid
                  container
                  sx={{
                    p: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: LIGHT_GRAY2,
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
                        //   gap: 1,
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
                              // border: `1px solid ${PRIMARY_BLUE2}`,
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
                        cursor: "pointer",
                        color: page === 1 ? "grey.400" : PRIMARY_BLUE2,
                      }}
                      onClick={handleFirstPage}
                    >
                      JUMP TO FIRST
                    </Typography>
                    <IconButton
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      PAGE {page}
                    </Typography>

                    <IconButton
                      onClick={() => setPage(page + 1)}
                      disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
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
                        cursor: "pointer",
                        color:
                          page === Math.ceil(totalRecords / rowsPerPage)
                            ? "grey.400"
                            : PRIMARY_BLUE2,
                      }}
                      onClick={handleLastPage}
                      variant="body2"
                    >
                      JUMP TO LAST
                    </Typography>
                    <input
                      type="number"
                      placeholder="Jump to page"
                      min={1}
                      max={Math.ceil(totalRecords / rowsPerPage)}
                      // value={page}
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
                    <Grid
                      mt={1}
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        const pageValue = parseInt(input.value, 10);
                        if (
                          pageValue >= 1 &&
                          pageValue <= Math.ceil(totalRecords / rowsPerPage)
                        ) {
                          handleChangePage(pageValue);
                          // input.value = '';
                        } else {
                          setPage(1);
                          setSearchData((prev) => ({
                            ...prev,
                            pageIndex: 1,
                          }));
                        }
                      }}
                    >
                      <img src="./Icons/footerSearch.svg" alt="arrow" />
                    </Grid>
                  </Grid>
                </Grid>
              </TableContainer>
            </Grid>
          )
        )}{" "}
      </Grid>
    </Grid>
  );
};

export default DownloadStockReport;
