import {
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PRIMARY_BLUE2, LIGHT_GRAY2 } from "../../../Common/colors";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// import { useNavigate } from "react-router-dom"; // Unused

import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";

import { rowstyle } from "../../../Common/commonstyles";
import { ReportQueueScreenAPI } from "../../../Api/Api";
import NuralPagination from "../../../Common/NuralPagination";
import StatusModel from "../../../Common/StatusModel";

const tableHeaderStyle = {
  fontFamily: "Manrope",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "16.39px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
};

const ReportQueue = () => {
  // const navigate = useNavigate(); // Unused

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchParams, setSearchParams] = useState({
    pageIndex: 1, //1-UI, -1-Excel to export
    pageSize: 10,
    active: 255,
  });

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [originalRows, setOriginalRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        // setFilteredRows([...rows]); // Reset to original order
        setFilteredRows([...originalRows]); // Reset using original fetched data
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
    setPage(0); // Reset page on sort
  };

  // Add search/filter functionality - Currently unused as no search UI calls it
  // const handleSearch = (searchValues) => {
  //   const filtered = originalRows.filter((row) => {
  //     return (
  //       (!searchValues.saleType ||
  //         row.column1
  //           .toLowerCase()
  //           .includes(searchValues.saleType.toLowerCase())) &&
  //       (!searchValues.region ||
  //         row.column2
  //           .toLowerCase()
  //           .includes(searchValues.region.toLowerCase())) &&
  //       (!searchValues.state ||
  //         row.column3
  //           .toLowerCase()
  //           .includes(searchValues.state.toLowerCase())) &&
  //       (!searchValues.fromDate ||
  //         new Date(row.column4) >= new Date(searchValues.fromDate)) &&
  //       (!searchValues.toDate ||
  //         new Date(row.column4) <= new Date(searchValues.toDate))
  //     );
  //   });

  //   setFilteredRows(filtered);
  //   setPage(0); // Reset to first page when filtering
  // };

  // Pagination change handler (similar to Model.jsx)
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      ...searchParams,
      pageIndex: paginationState.page + 1, // API uses 1-based index
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams); // Update searchParams state

    getReportQueue(updatedParams); // Refetch data
  };

  const handleDownload = (downloadPath) => {
    if (downloadPath) {
      window.open(downloadPath, '_blank');
      setStatus(200);
      setTitle('File Downloaded Successfully');
      setTimeout(() => {
        setStatus(null);
        setTitle(null);
      }, 5000);
    }
    else{
      setStatus(400);
      setTitle('Error in Downloading File');
      setTimeout(() => {
        setStatus(null);
        setTitle(null);
      }, 3000);
    }
  };

  const getReportQueue = async (params = searchParams) => {
    try {
      setTableLoading(true);
      const response = await ReportQueueScreenAPI(params);
      if (response.statusCode === "200") {
        setOriginalRows(response.queueReportList || []); // Store original data
        setFilteredRows(response.queueReportList || []); // Set initial filtered data
        setTotalRecords(response.totalRecords || 0); // Set total records from response
      } else {
        console.error("API Error:", response.statusCode, response.statusMessage);
        setOriginalRows([]); // Clear original data on error/no data
        setFilteredRows([]);
        setTotalRecords(0); // Reset total records on error
      }
    } catch (error) {
      console.log("Error in get report queue", error);
      console.error("Fetch Error:", error);
      setOriginalRows([]);
      setFilteredRows([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getReportQueue();
  }, []);
  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Rest of the content */}
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
          <BreadcrumbsHeader pageTitle="Report Queue" />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        lg={12}
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ px: 2, py: 2, md: 0 }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(150vh - 300px)", // Add max height for scrolling
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                      Report Queue
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
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                    </Grid>
                  </TableCell>
                  {[
                    { id: "requestForReport", label: "REPORT REQUESTED" },
                    { id: "createdOn", label: "REQUEST DATE" },
                    { id: "createdBy", label: "REQUESTED BY" },
                    { id: "processStatus", label: "STATUS" },
                    { id: "download", label: "DOWNLOAD", sortable: false },
                  ].map(({ id, label, sortable = true }) => (
                    <TableCell
                      key={id}
                      onClick={() => sortable && handleSort(id)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: sortable ? "pointer" : "default",
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{label}</Grid>
                        {sortable && (
                          <Grid
                            item
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {sortConfig.key === id ? (
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
                        )}
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Conditionally render Skeleton or Table Content */}
                {tableLoading ? (
                  // Render skeleton rows
                  Array.from({ length: rowsPerPage }).map((_, rowIndex) => ( // Use rowsPerPage for skeleton count
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {/* Match the number of columns (6) */}
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`} sx={{ ...rowstyle }}>
                          <Skeleton animation="wave" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredRows.length > 0 ? (
                  // Render actual data rows
                  filteredRows.map((row, index) => (
                    <TableRow key={row.id || `row-${index}`} sx={{ ...rowstyle }}> {/* Use a unique key like id if available, fallback */}
                      <TableCell sx={{ ...rowstyle }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.requestForReport || "-"} {/* Add fallback for missing data */}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.createdOn || "-"}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.createdBy || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.processStatus || "-"}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <IconButton
                          size="small"
                          title="Download Report"
                          sx={{
                            color: PRIMARY_BLUE2,
                            cursor: 'pointer',
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                          disabled={!row?.downloadPath}
                          onClick={() => handleDownload(row.downloadPath)}
                        >
                          <img
                            src="./Icons/downIcon2.svg"
                            alt="download"
                            style={{ width: 16, height: 16 }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Render "No data available" message when not loading and no data
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ ...rowstyle }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Custom Pagination - Updated Props */}
           <NuralPagination
             key={`pagination-${page}-${rowsPerPage}-${totalRecords}`}
             totalRecords={totalRecords}
             initialPage={page}
             initialRowsPerPage={rowsPerPage}
             onPaginationChange={handlePaginationChange}
          />
          </TableContainer>
        </Grid>

        <Grid container sx={{ margin: "16px"}}>
          
            {
              status && 
              <StatusModel
                width={"100%"}
                status={status}
                title={title}
                open={open}
                onClose={() => {
                setStatus(null)
                setTitle(null)
                }}
              />
            }
          
        </Grid>

        
      </Grid>
      
    </Grid>
  );
};

export default ReportQueue;
