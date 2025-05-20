import {
  Grid,
  Switch,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import EditIcon from "@mui/icons-material/Edit";

import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  DARK_BLUE,
} from "../../../Common/colors";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
// import NuralTextField from "../../NuralCustomComponents/NuralTextField"; // Removed unused import
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  headTitle,
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";

import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import {
  GetCompetitionModelData,
  GetCompetitionBrand,
  GetCompetitionCategoryListMoto,
  ManageCompetitionModelMoto,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import Required from "../../../Common/Required";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralPagination from "./../../../Common/Pagination";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";

const tabs = [
  { label: "Upload", value: "competiton-upload" },
  { label: "Brand", value: "competition-brand" },
  { label: "Category", value: "competition-category" },
  { label: "Model", value: "competition-model" },
  { label: "Price Band", value: "competition-price-band" },
];

const CompModel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("competition-model");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [brandList, setBrandList] = useState([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [viewBrand, setViewBrand] = useState(null);

  // State for Create section dropdowns
  const [createCategoryList, setCreateCategoryList] = useState([]);
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [viewCategoryList, setViewCategoryList] = useState([]);
  const [viewCategoryLoading, setViewCategoryLoading] = useState(false);
  const [viewModelList, setViewModelList] = useState([]);
  const [viewModelLoading, setViewModelLoading] = useState(false);
  const [viewModel, setViewModel] = useState(null);

  const [searchParams, setSearchParams] = useState({
    modelId: 0,
    brandId: 0,
    categoryId: 0,
    mode: 0 /* 0=table bind, 1 = excel export, 2= dropdow bind */,
    status: 1 /* 0 = active , 1= all */,
    pageIndex: 1,
    pageSize: 10,
    modelName: "",
  });

  // Form Data state mirroring Brand.jsx
  const [formData, setFormData] = useState({
    competitionBrandID: 0,
    competitionCategoryID: 0,
    competitionModelID: 0, // send ModelID in case of editing record
    competitionModelName: "",
    mop: "",
    status: 1, // Default to active?
    callType: 0 /* 0 = save, 1= update records (along wih ModelID), 2= toggle status (along wih ModelID and status) */,
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);

  // Search/Table Status
  const [searchStatus, setSearchStatus] = React.useState(null);
  const [searchTitle, setSearchTitle] = React.useState("");

  // Create/Update Status
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);

  // Loading States
  const [formLoading, setFormLoading] = useState(true); // Create form loading
  const [tableLoading, setTableLoading] = useState(true); // Table data loading
  const [searchFormLoading, setSearchFormLoading] = useState(true); // Search form loading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false); // Export loading

  // Accordion States
  const [accordionExpanded, setAccordionExpanded] = useState(true); // Create accordion open by default
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false); // Search accordion closed by default

  // State for View section dropdowns
  const [viewCategory, setViewCategory] = useState(null);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);

  // Add ref for scrolling
  const createAccordionRef = React.useRef(null);

  // Add helper function for scrolling
  const scrollToTop = (elementRef = null) => {
    if (elementRef && elementRef.current) {
      // Using 'start' as it was the original intent, can change to 'center' if needed
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSort = (columnName) => {
    let direction = "asc";
    let sortKey = columnName;

    if (sortConfig.key === sortKey) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting
        setSortConfig({ key: null, direction: null });
        // Refetch data with default sort
        getModelList({ ...searchParams, pageIndex: 1 }); // Assuming default API sort if key is null
        return;
      }
    }

    setSortConfig({ key: sortKey, direction });

    // Client-side sorting (consider if API supports sorting)
    const sortedRows = [...filteredRows].sort((a, b) => {
      // Adjust keys based on actual data structure
      const dataKeyA =
        sortKey === "brand"
          ? "competitionBrandName"
          : sortKey === "category"
          ? "competitionCategoryName"
          : sortKey; // Default to sortKey for modelName etc.
      const dataKeyB = dataKeyA;

      const aValue = a[dataKeyA] ? a[dataKeyA].toString().toLowerCase() : "";
      const bValue = b[dataKeyB] ? b[dataKeyB].toString().toLowerCase() : "";

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedRows);
    // Use the ref and setTimeout for scrolling
    setTimeout(() => {
      scrollToTop(createAccordionRef);
    }, 100);
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const getModelList = async (params = searchParams) => {
    setTableLoading(true);
    setSearchFormLoading(true); // Assuming search form loads with table
    try {
      // Ensure mode is 0 for table binding
      const tableParams = { ...params, mode: 0 };
      const response = await GetCompetitionModelData(tableParams);
      if (response.statusCode === "200") {
        const data = response.competitionModelDataList || [];
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || data.length);
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Failed to load model list");
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error in getModelList:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(error.statusMessage || "An error occurred");
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
      setSearchFormLoading(false);
    }
  };

  const getModelDropdown = async (categoryId, setList, setLoading) => {
    setLoading(true);
    try {
      const params = {
        modelId: 0,
        brandId: viewBrand?.competitionBrandID || 0, // Add brandId from viewBrand
        categoryId: categoryId,
        mode: 2, // dropdown bind
        status: 0, // active only
        pageIndex: 1,
        pageSize: 0, // fetch all
        modelName: "",
      };
      const response = await GetCompetitionModelData(params);
      if (response.statusCode === "200") {
        const data = response.competitionModelDataList || [];
        setList(data);
      } else {
        console.error(
          "Failed to fetch model dropdown:",
          response.statusMessage
        );
        setList([]);
      }
    } catch (error) {
      console.error("Error in getModelDropdown:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setIsDownloadLoading(true); // Indicate loading during export prep
    const params = {
      ...searchParams,
      mode: 1, // 1 = excel export
      pageSize: 0, // Ensure all matching records are exported
      pageIndex: 1,
    };
    try {
      const response = await GetCompetitionModelData(params);
      if (response.statusCode === "200") {
        if (response?.reportLink) {
          window.location.href = response.reportLink;
          setSearchStatus(response.statusCode);
          setSearchTitle(response.statusMessage || "Export successful");
        } else {
          setSearchStatus("404"); // Or appropriate code
          setSearchTitle("Export link not found.");
        }
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Export failed");
      }
    } catch (error) {
      console.error("Error in handleExport:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(error.statusMessage || "An error occurred during export");
    } finally {
      setIsDownloadLoading(false); // Stop loading indicator
    }
  };

  const getBrandDropdown = async () => {
    setBrandLoading(true);
    setFormLoading(true); // Loading for create form depends on this
    try {
      const params = {
        mode: 2,
        status: 0,
        pageIndex: 1,
        pageSize: 0,
        brandId: 0,
        brandName: "",
      };
      const response = await GetCompetitionBrand(params);
      if (response.statusCode === "200") {
        setBrandList(response.competitionBrandList || []);
      } else {
        console.error(
          "Failed to fetch brand dropdown:",
          response.statusMessage
        );
        setBrandList([]);
        // Maybe set an error state for the form?
      }
    } catch (error) {
      console.error("Error fetching brand dropdown:", error);
      setBrandList([]);
      // Set form error state?
    } finally {
      setBrandLoading(false);
      setFormLoading(false);
    }
  };

  const getCategoryDropdown = async (brandID, setList, setLoading) => {
    setLoading(true);
    setList([]); // Clear previous list
    try {
      const params = {
        competitionBrandID: brandID,
        competitionCategoryID: 0,
        callType: 2, // bind dropdown
        pageIndex: 1,
      };
      const response = await GetCompetitionCategoryListMoto(params);

      if (response.statusCode === "200") {
        const data = response.competitionCategoryDataList || [];
        setList(data);
      } else {
        console.error(
          "Failed to fetch category dropdown:",
          response.statusMessage
        );
        // setList([]); // Already cleared above
      }
    } catch (error) {
      console.error("Error fetching category dropdown:", error);
      // setList([]); // Already cleared above
    } finally {
      setLoading(false);
    }
  };

  // Modify the validateForm function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.competitionBrandID || formData.competitionBrandID === 0) {
      newErrors.competitionBrandID = "Brand is required";
    }
    if (
      !formData.competitionCategoryID ||
      formData.competitionCategoryID === 0
    ) {
      newErrors.competitionCategoryID = "Category is required";
    }
    if (
      !formData.competitionModelName ||
      formData.competitionModelName.trim() === ""
    ) {
      newErrors.competitionModelName = "Model Name is required";
    } else if (formData.competitionModelName.length > 100) {
      newErrors.competitionModelName =
        "Model Name cannot exceed 100 characters";
    }
    if (!formData.mop || formData.mop.trim() === "") {
      newErrors.mop = "MOP is required";
    } else if (isNaN(parseFloat(formData.mop))) {
      newErrors.mop = "MOP must be a valid number";
    } else if (parseFloat(formData.mop) < 0) {
      newErrors.mop = "MOP cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new function to handle field blur
  const handleFieldBlur = (fieldName) => {
    if (touchedFields[fieldName]) {
      validateForm();
    }
  };

  const handlePostRequest = async () => {
    if (!validateForm()) {
      return;
    }
    setFormLoading(true); // Indicate form submission loading
    setStatus(null);
    setTitle("");

    try {
      // Format MOP to ensure it's a string representation of a number if needed by API
      const formattedMop = parseFloat(formData.mop).toFixed(2); // Example: ensure 2 decimal places

      const payload = {
        ...formData,
        mop: formattedMop,
        callType: isEditMode ? 1 : 0,
      };

      // Remove competitionModelID if it's 0 during save (callType 0)
      if (payload.callType === 0) {
        delete payload.competitionModelID;
      }

      console.log("Sending Payload:", payload);

      const response = await ManageCompetitionModelMoto(payload);

      if (response.statusCode === "200") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Model saved successfully!");
        handleCancel(); // Reset form
        getModelList({ ...searchParams, pageIndex: 1 }); // Refresh table to show new entry
        setPage(0);
        setTimeout(() => {
          setStatus(null);
          setTitle("");
        }, 5000);
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Failed to save model.");
      }
    } catch (error) {
      console.error("Error saving/updating model:", error);
      setStatus(error.statusCode || "500");
      setTitle(error.statusMessage || "An error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      competitionBrandID: row.competitionBrandID || 0,
      competitionCategoryID: row.competitionCategoryID || 0,
      competitionModelID: row.competitionModelId || 0, // Updated key to match API response
      competitionModelName: row.competitionModelName || "",
      mop: row.mop || "",
      status: row.status === "Active" ? 1 : 0,
      callType: 1, // Set to update mode
    });
    setIsEditMode(true);
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false); // Close search on edit
    if (row.competitionBrandID) {
      getCategoryDropdown(
        row.competitionBrandID,
        setCreateCategoryList,
        setCreateCategoryLoading
      );
    }
    // Use the ref and setTimeout for scrolling
    setTimeout(() => {
      scrollToTop(createAccordionRef);
    }, 100);
  };

  const handleStatus = async (row, newStatusChecked) => {
    setStatusUpdateLoading(true);
    setUpdatingRowId(row.competitionModelId);
    setSearchStatus(null); // Clear previous search status before new action
    setSearchTitle("");

    const payload = {
      competitionBrandID: row.competitionBrandID || 0,
      competitionCategoryID: row.competitionCategoryID || 0,
      competitionModelID: row.competitionModelId,
      competitionModelName: row.competitionModelName,
      status: newStatusChecked ? 1 : 0,
      callType: 2,
      mop: row.mop || "",
    };

    try {
      const response = await ManageCompetitionModelMoto(payload);
      // Set status regardless of success or error, mirroring Brand.jsx approach
      setSearchStatus(response.statusCode);
      setSearchTitle(
        response.statusMessage ||
          (response.statusCode === "200"
            ? "Status updated"
            : "Status update failed")
      );
      setTimeout(() => {
        setSearchStatus(null);
        setSearchTitle("");
      }, 5000);

      if (response.statusCode === "200") {
        getModelList(searchParams);
        // Removed setTimeout for clearing status on success, matching Brand.jsx
      } else {
        // Handle non-200 responses if needed, status is already set above
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(error.statusMessage || "An error occurred");
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
    }
  };

  const handleCancel = () => {
    setFormLoading(true);
    setFormData({
      competitionBrandID: 0,
      competitionCategoryID: 0,
      competitionModelID: 0,
      competitionModelName: "",
      mop: "",
      status: 1,
      callType: 0,
    });
    setIsEditMode(false);
    setErrors({});
    setTouchedFields({}); // Reset touched fields
    setCreateCategoryList([]);
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);

    setTimeout(() => {
      setFormLoading(false);
    }, 300);
  };

  // --- Search Form Handlers --- (Keep existing view logic)
  const handleSearch = () => {
    setPage(0); // Reset page to 0 for NuralPagination
    const updatedParams = { ...searchParams, pageIndex: 1 }; // API uses 1-based
    setSearchParams(updatedParams);
    getModelList(updatedParams);
    setAccordionExpanded(false); // Close create on search
    setSearchAccordionExpanded(true); // Open search
  };

  const handleCancelSearch = () => {
    setPage(0);
    setViewBrand(null);
    setViewCategory(null);
    setViewModel(null);
    setViewCategoryList([]);
    setViewModelList([]);
    const resetParams = {
      modelId: 0,
      brandId: 0,
      categoryId: 0,
      mode: 0,
      status: 1,
      pageIndex: 1, // API uses 1-based
      pageSize: rowsPerPage,
      modelName: "",
    };
    setSearchParams(resetParams);
    getModelList(resetParams); // Fetch with reset params immediately
    // Clear search status immediately on cancel
    setSearchStatus(null);
    setSearchTitle("");
    setAccordionExpanded(false); // Keep create closed
    setSearchAccordionExpanded(true); // Re-open search
  };

  // --- Pagination Handler ---
  const handlePaginationChange = (paginationState) => {
    const { page: newPage, rowsPerPage: newRowsPerPage } = paginationState;
    setPage(newPage); // Update 0-based page state
    setRowsPerPage(newRowsPerPage);
    const updatedParams = {
      ...searchParams,
      pageIndex: newPage + 1, // API uses 1-based index
      pageSize: newRowsPerPage,
      mode: 0, // Ensure mode is for table binding
    };
    setSearchParams(updatedParams);
    getModelList(updatedParams);
  };

  // --- Initial Data Fetch --- ( Brand Dropdown + Initial Table Data )
  useEffect(() => {
    getBrandDropdown();
    getModelList();
  }, []);

  // --- Effect to clear temporary status messages ---

  // Accordion Handlers
  const handleAccordionChange = (event, expanded) => {
    if (!expanded) {
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
    } else {
      setAccordionExpanded(true);
      setSearchAccordionExpanded(false);
    }
  };
  const handleSearchAccordionChange = (event, expanded) => {
    if (!expanded) {
      setSearchAccordionExpanded(false);
      setAccordionExpanded(false);
    } else {
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
          pl: { xs: 1, sm: 1, md: 0 },
          pr: { xs: 0, sm: 0, md: "180px", lg: "260px" },
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
          <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
            <BreadcrumbsHeader pageTitle="Competition" />
          </Grid>
          <Grid item xs={12} ml={0}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Create/Update Section */}
        <Grid item xs={12} pr={1.5} id="create-model-form">
          <Grid container spacing={2} direction="column">
            <Grid item>
              {/* Wrap accordion and buttons in a div with the ref */}
              <div
                ref={createAccordionRef}
                style={{ position: "relative", zIndex: 1000 }}
              >
                {formLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <NuralAccordion2
                      title={isEditMode ? "Update Model" : "Create Model"}
                      backgroundColor={LIGHT_GRAY2}
                      expanded={accordionExpanded}
                      onChange={handleAccordionChange}
                      controlled={true}
                    >
                      <Grid container spacing={2} sx={{ width: "100%" }}>
                        {/* Brand Dropdown */}
                        <Grid item xs={12} sm={3}>
                          <Typography variant="h6" sx={typographyH6Style}>
                            {" "}
                            BRAND <Required />
                          </Typography>
                          <NuralAutocomplete
                            options={brandList}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            isOptionEqualToValue={(option, value) =>
                              option?.competitionBrandID ===
                              value?.competitionBrandID
                            }
                            getOptionLabel={(option) =>
                              option?.competitionBrandName || ""
                            }
                            onChange={(event, value) => {
                              const brandId = value
                                ? value.competitionBrandID
                                : 0;
                              setFormData({
                                ...formData,
                                competitionBrandID: brandId,
                                competitionCategoryID: 0, // Reset category on brand change
                              });
                              setCreateCategoryList([]); // Clear category list
                              setErrors({
                                ...errors,
                                competitionBrandID: null,
                                competitionCategoryID: null, // Clear category error too
                              });
                              if (value) {
                                getCategoryDropdown(
                                  brandId,
                                  setCreateCategoryList,
                                  setCreateCategoryLoading
                                );
                              }
                            }}
                            value={
                              brandList.find(
                                (brand) =>
                                  brand.competitionBrandID ===
                                  formData.competitionBrandID
                              ) || null
                            }
                            loading={brandLoading}
                            error={!!errors.competitionBrandID}
                          />
                          {errors.competitionBrandID && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {errors.competitionBrandID}
                            </Typography>
                          )}
                        </Grid>

                        {/* Category Dropdown */}
                        <Grid item xs={12} sm={3}>
                          <Typography variant="h6" sx={typographyH6Style}>
                            {" "}
                            CATEGORY <Required />
                          </Typography>
                          <NuralAutocomplete
                            options={createCategoryList}
                            getOptionLabel={(option) =>
                              option?.competitionCategoryName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option?.competitionCategoryID ===
                              value?.competitionCategoryID
                            }
                            value={
                              createCategoryList.find(
                                (cat) =>
                                  cat.competitionCategoryID ===
                                  formData.competitionCategoryID
                              ) || null
                            }
                            onChange={(event, value) => {
                              setFormData({
                                ...formData,
                                competitionCategoryID: value
                                  ? value.competitionCategoryID
                                  : 0,
                              });
                              setErrors({
                                ...errors,
                                competitionCategoryID: null,
                              });
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_GRAY2}
                            loading={createCategoryLoading}
                            disabled={
                              !formData.competitionBrandID ||
                              createCategoryLoading
                            }
                            error={!!errors.competitionCategoryID}
                          />
                          {errors.competitionCategoryID && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {errors.competitionCategoryID}
                            </Typography>
                          )}
                        </Grid>

                        {/* Model Name TextField */}
                        <Grid item xs={12} sm={3}>
                          <Typography variant="h6" sx={typographyH6Style}>
                            {" "}
                            MODEL <Required />
                          </Typography>
                          <NuralTextField
                            value={formData.competitionModelName}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                competitionModelName: e.target.value,
                              });
                              if (errors.competitionModelName) {
                                setErrors({
                                  ...errors,
                                  competitionModelName: null,
                                });
                              }
                            }}
                            width="100%"
                            placeholder="ENTER MODEL NAME"
                            backgroundColor={LIGHT_GRAY2}
                            error={!!errors.competitionModelName}
                          />
                          {errors.competitionModelName && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {errors.competitionModelName}
                            </Typography>
                          )}
                        </Grid>

                        {/* MOP TextField */}
                        <Grid item xs={12} sm={3}>
                          <Typography variant="h6" sx={typographyH6Style}>
                            {" "}
                            MOP <Required />
                          </Typography>
                          <NuralTextField
                            value={formData.mop}
                            onChange={(e) => {
                              setFormData({ ...formData, mop: e.target.value });
                              if (errors.mop) {
                                setErrors({ ...errors, mop: null });
                              }
                            }}
                            width="100%"
                            placeholder="ENTER MOP"
                            backgroundColor={LIGHT_GRAY2}
                            type="number"
                            error={!!errors.mop}
                          />
                          {errors.mop && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {errors.mop}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </NuralAccordion2>

                    {/* Action Buttons & Status for Create/Update - Conditionally Rendered */}
                    {accordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1.5}>
                        {/* StatusModel for Create/Update status */}
                        {status && (
                          <Grid item xs={12} mb={1}>
                            <StatusModel
                              width="100%"
                              status={status}
                              title={title}
                              onClose={() => {
                                setStatus(null);
                                setTitle("");
                              }}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={() => {
                              setStatus(null);
                              setTitle("");
                              handleCancel();
                            }}
                            width="100%"
                            disabled={formLoading} // Disable if submitting
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text={isEditMode ? "UPDATE" : "SAVE"}
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handlePostRequest}
                            width="100%"
                            disabled={formLoading} // Disable if submitting
                          />
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* View/Search Section */}
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
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                  >
                    {/* --- Search Form Content (Keep existing logic for viewBrand, viewCategory, viewModel) --- */}
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      {/* Brand Dropdown (View) */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={typographyH6Style}>
                          BRAND
                        </Typography>
                        <NuralAutocomplete
                          options={brandList}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_GRAY2}
                          isOptionEqualToValue={(option, value) =>
                            option?.competitionBrandID ===
                            value?.competitionBrandID
                          }
                          getOptionLabel={(option) =>
                            option?.competitionBrandName || ""
                          }
                          onChange={(event, value) => {
                            setViewBrand(value);
                            setViewCategory(null);
                            setViewModel(null);
                            setViewCategoryList([]);
                            setViewModelList([]);
                            const newBrandId = value
                              ? value.competitionBrandID
                              : 0;
                            setSearchParams({
                              ...searchParams,
                              brandId: newBrandId,
                              categoryId: 0,
                              modelId: 0,
                              pageIndex: 1, // Reset page index
                            });
                            if (value) {
                              getCategoryDropdown(
                                newBrandId,
                                setViewCategoryList,
                                setViewCategoryLoading
                              );
                            }
                            // Don't auto-search here, wait for button click
                          }}
                          value={viewBrand}
                          loading={brandLoading}
                        />
                      </Grid>

                      {/* Category Dropdown (View) */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={typographyH6Style}>
                          CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          options={viewCategoryList}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_GRAY2}
                          getOptionLabel={(option) =>
                            option?.competitionCategoryName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.competitionCategoryID ===
                            value?.competitionCategoryID
                          }
                          value={viewCategory}
                          onChange={(event, value) => {
                            setViewCategory(value);
                            setViewModel(null);
                            setViewModelList([]);
                            const newCategoryId = value
                              ? value.competitionCategoryID
                              : 0;
                            setSearchParams({
                              ...searchParams,
                              categoryId: newCategoryId,
                              modelId: 0,
                              pageIndex: 1,
                            });
                            if (value && viewBrand) {
                              // Check if viewBrand exists
                              getModelDropdown(
                                newCategoryId,
                                setViewModelList,
                                setViewModelLoading
                              );
                            }
                          }}
                          loading={viewCategoryLoading}
                          disabled={!viewBrand || viewCategoryLoading}
                        />
                      </Grid>

                      {/* Model Dropdown (View) */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={typographyH6Style}>
                          MODEL
                        </Typography>
                        <NuralAutocomplete
                          options={viewModelList}
                          getOptionLabel={(option) =>
                            option?.competitionModelName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.competitionModelId ===
                            value?.competitionModelId
                          }
                          value={viewModel}
                          onChange={(event, value) => {
                            setViewModel(value);
                            const newModelId = value
                              ? value.competitionModelId
                              : 0;
                            setSearchParams({
                              ...searchParams,

                              modelId: newModelId,
                              pageIndex: 1,
                            });
                          }}
                          width="100%"
                          placeholder="SELECT"
                          backgroundColor={LIGHT_GRAY2}
                          loading={viewModelLoading}
                          disabled={!viewCategory || viewModelLoading}
                        />
                      </Grid>
                    </Grid>

                    {/* Search/Cancel Buttons */}
                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1.5}>
                        <Grid item xs={6} sm={2} md={1.5}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            color={PRIMARY_BLUE2}
                            fontSize="12px"
                            height="36px"
                            borderColor={PRIMARY_BLUE2}
                            onClick={handleCancelSearch}
                            width="100%"
                          />
                        </Grid>
                        <Grid item xs={6} sm={10} md={10.5}>
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
                  {/* Restore Search Status Display for errors (like Brand.jsx) */}
                  {searchStatus && searchStatus !== "200" && (
                    <Grid item xs={12} mt={1} pr={1.5}>
                      <StatusModel
                        width="100%"
                        status={searchStatus}
                        title={searchTitle}
                        onClose={() => {
                          setSearchStatus(null);
                          setSearchTitle("");
                        }}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid container sx={{ margin: "10px 10px 10px 0px" }}>
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
        {/* Table Section */}
        {searchAccordionExpanded && (
          <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Status model for table operations (All searchStatus here, like Brand.jsx) */}

            {/* Table Container */}
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 50px)",
                overflow: "auto",
                position: "relative",
                "& .MuiTable-root": {
                  borderCollapse: "separate",
                  borderSpacing: 0,
                },
              }}
            >
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                {/* Table Header */}
                <TableHead>
                  {/* List Title Row */}
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 1050,
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
                          <Typography variant="body1" sx={headTitle}>
                            Model List
                          </Typography>
                        </Grid>
                        <Grid item sx={{ cursor: "pointer" }}>
                          {/* Removed export icon */}
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  {/* Column Headers Row */}
                  <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                    <TableCell
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "55px",
                        zIndex: 1000,
                        width: "50px",
                        padding: "8px 16px",
                      }}
                    >
                      S.NO
                    </TableCell>
                    {[
                      // Adjusted headers
                      {
                        label: "MODEL NAME",
                        key: "competitionModelName",
                        sortable: true,
                      },
                      {
                        label: "BRAND",
                        key: "competitionBrandName",
                        sortable: true,
                      },
                      {
                        label: "CATEGORY",
                        key: "competitionCategoryName",
                        sortable: true,
                      },
                      { label: "MOP", key: "mop", sortable: true }, // Added MOP
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
                          top: "55px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
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
                {/* Table Body */}
                <TableBody>
                  {tableLoading ? (
                    <TableRowSkeleton
                      columns={6}
                      rows={rowsPerPage}
                      sx={{ height: "calc(100vh - 50px)" }}
                    />
                  ) : filteredRows.length > 0 ? (
                    filteredRows.map((row, index) => (
                      <TableRow
                        key={row.competitionModelId || index}
                        sx={{
                          fontSize: "10px",
                          "& td": { borderBottom: `1px solid #C6CEED` },
                        }}
                      >
                        <TableCell sx={{ ...rowstyle }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.competitionModelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.competitionBrandName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.competitionCategoryName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.mop || "N/A"}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={
                              row.status === "Active" || row.status === 1
                            }
                            onChange={(e) =>
                              handleStatus(row, e.target.checked)
                            }
                            size="small"
                            disabled={
                              statusUpdateLoading &&
                              updatingRowId === row.competitionModelID
                            }
                            sx={toggleSectionStyle}
                          />
                        </TableCell>
                        <TableCell sx={rowstyle}>
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
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <Typography>
                          No models found matching your criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Component */}
              {!tableLoading && totalRecords > 0 && (
                <NuralPagination
                  key={`pagination-${page}-${rowsPerPage}-${totalRecords}`} // Ensure re-render on data change
                  totalRecords={totalRecords}
                  initialPage={page} // NuralPagination uses 0-based index
                  initialRowsPerPage={rowsPerPage}
                  onPaginationChange={handlePaginationChange}
                  rowsPerPageOptions={[10, 25, 50, 100]} // Optional: customize rows per page
                />
              )}
            </TableContainer>
          </Grid>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        mt={1}
        mr={0}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 0,
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
              title="Export Brands"
              views={""}
              downloadExcel={handleExport}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default CompModel;

// Helper function for Typography sx prop (if repeating)
const typographyH6Style = {
  color: DARK_BLUE,
  fontFamily: "Manrope",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  mb: 1,
};
