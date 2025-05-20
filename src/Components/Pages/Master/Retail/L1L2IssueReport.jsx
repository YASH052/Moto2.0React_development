import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect } from "react";
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
  IconButton,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";

import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import {
  GetL1L2IssueReport,
  GetRoleList,
  ISPForBindDropDown,
} from "../../../Api/Api";
import { getFirstDayOfMonth, getToday } from "../../../Common/commonFunction";
import StatusModel from "../../../Common/StatusModel";

import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";

const L1L2IssueReport = () => {
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("l1l2-issue-report");
  const [roleList, setRoleList] = React.useState([]);
  const [nameList, setNameList] = React.useState([]);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [isRoleLoading, setIsRoleLoading] = React.useState(false);
  const [isNameLoading, setIsNameLoading] = React.useState(false);
  const [isFormLoading, setIsFormLoading] = React.useState(true);
  const [isTableLoading, setIsTableLoading] = React.useState(false);

  const [searchParams, setSearchParams] = React.useState({
    roleID: 0,
    entityID: 0,
    issueStatus: 101, //0= pending, 1- closed, 2= unresolve ,101= all
    fromDate: getFirstDayOfMonth(),
    toDate: getToday(),
    pageIndex: 1,
    pageSize: 10,
  });

  const statusOptions = [
    { id: 0, label: "Pending" },
    { id: 1, label: "Closed" },
    { id: 2, label: "Unresolved" },
    { id: 101, label: "All" },
  ];

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

  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [showTable, setShowTable] = React.useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setIsFormLoading(true);
      await fetchDropdownData();
      setIsFormLoading(false);
    };
    initializeData();
  }, []);

  const fetchDropdownData = async () => {
    setIsRoleLoading(true);
    try {
      const res = await GetRoleList();
      if (res.statusCode == 200) {
        const ispRoles = res.roleList.filter((role) =>
          role.roleName.toLowerCase().includes("isp")
        );
        setRoleList(ispRoles);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setIsRoleLoading(false);
    }
  };

  // Replace the existing dummy data with this more realistic data

  // Update the table columns configuration
  const tableColumns = [
    { id: "ispName", label: "NAME" },
    { id: "ispCode", label: "CODE" },
    { id: "issueType", label: "ISSUE TYPE" },
    { id: "issueCategoryName", label: "ISSUE CATEGORY" },
    { id: "issue", label: "ISSUE" },
    { id: "issueRaisedOn", label: "RAISED ON" },
    { id: "status", label: "STATUS" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Update searchParams with new page
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage + 1, // Convert 0-based page to 1-based for API
    }));
    // Trigger search with new page
    handleSearch();
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    // Update searchParams with new page size
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1, // Reset to first page
    }));
    // Trigger search with new page size
    handleSearch();
  };

  const handleJumpToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(filteredRows.length / rowsPerPage)
    ) {
      const newPage = pageNumber - 1; // Convert to 0-based
      setPage(newPage);
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: pageNumber, // Keep 1-based for API
      }));
      handleSearch();
    }
  };

  const handleJumpToFirst = () => {
    setPage(0);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
    handleSearch();
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(filteredRows.length / rowsPerPage) - 1;
    setPage(lastPage);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: lastPage + 1,
    }));
    handleSearch();
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

  const handleSearch = async () => {
    setIsTableLoading(true);
    setShowStatus(false);
    try {
      const updatedParams = {
        ...searchParams,
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      };

      let res = await GetL1L2IssueReport(updatedParams);
      if (res.statusCode == 200) {
        setRows(res.issueReportList);
        setFilteredRows(res.issueReportList);
        setShowTable(true);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode == 204 ? 400 : res.statusCode);
        setTitle(res.statusMessage);
        setRows([]);
        setFilteredRows([]);
        setShowTable(false);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode || 500);
      setTitle(error.message || "Internal Server Error");
      console.error("Error fetching issue report data:", error);
      setRows([]);
      setFilteredRows([]);
      setShowTable(false);
    } finally {
      setIsTableLoading(false);
    }
  };


  const fetchNameDropDown = async () => {
    setIsNameLoading(true);
    try {
      let res = await ISPForBindDropDown();
      if (res.statusCode == 200) {
        setNameList(res.ispForBindDropDownMasterList);
      } else {
        setNameList([]);
      }
    } catch (error) {
      console.error("Error fetching name dropdown data:", error);
    } finally {
      setIsNameLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    if (field === "roleID") {
      if (value != null) {
        fetchNameDropDown();
      } else {
        setNameList([]);
      }
    }
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value,
    }));
  };

  const handleDateChange = (field, value) => {
    if (value) {
      // Use full ISO string
      const formattedDate = value.toISOString();
      setSearchParams((prevParams) => ({
        ...prevParams,
        [field]: formattedDate,
      }));
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [field]: "",
      }));
    }
  };

  const handleCancel = () => {
    // Reset search parameters to initial state
    setSearchParams({
      roleID: 0,
      entityID: 0,
      issueStatus: 101,
      fromDate: getFirstDayOfMonth(),
      toDate: getToday(),
      pageIndex: 1,
      pageSize: 10,
    });
    // Clear the name list
    setNameList([]);
    // Hide the table
    setShowTable(false);
    // Reset rows
    setRows([]);
    setFilteredRows([]);
    setShowStatus(false);
  };

  const handleResetStatus = () => {
    setShowStatus(false);
    setStatus(0);
    setTitle("");
  };

  const downloadExcel = async () => {
    setIsDownloadLoading(true);
    handleResetStatus();
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    try {
      let res = await GetL1L2IssueReport(body);
      if (res.statusCode == 200) {
        window.location.href = res.reportLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(() => {
          handleResetStatus();
        }, 5000);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(() => {
          setIsDownloadLoading(false);
        }, 1000);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode || 500);
      setTitle(error.message || "Internal Server Error");
      console.error("Error downloading Excel:", error);
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
          <Grid item xs={12} mt={0} mb={0} ml={1} pr={3}>
            <BreadcrumbsHeader pageTitle="Retail" />
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
                {isFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                    {/* <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: PRIMARY_BLUE2,
                        mb: 4,
                        mt: 1,
                      }}
                    >
                      Search
                    </Typography> */}
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
                          ROLE
                        </Typography>
                        <NuralAutocomplete
                          label="Role"
                          options={roleList}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.roleName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.roleId === value?.roleId
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange("roleID", newValue?.roleId || 0);
                          }}
                          value={
                            roleList.find(
                              (option) => option.roleId === searchParams.roleID
                            ) || null
                          }
                          loading={isRoleLoading}
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
                          NAME
                        </Typography>
                        <NuralAutocomplete
                          label="Name"
                          options={nameList}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.ispName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.ispID === value?.ispID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "entityID",
                              newValue?.ispID || 0
                            );
                          }}
                          value={
                            nameList.find(
                              (option) => option.ispID === searchParams.entityID
                            ) || null
                          }
                          loading={isNameLoading}
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
                          STATUS
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="status"
                          options={statusOptions}
                          placeholder="SELECT"
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "issueStatus",
                              newValue ? newValue.id : 101
                            );
                          }}
                          value={
                            statusOptions.find(
                              (option) => option.id === searchParams.issueStatus
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
                          FROM DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={(date) =>
                            handleDateChange("fromDate", date)
                          }
                          value={
                            searchParams.fromDate
                              ? new Date(searchParams.fromDate)
                              : null
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
                          TO DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YYYY"
                          onChange={(date) => handleDateChange("toDate", date)}
                          value={
                            searchParams.toDate
                              ? new Date(searchParams.toDate)
                              : null
                          }
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
                )}
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

        {/* Add this after the NuralAccordion2 component */}
        <Grid mt={-4} item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          {showTable && (
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
                      colSpan={6}
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
                    {tableColumns.map(({ id, label }) => (
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
                  {isTableLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => (
                          <TableRowSkeleton
                            key={index}
                            columns={tableColumns.length + 1} // +1 for S.NO column
                          />
                        ))
                    : filteredRows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow key={row.sNo}>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.ispName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.ispCode}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.issueType}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.issueCategoryName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.issue}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.issueRaisedOn}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.status}
                            </TableCell>
                          </TableRow>
                        ))}
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
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={
                      page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                    }}
                    onClick={handleJumpToLast}
                    variant="body2"
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(filteredRows.length / rowsPerPage)}
                    onChange={(e) => {
                      const pageNumber = parseInt(e.target.value, 10);
                      handleJumpToPage(pageNumber);
                    }}
                    style={jumpToPageStyle}
                  />
                  <Grid mt={1}>
                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          )}
        </Grid>
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

export default L1L2IssueReport;
