import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  ERROR_RED,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import EditIcon from "@mui/icons-material/Edit";
import {
  ISPForBindDropDown,
  GetAuditReport,
  GetISP_StoreOpsReport,
} from "../../../Api/Api";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import Required from "../../../Common/Required";

const AuditReport = () => {
  const [activeTab, setActiveTab] = React.useState("audit-report");
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [dateError, setDateError] = React.useState(null);
  const [fromDateError, setFromDateError] = React.useState(null);
  const [toDateError, setToDateError] = React.useState(null);
  const tabs = [
    { label: "Demo Audit Report", value: "demo-audit-report" },
    { label: "Demo Productivity Report", value: "demo-productivity-report" },
    { label: "Audit Report", value: "audit-report" },
    { label: "TSM Visit Report", value: "tsm-visit-report" },
    { label: "L1L2 Issue Report", value: "l1l2-issue-report" },
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

  const reportsOption = [
    { label: "MEZ Audit Report", value: 1 },
    { label: "Visibility Audit Report", value: 2 },
    { label: "ISP Audit Report", value: 3 },
    { label: "Store Ops Report", value: 4 },
  ];
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [reportTypeID, setReportTypeID] = React.useState(null);
  const [reportTypeError, setReportTypeError] = React.useState(null);
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

  // ISP dropdown and date states
  const [ispOptions, setIspOptions] = React.useState([]);
  const [selectedIsp, setSelectedIsp] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [ispLoading, setIspLoading] = React.useState(false);

  // Table data states
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [jumpToPageInput, setJumpToPageInput] = React.useState("");

  const tableColumns = [
    { id: "retailerCode", label: "RETAILER CODE" },
    { id: "retailerName", label: "RETAILER NAME" },
    { id: "ispCode", label: "ISP CODE" },
    { id: "ispName", label: "ISP NAME" },
    { id: "retailerType", label: "RETAILER TYPE" },
    { id: "retStatus", label: "RET STATUS" },
    { id: "state", label: "STATE" },
    { id: "city", label: "CITY" },
    { id: "tsiCode", label: "TSI CODE" },
    { id: "tsiName", label: "TSI NAME" },
    { id: "rsmCode", label: "RSM CODE" },
    { id: "rsmName", label: "RSM NAME" },
    { id: "ndName", label: "ND NAME" },
    { id: "ndCode", label: "ND CODE" },
    { id: "lastSuccessfulAuditDate", label: "LAST SUCCESSFUL AUDIT DATE" },
    { id: "lastSuccessfulAuditScore", label: "LAST SUCCESSFUL AUDIT SCORE" },
    { id: "lastSuccessfulAuditMonth", label: "LAST SUCCESSFUL AUDIT MONTH" },
    { id: "totalSuccessfulAuditCount", label: "TOTAL SUCCESSFUL AUDIT COUNT" },
    { id: "variableQuestionInHeader", label: "VARIABLE QUESTION IN HEADER" },
    { id: "reportType", label: "REPORT TYPE" },
  ];

  // Set default dates on mount
  React.useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(now);
  }, []);

  // Fetch ISP dropdown data on mount
  React.useEffect(() => {
    const fetchISP = async () => {
      setIspLoading(true);
      try {
        const res = await ISPForBindDropDown();
        setIspOptions(res.ispForBindDropDownMasterList || []);
      } catch (e) {
        setIspOptions([]);
      } finally {
        setIspLoading(false);
      }
    };
    fetchISP();
  }, []);

  // Remove old dateError effect, use field-specific handlers below

  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (toDate && date > toDate) {
      setFromDateError("From Date cannot be greater than To Date.");
    } else {
      setFromDateError(null);
    }
    // Also clear toDateError if now valid
    if (toDate && date <= toDate) setToDateError(null);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (fromDate && date < fromDate) {
      setToDateError("To Date cannot be less than From Date.");
    } else {
      setToDateError(null);
    }
    // Also clear fromDateError if now valid
    if (fromDate && date >= fromDate) setFromDateError(null);
  };

  // Additional validation before search/export
  const validateDates = () => {
    let hasError = false;

    // Check if from date is greater than to date
    if (fromDate && toDate && fromDate > toDate) {
      setFromDateError("From Date cannot be greater than To Date.");
      hasError = true;
    }

    // Validate report type
    if (!reportTypeID) {
      setReportTypeError("Report Type is mandatory");
      hasError = true;
    }

    return !hasError;
  };

  // Fetch report data
  const fetchAuditReport = async (params) => {
    // Additional validation before API call
    if (!reportTypeID) {
      setReportTypeError("Report Type is mandatory");
      return;
    }

    setLoading(true);
    try {
      let res;
      // Call different API based on report type
      if (reportTypeID === 3 || reportTypeID === 4) {
        // ISP Audit Report or StoreOps Report
        res = await GetISP_StoreOpsReport(params);
      } else {
        // MEZ Audit Report or Visibility Audit Report
        res = await GetAuditReport(params);
      }

      if (res.statusCode == 200) {
        // Use the appropriate response data field based on report type
        let reportData = [];
        if (reportTypeID === 3 || reportTypeID === 4) {
          reportData = res.dataList || [];
        } else {
          reportData = res.auditReportList || [];
        }

        setRows(reportData);
        setFilteredRows(reportData);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setRows([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (e) {
      setShowStatus(true);
      setStatus(e.statusCode || 500);
      setTitle(e.statusMessage || "Internal Server Error");
      setRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
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

  // Update the search button click handler
  const handleSearchClick = () => {
    if (!validateDates()) return;

    const params = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      pageIndex: page + 1,
      pageSize: rowsPerPage,
      ispID: selectedIsp?.ispID || 0,
      reportTypeID: reportTypeID,
    };
    setShowStatus(false);
    setStatus(null);
    setTitle(null);
    fetchAuditReport(params);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    if (!validateDates()) return;

    setPage(newPage);
    const params = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      pageIndex: newPage + 1,
      pageSize: rowsPerPage,
      ispID: selectedIsp?.ispID || 0,
      reportTypeID: reportTypeID,
    };
    fetchAuditReport(params);
  };

  const handleChangeRowsPerPage = (event) => {
    if (!validateDates()) return;

    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    const params = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      pageIndex: 1,
      pageSize: newSize,
      ispID: selectedIsp?.ispID || 0,
      reportTypeID: reportTypeID,
    };
    fetchAuditReport(params);
  };

  // Add these functions inside the AuditReport component
  const JumpToFirstPage = () => {
    if (page !== 0) {
      handleChangePage(null, 0);
    }
  };

  const JumpToLastPage = () => {
    const lastPageIndex = Math.max(
      0,
      Math.ceil(totalRecords / rowsPerPage) - 1
    );
    if (page !== lastPageIndex) {
      handleChangePage(null, lastPageIndex);
    }
  };

  // Helper function to display default value for null/undefined
  const displayValue = (value) => {
    return value !== null && value !== undefined ? value : "—";
  };

  const handleCancel = () => {
    setShowStatus(false);
    setStatus(null);
    setTitle(null);
    setSelectedReport(null);
    setReportTypeID(null);
    setReportTypeError(null);
    setSelectedIsp(null);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setFromDate(firstDay);
    setToDate(now);
    setJumpToPageInput("");
    setRows([]);
    setFilteredRows([]);
    setTotalRecords(0);
    setPage(0);
    setDateError(null);
    setFromDateError(null);
    setToDateError(null);
  };

  const downloadExcel = async () => {
    if (!validateDates()) return;

    let params = {
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : "",
      toDate: toDate ? toDate.toISOString().split("T")[0] : "",
      pageIndex: -1,
      pageSize: 10,
      ispID: selectedIsp?.ispID || 0,
      reportTypeID: reportTypeID,
    };
    setIsDownloadLoading(true);
    try {
      let res;
      // Call different API based on report type
      if (reportTypeID === 3 || reportTypeID === 4) {
        // ISP Audit Report or StoreOps Report
        res = await GetISP_StoreOpsReport(params);
      } else {
        // MEZ Audit Report or Visibility Audit Report
        res = await GetAuditReport(params);
      }

      if (res.statusCode == 200 && (res.filepathlink || res.filePath)) {
        window.location.href = res.filepathlink || res.filePath;
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage || "Failed to generate export.");
        setStatus(String(res.statusCode || "500"));
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error during export");
      setStatus(String(error.status || "500"));
    } finally {
      setIsDownloadLoading(false);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "160px", lg: "260px" }, // Add padding to make space for activity panel
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
          <Grid item xs={12} mt={0} mb={0} ml={0} pr={3}>
            <BreadcrumbsHeader pageTitle="Retail" />
          </Grid>

          <Grid item xs={12} ml={0}>
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
                <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
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
                        REPORT TYPE <Required />
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="report"
                        options={reportsOption}
                        placeholder="SELECT"
                        value={selectedReport}
                        onChange={(e, v) => {
                          setSelectedReport(v);
                          setReportTypeID(v?.value || null);
                          setReportTypeError(null);
                        }}
                        getOptionLabel={(option) => option?.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        error={!!reportTypeError}
                      />
                      {reportTypeError && (
                        <Typography
                          color={ERROR_RED}
                          fontSize="12px"
                          mt={1}
                          mb={1}
                        >
                          {reportTypeError}
                        </Typography>
                      )}
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
                        NAME
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="name"
                        options={ispOptions}
                        placeholder="SELECT"
                        value={selectedIsp}
                        onChange={(e, v) => setSelectedIsp(v)}
                        getOptionLabel={(option) => option?.ispName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.ispID === value?.ispID
                        }
                        loading={ispLoading}
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
                        FROM DATE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        error={!!fromDateError}
                      />
                      {fromDateError && (
                        <Typography
                          color={ERROR_RED}
                          fontSize="12px"
                          mt={1}
                          mb={1}
                        >
                          {fromDateError}
                        </Typography>
                      )}
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
                        TO DATE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        value={toDate}
                        onChange={handleToDateChange}
                        error={!!toDateError}
                      />
                      {toDateError && (
                        <Typography
                          color={ERROR_RED}
                          fontSize="12px"
                          mt={1}
                          mb={1}
                        >
                          {toDateError}
                        </Typography>
                      )}
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

        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={10} lg={12} pr={4} pl={2} mb={2}>
            {showStatus && (
              <StatusModel width="100%" status={status} title={title} />
            )}
          </Grid>
        </Grid>

        {filteredRows.length > 0 && (
          <Grid mt={-4} item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 300px)", // For vertical scrolling
                overflow: "auto", // Enable both scrolling directions
              }}
            >
              <Table
                sx={{
                  minWidth: 1500, // Increased minimum width to accommodate more columns
                  tableLayout: "fixed", // Helps with column width control
                }}
                size="small"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={20}
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
                      { id: "retailerCode", label: "RETAILER CODE" },
                      { id: "retailerName", label: "RETAILER NAME" },
                      { id: "ispCode", label: "ISP CODE" },
                      { id: "ispName", label: "ISP NAME" },
                      { id: "retailerType", label: "RETAILER TYPE" },
                      { id: "retStatus", label: "RET STATUS" },
                      { id: "state", label: "STATE" },
                      { id: "city", label: "CITY" },
                      { id: "tsiCode", label: "TSI CODE" },
                      { id: "tsiName", label: "TSI NAME" },
                      { id: "rsmCode", label: "RSM CODE" },
                      { id: "rsmName", label: "RSM NAME" },
                      { id: "ndName", label: "ND NAME" },
                      { id: "ndCode", label: "ND CODE" },
                      {
                        id: "lastSuccessfulAuditDate",
                        label: "LAST SUCCESSFUL AUDIT DATE",
                      },
                      {
                        id: "lastSuccessfulAuditScore",
                        label: "LAST SUCCESSFUL AUDIT SCORE",
                      },
                      {
                        id: "lastSuccessfulAuditMonth",
                        label: "LAST SUCCESSFUL AUDIT MONTH",
                      },
                      {
                        id: "totalSuccessfulAuditCount",
                        label: "TOTAL SUCCESSFUL AUDIT COUNT",
                      },
                      {
                        id: "variableQuestionInHeader",
                        label: "VARIABLE QUESTION IN HEADER",
                      },
                      { id: "reportType", label: "REPORT TYPE" },
                    ].map(({ id, label }) => (
                      <TableCell
                        key={id}
                        onClick={() => handleSort(id)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: "pointer",
                          position: "sticky",
                          top: "47px",
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
                  {loading ? (
                    Array(rowsPerPage)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton
                          key={index}
                          columns={tableColumns.length}
                        />
                      ))
                  ) : filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={20} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row, index) => (
                      <TableRow
                        key={`row-${index}-${
                          row.retailerCode || row.RetailerCode || "nocode"
                        }-${row.ispCode || row.ISPCode || "noisp"}`}
                      >
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.retailerCode || row.RetailerCode)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.retailerName || row.RetailerName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.ispCode || row.ISPCode)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.ispName || row.ISPName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.retailerType || row.RetailerTypeName
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.retStatus || row.Status)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.stateName || row.StateName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.cityName || row.CityName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.tsiCode || row.TSICode)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.tsiName || row.TSIName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.rsmCode || row.RSMCode)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.rsmName || row.RSMName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.ndName || row.NDName)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.ndCode || row.NDCode)}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.lastSuccessfulAuditDate ||
                              row.LastSuccessfulAuditDate
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.lastSuccessfulAuditScore ||
                              row.LastSuccessfulAuditScore
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.lastSuccessfulAuditMonth ||
                              row.LastSuccessfulAuditMonth
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.totalSuccessfulAuditCount ||
                              row.TotalSuccessfulAuditCount
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(
                            row.variableQuestionInHeader ||
                              row["It is a MCQ question"] ||
                              ""
                          )}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {displayValue(row.reportType || row.ReportType)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Custom Pagination */}
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
                      "&:hover": {
                        color: PRIMARY_BLUE2,
                        textDecoration: "underline",
                      },
                    }}
                    onClick={JumpToFirstPage}
                  >
                    JUMP TO FIRST
                  </Typography>
                  <IconButton
                    onClick={() => handleChangePage(null, page - 1)}
                    disabled={page === 0}
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                      "&:hover": {
                        color: PRIMARY_BLUE2,
                        textDecoration: "underline",
                      },
                    }}
                    variant="body2"
                    onClick={JumpToLastPage}
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    value={jumpToPageInput}
                    onChange={(e) => setJumpToPageInput(e.target.value)}
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
                    <img
                      src="./Icons/footerSearch.svg"
                      alt="arrow"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const newPage = parseInt(jumpToPageInput, 10) - 1;
                        if (
                          !isNaN(newPage) &&
                          newPage >= 0 &&
                          newPage < Math.ceil(totalRecords / rowsPerPage)
                        ) {
                          handleChangePage(null, newPage);
                        }
                      }}
                    />
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
            // filter: isDownloadLoading ? "blur(2px)" : "none",
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
              title="Export"
              views={""}
              downloadExcel={downloadExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default AuditReport;
