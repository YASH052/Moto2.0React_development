import { Button, Grid, Switch, Typography } from "@mui/material";
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
  LIGHT_BLUE,
  PRIMARY_BLUE,
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

const tabs = [
  { label: "Upload", value: "upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "sub-category" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
  { label: "Focus Model", value: "focusModel" },
  { label: "Price", value: "price" },
  { label: "Pre Booking", value: "preBooking" },
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
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
const BrandPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("brand");
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

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        brandName: `Brand ${index + 1}`,
        brandCode: `CODE-${index + 1}`,
        status: Math.random() > 0.5,
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

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
            zIndex: 1000,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Product" />
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
                  title="Create Brand"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid container spacing={4} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        BRAND NAME
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        BRAND CODE
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} mt={1} pr={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={() => console.log("Upload clicked")}
                        width="97%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="SAVE"
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={() => console.log("Upload clicked")}
                        width="97%"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} pr={1.5}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                  <Grid container spacing={2} sx={{ width: "100%" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
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
                        BRAND NAME
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="xxxxx"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1} mt={1}>
                    <Grid item spacing={1} xs={6} sm={1} md={1}>
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
                    <Grid item xs={12} sm={11} md={11} pr={1.5}>
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
                              colSpan={5}
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
                              S.NO
                            </TableCell>
                            {[
                              { label: "BRAND NAME", key: "brandName" },
                              { label: "BRAND CODE", key: "brandCode" },
                              { label: "STATUS", sortable: false },
                              { label: "EDIT", sortable: false },
                            ].map((header) => (
                              <TableCell
                                key={header.label}
                                onClick={() =>
                                  header.sortable !== false &&
                                  handleSort(header.key)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor:
                                    header.sortable !== false
                                      ? "pointer"
                                      : "default",
                                  position: "sticky",
                                  top: "45px",
                                  backgroundColor: LIGHT_GRAY2,
                                  zIndex: 100,
                                  padding: "8px 16px",
                                  minWidth:
                                    header.label === "EDIT" ? "60px" : "100px",
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
                          {filteredRows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => (
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
                                  {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.brandName}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.brandCode}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
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
                                    <EditIcon
                                      sx={{
                                        fontSize: 16,
                                        color: PRIMARY_BLUE2,
                                      }}
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
                              style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}
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
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </>
      </Grid>
    </>
  );
};

export default BrandPage;
