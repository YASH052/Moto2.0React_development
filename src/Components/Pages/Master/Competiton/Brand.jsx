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
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  LIGHT_BLUE,
  DARK_BLUE,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle, toggleSectionStyle } from "../../../Common/commonstyles";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import { GetCompetitionBrand, ManageCompetitionBrand } from "../../../Api/Api";
import StatusModel from "./../../../Common/StatusModel";
import NuralPagination from "./../../../Common/Pagination";
import Required from "../../../Common/Required";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const tabs = [
  { label: "Upload", value: "competiton-upload" },
  { label: "Brand", value: "competition-brand" },
  { label: "Category", value: "competition-category" },
  { label: "Model", value: "competition-model" },
  { label: "Price Band", value: "competition-price-band" },
];

const Brand = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("competition-brand");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [brandList, setBrandList] = useState([]);
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useState({
    mode: 0, // 1 = export to excel, 2= dropdown data,  0=table bind
    status: 1, // 0= active, 1 = all
    pageIndex: 1,
    pageSize: 10,
    brandId: 0,
    brandName: "",
  });
  const [formData, setFormData] = useState({
    competitionBrandID: 0,
    competitionBrandName: "",
    status: 1,
    callType: 0 /* 0 = save, 1= update records (along wih BrandID), 2= toggle status (along wih BrandID) */,
  });
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);

  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false);

  // Add skeleton loading states
  const [formLoading, setFormLoading] = useState(true);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

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

  const handleAccordionChange = (event, expanded) => {
    if (!expanded) {
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
    } else {
      setAccordionExpanded(true);
      setSearchAccordionExpanded(false);
    }

    // Use the ref and setTimeout for scrolling
    setTimeout(() => {
      scrollToTop(createAccordionRef);
    }, 100);
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

  const handleSort = (columnName) => {
    let direction = "asc";
    let sortKey = columnName;

    if (sortConfig.key === sortKey) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        getBrandList({ ...searchParams, pageIndex: 1 });
        return;
      }
    }

    setSortConfig({ key: sortKey, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      const dataKey =
        sortKey === "brandName" ? "competitionBrandName" : sortKey;

      const aValue = a[dataKey] ? a[dataKey].toString().toLowerCase() : "";
      const bValue = b[dataKey] ? b[dataKey].toString().toLowerCase() : "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredRows(sortedRows);
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);
    const formElement = document.getElementById("create-brand-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const getBrandDropdown = async () => {
    try {
      setFormLoading(true);

      const params = {
        mode: 2, // 2= dropdown data
        status: 0, // 0= active only for dropdown usually
        pageIndex: 1, // Not relevant for dropdown typically
        pageSize: 0, // Fetch all for dropdown
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
      }
    } catch (error) {
      console.error("Error fetching brand dropdown:", error);
      setBrandList([]);
    } finally {
      setFormLoading(false);
    }
  };

  const getBrandList = async (params = searchParams) => {
    setTableLoading(true);
    setSearchFormLoading(true);

    try {
      const tableParams = { ...params, mode: 0 };
      const response = await GetCompetitionBrand(tableParams);
      if (response.statusCode === "200") {
        const data = response.competitionBrandList || [];
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || data.length);
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Failed to load brand list");
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching brand list:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(
        error.statusMessage || "An error occurred while fetching brands"
      );
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
      setSearchFormLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.competitionBrandName ||
      formData.competitionBrandName.trim() === ""
    ) {
      newErrors.competitionBrandName = "Brand Name is required";
    } else if (formData.competitionBrandName.length > 50) {
      newErrors.competitionBrandName = "Brand Name cannot exceed 50 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostRequest = async () => {
    if (!validateForm()) {
      return;
    }

    setStatus(null);
    setTitle("");
    try {
      const payload = {
        ...formData,
        callType: isEditMode ? 1 : 0,
      };
      const response = await ManageCompetitionBrand(payload);

      if (response.statusCode === "200") {
        getBrandDropdown();
        handleCancel();
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
        getBrandList({ ...searchParams, pageIndex: 1 });
        setPage(1);
      } else if (response.statusCode === "400") {
        setStatus(response.statusCode);
        setTitle(response.statusMessage ?? "Something Went Wrong.");
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage ?? "Something Went Wrong.");
      }
    } catch (error) {
      console.error("Error saving/updating brand:", error);
      setStatus(error.statusCode || "500");
      setTitle(error.statusMessage || "Internal Server Error.");
    }
  };

  const handleEdit = (row) => {
    setFormData({
      competitionBrandID: row.competitionBrandID,
      competitionBrandName: row.competitionBrandName,
      status: row.status === "Active" ? 1 : 0,
      callType: 1,
    });
    setIsEditMode(true);
    setErrors({});
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);
    const formElement = document.getElementById("create-brand-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStatus = async (row, newStatusChecked) => {
    setStatusUpdateLoading(true);
    setUpdatingRowId(row.competitionBrandID);
    setSearchStatus(null);
    setSearchTitle("");

    const payload = {
      competitionBrandID: row.competitionBrandID,
      competitionBrandName: row.competitionBrandName,
      status: newStatusChecked ? 1 : 0,
      callType: 2,
    };

    try {
      const response = await ManageCompetitionBrand(payload);
      setSearchStatus(response.statusCode);
      setSearchTitle(response.statusMessage);

      if (response.statusCode === "200") {
        getBrandList(searchParams);
        getBrandDropdown();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(
        error.statusMessage || "An error occurred during status update"
      );
    } finally {
      setStatusUpdateLoading(false);
      setUpdatingRowId(null);
    }
  };

  const handleCancel = () => {
    setFormLoading(true);
    setFormData({
      competitionBrandID: 0,
      competitionBrandName: "",
      status: 1,
      callType: 0,
    });
    setIsEditMode(false);
    setErrors({});
    setStatus(null);
    setTitle("");
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);

    setTimeout(() => {
      setFormLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    setPage(0);
    setTableLoading(true);
    setSearchFormLoading(true);

    const updatedParams = {
      ...searchParams,
      brandId: searchParams.brandId || 0,
      pageIndex: 1,
      pageSize: rowsPerPage,
      mode: 0,
      status: 1,
    };
    setSearchParams(updatedParams);
    getBrandList(updatedParams);
    setAccordionExpanded(false);
    setSearchAccordionExpanded(true);
  };

  const handleSearchCancel = () => {
    setPage(0);
    setTableLoading(true);
    setSearchFormLoading(true);

    const clearedParams = {
      ...searchParams,
      brandId: 0,
      brandName: "",
      pageIndex: 1,
      pageSize: rowsPerPage,
      mode: 0,
      status: 1,
    };
    setSearchParams(clearedParams);
    getBrandList(clearedParams);
    setAccordionExpanded(false);
    setSearchAccordionExpanded(true);
  };

  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
      mode: 0,
    };
    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);
    getBrandList(updatedParams);
  };

  // --- Export Handler --- 
  const handleExport = async () => {
    setIsDownloadLoading(true); 
    setSearchStatus(null);
    setSearchTitle("");
    const params = {
      ...searchParams, 
      mode: 1, // 1 = excel export
      pageSize: 0, // Export all
      pageIndex: 1, // Start from page 1 for export
    };
    try {
      const response = await GetCompetitionBrand(params);
      if (response.statusCode === "200") {
        if (response?.reportLink) {
          window.location.href = response.reportLink;
          setSearchStatus(response.statusCode);
          setSearchTitle(response.statusMessage || "Export successful");
        } else {
          setSearchStatus("404"); 
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
      setIsDownloadLoading(false); 
    }
  };

  useEffect(() => {
    getBrandDropdown();
    getBrandList();
  }, []);

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
    <>
      <Grid container spacing={2} sx={{
        position: "relative",
        pl: { xs: 1, sm: 1 },
        pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
        isolation: "isolate",
      }}>
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
            <BreadcrumbsHeader pageTitle="Competition" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} pr={1.5} id="create-brand-form">
          <Grid container spacing={2} direction="column">
            <Grid item>
              {/* Wrap accordion and buttons in a div with the ref */}
              <div ref={createAccordionRef} style={{ position: 'relative', zIndex: 1000 }}>
              {formLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  <NuralAccordion2
                    title={isEditMode ? "Update Brand" : "Create Brand"}
                    backgroundColor={LIGHT_GRAY2}
                    expanded={accordionExpanded}
                    onChange={handleAccordionChange}
                    controlled={true}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid item xs={12}>
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
                          BRAND NAME <Required />
                        </Typography>
                        <NuralTextField
                          value={formData.competitionBrandName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              competitionBrandName: e.target.value,
                            });
                            if (errors.competitionBrandName) {
                              setErrors({
                                ...errors,
                                competitionBrandName: "",
                              });
                            }
                          }}
                          width="100%"
                          placeholder="Enter Brand Name"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.competitionBrandName}
                          onBlur={validateForm}
                        />
                        {!isEditMode && errors.competitionBrandName && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {errors.competitionBrandName}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
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
                          onClick={handlePostRequest}
                          width="100%"
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

        <Grid item xs={12} pr={1.5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              {searchFormLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  <NuralAccordion2
                    title="View "
                    backgroundColor={LIGHT_GRAY2}
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                  >
                    <Grid container spacing={2} sx={{ width: "100%" }}>
                      <Grid item xs={12}>
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
                          BRAND NAME
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          placeholder="SELECT "
                          backgroundColor={LIGHT_BLUE}
                          options={brandList}
                          isOptionEqualToValue={(option, value) =>
                            option?.competitionBrandID ===
                            value?.competitionBrandID
                          }
                          getOptionLabel={(option) =>
                            option?.competitionBrandName || ""
                          }
                          onChange={(event, value) => {
                            setSearchParams({
                              ...searchParams,
                              brandId: value ? value.competitionBrandID : 0,
                            });
                          }}
                          value={
                            brandList.find(
                              (brand) =>
                                brand.competitionBrandID ===
                                searchParams.brandId
                            ) || null
                          }
                        />
                      </Grid>
                    </Grid>

                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1}>
                        <Grid item xs={6} sm={2} md={1.5}>
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
                        <Grid item xs={6} sm={10} md={10.5} pr={1.5}>
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
                </>
              )}
            </Grid>
            {searchStatus && searchStatus !== "200" && (
              <Grid item xs={12} mt={1}>
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
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container sx={{ margin: '10px 10px 10px 0px '}}>
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
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 90px)",
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
                          Brand List
                        </Typography>
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
                      zIndex: 1000,
                      width: "50px",
                      padding: "8px 16px",
                    }}
                  >
                    S.NO
                  </TableCell>
                  {[
                    { label: "BRAND NAME", key: "brandName", sortable: true },
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
                  <TableRowSkeleton
                    columns={4}
                    rows={10}
                    imagePath="./Icons/emptyFile.svg"
                    sx={{ height: "calc(100vh - 420px)" }}
                  />
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <TableRow
                      key={row.competitionBrandID}
                      sx={{
                        fontSize: "10px",
                        "& td": { borderBottom: `1px solid #C6CEED` },
                      }}
                    >
                      <TableCell sx={{ ...rowstyle }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.competitionBrandName}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <Switch
                          checked={row.status === "Active"}
                          onChange={(e) => handleStatus(row, e.target.checked)}
                          size="small"
                          disabled={
                            statusUpdateLoading &&
                            updatingRowId === row.competitionBrandID
                          }
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
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography>
                        No brands found matching your criteria.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {totalRecords > 0 && (
              <NuralPagination
                key={`pagination-${page}-${rowsPerPage}-${totalRecords}`}
                totalRecords={totalRecords}
                initialPage={page}
                initialRowsPerPage={rowsPerPage}
                onPaginationChange={handlePaginationChange}
              />
            )}
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
          top: "70px",
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

export default Brand;
