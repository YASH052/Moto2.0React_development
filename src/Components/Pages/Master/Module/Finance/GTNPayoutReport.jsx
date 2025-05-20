import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../../Common/colors";
import NuralAutocomplete from "../../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../../NuralCustomComponents/NuralTextButton";
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
import { checkboxStyle, rowstyle, tableHeaderStyle } from "../../../../Common/commonstyles";
import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../../NuralCustomComponents/NuralReports";
import NuralExport from "../../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../../NuralCustomComponents/NuralActivityPanel";
const headerStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: DARK_PURPLE,
  marginLeft: "2%",
  marginBottom: "10px",
}
const GTNPayoutReport = () => {
  const [activeTab, setActiveTab] = React.useState("gtn-payout-report");
  const [selectedScheme, setSelectedScheme] = React.useState(null);
  const [selectedModel, setSelectedModel] = React.useState(null);

  const tabs = [
    { label: "Finance Api Block", value: "finance-api-block" },
    { label: "Servity Amount", value: "servify-offer" },
    { label: "GTN", value: "gtn" },
    { label: "GTN Payout Report", value: "gtn-payout-report" },
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

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const brands = ["Samsung", "Apple", "Sony", "LG", "Motorola", "Nokia"];
    const categories = ["Smartphone", "Tablet", "Laptop", "Accessories", "Wearables"];
    const models = ["Galaxy S21", "iPhone 13", "Xperia 1", "G8", "Edge 30", "N9"];
    const colors = ["Black", "White", "Blue", "Red", "Silver", "Gold"];
    const stockTypes = ["In Stock", "Low Stock", "Out of Stock"];
    const salesChannels = ["Online", "Retail", "Wholesale", "Direct"];

    // Generate 50 rows of realistic data
    return Array(50)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        stockAdjustNo: `ADJ-${2024}-${String(index + 1).padStart(4, '0')}`,
        salesChannel: salesChannels[Math.floor(Math.random() * salesChannels.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        model: models[Math.floor(Math.random() * models.length)],
        sku: `SKU-${Math.floor(Math.random() * 1000)}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        quantity: Math.floor(Math.random() * 100),
        stockType: stockTypes[Math.floor(Math.random() * stockTypes.length)]
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

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "240px", lg: "260px" }, // Add padding to make space for activity panel
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
            <BreadcrumbsHeader pageTitle="Finance" />
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
                  title="GTN Payout Report"
                  backgroundColor={LIGHT_GRAY2}
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
                    <Grid item xs={12} sm={6} md={2} lg={6}>
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
                    <Grid item xs={12} sm={6} md={2} lg={6}>
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
                    <Grid item xs={12} sm={6} md={4} lg={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        IMEI
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="IMEI"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>

                  {/* New Row for Scheme Type and Model Checkboxes */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "10px",
                          color: PRIMARY_BLUE2,
                          marginBottom: "2px",
                          fontWeight: 500,
                          marginLeft: "2%",
                        }}
                      >
                        SELECT
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={headerStyle}

                      >
                        Scheme Type
                      </Typography>
                      <Grid container direction="column" sx={{ gap: 1.5 }}>
                        {["Scheme 1", "Scheme 2", "Scheme 3", "Scheme 4"].map((scheme, index) => (
                          <Grid 
                            item 
                            key={scheme} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                              <input
                                type="checkbox"
                                name="schemeType"
                                id={scheme}
                                checked={selectedScheme === scheme}
                                onChange={() => setSelectedScheme(scheme)}
                                style={checkboxStyle}
                              />
                              {selectedScheme === scheme && (
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                                    width: '10px',
                                    height: '5px',
                                    borderLeft: '2px solid #3F4389',
                                    borderBottom: '2px solid #3F4389',
                                    pointerEvents: 'none'
                                  }}
                                />
                              )}
                            </div>
                            {selectedScheme === scheme ? (
                              <Grid
                                sx={{
                                  flex: 1,
                                  backgroundColor: '#3F4389',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                }}
                              >
                                <Typography
                                  component="label"
                                  htmlFor={scheme}
                                  sx={{
                                    fontSize: '14px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  {scheme}
                                </Typography>
                              </Grid>
                            ) : (
                              <Typography
                                component="label"
                                htmlFor={scheme}
                                sx={{
                                  flex: 1,
                                  fontSize: '14px',
                                  color: '#3F4389',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  padding: '12px 16px',
                                }}
                              >
                                {scheme}
                              </Typography>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "10px",
                          color: PRIMARY_BLUE2,
                          marginBottom: "2px",
                          fontWeight: 500,
                          marginLeft: "2%",
                        }}
                      >
                        SELECT
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={headerStyle}
                      >
                        Model
                      </Typography>
                      <Grid container direction="column" sx={{ gap: 1.5 }}>
                        {["Model 1", "Model 2", "Model 3", "Model 4"].map((model, index) => (
                          <Grid 
                            item 
                            key={model} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                              <input
                                type="checkbox"
                                name="modelType"
                                id={model}
                                checked={selectedModel === model}
                                onChange={() => setSelectedModel(model)}
                                style={checkboxStyle}
                              />
                              {selectedModel === model && (
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                                    width: '10px',
                                    height: '5px',
                                    borderLeft: '2px solid #3F4389',
                                    borderBottom: '2px solid #3F4389',
                                    pointerEvents: 'none'
                                  }}
                                />
                              )}
                            </div>
                            {selectedModel === model ? (
                              <Grid
                                sx={{
                                  flex: 1,
                                  backgroundColor: '#3F4389',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                }}
                              >
                                <Typography
                                  component="label"
                                  htmlFor={model}
                                  sx={{
                                    fontSize: '12px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                  }}
                                >
                                  {model}
                                </Typography>
                              </Grid>
                            ) : (
                              <Typography
                                component="label"
                                htmlFor={model}
                                sx={{
                                  flex: 1,
                                  fontSize: '12px',
                                  color: '#3F4389',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  padding: '12px 16px',
                                }}
                              >
                                {model}
                              </Typography>
                            )}
                          </Grid>
                        ))}
                      </Grid>
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
                    colSpan={9}
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
                  {[
                    { id: "primaryto", label: "PRIMARY TO" },
                    { id: "model", label: "MODEL" },
                    { id: "serialNo1", label: "SERIAL NO 1" },
                    { id: "serialNo2", label: "SERIAL NO 2" },
                    { id: "schemetype", label: "SCHEME TYPE" },
                    { id: "startDate", label: "START DATE" },
                    { id: "endDate", label: "END DATE" },
                    { id: "paymentAmount", label: "PAYMENT AMOUNT" },
                    { id: "activationDate", label: "ACTIVATION DATE" },
                  ].map(({ id, label }) => (
                    <TableCell
                      key={id}
                      onClick={() => handleSort(id)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: "pointer",
                        position: "sticky",
                        top: "46px",
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
                  .map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ ...rowstyle }}>{row.stockAdjustNo}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.salesChannel}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.brand}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.category}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.model}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.sku}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.color}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.quantity}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>{row.stockType}</TableCell>
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
              //   downloadExcel={downloadExcel}
              //   isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default GTNPayoutReport;
