import { Grid, Typography, Button, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
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
import { useNavigate } from "react-router-dom";
import {
  GetTargetInfoV2,
  GetTargetForDropdown,
  GetTargetNameList,
} from "../../../Api/Api";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const SKELETON_ROWS = 10;

const ViewTarget = () => {
  const [activeTab, setActiveTab] = React.useState("view-target");
  const [targetData, setTargetData] = useState([]);
  const [targetForDropdown, setTargetForDropdown] = useState([]);
  const [targetName, setTargetNameList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    targetID: 0,
    targetUserTypeID: 13,
    targetForID: 0,
    targetName: "",
    targetCategoryID: 0,
    selectionMode: 1,
    pageIndex: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const tabs = [
    { label: "Add Target", value: "target" },
    { label: "Search", value: "view-target" },
  ];
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

  // Update these state variables for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const autocompleteArray = [
    { id: 1, label: "SKU", value: "SKU" },
    { id: 2, label: "Brand", value: "Brand" },
    {
      id: 3,
      label: "Product Category (Subcategory)",
      value: "ProductCategory",
    },
    { id: 4, label: "Product (Category)", value: "Product" },
    { id: 5, label: "Consolidated", value: "Consolidated" },
  ];

  console.log(autocompleteArray);

  const handleChangePage = async (event, newPage) => {
    // Prevent unnecessary API calls if the page is the same
    if (page === newPage) return;

    // Update page state and searchParams together
    setPage(newPage);
    const updatedParams = {
      ...searchParams,
      pageIndex: newPage + 1, // API expects 1-based index
    };
    setSearchParams(updatedParams);

    // Make API call with the updated params directly
    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams); // Use updatedParams directly
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (value) => {
    // Prevent unnecessary API calls if the page size is the same
    if (searchParams.pageSize === value) return;

    // Update states
    setRowsPerPage(value);
    setPage(0);

    // Create updated params
    const updatedParams = {
      ...searchParams,
      pageIndex: 1, // Reset to first page
      pageSize: value,
    };

    // Update search params and make API call directly
    setSearchParams(updatedParams);
    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams); // Use updatedParams directly
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = async () => {
    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(searchParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    setIsDownloadLoading(true);
    let body = {
      ...searchParams,
      selectionMode: 0,
    };
    try {
      let res = await GetTargetInfoV2(body);
      if (res.statusCode == 200) {
        window.location.href = res.filePathlink;
        console.log(res.filePathlink);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsDownloadLoading(false);
    }
  };
  const handleReset = () => {
    setSearchParams({
      targetID: 0,
      targetUserTypeID: 13,
      targetForID: 0,
      targetName: "",
      targetCategoryID: 0,
      selectionMode: 1,
      pageIndex: 1,
      pageSize: 10,
    });
  };

  const handleSearchChange = (field, value, newvalue) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const fetchGetTargetForDropdown = async () => {
    let body = {
      callType: 4,
    };
    try {
      const response = await GetTargetForDropdown(body);
      if (response.statusCode == 200) {
        setTargetForDropdown(response.targetForDropdownList);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const fetchGetTargetNameForDropdown = async () => {
    let body = {
      TargetUserTypeID: 0,
      targetID: 0,
      targetName: "",
      targetUserType: 0,
      targetStatus: 255 /* 0 = Expired, 1= Running,  255= All */,
    };
    try {
      const response = await GetTargetNameList(body);
      if (response.statusCode == 200) {
        setTargetNameList(response.targetNameList);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  useEffect(() => {
    fetchGetTargetForDropdown();
    fetchGetTargetNameForDropdown();
    handleSearchClick();
  }, []);

  // Update handleJumpToFirst
  const handleJumpToFirst = async () => {
    if (searchParams.pageIndex === 1) return;

    setPage(0);
    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
    };
    setSearchParams(updatedParams);

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleJumpToLast
  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / searchParams.pageSize);

    if (searchParams.pageIndex === lastPage) return;

    setPage(lastPage - 1);
    const updatedParams = {
      ...searchParams,
      pageIndex: lastPage,
    };
    setSearchParams(updatedParams);

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleJumpToPage
  const handleJumpToPage = async (pageNumber) => {
    if (
      pageNumber <= 0 ||
      pageNumber > Math.ceil(totalRecords / searchParams.pageSize) ||
      pageNumber === searchParams.pageIndex
    ) {
      return;
    }

    setPage(pageNumber - 1);
    const updatedParams = {
      ...searchParams,
      pageIndex: pageNumber,
    };
    setSearchParams(updatedParams);

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this state to track the input value
  const [jumpToPageInput, setJumpToPageInput] = useState("");

  // Add this handler function for the search icon click
  const handleSearchIconClick = () => {
    if (jumpToPageInput) {
      const pageNumber = parseInt(jumpToPageInput, 10);
      handleJumpToPage(pageNumber);
      setJumpToPageInput("");
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pl: { xs: 1, sm: 1 },
        pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Target" />
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
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TARGET FOR
                    </Typography>
                    <NuralAutocomplete
                      label="Target For"
                      options={targetForDropdown}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.entityType || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.entityTypeID === value?.entityTypeID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "targetUserTypeID",
                          newValue?.entityTypeID || null
                        );
                      }}
                      value={
                        targetForDropdown.find(
                          (option) =>
                            option.entityTypeID ===
                            searchParams.targetUserTypeID
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TARGET NAME
                    </Typography>
                    <NuralAutocomplete
                      label="Target Name"
                      options={targetName}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.targetName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.targetID === value?.targetID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "targetName",
                          newValue?.targetName || null
                        );
                      }}
                      value={
                        targetName.find(
                          (option) =>
                            option.targetName === searchParams.targetName
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TARGET CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      label="targetCategory"
                      options={autocompleteArray}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.value || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "targetCategoryID",
                          newValue?.id || null
                        );
                      }}
                      value={
                        autocompleteArray.find(
                          (option) =>
                            option.id === searchParams.targetCategoryID
                        ) || null
                      }
                    />
                  </Grid>
                </Grid>
                {/* <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={2}
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
                      FROM DATE
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.datefrom}
                      onChange={handleFromDateChange}
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
                      width="100%"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.dateTo}
                      onChange={handleToDateChange}
                      error={!!dateError}
                    />
                  </Grid>
                </Grid> */}
                {/* Second Row */}

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
                      onClick={handleSearchClick}
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

      {/* Add this after the NuralAccordion2 component */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(120vh - 180px)", // Adjusted to account for headers
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
                  colSpan={11}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
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
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    top: "45px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 100,
                    width: "50px",
                    padding: "8px 16px",
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
                  <Grid container alignItems="center">
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    top: "45px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 100,
                    padding: "8px 16px",
                    minWidth: "100px",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      borderBottom: "2px solid #e0e0e0",
                    },
                    "& .MuiGrid-container": {
                      justifyContent: "flex-start",
                    },
                  }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>NAME</Grid>
                  </Grid>
                </TableCell>
                {[
                  "TARGET FOR",
                  "TARGET FROM",
                  "TARGET TO",
                  "TARGET CATEGORY",
                  "TARGET TYPE",
                  "TARGET BASED ON",
                  "TARGET",
                  "VIEW",
                  "EDIT",
                ].map((header, index) => (
                  <TableCell
                    key={header}
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 100,
                      padding: "8px 16px",
                      minWidth:
                        header === "VIEW" || header === "EDIT"
                          ? "60px"
                          : "100px",
                      "& .MuiGrid-container": {
                        justifyContent: "flex-start",
                      },
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>{header}</Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array(SKELETON_ROWS)
                  .fill(0)
                  .map((_, index) => (
                    <TableRowSkeleton key={index} columns={11} />
                  ))
              ) : targetData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ color: PRIMARY_BLUE2, fontWeight: 500 }}
                    >
                      No Data Available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                targetData.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      fontSize: "10px",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        width: "50px",
                      }}
                    >
                      {(searchParams.pageIndex - 1) * searchParams.pageSize +
                        index +
                        1}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetForName || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetFor || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetFrom || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetTo || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetCategory || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetType || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetBaseOn || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.target || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                      }}
                    >
                      View &nbsp;
                      <VisibilityIcon
                        sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "60px",
                      }}
                    >
                      <IconButton size="small">
                        <EditIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                      </IconButton>
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
              p: 2,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: LIGHT_GRAY2, // Light blue-gray background
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
                  {Math.ceil(totalRecords / searchParams.pageSize)} PAGES
                </span>
              </Typography>
            </Grid>

            <Grid item>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "10px",
                      color: PRIMARY_BLUE2,
                      fontWeight: 600,
                    }}
                  >
                    SHOW :
                  </Typography>
                </Grid>
                {[10, 25, 50, 100].map((value) => (
                  <Grid item key={value}>
                    <Button
                      onClick={() => handleChangeRowsPerPage(value)}
                      sx={{
                        minWidth: "30px",
                        height: "24px",
                        padding: "4px 8px",
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
                gap: 1,
                outline: "none",
              }}
            >
              <Button
                onClick={handleJumpToFirst}
                disabled={searchParams.pageIndex === 1}
                sx={{
                  color: PRIMARY_BLUE2,
                  textTransform: "none",
                  fontSize: "10px",
                  fontWeight: 700,
                  ":focus": {
                    outline: "none",
                  },
                }}
              >
                JUMP TO FIRST
              </Button>

              <IconButton
                onClick={() => handleChangePage(null, page - 1)}
                disabled={searchParams.pageIndex === 1}
                sx={{
                  color: PRIMARY_BLUE2,
                  ":focus": {
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
                  color: PRIMARY_BLUE2,
                  ":focus": {
                    outline: "none",
                  },
                }}
              >
                PAGE {searchParams.pageIndex}
              </Typography>

              <IconButton
                onClick={() => handleChangePage(null, page + 1)}
                disabled={
                  searchParams.pageIndex >=
                  Math.ceil(totalRecords / searchParams.pageSize)
                }
                sx={{
                  color: PRIMARY_BLUE2,
                  ":focus": {
                    outline: "none",
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>

              <Button
                onClick={handleJumpToLast}
                disabled={
                  searchParams.pageIndex >=
                  Math.ceil(totalRecords / searchParams.pageSize)
                }
                sx={{
                  color: PRIMARY_BLUE2,
                  textTransform: "none",
                  fontSize: "10px",
                  fontWeight: 700,
                  ":focus": {
                    outline: "none",
                  },
                }}
              >
                JUMP TO LAST
              </Button>

              <input
                type="text"
                placeholder="JUMP TO PAGE"
                value={jumpToPageInput}
                onChange={(e) => setJumpToPageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const pageNumber = parseInt(e.target.value, 10);
                    handleJumpToPage(pageNumber);
                    setJumpToPageInput("");
                  }
                }}
                style={{
                  width: "100px",
                  height: "24px",
                  padding: "0 8px",
                  borderRadius: "4px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                  backgroundColor: "#F8F9FD",
                  fontSize: "10px",
                  outline: "none",
                  "&:focus": {
                    outline: "none",
                  },
                }}
              />
              <Grid mt={1}>
                <img
                  src="./Icons/footerSearch.svg"
                  style={{ cursor: "pointer" }}
                  alt="arrow"
                  onClick={handleSearchIconClick}
                />
              </Grid>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={5}
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
    </Grid>
  );
};

export default ViewTarget;
