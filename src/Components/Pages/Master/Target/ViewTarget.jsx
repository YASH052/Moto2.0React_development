import { Grid, Typography, Button, Link, FormHelperText } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
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
import {
  jumpToPageStyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";
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
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";

// The target for dropdown will be mandatory without selection of target for don't allow user to search.

// Add formatNumber utility function
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";

  const absNum = Math.abs(Number(num));

  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (absNum >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const SKELETON_ROWS = 10;
const ViewTarget = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [activeTab, setActiveTab] = React.useState("view-target");
  const [targetData, setTargetData] = useState([]);
  const [targetForDropdown, setTargetForDropdown] = useState([]);
  const [targetName, setTargetNameList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
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
  console.log(searchParams, "searchParams");
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
    { value: 1, label: "SKU" },
    { value: 2, label: "BRAND" },
    { value: 4, label: "PRODUCT CATEGORY" },
    { value: 3, label: "PRODUCT  SUBCATEGORY" },

    { value: 5, label: "CONSOLIDATED" },
  ];

  // console.log(autocompleteArray);

  const handleChangePage = async (event, newPage) => {
    // Prevent unnecessary API calls if the page is the same
    if (page === newPage) return;

    // Update page state and searchParams together
    const updatedParams = {
      ...searchParams,
      pageIndex: newPage + 1, // API expects 1-based index
    };

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200 && res.targetList.length > 0) {
        setPage(newPage);
        setSearchParams(updatedParams);
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      } else {
        // If no data on requested page, reset to first page
        const firstPageParams = {
          ...searchParams,
          pageIndex: 1,
        };
        setPage(0);
        setSearchParams(firstPageParams);
        let firstPageRes = await GetTargetInfoV2(firstPageParams);
        if (firstPageRes.statusCode == 200) {
          setTargetData(firstPageRes.targetList);
          setTotalRecords(firstPageRes.totalRecords);
        }
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

    const currentStartIndex = (searchParams.pageIndex - 1) * searchParams.pageSize;
    const newPageIndex = Math.floor(currentStartIndex / value) + 1;

    const updatedParams = {
      ...searchParams,
      pageSize: value,
      pageIndex: newPageIndex,
    };

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200 && res.targetList.length > 0) {
        setRowsPerPage(value);
        setPage(newPageIndex - 1);
        setSearchParams(updatedParams);
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      } else {
        // If no data on requested page, reset to first page with new page size
        const firstPageParams = {
          ...searchParams,
          pageSize: value,
          pageIndex: 1,
        };
        setRowsPerPage(value);
        setPage(0);
        setSearchParams(firstPageParams);
        let firstPageRes = await GetTargetInfoV2(firstPageParams);
        if (firstPageRes.statusCode == 200) {
          setTargetData(firstPageRes.targetList);
          setTotalRecords(firstPageRes.totalRecords);
        }
      }
    } catch (error) {
      console.log(error, "error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const [targetForError, setTargetForError] = useState(false);

  const handleSearchClick = async () => {
    // Validate Target For selection
    if (!searchParams.targetUserTypeID || searchParams.targetUserTypeID === 0) {
      setTargetForError(true);
      return;
    }
    
    setTargetForError(false);
    setShowStatus(false);
    setIsLoading(true);
    
    // Reset pagination to first page with 10 rows
    setPage(0);
    setRowsPerPage(10);
    
    // Update search params with reset pagination
    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
      pageSize: 10
    };
    setSearchParams(updatedParams);

    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      } else {
        setTargetData([]);
        setTotalRecords(0);
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      console.log(error, "error fetching data");
      setTargetData([]);
      setTotalRecords(0);
      setShowStatus(true);
      setStatus("error");
      setTitle("Error fetching data");
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
  const handleReset = async () => {
    setTargetForError(false);
    setShowStatus(false);
    setStatus(null);
    setTitle(null);

    // Reset search params to initial state
    const initialParams = {
      callType: null,
      targetID: 0,
      targetUserTypeID: 13,
      targetForID: 0,
      targetName: "",
      targetCategoryID: 0,
      selectionMode: 1,
      pageIndex: 1,
      pageSize: 10,
    };

    setSearchParams(initialParams);
    setPage(0); // Reset pagination to first page
    setRowsPerPage(10); // Reset rows per page to default

    // Load initial data
    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(initialParams);
      if (res.statusCode == 200) {
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      } else {
        setTargetData([]);
        setTotalRecords(0);
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      console.log(error, "error fetching data");
      setTargetData([]);
      setTotalRecords(0);
      setShowStatus(true);
      setStatus("error");
      setTitle("Error loading data");
    } finally {
      setIsLoading(false);
    }
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
    handleSearchClick(searchParams);
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
    if (pageNumber <= 0) return;

    const maxPages = Math.ceil(totalRecords / searchParams.pageSize);
    if (pageNumber > maxPages) pageNumber = maxPages;

    const updatedParams = {
      ...searchParams,
      pageIndex: pageNumber,
    };

    setIsLoading(true);
    try {
      let res = await GetTargetInfoV2(updatedParams);
      if (res.statusCode == 200 && res.targetList.length > 0) {
        setPage(pageNumber - 1);
        setSearchParams(updatedParams);
        setTargetData(res.targetList);
        setTotalRecords(res.totalRecords);
      } else {
        // If no data on requested page, reset to first page
        const firstPageParams = {
          ...searchParams,
          pageIndex: 1,
        };
        setPage(0);
        setSearchParams(firstPageParams);
        let firstPageRes = await GetTargetInfoV2(firstPageParams);
        if (firstPageRes.statusCode == 200) {
          setTargetData(firstPageRes.targetList);
          setTotalRecords(firstPageRes.totalRecords);
        }
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

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState(null);

  // Update sorting function to handle three states
  const handleSort = (property) => {
    let newOrder;
    if (orderBy !== property) {
      // First click on a new column - start with descending
      newOrder = "desc";
    } else {
      // Cycling through states on the same column
      if (order === "desc") {
        newOrder = "asc";
      } else if (order === "asc") {
        newOrder = null;
      } else {
        newOrder = "desc";
      }
    }

    setOrder(newOrder);
    setOrderBy(newOrder === null ? "" : property);

    let sortedData;

    sortedData = [...targetData].sort((a, b) => {
      const aValue = a[property] || "";
      const bValue = b[property] || "";

      if (property === "totalTarget") {
        return newOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return newOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

    setTargetData(sortedData);
  };

  // Create column definitions
  const columns = [
    { id: "targetName", label: "NAME", minWidth: "100px" },
    { id: "targetForName", label: "TARGET FOR", minWidth: "100px" },
    { id: "targetFrom", label: "TARGET FROM", minWidth: "100px" },
    { id: "targetTo", label: "TARGET TO", minWidth: "100px" },
    { id: "targetCategory", label: "TARGET CATEGORY", minWidth: "100px" },
    { id: "targetType", label: "TARGET TYPE", minWidth: "100px" },
    { id: "targetBaseOn", label: "TARGET BASED ON", minWidth: "100px" },
    { id: "totalTarget", label: "TARGET", minWidth: "100px" },
  ];

  useEffect(() => {}, []);

  // Add new states and ref
  const detailTableRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetailTable, setShowDetailTable] = useState(false);

  // Add handler for view click
  const handleViewClick = (row) => {
    setSelectedRow(row);
    setShowDetailTable(true);
    setTimeout(() => {
      detailTableRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Add state for accordion control
  const [expanded, setExpanded] = useState(true);

  // Add handler for accordion change
  const handleAccordionChange = () => {
    setExpanded(!expanded);
    if (expanded) {
      // If closing accordion, also hide detail table
      setShowDetailTable(false);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pl: { xs: 1, sm: 1, md: 0 },
        pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
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
        <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
          <BreadcrumbsHeader pageTitle="Target" />
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
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Search"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                expanded={expanded}
                onChange={handleAccordionChange}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TARGET FOR <Required />
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
                      error={targetForError}
                      onChange={(event, newValue) => {
                        setTargetForError(false);
                        handleSearchChange(
                          "targetUserTypeID",
                          newValue?.entityTypeID
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
                    {targetForError && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "10px" }}>
                        Please select Target For
                      </FormHelperText>
                    )}
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
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "targetCategoryID",
                          newValue?.value || null
                        );
                      }}
                      value={
                        autocompleteArray.find(
                          (option) =>
                            option.value === searchParams.targetCategoryID
                        ) || null
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

      {/* Add condition to show tables only when accordion is expanded */}
      {expanded && (
        <>
          {showStatus && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <StatusModel
                width="100%"
                status={status}
                title={title}
                onClose={() => setShowStatus(false)}
              />
            </Grid>
          )}

          {!showStatus && (
            <>
              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: -4 }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    color: PRIMARY_BLUE2,
                    maxHeight: "calc(120vh - 180px)",
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

                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            sx={{
                              ...tableHeaderStyle,
                              position: "sticky",
                              top: "45px",
                              backgroundColor: LIGHT_GRAY2,
                              zIndex: 100,
                              padding: "8px 16px",
                              minWidth: column.minWidth,
                              cursor: "pointer",
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
                            onClick={() => handleSort(column.id)}
                          >
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>{column.label}</Grid>
                              <Grid item>
                                {orderBy === column.id ? (
                                  order === "asc" ? (
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
                                    direction="row"
                                    alignItems="center"
                                    sx={{ ml: 1 }}
                                  >
                                    <ArrowUpwardIcon
                                      sx={{
                                        fontSize: 12,
                                        color: "grey.400",
                                        marginBottom: "-4px",
                                      }}
                                    />
                                    <ArrowDownwardIcon
                                      sx={{
                                        fontSize: 12,
                                        color: "grey.400",
                                      }}
                                    />
                                  </Grid>
                                )}
                              </Grid>
                            </Grid>
                          </TableCell>
                        ))}

                        {/* View and Edit columns */}
                        <TableCell
                          sx={{
                            ...tableHeaderStyle,
                            position: "sticky",
                            top: "45px",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 100,
                            padding: "8px 16px",
                            minWidth: "60px",
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>VIEW</Grid>
                          </Grid>
                        </TableCell>
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
                              {(searchParams.pageIndex - 1) *
                                searchParams.pageSize +
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
                              {row.targetName || "Column 1"}
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
                              {formatNumber(row.totalTarget) || "Column 1"}
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
                                cursor: "pointer",
                              }}
                              onClick={() => handleViewClick(row)}
                            >
                              View &nbsp;
                              <VisibilityIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
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
                          {Math.ceil(totalRecords / searchParams.pageSize)}{" "}
                          PAGES
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
                        style={jumpToPageStyle}
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

              {showDetailTable && (
                <Grid
                  item
                  xs={12}
                  sx={{ p: { xs: 1, sm: 2 } }}
                  ref={detailTableRef}
                >
                  <TableContainer
                    component={Paper}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      color: PRIMARY_BLUE2,
                      overflow: "auto",
                      position: "relative",
                      mt: 2,
                      "& .MuiTable-root": {
                        borderCollapse: "separate",
                        borderSpacing: 0,
                      },
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            sx={{
                              backgroundColor: LIGHT_GRAY2,
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
                                color: PRIMARY_BLUE2,
                                p: 1,
                              }}
                            >
                              Target Details
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              width: "200px",
                              padding: "8px 16px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            No Data Available
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </>
          )}
        </>
      )}

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
