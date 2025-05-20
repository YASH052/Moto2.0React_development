import { Grid, Typography, Button, Chip, Switch } from "@mui/material";
import React, { useEffect } from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  PRIMARY_LIGHT_GRAY,
} from "../../../../Common/colors";
import NuralAutocomplete from "../../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../../NuralCustomComponents/NuralTextButton";
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

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  titleStyle,
  toggleSectionStyle,
} from "../../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../../NuralCustomComponents/NuralReports";
import NuralExport from "../../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../../NuralCustomComponents/NuralActivityPanel";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { SCRCategoryList, GetModelListForDropdown, GetSKUListForDropdown, ManageStoreCategoryAPI, getStoreList } from "../../../../Api/Api"
import StatusModel from "../../../../Common/StatusModel";
import { TableRowSkeleton } from "../../../../Common/Skeletons";
const DemoCat = () => {
  const [activeTab, setActiveTab] = React.useState("demo-planogram");

  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-planogram" },
    { label: "Manage Audit", value: "manage-audit" },
    { label: "L1L2 Issue", value: "l1l2-issue" },
    { label: "RI Weightage", value: "ri-weightage" },
  ]);

  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];

  const DemoType = [
    "SKU",
    "Model"
  ]

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data

  const [title, setTitle] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [isDownloadLoading, setIsDownloadLoading] = React.useState(false);
  const [searchStatus, setSearchStatus] = React.useState(null);
  const [searchTitle, setSearchTitle] = React.useState(null);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [storeCategoryList, setStoreCategoryList] = React.useState([]);
  const [DropdownList, setDropdownList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [searchParams, setSearchParams] = React.useState({
    scrCategoryID: 0,
    callType: 0, // 0 = table bind, 1 = get Mapping list (baseid - modelid/skuid and basename - modelname/skuname)
    pageSize: 10,
    pageIndex: 1
  });
  const [formData, setFormData] = React.useState({
    scrCategoryID: "",
    scrCategoryName: "",
    //"baseIds": "147,148", //1-modelid,2-skuid string
    planogramType: 0, //1-model,2-sku
    planogramID: 0,
    noOfUnits: 1,
    status: 1,
    callType: 0, //0-save,1-update,2-toggle status
    baseIdList: [{ baseID: null }]


  });

  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editRowId, setEditRowId] = React.useState(null);

  const maxUnits = Math.max(...filteredRows.map(row => row.noOfUnits || 0), 0);

  const unitColumns = Array.from({ length: maxUnits }, (_, i) => ({
    id: `unit${i + 1}`,
    label: `UNIT ${i + 1}`,
    minWidth: 120,
  }));

  const baseColumns = [
    { id: "sNo", label: "S.NO", minWidth: 60 },
    { id: "storeCategory", label: "STORE CATEGORY", minWidth: 130 },
    { id: "demoType", label: "DEMO TYPE", minWidth: 130 },
  ];

  const endColumns = [
    { id: "status", label: "STATUS", minWidth: 100 },
    { id: "edit", label: "EDIT", minWidth: 80 },
  ];

  const columns = [...baseColumns, ...unitColumns, ...endColumns];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Enhanced sorting function
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

  // Add search/filter functionality
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.saleType ||
          row.column1
            .toLowerCase()
            .includes(searchValues.saleType.toLowerCase())) &&
        (!searchValues.region ||
          row.column2
            .toLowerCase()
            .includes(searchValues.region.toLowerCase())) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.serialType ||
          row.column6
            .toLowerCase()
            .includes(searchValues.serialType.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(1); // Reset to first page when filtering
  };

  // Update the search button click handler
  const handleSearchClick = () => {
    const searchValues = {
      saleType: document.querySelector('[name="saleType"]')?.value || "",
      region: document.querySelector('[name="region"]')?.value || "",
      state: document.querySelector('[name="state"]')?.value || "",
      fromDate: document.querySelector('[name="fromDate"]')?.value || "",
      toDate: document.querySelector('[name="toDate"]')?.value || "",
      serialType: document.querySelector('[name="serialType"]')?.value || "",
    };
    handleSearch(searchValues);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return {
          color: "#00C950",
          backgroundColor: "#E6F9ED",
        };
      case "Inactive":
        return {
          color: "#FF3A29",
          backgroundColor: "#FFEDEB",
        };
      case "Pending":
        return {
          color: "#FFB200",
          backgroundColor: "#FFF5E6",
        };
      default:
        return {
          color: "#666666",
          backgroundColor: "#F5F5F5",
        };
    }
  };

  const handleEdit = (row) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    setFormData({
      scrCategoryID: row.scrCategoryID,
      scrCategoryName: row.scrCategoryName || "",
      planogramType: row.planogramType,
      planogramID: row.planogramID,
      noOfUnits: row.noOfUnits,
      status: row.status,
      callType: 1, // For update
      baseIdList: row.storeDetailList.map(unit => ({
        baseID: unit.baseID
      }))
    });

    // If needed, fetch dropdown data for the correct type
    if (row.planogramType === 1) fetchDropdownData(1);
    if (row.planogramType === 2) fetchDropdownData(2);

    setIsEditMode(true);
    setEditRowId(row.planogramID);
  };

  // Function to reset the form
  const handleCancel = () => {
    setFormData({
      scrCategoryID: "",
      scrCategoryName: "",
      planogramType: 0,
      planogramID: 0,
      noOfUnits: 1,
      status: 1,
      callType: 0,
      baseIdList: [{ baseID: null }],
    });
    setDropdownList([]);
    setErrors({});
    setStatus(null);
    setTitle(null);
    setIsEditMode(false);
    setEditRowId(null);
  };

  const handleSearchCancel = () => {
    const defaultParams = {
      scrCategoryID: 0,
      callType: 0,
      pageSize: 10,
      pageIndex: 1
    };
    setSearchParams(defaultParams);
    // setDropdownList([]); // Clear the unit dropdown list if needed
    setSearchStatus(null);
    setSearchTitle(null);
    fetchGetStoreList(defaultParams); // Pass default params directly
  };

  const fetchSCRCategoryList = async () => {
    // setIsLoading(true)
    try {
      const body = {
        scrCategoryName: "",
        mode: 3
      }
      let response = await SCRCategoryList(body);
      if (response.statusCode == "200") {
        setStoreCategoryList(response.scrCategoryList || []);
      } else if (response.statusCode === "404") {
        setStoreCategoryList([]);
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching stockReportList:", error);
      setStatus(error.response.data.statusCode);
      setTitle(error.response.data.statusMessage);
    }
    finally {
      // setIsLoading(false);
    }
  }

  const fetchDropdownData = async (type) => {
    // setIsLoading(true);
    try {
      const commonBody = {
        categoryID: 0,      // product CategoryID
        modelID: 0,
        subCategoryID: 0,   // productID
        brandID: 0
      };

      let response;

      if (type === 1) {
        response = await GetModelListForDropdown({ ...commonBody });
      } else if (type === 2) {
        response = await GetSKUListForDropdown({ skuID: 0, ...commonBody });
      }

      if (response?.statusCode === "200") {
        const dropdownList = type === 1
          ? response.modelDropdownList || []
          : response.skuDropdownList || [];

        setDropdownList(dropdownList); // ✅ one shared dropdown list state
      } else if (response?.statusCode === "404") {
        setDropdownList([]); // clear dropdown
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setStatus(error?.response?.data?.statusCode);
      setTitle(error?.response?.data?.statusMessage);
    } finally {
      // setIsLoading(false);
    }
  };


  const handleIncreaseUnits = () => {
    setFormData(prev => ({ ...prev, noOfUnits: Number(prev.noOfUnits) + 1 }));
  };

  const handleDecreaseUnits = () => {
    setFormData(prev => ({
      ...prev,
      noOfUnits: Math.max(1, Number(prev.noOfUnits) - 1) // Ensure it doesn't go below 1
    }));
  };

  const handlePostChange = (field, value) => {
    console.log(field, value)
    let updatedValue = value;

    // --- Start Validation ---
    const error = validateField(field, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: error // Update error message for the specific field
    }));
    // --- End Validation ---

    if (field === "noOfUnits") {
      const numValue = parseInt(value, 10);
      // Allow empty string or numbers >= 1
      if (value === "" || (!isNaN(numValue) && numValue >= 1)) {
        updatedValue = value === "" ? "" : numValue; // Store "" or the valid number
      } else {
        updatedValue = 1; // Default to 1 if invalid input other than empty
      }
      // Just update the field, useEffect will handle baseIdList
      setFormData(prev => ({
        ...prev,
        [field]: updatedValue === "" ? 0 : updatedValue // Store 0 in state if input is ""
      }));
      return; // Return early as we've handled this specific field
    }


    if (field == "planogramType" && value == 1) {
      fetchDropdownData(1)
    } else if (field == "planogramType" && value == 2) {
      fetchDropdownData(2)
    }

    setFormData({
      ...formData,
      [field]: updatedValue // Use updatedValue which might be validated
    })
  }

  const handleSearchChange = (field, value) => {
    if (field == "scrCategoryID") {
      setSearchParams({
        ...searchParams,
        scrCategoryID: value
      })
    }
  }

  const fetchGetStoreList = async (params) => {
    setIsLoading(true) // Set loading true
    try {
      const body = {
        ...(params || searchParams), // Use passed params or state
        pageSize: rowsPerPage, // Keep default pageSize/pageIndex or allow override?
        pageIndex: page // For now, let's keep these fixed on fetch
      }
      let response = await getStoreList(body);
      if (response.statusCode == "200") {
        setFilteredRows(response.storeList || []);
        setTotalRecords(response.totalRecords);
      } else if (response.statusCode === "404") {
        setFilteredRows([]);
        setTotalRecords(0);
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching storeList:", error);
      setTotalRecords(0);
      setSearchStatus(error.response.data.statusCode);
      setSearchTitle(error.response.data.statusMessage);
    }
    finally {
      setIsLoading(false); // Set loading false
    }
  }


  useEffect(() => {
    fetchSCRCategoryList()
  }, [])

  useEffect(() => {
    fetchGetStoreList()
  }, [page, rowsPerPage])

  // Effect to synchronize baseIdList with noOfUnits
  useEffect(() => {
    const currentUnits = Number(formData.noOfUnits) || 0;
    setFormData(prev => {
      const existingList = prev.baseIdList || [];
      const newList = Array.from({ length: currentUnits }, (_, i) => {
        // Preserve existing entry if available, otherwise initialize
        return existingList[i] || { baseID: null };
      });
      // Only update state if the list actually changed to avoid infinite loops
      if (JSON.stringify(existingList) !== JSON.stringify(newList)) {
        return { ...prev, baseIdList: newList };
      }
      return prev; // No change needed
    });
  }, [formData.noOfUnits]);

  // Specific handler for unit dropdown changes
  const handleUnitChange = (index, newValue) => {
    const newBaseID = formData.planogramType === 1
      ? newValue?.modelID
      : newValue?.skuID;

    // Basic validation: Ensure a unit is selected
    const unitFieldName = `unit_${index}`; // Create a unique identifier for the error state
    const unitError = !newBaseID ? "Please select a unit." : "";
    setErrors(prevErrors => ({
      ...prevErrors,
      [unitFieldName]: unitError
    }));

    setFormData(prev => {
      const updatedList = [...prev.baseIdList]; // Create a copy
      if (updatedList[index]) {
        updatedList[index] = { ...updatedList[index], baseID: newBaseID || null };
      } else {
        // This case might happen if the list wasn't initialized correctly, though the useEffect should prevent it.
        updatedList[index] = { baseID: newBaseID || null };
      }
      return { ...prev, baseIdList: updatedList };
    });
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "scrCategoryID":
        if (!value) {
          error = "Store Category is required.";
        }
        break;
      case "planogramType":
        if (!value || value === 0) { // Assuming 0 is the placeholder/unselected state
          error = "Demo Type is required.";
        }
        break;
      case "noOfUnits":
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 1) {
          error = "Number of Units must be at least 1.";
        }
        break;
      // Add more cases for other fields if needed
      default:
        break;
    }
    return error;
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate required fields
    const fieldsToValidate = ["scrCategoryID", "planogramType", "noOfUnits"];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate each unit selection if units exist
    if (formData.noOfUnits > 0 && formData.baseIdList.length > 0) {
      formData.baseIdList.forEach((unit, index) => {
        if (!unit.baseID) {
          const unitFieldName = `unit_${index}`;
          newErrors[unitFieldName] = "Please select a unit.";
          isValid = false;
        }
      });
    }


    setErrors(newErrors);
    return isValid;
  };

  // Function to handle the Proceed button click
  const handleProceed = async () => {
    // --- Start Full Form Validation ---
    if (!validateForm()) {
      console.log("Form validation failed");
      // Optionally show a general error message to the user
      return; // Stop submission if validation fails
    }
    // --- End Full Form Validation ---

    setIsLoading(true); // Start loading
    try {
      const payload = {
        ...formData,
        callType: 0, // Explicitly set callType for save/create
      };
      const response = await ManageStoreCategoryAPI(payload);
      if (response?.statusCode === "200" || response?.statusCode === 200) {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Something went wrong");
        setFormData({
          scrCategoryID: "",
          scrCategoryName: "",
          planogramType: 0, // Reset to initial/default state
          planogramID: 0,
          noOfUnits: 1, // Reset to 1
          status: 1,
          callType: 0,
          baseIdList: [{ baseID: null }], // Reset to one item
        });
        setDropdownList([]);
        fetchGetStoreList()
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      console.error("Error in ManageStoreCategoryAPI:", error);
      throw error;
      // Add error feedback to the user
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
      setTimeout(() => {
        setStatus(null);
        setTitle(null);
      }, 2000);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    setSearchParams(prev => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1
    }));
  };

  const handlePageChange = (newPage) => {
    // Ensure page is within valid bounds
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    const validPage = Math.max(1, Math.min(newPage, maxPage));

    setPage(validPage);
    setSearchParams(prev => ({
      ...prev,
      pageIndex: validPage
    }));
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    handlePageChange(maxPage);
  };

  const handlePrevPage = () => {
    handlePageChange(page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  const handleStatusToggle = async (row) => {
    // Toggle the status (1 <-> 0)
    const newStatus = row.status === 1 ? 0 : 1;

    // Build the payload as per your structure
    const payload = {
      scrCategoryID: row.scrCategoryID,
      scrCategoryName: row.scrCategoryName || "",
      planogramID: row.planogramID,
      noOfUnits: row.noOfUnits,
      status: newStatus,
      callType: 2, // 2 for status update
      baseIdList: row.storeDetailList.map(unit => ({
        baseID: unit.baseID
      }))
    };

    setIsLoading(true);
    try {
      const response = await ManageStoreCategoryAPI(payload);
      if (response?.statusCode == "200" || response?.statusCode == 200) {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Status updated successfully");
        fetchGetStoreList(); // Refresh the table
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      setStatus(error?.response?.data?.statusCode || "Error");
      setTitle(error?.response?.data?.statusMessage || "Something went wrong");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setStatus(null);
        setTitle(null);
      }, 2000);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        callType: 1, // 2 for update
      };
      const response = await ManageStoreCategoryAPI(payload);
      if (response?.statusCode === "200" || response?.statusCode === 200) {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Updated successfully");
        setFormData({
          scrCategoryID: "",
          scrCategoryName: "",
          planogramType: 0,
          planogramID: 0,
          noOfUnits: 1,
          status: 1,
          callType: 0,
          baseIdList: [{ baseID: null }],
        });
        setDropdownList([]);
        setIsEditMode(false);
        setEditRowId(null);
        fetchGetStoreList();
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      setStatus(error?.response?.data?.statusCode || "Error");
      setTitle(error?.response?.data?.statusMessage || "Something went wrong");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setStatus(null);
        setTitle(null);
      }, 2000);
    }
  };

  const downloadExcel = async () => {
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    setIsDownloadLoading(true);
    try {
      let res = await getStoreList(body);
      if (res.statusCode == 200 && res.reportLink) {
        window.location.href = res.reportLink;
      } else {
        // setShowStatus(true);
        setTitle(res.statusMessage || "Failed to generate export.");
        setStatus(String(res.statusCode || "500"));
      }
    } catch (error) {
      // setShowStatus(true);
      setTitle(error.statusMessage || "Internal Server Error during export");
      setStatus(String(error.status || "500"));
    } finally {
      setIsDownloadLoading(false);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
        }}
      >
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
          <Grid item xs={12} mt={0} mb={0} ml={0}>
            <BreadcrumbsHeader pageTitle="Brand" />
          </Grid>

          <Grid item xs={12} ml={0}>
            <TabsBar
              tabs={tabbs}
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
          mt={1}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Create Demo Planogram"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Typography variant="h6" sx={titleStyle}>
                    Create
                  </Typography>
                  {/* First Row - Store Category and Demo Type */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        STORE CATEGORY
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={storeCategoryList}
                        placeholder="SELECT"
                        getOptionLabel={(option) =>
                          option.scrCategoryName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.scrCategoryID === value?.scrCategoryID
                        }
                        onChange={(event, newValue) => {
                          handlePostChange(
                            "scrCategoryID",
                            newValue?.scrCategoryID || ""
                          );
                        }}
                        value={
                          storeCategoryList.find(
                            (option) =>
                              option.scrCategoryID === formData.scrCategoryID
                          ) || null
                        }
                        error={!!errors.scrCategoryID}
                        helperText={errors.scrCategoryID}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        DEMO TYPE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={DemoType}
                        placeholder="SELECT"
                        onChange={(event, newValue) => {
                          handlePostChange(
                            "planogramType",
                            newValue === "Model" ? 1 : newValue === "SKU" ? 2 : 0 // Handle null/undefined newValue
                          );
                        }}
                        value={
                          formData.planogramType === 1
                            ? "Model"
                            : formData.planogramType === 2
                              ? "SKU"
                              : null // Return null when planogramType is 0 (or other non-1/2 value)
                        }
                        error={!!errors.planogramType}
                        helperText={errors.planogramType}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                          marginBottom: "16px",
                        }}
                        fontWeight={600}
                      >
                        NO OF UNITS
                      </Typography>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{
                          maxWidth: "300px",
                          margin: "-10px auto 0 auto",
                        }}
                      >
                        <IconButton
                          sx={{
                            width: "32px",
                            height: "32px",
                            border: "none",

                            borderRadius: "4px",
                            "&:hover": {
                              backgroundColor: "#d1d7dc",
                            },
                          }}
                          onClick={handleDecreaseUnits}
                        >
                          <RemoveIcon sx={{ fontSize: 20, color: "#2B3746" }} />
                        </IconButton>
                        <input
                          type="number"
                          value={formData.noOfUnits}
                          onChange={(e) => handlePostChange("noOfUnits", e.target.value)}
                          onBlur={(e) => {
                            const numValue = parseInt(e.target.value, 10);
                            // Trigger validation on blur as well
                            const error = validateField("noOfUnits", e.target.value);
                            setErrors(prevErrors => ({ ...prevErrors, noOfUnits: error }));
                            if (isNaN(numValue) || numValue < 1) {
                              // Correct the value if invalid on blur
                              handlePostChange("noOfUnits", 1);
                            }
                          }}
                          min="1"
                          style={{
                            width: "114px",
                            height: "36px",
                            textAlign: "center",
                            border: `2px solid ${errors.noOfUnits ? 'red' : SECONDARY_BLUE}`, // Highlight border on error
                            borderRadius: "8px",
                            fontSize: "16px",
                            color: "#2B3746",
                            backgroundColor: "#F8FAFC",
                          }}
                          onClick={handleIncreaseUnits}
                        />
                        {/* Display error message below input */}
                        {errors.noOfUnits && (
                          <Typography variant="caption" color="error" sx={{ width: '100%', textAlign: 'center', mt: 0.5 }}>
                            {errors.noOfUnits}
                          </Typography>
                        )}
                        <IconButton
                          sx={{
                            width: "32px",
                            height: "32px",
                            border: "none",

                            borderRadius: "4px",
                            "&:hover": {
                              backgroundColor: "#d1d7dc",
                            },
                          }}
                          onClick={handleIncreaseUnits}
                        >
                          <AddIcon sx={{ fontSize: 20, color: "#2B3746" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Unit Selection Fields */}
                  <Grid container spacing={2}>
                    {[...Array(Number(formData.noOfUnits) || 0)].map((_, index) => {
                      // Function to determine if an option should be disabled
                      const getOptionDisabled = (option) => {
                        const optionId = formData.planogramType === 1 ? option?.modelID : option?.skuID;
                        if (!optionId) return false; // Don't disable if option has no ID

                        // Check if this optionId is selected in *any other* unit dropdown
                        return formData.baseIdList.some((unit, unitIndex) =>
                          index !== unitIndex && unit.baseID === optionId
                        );
                      };

                      return (
                        <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                            }}
                            fontWeight={600}
                          >
                            UNIT {index + 1}
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            options={DropdownList} // Replace with your options
                            placeholder="SELECT"
                            getOptionLabel={(option) =>
                              option.modelName || option.skuName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.modelID === value?.modelID || option.skuID === value?.skuID
                            }
                            getOptionDisabled={getOptionDisabled} // Pass the disabling function
                            onChange={(event, newValue) => {
                              // Call the specific handler for unit changes
                              handleUnitChange(index, newValue);
                            }}
                            value={
                              // Find the selected value based on the baseID for this specific unit index
                              DropdownList.find(option => {
                                const currentBaseId = formData.baseIdList[index]?.baseID;
                                return formData.planogramType === 1
                                  ? option.modelID === currentBaseId
                                  : option.skuID === currentBaseId;
                              }) || null
                            }
                            error={!!errors[`unit_${index}`]}
                            helperText={errors[`unit_${index}`]}
                          />
                        </Grid>
                      );
                    })}

                  </Grid>
                </NuralAccordion2>

                <Grid container spacing={1} m={0} mb={4} pr={2}>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      width="100%"
                      onClick={handleCancel}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text={isEditMode ? "EDIT" : "PROCEED"}
                      backgroundColor={AQUA}
                      variant="contained"
                      width="100%"
                      onClick={isEditMode ? handleEditSubmit : handleProceed}
                      disabled={isLoading}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={12} lg={12} pr={2} mt={1}>
                  {status && (
                    <StatusModel width="100%"
                      status={status}
                      title={title}
                      onClose={() => setStatus(null)}
                    />
                  )}
                </Grid>

                <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                  <Typography variant="h6" sx={titleStyle}>
                    Search
                  </Typography>
                  {/* First Row - Store Category and Demo Type */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        STORE CATEGORY
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={storeCategoryList}
                        placeholder="SELECT"
                        getOptionLabel={(option) =>
                          option.scrCategoryName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.scrCategoryID === value?.scrCategoryID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "scrCategoryID",
                            newValue?.scrCategoryID || ""
                          );
                        }}
                        value={
                          storeCategoryList.find(
                            (option) =>
                              option.scrCategoryID === searchParams.scrCategoryID
                          ) || null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      // gap: { xs: 2, sm: 2 },
                    }}
                  >
                    <Grid item xs={12} sm={2} md={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleSearchCancel}
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
                        onClick={() => fetchGetStoreList()}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>

              </Grid>
            </Grid>
          </Grid>
          {/* Conditional Rendering for Table or StatusModel */}
          {filteredRows.length > 0 ? (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, }, mt: "-5rem" }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 100px)",
                  overflow: "auto",
                  "& .MuiTableCell-root": {
                    borderBottom: `1px solid ${LIGHT_GRAY2}`,
                  },
                }}
              >
                <Table sx={{ minWidth: 750 }} size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          position: "sticky",
                          top: 0,
                          zIndex: 1100,
                          borderBottom: "none",
                        }}
                      >
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
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1100,
                      borderBottom: "none",
                    }}>
                      {columns.map((column) => (
                        <TableCell key={column.id} sx={{ ...tableHeaderStyle }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      // Show skeletons while loading
                      Array.from(new Array(rowsPerPage)).map((_, index) => (
                        <TableRowSkeleton key={index} columns={columns.length} />
                      ))
                    ) : (
                      // Show data rows when not loading
                      filteredRows.map((row, index) => {
                        const statusColor = getStatusColor(row.status);
                        const serialNumber = (page - 1) * rowsPerPage + index + 1;
                        return (
                          <TableRow key={row.scrCategoryID}>
                            <TableCell sx={{ ...rowstyle }}>{serialNumber}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.scrCategoryName}
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              {row.planogramTypeName}
                            </TableCell>
                            {row.storeDetailList.map((unit, unitIndex) => (
                              <TableCell key={unitIndex} sx={{ ...rowstyle }}>
                                {unit.demoUnits}
                              </TableCell>
                            ))}
                            {Array.from({ length: maxUnits - row.storeDetailList.length }).map((_, i) => (
                              <TableCell key={`blank-${i}`} sx={{ ...rowstyle }} />
                            ))}
                            <TableCell sx={{ ...rowstyle }}>
                              <Switch
                                checked={row.status === 1}
                                onChange={() => handleStatusToggle(row)}
                                sx={{
                                  ...toggleSectionStyle,
                                  "& .MuiSwitch-thumb": {
                                    backgroundColor: PRIMARY_BLUE2,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(row)}
                                sx={{
                                  color: PRIMARY_BLUE2,
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>

                {/* Custom Pagination */}

              </TableContainer>
              <Grid
                width={"100%"}
                container
                sx={tablePaginationStyle}
              >
                <Grid item>
                  <Typography
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      textAlign: "center",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    TOTAL RECORDS:{" "}
                    <span style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}>
                      {totalRecords} /{" "}
                      {Math.ceil(totalRecords / searchParams.pageSize)} PAGES
                    </span>
                  </Typography>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      maxWidth: 300,
                      ml: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontSize: "10px",
                        color: PRIMARY_BLUE2,
                        fontWeight: 600,
                      }}
                    >
                      SHOW :
                    </Typography>
                    {[10, 25, 50, 100].map((value) => (
                      <Grid item key={value}>
                        <Button
                          onClick={() =>
                            handleChangeRowsPerPage({ target: { value } })
                          }
                          sx={{
                            minWidth: "25px",
                            height: "24px",
                            padding: "4px",
                            borderRadius: "50%",
                            backgroundColor:
                              rowsPerPage === value
                                ? PRIMARY_BLUE2
                                : "transparent",
                            color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                            fontSize: "12px",
                            "&:hover": {
                              backgroundColor:
                                rowsPerPage === value
                                  ? PRIMARY_BLUE2
                                  : "transparent",
                            },
                            mx: 0.5,
                          }}
                        >
                          {value}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item sx={{ display: "flex", alignItems: "center", gap: 2, color: PRIMARY_BLUE2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "8px",
                      lineHeight: "10.93px",
                      letterSpacing: "4%",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    onClick={handleFirstPage}
                  >
                    JUMP TO FIRST
                  </Typography>

                  <IconButton
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                  >
                    <NavigateBeforeIcon />
                  </IconButton>

                  <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
                    PAGE {page}
                  </Typography>

                  <IconButton
                    onClick={handleNextPage}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
                  >
                    <NavigateNextIcon />
                  </IconButton>

                  <Typography
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "8px",
                      lineHeight: "10.93px",
                      letterSpacing: "4%",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    variant="body2"
                    onClick={handleLastPage}
                  >
                    JUMP TO LAST
                  </Typography>

                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / searchParams.pageSize)}
                    onChange={(e) => {
                      // Just store the value, don't trigger page change
                      const value = e.target.value;
                      e.target.dataset.pageValue = value;
                    }}
                    style={{
                      width: "100px",
                      height: "24px",
                      fontSize: "10px",
                      paddingRight: "8px",
                      paddingLeft: "8px",
                      textAlign: "center",
                      borderRadius: "8px",
                      borderWidth: "1px",
                      border: `1px solid ${PRIMARY_BLUE2}`,
                      backgroundColor: LIGHT_GRAY2,
                      "&::placeholder": {},
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  />
                  <Grid
                    mt={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling;
                      const pageValue = parseInt(input.value, 10);
                      if (
                        pageValue >= 1 &&
                        pageValue <= Math.ceil(totalRecords / searchParams.pageSize)
                      ) {
                        handlePageChange(pageValue);
                        // input.value = ''; 
                      }
                    }}
                  >
                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : searchStatus ? (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 }, mt: "-5rem", display: 'flex', justifyContent: 'center' }}>
              <StatusModel
                width="100%" // Adjust width as needed
                status={searchStatus}
                title={searchTitle}
                onClose={() => setSearchStatus(null)}
              />
            </Grid>
          ) : null /* Render nothing if no rows and no search status */}

        </Grid>

        {/* Add this after the NuralAccordion2 component */}
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 12,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
            // filter: isDownloadLoading ? "blur(2px)" : "none",
            transition: "filter 0.3s ease",
          },
          "& .export-button": {
            filter: "none !important",
          },
        }}
      >
        <NuralActivityPanel>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <SelectionPanel columns={""} views={""} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={""} />
          </Grid>
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
              title="Export"
              views={""}
              downloadExcel={downloadExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default DemoCat;
