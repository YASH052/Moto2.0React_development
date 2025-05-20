import { Box, Button, Checkbox, Grid, Typography, Switch } from "@mui/material";
import React, { useState, useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
  PRIMARY_LIGHT_GRAY,
  LIGHT_BLUE,
  PRIMARY_BLUE,
  BLACK,
} from "../../../Common/colors";
import EditIcon from "@mui/icons-material/Edit";

import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { Search } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { TableRowSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // TablePagination,
  IconButton,
} from "@mui/material";

const tabs = [
  { label: "Upload", value: "competiton-upload" },
  { label: "Brand", value: "competition-brand" },
  { label: "Category", value: "competition-category" },
  { label: "Model", value: "competition-model" },
  { label: "Price Band", value: "competition-price-band" },
];

import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import { GetPriceBandMasterList, ManagePricebandmaster, } from "../../../Api/Api";


const PriceBand = () => {
  const navigate = useNavigate();
  const mainRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState("competition-price-band");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [formData, setFormData] = React.useState({
    priceBranCode: "",
    priceFrom: "",
    priceTo: "",
    priceStatus: 1,//0-Deactive, 1-Active
    selectionMode: 0,//0-when inserted & update ,1-status update
  });
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [loading, setLoading] = React.useState(false);
  // const [error, setError] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = useState(null);
  const [tittle, setTittle] = useState(null);
  const SKELETON_ROWS = 6;


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSort = (columnName) => {
    let direction = "asc";
    console.log("columnName", columnName);
    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...filteredRows]); // Reset to original order
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      // Handle numeric fields
      if (columnName === "priceFrom" || columnName === "priceTo") {
        const aValue = a[columnName] || 0;
        const bValue = b[columnName] || 0;
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields
      const aValue = (a[columnName] || "").toString().toLowerCase();
      const bValue = (b[columnName] || "").toString().toLowerCase();

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

  // const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };


  const [totalRecords, setTotalRecords] = useState(0);

  const fetchPriceBandMasterList = async () => {
    try {
      setLoading(true);
      // setError(null);
      let body = {
        selectionMode: 0,
        priceBandID: 0,
        pageIndex: page,
        pageSize: rowsPerPage,
        pricebandCode: "",
        statusId: 2
      };

      const response = await GetPriceBandMasterList(body);
      if (response.statusCode == 200) {
        // setRows(response.pricebandmasterList);
        setFilteredRows(response.pricebandmasterList);
        setTotalRecords(response.totalRecord);
      } else {
        // setError(response.message || 'Error fetching data');
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      // setError(error.message || 'Error fetching data');
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const exportPriceBandMasterList = async () => {
    setIsDownloadLoading(true);
    try {
      // setLoading(true);
      // setError(null);
      let body = {
        selectionMode: 0,
        priceBandID: 0,
        pageIndex: -1,
        pageSize: -1,
        pricebandCode: "",
        statusId: 2
      };

      const response = await GetPriceBandMasterList(body);
      if (response.statusCode === "200" && response.reportLink) {
        // Create a temporary anchor element to trigger the download
        window.location.href = response.reportLink;
      } else {
        // setError('Export failed: No report link available');
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      // setError(error.message || 'Error exporting data');
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");
    } finally {
      // setLoading(false);
      setIsDownloadLoading(false);
    }
  };

  const updatePriceBandMasterStatus = async (priceBandID, status) => {
    try {
      setLoading(true);
      // setError(null);
      let body = {
        ...formData,
        priceFrom: 0,
        priceTo: 0,
        priceBandID: priceBandID,
        priceStatus: status,
        selectionMode: 1,
      };

      const response = await ManagePricebandmaster(body);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");

      if (response.statusCode == 200) {
        await fetchPriceBandMasterList();
        setTimeout(() => {
          setTittle(null);
          setStatus(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setTittle(null);
          setStatus(null);
        }, 2000);

      }
    } catch (error) {
      setStatus("error");
      setTittle(error.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const updatePriceBandMaster = async () => {
    try {
      setLoading(true);
      // setError(null);
      let body = {
        ...formData,
        // priceStatus: 1,
        // selectionMode: 0,
      };

      const response = await ManagePricebandmaster(body);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");

      if (response.statusCode == 200) {
        await fetchPriceBandMasterList();
        setFormData({
          priceBranCode: "",
          priceFrom: "",
          priceTo: "",
          priceStatus: 1,
          selectionMode: 0,
        });
        setTimeout(() => {
          setErrors({});
          setStatus(null);
          setTittle(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setErrors({});
          setStatus(null);
          setTittle(null);
        }, 2000);
      }
    } catch (error) {
      setStatus("error");
      setTittle(error.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "priceBranCode":
        return !value ? "Price Band Code is required" : "";
      case "priceFrom":
        return !value
          ? "Price From is required"
          : !/^[0-9]+$/.test(value)
            ? "Price From should be a number"
            : "";
      case "priceTo":
        return !value
          ? "Price To is required"
          : !/^[0-9]+$/.test(value)
            ? "Price To should be a number"
            : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      priceBranCode: "",
      priceFrom: "",
      priceTo: "",
      priceStatus: 1,
      selectionMode: 0,
    });
    setErrors({});
    setStatus(null);
    setTittle(null);
  };

  const handlePost = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);

    // If there are errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      // setError(null);
      let body = {
        ...formData,
        priceStatus: 1,
        selectionMode: 0,
      };

      const response = await ManagePricebandmaster(body);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");

      if (response.statusCode == 200) {
        await fetchPriceBandMasterList();
        setFormData({
          priceBranCode: "",
          priceFrom: "",
          priceTo: "",
          priceStatus: 1,
          selectionMode: 0,
        });
        setTimeout(() => {
          setErrors({});
          setStatus(null);
          setTittle(null);
        }, 2000);
      } else {
        setTimeout(() => {
          setErrors({});
          setStatus(null);
          setTittle(null);
        }, 2000);
      }
    } catch (error) {
      setStatus("error");
      setTittle(error.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceBandMasterList();
  }, [page, rowsPerPage]);

  // Add these handler functions
  const handleJumpToFirst = () => {
    setPage(1);
  };

  const handleJumpToLast = () => {
    const lastPage = Math.ceil(totalRecords / rowsPerPage);
    setPage(lastPage);
  };

  const handlePageChange = (newPage) => {
    // Ensure page is within valid bounds
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    const validPage = Math.max(1, Math.min(newPage, maxPage));

    setPage(validPage);
    // setSearchData(prev => ({
    //   ...prev,
    //   pageIndex: validPage
    // }));
  };

  const handlePrevPage = () => {
    handlePageChange(page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  return (
    <>
      <Grid container spacing={2} id="top-container"
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
        }}>
        {/* Breadcrumbs Header */}
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
            <BreadcrumbsHeader pageTitle="Competition" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        <>
          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Create"
                  controlled={true}
                  expanded={accordionExpanded}
                  onChange={(event, expanded) => setAccordionExpanded(expanded)}
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid container spacing={2} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: DARK_PURPLE,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        PRICE BAND
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER PRICE BAND"
                        backgroundColor={LIGHT_BLUE}
                        name="priceBranCode"
                        value={formData.priceBranCode}
                        onChange={handleChange}
                        error={!!errors.priceBranCode}
                        errorMessage={errors.priceBranCode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: DARK_PURPLE,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        PRICE FROM
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER PRICE FROM"
                        backgroundColor={LIGHT_BLUE}
                        name="priceFrom"
                        value={formData.priceFrom}
                        onChange={handleChange}
                        error={!!errors.priceFrom}
                        errorMessage={errors.priceFrom}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: DARK_PURPLE,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                          mb: 1,
                        }}
                      >
                        PRICE TO
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER PRICE TO"
                        backgroundColor={LIGHT_BLUE}
                        name="priceTo"
                        value={formData.priceTo}
                        onChange={handleChange}
                        error={!!errors.priceTo}
                        errorMessage={errors.priceTo}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                {accordionExpanded && (
                  <Grid container spacing={1} mt={1} pr={1}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancel}
                        width="97%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <NuralButton
                        text={formData.priceBandID ? "UPDATE" : "SAVE"}
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={formData.priceBandID ? updatePriceBandMaster : handlePost}
                        width="99%"
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Add error message here, above the View component */}

          <Grid item xs={12} md={12} lg={12} pr={4} mt={1}>
            {status && (
              <StatusModel width="100%"
                status={status}
                title={tittle}
                onClose={() => setStatus(null)}
              />
            )}
          </Grid>


          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="View"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      p: { xs: 1, sm: 0 },
                      // height: "calc(100vh - 180px)",
                      // minHeight: "650px",
                      // overflow: "hidden"
                    }}
                  >
                    <TableContainer
                      component={Paper}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        color: PRIMARY_BLUE2,
                        maxHeight: "100%",
                        // minHeight: "650px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                        "& .MuiTable-root": {
                          borderCollapse: "separate",
                          borderSpacing: 0,
                        },
                      }}
                    >
                      <Table
                        sx={{
                          minWidth: 650,
                          "& .MuiTableCell-root": {
                            padding: "8px 16px",
                            lineHeight: "1.2",
                          }
                        }}
                        size="small"
                        stickyHeader
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              sx={{
                                backgroundColor: LIGHT_GRAY2,
                                position: "sticky",
                                top: 0,
                                zIndex: 100,
                                borderBottom: "none",
                                boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
                              }}
                            >
                              <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Grid item>
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
                                </Grid>
                                {/* <Grid
                                  item
                                  sx={{
                                    cursor: "pointer",
                                  }}
                                  onClick={exportPriceBandMasterList}
                                >
                                  <img src="./Images/export.svg" alt="export" />
                                </Grid> */}
                              </Grid>
                            </TableCell>
                          </TableRow>
                          <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                            <TableCell
                              sx={{
                                ...tableHeaderStyle,
                                position: "sticky",
                                top: "45px",
                                backgroundColor: LIGHT_GRAY2,
                                zIndex: 100,
                                width: "50px",
                                padding: "8px 16px",
                              }}
                            >
                              S.NO
                            </TableCell>
                            {[
                              { label: "PRICE BAND", key: "priceBand" },
                              { label: "PRICE FROM", key: "priceFrom" },
                              { label: "PRICE TO", key: "priceTo" },
                              { label: "STATUS", sortable: false },
                              { label: "EDIT", sortable: false },
                            ].map((header) => (
                              <TableCell
                                key={header.label}
                                onClick={() =>
                                  header.sortable !== false && handleSort(header.key)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor:
                                    header.sortable !== false ? "pointer" : "default",
                                  position: "sticky",
                                  top: "45px",
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 100,
                                  padding: "8px 16px",
                                  minWidth: header.label === "EDIT" ? "60px" : "100px",
                                }}
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>{header.label}</Grid>
                                  {header.sortable !== false && (
                                    <Grid item>
                                      {sortConfig.key === header.key ? (
                                        sortConfig.direction === "asc" ? (
                                          <ArrowUpwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
                                          />
                                        ) : (
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 16,
                                              color: PRIMARY_BLUE2,
                                            }}
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
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
                                          />
                                          <ArrowDownwardIcon
                                            sx={{
                                              fontSize: 12,
                                              color: "grey.400",
                                            }}
                                          />
                                        </Grid>
                                      )}
                                    </Grid>
                                  )}
                                </Grid>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {loading ? (
                            Array(SKELETON_ROWS)
                              .fill(0)
                              .map((_, index) => (
                                <TableRowSkeleton key={index} columns={10} />
                              ))
                          ) : filteredRows.length === 0 ? (
                            Array(10).fill(0).map((_, index) => (
                              <TableRow key={index}>
                                <TableCell colSpan={6} align="center" sx={{ height: '48px' }}>
                                  {index === 0 ? "No records found" : ""}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <>
                              {filteredRows.map((row, index) => (
                                <TableRow
                                  key={row.id}
                                  sx={{
                                    fontSize: "10px",
                                    "&:hover": {
                                      backgroundColor: "#f5f5f5",
                                    },
                                    "& td": {
                                      borderBottom: `1px solid #C6CEED`,
                                    },
                                  }}
                                >
                                  <TableCell sx={{ ...rowstyle }}>
                                    {(page - 1) * rowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.priceBandCode || "N/A"}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    ₹ {row.priceFrom.toLocaleString()}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    ₹ {row.priceTo.toLocaleString()}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    <Switch
                                      checked={row.active}
                                      onChange={() => {
                                        document.getElementById('top-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        updatePriceBandMasterStatus(row.priceBandID, row.active ? 0 : 1)
                                      }}
                                      size="small"
                                      sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                          color: PRIMARY_BLUE2,
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                        {
                                          backgroundColor: DARK_PURPLE,
                                        },
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    <IconButton size="small">
                                      <EditIcon
                                        sx={{
                                          fontSize: 16,
                                          color: PRIMARY_BLUE2,
                                        }}
                                        onClick={() => {
                                          document.getElementById('top-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                          setFormData({
                                            priceBranCode: row.priceBandCode,
                                            priceFrom: row.priceFrom,
                                            priceTo: row.priceTo,
                                            priceStatus: row.active ? 1 : 0,
                                            selectionMode: 0,
                                            priceBandID: row.priceBandID,
                                          });
                                          setAccordionExpanded(true);
                                        }}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {filteredRows.length < 10 &&
                                Array(10 - filteredRows.length)
                                  .fill(0)
                                  .map((_, index) => (
                                    <TableRow key={`empty-${index}`}>
                                      <TableCell colSpan={6} sx={{ height: '48px' }}></TableCell>
                                    </TableRow>
                                  ))
                              }
                            </>
                          )}

                          {/* Pagination row */}
                          {/* <TableRow>
                            <TableCell
                              colSpan={6}
                              sx={{
                                p: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: LIGHT_GRAY2,
                                borderTop: `1px solid ${PRIMARY_LIGHT_GRAY}`,
                                zIndex: 1200,
                                boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.05)",
                                minHeight: "40px",
                              }}
                            >
                              <Grid
                                container
                                sx={{
                                  p: 2,
                                  alignItems: "center",
                                  justifyContent: "space-between",
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
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        mt: 1.5,
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
                                            handleChangeRowsPerPage({
                                              target: { value },
                                            })
                                          }
                                          sx={{
                                            minWidth: "25px",
                                            height: "24px",
                                            padding: "4px",
                                            borderRadius: "50%",
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

                                <Grid item sx={{ display: "flex", alignItems: "center", gap: 2, color: PRIMARY_BLUE2 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, fontSize: "8px", cursor: "pointer" }}
                                    onClick={handleJumpToFirst}
                                  >
                                    JUMP TO FIRST
                                  </Typography>

                                  <IconButton onClick={() => setPage(page - 1)} disabled={page === 1}>
                                    <NavigateBeforeIcon />
                                  </IconButton>

                                  <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>
                                    PAGE {page}
                                  </Typography>

                                  <IconButton
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
                                  >
                                    <NavigateNextIcon />
                                  </IconButton>

                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, fontSize: "8px", cursor: "pointer" }}
                                    onClick={handleJumpToLast}
                                  >
                                    JUMP TO LAST
                                  </Typography>

                                  <input
                                    type="number"
                                    placeholder="Jump to page"
                                    min={1}
                                    max={Math.ceil(totalRecords / rowsPerPage)}
                                    style={{
                                      width: "100px",
                                      height: "24px",
                                      fontSize: "10px",
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
                                    sx={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousSibling;
                                      const pageValue = parseInt(input.value, 10);
                                      if (pageValue >= 1 && pageValue <= Math.ceil(totalRecords / rowsPerPage)) {
                                        setPage(pageValue);
                                      }
                                    }}
                                  >
                                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow> */}

                 




                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                  </Grid>
                           {/* Custom Pagination */}
                           {filteredRows.length > 0 && (
                            <Grid
                            xs={12}
                              container
                              sx={{
                                p: 1,
                                alignItems: "center",
                                justifyContent: "space-between",
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: LIGHT_GRAY2,
                                zIndex: 1000,
                                // border: "1px solid red",
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
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      color: PRIMARY_BLUE2,
                                    }}
                                  >
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
                                          handleChangeRowsPerPage({
                                            target: { value },
                                          })
                                        }
                                        sx={{
                                          minWidth: "25px",
                                          height: "24px",
                                          padding: "4px",
                                          borderRadius: "50%",
                                          backgroundColor:
                                            rowsPerPage === value
                                              ? PRIMARY_BLUE2
                                              : "transparent",
                                          color:
                                            rowsPerPage === value
                                              ? "#fff"
                                              : PRIMARY_BLUE2,
                                          fontSize: "12px",
                                          "&:hover": {
                                            backgroundColor:
                                              rowsPerPage === value
                                                ? PRIMARY_BLUE2
                                                : "transparent",
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
                                  onClick={handleJumpToFirst}
                                >
                                  JUMP TO FIRST
                                </Typography>
                                <IconButton
                                  onClick={() => handlePrevPage()}
                                  disabled={page === 0}
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
                                  PAGE {page}
                                </Typography>

                                <IconButton
                                  sx={{
                                    cursor: "pointer",
                                    "&:focus": {
                                      outline: "none",
                                    },
                                  }}
                                  onClick={() => handleNextPage()}
                                  disabled={
                                    page >
                                    Math.ceil(totalRecords / rowsPerPage) - 1
                                  }
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
                                  onClick={handleJumpToLast}
                                  variant="body2"
                                >
                                  JUMP TO LAST
                                </Typography>
                                <input
                                  type="number"
                                  placeholder="JUMP TO PAGE"
                                  min={1}
                                  max={Math.ceil(totalRecords / rowsPerPage)}
                                  // value={customPageInput}
                                  // onChange={handleCustomPageInputChange}
                                  // onKeyPress={handleCustomPageKeyPress}
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
                                <Grid mt={1}
                                onClick={(e) => {
                                  const input = e.currentTarget.previousSibling;
                                  const pageValue = parseInt(input.value, 10);
                                  if (
                                    pageValue >= 1 &&
                                    pageValue <= Math.ceil(totalRecords / page)
                                  ) {
                                    handlePageChange(pageValue);
                                    // input.value = ''; 
                                  }
                                }}
                                 >
                                  <img
                                    src="./Icons/footerSearch.svg"
                                    style={{ cursor: "pointer" }}
                                    alt="arrow"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          )}


                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </>
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        position={"fixed"}
        right={{
          xs: 0,
          sm: 5,
          md: 5,
          lg: 12,
        }}
        sx={{
          zIndex: 10000,
          top: "0px",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
            // filter: isDownloadLoading ? "blur(2px)" : "none",
            transition: "filter 0.3s ease",
          },
          "& .export-button": {
            filter: "none !important",
          },
        }}
      >
        <NuralActivityPanel>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <SelectionPanel columns={""} views={""} />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralReports title="Reports" views={""} />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            xl={12}
            mt={2}
            mb={2}
            className="export-button"
          >
            <NuralExport
              title="Export"
              views={""}
              downloadExcel={exportPriceBandMasterList}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default PriceBand;
