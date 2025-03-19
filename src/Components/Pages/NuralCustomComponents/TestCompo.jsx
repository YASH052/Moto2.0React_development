import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import NuralAutocomplete from "./NuralAutocomplete";
import CustomTextField from "./NuralTextField";
import NuralButton from "./NuralButton";
import NuralRadioButton from "./NuralRadioButton";
import NuralAccordion from "./NuralAccordion";
import NuralTextButton from "./NuralTextButton";
import NuralFileUpload from "./NuralFileUpload";
import NuralUploadFormat from "./NuralUploadFormat";
import NuralUploadStatus from "./NuralUploadStatus";
import NuralAccordion2 from "./NuralAccordion2";
import NuralKYCAccordion from "./NuralKYCAccordion";
import NuralLoginTextField from "./NuralLoginTextField";
import {
  AQUA,
  DARK_PURPLE,
  BLUE_COLOR,
  MEDIUM_BLUE,
  LIGHT_GRAY2,
} from "../../Common/colors";
import NuralNotificationPanel from "./NuralNotificationPanel";
import NuralActivityPanel from "./NuralActivityPanel";
import NuralAccordionItem from "./NuralAccordionItem";
import NuralQuickLinks from "./NuralQuickLinks";
import NuralCalendar from "./NuralCalendar";
import SalesTrendGraph from "./DashboardWidgets/SalesTrendGraph";
import TargetAchievementGraph from "./DashboardWidgets/TargetAchievement";
import SalesMetricsGrid from "./DashboardWidgets/SalesMetricsGrid";
import CounterShare from "./DashboardWidgets/CounterShare";
import FocusModelPerformance from "./DashboardWidgets/FocusModelPerformance";
import RankingCard from "./DashboardWidgets/RankingCard";
import InfoCard from "./DashboardWidgets/InfoCard";
import AttendanceOverview from "./DashboardWidgets/AttendanceOverview";
import NsmTrendChart from "./DashboardWidgets/NsmTrendChart";
import SalesDonutChart from "./DashboardWidgets/SalesDonutChart";
import SelectionPanel from "./SelectionPanel";
import NuralExport from "./NuralExport";
import NuralReports from "./NuralReports";

