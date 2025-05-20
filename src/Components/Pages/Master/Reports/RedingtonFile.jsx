import { Grid, Typography, Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { fetchProcessList, fetchSAPList } from "../../../Api/Api";

import NuralPagination from "../../../Common/NuralPagination";
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import { getFirstDayOfMonth, getToday } from "../../../Common/commonFunction";
import { useNavigate } from "react-router-dom";

// Add column mapping for sorting
const columnMapping = {
  FILE: "interfaceFileName",
  "FILE ERRORS": "errorMsg",
  "UPLOAD STATUS": "transStatus",
  "UPLOAD RECORDS": "totalRecords",
  "PROCESSED RECORDS": "processedRecords",
  "INVALID RECORDS": "invalidRecords",
  "PROCESSED ON": "createdOn",
};

const RedingtonFile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("redington-file");
  const tabs = [
    { label: "Activation File Received", value: "activation-file-received" },
    { label: "SAP Integration", value: "redington-file" },
    { label: "Reliance API Status", value: "rel-api-status" },
    { label: "Log Report", value: "Log Report" },
  ];

  const [processList, setProcessList] = useState([]);
  const [processStatus, setProcessStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  // Fix the order of state declarations
  const [searchParams, setSearchParams] = useState(() => {
    return {
      service_network_id: 0,
      interfaceMasterID: 0,
      processStatusId: -1,
      uploadFromDate: getFirstDayOfMonth(),
      uploadToDate: getToday(),
      export: 0,
      exportType: 1,
      interfaceFileID: 0,
      poNumber: "",
      pageIndex: 1,
      pageSize: 10,
      callType: 2,
    };
  });

  // These should come after searchParams declaration
  const [page, setPage] = React.useState(searchParams.pageIndex - 1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  // Add sorting state
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");

  // Add this state for date validation
  const [fromDateError, setFromDateError] = useState("");
  const [toDateError, setToDateError] = useState("");
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [processTypeError, setProcessTypeError] = useState("");

  // Create these date validation handlers
  const handleFromDateChange = (newValue) => {
    setFromDateError(""); // Clear from date error
    if (
      searchParams.uploadToDate &&
      new Date(newValue) > new Date(searchParams.uploadToDate)
    ) {
      setFromDateError("From date cannot be greater than To date");
    }
    // Format date as YYYY-MM-DD
    const formattedDate =
      newValue instanceof Date
        ? `${newValue.getFullYear()}-${String(newValue.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(newValue.getDate()).padStart(2, "0")}`
        : newValue;
    setSearchParams((prev) => ({
      ...prev,
      uploadFromDate: formattedDate,
    }));
  };

  const handleToDateChange = (newValue) => {
    setToDateError(""); // Clear to date error
    if (
      searchParams.uploadFromDate &&
      new Date(newValue) < new Date(searchParams.uploadFromDate)
    ) {
      setToDateError("To date cannot be less than From date");
    }
    // Format date as YYYY-MM-DD
    const formattedDate =
      newValue instanceof Date
        ? `${newValue.getFullYear()}-${String(newValue.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(newValue.getDate()).padStart(2, "0")}`
        : newValue;
    setSearchParams((prev) => ({
      ...prev,
      uploadToDate: formattedDate,
    }));
  };

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const statuses = ["Completed", "Pending", "Failed"];
    const dates = ["2024-01-15", "2024-02-01", "2024-02-15"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        column1: Math.floor(Math.random() * 100), // File check count
        column2: Math.floor(Math.random() * 50), // File errors count
        column3: statuses[Math.floor(Math.random() * statuses.length)],
        column4: Math.floor(Math.random() * 1000), // Upload records
        column5: Math.floor(Math.random() * 800), // Processed records
        column6: Math.floor(Math.random() * 200), // Invalid records
        column7: dates[Math.floor(Math.random() * dates.length)], // Processed on
        column8: "Download", // Download link/button text
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());

  const handleSearchChange = (field, value) => {
    // Map UI field names to API parameter names
    const fieldMapping = {
      processType: "interfaceMasterID",
      processStatus: "processStatusId",
      uploadFromDate: "uploadFromDate",
      uploadToDate: "uploadToDate",
    };

    if (fieldMapping[field]) {
      setSearchParams((prev) => ({
        ...prev,
        [fieldMapping[field]]: value,
      }));
    }
  };

  // Add handleSort function
  const handleSort = (columnName) => {
    const key = columnMapping[columnName];
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setTableData(sortedData);
    setSortConfig({ key, direction });
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    setStatus(false);
    setTitle("");
    setProcessTypeError("");

    // Validate process type
    if (!searchParams.interfaceMasterID) {
      setProcessTypeError("Please select Process Type");
      return;
    }

    // Check if dates are empty
    if (!searchParams.uploadFromDate || !searchParams.uploadToDate) {
      setFromDateError("From Date is mandatory");
      setToDateError("To Date is mandatory");
      return;
    }

    // Don't proceed if there are date validation errors
    if (fromDateError || toDateError) {
      return;
    }

    // Set searchClicked to true
    setSearchClicked(true);

    // Validate dates one more time before search
    const fromDate = new Date(searchParams.uploadFromDate);
    const toDate = new Date(searchParams.uploadToDate);

    if (fromDate > toDate) {
      setFromDateError("From date cannot be greater than To date");
      setToDateError("To date cannot be less than From date");
      return;
    }

    // Create updated params with reset pagination
    const updatedParams = {
      ...searchParams,
      pageIndex: 1, // Reset to first page
      pageSize: rowsPerPage,
    };

    setPage(0); // Reset to first page (0-based)
    setSearchParams(updatedParams);
    getSAPList(updatedParams);
  };

  // Update the handlePaginationChange function
  const handlePaginationChange = (paginationState) => {
    // Update searchParams state with new pagination values
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1, // API uses 1-based index
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams); // Update the search params state

    getSAPList(updatedParams); // Use the updated params for API call
  };

  const handleReset = () => {
    // Clear any date validation errors
    setStatus(false);
    setTitle("");
    setFromDateError("");
    setToDateError("");
    setProcessTypeError("");

    // Reset search parameters to default values
    const defaultParams = {
      service_network_id: 0,
      interfaceMasterID: 0,
      processStatusId: -1,
      uploadFromDate: getFirstDayOfMonth(),
      uploadToDate: getToday(),
      export: 0,
      exportType: 1,
      interfaceFileID: 0,
      poNumber: "",
      pageIndex: 1,
      pageSize: 10,
      callType: 1,
    };

    setSearchParams(defaultParams);

    // Reset searchClicked state
    setSearchClicked(false);

    // Reset table data
    setTableData([]);

    // Reset pagination
    setPage(0);
    setSortConfig({ key: null, direction: null });
  };

  const getProcessTypeList = async () => {
    try {
      setDefaultLoading(true);
      const params = {
        service_network_id: 0,
        callType: 1, //1=Sap, 2=Activation File
      };
      const response = await fetchProcessList(params);
      if (response.statusCode == 200) {
        setProcessList(response.processTypeList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDefaultLoading(false);
    }
  };

  const getProcessStatusList = async () => {
    try {
      setDefaultLoading(true);
      const params = {
        service_network_id: 0,
        callType: 1, //1=Sap, 2=Activation File
      };
      const response = await fetchProcessList(params);
      if (response.statusCode == 200) {
        setProcessStatus(response.processStatusList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDefaultLoading(false);
    }
  };
  const getSAPList = async (params = searchParams) => {
    setStatus(false);
    setTitle("");
    try {
      setLoading(true);

      const response = await fetchSAPList(params);
      if (response.statusCode == 200) {
        // Check if sapProcessList exists and has data
        if (response.sapProcessList && response.sapProcessList.length > 0) {
          setTableData(response.sapProcessList);

          setTotalRecords(response.totalRecords);
        } else {
          setTableData([]);
          setTotalRecords(0);
        }
      } else {
        // Set empty array on error
        setSearchClicked(false);
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "No Data Found");
        setTableData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      // Set empty array on error
      setStatus(error.statusCode);
      setTitle(error.statusMessage || "No Data Found");
      setTableData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProcessTypeList();
    getProcessStatusList();
    // getSAPList();
  }, []);

  // Update the handler functions to accept row data
  const handleUploadRecordsClick = async (row) => {
    const updatedParams = {
      ...searchParams,
      export: 1,
      exportType: 1,
      interfaceFileID: row.interfaceFileID,
    };

    try {
      setLoading(true);
      const response = await fetchSAPList(updatedParams);
      if (response.statusCode == 200) {
        window.location.href = response.filepathlink;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessedRecordsClick = async (row) => {
    const updatedParams = {
      ...searchParams,
      export: 1,
      exportType: 2,
      interfaceFileID: row.interfaceFileID,
    };

    try {
      setLoading(true);
      const response = await fetchSAPList(updatedParams);
      if (response.statusCode == 200) {
        window.location.href = response.filepathlink;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //   {
  //     "statusCode": "200",
  //     "statusMessage": "Data fetched successfully.",
  //     "filepathlink": "http://moto.nuralsales.com/Excel/Reports/SecondayFTP18Mar25160306_4067.xlsx",
  //     "totalRecords": 149,
  //     "processTypeList": [],
  //     "processStatusList": [],
  //     "sapProcessList": []
  // }

  const handleInvalidRecordsClick = async (row) => {
    const updatedParams = {
      ...searchParams,
      export: 1,
      exportType: 3,
      interfaceFileID: row.interfaceFileID,
    };
    try {
      setLoading(true);
      const response = await fetchSAPList(updatedParams);
      if (response.statusCode == 200) {
        window.location.href = response.filepathlink;
      } else {
        // Set empty array on error
        setTableData([]);
      }
    } catch (error) {
      console.log(error);
      // Set empty array on error
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidDownload = (row) => {
    setLoading(true);
    if (row.existingFilePath) {
      try {
        console.log(row.existingFilePath);
        window.location.href = row.existingFilePath;
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Add the missing tab change handler function
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <>
      {defaultLoading ? (
        <FormSkeleton />
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            position: "relative",
            pointerEvents: loading ? "none" : "auto",
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
            <Grid item xs={12} mt={0} mb={0} ml={0}>
              <BreadcrumbsHeader pageTitle="Misc" />
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
                  <NuralAccordion2
                    title="SAP Integration File"
                    backgroundColor={LIGHT_GRAY2}
                  >
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
                          PROCESS TYPE
                        </Typography>

                        {/* 
            "interfaceMasterID": 3,
            "interfaceName": "SecondarySAP" */}
                        <NuralAutocomplete
                          label="Process Type"
                          options={processList}
                          getOptionLabel={(option) =>
                            option.interfaceName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.interfaceMasterID ===
                            value?.interfaceMasterID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "processType",
                              newValue?.interfaceMasterID || 0
                            );
                            setProcessTypeError(""); // Clear error when value changes
                          }}
                          value={
                            processList.find(
                              (option) =>
                                option.interfaceMasterID ===
                                searchParams.interfaceMasterID
                            ) || null
                          }
                          placeholder="SELECT"
                          width="100%"
                          error={!!processTypeError}
                          // helperText={processTypeError}
                        />
                        {processTypeError && (
                          <Typography
                            color="error"
                            sx={{ fontSize: "12px", mt: 0.5 }}
                          >
                            {processTypeError}
                          </Typography>
                        )}
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
                          PROCESS STATUS
                        </Typography>

                        {/* "processStatusId": -1,
            "processStatus": "Select" */}
                        <NuralAutocomplete
                          label="Process Status"
                          options={processStatus}
                          getOptionLabel={(option) =>
                            option.processStatus || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.processStatusId === value?.processStatusId
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "processStatus",
                              newValue?.processStatusId !== undefined
                                ? newValue.processStatusId
                                : -1
                            );
                          }}
                          value={
                            processStatus.find(
                              (option) =>
                                option.processStatusId ===
                                searchParams.processStatusId
                            ) || null
                          }
                          placeholder="SELECT"
                          width="100%"
                          disabled={
                            !searchParams.interfaceMasterID || defaultLoading
                          }
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
                          FROM DATE <Required />
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={handleFromDateChange}
                          value={searchParams.uploadFromDate}
                          error={!!fromDateError}
                          required
                        />
                        {fromDateError && (
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: 0.5,
                            }}
                          >
                            {fromDateError}
                          </Typography>
                        )}
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
                          TO DATE <Required />
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={handleToDateChange}
                          value={searchParams.uploadToDate}
                          error={!!toDateError}
                          required
                        />
                        {toDateError && (
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: 0.5,
                            }}
                          >
                            {toDateError}
                          </Typography>
                        )}
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
          {status && (
            <Grid item xs={12} mt={-2} pr={4}>
              <StatusModel
                status={status}
                title={title}
                onClose={() => setStatus(false)}
                width="100%"
              />
            </Grid>
          )}
          {/* Add this after the NuralAccordion2 component */}
          <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
            {searchClicked && (
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 50px)",
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
                          zIndex: 100,
                          borderBottom: "none",
                          boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
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
                          zIndex: 100,
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                            width: "100%",
                            borderBottom: "2px solid #e0e0e0",
                          },
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>S.NO</Grid>
                        </Grid>
                      </TableCell>
                      {[
                        "FILE",
                        "FILE ERRORS",
                        "UPLOAD STATUS",
                        "TOTAL RECORDS",
                        "PROCESSED RECORDS",
                        "INVALID RECORDS",
                        "PROCESSED ON",
                        "DOWNLOAD",
                      ].map((header, index) => (
                        <TableCell
                          key={`column${index + 1}`}
                          onClick={() => {
                            if (header !== "DOWNLOAD") {
                              handleSort(header);
                            }
                          }}
                          sx={{
                            ...tableHeaderStyle,
                            cursor:
                              header !== "DOWNLOAD" ? "pointer" : "default",
                            position: "sticky",
                            top: "45px",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 100,
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>{header}</Grid>
                            {header !== "DOWNLOAD" && (
                              <Grid
                                item
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {sortConfig.key === columnMapping[header] ? (
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
                    {loading ? (
                      <TableRowSkeleton
                        columns={8}
                        imagePath="./Icons/emptyFile.svg"
                        sx={{ height: "calc(100vh - 50px)" }}
                      />
                    ) : tableData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                          <Typography
                            variant="body1"
                            sx={{ color: PRIMARY_BLUE2, fontWeight: 500 }}
                          >
                            No Data Available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={row.id}>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: PRIMARY_BLUE2,
                                fontWeight: 600,
                              }}
                            >
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.interfaceFileName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.errorMsg}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.transStatus}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                cursor: "pointer",
                                "&:hover": {
                                  color: PRIMARY_BLUE2,
                                },
                              }}
                              onClick={() => handleUploadRecordsClick(row)}
                            >
                              {row.totalRecords}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                cursor: "pointer",
                                "&:hover": {
                                  color: PRIMARY_BLUE2,
                                },
                              }}
                              onClick={() => handleProcessedRecordsClick(row)}
                            >
                              {row.processedRecords}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                cursor: "pointer",
                                "&:hover": {
                                  color: PRIMARY_BLUE2,
                                },
                              }}
                              onClick={() => handleInvalidRecordsClick(row)}
                            >
                              {row.invalidRecords}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.createdOn}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                textAlign: "left",
                                width: "80px",
                                cursor: "pointer",
                                "&:hover": {
                                  color: DARK_PURPLE,
                                },
                              }}
                            >
                              <img
                                onClick={() => handleInvalidDownload(row)}
                                width="100px"
                                height="100%"
                                cursor="pointer"
                                src="./Icons/down.svg"
                                alt="download"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>

                {/* Replace custom pagination with NuralPagination */}
                <NuralPagination
                  totalRecords={totalRecords}
                  initialPage={page}
                  initialRowsPerPage={rowsPerPage}
                  onPaginationChange={handlePaginationChange}
                />
              </TableContainer>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default RedingtonFile;
