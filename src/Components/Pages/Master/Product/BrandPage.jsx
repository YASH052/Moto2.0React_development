import { Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
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
import { useNavigate } from "react-router-dom";
import NuralPagination from "../../../Common/NuralPagination";
import { getbrandlist, managebrandMaster } from "../../../Api/Api";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import StatusModel from "../../../Common/StatusModel";

const tabs = [
  { label: "Upload", value: "product-bulk-upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "sub-category" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
  { label: "Focus Model", value: "focusModel" },
  { label: "Price", value: "price" },
  { label: "Pre Booking", value: "prebooking-sku-create" },
];

const BrandPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [formData, setFormData] = useState({
    Brand: "",
    BrandDesc: "", // BrandDesc is same as BrandCode
    Status: 0 /*1=Active, 0=Deactive*/,
    BrandID: 0,
    Action: 1 /*1=Insert,2=Update,3=Status Update*/,
  });

  const [searchParams, setSearchParams] = useState({
    BrandID: 0,
    PageIndex: 1,
    PageSize: 10,
    CallType: 0 /* 0 = bind for table data, 1= active lists for dropdown*/,
  });

  const [brandList, setBrandList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [statusSearch, setStatusSearch] = useState(null);
  const [titleSearch, setTitleSearch] = useState(null);

  // Add accordion state
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(true);
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);
  const [isTableUpdating, setIsTableUpdating] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add accordion change handlers
  const handleAccordionChange = (event, expanded) => {
    setAccordionExpanded(expanded);
  };

  const handleSearchAccordionChange = (event, expanded) => {
    setSearchAccordionExpanded(expanded);
  };

  // Add form validation
  const validateForm = () => {
    const newErrors = {};

    // Brand Name validation
    if (!formData.Brand || formData.Brand.trim() === "") {
      newErrors.Brand = "Brand Name is required";
    } else if (formData.Brand.length > 50) {
      newErrors.Brand = "Brand Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.Brand)) {
      newErrors.Brand =
        "Brand Name can only contain alphanumeric characters and spaces";
    }

    // Brand Code validation
    if (!formData.BrandDesc || formData.BrandDesc.trim() === "") {
      newErrors.BrandDesc = "Brand Code is required";
    } else if (formData.BrandDesc.length > 50) {
      newErrors.BrandDesc = "Brand Code cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.BrandDesc)) {
      newErrors.BrandDesc =
        "Brand Code can only contain alphanumeric characters (no spaces)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add form change handler
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
  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        setTableLoading(true);
        setIsTableUpdating(true);
        const response = await managebrandMaster(formData);
        if (response?.statusCode === "200") {
          handleClearForm();
          // Update both table and dropdown

          getBrandList();
          getBrandDropdown();

          setStatus(response.statusCode);
          setTitle(response.statusMessage || "Brand saved successfully");
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            setStatus(null);
            setTitle("");
          }, 5000);
        } else if (response?.statusCode === "400") {
          setErrors(response.error || {});
          setStatus(response.statusCode);
          setTitle(response.statusMessage || "Validation error");
        } else if (response?.statusCode === "500") {
          setStatus(response.statusCode);
          setTitle(response.statusMessage || "Server error");
        } else {
          setStatus("500");
          setTitle("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        setStatus(error?.statusCode || "500");
        setTitle(error?.statusMessage || "Something went wrong");
      } finally {
        setIsLoading(false);
        setTableLoading(false);
        setIsTableUpdating(false);
      }
    }
  };
  // Add clear form handler
  const handleClearForm = () => {
    setFormLoading(true);
    setFormData({
      Brand: "",
      BrandDesc: "",
      Status: 0,
      BrandID: 0,
      Action: 1,
    });
    setErrors({});
    setIsEditMode(false);
    // Clear both status models
    setStatus(null);
    setTitle("");
    setStatusSearch(null);
    setTitleSearch(null);
    setTimeout(() => {
      Promise.all([getBrandList(), getBrandDropdown()]).finally(() => {
        setFormLoading(false);
      });
    }, 500);
  };

  // Add clear search handler
  const handleClearSearch = () => {
    setSearchFormLoading(true);
    setSearchParams({
      BrandID: 0,
      PageIndex: 1,
      PageSize: 10,
      CallType: 0,
    });
    setTimeout(() => {
      Promise.all([getBrandList(), getBrandDropdown()]).finally(() => {
        setSearchFormLoading(false);
      });
    }, 500);
    setStatusSearch(null);
    setTitleSearch(null);
  };

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
  const handleSearch = async () => {
    setTableLoading(true);
    const updatedParams = {
      ...searchParams,
      CallType: 0,
    };
    getBrandList(updatedParams);
  };

  const downloadExcel = async () => {
    try {
      setTableLoading(true);
      setIsTableUpdating(true);
      const params = {
        ...searchParams,
        PageIndex: -1,
        CallType: 0,
      };
      const response = await getbrandlist(params);
      if (response.statusCode === "200") {
        window.location.href = response?.reportLink;
        setStatusSearch(response.statusCode);
        setTitleSearch(
          response.statusMessage || "File downloaded successfully"
        );
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatusSearch(null);
          setTitleSearch(null);
        }, 5000);
      } else if (response.statusCode === "400") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Something went wrong");
      } else if (response.statusCode === "500") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Internal server error");
      }
    } catch (error) {
      console.log(error);
      setStatusSearch(error.statusCode);
      setTitleSearch(error.statusMessage || "Something went wrong");
    } finally {
      setTableLoading(false);
      setIsTableUpdating(false);
    }
  };
  const getBrandList = async (params = searchParams) => {
    try {
      setTableLoading(true);
      setIsTableUpdating(true);
      const response = await getbrandlist(params);
      if (response.statusCode === "200") {
        const data = response.brandMasterList || [];
        console.log(data);
        setTableData(data);
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || 0);
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatusSearch(null);
          setTitleSearch(null);
        }, 5000);
      } else if (response.statusCode === "400") {
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Something went wrong");
      } else if (response.statusCode === "500") {
        setTableData([]);
        setFilteredRows([]);
        setTotalRecords(0);
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      setTableData([]);
      setFilteredRows([]);
      setTotalRecords(0);
      setStatusSearch(error.statusCode);
      setTitleSearch(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setTableLoading(false);
      setIsTableUpdating(false);
    }
  };

  // Add pagination handler
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      PageIndex: paginationState.page + 1,
      PageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    getBrandList(updatedParams);
  };

  const handleStatus = async (row) => {
    try {
      setUpdatingRowId(row.brandID);
      setStatusUpdateLoading(true);
      setIsTableUpdating(true);
      const updateData = {
        Brand: row.brand,
        BrandDesc: row.brandDesc,
        Status: row.status === 0 ? 1 : 0,
        BrandID: row.brandID,
        Action: 3, // Status Update
      };

      const response = await managebrandMaster(updateData);
      if (response.statusCode === "200") {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage);
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setStatusSearch(null);
          setTitleSearch(null);
        }, 5000);

        // Add delay before refreshing the table
        setTimeout(() => {
          getBrandList();
        }, 5000); // Wait for 5 seconds before refreshing
      } else {
        setStatusSearch(response.statusCode);
        setTitleSearch(response.statusMessage || "Something went wrong");
        // Revert the switch state since update failed
        const newRows = [...filteredRows];
        const rowIndex = newRows.findIndex((r) => r.brandID === row.brandID);
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          status: row.status, // Revert to original status
        };
        setFilteredRows(newRows);
      }
    } catch (error) {
      console.log(error);
      setStatus(error.statusCode);
      setTitle(error.statusMessage || "Something went wrong");
      // Revert the switch state since update failed
      const newRows = [...filteredRows];
      const rowIndex = newRows.findIndex((r) => r.brandID === row.brandID);
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        status: row.status, // Revert to original status
      };
      setFilteredRows(newRows);
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
      setIsTableUpdating(false);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      Brand: row.brand,
      BrandDesc: row.brandDesc,
      Status: row.status,
      BrandID: row.brandID,
      Action: 2, // Update
    });
    setIsEditMode(true);
    setAccordionExpanded(true); // Open the form accordion
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top where form is
  };

  // Update useEffect to initialize data
  useEffect(() => {
    setFormLoading(true);
    setSearchFormLoading(true);
    setTableLoading(true);

    Promise.all([getBrandDropdown(), getBrandList()]).finally(() => {
      setFormLoading(false);
      setSearchFormLoading(false);
      setTableLoading(false);
    });
  }, []);

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
                    <NuralAccordion2
                      title={isEditMode ? "Edit Brand" : "Create Brand"}
                      backgroundColor={LIGHT_GRAY2}
                      expanded={accordionExpanded}
                      onChange={handleAccordionChange}
                      controlled={true}
                      defaultExpanded={true}
                    >
                      <Grid container spacing={3} sx={{ width: "100%" }}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
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
                            BRAND NAME <Required />
                          </Typography>
                          <NuralTextField
                            width="100%"
                            value={formData.Brand || ""}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              // Check length first - display error but allow typing to continue
                              if (newValue.length > 50) {
                                setFormData((prev) => ({
                                  ...prev,
                                  Brand: newValue.substring(0, 50), // Truncate to 50 chars
                                }));
                                setErrors((prev) => ({
                                  ...prev,
                                  Brand:
                                    "Brand Name cannot exceed 50 characters",
                                }));
                                return; // Don't continue with normal update
                              }

                              // If input contains non-alphanumeric-space characters, don't update
                              if (
                                newValue &&
                                !/^[a-zA-Z0-9 ]*$/.test(newValue)
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  Brand:
                                    "Brand Name can only contain alphanumeric characters and spaces",
                                }));
                                return; // Don't update the form data
                              }

                              // Clear errors for valid input
                              if (newValue.trim() !== "") {
                                setErrors((prev) => ({ ...prev, Brand: "" }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  Brand: "Brand Name is required",
                                }));
                              }

                              handleChange("Brand", newValue);
                            }}
                            placeholder="ENTER BRAND NAME"
                            error={!!errors.Brand}
                          />
                          {errors.Brand && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{
                                fontSize: "0.75rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {errors.Brand}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
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
                            BRAND CODE <Required />
                          </Typography>
                          <NuralTextField
                            width="100%"
                            value={formData.BrandDesc || ""}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              // Check length first - display error but allow typing to continue
                              if (newValue.length > 50) {
                                setFormData((prev) => ({
                                  ...prev,
                                  BrandDesc: newValue.substring(0, 50), // Truncate to 50 chars
                                }));
                                setErrors((prev) => ({
                                  ...prev,
                                  BrandDesc:
                                    "Brand Code cannot exceed 50 characters",
                                }));
                                return; // Don't continue with normal update
                              }

                              // If input contains non-alphanumeric characters, don't update
                              if (
                                newValue &&
                                !/^[a-zA-Z0-9]*$/.test(newValue)
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  BrandDesc:
                                    "Brand Code can only contain alphanumeric characters (no spaces)",
                                }));
                                return; // Don't update the form data
                              }

                              // Clear errors for valid input
                              if (newValue.trim() !== "") {
                                setErrors((prev) => ({
                                  ...prev,
                                  BrandDesc: "",
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  BrandDesc: "Brand Code is required",
                                }));
                              }

                              handleChange("BrandDesc", newValue);
                            }}
                            placeholder="ENTER BRAND CODE"
                            error={!!errors.BrandDesc}
                          />
                          {errors.BrandDesc && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{
                                fontSize: "0.75rem",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {errors.BrandDesc}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </NuralAccordion2>

                    {accordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1.5}>
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
                              autoDismiss={status === "200"}
                            />
                          )}
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={handleClearForm}
                            width="100%"
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="SAVE"
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handleSave}
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
              <Grid item>
                {searchFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <NuralAccordion2
                    title="View"
                    backgroundColor={LIGHT_GRAY2}
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
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
                          BRAND NAME
                        </Typography>
                        <NuralAutocomplete
                          options={brandList}
                          getOptionLabel={(option) => option.brand}
                          isOptionEqualToValue={(option, value) =>
                            option?.brandID === value?.brandID
                          }
                          value={
                            brandList.find(
                              (item) => item.brandID == formData.BrandID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleChange("BrandID", newValue?.brandID || 0);
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_GRAY2}
                          loading={isLoading}
                        />
                      </Grid>
                    </Grid>

                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1}>
                        <Grid item spacing={1} xs={11} sm={2} md={1}>
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
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container mt={1} mb={1}>
              {statusSearch && (
                <StatusModel
                  width="100%"
                  status={statusSearch}
                  title={titleSearch}
                  onClose={() => {
                    setStatusSearch(null);
                    setTitleSearch(null);
                  }}
                  autoDismiss={statusSearch === "200"}
                />
              )}
            </Grid>

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 320px)", // Adjusted to account for headers
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
                      colSpan={5}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 1100,
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
                            style={{ cursor: "pointer" }}
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
                    {[
                      { label: "BRAND NAME", key: "brand" },
                      { label: "BRAND CODE", key: "brandDesc" },
                      { label: "STATUS", sortable: false },
                      { label: "EDIT", sortable: false },
                    ].map((header, index) => (
                      <TableCell
                        key={index}
                        onClick={() =>
                          header.sortable !== false &&
                          header.key &&
                          handleSort(header.key)
                        }
                        sx={{
                          ...tableHeaderStyle,
                          cursor:
                            header.sortable !== false ? "pointer" : "default",
                          position: "sticky",
                          top: "45px", // Same as S.NO cell
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{header.label}</Grid>
                          {header.sortable !== false && header.key && (
                            <Grid
                              item
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
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
                    <TableRowSkeleton
                      columns={5} // 5 columns to match your table
                      rows={10} // Show 10 skeleton rows
                      imagePath="./Icons/emptyFile.svg"
                      sx={{ height: "calc(100vh - 420px)" }}
                    />
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
                        <TableCell sx={{ ...rowstyle }}>{row.brand}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.brandDesc}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={row?.status === 1}
                            onChange={(e) => {
                              const newRows = [...filteredRows];
                              const rowIndex = newRows.findIndex(
                                (r) => r.brandID === row.brandID
                              );
                              newRows[rowIndex] = {
                                ...newRows[rowIndex],
                                status: e.target.checked ? 1 : 0,
                              };
                              setFilteredRows(newRows);
                              handleStatus(newRows[rowIndex]);
                            }}
                            size="small"
                            disabled={
                              statusUpdateLoading &&
                              updatingRowId === row.brandID
                            }
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
                      <TableCell colSpan={5} align="center">
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
        </>
      </Grid>
    </>
  );
};

export default BrandPage;
