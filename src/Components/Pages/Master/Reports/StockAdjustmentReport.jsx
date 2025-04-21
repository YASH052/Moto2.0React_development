import { Grid, Typography, Button } from "@mui/material";
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
import { GetStockAdjustmentReport, GetSalesChannelTypedropdown, GetSalesChannelListForDropdown } from "../../../Api/Api";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";

const StockAdjustmentReport = () => {
  const [activeTab, setActiveTab] = React.useState("stock-adjustment-report");

  const tabs = [
    { label: "Stock Report", value: "stock-report" },
    { label: "Stock Adjustment Report", value: "stock-adjustment-report" },
    { label: "Saleschannel Stock SB", value: "saleschannel-stock-sb" },
    { label: "Serial No. Movement", value: "serial-no-moment" },
    { label: "REL Store Stock", value: "rel-store-reports" },

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
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [isSearchInProgress, setIsSearchInProgress] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const SKELETON_ROWS = 10;
  const [status, setStatus] = useState(null);
  const [tittle, setTittle] = useState(null);



  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get today's date (toDate)
  const today = new Date();

  // Get the first date of the current month (fromDate)
  const firstDateOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [SalesChannelTypedropdown, setSalesChannelTypedropdown] = React.useState([]);
  const [SalesChannelListForDropdown, setSalesChannelListForDropdown] = React.useState([]);
  const [searchData, setSearchData] = React.useState({
    salesChannelTypeId: 0,
    salesChannelName: "",
    fromDate: formatDate(firstDateOfCurrentMonth), // ""
    toDate: formatDate(today),
    pageIndex: page,
    pageSize: rowsPerPage
  });
  const [salesChannelType, setSalesChannelType] = React.useState(
    {
      salesChannelTypeid: 1,//login user entity type id
      otherEntityTypeID: 2
    }
  );

  const [salesChannelName, setSalesChannelName] = React.useState(
    {
      salesChannelID: 0,
      stateID: 0,
      cityID: 0
    }
  );

  const handleChangePage = (newPage) => {
    console.log("newPage", newPage);
    setPage(newPage);
    setSearchData(prev => ({
      ...prev,
      pageIndex: newPage
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setSearchData(prev => ({
      ...prev,
      pageIndex: 1
    }));
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
        setFilteredRows(filteredRows); // Reset to original order
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

  // Update the search button click handler
  const handleSearchClick = () => {
    if (!searchData.salesChannelTypeId) {
      setErrors((prev) => ({
        ...prev,
        salesChannelTypeId: "Sales Channel Type is required",
      }));
      return;
    }
    const searchValues = {
      ...searchData,
    };
    setPage(1);
    setIsSearchLoading(true);
    setIsSearchInProgress(true);
    fetchStockAdjustmentReport(searchValues);
    setStatus(null);
    setTittle(null);
  };

  const handleResetClick = () => {
    setErrors({});
    setStatus(null);
    setTittle(null);
    setSearchData(prev => ({
      ...prev,
      salesChannelTypeId: 0,
      salesChannelName: "",
      fromDate: formatDate(firstDateOfCurrentMonth),
      toDate: formatDate(today)
    }));
    setPage(1);
    setFilteredRows([]);
    setTotalRecords(0);
    // fetchStockAdjustmentReport();
  };

  async function fetchStockAdjustmentReport(searchValues = searchData) {
    setIsTableLoading(true);
    const params = {
      ...searchValues,
      pageIndex: page,
      pageSize: rowsPerPage
    }
    try {
      const response = await GetStockAdjustmentReport(params);
      if (response.statusCode === "200") {
        setFilteredRows(response.stockAdjustmentReportList);
        setTotalRecords(response.totalRecords);
      } else if (response.statusCode === "404") {
        setFilteredRows([]);
        setTotalRecords(0);
        setStatus(response.statusCode);
        setTittle(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching stock adjustment report:", error);
      setStatus(error.response.data.statusCode);
      setTittle(error.response.data.statusMessage);
    }
    finally {
      setIsTableLoading(false);
      setIsSearchLoading(false);
      setIsSearchInProgress(false);
    }
  }

  async function fetchGetSalesChannelTypedropdown() {
    setIsLoading(true);
    const params = {
      ...salesChannelType
    }
    try {
      const response = await GetSalesChannelTypedropdown(params);
      if (response.statusCode === "200") {
        setSalesChannelTypedropdown(response.salesChannelStockList);
      } else if (response.statusCode === "404") {
      }
    } catch (error) {
      console.error("Error fetching stock adjustment report:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  async function fetchGetSalesChannelListForDropdown() {
    setIsLoading(true);
    const params = {
      ...salesChannelName
    }
    try {
      const response = await GetSalesChannelListForDropdown(params);
      if (response.statusCode === "200") {
        setSalesChannelListForDropdown(response.salesChannelDropdownList);
      } else if (response.statusCode === "404") {
        setSalesChannelListForDropdown([]);
      }
    } catch (error) {
      console.error("Error fetching sales channel list for dropdown:", error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleFirstPage = () => {
    setPage(1);
    setSearchData(prev => ({
      ...prev,
      pageIndex: 1
    }));
  };

  const handleLastPage = () => {
    setPage(Math.ceil(totalRecords / rowsPerPage));
    setSearchData(prev => ({
      ...prev,
      pageIndex: Math.ceil(totalRecords / rowsPerPage)
    }));
  };


  useEffect(() => {
    if (filteredRows.length > 0) {  // Only fetch if there's existing data
      fetchStockAdjustmentReport();
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsSearchLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchGetSalesChannelTypedropdown(),
          fetchGetSalesChannelListForDropdown()
        ]);
        const [typeDropdownResult, channelListResult] = results;
    
        if (typeDropdownResult.status === "fulfilled") {
          console.log("Sales channel types fetched successfully");
        } else {
          console.error("Failed to fetch sales channel types:", typeDropdownResult.reason);
        }
    
        if (channelListResult.status === "fulfilled") {
          console.log("Sales channel list fetched successfully");
        } else {
          console.error("Failed to fetch sales channel list:", channelListResult.reason);
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
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
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
          <Grid item xs={12} mt={0} mb={0} ml={1} pr={2}>
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
                    title="Stock Adjustment Report"
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
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          SALES CHANNEL TYPE <Required />
                        </Typography>
                        <NuralAutocomplete
                          label="Sales Channel Type"
                          options={SalesChannelTypedropdown}
                          placeholder="SELECT"
                          required
                          width="100%"
                          getOptionLabel={(option) =>
                            option.entityType || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.entityTypeID === value?.entityTypeID
                          }
                          onChange={(event, newValue) => {
                            setSearchData(prev => ({
                              ...prev,
                              salesChannelTypeId: newValue?.entityTypeID || 0
                            }));
                            // Clear error when user makes a selection
                            if (errors.salesChannelTypeId) {
                              setErrors(prev => ({
                                ...prev,
                                salesChannelTypeId: ""
                              }));
                            }
                          }}
                          value={
                            SalesChannelTypedropdown.find(
                              (option) =>
                                option.entityTypeID === searchData.salesChannelTypeId
                            ) || null
                          }
                          error={!!errors.salesChannelTypeId}
                        // helperText={errors.salesChannelTypeId}
                        />
                        {errors.salesChannelTypeId && (
                          <Typography
                            sx={{
                              color: 'error.main',
                              fontSize: '12px',
                              mt: 0.5,
                              ml: 1
                            }}
                          >
                            {errors.salesChannelTypeId}
                          </Typography>
                        )}
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
                          SALES CHANNEL NAME
                        </Typography>
                        <NuralAutocomplete
                          label="Sales Channel Name"
                          options={SalesChannelListForDropdown}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            option.salesChannelName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesChannelID === value?.salesChannelID
                          }
                          onChange={(event, newValue) => {
                            setSearchData(prev => ({
                              ...prev,
                              salesChannelName: newValue?.salesChannelName || "",
                            }));
                          }}
                          value={
                            SalesChannelListForDropdown.find(
                              (option) =>
                                option.salesChannelName === searchData.salesChannelName
                            ) || null
                          }



                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2} lg={2}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}

                        >
                          FROM DATE
                        </Typography>
                        <NuralCalendar width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={(date) => {
                            if (date) {
                              setSearchData(prev => ({
                                ...prev,
                                fromDate: formatDate(date)
                              }));
                            }
                          }}
                          value={searchData.fromDate ? new Date(searchData.fromDate) : null}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2} lg={2}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TO DATE
                        </Typography>
                        <NuralCalendar width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={(date) => {
                            if (date) {
                              setSearchData(prev => ({
                                ...prev,
                                toDate: formatDate(date)
                              }));
                            }
                          }}
                          value={searchData.toDate ? new Date(searchData.toDate) : null}
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
                          onClick={() => handleResetClick()}
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
                          onClick={() => handleSearchClick()}
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

        <Grid container > {status != null ? (
          <Grid item xs={12} md={12} sx={{ px: 2}}>
            <StatusModel
              width='99%'
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
            <Grid item xs={12} md={12} sx={{ px: 2 ,pr:2}}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 300px)",
                  overflow: "auto",
                  opacity: isSearchInProgress ? 0.5 : 1,
                  pointerEvents: isSearchInProgress ? 'none' : 'auto',
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
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>DATE</Grid>
                          <Grid item>
                            <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                          </Grid>
                        </Grid>
                      </TableCell>
                      {[
                        { id: "stockAdjustNo", label: "STOCK ADJUST NO." },
                        { id: "salesChannel", label: "SALES CHANNEL" },
                        { id: "brand", label: "BRAND" },
                        { id: "category", label: "CATEGORY" },
                        { id: "model", label: "MODEL" },
                        { id: "sku", label: "SKU" },
                        { id: "color", label: "COLOR" },
                        { id: "quantity", label: "QUANTITY" },
                        { id: "stockType", label: "STOCK TYPE" }
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
                            <Grid item sx={{ display: "flex", alignItems: "center" }}>
                              {sortConfig.key === id ? (
                                sortConfig.direction === "asc" ? (
                                  <ArrowUpwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                                ) : (
                                  <ArrowDownwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                                )
                              ) : (
                                <Grid container direction="column" alignItems="center" sx={{ height: 16, width: 16 }}>
                                  <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                                  <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isTableLoading ? (
                      Array(SKELETON_ROWS)
                        .fill(0)
                        .map((_, index) => (
                        
                        <TableRowSkeleton  key={index} columns={10} />
                        
                        ))
                    ) : (
                      filteredRows
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell sx={{ ...rowstyle }}>{row.stockAdjustmentDate}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.stockAdjustmentNo}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.salesChannel}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.brandName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.productCategoryName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.modelName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.skuName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.colorName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.quantity}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.stockType}</TableCell>
                          </TableRow>
                        )))}
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
                      disabled={
                        page >= Math.ceil(totalRecords / rowsPerPage)
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
                        cursor: "pointer",
                        color: page === Math.ceil(totalRecords / rowsPerPage) ? "grey.400" : PRIMARY_BLUE2,
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
                    <Grid mt={1}
                      sx={{ cursor: 'pointer', }}
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling;
                        const pageValue = parseInt(input.value, 10);
                        console.log("pageValue", pageValue);
                        console.log("totalRecords", totalRecords);
                        console.log("rowsPerPage", rowsPerPage);
                        if (
                          pageValue >= 1 &&
                          pageValue <= Math.ceil(totalRecords / rowsPerPage)
                        ) {
                          console.log("pageValueinsideif", pageValue);
                          handleChangePage(pageValue);
                          // input.value = ''; 
                        }
                        else {
                          setPage(1);
                          setSearchData(prev => ({
                            ...prev,
                            pageIndex: 1
                          }));
  
                        }
                      }}>
                      <img src="./Icons/footerSearch.svg" alt="arrow"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </TableContainer>
            </Grid>
          )
          
        )
      }  </Grid>

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
            // filter: isDownloadLoading ? "blur(2px)" : "none",
            transition: "filter 0.3s ease",
          },
          "& .export-button": {
            filter: "none !important",
          },
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
            //   downloadExcel={downloadExcel}
            //   isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
      
    </>
  );
};

export default StockAdjustmentReport;
