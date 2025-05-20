import {
  Grid,
  Typography,
  Button,
  Switch,
  CircularProgress,
  IconButton,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
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
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import { Edit, Try } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

import {
  fetchChannelName,
  fetchSalesChannelDropdown,
  GetSalesChannelListForDropdown,
  GetSalesChannelMasterList,
  GetStateListForDropdown,
  UpdateSalesChannelStatus,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import { setSalesChannelID } from "../../../Redux/action";
import { useDispatch } from "react-redux";
import {
  detailLabelCellStyle,
  detailValueCellStyle,
  listStyle,
} from "../../../Common/commonFunction";

const FormFieldSkeleton = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="rectangular" width="100%" height={40} />
    </Grid>
  </Grid>
);

const SalesChannelView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("sales-channel-view");
  const [showStatus, setShowStatus] = useState(false);
  const [flag, setFlag] = useState(false);
  const [status, setStatus] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [stateDropDownData, setStateDropDownData] = useState([]);
  const [salesChannelTypeDrop, setSalesChannelTypeDrop] = useState([]);
  const [salesChannelDrop, setSalesChannelDrop] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedSalesChannelDetails, setSelectedSalesChannelDetails] =
    useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showDetailTable, setShowDetailTable] = useState(false);
  const [showList, setShowList] = useState(true);
  const [isStateDropdownLoading, setIsStateDropdownLoading] = useState(true);
  const [isSalesChannelTypeDropLoading, setIsSalesChannelTypeDropLoading] =
    useState(true);
  const [isSalesChannelDropLoading, setIsSalesChannelDropLoading] =
    useState(true);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchParams, setSearchParams] = useState({
    salesChannelID: 0 /* SHOW DETAIL send SalesChannelID */,
    salesChannelTypeID: 0,
    salesChannelName: "",
    salesChannelCode: "",
    billToRetailer: 0,
    showDetail: 0 /*1=SHOW DETAIL*/,
    searchType: 0,
    brandId: 0,
    status: 2 /*1=Active, 0=InActive, 2=ALL*/,
    bindChild: 0,
    pageIndex: 1,
    pageSize: 10,
    countryID: 1,
  });
  const tabs = [
    { label: "Add", value: "add-sales-channel" },
    { label: "Search", value: "sales-channel-view" },
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

  // Update the column definitions
  const tableColumns = [
    { id: "salesChannelTypeName", label: "CHANNEL TYPE", sortable: true },
    { id: "salesChannelCode", label: "CHANNEL CODE", sortable: true },
    { id: "salesChannelName", label: "NAME", sortable: true },
    { id: "parentName", label: "PARENT", sortable: true },
    { id: "reportingHierarchy", label: "REPORTING HIERARCHY", sortable: true },
    { id: "email", label: "EMAIL", sortable: true },
    { id: "loginName", label: "LOGIN ID", sortable: true },
    { id: "password", label: "PASSWORD", sortable: true },
    { id: "numberOfBackDaysForSC", label: "BACK DAYS", sortable: true },
    { id: "details", label: "DETAILS", sortable: false },
    { id: "status", label: "STATUS", sortable: true },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  // Update the dummy data generator

  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [totalRecords, setTotalRecords] = useState(0);

  // Update pagination handlers
  const handleChangePage = (event, newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage + 1,
    }));
    setPage(newPage);
    setFlag(!flag);
  };

  const downloadExcel = async () => {
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    setIsDownloadLoading(true);
    try {
      let res = await GetSalesChannelMasterList(body);
      if (res.statusCode == "200") {
        window.location.href = res.reportlink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setFlag(!flag);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode || "500");
      setTitle(error.statusMessage || "Internal Server Error");
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1,
    }));
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setFlag(!flag);
  };

  const handleJumpToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecords / rowsPerPage)
    ) {
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: pageNumber,
      }));
      setPage(pageNumber - 1);
      setFlag(!flag);
    }
  };

  // Update the jump to first/last functionality
  const handleJumpToFirst = () => {
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
    setPage(0);
    setFlag(!flag);
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: lastPage,
    }));
    setPage(lastPage - 1);
    setFlag(!flag);
  };

  // Enhanced sorting function
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });

        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      // Handle null/undefined values
      if (!a[columnName] && !b[columnName]) return 0;
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      // Handle numeric values
      if (
        typeof a[columnName] === "number" &&
        typeof b[columnName] === "number"
      ) {
        return direction === "asc"
          ? a[columnName] - b[columnName]
          : b[columnName] - a[columnName];
      }

      // Handle string values
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

  // Add search/filter functionality

  // Update the search button click handler
  const handleSearchClick = () => {
    setShowStatus(false);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: 10,
    }));
    setRowsPerPage(10);
    setPage(0);
    setShowList(true);
    setShowDetailTable(false);
    setSelectedSalesChannelDetails(null);
    setSelectedRowId(null);
    setHasSearched(true);
    setFlag(!flag);
  };

  // Update the cancel button handler
  const handleCancelClick = () => {
    setShowStatus(false);
    setSearchParams({
      salesChannelID: 0,
      salesChannelTypeID: 0,
      salesChannelName: "",
      salesChannelCode: "",
      billToRetailer: 0,
      showDetail: 0,
      searchType: 0,
      brandId: 0,
      status: 2,
      bindChild: 0,
      pageIndex: 1,
      pageSize: rowsPerPage,
      countryID: 1,
    });
    setPage(0);
    setSortConfig({ key: null, direction: null });
    setFilteredRows([...rows]);
    setSelectedSalesChannelDetails(null);
    setSelectedRowId(null);
    setShowDetailTable(false);
    setShowList(false);
    setHasSearched(false);
    setFlag(!flag);
  };

  useEffect(() => {
    fetchTableData();
  }, [flag, searchParams.pageIndex, searchParams.pageSize]);

  const fetchTableData = async () => {
    setIsTableLoading(true);
    try {
      let res = await GetSalesChannelMasterList(searchParams);
      if (res.statusCode == "200") {
        // setRows(res.salesChannelMasterDataList || []);
        setFilteredRows(res.salesChannelMasterDataList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setRows([]);
        setFilteredRows([]);
        setTotalRecords(0);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setShowStatus(true);
      }
    } catch (error) {
      setRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
      setStatus(error.status || "500");
      setTitle(error.statusMessage || "Internal Server Error");
      setShowStatus(true);
    } finally {
      setIsTableLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesChannelDrop();
    fetchStateDropDownData();
    fetchSalesChannelTypeDrop();
  }, []);

  const fetchSalesChannelTypeDrop = async () => {
    setIsSalesChannelTypeDropLoading(true);
    let body = {
      salesChannelTypeid: 0,
      forApproval: 0,
      loadRetailer: 0,
    };

    try {
      let res = await fetchChannelName(body);
      if (res.statusCode == "200") {
        setSalesChannelTypeDrop(res.salesChannelTypeList || []);
      } else {
        setSalesChannelTypeDrop([]);
      }
    } catch (error) {
      console.log(error);
      setSalesChannelTypeDrop([]);
    } finally {
      setIsSalesChannelTypeDropLoading(false);
    }
  };

  const fetchStateDropDownData = async () => {
    setIsStateDropdownLoading(true);
    let body = {
      countryID: 1,
      regionID: 0,
      stateID: 0,
    };

    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == "200") {
        setStateDropDownData(res.stateDropdownList || []);
      } else {
        setStateDropDownData([]);
      }
    } catch (error) {
      console.log(error);
      setStateDropDownData([]);
    } finally {
      setIsStateDropdownLoading(false);
    }
  };

  const fetchSalesChannelDrop = async () => {
    setIsSalesChannelDropLoading(true);
    let body = {
      salesChannelID: 0,
      stateID: 0,
      cityID: 0,
    };
    try {
      let res = await GetSalesChannelListForDropdown(body);
      if (res.statusCode == "200") {
        setSalesChannelDrop(res.salesChannelDropdownList || []);
      } else {
        setSalesChannelDrop([]);
      }
    } catch (error) {
      console.log(error);
      setSalesChannelDrop([]);
    } finally {
      setIsSalesChannelDropLoading(false);
    }
  };

  const handleSearchChange = (key, value) => {
    setSearchParams({ ...searchParams, [key]: value });
  };

  // Add totalRecords state

  const handleStatusChange = async (salesChannelID) => {
    console.log(salesChannelID);
    let body = {
      salesChannelID: salesChannelID,
    };
    try {
      let res = await UpdateSalesChannelStatus(body);
      if (res.statusCode == "200") {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setFlag(!flag);
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status);
      setTitle(error.statusMessage || "Something went wrong");
    }
  };
  const handleEdit = (salesChannelID) => {
    dispatch(setSalesChannelID(salesChannelID));
    navigate("/add-sales-channel");
  };
  const detailTableRef = useRef(null);
  const handleView = async (salesChannelID) => {
    setIsTableLoading(true);
    setIsViewModalOpen(true);
    setIsDetailLoading(true);
    setSelectedRowId(salesChannelID);
    setShowDetailTable(true);
    let body = {
      salesChannelID: salesChannelID,
      salesChannelTypeID: 0,
      salesChannelName: "",
      salesChannelCode: "",
      billToRetailer: 0,
      showDetail: 1 /*1=SHOW DETAIL*/,
      searchType: 0,
      brandId: 0,
      status: 2 /*1=Active, 0=InActive, 2=ALL*/,
      bindChild: 0,
      pageIndex: 1,
      pageSize: 10,
      countryID: 1,
    };
    try {
      let res = await GetSalesChannelMasterList(body);
      if (res.statusCode == "200") {
        const details = res.salesChannelMasterDataList[0];
        setSelectedSalesChannelDetails(details);
        setTimeout(() => {
          detailTableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || "500");
      setTitle(error.statusMessage || "Internal Server Error");
    } finally {
      setIsDetailLoading(false);
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    // Check if all dropdowns are loaded
    if (
      !isStateDropdownLoading &&
      !isSalesChannelTypeDropLoading &&
      !isSalesChannelDropLoading
    ) {
      setIsFormLoading(false);
    }
  }, [
    isStateDropdownLoading,
    isSalesChannelTypeDropLoading,
    isSalesChannelDropLoading,
  ]);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "180px", lg: "260px" },
      }}
    >
      {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10000,
          backgroundColor: "#fff",
          paddingBottom: 1,
        }}
      >
        <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
          <BreadcrumbsHeader pageTitle="Channel" />
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
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Search"
                backgroundColor={LIGHT_GRAY2}
                expanded={isAccordionExpanded}
                controlled={true}
                onChange={(event, expanded) => {
                  setIsAccordionExpanded(expanded);
                  if (!expanded) {
                    setShowList(false);
                    setShowDetailTable(false);
                    setSelectedSalesChannelDetails(null);
                    setSelectedRowId(null);
                  } else if (hasSearched) {
                    setShowList(true);
                  }
                }}
              >
                {isFormLoading ? (
                  // Show skeleton loading for form fields
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormFieldSkeleton />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormFieldSkeleton />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <FormFieldSkeleton />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <FormFieldSkeleton />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <FormFieldSkeleton />
                    </Grid>
                  </Grid>
                ) : (
                  // Show actual form fields
                  <>
                    {/* First Row - Search Fields */}
                    <Grid
                      container
                      spacing={2}
                      mb={3}
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
                          SALES CHANNEL TYPE
                        </Typography>
                        <NuralAutocomplete
                          label="Sales Channel Type"
                          options={salesChannelTypeDrop}
                          placeholder="SELECT"
                          width="100%"
                          loading={isSalesChannelTypeDropLoading}
                          getOptionLabel={(option) =>
                            option.salesChannelTypeName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesChannelTypeID ===
                            value?.salesChannelTypeID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "salesChannelTypeID",
                              newValue?.salesChannelTypeID || 0
                            );
                          }}
                          value={
                            salesChannelTypeDrop.find(
                              (option) =>
                                option.salesChannelTypeID ===
                                searchParams.salesChannelTypeID
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
                          STATE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="State"
                          options={stateDropDownData}
                          loading={isStateDropdownLoading}
                          getOptionLabel={(option) => option.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "stateID",
                              newValue?.stateID || null
                            );
                          }}
                          value={
                            stateDropDownData.find(
                              (option) =>
                                option.stateID === searchParams.stateID
                            ) || null
                          }
                          placeholder="SELECT"
                        />
                      </Grid>
                    </Grid>

                    {/* Second Row - Additional Fields */}
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
                          SALES CHANNEL CODE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="Sales Channel Code"
                          placeholder="SELECT"
                          options={salesChannelDrop}
                          loading={isSalesChannelDropLoading}
                          getOptionLabel={(option) =>
                            option.salesChannelCode || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesChannelCode === value?.salesChannelCode
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "salesChannelCode",
                              newValue?.salesChannelCode || ""
                            );
                          }}
                          value={
                            salesChannelDrop.find(
                              (option) =>
                                option.salesChannelCode ===
                                searchParams.salesChannelCode
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
                          SALES CHANNEL NAME
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="Sales Channel Code"
                          placeholder="SELECT"
                          options={salesChannelDrop}
                          loading={isSalesChannelDropLoading}
                          getOptionLabel={(option) =>
                            option.salesChannelName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesChannelName === value?.salesChannelName
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "salesChannelName",
                              newValue?.salesChannelName || ""
                            );
                          }}
                          value={
                            salesChannelDrop.find(
                              (option) =>
                                option.salesChannelName ===
                                searchParams.salesChannelName
                            ) || null
                          }
                        />
                      </Grid>{" "}
                      <Grid item xs={12} sm={12} md={4} lg={4}>
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
                          options={[
                            { label: "ALL", value: 2 },
                            { label: "Active", value: 1 },
                            { label: "Inactive", value: 0 },
                          ]}
                          placeholder="ALL"
                          getOptionLabel={(option) => option.label || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.value === value?.value
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange("status", newValue?.value ?? 2);
                          }}
                          value={
                            [
                              { label: "ALL", value: 2 },
                              { label: "Active", value: 1 },
                              { label: "Inactive", value: 0 },
                            ].find(
                              (option) => option.value === searchParams.status
                            ) || { label: "ALL", value: 2 }
                          }
                        />
                      </Grid>
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
                          onClick={handleCancelClick}
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
                  </>
                )}
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} pr={4} sx={{ position: "relative", mt: -4 }}>
        {showStatus && (
          <StatusModel width="100%" status={status} title={title} />
        )}
      </Grid>

      {/* Add this after the NuralAccordion2 component */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: -4 }}>
        {isAccordionExpanded &&
          showList &&
          hasSearched &&
          filteredRows.length > 0 && (
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
                        onClick={() => column.sortable && handleSort(column.id)}
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
                  {isTableLoading ? (
                    <TableRowSkeleton
                      // key={index}
                      columns={tableColumns.length + 1}
                    />
                  ) : (
                    filteredRows.map((row, index) => (
                      <TableRow
                        key={row.salesChannelID}
                        sx={{
                          ...rowstyle,
                          color:
                            selectedRowId === row.salesChannelID
                              ? "#fff"
                              : PRIMARY_BLUE2,
                          backgroundColor:
                            selectedRowId === row.salesChannelID
                              ? PRIMARY_BLUE2
                              : "inherit",
                          "&:hover": {
                            backgroundColor:
                              selectedRowId === row.salesChannelID
                                ? PRIMARY_BLUE2
                                : "inherit",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            ...rowstyle,
                            color:
                              selectedRowId === row.salesChannelID
                                ? "#fff"
                                : PRIMARY_BLUE2,
                            fontWeight: 600,
                          }}
                        >
                          {(searchParams.pageIndex - 1) *
                            searchParams.pageSize +
                            index +
                            1}
                        </TableCell>
                        {tableColumns.map((column) => (
                          <TableCell
                            key={column.id}
                            sx={{
                              ...rowstyle,
                              color:
                                selectedRowId === row.salesChannelID
                                  ? "#fff"
                                  : PRIMARY_BLUE2,
                            }}
                          >
                            {column.id === "status" ? (
                              <Switch
                                sx={{
                                  ...toggleSectionStyle,
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor:
                                      row.status === 1
                                        ? PRIMARY_BLUE2
                                        : DARK_PURPLE,
                                  },
                                }}
                                checked={row.status === 1}
                                onClick={() =>
                                  handleStatusChange(row.salesChannelID)
                                }
                              />
                            ) : column.id === "edit" ? (
                              <IconButton size="small">
                                <Edit
                                  onClick={() => handleEdit(row.salesChannelID)}
                                  sx={{ color: PRIMARY_BLUE2 }}
                                  fontSize="small"
                                />
                              </IconButton>
                            ) : column.id === "details" ? (
                              <IconButton
                                onClick={() => {
                                  setShowStatus(false);
                                  handleView(row.salesChannelID);
                                }}
                                size="x-small"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  cursor: "pointer",
                                  "&:focus": {
                                    outline: "none",
                                  },
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: selectedRowId === row.salesChannelID ? "#fff" : DARK_PURPLE,
                                    fontSize: "10px",
                                    fontWeight: 400,
                                  }}
                                >
                                  View
                                </Typography>
                                <VisibilityIcon
                                  sx={{ 
                                    color: selectedRowId === row.salesChannelID ? "#fff" : DARK_PURPLE 
                                  }}
                                  fontSize="small"
                                />
                              </IconButton>
                            ) : column.id === "reportingHierarchy" ? (
                              `${row.zsmName} > ${row.sbhName}`
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

              {/* Custom Pagination */}
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
                      // maxWidth: 300,
                      width: "100%",
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
                            "&:focus": {
                              outline: "none",
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
                    onClick={() => {
                      handleJumpToFirst();
                      document.getElementById("jumpToPageInput").value = "";
                    }}
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

                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    PAGE {searchParams.pageIndex}
                  </Typography>

                  <IconButton
                    onClick={() => handleChangePage(null, page + 1)}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
                    sx={{
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
                    onClick={() => {
                      handleJumpToLast();
                      document.getElementById("jumpToPageInput").value = "";
                    }}
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    id="jumpToPageInput"
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
                      outline: "none",
                    }}
                  />
                  <Grid mt={1} sx={{ cursor: "pointer" }}>
                    <img
                      src="./Icons/footerSearch.svg"
                      alt="arrow"
                      onClick={() => {
                        const pageNumber = parseInt(
                          document.getElementById("jumpToPageInput").value,
                          10
                        );
                        if (pageNumber) {
                          handleJumpToPage(pageNumber);
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          )}

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
      </Grid>

      {isAccordionExpanded &&
        showDetailTable &&
        selectedSalesChannelDetails && (
          <Grid
            item
            xs={12}
            sx={{ p: { xs: 1, sm: 2 }, mt: 2 }}
            ref={detailTableRef}
          >
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: LIGHT_GRAY2, color: PRIMARY_BLUE2 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        ...tableHeaderStyle,
                        backgroundColor: LIGHT_GRAY2,
                        position: "relative",
                        padding: "16px",
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography
                            variant="h6"
                            sx={{ ...listStyle, ml: -1.5 }}
                          >
                            Sales Channel Detail
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => {
                              setSelectedSalesChannelDetails(null);
                              setSelectedRowId(null);
                              setShowDetailTable(false);
                            }}
                            size="small"
                            sx={{
                              color: PRIMARY_BLUE2,
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.08)",
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isDetailLoading
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <TableRowSkeleton
                            key={index}
                            columns={2} // +1 for S.NO column
                          />
                        ))
                    : Object.entries(selectedSalesChannelDetails)
                        .filter(
                          ([key]) =>
                            ![
                              "row",
                              "salesChannelID",
                              "salesChannelTypeID",
                              "cityID",
                              "areaID",
                              "stateID",
                              "countryID",
                              "userID",
                              "groupParentSalesChannelID",
                              "createdBy",
                              "mappingHierarchyLevel",
                              "sequence",
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <TableRow
                            key={key}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              bgcolor: LIGHT_GRAY2,
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              sx={detailLabelCellStyle}
                            >
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </TableCell>
                            <TableCell sx={detailValueCellStyle}>
                              {value || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
    </Grid>
  );
};

export default SalesChannelView;
