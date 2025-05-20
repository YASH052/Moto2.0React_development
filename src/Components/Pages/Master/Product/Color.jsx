import { Grid, Typography, Button, Switch } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import StatusModel from "../../../Common/StatusModel";
import { Edit } from "@mui/icons-material";
import {
  GetColorDropdownList,
  GetColorList,
  ManageColorAPI,
} from "../../../Api/Api";
import { FormSkeleton } from "../../../Common/Skeletons";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import {
  scrollToTableMiddle,
  scrollToTop,
} from "../../../Common/commonFunction";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import Loader from "../../../Common/Loader";

const Color = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const [activeTab, setActiveTab] = React.useState("color");
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [accordionExpanded2, setAccordionExpanded2] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [toggleStates, setToggleStates] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [colorDrop, setColorDrop] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpToPage, setJumpToPage] = useState("");
  const [displayPage, setDisplayPage] = useState("");
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [flag, setFlag] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [showSearchStatus, setShowSearchStatus] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    colorName: "",
    colorID: 0,
    colorCode: "",
    selectionMode: 2,
    pageIndex: page,
    pageSize: rowsPerPage,
  });
  const [formData, setFormData] = useState({
    colorName: "", //Mandatory
    status: 0, //0=Deactive, 1=Active //Mandatory
    colorID: 0, //for update
    colorCode: "", //Mandatory
    callType: 0 /*0=Save, 1=Update, 2=Status Update*/,
  });

  const [formErrors, setFormErrors] = useState({
    colorName: "",
    colorCode: "",
  });

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

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


  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Define table columns
  const tableColumns = [
    { id: "colorName", label: "COLOR NAME", sortable: true },
    { id: "colorCode", label: "COLOR CODE", sortable: true },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  useEffect(() => {
    fetchColorList();
  }, [page, rowsPerPage, flag]);

  useEffect(() => {
    fetchColorListDrop();
  }, []);

  const fetchColorListDrop = async () => {
    let body = {
      colorID: 0,
    };
    setSearchLoading(true);
    setIsLoading(true);
    try {
      const res = await GetColorDropdownList(body);
      if (res.statusCode == 200) {
        setColorDrop(res.colorDropdownList);
      } else {
        setColorDrop([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
      setIsLoading(false);
    }
  };

  const fetchColorList = async () => {
    setIsTableLoading(true);
    setIsLoading(true);
    let body = {
      colorName: searchParams.colorName,
      colorID: searchParams.colorID,
      colorCode: searchParams.colorCode,
      selectionMode: searchParams.selectionMode,
      pageIndex: searchParams.pageIndex || page,
      pageSize: searchParams.pageSize || rowsPerPage,
    };
    try {
      const res = await GetColorList(body);
      if (res.statusCode == 200) {
        setTableData(res.colorMasterList);
        setTotalRecords(res.totalRecords);
        setFilteredRows(res.colorMasterList);
      } else {
        setTableData([]);
        setFilteredRows([]);
        setShowStatus(true);
        setStatus(res.statusCode);
        setMessage(res.statusMessage);
      }
    } catch (error) {
      setTableData([]);
      setFilteredRows([]);
      setShowStatus(true);
      setStatus(error.statusCode || 500);
      setMessage(error.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsTableLoading(false);
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalRecords / rowsPerPage)) {
      setPage(newPage);
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: newPage,
      }));
      fetchColorList();
    }
  };

  const handleRowsPerPageChange = (value) => {
    const newRowsPerPage = parseInt(value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newRowsPerPage,
      pageIndex: 1,
    }));
    // Call fetchColorList directly after state updates
  };

  const handleJumpToPage = (pageNumber) => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    if (pageNumber >= 1 && pageNumber <= maxPage) {
      handlePageChange(pageNumber);
      setJumpToPage("");
      setDisplayPage(pageNumber.toString());
    }
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
        setFilteredRows([...tableData]); // Reset to original data
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...tableData].sort((a, b) => {
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

  // Update the search functionality for colors
  const handleSearch = async () => {
    setPage(1);
    setRowsPerPage(10);
    setSearchParams({
      colorName: searchParams.colorName,
      colorID: searchParams.colorID,
      colorCode: searchParams.colorCode,
      selectionMode: 2,
      pageIndex: 1,
      pageSize: 10,
    });
    setFlag(!flag);
    setDisplayPage(page.toString());
  };

  const handleChange = (field, value) => {
    // Remove spaces from color code as they are typed
    if (field === "colorCode") {
      value = value.replace(/\s/g, "");
    }

    const error = validateField(field, value);
    setFormErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "colorName":
        if (!value.trim()) {
          error = "Color name is required";
        } else if (value.length > 50) {
          error = "Color name cannot exceed 50 characters";
        } else if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Color name cannot contain special characters";
        }
        break;
      case "colorCode":
        if (!value.trim()) {
          error = "Color code is required";
        } else if (value.includes(" ")) {
          error = "Color code cannot contain spaces";
        } else if (value.length > 50) {
          error = "Color code cannot exceed 50 characters";
        } else if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Color code cannot contain special characters";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const errors = {
      colorName: validateField("colorName", formData.colorName),
      colorCode: validateField("colorCode", formData.colorCode),
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleCancelSearch = () => {
    setPage(1);
    setRowsPerPage(10);
    setSearchParams({
      colorName: "",
      colorID: 0,
      colorCode: "",
      selectionMode: 2,
      pageIndex: 1,
      pageSize: 10,
    });
    setFlag(!flag);
    setDisplayPage("1");
    // Keep create accordion open and view closed
    // setAccordionExpanded(true);
    // setAccordionExpanded2(false);
  };

  const handlePost = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await ManageColorAPI(formData);
      if (res.statusCode == 200) {
        setShowCreateStatus(true);
        setCreateStatus(res.statusCode);
        setCreateMessage(res.statusMessage);
        fetchColorListDrop();
        if (formData.callType === 1) {
          // Update case
          // Reset form after successful update
          setFormData({
            colorName: "",
            status: 0,
            colorID: 0,
            colorCode: "",
            callType: 0,
          });
          setFormErrors({});
          // Close the create accordion after update
          setAccordionExpanded(false);
        } else {
          // Create case
          // Reset form but keep accordion open
          setFormData({
            colorName: "",
            status: 0,
            colorID: 0,
            colorCode: "",
            callType: 0,
          });
          setFormErrors({});
          // Open view accordion and focus on table
          // setAccordionExpanded2(true);
        }
        requestAnimationFrame(() => {
          scrollToTableMiddle();
        });
        setTimeout(() => {
          setShowCreateStatus(false);
          setCreateStatus("");
          setCreateMessage("");
        }, 1500);

        // Refresh the list and scroll immediately
        await fetchColorList();
      } else {
        setShowCreateStatus(true);
        setCreateStatus(res.statusCode);
        setCreateMessage(res.statusMessage);
      }
    } catch (error) {
      setShowCreateStatus(true);
      setCreateStatus(error.statusCode || 500);
      setCreateMessage(error.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (colorID, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    let body = {
      colorID: colorID,
      status: newStatus,
      callType: 2, // Status Update
    };

    setIsLoading(true);
    try {
      const res = await ManageColorAPI(body);
      if (res.statusCode == 200) {
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);
        // Update the local state to reflect the change
        setTableData((prevData) =>
          prevData.map((item) =>
            item.colorID === colorID ? { ...item, status: newStatus } : item
          )
        );
        setFilteredRows((prevData) =>
          prevData.map((item) =>
            item.colorID === colorID ? { ...item, status: newStatus } : item
          )
        );
        setTimeout(() => {
          setShowSearchStatus(false);
          setSearchStatus("");
          setSearchMessage("");
        }, 3000);
      } else {
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);
      }
    } catch (error) {
      setShowSearchStatus(true);
      setSearchStatus(error.statusCode || 500);
      setSearchMessage(error.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleCancel = () => {
    setFormData({
      colorName: "",
      status: 0,
      colorID: 0,
      colorCode: "",
      callType: 0,
    });
    setFormErrors({});
    setShowCreateStatus(false);
    setCreateStatus("");
    setCreateMessage("");
    // Keep create accordion open and view closed
    setAccordionExpanded(true);
  };

  const handleJumpToFirst = () => {
    handlePageChange(1);
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    handlePageChange(lastPage);
  };

  const handleEdit = async (row) => {
    // Set form data for editing
    setFormData({
      colorName: row.colorName,
      status: row.status,
      colorID: row.colorID,
      colorCode: row.colorCode,
      callType: 1, // 1 for update
    });

    // Expand the create accordion to show the edit form
    setAccordionExpanded(true);

    // Clear any existing form errors
    setFormErrors({});

    // Scroll to top after a small delay to ensure the form is rendered
    scrollToTop();
  };

  const handleAccordionChange = (expanded) => {
    setAccordionExpanded(expanded);
    if (expanded) {
      setAccordionExpanded2(false);
    }
  };

  const handleAccordionChange2 = (expanded) => {
    setAccordionExpanded2(expanded);
    if (expanded) {
      setAccordionExpanded(false);
    }
  };

  const downloadExcel = async () => {
    setIsDownloadLoading(true);
    setIsLoading(true);
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    try {
      const res = await GetColorList(body);
      if (res.statusCode == 200) {
        window.location.href = res.filepathlink;
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);
        setTimeout(() => {
          setShowSearchStatus(false);
          setSearchStatus("");
          setSearchMessage("");
        }, 3000);
      } else {
        setShowSearchStatus(true);
        setSearchStatus(res.statusCode);
        setSearchMessage(res.statusMessage);
      }
    } catch (error) {
      setShowSearchStatus(true);
      setSearchStatus(error.statusCode || 500);
      setSearchMessage(error.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsDownloadLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "180px", lg: "260px" },
        cursor: isLoading ? "wait" : "default",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#fff",
          paddingBottom: 1,
          mr: 1.5,
        }}
      >
        <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
          <BreadcrumbsHeader pageTitle="Product" />
        </Grid>

        <Grid item xs={12} ml={0}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 2, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2
                  id="create-accordion"
                  title="Create"
                  controlled={true}
                  expanded={accordionExpanded}
                  onChange={(event, expanded) =>
                    handleAccordionChange(expanded)
                  }
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      marginBottom: "10px",
                      marginTop: "10px",
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    Color
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        COLOR NAME
                      </Typography>
                      <NuralTextField
                        value={formData.colorName}
                        onChange={(e) =>
                          handleChange("colorName", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER COLOR NAME"
                        error={!!formErrors.colorName}
                        errorMessage={formErrors.colorName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        COLOR CODE
                      </Typography>
                      <NuralTextField
                        value={formData.colorCode}
                        onChange={(e) =>
                          handleChange("colorCode", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER COLOR CODE"
                        error={!!formErrors.colorCode}
                        errorMessage={formErrors.colorCode}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              {showCreateStatus && (
                <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                  <StatusModel
                    width="100%"
                    status={createStatus}
                    title={createMessage}
                  />
                </Grid>
              )}

              {accordionExpanded && (
                <Grid
                  container
                  spacing={1}
                  mt={0.5}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleCancel}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="SAVE"
                      variant="contained"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      backgroundColor={AQUA}
                      onClick={handlePost}
                      width="100%"
                      // disabled={!formData.colorName || !formData.colorCode}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
                {searchLoading ? (
                  <FormSkeleton />
                ) : (
                  <NuralAccordion2
                    title="View"
                    controlled={true}
                    expanded={accordionExpanded2}
                    onChange={(event, expanded) =>
                      handleAccordionChange2(expanded)
                    }
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: DARK_PURPLE,
                        marginBottom: "10px",
                        marginTop: "10px",
                        // marginLeft: "10px",
                        marginRight: "10px",
                        mb: 3,
                      }}
                    >
                      Search
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          COLOR NAME
                        </Typography>
                        <NuralAutocomplete
                          label="COLOR NAME"
                          options={colorDrop}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.colorName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.colorName === value?.colorName
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "colorName",
                              newValue?.colorName || null
                            );
                          }}
                          value={
                            colorDrop.find(
                              (option) =>
                                option.colorName === searchParams.colorName
                            ) || null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          COLOR CODE
                        </Typography>
                        <NuralAutocomplete
                          label="COLOR CODE"
                          options={colorDrop}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.colorCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.colorCode === value?.colorCode
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "colorCode",
                              newValue?.colorCode || null
                            );
                          }}
                          value={
                            colorDrop.find(
                              (option) =>
                                option.colorCode === searchParams.colorCode
                            ) || null
                          }
                        />
                      </Grid>

                      <Grid item spacing={0} xs={11} sm={2} md={1}>
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
                      <Grid item xs={12} sm={10} md={11}>
                        <NuralTextButton
                          icon={"./Icons/searchIcon.svg"}
                          iconPosition="right"
                          height="36px"
                          backgroundColor={PRIMARY_BLUE2}
                          color="#fff"
                          width="100%"
                          onClick={handleSearch}
                          fontSize="12px"
                        >
                          SEARCH
                        </NuralTextButton>
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                )}

                {showSearchStatus && (
                  <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5} pr={2}>
                    <StatusModel
                      width="100%"
                      status={searchStatus}
                      title={searchMessage}
                    />
                  </Grid>
                )}

                {accordionExpanded2 && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <TableContainer
                      ref={tableContainerRef}
                      component={Paper}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        color: PRIMARY_BLUE2,
                        maxHeight: "calc(100vh - 100px)",
                        overflow: "auto",
                      }}
                    >
                      <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={15}
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
                          <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                            {tableColumns.map((column) => (
                              <TableCell
                                key={column.id}
                                onClick={() =>
                                  column.sortable && handleSort(column.id)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor: column.sortable
                                    ? "pointer"
                                    : "default",
                                  position: "sticky",
                                  top: "48px",
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 1100,
                                }}
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>{column.label}</Grid>
                                  {column.sortable && (
                                    <Grid
                                      item
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {sortConfig.key === column.id ? (
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
                          {isTableLoading
                            ? // Show skeleton rows while loading
                              Array(rowsPerPage)
                                .fill(0)
                                .map((_, index) => (
                                  <TableRowSkeleton
                                    key={index}
                                    columns={tableColumns.length + 1} // +1 for edit column
                                  />
                                ))
                            : filteredRows.map((row) => (
                                <TableRow key={row.colorID}>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.colorName}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.colorCode}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    <Switch
                                      checked={row.status == 1}
                                      onChange={() =>
                                        handleStatusChange(
                                          row.colorID,
                                          row.status
                                        )
                                      }
                                      sx={{
                                        ...toggleSectionStyle,
                                        "& .MuiSwitch-thumb": {
                                          backgroundColor:
                                            row.status == 1
                                              ? PRIMARY_BLUE2
                                              : DARK_PURPLE,
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    <Edit
                                      sx={{
                                        color: DARK_PURPLE,
                                        cursor: "pointer",
                                      }}
                                      fontSize="small"
                                      onClick={() => handleEdit(row)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                        </TableBody>
                      </Table>

                      {/* Custom Pagination */}
                      <Grid container sx={tablePaginationStyle}>
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
                            <span
                              style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}
                            >
                              {totalRecords} /{" "}
                              {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
                                  onClick={() => handleRowsPerPageChange(value)}
                                  sx={{
                                    minWidth: "25px",
                                    height: "24px",
                                    padding: "4px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      rowsPerPage === value
                                        ? PRIMARY_BLUE2
                                        : "transparent",
                                    color:
                                      rowsPerPage === value
                                        ? "#fff"
                                        : PRIMARY_BLUE2,
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

                        <Grid
                          item
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            color: PRIMARY_BLUE2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Manrope",
                              fontWeight: 700,
                              fontSize: "8px",
                              lineHeight: "10.93px",
                              letterSpacing: "4%",
                              textAlign: "center",
                              cursor: "pointer",
                            }}
                            onClick={handleJumpToFirst}
                          >
                            JUMP TO FIRST
                          </Typography>
                          <IconButton
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            sx={{ cursor: "pointer" }}
                          >
                            <NavigateBeforeIcon />
                          </IconButton>

                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            PAGE {page}
                          </Typography>

                          <IconButton
                            onClick={() => handlePageChange(page + 1)}
                            disabled={
                              page >= Math.ceil(totalRecords / rowsPerPage)
                            }
                            sx={{ cursor: "pointer" }}
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
                              cursor: "pointer",
                            }}
                            variant="body2"
                            onClick={handleJumpToLast}
                          >
                            JUMP TO LAST
                          </Typography>
                          <input
                            type="number"
                            placeholder="Jump to page"
                            min={1}
                            max={Math.ceil(totalRecords / rowsPerPage)}
                            value={jumpToPage}
                            onChange={(e) => {
                              const value = e.target.value;
                              setJumpToPage(value);
                              setDisplayPage(value);
                            }}
                            style={jumpToPageStyle}
                          />
                          <Grid mt={1}>
                            <img
                              src="./Icons/footerSearch.svg"
                              alt="arrow"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                if (jumpToPage) {
                                  handleJumpToPage(parseInt(jumpToPage, 10));
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
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
                sm: 0,
                md: 15,
                lg: 15,
              }}
              sx={{
                zIndex: 1000,
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
                    title="Export"
                    views={""}
                    downloadExcel={downloadExcel}
                    isDownloadLoading={isDownloadLoading}
                  />
                </Grid>
              </NuralActivityPanel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Color;
