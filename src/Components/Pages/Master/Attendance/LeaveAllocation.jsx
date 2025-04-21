import { Grid, Typography, Button, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  AQUA_DARK,
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
import {
  GetAllotedLeaveList,
  GetLeaveTypeDropdownList,
  GetRoleList,
  SaveLeaveAllocation,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import EditIcon from "@mui/icons-material/Edit";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const LeaveAllocation = () => {
  // Define table columns

  const [activeTab, setActiveTab] = React.useState("leave-allocation");
  const [roleDrop, setRoleDrop] = React.useState([]);
  const [formData, setFormData] = React.useState({});
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [leaveTypeDrop, setLeaveTypeDrop] = React.useState([]);
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const validateField = (name, value) => {
    switch (name) {
      case "roleId":
        return !value ? "Role is required" : "";
      case "leaveTypes":
        return !value ? "Please enter at least one leave type" : "";
      default:
        // For leave type fields
        if (leaveTypeDrop.some((lt) => lt.leaveTypeCode === name)) {
          if (!value) return "";
          const numValue = parseInt(value);
          if (isNaN(numValue) || numValue <= 0) {
            return "Number of leaves must be greater than 0";
          }
        }
        return "";
    }
  };
  const tabs = [
    { label: "Attendance Upload", value: "attendance-upload" },

    { label: "Leave Type", value: "leave-type" },
    { label: "Leave Allocation", value: "leave-allocation" },
  ];
  const [searchParams, setSearchParams] = useState({
    roleId: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [tempSearchParams, setTempSearchParams] = useState({
    roleId: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Update the page state to start from 1
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data

  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleChangePage = (event, newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1,
    }));
    setRowsPerPage(newRowsPerPage);
    setPage(1);
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
  useEffect(() => {
    fetchRoleDrop();
    fetchLeaveTypeDrop();
  }, []);

  useEffect(() => {
    let body = {
      roleId: searchParams.roleId,
      pageIndex: searchParams.pageIndex,
      pageSize: searchParams.pageSize,
    };
    fetchData(body);
  }, [searchParams]);

  const fetchData = async (body) => {
    setIsTableLoading(true);
    try {
      // Clear existing data before fetching new data

      let res = await GetAllotedLeaveList(body);
      if (res.statusCode == 200) {
        setRows(res.allottedLeaveList || []);
        setFilteredRows(res.allottedLeaveList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.response.status);
      setTitle(error.response.statusMessage || "Internal Server Error");
      console.log("error", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchLeaveTypeDrop = async () => {
    try {
      let res = await GetLeaveTypeDropdownList();
      if (res.statusCode == 200) {
        setLeaveTypeDrop(res.leaveTypeList);
        // Initialize formData with leave types
        const initialFormData = {};
        res.leaveTypeList.forEach((leaveType) => {
          initialFormData[leaveType.leaveTypeCode] = "";
        });
        setFormData(initialFormData);
      } else {
        setLeaveTypeDrop([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchRoleDrop = async () => {
    try {
      let res = await GetRoleList();
      if (res.statusCode == 200) {
        setRoleDrop(res.roleList || []);
      } else {
        setRoleDrop([]);
      }
    } catch (error) {
      console.log("error", error);
      setRoleDrop([]);
    }
  };

  const handleChange = (field, value) => {
    // Only allow numbers for leave type fields
    if (leaveTypeDrop.some((lt) => lt.leaveTypeCode === field)) {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [field]: numericValue });
    } else {
      setFormData({ ...formData, [field]: value });
    }

    // Validate the field
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Add validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate Role
    if (!formData.roleId) {
      newErrors.roleId = "Please select a role";
    }

    // Validate Leave Types

    setErrors(newErrors);
    console.log("newErrors", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    setShowStatus(false);

    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    // Transform the formData into the required format and filter out empty values
    const leaveTypeList = leaveTypeDrop
      .map((leaveType) => ({
        leaveTypeId: leaveType.leaveTypeID,
        noOfLeaves: parseInt(formData[leaveType.leaveTypeCode]) || 0,
      }))
      .filter((item) => item.noOfLeaves > 0); // Only include items with leaves allocated

    const requestData = {
      roleId: formData.roleId,
      leaveTypeList: leaveTypeList,
    };

    try {
      let res = await SaveLeaveAllocation(requestData);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        handleCancel();
        setErrors({}); // Clear errors on successful submission
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.response.status);
      setTitle(error.response.statusMessage || "Internal Server Error");
      console.log("error", error);
    } finally {
      setTimeout(() => {
        handleClearStatus();
      }, 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      roleId: "",
      ...leaveTypeDrop.reduce((acc, leaveType) => {
        acc[leaveType.leaveTypeCode] = "";
        return acc;
      }, {}),
    });
    setErrors({}); // Clear errors when canceling
  };

  const handleClearStatus = () => {
    setShowStatus(false);
    setStatus("");
    setTitle("");
  };

  const handleSearchChange = (field, value) => {
    setTempSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchClick = async () => {
    setSearchParams((prev) => ({
      ...tempSearchParams,
      pageIndex: 1,
    }));
    setRowsPerPage(10);
    setPage(1);
  };

  const handleCancelSearch = () => {
    setPage(1);
    setRowsPerPage(10);
    setTempSearchParams({
      roleId: 0,
      pageIndex: 1,
      pageSize: 10,
    });
  };

  // Add state for jump to page input
  const [jumpToPageValue, setJumpToPageValue] = useState("");

  // Add handler for jump to page input change
  const handleJumpToPageChange = (e) => {
    setJumpToPageValue(e.target.value);
  };

  // Add handler for jump to page search click
  const handleJumpToPageClick = () => {
    const jumpToPage = parseInt(jumpToPageValue, 10);
    if (
      jumpToPage >= 1 &&
      jumpToPage <= Math.ceil(totalRecords / rowsPerPage)
    ) {
      handleChangePage(null, jumpToPage);
      setJumpToPageValue(""); // Clear the input after jumping
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
                title="create"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                expanded={accordionExpanded}
                onChange={(event, expanded) => setAccordionExpanded(expanded)}
              >
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={12} lg={12}>
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
                      options={roleDrop}
                      getOptionLabel={(option) => option.roleName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.roleName === value.roleName
                      }
                      onChange={(event, newValue) => {
                        handleChange("roleId", newValue?.roleId || 0);
                      }}
                      value={
                        roleDrop.find(
                          (option) => option.roleId === formData.roleId
                        ) || null
                      }
                      width="100%"
                      placeholder="SELECT"
                      error={!!errors.roleId}
                    />

                    {errors.roleId && (
                      <FormHelperText
                        sx={{
                          color: "error.main",
                          marginLeft: 0,
                          fontSize: "10px",
                        }}
                      >
                        {errors.roleId}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                {/* Leave Type Fields */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={1}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  {leaveTypeDrop.map((leaveType) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      lg={3}
                      key={leaveType.leaveTypeID}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        {leaveType.leaveTypeName.toUpperCase()}
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder={`ENTER ${leaveType.leaveTypeName}`}
                        value={formData[leaveType.leaveTypeCode] || ""}
                        onChange={(e) =>
                          handleChange(leaveType.leaveTypeCode, e.target.value)
                        }
                        error={!!errors[leaveType.leaveTypeCode]}
                        errorMessage={errors[leaveType.leaveTypeCode]}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Second Row */}
              </NuralAccordion2>
              {accordionExpanded && (
                <Grid
                  container
                  spacing={2}
                  mt={1}
                  px={1}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => {
                        handleCancel();
                        setShowStatus(false);
                      }}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="SAVE"
                      variant="contained"
                      color={AQUA_DARK}
                      height="36px"
                      backgroundColor={AQUA}
                      width="100%"
                      fontSize="12px"
                      onClick={handlePost}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          {showStatus && (
            <Grid item xs={12} pr={2} mt={3}>
              <StatusModel
                width="100%"
                status={status}
                title={title}
                onClose={handleClearStatus}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Add this after the NuralAccordion2 component */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <NuralAccordion2 title="View" backgroundColor={"white"} padding={"0px"}>
          <Grid
            container
            spacing={2}
            mb={2}
            backgroundColor={LIGHT_GRAY2}
            padding={"16px"}
            mt={1}
            sx={{
              gap: { xs: 0, sm: 0, md: 0, lg: 0 },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
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
                options={roleDrop}
                getOptionLabel={(option) => option.roleName || ""}
                isOptionEqualToValue={(option, value) =>
                  option.roleName === value.roleName
                }
                onChange={(event, newValue) => {
                  handleSearchChange("roleId", newValue?.roleId || 0);
                }}
                value={
                  roleDrop.find(
                    (option) => option.roleId === tempSearchParams.roleId
                  ) || null
                }
                width="100%"
                placeholder="SELECT"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1} lg={1}>
              <NuralButton
                text="CANCEL"
                variant="outlined"
                color={PRIMARY_BLUE2}
                fontSize="12px"
                height="36px"
                borderColor={PRIMARY_BLUE2}
                onClick={handleCancelSearch}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={11} lg={11}>
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
          <Grid item xs={12}>
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
                        <Grid item>S.NO</Grid>
                      </Grid>
                    </TableCell>
                    {["ROLE", "LEAVE TYPE", "NO OF LEAVES"].map(
                      (header, index) => (
                        <TableCell
                          key={header}
                          onClick={() =>
                            handleSort(
                              header === "ROLE"
                                ? "roleName"
                                : header === "LEAVE TYPE"
                                ? "leaveTypeName"
                                : "noOfLeave"
                            )
                          }
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
                            <Grid item>{header}</Grid>
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {sortConfig.key ===
                              (header === "ROLE"
                                ? "roleName"
                                : header === "LEAVE TYPE"
                                ? "leaveTypeName"
                                : "noOfLeave") ? (
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
                      )
                    )}
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
                        <Grid item>EDIT</Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isTableLoading ? (
                    <Typography
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        textAlign: "center",
                      }}
                    >
                      loading....
                    </Typography>
                  ) : filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row, index) => (
                      <TableRow key={row.leaveAllocationID} sx={rowstyle}>
                        <TableCell
                          sx={{
                            ...rowstyle,
                            color: PRIMARY_BLUE2,
                            fontWeight: 400,
                          }}
                        >
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...rowstyle,
                            color: PRIMARY_BLUE2,
                            fontWeight: 400,
                          }}
                        >
                          {row.roleName}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...rowstyle,
                            color: PRIMARY_BLUE2,
                            fontWeight: 400,
                          }}
                        >
                          {row.leaveTypeName}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...rowstyle,
                            color: PRIMARY_BLUE2,
                            fontWeight: 400,
                          }}
                        >
                          {row.noOfLeave}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setFormData({
                                roleId: row.roleID,
                                [row.leaveTypeCode]: row.noOfLeave.toString(),
                              });
                              setAccordionExpanded(true);
                            }}
                          >
                            <EditIcon sx={{ color: PRIMARY_BLUE2 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Update the pagination section */}
              <Grid
                container
                sx={{
                  padding: " 8px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: LIGHT_GRAY2,
                  borderTop: `1px solid ${PRIMARY_LIGHT_GRAY}`,
                  zIndex: 1200,
                  boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.05)",
                  // minHeight: "80px",
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
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: "10px",
                        color: PRIMARY_BLUE2,
                        fontWeight: 400,
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
                    onClick={() => handleChangePage(null, 1)}
                  >
                    JUMP TO FIRST
                  </Typography>

                  <IconButton
                    onClick={() => handleChangePage(null, page - 1)}
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
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
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
                    onClick={() =>
                      handleChangePage(
                        null,
                        Math.ceil(totalRecords / rowsPerPage)
                      )
                    }
                    variant="body2"
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    value={jumpToPageValue}
                    onChange={handleJumpToPageChange}
                    style={{
                      width: "100px",
                      height: "24px",
                      fontSize: "10px",
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
                  <Grid
                    mt={1}
                    sx={{ cursor: "pointer" }}
                    onClick={handleJumpToPageClick}
                  >
                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          </Grid>
        </NuralAccordion2>
      </Grid>
    </Grid>
  );
};

export default LeaveAllocation;
