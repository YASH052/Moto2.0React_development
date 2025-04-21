import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
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
import { useNavigate } from "react-router-dom";
import {
  GetLocationList,
  GetOrgnHierarchyMappingReport,
} from "../../../Api/Api";
import NuralPagination from "../../../Common/NuralPagination";
import { FormSkeleton } from "../../../Common/Skeletons";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import { Skeleton } from "@mui/material";

const OrganisationHierarchyreport = () => {
  const [activeTab, setActiveTab] = React.useState(
    "org-hierarchy-mapping-report"
  );

  const tabs = [
    { label: "User Tracking", value: "user-tracking" },
    { label: "Last Login", value: "last-login" },
    { label: "User Laggards", value: "user-laggards" },

    {
      label: "Org Hierarchy Mapping Report",
      value: "org-hierarchy-mapping-report",
    },
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

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination similar to Model.jsx
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalRecords, setTotalRecords] = React.useState(0);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [filteredRows, setFilteredRows] = React.useState([]); // Initialize as empty array
  const [roleList, setRoleList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [searchParams, setSearchParams] = useState({
    hierarchyLevelId: 0,
    orgnHierarchyId: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  // Add Loading States
  const [searchFormLoading, setSearchFormLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  // Add state for export loading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

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
        setFilteredRows([...filteredRows]); // Reset to original order
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

  // Add pagination handler similar to Model.jsx
  const handlePaginationChange = (paginationState) => {
    const updatedParams = {
      hierarchyLevelId: searchParams.hierarchyLevelId,
      orgnHierarchyId: searchParams.orgnHierarchyId,
      pageIndex: paginationState.page + 1, // API uses 1-based index
      pageSize: paginationState.rowsPerPage,
    };

    setPage(paginationState.page);
    setRowsPerPage(paginationState.rowsPerPage);
    setSearchParams(updatedParams);

    getOrgnHierarchyMappingReport(updatedParams); // Fetch data for the new page
  };

  const getRoleList = async () => {
    try {
      const params = {
        hierarchyLevelID: 0, //0= to bind hierarchy list, HierarchyLevelID to get Location List
      };
      const response = await GetLocationList(params);
      if (response.statusCode === "200") {
        setRoleList(response.hierarchyList || []);
      } else {
        console.error("Failed to fetch location list:", response.statusMessage);
        setRoleList([]);
      }
    } catch (error) {
      console.error("Error fetching location list:", error);
      setLocationList([]);
    }
  };
  const getLocationList = async (hierarchyLevelID) => {
    try {
      const params = {
        hierarchyLevelID: hierarchyLevelID, //0= to bind hierarchy list, HierarchyLevelID to get Location List
      };
      const response = await GetLocationList(params);
      if (response.statusCode === "200") {
        setLocationList(response.locationList || []);
      } else {
        console.error("Failed to fetch location list:", response.statusMessage);
        setLocationList([]);
      }
    } catch (error) {
      console.error("Error fetching location list:", error);
      setLocationList([]);
    }
  };

  // Modify API call function to accept params, set totalRecords, and handle export
  const getOrgnHierarchyMappingReport = async (params = searchParams) => {
    // Only set table loading true if it's NOT an export request
    if (params.pageIndex !== -1) {
      setTableLoading(true);
    }
    try {
      // console.log("Fetching report with params:", params); // Debug log
      const response = await GetOrgnHierarchyMappingReport(params);

      // Handle export case first
      if (params.pageIndex === -1 && response.reportLink) {
        window.location.href = response.reportLink;
        return; // Stop further processing for export
      }

      if (response.statusCode === "200") {
        setFilteredRows(response.reportList || []);
        setTotalRecords(response.totalRecords || 0); // Update total records
      } else {
        console.error(
          "Failed to fetch organisation hierarchy mapping report:",
          response.statusMessage
        );
        setFilteredRows([]);
        setTotalRecords(0); // Reset total records on error
      }
    } catch (error) {
      console.error(
        "Error fetching organisation hierarchy mapping report:",
        error
      );
      setFilteredRows([]);
      setTotalRecords(0); // Reset total records on error
    } finally {
      // Always set table loading false when fetch ends (success or error)
      setTableLoading(false);
    }
  };

  // Add handleExport function similar to Model.jsx
  const handleExport = async () => {
    // Set download loading true
    setIsDownloadLoading(true);
    const exportParams = {
      ...searchParams,
      pageIndex: -1, // Use -1 to indicate export request
    };
    try {
      // Call the existing data fetching function with export parameters
      await getOrgnHierarchyMappingReport(exportParams);
    } catch (error) {
      console.error("Error exporting organisation hierarchy report:", error);
      // Optionally show an error message to the user here
    } finally {
      // Set download loading false
      setIsDownloadLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data using default searchParams
    getOrgnHierarchyMappingReport(searchParams);
    getRoleList();
    getLocationList(0); // Call with default 0 initially? Or based on initial searchParams.hierarchyLevelId
    // Set form loading false after initial fetches are initiated
    setSearchFormLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependencies empty for initial load

  const handleSearch = () => {
    const searchPayload = {
      hierarchyLevelId: searchParams.hierarchyLevelId,
      orgnHierarchyId: searchParams.orgnHierarchyId,
      pageIndex: 1, // Reset page index for new search
      pageSize: searchParams.pageSize,
    };
    // Update state first to reflect the reset page index
    setSearchParams(searchPayload);
    setPage(0); // Reset UI page state
    getOrgnHierarchyMappingReport(searchPayload);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pl: { xs: 1, sm: 1 }, // Existing padding left
          // Add right padding to make space for the activity panel
          pr: { xs: 0, sm: 0, md: "240px", lg: "270px" }, 
          isolation: "isolate",
        }}
      >
        {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="User Reports" />
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
                {/* Conditionally render Form Skeleton or Search Form */}
                {searchFormLoading ? (
                  <FormSkeleton />
                ) : (
                  <NuralAccordion2
                    title="Organisation Hierarchy Mapping Report"
                    backgroundColor={LIGHT_GRAY2}
                    defaultExpanded={true} // Keep expanded by default
                  >
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
                      <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        {/*  {
            "roleId": 90,
            "roleName": "AccXchange"
        }, */}

                        <NuralAutocomplete
                          options={roleList}
                          getOptionLabel={(option) => option.hierarchyLevelName}
                          isOptionEqualToValue={(option, value) =>
                            option.hierarchyLevelID === value?.hierarchyLevelID
                          }
                          value={
                            searchParams.hierarchyLevelId === 0
                              ? null
                              : roleList.find(
                                  (item) =>
                                    item.hierarchyLevelID ==
                                    searchParams.hierarchyLevelId
                                ) || null
                          }
                          onChange={(event, value) => {
                            getLocationList(value ? value.hierarchyLevelID : 0);
                            // console.log(value);
                            // Only update hierarchyLevelId, not roleId
                            setSearchParams((prevParams) => ({
                              ...prevParams, // Keep existing orgnHierarchyId, pageSize
                              hierarchyLevelId: value
                                ? value.hierarchyLevelID
                                : 0,
                              pageIndex: 1, // Reset page index on filter change
                            }));
                            // We don't need to call API here, search button will do it
                          }}
                          width="100%"
                          label="Role"
                          placeholder="SELECT"
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
                          LOCATION
                        </Typography>
                        {/*   {
             {
              "orgnhierarchyID": 373,
              "locationCode": "North & East India-Hariom Kumar Mishra"
          },
          }, */}
                        <NuralAutocomplete
                          options={locationList}
                          getOptionLabel={(option) => option.locationCode}
                          isOptionEqualToValue={(option, value) =>
                            option.orgnhierarchyID === value?.orgnhierarchyID
                          }
                          value={
                            locationList.find(
                              (item) =>
                                item.orgnhierarchyID ==
                                searchParams.orgnHierarchyId
                            ) || null
                          }
                          onChange={(event, value) => {
                            setSearchParams((prevParams) => ({
                              ...prevParams,
                              orgnHierarchyId: value
                                ? value.orgnhierarchyID
                                : 0,
                              pageIndex: 1, // Reset page index on filter change
                            }));
                            // We don't need to call API here, search button will do it
                          }}
                          width="100%"
                          label="Location"
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
                          onClick={async () => {
                            // Show both skeletons immediately
                            setSearchFormLoading(true);
                            setTableLoading(true);

                            // Reset searchParams to default values (0 for IDs)
                            const resetParams = {
                              hierarchyLevelId: 0, // Default value
                              orgnHierarchyId: 0, // Default value
                              pageIndex: 1,
                              pageSize: 10,
                            };
                            setSearchParams(resetParams);
                            setPage(0); // Reset UI page
                            setLocationList([]);
                            try {
                              // Call API with reset params to refresh the table and wait for it
                              await getOrgnHierarchyMappingReport(resetParams);
                            } catch (error) {
                              console.error(
                                "Error during cancel operation:",
                                error
                              );
                              // Ensure loading states are turned off even if API fails
                              setTableLoading(false);
                            } finally {
                              // Hide form skeleton after API call finishes
                              setSearchFormLoading(false);
                              // tableLoading is already set to false in getOrgnHierarchyMappingReport's finally block,
                              // but setting it here again ensures it's off if the API call itself threw an error
                              // before reaching the finally block (though unlikely with current structure).
                              // If getOrgnHierarchyMappingReport handles its own errors well, this might be redundant.
                              // Let's keep it for safety, or remove if getOrgnHierarchyMappingReport guarantees setting it false.
                              // Re-checking getOrgnHierarchyMappingReport: Yes, it has a finally block.
                              // So, technically only setSearchFormLoading(false) is needed here.
                              // However, setting both provides clear intent that both loaders stop after cancel completes.
                              setTableLoading(false); // Explicitly set false for clarity after await
                            }
                          }}
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
                          onClick={handleSearch} // Use updated handleSearch
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

        {/* Add this after the NuralAccordion2 component */}
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }} mt={-2}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 90px)", // Add max height for scrolling
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
                      zIndex: 1000,
                      borderBottom: "none",
                    }}
                  >
                    {/* Use Grid container for Title and Export icon */}
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
                      <Grid item sx={{ cursor: "pointer", pr: 1 }}>
                        {" "}
                        {/* Added pr for padding */}
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  {[
                    { id: "sno", label: "S NO" },
                    { id: "hoName", label: "HO" },
                    { id: "nsm", label: "NSM" },
                    { id: "rsm", label: "RSM" },
                    { id: "asm", label: "ASM" },
                    { id: "tsm", label: "TSM" },
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
                        zIndex: 1100,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{label}</Grid>
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
                      </Grid>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Conditionally render Table Skeleton (MUI approach) or Table Content */}
                {tableLoading ? (
                  // Map arrays to create skeleton rows and cells like IspSaleReport
                  Array.from({ length: 10 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {Array.from({ length: 6 }).map((_, cellIndex) => (
                        <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                          <Skeleton animation="wave" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ ...rowstyle }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.hoName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.nsmName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.rsmEmail || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.asmName || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.tsmName || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Custom Pagination - Pass required props */}
            <NuralPagination
              key={`pagination-${page}-${rowsPerPage}`} // Add key for re-render on change
              totalRecords={totalRecords}
              initialPage={page}
              initialRowsPerPage={rowsPerPage}
              onPaginationChange={handlePaginationChange}
            />
          </TableContainer>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        mr={0} // Remove margin right if any
        position={"fixed"}
        // Adjust right positioning
        right={10}
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
              downloadExcel={handleExport}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default OrganisationHierarchyreport;
