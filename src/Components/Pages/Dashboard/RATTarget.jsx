import { Grid, Typography, Button, Stack, Paper, Box } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import ISPPerformanceTable from "./ISPPerformanceTable";
import {
  AQUA_DARK2,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE
} from "../../Common/colors";
import { useNavigate } from "react-router-dom";
import TabsBar from "../../Common/TabsBar";
import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import SalesTrendGraph from "../NuralCustomComponents/DashboardWidgets/SalesTrendGraph";
import { GetDropdownHierarchyList, GetTargetDashboard } from "../../Api/Api";
import { DashboardExportButton } from "../../Common/DashboardExportButton.jsx";
import GreetingHeader from "../../Common/GreetingHeader";


const currentDate = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).toUpperCase()
const log = JSON.parse(localStorage.getItem("log"));
const userType = log?.userType; ///It can be RSM ASM TSM or ISP so now on the basis of userType we will show the dropdowns if userType is RSM then we will show the ASM TSM and ISP dropdowns if userType is ASM then we will show the TSM and ISP dropdowns if userType is TSM then we will show the ISP dropdowns if userType is ISP then we will not show the dropdowns
console.log(log, "log");

const RATTarget = () => {
  const [activeTab, setActiveTab] = React.useState("rat-target");
  const [flag, setFlag] = useState(false);
  const [asmList, setAsmList] = useState([]);
  const [tsmList, setTsmList] = useState([]);
  const [ispList, setIspList] = useState([]);
  const [targetDashboard, setTargetDashboard] = useState([]);
  const [targetDashboardBottom10, setTargetDashboardBottom10] = useState([]);

  const [searchParams, setSearchParams] = React.useState({
    asmID: 0,
    tsmID: 0,
    ispID: 0,
    topBottom: 0 /*0=TOP,1=BOTTOM*/,
    callType: 0 /*1=Export*/,
  });

  const {
    monthlyValueList,
    monthlyVolumeList,
    yearlyValueList,
    yearlyVolumeList,
    monthlyGraphList,
    targetISPPerformanceList,
  } = targetDashboard;
  console.log(searchParams, "searchParams");
  // console.log(tsmList, "tsmList");
  // console.log(ispList, "ispList");
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

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };
  {
    tabs.map((tab) => (
      <Button
        key={tab.value}
        variant={activeTab === tab.value ? "contained" : "outlined"}
        onClick={() => handleTabChange(tab.value)}
      >
        {tab.label}
      </Button>
    ));
  }
  const dataCards = [
    {
      title: "Total Volume",
      value: `${yearlyVolumeList?.[0]?.ytdVolume || "0/0"} Units`,
      subText: `${yearlyVolumeList?.[0]?.ytdVolumeAch?.toFixed(2) || 0
        }% OF TARGET`,
    },
    {
      title: "Monthly Volume",
      value: `${monthlyVolumeList?.[0]?.mtdVolume || "0/0"} Units`,
      subText: `${monthlyVolumeList?.[0]?.mtdVolumeAch?.toFixed(2) || 0
        }% OF TARGET`,
    },
    {
      title: "Total Value",
      value: `₹${yearlyValueList?.[0]?.ytdValue || "0/0"}`,
      subText: `${yearlyValueList?.[0]?.ytdValueAch?.toFixed(2) || 0
        }% OF TARGET`,
    },
    {
      title: "Monthly Value",
      value: `₹${monthlyValueList?.[0]?.mtdValue || "0/0"}`,
      subText: `${monthlyValueList?.[0]?.mtdValueAch?.toFixed(2) || 0
        }% OF TARGET`,
    },
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
  const handlePostAsmList = async (value) => {
    const body = {
      orgnHierarchyID: value,
    };

    const response = await GetDropdownHierarchyList(body);
    console.log(response, "ASM response");
    try {
      if (response.statusCode == 200) {
        setAsmList(response.hierarchyDropdownList);
      } else {
        setAsmList([]);
      }
    } catch (error) {
      console.log(error, "error fetching ASM list");
      setAsmList([]);
    }
  };
  const handlePostTsmList = async (asmId) => {
    if (!asmId) {
      setTsmList([]);
      return;
    }
    const body = {
      orgnHierarchyID: asmId,
    };

    const response = await GetDropdownHierarchyList(body);
    console.log(response, "TSM response");
    try {
      if (response.statusCode == 200) {
        setTsmList(response.hierarchyDropdownList);
      } else {
        setTsmList([]);
      }
    } catch (error) {
      console.log(error, "error fetching TSM list");
      setTsmList([]);
    }
  };

  const handlePostIspList = async (tsmId) => {
    if (!tsmId) {
      setIspList([]);
      return;
    }
    const body = {
      orgnHierarchyID: tsmId,
    };

    const response = await GetDropdownHierarchyList(body);
    console.log(response, "ISP response");
    try {
      if (response.statusCode == 200) {
        setIspList(response.hierarchyDropdownList);
      } else {
        setIspList([]);
      }
    } catch (error) {
      console.log(error, "error fetching ISP list");
      setIspList([]);
    }
  };

  const handleGetTargetDashboard = async () => {
    try {
      const response = await GetTargetDashboard(searchParams);
      if (response.statusCode == 200) {
        setTargetDashboard(response);
        console.log(response, "target dashboard response");
      } else {
        console.log(response, "error fetching target dashboard");
      }
    } catch (error) {
      console.log(error, "error fetching target dashboard");
    }
  };
  const handleGetTargetDashboardBottom10 = async () => {
    try {
      const response = await GetTargetDashboard({
        ...searchParams,
        topBottom: 1
      });
      if (response.statusCode == 200) {
        setTargetDashboardBottom10(response.targetISPPerformanceList);
        console.log(response, "target dashboard response");
      } else {
        console.log(response, "error fetching target dashboard");
      }
    } catch (error) {
      console.log(error, "error fetching target dashboard");
    }
  };
  const handleGetTargetDashboardExport = async () => {
    try {
      const exportParams = {
        ...searchParams,
        callType: 1,
      };

      console.log('Export params:', exportParams); // For debugging

      const response = await GetTargetDashboard(exportParams);
      if (response.statusCode == 200) {
        if (response.reportLink) {
          window.location.href = response.reportLink;
        } else {
          console.error('No report link in response');
        }
      } else {
        console.error('Error in export response:', response);
      }
    } catch (error) {
      console.error("Error fetching target dashboard excel:", error);
    }
  };

  // Initial ASM list load
  useEffect(() => {

    handleGetTargetDashboard();
  }, [flag]);

  useEffect(() => {
    if (log?.entityId) {
      handlePostAsmList(log.entityId);
    }

  }, []);


  // Handle ASM selection
  const handleAsmChange = async (value) => {
    // First, update the statealer
    // alert(value);
    setIspList([]);

    // Fetch TSM list for selected ASM if value exists
    if (value) {
      setSearchParams(prev => ({
        ...prev,
        asmID: value,
        tsmID: 0,
        ispID: 0

      }));
      handlePostTsmList(value);
      setFlag(!flag)
    } else {
      setTsmList([]);
      setSearchParams(prev => ({
        ...prev,
        asmID: 0,
        tsmID: 0,
        ispID: 0
      }));
      setFlag(!flag)
    }
  };

  // Handle TSM selection
  const handleTsmChange = async (value) => {

    if (value) {
      setSearchParams(prev => ({
        ...prev,
        tsmID: value,
        // Reset ISP
      }));
      handlePostIspList(value);
      setFlag(!flag)
      // Fetch dashboard with new TSM
    } else {
      setIspList([]);
      setSearchParams(prev => ({
        ...prev,
        tsmID: 0,
        ispID: 0
      }));
      setFlag(!flag)
      // If no TSM selected, fetch dashboard with default param
    }
  };

  // Handle ISP selection
  const handleIspChange = async (value) => {
    // Update state first
    setSearchParams(prev => ({
      ...prev,
      ispID: value || 0
    }));

    if (value) {

      setFlag(!flag)
    } else {

      setSearchParams(prev => ({
        ...prev,
        ispID: 0
      }));
      setFlag(!flag)
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
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
          <GreetingHeader
            userName={log?.userName}
            lastLogin={log?.lastLogin || currentDate} // You can pass actual last login time here
          />

          <Grid item xs={12} ml={1}>
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
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      label="ASM Name"
                      options={asmList}
                      placeholder="SELECT ASM"
                      width="100%"
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.locationID === value?.locationID
                      }
                      onChange={(event, newValue) => {
                        handleAsmChange(newValue?.locationID || null);
                      }}
                      value={
                        asmList.find(
                          (option) => option.locationID === searchParams.asmID
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      label="All TSM"
                      options={tsmList}
                      placeholder="SELECT TSM"
                      width="100%"
                      disabled={!searchParams.asmID}
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.locationID === value?.locationID
                      }
                      onChange={(event, newValue) => {
                        handleTsmChange(newValue?.locationID || null);
                      }}
                      value={
                        tsmList.find(
                          (option) => option.locationID === searchParams.tsmID
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="ALL ISP"
                      options={ispList}
                      disabled={!searchParams.tsmID}
                      backgroundColor={WHITE}
                      placeholder="ALL ISP"
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.locationID === value?.locationID
                      }
                      onChange={(event, newValue) => {
                        handleIspChange(newValue?.locationID || null);
                      }}
                      value={
                        ispList.find(
                          (option) => option.locationID === searchParams.ispID
                        ) || null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{
                    // mt: 2,
                    // mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Grid item>
                    <Typography
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 600,
                        fontSize: "12px",
                        color: SECONDARY_BLUE,
                        mb: 1,
                        mt: -3,
                        mr: 2
                      }}
                    >
                      {currentDate}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <DashboardExportButton
                      handleExportExcel={handleGetTargetDashboardExport}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container ml={1}>
            <Grid container spacing={3} md={6} lg={6} xl={6} sx={{ p: 1 }}>
              {dataCards.map((card, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: LIGHT_GRAY2,
                      height: "90%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle2" marginTop={2}>
                      <span
                        style={{
                          fontSize: "10px",
                          color: PRIMARY_BLUE2,
                          fontWeight: 600,
                        }}
                      >
                        {card.title}
                      </span>
                      <br />
                      <span
                        style={{
                          fontSize: "24px",
                          color: DARK_PURPLE,
                          fontWeight: 700,
                        }}
                      >
                        {card.value}
                      </span>
                      <br />
                      <span
                        style={{
                          fontSize: "10px",
                          color: AQUA_DARK2,
                          fontWeight: 500,
                        }}
                      >
                        {card.subText}
                      </span>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6} marginLeft={1} mt={1}>
              <SalesTrendGraph
                height="255px"
                paperBgColor={LIGHT_GRAY2}
                gap="15px"
                borderRadius="8px"
                data={monthlyGraphList}
                title="Sales Trend [Month]"
                subtitle="LAST 3 MONTHS TENDS"
                period="month"
                showLegend={true}
                caseType="target"
              />
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <ISPPerformanceTable
                targetISPPerformanceList={targetISPPerformanceList}
                targetDashboardBottom10={targetDashboardBottom10}
                handleGetTargetDashboardBottom10={handleGetTargetDashboardBottom10}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RATTarget;

