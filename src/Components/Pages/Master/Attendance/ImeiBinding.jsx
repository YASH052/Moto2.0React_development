import { Grid, Typography, Button, TextField, AccordionDetails, Accordion, AccordionSummary, Box, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  AQUA_DARK,
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
import { headTitle, rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import ISPZeroSaleTable from "../../Dashboard/ISPZeroSaleTable";
const ImeiBinding = () => {
  const [activeTab, setActiveTab] = React.useState("imei-binding");
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const tabs = [
    { label: "Attendance Upload", value: "attendance-upload" },

    { label: "Leave Type", value: "leave-type" },
    { label: "Leave Allocation", value: "leave-allocation" },
    { label: "Manage", value: "manage" },
    { label: "IMEI Binding", value: "imei-binding" },
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
    const statuses = ["Pending", "Approved", "Rejected"];
    const requestTypes = ["Finance Block", "Theft Block", "Customer Request"];
    const userNames = ["John D.", "Sarah M.", "Mike R.", "Emma S.", "Alex P."];

    return Array(2)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        serialNumber: `IMEI${Math.floor(Math.random() * 1000000000)}`,
        serialNumber2: `SN${Math.floor(Math.random() * 100000)}`,
        skuCode: `SKU${Math.floor(Math.random() * 10000)}`,
        skuName: `Product ${Math.floor(Math.random() * 100)}`,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        requestType:
          requestTypes[Math.floor(Math.random() * requestTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        requestDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
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
  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("#");
    } else if (value === "batch") {
      navigate("#");
    }
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
          <BreadcrumbsHeader pageTitle="Manage" />
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
              <Grid
                item
                title="Balance Leave Update"
                backgroundColor={LIGHT_GRAY2}
                borderRadius={2}
                padding={2}
              >
                {/* First Row - 3 NuralAutocomplete */}
                <Typography
                  variant="h6"
                  sx={{
                   ...headTitle
                  }}
                >
                  SEARCH
                </Typography>

                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={4} md={4} lg={4} mb={1.5}>
                    <Typography
                      sx={{
                    ...labelStyle,
                    
                  }}
                    >
                      NAME
                    </Typography>
                    <NuralAutocomplete width="100%" placeholder="SELECT" />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4} mb={1.5}>
                    <Typography
                      sx={{
                    ...labelStyle,
                    
                  }}
                    >
                      CODE
                    </Typography>
                    <NuralAutocomplete width="100%" placeholder="SELECT" />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4} mb={1.5}>
                    <Typography
                      sx={{
                    ...labelStyle,
                    
                  }}
                    >
                      STATUS
                    </Typography>
                    <NuralAutocomplete width="100%" placeholder="SELECT" />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography
                      sx={{
                    ...labelStyle,
                    
                  }}
                    >
                      FROM DATE
                    </Typography>
                    <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography
                      sx={{
                    ...labelStyle,
                    
                  }}
                    >
                      TO DATE
                    </Typography>
                    <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
                  </Grid>
                  <Grid item xs={12} sm={1} md={1} lg={1} marginTop={2}>
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
                  <Grid item xs={12} sm={11} md={11} lg={11} marginTop={2}>
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

                {/* Second Row */}
              </Grid>
              <Grid
                container
                spacing={1}
                mt={1}
                px={1}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 1 },
                }}
              >
                <Grid xs={12} sm={12} md={12} lg={12}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      color: PRIMARY_BLUE2,
                      maxHeight: "calc(100vh - 300px)", // Add max height for scrolling
                      overflow: "auto",
                      borderRadius: "8px",
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
                              top: "48px",
                              backgroundColor: LIGHT_GRAY2,
                              zIndex: 1100,
                            }}
                          >
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>S.NO</Grid>
                            </Grid>
                          </TableCell>
                          {[
                            "Name",
                            "Code",
                            "Store",
                            "store code",
                            "Imei Binded",
                            "Binded Since",
                            "Request Date",
                            "Status",
                            "view",
                          ].map((header, index) => (
                            <TableCell
                              key={header}
                              onClick={() => handleSort(`column${index + 1}`)}
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
                                <Grid item>{header}</Grid>
                                <Grid
                                  item
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {sortConfig.key === `column${index + 1}` ? (
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
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                Column {index + 1}
                              </TableCell>
                              <TableCell
                                align="left"
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                <Switch
                                  checked={row.status}
                                  // onChange={() => handleStatusToggle(row.id)} // You can define this to update status
                                  color="primary"
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                sx={{
                                  ...rowstyle,
                                  color: PRIMARY_BLUE2,
                                  fontWeight: 600,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    
                                    cursor: "pointer",
                                  }}
                                  onClick={() => console.log("View clicked")}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: PRIMARY_BLUE2,
                                    }}
                                  >
                                    View
                                  </Typography>
                                  <img
                                    src="/Icons/eyeicon.svg"
                                    alt="view"
                                    style={{
                                      width: 20,
                                      height: 20,
                                    }}
                                  />
                                </Box>
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
              </Grid>
              <Grid
                item
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  borderRadius: 2,
                  p: 2,
                  mt: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: PRIMARY_BLUE2,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "19.12px",
                    letterSpacing: "0%",
                    mb: 2,
                  }}
                >
                  Detail
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ backgroundColor: LIGHT_GRAY2 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ color: PRIMARY_BLUE2, fontWeight: 700 }}
                        >
                          REQUESTED ON ↑
                        </TableCell>
                        <TableCell
                          sx={{ color: PRIMARY_BLUE2, fontWeight: 700 }}
                        >
                          TIME ↑
                        </TableCell>
                        <TableCell
                          sx={{ color: PRIMARY_BLUE2, fontWeight: 700 }}
                        >
                          OLD IMEI ↑
                        </TableCell>
                        <TableCell
                          sx={{ color: PRIMARY_BLUE2, fontWeight: 700 }}
                        >
                          NEW IMEI
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>xxxxx</TableCell>
                        <TableCell>Column 1</TableCell>
                        <TableCell>Column 1</TableCell>
                        <TableCell>Column 1</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid
                item
                spacing={2}
                marginTop={2}
                direction="column"
                xl={12}
                lg={12}
                md={12}
                borderRadius={4}
              >
                <Grid>
                  <Accordion
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      borderRadius: 4,
                      boxShadow: "none",
                      "&::before": { display: "none" }, // removes divider line
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: PRIMARY_BLUE2 }} />
                      }
                      sx={{
                        padding: 1,
                        "& .MuiAccordionSummary-content": {
                          margin: 0,
                        },
                        "& .MuiAccordionSummary-expandIconWrapper": {
                          outline: "none",
                        },
                        "&:focus": {
                          outline: "none",
                        },
                        "& .MuiSvgIcon-root:focus": {
                          outline: "none",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          ...headTitle
                        }}
                      >
                        Rejection Remark
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2 }}>
                      <Box>
                        <Typography
                        sx={labelStyle}
                        >
                          REMARK
                        </Typography>
                        <NuralTextField
                          placeholder="xxxxxxxxxxxxx"
                          width="100%"
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          marginLeft={3}
          marginRight={2}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <NuralButton
                text="APPROVE"
                variant="contained"
                color={AQUA_DARK}
                height="48px"
                backgroundColor={AQUA}
                width="100%"
                fontSize="12px"
              >
                SAVE
              </NuralButton>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} marginBottom={2}>
              <NuralButton
                text="reject"
                variant="outlined"
                color={PRIMARY_BLUE2}
                fontSize="12px"
                height="48px"
                borderColor={PRIMARY_BLUE2}
                onClick={() => console.log("Upload clicked")}
                width="100%"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ImeiBinding;
