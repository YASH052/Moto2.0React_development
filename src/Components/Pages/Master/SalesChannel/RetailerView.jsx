import { Grid, Typography, Button, Switch, Box } from "@mui/material";
import React, { useEffect } from "react";
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

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  BindEntityList,
  GetCityListForDropdown,
  getRetailer,
  GetRetailerListDrpdown,
  GetStateListForDropdown,
  RetailerStatusUpdate,
  SalesChannelListWithRetailer,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { setRetailerID } from "../../../Redux/action";
import { useDispatch } from "react-redux";
const RetailerView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("view-retailer");
  const [stateDropDownData, setStateDropDownData] = React.useState([]);
  const log = JSON.parse(localStorage.getItem("log"));
  const tabs = [
    { label: "Add Retailer", value: "add-retailer" },
    { label: "Search", value: "view-retailer" },
    { label: "Approve", value: "approveSaleschannel" },
  ];

  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    { label: "All", value: 2 },
    { label: "Active", value: 1 },
    { label: "InActive", value: 0 },
  ];

  // const leaveTypeOptions = [
  //   {
  //     leaveTypeID: 1,
  //     leaveTypeName: "Casual Leave",
  //     leaveTypeCode: "CL",
  //   },
  //   {
  //     leaveTypeID: 2,
  //     leaveTypeName: "Leave Without Pay",
  //     leaveTypeCode: "LWP",
  //   },
  //   {
  //     leaveTypeID: 3,
  //     leaveTypeName: "Paid Leave",
  //     leaveTypeCode: "PL",
  //   },
  //   {
  //     leaveTypeID: 4,
  //     leaveTypeName: "Sick Leave",
  //     leaveTypeCode: "SL",
  //   },
  // ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ndDropDownData, setNdDropDownData] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [showStatus, setShowStatus] = React.useState(false);
  const [salesChannelDropDownData, setSalesChannelDropDownData] =
    React.useState([]);

  const [retailerDropDownData, setRetailerDropDownData] = React.useState([]);
  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const initialSearchParams = {
    pageIndex: 1,
    pageSize: 10,
    retailerID: 0,
    retailerName: "",
    salesChannelID: 0,
    type: 0,
    salesmanName: "",
    salesmanID: 0,
    loggedSalesChannelID: 0,
    retailerCode: "",
    status: 2,
    retailerApproval: 1,
    displayMode: 0,
    stateID: 0,
    salesChannelCode: "",
    ndID: 0,
    countryID: 0,
    leaveTypeID: 0,
  };

  const [searchParams, setSearchParams] = React.useState(initialSearchParams);

  const [totalRecords, setTotalRecords] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const SKELETON_ROWS = 10; // Number of skeleton rows to show while loading

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 100,
    stringify: (option) => option.retailerCode + " " + option.retailerName,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchNdDropDownData(),
          fetchSalesChannelDropDownData(),
          fetchStateDropDownData(),
          fetchReailerDropDownData(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStateDropDownData = async () => {
    let body = {
      countryID: 0,
      regionID: 0,
      stateID: 0,
    };
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDropDownData(res.stateDropdownList);
      }
    } catch (error) {
      // alert("error");
    }
  };

  const fetchReailerDropDownData = async () => {
    let body = {
      retailerID: 0,
    };

    try {
      let res = await GetRetailerListDrpdown(body);
      if (res.statusCode == 200) {
        setRetailerDropDownData(res.retailerMasterList);
        console.log(res.retailerMasterList);
      } else {
        // alert("error");
      }
    } catch (error) {
      // alert("error");
    }
  };
  const fetchSalesChannelDropDownData = async () => {
    let body = {
      retailerID: 0,
    };

    try {
      let res = await BindEntityList(body);
      if (res.statusCode == 200) {
        setSalesChannelDropDownData(res.getBindEntityList);
      } else {
        // alert("error");
      }
    } catch (error) {
      // alert("error");
    }
  };

  const fetchNdDropDownData = async () => {
    let body = {
      salesChannelTypeID: 0,
      activeStatus: 255, //for all pass 255 otherwise selected status
      otherEntityTypeID: log.baseEntityTypeID, //Selected User baseentitytypeid
      getND: 1, //will pass only 1
      countryID: 0,
    };

    console.log(body);
    try {
      let res = await SalesChannelListWithRetailer(body);
      if (res.statusCode == 200) {
        setNdDropDownData(res.getSalesChannelListWithRetailerList);
        setTotalRecords(res.totalRecords);
      } else {
        // alert("error");
      }
    } catch (error) {
      // alert("error");

      console.log(error);
    }
  };
  // Update the column definitions
  const tableColumns = [
    { id: "retailerCode", label: "RETAILER CODE", sortable: true },
    { id: "name", label: "NAME", sortable: true },
    { id: "parentRetailer", label: "PARENT RETAILER", sortable: true },
    { id: "state", label: "STATE", sortable: true },
    { id: "city", label: "CITY", sortable: true },
    { id: "loginId", label: "LOGIN ID", sortable: false },
    { id: "password", label: "PASSWORD", sortable: false },
    { id: "nd", label: "ND", sortable: false },
    { id: "channel", label: "CHANNEL", sortable: true },
    { id: "channelCode", label: "CHANNEL CODE", sortable: true },
    { id: "mobile", label: "MOBILE", sortable: false },
    { id: "details", label: "DETAILS", sortable: false },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  const handleChangePage = async (event, newPage) => {
    setIsTableLoading(true);
    try {
      const updatedParams = {
        ...searchParams,
        pageIndex: newPage + 1,
      };
      setSearchParams(updatedParams);

      let res = await getRetailer(updatedParams);
      if (res.statusCode == 200) {
        setTotalRecords(res.totalRecords);
        const transformedData = res.getRetailerList.map((item) => ({
          id: item.retailerID,
          retailerCode: item.retailerCode,
          name: item.retailerName,
          parentRetailer: item.parentRetailerName || "-",
          state: item.stateName,
          city: item.cityName,
          loginId: item.loginName,
          password: item.password,
          nd: item.nd || "-",
          channel: item.salesChannelName,
          channelCode: item.salesChannelCode,
          mobile: item.mobileNumber,
          details: "View",
          status: item.status,
          edit: "✎",
        }));
        setRows(transformedData);
        setFilteredRows(transformedData);
        setPage(newPage);
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status));
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setIsTableLoading(true);
    try {
      const updatedParams = {
        ...searchParams,
        pageSize: newRowsPerPage,
        pageIndex: 1,
      };
      setSearchParams(updatedParams);

      let res = await getRetailer(updatedParams);
      if (res.statusCode == 200) {
        setTotalRecords(res.totalRecords);
        const transformedData = res.getRetailerList.map((item) => ({
          id: item.retailerID,
          retailerCode: item.retailerCode,
          name: item.retailerName,
          parentRetailer: item.parentRetailerName || "-",
          state: item.stateName,
          city: item.cityName,
          loginId: item.loginName,
          password: item.password,
          nd: item.nd || "-",
          channel: item.salesChannelName,
          channelCode: item.salesChannelCode,
          mobile: item.mobileNumber,
          details: "View",
          status: item.status,
          edit: "✎",
        }));
        setRows(transformedData);
        setFilteredRows(transformedData);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status));
    } finally {
      setIsTableLoading(false);
    }
  };

  // Add function to handle jump to page
  const handleJumpToPage = async (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecords / rowsPerPage)
    ) {
      setIsTableLoading(true);
      try {
        const updatedParams = {
          ...searchParams,
          pageIndex: pageNumber,
        };
        setSearchParams(updatedParams);

        let res = await getRetailer(updatedParams);
        if (res.statusCode == 200) {
          setTotalRecords(res.totalRecords);
          const transformedData = res.getRetailerList.map((item) => ({
            id: item.retailerID,
            retailerCode: item.retailerCode,
            name: item.retailerName,
            parentRetailer: item.parentRetailerName || "-",
            state: item.stateName,
            city: item.cityName,
            loginId: item.loginName,
            password: item.password,
            nd: item.nd || "-",
            channel: item.salesChannelName,
            channelCode: item.salesChannelCode,
            mobile: item.mobileNumber,
            details: "View",
            status: item.status,
            edit: "✎",
          }));
          setRows(transformedData);
          setFilteredRows(transformedData);
          setPage(pageNumber - 1); // Convert to 0-based index for MUI
        } else {
          setShowStatus(true);
          setTitle(res.statusMessage);
          setStatus(String(res.statusCode));
        }
      } catch (error) {
        setShowStatus(true);
        setTitle(error.statusMessage || "Internal Server Error");
        setStatus(String(error.status));
      } finally {
        setIsTableLoading(false);
      }
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

  // Update the search button click handler
  const handleSearchClick = async () => {
    setHasSearched(true);
    // console.log("searchParams", searchParams);
    setIsLoading(true);
    setPage(1);
    let searchBody = {
      ...searchParams,
      pageIndex: 1,
    };
    try {
      let res = await getRetailer(searchBody);
      if (res.statusCode == 200) {
        setTotalRecords(res.totalRecords);
        setShowStatus(false);

        // Transform API data to match table structure
        const transformedData = res.getRetailerList.map((item) => ({
          id: item.retailerID,
          retailerCode: item.retailerCode,
          name: item.retailerName,
          parentRetailer: item.parentRetailerName || "-",
          state: item.stateName,
          city: item.cityName,
          loginId: item.loginName,
          password: item.password,
          nd: item.nd || "-",
          channel: item.salesChannelName,
          channelCode: item.salesChannelCode,
          mobile: item.mobileNumber,
          details: "View",
          status: item.status,
          edit: "✎",
        }));
        console.log("transformedData", transformedData);

        setRows(transformedData);
        setFilteredRows(transformedData);
        setPage(0);
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));
        // Clear the table data if there's an error
        setRows([]);
        setFilteredRows([]);
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status));
      // Clear the table data if there's an error
      setRows([]);
      setFilteredRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (key, value) => {
    setSearchParams({ ...searchParams, [key]: value });
  };

  const [jumpToPageNumber, setJumpToPageNumber] = React.useState(null);

  const handleReset = () => {
    setSearchParams(initialSearchParams);
    setRows([]);
    setFilteredRows([]);
    setTotalRecords(0);
    setPage(0);
    setRowsPerPage(10);
    setHasSearched(false);
    setShowStatus(false);
    setStatus(false);
    setTitle("");
  };

  const handleStatusChange = async (retailerID) => {
    // alert(retailerID);
    try {
      setIsTableLoading(true);
      let body = {
        retailerID: retailerID,
        // Toggle between 1 and 0
      };

      let res = await RetailerStatusUpdate(body);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));
        const updatedParams = {
          ...searchParams,
          pageIndex: page + 1,
        };
        let refreshRes = await getRetailer(updatedParams);
        if (refreshRes.statusCode == 200) {
          const transformedData = refreshRes.getRetailerList.map((item) => ({
            id: item.retailerID,
            retailerCode: item.retailerCode,
            name: item.retailerName,
            parentRetailer: item.parentRetailerName || "-",
            state: item.stateName,
            city: item.cityName,
            loginId: item.loginName,
            password: item.password,
            nd: item.nd || "-",
            channel: item.salesChannelName,
            channelCode: item.salesChannelCode,
            mobile: item.mobileNumber,
            details: "View",
            status: item.status,
            edit: "✎",
          }));
          setRows(transformedData);
          setFilteredRows(transformedData);
        }
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage || "Failed to update status");
        setStatus(String(res.statusCode));
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.message || "Error updating status");
      setStatus("500");
    } finally {
      setIsTableLoading(false);
      // Hide status message after 3 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    }
  };
  const handleEdit = (retailerID) => {
    dispatch(setRetailerID(retailerID));
    navigate("/add-retailer");
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
        <Grid item xs={12} mt={0} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Retailer" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Show FormSkeleton during initial load */}
      {isLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <>
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
                  <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                    {/* First Row - 3 NuralAutocomplete */}
                    <Grid
                      container
                      spacing={2}
                      mb={3}
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
                          ND
                        </Typography>
                        <NuralAutocomplete
                          label="ND"
                          options={ndDropDownData}
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
                              "ndID",
                              newValue?.salesChannelID || 0,
                              newValue
                            );
                          }}
                          value={
                            ndDropDownData.find(
                              (option) =>
                                option.salesChannelID === searchParams.ndID
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
                          SALES CHANNEL
                        </Typography>
                        <NuralAutocomplete
                          label="Sales Channel"
                          options={salesChannelDropDownData}
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
                              newValue?.salesChannelID || 0,
                              newValue
                            );
                          }}
                          value={
                            salesChannelDropDownData.find(
                              (option) =>
                                option.salesChannelID ===
                                searchParams.salesChannelID
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
                          STATE
                        </Typography>
                        <NuralAutocomplete
                          label="State"
                          options={stateDropDownData}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "stateID",
                              newValue?.stateID || 0,
                              newValue
                            );
                          }}
                          value={
                            stateDropDownData.find(
                              (option) =>
                                option.stateID === searchParams.stateID
                            ) || null
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          RETAILER CODE
                        </Typography>
                        <NuralAutocomplete
                          label="Retailer Code"
                          options={retailerDropDownData}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.retailerCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerCode === value?.retailerCode
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "retailerCode",
                              newValue?.retailerCode || "",
                              newValue
                            );
                          }}
                          value={
                            retailerDropDownData.find(
                              (option) =>
                                option.retailerCode ===
                                searchParams.retailerCode
                            ) || null
                          }
                          filterOptions={filterOptions}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          RETAILER NAME
                        </Typography>
                        <NuralAutocomplete
                          label="Retailer Name"
                          options={retailerDropDownData}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.retailerName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerName === value?.retailerName
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "retailerName",
                              newValue?.retailerName || "",
                              newValue
                            );
                          }}
                          value={
                            retailerDropDownData.find(
                              (option) =>
                                option.retailerName ===
                                searchParams.retailerName
                            ) || null
                          }
                          filterOptions={filterOptions}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
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
                          label="Status"
                          options={options}
                          placeholder="SELECT"
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, value) =>
                            Number(option?.value) === Number(value?.value)
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange("status", newValue?.value ?? 2);
                          }}
                          value={
                            options.find(
                              (option) =>
                                Number(option.value) ===
                                Number(searchParams.status)
                            ) || options[0]
                          }
                        />
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          LEAVE TYPE
                        </Typography>
                        <NuralAutocomplete
                          label="Leave Type"
                          options={leaveTypeOptions}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            `${option.leaveTypeCode} - ${option.leaveTypeName}`
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.leaveTypeID === value?.leaveTypeID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "leaveTypeID",
                              newValue?.leaveTypeID || 0,
                              newValue
                            );
                          }}
                          value={
                            leaveTypeOptions.find(
                              (option) =>
                                option.leaveTypeID === searchParams.leaveTypeID
                            ) || null
                          }
                          filterOptions={createFilterOptions({
                            matchFrom: "any",
                            limit: 10,
                            stringify: (option) =>
                              `${option.leaveTypeCode} ${option.leaveTypeName}`,
                          })}
                        />
                      </Grid> */}
                    </Grid>

                    {/* Second Row - Buttons */}
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
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
            {showStatus && (
              <StatusModel width="100%" status={status} title={title} />
            )}
          </Grid>
          {filteredRows.length && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: 1 }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  height: "calc(120vh - 400px)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ overflow: "auto", flex: 1 }}>
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
                            top: "47px",
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
                            onClick={() =>
                              column.sortable && handleSort(column.id)
                            }
                            sx={{
                              ...tableHeaderStyle,
                              cursor: column.sortable ? "pointer" : "default",
                              position: "sticky",
                              top: "47px",
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
                              )}
                            </Grid>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isTableLoading
                        ? // Show skeleton rows while loading
                          Array(rowsPerPage)
                            .fill(0)
                            .map((_, index) => (
                              <TableRowSkeleton
                                key={index}
                                columns={tableColumns.length + 1} // +1 for S.NO column
                              />
                            ))
                        : // : filteredRows.length === 0 ? (
                          //   <TableRow>
                          //     <TableCell
                          //       colSpan={tableColumns.length + 1}
                          //       align="center"
                          //     >
                          //       No records found
                          //     </TableCell>
                          //   </TableRow>
                          // )
                          filteredRows.map((row, index) => (
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
                              {tableColumns.map((column) => (
                                <TableCell key={column.id} sx={{ ...rowstyle }}>
                                  {column.id === "details" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span>{row[column.id]}</span>
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          fontWeight: "600",
                                          marginLeft: "5px",
                                          color: DARK_PURPLE,
                                        }}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </span>
                                    </div>
                                  ) : column.id === "status" ? (
                                    <Switch
                                      checked={row.status}
                                      onChange={() =>
                                        handleStatusChange(row.id)
                                      }
                                      sx={{
                                        ...toggleSectionStyle,
                                        "& .MuiSwitch-thumb": {
                                          backgroundColor: row.status
                                            ? PRIMARY_BLUE2
                                            : DARK_PURPLE,
                                        },
                                      }}
                                    />
                                  ) : column.id === "edit" ? (
                                    <Edit
                                      sx={{ color: DARK_PURPLE }}
                                      fontSize="small"
                                      onClick={() => handleEdit(row.id)}
                                    />
                                  ) : (
                                    row[column.id]
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </Box>
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
                              "&:focus": {
                                outline: "none",
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
                      onClick={() => handleJumpToPage(1)}
                      style={{ cursor: "pointer" }}
                    >
                      JUMP TO FIRST
                    </Typography>
                    <IconButton
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                      sx={{
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>

                    <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
                      PAGE {page + 1}
                    </Typography>

                    <IconButton
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={
                        page >= Math.ceil(totalRecords / rowsPerPage) - 1
                      }
                      sx={{
                        "&:focus": {
                          outline: "none",
                        },
                      }}
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
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                      onClick={() =>
                        handleJumpToPage(Math.ceil(totalRecords / rowsPerPage))
                      }
                    >
                      JUMP TO LAST
                    </Typography>
                    <input
                      type="number"
                      placeholder="Jump to page"
                      min={1}
                      max={Math.ceil(totalRecords / rowsPerPage)}
                      onChange={(e) => {
                        const pageNumber = parseInt(e.target.value, 10);
                        setJumpToPageNumber(pageNumber);
                      }}
                      style={jumpToPageStyle}
                    />
                    <IconButton
                      onClick={() => {
                        if (jumpToPageNumber) {
                          handleJumpToPage(jumpToPageNumber);
                        }
                      }}
                      sx={{
                        ml: 1,
                        p: 0,
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                    >
                      <img src="./Icons/footerSearch.svg" alt="search" />
                    </IconButton>
                  </Grid>
                </Grid>
              </TableContainer>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default RetailerView;
