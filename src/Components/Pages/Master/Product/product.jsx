import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
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

const tabs = [
  { label: "Upload", value: "upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "SubCategory" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
];
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
const Product = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnName) => {
    let direction = "asc";
    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (a[columnName] < b[columnName]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[columnName] > b[columnName]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedRows);
  };

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
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Breadcrumbs Header */}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1200,
            backgroundColor: "#fff",
            pb: 1,
          }}
        >
          <BreadcrumbsHeader pageTitle="Product" />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: "48px",
            zIndex: 1200,
            backgroundColor: "#fff",
            pb: 1,
          }}
        >
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
        {activeTab === "sku" && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2 title="Create" backgroundColor={LIGHT_GRAY2}>
                    <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                      <Grid item xs={12} sm={3}>
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
                          BRAND
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          SUB-CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
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
                          SUB CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL CODE
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ margin: 2 }}>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          borderColor={PRIMARY_BLUE2}
                          onClick={() => console.log("Upload clicked")}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text="SAVE"
                          backgroundColor={AQUA}
                          variant="contained"
                          onClick={() => console.log("Upload clicked")}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                    <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                      <Grid item xs={12} sm={3}>
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
                          SUB CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL TYPE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL MODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
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
                          MODEL MODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          BRAND
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL CODE
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ margin: 2 }}>
                      <Grid item xs={12} sm={3}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          sx={{
                            borderColor: PRIMARY_BLUE2,
                            color: PRIMARY_BLUE2,
                            backgroundColor: "transparent",
                            width: "100%",
                            borderRadius: "10px",
                          }}
                          onClick={() => console.log("Cancel clicked")}
                        />
                      </Grid>

                      <Grid item xs={12} sm={9}>
                        <NuralButton
                          text={
                            <>
                              <Search sx={{ mr: 1 }} /> SAVE
                            </>
                          }
                          backgroundColor={AQUA}
                          variant="contained"
                          sx={{
                            width: "100%",
                            color: WHITE,
                            borderRadius: "10px",
                            backgroundColor: PRIMARY_BLUE2,
                          }}
                          onClick={() => console.log("Save clicked")}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
                      <TableContainer
                        component={Paper}
                        sx={{
                          backgroundColor: LIGHT_GRAY2,
                          color: PRIMARY_BLUE2,
                          maxHeight: "calc(100vh - 380px)", // Adjusted to account for headers
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
                                  top: "39px", // Adjusted to account for "List" header
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
                                    top: "39px", // Same as S.NO cell
                                    backgroundColor: LIGHT_GRAY2,
                                    zIndex: 1000,
                                  }}
                                >
                                  <Grid
                                    container
                                    alignItems="center"
                                    spacing={1}
                                  >
                                    <Grid item>COLUMN {num}</Grid>
                                    <Grid
                                      item
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {sortConfig.key === `column${num}` ? (
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
                                  </Grid>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredRows
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row, index) => (
                                <TableRow
                                  key={row.id}
                                  sx={{
                                    backgroundColor:
                                      index % 2 === 0
                                        ? "#BCD4EC"
                                        : PRIMARY_LIGHT_GRAY,
                                  }}
                                >
                                  <TableCell
                                    sx={{
                                      ...rowstyle,
                                      color: PRIMARY_BLUE2,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {page * rowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column1}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column2}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column3}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column4}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column5.toLocaleString()}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column6}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column7}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
                                    {row.column8}
                                  </TableCell>
                                  <TableCell sx={{ ...rowstyle }}>
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
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: PRIMARY_BLUE2,
                                }}
                              >
                                {filteredRows.length} /{" "}
                                {Math.ceil(filteredRows.length / rowsPerPage)}{" "}
                                PAGES
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
                                      // border: `1px solid ${PRIMARY_BLUE2}`,
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
                                page >=
                                Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                                const newPage =
                                  parseInt(e.target.value, 10) - 1;
                                if (
                                  newPage >= 0 &&
                                  newPage <
                                    Math.ceil(filteredRows.length / rowsPerPage)
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
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {activeTab === "model" && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2 title="Create" backgroundColor={LIGHT_GRAY2}>
                    <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                      <Grid item xs={12} sm={4}>
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
                          BRAND
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          SUB-CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
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
                          SUB CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL TYPE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL MODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
                          MODEL CODE
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ margin: 2 }}>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          borderColor={PRIMARY_BLUE2}
                          onClick={() => console.log("Upload clicked")}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text="SAVE"
                          backgroundColor={AQUA}
                          variant="contained"
                          onClick={() => console.log("Upload clicked")}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                    <Grid container spacing={2} sx={{ width: "100%", px: 2 }}>
                      <Grid item xs={12} sm={4}>
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
                          SUB CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL TYPE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                          MODEL MODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="Select"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
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
                          MODEL NAME
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
                          MODEL CODE
                        </Typography>
                        <NuralTextField
                          placeholder="Enter Text"
                          fullWidth
                          sx={{ width: "100%" }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} sx={{ margin: 2 }}>
                      <Grid item xs={12} sm={3}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          sx={{
                            borderColor: PRIMARY_BLUE2,
                            color: PRIMARY_BLUE2,
                            backgroundColor: "transparent",
                            width: "100%",
                            borderRadius: "10px",
                          }}
                          onClick={() => console.log("Cancel clicked")}
                        />
                      </Grid>

                      <Grid item xs={12} sm={9}>
                        <NuralButton
                          text={
                            <>
                              <Search sx={{ mr: 1 }} /> SAVE
                            </>
                          }
                          backgroundColor={AQUA}
                          variant="contained"
                          sx={{
                            width: "100%",
                            color: WHITE,
                            borderRadius: "10px",
                            backgroundColor: PRIMARY_BLUE2,
                          }}
                          onClick={() => console.log("Save clicked")}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>

                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        backgroundColor: LIGHT_GRAY2,
                        color: PRIMARY_BLUE2,
                        maxHeight: "calc(100vh - 380px)", // Adjusted to account for headers
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
                                top: "39px", // Adjusted to account for "List" header
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
                                  top: "39px", // Same as S.NO cell
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 1000,
                                }}
                              >
                                <Grid container alignItems="center" spacing={1}>
                                  <Grid item>COLUMN {num}</Grid>
                                  <Grid
                                    item
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {sortConfig.key === `column${num}` ? (
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
                                </Grid>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredRows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => (
                              <TableRow
                                key={row.id}
                                sx={{
                                  backgroundColor:
                                    index % 2 === 0
                                      ? "#BCD4EC"
                                      : PRIMARY_LIGHT_GRAY,
                                }}
                              >
                                <TableCell
                                  sx={{
                                    ...rowstyle,
                                    color: PRIMARY_BLUE2,
                                    fontWeight: 600,
                                  }}
                                >
                                  {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column1}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column2}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column3}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column4}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column5.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column6}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column7}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.column8}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
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
                            <span
                              style={{
                                fontWeight: 700,
                                color: PRIMARY_BLUE2,
                              }}
                            >
                              {filteredRows.length} /{" "}
                              {Math.ceil(filteredRows.length / rowsPerPage)}{" "}
                              PAGES
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
                                    // border: `1px solid ${PRIMARY_BLUE2}`,
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
                              page >=
                              Math.ceil(filteredRows.length / rowsPerPage) - 1
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
                                newPage <
                                  Math.ceil(filteredRows.length / rowsPerPage)
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
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Product;
