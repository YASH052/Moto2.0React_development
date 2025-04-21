import { Box, /*Button,*/ Checkbox, Grid, Typography, Switch, Skeleton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
  // PRIMARY_LIGHT_GRAY, // Unused
  LIGHT_BLUE,
  PRIMARY_BLUE,
  BLACK,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import Required from "../../../Common/Required";
import { FormSkeleton } from "../../../Common/Skeletons";

import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
// import { Search } from "@mui/icons-material"; // Unused
// import NavigateNextIcon from "@mui/icons-material/NavigateNext"; // Unused
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"; // Unused
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle, toggleSectionStyle } from "../../../Common/commonstyles";
import { getbrandlist, GetCategoryList, ManageProductCategory } from "../../../Api/Api";
// Add imports for activity panel and export
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
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("category");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add brand list state
  const [brandList, setBrandList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add category list state
  const [categoryList, setCategoryList] = useState([]);

  // Update search params state
  const [searchParams, setSearchParams] = useState({
    brandID: 0,
    categoryID: 0,
    callType: 0 /* 1 = Active List, 0= bind for table List*/,
    pageIndex: 1,
    pageSize: 10,
  });

  const [formData, setFormData] = useState({
    brandID: 0, //comma separated brand IDs
    categoryID: 0, //category ID 0 for new category
    categoryName: "",
    categoryDesc: "",
    active: 1,
    callType: 0 /* 0-save, 1-update */,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Add form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Category Name validation
    if (!formData.categoryName || formData.categoryName.trim() === "") {
      newErrors.categoryName = "Category Name is required";
    } else if (formData.categoryName.length > 50) {
      newErrors.categoryName = "Category Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.categoryName)) {
      newErrors.categoryName = "Category Name can only contain alphanumeric characters and spaces";
    }

    // Category Code validation
    if (!formData.categoryDesc || formData.categoryDesc.trim() === "") {
      newErrors.categoryDesc = "Category Code is required";
    } else if (formData.categoryDesc.length > 50) {
      newErrors.categoryDesc = "Category Code cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.categoryDesc)) {
      newErrors.categoryDesc = "Category Code can only contain alphanumeric characters (no spaces)";
    }

    // Brand selection validation
    if (selectedBrands.length === 0) {
      newErrors.brands = "Please select at least one brand";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new state for selected brands
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [status,setStatus] = useState(null);
  const [title,setTitle] = useState(null);
  const [searchStatus,setSearchStatus] = useState(null);
  const [searchTitle,setSearchTitle] = useState(null);
  const [totalRecords,setTotalRecords] = useState(0);

  // Add new state variables at the top with other state declarations
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);
  const [isTableUpdating, setIsTableUpdating] = useState(false);

  // Add accordion state
  const [accordionExpanded, setAccordionExpanded] = useState(true); // Keep Create open initially
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false); // Keep View closed initially
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add ref for the form accordion
  const formAccordionRef = useRef(null);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false); // State for export loading

  // Update handleBrandSelection to clear error
  const handleBrandSelection = (brand) => {
    setSelectedBrands((prev) => {
      const isSelected = prev.some((b) => b.brandID === brand.brandID);
      if (isSelected) {
        return prev.filter((b) => b.brandID !== brand.brandID);
      } else {
        return [...prev, brand];
      }
    });
    // Clear brand error when a brand is selected
    if (errors.brands) {
      setErrors(prev => ({ ...prev, brands: undefined }));
    }
  };

  // Add handler for select all
  const handleSelectAll = () => {
    if (selectedBrands.length === brandList.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands([...brandList]);
    }
  };

  // Add getBrandDropdown function
  const getBrandDropdown = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...searchParams,
        CallType: 1,
      };
      const response = await getbrandlist(params);
      if (response.statusCode === "200") {
        setBrandList(response.brandMasterList || []);
      } else {
        setBrandList([]);
      }
    } catch (error) {
      setBrandList([]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update getCategoryDropdown function
  const getCategoryDropdown = async () => {
    try {
      setIsLoading(true);
      const params = {
        ...searchParams,
        callType: 1, // 1 for active list
        brandID: searchParams.brandID, // Add brandID to params
      };
      const response = await GetCategoryList(params);
      if (response.statusCode === "200") {
        setCategoryList(response.categoryMasterList || []);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      setCategoryList([]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add pagination handler
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    getCategoryList(updatedParams);
  };

  // Update getCategoryList function
  const getCategoryList = async (params = searchParams) => {
    try {
      setTableLoading(true);
      const response = await GetCategoryList(params);
      if (response.statusCode === "200") {
        setFilteredRows(response.categoryMasterList || []);
        setTotalRecords(response.totalRecords || 0);
      } else {
        setSearchStatus(response.status);
        setSearchTitle(response.title);
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      setSearchStatus(error.status);
      setSearchTitle(error.title);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  // Update search handler
  const handleSearch = async () => {
    try {
      setSearchFormLoading(true);
      setTableLoading(true);
      setIsTableUpdating(true);
      const updatedParams = {
        ...searchParams,
        pageIndex: 1,
        callType: 0,
      };

      const response = await GetCategoryList(updatedParams);
      if (response.statusCode === "200") {
        setFilteredRows(response.categoryMasterList || []);
        setTotalRecords(response.totalRecords || 0);
        setTimeout(() => {
          setSearchStatus(null);
          setSearchTitle(null);
        }, 5000);
      } else {
        setFilteredRows([]);
        setTotalRecords(0);
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "No data found");
      }
    } catch (error) {
      console.log(error);
      setFilteredRows([]);
      setTotalRecords(0);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(error.statusMessage || "Something went wrong");
    } finally {
      setSearchFormLoading(false);
      setTableLoading(false);
      setIsTableUpdating(false);
    }
  };

  // Update clear search handler
  const handleClearSearch = () => {
    setSearchFormLoading(true);
    setSearchParams({
      brandID: 0,
      categoryID: 0,
      callType: 0,
      pageIndex: 1,
      pageSize: 10,
    });
    setFilteredRows([]);
    setTotalRecords(0);
    setSearchStatus(null);
    setSearchTitle(null);
    setPage(0);
    setRowsPerPage(10);

    // Fetch immediately after state updates
    const defaultParams = {
      brandID: 0,
      categoryID: 0,
      callType: 0,
      pageIndex: 1,
      pageSize: 10,
    };
    Promise.all([getCategoryList(defaultParams), getBrandDropdown()]).finally(() => {
      setSearchFormLoading(false);
    });
  };

  // Update useEffect to initialize data
  useEffect(() => {
    setFormLoading(true);
    setSearchFormLoading(true);
    setTableLoading(true);
    setIsTableUpdating(true);

    Promise.all([getBrandDropdown(), getCategoryList()]).finally(() => {
      setFormLoading(false);
      setSearchFormLoading(false);
      setTableLoading(false);
      setIsTableUpdating(false);
    });
  }, []);

  // Add effect to fetch categories when brand changes
  useEffect(() => {
    if (searchParams.brandID !== 0) {
      getCategoryDropdown();
    } else {
      setCategoryList([]);
      setSearchParams(prev => ({ ...prev, categoryID: 0 }));
    }
  }, [searchParams.brandID]);

  // Update brand dropdown onChange handler
  const handleBrandChange = (event, newValue) => {
    setSearchParams((prev) => ({
      ...prev,
      brandID: newValue?.brandID || 0,
      categoryID: 0, // Reset category when brand changes
    }));
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        getCategoryList(searchParams);
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

  // Remove the dummy data generation function and its initial call
  /*
  const generateDummyData = () => {
    // ... (removed function content)
  };
  */
  // const [filteredRows, setFilteredRows] = React.useState(generateDummyData()); // Remove this line
  const [filteredRows, setFilteredRows] = React.useState([]); // Initialize as empty array

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add downloadExcel function
  const downloadExcel = async () => {
    try {
      setTableLoading(true);
      setIsTableUpdating(true);
      const params = {
        ...searchParams,
        pageIndex: -1,
        callType: 0,
      };
      const response = await GetCategoryList(params);
      if (response.statusCode === "200") {
        window.location.href = response?.reportLink;
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "File downloaded successfully");
        setTimeout(() => {
          setSearchStatus(null);
          setSearchTitle(null);
        }, 5000);
      } else if (response.statusCode === "400") {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Something went wrong");
      } else if (response.statusCode === "500") {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Internal server error");
      }
    } catch (error) {
      console.log(error);
      setSearchStatus(error.statusCode);
      setSearchTitle(error.statusMessage || "Something went wrong");
    } finally {
      setTableLoading(false);
      setIsTableUpdating(false);
      setIsDownloadLoading(false); // Stop loading
    }
  };

  // Update handlePost function
  const handlePost = async () => {
    if (validateForm()) {
      try {
        setFormLoading(true);
        setTableLoading(true);
        setIsTableUpdating(true);

        const requestData = {
          categoryName: formData.categoryName,
          categoryDesc: formData.categoryDesc,
          brandID: selectedBrands.map(brand => brand.brandID).join(','),
          active: formData.active || 1,
          callType: formData.callType,
          categoryID: formData.categoryID
        };

        const response = await ManageProductCategory(requestData);
        
        if (response.statusCode === "200") {
          setStatus(response.statusCode);
          setTitle(response.statusMessage || (formData.callType === 1 ? "Category updated successfully" : "Category created successfully"));
          setTimeout(() => {
            setStatus(null);
            setTitle("");
          }, 5000);
          
          handleClearForm();
          // Use handleClearSearch to reset parameters and fetch the list
          handleClearSearch(); 

        } else {
          setStatus(response.statusCode);
          setTitle(response.statusMessage || (formData.callType === 1 ? "Failed to update category" : "Failed to create category"));
        }
      } catch (error) {
        console.log(error);
        setStatus(error.statusCode || "500");
        setTitle(error.statusMessage || "Something went wrong");
      } finally {
        setFormLoading(false);
        setTableLoading(false);
        setIsTableUpdating(false);
      }
    }
  };

  // Restore handleClearForm function
  const handleClearForm = () => {
    setFormLoading(true);
    setFormData({
      categoryName: "",
      categoryDesc: "",
      brandID: "",
      active: 1,
      callType: 0,
      categoryID: 0
    });
    setSelectedBrands([]);
    setErrors({});
    setIsEditMode(false);
    // Clear API status messages for the form
    setStatus(null);
    setTitle(null);
    // Clear API status messages for the search/table section
    setSearchStatus(null);
    setSearchTitle(null);
    // Optional: Close accordion on clear if desired, otherwise keep it open
    // setAccordionExpanded(false); 
    setTimeout(() => {
      // Fetch brand dropdown again if needed after form clear
      Promise.all([getBrandDropdown()]).finally(() => {
        setFormLoading(false);
      });
    }, 500); 
  };

  // Update handleStatus to show loading state
  const handleStatus = async (row) => {
    try {
      setUpdatingRowId(row.productCategoryID);
      setStatusUpdateLoading(true);
      setIsTableUpdating(true);
      const requestData = {
        ...formData,
        active: row.status === 1 ? 1 : 0,
        callType: 2,
        categoryID: row.productCategoryID,
        brandID: row.brandID.toString(),
        categoryName: row.category,
        categoryDesc: row.categoryDesc,
      };

      const response = await ManageProductCategory(requestData);
      if (response.statusCode === "200") {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
        setTimeout(() => {
          setSearchStatus(null);
          setSearchTitle(null);
        }, 5000);

        setTimeout(() => {
          // Pass current searchParams to ensure we get the correct filtered data
          getCategoryList(searchParams);
        }, 500);
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Something went wrong");
        const newRows = [...filteredRows];
        const rowIndex = newRows.findIndex((r) => r.productCategoryID === row.productCategoryID);
        if (rowIndex !== -1) {
          newRows[rowIndex] = {
            ...newRows[rowIndex],
            status: row.status,
          };
          setFilteredRows(newRows);
        }
      }
    } catch (error) {
      console.log(error);
      setSearchStatus("500");
      setSearchTitle(error.message || "Something went wrong");
      const newRows = [...filteredRows];
      const rowIndex = newRows.findIndex((r) => r.productCategoryID === row.productCategoryID);
      if (rowIndex !== -1) {
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          status: row.status,
        };
        setFilteredRows(newRows);
      }
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
      setIsTableUpdating(false);
    }
  };

  // Update handleEdit to set edit mode
  const handleEdit = (row) => {
    setFormData({
      active: row.status,
      brandID: row.brandID,
      callType: 1,
      categoryDesc: row.categoryDesc,
      categoryID: row.productCategoryID || 0,
      categoryName: row.category
    });

    const selectedBrandIds = row.brandID.toString().split(',');
    const selectedBrandObjects = brandList.filter(brand => 
      selectedBrandIds.includes(brand.brandID.toString())
    );
    setSelectedBrands(selectedBrandObjects);
    setIsEditMode(true);
    setAccordionExpanded(true); // Open the form accordion
    setSearchAccordionExpanded(false); // Explicitly close search accordion
    // Use setTimeout and scrollIntoView on the ref
    setTimeout(() => {
        formAccordionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Add accordion change handlers
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

        <>
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
                        title={isEditMode ? "Edit Category" : "Create Category"}
                        backgroundColor={LIGHT_GRAY2}
                        expanded={accordionExpanded}
                        onChange={handleAccordionChange}
                        controlled={true}
                      >
                        <Grid container spacing={4} sx={{ width: "100%" }}>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: DARK_PURPLE,
                                fontFamily: "Manrope",
                                fontWeight: 400,
                                fontSize: "10px",
                                lineHeight: "13.66px",
                                letterSpacing: "4%",
                                mb: 1,
                              }}
                            >
                              CATEGORY NAME <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.categoryName || ""}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                // Check length first - update to 20 characters
                                if (newValue.length > 20) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    categoryName: newValue.substring(0, 20), // Truncate to 20 chars
                                  }));
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryName: "Category Name cannot exceed 20 characters",
                                  }));
                                  return; // Don't continue with normal update
                                }

                                // If input contains non-alphanumeric-space characters, don't update
                                if (newValue && !/^[a-zA-Z0-9 ]*$/.test(newValue)) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryName: "Category Name can only contain alphanumeric characters and spaces",
                                  }));
                                  return; // Don't update the form data
                                }

                                // Clear errors for valid input
                                if (newValue.trim() !== "") {
                                  setErrors((prev) => ({ ...prev, categoryName: "" }));
                                } else {
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryName: "Category Name is required",
                                  }));
                                }

                                handleChange("categoryName", newValue);
                              }}
                              placeholder="Enter Category Name"
                              backgroundColor={LIGHT_BLUE}
                              error={!!errors.categoryName}
                            />
                            {errors.categoryName && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                  fontSize: "0.75rem",
                                  mt: 0.5,
                                  display: "block",
                                }}
                              >
                                {errors.categoryName}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: DARK_PURPLE,
                                fontFamily: "Manrope",
                                fontWeight: 400,
                                fontSize: "10px",
                                lineHeight: "13.66px",
                                letterSpacing: "4%",
                                mb: 1,
                              }}
                            >
                              CATEGORY CODE <Required />  
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.categoryDesc || ""}
                              onChange={(event) => {
                                const newValue = event.target.value;
                                // Check length first - update to 20 characters
                                if (newValue.length > 20) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    categoryDesc: newValue.substring(0, 20), // Truncate to 20 chars
                                  }));
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryDesc: "Category Code cannot exceed 20 characters",
                                  }));
                                  return; // Don't continue with normal update
                                }

                                // If input contains non-alphanumeric characters, don't update
                                if (newValue && !/^[a-zA-Z0-9]*$/.test(newValue)) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryDesc: "Category Code can only contain alphanumeric characters (no spaces)",
                                  }));
                                  return; // Don't update the form data
                                }

                                // Clear errors for valid input
                                if (newValue.trim() !== "") {
                                  setErrors((prev) => ({ ...prev, categoryDesc: "" }));
                                } else {
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryDesc: "Category Code is required",
                                  }));
                                }

                                handleChange("categoryDesc", newValue);
                              }}
                              placeholder="Enter Category Code"
                              backgroundColor={LIGHT_BLUE}
                              error={!!errors.categoryDesc}
                            />
                            {errors.categoryDesc && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                  fontSize: "0.75rem",
                                  mt: 0.5,
                                  display: "block",
                                }}
                              >
                                {errors.categoryDesc}
                              </Typography>
                            )}
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            sx={{ width: "100%", marginLeft: "0%" }}
                          >
                            {/* First Dropdown */}
                            <Grid item xs={12} md={12} lg={12}>
                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginTop: 2,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: PRIMARY_BLUE2,
                                    fontFamily: "Manrope",
                                    fontWeight: 700,
                                    fontSize: "10px",
                                    lineHeight: "13.66px",
                                    letterSpacing: "4%",
                                    textAlign: "center",
                                    ml: 2,
                                  }}
                                >
                                  BRAND MAPPING <Required />
                                </Typography>

                                <Typography
                                  variant="h6"
                                  onClick={handleSelectAll}
                                  sx={{
                                    color: PRIMARY_BLUE2,
                                    fontFamily: "Manrope",
                                    fontWeight: 700,
                                    fontSize: "10px",
                                    lineHeight: "13.66px",
                                    letterSpacing: "4%",
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  {selectedBrands.length === brandList.length ? "DESELECT ALL" : "SELECT ALL"}
                                </Typography>
                              </Box>

                              <Grid
                                container
                                spacing={2}
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 2,
                                  ml: "2px",
                                }}
                              >
                                {brandList.map((brand) => (
                                  <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                    key={brand.brandID}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Checkbox
                                      checked={selectedBrands.some(
                                        (b) => b.brandID === brand.brandID
                                      )}
                                      onChange={() => handleBrandSelection(brand)}
                                      sx={{
                                        "&.Mui-checked": {},
                                        borderRadius: "8px",
                                      }}
                                    />

                                    <Typography
                                      sx={{
                                        color: selectedBrands.some(
                                          (b) => b.brandID === brand.brandID
                                        )
                                          ? WHITE
                                          : BLACK,
                                        backgroundColor: selectedBrands.some(
                                          (b) => b.brandID === brand.brandID
                                        )
                                          ? PRIMARY_BLUE
                                          : "transparent",
                                        padding: "8px",
                                        paddingLeft: "10px",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        width: {
                                          xs: "100%",
                                          md: "220px",
                                        },
                                        textAlign: "left",
                                      }}
                                    >
                                      {brand.brand}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                            {errors.brands && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                  fontSize: "0.75rem",
                                  mt: 0.5,
                                  display: "block",
                                  ml: 2,
                                }}
                              >
                                {errors.brands}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                       
                      </NuralAccordion2>
                    </div>

                    {/* Always show buttons when accordion is expanded */}
                    {accordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1}>
                        {status && (
                          <StatusModel
                            width="100%"
                            status={status}
                            title={title}
                            onClose={() => {
                              setStatus(null);
                              setTitle("");
                            }}
                            autoDismiss={status === "200"}
                          />
                        )}
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={handleClearForm}
                            width="97%"
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text={isEditMode ? "UPDATE" : "SAVE"}
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handlePost}
                            width="97%"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                {searchFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <NuralAccordion2
                    title="View"
                    backgroundColor={LIGHT_GRAY2}
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: DARK_PURPLE,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          BRAND
                        </Typography>
                        <NuralAutocomplete
                          options={brandList}
                          getOptionLabel={(option) => option.brand}
                          isOptionEqualToValue={(option, value) =>
                            option?.brandID === value?.brandID
                          }
                          value={
                            brandList.find(
                              (item) => item.brandID === searchParams.brandID
                            ) || null
                          }
                          onChange={handleBrandChange}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                          loading={isLoading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: DARK_PURPLE,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          CATEGORY NAME
                        </Typography>
                        <NuralAutocomplete
                          options={categoryList}
                          getOptionLabel={(option) => option.category || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.productCategoryID === value?.productCategoryID
                          }
                          value={
                            categoryList.find(
                              (item) => item.productCategoryID === searchParams.categoryID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setSearchParams((prev) => ({
                              ...prev,
                              categoryID: newValue?.productCategoryID || 0,
                            }));
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                          loading={isLoading}
                          disabled={searchParams.brandID === 0}
                        />
                      </Grid>
                    </Grid>

                    {/* Always show search buttons when accordion is expanded */}
                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1}>
                        <Grid item spacing={1} xs={6} sm={2} md={1}>
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
                        <Grid item xs={12} sm={10} md={11} pr={1.5}>
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
                    )}
                  </NuralAccordion2>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
        <Grid container mt={1} mb={1}>
        {searchStatus && (
          <StatusModel
            width="100%"
            status={searchStatus}
            title={searchTitle}
            onClose={() => {
              setSearchStatus(null);
              setSearchTitle(null);
            }}
            autoDismiss={searchStatus === "200"}
          />
        )}
      </Grid>
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
                    { label: "BRAND NAME", key: "brandName" },
                    { label: "CATEGORY NAME", key: "category" },
                    { label: "CATEGORY CODE", key: "categoryDesc" },
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
                {tableLoading || statusUpdateLoading || isTableUpdating ? (
                    Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                      <TableRow key={`skeleton-row-${rowIndex}`}>
                        {Array.from({ length: 5 }).map((_, cellIndex) => (
                          <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`} sx={{ ...rowstyle }}>
                            <Skeleton animation="wave" height={20} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <TableRow
                      key={row.sNo}
                      sx={{
                        fontSize: "10px",
                       
                        "& td": {
                          borderBottom: `1px solid #C6CEED`,
                        },
                      }}
                    >
                      <TableCell sx={{ ...rowstyle }}>
                        {row.sNo}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.brandName}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.category}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.categoryDesc}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <Switch
                          checked={row.status === 1}
                          onChange={() => {
                            const newRows = [...filteredRows];
                            const rowIndex = newRows.findIndex(
                              (r) => r.productCategoryID === row.productCategoryID
                            );
                            if (rowIndex !== -1) {
                              newRows[rowIndex] = {
                                ...newRows[rowIndex],
                                status: row.status === 1 ? 0 : 1,
                              };
                              setFilteredRows(newRows);
                              handleStatus(newRows[rowIndex]);
                            }
                          }}
                          size="small"
                          disabled={statusUpdateLoading && updatingRowId === row.productCategoryID}
                          sx={toggleSectionStyle}
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
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Custom Pagination */}
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
              title="Export Category List" // Specific title
              views={""} // Add views if applicable
              downloadExcel={downloadExcel} // Pass the function
              isDownloadLoading={isDownloadLoading} // Pass the loading state
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default CategoryPage;
