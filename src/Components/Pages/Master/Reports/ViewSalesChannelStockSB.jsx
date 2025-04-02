import { Grid, Typography, Button, Box } from "@mui/material";
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
  LIGHT_BLUE,
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
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import {
  fetchBinType,
  fetchModelDropdown,
  fetchSalesChannelDropdown,
  fetchSalesChannelStockSB,
  fetchSKUList,
} from "../../../Api/Api";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import Loader from "../../../Common/Loader";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";

const SKELETON_ROWS = 10;

const stockStatusList = [
  {
    stockStatusID: 1,
    stockStatusName: "Good",
  },
  {
    stockStatusID: 2,
    stockStatusName: "Defective",
  },
];

const ViewSalesChannelStockSB = () => {
  const [activeTab, setActiveTab] = useState(
    "view-sales-channel-stock-sb"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const tabs = [
    { label: " Saleschannel Stock SB", value: "view-sales-channel-stock-sb" },
    // { label: "Add Saleschannel", value: "add-sales-channel" },
    // { label: "Add Retailer", value: "add-retailer" },
    // { label: "Search", value: "search" },
    // { label: "Approve Saleschannel", value: "approveSaleschannel" },
  ];
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
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

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const scTypes = [
      "Retailer",
      "Dealer",
      "Wholesaler",
      "Direct Sales",
      "E-commerce",
      "x",
    ];

    const names = [
      "Global Electronics",
      "Tech Solutions Ltd",
      "Digital Mart",
      "Smart Devices Co",
      "Future Tech Store",
      "Mega Electronics",
      "Prime Distributors",
      "City Electronics",
      "Modern Gadgets",
      "Elite Tech Shop",
    ];

    const skuCodes = [
      "MOB-2024-001",
      "LAP-2024-002",
      "TAB-2024-003",
      "ACC-2024-004",
      "SPK-2024-005",
      "HDP-2024-006",
      "CHG-2024-007",
      "CAB-2024-008",
      "PWB-2024-009",
      "SCR-2024-010",
    ];

    const stockBins = [
      "WH-A-001",
      "WH-B-002",
      "WH-C-003",
      "WH-D-004",
      "ST-A-001",
      "ST-B-002",
      "ST-C-003",
      "RT-A-001",
      "RT-B-002",
      "RT-C-003",
    ];

    const serialBatches = [
      "BATCH-24Q1-001",
      "BATCH-24Q1-002",
      "BATCH-24Q1-003",
      "BATCH-24Q2-001",
      "BATCH-24Q2-002",
      "BATCH-24Q2-003",
      "BATCH-24Q3-001",
      "BATCH-24Q3-002",
      "BATCH-24Q4-001",
      "BATCH-24Q4-002",
    ];

    // Generate 50 rows of realistic data
    return (
      Array(50)
        .fill()
        .map((_, index) => {
          // Ensure consistent combinations (e.g., same distributor always has same location)
          const nameIndex = Math.floor(index / 5) % names.length;
          const scTypeIndex = Math.floor(index / 8) % scTypes.length;

          return {
            id: `SC${1000 + index}`,
            scType: scTypes[scTypeIndex],
            name: names[nameIndex],
            skuCode: skuCodes[Math.floor(Math.random() * skuCodes.length)],
            stockBin: stockBins[Math.floor(Math.random() * stockBins.length)],
            serialBatch:
              serialBatches[Math.floor(Math.random() * serialBatches.length)],
          };
        })
        // Sort by SC Type and Name for better readability
        .sort((a, b) => {
          if (a.scType === b.scType) {
            return a.name.localeCompare(b.name);
          }
          return a.scType.localeCompare(b.scType);
        })
    );
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [searchParams, setSearchParams] = useState({
    serialNumber: "",
    stockStatusID: 0, //1-Good,2-Defective
    stockBinTypeMasterID: 0, //BinType ID
    skuName: "",
    skuCode: "",
    salesChannelTypeID: 0,
    pageIndex: 1, //Used only for UI
    pageSize: 10,
    selectedSalesChannelID: 0,
    condition: 1 /*1=bind on page,2=Export to excel*/,
    otherEntityTypeID: 2, //base entity from login api
    salesChannelName: "",
    modelID: 0,
    modelType: 1, //1= onlySaleable,2=Nonsaleable,0=all
    requestType: 1, //it will be 1
    skuID: 0,
  });

  // Add these state declarations after the searchParams state
  const [page, setPage] = React.useState(searchParams.pageIndex - 1);
  const [rowsPerPage, setRowsPerPage] = React.useState(searchParams.pageSize);

  const [salesChannelType, setSalesChannelType] = useState([]);
  const [model, setModel] = useState([]);
  const [sku, setSku] = useState([]);
  const [stockBinType, setStockBinType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTable, setShowTable] = useState(false);

  // Replace the existing handlePagination related functions with this:
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1, // API uses 1-based index
      pageSize: paginationState.rowsPerPage,
    };
    
    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);
    getSalesReportList(updatedParams);
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

  const handleSearchChange = (field, value) => {
    // Validate input based on field type
    let error = "";
    
    if (field === "serialNumber") {
      // Always update the search params for immediate input reflection
      setSearchParams(prev => ({
        ...prev,
        [field]: value
      }));
      
      if (value) {
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
          error = "Serial No must contain only alphanumeric characters.";
        } else if (value.length < 4 && value.length > 0) {
          error = "Serial No must be at least 4 characters.";
        } else if (value.length > 20) {
          error = "Serial No cannot exceed 20 characters.";
        }
      }
    } else if (field === "salesChannelName") {
      // Always update the search params for immediate input reflection
      setSearchParams(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Check length and set error if exceeded
      if (value.length > 50) {
        error = "Sales Channel Name can be 50 char max.";
      }
    }

    // Update error state
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // For other fields, only update if no error
    if (!error && field !== "salesChannelName" && field !== "serialNumber") {
      setSearchParams((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Special handling for stockStatusID to fetch bin types
    if (field === "stockStatusID") {
      if(value){
        getStockBinType(value);
      } else {
        setStockBinType([]);
      }
    }
    // Special handling for modelID to fetch SKU list
    if (field === "modelID") {
      if(value){
        getSKUList(value);
      } else {
        setSku([]);
      }
    }
  };

  const handleSearch = async () => {
    try {
      // Check if there are validation errors
      if (Object.values(errors).some(error => error !== "")) {
        return;
      }

      setShowTable(true);
      setIsLoading(true);
      
      const updatedParams = {
        ...searchParams,
        pageIndex: 1,
        pageSize: rowsPerPage,
        condition: 1,
      };

      // Reset pagination to first page
      setPage(0);
      setSearchParams(updatedParams);
      
      // Call API with updated params
      await getSalesReportList(updatedParams);
    } catch (error) {
      console.error("Error during search:", error);
      setShowTable(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Reset all search parameters
    const updatedParams = {
      serialNumber: "",
      stockStatusID: 0,
      stockBinTypeMasterID: 0,
      skuName: "",
      skuCode: "",
      salesChannelTypeID: 0,
      pageIndex: 1,
      pageSize: 10,
      selectedSalesChannelID: 0,
      condition: 1,
      otherEntityTypeID: 2,
      salesChannelName: "",
      modelID: 0,
      modelType: 1,
      requestType: 1,
      skuID: 0,
    };
    setSearchParams(updatedParams);
    // Reset stock bin type list and SKU list
    setStockBinType([]);
    setSku([]);
    // Clear all validation errors
    setErrors({});
    setShowTable(false); // Hide table on cancel
    // Clear status model
    setStatus(null);
    setTitle("");
  };

  // Function to clear status model
  const handleClearStatus = () => {
    setStatus(null);
    setTitle("");
  };

  //table data
  const getSalesReportList = async (params = searchParams) => {
    try {
      console.log('Calling API with params:', params);
      const response = await fetchSalesChannelStockSB(params);
      console.log('API response:', response);
      if (response.statusCode == 200) {
        setTableData(response.salesChannelStockList);
        setTotalRecords(response.totalRecords);
        
        // Show status model if no data found
        if (!response.salesChannelStockList || response.salesChannelStockList.length === 0) {
          setStatus(404);
          setTitle("No data found for the given search criteria");
          setShowTable(false);
        } else {
          setStatus(null);
          setTitle("");
          setShowTable(true);
        }
      } else {
        setStatus(response.statusCode);
        setTitle(response.message || "No Data Found");
        setShowTable(false);
      }
    } catch (error) {
      setStatus(error.statusCode || 500);
      setTitle(error.message || "Something went wrong");
      console.error("Error in getSalesReportList:", error);
      setShowTable(false);
    }
  };

  const getModelList = async () => {
    try {
      setIsLoading(true);
      const params = {
        categoryID: 0 /*product CategoryID*/,
        modelID: 0,
        subCategoryID: 0 /*productID*/,
        brandID: 0,
      };
      const response = await fetchModelDropdown(params);
      if (response.statusCode == 200) {
        setModel(response.modelDropdownList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSKUList = async (modelID) => {
    try {
      setIsLoading(true);
      const params = {
        skuID: 0,
        categoryID: 0 /*product CategoryID*/,
        modelID: modelID,
        subCategoryID: 0 /*productID*/,
        brandID: 0,
      };
      const response = await fetchSKUList(params);
      if (response.statusCode == 200) {
        setSku(response.skuDropdownList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockBinType = async (stockStatusID) => {
    try {
      setIsLoading(true);
      const params = {
        stockStatusID: stockStatusID, //1-Good,2-Defective
      };
      const response = await fetchBinType(params);
      if (response.statusCode == 200) {
        setStockBinType(response.stockBinTypeList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getSalesChannelType = async () => {
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem("log"));
      const entityTypeId = userData.entityTypeID;
      const baseEntityTypeId = userData.baseEntityTypeID;
      console.log("entityTypeId", entityTypeId);
      const params = {
        salesChannelTypeid: entityTypeId, //login user entity type id
        otherEntityTypeID: baseEntityTypeId, //login user's base entitytypeid
      };
      const response = await fetchSalesChannelDropdown(params);
      if (response.statusCode == 200) {
        console.log(response.salesChannelStockList);
        setSalesChannelType(response.salesChannelStockList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = async () => {
    setIsDownloadLoading(true);
    try {
      setSearchParams({
        ...searchParams,
        condition: 2,
      });
      const response = await fetchSalesChannelStockSB(searchParams);
      if (response.statusCode == 200) {
        window.location.href = response?.filePathLink;
      } else {
        console.error("Failed to download Excel:", response.message);
        // Show status model for Excel download error
        setStatus(response.statusCode || 400);
        setTitle(response.message || "Failed to download Excel");
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error during Excel download:", error);
      // Show status model for Excel download exception
      setStatus(error.statusCode || 500);
      setTitle(error.message || "Error during Excel download");
      setShowTable(false);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  useEffect(() => {
    // getSalesReportList(); // Remove this call
    getModelList();   
    getSalesChannelType();
  }, []);

  return (
    <>
    
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "250px" }, // Add padding to make space for activity panel
          pointerEvents: isLoading ? "none" : "auto",
          filter: isDownloadLoading ? "blur(2px)" : "none",
          transition: "filter 0.3s ease",
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
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Reports" />
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
          mt={1}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Saleschannel Stock SB"
                  backgroundColor={LIGHT_GRAY2}
                >
                  {/* First Row - 3 NuralAutocomplete */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
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
                        SALES CHANNEL TYPE
                      </Typography>
                      <NuralAutocomplete
                        options={salesChannelType}
                        getOptionLabel={(option) => option.entityType || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.entityTypeID === value?.entityTypeID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "salesChannelTypeID",
                            newValue?.entityTypeID || 0
                          );
                          
                        }}
                        value={
                          salesChannelType.find(
                            (option) =>
                              option.entityTypeID ===
                              searchParams.salesChannelTypeID
                          ) || null
                        }
                        width="100%"
                        label="Sales Channel Type"
                        placeholder="SELECT"
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
                        SALES CHANNEL NAME
                      </Typography>
                      <NuralTextField
                        value={searchParams.salesChannelName}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSearchChange("salesChannelName", value);
                        }}
                        width="100%"
                        placeholder="ENTER SALES CHANNEL NAME"
                        error={!!errors.salesChannelName}
                        errorMessage={errors.salesChannelName}
                        backgroundColor={LIGHT_BLUE}
                        maxLength={50}
                        onKeyPress={(e) => {
                          if (e.target.value.length >= 50) {
                            e.preventDefault();
                          }
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
                        STOCK STATUS
                      </Typography>
                      <NuralAutocomplete
                        options={stockStatusList}
                        getOptionLabel={(option) =>
                          option.stockStatusName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.stockStatusID === value?.stockStatusID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "stockStatusID",
                            newValue?.stockStatusID || 0
                          );
                        }}
                        value={
                          searchParams.stockStatusID
                            ? stockStatusList.find(
                                (option) =>
                                  option.stockStatusID === searchParams.stockStatusID
                              ) || null
                            : null
                        }
                        width="100%"
                        label="Stock Status"
                        placeholder="SELECT"
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
                        BIN TYPE
                      </Typography>
                      {/* stockBinTypeMasterID": 12,
            "stockBintypedesc": "Company Defective", */}
                      <NuralAutocomplete
                        options={stockBinType}
                        getOptionLabel={(option) =>
                          option.stockBintypedesc || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.stockBinTypeMasterID ===
                          value?.stockBinTypeMasterID
                        }
                        value={
                          stockBinType.find(
                            (option) =>
                              option.stockBinTypeMasterID ===
                              searchParams.stockBinTypeMasterID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          console.log(newValue)
                          handleSearchChange(
                            "stockBinTypeMasterID",
                            newValue?.stockBinTypeMasterID || 0
                          );
                        }}
                        width="100%"
                        label="Bin Type"
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
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
                        options={model}
                        getOptionLabel={(option) => option.modelName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.modelID === value?.modelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("modelID", newValue?.modelID || 0);
                        }}
                        value={
                          searchParams.modelID
                            ? model.find(
                                (option) =>
                                  option.modelID === searchParams.modelID
                              ) || null
                            : null
                        }
                        width="100%"
                        placeholder="MODEL"
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
                        SKU
                      </Typography>
                      <NuralAutocomplete
                        options={sku}
                        getOptionLabel={(option) => option.skuName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.skuID === value?.skuID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("skuID", newValue?.skuID || 0);
                        }}
                        value={
                          searchParams.skuID
                            ? sku.find(
                                (option) =>
                                  option.skuID === searchParams.skuID
                              ) || null
                            : null
                        }
                        width="100%"
                        placeholder="SELECT"
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
                        SERIAL NO.
                      </Typography>
                      <NuralTextField
                        value={searchParams.serialNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSearchChange("serialNumber", value);
                        }}
                        width="100%"
                        placeholder="ENTER SERIAL NO."
                        error={!!errors.serialNumber}
                        errorMessage={errors.serialNumber}
                        backgroundColor={LIGHT_BLUE}
                        maxLength={20}
                        onKeyPress={(e) => {
                          if (!/[a-zA-Z0-9]/.test(e.key) || e.target.value.length >= 20) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Third Row - Buttons */}
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      // gap: { xs: 2, sm: 2 },
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
                        onClick={handleCancel}
                        width="100%"
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
                        onClick={handleSearch}
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

        {/* Wrap the table in a conditional render */}
        {showTable && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 300px)", // Add max height for scrolling
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
                    {[
                      { id: "name", label: "NAME" },
                      { id: "skuCode", label: "SKU CODE" },
                      { id: "stockBin", label: "STOCK BIN" },
                      { id: "serialBatch", label: "SERIAL BATCH" },
                      { id: "quantity", label: "QUANTITY" },
                    ].map(({ id, label }) => (
                      <TableCell
                        key={id}
                        onClick={() => handleSort(id)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: "pointer",
                          position: "sticky",
                          top: "48px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{label}</Grid>
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
                        </Grid>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    Array(SKELETON_ROWS).fill(null).map((_, index) => (
                      <TableRowSkeleton key={`skeleton-${index}`} columns={5} />
                    ))
                  ) : tableData.length > 0 ? (
                    tableData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesChannelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.skuCode}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.stockBinTypeDesc}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.serialBatchInfo}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography
                          sx={{
                            fontFamily: "Manrope",
                            fontSize: "12px",
                            color: PRIMARY_BLUE2,
                            fontWeight: 500,
                          }}
                        >
                          No Data Available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Custom Pagination */}
              <NuralPagination
                totalRecords={totalRecords}
                initialPage={page}
                initialRowsPerPage={rowsPerPage}
                onPaginationChange={handlePaginationChange}
              />
            </TableContainer>
          </Grid>
        )}
        
        {/* Show status model when status is set and table is not showing */}
        {status && !showTable && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <StatusModel 
              width="100%" 
              status={status} 
              title={title} 
              onClose={handleClearStatus}
            />
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
          lg: 5,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
            transition: "filter 0.3s ease",
            filter: isDownloadLoading ? "blur(2px)" : "none",
          },
          "& .export-button": {
            filter: "none !important",
          },
          filter: isDownloadLoading ? "blur(2px)" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        <NuralActivityPanel>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <SelectionPanel columns={""} views={""} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={""} />
          </Grid>
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
              title="Export"
              views={""}
              downloadExcel={downloadExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>

        </NuralActivityPanel>
      </Grid>

      {/* Loading overlay for Excel download */}
      {isDownloadLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

export default ViewSalesChannelStockSB;
