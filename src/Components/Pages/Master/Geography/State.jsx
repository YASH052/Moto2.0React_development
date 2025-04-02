import { Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  LIGHT_BLUE,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralPagination from "../../../Common/NuralPagination";
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
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import {
  Countrymasterlist,
  GetRegionListDropdown,
  GetStateListForDropdown,
  GetStateListForMoto,
  ManageStateAPIForMoto,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import Required from "../../../Common/Required";

const tabs = [
  { label: "Upload", value: "geography-bulk-upload" },
  { label: "Country", value: "country" },
  { label: "State", value: "state" },
  { label: "City", value: "city" },
  { label: "Area", value: "area" },
];

const State = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("state");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [searchParams, setSearchParams] = useState({
    stateID: 0,
    stateName: "",
    stateCode: "",
    countryID: 0,
    regionID: 0,
    selectionMode: 2, //2 will be pass
    pageIndex: 1, //1-UI,-1-Export to excel
    pageSize: 10,
  });

  const [formData, setFormData] = useState({
    stateID: 0,
    stateName: "",
    stateCode: "",
    status: 1, //1-Active,0-Deactive
    countryID: 0,
    regionID: 0,
    callType: 1 /*1=Insert, 2=Update, 3=Status Update*/,
  });
  const [country, setCountry] = useState([]);
  const [region, setRegion] = useState([]);
  const [state, setState] = useState([]);

  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [countrySearch, setCountrySearch] = useState([]);
  const [regionSearch, setRegionSearch] = useState([]);
  const [statusSearch, setStatusSearch] = useState(null);
  const [titleSearch, setTitleSearch] = useState("");

  // Add loading states
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);

  // Add accordion state
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(true);

  // Add accordion change handlers
  const handleAccordionChange = (event, expanded) => {
    setAccordionExpanded(expanded);
  };

  const handleSearchAccordionChange = (event, expanded) => {
    setSearchAccordionExpanded(expanded);
  };

  // Add a useRef to store the timer ID
  const statusTimerRef = useRef(null);

  // Add useEffect to handle auto-dismiss for success messages
  useEffect(() => {
    // Only set timer for success messages (status code 200)
    if (statusSearch === "200") {
      // Clear any existing timer
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }

      // Set new timer to clear status after 5 seconds
      statusTimerRef.current = setTimeout(() => {
        setStatusSearch(null);
      }, 5000); // 5000ms = 5 seconds
    }

    // Cleanup function to clear timer when component unmounts or statusSearch changes
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [statusSearch]); // Only run effect when statusSearch changes

  // Add error state
  const [errors, setErrors] = useState({});

  // Add validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.countryID) {
      newErrors.countryID = "Country is required";
    }

    if (!formData.regionID) {
      newErrors.regionID = "Region is required";
    }

    if (!formData.stateName || formData.stateName.trim() === "") {
      newErrors.stateName = "State Name is required";
    } else if (formData.stateName.length > 50) {
      newErrors.stateName = "State Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.stateName)) {
      newErrors.stateName =
        "State Name can only contain alphanumeric characters and spaces";
    }

    if (!formData.stateCode || formData.stateCode.trim() === "") {
      newErrors.stateCode = "State Code is required";
    } else if (formData.stateCode.length > 50) {
      newErrors.stateCode = "State Code cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.stateCode)) {
      newErrors.stateCode =
        "State Code can only contain alphanumeric characters (no spaces)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCountry = async () => {
    try {
      setFormLoading(true);
      const params = {
        CountryName: "",
        CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
        pageIndex: 1 /*-1 for export to excel */,
        pageSize: 10,
      };
      const response = await Countrymasterlist(params);
      if (response.statusCode === "200") {
        setCountry(response.countryMasterList);
        console.log(response.countryMasterList);
      }
      setFormLoading(false);
    } catch (error) {
      console.error("Error in getCountry:", error);
      setFormLoading(false);
    }
  };

  const getCountrySearch = async () => {
    try {
      setSearchFormLoading(true);
      const params = {
        CountryName: "",
        CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
        pageIndex: 1 /*-1 for export to excel */,
        pageSize: 10,
      };
      const response = await Countrymasterlist(params);
      if (response.statusCode === "200") {
        setCountrySearch(response.countryMasterList);
        console.log(response.countryMasterList);
      }
      setSearchFormLoading(false);
    } catch (error) {
      console.error("Error in getCountry:", error);
      setSearchFormLoading(false);
    }
  };

  const getRegion = async (countryID = 0) => {
    try {
      const params = {
        countryID: countryID || 0,
        regionID: 0,
      };
      const response = await GetRegionListDropdown(params);
      if (response.statusCode === "200") {
        setRegion(response.regionDropdownList);
        console.log(response.regionDropdownList);
      }
    } catch (error) {
      console.error("Error in getRegion:", error);
    }
  };

  const getRegionSearch = async (countryID = 0) => {
    try {
      const params = {
        countryID: countryID || 0,
        regionID: 0,
      };
      const response = await GetRegionListDropdown(params);
      if (response.statusCode === "200") {
        setRegionSearch(response.regionDropdownList);
        console.log(response.regionDropdownList);
      }
    } catch (error) {
      console.error("Error in getRegionSearch:", error);
    }
  };

  const getState = async (params = searchParams) => {
    try {
      setTableLoading(true);
      setHasSearchError(false);
      const response = await GetStateListForMoto(params);

      if (response.statusCode === "200") {
        setTableData(response.stateMasterList);
        setTotalRecords(response.totalRecords);
        // Only set status for empty results or specific messages
        if (response.stateMasterList.length === 0) {
          setStatusSearch(response.statusCode);
          setTitleSearch("No records found");
        } else {
          // Don't show status for successful data fetch
          setStatusSearch(null);
          setTitleSearch("");
        }
      } else if (response.statusCode === "400") {
        setHasSearchError(true);
        setStatusSearch(response.statusCode);
        setTitleSearch(response.StatusMessage);
      } else if (response.statusCode === "500") {
        setHasSearchError(true);
        setStatusSearch(response.statusCode);
        setTitleSearch("Internal Server Error");
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Error in getState:", error);
      setHasSearchError(true);
      setStatusSearch(error.statusCode || "500");
      setTitleSearch("Internal Server Error");
      setTableLoading(false);
    }
  };

  const getStateSearch = async (countryID = 0, regionID = 0) => {
    try {
      const params = {
        countryID: countryID || 0,
        regionID: regionID || 0,
        stateID: 0,
      };
      const response = await GetStateListForDropdown(params);
      if (response.statusCode === "200") {
        setState(response.stateDropdownList);
        console.log("States loaded:", response.stateDropdownList);
      }
    } catch (error) {
      console.error("Error in getStateSearch:", error);
    }
  };
  useEffect(() => {
    getCountry();
    getCountrySearch();
    getState();
    // getStateSearch();
  }, []);

  // Add this new useEffect to set loading states to false once data is loaded
  useEffect(() => {
    if (country.length > 0) {
      setFormLoading(false);
    }

    if (countrySearch.length > 0) {
      setSearchFormLoading(false);
    }

    if (tableData.length > 0 || totalRecords === 0) {
      setTableLoading(false);
    }
  }, [country, countrySearch, tableData, totalRecords]);

  // {
  //     "statusCode": "200",
  //     "statusMessage": "Data fetched successfully.",
  //     "totalRecords": 14,
  //     "filepathlink": "http://moto.nuralsales.com/Excel/Reports/StateList26Mar25104742_4067.xlsx",
  //     "stateMasterList": []
  // }
  const downloadExcel = async () => {
    try {
      const params = {
        ...searchParams,
        pageIndex: -1, //1-UI,-1-Export to excel
      };
      const response = await GetStateListForMoto(params);
      if (response.statusCode === "200") {
        window.location.href = response?.filepathlink;
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);
      } else if (response.statusCode === "400") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);
      } else if (response.statusCode === "500") {
        setStatusSearch(response.statusCode);
        setTitleSearch("Internal Server Error");
      }
    } catch (error) {
      console.error("Error in downloadExcel:", error);
      setStatusSearch(error.statusCode || "500");
      setTitleSearch("Internal Server Error");
    }
  };

  // Create a filteredRows state that's initialized from tableData
  const [filteredRows, setFilteredRows] = React.useState([]);

  // Add an effect to update filteredRows when tableData changes
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setFilteredRows([...tableData]);
    }
  }, [tableData]);

  // Update handleSort to work with the API data structure
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...tableData]); // Reset to original data from API
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      const aValue = a[columnName]?.toString().toLowerCase() || "";
      const bValue = b[columnName]?.toString().toLowerCase() || "";

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

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Update the handleChange function to reset dependent dropdowns when a value is cleared
  const handleChange = (field, value) => {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "countryID") {
        setFormData((prev) => ({
          ...prev,
          countryID: 0,
          regionID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          countryID: "Country is required",
        }));
        // Clear region options when country is cleared
        setRegion([]);
        return;
      } else if (field === "regionID") {
        setFormData((prev) => ({
          ...prev,
          regionID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          regionID: "Region is required",
        }));
        return;
      }
    }

    // Extract value from object if needed
    let newValue = value;
    if (typeof value === "object") {
      if (field === "countryID" && value.countryID !== undefined) {
        newValue = value.countryID;
      } else if (field === "regionID" && value.regionID !== undefined) {
        newValue = value.regionID;
      }
    }

    // Special handling for state code field
    if (field === "stateCode") {
      // Check if this is a paste event (value length > 1)
      if (typeof newValue === "string" && newValue.length > 1) {
        // Trim whitespace for pasted content
        newValue = newValue.trim();
      }
      
      // Check for whitespace in the input
      if (newValue.includes(' ')) {
        setErrors((prev) => ({
          ...prev,
          stateCode: "State Code cannot contain spaces",
        }));
        return; // Don't update the value if it contains spaces
      }
      
      // Remove any non-alphanumeric characters
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Clear error when valid value is entered
    if (newValue) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Validate specific fields
    if (field === "stateName") {
      if (!newValue || newValue.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          stateName: "State Name is required",
        }));
      } else if (newValue.length > 50) {
        setErrors((prev) => ({
          ...prev,
          stateName: "State Name cannot exceed 50 characters",
        }));
      } else if (!/^[a-zA-Z0-9 ]+$/.test(newValue)) {
        setErrors((prev) => ({
          ...prev,
          stateName:
            "State Name can only contain alphanumeric characters and spaces",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          stateName: "",
        }));
      }
    }

    if (field === "stateCode") {
      if (!newValue || newValue.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          stateCode: "State Code is required",
        }));
      } else if (newValue.length > 50) {
        setErrors((prev) => ({
          ...prev,
          stateCode: "State Code cannot exceed 50 characters",
        }));
      } else if (!/^[a-zA-Z0-9]+$/.test(newValue)) {
        setErrors((prev) => ({
          ...prev,
          stateCode:
            "State Code can only contain alphanumeric characters (no spaces)",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          stateCode: "",
        }));
      }
    }

    // Handle country changes - with new logic for clearing
    if (field === "countryID") {
      if (value) {
        // Country selected - reset region and state fields and fetch new regions
        setFormData((prevData) => ({
          ...prevData,
          regionID: 0,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        getRegion(value?.countryID || null);
      } else {
        // Country cleared - reset all dependent fields
        setRegion([]); // Reset region dropdown options
        setState([]); // Reset state dropdown options
        setFormData((prevData) => ({
          ...prevData,
          regionID: 0,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
      }
    }

    // Handle region changes - with new logic for clearing
    if (field === "regionID") {
      if (value) {
        // Region selected - reset state fields and fetch new states
        setFormData((prevData) => ({
          ...prevData,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        // getStateSearch(formData.countryID, value);
      } else {
        // Region cleared - reset all state-related fields
        setFormData((prevData) => ({
          ...prevData,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        setState([]); // Reset state dropdown options
      }
    }

    // Auto-fill logic for state name/code - unchanged
    if (field === "stateName" && value) {
      const stateObj = state.find((s) => s.stateName === value);
      if (stateObj) {
        setFormData((prevData) => ({
          ...prevData,
          stateCode: stateObj.stateCode,
          stateID: stateObj.stateID,
        }));
      }
    } else if (field === "stateName" && !value) {
      // State name cleared - reset state code and ID
      setFormData((prevData) => ({
        ...prevData,
        stateCode: "",
        stateID: 0,
      }));
    }

    // Auto-fill logic when state code is changed - unchanged
    if (field === "stateCode" && value) {
      const stateObj = state.find((s) => s.stateCode === value);
      if (stateObj) {
        setFormData((prevData) => ({
          ...prevData,
          stateName: stateObj.stateName,
          stateID: stateObj.stateID,
        }));
      }
    } else if (field === "stateCode" && !value) {
      // State code cleared - reset state name and ID
      setFormData((prevData) => ({
        ...prevData,
        stateName: "",
        stateID: 0,
      }));
    }
  };

  // Update the handleSearchChange function similarly
  const handleSearchChange = (field, value) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value,
    }));

    // Handle country changes in search form - with new logic for clearing
    if (field === "countryID") {
      if (value) {
        // Country selected - reset region and state fields and fetch new regions
        setSearchParams((prevParams) => ({
          ...prevParams,
          regionID: 0,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        getRegionSearch(value);
      } else {
        // Country cleared - reset all dependent fields
        setSearchParams((prevParams) => ({
          ...prevParams,
          regionID: 0,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        setRegionSearch([]); // Reset region dropdown options
        setState([]); // Clear state dropdown options
      }
    }

    // Handle region changes in search form - with new logic for clearing
    if (field === "regionID") {
      if (value) {
        // Region selected - reset state fields and fetch new states
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        getStateSearch(searchParams.countryID, value);
      } else {
        // Region cleared - reset all state-related fields
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
        setState([]); // Reset state dropdown options
      }
    }

    // Auto-fill logic for state in search form - unchanged
    if (field === "stateID" && value) {
      const stateObj = state.find((s) => s.stateID === value);
      if (stateObj) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateCode: stateObj.stateCode,
        }));
      }
    } else if (field === "stateID" && !value) {
      // State ID cleared - reset state code
      setSearchParams((prevParams) => ({
        ...prevParams,
        stateCode: "",
      }));
    }

    // Auto-fill logic when state code is selected in search - unchanged
    if (field === "stateCode" && value) {
      const stateObj = state.find((s) => s.stateCode === value);
      if (stateObj) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: stateObj.stateID,
        }));
      }
    } else if (field === "stateCode" && !value) {
      // State code cleared - reset state ID
      setSearchParams((prevParams) => ({
        ...prevParams,
        stateID: 0,
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Clear any existing status
      setStatus(null);
      setTitle("");
      
      const form = {
        ...formData,
        callType: formData.stateID > 0 ? 2 : 1, // 1=Insert, 2=Update
      };
      const response = await ManageStateAPIForMoto(form);
      if (response.statusCode === "200") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
        
        // Add delay before resetting form
        setTimeout(() => {
          handleCancel();
          getState(searchParams);
        }, 2000); // Wait 2 seconds before clearing
      } else if (response.statusCode === "400") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      } else if (response.statusCode === "500") {
        setStatus(response.statusCode);
        setTitle("Internal Server Error");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      setStatus(error.statusCode || "500");
      setTitle("Internal Server Error");
    }
  };

  // Update the handleStatusChange function
  const handleStatusChange = async (row) => {
    try {
      setStatusUpdateLoading(true);
      setUpdatingRowId(row.stateID);
      const form = {
        ...row,
        callType: 3, // 3=Status Update
        status: row.status === 1 ? 0 : 1,
      };
      const response = await ManageStateAPIForMoto(form);
      if (response.statusCode === "200") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);

        // Add delay before refreshing the table
        setTimeout(() => {
          getState(searchParams);
        }, 5000); // Wait for 5 seconds before refreshing
      } else if (response.statusCode === "400") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);
      } else if (response.statusCode === "500") {
        setStatusSearch(response.statusCode);
        setTitleSearch("Internal Server Error");
      }
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
      setStatusSearch(error.statusCode || "500");
      setTitleSearch("Internal Server Error");
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
    }
  };

  // Add handleEdit function
  const handleEdit = (row) => {
    // Set form data with the row data
    setFormData({
      stateID: row.stateID,
      stateName: row.stateName,
      stateCode: row.stateCode,
      status: row.status,
      countryID: row.countryID,
      regionID: row.regionID,
      callType: 2, // 2=Update
    });

    // Fetch regions for the selected country
    if (row.countryID) {
      getRegion(row.countryID);
    }

    // Fetch states for the selected region
    if (row.regionID) {
      getStateSearch(row.countryID, row.regionID);
    }

    // Clear any existing errors
    setErrors({});
  };

  // Update the handleCancel function to clear create status
  const handleCancel = () => {
    setFormLoading(true);
    setFormData({
      stateID: 0,
      stateName: "",
      stateCode: "",
      status: 1,
      countryID: 0,
      regionID: 0,
      callType: 1,
    });
    setRegion([]);
    setState([]);
    setErrors({});
    setStatus(null);
    setTimeout(() => {
      getState(searchParams);
      setFormLoading(false);
    }, 500);
  };

  // Update the handleCancelSearch function to clear search status
  const handleCancelSearch = () => {
    setSearchFormLoading(true);
    const resetParams = {
      stateID: 0,
      stateName: "",
      stateCode: "",
      countryID: 0,
      regionID: 0,
      selectionMode: 2,
      pageIndex: 1,
      pageSize: 10,
    };

    setPage(0);
    setRowsPerPage(10);
    setSearchParams(resetParams);
    setRegionSearch([]);
    setState([]);
    setStatusSearch(null);
    setTimeout(() => {
      getState(resetParams);
      setSearchFormLoading(false);
    }, 500);
  };

  // Add handleSearch function for the search button
  const handleSearch = () => {
    setTableLoading(true);
    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
      pageSize: 10,
    };
    getState(updatedParams);
  };

  // Add this function to handle pagination changes - place it before the return statement
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1, // Convert 0-based to 1-based for API
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    // Call the API with updated pagination parameters
    getState(updatedParams);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Breadcrumbs Header */}
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
            <BreadcrumbsHeader pageTitle="Geography" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        <>
          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Create"
                  backgroundColor={LIGHT_GRAY2}
                  expanded={accordionExpanded}
                  onChange={handleAccordionChange}
                  controlled={true}
                >
                  {formLoading ? (
                    <FormSkeleton />
                  ) : (
                    <Grid container spacing={3} sx={{ width: "100%" }}>
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
                          COUNTRY <Required />
                        </Typography>
                        <NuralAutocomplete
                          options={country}
                          getOptionLabel={(option) => option.countryName}
                          isOptionEqualToValue={(option, value) =>
                            option.countryID === value.countryID
                          }
                          value={
                            country?.find(
                              (country) =>
                                country.countryID === formData.countryID
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleChange("countryID", value || null);
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_GRAY2}
                          error={!!errors.countryID}
                          onBlur={() => {
                            if (!formData.countryID) {
                              setErrors((prev) => ({
                                ...prev,
                                countryID: "Country is required",
                              }));
                            }
                          }}
                        />
                        {errors.countryID && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {errors.countryID}
                          </Typography>
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
                          REGION <Required />
                        </Typography>
                        <NuralAutocomplete
                          options={region}
                          getOptionLabel={(option) => option.regionName}
                          isOptionEqualToValue={(option, value) =>
                            option.regionID === value.regionID
                          }
                          value={
                            region?.find(
                              (region) => region.regionID === formData.regionID
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleChange("regionID", value || null);
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_GRAY2}
                          error={!!errors.regionID}
                          onBlur={() => {
                            if (!formData.regionID) {
                              setErrors((prev) => ({
                                ...prev,
                                regionID: "Region is required",
                              }));
                            }
                          }}
                        />
                        {errors.regionID && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {errors.regionID}
                          </Typography>
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
                          STATE NAME <Required />
                        </Typography>
                        <NuralTextField
                          value={formData.stateName}
                          onChange={(e) =>
                            handleChange("stateName", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER STATE NAME"
                          error={!!errors.stateName}
                          onBlur={() => {
                            if (
                              !formData.stateName ||
                              formData.stateName.trim() === ""
                            ) {
                              setErrors((prev) => ({
                                ...prev,
                                stateName: "State Name is required",
                              }));
                            }
                          }}
                        />
                        {errors.stateName && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              fontSize: "0.75rem",
                              mt: 0.5,
                              display: "block",
                            }}
                          >
                            {errors.stateName}
                          </Typography>
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
                          STATE CODE <Required />
                        </Typography>
                        <NuralTextField
                          value={formData.stateCode}
                          onChange={(e) =>
                            handleChange("stateCode", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER STATE CODE"
                          error={!!errors.stateCode}
                          onBlur={() => {
                            if (
                              !formData.stateCode ||
                              formData.stateCode.trim() === ""
                            ) {
                              setErrors((prev) => ({
                                ...prev,
                                stateCode: "State Code is required",
                              }));
                            }
                          }}
                        />
                        {errors.stateCode && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              fontSize: "0.75rem",
                              mt: 0.5,
                              display: "block",
                            }}
                          >
                            {errors.stateCode}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </NuralAccordion2>

                {accordionExpanded && (
                  <>
                    <Grid container sx={{ width: "100%", mt: "16px" }}>
                      {status && (
                        <StatusModel
                          width="100%"
                          status={status}
                          title={title}
                          onClose={() => setStatus(null)}
                        />
                      )}
                    </Grid>

                    <Grid container sm={12} md={12} lg={12} spacing={1} mt={1} pr={0}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          borderColor={PRIMARY_BLUE2}
                          onClick={handleCancel}
                          width="97%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <NuralButton
                          text="SAVE"
                          backgroundColor={AQUA}
                          variant="contained"
                          onClick={handleSave}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="View"
                  backgroundColor={LIGHT_GRAY2}
                  expanded={searchAccordionExpanded}
                  onChange={handleSearchAccordionChange}
                >
                  {searchFormLoading ? (
                    <FormSkeleton />
                  ) : (
                    <Grid container spacing={3} sx={{ width: "100%" }}>
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
                          COUNTRY
                        </Typography>
                        <NuralAutocomplete
                          options={countrySearch}
                          getOptionLabel={(option) => option.countryName}
                          isOptionEqualToValue={(option, value) =>
                            option.countryID === value.countryID
                          }
                          value={
                            countrySearch?.find(
                              (country) =>
                                country.countryID === searchParams.countryID
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleSearchChange(
                              "countryID",
                              value?.countryID || null
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_BLUE}
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
                          REGION
                        </Typography>
                        <NuralAutocomplete
                          options={regionSearch}
                          getOptionLabel={(option) => option.regionName}
                          isOptionEqualToValue={(option, value) =>
                            option.regionID === value.regionID
                          }
                          value={
                            regionSearch?.find(
                              (region) =>
                                region.regionID === searchParams.regionID
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleSearchChange(
                              "regionID",
                              value?.regionID || null
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_BLUE}
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
                          STATE NAME
                        </Typography>
                        <NuralAutocomplete
                          options={state}
                          getOptionLabel={(option) => option.stateName}
                          isOptionEqualToValue={(option, value) =>
                            option.stateID === value.stateID
                          }
                          value={
                            state?.find(
                              (state) => state.stateID === searchParams.stateID
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleSearchChange(
                              "stateID",
                              value?.stateID || null
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
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
                          STATE CODE
                        </Typography>
                        <NuralAutocomplete
                          options={state}
                          getOptionLabel={(option) => option.stateCode}
                          isOptionEqualToValue={(option, value) =>
                            option.stateCode === value.stateCode
                          }
                          value={
                            state?.find(
                              (state) =>
                                state.stateCode === searchParams.stateCode
                            ) || null
                          }
                          onChange={(_, value) => {
                            handleSearchChange(
                              "stateCode",
                              value?.stateCode || null
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Grid container spacing={1} mt={1} pr={0}>
                    <Grid item xs={12} sm={3} md={1} lg={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        width="100%"
                        onClick={handleCancelSearch}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9} md={11} lg={11} pr={3}>
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
          <Grid container xs={12} sx={{ mr: 1, mt: 1 }}>
            {statusSearch && (
              <StatusModel
                width="100%"
                status={statusSearch}
                title={titleSearch}
                onClose={() => setStatusSearch(null)}
              />
            )}
          </Grid>
          {!hasSearchError && (
            <Grid item xs={12} mt={1} sx={{ p: { xs: 1, sm: 2 } }}>
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
                        colSpan={8}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          position: "sticky",
                          top: 0,
                          zIndex: 100,
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
                          <Grid
                            item
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src="./Images/export.svg"
                              alt="export"
                              onClick={downloadExcel}
                            />
                          </Grid>
                        </Grid>
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
                        }}
                      >
                        S.NO
                      </TableCell>
                      {[
                        { label: "COUNTRY", key: "countryName" },
                        { label: "REGION", key: "regionName" },
                        { label: "STATE NAME", key: "stateName" },
                        { label: "STATE CODE", key: "stateCode" },
                        { label: "STATUS", sortable: false },
                        { label: "EDIT", sortable: false },
                      ].map((header) => (
                        <TableCell
                          key={header.label}
                          onClick={() =>
                            header.sortable !== false && handleSort(header.key)
                          }
                          sx={{
                            ...tableHeaderStyle,
                            cursor:
                              header.sortable !== false ? "pointer" : "default",
                            position: "sticky",
                            top: "45px",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 100,
                            padding: "8px 16px",
                            minWidth:
                              header.label === "EDIT" ? "60px" : "100px",
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>{header.label}</Grid>
                            {header.sortable !== false && (
                              <Grid item>
                                {sortConfig.key === header.key ? (
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
                    {tableLoading
                      ? // Display skeleton rows while loading
                        Array(10)
                          .fill(0)
                          .map((_, index) => (
                            <TableRowSkeleton key={index} columns={7} />
                          ))
                      : // Display actual data rows
                        filteredRows.map((row, index) => (
                          <TableRow
                            key={row.stateID || index}
                            sx={{
                              fontSize: "10px",

                              "& td": {
                                borderBottom: `1px solid #C6CEED`,
                              },
                            }}
                          >
                            <TableCell sx={{ ...rowstyle }}>
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row?.countryName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row?.regionName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.stateName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.stateCode || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              <Switch
                                checked={row.status === 1}
                                onChange={() => handleStatusChange(row)}
                                size="small"
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: PRIMARY_BLUE2,
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    {
                                      backgroundColor: PRIMARY_BLUE2,
                                    },
                                }}
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
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row)}
                              >
                                <EditIcon
                                  sx={{
                                    fontSize: 16,
                                    color: PRIMARY_BLUE2,
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>

                {/* Replace existing custom pagination with NuralPagination */}
                <NuralPagination
                  key={`pagination-${page}-${rowsPerPage}`}
                  totalRecords={totalRecords}
                  initialPage={page}
                  initialRowsPerPage={rowsPerPage}
                  onPaginationChange={handlePaginationChange}
                />
              </TableContainer>
            </Grid>
          )}
        </>
      </Grid>
    </>
  );
};

export default State;
