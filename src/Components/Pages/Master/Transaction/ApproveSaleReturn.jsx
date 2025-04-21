import React from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  Button,
  Switch,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import {
  AQUA,
  BLUE_COLOR,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import {
  rowstyle,
  tableHeaderStyle,
  titleStyle,
} from "../../../Common/commonstyles";
import Required from "../../../Common/Required";

import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";

const FileItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    // backgroundColor: "rgba(235, 238, 245, 0.8)",
  },
});

const FileContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const FileIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(198, 206, 237, 0.5)",
  borderRadius: "4px",
  width: "24px",
  height: "24px",
  "& svg": {
    width: "20px",
    height: "20px",
    color: DARK_PURPLE,
  },
});

const HiddenInput = styled("input")({
  display: "none",
});

const ApproveSaleReturn = () => {
  const [activeTab, setActiveTab] = React.useState("grn");

  const tabs = [
    { label: "Banner", value: "banner" },
    { label: "Tab", value: "#" },
  ];
  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    {
      value: 0,
      title: "TEXT",
    },
    {
      value: 1,
      title: "IMAGE",
    },
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
  const [selectedFile, setSelectedFile] = React.useState(null);
  const actualFileRef = React.useRef(null);
  const [selectedType, setSelectedType] = React.useState(null);

  const handleClick = () => {
    actualFileRef.current.click();
  };

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const brands = ["Samsung", "Apple", "Sony", "LG", "Motorola", "Nokia"];
    const categories = [
      "Smartphone",
      "Tablet",
      "Laptop",
      "Accessories",
      "Wearables",
    ];
    const models = [
      "Galaxy S21",
      "iPhone 13",
      "Xperia 1",
      "G8",
      "Edge 30",
      "N9",
    ];
    const colors = ["Black", "White", "Blue", "Red", "Silver", "Gold"];
    const stockTypes = ["In Stock", "Low Stock", "Out of Stock"];
    const salesChannels = ["Online", "Retail", "Wholesale", "Direct"];

    // Generate 50 rows of realistic data
    return Array(50)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        stockAdjustNo: `ADJ-${2024}-${String(index + 1).padStart(4, "0")}`,
        salesChannel:
          salesChannels[Math.floor(Math.random() * salesChannels.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        model: models[Math.floor(Math.random() * models.length)],
        sku: `SKU-${Math.floor(Math.random() * 1000)}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        quantity: Math.floor(Math.random() * 100),
        stockType: stockTypes[Math.floor(Math.random() * stockTypes.length)],
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
          // Add padding to make space for activity panel
        }}
      >
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
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      mb: 4,
                      mt: 1,
                    }}
                  >
                    Sale Return Approval
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
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        TYPE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Type"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        BANNER TITLE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Banner Title"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        TYPE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Type"
                        options={options}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        BANNER TITLE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="Banner Title"
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
                        TYPE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        options={options}
                        placeholder="DD/MMM/YYYY"
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
                        BANNER TITLE
                      </Typography>
                      <NuralCalendar
                        width="100%"
                        options={options}
                        placeholder="DD/MMM/YYYY"
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
                    colSpan={10}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 100,
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
                      Current Owner
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
                      zIndex: 100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                      <Grid item>
                        <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                      </Grid>
                    </Grid>
                  </TableCell>
                  {[
                    { id: "from", label: "FROM" },
                    { id: "fromCode", label: "FROM CODE" },
                    { id: "to", label: "TO" },
                    { id: "toCode", label: "TO CODE" },
                    { id: "requestNo", label: "REQUEST NO." },
                    { id: "requestDate", label: "REQUEST DATE" },
                    { id: "quantity", label: "QUANTITY" },
                    { id: "view", label: "VIEW" },
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
                        zIndex: 100,
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
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ ...rowstyle }}>{index + 1}</TableCell>

                      <TableCell sx={{ ...rowstyle }}>
                        {row.from || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.fromCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.to || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.toCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.requestNo || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.requestDate || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.quantity || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        <Button
                          sx={{
                            color: PRIMARY_BLUE2,
                            textTransform: "none",
                            fontSize: "12px",
                          }}
                        >
                          View &nbsp; <VisibilityIcon fontSize="small" />
                        </Button>
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
                    colSpan={10}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 100,

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
                      Request NO 1234
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
                      zIndex: 100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                      <Grid item>
                        <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                      </Grid>
                    </Grid>
                  </TableCell>
                  {[
                    { id: "model", label: "MODEL" },
                    { id: "sku", label: "SKU" },
                    { id: "skuCode", label: "SKU CODE" },
                    { id: "toCode", label: "TO CODE" },
                    { id: "mode", label: "MODE" },
                    { id: "imei", label: "IMEI" },
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
                        zIndex: 100,
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
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ ...rowstyle }}>{index + 1}</TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.model || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.sku || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.skuCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.toCode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.mode || "-"}
                      </TableCell>
                      <TableCell sx={{ ...rowstyle }}>
                        {row.imei || "-"}
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
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid
            mb={2}
            item
            backgroundColor={LIGHT_GRAY2}
            sx={{ borderRadius: "8px" }}
            p={2}
          >
            <Typography sx={titleStyle}>Rejection Marks</Typography>
            <Typography sx={labelStyle}>
              REMARKS <Required />
            </Typography>
            <Grid>
              <NuralTextField
                placeholder="ENTER REMARKS"
                width="100%"
                backgroundColor={LIGHT_BLUE}
                maxLength={100}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <NuralButton
                text="APPROVE"
                backgroundColor={AQUA}
                variant="contained"
                // onClick={handlePostRequest}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NuralButton
                text="REJECT"
                variant="outlined"
                borderColor={PRIMARY_BLUE2}
                // onClick={handleCancel}
                width="100%"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ApproveSaleReturn;
