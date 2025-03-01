import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
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
import NuralTextField from "../../NuralCustomComponents/NuralTextField";

const SerialNoMoment = () => {
  const [activeTab, setActiveTab] = React.useState("serial-no-moment");
  const tabs = [
    { label: "Serial No Moment", value: "serial-no-moment" },
    // { label: "ISR Sales Report", value: "isr-sales-report" },
    // { label: "Unique Sales Report", value: "unique-sales-report" },
    // { label: "Primary to Tertiary Track", value: "primary-to-tertiary-track" },
    // { label: "Competition Sales Report", value: "competition-sales-report" },
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
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Add new states for selected row and transactions
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);

  // Add these new states for transaction table pagination
  const [transactionPage, setTransactionPage] = React.useState(0);
  const [transactionRowsPerPage, setTransactionRowsPerPage] = React.useState(5); // Remove the const, make it changeable

  // Add new state for transaction sorting
  const [transactionSortConfig, setTransactionSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const regions = ["North", "South", "East", "West", "Central"];
    const states = [
      "Maharashtra",
      "Gujarat",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ];
    const saleTypes = ["Direct", "Distributor", "Online", "Retail"];
    const serialTypes = ["A123", "B456", "C789", "D012", "E345"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        column1: saleTypes[Math.floor(Math.random() * saleTypes.length)],
        column2: regions[Math.floor(Math.random() * regions.length)],
        column3: states[Math.floor(Math.random() * states.length)],
        column4: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        column5: Math.floor(Math.random() * 10000000),
        column6: serialTypes[Math.floor(Math.random() * serialTypes.length)],
        column7: `Product-${Math.floor(Math.random() * 100)}`,
        column8: Math.floor(Math.random() * 100),
        column9: `Status-${Math.floor(Math.random() * 3)}`,
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

  // Generate dummy transaction data
  const generateTransactionData = (ownerId) => {
    return Array(Math.floor(Math.random() * 10) + 1)
      .fill()
      .map((_, index) => ({
        id: `${ownerId}-${index}`,
        transactionType: ["Transfer", "Sale", "Return"][
          Math.floor(Math.random() * 3)
        ],
        fromChannel: `Channel-${Math.floor(Math.random() * 5)}`,
        fromChannelType: ["Distributor", "Retailer", "Direct"][
          Math.floor(Math.random() * 3)
        ],
        toChannel: `Channel-${Math.floor(Math.random() * 5)}`,
        toChannelType: ["Distributor", "Retailer", "Direct"][
          Math.floor(Math.random() * 3)
        ],
        transactionDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        skuCode: `SKU-${Math.floor(Math.random() * 1000)}`,
        refDocumentNo: `DOC-${Math.floor(Math.random() * 10000)}`,
        createdOn: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
      }));
  };

  // Handle row selection in current owner table
  const handleRowClick = (row) => {
    setSelectedRow(row);
    // Generate transaction data for the selected row
    const transactionData = generateTransactionData(row.id);
    setTransactions(transactionData);
  };

  // Add this after the existing handleRowClick function
  const handleTransactionChangePage = (event, newPage) => {
    setTransactionPage(newPage);
  };

  // Add this handler function
  const handleTransactionChangeRowsPerPage = (event) => {
    setTransactionRowsPerPage(parseInt(event.target.value, 10));
    setTransactionPage(0);
  };

  // Add sorting handler for transactions
  const handleTransactionSort = (columnName) => {
    let direction = "asc";

    if (transactionSortConfig.key === columnName) {
      if (transactionSortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setTransactionSortConfig({ key: null, direction: null });
        setTransactions([...transactions]); // Reset to original order
        return;
      }
    }

    setTransactionSortConfig({ key: columnName, direction });

    const sortedTransactions = [...transactions].sort((a, b) => {
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

    setTransactions(sortedTransactions);
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
          zIndex: 2000,
          backgroundColor: "#fff",
          paddingBottom: 1,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Reports" />
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
                  mb={2}
                  sx={{
                    gap: { xs: 2, sm: 3, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={5} md={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      SERIAL NO.
                    </Typography>
                    <NuralTextField
                      placeholder="xxxxx"
                      width="100%"
                      backgroundColor={LIGHT_BLUE}
                    />
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
                      text="RESET"
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

      {/* Current Owner Table */}
      <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: selectedRow
              ? "calc(70vh - 200px)"
              : "calc(120vh - 320px)",
            overflow: "auto",
            position: "relative",
            zIndex: 1,
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
                    Current Owner
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    top: "45px", // Adjusted to account for "List" header
                    backgroundColor: LIGHT_GRAY2,
                    zIndex: 1000,
                    "&::after": {
                      // Add bottom border effect
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <TableCell
                    key={`column${num}`}
                    onClick={() => handleSort(`column${num}`)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: "pointer",
                      position: "sticky",
                      top: "45px", // Same as S.NO cell
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>COLUMN {num}</Grid>
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        {sortConfig.key === `column${num}` ? (
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
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedRow?.id === row.id ? DARK_PURPLE : "inherit",
                      "&:hover": {
                        backgroundColor:
                          selectedRow?.id === row.id
                            ? DARK_PURPLE
                            : PRIMARY_LIGHT_GRAY,
                      },
                      "& .MuiTableCell-root": {
                        color: selectedRow?.id === row.id ? "#fff" : "inherit",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        ...rowstyle,
                        color: selectedRow?.id === row.id ? "#fff" : PRIMARY_BLUE2,
                        fontWeight: 600,
                      }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column1}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column2}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column3}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column4}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column5.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column6}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column7}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column8}
                    </TableCell>
                    <TableCell sx={{ 
                      ...rowstyle,
                      color: selectedRow?.id === row.id ? "#fff" : "inherit" 
                    }}>
                      {row.column9}
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
                  fontSize: "10px",
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

      {/* Transactions Table - Only show when a row is selected */}
      {selectedRow && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(70vh - 200px)",
              overflow: "auto",
              position: "relative",
              zIndex: 1,
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
                      Transaction
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell 
                    onClick={() => handleTransactionSort('transactionType')}
                    sx={{ 
                      ...tableHeaderStyle,
                      cursor: 'pointer',
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>TRANSACTION TYPE</Grid>
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        {transactionSortConfig.key === 'transactionType' ? (
                          transactionSortConfig.direction === "asc" ? (
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

                  <TableCell 
                    onClick={() => handleTransactionSort('fromChannel')}
                    sx={{ 
                      ...tableHeaderStyle,
                      cursor: 'pointer',
                      position: "sticky",
                      top: "45px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1000,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>FROM CHANNEL</Grid>
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        {transactionSortConfig.key === 'fromChannel' ? (
                          transactionSortConfig.direction === "asc" ? (
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

                  <TableCell 
                    onClick={() => handleTransactionSort('fromChannelType')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>FROM CHANNEL TYPE</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('toChannel')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>TO CHANNEL</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('toChannelType')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>TO CHANNEL TYPE</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('transactionDate')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>TRANSACTION DATE</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('skuCode')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>SKU CODE</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('refDocumentNo')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>REF DOCUMENT NO.</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell 
                    onClick={() => handleTransactionSort('createdOn')}
                    sx={{ ...tableHeaderStyle, cursor: 'pointer' }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>CREATED ON</Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .slice(
                    transactionPage * transactionRowsPerPage,
                    transactionPage * transactionRowsPerPage + transactionRowsPerPage
                  )
                  .map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.transactionType}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.fromChannel}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.fromChannelType}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.toChannel}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.toChannelType}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.transactionDate}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.skuCode}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.refDocumentNo}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {transaction.createdOn}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Add Transaction Table Pagination */}
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
                    {transactions.length} /{" "}
                    {Math.ceil(transactions.length / transactionRowsPerPage)} PAGES
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
                      mt: 1,
                      fontSize: "10px",
                      color: PRIMARY_BLUE2,
                      fontWeight: 600,
                    }}
                  >
                    SHOW :
                  </Typography>
                  {[5, 10, 25, 50].map((value) => (
                    <Grid item key={value}>
                      <Button
                        onClick={() =>
                          handleTransactionChangeRowsPerPage({ target: { value } })
                        }
                        sx={{
                          minWidth: "25px",
                          height: "24px",
                          padding: "4px",
                          borderRadius: "50%",
                          backgroundColor:
                            transactionRowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                          color: transactionRowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                          fontSize: "12px",
                          "&:hover": {
                            backgroundColor:
                              transactionRowsPerPage === value
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
                    fontSize: "10px",
                  }}
                >
                  JUMP TO FIRST
                </Typography>
                <IconButton
                  onClick={() => handleTransactionChangePage(null, transactionPage - 1)}
                  disabled={transactionPage === 0}
                >
                  <NavigateBeforeIcon />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  PAGE {transactionPage + 1}
                </Typography>

                <IconButton
                  onClick={() => handleTransactionChangePage(null, transactionPage + 1)}
                  disabled={
                    transactionPage >=
                    Math.ceil(transactions.length / transactionRowsPerPage) - 1
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
                  max={Math.ceil(transactions.length / transactionRowsPerPage)}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value, 10) - 1;
                    if (
                      newPage >= 0 &&
                      newPage < Math.ceil(transactions.length / transactionRowsPerPage)
                    ) {
                      handleTransactionChangePage(null, newPage);
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
      )}
    </Grid>
  );
};

export default SerialNoMoment;
