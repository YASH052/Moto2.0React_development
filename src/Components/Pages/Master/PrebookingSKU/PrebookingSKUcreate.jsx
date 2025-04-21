import { Grid, Typography, FormHelperText, Checkbox, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";

import {
  AQUA,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  WHITE,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import {
  fetchCategoryList,
  fetchSubCategoryList,
  GetModelListForDropdown,
  GetSKUListForDropdown,
  SaveUpdateSkuPreBooking,
} from "../../../Api/Api";

import { useNavigate } from "react-router-dom";

import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";
const PrebookingSKUcreate = () => {
  const [activeTab, setActiveTab] = React.useState("prebooking-sku-create");
  const navigate = useNavigate();
  const tabs = [
    { label: "Add SKU", value: "prebooking-sku-create" },
    { label: "Search", value: "prebooking-sku-view" },
  ];

  // State for Status Model
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);

  const [formData, setFormData] = React.useState({
    preBookingId: 0,
    modelId: 0,
    selectedSkuId: "", // Enter mutile SkuID with Comma
    startDate: "",
    endDate: "",
    status: 1,
  });

  // States for dropdown lists
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [skuList, setSkuList] = useState([]);
  const [selectedSkus, setSelectedSkus] = useState([]);

  // Loading states for dropdowns
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [skuLoading, setSkuLoading] = useState(false);

  // Add error states for each field
  const [errors, setErrors] = React.useState({
    categoryID: "",
    subCategoryID: "",
    modelID: "",
    selectedSkuId: "",
    startDate: "",
    endDate: "",
  });

  // Functions to fetch dropdown data
  const getCategoryList = async () => {
    try {
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
      setCategoryLoading(false);
    }
  };

  const getSubCategoryList = async (categoryID = 0) => {
    try {
      setSubCategoryLoading(true);
      const params = {
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

  const getModelList = async (categoryID = 0, subCategoryID = 0) => {
    try {
      setModelLoading(true);
      const params = {
        categoryID: categoryID,
        modelID: 0,
        subCategoryID: subCategoryID,
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

  const getSKUDropdown = async (
    categoryID = 0,
    subCategoryID = 0,
    modelID = 0,
    brandID = 0
  ) => {
    try {
      setSkuLoading(true);
      const params = {
        skuID: 0,
        categoryID: categoryID,
        modelID: modelID,
        subCategoryID: subCategoryID,
        brandID: 0,
      };
      const response = await GetSKUListForDropdown(params);
      if (response.statusCode == 200) {
        setSkuList(response.skuDropdownList || []);
      } else {
        setSkuList([]);
      }
    } catch (error) {
      console.error("Error fetching SKU dropdown:", error);
      setSkuList([]);
    } finally {
      setSkuLoading(false);
    }
  };

  // Handle dropdown changes
  const handleChange = (field, value) => {
    // Handle date validation
    if (field === "startDate" || field === "endDate") {
      const startDate = field === "startDate" ? value : formData.startDate;
      const endDate = field === "endDate" ? value : formData.endDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
          if (field === "startDate") {
            setErrors((prev) => ({
              ...prev,
              startDate: "Start date must be before end date.",
              endDate: "",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              endDate: "End date must be after start date.",
              startDate: "",
            }));
          }
          return;
        } else {
          // Clear date errors if dates are valid
          setErrors((prev) => ({
            ...prev,
            startDate: "",
            endDate: "",
          }));
        }
      }
    }

    // Handle null/undefined values for dropdowns
    if (value === null || value === undefined) {
      // Handle Category clearing - cascade to clear SubCategory, Model, and SKU
      if (field === "categoryID") {
        setSubCategoryList([]);
        setModelList([]);
        setSkuList([]);

        setFormData((prev) => ({
          ...prev,
          categoryID: null,
          subCategoryID: null,
          modelID: null,
          selectedSkuId: "",
        }));

        // Set error for category
        setErrors((prev) => ({
          ...prev,
          categoryID: "Category is required",
        }));
        return;
      }
      // Handle SubCategory clearing - cascade to clear Model and SKU
      else if (field === "subCategoryID") {
        setModelList([]);
        setSkuList([]);

        setFormData((prev) => ({
          ...prev,
          subCategoryID: 0,
          modelID: 0,
          selectedSkuId: "",
        }));

        // Set error for subcategory
        setErrors((prev) => ({
          ...prev,
          subCategoryID: "Sub Category is required",
        }));
        return;
      }
      // Handle Model clearing - cascade to clear SKU
      else if (field === "modelID") {
        setSkuList([]);

        setFormData((prev) => ({
          ...prev,
          modelID: 0,
          selectedSkuId: "",
        }));

        // Set error for model
        setErrors((prev) => ({
          ...prev,
          modelID: "Model is required",
        }));
        return;
      }
      // Handle SKU clearing
      else if (field === "selectedSkuId") {
        setFormData((prev) => ({
          ...prev,
          selectedSkuId: "",
        }));

        // Set error for SKU
        setErrors((prev) => ({
          ...prev,
          selectedSkuId: "SKU is required",
        }));
        return;
      }
      return;
    }

    // Update formData with new value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when valid value is provided (except for dates which are handled above)
    if (field !== "startDate" && field !== "endDate") {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Handle cascading dropdown updates
    if (field === "categoryID") {
      getSubCategoryList(value);
      setModelList([]);
      setSkuList([]);

      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        categoryID: value,
        subCategoryID: null,
        modelID: null,
        selectedSkuId: "",
      }));
    } else if (field === "subCategoryID") {
      getModelList(formData.categoryID, value);
      setSkuList([]);

      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        subCategoryID: value,
        modelID: null,
        selectedSkuId: "",
      }));
    } else if (field === "modelID") {
      getSKUDropdown(formData.categoryID, formData.subCategoryID, value);

      // Reset SKU field
      setFormData((prev) => ({
        ...prev,
        modelID: value,
        selectedSkuId: "",
      }));
    }
  };

  // Load initial data
  useEffect(() => {
    // Load categories directly
    getCategoryList();
  }, []);

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Update the dummy data generator
  const generateDummyData = () => {
    const targetTypes = ["Type A", "Type B", "Type C"];
    const categories = ["Category 1", "Category 2", "Category 3"];
    const targetFors = ["Sales", "Revenue", "Units"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        targetName: `Target ${index + 1}`,
        targetFor: targetFors[Math.floor(Math.random() * targetFors.length)],
        targetFrom: new Date(
          2024,
          Math.floor(Math.random() * 12),
          1
        ).toLocaleDateString(),
        targetTo: new Date(
          2024,
          Math.floor(Math.random() * 12),
          28
        ).toLocaleDateString(),
        targetCategory:
          categories[Math.floor(Math.random() * categories.length)],
        targetType: targetTypes[Math.floor(Math.random() * targetTypes.length)],
        targetBasedOn: `Metric ${index + 1}`,
        target: Math.floor(Math.random() * 1000),
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Update the handleSort function
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...rows]); // Reset to original order
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

  // Update the handleSearch function
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.isp ||
          row.column1.toLowerCase().includes(searchValues.isp.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.city ||
          row.column2
            .toLowerCase()
            .includes(searchValues.city.toLowerCase())) &&
        (!searchValues.product ||
          row.column7
            .toLowerCase()
            .includes(searchValues.product.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0);
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    const searchValues = {
      isp: document.querySelector('[placeholder="Select"]')?.value || "",
      fromDate: document.querySelector('[placeholder="Select"]')?.value || "",
      toDate: document.querySelector('[placeholder="DD/MM/YY"]')?.value || "",
      state: document.querySelector('[label="State"]')?.value || "",
      city: document.querySelector('[label="City"]')?.value || "",
      product:
        document.querySelector('[placeholder="Select"]')?.lastValue || "",
    };
    handleSearch(searchValues);
  };

  const handleReset = () => {
    // Reset all filters
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset the table to show all rows
    setFilteredRows(rows);
    setPage(0);
    setSortConfig({ key: null, direction: null });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      categoryID: "",
      subCategoryID: "",
      modelID: "",
      selectedSkuId: "",
      startDate: "",
      endDate: "",
    };

    let isValid = true;

    if (!formData.categoryID) {
      newErrors.categoryID = "Category is required";
      isValid = false;
    }
    if (!formData.subCategoryID) {
      newErrors.subCategoryID = "Sub Category is required";
      isValid = false;
    }
    if (!formData.modelID) {
      newErrors.modelID = "Model is required";
      isValid = false;
    }
    if (!formData.selectedSkuId) {
      newErrors.selectedSkuId = "SKU is required";
      isValid = false;
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
      isValid = false;
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Add handleCancel function
  const handleCancel = () => {
    // Reset form data to initial state
    setFormData({
      preBookingId: 0,
      modelId: 146,
      selectedSkuId: "",
      startDate: "",
      endDate: "",
      status: 1,
      categoryID: null,
      subCategoryID: null,
      modelID: null,
    });

    // Clear all errors
    setErrors({
      categoryID: "",
      subCategoryID: "",
      modelID: "",
      selectedSkuId: "",
      startDate: "",
      endDate: "",
    });

    // Clear dropdown lists and selections
    setSubCategoryList([]);
    setModelList([]);
    setSkuList([]);
    setSelectedSkus([]);
  };

  const handleSkuSelection = (sku) => {
    setSelectedSkus((prev) => {
      const isSelected = prev.some((s) => s.skuID === sku.skuID);
      if (isSelected) {
        return prev.filter((s) => s.skuID !== sku.skuID);
      } else {
        return [...prev, sku];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSkus.length === skuList.length) {
      // If all are selected, deselect all
      setSelectedSkus([]);
    } else {
      // If not all are selected, select all
      setSelectedSkus([...skuList]);
    }
  };

  // Consolidated save/post logic with validation
  const handlePostRequest = async () => {
    // --- Validation Logic ---
    const newErrors = {
      categoryID: !formData.categoryID ? "Category is required" : "",
      subCategoryID: !formData.subCategoryID ? "Sub Category is required" : "",
      modelID: !formData.modelID ? "Model is required" : "",
      selectedSkuId: "", // Check below
      startDate: !formData.startDate ? "Start Date is required" : "",
      endDate: !formData.endDate ? "End Date is required" : "",
    };

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.startDate = "Start date cannot be greater than end date";
        newErrors.endDate = "End date cannot be smaller than start date";
      }
    }

    if (selectedSkus.length === 0) {
      newErrors.selectedSkuId = "At least one SKU must be selected";
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    // --- End Validation Logic ---

    if (!hasErrors) {
      try {
        // Construct the payload explicitly with only required fields
        const payload = {
          preBookingId: formData.preBookingId, // Use value from formData
          modelId: formData.modelID, // Use modelID from formData
          selectedSkuId: selectedSkus.map((sku) => sku.skuID).join(","), // Comma-separated SKUs
          startDate: formData.startDate, // Use startDate from formData
          endDate: formData.endDate, // Use endDate from formData
          status: formData.status, // Use status from formData
        };

        console.log("Sending payload:", payload);
        const response = await SaveUpdateSkuPreBooking(payload);

        if (response.statusCode === "200") {
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
          handleCancel(); // Reset form on success
          setTimeout(() => {
            setStatus(null);
            setTitle(null);
          }, 5000);
        } else {
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
          setTimeout(() => {
            // Also clear non-200 status message after a delay
            setStatus(null);
            setTitle(null);
          }, 5000);
        }
      } catch (error) {
        console.error("Error saving prebooking SKU:", error);
        setStatus("Error");
        setTitle("An error occurred while saving.");
        setTimeout(() => {
          // Clear error message after a delay
          setStatus(null);
          setTitle(null);
        }, 5000);
      }
    } else {
      console.log("Form has validation errors. Not saving.");
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
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
          <BreadcrumbsHeader pageTitle="Pre Booking SKU" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Rest of the content */}
      <Grid
        container
        spacing={0}
        lg={12}
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2 title="Add" backgroundColor={LIGHT_GRAY2}>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      CATEGORY <Required />
                    </Typography>
                    <NuralAutocomplete
                      label="Category"
                      options={categoryList}
                      placeholder="SELECT"
                      width="100%"
                      loading={categoryLoading}
                      getOptionLabel={(option) => option.categoryName || ""}
                      value={
                        categoryList.find(
                          (item) => item.categoryID === formData.categoryID
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleChange(
                          "categoryID",
                          newValue ? newValue.categoryID : null
                        )
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.categoryID === value.categoryID
                      }
                      error={!!errors.categoryID}
                      errorMessage={errors.categoryID}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      SUB CATEGORY <Required />
                    </Typography>
                    <NuralAutocomplete
                      label="Sub Category"
                      options={subCategoryList}
                      placeholder="SELECT"
                      width="100%"
                      loading={subCategoryLoading}
                      getOptionLabel={(option) => option.subCategoryName || ""}
                      value={
                        subCategoryList.find(
                          (item) =>
                            item.subCategoryID === formData.subCategoryID
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleChange(
                          "subCategoryID",
                          newValue ? newValue.subCategoryID : null
                        )
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.subCategoryID === value.subCategoryID
                      }
                      disabled={!categoryList.length}
                      error={!!errors.subCategoryID}
                      errorMessage={errors.subCategoryID}
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
                  </Grid>{" "}
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      MODEL <Required />
                    </Typography>
                    <NuralAutocomplete
                      label="Model"
                      options={modelList}
                      placeholder="SELECT"
                      width="100%"
                      loading={modelLoading}
                      getOptionLabel={(option) => option.modelName || ""}
                      value={
                        modelList.find(
                          (item) => item.modelID === formData.modelID
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleChange(
                          "modelID",
                          newValue ? newValue.modelID : null
                        )
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.modelID === value.modelID
                      }
                      disabled={!subCategoryList.length}
                      error={!!errors.modelID}
                      errorMessage={errors.modelID}
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
                  {/* </Grid> */}
                </Grid>

                <Grid
                  container
                  // spacing={}
                  sx={{ width: "100%", marginLeft: "0", paddingLeft: "0" }}
                >
                  {/* First Dropdown */}
                  {formData.modelID && (
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
                            
                          }}
                        >
                          SELECT SKU <Required />
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
                          {selectedSkus.length === skuList.length
                            ? "DESELECT ALL"
                            : "SELECT ALL"}
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
                        }}
                      >
                        {skuList.map((sku) => (
                          <Grid
                            item
                            xs={12}
                            md={3}
                            lg={3}
                            key={sku.skuID}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              checked={selectedSkus.some(
                                (s) => s.skuID === sku.skuID
                              )}
                              onChange={() => handleSkuSelection(sku)}
                              sx={{
                                "&.Mui-checked": {},
                                borderRadius: "8px",
                              }}
                            />

                            <Typography
                              sx={{
                                color: selectedSkus.some(
                                  (s) => s.skuID === sku.skuID
                                )
                                  ? WHITE
                                  : BLACK,
                                backgroundColor: selectedSkus.some(
                                  (s) => s.skuID === sku.skuID
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
                              {sku.skuName}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      {errors.selectedSkuId && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                            // ml: 2,
                          }}
                        >
                          {errors.selectedSkuId}
                        </Typography>
                      )}
                    </Grid>
                  )}
                </Grid>

                <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      START DATE <Required />
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      value={formData.startDate}
                      onChange={(date) => handleChange("startDate", date)}
                      error={!!errors.startDate}
                      errorMessage={errors.startDate}
                    />
                    {errors.startDate && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.startDate}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      END DATE <Required />
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      value={formData.endDate}
                      onChange={(date) => handleChange("endDate", date)}
                      error={!!errors.endDate}
                      errorMessage={errors.endDate}
                    />
                    {errors.endDate && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.endDate}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {/* Second Row */}

                {/* Third Row - Buttons */}
              </NuralAccordion2>
              <Grid item mt={2}>
                <Grid container spacing={1}>
                  <Grid container spacing={1}>
                    {status && (
                      <StatusModel
                        width="100%"
                        status={status}
                        title={title}
                        onClose={() => {
                          setStatus(null);
                          setTitle(null);
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
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="SAVE"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={handlePostRequest}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Add this after the NuralAccordion2 component */}
    </Grid>
  );
};

export default PrebookingSKUcreate;
