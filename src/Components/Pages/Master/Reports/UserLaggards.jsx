import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
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
import { BindEntityList, GetUserLaggardReport } from "../../../Api/Api";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const statusArray = [
  { value: -1, label: "All Records" },
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];
const UserLaggards = () => {
  const [activeTab, setActiveTab] = React.useState("user-laggards"); 
  const [isLoading, setLoading] = useState(false);
  const [bindEntityList, setBindEntityList] = useState([]);
  const [userLaggardReport, setUserLaggardReport] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [searchParams, setSearchParams] = useState({
    salesChannelID: 0,
    status: -1,
    orgHierarchyId: 0,
    pageSize: 10,
    pageIndex: 1
  });

  const tabs = [
    { label: "User Tracking", value: "user-tracking" },
    { label: "Last Login", value: "last-login" },
    { label: "User Laggards", value: "user-laggards" },

    {
      label: "Org Hierarchy Mapping Report",
      value: "org-hierarchy-mapping-report",
    },
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
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setSearchParams(prev => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 1
    }));
    setCurrentPage(1);
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

    const sortedData = [...userLaggardReport].sort((a, b) => {
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      const aValue = a[columnName]?.toString().toLowerCase() || '';
      const bValue = b[columnName]?.toString().toLowerCase() || '';

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setUserLaggardReport(sortedData);
  };

  const handleSearchClick = () => {
    const searchValues = {
      saleType: document.querySelector('[name="saleType"]')?.value || "",
      region: document.querySelector('[name="region"]')?.value || "",
      state: document.querySelector('[name="state"]')?.value || "",
      fromDate: document.querySelector('[name="fromDate"]')?.value || "",
      toDate: document.querySelector('[name="toDate"]')?.value || "",
      serialType: document.querySelector('[name="serialType"]')?.value || "",
    };
    handleSearch(searchValues);
  };
  const handleSearchChange = (field, value, newvalue) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };
  const handlePostBindEntityList = async () => {
    let body = {
      saleChannelID: 0,
      countryID: 1,
      stateid: 105,
    };
    try {
      const response = await BindEntityList(body);

      if (response.statusCode == 200) {
        setBindEntityList(response.getBindEntityList);
      }
    } catch (error) {
      console.error("error fetching data");
    }
  };

  const handleReset = async () => {
    const resetParams = {
      salesChannelID: 0,
      countryID: 1,
      stateid: 105,
      status: -1,
    };

    setSearchParams(resetParams);
    setSortConfig({ key: null, direction: null });
  };

  const handleSearch = () => {
    setLoading(true);
    const handlePostGetUserLaggardReport = async () => {
      let body = {
        ...searchParams,
        pageIndex: currentPage,
      };

      try {
        const response = await GetUserLaggardReport(body);
        if (response.statusCode == 200) {
          setUserLaggardReport(response.reportList);
          setTotalRecords(response.totalRecords);
        }
      } catch (error) {
        console.error("error fetching data");
      }
      setLoading(false);
    };
    handlePostGetUserLaggardReport();
  };

  const handleExportToExcel = async () => {
    setIsDownloadLoading(true);
    let body2 = {
      ...searchParams,
      pageIndex: -1,
    };
    try {
      const response = await GetUserLaggardReport(body2);

      if (response.statusCode == 200) {
        window.location.href = response.reportLink;
      }
    } catch (error) {
      console.error("error Downloading Excel");
    }
    setIsDownloadLoading(false);
  };

  const handleJumpToFirst = () => {
    setCurrentPage(1);
    setSearchParams(prev => ({ ...prev, pageIndex: 1 }));
    handleSearch();
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / searchParams.pageSize);
    setCurrentPage(lastPage);
    setSearchParams(prev => ({ ...prev, pageIndex: lastPage }));
    handleSearch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSearchParams(prev => ({ ...prev, pageIndex: newPage }));
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value);
    const maxPages = Math.ceil(totalRecords / searchParams.pageSize);
    
    if (value && value > 0 && value <= maxPages) {
      setCurrentPage(value);
      setSearchParams(prev => ({ ...prev, pageIndex: value }));
      handleSearch();
    }
  };

  useEffect(() => {
    handlePostBindEntityList();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchParams, currentPage]);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pl: { xs: 1, sm: 1 },
          pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
        }}
      >
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
            <BreadcrumbsHeader pageTitle="User Reports" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

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
                  title="Stock Adjustment   "
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ND
                      </Typography>
                      <NuralAutocomplete
                        label="ND"
                        options={bindEntityList}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) =>
                          option.salesChannelName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.salesChannelID === value?.salesChannelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "salesChannelID",
                            newValue?.salesChannelID || 0
                          );
                        }}
                        value={
                          bindEntityList.find(
                            (option) =>
                              option.salesChannelID ===
                              searchParams.salesChannelID
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
                        STATUS
                      </Typography>
                      <NuralAutocomplete
                        label="Status"
                        options={statusArray}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("status", newValue?.value || 0);
                        }}
                        value={
                          statusArray.find(
                            (option) => option.value === searchParams.status
                          ) || null
                        }
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
                        onClick={handleSearch}
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

        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
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
                    colSpan={9}
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
                    { id: "parent", label: "PARENT" },
                    { id: "channelType", label: "CHANNEL TYPE" },
                    { id: "channel", label: "CHANNEL" },
                    { id: "channelCode", label: "CHANNEL CODE" },
                    { id: "transactionType", label: "TRANSACTION TYPE" },
                    { id: "lastLogin", label: "LAST LOGIN" },
                    { id: "lastTransaction", label: "LAST TRANSACTION" },
                    { id: "ageingInDays", label: "AGEING IN DAYS" },
                    { id: "status", label: "STATUS" },
                  ].map(({ id, label }) => (
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
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <TableRowSkeleton key={index} row={10} columns={10} />
                    ))
                  : userLaggardReport.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.parentSalesChannelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesChannelTypeName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesChannelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesChannelCode}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.transactionType}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.lastLoginOn}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.lastTransactionCreationDate}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.agingSlabText}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.status}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            <Grid
              container
              sx={{
                p: 2,
                alignItems: "center",
                justifyContent: "space-between",
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
                    {totalRecords} / {Math.ceil(totalRecords / searchParams.pageSize)} PAGES
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
                        onClick={() =>
                          handleChangeRowsPerPage({ target: { value } })
                        }
                        sx={{
                          minWidth: "25px",
                          height: "24px",
                          padding: "4px",
                          borderRadius: "50%",
                          backgroundColor:
                            searchParams.pageSize === value
                              ? PRIMARY_BLUE2
                              : "transparent",
                          color: searchParams.pageSize === value ? "#fff" : PRIMARY_BLUE2,
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
                  }}
                  onClick={handleJumpToFirst}
                  style={{ cursor: "pointer" }}
                >
                  JUMP TO FIRST
                </Typography>
                <IconButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  PAGE {currentPage}
                </Typography>

                <IconButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage >= Math.ceil(totalRecords / searchParams.pageSize)
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
                  }}
                  onClick={handleJumpToLast}
                  style={{ cursor: "pointer" }}
                >
                  JUMP TO LAST
                </Typography>
                <input
                  type="number"
                  placeholder="Jump to page"
                  min={1}
                  max={Math.ceil(totalRecords / searchParams.pageSize)}
                  onChange={handlePageInputChange}
                  style={{
                    width: "100px",
                    height: "24px",
                    padding: "0 8px",
                    borderRadius: "8px",
                    border: `1px solid ${PRIMARY_BLUE2}`,
                  }}
                />
              </Grid>
            </Grid>
          </TableContainer>
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
              downloadExcel={handleExportToExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default UserLaggards;
