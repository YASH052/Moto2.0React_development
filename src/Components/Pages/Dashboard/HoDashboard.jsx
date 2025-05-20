import { Grid, Typography, Button, Stack } from "@mui/material";
import React, { use, useEffect } from "react";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";
import BreadcrumbsHeader from "../../Common/BreadcrumbsHeader";
import TabsBar from "../../Common/TabsBar";
import NuralAccordion2 from "../NuralCustomComponents/NuralAccordion2";
import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../NuralCustomComponents/NuralCalendar";
import NuralButton from "../NuralCustomComponents/NuralButton";
import NuralTextButton from "../NuralCustomComponents/NuralTextButton";
import SalesTrendGraph from "../NuralCustomComponents/DashboardWidgets/SalesTrendGraph";
import TargetAchievement from "../NuralCustomComponents/DashboardWidgets/TargetAchievement";
import GreetingHeader from "../../Common/GreetingHeader.jsx";

import CounterShare from "../NuralCustomComponents/DashboardWidgets/CounterShare";
import {
  weeklyData,
  monthlyData,
  yearlyData,
  rankings,
} from "../NuralCustomComponents/TestCompo.jsx";

import SalesMetricsGrid from "../NuralCustomComponents/DashboardWidgets/SalesMetricsGrid";
import RankingNSM from "../NuralCustomComponents/DashboardWidgets/RankingNSM.jsx";
import FocusModelPerformance from "../../Common/NuralCustomComponents/DashboardWidgets/FocusModelPerformance.jsx";
import {
  GetBusinessDashboard,
  GetDropdownHierarchyList,
} from "../../Api/Api.js";
import {
  dayWiseSalesDummy,
  weekWiseSalesDummy,
  monthWiseSalesDummy,
  YearWiseGraphDummy,
  focusModelGraphData,
  priceBandData,
  priceBrandGraphdummy,
  dummyCounterShareData,
} from "../../Common/dummyData.js";
import NsmPerformanceTable from "../../Common/NuralCustomComponents/DashboardWidgets/NsmPerformanceTable.jsx";
import RsmPerformanceTable from "../../Common/NuralCustomComponents/DashboardWidgets/RsmPerformanceTable.jsx";
import IspPerformanceTable from "../../Common/NuralCustomComponents/DashboardWidgets/IspPerformanceTable.jsx";
import CounterShareTable from "../../Common/NuralCustomComponents/DashboardWidgets/CounterShareTable.jsx";
import { DashboardExportButton } from "../../Common/DashboardExportButton.jsx";
import { formatDate } from "../../Common/commonFunction.js";
const log = JSON.parse(localStorage.getItem("log")) || {};
const HoDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [flag, setFlag] = React.useState(false);
  const [autoCompleteRole, setAutoCompleteRole] = React.useState([]);
  const [autoCompleteRole2, setAutoCompleteRole2] = React.useState([]);
  const [dayWiseSales, setDayWiseSales] = React.useState([]);
  const [weeklySales, setWeeklySales] = React.useState([]);
  const [monthlySales, setMonthlySales] = React.useState([]);
  const [yearlySales, setYearlySales] = React.useState([]);
  const [salesMetrics, setSalesMetrics] = React.useState([]);
  const [targetAchievement, setTargetAchievement] = React.useState([]);
  const [rankings, setRankings] = React.useState([]);
  const [focusModel, setFocusModel] = React.useState([]);
  const [priceBand, setPriceBand] = React.useState([]);
  const [focusModelGraph, setFocusModelGraph] = React.useState([]);
  const [priceBrandGraph, setPriceBrandGraph] = React.useState([]);
  const [performanceTableQTY, setPerformanceTableQTY] = React.useState([]);
  const [performanceTableVAL, setPerformanceTableVAL] = React.useState([]);
  const [nsmDropdown, setNSMDropdown] = React.useState([]);
  const [rsmDropdown, setRsmDropdown] = React.useState([]);
  const [selectedRSM, setSelectedRSM] = React.useState(null);
  const [rsmPerformanceTableQTY, setRsmPerformanceTableQTY] = React.useState(
    []
  );
  const [rsmPerformanceTableVAL, setRsmPerformanceTableVAL] = React.useState(
    []
  );
  const [ispPerformanceTableQTY, setISPPerformanceTableQTY] = React.useState(
    []
  );
  const [ispPerformanceTableVAL, setISPPerformanceTableVAL] = React.useState(
    []
  );

  const [searchParams, setSearchParams] = React.useState({
    level1ID: 0,
    level2ID: 0,
    modelID: 0,
    priceBandID: 0,
    selectedID: 0,
    selected1ID: 0,
    topBottom: 0 /*0=TOP,1=BOTTOM*/,
    callType: 0 /*1=Export*/,
    IsShow: 0 /*1=HO/NSM,0=RSM/ASM/TSM*/,
  });

  const tabs = [
    { label: "Business", value: "dashboard" },
    { label: "Channels", value: "channels-dashboard" },
    { label: "Availability", value: "availability-dashboard" },
    { label: "Brand", value: "brand-dashboard" },
    { label: "Inventory", value: "inventory-dashboard" },
    { label: "Attendance", value: "rat-attendance" },
    { label: "Target", value: "rat-target" },
    { label: "Incentive", value: "rat-incentive" },
  ];
  const navigate = useNavigate();

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Format date
  const today = new Date();
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };

  const isInitialMount = React.useRef(true); // Ref to track initial mount

  // Effect for initial data fetch on mount
  useEffect(() => {
    console.log("Initial fetch");
    fetchBusinessDashboard();
    fetchNSMDropdown(); // Fetch NSM dropdown initially too
  }, []); // Empty array: runs only once on mount

  // Removed the separate useEffect for fetchNSMDropdown based on log.entityId, integrated above.

  // Effect to fetch data whenever relevant search parameters change *after* initial mount
  useEffect(() => {
    // If it's the first render, skip the effect.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Fetch data when parameters change (including resets to 0)

    fetchBusinessDashboard();
  }, [flag]);

  const fetchNSMDropdown = async () => {
    let body = {
      orgnHierarchyID: log.entityId,
    };
    // console.log("body", body);
    try {
      let res = await GetDropdownHierarchyList(body);
      if (res.statusCode == 200) {
        setNSMDropdown(res.hierarchyDropdownList);
        setAutoCompleteRole(res.dropDownName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRSMDropdown = async (selectedLevel1ID) => {
    if (!selectedLevel1ID || selectedLevel1ID === 0) {
      setRsmDropdown([]);
      return;
    }
    let body = {
      orgnHierarchyID: selectedLevel1ID,
    };
    console.log("Fetching RSM dropdown with body:", body);
    try {
      let res = await GetDropdownHierarchyList(body);
      if (res.statusCode == 200) {
        setAutoCompleteRole2(res.dropDownName);

        setRsmDropdown(res.hierarchyDropdownList || []);
      } else {
        setRsmDropdown([]);
      }
    } catch (error) {
      console.log("Error fetching RSM dropdown:", error);
      setRsmDropdown([]);
    }
  };

  const fetchBusinessDashboard = async () => {
    console.log("Fetching business dashboard with params:", searchParams);
    try {
      let res = await GetBusinessDashboard(searchParams);
      if (res.statusCode == 200) {
        // console.log("res.saleTrendGraph_Day", res);
        setDayWiseSales(res.saleTrendGraph_Day);
        setWeeklySales(res.saleTrendGraph_Week);
        setMonthlySales(res.saleTrendGraph_Month);
        setYearlySales(res.saleTrendGraph_Year);
        setSalesMetrics(res.clsSalesList[0]);
        setTargetAchievement(res.clsTargetAchList[0]);
        setRankings(res.clsRankList);
        setFocusModel(res.clsFocusModelList);
        setPriceBand(res.clsCounterShareList);
        setPriceBrandGraph(res.clsCounterShareGraphList);
        setFocusModelGraph(res.clsFocusModelGraphList);
        setPerformanceTableQTY(res.clsPerformance_1QtyList);
        setPerformanceTableVAL(res.clsPerformance_1ValList);
        setRsmPerformanceTableQTY(res.clsPerformance_2QtyList);
        setRsmPerformanceTableVAL(res.clsPerformance_2ValList);
        setISPPerformanceTableQTY(res.clsISPPerformanceList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (field, value, newValue) => {
    console.log(`Updating ${field} to ${value}`);
    setSearchParams((prevParams) => ({ ...prevParams, [field]: value }));
    setFlag(!flag);
  };

  const handleNSMRowSelect = (selectedRowId) => {
    console.log("selectedRowId", selectedRowId);
    const newSelectedID =
      searchParams.selected1ID === selectedRowId ? 0 : selectedRowId;
    setSearchParams((prev) => ({
      ...prev,
      selected1ID: newSelectedID,
      // Reset RSM selection when NSM changes
    }));
    setFlag(!flag); // Set flag when NSM is selected
  };

  const handleRSMRowSelect = (selectedRowId) => {
    const newSelected1ID =
      searchParams.selectedID === selectedRowId ? 0 : selectedRowId;
    setSearchParams((prev) => ({
      ...prev,
      selectedID: newSelected1ID,
    }));
    setFlag(!flag); // Set flag when RSM is selected
  };

  const handleISPRowSelect = (selectedRowId) => {
    const newSelected1ID =
      searchParams.topBottom === selectedRowId ? 0 : selectedRowId;
    setSearchParams((prev) => ({
      ...prev,
      topBottom: newSelected1ID,
    }));
    setFlag(!flag); // Set flag when ISP is selected
  };

  const handleExportClick = async () => {
    console.log("Export request body:");
    let body = {
      ...searchParams,
      callType: 1,
    };
    try {
      let res = await GetBusinessDashboard(body);

      if (res) {
        window.location.href = res.reportLink;
      } else {
        console.error("Export failed: Invalid response format", res);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Export API error:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: 1,
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
          <GreetingHeader userName={log.userName} lastLogin={log.lastLogin} />

          <Grid item xs={12} ml={0}>
            <TabsBar
              tabs={tabs}
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
            <Grid container spacing={0} direction="column">
              <Grid item>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  alignItems="center"
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      label="All NSM"
                      options={nsmDropdown}
                      placeholder={`SELECT ${autoCompleteRole}`}
                      width="100%"
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.locationID === value?.locationID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "level1ID",
                          newValue?.locationID || 0,
                          newValue
                        );
                        handleSearchChange("level2ID", 0, null);
                        setSelectedRSM(null);
                        setRsmDropdown([]);
                        if (newValue?.locationID) {
                          fetchRSMDropdown(newValue.locationID);
                        }
                      }}
                      value={
                        nsmDropdown.find(
                          (option) =>
                            option.locationID === searchParams.level1ID
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      label="All RSM"
                      options={rsmDropdown}
                      placeholder={`SELECT ${autoCompleteRole2}`}
                      width="100%"
                      disabled={
                        !searchParams.level1ID || searchParams.level1ID === 0
                      }
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.locationID === value?.locationID
                      }
                      onChange={(event, newValue) => {
                        setSelectedRSM(newValue);
                        handleSearchChange(
                          "level2ID",
                          newValue?.locationID || 0,
                          newValue
                        );
                      }}
                      value={selectedRSM}
                    />
                  </Grid>
                  {/* Date Display */}
                  <Grid item sx={{ marginLeft: "auto" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "10px",
                        lineHeight: "100%",
                        letterSpacing: "4%",
                        textTransform: "uppercase",
                        color: SECONDARY_BLUE,
                        fontWeight: "medium",
                      }}
                    >
                      {formatDate(today)}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Third Row - Buttons */}
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={0} ml={2} pr={0} mt={-1} mb={2}>
            <DashboardExportButton
              handleExportExcel={handleExportClick}
              handleExportPDF={handleExportClick}
            />
          </Grid>
          <Grid container spacing={0} ml={2} p={0}>
            {" "}
            <Grid item xs={12} md={6} lg={6} xl={6} p={0}>
              <SalesTrendGraph
                height="255px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={
                  // dayWiseSalesDummy
                  dayWiseSales
                }
                caseType=""
                title="Sales Trend [DAY]"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <SalesMetricsGrid metrics={salesMetrics} />
            </Grid>
          </Grid>

          {/* Add Target Achievement section */}

          <Grid container spacing={2} ml={0} mt={0.5} pr={2}>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={
                  // weekWiseSalesDummy
                  weeklySales
                }
                caseType=""
                title="Sales Trend [Week]"
                period="week"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={
                  // monthWiseSalesDummy
                  monthlySales
                }
                caseType=""
                title="Sales Trend [Month]"
                period="month"
                showLegend={false}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={
                  // YearWiseGraphDummy
                  yearlySales
                }
                caseType=""
                title="Sales Trend [Year]"
                period="year"
                showLegend={false}
              />
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} mt={2} pr={2}>
            <Grid item xs={12} md={4} spacing={2} lg={4} xl={4} pr={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12} xl={12}>
                  <TargetAchievement targetAchievement={targetAchievement} />
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} mt={0}>
                  <SalesTrendGraph
                    height="235px"
                    paperBgColor={LIGHT_GRAY2}
                    gap="15px"
                    borderRadius="8px"
                    data={
                      weeklySales
                      // weekWiseSalesDummy
                    }
                    title="Sales Trend [Week]"
                    period="week"
                    caseType="asp"
                    showLegend={false}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4} pl={1} pr={1}>
              <FocusModelPerformance
                focusModelData={focusModel}
                focusModelGraphData={
                  // focusModelGraphData
                  focusModelGraph
                }
                onModelChange={(value, newValue) => {
                  handleSearchChange("modelID", value, newValue);
                }}
              />
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4} pl={1.5}>
              <CounterShare
                priceBandData={
                  priceBandData
                  // priceBand
                }
                priceBrandGraph={
                  // priceBrandGraphdummy
                  priceBrandGraph
                }
                onPriceBandChange={(value, newValue) => {
                  handleSearchChange("priceBandID", value, newValue);
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={0} mt={-1.5} ml={2} pr={2}>
            <Grid item xs={12} md={4} lg={4} xl={4} pr={1}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={monthlySales}
                title="ASP Trend [Month]"
                period="month"
                caseType="asp"
                showLegend={false}
              />
            </Grid>{" "}
            <Grid item xs={12} md={4} lg={4} pr={0} xl={4} pl={1}>
              <SalesTrendGraph
                height="248px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={yearlySales}
                caseType="asp"
                title="ASP Trend [Year]"
                period="year"
                showLegend={false}
              />
            </Grid>{" "}
            <Grid item xs={12} md={4} lg={4} xl={4} pl={1.5}>
              <RankingNSM rankings={rankings} />
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} mt={2} pr={2}>
            <Grid item xs={12}>
              <NsmPerformanceTable
                onRowSelect={handleNSMRowSelect}
                selectedRowId={searchParams.selected1ID}
                performanceTableQTY={performanceTableQTY}
                performanceTableVAL={performanceTableVAL}
                data={performanceTableQTY}
                title="NSM Performance"
              />
            </Grid>
          </Grid>

          {/* Add RSM Performance QTY Table */}
          <Grid container spacing={0} ml={2} mt={2} pr={2}>
            <Grid item xs={12}>
              <RsmPerformanceTable
                onRowSelect={handleRSMRowSelect}
                selectedRowId={searchParams.selectedID}
                performanceTableQTY={rsmPerformanceTableQTY}
                performanceTableVAL={rsmPerformanceTableVAL}
                title="RSM Performance"
              />
            </Grid>
          </Grid>

          {/* Add ISP Performance QTY Table */}
          <Grid container spacing={0} ml={2} mt={2} pr={2}>
            <Grid item xs={12}>
              <IspPerformanceTable
                onRowSelect={handleISPRowSelect}
                performanceTableQTY={ispPerformanceTableQTY}
                performanceTableVAL={ispPerformanceTableVAL}
                title="ISP Performance"
              />
            </Grid>
          </Grid>

          {/* Add Counter Share Table */}
          <Grid container spacing={0} ml={2} mt={2} pr={4}>
            <Grid item xs={12}>
              <CounterShareTable data={dummyCounterShareData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HoDashboard;
