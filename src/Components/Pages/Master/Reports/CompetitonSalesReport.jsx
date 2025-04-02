import { Grid, Typography, Button, Link } from "@mui/material";
import React, { useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
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
  TablePagination,
  IconButton,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import {
  GetCompetitionBrand,
  GetCompetitionCategoryData,
  GetCompetitionModelData,
  GetCompetitionSaleReport,
  ISPForBindDropDown,
} from "../../../Api/Api";
import { Skeleton } from "@mui/material";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";

const SKELETON_ROWS = 10;

const CompetitonSalesReport = () => {
  const [activeTab, setActiveTab] = React.useState("competition-sales-report");
  const [ispDropDown, setIspDropDown] = React.useState([]);
  const [competitionBrand, setCompetitionBrand] = React.useState([]);
  const [competitionModelData, setCompetitionModelData] = React.useState([]);
  const [competitionCategoryData, setCompetitionCategoryData] = React.useState(
    []
  );
  const [customPageInput, setCustomPageInput] = React.useState("");

  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState({
    brandId: 0,
    categoryId: 0,
    modelId: 0,
    dateFrom: "2024-12-01",
    dateTo: "2024-12-01",
    pageIndex: 1, //-1 = export to excel
    pageSize: 10,
    ispId: 0,
    retailerId: 0,
  });
  const tabs = [
    { label: "Competition Sales Report", value: "competition-sales-report" },
    // { label: "ISR Sales Report", value: "isr-sales-report" },
    // { label: "Unique Sales Report", value: "unique-sales-report" },
    // { label: "Primary to Tertiary Track", value: "primary-to-tertiary-track" },
    // { label: "Competition Sales Report", value: "competition-sales-report" },
  ];

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
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add this state near the top with other states
  const [showTable, setShowTable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Add loading states for dropdowns
  // Add this state to track total records
  const [totalRecords, setTotalRecords] = React.useState(0);

  useEffect(() => {
    setDefaultLoading(true);

    try {
      fetchISPForBindDropDown();
      fetchCompetitionBrand();
      handleSearch();
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setDefaultLoading(false);
      }, 2000);
    }
  }, []);

  const handleSearchChange = async (name, value) => {
    if (name === "brandId") {
      // Clear dependent fields when brand changes

      if (value) {
        try {
          let categoryBody = {
            brandId: value,
            dateFrom: null,
            dateTo: null,
            mode: 2,
            status: 0,
            pageIndex: 1,
            pageSize: 1000,
            categoryID: 0,
          };
          let res = await GetCompetitionCategoryData(categoryBody);
          if (res.statusCode == 200) {
            setCompetitionCategoryData(res.competitionCategoryDataList);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
          setCompetitionCategoryData([]);
        }
      } else {
       
        setSearchParams((prev) => ({
          ...prev,

          categoryId: 0,
          modelId: 0,
        }));

        setCompetitionModelData([]);
        setCompetitionCategoryData([]);
      }
    } else if (name === "categoryId") {
      // Clear model when category changes

      if (value) {
        try {
          let modelBody = {
            modelId: 0,
            brandId: searchParams.brandId,
            categoryId: value,
            dateFrom: null,
            dateTo: null,
            mode: 0,
            status: 0,
            pageIndex: 1,
            pageSize: 1000,
          };
          let res = await GetCompetitionModelData(modelBody);
          if (res.statusCode == 200) {
            setCompetitionModelData(res.competitionModelDataList);
          }
        } catch (error) {
          console.error("Error fetching models:", error);
          setCompetitionModelData([]);
        }
      } else {
        setSearchParams((prev) => ({
          ...prev,
          [name]: value,
          modelId: 0,
        }));
        setCompetitionModelData([]);
      }
    }

    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCompetitionBrand = async () => {
    let body = {
      dateFrom: null,
      dateTo: null,
      mode: 2,
      status: 0,
      pageIndex: 1,
      pageSize: 1000,
      brandId: 0,
    };
    try {
      let res = await GetCompetitionBrand(body);
      if (res.statusCode == 200) {
        setCompetitionBrand(res.competitionBrandList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchISPForBindDropDown = async () => {
    try {
      let res = await ISPForBindDropDown();
      if (res.statusCode == 200) {
        setIspDropDown(res.ispForBindDropDownMasterList);
      }
    } catch (error) {}
  };

  // Replace the existing generateDummyData function

  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      // Handle null/undefined values
      if (!a[getFieldName(columnName)]) return 1;
      if (!b[getFieldName(columnName)]) return -1;

      // Special handling for date sorting
      if (columnName === "saleDate") {
        const dateA = new Date(a.saleDate);
        const dateB = new Date(b.saleDate);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Handle numeric fields
      if (columnName === "quantity") {
        return direction === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }

      // Regular string sorting for other columns
      const aValue =
        a[getFieldName(columnName)]?.toString().toLowerCase() || "";
      const bValue =
        b[getFieldName(columnName)]?.toString().toLowerCase() || "";

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRows(sortedRows);
  };

  // Helper function to map column names to API field names
  const getFieldName = (columnName) => {
    const fieldMap = {
      ispname: "ispName",
      retailer: "retailerName",
      brand: "brandName",
      category: "categoryName",
      model: "modelName",
      priceband: "priceBandName",
      quantity: "quantity",
      saledate: "saleDate",
    };
    return fieldMap[columnName.toLowerCase()] || columnName;
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await fetchTableData({
      ...searchParams,
      pageIndex: newPage + 1, // Add 1 since API uses 1-based indexing
      pageSize: rowsPerPage,
    });
  };

  const handleJumpToFirst = async () => {
    setPage(0);
    await fetchTableData({
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    });
  };

  const handleJumpToLast = async () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    if (lastPage >= 0) {
      setPage(lastPage);
      await fetchTableData({
        ...searchParams,
        pageIndex: lastPage + 1,
        pageSize: rowsPerPage,
      });
    }
  };

  const handleCustomPageInputChange = (e) => {
    setCustomPageInput(e.target.value);
  };

  // Add handler for custom page input keypress
  const handleCustomPageKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePageSearch();
    }
  };

  const fetchTableData = async (params) => {
    setIsLoading(true);
    try {
      const updatedParams = {
        ...searchParams,
        pageIndex: params.pageIndex, // Don't add 1 here since it's handled in calling functions
        pageSize: params.pageSize,
      };

      let res = await GetCompetitionSaleReport(updatedParams);
      if (res.statusCode == 200) {
        setFilteredRows(res.competitionSaleReportList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchPageData(0, newRowsPerPage);
  };

  // Modify fetchPageData to handle total records
  const fetchPageData = async (pageNumber, pageSize) => {
    setIsLoading(true);
    try {
      const updatedParams = {
        ...searchParams,
        pageIndex: pageNumber + 1, // API expects 1-based index
        pageSize: pageSize,
      };

      let res = await GetCompetitionSaleReport(updatedParams);
      if (res.statusCode == 200) {
        setFilteredRows(res.competitionSaleReportList || []);

        setTotalRecords(res.totalRecords || 0); // Update total records from API
      } else {
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these navigation functions
  const handleFirstPage = () => {
    setPage(0);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  };

  const handleLastPage = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage) - 1;
    setPage(lastPage);
    setSearchParams((prev) => ({
      ...prev,
      pageIndex: lastPage + 1,
    }));
  };

  const handleJumpToPage = (pageNumber) => {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      setSearchParams((prev) => ({
        ...prev,
        pageIndex: pageNumber,
      }));
    }
  };

  // Update handleSearch to set total records
  const handleSearch = async () => {
    console.log("handleSearch", searchParams);
    setIsLoading(true);
    setShowTable(true);
    setPage(0); // Reset to first page
    setRowsPerPage(10);
    try {
      const searchParamsWithPagination = {
        ...searchParams,
        pageIndex: 1, // Always start from page 1 on new search
        pageSize: 10,
      };

      let res = await GetCompetitionSaleReport(searchParamsWithPagination);
      if (res.statusCode == 200) {
        setFilteredRows(res.competitionSaleReportList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setFilteredRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    // Reset search params first
    setSearchParams({
      brandId: 0,
      categoryId: 0,
      modelId: 0,
      dateFrom: "2024-12-01",
      dateTo: "2024-12-02",
      pageIndex: 1,
      pageSize: 10,
      ispId: 0,
      retailerId: 0,
    });

    // Clear all dropdown data
    setCompetitionBrand([]);
    setCompetitionCategoryData([]);
    setCompetitionModelData([]);

    // Reset table related states
    setFilteredRows([]);
    setShowTable(false);
    setPage(0);
    setSortConfig({ key: null, direction: null });

    // Fetch initial brand data again
    await fetchCompetitionBrand();

    // Finally perform the search with reset params
    await handleSearch();
  };

  const handlePageSearch = async () => {
    const pageNumber = parseInt(customPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      const newPage = pageNumber - 1; // Convert to 0-based for internal state
      setPage(newPage);
      await fetchTableData({
        ...searchParams,
        pageIndex: pageNumber, // Use pageNumber directly for API (1-based)
        pageSize: rowsPerPage,
      });
      setCustomPageInput(""); // Clear input after successful search
    }
  };

  // Replace the existing TableSkeleton component with this enhanced version

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
          <BreadcrumbsHeader pageTitle="Report" />
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
      {defaultLoading ? (
        <FormSkeleton />
      ) : (
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
                  title="Competition Sales Report"
                  backgroundColor={LIGHT_GRAY2}
                >
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ISP
                      </Typography>
                      <NuralAutocomplete
                        label="Isp"
                        options={ispDropDown}
                        getOptionLabel={(option) => option.ispName}
                        onChange={(event, newValue) => {
                          handleSearchChange("ispId", newValue?.ispID || 0);
                        }}
                        value={ispDropDown.find(
                          (isp) => isp.ispID === searchParams.ispId
                        ) || null}
                        placeholder="SELECT"
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        BRAND
                      </Typography>

                      <NuralAutocomplete
                        label="Brand"
                        options={competitionBrand}
                        getOptionLabel={(option) => option.competitionBrandName}
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "brandId",
                            newValue?.competitionBrandID || 0
                          );
                        }}
                        value={competitionBrand.find(
                          (brand) =>
                            brand.competitionBrandID === searchParams.brandId
                        ) || null}
                        placeholder="SELECT"
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        CATEGORY
                      </Typography>

                      <NuralAutocomplete
                        width="100%"
                        label="Category"
                        options={competitionCategoryData}
                        getOptionLabel={(option) => option.category}
                        placeholder="SELECT"
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "categoryId",
                            newValue?.categoryId || 0
                          );
                        }}
                        value={competitionCategoryData.find(
                          (category) =>
                            category.categoryId === searchParams.categoryId
                        ) || null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        MODEL
                      </Typography>

                      <NuralAutocomplete
                        width="100%"
                        label="Model"
                        options={competitionModelData}
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "modelId",
                            newValue?.competitionModelId || 0
                          );
                        }}
                        value={competitionModelData.find(
                          (model) =>
                            model.competitionModelId === searchParams.modelId
                        )}
                        getOptionLabel={(option) => option.competitionModelName}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>

                  {/* Second Row */}

                  {/* Third Row - Buttons */}
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
                        onClick={handleReset}
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
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Add this after the NuralAccordion2 component */}
      {
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 320px)",
              overflow: "auto",
              position: "relative",
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={11}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1100,
                      borderBottom: "none",
                      boxShadow: "0 2px 2px rgba(0,0,0,0.05)", // Add subtle shadow
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
                  <TableCell
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                      width: "60px",
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                    </Grid>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("saleDate")}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: "pointer",
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>SALE DATE</Grid>
                      <Grid item>
                        {sortConfig.key === "saleDate" ? (
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
                    </Grid>
                  </TableCell>
                  {[
                    "ISPNAME",
                    "RETAILER",
                    "BRAND",
                    "CATEGORY",
                    "MODEL",
                    "PRICE BAND",
                    "QUANTITY",
                  ].map((header, index) => (
                    <TableCell
                      key={header}
                      onClick={() =>
                        handleSort(header.toLowerCase().replace(" ", ""))
                      }
                      sx={{
                        ...tableHeaderStyle,
                        cursor: "pointer",
                        position: "sticky",
                        top: "45px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1000,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{header}</Grid>
                        <Grid item>
                          {sortConfig.key ===
                          header.toLowerCase().replace(" ", "") ? (
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
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array(SKELETON_ROWS)
                    .fill(null)
                    .map((_, index) => (
                      <TableRowSkeleton key={index} columns={9} />
                    ))
                ) : filteredRows.length > 0 && (
                  filteredRows
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id} sx={{ fontSize: "10px" }}>
                        <TableCell
                          sx={{
                            padding: "8px",
                            fontSize: "10px",
                            width: "60px",
                            textAlign: "center",
                          }}
                        >
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.saleDate}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.ispName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.retailerName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.brandName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.categoryName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.modelName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.priceBandName}
                        </TableCell>
                        <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                          {row.quantity}
                        </TableCell>
                      </TableRow>
                    ))
                ) }
              </TableBody>
            </Table>

            <Grid
              container
              sx={{
                p: 1,
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                bottom: 0,
                backgroundColor: LIGHT_GRAY2,
                zIndex: 1000,
              }}
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
                    {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)}{" "}
                    PAGES
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
                    //   gap: 1,
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
                          // border: `1px solid ${PRIMARY_BLUE2}`,
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
                  onClick={() => handleChangePage(null, page - 1)}
                  disabled={page === 0}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  PAGE {page + 1}
                </Typography>

                <IconButton
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangePage(null, page + 1)}
                  disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
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
                  onClick={handleJumpToLast}
                  variant="body2"
                >
                  JUMP TO LAST
                </Typography>
                <input
                  type="number"
                  placeholder="JUMP TO PAGE"
                  min={1}
                  max={Math.ceil(totalRecords / rowsPerPage)}
                  value={customPageInput}
                  onChange={handleCustomPageInputChange}
                  onKeyPress={handleCustomPageKeyPress}
                  style={{
                    width: "100px",
                    height: "24px",
                    fontSize: "8px",
                    paddingRight: "8px",
                    paddingLeft: "8px",
                    textAlign: "center",
                    borderRadius: "8px",
                    borderWidth: "1px",
                    border: `1px solid ${PRIMARY_BLUE2}`,
                    backgroundColor: LIGHT_GRAY2,
                    "&::placeholder": {},
                  }}
                />
                <Grid mt={1} onClick={handlePageSearch}>
                  <img
                    src="./Icons/footerSearch.svg"
                    style={{ cursor: "pointer" }}
                    alt="arrow"
                  />
                </Grid>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>
      }
    </Grid>
  );
};

export default CompetitonSalesReport;
