import { Grid, Typography, Button, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
  WHITE,
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
  Checkbox,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import { useNavigate } from "react-router-dom";
import StatusModel from "../../../Common/StatusModel";
import { Edit } from "@mui/icons-material";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
];

const Color = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("color");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [accordionExpanded2, setAccordionExpanded2] = React.useState(true);

  const tabs = [
    { label: "Upload", value: "product-bulk-upload" },
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

  const options2 = [
    "LOCATION 1",
    "LOCATION 2",
    "LOCATION 3",
    "LOCATION 4",
    "LOCATION 5",
  ];

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  // Replace the existing dummy data with color-specific data
  const generateDummyData = () => {
    const colors = [
      { name: "Red", code: "#FF0000" },
      { name: "Blue", code: "#0000FF" },
      { name: "Green", code: "#00FF00" },
      { name: "Yellow", code: "#FFFF00" },
      { name: "Black", code: "#000000" },
      { name: "White", code: "#FFFFFF" },
      { name: "Purple", code: "#800080" },
      { name: "Orange", code: "#FFA500" },
      { name: "Pink", code: "#FFC0CB" },
      { name: "Gray", code: "#808080" },
    ];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        colorName: colors[Math.floor(Math.random() * colors.length)].name,
        colorCode: colors[Math.floor(Math.random() * colors.length)].code,
        status: Math.random() > 0.5,
      }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  // Define table columns
  const tableColumns = [
    { id: "colorName", label: "COLOR NAME", sortable: true },
    { id: "colorCode", label: "COLOR CODE", sortable: true },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

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

  // Update the search functionality for colors
  const handleSearch = (searchValues) => {
    const filtered = rows.filter((row) => {
      return (
        (!searchValues.colorName ||
          row.colorName
            .toLowerCase()
            .includes(searchValues.colorName.toLowerCase())) &&
        (!searchValues.colorCode ||
          row.colorCode
            .toLowerCase()
            .includes(searchValues.colorCode.toLowerCase()))
      );
    });

    setFilteredRows(filtered);
    setPage(0);
  };

  // Update the search button click handler
  const handleSearchClick = () => {
    const searchValues = {
      colorName: document.querySelector('[name="colorName"]')?.value || "",
      colorCode: document.querySelector('[name="colorCode"]')?.value || "",
    };
    handleSearch(searchValues);
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case "add-location":
        navigate("/add-location");
        break;
      case "view-location":
        navigate("/view-location");
        break;
      case "add-user":
        navigate("/add-user");
        break;
      case "view-user":
        navigate("/view-user");
        break;
      case "upload":
        navigate("/upload");
        break;
      case "brand":
        navigate("/brand");
        break;
      case "category":
        navigate("/category");
        break;
      case "sub-category":
        navigate("/sub-category");
        break;
      case "model":
        navigate("/model");
        break;
      case "color":
        navigate("/color");
        break;
      case "sku":
        navigate("/sku");
        break;
      case "focusModel":
        navigate("/focusModel");
        break;
      case "price":
        navigate("/price");
        break;
      case "preBooking":
        navigate("/preBooking");
        break;

      default:
        break;
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Rest of the content */}
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
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 2, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2
                  title="Create"
                  controlled={true}
                  expanded={accordionExpanded}
                  onChange={(event, expanded) => setAccordionExpanded(expanded)}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      marginBottom: "10px",
                      marginTop: "10px",
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    Color
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        COLOR NAME
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER COLOR NAME"
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
                        COLOR CODE
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER COLOR CODE"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
                <StatusModel
                  width="100%"
                  status="200"
                  title="New Color Created"
                />
              </Grid>

              {accordionExpanded && (
                <Grid
                  container
                  spacing={1}
                  mt={0.5}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6}>
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
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="SAVE"
                      variant="contained"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      backgroundColor={AQUA}
                      onClick={() => console.log("Upload clicked")}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} direction="column">
            <Grid item>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={2}>
                <NuralAccordion2
                  title="View"
                  controlled={true}
                  expanded={accordionExpanded2}
                  onChange={(event, expanded) =>
                    setAccordionExpanded2(expanded)
                  }
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: DARK_PURPLE,
                      marginBottom: "10px",
                      marginTop: "10px",
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    Search
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        COLOR NAME
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="COLOR NAME"
                        options={["RED", "GREEN", "BLUE", "YELLOW", "ORANGE"]}
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
                        COLOR CODE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        label="COLOR CODE"
                        options={[
                          "#FF0000",
                          "#00FF00",
                          "#0000FF",
                          "#FFFF00",
                          "#FFA500",
                        ]}
                        placeholder="SELECT"
                      />
                    </Grid>

                    <Grid item spacing={1} xs={11} sm={2} md={1}>
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
                    <Grid item xs={12} sm={10} md={11}>
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
                {accordionExpanded2 && (
                  <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                            {tableColumns.map((column) => (
                              <TableCell
                                key={column.id}
                                onClick={() =>
                                  column.sortable && handleSort(column.id)
                                }
                                sx={{
                                  ...tableHeaderStyle,
                                  cursor: column.sortable
                                    ? "pointer"
                                    : "default",
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
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {sortConfig.key === column.id ? (
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
                              <TableRow key={row.id}>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.colorName}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  {row.colorCode}
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  <Switch checked={row.status} size="small" />
                                </TableCell>
                                <TableCell sx={{ ...rowstyle }}>
                                  <Edit
                                    sx={{ color: DARK_PURPLE }}
                                    fontSize="small"
                                  />
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
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Color;
