import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
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
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import {
  GetStateListForDropdown,
  ISPForBindDropDown,
  GetCityListForDropdown,
  GetSKUListForDropdown,
  GetISPSaleReport,
} from "../../../Api/Api";
import {
  getCurrentMonthFirstDate,
  getTodayDate,
} from "../../../Common/commonFunction";
import StatusModel from "../../../Common/StatusModel";
// import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const IspSaleReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("isp-sales-report");
  const [ispName, setIspName] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [productSkuCode, setProductSkuCode] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [code, setcode] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [totalrecords, setTotalrecords] = useState(0);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [dateError, setDateError] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    ispId: 0,
    datefrom: getCurrentMonthFirstDate(),
    dateTo: getTodayDate(),
    salesChannelID: 0,
    stateID: 0,
    cityID: 0,
    skuID: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [hasSearched, setHasSearched] = useState(false);

  console.log("searchParams", searchParams);
  console.log("tableData", tableData);
  const handleStatus = (code, message) => {
    console.log("code", code);
    setStatusMessage(message);
    setcode(code);
    setShowStatus(true);
    // setTimeout(() => setShowStatus(false), 3000);
  };

  const handleFromDateChange = (newValue) => {
    console.log("newValue", newValue);
    setDateError("");
    if (searchParams.dateTo && newValue > searchParams.dateTo) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    handleSearchChange("datefrom", newValue);
  };

  const handleToDateChange = (newValue) => {
    setDateError("");
    if (searchParams.datefrom && newValue < searchParams.datefrom) {
      setDateError("To date cannot be less than From date");
      return;
    }
    handleSearchChange("dateTo", newValue);
  };

  const tabs = [
    { label: "Sales Report", value: "sales-report" },
    { label: "ISP Sales Report", value: "isp-sales-report" },
    { label: "Unique Sales Report", value: "unique-sales-report" },
    { label: "Primary to Tertiary Track", value: "primary-to-tertiary" },
    { label: "Competition Sales Report", value: "competition-sales-report" },
  ];

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

  // Replace the existing dummy data with this more realistic data
  // const generateDummyData = () => {
  //   const regions = ["North", "South", "East", "West", "Central"];
  //   const states = [
  //     "Maharashtra",
  //     "Gujarat",
  //     "Karnataka",
  //     "Tamil Nadu",
  //     "Delhi",
  //   ];
  //   const saleTypes = ["Direct", "Distributor", "Online", "Retail"];
  //   const serialTypes = ["A123", "B456", "C789", "D012", "E345"];

  //   return Array(50)
  //     .fill()
  //     .map((_, index) => ({
  //       id: `${1000 + index}`,
  //       column1: saleTypes[Math.floor(Math.random() * saleTypes.length)],
  //       column2: regions[Math.floor(Math.random() * regions.length)],
  //       column3: states[Math.floor(Math.random() * states.length)],
  //       column4: new Date(
  //         2024,
  //         Math.floor(Math.random() * 12),
  //         Math.floor(Math.random() * 28) + 1
  //       ).toLocaleDateString(),
  //       column5: Math.floor(Math.random() * 10000000),
  //       column6: serialTypes[Math.floor(Math.random() * serialTypes.length)],
  //       column7: `Product-${Math.floor(Math.random() * 100)}`,
  //       column8: Math.floor(Math.random() * 100),
  //       column9: `Status-${Math.floor(Math.random() * 3)}`,
  //     }));
  // };

  // const [rows, setRows] = React.useState(generateDummyData());
  // const [filteredRows, setFilteredRows] = React.useState(rows);

  const fetchReportData = useCallback(
    async (paramsToUse) => {
      const currentParams = paramsToUse || searchParams;
      if (!currentParams.datefrom || !currentParams.dateTo) {
        console.log("Skipping fetch: Dates not set");
        return;
      }
      setIsLoading(true);
      setShowTable(true);
      setShowStatus(false);

      const formattedParams = {
        ...currentParams,
        datefrom: currentParams.datefrom
          ? new Date(currentParams.datefrom.setHours(12, 0, 0, 0))
              .toISOString()
              .split("T")[0]
          : null,
        dateTo: currentParams.dateTo
          ? new Date(currentParams.dateTo.setHours(12, 0, 0, 0))
              .toISOString()
              .split("T")[0]
          : null,
      };

      console.log("Fetching data with params:", formattedParams);

      try {
        let res = await GetISPSaleReport(formattedParams);
        console.log("API Response:", res);
        if (res.statusCode == 200) {
          if (!res.ispsalelists || res.ispsalelists.length === 0) {
            handleStatus(400, "No data found for the selected criteria");
            setTableData([]);
            setTotalrecords(0);
          } else {
            setTableData(res.ispsalelists);
            setTotalrecords(res.totalrecords || 0);
            setShowStatus(false);
          }
        } else {
          handleStatus(
            res.statusCode || 400,
            res.message || "Error fetching data"
          );
          setTableData([]);
          setTotalrecords(0);
        }
      } catch (error) {
        console.error("Error fetching ISP Sale Report:", error);
        handleStatus(400, "An error occurred while fetching data.");
        setTableData([]);
        setTotalrecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    if (hasSearched) {
      console.log("useEffect triggered by pageIndex/pageSize change");
      fetchReportData();
    }
  }, [
    searchParams.pageIndex,
    searchParams.pageSize,
    hasSearched,
    fetchReportData,
  ]);

  const handleChangePage = (event, newPageOneBased) => {
    console.log(
      "handleChangePage called with newPageOneBased:",
      newPageOneBased
    );
    if (searchParams.pageIndex === newPageOneBased) return;

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: newPageOneBased,
    }));
  };

  const handleChangeRowsPerPage = (value) => {
    console.log("handleChangeRowsPerPage called with value:", value);
    if (searchParams.pageSize === value) return;

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
      pageSize: value,
    }));
  };

  const handleJumpToFirst = () => {
    console.log("handleJumpToFirst called");
    if (searchParams.pageIndex === 1) return;

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: 1,
    }));
  };

  const handleJumpToLast = () => {
    console.log("handleJumpToLast called");
    const lastPage = Math.ceil(totalrecords / searchParams.pageSize);
    if (searchParams.pageIndex === lastPage || lastPage === 0) return;

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: lastPage,
    }));
  };

  const [jumpToPageInput, setJumpToPageInput] = useState("");

  const handleJumpToPage = (inputPage) => {
    const pageNumber = parseInt(inputPage, 10);
    const totalPages = Math.ceil(totalrecords / searchParams.pageSize);

    if (
      isNaN(pageNumber) ||
      pageNumber <= 0 ||
      pageNumber > totalPages ||
      pageNumber === searchParams.pageIndex
    ) {
      console.log("Invalid page number:", inputPage);
      setJumpToPageInput("");
      return;
    }
    console.log("handleJumpToPage called with pageNumber:", pageNumber);

    setSearchParams((prev) => ({
      ...prev,
      pageIndex: pageNumber,
    }));
    setJumpToPageInput("");
  };

  const handleSearchIconClick = () => {
    if (jumpToPageInput) {
      handleJumpToPage(jumpToPageInput);
    }
  };

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
  };

  const handleSearch = () => {
    console.log("handleSearch called");
    const newParams = { ...searchParams, pageIndex: 1 };
    setSearchParams(newParams);
    setHasSearched(true);
    fetchReportData(newParams);
  };

  const handleExportToExcel = async () => {
    setIsLoading(true);
    setIsDownloadLoading(true);
    const formattedParams = {
      ...searchParams,
      pageIndex: -1,
      datefrom: searchParams.datefrom
        ? new Date(searchParams.datefrom.setHours(12, 0, 0, 0))
            .toISOString()
            .split("T")[0]
        : null,
      dateTo: searchParams.dateTo
        ? new Date(searchParams.dateTo.setHours(12, 0, 0, 0))
            .toISOString()
            .split("T")[0]
        : null,
    };

    try {
      let res = await GetISPSaleReport(formattedParams);
      if (res.statusCode == 200 && res.filepathlink) {
        window.location.href = res.filepathlink;
      } else {
        handleStatus(400, res.message || "Could not generate export file.");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      handleStatus(400, "An error occurred during export.");
    } finally {
      setIsLoading(false);
      setIsDownloadLoading(false);
    }
  };

  const initialSearchParams = {
    datefrom: getCurrentMonthFirstDate(),
    dateTo: getTodayDate(),
    salesChannelID: 0,
    salesType: 0,
    filepath: "",
    modelId: 0,
    skuId: 0,
    stateId: 0,
    productCategoryId: 0,
    orgnHierarchyId: 0,
    wantZeroQuantity: 0,
    withOrWithoutSerialBatch: null,
    comingFrom: 0,
    cityId: 0,
  };

  const handleReset = () => {
    setSearchParams(initialSearchParams);
    setDateError("");
    setStatusMessage("");
    setcode("");
    setShowStatus(false);
    setShowTable(false);
    setTableData([]);
  };

  const handleSearchChange = (field, value, newvalue) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const fetchIspName = async () => {
    try {
      const response = await ISPForBindDropDown();
      if (response.statusCode == 200) {
        setIspName(response.ispForBindDropDownMasterList);
      }
    } catch (error) {
      console.error("Error fetching ISP Name:", error);
    }
  };

  const ispStateListDropDown = async () => {
    let body = {
      CountryID: 1,
      RegionID: 0,
      stateID: 0,
    };

    try {
      const response = await GetStateListForDropdown(body);
      if (response.statusCode == 200) {
        setState(response.stateDropdownList);
        console.log(response, "response");
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const ispCityListDropDown = async () => {
    try {
      let body = {
        searchConditions: 1,
        stateID: 0,
        cityID: 0,
      };
      const response = await GetCityListForDropdown(body);
      if (response.statusCode == 200) {
        setCity(response.cityDropdownList);
        console.log("city", response);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  const ispProductDropDown = async () => {
    try {
      let body = {
        skuID: 0,
        categoryID: 0,
        modelID: 0,
        subCategoryID: 0,
        brandID: 0,
      };
      const response = await GetSKUListForDropdown(body);
      if (response.statusCode == 200) {
        setProductSkuCode(response.skuDropdownList);
        console.log("city", response);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  useEffect(() => {
    fetchIspName();
    ispStateListDropDown();
    ispCityListDropDown();
    ispProductDropDown();
  }, []);

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
        <Grid item xs={12} mt={1} mb={0} ml={1} pr={2}>
          <BreadcrumbsHeader pageTitle="Sales" />
        </Grid>

        <Grid item xs={12} ml={1}>
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
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Sale Report"
                backgroundColor={LIGHT_GRAY2}
              >
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
                      ISP
                    </Typography>

                    <NuralAutocomplete
                      label="ISP Name"
                      options={ispName}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.ispName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.ispID === value?.ispID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("ispId", newValue?.ispID || null);
                      }}
                      value={
                        ispName.find(
                          (option) => option.ispID === searchParams.ispId
                        ) || null
                      }
                    />
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
                      FROM DATE
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.datefrom}
                      onChange={handleFromDateChange}
                      error={!!dateError}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={400}
                    >
                      TO DATE
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MM/YYYY"
                      value={searchParams.dateTo}
                      onChange={handleToDateChange}
                      error={!!dateError}
                    />
                  </Grid>
                </Grid>

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
                      fontWeight={400}
                    >
                      STATE
                    </Typography>

                    <NuralAutocomplete
                      width="100%"
                      label="State"
                      options={state}
                      getOptionLabel={(option) => option.stateName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.stateID === value?.stateID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "stateID",
                          newValue?.stateID || 0,
                          newValue
                        );
                      }}
                      value={
                        state.find(
                          (option) => option.stateID === searchParams.stateID
                        ) || null
                      }
                      placeholder="SELECT"
                    />
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
                      CITY
                    </Typography>

                    <NuralAutocomplete
                      width="100%"
                      label="City"
                      options={city}
                      getOptionLabel={(option) => option.cityName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.cityID === value?.cityID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "cityID",
                          newValue?.cityID || 0,
                          newValue
                        );
                      }}
                      value={
                        city.find(
                          (option) => option.cityID === searchParams.cityID
                        ) || null
                      }
                      placeholder="SELECT"
                    />
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
                      PRODUCT
                    </Typography>

                    <NuralAutocomplete
                      width="100%"
                      label="Product"
                      options={productSkuCode}
                      getOptionLabel={(option) => option.skuCode || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.skuID === value?.skuID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "skuID",
                          newValue?.skuID || 0,
                          newValue
                        );
                      }}
                      value={
                        productSkuCode.find(
                          (option) => option.skuID === searchParams.skuID
                        ) || null
                      }
                      placeholder="SELECT"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
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
                  <Grid item xs={12} sm={9} md={11}>
                    <NuralTextButton
                      icon={"./Icons/searchIcon.svg"}
                      iconPosition="right"
                      height="36px"
                      backgroundColor={PRIMARY_BLUE2}
                      color="#fff"
                      width="100%"
                      fontSize="12px"
                      onClick={() => {
                        if (dateError) {
                          handleStatus(400, dateError);
                          return;
                        }
                        handleSearch();
                      }}
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
      {!showStatus ? (
        <>
          {showTable && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: PRIMARY_BLUE2,
                  maxHeight: "calc(100vh - 320px)",
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
                        colSpan={10}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          position: "sticky",
                          top: 0,
                          zIndex: 1100,
                          borderBottom: "none",
                          boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
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
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>S.NO</Grid>
                        </Grid>
                      </TableCell>
                      {[
                        "SALE DATE",
                        "ISP NAME",
                        "RETAILER",
                        "MODEL",
                        "PRODUCT",
                        "SERIAL NO.",
                        "QUANTITY",
                        "PRICE",
                        "STATUS",
                      ].map((header, index) => (
                        <TableCell
                          key={`column${index + 1}`}
                          onClick={() => handleSort(`column${index + 1}`)}
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
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {sortConfig.key === `column${index + 1}` ? (
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
                  {isLoading ? (
                    Array.from({ length: searchParams.pageSize }).map(
                      (_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          {Array.from({ length: 10 }).map((_, cellIndex) => (
                            <TableCell key={`skeleton-cell-${cellIndex}`}>
                              <Skeleton animation="wave" height={20} />
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={row.ispID}>
                          <TableCell
                            sx={{
                              ...rowstyle,
                              color: PRIMARY_BLUE2,
                              fontWeight: 600,
                            }}
                          >
                            {row.sNo}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.saleDate}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.ispName}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.retailer}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.model}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.product}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.serialNo}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.quantity}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.price.toLocaleString()}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.saleStatus}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>

                <Grid
                  container
                  sx={{
                    p: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: LIGHT_GRAY2,
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
                        {totalrecords} /{" "}
                        {Math.ceil(totalrecords / searchParams.pageSize) || 0}{" "}
                        PAGES
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "10px",
                            color: PRIMARY_BLUE2,
                            fontWeight: 600,
                          }}
                        >
                          SHOW :
                        </Typography>
                      </Grid>
                      {[10, 25, 50, 100].map((value) => (
                        <Grid item key={value}>
                          <Button
                            onClick={() => handleChangeRowsPerPage(value)}
                            sx={{
                              minWidth: "30px",
                              height: "24px",
                              padding: "4px 8px",
                              borderRadius: "50%",
                              backgroundColor:
                                searchParams.pageSize === value
                                  ? PRIMARY_BLUE2
                                  : "transparent",
                              color:
                                searchParams.pageSize === value
                                  ? "#fff"
                                  : PRIMARY_BLUE2,
                              fontSize: "12px",
                              "&:hover": {
                                backgroundColor:
                                  searchParams.pageSize === value
                                    ? PRIMARY_BLUE2
                                    : "transparent",
                              },
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
                      gap: 1,
                      outline: "none",
                    }}
                  >
                    <Button
                      onClick={handleJumpToFirst}
                      disabled={isLoading || searchParams.pageIndex === 1}
                      sx={{
                        color: PRIMARY_BLUE2,
                        textTransform: "none",
                        fontSize: "10px",
                        fontWeight: 700,
                        ":focus": {
                          outline: "none",
                        },
                      }}
                    >
                      JUMP TO FIRST
                    </Button>

                    <IconButton
                      onClick={() =>
                        handleChangePage(null, searchParams.pageIndex - 1)
                      }
                      disabled={isLoading || searchParams.pageIndex === 1}
                      sx={{
                        color: PRIMARY_BLUE2,
                        ":focus": {
                          outline: "none",
                        },
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: PRIMARY_BLUE2,
                        ":focus": {
                          outline: "none",
                        },
                      }}
                    >
                      PAGE {searchParams.pageIndex}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handleChangePage(null, searchParams.pageIndex + 1)
                      }
                      disabled={
                        isLoading ||
                        searchParams.pageIndex >=
                          Math.ceil(totalrecords / searchParams.pageSize)
                      }
                      sx={{
                        color: PRIMARY_BLUE2,
                        ":focus": {
                          outline: "none",
                        },
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>

                    <Button
                      onClick={handleJumpToLast}
                      disabled={
                        isLoading ||
                        searchParams.pageIndex ===
                          Math.ceil(totalrecords / searchParams.pageSize) ||
                        totalrecords === 0
                      }
                      sx={{
                        color: PRIMARY_BLUE2,
                        textTransform: "none",
                        fontSize: "10px",
                        fontWeight: 700,
                        ":focus": {
                          outline: "none",
                        },
                        opacity: isLoading ? 0.5 : 1,
                        pointerEvents: isLoading ? "none" : "auto",
                      }}
                    >
                      {isLoading ? "Loading..." : "JUMP TO LAST"}
                    </Button>

                    <input
                      type="text"
                      placeholder="JUMP TO PAGE"
                      value={jumpToPageInput}
                      onChange={(e) => setJumpToPageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleJumpToPage(jumpToPageInput);
                        }
                      }}
                      style={{
                        width: "100px",
                        height: "24px",
                        padding: "0 8px",
                        borderRadius: "4px",
                        border: `1px solid ${PRIMARY_BLUE2}`,
                        backgroundColor: "#F8F9FD",
                        fontSize: "10px",
                        outline: "none",
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                    />
                    <Grid mt={1}>
                      <img
                        src="./Icons/footerSearch.svg"
                        style={{ cursor: "pointer" }}
                        alt="arrow"
                        onClick={handleSearchIconClick}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </TableContainer>
            </Grid>
          )}
        </>
      ) : (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <StatusModel width="100%" status={code} title={statusMessage} />
        </Grid>
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
              downloadExcel={handleExportToExcel}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </Grid>
  );
};

export default IspSaleReport;
