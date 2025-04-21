import { Grid, Typography, Button, Chip, Switch } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
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
  IconButton,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  titleStyle,
  toggleSectionStyle,
} from "../../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../../NuralCustomComponents/NuralReports";
import NuralExport from "../../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../../NuralCustomComponents/NuralActivityPanel";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import Required from "../../../../Common/Required";

const ManageAudit = () => {
  const [activeTab, setActiveTab] = React.useState("manage-audit");
  const [questions, setQuestions] = React.useState([
    {
      id: 1,
      type: "Yes/No",
      question: "",
      description: "",
    },
  ]);

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        type: "Yes/No",
        question: "",
        description: "",
      },
    ]);
  };

  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-categorization" },
    { label: "Manage Audit", value: "manage-audit" },

    // { label: "MEZ Audit", value: "mez-audit" },
    // { label: "ISP Audit", value: "isp-audit" },
    // { label: "Visibility Audit", value: "visibility-audit" },
    // { label: "Store Ops", value: "store-ops" },
    { label: "L1L2 Issue", value: "l1l2-issue" },
    { label: "RIAudit Score", value: "riaudit-score" },
  ]);

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

  // Column definitions for the table header
  const columns = [
    { id: "sNo", label: "S.NO", minWidth: 60 },
    { id: "audit", label: "AUDIT", minWidth: 200 },
    { id: "creationDate", label: "CREATION DATE", minWidth: 150 },
    { id: "status", label: "STATUS", minWidth: 100 },
    { id: "edit", label: "EDIT", minWidth: 80 },
  ];

  // Replace the existing dummy data with this more realistic data
  const generateDummyData = () => {
    const auditTypes = [
      "Store Audit",
      "Inventory Audit",
      "Sales Audit",
      "Performance Audit",
      "Quality Audit",
    ];
    const statuses = ["Active", "Inactive", "Pending"];

    return Array(10)
      .fill()
      .map((_, index) => ({
        sNo: index + 1,
        audit: auditTypes[Math.floor(Math.random() * auditTypes.length)],
        creationDate: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ).toLocaleDateString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
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

  const removeQuestion = (questionId) => {
    // Only remove if there's more than one question
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
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
            <BreadcrumbsHeader pageTitle="Brand" />
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
                  title="Programme"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Typography variant="h6" sx={titleStyle}>
                    Create
                  </Typography>
                  {/* First Row - Store Category and Demo Type */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        AUDIT TYPE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
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
                        STATUS
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                <Grid mt={2}>
                  <NuralAccordion2
                    expandedBackgroundColor={LIGHT_GRAY2}
                    expandedFontColor={DARK_PURPLE}
                    title="Question & Answer"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    {questions.map((question, index) => (
                      <NuralAccordion2
                        key={question.id}
                        title={`Q${question.id}- ${question.type}`}
                        backgroundColor={LIGHT_GRAY2}
                        expandedBackgroundColor={LIGHT_GRAY2}
                        expandedFontColor={DARK_PURPLE}
                        sx={{ mb: 2 }}
                      >
                        <Grid container spacing={2} mb={2}>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    ...labelStyle,
                                    fontSize: { xs: "12px", sm: "10px" },
                                    mb: 1,
                                  }}
                                >
                                  ADD QUESTION <Required />
                                </Typography>
                                <Grid container alignItems="center" spacing={0}>
                                  <Grid item xs={10}>
                                    <NuralTextField
                                      width="100%"
                                      placeholder="ENTER QUESTION"
                                      value={question.question}
                                      onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[index].question =
                                          e.target.value;
                                        setQuestions(newQuestions);
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={1.5}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src="./Icons/QAexport.svg"
                                      alt="remove"
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={0.5}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src="./Icons/cross.svg"
                                      alt="remove"
                                      style={{ 
                                        cursor: questions.length > 1 ? "pointer" : "not-allowed",
                                        opacity: questions.length > 1 ? 1 : 0.5 
                                      }}
                                      onClick={() =>
                                        removeQuestion(question.id)
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>

                              <Grid item xs={12} md={12}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    ...labelStyle,
                                    fontSize: { xs: "12px", sm: "10px" },
                                    mb: 1,
                                  }}
                                >
                                  ADD DESCRIPTION [OPTIONAL]
                                </Typography>
                                <Grid container alignItems="center" spacing={0}>
                                  <Grid item xs={11.5}>
                                    <NuralTextField
                                      width="100%"
                                      placeholder="ENTER QUESTION"
                                      value={question.description}
                                      onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[index].description =
                                          e.target.value;
                                        setQuestions(newQuestions);
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={0.5}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src="./Icons/cross.svg"
                                      alt="remove"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        const newQuestions = [...questions];
                                        newQuestions[index].description = "";
                                        setQuestions(newQuestions);
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </NuralAccordion2>
                    ))}
                  </NuralAccordion2>
                  <Grid container my={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <NuralButton
                        text="Add Static Content"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        width="100%"
                        height="48px"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} pl={1}>
                      <NuralTextButton
                        icon={"./Icons/plus.svg"}
                        iconPosition="right"
                        backgroundColor={AQUA}
                        color={AQUA_DARK}
                        height="48px"
                        width="100%"
                        fontSize="16px"
                        onClick={addNewQuestion}
                      >
                        ADD QUESTIONS
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </Grid>

                <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                  <Typography variant="h6" sx={titleStyle}>
                    Search
                  </Typography>
                  {/* First Row - Store Category and Demo Type */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        AUDIT TYPE
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder="SELECT"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        STATUS
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={[]}
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>
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
                        // onClick={handleReset}
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
          <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 300px)",
                overflow: "auto",
                "& .MuiTableCell-root": {
                  borderBottom: `1px solid ${LIGHT_GRAY2}`,
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
                    <TableCell sx={{ ...tableHeaderStyle }}>S.NO</TableCell>
                    <TableCell sx={{ ...tableHeaderStyle }}>AUDIT</TableCell>
                    <TableCell sx={{ ...tableHeaderStyle }}>
                      CREATION DATE
                    </TableCell>
                    <TableCell sx={{ ...tableHeaderStyle }}>STATUS</TableCell>
                    <TableCell sx={{ ...tableHeaderStyle }}>EDIT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const statusColor = getStatusColor(row.status);
                      return (
                        <TableRow key={row.sNo}>
                          <TableCell sx={{ ...rowstyle }}>{row.sNo}</TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.audit}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            {row.creationDate}
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            <Switch
                              sx={{
                                ...toggleSectionStyle,
                                "& .MuiSwitch-thumb": {
                                  backgroundColor: PRIMARY_BLUE2,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ ...rowstyle }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
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
                      );
                    })}
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

export default ManageAudit;
