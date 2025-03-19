import { Grid, Typography, Button, Switch } from "@mui/material";
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

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
const ViewRetailer = () => {
  const [activeTab, setActiveTab] = React.useState("retailer-view");

  const tabs = [
    { label: "Bulk Upload", value: "sales-bulk-upload" },
    { label: "Add Saleschannel", value: "add-sales-channel" },
    { label: "Add Retailer", value: "add-retailer" },
    { label: "Search", value: "search" },
    { label: "Approve Saleschannel", value: "approveSaleschannel" },
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

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Update the column definitions
  const tableColumns = [
    { id: "retailerCode", label: "RETAILER CODE", sortable: true },
    { id: "name", label: "NAME", sortable: true },
    { id: "parentRetailer", label: "PARENT RETAILER", sortable: true },
    { id: "state", label: "STATE", sortable: true },
    { id: "city", label: "CITY", sortable: true },
    { id: "loginId", label: "LOGIN ID", sortable: false },
    { id: "password", label: "PASSWORD", sortable: false },
    { id: "nd", label: "ND", sortable: false },
    { id: "channel", label: "CHANNEL", sortable: true },
    { id: "channelCode", label: "CHANNEL CODE", sortable: true },
    { id: "mobile", label: "MOBILE", sortable: false },
    { id: "details", label: "DETAILS", sortable: false },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  // Update the dummy data generator
  const generateDummyData = () => {
    const states = [
      "Maharashtra",
      "Gujarat",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ];
    const cities = {
      Maharashtra: ["Mumbai", "Pune", "Nagpur"],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
      Karnataka: ["Bangalore", "Mysore", "Hubli"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      Delhi: ["New Delhi", "Delhi NCR"],
    };
    const channels = ["Direct", "Distributor", "Online", "Retail"];
    const retailerNames = [
      "Retail Store A",
      "Super Market B",
      "Mega Mart C",
      "Shop D",
      "Store E",
    ];
    const parentRetailers = [
      "Parent Corp A",
      "Group B",
      "Holdings C",
      "Enterprise D",
    ];

    return Array(50)
      .fill()
      .map((_, index) => {
        const retailerCode = `${1234 + index}`; // Unique retailer codes
        const selectedState = states[Math.floor(Math.random() * states.length)];
        const selectedCities = cities[selectedState];
        const selectedChannel =
          channels[Math.floor(Math.random() * channels.length)];

        return {
          id: index + 1,
          retailerCode: retailerCode,
          name: retailerNames[Math.floor(Math.random() * retailerNames.length)],
          parentRetailer:
            parentRetailers[Math.floor(Math.random() * parentRetailers.length)],
          state: selectedState,
          city: selectedCities[
            Math.floor(Math.random() * selectedCities.length)
          ],
          loginId: `user${retailerCode}`,
          password: `********`, // Masked password
          nd: `${Math.floor(Math.random() * 9999)}.${Math.floor(
            Math.random() * 99
          )}K`,
          channel: selectedChannel,
          channelCode: `${selectedChannel.substring(0, 3).toUpperCase()}${
            1000 + index
          }`,
          mobile: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          details: `View`,
          status: `•`,
          edit: `✎`,
        };
      });
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
        <Grid item xs={12} mt={3} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Sales" />
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
              <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={3}
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
                      ND
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="nd"
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
                      SALES CHANNEL
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="Sales Channel"
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
                      STATE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="State"
                      options={options}
                      placeholder="SELECT"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      RETAILER CODE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="Retailer Code"
                      options={options}
                      placeholder="SELECT"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      RETAILER NAME
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="Retailer Name"
                      options={options}
                      placeholder="SELECT"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} mt={1}>
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
                      width="100%"
                      label="Status"
                      options={options}
                      placeholder="SELECT"
                    />
                  </Grid>
                </Grid>

                {/* Second Row - Buttons */}
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
                  <Grid item xs={12} sm={9} md={11}>
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

      {/* Add this after the NuralAccordion2 component */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(100vh - 300px)", // Add max height for scrolling
            overflow: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={15}
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
                    top: "49px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 1100,
                  }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: column.sortable ? "pointer" : "default",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>{column.label}</Grid>
                      {column.sortable && (
                        <Grid
                          item
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {sortConfig.key === column.id ? (
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
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
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
                    {tableColumns.map((column) => (
                      <TableCell key={column.id} sx={{ ...rowstyle }}>
                        {column.id === "details" ? (
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span>{row[column.id]}</span>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                marginLeft: "5px",
                                color: DARK_PURPLE,
                              }}
                            >
                              {" "}
                              <VisibilityIcon fontSize="small" />
                            </span>
                          </div>
                        ) : column.id === "status" ? (
                          <Switch size="small" />
                        ) : column.id == "edit" ? (
                          <Edit sx={{ color: DARK_PURPLE }} fontSize="small" />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Custom Pagination */}
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
                  {filteredRows.length} /{" "}
                  {Math.ceil(filteredRows.length / rowsPerPage)} PAGES
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
                          rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
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
                }}
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
                disabled={
                  page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                }}
                variant="body2"
              >
                JUMP TO LAST
              </Typography>
              <input
                type="number"
                placeholder="Jump to page"
                min={1}
                max={Math.ceil(filteredRows.length / rowsPerPage)}
                // value={page + 1}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value, 10) - 1;
                  if (
                    newPage >= 0 &&
                    newPage < Math.ceil(filteredRows.length / rowsPerPage)
                  ) {
                    setPage(newPage);
                  }
                }}
                style={{
                  width: "100px",
                  height: "24px",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                }}
              />
              <Grid mt={1}>
                <img src="./Icons/footerSearch.svg" alt="arrow" />
              </Grid>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ViewRetailer;
