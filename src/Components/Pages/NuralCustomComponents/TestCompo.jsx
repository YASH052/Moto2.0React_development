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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Documentation Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
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
      </Paper>

      {/* Components Showcase Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
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
      </Paper>

      <NuralNotificationPanel
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
      />
      <Grid
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
      </Grid>

      <Box
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
      </Box>
    </Container>
  );
};

export default TestCompo;
