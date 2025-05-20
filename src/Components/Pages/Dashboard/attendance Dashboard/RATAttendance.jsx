import { Grid, Typography, Button, Stack, Paper } from "@mui/material";
import React, { useEffect } from "react";
import ISPZeroSaleTable from "../ISPZeroSaleTable.jsx";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../../Common/colors.js";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../../Common/TabsBar.jsx";

import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete.jsx";

import AttendanceChart from "../../NuralCustomComponents/DashboardWidgets/AttendanceChart.jsx";

import AttendanceChartWithData from "../../NuralCustomComponents/DashboardWidgets/AttendanceChartwithData.jsx";
import useHttp from "../../../../hooks.js/use-http.jsx";
import { attendanceDashboardAPI } from "../../Master/Competiton/api.jsx";
import Attendancetable from "./attendanceTable.jsx";
import { DashboardExportButton } from "../../../Common/DashboardExportButton.jsx";

const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];

const RATAttendance = () => {
  const [activeTab, setActiveTab] = React.useState("rat-attendance");
  const API = useHttp();
  const API2 = useHttp();
  const [ASMList, setASMList] = React.useState([]);
  const [TSMList, setTSMList] = React.useState([]);
  const [ISPLists, setISPLists] = React.useState([]);
  const [attendenceSummary, setAttendenceSummary] = React.useState([]);
  const [ISPAnalysisList, setISPAnalysisList] = React.useState([]);
  const [ispComplianceList, setISPComplianceList] = React.useState([]);
  const [ISPLeaveAnalysisList, setISPLeaveAnalysisList] = React.useState([]);
  const [ispAttendanceTypeWise, setISPAttendanceTypeWise] = React.useState([]);
  const [ispasmList, setISPASMList] = React.useState([]);
  const [isptsmList, setISPTSMList] = React.useState([]);
  const [ISPGraphList, setISPGraphList] = React.useState([]);
  const [ispAttendence, setISPAttendence] = React.useState([]);
  // Corrected Columns definition for ASM/TSM tables
  const ASMColumns = [
    { field: "hierarchyName", headerName: "NAME" },
    { field: "totalISP", headerName: "TOTAL" },
    { field: "present", headerName: "PRESENT" },
    { field: "absent", headerName: "ABSENT" },
    { field: "lateCount", headerName: "LATE" },
    { field: "leave", headerName: "LEAVE" },
    { field: "weeklyOff", headerName: "WEEKLY OFF" },
  ];

  // Updated Columns for ISP table to match API response
  const columns = [
    { field: "ispName", headerName: "ISP" },
    { field: "storeName", headerName: "STORE" },
    { field: "cityName", headerName: "CITY" },
  ];

  // Map API data to include 'id' field for the table component
  const formattedAsmRows = ispasmList.map((item) => ({
    ...item,
    id: item.entityId,
  }));
  const formattedTsmRows = isptsmList.map((item) => ({
    ...item,
    id: item.entityId,
  }));
  // Map ISP attendance data
  const formattedIspRows = ispAttendence.map((item, index) => ({
    ...item,
    id: index, // Use index as ID for ISP attendance rows
  }));

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
    API.sendRequest(
      attendanceDashboardAPI.dropdown,
      (response) => {
        console.log("response", response);
        if (response.statusCode === "200") {
          setASMList(response.ddlASMList || []);
          setTSMList(response.ddlTSMList || []);
          setISPLists(response.ddlISPList || []);
        } else {
          console.error(
            "Failed to fetch category dropdown:",
            response.statusMessage
          );
          setASMList([]);
          setTSMList([]);
          setISPLists([]);
        }
      },
      {
        hierarchyTypeID: 0, //4-ASM, 5-TSM
        orgId: 0,
      },
      null,
      (error) => {
        console.error("Error fetching category dropdown:", error);
        setASMList([]);
        setTSMList([]);
        setISPLists([]);
      }
    );
  }, []);
  useEffect(() => {
    API.sendRequest(
      attendanceDashboardAPI.ISPDashboard,
      (response) => {
        console.log("Dashboard API response", response);
        if (response.statusCode === "200") {
          setAttendenceSummary(response.ispOverViewList || []);
          setISPAnalysisList(response.ispAnalysisList || []);
          setISPComplianceList(response.ispComplianceList || []);
          setISPAttendanceTypeWise(response.ispAttendanceTypeWiseList || []);
          setISPGraphList(response.ispGraphList || []);
          setISPASMList(response.ispasmList || []);
          setISPTSMList(response.isptsmList || []);
          setISPLeaveAnalysisList(response.ispLeaveAnalysisList || []);
        } else {
          console.error(
            "Failed to fetch dashboard data:",
            response.statusMessage
          );
          setISPASMList([]);
          setISPTSMList([]);
          setAttendenceSummary([]);
          setISPAnalysisList([]);
          setISPComplianceList([]);
          setISPAttendanceTypeWise([]);
          setISPGraphList([]);
          setISPLeaveAnalysisList([]);
        }
      },
      {
        ASMID: 0,
        TSMID: 0,
        ISPID: 0,
        ParentEntityId: 484,
      },
      null,
      (error) => {
        console.error("Error fetching dashboard data:", error);
        setISPASMList([]);
        setISPTSMList([]);
        setAttendenceSummary([]);
        setISPAnalysisList([]);
        setISPComplianceList([]);
        setISPAttendanceTypeWise([]);
        setISPGraphList([]);
        setISPLeaveAnalysisList([]);
      }
    );
  }, []);
  useEffect(() => {
    API2.sendRequest(
      attendanceDashboardAPI.ISPAttendanceTypeWise,
      (response) => {
        console.log("Dashboard API response", response);
        if (response.statusCode === "200") {
          setISPAttendence(response.ispAttandanceList || []);
        } else {
          console.error(
            "Failed to fetch dashboard data:",
            response.statusMessage
          );
          setISPAttendence([]);
        }
      },
      {
        AttandanceType: 1, //1- present,2-absent,3-late,4-leave,5-WeeklyOff,6-StoreClosed/
      },
      null,
      (error) => {
        console.error("Error fetching dashboard data:", error);
        setISPAttendence([]);
      }
    );
  }, []);

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
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <Grid item xs={12} md={12} lg={12} mt={2}>
              <Stack direction="row" spacing={0}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "28px",
                    letterSpacing: "0%",
                  }}
                  color={DARK_PURPLE}
                >
                  Good Afternoon Name Surname
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "100%",
                    letterSpacing: "4%",
                    textTransform: "uppercase",
                    color: SECONDARY_BLUE,
                    m: 1,
                  }}
                >
                  LAST LOGIN : 120:05 PM, 20 MARCH 2025
                </Typography>
              </Stack>
            </Grid>
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
                      options={ASMList}
                      isOptionEqualToValue={(option, value) =>
                        option?.userID === value?.userID
                      }
                      getOptionLabel={(option) => option?.userName || ""}
                      onChange={(event, value) => {
                        console.log("value", value);
                      }}
                      value={ASMList.find((asm) => asm.userID === 17487)}
                      loading={API.isLoading}
                      width="100%"
                      label="All ASM"
                      placeholder="ALL ASM"
                      backgroundColor={WHITE}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      options={TSMList}
                      isOptionEqualToValue={(option, value) =>
                        option?.userID === value?.userID
                      }
                      getOptionLabel={(option) => option?.userName || ""}
                      onChange={(event, value) => {
                        console.log("value", value);
                      }}
                      value={TSMList.find((tsm) => tsm.userID === 17487)}
                      loading={API.isLoading}
                      width="100%"
                      label="All TSM"
                      placeholder="ALL TSM"
                      backgroundColor={WHITE}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      options={ISPLists}
                      isOptionEqualToValue={(option, value) =>
                        option?.ispid === value?.ispid
                      }
                      getOptionLabel={(option) => option?.ispName || ""}
                      onChange={(event, value) => {
                        console.log("value", value);
                      }}
                      value={ISPLists.find((isp) => isp.ispid === 24431)}
                      loading={API.isLoading}
                      width="100%"
                      label="ALL ISP"
                      backgroundColor={WHITE}
                      placeholder="ALL ISP"
                    />
                  </Grid>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  {/* <img src="/Images/Frame7.png" alt="Frame 7" />
                  <img src="/Images/Frame 7.png" alt="Frame 7" /> */}
                </Grid>
                {/* Export Buttons */}
                <Grid container spacing={0} ml={0} pr={0} mt={1} mb={2}>
                  <DashboardExportButton />
                </Grid>

                {/* Third Row - Buttons */}
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={0} ml={2} p={0}>
            <Grid item xs={9} md={9} lg={9} xl={9}>
              <AttendanceChart
                ISPGraphList={ISPGraphList}
                ISPOverviewList={attendenceSummary}
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3} xl={3}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 3,
                  backgroundColor: LIGHT_GRAY2, // light blue background
                  p: 2,
                  // width:"220px",
                  height: "90%",
                  mx: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  marginTop={3}
                  gutterBottom
                >
                  ISP Time Analysis
                </Typography>

                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography variant="caption">AVG. CHECK-IN</Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      {ISPAnalysisList[0]?.avgCheckin || 0}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      AVG. CHECK-OUT
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      {ISPAnalysisList[0]?.avgCheckOut || 0}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize={10}
                    >
                      AVG. BREAK
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: DARK_PURPLE,
                        fontFamily: "Manrope",
                        fontSize: "24px",
                        lineHeight: "13.66px",
                        letterSpacing: "0%",
                        alignSelf: "flex-start",
                        mb: 2,
                      }}
                      variant="h6"
                    >
                      {ISPAnalysisList[0]?.avgBreak || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={2} md={2} lg={2} xl={2}>
            <Paper
              //   elevation={3}
              sx={{
                borderRadius: 3,
                backgroundColor: LIGHT_GRAY2, // light blue background
                p: 2,
                height: 248,
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ISP Compliance
              </Typography>

              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="caption" fontSize={10}>
                    LATE CHECK-INS
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 1,
                    }}
                    variant="h6"
                  >
                    {ispComplianceList[0]?.lateCheckIn || 0}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={10}
                  >
                    EARLY CHECK-OUTS
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 1,
                    }}
                    variant="h6"
                  >
                    {ispComplianceList[0]?.earlyCheckOut || 0}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={10}
                  >
                    EXTENDED BREAKS &gt; 1 HOUR
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    {ispComplianceList[0]?.extendedBreak || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={2} md={2} lg={2} xl={2}>
            <Paper
              //   elevation={3}
              sx={{
                borderRadius: 3,
                backgroundColor: LIGHT_GRAY2, // light blue background
                p: 2,
                height: 248,
                marginLeft: 1,
                marginRight: 1,
                marginTop: 2,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ISP Leave analysis
              </Typography>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography variant="caption">AVG. Leave duration</Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    {ISPLeaveAnalysisList[0]?.avgLeaveDuration || 0}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="caption" color="text.secondary">
                    Leave utilization
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    {ISPLeaveAnalysisList[0]?.leaveUtilization || 0}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="caption" color="text.secondary">
                    Unplanned leaves
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: DARK_PURPLE,
                      fontFamily: "Manrope",
                      fontSize: "24px",
                      lineHeight: "13.66px",
                      letterSpacing: "0%",
                      alignSelf: "flex-start",
                      mb: 2,
                    }}
                    variant="h6"
                  >
                    {ISPLeaveAnalysisList[0]?.unPlannedLeave || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            width={"65%"}
            sx={{ marginRight: "0px", marginLeft: "0px" }}
          >
            <AttendanceChartWithData ispGraphList={ISPGraphList} />
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <Attendancetable
                columns={columns}
                rows={formattedIspRows}
                title="ISPs Absent [/Present/Weekly Off/Leave/Store Closed]"
              />
            </Grid>
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <Attendancetable
                columns={ASMColumns}
                rows={formattedAsmRows}
                title="Attendance : ASM"
                checkbox={true}
                onCheckboxChange={(row, checked) => {
                  console.log(
                    "ASM Table Row selected:",
                    row,
                    "Checked:",
                    checked
                  );
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={0} ml={2} mt={2} pr={2} mb={2}>
            <Grid item xs={12}>
              <Attendancetable
                columns={ASMColumns}
                rows={formattedTsmRows}
                title="Attendance : TSM"
                checkbox={true}
                onCheckboxChange={(row, checked) => {
                  console.log(
                    "TSM Table Row selected:",
                    row,
                    "Checked:",
                    checked
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RATAttendance;
