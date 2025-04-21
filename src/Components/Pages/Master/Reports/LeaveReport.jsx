import { Grid, Typography, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import { DARK_BLUE, LIGHT_GRAY2, PRIMARY_BLUE2 } from "../../../Common/colors";
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
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import {
  GetRoleList,
  GetUserListBasedOnRoleID,
  viewLeaveReport,
} from "../../../Api/Api";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";

const SearchFormSkeleton = () => {
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={12}>
        <Skeleton
          variant="rectangular"
          height={50}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 2 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
        />
      </Grid>
      <Grid item xs={12} container spacing={2} mt={1}>
        <Grid item xs={12} sm={3} md={1}>
          <Skeleton
            variant="rectangular"
            height={36}
            sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={11}>
          <Skeleton
            variant="rectangular"
            height={36}
            sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const SKELETON_ROWS = 10;

const views = ["View 1", "View 2", "View 3"];
const columns = ["Column 1", "Column 2", "Column 3"];

const LeaveReport = () => {
  const [activeTab, setActiveTab] = useState("leave-report");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const tabs = [
    { label: "Attendance Report", value: "view-attendance-report" },
    { label: "Leave Report", value: "leave-report" },
  ];

  // Get current date values
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  const firstDay = firstDayOfMonth.toISOString().split("T")[0];

  const [searchParams, setSearchParams] = useState({
    entityId: 0,
    roleId: 0,
    fromDate: firstDay,
    toDate: today,
    pageIndex: 1,
    pageSize: 10,
  });
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_BLUE,
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = useState(0);
  const [title, setTitle] = useState("");
  const [tableData, setTableData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add these state declarations near other state hooks
  const [totalRecords, setTotalRecords] = useState(0);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Add a new state for table loading
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Initial loading effect
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      // Cleanup function
    };
  }, []);

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const leaveTypes = [
      "Sick Leave",
      "Casual Leave",
      "Paid Leave",
      "Unpaid Leave",
    ];
    const states = [
      "Maharashtra",
      "Gujarat",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ];
    const cities = ["Mumbai", "Pune", "Bangalore", "Chennai", "Hyderabad"];
    const userNames = [
      "John Doe",
      "Jane Smith",
      "Mike Johnson",
      "Sarah Williams",
      "Tom Brown",
    ];
    const roles = ["Developer", "Manager", "HR", "Team Lead", "Designer"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        leaveAppliedOn: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        userCode: `EMP${1000 + Math.floor(Math.random() * 999)}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        reportingTo: userNames[Math.floor(Math.random() * userNames.length)],
        state: states[Math.floor(Math.random() * states.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        from: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        to: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        balanceLeave: Math.floor(Math.random() * 20),
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (field, value) => {
    // Update the search params
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Special handling for roleId to fetch user list based on role
    if (field === "roleId" && value) {
      getUserList(value);
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

  // Update the handleSearch function
  const handleSearch = (searchValues) => {
    const filtered = filteredRows.filter((row) => {
      return (
        (!searchValues.fromDate ||
          new Date(row.leaveAppliedOn) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.leaveAppliedOn) <= new Date(searchValues.toDate)) &&
        (!searchParams.roleId || row.roleId === searchParams.roleId) &&
        (!searchParams.entityId || row.userID === searchParams.entityId)
      );
    });
    setFilteredRows(filtered);
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    setHasSearched(true);
    handleSearch(searchParams);
    getLeaveReport(searchParams);
  };

  const handleReset = () => {
    setStatus(null);
    setTitle("");
    // Reset all filters
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset the table to show all rows
    setFilteredRows([]);
    setPage(0);
    setSortConfig({ key: null, direction: null });
  };

  // Replace the existing pagination handling with this:
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1, // API uses 1-based index
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);
    getLeaveReport(updatedParams);
  };

  // Update getLeaveReport to handle pagination
  const getLeaveReport = async (params = searchParams) => {
    try {
      setStatus(null);
      setTitle("");
      setIsTableLoading(true);  // Use table-specific loading state
      const response = await viewLeaveReport(params);
      if (response.statusCode == 200) {
        setFilteredRows(response.leaveReportListItems);
        setTotalRecords(response.totalRecords);
      } else {
        setStatus(response.statusCode || 400);
        setTitle(response.statusMessage || "Something went wrong.");
        setFilteredRows([]);
      }
    } catch (error) {
      console.error("Error in getLeaveReport:", error);
      setStatus(error.statusCode || 500);
      setTitle("Internal server error");
      setFilteredRows([]);
    } finally {
      setIsTableLoading(false);  // Update table loading state
    }
  };

  // Add export to excel function
  const downloadExcel = async () => {
    setIsDownloadLoading(true);
    try {
      const exportParams = {
        ...searchParams,
        pageIndex: -1,
        pageSize: 10,
      };

      const response = await viewLeaveReport(exportParams);
      if (response.statusCode === 200) {
        window.location.href = response?.filePathLink;
      } else {
        setStatus(response.statusCode || 400);
        setTitle(response.message || "Failed to generate Excel file");
      }
    } catch (error) {
      console.error("Error during Excel download:", error);
      setStatus(error.statusCode || 500);
      setTitle(error.message || "Excel download failed");
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const getUserList = async (roleID) => {
    try {
      const params = {
        roleID: roleID,
      };
      const response = await GetUserListBasedOnRoleID(params);
      if (response.statusCode == 200) {
        setUserList(response.bindEntityNameList);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.error("Error in getUserList:", error);

      setUserList([]);
      throw error;
    }
  };

  const getRoleList = async () => {
    try {
      const response = await GetRoleList();
      if (response.statusCode == 200) {
        setRoleList(response.roleList);
      } else {
        setRoleList([]);
      }
    } catch (error) {
      console.error("Error in getRoleList:", error);
      setRoleList([]);
    }
  };
  useEffect(() => {
    getLeaveReport();
    getRoleList();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
        minHeight: "100vh",
        transition: "filter 0.3s ease, pointer-events 0.3s",
        filter: isDownloadLoading ? "blur(2px)" : "none",
        pointerEvents: isDownloadLoading ? "none" : "auto",
        display: "flex",
        flexDirection: "column",
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
          width: "97.5%",
          margin: 0,
          left: 0,
          right: 0,
        }}
      >
        <Grid item xs={12} mt={1} mb={0} ml={0}>
          <BreadcrumbsHeader pageTitle="Attendance" />
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
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 2, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Leave Report"
                backgroundColor={LIGHT_GRAY2}
              >
                {isLoading ? (
                  <SearchFormSkeleton />
                ) : (
                  <>
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
                          ROLE
                        </Typography>
                        <NuralAutocomplete
                          options={roleList}
                          getOptionLabel={(option) => option.roleName}
                          isOptionEqualToValue={(option, value) =>
                            option.roleId === value.roleId
                          }
                          value={
                            roleList?.find(
                              (role) =>
                                role.roleId === searchParams.roleId || null
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange("roleId", value?.roleId || 0);
                          }}
                          label="Role"
                          placeholder="SELECT"
                          width="100%"
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
                          NAME
                        </Typography>
                        <NuralAutocomplete
                          options={userList}
                          getOptionLabel={(option) => option.entityTypeName}
                          isOptionEqualToValue={(option, value) =>
                            option.userID === value.userID
                          }
                          value={
                            userList.find(
                              (user) =>
                                user.userID === searchParams.entityId || null
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange("entityId", value?.userID || 0);
                          }}
                          label="Name"
                          placeholder="SELECT"
                          width="100%"
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
                          width="100%"
                          placeholder="Select"
                          value={searchParams.fromDate}
                          onChange={(value) =>
                            handleSearchChange("fromDate", value)
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
                          TO DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MM/YY"
                          value={searchParams.toDate}
                          onChange={(value) =>
                            handleSearchChange("toDate", value)
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* Second Row */}
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
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
                          onClick={handleReset}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={9} md={11}>
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
                  </>
                )}
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>

        {status && (
          <StatusModel
            width="100%"
            status={status}
            title={title}
            onClose={() => setStatus(null)}
          />
        )}
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          {hasSearched ? (
            isTableLoading ? (
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 320px)",
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
                        colSpan={12}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          position: "sticky",
                          top: 0,
                          zIndex: 1100,
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
                        "LEAVE APPLIED ON",
                        "USER NAME",
                        "USER CODE",
                        "ROLE",
                        "REPORTING TO",
                        "STATE",
                        "CITY",
                        "LEAVE TYPE",
                        "FROM",
                        "TO",
                        "BALANCE LEAVE",
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            ...tableHeaderStyle,
                            position: "sticky",
                            top: "45px",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 1000,
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array(SKELETON_ROWS)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton
                          key={`skeleton-${index}`}
                          columns={12}
                        />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 320px)",
                  overflow: "auto",
                  position: "relative",
                  "& .MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  },
                }}
              >
                {filteredRows.length > 0 ? (
                  <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          sx={{
                            backgroundColor: LIGHT_GRAY2,
                            position: "sticky",
                            top: 0,
                            zIndex: 1100,
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
                            zIndex: 1000,
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
                          "LEAVE APPLIED ON",
                          "USER NAME",
                          "USER CODE",
                          "ROLE",
                          "REPORTING TO",
                          "STATE",
                          "CITY",
                          "LEAVE TYPE",
                          "FROM",
                          "TO",
                          "BALANCE LEAVE",
                        ].map((header, index) => (
                          <TableCell
                            key={`column${index + 1}`}
                            onClick={() => handleSort(`column${index + 1}`)}
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
                                {sortConfig.key === `column${index + 1}` ? (
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
                      {filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                              {row.leaveAppliedDate}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.entityName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.entityCode}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.roleName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.reportingAuthority}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.stateName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.cityName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.leaveTypeName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.leaveFromDate}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.leaveToDate}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.balanceLeave}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                    No records found
                  </Typography>
                )}

                {/* Custom Pagination */}
                <NuralPagination
                  totalRecords={totalRecords}
                  initialPage={page}
                  initialRowsPerPage={rowsPerPage}
                  onPaginationChange={handlePaginationChange}
                />
              </TableContainer>
            )
          ) : null}
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
            md: 15,
            lg: 15,
          }}
          sx={{
            zIndex: 10000,
            top: "0px",
            overflowY: "auto",
            paddingBottom: "0px",
            filter: isDownloadLoading ? "none" : "inherit",
            pointerEvents: isDownloadLoading ? "none" : "auto",
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
              <NuralExport
                title="Export"
                views={views}
                downloadExcel={downloadExcel}
                isDownloadLoading={isDownloadLoading}
              />
            </Grid>
          </NuralActivityPanel>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeaveReport;
