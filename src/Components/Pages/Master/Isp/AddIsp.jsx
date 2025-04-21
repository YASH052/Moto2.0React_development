import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Checkbox,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import {
  AQUA,
  DARK_BLUE,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { useNavigate } from "react-router-dom";
import {
  GetAgencyListDropdown,
  GetISPParentHierarchyList,
  getISPRetailerReferenceDataLink,
  GetRetailerListDrpdown,
  SaveUpdateISPData,
  fetchISPList,
} from "../../../Api/Api";
import { createFilterOptions } from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { styled } from "@mui/material/styles";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralRetailer from "../../NuralCustomComponents/NuralRetailer";

const options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const options2 = [
  "Nural Network",
  "Deep Learning",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
];

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
  stringify: (option) => option.retailerCode + " " + option.retailerName,
});

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

// Custom styled checkbox
const CustomCheckbox = styled(Checkbox)(() => ({
  color: "#FFFFFF",
  padding: 0,
  "&.Mui-checked": {
    color: "#FFFFFF",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
  "& .MuiCheckbox-root": {
    padding: 0,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const AddIsp = () => {
  const [activeTab, setActiveTab] = React.useState("add-isp");
  const [tabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "create-salesman" },
  ]);
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [retailerList, setRetailerList] = useState([]);
  const [retailerListLoading, setRetailerListLoading] = useState(false);
  const [parentHierarchyList, setParentHierarchyList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [formData, setFormData] = useState({
    ispId: 0, // 0= to add, ISPID to update
    password: "",
    userName: "",
    passwordExpiryDays: 90, // taken from configValue in DB
    createLoginOrNot: 1, // taken from configValue in DB
    email: "",
    companyID: 0,
    ispName: "",
    ispCode: "",
    mobile: "",
    retailerID: 0, //selected Retailer's ID
    storeCode: "",
    joiningDate: "", // YYYY-MM-DD
    fromDate: null,
    weekOffDay: 1,
    parentHeirarchyID: 0,
    agencyID: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  // Add new state variables for table and search
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState({
    agencyID: 0,
    ispName: "",
    ispCode: "",
    storeCode: "",
    mobile: "",
    joiningDate: "",
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(true);
  const [selectedRows, setSelectedRows] = useState({});

  // Add table columns configuration
  const cells = [
    { label: "ISP NAME", key: "ispName" },
    { label: "ISP CODE", key: "ispCode" },
    { label: "RETAILER", key: "retailerName" },
    { label: "MOBILE", key: "mobile" },
    { label: "EMAIL", key: "email" },
    { label: "AGENCY", key: "agencyName" },
    { label: "STATUS", sortable: false },
    { label: "EDIT", sortable: false },
  ];

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-isp");
    } else if (value === "batch") {
      navigate("/isp-upload");
    }
  };

  const handleDownload = async () => {
    try {
      const params = {
        callType: 1, //0=Upload target reference data, 1=isp Retailer ref data
      };
      const response = await getISPRetailerReferenceDataLink(params);
      if (response.statusCode === "200") {
        window.location.href = response?.referenceDataLink;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("Template 1"),
      onDownload: handleDownload,
    },
  ];
  const getRetailerListDrpdown = async () => {
    setRetailerListLoading(true);
    try {
      const params = {
        retailerID: 0,
      };
      const response = await GetRetailerListDrpdown(params);
      if (response.statusCode === "200") {
        setRetailerList(response.retailerMasterList);
      } else {
        console.error("Failed to fetch retailer list:", response.error);
        setRetailerList([]);
      }
    } catch (error) {
      console.error("Error fetching retailer list:", error);
      setRetailerList([]);
    } finally {
      setRetailerListLoading(false);
    }
  };

  const getParentHierarchyList = async () => {
    try {
      const response = await GetISPParentHierarchyList();
      if (response.statusCode === "200") {
        setParentHierarchyList(response.ispParentHierarchyList);
      } else {
        setParentHierarchyList([]);
      }
    } catch (error) {
      console.log(error);
      setParentHierarchyList([]);
    }
  };

  const getAgencyListDropdown = async () => {
    try {
      const response = await GetAgencyListDropdown();
      if (response.statusCode === "200") {
        setAgencyList(response.ispAgencyMasterList);
        console.log(response.ispAgencyMasterList);
      } else {
        setAgencyList([]);
      }
    } catch (error) {
      console.log(error);
      setAgencyList([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = async () => {
    setIsLoading(true); // Show skeleton while reloading
    setFormData({
      ispId: 0,
      password: "",
      userName: "",
      passwordExpiryDays: 90,
      createLoginOrNot: 1,
      email: "",
      companyID: 0,
      ispName: "",
      ispCode: "",
      mobile: "",
      retailerID: 0,
      storeCode: "",
      joiningDate: "",
      fromDate: "",
      weekOffDay: 1,
      parentHeirarchyID: 0,
      agencyID: 0,
    });

    try {
      // Reload all data
      await Promise.all([
        getRetailerListDrpdown(),
        getParentHierarchyList(),
        getAgencyListDropdown(),
      ]);
    } catch (error) {
      console.error("Error reloading data:", error);
    } finally {
      setIsLoading(false); // Hide skeleton after reload completes
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await SaveUpdateISPData(formData);
      if (response.statusCode === "200") {
        alert("ISP Data Saved Successfully");
      } else {
        alert("ISP Data Save Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Add search accordion change handler
  const handleSearchAccordionChange = (event, expanded) => {
    setSearchAccordionExpanded(expanded);
  };

  // Add handleSearch function
  const handleSearch = () => {
    setTableLoading(true);
    setPage(0);
    setRowsPerPage(10);
    setSearchStatus(null);
    setSearchTitle("");

    const updatedParams = {
      ...searchFormData,
      pageIndex: 1,
      pageSize: 10,
    };

    fetchISPList(updatedParams);
  };

  // Update handleClearSearch function
  const handleClearSearch = () => {
    setSearchFormData({
      agencyID: 0,
      ispName: "",
      ispCode: "",
      storeCode: "",
      mobile: "",
      joiningDate: "",
      pageIndex: 1,
      pageSize: 10,
    });

    const clearedParams = {
      pageIndex: 1,
      pageSize: 10,
    };

    fetchISPList(clearedParams);
  };

  // Add handleSearchChange function
  const handleSearchChange = (field, value) => {
    if (value === null || value === undefined) {
      setSearchFormData((prev) => ({
        ...prev,
        [field]: 0,
      }));
      return;
    }

    let newValue;
    if (typeof value === "object") {
      if (field === "retailerID" && value.retailerId !== undefined) {
        newValue = value.retailerId;
      } else if (
        field === "parentHeirarchyID" &&
        value.orgnHierarchyID !== undefined
      ) {
        newValue = value.orgnHierarchyID;
      } else if (field === "agencyID" && value.agencyId !== undefined) {
        newValue = value.agencyId;
      } else {
        newValue = value.value || value.id || 0;
      }
    } else {
      newValue = value;
    }

    setSearchFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  // Add handleSort function
  const handleSort = (columnName) => {
    let newSortConfig = { key: columnName, direction: "asc" };

    if (sortConfig.key === columnName) {
      // If clicking the same column
      if (sortConfig.direction === "asc") {
        // If current direction is 'asc', change to 'desc'
        newSortConfig.direction = "desc";
      } else {
        // If current direction is 'desc', reset sorting
        newSortConfig = { key: null, direction: null };
      }
    }
    // If clicking a new column, the default 'asc' direction is already set

    setSortConfig(newSortConfig);

    // Apply sorting to the current filteredRows
    const sortData = (data, config) => {
      // If no sorting is applied (reset), return the data as is
      if (!config || !config.key || !config.direction) {
        // We might want to return to the original order from tableData if needed,
        // but for now, just keep the current order when sorting is reset.
        // Returning [...tableData] might be an option if filters are not applied.
        return [...data];
      }

      // Create a copy and sort it
      return [...data].sort((a, b) => {
        // Handle potential null/undefined values safely
        const aValue = a[config.key] != null ? String(a[config.key]).toLowerCase() : '';
        const bValue = b[config.key] != null ? String(b[config.key]).toLowerCase() : '';

        if (aValue < bValue) {
          return config.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    };

    // Update the filteredRows state with the sorted data
    // Use functional update to ensure we sort the latest state
    setFilteredRows(currentRows => sortData(currentRows, newSortConfig));
  };

  // Add handlePaginationChange function
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchFormData,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    fetchISPList(updatedParams);
  };

  // Add getISPList function
  const fetchISPList = async (params = { pageIndex: 1, pageSize: 10 }) => {
    try {
      setTableLoading(true);
      const response = await fetchISPList(params);
      if (response.statusCode === "200") {
        console.log(response.ispList);
        setFilteredRows(response.ispList || []);
        setTotalRecords(response.totalRecords || response.ispList.length);
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage);
      }
    } catch (error) {
      setFilteredRows([]);
      setSearchStatus(error.statusCode);
      setSearchTitle(error.statusMessage);
      console.log(error);
    } finally {
      setTableLoading(false);
    }
  };

  // Add handleStatus function
  const handleStatus = async (row, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      setUpdatingRowId(row.ispId);

      const statusUpdateData = {
        ...row,
        status: newStatus ? 1 : 0,
        callType: 3, // 3 = Status Update
      };

      const response = await SaveUpdateISPData(statusUpdateData);
      if (response.statusCode === "200") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Status updated successfully");
        setTimeout(() => {
          fetchISPList();
        }, 500);
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setStatus(error.statusCode || 500);
      setTitle(
        error.statusMessage || "An error occurred while updating status"
      );
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
    }
  };

  // Add handleEdit function
  const handleEdit = (row) => {
    setFormData({
      ispId: row.ispId,
      password: row.password || "",
      userName: row.userName || "",
      passwordExpiryDays: row.passwordExpiryDays || 90,
      createLoginOrNot: row.createLoginOrNot || 1,
      email: row.email || "",
      companyID: row.companyID || 0,
      ispName: row.ispName || "",
      ispCode: row.ispCode || "",
      mobile: row.mobile || "",
      retailerID: row.retailerID || 0,
      storeCode: row.storeCode || "",
      joiningDate: row.joiningDate || "",
      fromDate: row.fromDate || "",
      weekOffDay: row.weekOffDay || 1,
      parentHeirarchyID: row.parentHeirarchyID || 0,
      agencyID: row.agencyID || 0,
    });
  };

  // Add handleExport function
  const handleExport = async () => {
    try {
      setTableLoading(true);
      const exportParams = {
        ...searchFormData,
        pageIndex: -1, // -1 indicates export to excel
      };
      const response = await fetchISPList(exportParams);
      if (response.statusCode === "200" && response.reportLink) {
        window.location.href = response.reportLink;
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Export failed");
      }
    } catch (error) {
      console.error("Error exporting ISP list:", error);
      setSearchStatus(500);
      setSearchTitle("Failed to export data");
    } finally {
      setTableLoading(false);
    }
  };

  const handleCheckboxChange = (row, checked) => {
    setSelectedRows((prev) => ({
      ...prev,
      [row.ispId]: checked,
    }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getRetailerListDrpdown(),
          getParentHierarchyList(),
          getAgencyListDropdown(),
          fetchISPList(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Add status timeout effect
  useEffect(() => {
    if (status === "200") {
      const timer = setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <Grid 
      container 
      spacing={2}
      sx={{
        position: "relative",
        pl: { xs: 1, sm: 1, md: 0 },
        pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
      }}
    >
      {/* Header section - Full width on all devices */}
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: "#fff",
          pb: 1,
        }}
      >
        <Grid item xs={12} mt={3} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="ISP" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {isLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <>
          {/* Form sections - Stack on mobile, side by side on tablet and up */}
          <Grid container spacing={2} px={2} mt={1}>
            {/* Store Details section */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Store Details"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: { xs: "12px", sm: "14px" },
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: DARK_PURPLE,
                        mb: 3,
                      }}
                    >
                      Store Details
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Form fields - 2 columns on tablet */}
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          SELECT MODE
                        </Typography>
                        <Grid item xs={12} md={12} lg={12} ml={0} mt={1}>
                          <NuralRadioButton
                            onChange={handleFormatChange}
                            options={[
                              { value: "interface", label: "Interface" },
                              { value: "batch", label: "Batch" },
                            ]}
                            value={selectedFormat}
                            width="100%"
                            gap="5px"
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          RETAILER CODE
                        </Typography>
                        <NuralAutocomplete
                          options={retailerList}
                          getOptionLabel={(option) => option.retailerCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerId === value?.retailerId
                          }
                          value={
                            retailerList.find(
                              (item) => item.retailerId === formData.retailerID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "retailerID",
                              newValue?.retailerId || 0
                            );
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                          loading={retailerListLoading}
                          filterOptions={filterOptions}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          RETAILER NAME
                        </Typography>
                        <NuralAutocomplete
                          options={retailerList}
                          getOptionLabel={(option) => option.retailerName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerId === value?.retailerId
                          }
                          value={
                            retailerList.find(
                              (item) => item.retailerId === formData.retailerID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "retailerID",
                              newValue?.retailerId || 0
                            );
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                          loading={retailerListLoading}
                          filterOptions={filterOptions}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                          }}
                        >
                          REPORTING HIERARCHY
                        </Typography>
                        <Grid item xs={12} md={12} lg={12} ml={2} mt={1}>
                          <NuralAutocomplete
                            options={parentHierarchyList}
                            getOptionLabel={(option) =>
                              option.orgnHierarchyName || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option?.orgnHierarchyID === value?.orgnHierarchyID
                            }
                            value={
                              parentHierarchyList.find(
                                (item) =>
                                  item.orgnHierarchyID ===
                                  formData.parentHeirarchyID
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handleChange(
                                "parentHeirarchyID",
                                newValue?.orgnHierarchyID || 0
                              );
                            }}
                            placeholder="SELECT"
                            width="100%"
                            backgroundColor={LIGHT_BLUE}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                  <Grid item mt={2}>
                    <NuralAccordion
                      titleColor={DARK_PURPLE}
                      backgroundColor={LIGHT_GRAY2}
                      buttonColor={PRIMARY_BLUE2}
                      buttonBg={MEDIUM_BLUE}
                      width="100%"
                      referenceIcon1={"./Icons/downloadIcon.svg"}
                      referenceIcon2={"./Icons/downloadIcon.svg"}
                      title="Reference Data"
                      buttons={false}
                      templates={templates}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Personal Details section */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Personal Details"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: { xs: "12px", sm: "14px" },
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: DARK_PURPLE,
                        mb: 3,
                      }}
                    >
                      Personal Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          ISP NAME
                        </Typography>
                        <NuralTextField
                          value={formData.ispName}
                          onChange={(e) =>
                            handleChange("ispName", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER ISP NAME"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          ISP CODE
                        </Typography>
                        <NuralTextField
                          value={formData.ispCode}
                          onChange={(e) =>
                            handleChange("ispCode", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER ISP CODE"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          MOBILE NO.
                        </Typography>
                        <NuralTextField
                          value={formData.mobile}
                          onChange={(e) =>
                            handleChange("mobile", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER MOBILE NO."
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          EMAIL ID
                        </Typography>
                        <NuralTextField
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER EMAIL ID"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          JOINING DATE
                        </Typography>
                        <NuralCalendar
                          value={formData.joiningDate}
                          onChange={(value) =>
                            handleChange("joiningDate", value)
                          }
                          placeholder="DD/MMM/YYYY"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          AGENCY
                        </Typography>
                        <NuralAutocomplete
                          options={agencyList}
                          getOptionLabel={(option) => option.agencyName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.agencyId === value?.agencyId
                          }
                          value={
                            agencyList.find(
                              (item) => item.agencyId === formData.agencyID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleChange("agencyID", newValue?.agencyId || 0);
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          USER NAME
                        </Typography>
                        <NuralTextField
                          value={formData.userName}
                          onChange={(e) =>
                            handleChange("userName", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER USER NAME"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: { xs: "10px", sm: "10px" },
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          PASSWORD
                        </Typography>
                        <NuralTextField
                          value={formData.password}
                          onChange={(e) =>
                            handleChange("password", e.target.value)
                          }
                          width="100%"
                          placeholder="ENTER PASSWORD"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>

                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancel}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <NuralButton
                        text="PROCEED"
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
         

          {/* Search section - Full width with responsive columns */}
          <Grid item xs={12} px={2} mt={2}>
            <NuralAccordion2
              title="Search"
              backgroundColor={LIGHT_GRAY2}
              onChange={handleSearchAccordionChange}
              controlled={true}
              expanded={searchAccordionExpanded}
              defaultExpanded={true}
            >
              <Grid container spacing={2}>
                {/* Search fields - 3 columns on tablet */}
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    AGENCY CODE
                  </Typography>
                  <NuralAutocomplete
                    options={agencyList}
                    getOptionLabel={(option) => option.agencyName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.agencyId === value?.agencyId
                    }
                    value={
                      agencyList.find(
                        (item) => item.agencyId === searchFormData.agencyID
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      handleSearchChange("agencyID", newValue || null);
                    }}
                    placeholder="SELECT"
                    width="100%"
                    backgroundColor={LIGHT_GRAY2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    ISP NAME
                  </Typography>
                  <NuralAutocomplete
                    value={searchFormData.ispName}
                    onChange={(e) =>
                      handleSearchChange("ispName", e.target.value)
                    }
                    width="100%"
                    placeholder="SELECT"
                    backgroundColor={LIGHT_GRAY2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    ISP CODE
                  </Typography>
                  <NuralAutocomplete
                    value={searchFormData.ispCode}
                    onChange={(e) =>
                      handleSearchChange("ispCode", e.target.value)
                    }
                    width="100%"
                    placeholder="SELECT"
                    backgroundColor={LIGHT_GRAY2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    STORE CODE
                  </Typography>
                  <NuralTextField
                    value={searchFormData.storeCode}
                    onChange={(e) =>
                      handleSearchChange("storeCode", e.target.value)
                    }
                    width="100%"
                    placeholder="XXXXXXXXXXXXXXX"
                    backgroundColor={LIGHT_GRAY2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    MOBILE NO
                  </Typography>
                  <NuralTextField
                    value={searchFormData.mobile}
                    onChange={(e) =>
                      handleSearchChange("mobile", e.target.value)
                    }
                    width="100%"
                    placeholder="XXXXXXXXXXXXXXX"
                    backgroundColor={LIGHT_GRAY2}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: DARK_BLUE,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: { xs: "10px", sm: "10px" },
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                      mb: 1,
                    }}
                  >
                    JOINING DATE
                  </Typography>
                  <NuralCalendar
                    value={searchFormData.joiningDate}
                    onChange={(value) =>
                      handleSearchChange("joiningDate", value)
                    }
                    placeholder="DD/MMM/YYYY"
                  />
                </Grid>
              </Grid>

              {/* Search buttons - Responsive layout */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} sm={2} md={1}>
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
                <Grid item xs={12} sm={10} md={11}>
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
          </Grid>

          {/* Table section - Full width with responsive padding */}
          <Grid item xs={12} mt={2} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: {
                  xs: "calc(100vh - 280px)",
                  sm: "calc(100vh - 320px)",
                },
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
                        <Grid item>
                          <Grid
                            item
                            sx={{
                              cursor: "pointer",
                              mr: 2,
                            }}
                            onClick={handleExport}
                          >
                            <img src="./Images/export.svg" alt="export" />
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                    {cells.map((cell, index) => (
                      <TableCell
                        key={index}
                        onClick={() => cell.sortable && handleSort(cell.key)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: cell.sortable ? "pointer" : "default",
                          position: "sticky",
                          top: "45px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{cell.label}</Grid>
                          {cell.sortable && (
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
                <TableBody>
                  {tableLoading || statusUpdateLoading ? (
                    <TableRowSkeleton
                      columns={8}
                      rows={10}
                      sx={{ height: "calc(100vh - 90px)" }}
                    />
                  ) : Array.isArray(filteredRows) && filteredRows.length > 0 ? (
                    filteredRows.map((row) => {
                      const isSelected = selectedRows[row.ispId] || false;
                      return (
                        <TableRow
                          key={row.ispId}
                          sx={{
                            backgroundColor: isSelected
                              ? DARK_PURPLE
                              : "inherit",
                            color: isSelected ? "#FFFFFF" : "inherit",
                            "& .MuiTableCell-root": {
                              color: isSelected ? "#FFFFFF" : "inherit",
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CustomCheckbox
                                checked={isSelected}
                                onChange={(e) =>
                                  handleCheckboxChange(row, e.target.checked)
                                }
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "6px",
                                  backgroundColor: "#FFFFFF",
                                  border: "1px solid #E0E0E0",
                                  marginRight: "8px",
                                  "&.Mui-checked": {
                                    backgroundColor: "#FFFFFF",
                                    "& .MuiSvgIcon-root": {
                                      color: DARK_PURPLE,
                                    },
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                              {row.ispName}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            {row.ispCode}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            {row.storeCode}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            {row.mobile}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            {row.userName}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            {row.password}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            <Switch
                              checked={row.status === 1}
                              onChange={(e) =>
                                handleStatus(row, e.target.checked)
                              }
                              size="small"
                              disabled={
                                statusUpdateLoading &&
                                updatingRowId === row.ispId
                              }
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: isSelected ? "#FFFFFF" : PRIMARY_BLUE2,
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: isSelected
                                      ? "#FFFFFF"
                                      : DARK_PURPLE,
                                  },
                                "& .MuiSwitch-track": {
                                  backgroundColor: isSelected
                                    ? "#8F9BFF"
                                    : undefined,
                                },
                                "& .MuiSwitch-thumb": {
                                  backgroundColor: isSelected
                                    ? "#FFFFFF"
                                    : undefined,
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
                              color: isSelected ? "#FFFFFF" : "inherit",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              disabled={statusUpdateLoading}
                              sx={{
                                color: isSelected ? "#FFFFFF" : PRIMARY_BLUE2,
                              }}
                            >
                              <EditIcon
                                sx={{
                                  fontSize: 16,
                                  color: isSelected ? "#FFFFFF" : PRIMARY_BLUE2,
                                }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
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
      )}

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
          sm: 5,
          md: 5,
          lg: 0,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          right: "1rem",
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
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralRetailer title="Reports" views={""} />
          </Grid>
        </NuralActivityPanel>
      </Grid>

      {/* Add Status Model */}
      <Grid container sx={{ width: "100%", margin: "16px", marginBottom: "0" }}>
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
        {searchStatus && (
          <StatusModel
            width="100%"
            status={searchStatus}
            title={searchTitle}
            onClose={() => setSearchStatus(null)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AddIsp;
