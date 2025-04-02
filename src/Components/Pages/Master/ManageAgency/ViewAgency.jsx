import {
  Grid,
  Typography,
  Button,
  Switch,
  TableContainer,
  Table,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  MEDIUM_BLUE,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import { Search, FileDownload, Edit } from "@mui/icons-material";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { GetISPAgencyList } from "../../../Api/Api";
import { LoadingSkeleton } from "../../../Common/SkeletonComponents";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import { useDispatch } from "react-redux";
import { SET_EDIT_AGENCY_DATA } from "../../../Redux/actionTypes";
import { setEditAgencyData } from "../../../Redux/action";
import { FormSkeleton } from "../../../Common/Skeletons";

const SKELETON_ROWS = 10;


const tableHeaderStyle = {
  color: PRIMARY_BLUE2,
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  padding: "8px 16px",
  textAlign: "left",
  borderBottom: "none",
};

const rowstyle = {
  color: PRIMARY_BLUE2,
  fontFamily: "Manrope",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16.39px",
  letterSpacing: "0%",
  padding: "8px 16px",
  borderBottom: "none",
};

const tableColumns = [
  { id: "agencyName", label: "AGENCY NAME", sortable: true },
  { id: "agencyCode", label: "AGENCY CODE", sortable: true },
  { id: "contactPerson", label: "CONTACT PERSON", sortable: true },
  { id: "mobileNo", label: "MOBILE NO", sortable: true },
  { id: "emailID", label: "EMAIL", sortable: true },
  { id: "loginName", label: "USERNAME", sortable: true },
  { id: "password", label: "PASSWORD", sortable: true },
  { id: "statusText", label: "STATUS", sortable: false },
  { id: "edit", label: "EDIT", sortable: false },
];

const tabs = [
  { label: "Add Agency", value: "add-agancy" },
  { label: "Search", value: "search-agancy" },
];

const ViewAgency = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("search-agancy");
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [searchData, setSearchData] = React.useState({
    "UserName": "",
    "Email": "",
    "AgencyCode": "",
    "AgencyName": "",
    "ContactPerson": "",
    "MobileNumber": "",
    "Status": 2,
    "DisplayFor": 0,
    "AgencyId": 0,
    "pageIndex": 1,
    "pageSize": 10
  });

  const [searchDropdownData, setSearchDropdownData] = React.useState([]);

  const [totalRecords, setTotalRecords] = React.useState(0);

  // Add loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredRows].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredRows(sortedData);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    setSearchData(prev => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1
    }));
  };

  const handlePageChange = (newPage) => {
    // Ensure page is within valid bounds
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    const validPage = Math.max(1, Math.min(newPage, maxPage));

    setPage(validPage);
    setSearchData(prev => ({
      ...prev,
      pageIndex: validPage
    }));
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    handlePageChange(maxPage);
  };

  const handlePrevPage = () => {
    handlePageChange(page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  const fetchData = async (isSearching = false) => {
    try {
      setIsLoading(true);
      // Only reset page if we're performing a new search
      if (isSearching) {
        setPage(1);
        setSearchData(prev => ({
          ...prev,
          pageIndex: 1
        }));
      }

      const body = {
        ...searchData,
        pageIndex: isSearching ? 1 : searchData.pageIndex,
        pageSize: searchData.pageSize
      }
      console.log("body", body);
      const response = await GetISPAgencyList(body);
      if (response.statusCode === "200") {
        setFilteredRows(response.ispAgencyMasterList);
        setTotalRecords(response.totalRecords);
      } else if (response.statusCode === "404") {
        // Handle no results case
        setFilteredRows([]);
        setTotalRecords(0);
        // Optionally reset to page 1 if current page has no results
        if (searchData.pageIndex > 1) {
          setPage(1);
          setSearchData(prev => ({
            ...prev,
            pageIndex: 1
          }));
        }
      } else {
        throw new Error(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fatchCancelData = async () => {
    try {
      setIsLoading(true);
      const body = {
        "UserName": "",
        "Email": "",
        "AgencyCode": "",
        "AgencyName": "",
        "ContactPerson": "",
        "MobileNumber": "",
        "Status": 2,
        "DisplayFor": 0,
        "AgencyId": 0,
        "pageIndex": 1,
        "pageSize": 10
      }
      const response = await GetISPAgencyList(body);
      if (response.statusCode == "200") {
        setSearchDropdownData(response.ispAgencyMasterList);
        setFilteredRows(response.ispAgencyMasterList);
        setTotalRecords(response.totalRecords);
        setPage(1);
        setSearchData(prev => ({
          ...prev,
          ...body
        }));
      } else {
        throw new Error(response.statusMessage);
      }
    } finally {
      setIsLoading(true);
    }
  }

  const fetchDropdownData = async () => {
    try {
      setIsDropdownLoading(true);
      const body = {
        "UserName": "",
        "Email": "",
        "AgencyCode": "",
        "AgencyName": "",
        "ContactPerson": "",
        "MobileNumber": "",
        "Status": 1,
        "DisplayFor": 2,
      }

      const response = await GetISPAgencyList(body);
      if (response.statusCode == "200") {
        setSearchDropdownData(response.ispAgencyMasterList);
      } else {
        throw new Error(response.statusMessage);
      }
    }
    catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setIsDropdownLoading(false);
    }
  };

  const handleSearchChange = (field, value, newValue) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchData(false);
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleEdit = (row) => {
    console.log("row", row);

    dispatch(setEditAgencyData(row));
    navigate(`/add-agancy`);
  }
  return (
    <>
      <Grid container spacing={0}>
        {" "}
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
          <Grid item xs={12} mt={3} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Agency" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Contact Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2} pr={2}>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      AGENCY NAME
                    </Typography>
                    {isDropdownLoading ? (
                      <p>Loading...</p>
                      // <LoadingSkeleton height={40} />
                    ) : (
                      <NuralAutocomplete
                        label="AGENCY NAME"
                        options={searchDropdownData}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) =>
                          option.agencyName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.agencyId === value?.agencyId
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "AgencyId",
                            newValue?.agencyId || 0,
                            newValue
                          );
                        }}
                        value={
                          searchDropdownData.find(
                            (option) =>
                              option.agencyId === searchData.AgencyId
                          ) || 0
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      AGENCY CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="AGENCY CODE"
                      backgroundColor={LIGHT_BLUE}
                      value={searchData.AgencyCode}
                      onChange={(e) => handleSearchChange("AgencyCode", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      MOBILE NO.
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="MOBILE NO."
                      backgroundColor={LIGHT_BLUE}
                      value={searchData.MobileNumber}
                      onChange={(e) => handleSearchChange("MobileNumber", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      USERNAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="USERNAME"
                      backgroundColor={LIGHT_BLUE}
                      value={searchData.UserName}
                      onChange={(e) => handleSearchChange("UserName", e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} mt={1} alignItems="center">
                  {/* First button - 20% width */}
                  <Grid item xs={12} sm={2} md={1} lg={1}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      height="36px"
                      color={PRIMARY_BLUE2}
                      borderColor={PRIMARY_BLUE2}
                      onClick={fatchCancelData}
                      width="100%"
                    />
                  </Grid>

                  {/* Second button - 40% width */}
                  <Grid item xs={12} sm={10} md={11} lg={11} pr={1.5}>
                    <NuralTextButton
                      icon={"./Icons/searchIcon.svg"}
                      iconPosition="right"
                      height="36px"
                      backgroundColor={PRIMARY_BLUE2}
                      color="#fff"
                      width="100%"
                      fontSize="12px"
                      onClick={() => fetchData(true)}
                    >
                      SEARCH
                    </NuralTextButton>
                  </Grid>

                  {/* Third button - 40% width */}
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2,md:0 },mt:2,} }>
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
                    colSpan={15}
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
                      top: "49px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                    </Grid>
                  </TableCell>
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      onClick={() => column.sortable && handleSort(column.id)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: column.sortable ? "pointer" : "default",
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        {column.sortable && (
                          <Grid
                            item
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {sortConfig.key === column.id ? (
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
                {isLoading ? (
                  // <p>loDUBG</p>
                  Array(SKELETON_ROWS)
                    .fill(0)
                    .map((_, index) => (
                      <TableRowSkeleton key={index} columns={10} />
                    ))
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          ...rowstyle,
                          color: PRIMARY_BLUE2,
                          fontWeight: 600,
                        }}
                      >
                        {(searchData.pageIndex - 1) * searchData.pageSize + index + 1}
                      </TableCell>
                      {tableColumns.map((column) => (
                        <TableCell key={column.id} sx={{ ...rowstyle }}>
                          {column.id === "status" ? (
                            <Switch size="small" checked={row[column.id]} />
                          ) : column.id === "edit" ? (
                            <Edit
                              onClick={() => handleEdit(row)}
                              sx={{ color: DARK_PURPLE, cursor: "pointer" }}
                              fontSize="small"
                            />
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}

            <Grid
              container
              sx={{
                p: 2,
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                bottom: 0,
                backgroundColor: LIGHT_GRAY2,
                borderTop: `1px solid ${PRIMARY_LIGHT_GRAY}`,
                zIndex: 1200,
                boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.05)",
                minHeight: "40px",
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
                    {totalRecords} /{" "}
                    {Math.ceil(totalRecords / searchData.pageSize)} PAGES
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

              <Grid item sx={{ display: "flex", alignItems: "center", gap: 2, color: PRIMARY_BLUE2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "10.93px",
                    letterSpacing: "4%",
                    textAlign: "center",
                    cursor: "pointer"
                  }}
                  onClick={handleFirstPage}
                >
                  JUMP TO FIRST
                </Typography>

                <IconButton
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
                  PAGE {page}
                </Typography>

                <IconButton
                  onClick={handleNextPage}
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
                    cursor: "pointer"
                  }}
                  variant="body2"
                  onClick={handleLastPage}
                >
                  JUMP TO LAST
                </Typography>

                <input
                  type="number"
                  placeholder="Jump to page"
                  min={1}
                  max={Math.ceil(totalRecords / searchData.pageSize)}
                  onChange={(e) => {
                    // Just store the value, don't trigger page change
                    const value = e.target.value;
                    e.target.dataset.pageValue = value;
                  }}
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
                  sx={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling;
                    const pageValue = parseInt(input.value, 10);
                    if (
                      pageValue >= 1 &&
                      pageValue <= Math.ceil(totalRecords / searchData.pageSize)
                    ) {
                      handlePageChange(pageValue);
                      // input.value = ''; 
                    }
                  }}
                >
                  <img src="./Icons/footerSearch.svg" alt="arrow" />
                </Grid>
              </Grid>
            </Grid>

          </TableContainer>
        </Grid>
        </Grid>

        
      </Grid>
    </>
  );
};

export default ViewAgency;
