import { Grid, Typography, Button, Link, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const PrebookingSKUview = () => {
  const [activeTab, setActiveTab] = React.useState("prebooking-sku-view");
  const navigate = useNavigate();
  const tabs = [
    { label: "Add SKU", value: "prebooking-sku-create" },
    { label: "Search", value: "prebooking-sku-view" },
  ];

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = {
    categories: [
      "Electronics",
      "Appliances",
      "Mobile Phones",
      "Computers",
      "Home Entertainment",
    ],
    subcategories: [
      "Smartphones",
      "Laptops",
      "Tablets",
      "Smart TVs",
      "Refrigerators",
      "Washing Machines",
      "Air Conditioners",
    ],
    models: [
      "iPhone 15",
      "MacBook Pro",
      "Samsung RF28",
      "iPad Air",
      "LG Front Load",
      "Sony Bravia",
      "Dell XPS",
    ],
    skus: [
      "IP15-128-BLK",
      "MBP-14-SLV",
      "RF28-BLK",
      "IPA-256-GRY",
      "LGFL-8KG-WHT",
      "SB-65-BLK",
      "XPS-15-SLV",
    ],
    colors: ["Black", "White", "Silver", "Space Gray", "Blue", "Red", "Gold"],
  };

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

  // Update the generateDummyData function
  const generateDummyData = () => {
    const getRandomDate = () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 11, 31);
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      ).toLocaleDateString();
    };

    const dummyData = [
      {
        category: "Electronics",
        subCategory: "Smartphones",
        model: "iPhone 15",
        sku: "IP15-128-BLK",
        color: "Black",
        startDate: "01/01/2024",
        endDate: "03/31/2024",
        status: true,
      },
      {
        category: "Electronics",
        subCategory: "Laptops",
        model: "MacBook Pro",
        sku: "MBP-14-SLV",
        color: "Silver",
        startDate: "02/01/2024",
        endDate: "04/30/2024",
        status: false,
      },
      {
        category: "Appliances",
        subCategory: "Refrigerators",
        model: "Samsung RF28",
        sku: "RF28-BLK",
        color: "Black",
        startDate: "01/15/2024",
        endDate: "05/15/2024",
        status: true,
      },
      {
        category: "Electronics",
        subCategory: "Tablets",
        model: "iPad Air",
        sku: "IPA-256-GRY",
        color: "Space Gray",
        startDate: "03/01/2024",
        endDate: "06/30/2024",
        status: true,
      },
      {
        category: "Appliances",
        subCategory: "Washing Machines",
        model: "LG Front Load",
        sku: "LGFL-8KG-WHT",
        color: "White",
        startDate: "02/15/2024",
        endDate: "05/31/2024",
        status: false,
      },
    ];

    // Generate additional random entries based on the template
    return [
      ...dummyData,
      ...Array(45)
        .fill()
        .map(() => ({
          category:
            options.categories[
              Math.floor(Math.random() * options.categories.length)
            ],
          subCategory:
            options.subcategories[
              Math.floor(Math.random() * options.subcategories.length)
            ],
          model:
            options.models[Math.floor(Math.random() * options.models.length)],
          sku: options.skus[Math.floor(Math.random() * options.skus.length)],
          color:
            options.colors[Math.floor(Math.random() * options.colors.length)],
          startDate: getRandomDate(),
          endDate: getRandomDate(),
          status: Math.random() > 0.5,
        })),
    ];
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
      // Map column names to their corresponding data properties
      const columnMap = {
        category: "category",
        subcategory: "subCategory", // Map "subcategory" to "subCategory"
        model: "model",
        sku: "sku",
        color: "color",
        startdate: "startDate",
        enddate: "endDate",
      };

      // Get the actual property name from the map
      const propertyName = columnMap[columnName.toLowerCase()];

      if (!a[propertyName]) return 1;
      if (!b[propertyName]) return -1;

      const aValue = a[propertyName].toString().toLowerCase();
      const bValue = b[propertyName].toString().toLowerCase();

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
        (!searchValues.category ||
          row.category
            .toLowerCase()
            .includes(searchValues.category.toLowerCase())) &&
        (!searchValues.subcategory ||
          row.subCategory
            .toLowerCase()
            .includes(searchValues.subcategory.toLowerCase())) &&
        (!searchValues.model ||
          row.model.toLowerCase().includes(searchValues.model.toLowerCase())) &&
        (!searchValues.sku ||
          row.sku.toLowerCase().includes(searchValues.sku.toLowerCase())) &&
        (!searchValues.color ||
          row.color.toLowerCase().includes(searchValues.color.toLowerCase())) &&
        (!searchValues.startDate ||
          new Date(row.startDate) >= new Date(searchValues.startDate)) &&
        (!searchValues.endDate ||
          new Date(row.endDate) <= new Date(searchValues.endDate))
      );
    });

    setFilteredRows(filtered);
    setPage(0);
  };

  // Update the handleSearchClick function
  const handleSearchClick = () => {
    const searchValues = {
      category: document.querySelector('[label="Category"]')?.value || "",
      subcategory:
        document.querySelector('[label="Sub Category"]')?.value || "",
      model: document.querySelector('[label="Model"]')?.value || "",
      sku: document.querySelector('[label="SKU"]')?.value || "",
      color: document.querySelector('[label="Color"]')?.value || "",
      startDate: document.querySelector('[placeholder="Select"]')?.value || "",
      endDate: document.querySelector('[placeholder="Select"]')?.value || "",
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

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Export to Excel clicked");
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
          <BreadcrumbsHeader pageTitle="Pre Booking SKU" />
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
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      MODEL
                    </Typography>
                    <NuralAutocomplete
                      label="model"
                      options={options.categories}
                      placeholder="Select"
                      width="100%"
                    />
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
                      SKU
                    </Typography>
                    <NuralAutocomplete
                      label="sku"
                      options={options.subcategories}
                      placeholder="Select"
                      width="100%"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                ></Grid>
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
                      START DATE
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
                      END DATE
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
                    <Grid
                      item
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <img src="./Images/export.svg" alt="export" />
                    </Grid>
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
                  <Grid container alignItems="center">
                    <Grid item>S.NO</Grid>
                  </Grid>
                </TableCell>
                {[
                  { label: "CATEGORY", key: "category" },
                  { label: "SUB CATEGORY", key: "subcategory" },
                  { label: "MODEL", key: "model" },
                  { label: "SKU", key: "sku" },
                  { label: "COLOR", key: "color" },
                  { label: "START DATE", key: "startdate" },
                  { label: "END DATE", key: "enddate" },
                  { label: "STATUS", sortable: false },
                  { label: "EDIT", sortable: false },
                ].map((header, index) => (
                  <TableCell
                    key={header.label}
                    onClick={() =>
                      header.sortable !== false && handleSort(header.key)
                    }
                    sx={{
                      ...tableHeaderStyle,
                      cursor: header.sortable !== false ? "pointer" : "default",
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
                        <Grid
                          item
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {sortConfig.key === header.key ? (
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
                      {row.target || "Column 1"}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "100px",
                      }}
                    >
                      <Switch
                        checked={row.status}
                        onChange={(e) => {
                          const newRows = [...filteredRows];
                          const rowIndex = newRows.findIndex(
                            (r) => r.id === row.id
                          );
                          newRows[rowIndex] = {
                            ...newRows[rowIndex],
                            status: e.target.checked,
                          };
                          setFilteredRows(newRows);

                          // Update the main rows array as well
                          const mainRowIndex = rows.findIndex(
                            (r) => r.id === row.id
                          );
                          const newMainRows = [...rows];
                          newMainRows[mainRowIndex] = {
                            ...newMainRows[mainRowIndex],
                            status: e.target.checked,
                          };
                          setRows(newMainRows);
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
                    <TableCell
                      sx={{
                        padding: "8px 16px",
                        fontSize: "10px",
                        textAlign: "left",
                        minWidth: "60px",
                      }}
                    >
                      <IconButton size="small">
                        <EditIcon sx={{ fontSize: 16, color: PRIMARY_BLUE2 }} />
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

export default PrebookingSKUview;
