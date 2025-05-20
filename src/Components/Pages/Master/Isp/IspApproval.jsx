import { Grid, Typography, Button, Checkbox } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
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
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  titleStyle,
} from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import StatusModel from "../../../Common/StatusModel";
import { GetIspApprovalList, GetRetailerListDrpdown, SaveIspApprovalList } from "../../../Api/Api";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { getCurrentMonthFirstDate, getTodayDate } from "../../../Common/commonFunction";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const ispStatus = [
  {
    id: 1,
    status: "Pending",
  },
  {
    id: 2,
    status: "Approved",
  },
  {
    id: 3,
    status: "Rejected",
  },
]

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
  stringify: (option) => option.retailerCode + " " + option.retailerName,
});

const tableColumns = [
  { id: "date", label: "DATE" },
  { id: "retailerName", label: "RETAILER NAME" },
  { id: "retailerCode", label: "RETAILER CODE" },
  { id: "state", label: "STATE" },
  { id: "city", label: "CITY" },
  { id: "existingIsp", label: "EXISTING ISP" },
  { id: "isp", label: "ISP" },
  { id: "ispCode", label: "ISP CODE" },
  { id: "status", label: "STATUS" },
  { id: "approvedBy", label: "APPROVED BY" }
];

const IspApproval = () => {
  const [activeTab, setActiveTab] = React.useState("isp-approval");
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [getIspApprovalList, setGetIspApprovalList] = React.useState([]);
  const [retailerList, setRetailerList] = React.useState([]);
  const [retailerLoading, setRetailerLoading] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState(
    {
      FromDate: null,
      ToDate: null,
      ApprovalStatus: null,// 1 = Pending 2= Approved , 3 = Rejected.
      retailerID: 0,
      PageSize: 10,
      PageIndex: 1,
      ActionType: 0//For List.
    }
  );
  const [dateError, setDateError] = React.useState("");
  const [remark, setRemark] = React.useState("");
  const [searchError, setSearchError] = React.useState("");
  const [remarkError, setRemarkError] = React.useState("");
  console.log(searchParams, "searchParams");

  const [showUpperStatus, setShowUpperStatus] = React.useState(false);
  const [upperStatus, setUpperStatus] = React.useState(null);
  const [upperTitle, setUpperTitle] = React.useState(null);

  const [showLowerStatus, setShowLowerStatus] = React.useState(false);
  const [lowerStatus, setLowerStatus] = React.useState(null);
  const [lowerTitle, setLowerTitle] = React.useState(null);

  const [totalRecords, setTotalRecords] = React.useState(0);

  const tabs = [
    { label: "ISP Approval", value: "isp-approval" },
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

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // State for jump-to-page input
  const [jumpToPageValue, setJumpToPageValue] = React.useState("");

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add state for selected rows
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Add state for selected channel code
  const [selectedChannelCode, setSelectedChannelCode] = React.useState([]);

  const [selectedRetailer, setSelectedRetailer] = React.useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Fetch new data for the new page
    // Option 1: useEffect dependency on [page, rowsPerPage]
    // Option 2: call handleGetIspApprovalList() here
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // Fetch new data for the new page size
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
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...getIspApprovalList].sort((a, b) => {
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

    setGetIspApprovalList(sortedRows);
  };

 
  // Handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = getIspApprovalList.map((row) => row.ispID);
      setSelectedRows(newSelected);
    } else {
      setSelectedRows([]);
    }
  };

  // Handle individual row selection
  const handleSelectRow = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };
  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const handleFromDateChange = (newValue) => {
    setDateError(""); // Clear error on change
    if (searchParams.ToDate && newValue > searchParams.ToDate) {
      setDateError("From date cannot be greater than To date");
      return;
    }
      const formattedDate = newValue
      ? new Date(newValue).toISOString().split("T")[0]
      : null;

    handleSearchChange("FromDate", formattedDate);
  };

  const handleToDateChange = (newValue) => {
    setDateError(""); // Clear error on change
    if (searchParams.FromDate && newValue < searchParams.FromDate) {
      setDateError("To date cannot be less than From date");
      return;
    }

    const formattedDate = newValue
      ? new Date(newValue).toISOString().split("T")[0]
      : null;

    handleSearchChange("ToDate", formattedDate);
  };

  const handleSearch = async () => {
    // Validation: Status and Channel (retailer) must be selected
    if (!searchParams.ApprovalStatus || !searchParams.retailerID) {
      setSearchError("Please select both Status and Channel Name before searching.");
      return;
    } else {
      setSearchError("");
    }
    setIsLoading(true);
    try {
         let params = {
         ...searchParams,
         PageIndex: page + 1, // API is usually 1-based, Material-UI is 0-based
         PageSize: rowsPerPage,
         }
      const response = await GetIspApprovalList(params)
      if (response.statusCode == 200) {
        setGetIspApprovalList(response.ispList);
        setTotalRecords(response.totalRecords || 0);
        setPage(0);
        setShowUpperStatus(false);
        setShowLowerStatus(false);
        setSelectedRows([]);
        setRemark("");
        setLowerStatus(null);
        setLowerTitle(null);
      } else {
        setGetIspApprovalList([]);
        setTotalRecords(0);
        setUpperStatus(response.statusCode);
        setUpperTitle(response.statusMessage);
        setShowUpperStatus(true);
        setShowLowerStatus(false);
        setSelectedRows([]);
        setRemark("");
        setLowerStatus(null);
        setLowerTitle(null);
      }
      setIsLoading(false);
    } catch (error) {
      setGetIspApprovalList([]);
      setTotalRecords(0);
      setUpperStatus(error.statusCode || 500);
      setUpperTitle(error.statusMessage || "An error occurred while fetching data.");
      setShowUpperStatus(true);
      setIsLoading(false);
    }
  };

  const handleSearchChange = (field, value, newvalue) => {
    setSearchParams((p) => ({
      ...p,
      [field]: value,
    }));
  };

  const handleGetIspApprovalList = async () => {
    setIsLoading(true);
    try {
         let params = {
         ...searchParams,
         PageIndex: page + 1, // API is usually 1-based, Material-UI is 0-based
         PageSize: rowsPerPage,
         }
      const response = await GetIspApprovalList(params)
      if (response.statusCode == 200) {
        setGetIspApprovalList(response.ispList);
        setTotalRecords(response.totalRecords || 0);
        setShowUpperStatus(false);
        setShowLowerStatus(false);
        setSelectedRows([]);
        setRemark("");
        setLowerStatus(null);
        setLowerTitle(null);
      } else {
        setGetIspApprovalList([]);
        setTotalRecords(0);
        setUpperStatus(response.statusCode);
        setUpperTitle(response.statusMessage);
        setShowUpperStatus(true);
        setShowLowerStatus(false);
        setSelectedRows([]);
        setRemark("");
        setLowerStatus(null);
        setLowerTitle(null);
      }
      setIsLoading(false);
    } catch (error) {
      setGetIspApprovalList([]);
      setTotalRecords(0);
      setUpperStatus(error.statusCode || 500);
      setUpperTitle(error.statusMessage || "An error occurred while fetching data.");
      setShowUpperStatus(true);
      setIsLoading(false);
    }
  }

  const handleGetRetailerListDropdown = async () => {
    setRetailerLoading(true);
    const response = await GetRetailerListDrpdown(searchParams);
    console.log(response, "response");
    try {
      if (response.statusCode == 200) {
        setRetailerList(response.retailerMasterList);
      }
      else {
        setRetailerList([]);
      }
      setIsLoading(false);
      setRetailerLoading(false);
    }
    catch (error) {
      console.log(error);
      setRetailerLoading(false);
    }
  }

  const handleApprovalAction = async (statusValue) => {
    // Validation: Remark must not be empty
    if (!remark || remark.trim() === "") {
      setRemarkError("Remark is required.");
      return;
    } else {
      setRemarkError("");
    }
    const payload = {
      ApprovalStatus: statusValue,
      ActionType: 1,
      Remarks: remark,
      selectedIDs: selectedRows.map(id => ({ ISPID: id }))
    };
    try {
      const response = await SaveIspApprovalList(payload);
      if (response.statusCode == 200) {
        setLowerStatus(response.statusCode);
        setLowerTitle(response.statusMessage);
        setShowLowerStatus(true);
        setSelectedRows([]);
        setRemark("");
        setTimeout(() => {
          handleGetIspApprovalList();
          setLowerStatus(null);
          setLowerTitle(null);
          setShowLowerStatus(false);
        }, 2000);
      } else {
        setLowerStatus(response.statusCode);
        setLowerTitle(response.statusMessage);
        setShowLowerStatus(true);
        setTimeout(() => {
          setLowerStatus(null);
          setLowerTitle(null);
          setShowLowerStatus(false);
        }, 2000);
      }
    } catch (error) {
      setLowerStatus(error.statusCode || 500);
      setLowerTitle(error.statusMessage || "An error occurred while updating approval status.");
      setShowLowerStatus(true);
    }
  };

  const handleReset = () => {
    setSearchParams({
      FromDate: null,
      ToDate: null,
      ApprovalStatus: null,
      retailerID: 0,
      PageSize: 10,
      PageIndex: 1,
      ActionType: 0
    });
    setSelectedRows([]);
    setSelectedChannelCode([]);
    setGetIspApprovalList([]);
    setUpperStatus(null);
    setUpperTitle(null);
    setShowUpperStatus(false);
    setLowerStatus(null);
    setLowerTitle(null);
    setShowLowerStatus(false);
    setRemark("");
    setPage(0);
    setRowsPerPage(10);
    setSortConfig({ key: null, direction: null });
    setDateError("");
    setSearchError("");
    setRemarkError("");
    // setTimeout(() => {
    //   handleGetIspApprovalList();
    // }, 0);
  };

  React.useEffect(() => {
    // handleGetIspApprovalList();
    handleGetRetailerListDropdown();
  }, []);

  React.useEffect(() => {
    if(getIspApprovalList.length > 0){
      handleGetIspApprovalList();
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (searchParams.retailerID && retailerList.length > 0) {
      const found = retailerList.find(r => r.retailerId === searchParams.retailerID);
      setSelectedRetailer(found || null);
    } else {
      setSelectedRetailer(null);
    }
  }, [searchParams.retailerID, retailerList]);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          // Add padding to make space for activity panel
        }}>
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
            <BreadcrumbsHeader pageTitle="ISP" />
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
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="ISP Approval"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Typography variant="body1" sx={titleStyle}>
                    Search
                  </Typography>
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
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        STATUS
                      </Typography>
                      <NuralAutocomplete
                        label="STATUS"
                        options={ispStatus}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.status || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange("ApprovalStatus", newValue?.id || null);
                        }}
                        value={
                          ispStatus.find(
                            (option) => option.id === searchParams.ApprovalStatus
                          ) || null
                        }
                        error={searchError && !searchParams.ApprovalStatus}
                        helperText={searchError && !searchParams.ApprovalStatus ? "Status is required" : ""}
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
                        CHANNEL NAME
                      </Typography>
                      <NuralAutocomplete
                        label="RETAILER NAME"
                        options={retailerList}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.retailerName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        onChange={(event, newValue) => {
                          setSelectedRetailer(newValue);
                          handleSearchChange("retailerID", newValue?.retailerId || null);
                        }}
                        value={selectedRetailer}
                        filterOptions={filterOptions}
                        error={searchError && !searchParams.retailerID}
                        helperText={searchError && !searchParams.retailerID ? "Channel Name is required" : ""}
                        loading={retailerLoading}
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
                        CHANNEL CODE
                      </Typography>
                      <NuralAutocomplete
                        label="CHANNEL CODE"
                        options={retailerList}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.retailerCode || ""}
                        isOptionEqualToValue={(option, value) => option?.retailerId === value?.retailerId}
                        onChange={(event, newValue) => {
                          setSelectedRetailer(newValue);
                          handleSearchChange("retailerID", newValue?.retailerId || null);
                        }}
                        value={selectedRetailer}
                        filterOptions={filterOptions}
                        loading={retailerLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        value={searchParams.FromDate}
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        onChange={handleFromDateChange}
                        maxDate={searchParams.ToDate || undefined}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        value={searchParams.ToDate}
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        onChange={handleToDateChange}
                        minDate={searchParams.FromDate || undefined}
                      />
                    </Grid>
                    {dateError && (
                      <Grid item xs={12}>
                        <Typography color="error" sx={{ fontSize: "12px", mt: 1 }}>
                          {dateError}
                        </Typography>
                      </Grid>
                    )}
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
                        onClick={handleReset}
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
                        onClick={handleSearch}
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

        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} md={10} lg={12} pr={4} pl={2} mb={2}>
            {showUpperStatus && (
              <StatusModel
                width="100%"
                status={upperStatus}
                title={upperTitle}
                onClose={() => setShowUpperStatus(false)}
              />
            )}
          </Grid>
        </Grid>
 
        {/* Add this after the NuralAccordion2 component */}
        {getIspApprovalList && getIspApprovalList.length > 0 && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 100px)", // Add max height for scrolling
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={12}  // Updated colspan to account for checkbox
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        position: "sticky",
                        top: 0,
                        // zIndex: 100,
                        borderBottom: "none",
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
                      padding="checkbox"
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        // zIndex: 1100,
                      }}
                    >
                      <Checkbox
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < getIspApprovalList.length
                        }
                        checked={
                          getIspApprovalList.length > 0 &&
                          selectedRows.length === getIspApprovalList.length
                        }
                        onChange={handleSelectAll}
                        sx={{
                          color: PRIMARY_BLUE2,
                          '&.Mui-checked': {
                            color: PRIMARY_BLUE2,
                          },
                        }}
                      />
                    </TableCell>
                    {[
                      { id: "date", label: "DATE" },
                      { id: "retailerName", label: "RETAILER NAME" },
                      { id: "retailerCode", label: "RETAILER CODE" },
                      { id: "state", label: "STATE" },
                      { id: "city", label: "CITY" },
                      { id: "existingIsp", label: "EXISTING ISP" },
                      { id: "isp", label: "ISP" },
                      { id: "ispCode", label: "ISP CODE" },
                      { id: "status", label: "STATUS" },
                      { id: "approvedBy", label: "APPROVED BY" }
                    ].map(({ id, label }) => (
                      <TableCell
                        key={id}
                        onClick={() => handleSort(id)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: "pointer",
                          position: "sticky",
                          top: "48px",
                          backgroundColor: LIGHT_GRAY2,
                          // zIndex: 1100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{label}</Grid>
                          <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            {sortConfig.key === id ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUpwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                              ) : (
                                <ArrowDownwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                              )
                            ) : (
                              <Grid container direction="column" alignItems="center" sx={{ height: 16, width: 16 }}>
                                <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                                <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading
                    ? Array(rowsPerPage)
                        .fill(0)
                        .map((_, index) => (
                          <TableRowSkeleton
                            key={index}
                            columns={tableColumns.length + 1} // +1 for S.NO or checkbox column
                          />
                        ))
                    : getIspApprovalList.map((row, index) => {
                        const isItemSelected = isSelected(row.ispID);
                        return (
                          <TableRow
                            key={row.ispID}
                            selected={isItemSelected}
                            onClick={() => handleSelectRow(row.ispID)}
                            sx={{
                              cursor: 'pointer',
                              '&.Mui-selected, &.Mui-selected:hover': {
                                backgroundColor: PRIMARY_BLUE2,
                                '& .MuiTableCell-root': {
                                  color: '#fff'
                                },
                                '& .MuiCheckbox-root': {
                                  color: '#fff'
                                }
                              },
                              '&:hover': {
                                backgroundColor: `${PRIMARY_LIGHT_GRAY}40`,
                              },
                            }}
                          >
                            <TableCell padding="checkbox" sx={{ ...rowstyle }}>
                              <Checkbox
                                checked={isItemSelected}
                                sx={{
                                  color: PRIMARY_BLUE2,
                                  '&.Mui-checked': {
                                    color: isItemSelected ? '#fff' : PRIMARY_BLUE2,
                                  },
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.date}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.retailerName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.retailerCode}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.stateName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.cityName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.existingIsp}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.ispName}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.ispCode}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.approvalStatusText}</TableCell>
                            <TableCell sx={{ ...rowstyle }}>{row.approvedBy}</TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>

              {/* Custom Pagination */}
              <Grid
                container
                sx={{
                  p: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: LIGHT_GRAY2,
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
                      {totalRecords} /{" "}
                      {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
                          onClick={() =>
                            handleChangeRowsPerPage({ target: { value } })
                          }
                          sx={{
                            minWidth: "25px",
                            height: "24px",
                            padding: "4px",
                            borderRadius: "50%",
                            // border: `1px solid ${PRIMARY_BLUE2}`,
                            backgroundColor:
                              rowsPerPage === value
                                ? PRIMARY_BLUE2
                                : "transparent",
                            color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                            fontSize: "12px",
                            "&:hover": {
                              backgroundColor:
                                rowsPerPage === value
                                  ? PRIMARY_BLUE2
                                  : "transparent",
                            },
                            mx: 0.5,
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
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: PRIMARY_BLUE2,
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => setPage(0)}
                  >
                    JUMP TO FIRST
                  </Typography>
                  <IconButton
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
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
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage) - 1}
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
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: PRIMARY_BLUE2,
                        textDecoration: 'underline',
                      },
                    }}
                    variant="body2"
                    onClick={() => setPage(Math.max(Math.ceil(totalRecords / rowsPerPage) - 1, 0))}
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    min={1}
                    max={Math.ceil(totalRecords / rowsPerPage)}
                    value={jumpToPageValue}
                    onChange={(e) => {
                      setJumpToPageValue(e.target.value);
                    }}
                    style={jumpToPageStyle}
                  />
                  <Grid mt={1}>
                    <img
                      src="./Icons/footerSearch.svg"
                      alt="arrow"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const newPage = parseInt(jumpToPageValue, 10) - 1;
                        if (
                          !isNaN(newPage) &&
                          newPage >= 0 &&
                          newPage < Math.ceil(totalRecords / rowsPerPage)
                        ) {
                          setPage(newPage);
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          </Grid>
        )}

        {selectedRows.length > 0 && (
          <Grid item paddingTop={2} xs={12} lg={12}>
            <NuralAccordion2 title="Rejection Remark" backgroundColor={LIGHT_GRAY2} paddingRight={"14px"}>
              <Grid container spacing={2} mb={2} sx={{ gap: { xs: 2, sm: 3, md: 0 }, flexDirection: { xs: "column", sm: "row" } }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="body1" sx={{ ...labelStyle, fontSize: { xs: "12px", sm: "10px" } }} fontWeight={600}>
                    REMARK
                  </Typography>
                  <NuralTextField
                    placeholder="Add Remark Here"
                    width="100%"
                    backgroundColor={LIGHT_BLUE}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    inputProps={{
                      pattern: "[a-zA-Z0-9,\\s]*",
                      title: "Only alphanumeric characters are allowed",
                    }}
                    error={!!remarkError}
                    errorMessage={remarkError}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <NuralButton
                    text="Reject"
                    variant="outlined"
                    color={PRIMARY_BLUE2}
                    fontSize="12px"
                    height="36px"
                    borderColor={PRIMARY_BLUE2}
                    onClick={() => handleApprovalAction(3)}
                    width="100%"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <NuralTextButton
                    icon={"./Icons/searchIcon.svg"}
                    iconPosition="right"
                    height="36px"
                    backgroundColor={AQUA}
                    color="#fff"
                    width="100%"
                    fontSize="12px"
                    onClick={() => handleApprovalAction(2)}
                  >
                    {"ACCEPT"}
                  </NuralTextButton>
                </Grid>
              </Grid>
            </NuralAccordion2>
          </Grid>
          
        )}
   
       { <Grid item xs={12} sm={12} md={10} lg={12} pr={4} pl={0} mb={2} mt={2}>
            {showLowerStatus && (
              <StatusModel
                width="100%"
                status={lowerStatus}
                title={lowerTitle}
                onClose={() => setShowLowerStatus(false)}
              />
            )}
        </Grid>}

      </Grid>
    </>
  );
};

export default IspApproval;
