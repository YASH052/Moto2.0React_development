import { Button, Grid, Typography, Switch } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  LIGHT_BLUE,
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
import EditIcon from "@mui/icons-material/Edit";
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";

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

// Updated to include properties for sortable status
const cells = [
  { label: "Model NAME", key: "modelName" },
  { label: "Model CODE", key: "modelCode" },
  { label: "BRAND", key: "brandName" },
  { label: "CATEGORY", key: "categoryName" },
  { label: "SUB-CATEGORY", key: "subCategoryName" },
  { label: "MODEL TYPE", key: "modelType" },
  { label: "MODEL MODE", key: "modelMode" },
  { label: "STATUS", sortable: false },
  { label: "EDIT", sortable: false },
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
import {
  fetchBrandList,
  fetchCategoryList,
  fetchModelList,
  fetchSubCategoryList,
  GetModelListForDropdown,
  manageModel,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import Required from "../../../Common/Required";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const ModelType = [
  { label: "Saleable", value: 1 },
  { label: "Non Saleable", value: 2 },
];

const ModelMode = [
  { label: "No Serial", value: 1 },
  { label: "Batch Coded", value: 2 },
  { label: "Unique Serial Number", value: 3 },
];

const Model = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("model");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [searchParams, setSearchParams] = useState({
    modelName: "",
    modelCode: "",
    modelID: 0, //For Update
    subCategoryID: 0, //Product ID
    categoryID: 0, //Product category ID
    brandID: 0,
    modelType: 1,
    selectionmode: 2, //2 Will be pass for List
    pageIndex: 1, //1-UI, -1=Export to excel
    pageSize: 10,
  });
  const [formData, setFormData] = useState({
    modelName: "",
    modelCode: "",
    status: 1, //1-Active, 0-DeActive
    modelID: 0, //For Update
    subCategoryID: 0, //Product ID
    categoryID: 0, //Product category ID
    brandID: 0,
    modelMode: 0, //1=No serial, 2=Batch Coded, 3=Serialized
    modelType: 0, //1=saleable,2=Non saleable
    callType: 1 /*1=Insert, 2=Update, 3=Status Update*/,
  });
  const [tableData, setTableData] = useState([]);
  const [createStatus, setCreateStatus] = useState(null);
  const [createTitle, setCreateTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Update the search form data state to include modelName and modelCode objects
  const [searchFormData, setSearchFormData] = useState({
    brandID: 0,
    categoryID: 0,
    subCategoryID: 0,
    modelName: "",
    modelCode: "",
    selectedModel: null, // To store the selected model object
  });

  // Search dropdown data lists (separate from create/edit form)
  const [searchBrandList, setSearchBrandList] = useState([]);
  const [searchCategoryList, setSearchCategoryList] = useState([]);
  const [searchSubCategoryList, setSearchSubCategoryList] = useState([]);

  // Add these new state variables for skeleton loading
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);

  // Add specific loading states for individual dropdowns
  const [brandLoading, setBrandLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [searchBrandLoading, setSearchBrandLoading] = useState(false);
  const [searchCategoryLoading, setSearchCategoryLoading] = useState(false);
  const [searchSubCategoryLoading, setSearchSubCategoryLoading] =
    useState(false);
  const [modelListForDropdown, setModelListForDropdown] = useState([]);

  // Add accordion state
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);

  // Add accordion change handlers
  const handleAccordionChange = (event, expanded) => {
    if (!expanded) {
      // Closing this accordion closes both
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
      setTableVisible(false);
    } else {
      // Opening this accordion closes the other
      setAccordionExpanded(true);
      setSearchAccordionExpanded(false);
      setTableVisible(false);
    }
  };

  const handleSearchAccordionChange = (event, expanded) => {
    if (!expanded) {
      // Closing this accordion closes both
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
      setTableVisible(false);
    } else {
      // Opening this accordion closes the other
      setSearchAccordionExpanded(true);
      setAccordionExpanded(false);
      setTableVisible(true);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Use setTimeout to ensure state updates before scrolling
    setTimeout(() => {
      scrollToTop(createAccordionRef);
    }, 100);
    setSearchAccordionExpanded(false); // Explicitly close search accordion
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
        setFilteredRows([...tableData]);
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

  const [rows, setRows] = React.useState();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    getModelList(updatedParams);
  };

  const getModelList = async (params = searchParams) => {
    try {
      setTableLoading(true);

      const response = await fetchModelList(params);
      if (response.statusCode == 200) {
        // If this is an export request, handle the report link
        if (params.pageIndex === -1 && response.reportLink) {
          window.location.href = response.reportLink;
          return;
        }
        const data = response.modelMasterList || [];
        setTableData(data);
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || data.length);
      } else {
        setTableData([]);
        setFilteredRows([]);
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
      getModelListForDropdown();
    } catch (error) {
      setTableData([]);
      setFilteredRows([]);
      setSearchStatus(error.statusCode);
      setSearchTitle(error.statusMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  // Add handleExport function
  const handleExport = async () => {
    setIsDownloadLoading(true); // Start loading
    const params = {
      ...searchParams,
      pageIndex: -1, // -1 indicates export to excel
    };
    try {
      await getModelList(params);
    } catch (error) {
      console.error("Error exporting model list:", error);
    } finally {
      setIsDownloadLoading(false); // Stop loading
    }
  };

  const getBrand = async () => {
    try {
      setFormLoading(true);
      setBrandLoading(true);

      const params = {
        brandID: 0,
      };
      const response = await fetchBrandList(params);
      if (response.statusCode == 200) {
        setBrandList(response.brandDropdownList || []);
      } else {
        setBrandList([]);
      }
    } catch (error) {
      setBrandList([]);
      console.log(error);
    } finally {
      setFormLoading(false);
      setBrandLoading(false);
    }
  };

  const getCategory = async (brandID = 0) => {
    try {
      setCategoryLoading(true);
      const params = {
        brandID: brandID,
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
      setCategoryLoading(false);
    }
  };

  const getSubCategory = async (brandID = 0, categoryID = 0) => {
    try {
      setSubCategoryLoading(true);
      const params = {
        brandID: brandID,
        categoryID: categoryID,
        subCategoryID: 0,
      };
      const response = await fetchSubCategoryList(params);
      if (response.statusCode == 200) {
        setSubCategoryList(response.productDropdownList || []);
      } else {
        setSubCategoryList([]);
      }
    } catch (error) {
      setSubCategoryList([]);
      console.log(error);
    } finally {
      setSubCategoryLoading(false);
    }
  };

  // Get brand list for search filter
  const getSearchBrandList = async () => {
    try {
      setSearchFormLoading(true);
      setSearchBrandLoading(true);

      const params = {
        brandID: 0,
      };
      const response = await fetchBrandList(params);
      if (response.statusCode == 200) {
        setSearchBrandList(response.brandDropdownList || []);
      } else {
        setSearchBrandList([]);
      }
    } catch (error) {
      setSearchBrandList([]);
      console.log(error);
    } finally {
      setSearchFormLoading(false);
      setSearchBrandLoading(false);
    }
  };

  // Get category list for search filter based on selected brand
  const getSearchCategoryList = async (brandID = 0) => {
    try {
      setSearchCategoryLoading(true);
      const params = {
        brandID: brandID,
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
      setSearchCategoryLoading(false);
    }
  };

  // Get sub-category list for search filter based on selected brand and category
  const getSearchSubCategoryList = async (brandID = 0, categoryID = 0) => {
    try {
      setSearchSubCategoryLoading(true);
      const params = {
        brandID: brandID,
        categoryID: categoryID,
        subCategoryID: 0,
      };
      const response = await fetchSubCategoryList(params);
      if (response.statusCode == 200) {
        setSearchSubCategoryList(response.productDropdownList || []);
      } else {
        setSearchSubCategoryList([]);
      }
    } catch (error) {
      setSearchSubCategoryList([]);
      console.log(error);
    } finally {
      setSearchSubCategoryLoading(false);
    }
  };

  const getModelListForDropdown = async (subCategoryID = 0) => {
    try {
      console.log("Loading models for subCategoryID:", subCategoryID);
      const params = {
        categoryID: 0,
        modelID: 0,
        subCategoryID: subCategoryID,
        brandID: 0,
      };
      const response = await GetModelListForDropdown(params);
      if (response.statusCode == 200) {
        setModelListForDropdown(response.modelDropdownList || []);
      } else {
        setModelListForDropdown([]);
      }
    } catch (error) {
      setModelListForDropdown([]);
      console.log(error);
    }
  };

  // Update the handleSearchChange function to ensure proper model name/code synchronization
  const handleSearchChange = (field, value) => {
    console.log("handleSearchChange called for", field, "with value:", value);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "brandID") {
        // Clear dependent dropdown options
        setSearchCategoryList([]);
        setSearchSubCategoryList([]);
        setModelListForDropdown([]);

        // Update search form data
        setSearchFormData((prev) => ({
          ...prev,
          brandID: 0,
          categoryID: 0,
          subCategoryID: 0,
          modelName: "",
          modelCode: "",
          selectedModel: null,
        }));
        return;
      } else if (field === "categoryID") {
        // Clear subcategory options
        setSearchSubCategoryList([]);
        setModelListForDropdown([]);

        // Update search form data
        setSearchFormData((prev) => ({
          ...prev,
          categoryID: 0,
          subCategoryID: 0,
          modelName: "",
          modelCode: "",
          selectedModel: null,
        }));
        return;
      } else if (field === "subCategoryID") {
        // Clear model options
        setModelListForDropdown([]);

        // Just update form data
        setSearchFormData((prev) => ({
          ...prev,
          subCategoryID: 0,
          modelName: "",
          modelCode: "",
          selectedModel: null,
        }));
        return;
      } else if (field === "modelName" || field === "modelCode") {
        // Clear both model name and code when one is cleared
        setSearchFormData((prev) => ({
          ...prev,
          modelName: "",
          modelCode: "",
          selectedModel: null,
        }));
        return;
      }

      return;
    }

    // For model name and code dropdown linking
    if (field === "modelName" || field === "modelCode") {
      // When a model is selected from either dropdown, update both fields using the complete model object
      if (typeof value === "object" && value !== null) {
        // Use the selected model object directly
        const selectedModel = value;

        // Update both model name and code fields, plus store the full model object
        setSearchFormData((prev) => ({
          ...prev,
          modelName: selectedModel.modelName || "",
          modelCode: selectedModel.modelCode || "",
          selectedModel: selectedModel, // This is the key - both dropdowns reference this same object
        }));
        return;
      }
    }

    // For other fields, handle as before
    let newValue;

    if (typeof value === "object") {
      // For dropdown objects
      if (field === "brandID" && value.brandID !== undefined) {
        newValue = value.brandID;
      } else if (field === "categoryID" && value.categoryID !== undefined) {
        newValue = value.categoryID;
      } else if (
        field === "subCategoryID" &&
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

    // Update the search form data
    setSearchFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Handle cascading data loading
    if (field === "brandID") {
      // Update category list
      console.log("Loading search categories for brandID:", newValue);
      getSearchCategoryList(newValue);

      // Clear dependent fields
      setSearchFormData((prev) => ({
        ...prev,
        [field]: newValue,
        categoryID: 0,
        subCategoryID: 0,
        modelName: "",
        modelCode: "",
        selectedModel: null,
      }));

      // Clear the subcategory options and model options
      setSearchSubCategoryList([]);
      setModelListForDropdown([]);
    } else if (field === "categoryID") {
      // Update subcategory list
      console.log(
        "Loading search subcategories for categoryID:",
        newValue,
        "and brandID:",
        searchFormData.brandID
      );
      getSearchSubCategoryList(searchFormData.brandID, newValue);

      // Clear subcategory selection and model options
      setSearchFormData((prev) => ({
        ...prev,
        [field]: newValue,
        subCategoryID: 0,
        modelName: "",
        modelCode: "",
        selectedModel: null,
      }));

      // Clear model options when category changes
      setModelListForDropdown([]);
    } else if (field === "subCategoryID") {
      // Load models for the selected subcategory
      console.log("Loading models for subCategoryID:", newValue);
      getModelListForDropdown(newValue);

      // Clear model selection
      setSearchFormData((prev) => ({
        ...prev,
        [field]: newValue,
        modelName: "",
        modelCode: "",
        selectedModel: null,
      }));
    }
  };

  // Update handleClearSearch to hide table when search is cleared
  const handleClearSearch = () => {
    setSearchFormLoading(true);
    // First reset pagination state
    setPage(0);
    setRowsPerPage(10);
    setSearchStatus(null);
    setSearchTitle("");
    // Reset search form data with a completely fresh object
    setSearchFormData({
      brandID: 0,
      categoryID: 0,
      subCategoryID: 0,
      modelName: "",
      modelCode: "",
      selectedModel: null,
    });

    // Clear model dropdown data
    setModelListForDropdown([]);

    // Reset search parameters
    const clearedParams = {
      ...searchParams,
      brandID: 0,
      categoryID: 0,
      subCategoryID: 0,
      modelName: "",
      modelCode: "",
      pageIndex: 1,
      pageSize: 10,
    };

    // Update search params for API
    setSearchParams(clearedParams);

    setTimeout(() => {
      // Fetch data with cleared parameters
      getModelList(clearedParams);
      setSearchFormLoading(false);
    }, 500);
  };

  useEffect(() => {
    getModelList();
    getBrand();
    getSearchBrandList(); // Load brands for search filter

    // Load categories if brandID is set
    if (formData.brandID) {
      getCategory(formData.brandID);
    }

    // Load subcategories if both brandID and categoryID are set
    if (formData.brandID && formData.categoryID) {
      getSubCategory(formData.brandID, formData.categoryID);
    }
  }, []);

  // Modified searchSubCategoryList to load models when changed
  useEffect(() => {
    if (searchFormData.subCategoryID) {
      getModelListForDropdown(searchFormData.subCategoryID);
    } else {
      // Clear model list if no sub-category selected
      setModelListForDropdown([]);
    }
  }, [searchFormData.subCategoryID]);

  // Add refs for scrolling
  const createAccordionRef = useRef(null);

  // Helper function for smooth scrolling - now with optional element ref
  const scrollToTop = (elementRef = null) => {
    if (elementRef && elementRef.current) {
      // If element ref is provided, scroll to that element
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      // Otherwise scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Update validateForm to use correct character limit
  const validateForm = () => {
    const newErrors = {};

    // Required field validation for all fields
    if (!formData.brandID) {
      newErrors.brandID = "Brand is required";
    }

    if (!formData.categoryID) {
      newErrors.categoryID = "Category is required";
    }

    if (!formData.subCategoryID) {
      newErrors.subCategoryID = "Sub-Category is required";
    }

    if (!formData.modelType) {
      newErrors.modelType = "Model Type is required";
    }

    if (!formData.modelMode) {
      newErrors.modelMode = "Model Mode is required";
    }

    if (!formData.modelName || formData.modelName.trim() === "") {
      newErrors.modelName = "Model Name is required";
    } else if (formData.modelName.length > 50) {
      newErrors.modelName = "Model Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.modelName)) {
      newErrors.modelName =
        "Model Name can only contain alphanumeric characters and spaces";
    }

    if (!formData.modelCode || formData.modelCode.trim() === "") {
      newErrors.modelCode = "Model Code is required";
    } else if (formData.modelCode.length > 20) {
      newErrors.modelCode = "Model Code cannot exceed 20 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.modelCode)) {
      newErrors.modelCode =
        "Model Code can only contain alphanumeric characters (no spaces)";
    }

    setErrors(newErrors);

    // If there are errors, make sure the accordion is expanded
    if (Object.keys(newErrors).length > 0) {
      setAccordionExpanded(true);
      // Use setTimeout to ensure state updates before scrolling
      setTimeout(() => {
        scrollToTop(createAccordionRef);
      }, 100);
    }

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Update the handleChange function to ensure proper clearing of dependent fields
  const handleChange = (field, value) => {
    console.log("handleChange called for", field, "with value:", value);

    // Case 1: When a dropdown is cleared (null/undefined selected)
    if (value === null || value === undefined) {
      // Handle Brand clearing - cascade to clear Category and SubCategory
      if (field === "brandID") {
        // Clear dependent dropdown options
        setCategoryList([]);
        setSubCategoryList([]);

        // Update formData in a single state update to clear all dependent values
        setFormData((prev) => ({
          ...prev,
          brandID: 0,
          categoryID: 0,
          subCategoryID: 0,
        }));

        // Only show error for Brand, not for dependent fields
        setErrors((prev) => ({
          ...prev,
          brandID: "Brand is required",
        }));
        return;
      }
      // Handle Category clearing - cascade to clear SubCategory only
      else if (field === "categoryID") {
        // Clear subcategory options
        setSubCategoryList([]);

        // Update formData to clear categoryID and subCategoryID
        setFormData((prev) => ({
          ...prev,
          categoryID: 0,
          subCategoryID: 0,
        }));

        // Only show error for Category, not for Sub-Category
        setErrors((prev) => ({
          ...prev,
          categoryID: "Category is required",
        }));
        return;
      }
      // Handle SubCategory clearing
      else if (field === "subCategoryID") {
        // Just update formData for subCategoryID
        setFormData((prev) => ({
          ...prev,
          subCategoryID: 0,
        }));

        // Set error
        setErrors((prev) => ({
          ...prev,
          subCategoryID: "Sub-Category is required",
        }));
        return;
      }
      // Handle Model Type clearing
      else if (field === "modelType") {
        setFormData((prev) => ({
          ...prev,
          modelType: 0,
        }));

        setErrors((prev) => ({ ...prev, modelType: "Model Type is required" }));
        return;
      }
      // Handle Model Mode clearing
      else if (field === "modelMode") {
        setFormData((prev) => ({
          ...prev,
          modelMode: 0,
        }));

        setErrors((prev) => ({ ...prev, modelMode: "Model Mode is required" }));
        return;
      }

      // Default case for other non-dropdown fields
      setFormData((prev) => ({
        ...prev,
        [field]: field === "modelName" || field === "modelCode" ? "" : 0,
      }));

      const fieldName =
        field === "modelName"
          ? "Model Name"
          : field === "modelCode"
          ? "Model Code"
          : field;

      setErrors((prev) => ({ ...prev, [field]: `${fieldName} is required` }));
      return;
    }

    // Case 2: For non-null values, extract the correct value
    let newValue;

    if (typeof value === "object") {
      // For dropdown objects - try to get the ID based on field name
      if (field === "brandID" && value.brandID !== undefined) {
        newValue = value.brandID;
        setErrors((prev) => ({ ...prev, brandID: "" })); // Clear error when valid
      } else if (field === "categoryID" && value.categoryID !== undefined) {
        newValue = value.categoryID;
        setErrors((prev) => ({ ...prev, categoryID: "" })); // Clear error when valid
      } else if (
        field === "subCategoryID" &&
        value.subCategoryID !== undefined
      ) {
        newValue = value.subCategoryID;
        setErrors((prev) => ({ ...prev, subCategoryID: "" })); // Clear error when valid
      } else if (field === "modelType" && value.value !== undefined) {
        newValue = value.value;
        setErrors((prev) => ({ ...prev, modelType: "" })); // Clear error when valid
      } else if (field === "modelMode" && value.value !== undefined) {
        newValue = value.value;
        setErrors((prev) => ({ ...prev, modelMode: "" })); // Clear error when valid
      }
      // Fallback for other object values
      else {
        newValue = value.value || value.id || 0;
      }
    } else {
      // For direct values (like text inputs)
      newValue = value;

      // Input validation for modelName and modelCode
      if (field === "modelName") {
        // Check length first - display error but allow typing to continue
        if (newValue.length > 50) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 50), // Truncate to 50 chars
          }));
          setErrors((prev) => ({
            ...prev,
            modelName: "Model Name cannot exceed 50 characters",
          }));
          return; // Don't continue with normal update
        }

        // If input contains non-alphanumeric-space characters, don't update
        if (newValue && !/^[a-zA-Z0-9 ]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            modelName:
              "Model Name can only contain alphanumeric characters and spaces",
          }));
          return; // Don't update the form data
        }

        // Clear errors for valid input
        if (newValue.trim() !== "") {
          setErrors((prev) => ({ ...prev, modelName: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            modelName: "Model Name is required",
          }));
        }
      } else if (field === "modelCode") {
        // Check length first - display error but allow typing to continue
        if (newValue.length > 20) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 20), // Truncate to 20 chars
          }));

          setErrors((prev) => ({
            ...prev,
            modelCode: "Model Code cannot exceed 20 characters",
          }));
          return; // Don't continue with normal update
        }

        // If input contains non-alphanumeric characters, don't update
        if (newValue && !/^[a-zA-Z0-9]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            modelCode:
              "Model Code can only contain alphanumeric characters (no spaces)",
          }));
          return; // Don't update the form data
        }

        // Clear errors for valid input
        if (newValue.trim() !== "") {
          setErrors((prev) => ({ ...prev, modelCode: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            modelCode: "Model Code is required",
          }));
        }
      }
    }

    // First update the form data
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Then handle cascading data loading and field clearing
    if (field === "brandID") {
      // Update category list
      console.log("Loading categories for brandID:", newValue);
      getCategory(newValue);

      // Clear dependent fields
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        categoryID: 0,
        subCategoryID: 0,
      }));

      // Clear the subcategory options since category changed
      setSubCategoryList([]);
    } else if (field === "categoryID") {
      // Update subcategory list
      console.log(
        "Loading subcategories for categoryID:",
        newValue,
        "and brandID:",
        formData.brandID
      );
      getSubCategory(formData.brandID, newValue);

      // Clear subcategory selection
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        subCategoryID: 0,
      }));
    }
  };

  const handleEdit = async (row) => {
    try {
      // Set form data with the selected row's values
      setFormData({
        modelName: row.modelName || "",
        modelCode: row.modelCode || "",
        status: row.status || 1,
        modelID: row.modelID || 0,
        subCategoryID: row.subCategoryID || 0,
        categoryID: row.categoryID || 0,
        brandID: row.brandID || 0,
        modelMode: row.modelModeID || 0,
        modelType: row.modelType === "Saleable" ? 1 : 2,
        callType: 2, // 2 = Update
      });

      // Load dependent dropdowns if needed
      if (row.brandID) {
        getCategory(row.brandID);
      }

      if (row.brandID && row.categoryID) {
        getSubCategory(row.brandID, row.categoryID);
      }

      // Set edit mode to true
      setIsEditMode(true);

      // Clear any existing errors
      setErrors({});

      // Ensure the accordion is expanded
      setAccordionExpanded(true);

      // Use setTimeout to ensure state updates before scrolling
      setTimeout(() => {
        scrollToTop(createAccordionRef);
      }, 100);
      setSearchAccordionExpanded(false); // Explicitly close search accordion
    } catch (error) {
      console.error("Error setting up edit form:", error);
    }
  };

  const handleCancel = () => {
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

    // Keep accordion expanded for better UX
    setAccordionExpanded(true);
  };

  const handlePostRequest = async () => {
    // Validate form first
    if (!validateForm()) {
      // Validation already handles scrolling in validateForm function
      return;
    }

    try {
      setCreateStatus(null);
      setCreateTitle("");

      // Set the correct callType based on whether we're editing or creating
      const updatedForm = {
        ...formData,
        callType: isEditMode ? 2 : 1, // 1=Insert, 2=Update
      };

      const response = await manageModel(updatedForm);
      if (response.statusCode == 200) {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);

        // Reset form and exit edit mode
        handleCancel();

        // Refresh the model list
        getModelList();

        // Scroll to top to show success message
        scrollToTop();
      } else {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);

        // Scroll to form to show error message
        scrollToTop(createAccordionRef);
      }
    } catch (error) {
      setCreateStatus(error.statusCode);
      setCreateTitle(error.statusMessage);
      console.log(error);

      // Scroll to form to show error message
      scrollToTop(createAccordionRef);
    }
  };

  const handleStatus = async (row, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      setUpdatingRowId(row.modelID);
      // Prepare data for status update API call with all form fields
      const statusUpdateData = {
        ...formData,
        modelName: row.modelName || "",
        modelCode: row.modelCode || "",
        status: newStatus ? 1 : 0, // Convert boolean to 1/0
        modelID: row.modelID,
        subCategoryID: row.subCategoryID || 0,
        categoryID: row.categoryID || 0,
        brandID: row.brandID || 0,
        modelMode:
          row.modelMode === "Serialized"
            ? 3
            : row.modelMode === "Batch Coded"
            ? 2
            : 1,
        modelType: row.modelType === "Saleable" ? 1 : 2,
        callType: 3, // 3 = Status Update
      };

      // Call the API
      const response = await manageModel(statusUpdateData);
      console.log(`response :`, response);
      if (response.statusCode === "200") {
        // Show success message
         setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Status updated successfully");
        setTimeout(() => {
          setSearchStatus(null);
          setSearchTitle("");
        }, 5000);
        // Add delay before refreshing the table
        setTimeout(() => {
          getModelList();
        }, 500); // Reduced to 500ms for better UX
      } else {
        // Show error message
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSearchStatus(error.statusCode || 500);
      setSearchTitle(
        error.statusMessage || "An error occurred while updating status"
      );
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
    }
  };

  // Add this useEffect to handle status timeout
  useEffect(() => {
    if (status === "200") {
      const timer = setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000); // Success message will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
    if (createStatus === "200") {
      const timer = setTimeout(() => {
        setCreateStatus(null);
        setCreateTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, createStatus]);

  // State for export loading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  // Update the search function to include model name and code
  const handleSearch = () => {
    setTableLoading(true);
    // First reset pagination state - do this BEFORE updating searchParams
    setPage(0); // Reset to first page (0-based for UI)
    setRowsPerPage(10); // Reset to 10 rows per page
    setSearchStatus(null);
    setSearchTitle("");
    // Update search parameters with form data
    const updatedParams = {
      ...searchParams,
      brandID: searchFormData.brandID,
      categoryID: searchFormData.categoryID,
      subCategoryID: searchFormData.subCategoryID,
      modelName: searchFormData.modelName,
      modelCode: searchFormData.modelCode,
      pageIndex: 1, // Reset to first page (1-based for API)
      pageSize: 10, // Set page size to 10
    };

    // Update search params for API
    setSearchParams(updatedParams);

    // Show table when search is performed
    setTableVisible(true);

    // Fetch data with the updated parameters
    getModelList(updatedParams);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pl: { xs: 1, sm: 1, md: 0 },
          pr: { xs: 0, sm: 0, md: "180px", lg: "270px" }, // Adjust right padding for activity panel
          // isolation: "isolate",
        }}
      >
        {/* Breadcrumbs Header */}
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
          <Grid item xs={12} pr={-3}>
            <BreadcrumbsHeader pageTitle="Model" />
          </Grid>

          <Grid item xs={12} ml={0}>
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
              <Grid item sx={{ zIndex: 1000 }}>
                {formLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <div
                      ref={createAccordionRef}
                      style={{ position: "relative", zIndex: 1000 }}
                    >
                      <NuralAccordion2
                        title={isEditMode ? "Update Model" : "Create Model"}
                        backgroundColor={LIGHT_GRAY2}
                        onChange={handleAccordionChange}
                        controlled={true}
                        expanded={accordionExpanded || isEditMode}
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
                              BRAND <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={brandList}
                              getOptionLabel={(option) => option.brandName}
                              isOptionEqualToValue={(option, value) =>
                                option?.brandID === value?.brandID
                              }
                              value={
                                brandList.find(
                                  (item) => item.brandID == formData.brandID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("brandID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.brandID}
                              errorMessage={errors.brandID}
                              loading={brandLoading}
                            />
                            {errors.brandID && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.brandID}
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
                              CATEGORY <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={categoryList}
                              getOptionLabel={(option) => option.categoryName}
                              isOptionEqualToValue={(option, value) =>
                                option?.categoryID === value?.categoryID
                              }
                              value={
                                categoryList.find(
                                  (item) =>
                                    item.categoryID == formData.categoryID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("categoryID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.categoryID}
                              errorMessage={errors.categoryID}
                              loading={categoryLoading}
                            />
                            {errors.categoryID && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.categoryID}
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
                              SUB-CATEGORY <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={subCategoryList}
                              getOptionLabel={(option) =>
                                option.subCategoryName
                              }
                              isOptionEqualToValue={(option, value) =>
                                option?.subCategoryID === value?.subCategoryID
                              }
                              value={
                                subCategoryList.find(
                                  (item) =>
                                    item.subCategoryID == formData.subCategoryID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("subCategoryID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.subCategoryID}
                              errorMessage={errors.subCategoryID}
                              loading={subCategoryLoading}
                            />
                            {errors.subCategoryID && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.subCategoryID}
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
                              MODEL TYPE <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={ModelType}
                              getOptionLabel={(option) => option.label}
                              isOptionEqualToValue={(option, value) =>
                                option?.value === value?.value
                              }
                              value={
                                ModelType.find(
                                  (item) => item.value == formData.modelType
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("modelType", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.modelType}
                              errorMessage={errors.modelType}
                              loading={false}
                            />
                            {errors.modelType && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.modelType}
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
                              MODEL MODE <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={ModelMode}
                              getOptionLabel={(option) => option.label}
                              isOptionEqualToValue={(option, value) =>
                                option?.value === value?.value
                              }
                              value={
                                ModelMode.find(
                                  (item) => item.value == formData.modelMode
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("modelMode", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.modelMode}
                              errorMessage={errors.modelMode}
                              loading={false}
                            />
                            {errors.modelMode && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.modelMode}
                              </Typography>
                            )}
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
                              MODEL NAME <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.modelName || ""}
                              onChange={(event) => {
                                handleChange("modelName", event.target.value);
                              }}
                              placeholder="ENTER MODEL NAME"
                              error={!!errors.modelName}
                              errorMessage={errors.modelName}
                              onBlur={() => {
                                if (
                                  !formData.modelName ||
                                  formData.modelName.trim() === ""
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelName: "Model Name is required",
                                  }));
                                } else if (formData.modelName.length > 50) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelName:
                                      "Model Name cannot exceed 50 characters",
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    modelName: formData.modelName.substring(
                                      0,
                                      50
                                    ),
                                  }));
                                } else if (
                                  !/^[a-zA-Z0-9 ]+$/.test(formData.modelName)
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelName:
                                      "Model Name can only contain alphanumeric characters and spaces",
                                  }));
                                }
                              }}
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
                              MODEL CODE <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.modelCode || ""}
                              onChange={(event) => {
                                handleChange(
                                  "modelCode",
                                  event.target.value || null
                                );
                              }}
                              placeholder="ENTER MODEL CODE"
                              error={!!errors.modelCode}
                              errorMessage={errors.modelCode}
                              onBlur={() => {
                                if (
                                  !formData.modelCode ||
                                  formData.modelCode.trim() === ""
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelCode: "Model Code is required",
                                  }));
                                } else if (formData.modelCode.length > 20) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelCode:
                                      "Model Code cannot exceed 20 characters",
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    modelCode: formData.modelCode.substring(
                                      0,
                                      20
                                    ),
                                  }));
                                } else if (
                                  !/^[a-zA-Z0-9]+$/.test(formData.modelCode)
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelCode:
                                      "Model Code can only contain alphanumeric characters (no spaces)",
                                  }));
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </NuralAccordion2>
                    </div>

                    {accordionExpanded && (
                      <Grid container spacing={1} pr={0}>
                        <Grid container sx={{ width: "100%", mt: "16px" }}>
                          {createStatus && (
                            <StatusModel
                              width="100%"
                              status={createStatus}
                              title={createTitle}
                              onClose={() => setCreateStatus(null)}
                            />
                          )}
                        </Grid>

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
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item sx={{ zIndex: 990 }}>
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
                            BRAND
                          </Typography>
                          <NuralAutocomplete
                            options={searchBrandList}
                            getOptionLabel={(option) => option.brandName}
                            isOptionEqualToValue={(option, value) =>
                              option?.brandID === value?.brandID
                            }
                            value={
                              searchBrandList.find(
                                (item) => item.brandID == searchFormData.brandID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange("brandID", newValue || null);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchBrandLoading}
                          />
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
                            CATEGORY
                          </Typography>
                          <NuralAutocomplete
                            options={searchCategoryList}
                            getOptionLabel={(option) => option.categoryName}
                            isOptionEqualToValue={(option, value) =>
                              option?.categoryID === value?.categoryID
                            }
                            value={
                              searchCategoryList.find(
                                (item) =>
                                  item.categoryID == searchFormData.categoryID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange(
                                "categoryID",
                                newValue || null
                              );
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchCategoryLoading}
                          />
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
                            SUB-CATEGORY
                          </Typography>
                          <NuralAutocomplete
                            options={searchSubCategoryList}
                            getOptionLabel={(option) => option.subCategoryName}
                            isOptionEqualToValue={(option, value) =>
                              option?.subCategoryID === value?.subCategoryID
                            }
                            value={
                              searchSubCategoryList.find(
                                (item) =>
                                  item.subCategoryID ==
                                  searchFormData.subCategoryID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange(
                                "subCategoryID",
                                newValue || null
                              );
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchSubCategoryLoading}
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
                            MODEL NAME
                          </Typography>

                          <NuralAutocomplete
                            key={`model-name-${
                              searchFormData.selectedModel
                                ? searchFormData.selectedModel.modelID
                                : "none"
                            }`}
                            options={modelListForDropdown}
                            getOptionLabel={(option) => option.modelName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.modelID === value?.modelID
                            }
                            value={searchFormData.selectedModel || null}
                            onChange={(event, newValue) => {
                              handleSearchChange("modelName", newValue);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={
                              searchFormData.subCategoryID && tableLoading
                            }
                            disabled={!searchFormData.subCategoryID}
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
                            MODEL CODE
                          </Typography>
                          <NuralAutocomplete
                            key={`model-code-${
                              searchFormData.selectedModel
                                ? searchFormData.selectedModel.modelID
                                : "none"
                            }`}
                            options={modelListForDropdown}
                            getOptionLabel={(option) => option.modelCode || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.modelID === value?.modelID
                            }
                            value={searchFormData.selectedModel || null}
                            onChange={(event, newValue) => {
                              handleSearchChange("modelCode", newValue);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={
                              searchFormData.subCategoryID && tableLoading
                            }
                            disabled={!searchFormData.subCategoryID}
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
                    </NuralAccordion2>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>{" "}
        <Grid container sx={{ width: "100%", margin: "16px", mb: 4 }}>
          {searchStatus && (
            <StatusModel
              width="100%"
              status={searchStatus}
              title={searchTitle}
              onClose={() => setSearchStatus(null)}
            />
          )}
          {/* {searchStatus && (
          )}
          {/* {searchStatus && (
            <StatusModel
              width="100%"
              status={searchStatus}
              title={searchTitle}
              onClose={() => setSearchStatus(null)}
            />
          )} */}
        </Grid>
        { tableVisible && (
          <Grid
            item
            xs={12}
            mt={-4}
            pr={1.5}

            // sx={{
            //   p: { xs: 1, sm: 2,md:1.5 },
            //   position: "relative",
            //   zIndex: 900,
            //   overflow: "hidden",
            //   transition: "all 0.3s ease-in-out",
            //   opacity: tableVisible ? 1 : 0,
            //   transform: tableVisible ? "translateY(0)" : "translateY(-10px)",
            // }}
          >
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 50px)",
                overflow: "auto",
                position: "relative",
                zIndex: 900,
                transition: "all 0.3s ease-in-out",
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
                      colSpan={10}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 950,
                        borderBottom: "none",
                        boxShadow: "0 2px 2px rgba(0,0,0,0.05)", // Add subtle shadow
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
                        top: "45px", // Adjusted to account for "List" header
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 949,
                        "&::after": {
                          // Add bottom border effect
                          content: '""',
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "100%",
                          borderBottom: "2px solid #e0e0e0",
                        },
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>S.NO</Grid>
                      </Grid>
                    </TableCell>
                    {cells.map((cell, index) => (
                      <TableCell
                        key={index}
                        onClick={() =>
                          cell.sortable !== false &&
                          cell.key &&
                          handleSort(cell.key)
                        }
                        sx={{
                          ...tableHeaderStyle,
                          cursor:
                            cell.sortable !== false ? "pointer" : "default",
                          position: "sticky",
                          top: "45px", // Same as S.NO cell
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 949,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{cell.label}</Grid>
                          {cell.sortable !== false && cell.key && (
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
                  {tableLoading || statusUpdateLoading ? (
                    <TableRow pr={2}>
                      <TableCell colSpan={10} align="center">
                        <TableRowSkeleton
                          columns={10} // 10 columns to match your table
                          rows={10} // Show 10 skeleton rows
                          imagePath="./Icons/emptyFile.svg"
                          // sx={{ height: "calc(100vh - 50px)" }}
                        />
                      </TableCell>
                    </TableRow>
                  ) : Array.isArray(filteredRows) && filteredRows.length > 0 ? (
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
                        <TableCell sx={{ ...rowstyle }}>
                          {row.modelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.modelCode}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.brandName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.categoryName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.subCategoryName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.modelType}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.modelMode}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={row.status === 1}
                            onChange={(e) => {
                              // Do NOT update UI immediately - wait for API response
                              // Only pass the intended new status to handleStatus
                              handleStatus(row, e.target.checked);
                            }}
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
                        <TableCell sx={rowstyle}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            disabled={statusUpdateLoading}
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
                      <TableCell colSpan={10} align="center">
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
          </Grid>
        )}
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
              title="Export Model List"
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

export default Model;
