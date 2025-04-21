import {
    Grid,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import React from "react";

import {
    AQUA,
    DARK_PURPLE,
    PRIMARY_BLUE2,
    LIGHT_GRAY2,
    LIGHT_BLUE,
} from "../../../Common/colors";

import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
//   import NuralRadioButton from "../../../NuralCustomComponents/NuralRadioButton";
import { useNavigate } from "react-router-dom";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import StatusModel from "../../../Common/StatusModel";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
//   import EditIcon from "@mui/icons-material/Edit";
//   import Switch from "@mui/material/Switch";
import VisibilityIcon from "@mui/icons-material/Visibility";

const tableHeaderStyle = {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "16.39px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
};

const radioOptions = [
    { value: "yes", label: "Interface" },
    { value: "no", label: "Batch" },
];

const DemoConversionList = () => {
    const [activeTab, setActiveTab] = React.useState("demo-conversion");
    const navigate = useNavigate();
    const tabs = [
        { label: "Demo conversion", value: "demo-conversion" },
        { label: "Sap Integration", value: "sap-integration" },
        //   { label: "Serial No. Movement", value: "serial-no-moment" },
        //   { label: "AI Norms", value: "ai-norms" },
    ];

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
        navigate(`/${newValue}`);
    };
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [accordionExpanded, setAccordionExpanded] = React.useState(true);
    const [showModel, setShowModel] = React.useState(false);

    const labelStyle = {
        fontSize: "10px",
        lineHeight: "13.66px",
        letterSpacing: "4%",
        color: PRIMARY_BLUE2,
        marginBottom: "5px",
        fontWeight: 400,
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
        const saleFromOptions = [
            "Direct",
            "Distributor",
            "Online",
            "Retail",
            "Wholesale",
        ];
        const invoicePrefix = ["INV", "BILL", "PO", "GRN"];

        return Array(5)
            .fill()
            .map((_, index) => ({
                id: `${1000 + index}`,
                column1:
                    saleFromOptions[Math.floor(Math.random() * saleFromOptions.length)],
                column2: `${invoicePrefix[Math.floor(Math.random() * invoicePrefix.length)]
                    }-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
                column3: new Date(
                    2024,
                    Math.floor(Math.random() * 12),
                    Math.floor(Math.random() * 28) + 1
                ).toLocaleDateString(),
                column4: Math.floor(Math.random() * 1000),
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
                    new Date(row.column4) <= new Date(searchValues.toDate))
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

    const handleReset = () => {
        setFilteredRows(rows);
        setPage(0);
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
                <Grid item xs={12} mt={0} mb={0} ml={1}>
                    <BreadcrumbsHeader pageTitle="Others" />
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
                mt={0}
                sx={{ position: "relative", zIndex: 1 }}
            >
                <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                                <NuralAccordion2
                                    title="Demo Conversion"
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
                                        Demo Conversion
                                    </Typography>

                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={12} md={12} lg={12}>
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

                                        <Grid item xs={12} sm={6} md={6} lg={6}>
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
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
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
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={2}
                                        mt={1}
                                        sx={{
                                            flexDirection: { xs: "column", sm: "row" },
                                            // gap: { xs: 2, sm: 2 },
                                        }}
                                    >
                                        <Grid item xs={12} sm={2} md={1}>
                                            <NuralButton
                                                text="Reset"
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

                            {/* <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
                  <StatusModel
                    width="100%"
                    status="200"
                    title="New Issue Category Created"
                  />
                </Grid> */}

                            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                                                    {
                                                        label: "REQUEST DATE",
                                                        key: "Request Date",
                                                        sortable: true,
                                                    },
                                                    {
                                                        label: "FROM CHANNEL",
                                                        key: "From Channel",
                                                        sortable: true,
                                                    },
                                                    {
                                                        label: "TOTAL IMEI",
                                                        key: "Total IMEI",
                                                        sortable: true,
                                                    },

                                                    { label: "VIEW DETAIL", key: "detail", sortable: false },
                                                ].map((header, index) => (
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
                                                                <Grid
                                                                    item
                                                                    sx={{ display: "flex", alignItems: "center" }}
                                                                >
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
                                                            {row.column1}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            {row.column2}
                                                        </TableCell>
                                                        {/* <TableCell
                                sx={{
                                  padding: "8px 16px",
                                  fontSize: "10px",
                                  textAlign: "left",
                                  minWidth: "100px",
                                }}
                              >
                                {row.column3}
                              </TableCell> */}
                                                        <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            {row.column4}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            <IconButton size="small" title="View Details">
                                                                <VisibilityIcon
                                                                    sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
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
                            <Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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
                                                                Summary
                                                            </Typography>
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
                                                    {
                                                        label: "MODEL",
                                                        key: "Model",
                                                        sortable: true,
                                                    },
                                                    {
                                                        label: "SKU",
                                                        key: "sku",
                                                        sortable: true,
                                                    },
                                                    {
                                                        label: "IMEI",
                                                        key: "imei",
                                                        sortable: true,
                                                    },

                                                ].map((header, index) => (
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
                                                                <Grid
                                                                    item
                                                                    sx={{ display: "flex", alignItems: "center" }}
                                                                >
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
                                                            {row.column1}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            {row.column2}
                                                        </TableCell>
                                                        {/* <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            {row.column3}
                                                        </TableCell> */}
                                                        <TableCell
                                                            sx={{
                                                                padding: "8px 16px",
                                                                fontSize: "10px",
                                                                textAlign: "left",
                                                                minWidth: "100px",
                                                            }}
                                                        >
                                                            {row.column4}
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
                            <Grid item paddingTop={2} >
                                <NuralAccordion2 title="Rejection Remark" backgroundColor={LIGHT_GRAY2}>
                                    {/* First Row - 3 NuralAutocomplete */}
                                    <Grid
                                        container
                                        spacing={2}
                                        mb={2}
                                        sx={{
                                            gap: { xs: 2, sm: 3, md: 0 },
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
                                                REMARK
                                            </Typography>
                                            <NuralTextField
                                                placeholder="xxxxxxxxxxxx"
                                                width="100%"
                                                backgroundColor={LIGHT_BLUE}
                                            // value={serialNumber}
                                            // onChange={handleSerialNumberChange}
                                            // onPaste={handleSerialNumberPaste}
                                            // error={serialNumberInlineError.error}
                                            // errorText={serialNumberInlineError.errorText}
                                            // inputProps={{
                                            //     pattern: "[a-zA-Z0-9,\\s]*",
                                            //     title: "Only alphanumeric characters are allowed",
                                            // }}
                                            />
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
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <NuralButton
                                                text="Reject"
                                                variant="outlined"
                                                color={PRIMARY_BLUE2}
                                                fontSize="12px"
                                                height="36px"
                                                borderColor={PRIMARY_BLUE2}
                                                onClick={handleReset}
                                                width="100%"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <NuralTextButton
                                                icon={"./Icons/searchIcon.svg"}
                                                iconPosition="right"
                                                height="36px"
                                                backgroundColor={AQUA}
                                                color="#fff"
                                                width="100%"
                                                fontSize="12px"
                                                onClick={handleSearch}
                                            >
                                                {"ACCEPT"}
                                            </NuralTextButton>
                                        </Grid>
                                    </Grid>
                                </NuralAccordion2>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DemoConversionList;
