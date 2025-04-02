import { Grid, Switch, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  LIGHT_BLUE,
  DARK_BLUE,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import {
  Countrymasterlist,
  GetCityListForDropdown,
  getCityMasterlist,
  GetRegionListDropdown,
  GetStateListForDropdown,
  manageCityMaster,
} from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import Required from "../../../Common/Required";
import { FormSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralPagination from "../../../Common/NuralPagination";

const tabs = [
  { label: "Upload", value: "upload" },
  { label: "Country", value: "country" },
  { label: "State", value: "state" },
  { label: "City", value: "city" },
  { label: "Area", value: "area" },
];
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // TablePagination,
  IconButton,
} from "@mui/material";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";

const City = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("city");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add searchParams state
  const [searchParams, setSearchParams] = useState({
    countryID: 0,
    regionID: 0,
    stateID: 0,
    cityID: 0,
    status: 2 /* 0 - inactive, 1-active , 2- all list*/,
    callType: 0 /* 0 = to bind table, 1= get active lists for dropdown */,
    pageIndex: 1,
    pageSize: 10,
  });

  // Add form data state
  const [formData, setFormData] = useState({
    countryID: 0,
    regionID: 0,
    stateID: 0,
    cityID: 0,
    cityName: "",
    status: 1 /* 0= inactive, 1 = active */,
    callType: 1 /* 0= default for save, 1= edit, 2= toggle Active Status*/,
    cityCode: "",
  });

  // Add state for dropdowns
  const [country, setCountry] = useState([]);
  const [region, setRegion] = useState([]);
  const [state, setState] = useState([]);

  // Add state for search dropdowns
  const [countrySearch, setCountrySearch] = useState([]);
  const [regionSearch, setRegionSearch] = useState([]);
  const [stateSearch, setStateSearch] = useState([]);
  const [citySearch, setCitySearch] = useState([]);
  const [tableData, setTableData] = useState([]);
  // Add loading states
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Add error state
  const [errors, setErrors] = useState({});

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusSearch, setStatusSearch] = useState(null);
  const [titleSearch, setTitleSearch] = useState("");

  const statusTimerRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");

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
  const downloadExcel = async () => {
    const params = {
      ...formData,
      callType: 3,
      pageIndex: -1,
    }
    try {
      const response = await getCityMasterlist(params);
      if (response.statusCode === "200") {
        window.location.href = response?.reportLink; 
        setStatusSearch(200);
        setTitleSearch(response?.statusMessage);
      } else {
        setStatusSearch(response?.statusCode);
        setTitleSearch(response?.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setStatusSearch(error?.statusCode);
      setTitleSearch(error?.statusMessage);
    }
  };

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

  // Add useEffect to update loading states
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

  // Add handleChange function for form fields
  const handleChange = (field, value) => {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "countryID") {
        setFormData((prev) => ({
          ...prev,
          countryID: 0,
          regionID: 0,
          stateID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          countryID: "Country is required",
        }));
        setRegion([]);
        setState([]);
        return;
      } else if (field === "regionID") {
        setFormData((prev) => ({
          ...prev,
          regionID: 0,
          stateID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          regionID: "Region is required",
        }));
        setState([]);
        return;
      } else if (field === "stateID") {
        setFormData((prev) => ({
          ...prev,
          stateID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          stateID: "State is required",
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
      } else if (field === "stateID" && value.stateID !== undefined) {
        newValue = value.stateID;
      }
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

    // Handle country changes
    if (field === "countryID") {
      if (value) {
        setFormData((prevData) => ({
          ...prevData,
          regionID: 0,
          stateID: 0,
        }));
        getRegion(value?.countryID || value);
      } else {
        setRegion([]);
        setState([]);
        setFormData((prevData) => ({
          ...prevData,
          regionID: 0,
          stateID: 0,
        }));
      }
    }

    // Handle region changes
    if (field === "regionID") {
      if (value) {
        setFormData((prevData) => ({
          ...prevData,
          stateID: 0,
        }));
        getState(formData.countryID, value?.regionID || value);
      } else {
        setState([]);
        setFormData((prevData) => ({
          ...prevData,
          stateID: 0,
        }));
      }
    }

    // Validate specific fields
    if (field === "cityName") {
      if (!newValue || newValue.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          cityName: "City Name is required",
        }));
      } else if (newValue.length > 50) {
        setErrors((prev) => ({
          ...prev,
          cityName: "City Name cannot exceed 50 characters",
        }));
      } else if (!/^[a-zA-Z0-9 ]+$/.test(newValue)) {
        setErrors((prev) => ({
          ...prev,
          cityName:
            "City Name can only contain alphanumeric characters and spaces",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          cityName: "",
        }));
      }
    }

    if (field === "cityCode") {
      if (!newValue || newValue.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          cityCode: "City Code is required",
        }));
      } else if (newValue.length > 50) {
        setErrors((prev) => ({
          ...prev,
          cityCode: "City Code cannot exceed 50 characters",
        }));
      } else if (!/^[a-zA-Z0-9]+$/.test(newValue)) {
        setErrors((prev) => ({
          ...prev,
          cityCode:
            "City Code can only contain alphanumeric characters (no spaces)",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          cityCode: "",
        }));
      }
    }
  };

  // Add handleSearchChange function for search form
  const handleSearchChange = (field, value) => {
    // Handle country changes in search form
    if (field === "countryID") {
      if (value) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          countryID: value?.countryID || value,
          regionID: 0,
          stateID: 0,
          cityID: 0,
        }));
        getRegionSearch(value?.countryID || value);
      } else {
        setRegionSearch([]);
        setStateSearch([]);
        setCitySearch([]);
        setSearchParams((prevParams) => ({
          ...prevParams,
          countryID: 0,
          regionID: 0,
          stateID: 0,
          cityID: 0,
        }));
      }
    }

    // Handle region changes in search form
    if (field === "regionID") {
      if (value) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          regionID: value?.regionID || value,
          stateID: 0,
          cityID: 0,
        }));
        getStateSearch(searchParams.countryID, value?.regionID || value);
      } else {
        setStateSearch([]);
        setCitySearch([]);
        setSearchParams((prevParams) => ({
          ...prevParams,
          regionID: 0,
          stateID: 0,
          cityID: 0,
        }));
      }
    }

    // Handle state changes in search form
    if (field === "stateID") {
      if (value) {
        const stateID = value?.stateID || value;
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: stateID,
          cityID: 0,
        }));
        // Load cities for the selected state
        getCitySearch(stateID);
      } else {
        setCitySearch([]);
        setSearchParams((prevParams) => ({
          ...prevParams,
          stateID: 0,
          cityID: 0,
        }));
      }
    }

    // Handle city changes in search form
    if (field === "cityID") {
      if (value) {
        const selectedCity = citySearch.find(
          (city) => city.cityID === (value?.cityID || value)
        );
        setSearchParams((prevParams) => ({
          ...prevParams,
          cityID: value?.cityID || value,
          cityCode: selectedCity?.cityCode || "",
        }));
      } else {
        setSearchParams((prevParams) => ({
          ...prevParams,
          cityID: 0,
          cityCode: "",
        }));
      }
    }
  };

  // Add API functions for country, region and state
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
        CallType: "1",
        pageIndex: 1,
        pageSize: 10,
      };
      const response = await Countrymasterlist(params);
      if (response.statusCode === "200") {
        setCountrySearch(response.countryMasterList);
      }
      setSearchFormLoading(false);
    } catch (error) {
      console.error("Error in getCountrySearch:", error);
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
      }
    } catch (error) {
      console.error("Error in getRegionSearch:", error);
    }
  };

  const getState = async (countryID = 0, regionID = 0) => {
    try {
      const params = {
        countryID: countryID || 0,
        regionID: regionID || 0,
        stateID: 0,
      };
      const response = await GetStateListForDropdown(params);
      if (response.statusCode === "200") {
        setState(response.stateDropdownList);
      }
    } catch (error) {
      console.error("Error in getState:", error);
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
        setStateSearch(response.stateDropdownList);
      }
    } catch (error) {
      console.error("Error in getStateSearch:", error);
    }
  };

  const getCitySearch = async (stateID = 0) => {
    try {
      const params = {
        searchConditions: 1, //it will be 1
        stateID: stateID || 0,
        cityID: 0,
      };
      const response = await GetCityListForDropdown(params);
      if (response.statusCode === "200") {
        setCitySearch(response.cityDropdownList);
      }
    } catch (error) {
      console.error("Error in getCitySearch:", error);
    }
  };

  const getCityList = async (params = searchParams) => {
    try {
      setTableLoading(true);
      setHasSearchError(false);
      const response = await getCityMasterlist(params);

      if (response.statusCode === "200") {
        setTableData(response.cityMasterList || []);
        setFilteredRows(response.cityMasterList || []);
        setTotalRecords(response.totalRecords || 0);

        // Only set status for empty results or specific messages
        if (response.cityMasterList?.length === 0) {
          setStatusSearch(response.statusCode);
          setTitleSearch("No records found");
        } else {
          setStatusSearch(null);
          setTitleSearch("");
        }
      } else {
        setHasSearchError(true);
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Error fetching data");
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error in getCityList:", error);
      setHasSearchError(true);
      setStatusSearch("500");
      setTitleSearch("Internal Server Error");
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  // Add useEffect to load initial data
  useEffect(() => {
    getCountry();
    getCountrySearch();
    getCityList({
      ...searchParams,
      pageIndex: page + 1,
      pageSize: rowsPerPage,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update useEffect to set filteredRows when tableData changes
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setFilteredRows([...tableData]);
    }
  }, [tableData]);

  // Add validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.countryID) {
      newErrors.countryID = "Country is required";
    }

    if (!formData.regionID) {
      newErrors.regionID = "Region is required";
    }

    if (!formData.stateID) {
      newErrors.stateID = "State is required";
    }

    if (!formData.cityName || formData.cityName.trim() === "") {
      newErrors.cityName = "City Name is required";
    } else if (formData.cityName.length > 50) {
      newErrors.cityName = "City Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.cityName)) {
      newErrors.cityName =
        "City Name can only contain alphanumeric characters and spaces";
    }

    if (!formData.cityCode || formData.cityCode.trim() === "") {
      newErrors.cityCode = "City Code is required";
    } else if (formData.cityCode.length > 50) {
      newErrors.cityCode = "City Code cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.cityCode)) {
      newErrors.cityCode =
        "City Code can only contain alphanumeric characters (no spaces)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add handlePaginationChange function
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
    getCityList(updatedParams);
  };

  // Add handleCancelSearch function
  const handleCancelSearch = () => {
    const resetParams = {
      countryID: 0,
      regionID: 0,
      stateID: 0,
      cityID: 0,
      status: 2,
      callType: 0,
      pageIndex: 1,
      pageSize: 10,
    };

    setPage(0);
    setRowsPerPage(10);
    setSearchParams(resetParams);
    setRegionSearch([]);
    setStateSearch([]);
    setCitySearch([]);
    setStatusSearch(null);
    getCityList(resetParams);
  };

  // Add handleSearch function
  const handleSearch = () => {
    // Reset pagination when searching
    setPage(0);
    setRowsPerPage(10);

    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
      pageSize: 10,
    };
    setSearchParams(updatedParams);
    getCityList(updatedParams);
  };

  // Update handleCancel function
  const handleCancel = () => {
    setFormData({
      countryID: 0,
      regionID: 0,
      stateID: 0,
      cityID: 0,
      cityName: "",
      status: 1,
      callType: 1,
      cityCode: "",
    });
    setErrors({});
    // setStatus(null);
    // setTitle("");
  };

  // Update handleStatusChange function
  const handleStatusChange = async (row) => {
    try {
      setStatusUpdateLoading(true);
      const form = {
        ...row,
        callType: 2 /* 0= default for save, 1= edit, 2= toggle Active Status*/,
        status: row.status === 1 ? 0 : 1,
      };
      const response = await manageCityMaster(form);
      if (response.statusCode === "200") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);

        // Add delay before refreshing the table
        setTimeout(() => {
          getCityList(searchParams);
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
    }
  };

  // Add handleEdit function
  const handleEdit = (row) => {
    // Set form data with the row data
    console.log(row);
    setFormData({
      ...formData,
      cityID: row.cityId,
      cityName: row.cityName,
      cityCode: row.cityCode,
      status: row.status,
      countryID: row.countryID,
      regionID: row.regionID,
      stateID: row.stateID,
      callType: 1 /* 0= default for save, 1= edit, 2= toggle Active Status*/,
    });

    // Fetch regions for the selected country
    if (row.countryID) {
      getRegion(row.countryID);
    }

    // Fetch states for the selected region
    if (row.regionID) {
      getState(row.countryID, row.regionID);
    }

    // Clear any existing errors
    setErrors({});
  };

  // Update handleSave function
  const handleSave = async () => {
    if (validateForm()) {
      try {
        const form = {
          ...formData,
          callType:
            formData.cityID > 0
              ? 1
              : 0 /* 0= default for save, 1= edit, 2= toggle Active Status*/,
        };
        const response = await manageCityMaster(form);
        if (response.statusCode === "200") {
          setStatus(response.statusCode);
          setTitle(response.statusMessage); 
          handleCancel();
          getCityList(searchParams);
        } else if (response.statusCode === "400") {
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
        } else if (response.statusCode === "500") {
          setStatus(response.statusCode);
          setTitle("Internal server error.");
        }
      } catch (error) {
        console.error("Error in handleSave:", error);
        setStatus(error.statusCode || "500");
        setTitle("Internal server error.");
      }
    }
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
                  title={formData.cityID > 0 ? "Update" : "Create"}
                  backgroundColor={LIGHT_GRAY2}
                  onChange={handleAccordionChange}
                  controlled={true}
                  expanded={accordionExpanded}
                  defaultExpanded={true}
                >
                  {formLoading ? (
                    <FormSkeleton />
                  ) : (
                    <>
                      <Grid container spacing={3} sx={{ width: "100%" }}>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
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
                            width="100%"
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
                            onChange={(_, value) =>
                              handleChange("countryID", value)
                            }
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
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
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
                            width="100%"
                            options={region}
                            getOptionLabel={(option) => option.regionName}
                            isOptionEqualToValue={(option, value) =>
                              option.regionID === value.regionID
                            }
                            value={
                              region?.find(
                                (region) =>
                                  region.regionID === formData.regionID
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleChange("regionID", value)
                            }
                            placeholder="SELECT"
                            backgroundColor={LIGHT_GRAY2}
                            error={!!errors.regionID}
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
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "13.66px",
                              letterSpacing: "4%",
                              mb: 1,
                            }}
                          >
                            STATE <Required />
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            options={state}
                            getOptionLabel={(option) => option.stateName}
                            isOptionEqualToValue={(option, value) =>
                              option.stateID === value.stateID
                            }
                            value={
                              state?.find(
                                (state) => state.stateID === formData.stateID
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleChange("stateID", value)
                            }
                            placeholder="SELECT"
                            backgroundColor={LIGHT_GRAY2}
                            error={!!errors.stateID}
                          />
                          {errors.stateID && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {errors.stateID}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "13.66px",
                              letterSpacing: "4%",
                              mb: 1,
                            }}
                          >
                            CITY NAME <Required />
                          </Typography>
                          <NuralTextField
                            width="100%"
                            value={formData.cityName}
                            onChange={(e) =>
                              handleChange("cityName", e.target.value)
                            }
                            placeholder="ENTER CITY NAME"
                            error={!!errors.cityName}
                            onBlur={() => {
                              if (
                                !formData.cityName ||
                                formData.cityName.trim() === ""
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  cityName: "City Name is required",
                                }));
                              }
                            }}
                          />
                          {errors.cityName && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{
                                fontSize: "0.75rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {errors.cityName}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              lineHeight: "13.66px",
                              letterSpacing: "4%",
                              mb: 1,
                            }}
                          >
                            CITY CODE <Required />
                          </Typography>
                            <NuralTextField
                            width="100%"  
                            value={formData.cityCode}
                            onChange={(e) =>
                              handleChange("cityCode", e.target.value)
                            }
                            placeholder="ENTER CITY CODE"
                            error={!!errors.cityCode}
                            onBlur={() => {
                              if (
                                !formData.cityCode ||
                                formData.cityCode.trim() === ""
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  cityCode: "City Code is required",
                                }));
                              }
                            }}
                          />
                          {errors.cityCode && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{
                                fontSize: "0.75rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {errors.cityCode}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>

          {accordionExpanded && (
            <Grid container spacing={1} mt={1} pr={0} ml={1} mr={1}>
              <Grid container sx={{ width: "100%", mt: "16px" }}>
                {status && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={title}
                    onClose={() => {
                      setStatus(null);
                      setTitle("");
                    }}
                  />
                )}
              </Grid>

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
                  text={formData.cityID > 0 ? "UPDATE" : "SAVE"}
                  backgroundColor={AQUA}
                  variant="contained"
                  onClick={handleSave}
                  width="100%"
                />
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 
                  title="View" 
                  backgroundColor={LIGHT_GRAY2}
                  onChange={handleSearchAccordionChange}
                  controlled={true}
                  expanded={searchAccordionExpanded}
                  defaultExpanded={true}
                >
                  {searchFormLoading ? (
                    <FormSkeleton />
                  ) : (
                    <>
                      <Grid container spacing={3} sx={{ width: "100%" }}>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
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
                            width="100%"
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
                            onChange={(_, value) =>
                              handleSearchChange("countryID", value)
                            }
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
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
                            width="100%"
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
                            onChange={(_, value) =>
                              handleSearchChange("regionID", value)
                            }
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
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
                            STATE
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            options={stateSearch}
                            getOptionLabel={(option) => option.stateName}
                            isOptionEqualToValue={(option, value) =>
                              option.stateID === value.stateID
                            }
                            value={
                              stateSearch?.find(
                                (state) =>
                                  state.stateID === searchParams.stateID
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleSearchChange("stateID", value)
                            }
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
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
                            CITY NAME
                          </Typography>
                          <NuralAutocomplete
                            options={citySearch}
                            getOptionLabel={(option) => option.cityName}
                            isOptionEqualToValue={(option, value) =>
                              option.cityID === value.cityID
                            }
                            value={
                              citySearch?.find(
                                (city) => city.cityID === searchParams.cityID
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleSearchChange("cityID", value)
                            }
                            width="100%"
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
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
                            CITY CODE
                          </Typography>
                          <NuralAutocomplete
                            options={citySearch}
                            getOptionLabel={(option) => option.cityCode}
                            isOptionEqualToValue={(option, value) =>
                              option.cityID === value.cityID
                            }
                            value={
                              citySearch?.find(
                                (city) => city.cityID === searchParams.cityID
                              ) || null
                            }
                            onChange={(_, value) => {
                              if (value) {
                                const selectedCity = citySearch.find(
                                  (city) => city.cityID === value.cityID
                                );
                                setSearchParams((prevParams) => ({
                                  ...prevParams,
                                  cityID: selectedCity.cityID,
                                }));
                              } else {
                                setSearchParams((prevParams) => ({
                                  ...prevParams,
                                  cityID: 0,
                                }));
                              }
                            }}
                            width="100%"
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                      </Grid>
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
                    </>
                  )}
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>

          <Grid container xs={12} sx={{ mr: 1, margin: "16px 10px" }}>
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
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: 0 }}>
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
                            <img src="./Images/export.svg" alt="export" onClick={downloadExcel}/>
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
                        { label: "COUNTRY", key: "country" },
                        { label: "REGION", key: "region" },
                        { label: "STATE", key: "state" },
                        { label: "CITY NAME", key: "cityName" },
                        { label: "CITY CODE", key: "cityCode" },
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
                    {tableLoading || statusUpdateLoading
                      ? Array(rowsPerPage)
                          .fill(0)
                          .map((_, index) => (
                            <TableRowSkeleton key={index} columns={8} />
                          ))
                      : filteredRows.map((row, index) => (
                          <TableRow
                            key={row.cityID || index}
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
                              {row?.country || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row?.regionName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row?.stateName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.cityName || "-"}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.cityCode || "-"}
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

                <NuralPagination
                  key={`pagination-${totalRecords}-${page}-${rowsPerPage}`}
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

export default City;
