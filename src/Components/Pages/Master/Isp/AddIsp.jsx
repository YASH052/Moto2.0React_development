import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Checkbox,
  Box,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import { FormSkeleton } from "../../../Common/Skeletons";
import {
  AQUA,
  DARK_BLUE,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { useNavigate } from "react-router-dom";
import {
  GetAgencyListDropdown,
  getISPRetailerReferenceDataLink,
  GetRetailerListDrpdown,
  SaveUpdateISPData,
  GetISPListDrpdown,
  GetISPList,
  getISPMasterDataLink,
  UpdateStatusISP,
  UpdateISPMappingToNewRetailer,
  ExitISP,
} from "../../../Api/Api";
import { createFilterOptions } from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { styled } from "@mui/material/styles";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralRetailer from "../../NuralCustomComponents/NuralRetailer";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import Required from "../../../Common/Required";

// Helper function to format date to YYYY-MM-DD
const formatDateForAPI = (date) => {
  if (!date) return null;
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, "0");
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      // Check if date is valid
      return null;
    }
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return null; // Return null if formatting fails
  }
};

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
  stringify: (option) => option.retailerCode + " " + option.retailerName,
});

const CustomCheckbox = styled(Checkbox)(() => ({
  color: "#FFFFFF",
  padding: 0,
  "&.Mui-checked": {
    color: "#FFFFFF",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
  "& .MuiCheckbox-root": {
    padding: 0,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const AddIsp = () => {
  const [activeTab, setActiveTab] = React.useState("add-isp");
  const [tabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "create-salesman" },
  ]);
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [retailerList, setRetailerList] = useState([]);
  const [retailerListLoading, setRetailerListLoading] = useState(false);
  const [agencyList, setAgencyList] = useState([]);
  const [formData, setFormData] = useState({
    ispId: 0, // 0= to add, ISPID to update
    password: "",
    userName: "",
    passwordExpiryDays: 90, // taken from configValue in DB
    createLoginOrNot: 1, // taken from configValue in DB
    email: "",
    companyID: 0,
    ispName: "",
    ispCode: "",
    mobile: "",
    retailerID: 0, //selected Retailer's ID
    storeCode: "",
    joiningDate: "", // YYYY-MM-DD
    fromDate: null,
    weekOffDay: 1,
    parentHeirarchyID: 0, // Explicitly set to 0
    agencyID: 0,
  });
  // Remove redundant isLoading state
  // const [isLoading, setIsLoading] = React.useState(true);

  // Add new state variables for form/search loading
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);

  // Add new state variables for table and search
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState({
    agencyID: 0,
    ispName: "",
    ispCode: "",
    storeCode: "",
    mobile: "",
    joiningDate: null,
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(true);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedIspDetails, setSelectedIspDetails] = useState(null);
  const [actionLabel, setActionLabel] = useState("");
  const [isplist, setIspList] = useState([]);
  const [errors, setErrors] = useState({});
  const [createEditAccordionExpanded, setCreateEditAccordionExpanded] =
    useState(true);
  const [retailerStatus, setRetailerStatus] = useState(null);
  const [retailerTitle, setRetailerTitle] = useState('');

  // Ref for scrolling to the top section and table container
  const createEditSectionRef = useRef(null);
  const tableContainerRef = useRef(null);

  // Key to force remount of table container on data change
  const [tableKey, setTableKey] = useState(0);

  // Reset table scroll to top on data updates
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [filteredRows]);

  // Add table columns configuration
  const cells = [
    { label: "ISP NAME", key: "ispName" },
    { label: "ISP CODE", key: "ispCode" },
    { label: "RETAILER", key: "retailerName" },
    { label: "MOBILE", key: "mobile" },
    { label: "EMAIL", key: "email" },
    { label: "AGENCY", key: "agencyName" },
    { label: "STATUS", sortable: false },
    { label: "EDIT", sortable: false },
  ];

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-isp");
    } else if (value === "batch") {
      navigate("/isp-upload");
    }
  };

  const handleDownload = async () => {
    try {
      const params = {
        callType: 1, //0=Upload target reference data, 1=isp Retailer ref data
      };
      const response = await getISPRetailerReferenceDataLink(params);
      if (response.statusCode === "200") {
        window.location.href = response?.referenceDataLink;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const templates = [
    {
      name: "Template",
      onView: () => console.log("Template View"),
      onDownload: handleDownload,
    },
  ];
  const getRetailerListDrpdown = async () => {
    setRetailerListLoading(true);
    try {
      const params = {
        retailerID: 0,
      };
      const response = await GetRetailerListDrpdown(params);
      if (response.statusCode === "200") {
        setRetailerList(response.retailerMasterList);
      } else {
        console.error("Failed to fetch retailer list:", response.error);
        setRetailerList([]);
      }
    } catch (error) {
      console.error("Error fetching retailer list:", error);
      setRetailerList([]);
    } finally {
      setRetailerListLoading(false);
    }
  };

  const getAgencyListDropdown = async () => {
    try {
      const response = await GetAgencyListDropdown();
      if (response.statusCode === "200") {
        setAgencyList(response.ispAgencyMasterList);
        console.log(response.ispAgencyMasterList);
      } else {
        setAgencyList([]);
      }
    } catch (error) {
      console.log(error);
      setAgencyList([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for the field upon change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = async () => {
    setFormLoading(true); // Show skeleton while reloading
    setFormData({
      ispId: 0,
      password: "",
      userName: "",
      passwordExpiryDays: 90,
      createLoginOrNot: 1,
      email: "",
      companyID: 0,
      ispName: "",
      ispCode: "",
      mobile: "",
      retailerID: 0,
      storeCode: "",
      joiningDate: "",
      fromDate: null,
      weekOffDay: 1,
      parentHeirarchyID: 0, // Ensure it's 0 on cancel
      agencyID: 0,
    });
    setErrors({}); // Clear errors on cancel

    try {
      // Reload all data
      getRetailerListDrpdown();
      getAgencyListDropdown();
    } catch (error) {
      console.error("Error reloading data:", error);
    } finally {
      setFormLoading(false); // Hide skeleton after reload completes
    }
  };

  const handlePostRequest = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    // Ensure fromDate is null if empty & format joiningDate
    const dataToSend = {
      ...formData,
      fromDate: formData.fromDate === "" ? null : formData.fromDate,
      joiningDate: formatDateForAPI(formData.joiningDate), // Format joiningDate
    };

    try {
      setFormLoading(true);
      const response = await SaveUpdateISPData(dataToSend);
      if (response.statusCode === "200") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
        handleCancel();
        fetchISPList(1, 10);
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setStatus(error.statusCode);
      setTitle(error.statusMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Accordion Handlers for exclusive expansion
  const handleCreateEditAccordionChange = (event, expanded) => {
    setCreateEditAccordionExpanded(expanded);
    if (expanded) {
      setSearchAccordionExpanded(false); // Close search if create/edit opens
    }
  };

  const handleSearchAccordionChange = (event, expanded) => {
    setSearchAccordionExpanded(expanded);
    if (expanded) {
      setCreateEditAccordionExpanded(false); // Close create/edit if search opens
    }
  };

  // Add handleSearch function
  const handleSearch = () => {
    setTableLoading(true);
    setPage(0);
    setRowsPerPage(10);
    setSearchStatus(null);
    setSearchTitle("");

    fetchISPList(1, 10);
  };

  // Update handleClearSearch function
  const handleClearSearch = () => {
    const clearedCriteria = {
      agencyID: 0,
      ispName: "",
      ispCode: "",
      storeCode: "",
      mobile: "",
      joiningDate: null,
    };
    setSearchFormData(clearedCriteria); // Update state for UI fields
    setPage(0);
    setRowsPerPage(10);
    setSearchStatus(null);
    setSearchTitle("");

    // Fetch with reset pagination and cleared criteria passed directly
    fetchISPList(1, 10, clearedCriteria);
  };

  // Add handleSearchChange function
  const handleSearchChange = (field, value) => {
    // Special handling for ISP selection to update both name and code
    if (field === "isp") {
      setSearchFormData((prev) => ({
        ...prev,
        ispName: value?.ispName || "", // Use empty string for consistency
        ispCode: value?.ispCode || "", // Use empty string for consistency
      }));
      return;
    }

    // Original logic for other fields
    if (value === null || value === undefined) {
      setSearchFormData((prev) => ({
        ...prev,
        [field]: field === "agencyID" ? 0 : "", // Reset based on field type
      }));
      return;
    }

    let newValue;
    if (typeof value === "object") {
      if (field === "retailerID" && value.retailerId !== undefined) {
        newValue = value.retailerId;
      } else if (field === "agencyID" && value.agencyId !== undefined) {
        newValue = value.agencyId;
      } else {
        newValue = value.value || value.id || 0; // Fallback, adjust if needed
      }
    } else {
      newValue = value;
    }

    setSearchFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  // Add handleSort function
  const handleSort = (columnName) => {
    let newSortConfig = { key: columnName, direction: "asc" };

    if (sortConfig.key === columnName) {
      // If clicking the same column
      if (sortConfig.direction === "asc") {
        // If current direction is 'asc', change to 'desc'
        newSortConfig.direction = "desc";
      } else {
        // If current direction is 'desc', reset sorting
        newSortConfig = { key: null, direction: null };
      }
    }
    // If clicking a new column, the default 'asc' direction is already set

    setSortConfig(newSortConfig);

    // Apply sorting to the current filteredRows
    const sortData = (data, config) => {
      // If no sorting is applied (reset), return the data as is
      if (!config || !config.key || !config.direction) {
        // We might want to return to the original order from tableData if needed,
        // but for now, just keep the current order when sorting is reset.
        // Returning [...tableData] might be an option if filters are not applied.
        return [...data];
      }

      // Create a copy and sort it
      return [...data].sort((a, b) => {
        // Handle potential null/undefined values safely
        const aValue =
          a[config.key] != null ? String(a[config.key]).toLowerCase() : "";
        const bValue =
          b[config.key] != null ? String(b[config.key]).toLowerCase() : "";

        if (aValue < bValue) {
          return config.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    };

    // Update the filteredRows state with the sorted data
    // Use functional update to ensure we sort the latest state
    setFilteredRows((currentRows) => sortData(currentRows, newSortConfig));
  };

  // Add handlePaginationChange function
  const handlePaginationChange = (paginationState) => {
    const newPageIndex = paginationState.page + 1;
    const newPageSize = paginationState.rowsPerPage;

    setPage(paginationState.page);
    setRowsPerPage(newPageSize);

    fetchISPList(newPageIndex, newPageSize);
  };

  // Modify fetchISPList to accept optional search criteria override
  const fetchISPList = async (
    currentPageIndex,
    currentPageSize,
    searchCriteriaOverride = null // Optional override parameter
  ) => {
    setTableLoading(true);
    try {
      // Use override if provided, otherwise use state
      const currentSearchCriteria = searchCriteriaOverride || searchFormData;

      // Construct the API parameters strictly as requested
      const apiParams = {
        ispId: 0,
        activeStatus: 2,
        ispName: currentSearchCriteria.ispName || "",
        ispCode: currentSearchCriteria.ispCode || "",
        storeCode: currentSearchCriteria.storeCode || "",
        retailerID: 0,
        pageIndex: currentPageIndex,
        pageSize: currentPageSize,
        joiningDate: formatDateForAPI(currentSearchCriteria.joiningDate),
        mobile: currentSearchCriteria.mobile || "",
        agencyId: currentSearchCriteria.agencyID || 0,
        selectionMode: 0,
      };

      console.log("Sending params to GetISPList:", apiParams);

      const response = await GetISPList(apiParams);
      if (response.statusCode === "200") {
        console.log(response.ispListItems);
        setFilteredRows(response.ispListItems || []);
        setTotalRecords(response.totalRecords || 0);
        // Increment table key to force remount and reset scroll
        setTableKey((prev) => prev + 1);
      } else {
        setFilteredRows([]);
        setTotalRecords(0);
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
    } catch (error) {
      setFilteredRows([]);
      setTotalRecords(0);
      setSearchStatus(error.statusCode || 500);
      setSearchTitle(error.statusMessage || "An error occurred");
      console.log("Error fetching ISP list:", error);
    } finally {
      setTableLoading(false);
    }
  };

  // Add handleStatus function
  const handleStatus = async (row) => {
    const originalStatus = row.status;
    const newStatus = originalStatus === 1 ? 0 : 1;

    // Optimistically update the UI
    setFilteredRows((currentRows) =>
      currentRows.map((item) =>
        item.ispid === row.ispid ? { ...item, status: newStatus } : item
      )
    );

    try {
      const params = { ispId: row.ispid };
      const response = await UpdateStatusISP(params);
      if (response.statusCode === "200") {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
        // Refresh the current page to confirm the change and get latest data
        // fetchISPList is important to ensure data consistency, especially if other users might modify data
        fetchISPList(page + 1, rowsPerPage);
      } else {
        // Revert optimistic update on API error
        setFilteredRows((currentRows) =>
          currentRows.map((item) =>
            item.ispid === row.ispid ? { ...item, status: originalStatus } : item
          )
        );
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
    } catch (error) {
      console.log(error);
      // Revert optimistic update on network/other error
      setFilteredRows((currentRows) =>
        currentRows.map((item) =>
          item.ispid === row.ispid ? { ...item, status: originalStatus } : item
        )
      );
      setSearchStatus(error.statusCode || 500); // Use 500 as default for catch
      setSearchTitle(error.statusMessage || "Failed to update status");
    }
  };

  // Add handleEdit function
  const handleEdit = (row) => {
    setFormData({
      ispId: row.ispid,
      passwordExpiryDays: row.passwordExpiryDays || 90,
      createLoginOrNot: row.createLoginOrNot || 1,
      email: row.email || "",
      companyID: row.companyID || 0,
      ispName: row.ispName || "",
      ispCode: row.ispCode || "",
      mobile: row.mobile || "",
      retailerID: row.retailerID || 0,
      storeCode: row.storeCode || "",
      joiningDate: row.joiningDate || "",
      fromDate: row.fromDate || null,
      weekOffDay: row.weekOffDay || 1,
      parentHeirarchyID: 0, // Ensure it's 0 on edit
      agencyID: row.agencyID || 0,
      userName: row.loginName || "",
      password: row.password || "",
    });

    // Control accordion states
    setCreateEditAccordionExpanded(true);
    setSearchAccordionExpanded(false);

    // Scroll the create/edit section into view (centered)
    setTimeout(() => {
      // Use timeout to ensure DOM update before scrolling
      // window.scrollTo({ top: 0, behavior: 'smooth' }); // Revert window scroll
      createEditSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }); // Use block: center like BrandPage
    }, 100);
  };

  // Add handleExport function
  const handleExport = async () => {
    try {
      setTableLoading(true);
      const exportParams = {
        ispName: "",
        ispCode: "",
        storeCode: "",
        joiningDate: null,
        mobile: "",
        activeStatus: 101, // 101= for all, 1= active, 0 = inactive
        agencyId: 0,
      };
      const response = await getISPMasterDataLink(exportParams);
      if (response.statusCode === "200" && response.referenceDataLink) {
        window.location.href = response.referenceDataLink;
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Export failed");
      }
    } catch (error) {
      console.error("Error exporting ISP list:", error);
      setSearchStatus(500);
      setSearchTitle("Failed to export data");
    } finally {
      setTableLoading(false);
    }
  };

  const handleCheckboxChange = (row, checked) => {
    console.log("handleCheckboxChange triggered:", {
      ispid: row.ispid,
      checked,
    });
    console.log("selectedRows BEFORE update:", selectedRows);
    // If checked, select only this row; otherwise clear all selections
    setActionLabel("");
    if (checked) {
      // Replace the entire selectedRows object with only this selection
      setSelectedRows({ [row.ispid]: true });
      setSelectedIspDetails(row);
      if (row.mapDisplayCount === 1) {
        setActionLabel("RETAILER");
      } else {
        setActionLabel("MAPPING");
      }
      if (row.mapDisplayCount === 1) {
        setActionLabel("RETAILER");
      } else {
        setActionLabel("MAPPING");
      }
    } else {
      // Clear all selections
      setSelectedRows({});
      setSelectedIspDetails(null);
      setActionLabel("");
    }
    // Use a useEffect to log the state *after* the update, as setState is async
  };

  // Add a useEffect to log state changes
  useEffect(() => {
    console.log("selectedRows AFTER update:", selectedRows);
  }, [selectedRows]);

  // Effect to auto-close success status model for create/edit section
  useEffect(() => {
    let timerId;
    if (status === '200') {
      timerId = setTimeout(() => {
        setStatus(null);
        setTitle(''); // Also clear the title
      }, 5000); // 5 seconds
    }
    // Cleanup function to clear the timeout if status changes or component unmounts
    return () => clearTimeout(timerId);
  }, [status]); // Re-run effect if status changes

  // Effect to auto-close success status model for search/view section
  useEffect(() => {
    let timerId;
    if (searchStatus === '200') {
      timerId = setTimeout(() => {
        setSearchStatus(null);
        setSearchTitle(''); // Also clear the search title
      }, 5000); // 5 seconds
    }
    // Cleanup function to clear the timeout if searchStatus changes or component unmounts
    return () => clearTimeout(timerId);
  }, [searchStatus]); // Re-run effect if searchStatus changes

  // Effect to auto-close success status model for NuralRetailer
  useEffect(() => {
    let timerId;
    if (retailerStatus === '200') {
      timerId = setTimeout(() => {
        setRetailerStatus(null);
        setRetailerTitle(''); // Also clear the retailer title
      }, 5000); // 5 seconds
    }
    // Cleanup function to clear the timeout if retailerStatus changes or component unmounts
    return () => clearTimeout(timerId);
  }, [retailerStatus]); // Re-run effect if retailerStatus changes

  useEffect(() => {
    const fetchInitialData = async () => {
      // Set all loading states to true initially
      setFormLoading(true);
      setSearchFormLoading(true);
      setTableLoading(true);
      try {
        await Promise.all([
          getRetailerListDrpdown(),
          getAgencyListDropdown(),
          fetchISPList(1, 10),
          getIspDrodpown(), // Include getIspDrodpown here
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        // Set all loading states to false after fetching
        setFormLoading(false);
        setSearchFormLoading(false);
        setTableLoading(false);
      }
    };

    fetchInitialData();
    // getIspDrodpown(); // Moved inside fetchInitialData
  }, []);

  const getIspDrodpown = async () => {
    try {
      const params = {
        ispID: 0, //0 = to get all list, RetailerID= to get specific retailer
      };
      const response = await GetISPListDrpdown(params);

      if (response.statusCode === "200") {
        setIspList(response.ispDropdownList);
        // alert('success')
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setIspList([]);
    }
  };

  // Add validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.retailerID || formData.retailerID === 0) {
      newErrors.retailerID = "Retailer is required";
    }
    if (!formData.ispName?.trim()) {
      newErrors.ispName = "ISP Name is required";
    }
    if (!formData.ispCode?.trim()) {
      newErrors.ispCode = "ISP Code is required";
    }
    if (!formData.mobile?.trim()) {
      newErrors.mobile = "Mobile No. is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile No. must be 10 digits";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email ID is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email ID is invalid";
    }
    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining Date is required";
    }
    if (!formData.agencyID || formData.agencyID === 0) {
      newErrors.agencyID = "Agency is required";
    }
    if (!formData.userName?.trim()) {
      newErrors.userName = "User Name is required";
    }
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Callback handler for NuralRetailer update
  const handleRetailerUpdate = async (data) => {
    const { newItemId, effectiveDate, currentItem } = data;
    const currentMappingId = currentItem?.retailerISPMappingID ?? 0;

    // Determine mode based on actionLabel (logic moved from NuralRetailer)
    const modeToExecute = actionLabel === "MAPPING" ? 1 : 2;

    const params = {
      retailerID: newItemId,
      ispId: currentItem.ispid,
      fromDate: formatDateForAPI(effectiveDate), // Ensure date format
      mode: modeToExecute,
      retailerISPMappingID: currentMappingId,
    };

    console.log("UpdateISPMappingToNewRetailer Params:", params);

    try {
      const response = await UpdateISPMappingToNewRetailer(params);
      if (response.statusCode === "200") {
        // Use StatusModel for success feedback via retailerStatus
        setRetailerStatus(response.statusCode);
        setRetailerTitle(
          response.statusMessage || "Retailer updated successfully"
        );
        // Clear selection/refresh list
        setSelectedIspDetails(null);
        setSelectedRows({});
        setActionLabel("");
        fetchISPList(1, 10); // Refresh list
      } else {
        // Use StatusModel for failure feedback via retailerStatus
        setRetailerStatus(response.statusCode || "500");
        setRetailerTitle(
          response.statusMessage ||
            response.error ||
            "Failed to update retailer"
        );
      }
    } catch (error) {
      console.error("Error in handleRetailerUpdate:", error);
      // Use StatusModel for catch block error via retailerStatus
      setRetailerStatus(error.statusCode || "500");
      setRetailerTitle(
        error.statusMessage ||
          "An unexpected error occurred while updating retailer"
      );
    }
  };

  // Callback handler for NuralRetailer exit
  const handleIspExit = async (data) => {
    const { currentItem } = data;
    const currentMappingId = currentItem?.retailerISPMappingID ?? 0;

    const params = {
      mode: 4,
      endDate: formatDateForAPI(new Date()), // Format current date
      retailerISPMappingID: currentMappingId,
    };

    console.log("ExitISP Params:", params);

    try {
      const response = await ExitISP(params);
      if (response.statusCode === "200") {
        // Use StatusModel for success feedback via retailerStatus
        setRetailerStatus(response.statusCode);
        setRetailerTitle(response.statusMessage || "ISP exited successfully");
        // Clear selection/refresh list
        setSelectedIspDetails(null);
        setSelectedRows({});
        setActionLabel("");
        fetchISPList(1, 10); // Refresh list
      } else {
        // Use StatusModel for failure feedback via retailerStatus
        setRetailerStatus(response.statusCode || "500");
        setRetailerTitle(
          response.statusMessage || response.error || "Failed to exit ISP"
        );
      }
    } catch (error) {
      console.error("Error in handleIspExit:", error); 
      // Use StatusModel for catch block error via retailerStatus
      setRetailerStatus(error.statusCode || "500");
      setRetailerTitle(
        error.statusMessage || "An unexpected error occurred while exiting ISP"
      );
      // Do not re-throw error, let StatusModel handle display
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pl: { xs: 1, sm: 1, md: 0 },
        pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
      }}
    >
      {/* Header section - Full width on all devices */}
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: "#fff",
          pb: 1,
        }}
      >
        <Grid item xs={12} mt={3} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="ISP" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Conditionally render Create/Edit Section or Skeleton */}
      {formLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} px={2} mt={1} ref={createEditSectionRef}>
          {/* Store Details section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Store Details"
                  backgroundColor={LIGHT_GRAY2}
                  expanded={createEditAccordionExpanded}
                  onChange={handleCreateEditAccordionChange}
                  controlled={true}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: { xs: "12px", sm: "14px" },
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      mb: 3,
                    }}
                  >
                    Store Details
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Form fields - 2 columns on tablet */}
                    <Grid item xs={12} sm={12}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        SELECT MODE
                      </Typography>
                      <Grid item xs={12} md={12} lg={12} ml={0} mt={1}>
                        <NuralRadioButton
                          onChange={handleFormatChange}
                          options={[
                            { value: "interface", label: "Interface" },
                            { value: "batch", label: "Batch" },
                          ]}
                          value={selectedFormat}
                          width="100%"
                          gap="5px"
                        />
                      </Grid>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        RETAILER CODE <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={retailerList}
                        getOptionLabel={(option) => option.retailerCode || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        value={
                          retailerList.find(
                            (item) => item.retailerId === formData.retailerID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("retailerID", newValue?.retailerId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        loading={retailerListLoading}
                        filterOptions={filterOptions}
                        error={!!errors.retailerID}
                      />
                      {errors.retailerID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.retailerID}
                        </Typography>
                      )}
                    </Grid> */}
                  </Grid>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        RETAILER CODE <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={retailerList}
                        getOptionLabel={(option) => option.retailerCode || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        value={
                          retailerList.find(
                            (item) => item.retailerId === formData.retailerID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("retailerID", newValue?.retailerId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        loading={retailerListLoading}
                        filterOptions={filterOptions}
                        error={!!errors.retailerID}
                      />
                      {errors.retailerID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.retailerID}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        RETAILER NAME <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={retailerList}
                        getOptionLabel={(option) => option.retailerName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        value={
                          retailerList.find(
                            (item) => item.retailerId === formData.retailerID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("retailerID", newValue?.retailerId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        loading={retailerListLoading}
                        filterOptions={filterOptions}
                        error={!!errors.retailerID}
                      />
                      {errors.retailerID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.retailerID}
                        </Typography>
                      )}
                    </Grid>

                    {/* Reporting Hierarchy Field Removed */}
                  </Grid>
                </NuralAccordion2>
                <Grid item mt={2}>
                  <NuralAccordion
                    titleColor={DARK_PURPLE}
                    backgroundColor={LIGHT_GRAY2}
                    buttonColor={PRIMARY_BLUE2}
                    buttonBg={MEDIUM_BLUE}
                    width="100%"
                    referenceIcon1={"./Icons/downloadIcon.svg"}
                    referenceIcon2={"./Icons/downloadIcon.svg"}
                    title="Reference Data"
                    buttons={false}
                    templates={templates}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Personal Details section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Personal Details"
                  backgroundColor={LIGHT_GRAY2}
                  expanded={createEditAccordionExpanded}
                  onChange={handleCreateEditAccordionChange}
                  controlled={true}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: { xs: "12px", sm: "14px" },
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      mb: 3,
                    }}
                  >
                    Personal Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        ISP NAME <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.ispName}
                        onChange={(e) =>
                          handleChange("ispName", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER ISP NAME"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.ispName}
                      />
                      {errors.ispName && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.ispName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        ISP CODE <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.ispCode}
                        onChange={(e) =>
                          handleChange("ispCode", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER ISP CODE"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.ispCode}
                      />
                      {errors.ispCode && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.ispCode}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        MOBILE NO. <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        width="100%"
                        placeholder="ENTER MOBILE NO."
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.mobile}
                        type="tel"
                        inputProps={{ maxLength: 10 }}
                      />
                      {errors.mobile && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.mobile}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        EMAIL ID <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        width="100%"
                        placeholder="ENTER EMAIL ID"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.email}
                        type="email"
                      />
                      {errors.email && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.email}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        JOINING DATE <Required />
                      </Typography>
                      <NuralCalendar
                        value={formData.joiningDate}
                        onChange={(value) => handleChange("joiningDate", value)}
                        placeholder="DD/MMM/YYYY"
                        error={!!errors.joiningDate}
                        disableFutureDates={false}
                      />
                      {errors.joiningDate && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.joiningDate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        AGENCY <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={agencyList}
                        getOptionLabel={(option) => option.agencyName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.agencyId === value?.agencyId
                        }
                        value={
                          agencyList.find(
                            (item) => item.agencyId === formData.agencyID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("agencyID", newValue?.agencyId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.agencyID}
                      />
                      {errors.agencyID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.agencyID}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        USER NAME <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.userName}
                        onChange={(e) =>
                          handleChange("userName", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER USER NAME"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.userName}
                      />
                      {errors.userName && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.userName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: { xs: "10px", sm: "10px" },
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        PASSWORD <Required />
                      </Typography>
                      <NuralTextField
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER PASSWORD"
                        backgroundColor={LIGHT_BLUE}
                        error={!!errors.password}
                        type="password"
                      />
                      {errors.password && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.password}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              {createEditAccordionExpanded && (
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                      {status && (
                        <StatusModel
                          status={status}
                          title={title}
                          onClose={() => {
                            setStatus(null);
                            setTitle("");
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancel}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <NuralButton
                        text="PROCEED"
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={handlePostRequest}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Conditionally render Search/View Section or Skeleton */}
      {searchFormLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} px={2} mt={2}>
          <NuralAccordion2
            title="View"
            backgroundColor={LIGHT_GRAY2}
            onChange={handleSearchAccordionChange}
            controlled={true}
            expanded={searchAccordionExpanded}
            defaultExpanded={false}
          >
            <Grid container spacing={2}>
              {/* Search fields - 3 columns on tablet */}
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  AGENCY CODE
                </Typography>
                <NuralAutocomplete
                  options={agencyList}
                  getOptionLabel={(option) => option.agencyName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.agencyId === value?.agencyId
                  }
                  value={
                    agencyList.find(
                      (item) => item.agencyId === searchFormData.agencyID
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    handleSearchChange("agencyID", newValue || null);
                  }}
                  placeholder="SELECT"
                  width="100%"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  ISP NAME
                </Typography>

                {/*  {
            "ispID": 33176,
            "ispName": "asdfghj",
            "ispCode": "1234567"
        }, */}
                <NuralAutocomplete
                  options={isplist}
                  getOptionLabel={(option) => option.ispName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.ispID === value?.ispID
                  }
                  value={
                    isplist.find(
                      (item) => item.ispName === searchFormData.ispName
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    handleSearchChange("isp", newValue)
                  }
                  width="100%"
                  placeholder="SELECT"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  ISP CODE
                </Typography>
                <NuralAutocomplete
                  options={isplist}
                  getOptionLabel={(option) => option.ispCode || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.ispID === value?.ispID
                  }
                  value={
                    isplist.find(
                      (item) => item.ispCode === searchFormData.ispCode
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    handleSearchChange("isp", newValue)
                  }
                  width="100%"
                  placeholder="SELECT"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  STORE CODE
                </Typography>
                <NuralTextField
                  value={searchFormData.storeCode}
                  onChange={(e) =>
                    handleSearchChange("storeCode", e.target.value)
                  }
                  width="100%"
                  placeholder="ENTER STORE CODE"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  MOBILE NO
                </Typography>
                <NuralTextField
                  value={searchFormData.mobile}
                  onChange={(e) => handleSearchChange("mobile", e.target.value)}
                  width="100%"
                  placeholder="ENTER MOBILE NO"
                  backgroundColor={LIGHT_GRAY2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  JOINING DATE
                </Typography>
                <NuralCalendar
                  value={searchFormData.joiningDate}
                  onChange={(value) =>
                    handleSearchChange("joiningDate", value || null)
                  }
                  placeholder="DD/MMM/YYYY"
                />
              </Grid>
            </Grid>

            {/* Search buttons - Responsive layout */}
            <Grid container spacing={1} mt={1}>
              <Grid item xs={12} sm={2} md={1}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  color={PRIMARY_BLUE2}
                  fontSize="12px"
                  height="36px"
                  borderColor={PRIMARY_BLUE2}
                  onClick={handleClearSearch}
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
                  onClick={handleSearch}
                >
                  SEARCH
                </NuralTextButton>
              </Grid>
            </Grid>
          </NuralAccordion2>
        </Grid>
      )}

      {/* Table section - Full width with responsive padding */}
      <Grid item xs={12} mt={2} sx={{ p: { xs: 1, sm: 2 } }}>
        <Grid container sx={{ width: "100%", marginBottom: "10px" }}>
          {/* Status model for search results/errors */}
          {searchStatus && (
            <StatusModel
              width="100%"
              status={searchStatus}
              title={searchTitle}
              onClose={() => setSearchStatus(null)}
            />
          )}
        </Grid>
        {retailerStatus && (
              <StatusModel
                width="100%"
                status={retailerStatus}
                title={retailerTitle}
                onClose={() => {
                  setRetailerStatus(null);
                  setRetailerTitle('');
                }}
              />
            )}

        {/* Conditionally render TableContainer and Pagination */}
        {/* Show only if there is no searchStatus or if searchStatus is success ('200') */}
        {(!searchStatus || searchStatus === "200") && (
          <>
            <TableContainer key={tableKey} ref={tableContainerRef}
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 90px)",
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
                      colSpan={8}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 1100,
                        borderBottom: "none",
                        boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
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
                        </Grid>
                        <Grid item>
                          <Grid
                            item
                            sx={{
                              cursor: "pointer",
                              mr: 2,
                            }}
                            onClick={handleExport}
                          >
                            {/* <img src="./Images/export.svg" alt="export" /> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                    {cells.map((cell, index) => (
                      <TableCell
                        key={index}
                        onClick={() => cell.sortable && handleSort(cell.key)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: cell.sortable ? "pointer" : "default",
                          position: "sticky",
                          top: "45px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{cell.label}</Grid>
                          {cell.sortable && (
                            <Grid
                              item
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {sortConfig.key === cell.key ? (
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
                  {tableLoading ? (
                    // Render Skeleton when loading
                    Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                      <TableRow key={`skeleton-row-${rowIndex}`}>
                        {Array.from({ length: 10 }).map((_, cellIndex) => (
                          <TableCell
                            key={`skeleton-cell-${rowIndex}-${cellIndex}`}
                            sx={{ ...rowstyle }}
                          >
                            <Skeleton animation="wave" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : Array.isArray(filteredRows) && filteredRows.length > 0 ? (
                    // Render rows if data exists
                    <>
                      {filteredRows.map((row) => {
                        // Log inside the map function during render
                        console.log(
                          `Rendering row ${row.ispid}: selectedRows state is:`,
                          selectedRows,
                          ` - isSelectedValue: ${Boolean(
                            selectedRows[row.ispid]
                          )}`
                        );
                        return (
                          <TableRow
                            key={row.ispid}
                            sx={{
                              backgroundColor: selectedRows[row.ispid]
                                ? DARK_PURPLE
                                : "inherit",
                              color: selectedRows[row.ispid]
                                ? "#FFFFFF"
                                : "inherit",
                              "& .MuiTableCell-root": {
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <CustomCheckbox
                                  checked={Boolean(selectedRows[row.ispid])}
                                  onChange={(e) =>
                                    handleCheckboxChange(row, e.target.checked)
                                  }
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "6px",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E0E0E0",
                                    marginRight: "8px",
                                    "&.Mui-checked": {
                                      backgroundColor: "#FFFFFF",
                                      "& .MuiSvgIcon-root": {
                                        color: DARK_PURPLE,
                                      },
                                    },
                                    "& .MuiSvgIcon-root": {
                                      fontSize: 20,
                                    },
                                  }}
                                />
                                {row.ispName}
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {row.ispCode}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {row.storeCode}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {row.mobile}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {row.userName}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              {row.password}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...rowstyle,
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              <Switch
                                checked={row.status === 1}
                                onChange={() => handleStatus(row)}
                                size="small"
                                sx={toggleSectionStyle}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px 16px",
                                fontSize: "10px",
                                textAlign: "left",
                                minWidth: "60px",
                                color: selectedRows[row.ispid]
                                  ? "#FFFFFF"
                                  : "inherit",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row)}
                                sx={{
                                  color: selectedRows[row.ispid]
                                    ? "#FFFFFF"
                                    : PRIMARY_BLUE2,
                                }}
                              >
                                <EditIcon
                                  sx={{
                                    fontSize: 16,
                                    color: selectedRows[row.ispid]
                                      ? "#FFFFFF"
                                      : PRIMARY_BLUE2,
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    // Render "No data available" if no rows and not loading
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <NuralPagination
                key={`pagination-${page}-${rowsPerPage}`}
                totalRecords={totalRecords}
                initialPage={page}
                initialRowsPerPage={rowsPerPage}
                onPaginationChange={handlePaginationChange}
              />
            </TableContainer>
          </>
        )}
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        mt={0}
        mr={0}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 0,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          right: "1rem",
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
          <Grid item xs={12} md={12} lg={12} xl={12} mt={0}>
            {/* Status model for NuralRetailer actions */}
           
            <NuralRetailer
              title="Details"
              itemNameLabel="RETAILER"
              selectedItem={selectedIspDetails}
              itemList={retailerList}
              itemListLoading={retailerListLoading}
              itemIdField="retailerId"
              itemPrimaryDisplayField="retailerName"
              itemSecondaryDisplayField="retailerCode"
              filterOptions={filterOptions}
              actionLabel={actionLabel}
              onUpdate={handleRetailerUpdate}
              onExit={handleIspExit}
              showExitButton={true}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralExport
              title="Export "
              views={""}
              downloadExcel={handleExport}
              // isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>

      {/* Add Status Model */}
    </Grid>
  );
};

export default AddIsp;
