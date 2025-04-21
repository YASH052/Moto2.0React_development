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
} from "@mui/material";
import React, { useState } from "react";

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

  const logs = JSON.parse(localStorage.getItem("log"));
  // console.log(logs.entityId, "logs");
  console.log(detailsList, "deetailsList");
  console.log(viewSummaryList, "viewSummaryList");

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
    status: null, //0-pending,1-autoreceived,2-received
    fromDate: null,
    toDate: null,
    pageIndex: 1,
    pageSize: 10,
  });
  const [showStatus, setShowStatus] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(true);
  console.log(searchParams, "searchPAramas");
  console.log(filteredRows, "filteredRows");
  console.log(totalRecords, "totalRecords");
  const navigate = useNavigate();
  const tabs = [
    { label: "GRN", value: "grn" },
    { label: "Stock Adjustment Reason", value: "stock-adjustment-reason" },
    { label: "Serial No. Movement", value: "serial-no-moment" },
    { label: "AI Norms", value: "ai-norms" },
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

  const handleChangePage = (event, newPage) => {
    console.log(newPage, "newPage");
    setPage(newPage);
  };
  const handleInvoiceNumberChange = (e) => {
    let value = e.target.value;
    setShowStatus(false);

    // Check if input contains only alphanumeric, spaces and commas
    if (!/^[a-zA-Z0-9\s,]*$/.test(value)) {
      setInvoiceNumberInlineError({
        error: true,
        errorText: "Only alphanumeric characters are allowed",
      });
      return;
    }

    // Remove extra spaces and commas
    value = value.replace(/[\s,]+/g, " ").trim();

    // Replace spaces with commas
    value = value.replace(/\s/g, ", ");

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

  const handleReset = () => {
    setFilteredRows(rowsPerPage);
    setPage(0);
    setStatus(null);
    setTitle("");
  };

  const fetchGrnList = async () => {
    setIsSearchLoading(true);

    let params = {
      ...searchParams,
      flagForTable: 2,
      // fromDate: null,
      // toDate: null,
    };
    // handleSearch(searchValues);
    try {
      const response = await GetGrnList(params);
      // console.log(response, "Response");
      setFilteredRows(response.acknowledgeList || []);
      setTotalRecords(response.totalRecords || 0);
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
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
    }
  };

  const fetchViewSummaryList = async (id) => {
    setSelectedId(id);
    let params = {
      ...searchParams,
      salesUniqueID: id,
      flagForTable: 1,
    };

    try {
      const response = await GetGrnList(params);
      setViewSummaryList(response.summaryList || []);
      setViewSummaryTotalRecords(response.totalRecords || 0);
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
      setViewSummaryList([]);
      setViewSummaryTotalRecords(0);
    }
  };

  const fetchDetailsList = async (id) => {
    // setSelectedId(id);
    console.log("seleected Id", id);
    setIsSearchLoading(true);

    let params = {
      ...searchParams,
      salesUniqueID: id,
      flagForTable: 3,
      // pageSize: 10,
      // pageIndex: 1,
    };
    console.log("params", params);
    try {
      const response = await GetGrnList(params);
      setDetailsList(response.serialList || []);
      setDetailsTotalRecords(response.totalRecords || 0);
    } catch (error) {
      console.error("Error in fetchGrnList:", error);
      setDetailsList([]);
      setDetailsTotalRecords(0);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleUploadClick = async () => {
    setIsUploading(true);
    if (!selectedId) return; // Optionally prevent if no ID is selected.

    let body = {
      value: 2, //2-accept,3-reject
      decider: 1, //1-primary,2-intermediary,3-secondary //
      salesUniqueID: selectedId,
    };
    console.log("params", body);
    try {
      // Make your API call here
      const response = await GetAcceptReject(body); // Replace with actual API call
      // Handle successful response
      if (response.statusCode == 200) {
        setStatus(200);
        setTitle(response.statusMessage || "Acknowledge Accepted");
      } else if (response.statusCode == 400) {
        setStatus(400);
        setTitle("Failed to process request");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setStatus("error");
      setTitle("An error occurred while processing your request");
    } finally {
      setIsUploading(false);
    }
  };
  const handleUploadCancel = async () => {
    setIsUploading(true);
    if (!selectedId) return; // Optionally prevent if no ID is selected.

    let body = {
      value: 3, //2-accept,3-reject
      decider: 1, //1-primary,2-intermediary,3-secondary //
      salesUniqueID: selectedId,
    };
    console.log("params", body);
    try {
      // Make your API call here
      const response = await GetAcceptReject(body); // Replace with actual API call
      if (response.statusCode == 200) {
        setStatus(200);
        setTitle(response.statusMessage || "Acknowledge Rejected");
      } else if (response.statusCode == 400) {
        setStatus(400);
        setTitle(response.statusMessage || "Acknowledge Rejected");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setStatus("error");
      setTitle("An error occurred while processing your request");
    } finally {
      setIsUploading(false);
    }
  };
  const handleSearchChange = (field, value) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const handleFromDateChange = (newValue) => {
    // console.log(newValue);
    setDateError(""); // Clear error on change
    if (searchParams.toDate && newValue > searchParams.toDate) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    const fromDate = new Date(newValue).toISOString().split("T")[0];
    // console.log(fromDate);

    handleSearchChange("fromDate", fromDate);
  };

  const handleToDateChange = (newValue) => {
    setDateError(""); // Clear error on change
    if (searchParams.fromDate && newValue < searchParams.fromDate) {
      setDateError("To date cannot be less than From date");
      return;
    }
    const toDate = new Date(newValue).toISOString().split("T")[0];
    // console.log(toDate);
    handleSearchChange("toDate", toDate);
  };

  const handleJumpToFirst = async () => {
    setPage(0);
    await fetchGrnList({
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    });
  };

  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    if (lastPage >= 0) {
      setPage(lastPage);
      await fetchGrnList({
        ...searchParams,
        pageIndex: lastPage + 1,
        pageSize: rowsPerPage,
      });
    }
  };
  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    await fetchGrnList({
      ...searchParams,
      pageIndex: 1,
      pageSize: newRowsPerPage,
    });
  };
  const handlePageSearch = async () => {
    const pageNumber = parseInt(customPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      await fetchGrnList({
        ...searchParams,
        pageIndex: pageNumber,
        pageSize: rowsPerPage,
      });
      setCustomPageInput(""); // Clear input after successful search
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
  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { sm: "0", md: "280px", lg: "260px" },
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
        <Grid item xs={12} mt={0} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Inventory" />
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
                        STATUS
                      </Typography>
                      <NuralAutocomplete
                        label="Status"
                        options={statusOptions}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("status", newValue?.id ?? null);
                        }}
                        value={
                          statusOptions.find(
                            (option) => option.id === searchParams.status
                          ) ?? null
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
                        INVOICE NUMBER
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Invoice Number"
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
                        disabled={isSearchLoading}
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
                        placeholder="DD/MM/YYYY"
                        value={searchParams.fromDate}
                        onChange={handleFromDateChange}
                        error={!!dateError}
                      />{" "}
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
                        placeholder="DD/MM/YYYY"
                        value={searchParams.toDate}
                        onChange={handleToDateChange}
                        error={!!dateError}
                      />{" "}
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
                        onClick={fetchGrnList}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              {/* List Table */}
              <Box>
                {isSearchLoading ? (
                  Array(rowsPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <TableRowSkeleton key={index} rows={10} columns={10} />
                    ))
                ) : (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                                      header.label === "EDIT"
                                        ? "60px"
                                        : "100px",
                                  }}
                                >
                                  <Grid
                                    container
                                    alignItems="center"
                                    spacing={1}
                                  >
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
                            {filteredRows.map((row, index) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  fontSize: "10px",
                                  border: "1px solid red",
                                  borderRadius: "1rem",
                                  "&:hover": {
                                    backgroundColor: DARK_PURPLE,
                                  },
                                  backgroundColor:
                                    activeRecord == row.salesUniqueID
                                      ? DARK_PURPLE
                                      : "inherit",
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
                                  onClick={() => {
                                    fetchViewSummaryList(row.salesUniqueID);
                                    setActiveRecord(row.salesUniqueID);
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    view
                                  </span>{" "}
                                  <IconButton size="small" title="View Details">
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
                                      "&:hover": {
                                        backgroundColor:
                                          rowsPerPage === value
                                            ? PRIMARY_BLUE2
                                            : "transparent",
                                      },
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
                                page >=
                                Math.ceil(totalRecords / rowsPerPage) - 1
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
                )}
              </Box>
              {/* Summary Table */}
              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
                {viewSummaryList.length > 0 && (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                                label: "QUANNTITY",
                                key: "QUANNTITY",
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
                          {viewSummaryList.map((row, index) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                fontSize: "10px",
                                "&:hover": {
                                  backgroundColor: DARK_PURPLE,
                                },
                                backgroundColor:
                                  activeRecord == index
                                    ? DARK_PURPLE
                                    : "inherit",
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
                                onClick={() => {
                                  fetchDetailsList(selectedId);
                                  setActiveRecord(index);
                                }}
                              >
                                <IconButton
                                  size="small"
                                  title="View Details"
                                  sx={{
                                    ":focus": {
                                      outline: "none",
                                    },
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "400",
                                      paddingRight: "5px",
                                    }}
                                  >
                                    view
                                  </span>{" "}
                                  <VisibilityIcon
                                    sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                                  />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Custom Pagination */}
                      {/* <Grid
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
                   {filteredRows.length} /{" "}
                   {Math.ceil(filteredRows.length / rowsPerPage)} PAGES
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
                           rowsPerPage === value
                             ? PRIMARY_BLUE2
                             : "transparent",
                         color:
                           rowsPerPage === value
                             ? "#fff"
                             : PRIMARY_BLUE2,
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
                   page >=
                   Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                 max={Math.ceil(filteredRows.length / rowsPerPage)}
                 // value={page + 1}
                 onChange={(e) => {
                   const newPage = parseInt(e.target.value, 10) - 1;
                   if (
                     newPage >= 0 &&
                     newPage <
                       Math.ceil(filteredRows.length / rowsPerPage)
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
             </Grid> */}
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
              {/* Details Table */}
              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
                {detailsList.length > 0 && (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                          {detailsList.map((row, index) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                fontSize: "10px",

                                "&:hover": {
                                  backgroundColor: DARK_PURPLE,
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
                          ))}
                        </TableBody>
                      </Table>

                      {/* Custom Pagination */}
                      {/* <Grid
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
                   {filteredRows.length} /{" "}
                   {Math.ceil(filteredRows.length / rowsPerPage)} PAGES
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
                           rowsPerPage === value
                             ? PRIMARY_BLUE2
                             : "transparent",
                         color:
                           rowsPerPage === value
                             ? "#fff"
                             : PRIMARY_BLUE2,
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
                   page >=
                   Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                 max={Math.ceil(filteredRows.length / rowsPerPage)}
                 // value={page + 1}
                 onChange={(e) => {
                   const newPage = parseInt(e.target.value, 10) - 1;
                   if (
                     newPage >= 0 &&
                     newPage <
                       Math.ceil(filteredRows.length / rowsPerPage)
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
           </Grid> */}
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
              {/* Serial List Table */}
              <Grid item md={6} lg={12} pr={2} py={2} display={"flex"}>
                {status && title && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={title}
                    // onClose={() => setShowStatus(false)}
                  />
                )}
              </Grid>

              {viewSummaryList.length > 0 && searchParams.status == 0 && (
                <Grid item>
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
          md: 10,
          lg: 10,
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
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={views} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralExport
              title="Export"
              views={views}
              downloadExcel={fetchExcelLink}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </Grid>
  );
};

export default Grn;
