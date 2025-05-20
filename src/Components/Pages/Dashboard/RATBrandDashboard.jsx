import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { DARK_PURPLE, SECONDARY_BLUE } from "../../Common/colors";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../Common/TabsBar";
import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import DashCard from "../NuralCustomComponents/DashboardWidgets/DashCard";
import SummaryCard from "../NuralCustomComponents/DashboardWidgets/SummaryCard";
import SummaryCard2 from "../NuralCustomComponents/DashboardWidgets/SummaryCard2";
import DemoAuditTrend from "../NuralCustomComponents/DashboardWidgets/DemoAuditTrend";
import GreetingHeader from "../../Common/GreetingHeader";
import { GetBrandDashboard, GetDropdownHierarchyList } from "../../Api/Api";
import { DashboardExportButton } from "../../Common/DashboardExportButton";
import { formatDate } from "../../Common/commonFunction";

const today = new Date();
const log = JSON.parse(localStorage.getItem("log")) || {};

const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];

const BrandDashboard = () => {
  const [activeTab, setActiveTab] = React.useState("brand-dashboard");
  const [quickLinks, setQuickLinks] = React.useState([
    { id: 1, label: "QUICK LINK 4", path: "/quick-link-4" },
    null,
    null,
    null,
  ]);

  // New states for API data
  const [totalStores, setTotalStores] = useState(0);
  const [demoAuditScores, setDemoAuditScores] = useState({
    mtdDemoScore: 0,
    lmtdDemoScore: 0,
    growth: 0,
  });
  const [mezAuditScores, setMezAuditScores] = useState({
    mtdMezScore: 0,
    lmtdMezScore: 0,
    growth: 0,
  });
  const [visibilityAuditScores, setVisibilityAuditScores] = useState({
    mtdVisibilityScore: 0,
    lmtdVisibilityScore: 0,
    growth: 0,
  });
  const [ispAuditScores, setIspAuditScores] = useState({
    mtdIspAuditScore: 0,
    lmtdIspAuditScore: 0,
    growth: 0,
  });
  const [riScores, setRiScores] = useState({ avg6M: 0, avgL6M: 0, growth: 0 });
  const [auditCompleted, setAuditCompleted] = useState({
    demo: 0,
    mez: 0,
    isp: 0,
  });
  const [stores, setStores] = useState({ stores: 0, ofAllStores: 0 });
  const [demoAuditTrend, setDemoAuditTrend] = useState([]);
  const [demoAuditData, setDemoAuditData] = useState({});
  const [mezAuditTrend, setMezAuditTrend] = useState([]);
  const [mezAuditData, setMezAuditData] = useState({});
  const [visibilityAuditTrend, setVisibilityAuditTrend] = useState([]);
  const [visibilityAuditData, setVisibilityAuditData] = useState({});
  const [ispAuditTrend, setIspAuditTrend] = useState([]);
  const [ispAuditData, setIspAuditData] = useState({});
  const [level1, setLevel1] = useState([]);
  const [level2, setLevel2] = useState([]);
  const [level3, setLevel3] = useState([]);
  const [autoCompleteRole, setAutoCompleteRole] = useState("");
  const [autoCompleteRole2, setAutoCompleteRole2] = useState("");
  const [autoCompleteRole3, setAutoCompleteRole3] = useState("");
  const [isLoadingLevel1, setIsLoadingLevel1] = useState(false);
  const [isLoadingLevel2, setIsLoadingLevel2] = useState(false);
  const [isLoadingLevel3, setIsLoadingLevel3] = useState(false);

  const [searchParams, setSearchParams] = useState({
    level1ID: 0,
    level2ID: 0,
    level3ID: 0,
    callType: 0 /*1=export*/,
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

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  useEffect(() => {
    fetchLevel1();
  }, []);

  const fetchLevel1 = async () => {
    setIsLoadingLevel1(true);
    let body = {
      orgnHierarchyID: log.entityId,
    };
    try {
      let res = await GetDropdownHierarchyList(body);
      if (res.statusCode == 200) {
        setLevel1(res.hierarchyDropdownList);
        setAutoCompleteRole(res.dropDownName);
      } else {
        setLevel1([]);
        setAutoCompleteRole("");
      }
    } catch (error) {
      setLevel1([]);
      setAutoCompleteRole("");
    } finally {
      setIsLoadingLevel1(false);
    }
  };

  const fetchLevel2 = async (level1ID) => {
    setIsLoadingLevel2(true);
    let body = {
      orgnHierarchyID: level1ID,
    };
    try {
      let res = await GetDropdownHierarchyList(body);
      if (res.statusCode == 200) {
        setLevel2(res.hierarchyDropdownList);
        setAutoCompleteRole2(res.dropDownName);
      } else {
        setLevel2([]);
        setAutoCompleteRole2("");
      }
    } catch (error) {
      setLevel2([]);
      setAutoCompleteRole2("");
    } finally {
      setIsLoadingLevel2(false);
    }
  };

  const fetchLevel3 = async (level2ID) => {
    setIsLoadingLevel3(true);
    let body = {
      orgnHierarchyID: level2ID,
    };
    try {
      let res = await GetDropdownHierarchyList(body);
      if (res.statusCode == 200) {
        setLevel3(res.hierarchyDropdownList);
        setAutoCompleteRole3(res.dropDownName);
      } else {
        setLevel3([]);
        setAutoCompleteRole3("");
      }
    } catch (error) {
      setLevel3([]);
      setAutoCompleteRole3("");
    } finally {
      setIsLoadingLevel3(false);
    }
  };

  useEffect(() => {
    fetchBrandDashboard();
  }, [searchParams]);

  const fetchBrandDashboard = async () => {
    try {
      const response = await GetBrandDashboard(searchParams);
      console.log("response", response);

      // Set all the states with API data
      if (response.totalStores?.[0])
        setTotalStores(response.totalStores[0].totalStores);
      if (response.demoAuditScores?.[0])
        setDemoAuditScores(response.demoAuditScores[0]);
      if (response.mezAuditScores?.[0])
        setMezAuditScores(response.mezAuditScores[0]);
      if (response.visibilityAuditScores?.[0])
        setVisibilityAuditScores(response.visibilityAuditScores[0]);
      if (response.ispAuditScores?.[0])
        setIspAuditScores(response.ispAuditScores[0]);
      if (response.riScores?.[0]) setRiScores(response.riScores[0]);
      if (response.auditCompleted?.[0])
        setAuditCompleted(response.auditCompleted[0]);
      if (response.stores?.[0]) setStores(response.stores[0]);
      if (response.demoAuditTrend) setDemoAuditTrend(response.demoAuditTrend);
      if (response.demoAuditData?.[0])
        setDemoAuditData(response.demoAuditData[0]);
      if (response.mezAuditTrend) setMezAuditTrend(response.mezAuditTrend);
      if (response.mezAuditData?.[0]) setMezAuditData(response.mezAuditData[0]);
      if (response.visibilityAuditTrend)
        setVisibilityAuditTrend(response.visibilityAuditTrend);
      if (response.visibilityAuditData?.[0])
        setVisibilityAuditData(response.visibilityAuditData[0]);
      if (response.ispAuditTrend) setIspAuditTrend(response.ispAuditTrend);
      if (response.ispAuditData?.[0]) setIspAuditData(response.ispAuditData[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSearchChange = (field, value, newValue) => {
    if (field === "level1ID") {
      if (value) {
        fetchLevel2(value);
      } else {
        // Clear level 2 data when level 1 is cleared
        setLevel2([]);
        setAutoCompleteRole2("");
        setSearchParams((prev) => ({ ...prev, level2ID: 0 }));
      }
    }
    if (field === "level2ID") {
      if (value) {
        fetchLevel3(value);
      } else {
        setLevel3([]);
        setAutoCompleteRole3("");
        setSearchParams((prev) => ({ ...prev, level3ID: 0 }));
      }
    }

    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleExportClick = async () => {
    console.log("Export request body:");
    let body = {
      ...searchParams,
      callType: 1,
    };
    try {
      let res = await GetBrandDashboard(body);

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
  // Add these states for pagination

  // Replace the existing dummy data with this more realistic data

  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          position: "relative",
          mb: 2,
        }}
      >
        {/* Quick Links Row */}

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
          <Grid item xs={12} mt={4} mb={0} ml={0}>
            <GreetingHeader userName={log.userName} lastLogin={log.lastLogin} />
          </Grid>

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
          direction="column"
          sx={{ p: { sm: 1, md: 0, lg: 0 } }}
        >
          <Grid item>
            {/* First Row - 3 NuralAutocomplete */}
            <Grid
              container
              spacing={2}
              mb={2}
              sx={{
                gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                pr: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <NuralAutocomplete
                  label="Level 1"
                  options={level1}
                  placeholder={`SELECT ${autoCompleteRole}`}
                  width="100%"
                  loading={isLoadingLevel1}
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
                  }}
                  value={
                    level1.find(
                      (option) => option.locationID === searchParams.level1ID
                    ) || null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <NuralAutocomplete
                  label="Level 2"
                  options={level2}
                  placeholder={`SELECT ${autoCompleteRole2}`}
                  width="100%"
                  disabled={!searchParams.level1ID}
                  loading={isLoadingLevel2}
                  getOptionLabel={(option) => option.locationName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.locationID === value?.locationID
                  }
                  onChange={(event, newValue) => {
                    handleSearchChange(
                      "level2ID",
                      newValue?.locationID || 0,
                      newValue
                    );
                  }}
                  value={
                    level2.find(
                      (option) => option.locationID === searchParams.level2ID
                    ) || null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <NuralAutocomplete
                  label="Level 3"
                  options={level3}
                  placeholder={`SELECT ${autoCompleteRole3}`}
                  width="100%"
                  disabled={!searchParams.level1ID}
                  loading={isLoadingLevel3}
                  getOptionLabel={(option) => option.locationName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.locationID === value?.locationID
                  }
                  onChange={(event, newValue) => {
                    handleSearchChange(
                      "level3ID",
                      newValue?.locationID || 0,
                      newValue
                    );
                  }}
                  value={
                    level3.find(
                      (option) => option.locationID === searchParams.level3ID
                    ) || null
                  }
                />
              </Grid>
              <Grid item sx={{ marginLeft: "auto", alignSelf: "center" }}>
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

            {/* Add Product Sales Chart */}
          </Grid>
        </Grid>
        <Grid container spacing={0} ml={2} pr={0} mt={-1} mb={2}>
          <DashboardExportButton
            handleExportExcel={handleExportClick}
            handleExportPDF={handleExportClick}
          />
        </Grid>
        <Grid
          container
          display={"flex"}
          spacing={0}
          sx={{ borderRadius: 3, p: 0, mt: 0, p: { sm: 1, md: 0, lg: 0 } }}
          // mr={1}
        >
          {/* Left: Metric Cards */}
          {/* responsive on tab or mobile  */}
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            display={"grid"}
            gridTemplateColumns={{
              xs: "repeat(1,1fr)",
              sm: "repeat(2,1fr)",
              md: "repeat(2,1fr)",
              lg: "repeat(2,1fr)",
            }}
            gap={1}
          >
            <Grid item xs={12} md={12}>
              <DashCard title="Total Stores" value={totalStores.toString()} />
            </Grid>
            <Grid item xs={12} md={12}>
              <DashCard
                title="MEZ Audit Score"
                value={mezAuditScores.mtdMezScore.toString()}
                change={`${mezAuditScores.growth}% VS PREV. MONTH`}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <DashCard
                title="Demo Audit Score"
                value={demoAuditScores.mtdDemoScore.toString()}
                change={`${demoAuditScores.growth}% VS PREV. MONTH`}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DashCard
                title="Visibility Audit Score"
                value={visibilityAuditScores.mtdVisibilityScore.toString()}
                change={`${visibilityAuditScores.growth}% VS PREV. MONTH`}
                negative={visibilityAuditScores.growth < 0}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <DashCard
                title="Stores[RI<90]"
                value={stores.stores.toString()}
                change={`${stores.ofAllStores}% OF ALL STORES`}
                negative={stores.ofAllStores > 0}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DashCard
                title="ISP Audit Score"
                value={ispAuditScores.mtdIspAuditScore.toString()}
                change={`${ispAuditScores.growth}% VS PREV. MONTH`}
              />
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={2}
            pl={{ sm: 0, md: 1, lg: 1 }}
            mt={{ sm: 1, md: 0, lg: 0 }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <SummaryCard
                title="RI Score[6M Avg.]"
                value={riScores.avg6M.toString()}
                change={`${riScores.growth}% vs last 6 months`}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <SummaryCard2
                title="Audits Completed"
                data={[
                  { label: "DEMO", value: auditCompleted.demo },
                  { label: "MEZ", value: auditCompleted.mez },
                  { label: "ISP", value: auditCompleted.isp },
                ]}
              />
            </Grid>
          </Grid>
          {/* Right: Demo Audit Trend */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            pl={{ sm: 0, md: 1, lg: 1 }}
            mt={{ sm: 1, md: 0, lg: 0 }}
            pr={{ sm: 0, md: 1, lg: 1 }}
          >
            <DemoAuditTrend
              title="Demo Audit Trend"
              trendData={demoAuditTrend}
              auditData={demoAuditData}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          sx={{ borderRadius: 3, mt: 1, p: { sm: 1, md: 0, lg: 0 } }}
          mr={1}
        >
          <Grid item xs={12} md={4} lg={4} mt={{ sm: -2, md: 0, lg: 0 }}>
            <DemoAuditTrend
              title="MEZ Audit Trend"
              trendData={mezAuditTrend}
              auditData={mezAuditData}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4} mt={{ sm: 1, md: 0, lg: 0 }}>
            <DemoAuditTrend
              title="Visibility Audit Trend"
              trendData={visibilityAuditTrend}
              auditData={visibilityAuditData}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4} mt={{ sm: 1, md: 0, lg: 0 }}>
            <DemoAuditTrend
              title="ISP Audit Trend"
              trendData={ispAuditTrend}
              auditData={ispAuditData}
            />
          </Grid>
        </Grid>
        {/* Add ISP Zero Sale Table */}
      </Grid>
    </>
  );
};

export default BrandDashboard;
