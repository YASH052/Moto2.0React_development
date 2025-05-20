import React, { useEffect, useState } from "react";
import {
  AQUA,
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Skeleton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import EditIcon from "@mui/icons-material/Edit";

import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";

import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import {
  GetAttendanceRegularisationData,
  GetEntityListWithRoleID,
  GetRoleList,
  GetUserLeaveDetailsListMoto,
} from "../../../Api/Api";
import {
  getFirstDayOfMonth,
  getTodayDate,
} from "../../../Common/commonFunction";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import { setUserLeavesID } from "../../../Redux/action";
import { useDispatch } from "react-redux";
const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_PURPLE,
  marginBottom: "5px",
  fontWeight: 400,
};

const AttendanceSearch = ({ expanded, onChange }) => {
  const initialAttendanceParams = {
    entityTypeId: 0,
    entityId: 0,
    fromDate: getFirstDayOfMonth(),
    toDate: getTodayDate(),
    pageIndex: 1,
    pageSize: 10,
    attStatus: 0,
    roleID: 0,
  };

  const initialBalanceLeaveParams = {
    displayMode: 0,
    userLeaveId: 0,
    entityId: 0,
    pageIndex: 1,
    pageSize: 10,
    roleId: 0,
  };

  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState(initialAttendanceParams);
  const [flag, setFlag] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [roleName, setRoleName] = React.useState([]);
  const [entityList, setEntityList] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add loading states
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [isEntityLoading, setIsEntityLoading] = useState(false);

  // Add form loading state
  const [isFormLoading, setIsFormLoading] = useState(true);

  const [isBalanceLeave, setIsBalanceLeave] = useState(true);
  const [balanceLeaveData, setBalanceLeaveData] = useState([]);

  const handleChangeRowsPerPage = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: value,
      pageIndex: 1,
    }));
    setFlag(!flag);
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
    setFlag(!flag);
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        // Reset sorting when clicking the same column for the third time
        setSortConfig({ key: null, direction: null });

        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortData = (data) => {
      return [...data].sort((a, b) => {
        let aValue, bValue;

        // Get values based on column name
        switch (columnName) {
          case "date":
            aValue = a.attendanceDate || "";
            bValue = b.attendanceDate || "";
            break;
          case "userType":
            aValue = a.userType || "";
            bValue = b.userType || "";
            break;
          case "name":
            aValue = a.displayName || "";
            bValue = b.displayName || "";
            break;
          case "status":
            aValue = a.attendanceStatus || "";
            bValue = b.attendanceStatus || "";
            break;
          case "role":
            aValue = a.entityType || "";
            bValue = b.entityType || "";
            break;
          case "leaveType":
            aValue = a.leaveTypeName || "";
            bValue = b.leaveTypeName || "";
            break;
          case "noOfLeaves":
            aValue = a.totalLeave || 0;
            bValue = b.totalLeave || 0;
            return direction === "asc" ? aValue - bValue : bValue - aValue;
          case "pendingLeaves":
            aValue = a.pendingLeaves || 0;
            bValue = b.pendingLeaves || 0;
            return direction === "asc" ? aValue - bValue : bValue - aValue;
          default:
            aValue = "";
            bValue = "";
        }

        // Convert to lowercase for string comparison
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
    };

    if (isBalanceLeave) {
      setBalanceLeaveData(sortData(balanceLeaveData));
    } else {
      setFilteredRows(sortData(filteredRows));
    }
  };

  const renderSortIcon = (columnName) => {
    return (
      <Grid item sx={{ display: "flex", alignItems: "center" }}>
        {sortConfig.key === columnName ? (
          sortConfig.direction === "asc" ? (
            <ArrowUpwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
          ) : sortConfig.direction === "desc" ? (
            <ArrowDownwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
          ) : (
            <RestartAltIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
          )
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            sx={{ height: 16, width: 16 }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
            <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
          </Grid>
        )}
      </Grid>
    );
  };

  useEffect(() => {
    const initializeForm = async () => {
      setIsFormLoading(true);
      try {
        await GetRoleNameList();
      } catch (error) {
        console.log(error, "error initializing form");
      } finally {
        setIsFormLoading(false);
      }
    };

    initializeForm();
  }, []);

  useEffect(() => {
    if (isBalanceLeave) {
      fetchBalanceLeaveData();
    } else {
      fetchTableData();
    }
  }, [flag, isBalanceLeave]);

  const fetchTableData = async () => {
    setShowStatus(false);
    setIsTableLoading(true);
    setFilteredRows([]);
    try {
      let res = await GetAttendanceRegularisationData(searchParams);
      if (res.statusCode == 200) {
        setFilteredRows(res.attRegularisationListItems);
        setTotalRecords(res.totalRecords);
      } else {
        setFilteredRows([]);
        setShowStatus(true);
        setStatus(res.statusCode || 400);
        setTitle(res.statusMessage || "No data found");
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(500);
      setTitle("Internal Server Error");
      setFilteredRows([]);
      setTotalRecords(0);
      console.log(error, "error fetching table data");
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchBalanceLeaveData = async () => {
    setShowStatus(false);
    setIsTableLoading(true);
    try {
      let res = await GetUserLeaveDetailsListMoto(searchParams);
      if (res.statusCode == 200) {
        setBalanceLeaveData(res.userLeaveDetailListItems);
        setTotalRecords(res.totalRecords);
      } else {
        setBalanceLeaveData([]);
        setShowStatus(true);
        setStatus(res.statusCode || 400);
        setTitle(res.statusMessage || "No data found");
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(500);
      setTitle("Internal Server Error");
      setBalanceLeaveData([]);
      setTotalRecords(0);
    } finally {
      setIsTableLoading(false);
    }
  };

  const GetRoleNameList = async () => {
    setIsRoleLoading(true);
    try {
      const response = await GetRoleList();
      if (response.statusCode == 200) {
        // Filter only ISP roles
        const ispRoles = response.roleList.filter(role => 
          role.roleName.toLowerCase().includes('isp')
        );
        setRoleName(ispRoles);
      } else {
        setRoleName([]);
      }
    } catch (error) {
      console.log(error, "error fetching role list");
      setRoleName([]);
    } finally {
      setIsRoleLoading(false);
    }
  };

  const GetEntityListWithID = async (roleID) => {
    setIsEntityLoading(true);
    try {
      const response = await GetEntityListWithRoleID(roleID);
      if (response.statusCode == 200) {
        setEntityList(response.entityTypeWithEntityTypeIDList);
      }
    } catch (error) {
      console.log(error, "error fetching entity list");
      setEntityList([]);
    } finally {
      setIsEntityLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    if (field === "roleID" || field === "roleId") {
      GetEntityListWithID(value);
    }

    // Format dates to YYYY-MM-DD only for attendance view
    if (!isBalanceLeave && (field === "fromDate" || field === "toDate")) {
      if (value && !isNaN(new Date(value))) {
        const date = new Date(value);
        value = date.toISOString().split("T")[0];
      }
    }

    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value,
    }));
  };

  const handleEdit = (id) => {
    // Handle edit action here
    console.log("Edit row:", id);
    dispatch(setUserLeavesID(id));
    // You can implement navigation or modal opening logic here
  };

  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: 10,
    }));
    setFlag(!flag);
  };

  const handleCancel = () => {
    setSearchParams(
      isBalanceLeave ? initialBalanceLeaveParams : initialAttendanceParams
    );
    setJumpToPage("");
    setShowStatus(false);
    setFlag(!flag);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage, 10);
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecords / searchParams.pageSize)
    ) {
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: pageNumber,
      }));
      setFlag(!flag);
    }
  };

  const handleJumpToFirstPage = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
    setFlag(!flag);
  };

  const handleJumpToLastPage = () => {
    const lastPage = Math.ceil(totalRecords / searchParams.pageSize);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: lastPage,
    }));
    setFlag(!flag);
  };

  const handleTypeChange = (value) => {
    if (value === "BALANCE LEAVE") {
      setIsBalanceLeave(true);
      setSearchParams(initialBalanceLeaveParams);
      setFilteredRows([]);
      setBalanceLeaveData([]);
      setTotalRecords(0);
      setShowStatus(false);
    } else if (value === "ATTENDANCE") {
      setIsBalanceLeave(false);
      setSearchParams(initialAttendanceParams);
      setFilteredRows([]);
      setBalanceLeaveData([]);
      setTotalRecords(0);
      setShowStatus(false);
    }
    setFlag(!flag);
  };

  if (isFormLoading) {
    return <FormSkeleton />;
  }

  const renderBalanceLeaveTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        color: PRIMARY_BLUE2,
        maxHeight: "calc(100vh - 110px)",
        overflow: "auto",
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={8}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                position: "sticky",
                top: 0,
                zIndex: 100,
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
              { label: "S.NO", sortable: false },
              { label: "ROLE", field: "role", sortable: true },
              { label: "NAME", field: "name", sortable: true },
              { label: "LEAVE TYPE", field: "leaveType", sortable: true },
              { label: "NO OF LEAVES", field: "noOfLeaves", sortable: true },
              {
                label: "PENDING LEAVES",
                field: "pendingLeaves",
                sortable: true,
              },
              { label: "EDIT", sortable: false },
            ].map((header, index) => (
              <TableCell
                key={header.label}
                onClick={() => header.sortable && handleSort(header.field)}
                sx={{
                  ...tableHeaderStyle,
                  cursor: header.sortable ? "pointer" : "default",
                  position: "sticky",
                  top: "46px",
                  backgroundColor: LIGHT_GRAY2,
                  zIndex: 100,
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>{header.label}</Grid>
                  {header.sortable && renderSortIcon(header.field)}
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isTableLoading ? (
            <TableRowSkeleton columns={7} />
          ) : (
            balanceLeaveData.map((row, index) => (
              <TableRow key={row.userLeavesID}>
                <TableCell
                  sx={{ ...rowstyle, color: PRIMARY_BLUE2, fontWeight: 600 }}
                >
                  {(searchParams.pageIndex - 1) * searchParams.pageSize +
                    index +
                    1}
                </TableCell>
                <TableCell sx={{ ...rowstyle }}>{row.entityType}</TableCell>
                <TableCell sx={{ ...rowstyle }}>{row.displayName}</TableCell>
                <TableCell sx={{ ...rowstyle }}>{row.leaveTypeName}</TableCell>
                <TableCell sx={{ ...rowstyle }}>{row.totalLeave}</TableCell>
                <TableCell sx={{ ...rowstyle }}>{row.pendingLeaves}</TableCell>
                <TableCell sx={{ ...rowstyle }}>
                  <IconButton
                    onClick={() => handleEdit(row.userLeavesID)}
                    sx={{
                      color: PRIMARY_BLUE2,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
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
              {totalRecords} / {Math.ceil(totalRecords / searchParams.pageSize)}{" "}
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
                fontWeight: 600,
              }}
            >
              SHOW :
            </Typography>
            {[10, 25, 50, 100].map((value) => (
              <Grid item key={value}>
                <Button
                  onClick={() => handleChangeRowsPerPage(value)}
                  sx={{
                    minWidth: "25px",
                    height: "24px",
                    padding: "4px",
                    borderRadius: "50%",
                    backgroundColor:
                      searchParams.pageSize === value
                        ? PRIMARY_BLUE2
                        : "transparent",
                    color:
                      searchParams.pageSize === value ? "#fff" : PRIMARY_BLUE2,
                    fontSize: "12px",
                    "&:hover": {
                      backgroundColor:
                        searchParams.pageSize === value
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
            onClick={handleJumpToFirstPage}
          >
            JUMP TO FIRST
          </Typography>
          <IconButton
            onClick={() => handlePageChange(searchParams.pageIndex - 1)}
            disabled={searchParams.pageIndex === 1}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            PAGE {searchParams.pageIndex}
          </Typography>

          <IconButton
            onClick={() => handlePageChange(searchParams.pageIndex + 1)}
            disabled={
              searchParams.pageIndex >=
              Math.ceil(totalRecords / searchParams.pageSize)
            }
          >
            <NavigateNextIcon />
          </IconButton>

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
            onClick={handleJumpToLastPage}
          >
            JUMP TO LAST
          </Typography>
          <input
            type="number"
            placeholder="Jump to page"
            min={1}
            max={Math.ceil(totalRecords / searchParams.pageSize)}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            style={jumpToPageStyle}
          />
          <Grid mt={1} sx={{ cursor: "pointer" }} onClick={handleJumpToPage}>
            <img src="./Icons/footerSearch.svg" alt="arrow" />
          </Grid>
        </Grid>
      </Grid>
    </TableContainer>
  );

  return (
    <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
      <NuralAccordion2
        title="Search"
        backgroundColor={"white"}
        padding={"0px"}
        expanded={expanded}
        onChange={onChange}
        controlled={true}
      >
        {isFormLoading ? (
          <FormSkeleton />
        ) : (
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
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Typography
                variant="body1"
                sx={{
                  ...labelStyle,
                  fontSize: { xs: "12px", sm: "10px" },
                }}
                fontWeight={600}
              >
                TYPE
              </Typography>
              <NuralAutocomplete
                options={["ATTENDANCE", "BALANCE LEAVE"]}
                width="100%"
                placeholder="SELECT"
                onChange={(event, value) => handleTypeChange(value)}
                value={isBalanceLeave ? "BALANCE LEAVE" : "ATTENDANCE"}
                defaultValue="BALANCE LEAVE"
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
                ROLE
              </Typography>
              <NuralAutocomplete
                label="Role"
                options={roleName}
                placeholder="SELECT"
                width="100%"
                loading={isRoleLoading}
                getOptionLabel={(option) => option.roleName || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.roleId === value?.roleId
                }
                onChange={(event, newValue) => {
                  handleSearchChange("roleID", newValue?.roleId || 0);
                }}
                value={
                  roleName.find(
                    (option) => option.roleId === searchParams.roleID
                  ) || null
                }
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
                options={entityList}
                placeholder="SELECT"
                width="100%"
                loading={isEntityLoading}
                getOptionLabel={(option) => option.salesChannelName || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.salesChannelID === value?.salesChannelID
                }
                onChange={(event, newValue) => {
                  handleSearchChange("entityId", newValue?.salesChannelID || 0);
                }}
                value={
                  entityList.find(
                    (option) => option.salesChannelID === searchParams.entityId
                  ) || null
                }
                disabled={!searchParams.roleID}
              />
            </Grid>
            {!isBalanceLeave && (
              <>
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
                    value={searchParams.fromDate}
                    onChange={(date) => handleSearchChange("fromDate", date)}
                    width="100%"
                    placeholder="DD/MMM/YYYY"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
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
                    value={searchParams.toDate}
                    onChange={(date) => handleSearchChange("toDate", date)}
                    width="100%"
                    placeholder="DD/MMM/YYYY"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={1} lg={1}>
              <NuralButton
                text="CANCEL"
                variant="outlined"
                color={PRIMARY_BLUE2}
                fontSize="12px"
                height="36px"
                borderColor={PRIMARY_BLUE2}
                width="100%"
                onClick={handleCancel}
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
                onClick={() => handleSearch()}
              >
                SEARCH
              </NuralTextButton>
            </Grid>
          </Grid>
        )}
        {showStatus && (
          <Grid item xs={12} pr={4} sx={{ position: "relative", mt: 2 }}>
            <StatusModel width="100%" status={status} title={title} />
          </Grid>
        )}
        {!showStatus && (
          <Grid item xs={12}>
            {isBalanceLeave ? (
              renderBalanceLeaveTable()
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 50px)",
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
                          zIndex: 100,
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
                          top: "46px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>S.NO</Grid>
                        </Grid>
                      </TableCell>
                      {["DATE", "ROLE", "NAME", "STATUS", "TYPE"].map(
                        (header, index) => (
                          <TableCell
                            key={header}
                            onClick={() => handleSort(`column${index + 1}`)}
                            sx={{
                              ...tableHeaderStyle,
                              cursor: "pointer",
                              position: "sticky",
                              top: "46px",
                              backgroundColor: LIGHT_GRAY2,
                              zIndex: 100,
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
                            </Grid>
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isTableLoading ? (
                      <TableRowSkeleton columns={6} />
                    ) : (
                      filteredRows.map((row, index) => (
                        <TableRow key={row.userId}>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: PRIMARY_BLUE2,
                              fontWeight: 600,
                            }}
                          >
                            {(searchParams.pageIndex - 1) *
                              searchParams.pageSize +
                              index +
                              1}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.attendanceDate}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.userType}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.displayName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.attendanceStatus}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.userType}
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
                        {totalRecords} /{" "}
                        {Math.ceil(totalRecords / searchParams.pageSize)} PAGES
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
                          fontWeight: 600,
                        }}
                      >
                        SHOW :
                      </Typography>
                      {[10, 25, 50, 100].map((value) => (
                        <Grid item key={value}>
                          <Button
                            onClick={() => handleChangeRowsPerPage(value)}
                            sx={{
                              minWidth: "25px",
                              height: "24px",
                              padding: "4px",
                              borderRadius: "50%",
                              backgroundColor:
                                searchParams.pageSize === value
                                  ? PRIMARY_BLUE2
                                  : "transparent",
                              color:
                                searchParams.pageSize === value
                                  ? "#fff"
                                  : PRIMARY_BLUE2,
                              fontSize: "12px",
                              "&:hover": {
                                backgroundColor:
                                  searchParams.pageSize === value
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
                      onClick={handleJumpToFirstPage}
                    >
                      JUMP TO FIRST
                    </Typography>
                    <IconButton
                      onClick={() =>
                        handlePageChange(searchParams.pageIndex - 1)
                      }
                      disabled={searchParams.pageIndex === 1}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      PAGE {searchParams.pageIndex}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handlePageChange(searchParams.pageIndex + 1)
                      }
                      disabled={
                        searchParams.pageIndex >=
                        Math.ceil(totalRecords / searchParams.pageSize)
                      }
                    >
                      <NavigateNextIcon />
                    </IconButton>

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
                      onClick={handleJumpToLastPage}
                    >
                      JUMP TO LAST
                    </Typography>
                    <input
                      type="number"
                      placeholder="Jump to page"
                      min={1}
                      max={Math.ceil(totalRecords / searchParams.pageSize)}
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      style={jumpToPageStyle}
                    />
                    <Grid
                      mt={1}
                      sx={{ cursor: "pointer" }}
                      onClick={handleJumpToPage}
                    >
                      <img src="./Icons/footerSearch.svg" alt="arrow" />
                    </Grid>
                  </Grid>
                </Grid>
              </TableContainer>
            )}
          </Grid>
        )}
      </NuralAccordion2>
    </Grid>
  );
};

export default AttendanceSearch;
