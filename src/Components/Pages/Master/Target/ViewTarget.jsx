import { Grid, Typography, Button, Link } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from '@mui/icons-material/Edit';
import {
  AQUA,
  DARK_PURPLE,
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
import { useNavigate } from "react-router-dom";

const ViewTarget = () => {
  const [activeTab, setActiveTab] = React.useState("view-target");
  const navigate = useNavigate();
  const tabs = [
    { label: "Add Target", value: "target" },
    { label: "Search", value: "view-target" },
  ];

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

  // Update the dummy data generator
  const generateDummyData = () => {
    const targetTypes = ["Type A", "Type B", "Type C"];
    const categories = ["Category 1", "Category 2", "Category 3"];
    const targetFors = ["Sales", "Revenue", "Units"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        targetName: `Target ${index + 1}`,
        targetFor: targetFors[Math.floor(Math.random() * targetFors.length)],
        targetFrom: new Date(2024, Math.floor(Math.random() * 12), 1).toLocaleDateString(),
        targetTo: new Date(2024, Math.floor(Math.random() * 12), 28).toLocaleDateString(),
        targetCategory: categories[Math.floor(Math.random() * categories.length)],
        targetType: targetTypes[Math.floor(Math.random() * targetTypes.length)],
        targetBasedOn: `Metric ${index + 1}`,
        target: Math.floor(Math.random() * 1000),
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

  // Update the handleSort function
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

  // Update the handleSearch function
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.isp ||
          row.column1.toLowerCase().includes(searchValues.isp.toLowerCase())) &&
        (!searchValues.fromDate ||
          new Date(row.column4) >= new Date(searchValues.fromDate)) &&
        (!searchValues.toDate ||
          new Date(row.column4) <= new Date(searchValues.toDate)) &&
        (!searchValues.state ||
          row.column3
            .toLowerCase()
            .includes(searchValues.state.toLowerCase())) &&
        (!searchValues.city ||
          row.column2
            .toLowerCase()
            .includes(searchValues.city.toLowerCase())) &&
        (!searchValues.product ||
          row.column7
            .toLowerCase()
            .includes(searchValues.product.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0);
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    const searchValues = {
      isp: document.querySelector('[placeholder="Select"]')?.value || "",
      fromDate: document.querySelector('[placeholder="Select"]')?.value || "",
      toDate: document.querySelector('[placeholder="DD/MM/YY"]')?.value || "",
      state: document.querySelector('[label="State"]')?.value || "",
      city: document.querySelector('[label="City"]')?.value || "",
      product:
        document.querySelector('[placeholder="Select"]')?.lastValue || "",
    };
    handleSearch(searchValues);
  };

  const handleReset = () => {
    // Reset all filters
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset the table to show all rows
    setFilteredRows(rows);
    setPage(0);
    setSortConfig({ key: null, direction: null });
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Target" />
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
        mt={0}
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
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={4}>
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
                      label="Target For"
                      options={options}
                      placeholder="Select"
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
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
                      label="Target Name"
                      options={options}
                      placeholder="Select"
                      width="100%"
                    />
                  </Grid>{" "}
                  <Grid item xs={12} sm={12} md={4}>
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
                    <NuralAutocomplete
                      label="Target Category"
                      options={options}
                      placeholder="Select"
                      width="100%"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  mt={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
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
                    <NuralCalendar width="100%" placeholder="Select" />
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
                    <NuralCalendar width="100%" placeholder="Select" />
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

      {/* Add this after the NuralAccordion2 component */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(120vh - 180px)", // Adjusted to account for headers
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
                  colSpan={11}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
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
                    zIndex: 100,
                    width: "50px",
                    padding: "8px 16px",
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
                  <Grid container alignItems="center">
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                <TableCell
                  onClick={() => handleSort('targetName')}
                  sx={{
                    ...tableHeaderStyle,
                    cursor: "pointer",
                    position: "sticky",
                    top: "45px",
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 100,
                    padding: "8px 16px",
                    minWidth: "100px",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      borderBottom: "2px solid #e0e0e0",
                    },
                    "& .MuiGrid-container": {
                      justifyContent: "flex-start",
                    },
                  }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>TARGET NAME</Grid>
                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                      {sortConfig.key === 'targetName' ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUpwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
                        )
                      ) : (
                        <Grid
                          container
                          direction="column"
                          alignItems="center"
                          sx={{ height: 16, width: 16 }}
                        >
                          <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                          <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </TableCell>
                {[
                  "TARGET FOR",
                  "TARGET FROM",
                  "TARGET TO",
                  "TARGET CATEGORY",
                  "TARGET TYPE",
                  "TARGET BASED ON",
                  "TARGET",
                  "VIEW",
                  "EDIT",
                ].map((header, index) => {
                  // Convert header to camelCase for columnId
                  const columnId = header.toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
                    .replace(/\s/g, '');

                  return (
                    <TableCell
                      key={columnId}
                      onClick={() =>
                        header !== "VIEW" && header !== "EDIT" && handleSort(columnId)
                      }
                      sx={{
                        ...tableHeaderStyle,
                        cursor: header !== "VIEW" && header !== "EDIT" ? "pointer" : "default",
                        position: "sticky",
                        top: "45px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 100,
                        padding: "8px 16px",
                        minWidth: header === "VIEW" || header === "EDIT" ? "60px" : "100px",
                        "& .MuiGrid-container": {
                          justifyContent: "flex-start",
                        },
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{header}</Grid>
                        {header !== "VIEW" && header !== "EDIT" && (
                          <Grid item sx={{ display: "flex", alignItems: "center" }}>
                            {sortConfig.key === columnId ? (
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
                                <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                                <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                              </Grid>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      fontSize: "10px",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        width: "50px",
                      }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetName || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetFor || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetFrom || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetTo || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetCategory || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetType || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.targetBasedOn || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      {row.target || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "left",
                      }}
                    >
                      View{" "} &nbsp;
                      <VisibilityIcon
                        sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "60px",
                       
                      }}
                    >
                      <IconButton size="small">
                        <EditIcon
                          sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                        />
                      </IconButton>
                    </TableCell>
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
              backgroundColor: LIGHT_GRAY2, // Light blue-gray background
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
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "10px",
                      color: PRIMARY_BLUE2,
                      fontWeight: 600,
                    }}
                  >
                    SHOW :
                  </Typography>
                </Grid>
                {[10, 25, 50, 100].map((value) => (
                  <Grid item key={value}>
                    <Button
                      onClick={() =>
                        handleChangeRowsPerPage({ target: { value } })
                      }
                      sx={{
                        minWidth: "30px",
                        height: "24px",
                        padding: "4px 8px",
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
                gap: 1,
              }}
            >
              <Button
                onClick={() => setPage(0)}
                sx={{
                  color: PRIMARY_BLUE2,
                  textTransform: "none",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                JUMP TO FIRST
              </Button>

              <IconButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                sx={{ color: PRIMARY_BLUE2 }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                sx={{ fontSize: "10px", fontWeight: 700, color: PRIMARY_BLUE2 }}
              >
                PAGE {page + 1}
              </Typography>

              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
                }
                sx={{ color: PRIMARY_BLUE2 }}
              >
                <NavigateNextIcon />
              </IconButton>

              <Button
                onClick={() =>
                  setPage(Math.ceil(filteredRows.length / rowsPerPage) - 1)
                }
                sx={{
                  color: PRIMARY_BLUE2,
                  textTransform: "none",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                JUMP TO LAST
              </Button>

              <input
                type="text"
                placeholder="JUMP TO PAGE"
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
                  padding: "0 8px",
                  borderRadius: "4px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                  backgroundColor: "#F8F9FD",
                  fontSize: "10px",
                }}
              />
              <IconButton sx={{ color: PRIMARY_BLUE2 }}>
                <img
                  src="./Icons/footerSearch.svg"
                  alt="search"
                  style={{ width: 20, height: 20 }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ViewTarget;
