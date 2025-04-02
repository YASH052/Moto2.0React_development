import { Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  AQUA_DARK,
  DARK_BLUE,
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
  Dialog,
  DialogContent,
  DialogActions,
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
import { fetchIMEIList } from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
// Import skeleton components
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";




const UnblockFinance = () => {
  const [tableData, setTableData] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [searchParams, setSearchParams] = useState({
    serialNumber: "",
    type: 0 /*0= search List, 1=for unblock IMEI*/,
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
  const [errors, setErrors] = useState({
    serialNumber: ""
  });
  // Add loading state variables
  const [formLoading, setFormLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  
  const getIMEIList = async () => {
    try {
      // Set table loading to true before fetching
      setTableLoading(true);
      
      const response = await fetchIMEIList(searchParams);
      if (response.statusCode == 200) {
        setTableData(response.financeIMEIlist);
      }
      else{
        setTitle(response.statusMessage);
        setStatus(response.statusCode);
      }
    } catch (error) {
      console.error("Error fetching IMEI list:", error);
      setTitle(error.statusMessage);
      setStatus(error.statusCode);
    } finally {
      // Set table loading to false when fetching completes (success or error)
      setTableLoading(false);
    }
  };
  
  const validateSerialNumber = (value) => {
    if (!value || value.trim() === "") {
      return "Serial Number is required";
    } else if (value.length < 4) {
      return "Serial Number must be at least 4 characters";
    } else if (value.length > 15) {
      return "Serial Number cannot exceed 15 characters";
    } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
      return "Serial Number can only contain alphanumeric characters (no spaces)";
    }
    return "";
  };
  
  const handleSearch = () => {
    setStatus(null);
    setTitle(""); 
    
    const serialNumberError = validateSerialNumber(searchParams.serialNumber);
    if (serialNumberError) {
      setErrors({...errors, serialNumber: serialNumberError});
      return;
    }
    
    setHasSearched(true);
    setTableLoading(true); // Ensure loading state is set before making the API call
    getIMEIList();
  };
  
  const handleReset = () => {
    setSearchParams({
      serialNumber: "",
      type: 0
    });
    setHasSearched(false);
    setTableData([]);
    setErrors({serialNumber: ""});
    setTitle("");
    setStatus(null);
  };
  
  const handleSerialNumberChange = (event) => {
    const value = event.target.value;
    
    if (value && value.length > 15) {
      // Truncate to 15 characters
      setSearchParams({
        ...searchParams,
        serialNumber: value.substring(0, 15)
      });
      setErrors({...errors, serialNumber: "Serial Number cannot exceed 15 characters"});
      return;
    }
    
    if (value && !/^[a-zA-Z0-9]*$/.test(value)) {
      setErrors({...errors, serialNumber: "Serial Number can only contain alphanumeric characters (no spaces)"});
      return;
    }
    
    setSearchParams({
      ...searchParams,
      serialNumber: value
    });
    
    if (value.trim() === "") {
      setErrors({...errors, serialNumber: "Serial Number is required"});
    } else if (value.length < 4) {
      setErrors({...errors, serialNumber: "Serial Number must be at least 4 characters"});
    } else {
      setErrors({...errors, serialNumber: ""});
    }
  };

  const [activeTab, setActiveTab] = React.useState("unblock-finance");

  const tabs = [{ label: "Unblock Finance IMEI", value: "unblock-finance" }];
  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_BLUE,
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

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const statuses = ["Pending", "Approved", "Rejected"];
    const requestTypes = ["Finance Block", "Theft Block", "Customer Request"];
    const userNames = ["John D.", "Sarah M.", "Mike R.", "Emma S.", "Alex P."];
   
    return Array(2)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        serialNumber: `IMEI${Math.floor(Math.random() * 1000000000)}`,
        serialNumber2: `SN${Math.floor(Math.random() * 100000)}`,
        skuCode: `SKU${Math.floor(Math.random() * 10000)}`,
        skuName: `Product ${Math.floor(Math.random() * 100)}`,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        requestType:
          requestTypes[Math.floor(Math.random() * requestTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        requestDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
      }));
  };

  const [rows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  // Add search/filter functionality
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

  const handleUnblockClick = () => {
    setOpenUnblockDialog(true);
  };

  const handleConfirmUnblock = async () => {
    try {
      // Set loading state for the unblock operation
      setTableLoading(true);
      
      // Update type to 1 for unblock IMEI
      const unblockParams = {
        ...searchParams,
        type: 1
      };
      
      const response = await fetchIMEIList(unblockParams);
      
      // Update status based on response
      setTitle(response.statusMessage);
      setStatus(response.statusCode);
      
      // Hide the confirmation buttons
      setOpenUnblockDialog(false);
      
      // If successful, refresh the data
      if (response.statusCode === 200) {
        getIMEIList();
      } else {
        setTableLoading(false); // Turn off loading if not refreshing the data
      }
    } catch (error) {
      console.error("Error unblocking IMEI:", error);
      setTitle(error.statusMessage || "Failed to unblock IMEI");
      setStatus(error.statusCode || 500);
      setOpenUnblockDialog(false);
      setTableLoading(false); // Make sure to turn off loading in error case
    }
  };

  const handleCancelUnblock = () => {
    setOpenUnblockDialog(false);
  };

  // Add useEffect to simulate initial form loading when component mounts
  useEffect(() => {
    // Simulate initial form loading
    setFormLoading(true);
    
    // Simulate delay then set form as loaded
    const timer = setTimeout(() => {
      setFormLoading(false);
    }, 800); // 800ms delay for loading effect
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
          <BreadcrumbsHeader pageTitle="Others" />
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
              {formLoading ? (
                <FormSkeleton />
              ) : (
                <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                  {/* First Row - Serial Number */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 3, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        SERIAL NO
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER SERIAL NO"
                        value={searchParams.serialNumber}
                        onChange={handleSerialNumberChange}
                        error={!!errors.serialNumber}
                        onBlur={() => {
                          if (!searchParams.serialNumber || searchParams.serialNumber.trim() === "") {
                            setErrors({...errors, serialNumber: "Serial Number is required"});
                          } else if (searchParams.serialNumber.length < 4) {
                            setErrors({...errors, serialNumber: "Serial Number must be at least 4 characters"});
                          }
                        }}
                      />
                      {errors.serialNumber && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.serialNumber}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  {/* Second Row */}
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
                        text="RESET"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        fontSize="12px"
                        height="36px"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleReset}
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
                        onClick={handleSearch}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, marginRight: "10px" } }}>
        {status && (
          <StatusModel
            width="100%"
            status={status}
            title={title}
            onClose={() => setStatus(null)}
          />
        )}
      </Grid>
      {/* Add this after the NuralAccordion2 component */}
      {hasSearched && (tableLoading || status === 200 || status === null) && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 300px)", 
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={10}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1100,
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
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    S.NO
                  </TableCell>
                  {[
                    "SERIAL NUMBER",
                    "SERIAL NUMBER 2",
                    "SKU CODE",
                    "SKU NAME",
                    "USER NAME",
                    "REQUEST TYPE",
                    "STATUS",
                    "REQUEST DATE & TIME",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableLoading ? (
                  <TableRowSkeleton
                    columns={9} // Number of columns in your table
                    rows={5} // Show 5 skeleton rows
                    imagePath="./Icons/emptyFile.svg"
                    sx={{ height: "calc(100vh - 420px)" }}
                  />
                ) : tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <TableRow key={row.id || index}>
                      <TableCell
                        sx={{
                          ...rowstyle,
                          color: PRIMARY_BLUE2,
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.serialNumber || row.imei}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.serialNumber2 || '-'}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.skuCode || '-'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.skuName || '-'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.userName || '-'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.requestType || '-'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.status || '-'}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.requestDate || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', padding: '20px' }}>
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {hasSearched && !tableLoading && status == 200 && tableData.length > 0 && (
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ p: { xs: 1, sm: 2 } }}>
          {!openUnblockDialog ? (
            <NuralButton
              text="CLICK TO UNBLOCK"
              variant="contained"
              color={AQUA_DARK}
              backgroundColor={AQUA}
              fontSize="12px"
              height="39px"
              width="100%"
              onClick={handleUnblockClick}
            />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <NuralButton
                  text="CONFIRM"
                  variant="contained"
                  backgroundColor="#00BCD4"
                  color="#FFFFFF"
                  fontSize="14px"
                  height="48px"
                  width="100%"
                  onClick={handleConfirmUnblock}
                  disabled={tableLoading} // Disable while loading
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  color="#2E3192"
                  borderColor="#2E3192"
                  fontSize="14px"
                  height="48px"
                  width="100%"
                  onClick={handleCancelUnblock}
                  disabled={tableLoading} // Disable while loading
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default UnblockFinance;
