import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import ToggleSection from "./ToggleSection";
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import EditIcon from "@mui/icons-material/Edit";

const toggleItems = [
  {
    id: "help",
    label: "HELP",
    hasInnerContent: true,
    content: [
      { title: "FEEDBACK", enabled: true },
      { title: "TUTORIAL", enabled: true },
      { title: "PRODUCT DOCUMENTATION", enabled: true },
    ],
  },
  {
    id: "appSetting",
    label: "APP SETTING",
    hasInnerContent: true,
    content: [
      { title: "WEB", enabled: true },
      { title: "MOBILE", enabled: true },
    ],
  },
  {
    id: "organization",
    label: "ORGANIZATION",
    hasInnerContent: true,
    content: [
      { title: "ANNOUNCEMENT", enabled: true },
      { title: "COMPANY INFO", enabled: true },
      { title: "GEOGRAPHY", enabled: true },
      { title: "HIERARCHY", enabled: true },
      { title: "ORGANIZATION", enabled: true },
      { title: "QUERY", enabled: true },
    ],
  },
  {
    id: "people",
    label: "PEOPLE",
    hasInnerContent: true,
    content: [
      { title: "SALESMAN", enabled: true },
      { title: "ISP", enabled: true },
      { title: "BANKING WEIGHTAGE", enabled: true },
      { title: "ORG PEOPLE", enabled: true },
    ],
  },
  {
    id: "channel",
    label: "CHANNEL",
    hasInnerContent: true,
    content: [
      { title: "RETAILER", enabled: true },
      { title: "CHANNEL", enabled: true },
    ],
  },
  {
    id: "product",
    label: "PRODUCT",
    hasInnerContent: true,
    content: [
      { title: "UPLOAD", enabled: true },
      { title: "BRAND", enabled: true },
      { title: "CATEGORY", enabled: true },
      { title: "SUBCATEGORY", enabled: true },
      { title: "MODEL", enabled: true },
      { title: "COLOR", enabled: true },
      { title: "SKU", enabled: true },
      { title: "PRICE", enabled: true },
      { title: "FOCUS MODEL", enabled: true },
    ],
  },
  {
    id: "module",
    label: "MODULE",
    hasInnerContent: true,
    content: [
      { title: "INVENTORY", enabled: true },
      { title: "STOCK ADJUSTMENT REASON", enabled: true },
      { title: "AI NORMS", enabled: true },
      { title: "GTN", enabled: true },
      { title: "STOCK ADJUSTMENT", enabled: true },
      { title: "FINANCE", enabled: true },
      { title: "FINANCE API BLOCK ACCESS", enabled: true },
      { title: "SERVIFY OFFER", enabled: true },
      { title: "GTN UPLOAD", enabled: true },
      { title: "UNBLOCK FINANCE UMI", enabled: true },
      { title: "ATTENDANCE", enabled: true },
      { title: "ATTENDANCE UPDATE", enabled: true },
      { title: "BALANCE LEAVE UPDATE", enabled: true },
      { title: "UMI BINDING", enabled: true },
      { title: "LEAVE TYPE", enabled: true },
      { title: "LEAVE ALLOCATION", enabled: true },
      { title: "COMPETITION", enabled: true },
      { title: "BRAND", enabled: true },
      { title: "CATEGORY", enabled: true },
      { title: "MODEL", enabled: true },
      { title: "PRICE BAND", enabled: true },
      { title: "L&D", enabled: true },
      { title: "CATEGORY", enabled: true },
      { title: "MANAGE BRAND", enabled: true },
      { title: "CONTENT", enabled: true },
      { title: "ASSESSMENT", enabled: true },
      { title: "BRAND", enabled: true },
      { title: "DEMO PLANOGRAM", enabled: true },
      { title: "MANAGE AUDIT", enabled: true },
      { title: "LTL/S ISSUE", enabled: true },
      { title: "MERCHANDISING", enabled: true },
      { title: "TASK TYPE", enabled: true },
      { title: "MANAGE TASK", enabled: true },
      { title: "SURVEY", enabled: true },
      { title: "MANAGE SURVEY", enabled: true },
    ],
  },
  {
    id: "transaction",
    label: "TRANSACTION",
    hasInnerContent: true,
    content: [
      { title: "SALE", enabled: true },
      { title: "PRIMARY", enabled: true },
      { title: "INTERMEDIARY", enabled: true },
      { title: "SECONDARY", enabled: true },
      { title: "TERTIARY", enabled: true },
      { title: "RETURN", enabled: true },
      { title: "SALE", enabled: true },
      { title: "INTERMEDIARY", enabled: true },
      { title: "SECONDARY", enabled: true },
    ],
  },
  {
    id: "reports",
    label: "REPORTS",
    hasInnerContent: true,
    content: [
      { title: "SALE", enabled: true },
      { title: "SALES REPORT", enabled: true },
      { title: "ISP SALE REPORT", enabled: true },
      { title: "PRIMARY TO TERTIARY TRACK", enabled: true },
      { title: "UNIQUE SALES REPORT", enabled: true },
      { title: "MANAGE BRAND", enabled: true },
      { title: "COMPETITION SALE REPORT", enabled: true },
      { title: "STOCK", enabled: true },
      { title: "STOCK", enabled: true },
      { title: "SALES CHANNEL STOCK SB", enabled: true },
      { title: "STOCK ADJUSTMENT REPORT", enabled: true },
      { title: "SERIAL NO MOVEMENT", enabled: true },
      { title: "APP", enabled: true },
      { title: "PRE BOOKING", enabled: true },
      { title: "FEEDBACK", enabled: true },
      { title: "SURVEY", enabled: true },
      { title: "L&D ASSESSMENT", enabled: true },
      { title: "MERCHANDIZING REPORT", enabled: true },
      { title: "BANKING REPORT", enabled: true },
      { title: "RETAIL", enabled: true },
      { title: "DEMO AUDIT REPORT", enabled: true },
      { title: "DEMO PRODUCTIVITY", enabled: true },
      { title: "AUDIT REPORT", enabled: true },
      { title: "TARGET & INCENTIVE", enabled: true },
      { title: "TARGET VS ACH REPORT", enabled: true },
      { title: "ATTENDANCE", enabled: true },
      { title: "ATTENDANCE REPORT", enabled: true },
      { title: "LEAVE REPORT", enabled: true },
      { title: "USER REPORTS", enabled: true },
      { title: "ORG HIERARCHY MAPPING", enabled: true },
      { title: "USER TRACK", enabled: true },
      { title: "USER LAGCARD", enabled: true },
      { title: "LAST LOGIN", enabled: true },
      { title: "FINANCE", enabled: true },
      { title: "SERVIFY UMI EXCHANGE", enabled: true },
      { title: "GTN PAYOUT", enabled: true },
      { title: "MISC", enabled: true },
      { title: "ACTIVATION FILE RECEIVED", enabled: true },
      { title: "SAP INTEGRATION FILE", enabled: true },
      { title: "RELIANCE API STATUS", enabled: true },
      { title: "LOG REPORT", enabled: true },
    ],
  },
  {
    id: "targetsScheme",
    label: "TARGETS SCHEME",
    hasInnerContent: true,
    content: [
      { title: "TARGET", enabled: true },
      { title: "MANAGE TARGET", enabled: true },
      { title: "SCHEME", enabled: true },
      { title: "MANAGE SCHEME", enabled: true },
    ],
  },
];
const WebMenuMapping = () => {
  const [activeTab, setActiveTab] = React.useState("web-menu-setting");

  const tabs = [
    { label: "Web", value: "web-menu-setting" },
    { label: "Mobile", value: "mobile-menu-setting" },
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

  const reportsOption = [
    "Fixture Audit Report",
    "MEZ Audit Report",
    "Store Ops Report",
    "Competition Assest Report",
    "Visibility Audit Report",
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const isps = ["ISP One", "ISP Two", "ISP Three", "ISP Four", "ISP Five"];
    const ispCodes = ["ISP001", "ISP002", "ISP003", "ISP004", "ISP005"];
    const stores = [
      "Store One",
      "Store Two",
      "Store Three",
      "Store Four",
      "Store Five",
    ];
    const storeCodes = ["ST001", "ST002", "ST003", "ST004", "ST005"];
    const tsis = ["TSI One", "TSI Two", "TSI Three", "TSI Four", "TSI Five"];

    // Generate 50 rows of realistic data
    return Array(50)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        isp: isps[Math.floor(Math.random() * isps.length)],
        ispCode: ispCodes[Math.floor(Math.random() * ispCodes.length)],
        store: stores[Math.floor(Math.random() * stores.length)],
        storeCode: storeCodes[Math.floor(Math.random() * storeCodes.length)],
        auditDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        tsi: tsis[Math.floor(Math.random() * tsis.length)],
        tsiAuditDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        auditScore: Math.floor(Math.random() * 100) + "%",
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
        setFilteredRows([...rows]); // Reset to original order
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
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

    setFilteredRows(sortedRows);
  };

  // Add search/filter functionality
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.saleType ||
          row.column1
            .toLowerCase()
            .includes(searchValues.saleType.toLowerCase())) &&
        (!searchValues.region ||
          row.column2
            .toLowerCase()
            .includes(searchValues.region.toLowerCase())) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.serialType ||
          row.column6
            .toLowerCase()
            .includes(searchValues.serialType.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0); // Reset to first page when filtering
  };

  // Update the search button click handler
  const handleSearchClick = () => {
    const searchValues = {
      saleType: document.querySelector('[name="saleType"]')?.value || "",
      region: document.querySelector('[name="region"]')?.value || "",
      state: document.querySelector('[name="state"]')?.value || "",
      fromDate: document.querySelector('[name="fromDate"]')?.value || "",
      toDate: document.querySelector('[name="toDate"]')?.value || "",
      serialType: document.querySelector('[name="serialType"]')?.value || "",
    };
    handleSearch(searchValues);
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
        {/* Breadcrumbs Grid */}
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
          <Grid item xs={12} mt={1} mb={0} ml={1} pr={3}>
            <BreadcrumbsHeader pageTitle="App Settings" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Toggle Section */}

        {/* Rest of the content */}
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
                  title="Web Menu Mapping"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ROLE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="role"
                        options={reportsOption}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ASSIGN TO
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="assignTo"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        USER
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="user"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>

                  {/* Third Row - Buttons */}
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      // gap: { xs: 2, sm: 2 },
                    }}
                  >
                    <Grid item xs={12} sm={3} md={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        onClick={() => console.log("Upload clicked")}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={7} md={11}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        height="36px"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
                        fontSize="12px"
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

        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <ToggleSection toggleItems={toggleItems} />
        </Grid>
        {/* Add this after the NuralAccordion2 component */}
      </Grid>
    </>
  );
};

export default WebMenuMapping;
