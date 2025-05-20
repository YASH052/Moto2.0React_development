import { Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  LIGHT_BLUE,
  DARK_PURPLE,
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
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
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
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const tabs = [
  { label: "Upload", value: "geography-bulk-upload" },
  { label: "Country", value: "#" },
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
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
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

  // Add useEffect to handle auto-dismiss for success messages

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

  const [regionLoading, setRegionLoading] = useState(false);
  const [regionSearchLoading, setRegionSearchLoading] = useState(false);

  const getRegion = async (countryID = 0) => {
    try {
      setRegionLoading(true);
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
    } finally {
      setRegionLoading(false);
    }
  };

  const getRegionSearch = async (countryID = 0) => {
    try {
      setRegionSearchLoading(true);
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
    } finally {
      setRegionSearchLoading(false);
    }
  };

  const getState = async (params = searchParams) => {
    try {
      setTableLoading(true);
      setHasSearchError(false);
      const response = await GetStateListForMoto(params);

      if (response.statusCode === "200") {
        setTableData(response.stateMasterList);
        setFilteredRows(response.stateMasterList);
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
    } catch (error) {
      console.error("Error in getState:", error);
      setHasSearchError(true);
      setStatusSearch(error.statusCode || "500");
      setTitleSearch("Internal Server Error");
    } finally {
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
      setIsDownloadLoading(true);
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
    } finally {
      setIsDownloadLoading(false);
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
        // Only set error if the field was previously filled
        if (formData.countryID !== 0) {
          setErrors((prev) => ({
            ...prev,
            countryID: "Country is required",
          }));
        }
        // Clear region options when country is cleared
        setRegion([]);
        return;
      } else if (field === "regionID") {
        setFormData((prev) => ({
          ...prev,
          regionID: 0,
        }));
        // Only set error if the field was previously filled
        if (formData.regionID !== 0) {
          setErrors((prev) => ({
            ...prev,
            regionID: "Region is required",
          }));
        }
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
      // Check for spaces in real-time
      if (newValue.includes(" ")) {
        setErrors((prev) => ({
          ...prev,
          stateCode: "Spaces are not allowed in State Code",
        }));
        // Remove spaces from the value
        newValue = newValue.replace(/\s+/g, "");
      }

      // Remove any non-alphanumeric characters
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, "");

      // Check character limit
      if (newValue.length > 20) {
        setErrors((prev) => ({
          ...prev,
          stateCode: "State Code cannot exceed 20 characters",
        }));
        newValue = newValue.slice(0, 20);
      } else {
        // Clear error if within limit
        setErrors((prev) => ({
          ...prev,
          stateCode: "",
        }));
      }
    }

    // Special handling for state name field
    if (field === "stateName") {
      // Check for multiple spaces in real-time
      if (newValue.includes("  ")) {
        setErrors((prev) => ({
          ...prev,
          stateName: "Multiple spaces are not allowed",
        }));
        // Replace multiple spaces with single space
        newValue = newValue.replace(/\s+/g, " ");
      }

      // Check character limit
      if (newValue.length > 20) {
        setErrors((prev) => ({
          ...prev,
          stateName: "State Name cannot exceed 20 characters",
        }));
        newValue = newValue.slice(0, 20);
      } else {
        // Clear error if within limit
        setErrors((prev) => ({
          ...prev,
          stateName: "",
        }));
      }
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Handle country changes - with new logic for clearing
    if (field === "countryID") {
      if (value) {
        // Country selected - fetch new regions
        getRegion(value?.countryID || null);

        // Only reset region if it's not a valid region for the new country
        const selectedRegion = region.find(
          (r) => r.regionID === formData.regionID
        );
        if (!selectedRegion || selectedRegion.countryID !== value.countryID) {
          setFormData((prevData) => ({
            ...prevData,
            regionID: 0,
          }));
        }
      } else {
        // Country cleared - reset all dependent fields
        setRegion([]); // Reset region dropdown options
        setFormData((prevData) => ({
          ...prevData,
          regionID: 0,
        }));
      }
    }

    // Handle region changes - with new logic for clearing
    if (field === "regionID") {
      if (!value) {
        // Region cleared - reset state fields
        setFormData((prevData) => ({
          ...prevData,
          stateID: 0,
          stateName: "",
          stateCode: "",
        }));
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

    // Handle country changes in search form
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

    // Handle region changes in search form
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

    // Handle state name clearing - just update the state without API call
    if (field === "stateName" && !value) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        stateName: "",
        stateID: 0,
        stateCode: "",
      }));
    }

    // Handle state code clearing - just update the state without API call
    if (field === "stateCode" && !value) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        stateCode: "",
        stateID: 0,
        stateName: "",
      }));
    }

    // Auto-fill logic for state in search form
    if (field === "stateID" && value) {
      const stateObj = state.find((s) => s.stateID === value);
      if (stateObj) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateCode: stateObj.stateCode,
        }));
      }
    } else if (field === "stateID" && !value) {
      // State ID cleared - just update the state without API call
      setSearchParams((prevParams) => ({
        ...prevParams,
        stateID: 0,
        stateCode: "",
        stateName: "",
      }));
    }

    // Auto-fill logic when state code is selected in search
    if (field === "stateCode" && value) {
      const stateObj = state.find((s) => s.stateCode === value);
      if (stateObj) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: stateObj.stateID,
        }));
      }
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
        getState(searchParams);
        // Add delay before resetting form
        setFormData({
          stateID: 0,
          stateName: "",
          stateCode: "",
          status: 1,
          countryID: 0,
          regionID: 0,
        });
        setTimeout(() => {
          handleCancel();
        }, 5000); // Wait 2 seconds before clearing
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
      if (response.statusCode == "200") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);
        setTimeout(() => {
          setStatusSearch(null);
          setTitleSearch("");
        }, 5000); // Wait for 5 seconds before refreshing

        getState(searchParams);
        // Wait for 5 seconds before refreshing
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

    // Scroll to country field
    const countryField = document.getElementById("country-autocomplete");
    if (countryField) {
      countryField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Update the handleCancel function to clear create status
  const handleCancel = () => {
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
  };

  // Update the handleCancelSearch function to reset search parameters and fetch table data
  const handleCancelSearch = () => {
    // Reset all search parameters
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

    // Reset pagination state
    setPage(0);
    setRowsPerPage(10);

    // Reset search form state
    setSearchParams(resetParams);
    setRegionSearch([]);
    setState([]);
    setStatusSearch(null);
    setTitleSearch("");

    // Fetch fresh data with reset parameters
    getState(resetParams);
  };

  // Add handleSearch function for the search button
  const handleSearch = () => {
    setPage(0);
    setRowsPerPage(10);
    setTableLoading(true);
    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
      pageSize: 10,
    };
    getState(updatedParams);
  };

  // Update handlePaginationChange to properly handle data loading
  const handlePaginationChange = (paginationState) => {
    // Handle different types of pagination changes
    if (paginationState.type === "jumpToFirst") {
      const updatedParams = {
        ...searchParams,
        pageIndex: 1,
        pageSize: paginationState.rowsPerPage,
      };
      setPage(0);
      setRowsPerPage(paginationState.rowsPerPage);
      setSearchParams(updatedParams);
      getState(updatedParams);
    } else if (paginationState.type === "jumpToLast") {
      const lastPage =
        Math.ceil(totalRecords / paginationState.rowsPerPage) - 1;
      const updatedParams = {
        ...searchParams,
        pageIndex: lastPage + 1,
        pageSize: paginationState.rowsPerPage,
      };
      setPage(lastPage);
      setRowsPerPage(paginationState.rowsPerPage);
      setSearchParams(updatedParams);
      getState(updatedParams);
    } else if (paginationState.type === "pageSearch") {
      const updatedParams = {
        ...searchParams,
        pageIndex: paginationState.page + 1,
        pageSize: paginationState.rowsPerPage,
      };
      setPage(paginationState.page);
      setRowsPerPage(paginationState.rowsPerPage);
      setSearchParams(updatedParams);
      getState(updatedParams);
    } else {
      // Regular page change
      const updatedParams = {
        ...searchParams,
        pageIndex: paginationState.page + 1,
        pageSize: paginationState.rowsPerPage,
      };
      setPage(paginationState.page);
      setRowsPerPage(paginationState.rowsPerPage);
      setSearchParams(updatedParams);
      getState(updatedParams);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
        }}
      >
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
          <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
            <BreadcrumbsHeader pageTitle="Geography" />
          </Grid>

          <Grid item xs={12} ml={0}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              l
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
                          id="country-autocomplete"
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
                          loading={regionLoading}
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

                    <Grid
                      container
                      sm={12}
                      md={12}
                      lg={12}
                      spacing={1}
                      mt={1}
                      pr={0}
                    >
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
                          text={formData.stateID > 0 ? "UPDATE" : "SAVE"}
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
                          // backgroundColor={LIGHT_BLUE}
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
                          // backgroundColor={LIGHT_BLUE}
                          loading={regionSearchLoading}
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
            <Grid item xs={12} mt={0} sx={{ p: { xs: 1, sm: 2 } }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 50px)", // Adjusted to account for headers
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
                    {tableLoading ? (
                      <TableRowSkeleton columns={8} />
                    ) : (
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
                              sx={{
                                ...toggleSectionStyle,
                                "& .MuiSwitch-thumb": {
                                  backgroundColor:
                                    row.status === 1
                                      ? PRIMARY_BLUE2
                                      : DARK_PURPLE,
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
                      ))
                    )}
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
        <Grid
          item
          xs={12}
          sm={3}
          md={3}
          lg={3}
          mt={0}
          position={"fixed"}
          right={{
            xs: 0,
            sm: 5,
            md: 10,
            lg: 10,
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
              mt={0}
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
    </>
  );
};

export default State;
