import {
  Grid,
  Typography,
  Button,
  Switch,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
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
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
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
import CloseIcon from "@mui/icons-material/Close";
import {
  BindEntityList,
  GetCityListForDropdown,
  getRetailer,
  GetRetailerListDrpdown,
  GetStateListForDropdown,
  RetailerStatusUpdate,
  SalesChannelListWithRetailer,
  getRetailerlistinfo,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { setRetailerID } from "../../../Redux/action";
import { useDispatch } from "react-redux";

const RetailerView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("view-retailer");
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [stateDropDownData, setStateDropDownData] = React.useState([]);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
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
  const listStyle = {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "19.12px",
    letterSpacing: "0%",
    color: PRIMARY_BLUE2,
    p: 1,
  };

  const options = [
    { label: "All", value: 2 },
    { label: "Active", value: 1 },
    { label: "InActive", value: 0 },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ndDropDownData, setNdDropDownData] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [showStatus, setShowStatus] = React.useState(false);
  const [salesChannelDropDownData, setSalesChannelDropDownData] =
    React.useState([]);

  const [retailerDropDownData, setRetailerDropDownData] = React.useState([]);
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
  const [isListLoading, setIsListLoading] = React.useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [selectedRetailerDetails, setSelectedRetailerDetails] = useState(null);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 100,
    stringify: (option) => option.retailerCode + " " + option.retailerName,
  });

  // Define the dummy data structure based on the API response
  const dummyApiData = {
    retailerCode: "RTL45143",
    groupParentRetailerId: 0,
    retailerName: "Dummy Retailer", // Changed for clarity
    retailerTypeId: 20,
    retailerTypeName: "General Trade (Dummy)", // Changed for clarity
    isIspOnCounter: 0,
    ispOnCounter: "No",
    retailerId: 314452,
    areaName: "Dummy Area",
    stateName: "Dummy State",
    countryName: "Dummy Country",
    regionName: "East",
    zoneName: "",
    countryId: 1,
    cityName: "Dummy City",
    districtName: "Dummy District",
    salesmanCode: "FS458",
    salesmanName: "Dummy Salesman",
    salesmanId: 458,
    contactPerson: "Dummy Contact",
    address1: "Dummy Address Line 1",
    address2: "",
    statusValue: "Active",
    pinCode: "000000",
    areaId: 0,
    cityId: 4169,
    salesChannelId: 2437,
    stateId: 121,
    status: 1,
    counterSize: 9999,
    districtId: 0,
    email: "dummy@example.com",
    mobileNumber: "9999999999",
    phoneNumber: "8888888888",
    tinNumber: "DUMMYVAT123",
    salesChannelName: "Dummy PAI INTERNATIONAL ELECTRONICS LTD",
    salesChannelCode: "700378",
    retailerSalesChannelId: 2437,
    mappedOrgnhierarchyId: 0,
    dob: "01-01-1990",
    approval: 1,
    approvalRemarks: "Auto Approve by Head Office",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    branchLocation: "",
    panNo: "",
    counterValue: 9999, // Use counterValue
    tehsilName: "",
    tehsilId: 0,
    orgnhierarchyId: 0,
    retailer: "Dummy Retailer ( RTL45143 ) ",
    loginName: "",
    password: "",
    parentRetailerName: "",
    passwordSalt: "",
    userStatus: 1,
    locationName: "",
    isOpeningStockEnteredForRetailer: true,
    openingStockDate: "23-04-2024 00:00:00",
    openingStockEntryDate: "23-04-2025 14:00:43",
    referanceCode: "",
    scrCategoryID: 1,
    scrCategoryName: "A",
  };

  // Helper function to map API data (real or dummy) to display format
  const mapApiDataToDisplay = (details) => {
    if (!details) return null; // Handle null input

    return {
      id: details.retailerId, // Keep ID internally if needed
      "Retailer Type": details.retailerTypeName || "N/A",
      "Retailer Code": details.retailerCode || "N/A",
      "Retailer Name": details.retailerName || "N/A",
      "SCR Category": details.scrCategoryName || "N/A",
      "Sales Channel Name": details.salesChannelName || "N/A",
      "Salesman Name": details.salesmanName || "N/A",
      Address: details.address1 || "N/A",
      Country: details.countryName || "N/A",
      State: details.stateName || "N/A",
      City: details.cityName || "N/A",
      District: details.districtName || "N/A",
      Area: details.areaName || "N/A",
      "Pin Code": details.pinCode || "N/A",
      "Contact Person": details.contactPerson || "N/A",
      "Phone No": details.phoneNumber || "N/A",
      Mobile: details.mobileNumber || "N/A",
      "Counter Potential in Volume": details.counterValue ?? "N/A",
      EMail: details.email || "N/A",
      "VAT No": details.tinNumber || "N/A",
      "CSA on Counter": details.ispOnCounter || "N/A",
      "Date of Birth": details.dob || "N/A",
      // Bank Details
      "Bank Name": details.bankName || "N/A",
      "Account Holder": details.accountHolder || "N/A",
      "Account Number": details.accountNumber || "N/A",
      "IFSC Code": details.ifscCode || "N/A",
      "Branch Location": details.branchLocation || "N/A",
      "PAN Number": details.panNo || "N/A",
    };
  };

  const detailTableRef = useRef(null);

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
      activeStatus: 255,
      otherEntityTypeID: log.baseEntityTypeID,
      getND: 1,
      countryID: 0,
    };

    console.log(body);
    try {
      let res = await SalesChannelListWithRetailer(body);
      if (res.statusCode == 200) {
        setNdDropDownData(res.getSalesChannelListWithRetailerList);
      } else {
        // alert("error");
      }
    } catch (error) {
      // alert("error");

      console.log(error);
    }
  };

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
    setSelectedRetailerDetails(null);
    setIsListLoading(true);
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
        setRows([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status));
      setRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setSelectedRetailerDetails(null);
    setIsListLoading(true);
    setPage(0);
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
        setRows([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status));
      setRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleJumpToPage = async (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecords / rowsPerPage)
    ) {
      setSelectedRetailerDetails(null);
      setIsListLoading(true);
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
          setPage(pageNumber - 1);
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
        setIsListLoading(false);
      }
    }
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...rows]);
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

  const handleSearchClick = async () => {
    setShowStatus(false);
    setHasSearched(true);
    setSelectedRetailerDetails(null);
    setIsListLoading(true);
    setPage(0);
    let searchBody = {
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    };
    try {
      let res = await getRetailer(searchBody);
      if (res.statusCode == 200) {
        setTotalRecords(res.totalRecords);
        setShowStatus(false);
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
        setPage(0);
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));
        setRows([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error");
      setStatus(String(error.status) || 500);
      setRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsListLoading(false);
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
    setSelectedRetailerDetails(null);
    setSortConfig({ key: null, direction: null });
  };

  const handleStatusChange = async (retailerID) => {
    const currentSelectedId = selectedRetailerDetails?.id;
    try {
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row.id === retailerID ? { ...row, status: !row.status } : row
        )
      );
      if (currentSelectedId === retailerID) {
        setSelectedRetailerDetails((prev) =>
          prev ? { ...prev, Status: !prev["Status"] } : null
        );
      }

      setIsListLoading(true);
      let body = { retailerID: retailerID };
      let res = await RetailerStatusUpdate(body);

      if (res.statusCode == 200) {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(String(res.statusCode));

        const updatedParams = { ...searchParams, pageIndex: page + 1 };
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
          if (currentSelectedId === retailerID) {
            handleViewDetails(retailerID);
          }
        } else {
          setShowStatus(true);
          setTitle(
            `Status updated, but list refresh failed: ${refreshRes.statusMessage}`
          );
          setStatus(String(refreshRes.statusCode));
        }
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage || "Failed to update status");
        setStatus(String(res.statusCode));
        setFilteredRows((prevRows) =>
          prevRows.map((row) =>
            row.id === retailerID ? { ...row, status: !row.status } : row
          )
        );
        if (currentSelectedId === retailerID) {
          setSelectedRetailerDetails((prev) =>
            prev ? { ...prev, Status: !prev["Status"] } : null
          );
        }
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.message || "Error updating status");
      setStatus("500");
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row.id === retailerID ? { ...row, status: !row.status } : row
        )
      );
      if (currentSelectedId === retailerID) {
        setSelectedRetailerDetails((prev) =>
          prev ? { ...prev, Status: !prev["Status"] } : null
        );
      }
    } finally {
      setIsListLoading(false);
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    }
  };

  const handleEdit = (retailerID) => {
    dispatch(setRetailerID(retailerID));
    navigate("/add-retailer");
  };

  const downloadExcel = async () => {
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    setIsDownloadLoading(true);
    try {
      let res = await getRetailer(body);
      if (res.statusCode == 200 && res.reportLink) {
        window.location.href = res.reportLink;
      } else {
        setShowStatus(true);
        setTitle(res.statusMessage || "Failed to generate export.");
        setStatus(String(res.statusCode || "500"));
      }
    } catch (error) {
      setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error during export");
      setStatus(String(error.status || "500"));
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleViewDetails = async (retailerID) => {
    setIsListLoading(true);
    setSelectedRetailerDetails(null);
    setSelectedRowId(retailerID);
    console.log("Fetching details for retailer ID:", retailerID);

    let detailParams = {
      retailerID: retailerID,
      retailerName: "",
      salesChannelId: 0,
      Type: 0,
      salesmanName: "",
      salesmaniD: 0,
    };

    try {
      let res = await getRetailerlistinfo(detailParams);
      console.log("API Response from getRetailerlistinfo:", res);

      if (
        res.statusCode == 200 &&
        res.getRetailerListinfo &&
        res.getRetailerListinfo.length > 0
      ) {
        const details = res.getRetailerListinfo[0];
        setSelectedRetailerDetails(mapApiDataToDisplay(details));
        setTimeout(() => {
          detailTableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.warn(
          `Failed to fetch details or no details found (Status: ${res.statusCode}). Displaying dummy data.`
        );
        setSelectedRetailerDetails(mapApiDataToDisplay(dummyApiData));
        setTimeout(() => {
          detailTableRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (error) {
      console.error(
        "Error fetching retailer details:",
        error,
        ". Displaying dummy data."
      );
      setSelectedRetailerDetails(mapApiDataToDisplay(dummyApiData));
      setTimeout(() => {
        detailTableRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRetailerDetails(null);
    setSelectedRowId(null);
  };

  const detailLabelCellStyle = {
    fontWeight: "bold",
    color: "#555",
    backgroundColor: LIGHT_GRAY2,
    padding: "8px 12px",
    border: "1px solid #ddd",
    fontSize: "12px",
    width: "30%",
  };

  const detailValueCellStyle = {
    color: "#333",
    backgroundColor: LIGHT_GRAY2,

    padding: "8px 12px",
    border: "1px solid #ddd",
    fontSize: "12px",
    width: "70%",
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "240px", lg: "260px", xl: "270px" },
        pb: 2,
      }}
    >
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
        <Grid item xs={12} mt={0} mb={0} ml={1} pr={4}>
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

      {isLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <>
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
          {hasSearched &&
            !isLoading &&
            (filteredRows.length > 0 || isListLoading) && (
              <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: -4 }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    color: PRIMARY_BLUE2,
                    maxHeight: "calc(100vh - 45px)",
                    minHeight: "200px",
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
                            colSpan={tableColumns.length + 1}
                            sx={{
                              backgroundColor: LIGHT_GRAY2,
                              position: "sticky",
                              top: 0,
                              zIndex: 1050,
                              borderBottom: "none",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ ...listStyle, ml: -1.5 }}
                            >
                              Retailer List
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
                              zIndex: 1050,
                            }}
                          >
                            S.NO
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
                                zIndex: 1050,
                              }}
                            >
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item>{column.label}</Grid>
                                {column.sortable && (
                                  <Grid
                                    item
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
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
                                          sx={{
                                            fontSize: 12,
                                            color: "grey.400",
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
                                )}
                              </Grid>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isListLoading ? (
                          Array(rowsPerPage)
                            .fill(0)
                            .map((_, index) => (
                              <TableRowSkeleton
                                key={index}
                                columns={tableColumns.length + 1}
                              />
                            ))
                        ) : filteredRows.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={tableColumns.length + 1}
                              align="center"
                              sx={{ ...rowstyle }}
                            >
                              No records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRows.map((row, index) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                ...rowstyle,
                                color:
                                  row.id === selectedRowId
                                    ? "#fff"
                                    : "inherit",
                                backgroundColor:
                                  row.id === selectedRowId
                                    ? PRIMARY_BLUE2
                                    : "inherit",
                                "&:hover": {
                                  backgroundColor:
                                    row.id === selectedRowId
                                      ? DARK_PURPLE
                                      : "rgba(0, 0, 0, 0.04)",
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: row.id === selectedRowId ? "#fff" : PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                {page * rowsPerPage + index + 1}
                              </TableCell>
                              {tableColumns.map((column) => (
                                <TableCell 
                                  key={column.id} 
                                  sx={{ 
                                    ...rowstyle,
                                    color: row.id === selectedRowId ? "#fff" : "inherit",
                                    "& .MuiIconButton-root": {
                                      color: row.id === selectedRowId ? "#fff" : DARK_PURPLE,
                                    },
                                    "& .MuiTypography-root": {
                                      color: row.id === selectedRowId ? "#fff" : DARK_PURPLE,
                                    },
                                  }}
                                >
                                  {column.id === "details" ? (
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewDetails(row.id)}
                                      sx={{
                                        color: DARK_PURPLE,
                                        p: "4px",
                                        "&:focus": { outline: "none" },
                                      }}
                                      title="View Details"
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: DARK_PURPLE,
                                          fontSize: "10px",
                                          fontWeight: 400,
                                        }}
                                      >
                                        View
                                      </Typography>{" "}
                                      &nbsp;
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
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
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(row.id)}
                                      sx={{
                                        color: DARK_PURPLE,
                                        p: "4px",
                                        "&:focus": { outline: "none" },
                                      }}
                                      title="Edit Retailer"
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
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
                  </Box>
                  {totalRecords > 0 && !isListLoading && (
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
                          <span
                            style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}
                          >
                            {totalRecords} /{" "}
                            {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
                                  color:
                                    rowsPerPage === value
                                      ? "#fff"
                                      : PRIMARY_BLUE2,
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
                            handleJumpToPage(
                              Math.ceil(totalRecords / rowsPerPage)
                            )
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
                  )}
                </TableContainer>
              </Grid>
            )}

          {selectedRetailerDetails && (
            <Grid
              item
              xs={12}
              sx={{ p: { xs: 1, sm: 2 }, mt: -2 }}
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
                              Retailer Detail
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={handleCloseDetails}
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
                    {isDetailLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(selectedRetailerDetails)
                        .filter(([key]) => key !== "id")
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
                              {key}
                            </TableCell>
                            <TableCell sx={detailValueCellStyle}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </>
      )}

      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={3}
        mt={0}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 10,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          height: "calc(100vh - 0px)",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": { marginBottom: "16px" },
          "& .export-button": { filter: "none !important" },
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
  );
};

export default RetailerView;
