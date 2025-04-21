import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import React, { useState } from "react";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";

import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";

import { useNavigate } from "react-router-dom";

import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { tableHeaderStyle } from "../../../Common/commonstyles";
import EditIcon from "@mui/icons-material/Edit";

const tableColumns = [
  { id: "channelName", label: "CHANNEL NAME", sortable: true },
  { id: "channelCode", label: "CHANNEL CODE", sortable: true },
  { id: "salesmanName", label: "SALESMAN NAME", sortable: true },
  { id: "salesmanCode", label: "SALESMAN CODE", sortable: true },
  { id: "address", label: "ADDRESS", sortable: true },
  { id: "mobileNo", label: "MOBILE NO", sortable: true },
  { id: "email", label: "EMAIL", sortable: true },
  { id: "status", label: "STATUS", sortable: true },
  { id: "edit", label: "EDIT", sortable: false },
];

const SalesView = () => {
  const [activeTab, setActiveTab] = React.useState("create-salesman");
  const [status, setStatus] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: "asc",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Dummy data for the table
  const dummyData = [
    {
      id: 1,
      channelName: "Channel A",
      channelCode: "CH001",
      salesmanName: "John Doe",
      salesmanCode: "SM001",
      address: "123 Main St, City",
      mobileNo: "1234567890",
      email: "john@example.com",
      status: "Active",
    },
    {
      id: 2,
      channelName: "Channel B",
      channelCode: "CH002",
      salesmanName: "Jane Smith",
      salesmanCode: "SM002",
      address: "456 Oak Ave, Town",
      mobileNo: "9876543210",
      email: "jane@example.com",
      status: "Inactive",
    },
  ];

  const [filteredRows, setFilteredRows] = React.useState(dummyData);

  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleSort = (key) => {
    if (!key) return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredRows].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredRows(sortedData);
  };

  const handleSearchClick = () => {
    console.log("Search clicked");
  };

  const handleCancelClick = () => {
    console.log("Cancel clicked");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ position: "relative" }}>
        <Grid container spacing={2} ml={2} mt={2}>
          <Grid item xs={12} sx={{ pr: 2, mb: 0 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2 title="View">
                  <>
                    <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: DARK_PURPLE,
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "14px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          mb: 3,
                          mt: 1,
                        }}
                      >
                        Search
                      </Typography>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          SALESMAN NAME
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={[]}
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          SALESMAN CODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={[]}
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          CHANNEL CODE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={[]}
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          MOBILE NO.
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="ENTER MOBILE NO."
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          EMAIL
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="ENTER EMAIL "
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      mt={1}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
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
                          onClick={handleCancelClick}
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
                          onClick={handleSearchClick}
                        >
                          SEARCH
                        </NuralTextButton>
                      </Grid>
                    </Grid>
                  </>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid mt={0} item xs={12} sx={{ p: { xs: 1, sm: 2 }, ml: 2 }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 300px)",
              overflow: "auto",
              borderRadius: "8px",
              boxShadow: "none",
              border: `1px solid ${LIGHT_BLUE}`,
            }}
          >
            <Table
              sx={{
                minWidth: 650,
                "& .MuiTableCell-root": {
                  borderBottom: `1px solid ${LIGHT_BLUE}`,
                  padding: "12px 16px",
                },
              }}
              size="small"
              stickyHeader
            >
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
                  {tableColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      onClick={() => column.sortable && handleSort(column.id)}
                      sx={{
                        ...tableHeaderStyle,
                        cursor: column.sortable ? "pointer" : "default",
                        position: "sticky",
                        top: "47px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        {column.sortable && (
                          <Grid
                            item
                            sx={{ display: "flex", alignItems: "center" }}
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
                  .map((row) => (
                    <TableRow key={row.id}>
                      {tableColumns.map((column) => (
                        <TableCell key={`${row.id}-${column.id}`}>
                          {column.id === "edit" ? (
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
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
    </>
  );
};

export default SalesView;
