import { Grid, Typography, Button, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../Common/TabsBar";

import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import NuralDistributorSales from "../NuralCustomComponents/NuralDistributorSales";
import DistributorInventoryChart from "../NuralCustomComponents/DashboardWidgets/DistributorInventoryChart";
import ProductSalesChart from "../NuralCustomComponents/DashboardWidgets/ProductSalesChart";
import RetailerSalesChart from "../NuralCustomComponents/DashboardWidgets/RetailerSalesChart";
import {
  GetDropdownHierarchyList,
  GetChannelDashboard,
  GetChannelDashboardListDropDown,
  GetFocusModelGroupDropDown,
} from "../../Api/Api";
import ChannelDistributorSales from "../NuralCustomComponents/ChannelDistributorSales";
import DistributorInventoryChart2 from "../NuralCustomComponents/DashboardWidgets/DistributerInventoryChart2";
import ChannelDistributorInventaryChart from "../NuralCustomComponents/DashboardWidgets/ChannelDistributorInventaryChart";
import ChannelProductSalesCharts from "../NuralCustomComponents/DashboardWidgets/ChannelProductSalesCharts";
import ChannelRetailerSalesChart from "../NuralCustomComponents/DashboardWidgets/ChannelRetailerSalesChart";
import ISPZeroSaleTable from "./ISPZeroSaleTable";
import ChannelDistributorList from "./ChannelDistributorList";
import ChannelProductList from "./ChannelProductList";
import ChannelRetailerList from "./ChannelRetailerList";
import GreetingHeader from "../../Common/GreetingHeader";

const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];
const salesMetrics = [
  {
    title: "Yesterday Sales",
    value: "₹14,200",
    trend: 5.2,
    comparedTo: "VS PREV. DAY",
    backgroundColor: "#F8F7FF",
  },

  {
    title: "MTD Sales",
    value: "₹2,85,400",
    trend: -12.3,
    comparedTo: "VS PREV. MONTH",
    backgroundColor: "#F8F7FF",
  },
  {
    title: "YTD Sales",
    value: "₹14.85Cr",
    trend: -2.7,
    comparedTo: "VS PREV. YEAR",
    backgroundColor: "#FFF1F1",
  },
  {
    title: "ISPs Present Yesterday",
    value: "115/124",
    trend: 92,
    comparedTo: "ATTENDANCE",
    subtitle: "93% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
];

const Store = localStorage.getItem("log") || {};
const entityId = Store.entityId || 0;
const ChannelsDashBoard = () => {
  const [activeTab, setActiveTab] = React.useState("channels-dashboard");
  const [NSMPlaceholder, setNSMPlaceholder] = useState("");
  const [RSMPlaceholder, setRSMPlaceholder] = useState("");
  const [NSPDropdownHierarchyList, setGetNSPDropdownHierarchyList] = useState(
    []
  );
  const [RSMDropdownHierarchyList, setRSMDropdownHierarchyList] = useState([]);
  const [distributorSaleDropdownList, setDistributorSaleDropdownList] =
    useState([]);
  const [
    inventoryDistributorDropdownList,
    setInventoryDistributorDropdownList,
  ] = useState([]);
  const [focusModelGroupDropdownList, setFocusModelGroupDropdownList] =
    useState([]);
  const [retailerGroupTOPDropdownList, setRetailerGroupTOPDropdownList] =
    useState([]);
  const [retailerGroupBOTTOMDropdownList, setRetailerGroupBOTTOMDropdownList] =
    useState([]);
  const [
    retailerIndividualTOPDropdownList,
    setRetailerIndividualTOPDropdownList,
  ] = useState([]);
  const [
    retailerIndividualBOTTOMDropdownList,
    setRetailerIndividualBOTTOMDropdownList,
  ] = useState([]);
  const [searchParams, setSearchParams] = useState({
    level1ID: 0,
    level2ID: 0,
    disID: 0,
    disInvID: 0,
    prdID: 0,
    retID: 0,
    topBottom: 0 /*0=top,1=bottom*/,
    callType: 0 /*1=export*/,
  });
  const [channelDashboardList, setChannelDashboardList] = useState([]);
  const [distributorSaleQuantityList, setDistributorSaleQuantityList] =
    useState([]);
  const [distributorSaleValueList, setDistributorSaleValueList] = useState([]);
  const [mtdDistributorSaleQuantityList, setMTDDistributorSaleQuantityList] =
    useState([]);
  const [mtdDistributorSaleValueList, setMTDDistributorSaleValueList] =
    useState([]);
  const [distributorInventaryValueList, setDistributorInventaryValueList] =
    useState([]);
  const [
    distributorInventaryQuantityList,
    setDistributorInventaryQuantityList,
  ] = useState([]);
  const [
    distributorInventaryWOIValueList,
    setDistributorInventaryWOIValueList,
  ] = useState([]);
  const [
    distributorInventaryWOIQuantityList,
    setDistributorInventaryWOIQuantityList,
  ] = useState([]);
  const [focusModelGraphQuantityList, setFocusModelGraphQuantityList] =
    useState([]);
  const [focusModelGraphValueList, setFocusModelGraphValueList] = useState([]);
  const [focusModelMTDQuantityList, setFocusModelMTDQuantityList] = useState(
    []
  );
  const [focusModelMTDValueList, setFocusModelMTDValueList] = useState([]);
  const [retailerGroupValueList, setRetailerGroupValueList] = useState([]);
  const [retailerGroupQuantityList, setRetailerGroupQuantityList] = useState(
    []
  );
  const [mtdRetailerGroupValueList, setMTDRetailerGroupValueList] = useState(
    []
  );
  const [mtdRetailerGroupQuantityList, setMTDRetailerGroupQuantityList] =
    useState([]);
  const [retailerIndividualValueList, setRetailerIndividualValueList] =
    useState([]);
  const [retailerIndividualQuantityList, setRetailerIndividualQuantityList] =
    useState([]);
  const [mtdRetailerIndividualValueList, setMTDRetailerIndividualValueList] =
    useState([]);
  const [
    mtdRetailerIndividualQuantityList,
    setMTDRetailerIndividualQuantityList,
  ] = useState([]);
  const [channelDistributorValueList, setChannelDistributorValueList] =
    useState([]);
  const [channelDistributorQuantityList, setChannelDistributorQuantityList] =
    useState([]);
  const [channelProductValueList, setChannelProductValueList] = useState([]);
  const [channelProductQuantityList, setChannelProductQuantityList] = useState(
    []
  );
  const [channelRetailerValueList, setChannelRetailerValueList] = useState([]);
  const [channelRetailerQuantityList, setChannelRetailerQuantityList] =
    useState([]);
  const [NSPLoading, setNSPLoading] = useState(false);
  const [RSMLoading, setRSMLoading] = useState(false);

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
    navigate(`/${newValue}`);
  };

  const handleSearchChange = (key, value, newValue) => {
    if (key == "level1ID") {
      if (value == 0) {
        setSearchParams((prev) => ({
          ...prev,
          [key]: value,
          level2ID: 0,
        }));
        let body = {
          ...searchParams,
          level1ID: 0,
          level2ID: 0,
        };
        setRSMDropdownHierarchyList([]);
        fetchChannelDashboard(body);
      } else {
        setSearchParams((prev) => ({
          ...prev,
          [key]: value,
        }));
        fetchRSMDropdownHierarchyList(value);
        let body = {
          ...searchParams,
          level1ID: value,
        };
        fetchChannelDashboard(body);
      }
    } else if (key == "level2ID") {
      if (value == 0) {
        setSearchParams((prev) => ({
          ...prev,
          [key]: value,
        }));
        let body = {
          ...searchParams,
          level2ID: 0,
        };
        fetchChannelDashboard(body);
      } else {
        setSearchParams((prev) => ({
          ...prev,
          [key]: value,
        }));
        let body = {
          ...searchParams,
          level2ID: value,
        };
        fetchChannelDashboard(body);
      }
    } else {
      // setSearchParamDropdownHierarchyList((prev) => ({
      //   ...prev,
      //   [key]: value,
      // }));
    }
  };

  const fetchNSPDropdownHierarchyList = async () => {
    setNSPLoading(true);
    try {
      const body = {
        orgnHierarchyID: entityId,
      };
      const response = await GetDropdownHierarchyList(body);
      if (response.statusCode == 200) {
        console.log(
          "response.hierarchyDropdownList",
          response.hierarchyDropdownList
        );
        setGetNSPDropdownHierarchyList(response.hierarchyDropdownList);
        setNSMPlaceholder(response.dropDownName);
      } else {
        setGetNSPDropdownHierarchyList([]);
      }
    } catch (error) {
      console.error("Error fetching dropdown hierarchy list:", error);
    } finally {
      setNSPLoading(false);
    }
  };

  const fetchRSMDropdownHierarchyList = async (value) => {
    setRSMLoading(true);
    try {
      const body = {
        orgnHierarchyID: value,
      };
      const response = await GetDropdownHierarchyList(body);
      if (response.statusCode == 200) {
        console.log(
          "response.hierarchyDropdownList",
          response.hierarchyDropdownList
        );
        setRSMDropdownHierarchyList(response.hierarchyDropdownList);
        setRSMPlaceholder(response.dropDownName);
      } else {
        setRSMDropdownHierarchyList([]);
      }
    } catch (error) {
      console.error("Error fetching dropdown hierarchy list:", error);
    } finally {
      setRSMLoading(false);
    }
  };

  const fetchChannelDashboardListDropDown = async () => {
    try {
      const response = await GetChannelDashboardListDropDown();
      if (response.statusCode == 200) {
        setDistributorSaleDropdownList(response.distributorList);
        setInventoryDistributorDropdownList(response.inventoryDistributorList);
        setRetailerGroupTOPDropdownList(response.groupRetailerList);
        setRetailerGroupBOTTOMDropdownList(response.groupRetailerList2);
        setRetailerIndividualTOPDropdownList(response.indRetailerList);
        setRetailerIndividualBOTTOMDropdownList(response.indRetailerList2);
      } else {
        setDistributorSaleDropdownList([]);
        setInventoryDistributorDropdownList([]);
        setRetailerGroupTOPDropdownList([]);
        setRetailerGroupBOTTOMDropdownList([]);
        setRetailerIndividualTOPDropdownList([]);
        setRetailerIndividualBOTTOMDropdownList([]);
      }
    } catch (error) {
      console.error("Error fetching channel dashboard list dropdown:", error);
    }
  };

  const fetchFocusModelGroupDropDown = async () => {
    try {
      const response = await GetFocusModelGroupDropDown();
      if (response.statusCode == 200) {
        setFocusModelGroupDropdownList(response.focusModelDropdownList);
      } else {
        setFocusModelGroupDropdownList([]);
      }
    } catch (error) {
      console.error("Error fetching focus model group dropdown:", error);
    }
  };

  const fetchChannelDashboard = async (body) => {
    try {
      const response = await GetChannelDashboard(body);
      if (response.statusCode == 200) {
        setChannelDashboardList(response.channelDashboardList);
        setDistributorSaleQuantityList(response.distGraphVolList);
        setDistributorSaleValueList(response.distGraphValList);
        setMTDDistributorSaleQuantityList(response.mtdDistVolList);
        setMTDDistributorSaleValueList(response.mtdDistValList);
        setDistributorInventaryValueList(response.distInvValList);
        setDistributorInventaryQuantityList(response.distInvVolList);
        setDistributorInventaryWOIValueList(response.distInvWOIValList);
        setDistributorInventaryWOIQuantityList(response.distInvWOIVolList);
        setFocusModelGraphQuantityList(response.prdGraphVolList);
        setFocusModelGraphValueList(response.prdGraphValList);
        setFocusModelMTDQuantityList(response.mtdPrdVolList);
        setFocusModelMTDValueList(response.mtdPrdValList);

        setRetailerGroupValueList(response.retGrpGraphValList);
        setRetailerGroupQuantityList(response.retGrpGraphVolList);
        setMTDRetailerGroupValueList(response.mtdGrpRetValList);
        setMTDRetailerGroupQuantityList(response.mtdGrpRetVolList);
        setRetailerIndividualValueList(response.retIndGraphValList);
        setRetailerIndividualQuantityList(response.retIndGraphVolList);
        setMTDRetailerIndividualValueList(response.mtdIndRetValList);
        setMTDRetailerIndividualQuantityList(response.mtdIndRetVolList);
        setChannelDistributorValueList(response.disValPerformanceList);
        setChannelDistributorQuantityList(response.disVolPerformanceList);
        setChannelProductValueList(response.prdValPerformanceList);
        setChannelProductQuantityList(response.prdVolPerformanceList);
        setChannelRetailerValueList(response.retValPerformanceList);
        setChannelRetailerQuantityList(response.retVolPerformanceList);
      } else {
        setChannelDashboardList([]);
        setDistributorSaleQuantityList([]);
        setDistributorSaleValueList([]);
        setMTDDistributorSaleQuantityList([]);
        setMTDDistributorSaleValueList([]);
        setDistributorInventaryValueList([]);
        setDistributorInventaryQuantityList([]);
        setDistributorInventaryWOIValueList([]);
        setDistributorInventaryWOIQuantityList([]);
        setFocusModelGraphQuantityList([]);
        setFocusModelGraphValueList([]);
        setFocusModelMTDQuantityList([]);
        setFocusModelMTDValueList([]);
        setRetailerGroupValueList([]);
        setRetailerGroupQuantityList([]);
        setMTDRetailerGroupValueList([]);
        setMTDRetailerGroupQuantityList([]);
        setRetailerIndividualValueList([]);
        setRetailerIndividualQuantityList([]);
        setMTDRetailerIndividualValueList([]);
        setMTDRetailerIndividualQuantityList([]);
        setChannelDistributorValueList([]);
        setChannelDistributorQuantityList([]);
        setChannelProductValueList([]);
        setChannelProductQuantityList([]);
      }
    } catch (error) {
      console.error("Error fetching channel sales:", error);
    }
  };

  const setSelectedDistributor = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      disID: value,
    }));
    let body = {
      ...searchParams,
      disID: value,
    };
    fetchChannelDashboard(body);
  };

  const setSelectedDistributorInventory = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      disInvID: value,
    }));
    let body = {
      ...searchParams,
      disInvID: value,
    };
    fetchChannelDashboard(body);
  };

  const setSelectedFocusModelGroup = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      prdID: value,
    }));
    let body = {
      ...searchParams,
      prdID: value,
    };
    fetchChannelDashboard(body);
  };

  const setSelectedRetailer = (value, type) => {
    let Id = value?.retID || 0;
    let topBottom = type || 0;
    setSearchParams((prev) => ({
      ...prev,
      retID: Id,
      topBottom: topBottom,
    }));
    let body = {
      ...searchParams,
      retID: Id,
      topBottom: topBottom,
    };
    fetchChannelDashboard(body);
  };

  useEffect(() => {
    fetchNSPDropdownHierarchyList();
    let body = {
      ...searchParams,
    };
    fetchChannelDashboard(body);
    fetchChannelDashboardListDropDown();
    fetchFocusModelGroupDropDown();
  }, []);

  // Add these states for pagination

  // Replace the existing dummy data with this more realistic data

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",

          // pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
        }}
      >
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
          <Grid item xs={12} mt={0} mb={0} ml={0}>
            <GreetingHeader
              userName={Store.userName}
              lastLogin={Store.lastLogin}
            />
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
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label={NSMPlaceholder}
                      options={NSPDropdownHierarchyList}
                      placeholder={`SELECT ${NSMPlaceholder}`}
                      backgroundColor={WHITE}
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
                        NSPDropdownHierarchyList.find(
                          (option) =>
                            option.locationID === searchParams.level1ID
                        ) || null
                      }
                      loading={NSPLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      disabled={!searchParams.level1ID}
                      label={`SELECT ${RSMPlaceholder}`}
                      options={RSMDropdownHierarchyList}
                      backgroundColor={WHITE}
                      placeholder={`SELECT ${RSMPlaceholder}`}
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
                        RSMDropdownHierarchyList.find(
                          (option) =>
                            option.locationID === searchParams.level2ID
                        ) || null
                      }
                      loading={RSMLoading}
                    />
                  </Grid>
                </Grid>

                {/* Add Distributor Sales Chart */}
                <Grid container spacing={2} mb={2} mt={2}>
                  <Grid item xs={12} md={8} lg={8} xl={8}>
                    <ChannelDistributorSales
                      distributorSaleQuantityList={distributorSaleQuantityList}
                      distributorSaleValueList={distributorSaleValueList}
                      mtdDistributorSaleQuantityList={
                        mtdDistributorSaleQuantityList
                      }
                      mtdDistributorSaleValueList={mtdDistributorSaleValueList}
                      distributorSaleDropdownList={distributorSaleDropdownList}
                      setValue={setSelectedDistributor}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={4} xl={4}>
                    <ChannelDistributorInventaryChart
                      height={300}
                      inventoryDistributorDropdownList={
                        inventoryDistributorDropdownList
                      }
                      distributorInventaryValueList={
                        distributorInventaryValueList
                      }
                      distributorInventaryQuantityList={
                        distributorInventaryQuantityList
                      }
                      distributorInventaryWOIValueList={
                        distributorInventaryWOIValueList
                      }
                      distributorInventaryWOIQuantityList={
                        distributorInventaryWOIQuantityList
                      }
                      setValue={setSelectedDistributorInventory}
                    />
                  </Grid>
                </Grid>

                {/* Add Product Sales Chart */}
                <Grid container spacing={4} mb={2}>
                  <Grid item xs={12} md={5.9} lg={5.9} xl={5.9}>
                    <ChannelProductSalesCharts
                      focusModelGroupDropdownList={focusModelGroupDropdownList}
                      focusModelGraphQuantityList={focusModelGraphQuantityList}
                      focusModelGraphValueList={focusModelGraphValueList}
                      focusModelMTDQuantityList={focusModelMTDQuantityList}
                      focusModelMTDValueList={focusModelMTDValueList}
                      setValue={setSelectedFocusModelGroup}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.9} lg={5.9} xl={5.9}>
                    <ChannelRetailerSalesChart
                      retailerGroupTOPDropdownList={
                        retailerGroupTOPDropdownList
                      }
                      retailerGroupBOTTOMDropdownList={
                        retailerGroupBOTTOMDropdownList
                      }
                      retailerIndividualTOPDropdownList={
                        retailerIndividualTOPDropdownList
                      }
                      retailerIndividualBOTTOMDropdownList={
                        retailerIndividualBOTTOMDropdownList
                      }
                      retailerGroupValueList={retailerGroupValueList}
                      retailerGroupQuantityList={retailerGroupQuantityList}
                      mtdRetailerGroupValueList={mtdRetailerGroupValueList}
                      mtdRetailerGroupQuantityList={
                        mtdRetailerGroupQuantityList
                      }
                      retailerIndividualValueList={retailerIndividualValueList}
                      retailerIndividualQuantityList={
                        retailerIndividualQuantityList
                      }
                      mtdRetailerIndividualValueList={
                        mtdRetailerIndividualValueList
                      }
                      mtdRetailerIndividualQuantityList={
                        mtdRetailerIndividualQuantityList
                      }
                      setValue={setSelectedRetailer}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={12} xl={12}>
                    <ChannelDistributorList
                      channelDistributorValueList={channelDistributorValueList}
                      channelDistributorQuantityList={
                        channelDistributorQuantityList
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ChannelProductList
                      channelProductValueList={channelProductValueList}
                      channelProductQuantityList={channelProductQuantityList}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ChannelRetailerList
                      channelRetailerValueList={channelRetailerValueList}
                      channelRetailerQuantityList={channelRetailerQuantityList}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Add ISP Zero Sale Table */}
        </Grid>
      </Grid>
    </>
  );
};

export default ChannelsDashBoard;
