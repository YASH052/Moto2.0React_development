import { Grid, Typography, Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
  SKELETON_GRAY,
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
  Skeleton,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import {
  GetAttendancedetailReport,
  GetRoleList,
  GetUserListBasedOnRoleID,
} from "../../../Api/Api";
import {
  getCurrentMonthFirstDate,
  getTodayDate,
} from "../../../Common/commonFunction";
import { MenuConstants } from "../../../Common/MenuConstants";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";


// Add this before the ViewAttendanceReport component definition
const columnMapping = {
  "S.NO": "sNo",
  DATE: "date",
  "USER CODE": "userCode",
  "USER NAME": "userName",
  ROLE: "role",
  "WORKS AT": "worksAt",
  STATE: "state",
  CITY: "city",
  "IN TIME": "inTime",
  "OUT TIME": "outTime",
  "TIME SPEND (HRS)": "timeSpend",
  "ATTENDANCE STATUS": "attendanceStatus",
};

// Add this constant at the top of the file with other constants
const SKELETON_ROWS = 10; // Number of skeleton rows to show while loading

// Add this helper component for the skeleton row

// Update the LoadingOverlay component
const LoadingOverlay = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor: "rgba(255, 255, 255, 0.5)",
      zIndex: 9999,
      cursor: "wait",
      pointerEvents: "all", // This ensures the overlay catches all interactions
    }}
  />
);

