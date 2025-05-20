import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
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
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import { GetRoleList, ISPForBindDropDown, GetDemoAuditReport } from "../../../Api/Api";
import { FormSkeleton, TableRowSkeleton} from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";

const DemoAuditReport = () => {
  const [activeTab, setActiveTab] = React.useState("demo-audit-report");
  const [roles, setRoles] = useState([]);
  const [isps, setIsps] = useState([]);
  const [searchParams, setSearchParams] = useState({
    roleID: 0,
    ispID: 0,
    fromDate: getFirstDayOfMonth(),
    toDate: getCurrentDate(),
    pageIndex: 1,
    pageSize: 10
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedIsp, setSelectedIsp] = useState(null);
  const [reportData, setReportData] = useState({ dataList: [], totalRecords: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [showtable, setShowtable] = useState(false);
  const [flag, setFlag] = useState(false);
  const [jumpToPageInput, setJumpToPageInput] = React.useState("");

  // Helper functions for date formatting
  function getFirstDayOfMonth() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
  }

  function getCurrentDate() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatDateForDisplay(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
  }

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

  // Pagination states
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Sorting states
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Fetch roles and ISPs on component mount
  useEffect(() => {
    setIsFormLoading(true);
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchRoles(), fetchIsps()]);
      } finally {
        setIsFormLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    if(showtable) {
      fetchReportData();
    }
  }, [flag,page]);

  const fetchRoles = async () => {
    try {
      const response = await GetRoleList();
      if (response && response.statusCode === "200") {
        setRoles(response.roleList);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchIsps = async () => {
    try {
      const response = await ISPForBindDropDown();
      if (response && response.statusCode === "200") {
        setIsps(response.ispForBindDropDownMasterList);
      }
    } catch (error) {
      console.error("Error fetching ISPs:", error);
    }
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const response = await GetDemoAuditReport({
        ...searchParams,
        pageIndex: page + 1,
        pageSize: rowsPerPage
      });
      
      if (response && response.statusCode == "200") {
        setReportData({
          dataList: response.dataList || [],
          totalRecords: response.totalRecords || 0
        });
        setShowtable(true);
        setShowStatus(false);
        setStatus("");
        setTitle("");
      } else {
        setShowtable(false);
        setShowStatus(true);
        setStatus(response.statusCode || "400");
        setTitle(response.statusMessage || "Failed to get report.");
        setReportData({ dataList: [], totalRecords: 0 });
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error during get report");
      setStatus(String(error.status || "500"));
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchReportData();
    setFlag(!flag);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setSearchParams({
      ...searchParams,
      pageSize: newRowsPerPage,
      pageIndex: 1
    });
    // fetchReportData();
    setFlag(!flag);
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedData = [...reportData.dataList].sort((a, b) => {
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      const aValue = typeof a[columnName] === 'string' ? a[columnName].toLowerCase() : a[columnName];
      const bValue = typeof b[columnName] === 'string' ? b[columnName].toLowerCase() : b[columnName];

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setReportData({ ...reportData, dataList: sortedData });
  };

  const handleRoleChange = (event, value) => {
    setSelectedRole(value);
    if (value) {
      setSearchParams({
        ...searchParams,
        roleID: value.roleId
      });
    } else {
      setSearchParams({
        ...searchParams,
        roleID: 0
      });
    }
  };

  const handleIspChange = (event, value) => {
    setSelectedIsp(value);
    if (value) {
      setSearchParams({
        ...searchParams,
        ispID: value.ispID
      });
    } else {
      setSearchParams({
        ...searchParams,
        ispID: 0
      });
    }
  };

  const handleFromDateChange = (date) => {
    setSearchParams({
      ...searchParams,
      fromDate: date
    });
  };

  const handleToDateChange = (date) => {
    setSearchParams({
      ...searchParams,
      toDate: date
    });
  };

  const handleSearchClick = () => {
    setPage(0);
    setSearchParams({
      ...searchParams,
      pageIndex: 1
    });
    setShowStatus(false);
    setStatus("");
    setTitle("");
    setShowtable(true);
    // fetchReportData();
    setFlag(!flag);
  };

  const handleCancelClick = () => {
    // Reset selected values
    setSelectedRole(null);
    setSelectedIsp(null);
    
    // Reset search parameters to initial values
    setSearchParams({
      roleID: 0,
      ispID: 0,
      fromDate: getFirstDayOfMonth(),
      toDate: getCurrentDate(),
      pageIndex: 1,
      pageSize: rowsPerPage
    });
    
    // Reset table and pagination state
    setShowtable(false);
    setPage(0);
    setRowsPerPage(10)
    setReportData({ dataList: [], totalRecords: 0 });
    
    // Clear any status messages
    setShowStatus(false);
    setStatus("");
    setTitle("");
  };

  const downloadExcel = async () => {

    let params = {
      fromDate: searchParams.fromDate,
      toDate: searchParams.toDate,
      pageIndex: -1,
      pageSize: 10,
      roleID: selectedRole?.roleId || 0,
      ispID: selectedIsp?.ispID || 0,
    };
    setIsDownloadLoading(true);
    try {
      const res = await GetDemoAuditReport(params);
      if (res.statusCode == 200 && (res.filepathLink || res.filePath)) {
        window.location.href = res.filepathLink || res.filePath;
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage || "Failed to generate export.");
        setStatus(String(res.statusCode || "400"));
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
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
        }}
      >
        {/* Breadcrumbs Grid */}
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

        {/* Filter section */}
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
                  title="Demo Audit Report"
                  backgroundColor={LIGHT_GRAY2}
                >
                  {isFormLoading ? (
                    <FormSkeleton />
                  ) : (
                    <>
                      <Grid
                        container
                        spacing={2}
                        mb={2}
                        sx={{
                          gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                            width="100%"
                            options={roles}
                            getOptionLabel={(option) => option.roleName || ""}
                            value={selectedRole}
                            onChange={handleRoleChange}
                            placeholder="SELECT"
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                            options={isps}
                            getOptionLabel={(option) => option.ispName || ""}
                            value={selectedIsp}
                            onChange={handleIspChange}
                            placeholder="SELECT"
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                            value={searchParams.fromDate}
                            onChange={handleFromDateChange}
                            defaultValue={getFirstDayOfMonth()}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                            value={searchParams.toDate}
                            onChange={handleToDateChange}
                            defaultValue={getCurrentDate()}
                          />
                        </Grid>
                      </Grid>

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
                            onClick={handleCancelClick}
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
                    </>
                  )}
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Table section */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={10} lg={12} pr={4} pl={2} mb={2}>
            {showStatus && (
              <StatusModel width="100%" status={status} title={title} />
            )}
          </Grid>
        </Grid>

      
      {showtable &&
      (<Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 300px)",
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
                    { id: "ISPName", label: "ISP" },
                    { id: "ISPCode", label: "ISP CODE" },
                    { id: "RetailerName", label: "STORE" },
                    { id: "RetailerCode", label: "STORE CODE" },
                    { id: "LastSuccessfulAuditDate", label: "AUDIT DATE" },
                    { id: "TSIName", label: "TSI" },
                    { id: "TsiAuditDate", label: "TSI AUDIT DATE" },
                    { id: "LastSuccessfulAuditScore", label: "AUDIT SCORE" }
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
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                            ) : (
                              <ArrowDownwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                            )
                          ) : (
                            <Grid container direction="column" alignItems="center" sx={{ height: 16, width: 16 }}>
                              <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                              <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, index) => (
                    <TableRowSkeleton key={index} columns={8} />
                  ))
                ) : reportData.dataList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography>No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.dataList.map((row) => (
                    <TableRow key={row.Sno}>
                      <TableCell sx={{ ...rowstyle }}>{row.ISPName}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.ISPCode}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.RetailerName}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.RetailerCode}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.LastSuccessfulAuditDate}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.TSIName}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.TsiAuditDate || 'null'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.LastSuccessfulAuditScore}</TableCell>
                    </TableRow>
                  ))
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
                position: "sticky",
                bottom: 0,
                zIndex: 1100,
                backgroundColor: LIGHT_GRAY2,
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
                    {reportData.totalRecords} /{" "}
                    {Math.ceil(reportData.totalRecords / rowsPerPage)} PAGES
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
                  {[1,2,3,4].map((value) => (
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
                          color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
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
                    color: page === 0 ? "grey" : PRIMARY_BLUE2,
                  }}
                  onClick={() => setPage(0)}
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
                    page >= Math.ceil(reportData.totalRecords / rowsPerPage) - 1
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
                    color: page === Math.ceil(reportData.totalRecords / rowsPerPage) - 1 ? "grey" : PRIMARY_BLUE2,
                  }}
                  variant="body2"
                  onClick={() => setPage(Math.ceil(reportData.totalRecords / rowsPerPage) - 1)}
                >
                  JUMP TO LAST
                </Typography>
                <input
                  type="number"
                  placeholder="Jump to page"
                  min={1}
                  max={Math.ceil(reportData.totalRecords / rowsPerPage)}
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
                          newPage < Math.ceil(reportData.totalRecords / rowsPerPage)
                        ) {
                          handleChangePage(null, newPage);
                        }
                      }}
                    />
                  </Grid>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>)}

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

export default DemoAuditReport;
