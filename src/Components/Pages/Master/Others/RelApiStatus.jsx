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
import { GetRelEDIInetgrationStatusView } from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { styled } from "@mui/material/styles";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import { FormSkeleton } from "../../../Common/Skeletons";
import { useNavigate } from "react-router-dom";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { tableColumns1 } from "./RelApiStatusService";

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
const processTypeOptions = [
  { id: 0, label: "Tertiary Sale Status" },
  { id: 1, label: "Stock Transfer Status" },
];

const processStatusOptions = [
  { id: -1, label: "All" },
  { id: 0, label: "Pending" },
  { id: 1, label: "Success" },
  { id: 2, label: "Fail" },
  { id: 3, label: "Partial Success" },
];

const RelApiStatus = () => {
  const [activeTab, setActiveTab] = React.useState("rel-api-status");
  const [showStatus, setShowStatus] = React.useState(false);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const tabs = [
    { label: "Activation File Received", value: "activation-file-received" },
    { label: "SAP Integration", value: "redington-file" },
    { label: "Reliance API Status", value: "rel-api-status" },
    { label: "Log Report", value: "Log Report" },
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
    processTypeId: 0, //0 = Tertairy Sale Status , 1 = Stock Transfer Status
    processStatusId: null, //-1 = All List 0 = Pending, 1 = Success ,2 = Fail 3 = Partial Success
    stockTransferId: 0, //Send stockTransferId Get this Details
    tertiarySaleId: 0, //Send tertiarySaleId Get this Details
    fromDate: "2025-01-01",
    toDate: "2025-03-19",
    pageIndex: 1,
    pageSize: 20,
    pageIndex1: 1,
    pageSize1: 20,
  });

  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = React.useState(false);
  const [stockTransferData, setStockTransferData] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  React.useState(0);
  const [customPageInput, setCustomPageInput] = React.useState("");
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  console.log(searchParams, "searchParams");
  console.log(stockTransferData, "stockTransferData");
  useEffect(() => {
    setDefaultLoading(true);
    setTimeout(() => {
      setDefaultLoading(false);
    }, 1000);
  }, []);
  // console.log(searchParams, "searchParams");
  const handleSearchChange = (field, value) => {
    // console.log(field, value);
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
    setIsSearchLoading(true);

    try {
      const response = await GetRelEDIInetgrationStatusView(searchParams);
      if (response.statusCode == 200) {
        setCurrentOwnerData(response.tertairySaleHeaderItem || []);
        setStockTransferData(response.stkTranHeaderItem || []);
        setTotalRecords(response.totalRecords || 0);
        // console.log(response.tertairySaleHeaderItem,"response.tertairySaleHeaderItem");
      } else {
        setStatus(response.statusCode || "");
        setTitle(response.statusMessage || "");
        setShowStatus(true);
      }
    } catch (error) {
      setStatus(error.statusCode || "");
    }
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
    navigate(`/${newValue}`);
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
          }}
        >
          <Grid item xs={12} mt={0} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="MIsc" />
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
            <Grid
              container
              spacing={0}
              direction="column"
              sx={{
                backgroundColor: LIGHT_GRAY2,
                p: 2,
                borderRadius: "8px",
                // mt: 0.5,
                ml: 0.2,
              }}
            >
              <Grid item>
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
                  Reliance API Integration Status
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
                      PROCESS TYPE
                    </Typography>

                    <NuralAutocomplete
                      label="Process Type"
                      options={processTypeOptions}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("processTypeId", newValue?.id);
                      }}
                      value={
                        processTypeOptions.find(
                          (option) => option.id === searchParams.processTypeId
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
                      PROCESS STATUS
                    </Typography>

                    <NuralAutocomplete
                      label="Process Status"
                      options={processStatusOptions}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.label || ""}
                      // isOptionEqualToValue={(option, value) =>
                      //     option?.id === value?.id
                      // }
                      onChange={(event, newValue) => {
                        handleSearchChange("processStatusId", newValue?.id);
                      }}
                      value={processStatusOptions.find(
                        (option) => option.id === searchParams.processStatusId
                      )}
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
                      // error={!!dateError}
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
                      // error={!!dateError}
                    />{" "}
                  </Grid>
                </Grid>
                <Grid container spacing={4} pt={2}>
                  <Grid item xs={12} sm={2} md={1} lg={1}>
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
                  <Grid item xs={12} sm={10} md={11} lg={11}>
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
              </Grid>
              {/* </NuralAccordion2> */}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
          {showStatus && (
            <StatusModel width="100%" status={status} title={title} />
          )}
        </Grid>
        {/* Current Owner Table */}
        {/* {isSearchLoading ? (
                    <CurrentOwnerSkeleton />
                ) : ( */}
        {/* // currentOwnerData.length > 0 && ( */}

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
                      List
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  {[
                    { id: "storeName", label: "STORE NAME" },
                    { id: "storeNumber", label: "STORE NUMBER" },
                    { id: "storeFormat", label: "STORE FORMAT" },
                    { id: "status", label: "STATUS" },
                    { id: "createdOn", label: "CREATED ON" },
                    { id: "processedOn", label: "PROCESSED ON" },
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
                  currentOwnerData.map((row) => {
                    const isSelected =
                      selectedRow?.serialMasterID === row.serialMasterID;
                    const cellStyle = {
                      ...rowstyle,
                      color: isSelected ? "#fff" : "inherit",
                    };

                    const columns = [
                      { value: row.storeName },
                      { value: row.storeNumber },
                      { value: row.storeFormat },
                      { value: row.status },
                      { value: row.tertiarySalesDate },
                      { value: row.cartonNo },
                    ];

                    return (
                      <TableRow
                        key={row.serialMasterID}
                        sx={{
                          backgroundColor: isSelected ? DARK_PURPLE : "inherit",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? DARK_PURPLE
                              : PRIMARY_LIGHT_GRAY,
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {columns.map((column, index) => (
                          <TableCell key={index} sx={cellStyle}>
                            {column.value || MenuConstants.emptyText}
                          </TableCell>
                        ))}

                        {/* View Cell */}
                        <TableCell
                          sx={{
                            ...cellStyle,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
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
                              transition: "color 0.2s ease",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
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
                          rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                        color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
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
                  disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
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
                      List
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  {tableColumns1.map((column) => (
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
                {stockTransferData.length > 0 ? (
                  stockTransferData.map((row) => {
                    const cellStyle = {
                      ...rowstyle,
                      // color: isSelected ? "#fff" : "inherit",
                    };

                    const columns = [
                      { value: row.sno },
                      { value: row.storeName },
                      { value: row.storeNumber },
                      { value: row.storeFormat },
                      { value: row.status },
                      { value: row.receiveDate },
                      { value: row.transferDate },
                      { value: row.isReceived },
                      { value: row.acknowlegeDate },
                    ];

                    return (
                      <TableRow
                        key={row.serialMasterID}
                        sx={{
                          // backgroundColor: isSelected ? DARK_PURPLE : "inherit",
                          "&:hover": {
                            // backgroundColor: isSelected ? DARK_PURPLE : PRIMARY_LIGHT_GRAY,
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {columns.map((column, index) => (
                          <TableCell key={index} sx={cellStyle}>
                            {column.value || MenuConstants.emptyText}
                          </TableCell>
                        ))}

                        {/* View Cell */}
                        <TableCell
                          sx={{
                            ...cellStyle,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
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
                              transition: "color 0.2s ease",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
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
                          rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                        color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
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
                  disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
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
        {/* // )
                )} */}

        {/* Transactions Table - Only show when a row is selected */}
        {/* {selectedRow &&
                    (isTransactionLoading ? (
                        <TransactionsSkeleton />
                    ) : ( */}
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
                      Details
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {[
                    { id: "articleCode", label: "ARTICLE CODE" },
                    { id: "sku", label: "SKU" },
                    { id: "quantity", label: "QUANTITY" },
                    { id: "binType", label: "BIN TYPE" },
                    { id: "binCode", label: "BIN CODE" },
                    { id: "imeiNo", label: "IMEI NO" },
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
                        {transaction.fromChannelType || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.toChannel || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.toChannelType || MenuConstants.emptyText}
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

        {/* ))} */}
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

export default RelApiStatus;
