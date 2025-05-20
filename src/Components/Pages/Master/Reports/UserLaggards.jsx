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
import { rowstyle, tableHeaderStyle, tablePaginationStyle } from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import { BindEntityList, GetUserLaggardReport } from "../../../Api/Api";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import StatusModel from "../../../Common/StatusModel";

const statusArray = [
  { value: -1, label: "All Records" },
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
];
const UserLaggards = () => {
  const [activeTab, setActiveTab] = React.useState("user-laggards");
  const [isLoading, setLoading] = useState(true);
  const [bindEntityList, setBindEntityList] = useState([]);
  const [userLaggardReport, setUserLaggardReport] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useState({
    orgHierarchyId: 0, // send default 0
    salesChannelID: 0,
    status: -1, /* -1= all records, 0= inactive, 1= active */
    pageIndex: 1,
    pageSize: 10
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tabs = [
    { label: "User Tracking", value: "user-tracking" },
    { label: "Last Login", value: "user-lastlogin" },
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


  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    // Update all states at once
    const newSearchParams = {
      ...searchParams,
      pageSize: newPageSize,
      pageIndex: 1
    };

    setSearchParams(newSearchParams);
    setRowsPerPage(newPageSize);
    setPage(1);
    setCurrentPage(1);

    // Use the new values directly in the API call
    let body = {
      ...newSearchParams
    };

    setLoading(true);
    GetUserLaggardReport(body)
      .then(response => {
        if (response.statusCode == 200) {
          setUserLaggardReport(response.reportList);
          setTotalRecords(response.totalRecords);
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
          setTimeout(() => {
            setStatus(null);
            setTitle("");
          });
        } else {
          setUserLaggardReport([]);
          setTotalRecords(0);
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
        }
      })
      .catch(error => {
        console.error("error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleSort = (columnId) => {
    let direction = "asc";
    let newKey = columnId;

    if (sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === columnId && sortConfig.direction === "desc") {
      // Reset sort if clicking the already descending sorted column
      newKey = null;
      direction = null;
    }

    setSortConfig({ key: newKey, direction });

    // If sorting is reset, revert to the original (or last fetched) order if available,
    // or simply return if you don't maintain an original order state.
    // For now, we'll just sort based on the new config. If newKey is null, data remains as is.
    if (!newKey) {
      // Optionally fetch the unsorted data again or revert to an initial state
      // handleSearch(); // Example: Refetch data which might be unsorted
      return; // Or just stop if no specific unsorted state is maintained
    }

    const dataKeyMap = {
      parent: "parentSalesChannelName",
      channelType: "salesChannelTypeName",
      channel: "salesChannelName",
      channelCode: "salesChannelCode",
      transactionType: "transactionType",
      lastLogin: "lastLoginOn",
      lastTransaction: "lastTransactionCreationDate",
      ageingInDays: "overDueDays",
      // status is not sortable
    };

    const dataKey = dataKeyMap[newKey];
    if (!dataKey) return; // Should not happen if called correctly

    const sortedData = [...userLaggardReport].sort((a, b) => {
      const aValue = a[dataKey];
      const bValue = b[dataKey];

      // Handle null/undefined values consistently
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === "asc" ? 1 : -1; // Nulls last in ascending
      if (bValue == null) return direction === "asc" ? -1 : 1; // Nulls last in ascending

      let compareResult = 0;

      // Type-specific comparisons
      if (newKey === "ageingInDays") {
        compareResult = Number(aValue) - Number(bValue);
      } else if (newKey === "lastLogin" || newKey === "lastTransaction") {
        // Assuming date strings are comparable or in a format Date can parse
        // Adjust parsing if necessary based on actual date format
        try {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          if (!isNaN(dateA) && !isNaN(dateB)) {
            compareResult = dateA - dateB;
          } else {
            // Fallback to string compare if dates are invalid
            compareResult = aValue.toString().localeCompare(bValue.toString());
          }
        } catch (e) {
          // Fallback if Date parsing fails
          compareResult = aValue.toString().localeCompare(bValue.toString());
        }
      } else {
        // Default string comparison (case-insensitive)
        compareResult = aValue
          .toString()
          .toLowerCase()
          .localeCompare(bValue.toString().toLowerCase());
      }

      return direction === "asc" ? compareResult : -compareResult;
    });

    setUserLaggardReport(sortedData);
  };


  const handleSearchChange = (field, value) => {
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
      orgHierarchyId: 0,
      salesChannelID: 0,
      status: -1,
      pageIndex: 1,
      pageSize: 10,
    };

    setSearchParams(resetParams);
    setSortConfig({ key: null, direction: null });
    handleSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    let body = {
      ...searchParams,
      pageIndex: searchParams.pageIndex,
      pageSize: searchParams.pageSize
    };
    try {
      const response = await GetUserLaggardReport(body);
      if (response.statusCode == 200) {
        setUserLaggardReport(response.reportList);
        setTotalRecords(response.totalRecords);
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
        setTimeout(() => {
          setStatus(null);
          setTitle("");
        });
      } else {
        setUserLaggardReport([]);
        setTotalRecords(0);
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      }
    } catch (error) {
      console.error("error fetching data");
    }
    setLoading(false);
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
    setPage(1);
    setCurrentPage(1);
    setSearchParams(prev => ({
      ...prev,
      pageIndex: 1
    }));
    handleSearch();
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage);
    setPage(lastPage);
    setCurrentPage(lastPage);
    setSearchParams(prev => ({
      ...prev,
      pageIndex: lastPage
    }));
    handleSearch();
  };

  const handlePageChange = (newPage) => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    const validPage = Math.max(1, Math.min(newPage, maxPage));
    setPage(validPage);
    setCurrentPage(validPage);
    setSearchParams(prev => ({
      ...prev,
      pageIndex: validPage
    }));
    handleSearch();
  };

  const handlePrevPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    if (page < maxPage) {
      handlePageChange(page + 1);
    }
  };

  useEffect(() => {
    handlePostBindEntityList();
    handleSearch();
  }, []);


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
                  title="User Laggards"
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

        {/* {status && title && (
          <StatusModel
            width="96%"
            margin="auto"
            status={status}
            title={title}
          // onClose={() => {
          //   setStatus(null);
          //   setTitle("");
          // }}
          />
        )} */}


        {/* { */}

        {/* // userLaggardReport.length > 0 && ( */}
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>


          <TableContainer
            component={Paper}
            size="small" stickyHeader
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 150px)",
              overflow: "auto",
            }}>
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
                  {[
                    { id: "index", label: "S.No" },
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
                      onClick={() => id !== "status" && handleSort(id)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: id !== "status" ? "pointer" : "default",
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{label}</Grid>
                        {id !== "status" && (
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
                        )}
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? (
                    Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton key={index} columns={10} />
                      ))
                  ) : userLaggardReport.length === 0 ? (
                    Array(1).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={10} align="center" sx={{ height: '48px' }}>
                          {index === 0 ? "No records found" : ""}
                        </TableCell>
                      </TableRow>
                    ))
                  )
                    : userLaggardReport.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ ...rowstyle }}>
                          {index + 1}
                        </TableCell>
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
                          {row.overDueDays}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.status}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            {/* Only show pagination if there's data */}
            {userLaggardReport.length > 0 && (
              <Grid container sx={{ ...tablePaginationStyle, mt: 1 }}>
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
                    <span
                      style={{
                        fontWeight: 700,
                        color: PRIMARY_BLUE2,
                      }}
                    >
                      {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
                            handleChangeRowsPerPage({
                              target: { value },
                            })
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
                                rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
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
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    sx={{
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
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
                    onClick={handleNextPage}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
                    sx={{
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
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
                    variant="body2"
                    onClick={handleJumpToLast}
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value)}
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
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  />
                  <Grid mt={1} sx={{ cursor: "pointer" }}>
                    <img
                      src="./Icons/footerSearch.svg"
                      alt="arrow"
                      onClick={() => handlePageChange(currentPage)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
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
              // views={""}
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
