import { Grid, Typography, Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { tableHeaderStyle } from "../../../Common/commonstyles";
import { fetchCounterShareReport, fetchISPList } from "../../../Api/Api";
import NuralMonth from "../../NuralCustomComponents/NuralMonth";
import NuralYear from "../../NuralCustomComponents/NuralYear";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TableRowSkeleton, FormSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";

const SKELETON_ROWS = 10;

// Replace the modal component with an inline chart component
const ASPTrendChart = ({ priceBand, trends }) => {
  // Sample data for the trend chart
  const trendData = trends.map(item => ({
    month: item.MonthName,
    value: item.ValuePercent
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: AQUA,
            p: 1,
            borderRadius: "8px",
            minWidth: "120px",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "14px" }}>{`${label}`}</Typography>
          <Typography
            sx={{
              color: "#0747A6",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            ₹{payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Grid
      container
      sx={{
        backgroundColor: "#E2E7F6",
        borderRadius: "8px",
        p: 3,
        mt: 2,
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: PRIMARY_BLUE2,
            fontSize: "18px",
          }}
        >
          Month-wise counter share [{priceBand}]
        </Typography>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              tick={{ fill: DARK_PURPLE }}
              tickLine={{ stroke: DARK_PURPLE }}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000}K`}
              tick={{ fill: DARK_PURPLE }}
              tickLine={{ stroke: DARK_PURPLE }}
              domain={[0, 16000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C6CEED"
              strokeWidth={1}
              // dot={{
              //   fill: AQUA,
              //   stroke: AQUA,
              //   r: 6
              // }}
              activeDot={{
                fill: AQUA,
                stroke: AQUA,
                r: 8,
              }}
              label={({ x, y, value, index }) => {
                // Only show label for the specific data point (March 2024)
                // if (index === 0) {
                //   return (
                //     <g>
                //       <rect x={x-40} y={y-60} width={80} height={40} rx={20} fill={AQUA} />
                //       <text x={x} y={y-38} textAnchor="middle" fill="white" fontSize={12}>
                //         16/03/24
                //       </text>
                //       <text x={x} y={y-22} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">
                //         ₹{value}
                //       </text>
                //       <line x1={x} y1={y-20} x2={x} y2={y-5} stroke={AQUA} strokeWidth={2} />
                //     </g>
                //   );
                // }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
};

const CounterShareReport = () => {
  const [activeTab, setActiveTab] = useState("counter-share-report");
  const tabs = [
    { label: "Counter Share Report", value: "counter-share-report" },
    // { label: "ISR Sales Report", value: "isr-sales-report" },
    // { label: "Unique Sales Report", value: "unique-sales-report" },
    // { label: "Primary to Tertiary Track", value: "primary-to-tertiary-track" },
    // { label: "Competition Sales Report", value: "competition-sales-report" },
  ];
  const [ispList, setIspList] = useState([]);
  const [trends, setTrends] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  // Add new state for the chart visibility
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [selectedPriceBand, setSelectedPriceBand] = useState("");

  // Add state for error model visibility
  const [showErrorModel, setShowErrorModel] = useState(false);

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({
    filterEntityID: 0, //"ISPID"
    filterEntityTypeID: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // getMonth() returns 0-11
    valueType: 1 /*1=value,2=percenntage*/,
    priceBandID: 0,
    callType: 1 /*-1 for excel export*/,
  });
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  // Add these states for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  // Add new state variables
  const [yearError, setYearError] = useState("");
  const [monthError, setMonthError] = useState("");

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        setTableData([...tableData]); // Reset to original order
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

    setTableData(sortedRows);
  };

  // Update the handleSearch function
  const handleSearch = (searchValues) => {
    const filtered = tableData.filter((row) => {
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

    setTableData(filtered);
    setPage(0);
  };

  const handleSearchChange = (field, value) => {
    // Update search params for the counter share report
    const updatedParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedParams);

    // Get report with updated params
    // getCounterShareReport(updatedParams);
  };
  // Update the handleSearchClick function
  const handleSearchClick = () => {
    setStatus(false);
    setTitle("");
    let isValid = true;

    // Validate Year
    if (!searchParams.year || searchParams.year === 0) {
      setYearError("Year is required");
      isValid = false;
    }

    // Validate Month
    if (!searchParams.month || searchParams.month === 0) {
      setMonthError("Month is required");
      isValid = false;
    }

    if (!isValid) return;

    setSearchClicked(true);
    getCounterShareReport(searchParams, true);
  };

  const handleReset = () => {
    setSearchClicked(false);
    setStatus(false);
    setTitle("");
    // Reset all filters
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset search params to default
    setSearchParams({
      filterEntityID: 0,
      filterEntityTypeID: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      valueType: 1,
      priceBandID: 0,
      callType: 1,
    });

    // Fetch data again with default params
    getCounterShareReport();
    setPage(0);
    setSortConfig({ key: null, direction: null });
  };

  const getISPList = async () => {
    try {
      setDefaultLoading(true);
      const response = await fetchISPList();
      if (response.statusCode == 200) {
        setIspList(response.ispForBindDropDownMasterList);
          setTrends(response.monthList)
      }
      setLoading(false);
    } catch (error) {
      console.log("error in fetching isp list", error);
    } finally {
      setDefaultLoading(false);
    }
  };

  const getCounterShareReport = async (params = searchParams) => {
    try {
      setLoadingTable(true);
      console.log("Sending params:", params);
      const response = await fetchCounterShareReport(params);
      console.log("API Response:", response);
      if (response.statusCode == 200) {
        if (response.counterShareReportList.length == 0) {
          setStatus(400);
          setTitle("No Data Found");
          setSearchClicked(false);
        }

        console.log(
          "Counter share report data:",
          response.counterShareReportList
        );
        setTableData(response.counterShareReportList || []);
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus(error.statusCode);
      setTitle(error.statusMessage);
      setError(error);
      setTableData([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const ValueTypeList = [
    { label: "Value", value: 1 },
    { label: "Percentage", value: 2 },
  ];

  const [defaultLoading, setDefaultLoading] = useState(true);


  
  useEffect(() => {
    getISPList();
  }, []);

  // Add handler for View button click
  const handleViewTrend = (priceBand) => {
    setSelectedPriceBand(priceBand);
    setShowTrendChart(true);
    // Scroll to the chart section
    setTimeout(() => {
      document
        .getElementById("trend-chart-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative", marginBottom: 16 }}>
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
        <>
          <Grid
            container
            spacing={0}
            lg={12}
            mt={1}
            sx={{ position: "relative", zIndex: 1,
              pointerEvents: loading ? "none" : "auto",
             }}
          >
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Sale Report"
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
                          options={ispList}
                          //   {
                          //     "ispID": 27448,
                          //     "ispName": "A  Hemalatha",
                          //     "userID": 12049
                          // },
                          getOptionLabel={(option) => option.ispName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.ispID === value?.ispID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "filterEntityID",
                              newValue?.ispID || 0
                            );
                          }}
                          value={
                            ispList.find(
                              (isp) => isp.ispID === searchParams.filterEntityID
                            ) || null
                          }
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
                          YEAR <Required />
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                          <NuralYear
                            value={searchParams.year}
                            onChange={(newYear) => {
                              setYearError("");
                              handleSearchChange("year", newYear.value);
                            }}
                            error={!!yearError}
                            placeholder="SELECT YEAR"
                          />
                        </Box>
                        {yearError && (
                          <Typography
                            color="error"
                            sx={{ fontSize: "12px", mt: -2, mb: 1 }}
                          >
                            {yearError}
                          </Typography>
                        )}
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
                          MONTH <Required />
                        </Typography>
                        <NuralMonth
                          value={searchParams.month}
                          onChange={(newMonth) => {
                            setMonthError("");
                            handleSearchChange("month", newMonth);
                          }}
                          error={!!monthError}
                          placeholder="SELECT MONTH"
                        />
                        {monthError && (
                          <Typography
                            color="error"
                            sx={{ fontSize: "12px", mt: 0.5 }}
                          >
                            {monthError}
                          </Typography>
                        )}
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
                          VALUE TYPE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="State"
                          options={ValueTypeList}
                          getOptionLabel={(option) => option.label || ""}
                          onChange={(event, newValue) => {
                            handleSearchChange("valueType", newValue.value);
                          }}
                          value={ValueTypeList.find(
                            (valueType) =>
                              valueType.value === searchParams.valueType
                          )}
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
                          onClick={handleSearchClick}
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
          {status && (
            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
              <StatusModel
                width="100%"
                status={status}
                title={title}
                onClose={() => setStatus(false)}
              />
            </Grid>
          )}
          {/* Add this after the NuralAccordion2 component */}
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            {searchClicked  && (
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
                          "&::after": {
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
                        "PRICE BAND",
                        "MOTOROLA",
                        "XIAOMI",
                        "POCO",
                        "REDMI",
                        "REALME",
                        "OPPO",
                        "SAMSUNG",
                        "OTHER",
                        "VIEW TREND",
                      ].map((header, index) => (
                        <TableCell
                          key={`column${index + 1}`}
                          onClick={() =>
                            header !== "VIEW TREND" &&
                            handleSort(`column${index + 1}`)
                          }
                          sx={{
                            ...tableHeaderStyle,
                            cursor:
                              header !== "VIEW TREND" ? "pointer" : "default",
                            position: "sticky",
                            top: "45px",
                            textAlign: "start",
                            backgroundColor: LIGHT_GRAY2,
                            zIndex: 1000,
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>{header}</Grid>
                            {header !== "VIEW TREND" && (
                              <Grid
                                item
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                              >
                                {sortConfig.key === `column${index + 1}` ? (
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
                    {loadingTable ? (
                      Array(SKELETON_ROWS).fill(null).map((_, index) => (
                        <TableRowSkeleton key={`skeleton-${index}`} columns={11} />
                      ))
                    ) : tableData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                          <Typography
                            variant="body1"
                            sx={{ color: PRIMARY_BLUE2, fontWeight: 500 }}
                          >
                            No Data Available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Existing table data mapping with modified View cell
                      tableData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            key={row.priceBandID}
                            sx={{
                              fontSize: "10px",
                            }}
                          >
                            <TableCell
                              sx={{
                                padding: "8px",
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "8px",
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.["Price Band"] || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "12px",
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Mo ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Xiaomi ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.POCO ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Mi ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Re ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Op ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {row?.Sa ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                textAlign: "left",
                              }}
                            >
                              {/* {row?.["O+"] || ""} */}
                              {row?.Others ?? 0}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "10px",
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                ml: "15px",
                                gap: "4px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleViewTrend(row["Price Band"])
                                }
                              >
                                View
                                <VisibilityIcon
                                  size="small"
                                  fontSize="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {error && (
              <Typography color="error" sx={{ p: 2 }}>
                Error loading data: {error.message}
              </Typography>
            )}
          </Grid>

          {/* Add the chart below the table */}
          {showTrendChart && (
            <Grid
              item
              xs={12}
              sx={{ p: { xs: 1, sm: 2 } }}
              id="trend-chart-section"
            >
              <ASPTrendChart priceBand={selectedPriceBand} trends={trends} />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default CounterShareReport;
