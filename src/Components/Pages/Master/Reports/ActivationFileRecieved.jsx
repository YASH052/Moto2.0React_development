import React, { useEffect, useState } from "react";
import { Grid, Typography, Button } from "@mui/material";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { fetchProcessList, fetchSAPList } from "../../../Api/Api";
import Required from "../../../Common/Required";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import NuralPagination from "../../../Common/NuralPagination";
import { useNavigate } from "react-router-dom";

const ActivationFileRecieved = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("activation-file-received");
  const tabs = [
    { label: "Activation File Received", value: "activation-file-received" },
    { label: "SAP Integration", value: "sap-integration" },
  ];

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
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

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add state from RedingtonFile
  const [processList, setProcessList] = useState([]);
  const [processStatus, setProcessStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [fromDateError, setFromDateError] = useState("");
  const [toDateError, setToDateError] = useState("");
  const [defaultLoading, setDefaultLoading] = useState(false);

  // Replace existing search params state
  const [searchParams, setSearchParams] = useState({
    service_network_id: 0,
    interfaceMasterID: 0,
    processStatusId: -1,
    uploadFromDate: "",
    uploadToDate: "",
    export: 0,
    exportType: 1,
    interfaceFileID: 0,
    poNumber: "",
    pageIndex: 1,
    pageSize: 10,
    callType: 2 // Different callType for activation files
  });

  // Add missing state declarations near other state hooks
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
 
  // Add column mapping at the top
  const columnMapping = {
    "FILE CHECK": "interfaceFileName",
    "FILE ERRORS": "errorMsg",
    "STATUS": "transStatus",
    "UPLOAD RECORDS": "totalRecords",
    "PROCESSED RECORDS": "processedRecords",
    "INVALID RECORDS": "invalidRecords",
    "PROCESSED ON": "createdOn",
  };

  // Add handlePaginationChange function
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1,
      pageSize: paginationState.rowsPerPage,
    };
    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);
    getActivationList(updatedParams);
  };

  // Add handleSort function
  const handleSort = (columnName) => {
    const key = columnMapping[columnName];
    let direction = "asc";
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    const sortedData = [...tableData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTableData(sortedData);
    setSortConfig({ key, direction });
  };

  // Add handleReset function
  const handleReset = () => {
    setSearchParams({
      service_network_id: 0,
      interfaceMasterID: 0,
      processStatusId: -1,
      uploadFromDate: "",
      uploadToDate: "",
      export: 0,
      exportType: 1,
      interfaceFileID: 0,
      poNumber: "",
      pageIndex: 1,
      pageSize: 10,
      callType: 2
    });
    setTableData([]);
    setTotalRecords(0);
    setPage(0);
    setSearchClicked(false);
    setStatus(null);
    setTitle('');
  };

  // Add API functions from RedingtonFile
  const getProcessTypeList = async () => {
    try {
      setDefaultLoading(true);
      const params = {
        service_network_id: 0,
        callType: 2, // Activation files
      };
      const response = await fetchProcessList(params);
      if (response.statusCode == 200) {
        setProcessList(response.processTypeList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDefaultLoading(false);
    }
  };

  const getProcessStatusList = async () => {
    try {
      setDefaultLoading(true);
      const params = {
        service_network_id: 0,
        callType: 2, // Activation files
      };
      const response = await fetchProcessList(params);
      if (response.statusCode == 200) {
        setProcessStatus(response.processStatusList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDefaultLoading(false);
    }
  };

  // Replace handleSearchClick with RedingtonFile version
  const handleSearchClick = () => {
    setStatus(null);
    setTitle("");
    if (!searchParams.uploadFromDate || !searchParams.uploadToDate) {
      setFromDateError("From Date is mandatory");
      setToDateError("To Date is mandatory");
      return;
    }

    if (fromDateError || toDateError) return;

    setSearchClicked(true);
    const fromDate = new Date(searchParams.uploadFromDate);
    const toDate = new Date(searchParams.uploadToDate);

    if (fromDate > toDate) {
      setFromDateError("From date cannot be greater than To date");
      setToDateError("To date cannot be less than From date");
      return;
    }

    const updatedParams = {
      ...searchParams,
      pageIndex: 1,
      pageSize: rowsPerPage,
    };

    setPage(0);
    setSearchParams(updatedParams);
    getActivationList(updatedParams);
  };

  // Add getActivationList function
  const getActivationList = async (params = searchParams) => {
  // console.log(status, title)
    setStatus(false);
    setTitle("");
    try {
      setLoading(true);
      const response = await fetchSAPList(params);
      if (response.statusCode == 200) {
        if (response.sapProcessList?.length > 0) {
          setTableData(response.sapProcessList);
          setTotalRecords(response.totalRecords);
        } else {
         
          setTableData([]);
          setTotalRecords(0);
        }
      } else {
      setSearchClicked(false);
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "No Data Found");
        setTableData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.log(error);
      setSearchClicked(false);
      setStatus(error.statusCode);
      setTitle(error.statusMessage || "No Data Found");
      setTableData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect for initial load
  useEffect(() => {
    getProcessTypeList();
    getProcessStatusList();
  }, []);

  // Update table rendering with skeleton
  <TableBody>
    {loading ? (
      <TableRowSkeleton 
        columns={8} 
        imagePath="./Icons/emptyFile.svg" 
        sx={{ height: "calc(100vh - 420px)" }}
      />
    ) : tableData.length === 0 ? (
      <TableRow>
        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ color: PRIMARY_BLUE2, fontWeight: 500 }}>
            No Data Available
          </Typography>
        </TableCell>
      </TableRow>
    ) : (
      tableData.map((row, index) => (
        <TableRow key={row.id}>
          <TableCell sx={{ ...rowstyle, color: PRIMARY_BLUE2, fontWeight: 600 }}>
            {page * rowsPerPage + index + 1}
          </TableCell>
          <TableCell sx={rowstyle}>{row.interfaceFileName}</TableCell>
          <TableCell sx={rowstyle}>{row.errorMsg}</TableCell>
          <TableCell sx={rowstyle}>{row.transStatus}</TableCell>
          <TableCell sx={rowstyle}>{row.totalRecords}</TableCell>
          <TableCell sx={rowstyle}>{row.processedRecords}</TableCell>
          <TableCell sx={rowstyle}>{row.invalidRecords}</TableCell>
          <TableCell sx={rowstyle}>{row.createdOn}</TableCell>
          <TableCell sx={rowstyle}>
            <Button variant="text" sx={{ color: PRIMARY_BLUE2, fontSize: "12px" }}>
              Download
            </Button>
          </TableCell>
        </TableRow>
      ))
    )}
  </TableBody>;

  // Replace pagination section with
  <NuralPagination
    totalRecords={totalRecords}
    initialPage={page}
    initialRowsPerPage={rowsPerPage}
    onPaginationChange={handlePaginationChange}
  />;

  // Add date change handlers after the searchParams state
  const handleFromDateChange = (newValue) => {
    setFromDateError("");
    if (searchParams.uploadToDate && new Date(newValue) > new Date(searchParams.uploadToDate)) {
      setFromDateError("From date cannot be greater than To date");
    }
    const formattedDate = newValue instanceof Date 
      ? `${newValue.getFullYear()}-${String(newValue.getMonth()+1).padStart(2,'0')}-${String(newValue.getDate()).padStart(2,'0')}`
      : newValue;
    setSearchParams(prev => ({ ...prev, uploadFromDate: formattedDate }));
  };

  const handleToDateChange = (newValue) => {
    setToDateError("");
    if (searchParams.uploadFromDate && new Date(newValue) < new Date(searchParams.uploadFromDate)) {
      setToDateError("To date cannot be less than From date");
    }
    const formattedDate = newValue instanceof Date
      ? `${newValue.getFullYear()}-${String(newValue.getMonth()+1).padStart(2,'0')}-${String(newValue.getDate()).padStart(2,'0')}`
      : newValue;
    setSearchParams(prev => ({ ...prev, uploadToDate: formattedDate }));
  };

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
        <Grid item xs={12} mt={0} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Misc" />
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
                title="Sale Report"
                backgroundColor={LIGHT_GRAY2}
              >
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{ ...labelStyle, fontSize: { xs: "12px", sm: "10px" }}}
                      fontWeight={600}
                    >
                      PROCESS TYPE
                    </Typography>
                    <NuralAutocomplete
                      label="Process Type"
                      options={processList}
                      getOptionLabel={(option) => option.interfaceName || ""}
                      isOptionEqualToValue={(option, value) => 
                        option?.interfaceMasterID === value?.interfaceMasterID
                      }
                      onChange={(event, newValue) => {
                        setSearchParams(prev => ({
                          ...prev,
                          interfaceMasterID: newValue?.interfaceMasterID || 0
                        }));
                      }}
                      value={processList.find(option => 
                        option.interfaceMasterID === searchParams.interfaceMasterID
                      ) || null}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{ ...labelStyle, fontSize: { xs: "12px", sm: "10px" }}}
                      fontWeight={600}
                    >
                      PROCESS STATUS
                    </Typography>
                    <NuralAutocomplete
                      label="Process Status"
                      options={processStatus}
                      getOptionLabel={(option) => option.processStatus || ""}
                      isOptionEqualToValue={(option, value) => 
                        option?.processStatusId === value?.processStatusId
                      }
                      onChange={(event, newValue) => {
                        setSearchParams(prev => ({
                          ...prev,
                          processStatusId: newValue?.processStatusId || -1
                        }));
                      }}
                      value={processStatus.find(option => 
                        option.processStatusId === searchParams.processStatusId
                      ) || null}
                      placeholder="SELECT"
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{ ...labelStyle, fontSize: { xs: "12px", sm: "10px" }}}
                      fontWeight={600}
                    >
                      FROM DATE <Required />
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="SELECT"
                      value={searchParams.uploadFromDate}
                      onChange={handleFromDateChange}
                      error={!!fromDateError}
                    />
                    {fromDateError && (
                      <Typography color="error" sx={{ fontSize: "12px", mt: 0.5 }}>
                        {fromDateError}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography
                      variant="body1"
                      sx={{ ...labelStyle, fontSize: { xs: "12px", sm: "10px" }}}
                      fontWeight={600}
                    >
                      TO DATE <Required />
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MM/YY"
                      value={searchParams.uploadToDate}
                      onChange={handleToDateChange}
                      error={!!toDateError}
                    />
                    {toDateError && (
                      <Typography color="error" sx={{ fontSize: "12px", mt: 0.5 }}>
                        {toDateError}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Second Row */}

                {/* Third Row - Buttons */}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    // gap: { xs: 2, sm: 2 },
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
                      onClick={handleReset}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={10} md={11}>
                    <NuralTextButton
                      icon={"./Icons/searchIcon.svg"}
                      iconPosition="right"
                      height="36px"
                      backgroundColor={PRIMARY_BLUE2}
                      color="#fff"
                      width="100%"
                      fontSize="12px"
                      onClick={handleSearchClick}
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
      {status && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <StatusModel
            status={status}
            title={title}
            onClose={() => setStatus(false)}
            width="100%"
          />
        </Grid>
      )}
    

      {/* Add this after the NuralAccordion2 component */}
      {searchClicked && (<Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(100vh - 320px)", // Adjusted to account for headers
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
                  colSpan={10}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    borderBottom: "none",
                    boxShadow: "0 2px 2px rgba(0,0,0,0.05)", // Add subtle shadow
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
                    top: "45px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 1000,
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      borderBottom: "2px solid #e0e0e0",
                    },
                  }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                {[
                  "FILE ",
                  "FILE ERRORS",
                  "UPLOAD STATUS",
                  "TOTAL RECORDS",
                  "PROCESSED RECORDS",
                  "INVALID RECORDS",
                  "CREATED ON",
                  "PROCESSED ON",
                  "DOWNLOAD",
                ].map((header, index) => (
                  <TableCell
                    key={`column${index + 1}`}
                    onClick={() => handleSort(`column${index + 1}`)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: "pointer",
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>{header}</Grid>
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        {sortConfig.key === `column${index + 1}` ? (
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
                            sx={{ height: 16, width: 16 }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowSkeleton 
                  columns={8} 
                  imagePath="./Icons/emptyFile.svg" 
                  sx={{ height: "calc(100vh - 420px)" }}
                />
              ) : tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ color: PRIMARY_BLUE2, fontWeight: 500 }}>
                      No Data Available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      sx={{
                        ...rowstyle,
                        color: PRIMARY_BLUE2,
                        fontWeight: 600,
                      }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.interfaceFileName || ''}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.errorMsg || ''}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.transStatus || ''}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.totalRecords || 0} </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.processedRecords || 0}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.invalidRecords || 0}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.createdOn || ''}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row?.modifyOn || ''}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      <Button
                        variant="text"
                        disabled={!row?.existingFilePath}
                        onClick={() => {
                          if (row?.existingFilePath) {
                           window.location.href = row?.existingFilePath;
                          }
                        }}
                        sx={{
                          color: PRIMARY_BLUE2,
                          textTransform: "none",
                          fontSize: "12px",
                        }}  
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <NuralPagination
            totalRecords={totalRecords}
            initialPage={page}
            initialRowsPerPage={rowsPerPage}
            onPaginationChange={handlePaginationChange}
          />  
        
        </TableContainer>
      </Grid>
      )}
    </Grid>
  );
};

export default ActivationFileRecieved;