const ViewAttendanceReport = () => {
  const [dateError, setDateError] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [roleList, setRoleList] = React.useState([]);
  const [userNameList, setUserNameList] = React.useState([]);

  // Add missing state variables
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentOwnerData, setCurrentOwnerData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [customPageInput, setCustomPageInput] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add new state for API data
  const [tableData, setTableData] = useState([]);

  const [activeTab, setActiveTab] = React.useState("view-attendance-report");
  const tabs = [
    { label: "Attendance Report", value: "view-attendance-report" },
    { label: "Leave Report", value: "leave-report" },
  ];

  const [filteredRows, setFilteredRows] = React.useState([]);

  const [searchParams, setSearchParams] = React.useState({
    entityTypeId: 0,
    entitytypeUserId: 0,
    fromDate: getCurrentMonthFirstDate(),
    toDate: getTodayDate(),
    pageIndex: page,
    pageSize: 10,
    roleId: 0,
  });

  // Add these states for pagination

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const columns = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "city", label: "City" },
  ];
  const views = ["View 1", "View 2", "View 3"];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  // Update fetchTableData to use single loading state
  const fetchTableData = async (params) => {
    setIsSearchLoading(true);
    try {
      const response = await GetAttendancedetailReport(params);

      if (response.statusCode == 200) {
        const transformedData = response.attendanceDetail.map(
          (item, index) => ({
            sNo: params.pageIndex
              ? (params.pageIndex - 1) * params.pageSize + index + 1
              : index + 1,
            date: item.attendanceDate,
            userCode: item.entityCode,
            userName: item.entityTypeName,
            role: item.role,
            worksAt: item.workAt,
            state: item.state,
            city: item.city,
            inTime: item.attendenceInTime,
            outTime: item.attendenceOutTime,
            timeSpend: item.timeSpendInHours,
            attendanceStatus: item.attendanceStatus,
            image: item.imagepath,
          })
        );

        setTableData(transformedData);
        setFilteredRows(transformedData);
        setTotalRecords(response.totalRecords || transformedData.length);
        return true;
      } else {
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
        return false;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
      return false;
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Update handleSearch to use single loading state
  const handleSearch = async () => {
    const formattedParams = {
      ...searchParams,
      fromDate: searchParams.fromDate
        ? new Date(searchParams.fromDate).toISOString().split("T")[0]
        : getCurrentMonthFirstDate(),
      toDate: searchParams.toDate
        ? new Date(searchParams.toDate).toISOString().split("T")[0]
        : getTodayDate(),
      roleId: searchParams.roleId || 0,
      entityTypeId: searchParams.entityTypeId || 0,
      pageIndex: 1,
      pageSize: 10,
    };

    fetchTableData(formattedParams);
  };

  // Update handleChangePage
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await fetchTableData({
      ...searchParams,
      pageIndex: newPage + 1,
      pageSize: rowsPerPage,
    });
  };

  // Update handleChangeRowsPerPage
  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    await fetchTableData({
      ...searchParams,
      pageIndex: 1,
      pageSize: newRowsPerPage,
    });
  };

  // Update handlePageSearch to handle custom page input
  const handlePageSearch = async () => {
    const pageNumber = parseInt(customPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      await fetchTableData({
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

  // Update the handleSearchClick function

  const handleReset = async () => {
    setIsSearchLoading(true); // Show skeleton while resetting
    setUserNameList([]);
    setDateError("");
    // Reset search parameters
    const resetParams = {
      entityTypeId: 0,
      entitytypeUserId: 0,
      fromDate: getCurrentMonthFirstDate(),
      toDate: getTodayDate(),
      pageIndex: 1,
      pageSize: 10,
      roleId: 0,
    };

    setSearchParams(resetParams);
    setUserNameList([]);
    setPage(0);
    setSortConfig({ key: null, direction: null });

    // Fetch initial data with reset parameters
    await fetchTableData(resetParams);
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsSearchLoading(true);
      setDefaultLoading(true); // Show skeleton on initial load
      try {
        await fetchRoleList();
        // Only search if we have required parameters
        if (searchParams.fromDate && searchParams.toDate) {
          await handleSearch();
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setDefaultLoading(false); // Hide skeleton after data is loaded
      }
    };

    initializeData();
  }, []); // Empty dependency array for initial load only

  const fetchRoleList = async () => {
    try {
      const res = await GetRoleList();
      if (res.statusCode == 200) {
        setRoleList(res.roleList);
      }
    } catch (error) {
      console.error("Error fetching role list:", error);
    }
  };

  const fetchUserName = async (roleId) => {
    let body = {
      roleID: roleId,
    };
    try {
      const res = await GetUserListBasedOnRoleID(body);
      if (res.statusCode == 200) {
        setUserNameList(res.bindEntityNameList);
      }
    } catch (error) {
      console.error("Error fetching role list:", error);
    }
  };

  const handleSearchChange = (field, value) => {
    console.log("field", field);
    console.log("value", value);
    if (field === "roleId") {
      if (value !== 0) {
        fetchUserName(value);
      } else {
        setUserNameList([]);
      }
    }

    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleFromDateChange = (newValue) => {
    setDateError(""); // Clear error on change
    if (searchParams.toDate && newValue > searchParams.toDate) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    handleSearchChange("fromDate", newValue);
  };

  const handleToDateChange = (newValue) => {
    setDateError(""); // Clear error on change
    if (searchParams.fromDate && newValue < searchParams.fromDate) {
      setDateError("To date cannot be less than From date");
      return;
    }
    handleSearchChange("toDate", newValue);
  };

  // Add these functions after handleCustomJump
  const handleJumpToFirst = async () => {
    setPage(0);
    await fetchTableData({
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    });
  };

  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    if (lastPage >= 0) {
      setPage(lastPage);
      await fetchTableData({
        ...searchParams,
        pageIndex: lastPage + 1,
        pageSize: rowsPerPage,
      });
    }
  };

  // Add the handleSort function
  const handleSort = (columnName) => {
    const key = columnMapping[columnName];
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredRows].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedData);
    setSortConfig({ key, direction });
  };

  return (
    <Grid
      container
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
        minHeight: "100vh",
        filter: isDownloadLoading ? "blur(2px)" : "none",
        transition: "filter 0.3s ease",
        cursor: isSearchLoading ? "wait" : "default",
        pointerEvents: isSearchLoading ? "none" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Content */}
      <Grid item xs={12} sx={{ flex: 1, overflow: "auto" }}>
        <Grid container spacing={2}>
          {/* Breadcrumbs Grid */}
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
              <BreadcrumbsHeader pageTitle="Attendance" />
            </Grid>

            <Grid item xs={12} ml={1}>
              <TabsBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </Grid>
          </Grid>

          {/* Rest of your existing content */}

          <Grid item xs={12} mt={1}>
            <Grid container spacing={2} direction="column">
              {defaultLoading ? (
                <FormSkeleton />
              ) : (
                <Grid md={12} item>
                  <NuralAccordion2
                    title="Attendance Report"
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
                      <Grid item xs={12} sm={6} md={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          USER ROLE
                        </Typography>

                        <NuralAutocomplete
                          label="Sale Type"
                          options={roleList}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.roleName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.roleId === value?.roleId
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange("roleId", newValue?.roleId || 0);
                          }}
                          value={
                            roleList.find(
                              (option) => option.roleId === searchParams.roleId
                            ) || null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          USER NAME
                        </Typography>
                        <NuralAutocomplete
                          label="User Name"
                          options={userNameList}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            option.entityTypeName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.userID === value?.userID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "entityTypeId",
                              newValue?.userID || 0
                            );
                          }}
                          value={
                            userNameList.find(
                              (option) =>
                                option.userID === searchParams.entityTypeId
                            ) || null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
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
                          onChange={handleFromDateChange}
                          value={searchParams.fromDate}
                          placeholder="DD/MMM/YYYY"
                          width="100%"
                          error={!!dateError}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
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
                          onChange={handleToDateChange}
                          value={searchParams.toDate}
                          placeholder="DD/MMM/YYYY"
                          width="100%"
                          error={!!dateError}
                        />
                      </Grid>
                      {dateError && (
                        <Grid item xs={12}>
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: -1,
                            }}
                          >
                            {dateError}
                          </Typography>
                        </Grid>
                      )}
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
              )}
            </Grid>
          </Grid>

          {/* Add this after the NuralAccordion2 component */}
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 200px)", // Adjusted to account for headers
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
                      colSpan={13}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
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
                    {[
                      "S.NO",
                      "DATE",
                      "USER CODE",
                      "USER NAME",
                      "ROLE",
                      "WORKS AT",
                      "STATE",
                      "CITY",
                      "IN TIME",
                      "OUT TIME",
                      "TIME SPEND (HRS)",
                      "ATTENDANCE STATUS",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        onClick={() => handleSort(header)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: "pointer",
                          position: "sticky",
                          top: "45px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 2,
                        }}
                      >
                        <Grid
                          container
                          display={"flex"}
                          width={"max-content"}
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Grid item>{header}</Grid>
                          <Grid item>
                            {sortConfig.key === columnMapping[header] ? (
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
                                sx={{ height: 16, width: 16, ml: -1 }}
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
                    <TableCell
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "45px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 2,
                        width: "60px",
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>IMAGE</Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isSearchLoading ? (
                    // Show skeleton rows while loading
                    Array(SKELETON_ROWS)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton key={index} columns={13} />
                      ))
                  ) : filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row, index) => (
                      <TableRow key={index} sx={{ fontSize: "10px" }}>
                        <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                          {row.sNo || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.date || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.userCode || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.userName || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.role || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.worksAt || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.state || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.city || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.inTime || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.outTime || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.timeSpend || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.attendanceStatus || MenuConstants.emptyText}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.image ? (
                            <img
                              src={row.image}
                              alt="attendance"
                              style={{
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                objectFit: "cover",
                              }}
                              onClick={() => window.open(row.image, "_blank")}
                            />
                          ) : (
                            <img
                              src="./Icons/view.svg"
                              alt="view"
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Custom Pagination */}
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
                    }}
                    onClick={handleJumpToFirst}
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
                    sx={{
                      cursor: "pointer",
                    }}
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
                      cursor: "pointer",
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
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>

      {/* Activity Panel */}
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
        }}
      >
        <NuralActivityPanel>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <SelectionPanel columns={columns} views={views} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={views} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralExport title="Export" views={views} />
          </Grid>
        </NuralActivityPanel>
      </Grid>

      {/* Add the loading overlay when searching */}
      {isSearchLoading && <LoadingOverlay />}
    </Grid>
  );
};

export default ViewAttendanceReport;