const TestCompo = () => {
  const quickLinks = ["Quick Link 1", "Quick Link 2", "Quick Link 3"];
  const modelData = [
    {
      name: "Model Name",
      schemeInfo: "SCHEME INFO",
    },
    {
      name: "Model Name",
      schemeInfo: "SCHEME INFO",
    },
    {
      name: "Model Name",
      schemeInfo: "SCHEME INFO",
    },
    {
      name: "Model Name",
      schemeInfo: "SCHEME INFO",
    },
  ];
  // States
  const [uploadFormat, setUploadFormat] = useState("single");
  const [password, setPassword] = useState("");
  const [selectedPanFile, setSelectedPanFile] = useState(null);
  const [selectedGstFile, setSelectedGstFile] = useState(null);
  const [selectedAdditionalFile, setSelectedAdditionalFile] = useState(null);
  const [panValue, setPanValue] = useState("");
  const [gstValue, setGstValue] = useState("");
  const [additionalValue, setAdditionalValue] = useState("");

  // Templates data
  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("View Template 1"),
      onDownload: () => console.log("Download Template 1"),
    },
    {
      name: "Template 2",
      onView: () => console.log("View Template 2"),
      onDownload: () => console.log("Download Template 2"),
    },
  ];
  const data = [
    { date: "14/03", total: 3000, nsm1: 2000 },
    { date: "15/03", total: 9000, nsm1: 8000 },
    { date: "16/03", total: 4000, nsm1: 7000 },
    { date: "17/03", total: 6000, nsm1: 8000 },
    { date: "18/03", total: 8000, nsm1: 4000 },
    { date: "19/03", total: 9000, nsm1: 7000 },
    { date: "20/03", total: 8500, nsm1: 8000 },
  ];

  // KYC Fields configuration
  const kycFields = [
    {
      label: "PAN NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "pan",
      value: panValue,
      onChange: (e) => setPanValue(e.target.value),
      fileName: selectedPanFile?.name || "File Name",
      onFileSelect: (file) => setSelectedPanFile(file),
    },
    {
      label: "GST NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "gst",
      value: gstValue,
      onChange: (e) => setGstValue(e.target.value),
      fileName: selectedGstFile?.name || "File Name",
      onFileSelect: (file) => setSelectedGstFile(file),
    },
    {
      label: "ADDITIONAL FIELD",
      placeholder: "Enter value",
      name: "additional",
      value: additionalValue,
      onChange: (e) => setAdditionalValue(e.target.value),
      fileName: selectedAdditionalFile?.name || "File Name",
      onFileSelect: (file) => setSelectedAdditionalFile(file),
    },
  ];

  const sampleNotifications = [
    {
      title: "Today",
      header: "Notification Header",
      subheader: "This is the notification subheader",
      timestamp: new Date(),
      time: "12:30PM",
      selected: false,
      variant: "light",
    },
    {
      title: "Today",
      header: "Notification Header",
      subheader: "This is the notification subheader",
      timestamp: new Date(),
      time: "1:30PM",
      selected: false,
      variant: "dark",
    },
    {
      title: "Yesterday",
      header: "Notification Header",
      subheader: "This is the notification subheader",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      time: "JAN 1 2024",
      selected: true,
      variant: "med-light",
    },
  ];

  const handleDateSelect = (date) => {
    console.log("Selected date in TestCompo:", date.toISOString());
  };

  const handleMonthChange = (date) => {
    console.log("Month changed:", date.toISOString());
  };

  const handleYearChange = (date) => {
    console.log("Year changed:", date.toISOString());
  };

  const handleNavigate = (action, date) => {
    console.log("Navigation:", action, date.toISOString());
  };

  const TimeAnalysis = [
    {
      name: "9:15 AM",
      score: "LATE CHECK-INS",
    },
    {
      name: "6:45 PM",
      score: "EARLY CHECK-OUTS",
    },
    {
      name: "28 Mins.",
      score: "AVG. Break",
    },
  ];

  const rankings = [
    { name: "NSM 1", score: 340 },
    { name: "NSM 2", score: 280 },
    { name: "NSM 3", score: 100 },
  ];
  const brandData = {
    PRIMARY: { share: "140.15K", percentage: "17%" },
    SECONDARY: { share: "169K", percentage: "14%" },
    TERTIARY: { share: "151K", percentage: "18%" },
    QUATERNARY: { share: "150K", percentage: "21%" },
    QUINARY: { share: "90K", percentage: "8%" },
    OTHERS: { share: "139K", percentage: "23%" },
  };

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
  ];

  const complianceData2 = [
    {
      name: "8",
      score: "LATE CHECK-INS",
    },
    {
      name: "3",
      score: "EARLY CHECK-OUTS",
    },
    {
      name: "9:15 AM",
      score: "AVG. CHECK-IN",
    },
  ];
  const complianceData = [
    {
      name: "8",
      score: "LATE CHECK-INS",
    },
    {
      name: "6",
      score: "EARLY CHECK-OUTS",
    },
    {
      name: "28 Mins.",
      score: "AVG. DURATION",
    },
  ];

  const analysisData = [
    {
      name: "2.3 Days",
      score: "AVG RESPONSE TIME",
    },
    {
      name: "45%",
      score: "AVG IDLE TIME",
    },
    {
      name: "12%",
      score: "UNPLANNED LEAVES",
    },
  ];

  const attendanceOverviewData = {
    present: 85,
    total: 120,
    absent: 15,
    leave: 10,
    off: 5,
    closed: 5,
  };
  const databar = {
    labels: ["NSM 1", "NSM 2", "NSM 3", "NSM 4"],
    datasets: [
      {
        data: [110, 75, 150, 100],
        backgroundColor: ["#D3D3D3", "#00BCD4", "#D3D3D3"],
        barPercentage: 0.3,
        categoryPercentage: 0.8,
      },
      {
        data: [0, 20, 0, 0],
        backgroundColor: "#B2EBF2",
        barPercentage: 0.3,
        categoryPercentage: 0.8,
      },
      {
        data: [0, 20, 0, 0],
        backgroundColor: "#B2EBF2",
        barPercentage: 0.3,
        categoryPercentage: 0.8,
      },
      {
        data: [0, 20, 0, 0],
        backgroundColor: "#B2EBF2",
        barPercentage: 0.3,
        categoryPercentage: 0.8,
      },
    ],
  };
  const donutData = {
    labels: ["DIST 1", "DIST 2", "DIST 3", "DIST 4", "DIST 5", "OTHERS"],
    datasets: [
      {
        data: [30, 25, 20, 15, 7, 3],
        backgroundColor: [
          "#1a237e", // Dark blue
          "#283593",
          "#3949ab",
          "#3f51b5",
          "#7986cb",
          "#c5cae9",
        ],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const columns = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "city", label: "City" },
  ];
  const views = ["View 1", "View 2", "View 3"];
  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
      {/* Documentation Section */}
      {/* <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Components Documentation
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          Available Routes
        </Typography>
        <Box sx={{ pl: 2, mb: 4 }}>
          <ul>
            <li>
              <strong>/</strong> - Dashboard with welcome message
            </li>
            <li>
              <strong>/test</strong> - Components showcase (current page)
            </li>
            <li>
              <strong>/login</strong> - Login page
            </li>
            <li>
              <strong>/forgot-password</strong> - Password recovery
            </li>
            <li>
              <strong>/reset-password</strong> - Password reset
            </li>
          </ul>
        </Box>
      </Paper> */}

      {/* Components Showcase Section */}
      {/* <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Components Showcase
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nural Autocomplete
            </Typography>
            <NuralAutocomplete />
          </Grid>
          <Grid item xs={12} md={6}>
            <NuralUploadFormat
              title="Upload Format"
              backgroundColor={LIGHT_GRAY2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NuralAccordion2 title="Activations" width="100%" height="100%">
              Put any content here
            </NuralAccordion2>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Custom TextField
            </Typography>
            <CustomTextField />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nural Button
            </Typography>
            <NuralButton
              variant="outlined"
              color="#ffff"
              text="Proceed"
              backgroundColor={AQUA}
            >
              Proceed
            </NuralButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nural Radio Button
            </Typography>
            <NuralRadioButton
              options={[
                { value: "0", label: "Option 1" },
                { value: "1", label: "Option 2" },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nural Accordion
            </Typography>
            <NuralAccordion
              width="100%"
              title="Templates"
              templates={templates}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nural Text Button
            </Typography>
            <NuralTextButton
              icon={"./Icons/searchIcon.svg"}
              iconPosition="right"
              backgroundColor={DARK_PURPLE}
              color="#fff"
              width="100%"
            >
              SEARCH
            </NuralTextButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              File Upload
            </Typography>
            <NuralFileUpload
              width="100%"
              onChange={(file) => console.log("Selected file:", file)}
              accept=".pdf,.doc,.docx"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Status Examples
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <NuralUploadStatus
                status="failed"
                title="Upload Failed"
                actionText="RETRY UPLOAD"
                onAction={() => console.log("Retry clicked")}
                width="100%"
              />
              <NuralUploadStatus
                status="success"
                title="Upload Success"
                actionText="VIEW FILE"
                onAction={() => console.log("View clicked")}
                width="100%"
              />
              <NuralUploadStatus
                status="warning"
                title="Upload Pending"
                actionText="VIEW FILE"
                onAction={() => console.log("View clicked")}
                width="100%"
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              KYC Accordion
            </Typography>
            <NuralKYCAccordion width="100%" title="KYC" fields={kycFields} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Login TextField
            </Typography>
            <NuralLoginTextField
              type="password"
              placeholder="ENTER PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper> */}

      {/* <NuralNotificationPanel
        width="384px"
        height="962px"
        backgroundColor={BLUE_COLOR}
        padding="24px"
        borderRadius="12px"
        notifications={sampleNotifications}
        containerStyle={{
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
        itemStyle={{
          padding: "16px",
        }}
        iconStyle={{
          borderRadius: "8px",
        }}
        archiveStyle={{
          fontSize: "10px",
        }}
        titleStyle={{
          fontWeight: 600,
        }}
      /> */}
      {/* <Grid
        sx={{
          marginTop: "20px",
        }}
      >
        <NuralActivityPanel
          quickLinksContent={
            <NuralQuickLinks
              links={quickLinks}
              onLinkClick={(link) => console.log("Clicked:", link)}
            />
          }
        >
          <NuralAccordionItem title="TODAY" itemCount={4} models={modelData} />
        </NuralActivityPanel>
      </Grid> */}

      {/* <Box
        sx={{
          margin: "10px",
          maxWidth: "220px",
          "& .MuiOutlinedInput-root": {
            height: "25px",
          },
        }}
      >
        <NuralCalendar
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onNavigate={handleNavigate}
          initialDate={new Date()}
          minDate={new Date(2000, 0, 1)}
          maxDate={new Date(2024, 11, 31)}
          disabledDates={[new Date(2024, 2, 15)]}
          highlightedDates={[new Date(2024, 2, 20)]}
          yearRange={{
            start: 2000,
            end: new Date().getFullYear(),
          }}
          containerStyle={{
            backgroundColor: MEDIUM_BLUE,
          }}
          headerStyle={{
            padding: "0 8px",
          }}
          dayStyle={{
            fontWeight: 500,
          }}
          selectedDayStyle={{
            backgroundColor: AQUA,
            color: "#fff",
          }}
          disabledDayStyle={{
            opacity: 0.5,
          }}
        />
      </Box> */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <SalesTrendGraph
            width="400px"
            height="220px"
            paperBgColor={LIGHT_GRAY2}
            gap="15px"
            borderRadius="8px"
            data={data}
            title="Sales Trend"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <SalesTrendGraph
            width="400px"
            height="220px"
            paperBgColor={LIGHT_GRAY2}
            gap="15px"
            borderRadius="8px"
            data={data}
            title="ASP Trend"
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <SalesMetricsGrid metrics={salesMetrics} />
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} md={10} lg={8} xl={8}>
          <CounterShare data={data} />
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={5}>
        <Grid item xs={12} md={10} lg={8} xl={8}>
          <FocusModelPerformance data={data} />
        </Grid>
      </Grid>
      <Grid container spacing={1} mt={5}>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <RankingCard title="Ranking" data={rankings} />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <InfoCard title="Compliance" data={complianceData} />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <InfoCard title="Analysis" data={analysisData} />
        </Grid>

        <Grid item xs={12} md={4} lg={4} xl={4}>
          <InfoCard title="Compliance" data={complianceData2} />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <InfoCard title="Time Analysis" data={TimeAnalysis} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4} xl={4} mt={2}>
          <AttendanceOverview data={attendanceOverviewData} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4} xl={4} mt={2}>
          <NsmTrendChart data={databar} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4} xl={4} mt={2}>
          <SalesDonutChart data={donutData} brandData={brandData} />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
          <SelectionPanel columns={columns} views={views} />
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12} mt={0}>
          <NuralExport title="Export" columns={columns} views={views} />
        </Grid>

        <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
          <NuralReports title="Reports"  views={views} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestCompo;
