import {
  Grid,
  Typography,
  Button,
  Skeleton,
  FormHelperText,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
  SKELETON_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import Required from "../../../Common/Required";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
} from "../../../Common/commonstyles";
import {
  GetSalerseport,
  GetSalestype,
  Regionmasterlist,
  StateList,
} from "../../../Api/Api";
import { MenuConstants } from "../../../Common/MenuConstants";
import {
  getCurrentMonthFirstDate,
  getTodayDate,
} from "../../../Common/commonFunction";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import { useNavigate } from "react-router-dom";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const tabs = [
  { label: "Sales Report", value: "sale-report" },
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

const SaleReports = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [state, setState] = useState([]);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const [activeTab, setActiveTab] = React.useState("sale-report");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [salesType, setSalesType] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [region, setRegion] = useState([]);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [code, setcode] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "default",
  });

  const [searchParams, setSearchParams] = useState({
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
    withOrWithoutSerialBatch: 0,
    comingFrom: 0,
    cityId: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const serialTypeOptions = [
    { id: 0, name: "Without Serial" },
    { id: 1, name: "With Serial" },
  ];

  const [dateError, setDateError] = useState("");
  const [errors, setErrors] = useState({
    saleType: "",
    fromDate: "",
    toDate: "",
    serialType: "",
  });

  const [jumpPageInput, setJumpPageInput] = useState("");
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const handleStatus = (code, message) => {
    console.log("code", code);
    setStatusMessage(message);
    setcode(code);
    setShowStatus(true);
    if (code === 200) {
      setTimeout(() => setShowStatus(false), 5000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setDefaultLoading(true);
      setIsLoading(true);
      try {
        await Promise.all([fetchSalesType(), fetchRegion(), fetchState()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setDefaultLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch data when page or rowsPerPage changes
  useEffect(() => {
    if (page > 1 || rowsPerPage !== 10) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchState = async () => {
    setIsLoading(true);
    let body = {
      State: "",
      CountryID: 0,
      RegionID: 0,
      PageIndex: 1,
      PageSize: 10,
      StateID: 0,
      CallType: 1,
    };
    try {
      const response = await StateList(body);
      if (response.statusCode == 200) {
        setState(response.stateMasterList);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegion = async () => {
    setIsLoading(true);
    let body = {
      Region: "",
      CallType: 1,
      pageIndex: 1,
      pageSize: 10,
      CountryID: 0,
    };
    try {
      const response = await Regionmasterlist(body);
      if (response.statusCode == 200) {
        setRegion(response.regionMasterList);
      }
    } catch (error) {
      console.error("Error fetching region:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesType = async () => {
    setIsLoading(true);
    let body = {
      salesChannelTypeId: 0,
      hierarchyLevelID: 0,
    };
    try {
      const response = await GetSalestype(body);
      if (response.statusCode == 200) {
        setSalesType(response.saletypelist);
      }
    } catch (error) {
      console.error("Error fetching sales type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (field, value, selectedOption = null) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));

    switch (field) {
      case "salesType":
        setSelectedSaleType(selectedOption);
        break;
      case "stateId":
        setSelectedState(selectedOption);
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    setHasTriedSubmit(true);
    setShowStatus(false);
    setErrors({
      saleType: "",
      fromDate: "",
      toDate: "",
      serialType: "",
    });

    // Validate required fields
    let hasErrors = false;
    const newErrors = {
      saleType: "",
      fromDate: "",
      toDate: "",
      serialType: "",
    };

    if (!searchParams.datefrom || !searchParams.dateTo) {
      if (!searchParams.datefrom) {
        newErrors.fromDate = "From date is mandatory";
      }
      if (!searchParams.dateTo) {
        newErrors.toDate = "To date is mandatory";
      }
      hasErrors = true;
    }

    if (!selectedSaleType) {
      newErrors.saleType = "Sale type is mandatory";
      hasErrors = true;
    }

    if (dateError) {
      if (dateError.includes("From date")) {
        newErrors.fromDate = dateError;
      } else if (dateError.includes("To date")) {
        newErrors.toDate = dateError;
      }
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const formattedParams = {
      ...searchParams,
      pageIndex: page,
      pageSize: rowsPerPage,
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
      salesType: selectedSaleType?.salesTypeID || 1,
      stateId: selectedState?.stateID || 0,
      withOrWithoutSerialBatch: searchParams.withOrWithoutSerialBatch || 0,
    };

    try {
      let res = await GetSalerseport(formattedParams);
      if (res.statusCode == 200) {
        console.log("res", res);
        setTableData(res.salesReport || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setTableData([]);
        setTotalRecords(0);
        handleStatus(res.statusCode, res.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setTableData([]);
      setTotalRecords(0);
      handleStatus(
        error.response.data.status,
        MenuConstants.somethingWentWrong
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFromDateChange = (newValue) => {
    setDateError("");
    setErrors((prev) => ({ ...prev, fromDate: "", toDate: "" }));
    if (searchParams.dateTo && newValue > searchParams.dateTo) {
      setDateError("From date cannot be greater than To date");
      setErrors((prev) => ({
        ...prev,
        fromDate: "From date cannot be greater than To date",
      }));
      return;
    }
    handleSearchChange("datefrom", newValue);
  };

  const handleToDateChange = (newValue) => {
    setDateError("");
    setErrors((prev) => ({ ...prev, fromDate: "", toDate: "" }));
    if (searchParams.datefrom && newValue < searchParams.datefrom) {
      setDateError("To date cannot be less than From date");
      setErrors((prev) => ({
        ...prev,
        toDate: "To date cannot be less than From date",
      }));
      return;
    }
    handleSearchChange("dateTo", newValue);
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
    pageIndex: 1,
    pageSize: 10,
  };

  const handleCancel = () => {
    setSearchParams({
      ...initialSearchParams,
      withOrWithoutSerialBatch: 0,
    });
    setSelectedSaleType(null);
    setSelectedState(null);
    setDateError("");
    setStatusMessage("");
    setcode("");
    setShowStatus(false);
    setErrors({
      saleType: "",
      fromDate: "",
      toDate: "",
      serialType: "",
    });
    setTableData([]);
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const downloadExcel = async () => {
    setHasTriedSubmit(true);
    setShowStatus(false);
    // Validation: Sale type is required
    if (!selectedSaleType) {
      setErrors((prev) => ({ ...prev, saleType: "Sale type is mandatory" }));
      return;
    }
    let body = {
      ...searchParams,
      pageIndex: -1,
    };
    setIsDownloadLoading(true);
    try {
      let res = await GetSalerseport(body);
      if (res.statusCode == 200 && res.filepathlink) {
        window.location.href = res.filepathlink;
        handleStatus(res.statusCode, res.statusMessage);
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
      } else {
        handleStatus(res.statusCode, res.statusMessage);
      }
    } catch (error) {
      handleStatus(
        error.response.data.status || 500,
        error.response.data.statusMessage || "Internal server error"
      );
      console.log(error);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  // Pagination handlers
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1); // Reset to first page
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleFirstPage = () => setPage(1);
  const handleLastPage = () =>
    setPage(Math.max(1, Math.ceil(totalRecords / rowsPerPage)));

  // Sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc")
          return { key: null, direction: "default" };
        return { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortedData = () => {
    if (!sortConfig.key || sortConfig.direction === "default") return tableData;
    const sorted = [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortedTableData = getSortedData();

  // Define table columns for easier reference
  const tableColumns = [
    { id: "dateFrom", label: "DATE" },
    { id: "salesFromName", label: "FROM" },
    { id: "salesToName", label: "TO" },
    { id: "invoiceNo", label: "INVOICE NO" },
    { id: "invoiceDate", label: "INVOICE DATE" },
    { id: "modelName", label: "MODEL" },
    { id: "skuName", label: "SKU" },
    { id: "serialNumber", label: "SERIAL" },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        position: "relative",
        pr: { xs: 0, sm: 0, md: "240px", lg: "260px" },
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
        <Grid item xs={12} mt={0} mb={0} pr={2} ml={0}>
          <BreadcrumbsHeader pageTitle="Sales" />
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
        {defaultLoading ? (
          <FormSkeleton />
        ) : (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Sales Report "
                  backgroundColor={LIGHT_GRAY2}
                >
                  <>
                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 0, md: 0 },
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
                          SALE TYPE <Required />
                        </Typography>
                        <NuralAutocomplete
                          label="Sale Type"
                          options={salesType}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            option.salesTypeName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesTypeID === value?.salesTypeID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "salesType",
                              newValue?.salesTypeID || 1,
                              newValue
                            );
                            setErrors((prev) => ({ ...prev, saleType: "" }));
                          }}
                          value={
                            salesType.find(
                              (option) =>
                                option.salesTypeID === searchParams.salesType
                            ) || null
                          }
                          error={!!errors.saleType}
                        />
                        {errors.saleType && (
                          <FormHelperText
                            error
                            sx={{
                              marginLeft: 0,
                              fontSize: "10px",
                              marginTop: "4px",
                            }}
                          >
                            {errors.saleType}
                          </FormHelperText>
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
                              "stateId",
                              newValue?.stateID || 0,
                              newValue
                            );
                          }}
                          value={
                            state.find(
                              (option) =>
                                option.stateID === searchParams.stateId
                            ) || null
                          }
                          placeholder="SELECT"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          SERIAL TYPE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={serialTypeOptions}
                          placeholder="SELECT"
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "withOrWithoutSerialBatch",
                              newValue?.id || 0,
                              newValue
                            ) || 0;
                          }}
                          value={
                            serialTypeOptions.find(
                              (option) =>
                                option.id ===
                                searchParams.withOrWithoutSerialBatch
                            ) || 0
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 0, md: 0 },
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
                          FROM DATE <Required />
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.datefrom}
                          onChange={handleFromDateChange}
                          error={!!errors.fromDate}
                        />
                        {errors.fromDate && (
                          <FormHelperText
                            error
                            sx={{
                              marginLeft: 0,
                              fontSize: "10px",
                              marginTop: "4px",
                            }}
                          >
                            {errors.fromDate}
                          </FormHelperText>
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
                          TO DATE <Required />
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.dateTo}
                          onChange={handleToDateChange}
                          error={!!errors.toDate}
                        />
                        {errors.toDate && (
                          <FormHelperText
                            error
                            sx={{
                              marginLeft: 0,
                              fontSize: "10px",
                              marginTop: "4px",
                            }}
                          >
                            {errors.toDate}
                          </FormHelperText>
                        )}
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
                          onClick={handleCancel}
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
                          onClick={() => {
                            handleSearch();
                            setPage(1);
                            setRowsPerPage(10);
                            setSearchParams({
                              ...searchParams,
                              page: 1,
                              rowsPerPage: 10,
                            });
                          }}
                        >
                          SEARCH
                        </NuralTextButton>
                      </Grid>
                    </Grid>
                  </>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
        {showStatus && (
          <StatusModel width="100%" status={code} title={statusMessage} />
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        mt={0}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 10,
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
      {(isLoading || tableData.length > 0) && (
        <Grid item xs={12} mt={-4} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 50px)",
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
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
                  {tableColumns.map(({ id, label }) => (
                    <TableCell
                      key={id}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: "pointer",
                        position: "sticky",
                        top: "45px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 2,
                      }}
                      onClick={() => handleSort(id)}
                    >
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        wrap="nowrap"
                      >
                        <Grid item>{label}</Grid>
                        <Grid
                          item
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {sortConfig.key === id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : sortConfig.direction === "desc" ? (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <>
                                <ArrowUpwardIcon
                                  sx={{ fontSize: 12, color: "grey.400" }}
                                />
                                <ArrowDownwardIcon
                                  sx={{ fontSize: 12, color: "grey.400" }}
                                />
                              </>
                            )
                          ) : (
                            <>
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array(rowsPerPage)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton
                          key={index}
                          columns={tableColumns.length}
                        />
                      ))
                  : sortedTableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.dateFrom}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesFromName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.salesToName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.invoiceNo}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.invoiceDate}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.modelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.skuName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.serialNumber || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
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
                    color: page === 1 ? "grey.400" : PRIMARY_BLUE2,
                  }}
                  onClick={handleFirstPage}
                >
                  JUMP TO FIRST
                </Typography>
                <IconButton
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
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
                  onClick={() => setPage(page + 1)}
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
                    cursor: "pointer",
                    color:
                      page === Math.ceil(totalRecords / rowsPerPage)
                        ? "grey.400"
                        : PRIMARY_BLUE2,
                  }}
                  onClick={handleLastPage}
                  variant="body2"
                >
                  JUMP TO LAST
                </Typography>
                <input
                  type="number"
                  placeholder="Jump to page"
                  min={1}
                  max={Math.ceil(totalRecords / rowsPerPage)}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  style={jumpToPageStyle}
                />
                <Grid
                  mt={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    const pageValue = parseInt(jumpPageInput, 10);
                    if (
                      pageValue >= 1 &&
                      pageValue <= Math.ceil(totalRecords / rowsPerPage)
                    ) {
                      handleChangePage(pageValue);
                      setJumpPageInput("");
                    }
                  }}
                >
                  <img src="./Icons/footerSearch.svg" alt="arrow" />
                </Grid>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
};

export default SaleReports;
