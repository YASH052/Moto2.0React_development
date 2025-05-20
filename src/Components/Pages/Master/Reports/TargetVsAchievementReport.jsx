import {
  Grid,
  Typography,
  Button,
  /* Skeleton, */ TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import React, { /* useEffect, */ useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  // AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  // PRIMARY_LIGHT_GRAY,
  // SKELETON_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";

// Comment out API imports
// import {
//   GetSalerseport,
//   GetSalestype,
//   Regionmasterlist,
//   StateList,
// } from "../../../Api/Api";
import { MenuConstants } from "../../../Common/MenuConstants";
import {
  getCurrentMonthFirstDate,
  getTodayDate,
} from "../../../Common/commonFunction";
// import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import { useNavigate } from "react-router-dom";

// Import necessary icons
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const tabs = [
  {
    label: "Target vs Achievement Report",
    value: "target-vs-achievement-report",
  },
  { label: "Scheme Report", value: "scheme-report" },
];

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_PURPLE,
  marginBottom: "5px",
  fontWeight: 400,
};

// Define dummy data for table header style
const tableHeaderStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  backgroundColor: LIGHT_GRAY2,
  padding: "8px",
  borderBottom: `1px solid ${PRIMARY_BLUE2}`,
};

const TargetVsAchievementReport = () => {
  const navigate = useNavigate();
  // const generateDummyData = () => {
  //   const regions = ["North", "South", "East", "West", "Central"];
  //   const states = [
  //     "Maharashtra",
  //     "Gujarat",
  //     "Karnataka",
  //     "Tamil Nadu",
  //     "Delhi",
  //   ];
  //   const saleTypes = ["Direct", "Distributor", "Online", "Retail"];
  //   const serialTypes = ["A123", "B456", "C789", "D012", "E345"];

  //   return Array(50)
  //     .fill()
  //     .map((_, index) => ({
  //       id: `${1000 + index}`,
  //       column1: saleTypes[Math.floor(Math.random() * saleTypes.length)],
  //       column2: regions[Math.floor(Math.random() * regions.length)],
  //       column3: states[Math.floor(Math.random() * states.length)],
  //       column4: new Date(
  //         2024,
  //         Math.floor(Math.random() * 12),
  //         Math.floor(Math.random() * 28) + 1
  //       ).toLocaleDateString(),
  //       column5: Math.floor(Math.random() * 10000000),
  //       column6: serialTypes[Math.floor(Math.random() * serialTypes.length)],
  //       column7: `Product-${Math.floor(Math.random() * 100)}`,
  //       column8: Math.floor(Math.random() * 100),
  //       column9: `Status-${Math.floor(Math.random() * 3)}`,
  //     }));
  // };
  // const [state, setState] = useState([]);

  const [activeTab, setActiveTab] = React.useState(
    "target-vs-achievement-report"
  );
  const [isLoading, setIsLoading] = React.useState(false); // Set to false for UI visibility
  // const [error, setError] = React.useState(null);
  // const [salesType, setSalesType] = React.useState([]); // Provide dummy options
  const salesType = [
    { salesTypeID: 1, salesTypeName: "Type A" },
    { salesTypeID: 2, salesTypeName: "Type B" },
  ];
  // const [rows, setRows] = React.useState(generateDummyData());
  // const [filteredRows, setFilteredRows] = React.useState(rows);
  const filteredRows = [
    // Provide minimal dummy data for table structure
    {
      sNo: 1,
      date: "01/07/2024",
      userCode: "U001",
      userName: "John Doe",
      role: "Sales Rep",
      worksAt: "Office A",
      state: "CA",
      city: "LA",
      inTime: "09:00",
      outTime: "17:00",
      timeSpend: "8",
      attendanceStatus: "Present",
      image: null,
    },
    {
      sNo: 2,
      date: "01/07/2024",
      userCode: "U002",
      userName: "Jane Smith",
      role: "Manager",
      worksAt: "Office B",
      state: "NY",
      city: "NYC",
      inTime: "09:30",
      outTime: "17:30",
      timeSpend: "8",
      attendanceStatus: "Present",
      image: "./Icons/Footer.svg",
    },
  ];
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  // const [region, setRegion] = useState([]);
  const state = [
    // Provide dummy options
    { stateID: 1, stateName: "California" },
    { stateID: 2, stateName: "New York" },
  ];
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [code, setcode] = useState("");
  const [showStatus, setShowStatus] = useState(false);

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
  };
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  // const serialTypeOptions = [
  //   { id: 0, name: "Without Serial" },
  //   { id: 1, name: "With Serial" },
  // ];

  const [dateError, setDateError] = useState("");

  const handleStatus = (code, message) => {
    console.log("code", code, "message", message); // Keep console log for now
    // setStatusMessage(message);
    // setcode(code);
    // setShowStatus(true);
    // setTimeout(() => setShowStatus(false), 3000);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setDefaultLoading(true);
  //     setIsLoading(true);
  //     try {
  //       // await Promise.all([fetchSalesType(), fetchRegion(), fetchState()]);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //       setDefaultLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const fetchState = async () => {
  //   setIsLoading(true);
  //   let body = {
  //     State: "",
  //     CountryID: 0,
  //     RegionID: 0,
  //     PageIndex: 1,
  //     PageSize: 10,
  //     StateID: 0,
  //     CallType: 1,
  //   };
  //   try {
  //     // const response = await StateList(body);
  //     // if (response.statusCode == 200) {
  //     //   setState(response.stateMasterList);
  //     // }
  //     console.log("Fetching state..."); // Placeholder
  //   } catch (error) {
  //     console.error("Error fetching state:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchRegion = async () => {
  //   setIsLoading(true);
  //   let body = {
  //     Region: "",
  //     CallType: 1,
  //     pageIndex: 1,
  //     pageSize: 10,
  //     CountryID: 0,
  //   };
  //   try {
  //     // const response = await Regionmasterlist(body);
  //     // if (response.statusCode == 200) {
  //     //   setRegion(response.regionMasterList);
  //     // }
  //       console.log("Fetching region..."); // Placeholder
  //   } catch (error) {
  //     console.error("Error fetching region:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchSalesType = async () => {
  //   setIsLoading(true);
  //   let body = {
  //     salesChannelTypeId: 0,
  //     hierarchyLevelID: 0,
  //   };
  //   try {
  //     // const response = await GetSalestype(body);
  //     // if (response.statusCode == 200) {
  //     //   setSalesType(response.saletypelist);
  //     // }
  //     console.log("Fetching sales type..."); // Placeholder
  //   } catch (error) {
  //     console.error("Error fetching sales type:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSearchChange = (field, value, selectedOption = null) => {
    console.log("Search change:", field, value, selectedOption); // Keep console log
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));

    // switch (field) {
    //   case "salesType":
    //     setSelectedSaleType(selectedOption);
    //     break;
    //   case "stateId":
    //     setSelectedState(selectedOption);
    //     break;
    //   default:
    //     break;
    // }
  };

  const handleSearch = async () => {
    console.log("Handling search..."); // Placeholder
    // setShowStatus(false);
    // setDefaultLoading(true);
    // setIsLoading(true);
    // const formattedParams = {
    //   ...searchParams,
    //   datefrom: searchParams.datefrom
    //     ? new Date(searchParams.datefrom.setHours(12, 0, 0, 0))
    //         .toISOString()
    //         .split("T")[0]
    //     : null,
    //   dateTo: searchParams.dateTo
    //     ? new Date(searchParams.dateTo.setHours(12, 0, 0, 0))
    //         .toISOString()
    //         .split("T")[0]
    //     : null,
    //   salesType: selectedSaleType?.salesTypeID || 1,
    //   stateId: selectedState?.stateID || 0,
    // };

    // try {
    //   // let res = await GetSalerseport(formattedParams);
    //   // if (res.statusCode == 200) {
    //   //   window.location.href = res.filepathlink;
    //   //   handleStatus(res.statusCode, res.statusMessage);
    //   // } else {
    //   //   handleStatus(res.statusCode, res.statusMessage);
    //   // }
    // } catch (error) {
    //   console.log(error);
    //   // handleStatus(
    //   //   error.response.data.status,
    //   //   MenuConstants.somethingWentWrong
    //   // );
    // } finally {
    //   setIsLoading(false);

    //   setDefaultLoading(false);
    // }
  };

  const handleFromDateChange = (newValue) => {
    console.log("From date change:", newValue); // Keep console log
    setDateError("");
    if (searchParams.dateTo && newValue > searchParams.dateTo) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    handleSearchChange("datefrom", newValue);
  };

  const handleToDateChange = (newValue) => {
    console.log("To date change:", newValue); // Keep console log
    setDateError("");
    if (searchParams.datefrom && newValue < searchParams.datefrom) {
      setDateError("To date cannot be less than From date");
      return;
    }
    handleSearchChange("dateTo", newValue);
  };

  const handleCancel = () => {
    console.log("Handling cancel..."); // Placeholder
    setSearchParams(initialSearchParams);
    setSelectedSaleType(null);
    setSelectedState(null);
    setDateError("");
    setStatusMessage("");
    setcode("");
    setShowStatus(false);
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    console.log("Tab changed to:", newValue); // Placeholder
    // navigate(`/${newValue}`);
  };

  // Dummy sort state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // Dummy pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRecords = filteredRows.length; // Use dummy data length
  const [isSearchLoading, setIsSearchLoading] = useState(false); // Set to false for UI
  const SKELETON_ROWS = 5; // Define if needed for skeleton display logic
  const [customPageInput, setCustomPageInput] = useState("");

  // Dummy mapping for sort
  const columnMapping = {
    "S.NO": "sNo",
    DATE: "date",
    "USER CODE": "userCode",
    "USER NAME": "userName",
    ROLE: "role",
    "WORKS AT": "worksAt",
    STATE: "state",
    CITY: "city",
    "IN TIME": "inTime",
    "OUT TIME": "outTime",
    "TIME SPEND (HRS)": "timeSpend",
    "ATTENDANCE STATUS": "attendanceStatus",
  };

  const handleSort = (header) => {
    const key = columnMapping[header];
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    console.log(`Sorting by ${key} ${direction}`);
    // Add actual sorting logic if needed for dummy data display
  };

  // Dummy pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("Page changed to:", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    console.log("Rows per page changed to:", parseInt(event.target.value, 10));
  };
  const handleJumpToFirst = () => {
    setPage(0);
    console.log("Jump to first page");
  };

  const handleJumpToLast = () => {
    const lastPage = Math.max(0, Math.ceil(totalRecords / rowsPerPage) - 1);
    setPage(lastPage);
    console.log("Jump to last page:", lastPage);
  };
  const handleCustomPageInputChange = (event) => {
    setCustomPageInput(event.target.value);
  };

  const handleCustomPageKeyPress = (event) => {
    if (event.key === "Enter") {
      handlePageSearch();
    }
  };

  const handlePageSearch = () => {
    const pageNumber = parseInt(customPageInput, 10);
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      console.log("Jump to page:", pageNumber);
    } else {
      console.log("Invalid page number:", customPageInput);
      // Optionally show an error message
    }
    setCustomPageInput(""); // Clear input after search
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
          <BreadcrumbsHeader pageTitle="Target & Incentive" />
        </Grid>

        <Grid item xs={12} ml={1}>
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
          <p>Loading form...</p> // Replace FormSkeleton
        ) : (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                  <>
                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 3, md: 0 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TARGET FOR
                        </Typography>
                        <NuralAutocomplete
                          label="Sale Type"
                          options={salesType} // Use dummy data
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
                              newValue?.salesTypeID || null, // Use null or a default ID
                              newValue
                            );
                            setSelectedSaleType(newValue); // Keep local state update
                          }}
                          value={selectedSaleType}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TARGET NAME
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="State"
                          options={state} // Use dummy data
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
                            setSelectedState(newValue); // Keep local state update
                          }}
                          value={selectedState}
                          placeholder="SELECT"
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TARGET CATEGORY
                        </Typography>
                        <NuralAutocomplete // Using state data as placeholder
                          width="100%"
                          label="State"
                          options={state} // Use dummy data
                          getOptionLabel={(option) => option.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            // handleSearchChange( // Assuming this should be different
                            //   "categoryId",
                            //   newValue?.stateID || 0,
                            //   newValue
                            // );
                            console.log("Target Category selected:", newValue);
                          }}
                          // value={ // Need a separate state for this if required
                          //   state.find(
                          //     (option) =>
                          //       option.stateID === searchParams.categoryId // Assuming categoryId exists
                          //   ) || null
                          // }
                          placeholder="SELECT"
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 3, md: 0 },
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
                          FROM DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.datefrom}
                          onChange={handleFromDateChange}
                          error={!!dateError}
                        />
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
                          TO DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.dateTo}
                          onChange={handleToDateChange}
                          error={!!dateError}
                        />
                      </Grid>
                      {dateError && (
                        <Grid item xs={12}>
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: -1,
                            }}
                          >
                            {dateError}
                          </Typography>
                        </Grid>
                      )}
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
                          onClick={handleCancel} // Keep handler
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={9} md={11}>
                        <NuralTextButton
                          icon={"./Icons/searchIcon.svg"}
                          iconPosition="right"
                          height="36px"
                          backgroundColor={PRIMARY_BLUE2}
                          color="#fff"
                          width="100%"
                          fontSize="12px"
                          onClick={() => {
                            if (dateError) {
                              handleStatus(dateError, "error"); // Use simplified handler
                              return;
                            }
                            handleSearch(); // Use simplified handler
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
      <Grid item xs={12}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(100vh - 200px)", // Adjusted to account for headers
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
                  colSpan={13}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    borderBottom: "none",
                    boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
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
                {[
                  "S.NO",
                  "DATE",
                  "USER CODE",
                  "USER NAME",
                  "ROLE",
                  "WORKS AT",
                  "STATE",
                  "CITY",
                  "IN TIME",
                  "OUT TIME",
                  "TIME SPEND (HRS)",
                  "ATTENDANCE STATUS",
                ].map((header) => (
                  <TableCell
                    key={header}
                    onClick={() => handleSort(header)} // Keep handler
                    sx={{
                      ...tableHeaderStyle,
                      cursor: "pointer",
                      position: "sticky",
                      top: "45px", // Adjusted top position
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 2,
                    }}
                  >
                    <Grid
                      container
                      display={"flex"}
                      width={"max-content"}
                      alignItems="center"
                      spacing={1.5}
                    >
                      <Grid item>{header}</Grid>
                      <Grid item>
                        {sortConfig.key === columnMapping[header] ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUpwardIcon
                              sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                            />
                          ) : (
                            <ArrowDownwardIcon
                              sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                            />
                          )
                        ) : (
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            sx={{ height: 16, width: 16, ml: -1 }}
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
                    </Grid>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    top: "45px", // Adjusted top position
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 2,
                    width: "60px", // Ensure width consistency
                  }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>IMAGE</Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isSearchLoading ? (
                // Show skeleton rows while loading
                Array(SKELETON_ROWS)
                  .fill(0)
                  .map((_, index) => (
                    // <TableRowSkeleton key={index} columns={13} />
                    <TableRow key={index}>
                      <TableCell colSpan={13}>Loading...</TableCell>
                    </TableRow> // Placeholder skeleton
                  ))
              ) : filteredRows.length === 0 ? ( // Keep no records found message
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Apply pagination to dummy data
                  .map((row, index) => (
                    <TableRow key={index} sx={{ fontSize: "10px" }}>
                      <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                        {row.sNo || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.date || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.userCode || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.userName || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.role || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.worksAt || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.state || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.city || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.inTime || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.outTime || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.timeSpend || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.attendanceStatus || MenuConstants.emptyText}
                      </TableCell>
                      <TableCell sx={{ padding: "8px", fontSize: "10px" }}>
                        {row.image ? (
                          <img
                            src={row.image}
                            alt="attendance"
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              objectFit: "cover",
                            }}
                            onClick={() => window.open(row.image, "_blank")}
                          />
                        ) : (
                          <img
                            src="./Icons/view.svg"
                            alt="view"
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          {/* Custom Pagination */}
          <Grid
            container
            sx={{
              p: 1,
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              bottom: 0,
              backgroundColor: LIGHT_GRAY2,
              zIndex: 1000, // Ensure pagination is above table content
            }}
          >
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
                  {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
                      onClick={
                        () => handleChangeRowsPerPage({ target: { value } }) // Keep handler
                      }
                      sx={{
                        minWidth: "25px",
                        height: "24px",
                        padding: "4px",
                        borderRadius: "50%",
                        backgroundColor:
                          rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                        color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                        fontSize: "12px",
                        "&:hover": {
                          backgroundColor:
                            rowsPerPage === value
                              ? PRIMARY_BLUE2
                              : "rgba(0, 0, 0, 0.04)", // Add hover effect for non-selected
                        },
                        mx: 0.5,
                        "&:focus": {
                          outline: "none",
                        },
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
                }}
                onClick={handleJumpToFirst} // Keep handler
              >
                JUMP TO FIRST
              </Typography>
              <IconButton
                onClick={() => handleChangePage(null, page - 1)} // Keep handler
                disabled={page === 0} // Keep disabled logic
                sx={{
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                PAGE {page + 1}
              </Typography>

              <IconButton
                sx={{
                  cursor: "pointer",
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={() => handleChangePage(null, page + 1)} // Keep handler
                disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1} // Keep disabled logic
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
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={handleJumpToLast} // Keep handler
                variant="body2"
              >
                JUMP TO LAST
              </Typography>
              <input
                type="number"
                placeholder="JUMP TO PAGE"
                min={1}
                max={Math.ceil(totalRecords / rowsPerPage)} // Keep max calculation
                value={customPageInput} // Bind value
                onChange={handleCustomPageInputChange} // Keep handler
                onKeyPress={handleCustomPageKeyPress} // Keep handler
                style={{
                  width: "100px",
                  height: "24px",
                  fontSize: "8px",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  textAlign: "center",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                  backgroundColor: LIGHT_GRAY2,
                  "&::placeholder": {},
                  outline: "none",
                  "&:focus": {
                    outline: "none",
                  },
                }}
              />
              <Grid
                mt={1}
                onClick={handlePageSearch} // Keep handler
              >
                <img
                  src="./Icons/footerSearch.svg"
                  style={{ cursor: "pointer" }}
                  alt="arrow"
                />
              </Grid>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default TargetVsAchievementReport;
