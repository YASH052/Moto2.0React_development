import React from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../../../Common/colors";
import { tableHeaderStyle, rowstyle, headTitle } from "../../../../../Common/commonstyles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../../../NuralCustomComponents/NuralAccordion";
import BreadcrumbsHeader from "../../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../../Common/TabsBar";
import NuralAccordion2 from "../../../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import NuralTextButton from "../../../../NuralCustomComponents/NuralTextButton";

const TaskSearch = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showStatus, setShowStatus] = React.useState(false);
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
  const [activeTab, setActiveTab] = React.useState("task-search");
  const navigate = useNavigate();

  const tabs = [
    { label: "Task Type", value: "task-type" },
    { label: "Search", value: "task-search" },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
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
  };
  return (
    <Grid container spacing={0} ml={0} sx={{ padding: "0px",position:"relative" }}>
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
        <Box mt={2} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Mechandizing" />
        </Box>

        <Box ml={0}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Box>
      </Grid>
      <Grid container spacing={0} ml={0} pr={2}>
        <Grid xs={12} borderRadius={2} padding={2} backgroundColor={LIGHT_GRAY2} mt={1}>
          {/* First Row - 3 NuralAutocomplete */}
          <Typography
          variant="h5"
          sx={headTitle}
        >
          Search
        </Typography>
        <Grid
          container
          spacing={2}
          mb={2}
          sx={{
            gap: { xs: 0, sm: 0, md: 0 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              variant="body1"
              sx={{
                ...labelStyle,
                fontSize: { xs: "12px", sm: "10px" },
              }}
              fontWeight={600}
            >
              TASK TYPE
            </Typography>
            <NuralAutocomplete
              label="SKU"
              options={options}
              placeholder="SELECT"
              width="100%"
            />
          </Grid>
        </Grid>
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
          <Grid item xs={6} sm={1} md={1} lg={1}>
            <NuralButton
              text="CANCEL"
              variant="outlined"
              color={PRIMARY_BLUE2}
              fontSize="12px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              // onClick={() => {
              //   handleCancel();
              //   setShowStatus(false);
              // }}
              width="100%"
            />
          </Grid>
          <Grid item xs={6} md={11} sm={11} lg={11}>
            <NuralTextButton
              icon={"./Icons/searchIcon.svg"}
              iconPosition="right"
              backgroundColor={PRIMARY_BLUE2}
              
              color="#fff"
              width="100%"
            >
              SEARCH
            </NuralTextButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} marginTop={2} borderRadius={4}>
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
                  "SERIAL NUMBER",
                  "SERIAL NUMBER 2",
                  "SKU CODE",
                  "SKU NAME",
                  "USER NAME",
                  "REQUEST TYPE",
                  "STATUS",
                  "REQUEST DATE & TIME",
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
                      <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        {sortConfig.key === `column${index + 1}` ? (
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
                      {row.serialNumber}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.serialNumber2}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.skuCode}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.skuName}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.userName}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.requestType}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.status}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.requestDate}
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
    </Grid>
  );
};

export default TaskSearch;
