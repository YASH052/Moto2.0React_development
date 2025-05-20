import { Grid, Typography, Button, Chip, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
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
  IconButton,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  titleStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../NuralCustomComponents/NuralReports";
import NuralExport from "../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";

const Country = () => {
  const [activeTab, setActiveTab] = React.useState("country");

  const tabs = [
    { label: "Upload", value: "geography-bulk-upload" },
    { label: "Country", value: "#" },
    { label: "State", value: "state" },
    { label: "City", value: "city" },
    { label: "Area", value: "area" },
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
    direction: "asc",
  });

  // Update dummy data for countries
  const generateDummyData = () => {
    const countries = [
      { name: "India", code: "IN" },
      { name: "United States", code: "US" },
      { name: "United Kingdom", code: "UK" },
      { name: "Australia", code: "AU" },
      { name: "Canada", code: "CA" },
      { name: "Germany", code: "DE" },
      { name: "France", code: "FR" },
      { name: "Japan", code: "JP" },
      { name: "Singapore", code: "SG" },
      { name: "Brazil", code: "BR" },
    ];

    return countries.map((country, index) => ({
      sNo: index + 1,
      countryName: country.name,
      countryCode: country.code,
      status: Math.random() > 0.5,
    }));
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (direction === "asc") {
        return a[key].toString().localeCompare(b[key].toString());
      } else {
        return b[key].toString().localeCompare(a[key].toString());
      }
    });
    setFilteredRows(sortedRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return {
          color: "#00C950",
          backgroundColor: "#E6F9ED",
        };
      case "Inactive":
        return {
          color: "#FF3A29",
          backgroundColor: "#FFEDEB",
        };
      case "Pending":
        return {
          color: "#FFB200",
          backgroundColor: "#FFF5E6",
        };
      default:
        return {
          color: "#666666",
          backgroundColor: "#F5F5F5",
        };
    }
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
    // Add your edit logic here
  };

  // Common styles for table headers
  const commonHeaderStyle = {
    ...tableHeaderStyle,
    position: "sticky",
    top: "45px",
    backgroundColor: LIGHT_GRAY2,
    zIndex: 100,
    padding: "8px 16px",
  };

  const sortableHeaderStyle = {
    ...commonHeaderStyle,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#E8EDF1",
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
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
      );
    }
    return (
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
    );
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
          <Grid item xs={12} mt={0} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Geography" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabbs}
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
                  title="Create Country"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Typography variant="h6" sx={titleStyle}>
                    Create Country
                  </Typography>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={labelStyle}>
                        COUNTRY NAME
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER COUNTRY NAME"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={labelStyle}>
                        COUNTRY CODE
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER COUNTRY CODE"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                <Grid container spacing={1} my={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="SAVE"
                      backgroundColor={AQUA}
                      variant="contained"
                      width="100%"
                    />
                  </Grid>
                </Grid>
                <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                  <Typography variant="h6" sx={titleStyle}>
                    Search
                  </Typography>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={labelStyle}>
                        COUNTRY NAME
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={labelStyle}>
                        COUNTRY CODE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} sm={10}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
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
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 300px)",
                overflow: "auto",
                "& .MuiTableCell-root": {
                  padding: "8px 16px",
                },
              }}
            >
              <Table
                sx={{
                  minWidth: 650,
                  borderCollapse: "separate",
                  borderSpacing: "0",
                }}
                size="small"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ ...commonHeaderStyle, borderBottom: "none" }}
                    >
                      <Typography variant="h6" sx={titleStyle}>
                        List
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                    <TableCell
                      sx={{
                        ...commonHeaderStyle,
                        width: "50px",
                      }}
                    >
                      S.NO
                    </TableCell>
                    <TableCell
                      sx={sortableHeaderStyle}
                      onClick={() => handleSort("countryName")}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>COUNTRY NAME</Grid>
                        <Grid item>{getSortIcon("countryName")}</Grid>
                      </Grid>
                    </TableCell>
                    <TableCell
                      sx={sortableHeaderStyle}
                      onClick={() => handleSort("countryCode")}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>COUNTRY CODE</Grid>
                        <Grid item>{getSortIcon("countryCode")}</Grid>
                      </Grid>
                    </TableCell>
                    <TableCell
                      sx={{
                        ...commonHeaderStyle,
                        width: "50px",
                      }}
                    >
                      STATUS
                    </TableCell>
                    <TableCell
                      sx={{
                        ...commonHeaderStyle,
                        width: "50px",
                      }}
                    >
                      EDIT
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.sNo}
                        sx={{
                          fontSize: "10px",
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                          "& td": {
                            borderBottom: "1px solid #C6CEED",
                          },
                          "&:hover td": {
                            backgroundColor: "#F8FAFC",
                          },
                        }}
                      >
                        <TableCell sx={rowstyle}>{row.sNo}</TableCell>
                        <TableCell sx={rowstyle}>{row.countryName}</TableCell>
                        <TableCell sx={rowstyle}>{row.countryCode}</TableCell>
                        <TableCell sx={rowstyle}>
                          <Switch
                            checked={row.status}
                            // onChange={() => handleToggleChange(row.id)}
                            sx={{
                              ...toggleSectionStyle,
                              "& .MuiSwitch-thumb": {
                                backgroundColor: row.status
                                  ? PRIMARY_BLUE2
                                  : DARK_PURPLE,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={rowstyle}>
                          <IconButton
                            size="small"
                            sx={{
                              color: PRIMARY_BLUE2,
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Custom Pagination */}
              <Grid container sx={tablePaginationStyle}>
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
                            color:
                              rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
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

        {/* Add this after the NuralAccordion2 component */}
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

export default Country;
