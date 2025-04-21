import { Box, Button, Checkbox, Grid, Typography, Switch } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
  PRIMARY_LIGHT_GRAY,
  LIGHT_BLUE,
  PRIMARY_BLUE,
  BLACK,
  DARK_BLUE,
} from "../../../Common/colors";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { Search } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import EditIcon from "@mui/icons-material/Edit";
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
import Required from "../../../Common/Required";
import {
  fetchCategoryList,
  GetSubCategoryList,
  ManageSubCategoryMaster,
} from "../../../Api/Api";
import { FormSkeleton } from "../../../Common/Skeletons";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const tabs = [
  { label: "Upload", value: "product-bulk-upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "sub-category" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
  { label: "Focus Model", value: "focus-model" },
  { label: "Price", value: "price" },
  { label: "Pre Booking", value: "preBooking" },
];

const SubCategory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sub-category");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Table data state
  const [tableData, setTableData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [subcategoryList, setSubcategoryList] = useState([]);
  // Form data state
  const [formData, setFormData] = useState({
    BrandID: 0,
    CategoryID: 0,
    SubCategoryName: "",
    SubCategoryDesc: "",
    SubCategoryID: 0,
    Active: 1,
    CallType: 0,
  });

  // Search form data state
  const [searchParams, setSearchParams] = useState({
    brandID: 0,
    categoryID: 0,
    subcategoryID: 0,
    callType: 0 /* 1 = Active List, 0= bind for table List*/,
    pageIndex: 1 /*-1 for export to excel */,
    pageSize: 10,
    // Add these new fields for search
    subCategoryName: "",
    subCategoryCode: "",
  });

  // Lists for dropdowns
  const [categoryList, setCategoryList] = useState([]);
  const [searchCategoryList, setSearchCategoryList] = useState([]);

  // Loading states
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [searchCategoryLoading, setSearchCategoryLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);

  // Error states
  const [errors, setErrors] = useState({});

  // Accordion states
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false);

  // Add state for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [createStatus, setCreateStatus] = useState(null);
  const [createTitle, setCreateTitle] = useState("");

  // Add ref for the form accordion
  const formAccordionRef = useRef(null);

  // Add state for status update messages
  const [status, setStatus] = useState(null);
  const [statusTitle, setStatusTitle] = useState("");

  // State for export loading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    setSearchParams((prev) => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1,
    }));

    getSubCategoryList({
      ...searchParams,
      pageSize: newRowsPerPage,
      pageIndex: 1,
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPage + 1,
    }));

    getSubCategoryList({
      ...searchParams,
      pageIndex: newPage + 1,
    });
  };

  // Handle sorting
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...tableData]); // Reset to original order
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

  // Get category list for creation form
  const getCategoryList = async () => {
    try {
      setFormLoading(true);
      setCategoryLoading(true);

      const params = {
        categoryID: 0,
      };
      const response = await fetchCategoryList(params);
      if (response.statusCode == 200) {
        setCategoryList(response.productCategoryDropdownList || []);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      setCategoryList([]);
      console.log(error);
    } finally {
      setFormLoading(false);
      setCategoryLoading(false);
    }
  };

  // Get category list for search filter
  const getSearchCategoryList = async () => {
    try {
      setSearchFormLoading(true);
      setSearchCategoryLoading(true);

      const params = {
        categoryID: 0,
      };
      const response = await fetchCategoryList(params);
      if (response.statusCode == 200) {
        setSearchCategoryList(response.productCategoryDropdownList || []);
      } else {
        setSearchCategoryList([]);
      }
    } catch (error) {
      setSearchCategoryList([]);
      console.log(error);
    } finally {
      setSearchFormLoading(false);
      setSearchCategoryLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    getSubCategoryList(updatedParams);
  };

  // Get subcategory list
  const getSubCategoryList = async (params = searchParams) => {
    try {
      setTableLoading(true);

      const response = await GetSubCategoryList(params);
      if (response.statusCode === "200") {
        setTableData(response.subCategoryMasterList || []);
        setFilteredRows(response.subCategoryMasterList || []);
        setTotalRecords(response.totalRecords || 0);
      } else {
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching subcategory list:", error);
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    setTableLoading(true);
    // Reset page to first page when searching
    setPage(0);

    // Update search parameters with reset pagination
    const params = {
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    };

    // Fetch data with new parameters
    getSubCategoryList(params);
  };

  // Handle search reset
  const handleSearchReset = () => {
    setSearchFormLoading(true);
    // Reset search params to default values
    const resetParams = {
      brandID: 0,
      categoryID: 0,
      subcategoryID: 0,
      callType: 0,
      pageIndex: 1,
      pageSize: 10,
      subCategoryName: "",
      subCategoryCode: "",
    };

    // Reset UI state
    setPage(0);
    setRowsPerPage(10);
    setSearchParams(resetParams);

    setTimeout(() => {
      // Fetch data with reset parameters
      getSubCategoryList(resetParams);
      setSearchFormLoading(false);
    }, 500);
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    console.log("handleChange called for", field, "with value:", value);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "CategoryID") {
        setFormData((prev) => ({
          ...prev,
          CategoryID: 0,
        }));
        setErrors((prev) => ({
          ...prev,
          CategoryID: "Category is required",
        }));
        return;
      }
      // Default case for other fields
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));

      const fieldName =
        field === "SubCategoryName"
          ? "Sub-Category Name"
          : field === "SubCategoryDesc"
          ? "Sub-Category Code"
          : field;

      setErrors((prev) => ({ ...prev, [field]: `${fieldName} is required` }));
      return;
    }

    // For CategoryID specifically
    if (field === "CategoryID") {
      const categoryID = value?.categoryID || 0;
      setFormData((prev) => ({
        ...prev,
        CategoryID: categoryID,
      }));

      // Clear error if valid selection
      if (categoryID !== 0) {
        setErrors((prev) => ({ ...prev, CategoryID: "" }));
      }
      return;
    }

    // For SubCategoryName and SubCategoryDesc fields
    if (field === "SubCategoryName" || field === "SubCategoryDesc") {
      const newValue = value.toString();

      // Common validation for both fields
      if (newValue.length > 50) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${
            field === "SubCategoryName"
              ? "Sub-Category Name"
              : "Sub-Category Code"
          } cannot exceed 50 characters`,
        }));
        setFormData((prev) => ({
          ...prev,
          [field]: newValue.substring(0, 50),
        }));
        return;
      }

      // Field-specific validation
      if (field === "SubCategoryName") {
        if (!/^[a-zA-Z0-9 ]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            SubCategoryName:
              "Sub-Category Name can only contain alphanumeric characters and spaces",
          }));
          return;
        }
      } else {
        // SubCategoryDesc
        if (!/^[a-zA-Z0-9]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            SubCategoryDesc:
              "Sub-Category Code can only contain alphanumeric characters (no spaces)",
          }));
          return;
        }
      }

      // Clear errors if valid
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
      }));
      return;
    }

    // For other fields
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get subcategory list for search filter
  const getSubCategory = async (categoryID = 0) => {
    try {
      setSearchFormLoading(true);
      const params = {
        brandID: 0,
        categoryID: categoryID,
        subcategoryID: 0,
        callType: 1, // 1 = Active List for dropdown
        pageIndex: 1,
        pageSize: 100
      };
      const response = await GetSubCategoryList(params);
      if (response.statusCode === "200") {
        setSubcategoryList(response.subCategoryMasterList || []);
      } else {
        setSubcategoryList([]);
      }
    } catch (error) {
      console.error("Error fetching subcategory list:", error);
      setSubcategoryList([]);
    } finally {
      setSearchFormLoading(false);
    }
  };

  // Handle search field changes
  const handleSearchChange = (field, value) => {
    console.log("handleSearchChange called for", field, "with value:", value);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "categoryID") {
        // Update search params
        setSearchParams((prev) => ({
          ...prev,
          categoryID: 0,
        }));

        // Clear subcategory list when category is cleared
        setSubcategoryList([]);
        return;
      } else if (field === "subcategoryID") {
        setSearchParams((prev) => ({
          ...prev,
          subcategoryID: 0,
        }));
        return;
      }

      // Default case for other fields
      setSearchParams((prev) => ({
        ...prev,
        [field]: "",
      }));
      return;
    }

    // For other fields, handle as before
    let newValue;

    if (typeof value === "object") {
      // For dropdown objects
      if (field === "categoryID" && value.categoryID !== undefined) {
        newValue = value.categoryID;

        // When category is selected, fetch the subcategory list
        getSubCategory(value.categoryID);
      } else if (
        field === "subcategoryID" &&
        value.subCategoryID !== undefined
      ) {
        newValue = value.subCategoryID;
      } else {
        // Fallback for other object values
        newValue = value.value || value.id || 0;
      }
    } else {
      // For direct values
      newValue = value;
    }

    // Update the search params
    setSearchParams((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.CategoryID) {
      newErrors.CategoryID = "Category is required";
    }

    if (!formData.SubCategoryName || formData.SubCategoryName.trim() === "") {
      newErrors.SubCategoryName = "Sub-Category Name is required";
    } else if (formData.SubCategoryName.length > 50) {
      newErrors.SubCategoryName =
        "Sub-Category Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.SubCategoryName)) {
      newErrors.SubCategoryName =
        "Sub-Category Name can only contain alphanumeric characters and spaces";
    }

    if (!formData.SubCategoryDesc || formData.SubCategoryDesc.trim() === "") {
      newErrors.SubCategoryDesc = "Sub-Category Code is required";
    } else if (formData.SubCategoryDesc.length > 50) {
      newErrors.SubCategoryDesc =
        "Sub-Category Code cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.SubCategoryDesc)) {
      newErrors.SubCategoryDesc =
        "Sub-Category Code can only contain alphanumeric characters (no spaces)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle accordion changes
  const handleAccordionChange = (event, expanded) => {
    if (!expanded) {
      // Closing this accordion closes both
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
    } else {
      // Opening this accordion closes the other
      setAccordionExpanded(true);
      setSearchAccordionExpanded(false);
    }
  };

  const handleSearchAccordionChange = (event, expanded) => {
    if (!expanded) {
      // Closing this accordion closes both
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
    } else {
      // Opening this accordion closes the other
      setSearchAccordionExpanded(true);
      setAccordionExpanded(false);
    }
  };

  // Initialize data
  useEffect(() => {
    getCategoryList();
    getSearchCategoryList();
    getSubCategoryList();
  }, []);

  const handleExport = async () => {
    const params = {
      ...searchParams,
      pageIndex: -1, // -1 indicates export to excel
    };
    try {
      const response = await GetSubCategoryList(params);
      if (response.statusCode === "200") {
        window.location.href = response?.reportLink;
      } else {
        console.error("Error exporting subcategory list:", response.message);
      }
    } catch (error) {
      console.error("Error exporting subcategory list:", error);
    }
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [selectedValue, setSelectedValue] = useState("Brand 1");

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const options2 = ["Brand 1", "Brand 2", "Brand 3"];

  // Add handlePostRequest function
  const handlePostRequest = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setCreateStatus(null);
      setCreateTitle("");

      const payload = {
        BrandID: formData.BrandID,
        CategoryID: formData.CategoryID,
        SubCategoryName: formData.SubCategoryName,
        SubCategoryDesc: formData.SubCategoryDesc,
        SubCategoryID: formData.SubCategoryID,
        Active: formData.Active,
        CallType: isEditMode ? 1 : 0, // 0 for save, 1 for edit
      };

      const response = await ManageSubCategoryMaster(payload);
      if (response.statusCode === "200") {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);
        handleCancel();
        getSubCategoryList();
      } else {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);
      }
    } catch (error) {
      setCreateStatus(error.statusCode);
      setCreateTitle(error.statusMessage);
      console.log(error);
    }
  };

  // Add handleEdit function
  const handleEdit = async (row) => {
    try {
      // Find the matching category from categoryList
      const matchingCategory = categoryList.find(
        (category) => category.categoryID === row.productCategoryID
      );

      setFormData({
        BrandID: row.brandID || 0,
        CategoryID: row.productCategoryID || 0, // Use productCategoryID from row
        SubCategoryName: row.subCategory || "",
        SubCategoryDesc: row.subCategoryDesc || "",
        SubCategoryID: row.subCategoryID || 0,
        Active: row.status === 1 ? 1 : 0,
        CallType: 1, // 1 for edit
      });

      // Scroll to top and expand the create form accordion if it's not expanded
      setAccordionExpanded(true);
      setIsEditMode(true);
      setErrors({});
      // Use setTimeout and scrollIntoView on the ref
      setTimeout(() => {
        formAccordionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      setSearchAccordionExpanded(false); // Explicitly close search accordion
    } catch (error) {
      console.error("Error setting up edit form:", error);
    }
  };

  // Update handleCancel function
  const handleCancel = () => {
    setFormLoading(true);
    const updatedForm = {
      ...formData,
      modelName: "",
      modelCode: "",
      brandID: 0,
      categoryID: 0,
      subCategoryID: 0,
      modelType: 0,
      modelMode: 0,
      status: 1,
      modelID: 0,
      callType: 1, // Reset to Insert mode
    };
    setFormData(updatedForm);

    // Reset edit mode
    setIsEditMode(false);

    // Clear all errors
    setErrors({});

    setTimeout(() => {
      getSubCategoryList();
      setFormLoading(false);
    }, 500);
  };

  // Add useEffect for status timeout
  useEffect(() => {
    if (createStatus) {
      const timer = setTimeout(() => {
        setCreateStatus(null);
        setCreateTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [createStatus]);

  // Add handleStatus function
  const handleStatus = async (row, newStatus) => {
    try {
      const payload = {
        ...formData,
        SubCategoryID: row.subCategoryID,
        Active: newStatus ? 1 : 0,
        CallType: 2, // 2 for status update
      };

      const response = await ManageSubCategoryMaster(payload);
      if (response.statusCode === "200") {
        setStatus(response.statusCode);
        setStatusTitle(response.statusMessage);
        // Refresh the list to get updated data
        getSubCategoryList();
      } else {
        setStatus(response.statusCode);
        setStatusTitle(response.statusMessage);
      }
    } catch (error) {
      setStatus(error.statusCode);
      setStatusTitle(error.statusMessage);
      console.error("Error updating status:", error);
    }
  };

  // Add useEffect for status message timeout
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
        setStatusTitle("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pl: { xs: 1, sm: 1 },
          pr: { xs: 0, sm: 0, md: "240px", lg: "270px" }, // Adjust right padding for activity panel
          isolation: "isolate",
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
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Product" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Create Form */}
        <Grid item xs={12} pr={1.5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              {formLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  {/* Wrap Accordion in a div with the ref */}
                  <div ref={formAccordionRef}>
                    <NuralAccordion2
                      title="Create Sub Category"
                      backgroundColor={LIGHT_GRAY2}
                      onChange={handleAccordionChange}
                      controlled={true}
                      expanded={accordionExpanded}
                      defaultExpanded={true}
                    >
                      <Grid container spacing={2} sx={{ width: "100%" }}>
                        <Grid item xs={12} sm={4}>
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
                            CATEGORY <Required />
                          </Typography>

                          {/*  {
            "categoryID": 65,
            "categoryCode": "Accessories",
            "categoryName": "Accessories"
        }, */}
                          <NuralAutocomplete
                            options={categoryList}
                            getOptionLabel={(option) => option.categoryName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.categoryID === value?.categoryID
                            }
                            value={
                              categoryList.find(
                                (item) => item.categoryID === formData.CategoryID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleChange("CategoryID", newValue);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            error={!!errors.CategoryID}
                            helperText={errors.CategoryID}
                            loading={categoryLoading}
                            onBlur={() => {
                              if (!formData.CategoryID) {
                                setErrors((prev) => ({
                                  ...prev,
                                  CategoryID: "Category is required",
                                }));
                              }
                            }}
                          />
                          {errors.CategoryID && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {errors.CategoryID}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            SUBCATEGORY NAME <Required />
                          </Typography>
                          <NuralTextField
                            width="100%"
                            placeholder="Enter Sub-Category Name"
                            backgroundColor={LIGHT_BLUE}
                            value={formData.SubCategoryName}
                            onChange={(e) =>
                              handleChange("SubCategoryName", e.target.value)
                            }
                            error={!!errors.SubCategoryName}
                            helperText={errors.SubCategoryName}
                            onBlur={() => {
                              if (
                                !formData.SubCategoryName ||
                                formData.SubCategoryName.trim() === ""
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  SubCategoryName:
                                    "Sub-Category Name is required",
                                }));
                              } else if (
                                !/^[a-zA-Z0-9 ]*$/.test(formData.SubCategoryName)
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  SubCategoryName:
                                    "Sub-Category Name can only contain alphanumeric characters and spaces",
                                }));
                              }
                            }}
                          />
                          {errors.SubCategoryName && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {errors.SubCategoryName}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                            SUBCATEGORY CODE <Required />
                          </Typography>
                          <NuralTextField
                            width="100%"
                            placeholder="Enter Sub-Category Code"
                            backgroundColor={LIGHT_BLUE}
                            value={formData.SubCategoryDesc}
                            onChange={(e) =>
                              handleChange("SubCategoryDesc", e.target.value)
                            }
                            error={!!errors.SubCategoryDesc}
                            helperText={errors.SubCategoryDesc}
                            onBlur={() => {
                              if (
                                !formData.SubCategoryDesc ||
                                formData.SubCategoryDesc.trim() === ""
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  SubCategoryDesc:
                                    "Sub-Category Code is required",
                                }));
                              } else if (
                                !/^[a-zA-Z0-9]*$/.test(formData.SubCategoryDesc)
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  SubCategoryDesc:
                                    "Sub-Category Code can only contain alphanumeric characters (no spaces)",
                                }));
                              }
                            }}
                          />
                          {errors.SubCategoryDesc && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {errors.SubCategoryDesc}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container spacing={1} mt={1} pr={2}></Grid>
                    </NuralAccordion2>
                  </div>
                  <Grid
                    container
                    sx={{ width: "100%", mt: "16px", mb: "16px" }}
                  >
                    {createStatus && (
                      <StatusModel
                        width="100%"
                        status={createStatus}
                        title={createTitle}
                        onClose={() => setCreateStatus(null)}
                      />
                    )}
                  </Grid>
                  <Grid container spacing={2} direction="row">
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancel}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text={isEditMode ? "UPDATE" : "SAVE"}
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={handlePostRequest}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Search Form */}
        <Grid item xs={12} pr={1.5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              {searchFormLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  <NuralAccordion2
                    title="View"
                    backgroundColor={LIGHT_GRAY2}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                    expanded={searchAccordionExpanded}
                    defaultExpanded={true}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid item xs={12} sm={6}>
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
                          CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          options={searchCategoryList}
                          getOptionLabel={(option) => option.categoryName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.categoryID === value?.categoryID
                          }
                          value={
                            searchCategoryList.find(
                              (item) =>
                                item.categoryID === searchParams.categoryID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            const categoryID = newValue?.categoryID || 0;
                            setSearchParams((prev) => ({
                              ...prev,
                              categoryID: categoryID,
                            }));
                            handleSearchChange("categoryID", newValue);
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_GRAY2}
                          loading={searchCategoryLoading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
                          SUBCATEGORY NAME
                        </Typography>
                        <NuralAutocomplete
                          options={subcategoryList}
                          getOptionLabel={(option) => option.subCategory}
                          isOptionEqualToValue={(option, value) =>
                            option?.subCategoryID === value?.subCategoryID
                          }
                          value={
                            subcategoryList.find(
                              (item) =>
                                item.subCategoryID ===
                                searchParams.subcategoryID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "subcategoryID",
                              newValue || null
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} mt={1}>
                      <Grid item spacing={1} xs={6} sm={2} md={1}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          color={PRIMARY_BLUE2}
                          fontSize="12px"
                          height="36px"
                          borderColor={PRIMARY_BLUE2}
                          onClick={handleSearchReset}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={8} md={11} pr={1.5}>
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
                </>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container sx={{ width: "100%", marginBottom: "10px" }}>
            {status && (
              <StatusModel
                width="100%"
                status={status}
                title={statusTitle}
                onClose={() => setStatus(null)}
              />
            )}
          </Grid>
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
                    colSpan={6}
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
                        {/* Remove the old export icon */}
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
                    { label: "CATEGORY", key: "category" },
                    { label: "SUBCATEGORY", key: "subCategory" },
                    { label: "SUBCATEGORY CODE", key: "subCategoryDesc" },
                    { label: "STATUS", sortable: false },
                    { label: "EDIT", sortable: false },
                  ].map((header, index) => (
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
                        minWidth: header.label === "EDIT" ? "60px" : "100px",
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
                {/* "sNo": 1,
            "brandID": 27,
            "brandCode": "Moto",
            "brandName": "Moto",
            "productCategoryID": 65,
            "category": "Accessories",
            "categoryDesc": "Accessories",
            "subCategoryID": 40,
            "subCategory": "NewBrandrpk1subcat",
            "subCategoryDesc": "NewBrandrpk1subcat01",
            "status": 1,
            "currentStatus": "Active" */}
                {tableLoading ? (
                  <TableRowSkeleton columns={6} rows={10} />
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        fontSize: "10px",

                        "& td": {
                          borderBottom: `1px solid #C6CEED`,
                        },
                      }}
                    >
                      <TableCell sx={{ ...rowstyle }}>
                        {" "}
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.category}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.subCategory}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.subCategoryDesc}
                      </TableCell>

                      <TableCell sx={{ ...rowstyle }}>
                        <Switch
                          checked={row.status === 1}
                          onChange={(e) => {
                            // Call handleStatus instead of directly updating the UI
                            handleStatus(row, e.target.checked);
                          }}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: PRIMARY_BLUE2,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: DARK_PURPLE,
                              },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon
                            sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Replace the old pagination with NuralPagination */}
            <NuralPagination
              key={`pagination-${page}-${rowsPerPage}`}
              totalRecords={totalRecords}
              initialPage={page}
              initialRowsPerPage={rowsPerPage}
              onPaginationChange={handlePaginationChange}
            />
          </TableContainer>
        </Grid>
      </Grid>
      {/* Activity Panel for Export */}
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        mr={0}
        position={"fixed"}
        right={10}
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
            mt={2}
            mb={2}
            className="export-button"
          >
            <NuralExport
              title="Export SubCategory List"
              views={""} // Add views if applicable
              downloadExcel={handleExport}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default SubCategory;
