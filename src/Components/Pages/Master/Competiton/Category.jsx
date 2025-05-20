import {
  Box,
  Checkbox,
  Grid,
  Typography,
  Switch,
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
  WHITE,
  LIGHT_BLUE,
  PRIMARY_BLUE,
  BLACK,
  DARK_BLUE,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  headTitle,
  rowstyle,
  tableHeaderStyle,
  titleStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import {
  GetCompetitionBrand,
  GetCompetitionCategoryListMoto,
  ManageCompetitionCategory,
} from "../../../Api/Api";
import Required from "../../../Common/Required";
import StatusModel from "./../../../Common/StatusModel";
import NuralPagination from "./../../../Common/Pagination";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

import { competitionCategoryAPI } from "./api";
import useHttp from "../../../../hooks.js/use-http";
import ViewCategory from "./ViewCategory";

const tabs = [
  { label: "Upload", value: "competiton-upload" },
  { label: "Brand", value: "competition-brand" },
  { label: "Category", value: "competition-category" },
  { label: "Model", value: "competition-model" },
  { label: "Price Band", value: "competition-price-band" },
];

const Category = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("competition-category");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState(null);
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const API = useHttp();
  const [searchParams, setSearchParams] = useState({
    competitionBrandID: 0,
    competitionCategoryID: 0,
    competitionCategoryName: "",
    status: 2,
    callType: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [formData, setFormData] = useState({
    competitionCategoryID: 0,
    competitionCategoryName: "",
    status: 1,
    callType: 0,
    brandMappingList: [],
  });
  const [brandList, setBrandList] = useState([]);
  const [brandCheckList, setBrandCheckList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const createAccordionRef = React.useRef(null);

  const scrollToTop = (elementRef = null) => {
    if (elementRef && elementRef.current) {
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
  };

  const handleSearchAccordionChange = (event, expanded) => {
    if (!expanded) {
      setSearchAccordionExpanded(false);
      setAccordionExpanded(false);
      setTableVisible(false);
    } else {
      setSearchAccordionExpanded(true);
      setAccordionExpanded(false);
      setTableVisible(true);
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
        getCategoryList({ ...searchParams, pageIndex: 1 });
        return;
      }
    }

    setSortConfig({ key: sortKey, direction });

    const sortedData = [...filteredRows].sort((a, b) => {
      const aValue = a[sortKey]?.toString().toLowerCase() || "";
      const bValue = b[sortKey]?.toString().toLowerCase() || "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRows(sortedData);
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // const getBrandDropdown = async () => {
  //   try {
  //     setBrandLoading(true);
  //     setFormLoading(true);

  //     const params = {
  //       mode: 2,
  //       status: 0,
  //       pageIndex: 1,
  //       pageSize: 0,
  //       brandId: 0,
  //       brandName: "",
  //     };
  //     const response = await GetCompetitionBrand(params);
  //     if (response.statusCode === "200") {
  //       const activeBrands = response.competitionBrandList || [];
  //       setBrandList(activeBrands);
  //       setBrandCheckList(activeBrands);
  //     } else {
  //       console.error(
  //         "Failed to fetch brand dropdown:",
  //         response.statusMessage
  //       );
  //       setBrandList([]);
  //       setBrandCheckList([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching brand dropdown:", error);
  //     setBrandList([]);
  //     setBrandCheckList([]);
  //   } finally {
  //     setBrandLoading(false);
  //     setFormLoading(false);
  //   }
  // };

  const getCategoryList = async (params = searchParams) => {
    setTableLoading(true);
    setSearchStatus(null);
    setSearchTitle("");

    try {
      const response = await GetCompetitionCategoryListMoto(params);

      if (response.statusCode === "200") {
        const data = response.competitionCategoryDataList || [];
        console.log(data);
        setFilteredRows(data);
        setTotalRecords(response.totalRecords || data.length);
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(
          response.statusMessage || "Failed to load category list"
        );
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching category list:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(
        error.statusMessage || "An error occurred while fetching categories"
      );
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
      setSearchFormLoading(false);
    }
  };

  const getMappedBrandList = async (categoryID) => {
    const params = {
      ...searchParams,
      competitionCategoryID: categoryID,
      callType: 1,
      pageSize: 0,
      pageIndex: 1,
    };

    try {
      const response = await GetCompetitionCategoryListMoto(params);

      if (response.statusCode === "200") {
        const data = response.mappedBrandList[0].mappingList || [];
        console.log("Fetched Mapped Brands:", data);
        return data;
      } else {
        console.error("Failed to fetch mapped brands:", response.statusMessage);
        setSearchStatus(response.statusCode);
        setSearchTitle(
          response.statusMessage || "Failed to load mapped brand list"
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching mapped brands:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(
        error.statusMessage || "An error occurred while fetching mapped brands"
      );
      return [];
    }
  };

  const handleBrandSelection = (brand) => {
    setSelectedBrands((prev) => {
      const isSelected = prev.some(
        (b) => b.competitionBrandID === brand.competitionBrandID
      );
      if (isSelected) {
        return prev.filter(
          (b) => b.competitionBrandID !== brand.competitionBrandID
        );
      } else {
        return [...prev, { competitionBrandID: brand.competitionBrandID }];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBrands.length === brandCheckList.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(
        brandCheckList.map((brand) => ({
          competitionBrandID: brand.competitionBrandID,
        }))
      );
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.competitionCategoryName ||
      formData.competitionCategoryName.trim() === ""
    ) {
      newErrors.competitionCategoryName = "Category Name is required";
    } else if (formData.competitionCategoryName.length > 100) {
      newErrors.competitionCategoryName =
        "Category Name cannot exceed 100 characters";
    }
    if (selectedBrands.length === 0) {
      newErrors.brandMapping = "At least one brand must be mapped";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostRequest = async () => {
    if (!validateForm()) {
      console.log("Validation Errors:", errors);
      return;
    }

    setStatus(null);
    setTitle("");

    try {
      const brandMappingList = selectedBrands.map((brand) => ({
        competitionBrandID: brand.competitionBrandID,
        mappingStatus: 1,
      }));

      const payload = {
        ...formData,
        brandMappingList: brandMappingList,
        callType: isEditMode ? 1 : 0,
        status: formData.status,
      };

      console.log("Sending Payload:", payload);
      const response = await ManageCompetitionCategory(payload);
      console.log("API Response:", response);

      if (response.statusCode === "200") {
        getCategoryList({ ...searchParams, pageIndex: 1 });
        setPage(0);

        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Operation successful");
        setTimeout(() => {
          setStatus(null);
          setTitle("");
        }, 5000);
        handleCancel();
      } else {
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "An error occurred");
        console.error("API Error:", response.statusMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus(error.statusCode || "500");
      setTitle(error.message || "An unexpected error occurred.");
    }
  };

  const handleEdit = async (row) => {
    console.log("Editing Row:", row);
    setStatus(null);
    setTitle("");
    setErrors({});

    setFormData({
      competitionCategoryID: row.competitionCategoryID,
      competitionCategoryName: row.competitionCategoryName,
      status: row.status === "Active" ? 1 : 0,
      callType: 1,
      brandMappingList: [],
    });
    setIsEditMode(true);
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);

    setTimeout(() => {
      scrollToTop(createAccordionRef);
    }, 100);

    try {
      const mappedBrandsData = await getMappedBrandList(
        row.competitionCategoryID
      );

      if (mappedBrandsData && Array.isArray(mappedBrandsData)) {
        const mappedBrandIds = new Set(
          mappedBrandsData.map((brand) => brand.competitionBrandID)
        );

        const commonBrands = brandList.filter((brand) =>
          mappedBrandIds.has(brand.competitionBrandID)
        );

        const brandsToSelect = commonBrands.map((brand) => ({
          competitionBrandID: brand.competitionBrandID,
        }));

        setSelectedBrands(brandsToSelect);
        console.log(
          "Selected brands set based on mapped data:",
          brandsToSelect
        );
      } else {
        console.error("Failed to get valid mapped brands data.");
        setSelectedBrands([]);
        setStatus("Error");
        setTitle("Could not load associated brands.");
      }
    } catch (error) {
      console.error("Error processing mapped brands:", error);
      setSelectedBrands([]);
      setStatus("Error");
      setTitle("Error fetching or processing associated brands.");
    }
  };

  const handleStatus = async (row, newStatusChecked) => {
    setStatusUpdateLoading(true);
    setUpdatingRowId(row.competitionCategoryID);
    setSearchStatus(null);
    setSearchTitle("");

    const payload = {
      competitionCategoryID: row.competitionCategoryID,
      competitionCategoryName: row.competitionCategoryName,
      status: newStatusChecked ? 1 : 0,
      callType: 2,
      brandMappingList: [],
    };

    console.log("Toggling status with payload:", payload);

    try {
      const response = await ManageCompetitionCategory(payload);
      setSearchStatus(response.statusCode);
      setSearchTitle(response.statusMessage);
      setTimeout(() => {
        setSearchStatus(null);
        setSearchTitle("");
      }, 5000);
      if (response.statusCode === "200") {
        getCategoryList(searchParams);
      } else {
        console.error("Failed to toggle status:", response.statusMessage);
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
      competitionCategoryID: 0,
      competitionCategoryName: "",
      status: 1,
      callType: 0,
      brandMappingList: [],
    });
    setSelectedBrands([]);
    setIsEditMode(false);
    setErrors({});

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
      competitionCategoryName: searchParams.competitionCategoryName || "",
      pageIndex: 1,
      pageSize: rowsPerPage,
      callType: 0,
      status: 2,
    };
    setSearchParams(updatedParams);
    getCategoryList(updatedParams);
    setSearchAccordionExpanded(true);
    setAccordionExpanded(false);
  };

  const handleSearchCancel = () => {
    setPage(0);
    setTableLoading(true);
    setSearchFormLoading(true);

    const clearedParams = {
      ...searchParams,
      competitionBrandID: 0,
      competitionCategoryID: 0,
      competitionCategoryName: "",
      pageIndex: 1,
      pageSize: rowsPerPage,
      callType: 0,
      status: 2,
    };
    setSearchParams(clearedParams);
    getCategoryList(clearedParams);
    setSearchAccordionExpanded(true);
    setAccordionExpanded(false);
    setSearchStatus(null);
    setSearchTitle("");
  };

  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
      callType: 0,
    };
    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);
    getCategoryList(updatedParams);
  };

  const handleExport = async () => {
    setIsDownloadLoading(true);
    setSearchStatus(null);
    setSearchTitle("");
    try {
      const params = {
        ...searchParams,
        calltype: 0,
        pageIndex: -1,
      };
      const response = await GetCompetitionCategoryListMoto(params);
      if (response.statusCode === "200") {
        if (response?.reportLink) {
          window.location.href = response.reportLink;
          setSearchStatus(response.statusCode);
          setSearchTitle(response.statusMessage || "Export successful");
          setTimeout(() => {
            setSearchStatus(null);
            setSearchTitle("");
          }, 5000);
        } else {
          setSearchStatus("404");
          setSearchTitle("Export link not found.");
        }
      } else {
        setSearchStatus(response.statusCode);
        setSearchTitle(response.statusMessage || "Export failed");
        console.error("Failed to export data:", response.statusMessage);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      setSearchStatus(error.statusCode || "500");
      setSearchTitle(error.statusMessage || "An error occurred during export");
    } finally {
      setIsDownloadLoading(false);
    }
  };

  useEffect(() => {
    // getBrandDropdown();
    getCategoryList();
  }, []);

  useEffect(() => {
    if (status === "200" && title) {
      const timer = setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, title]);

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

        <Grid item xs={12} pr={1.5} id="create-category-form">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <div
                ref={createAccordionRef}
                style={{ position: "relative", zIndex: 1000 }}
              >
                {formLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <NuralAccordion2
                      title={isEditMode ? "Update Category" : "Create Category"}
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
                            CATEGORY NAME <Required />
                          </Typography>
                          <NuralTextField
                            value={formData.competitionCategoryName}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                competitionCategoryName: e.target.value,
                              });
                              if (errors.competitionCategoryName) {
                                setErrors({
                                  ...errors,
                                  competitionCategoryName: "",
                                });
                              }
                            }}
                            width="100%"
                            placeholder="Enter Category Name"
                            backgroundColor={LIGHT_BLUE}
                            error={!!errors.competitionCategoryName}
                          />
                          {errors.competitionCategoryName && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {errors.competitionCategoryName}
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12}>
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
                                fontWeight: 700,
                                fontSize: "10px",
                                letterSpacing: "4%",
                                ml: 0,
                              }}
                            >
                              BRAND MAPPING <Required />
                            </Typography>
                            <Typography
                              variant="h6"
                              onClick={handleSelectAll}
                              sx={{
                                color: PRIMARY_BLUE2,
                                fontWeight: 700,
                                fontSize: "10px",
                                letterSpacing: "4%",
                                cursor: "pointer",
                                mr: 2,
                              }}
                            >
                              {selectedBrands.length === brandCheckList.length
                                ? "DESELECT ALL"
                                : "SELECT ALL"}
                            </Typography>
                          </Box>
                          {errors.brandMapping && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5, mb: 1, display: "block" }}
                            >
                              {errors.brandMapping}
                            </Typography>
                          )}

                          <Grid
                            container
                            spacing={1}
                            sx={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              pr: 1,
                            }}
                          >
                            {brandCheckList.map((brand) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={brand.competitionBrandID}
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Checkbox
                                  checked={selectedBrands.some(
                                    (b) =>
                                      b.competitionBrandID ===
                                      brand.competitionBrandID
                                  )}
                                  onChange={() => handleBrandSelection(brand)}
                                  sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <Typography
                                  sx={{
                                    color: selectedBrands.some(
                                      (b) =>
                                        b.competitionBrandID ===
                                        brand.competitionBrandID
                                    )
                                      ? WHITE
                                      : BLACK,
                                    backgroundColor: selectedBrands.some(
                                      (b) =>
                                        b.competitionBrandID ===
                                        brand.competitionBrandID
                                    )
                                      ? PRIMARY_BLUE
                                      : "transparent",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    width: "100%",
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {brand.competitionBrandName}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </NuralAccordion2>
                    {accordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1}>
                        {status && (
                          <Grid item xs={12}>
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
                        <Grid item xs={12} sm={6}>
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
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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

        <ViewCategory
          searchFormLoading={searchFormLoading}
          searchAccordionExpanded={searchAccordionExpanded}
          handleSearchAccordionChange={handleSearchAccordionChange}
          handleSearchCancel={handleSearchCancel}
          handleSearch={handleSearch}
          searchStatus={searchStatus}
          searchTitle={searchTitle}
          brandList={brandList}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
          brandCheckList={brandCheckList}
          setBrandCheckList={setBrandCheckList}
        />

        {tableVisible && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
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
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        zIndex: 1050,
                      }}
                    >
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography variant="body1" sx={headTitle}>
                            Category List
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
                        zIndex: 1000,
                        width: "50px",
                      }}
                    >
                      S.NO
                    </TableCell>
                    {[
                      {
                        label: "BRAND NAME",
                        key: "competitionBrandName",
                        sortable: true,
                      },
                      {
                        label: "CATEGORY NAME",
                        key: "competitionCategoryName",
                        sortable: true,
                      },
                      { label: "STATUS", key: "status", sortable: false },
                      { label: "EDIT", key: "edit", sortable: false },
                    ].map((header) => (
                      <TableCell
                        key={header.label}
                        onClick={() => header.sortable && handleSort(header.key)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: header.sortable ? "pointer" : "default",
                          position: "sticky",
                          top: "45px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1000,
                          minWidth: header.label === "EDIT" ? "60px" : "150px",
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{header.label}</Grid>
                          {header.sortable && (
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
                <TableBody>
                  {tableLoading || statusUpdateLoading ? (
                    <TableRowSkeleton
                      columns={5}
                      rows={10}
                      imagePath="./Icons/emptyFile.svg"
                      sx={{ height: "calc(100vh - 420px)" }}
                    />
                  ) : Array.isArray(filteredRows) && filteredRows.length > 0 ? (
                    filteredRows.map((row, index) => (
                      <TableRow
                        key={row.competitionCategoryID}
                        sx={{
                          fontSize: "10px",

                          "& td": { borderBottom: `1px solid #C6CEED` },
                        }}
                      >
                        <TableCell sx={{ ...rowstyle }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.competitionBrandName || "-"}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.competitionCategoryName || "-"}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={row.status}
                            onChange={(e) => handleStatus(row, e.target.checked)}
                            size="small"
                            disabled={
                              statusUpdateLoading &&
                              updatingRowId === row.competitionCategoryID
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
                          No categories found matching your criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <NuralPagination
                key={`pagination-${page}-${rowsPerPage}-${totalRecords}`}
                totalRecords={totalRecords}
                initialPage={page}
                initialRowsPerPage={rowsPerPage}
                onPaginationChange={handlePaginationChange}
              />
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
              title="Export"
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

export default Category;
