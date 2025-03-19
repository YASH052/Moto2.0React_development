import { Grid, Typography, Button, Skeleton, Box } from "@mui/material";
import React, { useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { MenuConstants } from "../../../Common/MenuConstants";
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
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { ViewSerialNumberMovement } from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { styled } from "@mui/material/styles";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import { FormSkeleton } from "../../../Common/Skeletons";

// Add this styled component near the top of the file, after imports
const CustomPageInput = styled("input")(({ theme }) => ({
  width: "100px",
  height: "24px",
  padding: "0 8px",
  borderRadius: "8px",
  border: `1px solid ${PRIMARY_BLUE2}`,
  outline: "none",
  backgroundColor: LIGHT_BLUE,
  fontFamily: "Manrope",
  fontSize: "10px",
  "&::placeholder": {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "10.93px",
    letterSpacing: "4%",
    textAlign: "center",
    color: PRIMARY_BLUE2,
  },
}));

const SerialNoMoment = () => {
  const [activeTab, setActiveTab] = React.useState("serial-no-moment");
  const [showStatus, setShowStatus] = React.useState(false);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const tabs = [{ label: "Serial No Moment", value: "serial-no-moment" }];

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [transactionPage, setTransactionPage] = React.useState(0);
  const [transactionRowsPerPage, setTransactionRowsPerPage] =
    React.useState(10);
  const [transactionSortConfig, setTransactionSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [currentOwnerData, setCurrentOwnerData] = React.useState([]);
  const [serialNumber, setSerialNumber] = React.useState("");
  const [searchParams, setSearchParams] = React.useState({
    serialNumber: "",
    serialMasterID: 0,
    callType: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [serialNumberInlineError, setSerialNumberInlineError] = React.useState({
    error: false,
    errorText: "",
  });
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = React.useState(false);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [transactionTotalRecords, setTransactionTotalRecords] =
    React.useState(0);
  const [customPageInput, setCustomPageInput] = React.useState("");
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);

  useEffect(() => {
    setDefaultLoading(true);
    setTimeout(() => {
      setDefaultLoading(false);
    }, 1000);
  }, []);

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    setIsSearchLoading(true);
    setCurrentOwnerData([]); // Clear current data to show skeleton
    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: serialNumber,
        callType: 0,
        pageIndex: 1,
        pageSize: newRowsPerPage,
      });

      if (response.statusCode == "200") {
        setCurrentOwnerData(response.currentOwner || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsSearchLoading(false);
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
        return;
      }
    }

    setSortConfig({ key: columnName, direction });
  };

  // Update handleSearch function
  const handleSearch = async () => {
    setShowStatus(false);
    if (serialNumberInlineError.error) {
      return;
    }
    setIsSearchLoading(true);
    setCurrentOwnerData([]);
    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: serialNumber,
        callType: 0,
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      });

      if (response.statusCode === "200") {
        setCurrentOwnerData(response.currentOwner || []);
        setTotalRecords(response.totalRecords || 0);
        setTransactions([]);
        setSelectedRow(null);
      } else {
        setStatus(response.statusCode || "");
        setTitle(response.statusMessage || "");
        setShowStatus(true);
      }
    } catch (error) {
      setStatus(error.statusCode || "");
      setTitle(MenuConstants.errorText || "");
      setShowStatus(true);
      console.error("Error fetching data:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Add this after the existing handleRowClick function
  const handleTransactionChangePage = async (event, newPage) => {
    setTransactionPage(newPage);
    setIsTransactionLoading(true);
    setTransactions([]); // Clear transactions to show skeleton
    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: selectedRow.serialNumber,
        serialMasterID: selectedRow.serialMasterID,
        callType: 1,
        pageIndex: newPage + 1,
        pageSize: transactionRowsPerPage,
      });

      if (response.statusCode === "200") {
        setTransactions(response.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  // Add this handler function
  const handleTransactionChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setTransactionRowsPerPage(newRowsPerPage);
    setTransactionPage(0);

    setIsTransactionLoading(true);
    setTransactions([]); // Clear transactions to show skeleton
    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: selectedRow.serialNumber,
        serialMasterID: selectedRow.serialMasterID,
        callType: 1,
        pageIndex: 1,
        pageSize: newRowsPerPage,
      });

      if (response.statusCode === "200") {
        setTransactions(response.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  // Update the handleSerialNumberChange function
  const handleSerialNumberChange = (e) => {
    let value = e.target.value;
    setShowStatus(false);

    // Check if input contains only alphanumeric, spaces and commas
    if (!/^[a-zA-Z0-9\s,]*$/.test(value)) {
      setSerialNumberInlineError({
        error: true,
        errorText: "Only alphanumeric characters are allowed",
      });
      return;
    }

    // Remove extra spaces and commas
    value = value.replace(/[\s,]+/g, " ").trim();

    // Replace spaces with commas
    value = value.replace(/\s/g, ", ");

    setSerialNumber(value);
    setSerialNumberInlineError({
      error: false,
      errorText: "",
    });
  };

  // Update the handleSerialNumberPaste handler
  const handleSerialNumberPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Check if pasted text contains only alphanumeric, spaces and commas
    if (!/^[a-zA-Z0-9\s,]*$/.test(pastedText)) {
      setSerialNumberInlineError({
        error: true,
        errorText: "Only alphanumeric characters are allowed",
      });
      return;
    }

    // Clean up pasted text - remove extra spaces and commas
    const cleanedText = pastedText.replace(/[\s,]+/g, " ").trim();
    setSerialNumber((prevValue) => {
      // Combine with existing value and ensure comma separation
      const newValue = prevValue ? prevValue + "," + cleanedText : cleanedText;
      return newValue.replace(/\s/g, ", ");
    });
    setSerialNumberInlineError({
      error: false,
      errorText: "",
    });
  };

  // Update the handleViewClick function
  const handleViewClick = async (e, row) => {
    e.stopPropagation();

    if (selectedRow?.serialMasterID === row.serialMasterID) {
      setSelectedRow(null);
      setTransactions([]);
      return;
    }

    setSelectedRow(row);
    setIsTransactionLoading(true);
    setTransactions([]);

    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: "",
        serialMasterID: row.serialMasterID,
        callType: 1,
        pageIndex: 1,
        pageSize: transactionRowsPerPage,
      });

      if (response.statusCode === "200") {
        setTransactions(response.transactions || []);
        setTransactionTotalRecords(response.totalRecords || 0);
      } else {
        setSelectedRow(null);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setSelectedRow(null);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const TableSkeleton = ({ columns }) => {
    return Array(5)
      .fill(0)
      .map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array(columns)
            .fill(0)
            .map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton animation="wave" height={"35px"} />
              </TableCell>
            ))}
        </TableRow>
      ));
  };

  const CurrentOwnerSkeleton = () => (
    <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: LIGHT_GRAY2,
          color: PRIMARY_BLUE2,
          maxHeight: "calc(120vh - 320px)",
          overflow: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={11} sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <Typography variant="body1" sx={{ p: 1 }}></Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton columns={11} />
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );

  const TransactionsSkeleton = () => (
    <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: LIGHT_GRAY2,
          color: PRIMARY_BLUE2,
          maxHeight: "calc(70vh - 200px)",
          overflow: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={9} sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <Typography variant="body1" sx={{ p: 1 }}></Typography>
              </TableCell>
            </TableRow>
            <TableRow></TableRow>
          </TableHead>
          <TableBody>
            <TableSkeleton columns={9} />
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );

  // Add this component for showing no data message
  const NoDataMessage = () => (
    <TableRow>
      <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontSize: "12px",
            color: PRIMARY_BLUE2,
            fontWeight: 500,
          }}
        >
          No Data Found
        </Typography>
      </TableCell>
    </TableRow>
  );

  // Update handleChangePage function
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    setIsSearchLoading(true);
    setCurrentOwnerData([]); // Clear current data to show skeleton
    try {
      const response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: serialNumber,
        callType: 0,
        pageIndex: newPage + 1,
        pageSize: rowsPerPage,
      });

      if (response.statusCode === "200") {
        setCurrentOwnerData(response.currentOwner || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Add these functions for the Current Owner table
  const handleJumpToFirst = () => {
    handleChangePage(null, 0);
  };

  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    if (lastPage >= 0) {
      handleChangePage(null, lastPage);
    }
  };

  // Update handleCustomJump to integrate with search
  const handleCustomJump = async (pageNumber) => {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      setIsSearchLoading(true);
      setCurrentOwnerData([]); // Clear current data to show skeleton

      try {
        const response = await ViewSerialNumberMovement({
          ...searchParams,
          serialNumber: serialNumber,
          callType: 0,
          pageIndex: pageNumber,
          pageSize: rowsPerPage,
        });

        if (response.statusCode === "200") {
          setCurrentOwnerData(response.currentOwner || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      handleCustomJump(parseInt(customPageInput));
      setCustomPageInput(""); // Clear input after jump
    }
  };
  // Update the downloadExcel function
  const downloadExcel = async () => {
    setIsDownloadLoading(true); // Use separate loading state for download

    try {
      let response = await ViewSerialNumberMovement({
        ...searchParams,
        serialNumber: serialNumber,
        callType: -1,
        pageIndex: 1,
        pageSize: 10000,
      });
      if (response.statusCode == "200") {
        window.location.href = response.filePathLink;
      } else {
        setStatus(response.message);
        setTitle(response.title);
        setShowStatus(true);
      }
    } catch (error) {
      console.log(error);
      setStatus(error.response.data.message);
      setTitle(error.response.data.title);
      setShowStatus(true);
    } finally {
      setIsDownloadLoading(false); // Reset download loading state
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleReset = () => {
    setSerialNumber("");
    setCurrentOwnerData([]);
    setTransactions([]);
    setSelectedRow(null);
    setShowStatus(false);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: "180px", md: "240px", lg: "270px" },
          filter: isDownloadLoading ? "blur(2px)" : "none",
          pointerEvents: isDownloadLoading ? "none" : "auto",
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
            zIndex: 2000,
            backgroundColor: "#fff",
            paddingBottom: 1,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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

        {defaultLoading ? (
          <FormSkeleton />
        ) : (
          <Grid item xs={12} mt={1} mb={1}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                  {/* First Row - 3 NuralAutocomplete */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 3, md: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12}>
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
                        placeholder="Enter Serial Number"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        value={serialNumber}
                        onChange={handleSerialNumberChange}
                        onPaste={handleSerialNumberPaste}
                        error={serialNumberInlineError.error}
                        errorText={serialNumberInlineError.errorText}
                        inputProps={{
                          pattern: "[a-zA-Z0-9,\\s]*",
                          title: "Only alphanumeric characters are allowed",
                        }}
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
                        text="RESET"
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
                        {"SEARCH"}
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
          {showStatus && (
            <StatusModel width="100%" status={status} title={title} />
          )}
        </Grid>
        {/* Current Owner Table */}
        {isSearchLoading ? (
          <CurrentOwnerSkeleton />
        ) : (
          currentOwnerData.length > 0 && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: selectedRow
                    ? "calc(100vh - 200px)"
                    : "calc(120vh - 320px)",
                  overflow: "auto",
                  position: "relative",
                  zIndex: 1,
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
                          Current Owner
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                      {[
                        { id: "serialNo", label: "SERIAL NO." },
                        { id: "serialNo2", label: "SERIAL NO. 2" },
                        { id: "skuCode", label: "SKU CODE" },
                        { id: "skuName", label: "SKU NAME" },
                        { id: "activationDate", label: "ACTIVATION DATE" },
                        { id: "cartonNo", label: "CARTON NO." },
                        { id: "salesChannel", label: "SALES CHANNEL" },
                        { id: "type", label: "TYPE" },
                        { id: "status", label: "STATUS" },
                        { id: "lastUpdatedOn", label: "LAST UPDATED ON" },
                        { id: "view", label: "VIEW" },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          onClick={() => handleSort(column.id)}
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
                            <Grid item>{column.label}</Grid>
                            {column.id !== "view" && (
                              <Grid
                                item
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {sortConfig.key === column.id ? (
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
                    {currentOwnerData.length > 0 ? (
                      currentOwnerData.map((row) => (
                        <TableRow
                          key={row.serialMasterID}
                          sx={{
                            backgroundColor:
                              selectedRow?.serialMasterID === row.serialMasterID
                                ? DARK_PURPLE
                                : "inherit",
                            "&:hover": {
                              backgroundColor:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? DARK_PURPLE
                                  : PRIMARY_LIGHT_GRAY,
                            },
                            // Add transition for smooth color change
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.serialNumber || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.serialNumber2 || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.skuCode || MenuConstants.emptyText}
                          </TableCell>{" "}
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.sKUName || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.activationDate || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.cartonNo || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.salesChannel || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.channelType || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.serialStatus || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {row.modifiedOn || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color:
                                selectedRow?.serialMasterID ===
                                row.serialMasterID
                                  ? "#fff"
                                  : "inherit",
                              cursor: "pointer",
                              // Add hover effect for the View button
                              "&:hover": {
                                opacity: 0.8,
                              },
                            }}
                            onClick={(e) => handleViewClick(e, row)}
                          >
                            <span>View</span>
                            <VisibilityIcon
                              sx={{
                                fontSize: 16,
                                // Add transition for smooth color change
                                transition: "color 0.2s ease",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <NoDataMessage />
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
                    borderTop: `1px solid ${PRIMARY_BLUE2}`,
                  }}
                >
                  {/* Left section - Total Records */}
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: "Manrope",
                        fontSize: "10px",
                        color: PRIMARY_BLUE2,
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      TOTAL RECORDS:
                      <span style={{ fontWeight: 700 }}>
                        {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)}{" "}
                        PAGES
                      </span>
                    </Typography>
                  </Grid>

                  {/* Center section - Navigation */}
                  <Grid item>
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "nowrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: PRIMARY_BLUE2,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        SHOW:
                      </Typography>
                      {[10, 25, 50, 100].map((value) => (
                        <Button
                          key={value}
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
                                  : "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          {value}
                        </Button>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Right section - Show Rows */}

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
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      onClick={handleJumpToFirst}
                    >
                      JUMP TO FIRST
                    </Typography>

                    <IconButton
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                      sx={{
                        color: PRIMARY_BLUE2,
                        padding: "4px",
                        "&.Mui-disabled": {
                          color: "rgba(0, 0, 0, 0.26)",
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      PAGE {page + 1}
                    </Typography>

                    <IconButton
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={
                        page >= Math.ceil(totalRecords / rowsPerPage) - 1
                      }
                      sx={{
                        color: PRIMARY_BLUE2,
                        padding: "4px",
                        "&.Mui-disabled": {
                          color: "rgba(0, 0, 0, 0.26)",
                        },
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "10px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      onClick={handleJumpToLast}
                    >
                      JUMP TO LAST
                    </Typography>

                    <Grid
                      container
                      alignItems="center"
                      spacing={1}
                      sx={{ maxWidth: 160, flexWrap: "nowrap" }}
                    >
                      <Grid item>
                        <CustomPageInput
                          type="number"
                          value={customPageInput}
                          onChange={handleCustomPageInputChange}
                          onKeyPress={handleCustomPageKeyPress}
                          placeholder="Jump to page"
                          min={1}
                          max={Math.ceil(totalRecords / rowsPerPage)}
                        />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          "&:hover": { opacity: 0.8 },
                        }}
                        onClick={() => {
                          if (customPageInput) {
                            handleCustomJump(parseInt(customPageInput));
                            setCustomPageInput(""); // Clear input after jump
                          }
                        }}
                      >
                        <img src="./Icons/footerSearch.svg" alt="arrow" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TableContainer>
            </Grid>
          )
        )}

        {/* Transactions Table - Only show when a row is selected */}
        {selectedRow &&
          (isTransactionLoading ? (
            <TransactionsSkeleton />
          ) : (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(70vh - 200px)",
                  overflow: "auto",
                  position: "relative",
                  zIndex: 1,
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
                          Transaction
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {[
                        { id: "transactionType", label: "TRANSACTION TYPE" },
                        { id: "fromChannel", label: "FROM CHANNEL" },
                        { id: "fromChannelType", label: "FROM CHANNEL TYPE" },
                        { id: "toChannel", label: "TO CHANNEL" },
                        { id: "toChannelType", label: "TO CHANNEL TYPE" },
                        { id: "transactionDate", label: "TRANSACTION DATE" },
                        { id: "skuCode", label: "SKU CODE" },
                        { id: "refDocumentNo", label: "REF DOCUMENT NO." },
                        { id: "createdOn", label: "CREATED ON" },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          onClick={() => handleTransactionSort(column.id)}
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
                            <Grid item>{column.label}</Grid>
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {transactionSortConfig.key === column.id ? (
                                transactionSortConfig.direction === "asc" ? (
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
                    {transactions.length > 0 ? (
                      transactions.map((transaction, index) => (
                        <TableRow key={transaction.id || index}>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.transType || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.fromChannel || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.fromChannelType ||
                              MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.toChannel || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.toChannelType ||
                              MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.transDate || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.sKUCode || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.refDocNo || MenuConstants.emptyText}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {transaction.createdOn || MenuConstants.emptyText}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <NoDataMessage />
                    )}
                  </TableBody>
                </Table>

                {/* Update the transaction table pagination section */}
              </TableContainer>
            </Grid>
          ))}
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
            filter: isDownloadLoading ? "blur(2px)" : "none",
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
              downloadExcel={downloadExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
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

export default SerialNoMoment;
