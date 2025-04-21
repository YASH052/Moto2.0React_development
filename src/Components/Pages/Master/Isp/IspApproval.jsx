import { Grid, Typography, Button, Checkbox } from "@mui/material";
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
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
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
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
const IspApproval = () => {
  const [activeTab, setActiveTab] = React.useState("isp-approval");

  const tabs = [
    { label: "ISP Approval", value: "isp-approval" },
    // { label: "Add Saleschannel", value: "add-sales-channel" },
    // { label: "Add Retailer", value: "add-retailer" },
    // { label: "Search", value: "search" },
    // { label: "Approve Saleschannel", value: "approveSaleschannel" },
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

  // Add state for selected rows
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const retailerNames = [
      "Global Retail Solutions",
      "Tech Zone",
      "Digital Hub",
      "Smart Store",
      "Gadget World",
      "Electronics Plus"
    ];
    
    const states = [
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "Gujarat",
      "Delhi",
      "Telangana"
    ];
    
    const cities = [
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Ahmedabad",
      "New Delhi",
      "Hyderabad"
    ];
    
    const existingIsps = [
      "Airtel",
      "Jio",
      "BSNL",
      "Vodafone",
      "Tata Play",
      "ACT Fibernet"
    ];
    
    const isps = [
      "Jio Fiber",
      "Airtel Xstream",
      "BSNL Bharat Fiber",
      "Tata Play Fiber",
      "ACT Gigabit",
      "Vi Fiber"
    ];
    
    const statuses = ["Pending", "Approved", "Rejected", "Under Review"];
    
    const approvers = [
      "John Smith",
      "Priya Patel",
      "Michael Chen",
      "Sarah Johnson",
      "Raj Kumar",
      "Lisa Wong"
    ];

    // Generate 50 rows of realistic data
    return Array(50)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString('en-GB'), // Format as DD/MM/YYYY
        retailerName: retailerNames[Math.floor(Math.random() * retailerNames.length)],
        retailerCode: `RT${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        state: states[Math.floor(Math.random() * states.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        existingIsp: existingIsps[Math.floor(Math.random() * existingIsps.length)],
        isp: isps[Math.floor(Math.random() * isps.length)],
        ispCode: `ISP${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        approvedBy: approvers[Math.floor(Math.random() * approvers.length)]
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

  // Handle select all checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((row) => row.id);
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

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          // Add padding to make space for activity panel
        }}
      >
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
                        width="100%"
                        label="Sales Channel Type"
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
                        CHANNEL NAME
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Channel Name"
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
                        CHANNEL CODE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Channel Code"
                        options={options}
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
                        FROM DATE
                      </Typography>
                      <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
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
                      <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
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
                    colSpan={12}  // Updated colspan to account for checkbox
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
                    padding="checkbox"
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < filteredRows.length
                      }
                      checked={
                        filteredRows.length > 0 &&
                        selectedRows.length === filteredRows.length
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
                        zIndex: 1100,
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
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow
                        key={row.id}
                        selected={isItemSelected}
                        onClick={() => handleSelectRow(row.id)}
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
                        <TableCell sx={{ ...rowstyle }}>{row.state}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.city}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.existingIsp}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.isp}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.ispCode}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{row.status}</TableCell>
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
                  style={jumpToPageStyle}
                />
                <Grid mt={1}>
                  <img src="./Icons/footerSearch.svg" alt="arrow" />
                </Grid>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default IspApproval;
