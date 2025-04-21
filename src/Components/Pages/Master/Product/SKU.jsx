import { Grid, Switch, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import EditIcon from "@mui/icons-material/Edit";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  DARK_BLUE,
} from "../../../Common/colors";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import Required from "../../../Common/Required";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import {
  fetchBrandList,
  fetchCategoryList,
  fetchSubCategoryList,
  GetModelListForDropdown,
  GetColorDropdownList,
  GetSKUListForMoto,
  GetSKUListForDropdown,
  GetHSNMasterListForDropdown,
  ManageSkuForMoto,
} from "../../../Api/Api";
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
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Keep for sorting
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"; // Keep for sorting
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

// Column definitions for the table
const columnDefinitions = [
  { label: "SKU CODE", field: "skuCode" },
  { label: "SKU NAME", field: "skuName" },
  { label: "BRAND", field: "brandName" },
  { label: "CATEGORY", field: "categoryName" },
  { label: "SUB-CATEGORY", field: "subCategoryName" },
  { label: "MODEL", field: "modelName" },
  { label: "COLOR", field: "colorName" },
  { label: "HSN CODE", field: "hsnCode" },
  { label: "STATUS", field: "status" },
  { label: "ACTION", field: "action" },
];

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

const SKU = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sku");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [accordionExpanded, setAccordionExpanded] = useState(true); // Keep Create open initially
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false); // Keep View closed initially

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

  const [formData, setFormData] = useState({
    skuID: 0,
    skuname: "",
    skucode: "",
    skudesc: "",
    cartonSize: 0,
    eanCode: "",
    articleCode: "",
    skuAttribute1: "",
    skuAttribute2: "",
    brandID: 0,
    categoryID: 0,
    subCategoryID: 0,
    modelID: 0,
    status: 1, //1-Active,0-Deactive
    callType: 1, //1-Insert, 2-Update, 3-Status Update
    hsnID: 0,
    colorID: 0,
    skuName: "",
    skuCode: "",
    skuDescription: "",
    hsnCode: "",
    hsnDesc: "",
    attribute1: "",
    attribute2: "",
  });

  const [errors, setErrors] = useState({});
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [colorLoading, setColorLoading] = useState(false); // Keep colorLoading for create form

  const [searchBrandList, setSearchBrandList] = useState([]);
  const [searchCategoryList, setSearchCategoryList] = useState([]);
  const [searchSubCategoryList, setSearchSubCategoryList] = useState([]);
  const [searchModelList, setSearchModelList] = useState([]);
  const [searchColorList, setSearchColorList] = useState([]);
  const [searchBrandLoading, setSearchBrandLoading] = useState(false);
  const [searchCategoryLoading, setSearchCategoryLoading] = useState(false);
  const [searchSubCategoryLoading, setSearchSubCategoryLoading] =
    useState(false);
  const [searchModelLoading, setSearchModelLoading] = useState(false);
  const [searchColorLoading, setSearchColorLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    skuname: "",
    skuID: 0,
    skucode: "",
    brandID: 0,
    categoryID: 0,
    subCategoryID: 0,
    colorID: 0,
    modelID: 0,
    selectionMode: 2, //will be pass
    status: 2, //2-ALL, 1-Active, 0-Deactive
    pageIndex: 1, //1=UI, -1=Excel
    pageSize: 10,
  });

  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [createStatus, setCreateStatus] = useState(null);
  const [createTitle, setCreateTitle] = useState("");
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [loadingRows, setLoadingRows] = useState(new Set());

  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  // Add ref for scrolling
  const createAccordionRef = useRef(null);

  // Helper function for smooth scrolling
  const scrollToTop = (elementRef = null) => {
    if (elementRef && elementRef.current) {
      // If element ref is provided, scroll to that element
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // Otherwise scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...tableData]); // Reset to original order
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      let valueA, valueB;

      if (columnName === "categoryName") {

        valueA = (a.categoryName !== undefined && a.categoryName !== null) ? a.categoryName : 
                 (a.category !== undefined && a.category !== null) ? a.category : '';
        
        valueB = (b.categoryName !== undefined && b.categoryName !== null) ? b.categoryName : 
                 (b.category !== undefined && b.category !== null) ? b.category : '';
      }
      else if (columnName === "subCategoryName") {
        valueA = (a.subCategoryName !== undefined && a.subCategoryName !== null) ? a.subCategoryName : 
                 (a.subCategory !== undefined && a.subCategory !== null) ? a.subCategory : '';
        
        valueB = (b.subCategoryName !== undefined && b.subCategoryName !== null) ? b.subCategoryName : 
                 (b.subCategory !== undefined && b.subCategory !== null) ? b.subCategory : '';
      }
      else if (columnName === "modelName") {
        valueA = (a.modelName !== undefined && a.modelName !== null) ? a.modelName : 
                 (a.model !== undefined && a.model !== null) ? a.model : '';
        
        valueB = (b.modelName !== undefined && b.modelName !== null) ? b.modelName : 
                 (b.model !== undefined && b.model !== null) ? b.model : '';
      }
      else {
        valueA = (a[columnName] !== undefined && a[columnName] !== null) ? a[columnName] : '';
        valueB = (b[columnName] !== undefined && b[columnName] !== null) ? b[columnName] : '';
      }
      
      const aValue = typeof valueA === 'string' ? valueA.toLowerCase() : valueA.toString().toLowerCase();
      const bValue = typeof valueB === 'string' ? valueB.toLowerCase() : valueB.toString().toLowerCase();


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

  const [skuDropdownList, setSkuDropdownList] = React.useState([]);
  const [hsnList, setHsnList] = React.useState([]);
  const [hsnLoading, setHsnLoading] = React.useState(false);
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };
  const getSKUDropdown = async () => {
    try {
      const params = {
        skuID: 0,
        categoryID: 0 /*product CategoryID*/,
        modelID: 0,
        subCategoryID: 0 /*productID*/,
        brandID: 0,
      };
      const response = await GetSKUListForDropdown(params);
      if (response.statusCode == 200) {
        setSkuDropdownList(response.skuDropdownList || []);
      } else {
        setSkuDropdownList([]);
      }
    } catch (error) {
      console.error("Error fetching SKU dropdown:", error);
      setSkuDropdownList([]);
    }
  };

  const getHSNList = async () => {
    try {
      const params = {
        hsnID: 0,
      };
      const response = await GetHSNMasterListForDropdown(params);
      if (response.statusCode == 200) {
        setHsnList(response.hsnMasterDropdownList || []);
        console.log(response.hsnMasterDropdownList);
      } else {
        setHsnList([]);
      }
    } catch (error) {
      console.error("Error fetching HSN list:", error);
      setHsnList([]);
    } finally {
      setHsnLoading(false); // Keep this, it updates loading state
    }
  };
  useEffect(() => {
    setFormLoading(true);
    setSearchFormLoading(true);
    setTableLoading(true);

    getBrandList();
    getSearchBrandList();
    getSearchColorList();
    getColorList();
    getSKUDropdown();
    getHSNList();
    getSKUList();
  }, []);

  useEffect(() => {
    let timeoutId;
    if (createStatus) {
      timeoutId = setTimeout(() => {
        setCreateStatus(null);
        setCreateTitle("");
      }, 5000); // 5 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [createStatus]); // Only run when createStatus changes

  const getSKUList = async (params = searchParams) => {
    try {
      setTableLoading(true);

      setTableData([]); // Clear previous data immediately
      setFilteredRows([]);
      setTotalRecords(0);
      // Clear previous errors only if a new search is initiated
      // setSearchStatus(null); 
      // setSearchTitle("");
      

      const startTime = Date.now();

      const response = await GetSKUListForMoto(params);

      if (response.statusCode == 200) {
        const data = response.skuMasterList || [];
        setTableData(data);
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || data.length);
        setSearchStatus(null); // Clear errors on success
        setSearchTitle("");

        // Ensure minimum loading time of 800ms for skeleton to be visible
        const loadingTime = Date.now() - startTime;
        if (loadingTime < 800) {
          await new Promise(resolve => setTimeout(resolve, 800 - loadingTime));
        }
      } else {
        // Error case (including 404)
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "An error occurred");
        setTableData([]); // Ensure table data is empty on error
        setFilteredRows([]);
        setTotalRecords(0);

        // No minimum loading time needed if error occurs quickly

      }
    } catch (error) {
      console.error("Error in getSKUList:", error);
      setSearchStatus(500); // Generic error status
      setSearchTitle("Failed to fetch data. Please try again.");
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  const getBrandList = async () => {
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

  const getCategoryList = async (brandID = 0) => {
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

  const getSubCategoryList = async (brandID = 0, categoryID = 0) => {
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

  const getModelList = async (
    brandID = 0,
    categoryID = 0,
    subCategoryID = 0
  ) => {
    try {
      setModelLoading(true);
      const params = {
        categoryID: categoryID,
        modelID: 0,
        subCategoryID: subCategoryID,
        brandID: brandID,
      };
      const response = await GetModelListForDropdown(params);
      if (response.statusCode == 200) {
        setModelList(response.modelDropdownList || []);
      } else {
        setModelList([]);
      }
    } catch (error) {
      setModelList([]);
      console.log(error);
    } finally {
      setModelLoading(false);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Required field validation for dropdowns
    if (!formData.brandID) {
      newErrors.brandID = "Brand is required";
    }

    if (!formData.categoryID) {
      newErrors.categoryID = "Category is required";
    }

    if (!formData.subCategoryID) {
      newErrors.subCategoryID = "Sub-Category is required";
    }

    if (!formData.modelID) {
      newErrors.modelID = "Model is required";
    }

    if (!formData.colorID) {
      newErrors.colorID = "Color is required";
    }

    // Text field validations
    if (!formData.skuCode || formData.skuCode.trim() === "") {
      newErrors.skuCode = "SKU Code is required";
    } else if (formData.skuCode.length > 20) { // Update limit to 20
      newErrors.skuCode = "SKU Code cannot exceed 20 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.skuCode)) {
      newErrors.skuCode =
        "SKU Code can only contain alphanumeric characters (no spaces)";
    }

    if (!formData.skuName || formData.skuName.trim() === "") {
      newErrors.skuName = "SKU Name is required";
    } else if (formData.skuName.length > 50) {
      newErrors.skuName = "SKU Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.skuName)) {
      newErrors.skuName =
        "SKU Name can only contain alphanumeric characters and spaces";
    }

    if (!formData.skuDescription || formData.skuDescription.trim() === "") {
      newErrors.skuDescription = "SKU Description is required";
    } else if (formData.skuDescription.length > 50) { // Update limit to 50
      newErrors.skuDescription = "SKU Description cannot exceed 50 characters";
    }

    if (formData.hsnCode && formData.hsnCode.length > 20) {
      newErrors.hsnCode = "HSN Code cannot exceed 20 characters";
    } else if (formData.hsnCode && !/^[a-zA-Z0-9]+$/.test(formData.hsnCode)) {
      newErrors.hsnCode = "HSN Code can only contain alphanumeric characters";
    }

    // Attribute validations
    if (formData.attribute1 && formData.attribute1.length > 100) {
      newErrors.attribute1 = "Attribute 1 cannot exceed 100 characters";
    }

    if (formData.attribute2 && formData.attribute2.length > 100) {
      newErrors.attribute2 = "Attribute 2 cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    console.log("handleChange called for", field, "with value:", value);

    // Handle null/undefined values for dropdowns
    if (value === null || value === undefined) {
      // Handle Brand clearing - cascade to clear Category, SubCategory, Model and Color
      if (field === "brandID") {
        // Clear dependent dropdown options
        setCategoryList([]);
        setSubCategoryList([]);
        setModelList([]);
        setColorList([]);

        // Update formData to clear dependent fields
        setFormData((prev) => ({
          ...prev,
          brandID: 0,
          categoryID: 0,
          subCategoryID: 0,
          modelID: 0,
          colorID: 0,
        }));

        // Only show error for Brand
        setErrors((prev) => ({
          ...prev,
          brandID: "Brand is required",
        }));
        return;
      }
      // Handle Category clearing - cascade to clear SubCategory, Model and Color
      else if (field === "categoryID") {
        // Clear subcategory options
        setSubCategoryList([]);
        setModelList([]);
        setColorList([]);

        // Update formData to clear dependent fields
        setFormData((prev) => ({
          ...prev,
          categoryID: 0,
          subCategoryID: 0,
          modelID: 0,
          colorID: 0,
        }));

        // Only show error for Category
        setErrors((prev) => ({
          ...prev,
          categoryID: "Category is required",
        }));
        return;
      }
      // Handle SubCategory clearing - cascade to clear Model and Color
      else if (field === "subCategoryID") {
        setModelList([]);
        setColorList([]);

        // Update formData to clear dependent fields
        setFormData((prev) => ({
          ...prev,
          subCategoryID: 0,
          modelID: 0,
          colorID: 0,
        }));

        // Set error
        setErrors((prev) => ({
          ...prev,
          subCategoryID: "Sub-Category is required",
        }));
        return;
      }
      // Handle Model clearing - cascade to clear Color
      else if (field === "modelID") {
        setColorList([]);

        // Update formData to clear dependent fields
        setFormData((prev) => ({
          ...prev,
          modelID: 0,
          colorID: 0,
        }));

        // Set error
        setErrors((prev) => ({
          ...prev,
          modelID: "Model is required",
        }));
        return;
      }
      // Handle Color clearing
      else if (field === "colorID") {
        setFormData((prev) => ({
          ...prev,
          colorID: 0,
        }));

        setErrors((prev) => ({
          ...prev,
          colorID: "Color is required",
        }));
        return;
      }

      // Default case for other text fields
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));

      // Set appropriate error message
      const fieldDisplayName =
        field === "skuCode"
          ? "SKU Code"
          : field === "skuName"
          ? "SKU Name"
          : field === "skuDescription"
          ? "SKU Description"
          : field === "hsnCode"
          ? "HSN Code"
          : field === "attribute1"
          ? "Attribute 1"
          : field === "attribute2"
          ? "Attribute 2"
          : field;

      setErrors((prev) => ({
        ...prev,
        [field]: `${fieldDisplayName} is required`,
      }));
      return;
    }

    // Extract value from dropdown objects or use direct value
    let newValue;

    if (typeof value === "object") {
      // For dropdown objects - extract ID based on field name
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
      } else if (field === "modelID" && value.modelID !== undefined) {
        newValue = value.modelID;
        setErrors((prev) => ({ ...prev, modelID: "" })); // Clear error when valid
      } else if (field === "colorID" && value.colorID !== undefined) {
        newValue = value.colorID;
        setErrors((prev) => ({ ...prev, colorID: "" })); // Clear error when valid
      }
      // Fallback for other object values
      else {
        newValue = value.value || value.id || 0;
      }
    } else {
      // For direct values (like text inputs)
      newValue = value;

      // Text field validations
      if (field === "skuCode") {
        // Check length first
        if (newValue.length > 20) { // Update limit to 20
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 20), // Truncate to 20 chars
          }));
          setErrors((prev) => ({
            ...prev,
            skuCode: "SKU Code cannot exceed 20 characters", // Update error message
          }));
          return;
        }

        // If input contains non-alphanumeric characters, show error
        if (newValue && !/^[a-zA-Z0-9]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            skuCode:
              "SKU Code can only contain alphanumeric characters (no spaces)",
          }));
          return;
        }

        // Clear errors for valid input
        if (newValue.trim() !== "") {
          setErrors((prev) => ({ ...prev, skuCode: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            skuCode: "SKU Code is required",
          }));
        }
      } else if (field === "skuName") {
        // Check length first
        if (newValue.length > 50) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 50), // Truncate to 50 chars
          }));
          setErrors((prev) => ({
            ...prev,
            skuName: "SKU Name cannot exceed 50 characters",
          }));
          return;
        }

        // If input contains non-alphanumeric-space characters, show error
        if (newValue && !/^[a-zA-Z0-9 ]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            skuName:
              "SKU Name can only contain alphanumeric characters and spaces",
          }));
          return;
        }

        // Clear errors for valid input
        if (newValue.trim() !== "") {
          setErrors((prev) => ({ ...prev, skuName: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            skuName: "SKU Name is required",
          }));
        }
      } else if (field === "skuDescription") {
        // Check length only
        if (newValue.length > 50) { // Update limit to 50
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 50), // Truncate to 50 chars
          }));
          setErrors((prev) => ({
            ...prev,
            skuDescription: "SKU Description cannot exceed 50 characters", // Update error message
          }));
          return;
        } else if (newValue.trim() === "") {
          setErrors((prev) => ({
            ...prev,
            skuDescription: "SKU Description is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, skuDescription: "" }));
        }
      } else if (field === "hsnCode") {
        // Check length first
        if (newValue.length > 20) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 20), // Truncate to 20 chars
          }));
          setErrors((prev) => ({
            ...prev,
            hsnCode: "HSN Code cannot exceed 20 characters",
          }));
          return;
        }

        // If input contains non-alphanumeric characters, show error
        if (newValue && !/^[a-zA-Z0-9]*$/.test(newValue)) {
          setErrors((prev) => ({
            ...prev,
            hsnCode: "HSN Code can only contain alphanumeric characters",
          }));
          return;
        }

        // Clear errors for valid input
        setErrors((prev) => ({ ...prev, hsnCode: "" }));
      } else if (field === "attribute1") {
        // Check length only for attribute1
        if (newValue.length > 100) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 100), // Truncate to 100 chars
          }));
          setErrors((prev) => ({
            ...prev,
            attribute1: "Attribute 1 cannot exceed 100 characters",
          }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, attribute1: "" }));
        }
      } else if (field === "attribute2") {
        // Check length only for attribute2
        if (newValue.length > 100) {
          setFormData((prev) => ({
            ...prev,
            [field]: newValue.substring(0, 100), // Truncate to 100 chars
          }));
          setErrors((prev) => ({
            ...prev,
            attribute2: "Attribute 2 cannot exceed 100 characters",
          }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, attribute2: "" }));
        }
      }
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Handle cascading data loading for dropdowns
    if (field === "brandID") {
      // Load categories based on selected brand
      getCategoryList(newValue);

      // Clear dependent fields
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        categoryID: 0,
        subCategoryID: 0,
        modelID: 0,
        colorID: 0,
      }));

      // Clear dependent options
      setSubCategoryList([]);
      setModelList([]);
      setColorList([]);
    } else if (field === "categoryID") {
      // Load subcategories based on selected brand and category
      getSubCategoryList(formData.brandID, newValue);

      // Clear dependent fields
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        subCategoryID: 0,
        modelID: 0,
        colorID: 0,
      }));

      // Clear dependent options
      setModelList([]);
      setColorList([]);
    } else if (field === "subCategoryID") {
      // Load models based on selected brand, category, and subcategory
      getModelList(formData.brandID, formData.categoryID, newValue);

      // Clear dependent fields
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        modelID: 0,
        colorID: 0,
      }));

      // Clear dependent options
      setColorList([]);
    } else if (field === "modelID") {
      // Load colors based on selected brand and model
      getColorList(formData.brandID, newValue);

      // Clear dependent fields
      setFormData((prev) => ({
        ...prev,
        [field]: newValue,
        colorID: 0,
      }));
    }

    // Add HSN handling
    else if (field === "hsnID") {
      if (value === null) {
        setFormData((prev) => ({
          ...prev,
          hsnID: 0,
          hsnCode: "",
          hsnDesc: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          hsnID: value.hsnID,
          hsnCode: value.hsnCode,
          hsnDesc: value.hsnDesc,
        }));
      }
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

  // Get model list for search filter based on selected brand, category, and subcategory
  const getSearchModelList = async (
    brandID = 0,
    categoryID = 0,
    subCategoryID = 0
  ) => {
    try {
      setSearchModelLoading(true);
      const params = {
        categoryID: categoryID,
        modelID: 0,
        subCategoryID: subCategoryID,
        brandID: brandID,
      };
      const response = await GetModelListForDropdown(params);
      if (response.statusCode == 200) {
        setSearchModelList(response.modelDropdownList || []);
      } else {
        setSearchModelList([]);
      }
    } catch (error) {
      setSearchModelList([]);
      console.log(error);
    } finally {
      setSearchModelLoading(false);
    }
  };

  // Get color list for search filter
  const getColorList = async () => {
    try {
      setColorLoading(true); // Use setColorLoading for create form
      const params = {
        colorID: 0,
      };
      const response = await GetColorDropdownList(params);
      if (response.statusCode == 200) {
        setColorList(response.colorDropdownList || []);
      } else {
        setColorList([]);
      }
    } catch (error) {
      setColorList([]);
      console.log(error);
    } finally {
      setColorLoading(false); // Use setColorLoading for create form
    }
  };
  const getSearchColorList = async () => {
    try {
      setSearchColorLoading(true);
      const params = {
        colorID: 0,
      };
      const response = await GetColorDropdownList(params);
      if (response.statusCode == 200) {
        setSearchColorList(response.colorDropdownList || []);
      } else {
        setSearchColorList([]);
      }
    } catch (error) {
      setSearchColorList([]);
      console.log(error);
    } finally {
      setSearchColorLoading(false);
    }
  };

  // Updates to handle search changes
  const handleSearchChange = (field, value) => {
    console.log("handleSearchChange called for", field, "with value:", value);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "skuID" || field === "skuname") {
        // Clear both SKU fields when either is cleared
        setSearchParams((prev) => ({
          ...prev,
          skuID: 0,
          skuname: "",
          skucode: "",
        }));
        return;
      }
      if (field === "brandID") {
        // Clear dependent dropdown options
        setSearchCategoryList([]);
        setSearchSubCategoryList([]);
        setSearchModelList([]);

        // Update search params
        setSearchParams((prev) => ({
          ...prev,
          brandID: 0,
          categoryID: 0,
          subCategoryID: 0,
          modelID: 0,
        }));
        return;
      } else if (field === "categoryID") {
        // Clear subcategory and model options
        setSearchSubCategoryList([]);
        setSearchModelList([]);

        // Update search params
        setSearchParams((prev) => ({
          ...prev,
          categoryID: 0,
          subCategoryID: 0,
          modelID: 0,
        }));
        return;
      } else if (field === "subCategoryID") {
        // Clear model options
        setSearchModelList([]);

        // Update search params
        setSearchParams((prev) => ({
          ...prev,
          subCategoryID: 0,
          modelID: 0,
        }));
        return;
      } else if (field === "modelID") {
        // Just update form data
        setSearchParams((prev) => ({
          ...prev,
          modelID: 0,
          selectedModel: null,
        }));
        return;
      } else if (field === "colorID") {
        // Just update form data
        setSearchParams((prev) => ({
          ...prev,
          colorID: 0,
        }));
        return;
      }

      return;
    }

    // Special handling for SKU fields
    if (field === "skuID" || field === "skuname") {
      if (typeof value === "object" && value !== null) {
        // When a SKU is selected, update both name and code
        setSearchParams((prev) => ({
          ...prev,
          skuID: value.skuID || 0,
          skuname: value.skuName || "",
          skucode: value.skuCode || "",
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
      } else if (field === "modelID" && value.modelID !== undefined) {
        newValue = value.modelID;
      } else if (field === "colorID" && value.colorID !== undefined) {
        newValue = value.colorID;
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

    // Handle cascading data loading
    if (field === "brandID") {
      // Update category list
      console.log("Loading search categories for brandID:", newValue);
      getSearchCategoryList(newValue);

      // Clear dependent fields
      setSearchParams((prev) => ({
        ...prev,
        [field]: newValue,
        categoryID: 0,
        subCategoryID: 0,
        modelID: 0,
      }));

      // Clear dependent options
      setSearchSubCategoryList([]);
      setSearchModelList([]);
    } else if (field === "categoryID") {
      // Update subcategory list
      console.log(
        "Loading search subcategories for categoryID:",
        newValue,
        "and brandID:",
        searchParams.brandID
      );
      getSearchSubCategoryList(searchParams.brandID, newValue);

      // Clear dependent selections
      setSearchParams((prev) => ({
        ...prev,
        [field]: newValue,
        subCategoryID: 0,
        modelID: 0,
      }));

      // Clear model options
      setSearchModelList([]);
    } else if (field === "subCategoryID") {
      // Update model list
      console.log(
        "Loading search models for subCategoryID:",
        newValue,
        "categoryID:",
        searchParams.categoryID,
        "and brandID:",
        searchParams.brandID
      );
      getSearchModelList(
        searchParams.brandID,
        searchParams.categoryID,
        newValue
      );

      // Clear model selection
      setSearchParams((prev) => ({
        ...prev,
        [field]: newValue,
        modelID: 0,
      }));
    }
  };

  // Functions for search
  const handleSearch = () => {
    setTableLoading(true); // Keep loading indicator while fetching
    setPage(0); // Reset page to 1 for new search
    const updatedParams = { ...searchParams, pageIndex: 1 }; // Ensure pageIndex is reset
    setSearchParams(updatedParams); // Update state before fetching
    getSKUList(updatedParams); // Call API with updated params
  };

  const handleClearSearch = () => {
    setSearchFormLoading(true);
    setSearchStatus(null); // Clear persistent error status explicitly
    setSearchTitle("");
    // Reset search params to default/initial state
    const defaultParams = {
      skuname: "",
      skuID: 0,
      skucode: "",
      brandID: 0,
      categoryID: 0,
      subCategoryID: 0,
      colorID: 0,
      modelID: 0,
      selectionMode: 2,
      status: 2,
      pageIndex: 1,
      pageSize: rowsPerPage, // Use current rowsPerPage
    };
    setSearchParams(defaultParams);

    // Clear dependent dropdown lists for search
    setSearchCategoryList([]);
    setSearchSubCategoryList([]);
    setSearchModelList([]);

    // Reset page for table
    setPage(0);

    // Refresh data with default params and reset loading state
    getSKUList(defaultParams).finally(() => {
      setSearchFormLoading(false);
    });

    // Base dropdowns (Brand, Color, SKU) are usually loaded once initially
    // and don't need to be re-fetched on clear unless specifically required.
  };

  // Handle form submission
  const handleSave = async () => {
    setCreateStatus(null);
    setCreateTitle("");
    if (!validateForm()) {
      console.log("Form has validation errors");
      return;
    }

    try {
      setTableLoading(true);
      const payload = {
        ...formData,
        callType: isEditMode ? 2 : 1, // 1-Insert, 2-Update
      };

      const response = await ManageSkuForMoto(payload);

      if (response.statusCode == 200) {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);
        handleCancel(); // Reset form
        getSKUList(); // Refresh list
      } else {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage);
      }
    } catch (error) {
      setCreateStatus(500);
      setCreateTitle(
        "Error " +
          (isEditMode ? "updating" : "creating") +
          " SKU. Please try again."
      );
      console.error("Error saving SKU:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCancel = () => {
    setFormLoading(true);
    // Reset form to initial state
    setFormData({
      skuID: 0,
      skuname: "",
      skucode: "",
      skudesc: "",
      cartonSize: 0,
      eanCode: "",
      articleCode: "",
      skuAttribute1: "",
      skuAttribute2: "",
      brandID: 0,
      categoryID: 0,
      subCategoryID: 0,
      modelID: 0,
      status: 1, //1-Active,0-Deactive
      callType: 1, //1-Insert, 2-Update, 3-Status Update
      hsnID: 0,
      colorID: 0,
      skuName: "",
      skuCode: "",
      skuDescription: "",
      hsnCode: "",
      hsnDesc: "",
      attribute1: "",
      attribute2: "",
    });

    // Clear all errors
    setErrors({});

    // Reset edit mode
    setIsEditMode(false);

    // Clear dependent dropdowns
    setCategoryList([]);
    setSubCategoryList([]);
    setModelList([]);
    setColorList([]);

    setTimeout(() => {
      // Refresh brand list and other initial data
      getBrandList();
      getHSNList();
      setFormLoading(false);
    }, 500);
  };

  // Add handlePaginationChange function
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);

    setSearchParams((prevState) => ({
      ...prevState,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    }));

    getSKUList(updatedParams);
  };

  const handleEdit = (row) => {
    setAccordionExpanded(true); // Ensure create/update accordion is open
    setSearchAccordionExpanded(false); // Explicitly close search accordion
    setIsEditMode(true);
    setFormData({
      skuID: row.skuID,
      skuname: row.skuName,
      skucode: row.skuCode,
      skudesc: row.skuDesc,
      cartonSize: row.cartonSize || 0,
      eanCode: row.eanCode || "",
      articleCode: row.articleCode || "",
      skuAttribute1: row.skuAttribute1 || "",
      skuAttribute2: row.skuAttribute2 || "",
      brandID: row.brandID,
      categoryID: row.categoryID,
      subCategoryID: row.subCategoryID,
      modelID: row.modelID,
      status: row.status,
      callType: 2, // 2 for Update
      hsnID: row.hsnID || 0,
      colorID: row.colorID,
      skuName: row.skuName,
      skuCode: row.skuCode,
      skuDescription: row.skuDesc,
    });

    // Load dependent dropdowns
    getBrandList(); // Ensure brand list is loaded
    getCategoryList(row.brandID);
    getSubCategoryList(row.brandID, row.categoryID);
    getModelList(row.brandID, row.categoryID, row.subCategoryID);
    getColorList(); // Ensure color list is loaded for the create form
    getHSNList(); // Ensure HSN list is available

    // Use setTimeout with a longer delay to ensure all state updates and re-renders complete
    setTimeout(() => {
      // Temporarily use window.scrollTo for testing
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      // Original code: scrollToTop(createAccordionRef); 
      scrollToTop(createAccordionRef); // Use the intended scroll function
    }, 300);
  };

  // Update handleStatus to use row-specific loading
  const handleStatus = async (row, newStatus) => {
    try {
      // Add row to loading set
      setLoadingRows((prev) => new Set(prev).add(row.skuID));

      const payload = {
        skuID: row.skuID,
        status: newStatus ? 1 : 0,
        callType: 3,
      };

      const response = await ManageSkuForMoto(payload);

      if (response.statusCode == 200) {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
        getSKUList();
      } else {
        setCreateStatus(response.statusCode);
        setCreateTitle(response.statusMessage || "Failed to update status");
      }
    } catch (error) {
      setCreateStatus(500);
      setCreateTitle("Error updating status. Please try again.");
      console.error("Error updating status:", error);
    } finally {
      // Remove row from loading set
      setLoadingRows((prev) => {
        const next = new Set(prev);
        next.delete(row.skuID);
        return next;
      });
    }
  };

  // Add this useEffect alongside the existing createStatus useEffect
  useEffect(() => {
    let timeoutId;
    if (searchStatus) {
      timeoutId = setTimeout(() => {
        setSearchStatus(null);
        setSearchTitle("");
      }, 5000); // 5 seconds
    }

    // Cleanup function to clear timeout if component unmounts or status changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchStatus]); // Only run when searchStatus changes

  // Update handleExport function
  const handleExport = async () => {
    setIsDownloadLoading(true); // Start loading
    const params = {
      ...searchParams,
      pageIndex: -1, // -1 indicates export to excel
    };
    try {
      const response = await getSKUList(params);
      if (response.statusCode === "200") {
        window.location.href = response?.reportLink;
      } else {
        console.error("Error exporting SKU list:", response.message);
      }
    } catch (error) {
      console.error("Error exporting SKU list:", error);
    } finally {
      setIsDownloadLoading(false); // Stop loading
    }
  };

  // State for export loading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

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
            zIndex: 1300,
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
                    <div ref={createAccordionRef} style={{ position: 'relative', zIndex: 1000 }}>
                      <NuralAccordion2
                        title={isEditMode ? "Update" : "Create"}
                        backgroundColor={LIGHT_GRAY2}
                        onChange={handleAccordionChange}
                        controlled={true}
                        expanded={accordionExpanded}
                        defaultExpanded={true}
                      >
                        <Grid container spacing={2} sx={{ width: "100%" }}>
                          <Grid item xs={12} sm={3}>
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
                              getOptionLabel={(option) => option.brandName || ""}
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
                              loading={brandLoading}
                              onBlur={() => {
                                if (!formData.brandID) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    brandID: "Brand is required",
                                  }));
                                }
                              }}
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
                          <Grid item xs={12} sm={3}>
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
                              getOptionLabel={(option) =>
                                option.categoryName || ""
                              }
                              isOptionEqualToValue={(option, value) =>
                                option?.categoryID === value?.categoryID
                              }
                              value={
                                categoryList.find(
                                  (item) => item.categoryID == formData.categoryID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("categoryID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.categoryID}
                              loading={categoryLoading}
                              onBlur={() => {
                                if (!formData.categoryID) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    categoryID: "Category is required",
                                  }));
                                }
                              }}
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
                          <Grid item xs={12} sm={3}>
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
                                option.subCategoryName || ""
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
                              loading={subCategoryLoading}
                              onBlur={() => {
                                if (!formData.subCategoryID) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    subCategoryID: "Sub-Category is required",
                                  }));
                                }
                              }}
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
                          <Grid item xs={12} sm={3}>
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
                              MODEL <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={modelList}
                              getOptionLabel={(option) => option.modelName || ""}
                              isOptionEqualToValue={(option, value) =>
                                option?.modelID === value?.modelID
                              }
                              value={
                                modelList.find(
                                  (item) => item.modelID == formData.modelID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("modelID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.modelID}
                              loading={modelLoading}
                              onBlur={() => {
                                if (!formData.modelID) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    modelID: "Model is required",
                                  }));
                                }
                              }}
                            />
                            {errors.modelID && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.modelID}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} sm={3}>
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
                              COLOR <Required />
                            </Typography>
                            <NuralAutocomplete
                              options={colorList}
                              getOptionLabel={(option) => option.colorName || ""}
                              isOptionEqualToValue={(option, value) =>
                                option?.colorID === value?.colorID
                              }
                              value={
                                colorList.find(
                                  (item) => item.colorID == formData.colorID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("colorID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              error={!!errors.colorID}
                              loading={colorLoading}
                              onBlur={() => {
                                if (!formData.colorID) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    colorID: "Color is required",
                                  }));
                                }
                              }}
                            />
                            {errors.colorID && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.colorID}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
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
                              SKU CODE <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.skuCode || ""}
                              onChange={(event) => {
                                handleChange("skuCode", event.target.value);
                              }}
                              placeholder="ENTER SKU CODE"
                              error={!!errors.skuCode}
                              onBlur={() => {
                                if (
                                  !formData.skuCode ||
                                  formData.skuCode.trim() === ""
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuCode: "SKU Code is required",
                                  }));
                                } else if (formData.skuCode.length > 20) { // Update limit to 20
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuCode:
                                      "SKU Code cannot exceed 20 characters", // Update error message
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    skuCode: formData.skuCode.substring(0, 20), // Truncate to 20
                                  }));
                                } else if (
                                  !/^[a-zA-Z0-9]+$/.test(formData.skuCode)
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuCode:
                                      "SKU Code can only contain alphanumeric characters (no spaces)",
                                  }));
                                }
                              }}
                            />
                            {errors.skuCode && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.skuCode}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
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
                              SKU NAME <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.skuName || ""}
                              onChange={(event) => {
                                handleChange("skuName", event.target.value);
                              }}
                              placeholder="ENTER SKU NAME"
                              error={!!errors.skuName}
                              onBlur={() => {
                                if (
                                  !formData.skuName ||
                                  formData.skuName.trim() === ""
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuName: "SKU Name is required",
                                  }));
                                } else if (formData.skuName.length > 50) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuName:
                                      "SKU Name cannot exceed 50 characters",
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    skuName: formData.skuName.substring(0, 50),
                                  }));
                                } else if (
                                  !/^[a-zA-Z0-9 ]+$/.test(formData.skuName)
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuName:
                                      "SKU Name can only contain alphanumeric characters and spaces",
                                  }));
                                }
                              }}
                            />
                            {errors.skuName && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.skuName}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
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
                              SKU DESCRIPTION <Required />
                            </Typography>

                            <NuralTextField
                              width="100%"
                              value={formData.skuDescription || ""}
                              onChange={(event) => {
                                handleChange(
                                  "skuDescription",
                                  event.target.value
                                );
                              }}
                              placeholder="ENTER DESCRIPTION"
                              error={!!errors.skuDescription}
                              onBlur={() => {
                                if (
                                  !formData.skuDescription ||
                                  formData.skuDescription.trim() === ""
                                ) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuDescription: "SKU Description is required",
                                  }));
                                } else if (formData.skuDescription.length > 50) { // Update limit to 50
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuDescription:
                                      "SKU Description cannot exceed 50 characters", // Update error message
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    skuDescription:
                                      formData.skuDescription.substring(0, 50), // Truncate to 50
                                  }));
                                } else {
                                  setErrors((prev) => ({
                                    ...prev,
                                    skuDescription: "",
                                  }));
                                }
                              }}
                            />
                            {errors.skuDescription && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.skuDescription}
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
                              HSN CODE
                            </Typography>

                            <NuralAutocomplete
                              options={hsnList}
                              getOptionLabel={(option) => option.hsnCode || ""}
                              isOptionEqualToValue={(option, value) =>
                                option?.hsnID === value?.hsnID

                              }
                              value={
                                hsnList.find(
                                  (item) => item.hsnID == formData.hsnID
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                handleChange("hsnID", newValue || null);
                              }}
                              placeholder="SELECT"
                              width="100%"
                              backgroundColor={LIGHT_GRAY2}
                              loading={hsnLoading}
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
                              ATTRIBUTE 1
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.attribute1 || ""}
                              onChange={(event) => {
                                handleChange("attribute1", event.target.value);
                              }}
                              placeholder="ENTER ATTRIBUTE 1"
                              error={!!errors.attribute1}
                              onBlur={() => {
                                if (formData.attribute1 && formData.attribute1.length > 100) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    attribute1: "Attribute 1 cannot exceed 100 characters",
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    attribute1: formData.attribute1.substring(0, 100),
                                  }));
                                }
                              }}
                            />
                            {errors.attribute1 && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.attribute1}
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
                              ATTRIBUTE 2
                            </Typography>
                            <NuralTextField
                              width="100%"
                              value={formData.attribute2 || ""}
                              onChange={(event) => {
                                handleChange("attribute2", event.target.value);
                              }}
                              placeholder="ENTER ATTRIBUTE 2"
                              error={!!errors.attribute2}
                              onBlur={() => {
                                if (formData.attribute2 && formData.attribute2.length > 100) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    attribute2: "Attribute 2 cannot exceed 100 characters",
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    attribute2: formData.attribute2.substring(0, 100),
                                  }));
                                }
                              }}
                            />
                            {errors.attribute2 && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {errors.attribute2}
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </NuralAccordion2>
                      {accordionExpanded && (
                        <Grid container spacing={1} mt={1} px={1}>
                          {createStatus && (
                            <StatusModel
                              width="100%"
                              status={createStatus}
                              title={createTitle}
                              onClose={() => {
                                setCreateStatus(null);
                                setCreateTitle("");
                              }}
                            />
                          )}
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
                              onClick={handleSave}
                              width="100%"
                            />
                          </Grid>
                        </Grid>
                      )}
                    </div>
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
                        <Grid item xs={12} sm={3}>
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
                            getOptionLabel={(option) => option.brandName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.brandID === value?.brandID
                            }
                            value={
                              searchBrandList.find(
                                (item) => item.brandID == searchParams.brandID
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
                        <Grid item xs={12} sm={3}>
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
                            getOptionLabel={(option) =>
                              option.categoryName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option?.categoryID === value?.categoryID
                            }
                            value={
                              searchCategoryList.find(
                                (item) =>
                                  item.categoryID == searchParams.categoryID
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
                        <Grid item xs={12} sm={3}>
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
                            getOptionLabel={(option) =>
                              option.subCategoryName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option?.subCategoryID === value?.subCategoryID
                            }
                            value={
                              searchSubCategoryList.find(
                                (item) =>
                                  item.subCategoryID ==
                                  searchParams.subCategoryID
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
                        <Grid item xs={12} sm={3}>
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
                            MODEL
                          </Typography>
                          <NuralAutocomplete
                            options={searchModelList}
                            getOptionLabel={(option) => option.modelName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.modelID === value?.modelID
                            }
                            value={
                              searchModelList.find(
                                (item) => item.modelID == searchParams.modelID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange("modelID", newValue || null);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchModelLoading}
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
                            COLOR
                          </Typography>
                          <NuralAutocomplete
                            options={searchColorList}
                            getOptionLabel={(option) => option.colorName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.colorID === value?.colorID
                            }
                            value={
                              searchColorList.find(
                                (item) => item.colorID == searchParams.colorID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange("colorID", newValue || null);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchColorLoading}
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
                            SKU CODE
                          </Typography>
                          <NuralAutocomplete
                            options={skuDropdownList}
                            getOptionLabel={(option) => option.skuCode || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.skuID === value?.skuID
                            }
                            value={
                              skuDropdownList.find(
                                (item) => item.skuID === searchParams.skuID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange("skuID", newValue);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchColorLoading}
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
                            SKU NAME
                          </Typography>
                          <NuralAutocomplete
                            options={skuDropdownList}
                            getOptionLabel={(option) => option.skuName || ""}
                            isOptionEqualToValue={(option, value) =>
                              option?.skuID === value?.skuID
                            }
                            value={
                              skuDropdownList.find(
                                (item) => item.skuID === searchParams.skuID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleSearchChange("skuID", newValue);
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={searchColorLoading}
                          />
                        </Grid>
                      </Grid>
                    </NuralAccordion2>
                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1} px={1}> {/* Added padding */}                        <Grid item xs={12} sm={6} md={1}> {/* Adjusted grid sizing */}                          <NuralButton
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
                        <Grid item xs={12} sm={6} md={11}> {/* Adjusted grid sizing */}                          <NuralTextButton
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
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
        <Grid container sx={{ margin: "10px" }}>
          {searchStatus && (
            <StatusModel
              width="100%"
              status={searchStatus}
              title={searchTitle}
              onClose={() => {
                setSearchStatus(null);
                setSearchTitle("");
              }}
            />
          )}
        </Grid>
     {!searchStatus &&   <Grid item xs={12} mt={2} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 45px)", // Adjusted to account for headers
              overflow: "auto",
              position: "relative",
              zIndex: 900, // Lower than header z-index 
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
                    colSpan={columnDefinitions.length + 1} // +1 for S.NO
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1100,
                      borderBottom: "none",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.05)", // Add subtle shadow
                    }}
                  >
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
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
                      zIndex: 1000,
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
                  {columnDefinitions.map((column) => (
                    <TableCell
                      key={column.field}
                      onClick={() => handleSort(column.field)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: "pointer",
                        position: "sticky",
                        top: "45px", // Same as S.NO cell
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1000,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        <Grid
                          item
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {sortConfig.key === column.field ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon // Use correct icon
                                sx={{
                                  fontSize: 16,
                                  color: PRIMARY_BLUE2,
                                }}
                              />
                            ) : (
                              <ArrowDownwardIcon // Use correct icon
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
                              <ArrowUpwardIcon // Use correct icon
                                sx={{
                                  fontSize: 12,
                                  color: "grey.400",
                                }}
                              />
                              <ArrowDownwardIcon // Use correct icon
                                sx={{
                                  fontSize: 12,
                                  color: "grey.400",
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableLoading ? (
                  <TableRowSkeleton
                    columns={11} // 11 columns to match your table
                    rows={10} // Show 10 skeleton rows
                    imagePath="./Icons/emptyFile.svg"
                    sx={{ height: "calc(100vh - 420px)" }}
                  />
                ) : searchStatus ? ( // Check for persistent search error FIRST
                  <TableRow>
                    <TableCell 
                      colSpan={columnDefinitions.length + 1} // Span all columns
                      align="center" 
                      sx={{ py: 3, color: 'error.main' }} // Style error message
                    >
                      <Typography variant="body1"> 
                        {searchTitle} {/* Display the error message */}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : tableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">No records found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow key={row.skuID || index}>
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
                        {row.skuCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.skuName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.brandName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.category || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.subCategory || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.model || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.colorName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.hsnCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <Switch
                          checked={row.status === 1}
                          onChange={(e) => {
                            handleStatus(row, e.target.checked);
                          }}
                          size="small"
                          disabled={loadingRows.has(row.skuID)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: PRIMARY_BLUE2,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: DARK_PURPLE,
                              },
                            opacity: loadingRows.has(row.skuID) ? 0.5 : 1,
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

            {/* Custom Pagination */}
            <NuralPagination
              key={`pagination-${page}-${rowsPerPage}`}
              totalRecords={totalRecords}
              initialPage={page}
              initialRowsPerPage={rowsPerPage}
              onPaginationChange={handlePaginationChange}
            />
          </TableContainer>
        </Grid>}
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
              title="Export SKU List"
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

export default SKU;
