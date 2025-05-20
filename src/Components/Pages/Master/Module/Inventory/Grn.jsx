import {
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  FormHelperText,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";

import {
  DARK_PURPLE,
  PRIMARY_BLUE2,
  LIGHT_GRAY2,
  AQUA,
} from "../../../../Common/colors";

import NuralButton from "../../../NuralCustomComponents/NuralButton";
import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import StatusModel from "../../../../Common/StatusModel";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAutocomplete from "../../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../../NuralCustomComponents/NuralCalendar";
import NuralTextButton from "../../../NuralCustomComponents/NuralTextButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GetAcceptReject, GetGrnList } from "../../../../Api/Api";
import NuralActivityPanel from "../../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../../NuralCustomComponents/NuralReports";
import NuralExport from "../../../NuralCustomComponents/NuralExport";
import { TableRowSkeleton } from "../../../../Common/Skeletons";
import {
  getFirstDayOfMonth,
  getToday,
} from "../../../../Common/commonFunction";
import Required from "../../../../Common/Required";

const views = ["View 1", "View 2", "View 3"];

const tableHeaderStyle = {
  fontFamily: "Manrope",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "16.39px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
};
const statusOptions = [
  { id: 0, label: "Pending" },
  { id: 1, label: "Auto Received" },
  { id: 2, label: "Received" },
];

const Grn = () => {
  const [activeTab, setActiveTab] = React.useState("grn");
  const [activeRecord, setActiveRecord] = useState(null);
  const [activeSummaryRecord, setActiveSummaryRecord] = useState(null);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [dateError, setDateError] = useState("");
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [viewSummaryList, setViewSummaryList] = useState([]);
  const [viewSummaryTotalRecords, setViewSummaryTotalRecords] = useState(0);
  const [detailsTotalRecords, setDetailsTotalRecords] = useState(0);
  const [detailsList, setDetailsList] = useState([]);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [customPageInput, setCustomPageInput] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [showDetailTable, setShowDetailTable] = useState(false);

  const logs = JSON.parse(localStorage.getItem("log"));
  // console.log(logs.entityId, "logs");

  const [invoiceNumberInlineError, setInvoiceNumberInlineError] =
    React.useState({
      error: false,
      errorText: "",
    });
  const [searchParams, setSearchParams] = React.useState({
    salesChannelID: logs.entityId,
    invoiceNumber: "",
    flagForTable: 2, // 2 - list, 1- summary list, 3 - serial list
    salesUniqueID: 0,
    otherEntity: 0,
    status: 0, //0-pending,1-autoreceived,2-received
    fromDate: getFirstDayOfMonth(),
    toDate: getToday(),
    pageIndex: 1,
    pageSize: 10,
  });

  const tabs = [
    { label: "GRN", value: "grn" },
    { label: "Stock Adjustment Reason", value: "stock-adjustment-reason" },
    { label: "AI Norms", value: "ai-norms" },
    { label: "Demo Conversion", value: "demo-conversion" },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    setIsSearchLoading(true);
    try {
      await fetchGrnList({
        ...searchParams,
        pageIndex: newPage + 1,
        pageSize: rowsPerPage,
      });
    } catch (error) {
      console.error("Error in handleChangePage:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleInvoiceNumberChange = (e) => {
    let value = e.target.value;
    setShowStatus(false);

    // Allow alphanumeric characters, spaces, and commas
    if (!/^[a-zA-Z0-9\s,]*$/.test(value)) {
      setInvoiceNumberInlineError({
        error: true,
        errorText: "Only alphanumeric characters are allowed",
      });
      return;
    }

    setInvoiceNumber(value);
    setInvoiceNumberInlineError({
      error: false,
      errorText: "",
    });

    // Update search params
    setSearchParams((prev) => ({
      ...prev,
      invoiceNumber: value,
    }));
  };
  //
  // Update the handleSerialNumberPaste handler
  const handleInvoiceNumberPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Check if pasted text contains only alphanumeric, spaces and commas
    if (!/^[a-zA-Z0-9\s,]*$/.test(pastedText)) {
      setInvoiceNumberInlineError({
        error: true,
        errorText: "Only alphanumeric characters are allowed",
      });
      return;
    }

    // Clean up pasted text - remove extra spaces and commas
    const cleanedText = pastedText.replace(/[\s,]+/g, " ").trim();
    const newValue = invoiceNumber
      ? invoiceNumber + "," + cleanedText
      : cleanedText;
    const formattedValue = newValue.replace(/\s/g, ", ");

    setInvoiceNumber(formattedValue);
    setInvoiceNumberInlineError({
      error: false,
      errorText: "",
    });

    // Update search params
    setSearchParams((prev) => ({
      ...prev,
      invoiceNumber: formattedValue,
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

  const [fromDateError, setFromDateError] = useState("");
  const [toDateError, setToDateError] = useState("");

  const handleFromDateChange = (newValue) => {
    setFromDateError("");
    setToDateError("");
    if (!newValue) {
      handleSearchChange("fromDate", null);
      return;
    }

    const fromDate = new Date(newValue);
    const today = new Date();

    if (fromDate > today) {
      setFromDateError("From date cannot be in the future");
      return;
    }

    if (searchParams.toDate) {
      const toDate = new Date(searchParams.toDate);
      if (fromDate > toDate) {
        setFromDateError("From date cannot be greater than To date");
        return;
      }
    }

    handleSearchChange("fromDate", fromDate.toISOString().split("T")[0]);
  };

  const handleToDateChange = (newValue) => {
    setFromDateError("");
    setToDateError("");
    if (!newValue) {
      handleSearchChange("toDate", null);
      return;
    }

    const toDate = new Date(newValue);
    const today = new Date();

    if (toDate > today) {
      setToDateError("To date cannot be in the future");
      return;
    }

    if (searchParams.fromDate) {
      const fromDate = new Date(searchParams.fromDate);
      if (toDate < fromDate) {
        setToDateError("To date cannot be less than From date");
        return;
      }
    }

    handleSearchChange("toDate", toDate.toISOString().split("T")[0]);
  };

  const handleReset = () => {
    setSearchParams({
      salesChannelID: logs.entityId,
      invoiceNumber: "",
      flagForTable: 2,
      salesUniqueID: 0,
      otherEntity: 0,
      status: null,
      fromDate: getFirstDayOfMonth(),
      toDate: getToday(),
      pageIndex: 1,
      pageSize: 10,
    });
    setInvoiceNumber("");
    setStatus(null);
    setTitle("");
    setShowStatus(false);
    setViewSummaryList([]);
    setDetailsList([]);
    setActiveRecord(null);
    setActiveSummaryRecord(null);
    setSelectedId(null);
    setShowSummaryTable(false);
    setShowDetailTable(false);
    setPage(0);
    setRowsPerPage(10);
    setFromDateError("");
    setToDateError("");
    setFilteredRows([]);
    setTotalRecords(0);
  };

  const handleSearch = () => {
    setShowStatus(false);
    if (searchParams.status === null || searchParams.status === undefined) {
      setStatusError(true);
      return;
    }
    if (fromDateError || toDateError) {
      return;
    }
    setStatusError(false);
    setIsSearchLoading(true);
    // Clear summary and detail tables
    setViewSummaryList([]);
    setDetailsList([]);
    setActiveRecord(null);
    setActiveSummaryRecord(null);
    setShowSummaryTable(false);
    setShowDetailTable(false);
    fetchGrnList();
  };

  const fetchGrnList = async (params = searchParams) => {
    try {
      const response = await GetGrnList(params);
      if (response.statusCode == 200) {
        setFilteredRows(response.acknowledgeList || []);
        setTotalRecords(response.totalRecords || 0);
      } else {
        setStatus(400);
        setTitle(response.statusMessage || "Failed to process request");
        setShowStatus(true);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
      setStatus(400);
      setTitle("An error occurred while fetching data");
      setShowStatus(true);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsSearchLoading(false);
    }
  };
  const fetchExcelLink = async () => {
    let params = {
      ...searchParams,
      flagForTable: 2,
      pageIndex: -1,
      // fromDate: null,
      // toDate: null,
    };
    // handleSearch(searchValues);
    try {
      setIsDownloadLoading(true);
      const response = await GetGrnList(params);
      if (response.statusCode == 200) {
        window.location.href = response.reportLink;
        // setStatus(200);
        // setTitle(response.statusMessage || "Excel Link Generated");
      } else {
        setStatus(400);
        setTitle(response.statusMessage || "Failed to process request");
      }
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const fetchViewSummaryList = async (id) => {
    console.log("fetchViewSummaryList called with id:", id);
    setSelectedId(id);
    setIsSummaryLoading(true);
    let params = {
      ...searchParams,
      salesUniqueID: id,
      flagForTable: 1,
    };
    console.log("Summary list params:", params);

    try {
      const response = await GetGrnList(params);
      console.log("Summary list response:", response);
      if (response.statusCode == 200) {
        setViewSummaryList(response.summaryList || []);
        setViewSummaryTotalRecords(response.totalRecords || 0);
        console.log("Updated viewSummaryList:", response.summaryList);
      } else {
        setViewSummaryList([]);
        setViewSummaryTotalRecords(0);
      }
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
      setViewSummaryList([]);
      setViewSummaryTotalRecords(0);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const fetchDetailsList = async (id) => {
    setIsDetailsLoading(true);
    let params = {
      ...searchParams,
      salesUniqueID: id,
      flagForTable: 3,
    };
    try {
      const response = await GetGrnList(params);
      if (response.statusCode == 200) {
        console.log("response.serialList =>>>>>>>>>:", response.serialList);
        setDetailsList(response.serialList || []);
        setDetailsTotalRecords(response.totalRecords || 0);
      } else {
        setDetailsList([]);
        setDetailsTotalRecords(0);
      }
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
      setDetailsList([]);
      setDetailsTotalRecords(0);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleUploadClick = async () => {
    setIsUploading(true);
    if (!selectedId) return;

    let body = {
      value: 2,
      decider: 1,
      salesUniqueID: selectedId,
    };

    try {
      const response = await GetAcceptReject(body);
      if (response.statusCode == 200) {
        setStatus(200);
        setTitle(response.statusMessage || "Acknowledge Accepted");
        setViewSummaryList([]);
        setDetailsList([]);
        setActiveRecord(null);
        setActiveSummaryRecord(null);
        setSelectedId(null);
        setShowSummaryTable(false);
        setShowDetailTable(false);
        fetchGrnList();
      } else {
        setStatus(400);
        setTitle("Failed to process request");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setStatus("error");
      setTitle("An error occurred while processing your request");
    } finally {
      setIsUploading(false);
      setShowSummaryTable(false);
      setShowDetailTable(false);
    }
  };

  const handleUploadCancel = async () => {
    setIsUploading(true);
    if (!selectedId) return;

    let body = {
      value: 3,
      decider: 1,
      salesUniqueID: selectedId,
    };

    try {
      const response = await GetAcceptReject(body);
      if (response.statusCode === 200) {
        setStatus(200);
        setTitle(response.statusMessage || "Acknowledge Rejected");
        setViewSummaryList([]);
        setDetailsList([]);
        setActiveRecord(null);
        setActiveSummaryRecord(null);
        setSelectedId(null);
        setShowSummaryTable(false);
        setShowDetailTable(false);
        fetchGrnList();
      } else {
        setStatus(400);
        setTitle(response.statusMessage || "Failed to process request");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setStatus("error");
      setTitle("An error occurred while processing your request");
    } finally {
      setIsUploading(false);
      setShowSummaryTable(false);
      setShowDetailTable(false);
    }
  };
  const handleSearchChange = (field, value) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const handleJumpToFirst = async () => {
    setPage(0);
    setIsSearchLoading(true);
    try {
      await fetchGrnList({
        ...searchParams,
        pageIndex: 1,
        pageSize: rowsPerPage,
      });
    } catch (error) {
      console.error("Error in handleJumpToFirst:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    if (lastPage >= 0) {
      setPage(lastPage);
      setIsSearchLoading(true);
      try {
        await fetchGrnList({
          ...searchParams,
          pageIndex: lastPage + 1,
          pageSize: rowsPerPage,
        });
      } catch (error) {
        console.error("Error in handleJumpToLast:", error);
      } finally {
        setIsSearchLoading(false);
      }
    }
  };
  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setIsSearchLoading(true);
    try {
      await fetchGrnList({
        ...searchParams,
        pageIndex: 1,
        pageSize: newRowsPerPage,
      });
    } catch (error) {
      console.error("Error in handleChangeRowsPerPage:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };
  const handlePageSearch = async () => {
    const pageNumber = parseInt(customPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      setIsSearchLoading(true);
      try {
        const response = await fetchGrnList({
          ...searchParams,
          pageIndex: pageNumber,
          pageSize: rowsPerPage,
        });
        if (response?.statusCode === 200) {
          setCustomPageInput("");
        }
      } catch (error) {
        console.error("Error in handlePageSearch:", error);
      } finally {
        setIsSearchLoading(false);
      }
    }
  };
  // Add handler for custom page input change
  const handleCustomPageInputChange = (e) => {
    setCustomPageInput(e.target.value);
  };
  // Add handler for custom page input keypress
  const handleCustomPageKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePageSearch();
    }
  };

  const handleRowClick = (id) => {
    console.log("handleRowClick called with id:", id);
    setActiveRecord(id);
    setActiveSummaryRecord(null);
    setViewSummaryList([]);
    setDetailsList([]);
    setDetailsTotalRecords(0);
    setViewSummaryTotalRecords(0);
    setShowSummaryTable(true);
    setShowDetailTable(false);
    fetchViewSummaryList(id);
  };

  const detailTableRef = useRef(null);
  const summaryTableRef = useRef(null);

  const handleSummaryRowClick = (detailID, index) => {
    setActiveSummaryRecord(index);
    setShowDetailTable(true);
    fetchDetailsList(detailID);
    setTimeout(() => {
      detailTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleViewClick = async (id) => {
    setIsViewLoading(true);
    await handleRowClick(id);
    setTimeout(() => {
      summaryTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    setIsViewLoading(false);
  };

  useEffect(() => {
    if (status && title) {
      setShowStatus(true);
      const timer = setTimeout(() => {
        setShowStatus(false);
        setStatus(null);
        setTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, title]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { sm: "0", md: "180px", lg: "260px" },
      }}
    >
      {/* Rest of the content */}
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
        <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
          <BreadcrumbsHeader pageTitle="Inventory" />
        </Grid>

        <Grid item xs={12} ml={0}>
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
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2
                  title="Acknowledge Purchase"
                  controlled={true}
                  expanded={accordionExpanded}
                  onChange={(event, expanded) => setAccordionExpanded(expanded)}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      marginBottom: "10px",
                      marginTop: "10px",
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    Acknowledge Purchase
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        STATUS <Required/>
                      </Typography>
                      <NuralAutocomplete
                        label="Status"
                        options={statusOptions}
                        placeholder="SELECT"
                        width="100%"
                        required
                        error={statusError}
                        errorText={statusError ? "Status is required" : ""}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onChange={(event, newValue) => {
                          setStatusError(false);
                          handleSearchChange("status", newValue?.id ?? null);
                        }}
                        value={
                          statusOptions.find(
                            (option) => option.id === searchParams.status
                          ) ?? null
                        }
                      />
                      {statusError && (
                        <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                          Status is required
                        </FormHelperText>
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
                        INVOICE NUMBER
                      </Typography>
                      <NuralTextField
                        placeholder="ENTER INVOICE NUMBER"
                        width="100%"
                        backgroundColor={LIGHT_GRAY2}
                        value={invoiceNumber}
                        onChange={handleInvoiceNumberChange}
                        onPaste={handleInvoiceNumberPaste}
                        error={invoiceNumberInlineError.error}
                        errorText={invoiceNumberInlineError.errorText}
                        inputProps={{
                          pattern: "[a-zA-Z0-9,\\s]*",
                          title: "Only alphanumeric characters are allowed",
                        }}
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
                        FROM DATE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        value={searchParams.fromDate}
                        onChange={handleFromDateChange}
                        error={!!fromDateError}
                        sx={{
                          "& .MuiInputBase-input::placeholder": {
                            color: PRIMARY_BLUE2,
                            opacity: 0.7,
                          },
                        }}
                      />
                      {fromDateError && (
                        <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                          {fromDateError}
                        </FormHelperText>
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
                        TO DATE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        value={searchParams.toDate}
                        onChange={handleToDateChange}
                        error={!!toDateError}
                        sx={{
                          "& .MuiInputBase-input::placeholder": {
                            color: PRIMARY_BLUE2,
                            opacity: 0.7,
                          },
                        }}
                      />
                      {toDateError && (
                        <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                          {toDateError}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    mt={1}
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
                        onClick={handleSearch}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              {/* List Table */}

              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    color: PRIMARY_BLUE2,
                    maxHeight: "calc(120vh - 180px)",
                    overflow: "auto",
                    position: "relative",
                    "& .MuiTable-root": {
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    },
                  }}
                >
                  {filteredRows.length > 0 && (
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
                            {
                              label: "SALE FROM",
                              key: "saleFrom",
                              sortable: true,
                            },
                            {
                              label: "INVOICE NO",
                              key: "invoiceNo",
                              sortable: true,
                            },
                            {
                              label: "INVOICE DATE",
                              key: "invoiceDate",
                              sortable: true,
                            },
                            {
                              label: "QUANTITY",
                              key: "quantity",
                              sortable: true,
                            },
                            {
                              label: "DETAIL",
                              key: "detail",
                              sortable: false,
                            },
                          ].map((header, index) => (
                            <TableCell
                              key={header.label}
                              onClick={() =>
                                header.sortable !== false &&
                                handleSort(header.key)
                              }
                              sx={{
                                ...tableHeaderStyle,
                                cursor:
                                  header.sortable !== false
                                    ? "pointer"
                                    : "default",
                                position: "sticky",
                                top: "45px",
                                backgroundColor: LIGHT_GRAY2,
                                zIndex: 100,
                                padding: "8px 16px",
                                minWidth:
                                  header.label === "EDIT" ? "60px" : "100px",
                              }}
                            >
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item>{header.label}</Grid>
                                {header.sortable !== false && (
                                  <Grid
                                    item
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {sortConfig.key === header.key ? (
                                      sortConfig.direction === "asc" ? (
                                        <ArrowUpwardIcon
                                          sx={{
                                            fontSize: 16,
                                            color: PRIMARY_BLUE2,
                                          }}
                                        />
                                      ) : (
                                        <ArrowDownwardIcon
                                          sx={{
                                            fontSize: 16,
                                            color: PRIMARY_BLUE2,
                                          }}
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
                                          sx={{
                                            fontSize: 12,
                                            color: "grey.400",
                                          }}
                                        />
                                        <ArrowDownwardIcon
                                          sx={{
                                            fontSize: 12,
                                            color: "grey.400",
                                          }}
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
                        {isSearchLoading
                          ? Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <TableRowSkeleton
                                  key={index}
                                  rows={10}
                                  columns={6}
                                />
                              ))
                          : filteredRows.map((row, index) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                  backgroundColor:
                                    activeRecord === row.salesUniqueID
                                      ? DARK_PURPLE
                                      : "inherit",
                                  color:
                                    activeRecord === row.salesUniqueID
                                      ? "#fff"
                                      : "inherit",
                                  "& .MuiTableCell-root": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : "inherit",
                                  },
                                  "& span": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
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
                                  {row?.rowNo}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.saleFrom}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.invoiceNo}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.invoiceDate}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.quantity}
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
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "700",
                                      cursor: "pointer",
                                      color:
                                        activeRecord === row.salesUniqueID
                                          ? "#fff"
                                          : PRIMARY_BLUE2,
                                    }}
                                    onClick={() =>
                                      handleViewClick(row.salesUniqueID)
                                    }
                                  >
                                    view
                                  </span>{" "}
                                  <IconButton
                                    size="small"
                                    title="View Details"
                                    sx={{ "&:focus": { outline: "none" } }}
                                  >
                                    <VisibilityIcon
                                      sx={{
                                        fontSize: 16,
                                        color: PRIMARY_BLUE2,
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  )}

                  {/* Custom Pagination */}
                  {filteredRows.length > 0 && (
                    <Grid
                      container
                      sx={{
                        p: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "sticky",
                        bottom: 0,
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1000,
                        // border: "1px solid red",
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
                          <span
                            style={{
                              fontWeight: 700,
                              color: PRIMARY_BLUE2,
                            }}
                          >
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
                                  handleChangeRowsPerPage({
                                    target: { value },
                                  })
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
                                    rowsPerPage === value
                                      ? "#fff"
                                      : PRIMARY_BLUE2,
                                  fontSize: "12px",
                                  // "&:hover": {
                                  //   backgroundColor:
                                  //     rowsPerPage === value
                                  //       ? PRIMARY_BLUE2
                                  //       : "transparent",
                                  // },
                                  mx: 0.5,
                                  "&:focus": {
                                    outline: "none",
                                  },
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
                          }}
                          onClick={handleJumpToFirst}
                        >
                          JUMP TO FIRST
                        </Typography>
                        <IconButton
                          onClick={() => handleChangePage(null, page - 1)}
                          disabled={page === 0}
                          sx={{
                            "&:focus": {
                              outline: "none",
                            },
                          }}
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
                          sx={{
                            cursor: "pointer",
                            "&:focus": {
                              outline: "none",
                            },
                          }}
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
                            cursor: "pointer",
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                          onClick={handleJumpToLast}
                          variant="body2"
                        >
                          JUMP TO LAST
                        </Typography>
                        <input
                          type="number"
                          placeholder="JUMP TO PAGE"
                          min={1}
                          max={Math.ceil(totalRecords / rowsPerPage)}
                          value={customPageInput}
                          onChange={handleCustomPageInputChange}
                          onKeyPress={handleCustomPageKeyPress}
                          style={{
                            width: "100px",
                            height: "24px",
                            fontSize: "8px",
                            paddingRight: "8px",
                            paddingLeft: "8px",
                            textAlign: "center",
                            borderRadius: "8px",
                            borderWidth: "1px",
                            border: `1px solid ${PRIMARY_BLUE2}`,
                            backgroundColor: LIGHT_GRAY2,
                            "&::placeholder": {},
                            outline: "none",
                            "&:focus": {
                              outline: "none",
                            },
                          }}
                        />
                        <Grid mt={1} onClick={handlePageSearch}>
                          <img
                            src="./Icons/footerSearch.svg"
                            style={{ cursor: "pointer" }}
                            alt="arrow"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </TableContainer>
              </Grid>
              {showStatus && (
                <Grid
                  container
                  justifyContent="center"
                  mt={2}
                  alignItems="center"
                >
                  <StatusModel width="100%" status={status} title={title} />
                </Grid>
              )}
              {/* Summary Table */}

              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
                {showSummaryTable && (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }} ref={summaryTableRef}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        color: PRIMARY_BLUE2,
                        maxHeight: "calc(120vh - 180px)",
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
                              {
                                label: "SKU",
                                key: "SKU",
                                sortable: true,
                              },
                              {
                                label: "CODE",
                                key: "CODE",
                                sortable: true,
                              },
                              {
                                label: "QUANTITY",
                                key: "QUANTITY",
                                sortable: true,
                              },
                              {
                                label: "MODE",
                                key: "MODE",
                                sortable: true,
                              },
                              {
                                label: "AMOUNT",
                                key: "AMOUNT",
                                sortable: true,
                              },

                              {
                                label: "DETAIL",
                                key: "DETAIL",
                                sortable: false,
                              },
                            ].map((header, index) => (
                              <TableCell
                                key={header.label}
                                onClick={() =>
                                  header.sortable !== false &&
                                  handleSort(header.key)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor:
                                    header.sortable !== false
                                      ? "pointer"
                                      : "default",
                                  position: "sticky",
                                  top: "45px",
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 100,
                                  padding: "8px 16px",
                                  minWidth:
                                    header.label === "EDIT" ? "60px" : "100px",
                                }}
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>{header.label}</Grid>
                                  {header.sortable !== false && (
                                    <Grid
                                      item
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {sortConfig.key === header.key ? (
                                        sortConfig.direction === "asc" ? (
                                          <ArrowUpwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
                                          />
                                        ) : (
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
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
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
                                          />
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
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
                          {viewSummaryList.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                align="center"
                                sx={{ py: 3 }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "Manrope",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: PRIMARY_BLUE2,
                                  }}
                                >
                                  No data available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            viewSummaryList.map((row, index) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  fontSize: "10px",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                  backgroundColor:
                                    activeSummaryRecord == index
                                      ? DARK_PURPLE
                                      : "inherit",
                                  color:
                                    activeSummaryRecord == index
                                      ? "#fff"
                                      : "inherit",
                                  "& .MuiTableCell-root": {
                                    color:
                                      activeSummaryRecord == index
                                        ? "#fff"
                                        : "inherit",
                                  },
                                  "& span": {
                                    color:
                                      activeSummaryRecord == index
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color:
                                      activeSummaryRecord == index
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
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
                                  {row.rowNo}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.skuName}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.skuCode}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.quantity}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.mode}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  {row.amount}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    minWidth: "100px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() =>
                                      handleSummaryRowClick(row.detailID, index)
                                    }
                                    size="small"
                                    title="View Details"
                                    sx={{
                                      "&:focus": {
                                        outline: "none",
                                      },
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        color:
                                          activeSummaryRecord == index
                                            ? "#fff"
                                            : PRIMARY_BLUE2,
                                      }}
                                    >
                                      view &nbsp;
                                    </span>{" "}
                                    <VisibilityIcon
                                      sx={{
                                        fontSize: 16,
                                        color: PRIMARY_BLUE2,
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
              {/* Details Table */}
              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
                {showDetailTable && (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }} ref={detailTableRef}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        color: PRIMARY_BLUE2,
                        maxHeight: "calc(120vh - 180px)",
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
                                    Details
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
                              {
                                label: "SERIAL NO",
                                key: "SERIAL NO",
                                sortable: true,
                              },
                            ].map((header, index) => (
                              <TableCell
                                key={header.label}
                                onClick={() =>
                                  header.sortable !== false &&
                                  handleSort(header.key)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor:
                                    header.sortable !== false
                                      ? "pointer"
                                      : "default",
                                  position: "sticky",
                                  top: "45px",
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 100,
                                  padding: "8px 16px",
                                  minWidth:
                                    header.label === "EDIT" ? "60px" : "100px",
                                }}
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>{header.label}</Grid>
                                  {header.sortable !== false && (
                                    <Grid
                                      item
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {sortConfig.key === header.key ? (
                                        sortConfig.direction === "asc" ? (
                                          <ArrowUpwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
                                          />
                                        ) : (
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
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
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
                                          />
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
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
                          {detailsList.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={2}
                                align="center"
                                sx={{ py: 3 }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: "Manrope",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: PRIMARY_BLUE2,
                                  }}
                                >
                                  No data available
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            detailsList.map((row, index) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  fontSize: "10px",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                  backgroundColor:
                                    activeRecord === row.salesUniqueID
                                      ? DARK_PURPLE
                                      : "inherit",
                                  color:
                                    activeRecord === row.salesUniqueID
                                      ? "#fff"
                                      : "inherit",
                                  "& .MuiTableCell-root": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : "inherit",
                                  },
                                  "& span": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color:
                                      activeRecord === row.salesUniqueID
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
                                  },
                                }}
                              >
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    width: "65%",
                                    // border:"1px solid red"
                                  }}
                                >
                                  {row.rowNo}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "8px 16px",
                                    fontSize: "10px",
                                    textAlign: "left",
                                    width: "35%",
                                  }}
                                >
                                  {row.serialNumber}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
              {/* Serial List Table */}

              {viewSummaryList.length > 0 && searchParams.status == 0 && (
                <Grid item mt={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="REJECT"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleUploadCancel}
                        width="100%"
                        disabled={isUploading}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text={isUploading ? "UPLOADING..." : "ACCEPT"}
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={handleUploadClick}
                        width="100%"
                        disabled={isUploading}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={12}
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
          width: { sm: "220px", md: "250px", lg: "280px" },
        }}
      >
        <NuralActivityPanel>
          {/* <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={views} />
          </Grid> */}
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralExport
              title="Export"
              views={views}
              downloadExcel={fetchExcelLink}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </Grid>
  );
};

export default Grn;
