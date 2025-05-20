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
import React, { useEffect, useState } from "react";

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
import { GetDemoBinConversion,DemotoGoodApprovedReject } from "../../../Api/Api"
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";

const tableHeaderStyle = {
    fontFamily: "Manrope",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "16.39px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
};

const statusOption = [
    "Pending",
    "Approved",
    "Rejected"
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

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Get today's date (toDate)
    const today = new Date();
    const firstDateOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page2, setPage2] = React.useState(1);
    const [rowsPerPage2, setRowsPerPage2] = React.useState(10);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSearchLoading, setIsSearchLoading] = React.useState(false);
    const [isSearchInProgress, setIsSearchInProgress] = React.useState(false);
    const [searchParams, setSearchParams] = React.useState({
        fromDate: formatDate(firstDateOfCurrentMonth),
        toDate: formatDate(today),
        statusID: 0,//0=Pending, 1=Approved, 2=Rejected
        pageIndex: page,//1=UI, -1=Export to Excel
        pageSize: rowsPerPage
    });
    const [isTableLoading, setIsTableLoading] = React.useState(false);

    // Add these states for sorting
    const [sortConfig, setSortConfig] = React.useState({
        key: null,
        direction: null,
    });

    // Replace the existing dummy data with this more realistic data
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [flag, setFlag] = useState(false)
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [summaryData, setSummaryListData] = React.useState([]);
    const [totalRecords2, setTotalRecords2] = React.useState(0);
    const [openSummaryListModel, setOpenSummaryListModel] = React.useState(false);
    const [searchStatus, setSearchStatus] = React.useState(null);
    const [searchTitle, setSearchTitle] = React.useState(null);
    const [postStatus, setPostStatus] = React.useState(null);
    const [postTitle,setPostTitle]=React.useState(null);
    const [postData, setPostData] = React.useState({
        requestID: 5,
        approvalStatusID: 1,//1-Approved, 2-Rejected
        remarks: "Approved"
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
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
    const handlePost = (searchValues) => {
        const defaultPost={
            ...postData,
            approvalStatusID:1
        }
        setPostData(defaultPost)
        PostDemotoGoodApprovedReject(defaultPost)
    };

    const handleReject = (searchValues) => {
        const defaultPost={
            ...postData,
            approvalStatusID:2
        }
        setPostData(defaultPost)
        PostDemotoGoodApprovedReject(defaultPost)
    };

    // Update the search button click handler
    const handleSearchClick = () => {
        console.log("runnnig click")
        setSearchStatus(null)
        setSearchTitle(null)
        setOpenSummaryListModel(false)
        setPostData({
            requestID:0,
            approvalStatusID: 0,//1-Approved, 2-Rejected
            remarks: ""
        })
        setIsSearchLoading(true);
        setIsSearchInProgress(true);
        setPage(1)
        setRowsPerPage(10)
        setFlag(!flag)

    };

    const handleReset = () => {
        setOpenSummaryListModel(false)
        setPostData({
            requestID:0,
            approvalStatusID: 0,//1-Approved, 2-Rejected
            remarks: ""
        })
        setSearchStatus(null)
        setSearchTitle(null)
        setFilteredRows([]);
        setSummaryListData([])
        setPage2(1)
        setPage(1);
        totalRecords(0)
        // totalRecords2(0)
        setRowsPerPage(10)
        setRowsPerPage2(10)



        setSearchParams({
            fromDate: formatDate(firstDateOfCurrentMonth),
            toDate: formatDate(today),
            statusID: 0,//0=Pending, 1=Approved, 2=Rejected
            pageIndex: 1,//1=UI, -1=Export to Excel
            pageSize: 10
        })
    };

    const handleParamsChange = (newValue) => {
        if (newValue == "Pending") {
            setSearchParams({
                ...searchParams,
                statusID: 0
            })
        } else if (newValue == "Approved") {
            setSearchParams({
                ...searchParams,
                statusID: 1
            })
        } else {
            setSearchParams({
                ...searchParams,
                statusID: 2
            })
        }
    }

    const fatchGetDemoBinConversion = async (params) => {
        setIsLoading(true) // Set loading true
        setIsTableLoading(true);
        try {
            const body = {
                ...(params || searchParams), // Use passed params or state
                pageSize: rowsPerPage, // Keep default pageSize/pageIndex or allow override?
                pageIndex: page // For now, let's keep these fixed on fetch
            }
            let response = await GetDemoBinConversion(body);
            if (response.statusCode == "200") {
                setOpenSummaryListModel(false)
                setPostData({
                    requestID:0,
                    approvalStatusID: 0,//1-Approved, 2-Rejected
                    remarks: ""
                })
                setFilteredRows(response.demoToGoodList || []);
                setTotalRecords(response.totalRecords);

            } else if (response.statusCode === "404") {
                setFilteredRows([]);
                setTotalRecords(0);
                setOpenSummaryListModel(false)
                setPostData({
                    requestID:0,
                    approvalStatusID: 0,//1-Approved, 2-Rejected
                    remarks: ""
                })
                setSearchStatus(response.statusCode);
                setSearchTitle(response.statusMessage);

            }
        } catch (error) {
            console.error("Error fetching storeList:", error);
            setTotalRecords(0);
            setSearchStatus(error.response.data.statusCode);
            setSearchTitle(error.response.data.statusMessage);
        }
        finally {
            setIsLoading(false); // Set loading false
            setIsTableLoading(false);
            setIsSearchLoading(false);
            setIsSearchInProgress(false);
        }
    }

    const PostDemotoGoodApprovedReject = async (params) => {
        setIsLoading(true) // Set loading true
        // setIsTableLoading(true);
        try {
            const body = {
                ...(params||postData)
            }
            let response = await DemotoGoodApprovedReject(body);
            if (response.statusCode == "200") {
                // setOpenSummaryListModel(false)
                setPostData({
                    requestID:0,
                    approvalStatusID: 0,//1-Approved, 2-Rejected
                    remarks: ""
                })
                console.log("response",response.statusCode,response.statusMessage)
                setPostStatus(response.statusCode);
                setPostTitle(response.statusMessage);
            

            } else if (response.statusCode === "404") {
                console.log("responseelse",response.statusCode,response.statusMessage)
                setPostStatus(response.statusCode);
                setPostTitle(response.statusMessage);

            }else{        
                setPostStatus(response.statusCode);
                setPostTitle(response.statusMessage);
            }
        } catch (error) {
            console.error("Error fetching storeList:", error);
            setSearchStatus(error.response.data.statusCode);
            setSearchTitle(error.response.data.statusMessage);
        }
        finally {
            setIsLoading(false); // Set loading false
            setTimeout(() => {
                setPostStatus(null);
                setPostTitle(null);
            }, 3000);
            // setIsTableLoading(false);
            // setIsSearchLoading(false);
            // setIsSearchInProgress(false);
        }
    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(1);
        setSearchParams(prev => ({
            ...prev,
            pageSize: newRowsPerPage,
            pageIndex: 1
        }));
    };

    const handleChangeRowsPerPage2 = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage2(newRowsPerPage);
        setPage2(1);
        // setSearchParams(prev => ({
        //     ...prev,
        //     pageSize: newRowsPerPage,
        //     pageIndex: 1
        // }));
    };

    const handlePageChange = (newPage) => {
        // Ensure page is within valid bounds
        const maxPage = Math.ceil(totalRecords / rowsPerPage);
        const validPage = Math.max(1, Math.min(newPage, maxPage));

        setPage(validPage);
        setSearchParams(prev => ({
            ...prev,
            pageIndex: validPage
        }));
    };

    const handleFirstPage = () => {
        handlePageChange(1);
    };

    const handleLastPage = () => {
        const maxPage = Math.ceil(totalRecords / rowsPerPage);
        handlePageChange(maxPage);
    };

    const handlePrevPage = () => {
        handlePageChange(page - 1);
    };

    const handleNextPage = () => {
        handlePageChange(page + 1);
    };

    const handleSummaryList = (row) => {
        console.log("cliclcl", row)
        setOpenSummaryListModel(true)
        setPostData({
            ...postData,
            requestID: row?.demoIMEIApprovalID
        })
        setSummaryListData(row.demoToGoodDetailedList || [])
        setTotalRecords2(row.demoToGoodDetailedList.length || 0)
    }

    const handlePageChange2 = (newPage) => {
        // Ensure page is within valid bounds
        const maxPage = Math.ceil(totalRecords2 / rowsPerPage2);
        const validPage = Math.max(1, Math.min(newPage, maxPage));
        setPage2(validPage);
    };

    const handleFirstPage2 = () => {
        handlePageChange2(1);
    };

    const handleLastPage2 = () => {
        const maxPage = Math.ceil(totalRecords2 / rowsPerPage2);
        handlePageChange2(maxPage);
    };

    const handlePrevPage2 = () => {
        handlePageChange2(page2 - 1);
    };

    const handleNextPage2 = () => {
        handlePageChange2(page2 + 1);
    };

    const handlePostDataChange = (field, value) => {
        setPostData({
            ...postData,
            [field]: value
        })
    }

    useEffect(() => {
        // if (filteredRows.length > 0) {
        fatchGetDemoBinConversion()


    }, [page, rowsPerPage, flag])

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
                            {isSearchLoading && filteredRows.length === 0 ? (
                                <FormSkeleton />
                            ) :
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
                                                    options={statusOption}
                                                    placeholder="SELECT"
                                                    onChange={(event, newValue) => {
                                                        handleParamsChange(newValue)

                                                    }}
                                                    value={
                                                        searchParams.statusID === 0
                                                            ? "Pending"
                                                            : searchParams.statusID === 1
                                                                ? "Approved"
                                                                : searchParams.statusID === 2
                                                                    ? "Rejected"
                                                                    : null // Return null when planogramType is 0 (or other non-1/2 value)
                                                    }
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
                                                <NuralCalendar width="100%"
                                                    placeholder="DD/MMM/YYYY"
                                                    onChange={(date) => {
                                                        if (date) {
                                                            setSearchParams(prev => ({
                                                                ...prev,
                                                                fromDate: formatDate(date)
                                                            }));
                                                        }
                                                    }}
                                                    value={searchParams.fromDate ? new Date(searchParams.fromDate) : null}
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
                                                    TO DATE
                                                </Typography>
                                                <NuralCalendar width="100%"
                                                    placeholder="DD/MMM/YYYY"
                                                    onChange={(date) => {
                                                        if (date) {
                                                            setSearchParams(prev => ({
                                                                ...prev,
                                                                toDate: formatDate(date)
                                                            }));
                                                        }
                                                    }}
                                                    value={searchParams.toDate ? new Date(searchParams.toDate) : null}
                                                />
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
                            }
                            {/* <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
                  <StatusModel
                    width="100%"
                    status="200"
                    title="New Issue Category Created"
                  />
                </Grid> */}
                            {filteredRows.length > 0 ?
                                (<Grid item xs={12} sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: 2 }}>
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

                                                {isTableLoading ? (
                                                    Array(5)
                                                        .fill(0)
                                                        .map((_, index) => (

                                                            <TableRowSkeleton key={index} columns={5} />

                                                        ))
                                                )
                                                    : (filteredRows
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
                                                                    {row.rowNo}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "8px 16px",
                                                                        fontSize: "10px",
                                                                        textAlign: "left",
                                                                        minWidth: "100px",
                                                                    }}
                                                                >
                                                                    {row.requestDate}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "8px 16px",
                                                                        fontSize: "10px",
                                                                        textAlign: "left",
                                                                        minWidth: "100px",
                                                                    }}
                                                                >
                                                                    {row.fromSalesChannelName}
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
                                                                    {row.totalIMEI}
                                                                </TableCell>
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "8px 16px",
                                                                        fontSize: "10px",
                                                                        textAlign: "left",
                                                                        minWidth: "100px",
                                                                    }}

                                                                >
                                                                    <IconButton size="small" title="View Details" onClick={() => handleSummaryList(row)}>
                                                                        <VisibilityIcon
                                                                            sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                                                                        />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        )))
                                                }

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
                                                        {totalRecords} /{" "}
                                                        {Math.ceil(totalRecords / searchParams.pageSize)} PAGES
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
                                                        cursor: "pointer"
                                                    }}

                                                    onClick={handleFirstPage}
                                                >
                                                    JUMP TO FIRST
                                                </Typography>
                                                <IconButton
                                                    onClick={handlePrevPage}
                                                    disabled={page <= 1}
                                                >
                                                    <NavigateBeforeIcon />
                                                </IconButton>

                                                <Typography
                                                    sx={{
                                                        fontSize: "10px",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    PAGE {page}
                                                </Typography>

                                                <IconButton
                                                    onClick={handleNextPage}
                                                    disabled={
                                                        page >=
                                                        Math.ceil(totalRecords / rowsPerPage)
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
                                                    onClick={handleLastPage}
                                                >
                                                    JUMP TO LAST
                                                </Typography>
                                                <input
                                                    type="number"
                                                    placeholder="Jump to page"
                                                    min={1}
                                                    max={Math.ceil(totalRecords / rowsPerPage)}
                                                    // value={page + 1}
                                                    onChange={(e) => {
                                                        // Just store the value, don't trigger page change
                                                        const value = e.target.value;
                                                        e.target.dataset.pageValue = value;
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
                                                <Grid
                                                    mt={1}
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        const input = e.currentTarget.previousSibling;
                                                        const pageValue = parseInt(input.value, 10);
                                                        if (
                                                            pageValue >= 1 &&
                                                            pageValue <= Math.ceil(totalRecords / searchParams.pageSize)
                                                        ) {
                                                            handlePageChange(pageValue);
                                                            // input.value = ''; 
                                                        }
                                                    }}
                                                >
                                                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TableContainer>
                                </Grid>) : searchStatus ? (
                                    <Grid item xs={12} sx={{ p: { xs: 1, sm: "" }, mt: "", display: 'flex', justifyContent: 'center' }}>
                                        <StatusModel
                                            width="100%" // Adjust width as needed
                                            status={searchStatus}
                                            title={searchTitle}
                                            onClose={() => setSearchStatus(null)}
                                        />
                                    </Grid>
                                ) : null
                            }
                            {/* Summary List */}
                            {openSummaryListModel ?
                                (
                                    <>

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
                                                        {summaryData
                                                            .slice(
                                                                (page2 - 1) * rowsPerPage2,
                                                                (page2 - 1) * rowsPerPage2 + rowsPerPage2
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
                                                                        {(page2 - 1) * rowsPerPage2 + index + 1}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        sx={{
                                                                            padding: "8px 16px",
                                                                            fontSize: "10px",
                                                                            textAlign: "left",
                                                                            minWidth: "100px",
                                                                        }}
                                                                    >
                                                                        {row.modelName}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        sx={{
                                                                            padding: "8px 16px",
                                                                            fontSize: "10px",
                                                                            textAlign: "left",
                                                                            minWidth: "100px",
                                                                        }}
                                                                    >
                                                                        {row.skuName}
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
                                                                        {row.imeiNumber}
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
                                                                {totalRecords2} /{" "}
                                                                {Math.ceil(totalRecords2 / rowsPerPage2)} PAGES
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
                                                                            handleChangeRowsPerPage2({ target: { value } })
                                                                        }
                                                                        sx={{
                                                                            minWidth: "25px",
                                                                            height: "24px",
                                                                            padding: "4px",
                                                                            borderRadius: "50%",
                                                                            // border: `1px solid ${PRIMARY_BLUE2}`,
                                                                            backgroundColor:
                                                                                rowsPerPage2 === value
                                                                                    ? PRIMARY_BLUE2
                                                                                    : "transparent",
                                                                            color:
                                                                                rowsPerPage2 === value
                                                                                    ? "#fff"
                                                                                    : PRIMARY_BLUE2,
                                                                            fontSize: "12px",
                                                                            "&:hover": {
                                                                                backgroundColor:
                                                                                    rowsPerPage2 === value
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
                                                            onClick={handleFirstPage2}
                                                        >
                                                            JUMP TO FIRST
                                                        </Typography>
                                                        <IconButton
                                                            onClick={handlePrevPage2}
                                                            disabled={page2 === 1}
                                                        >
                                                            <NavigateBeforeIcon />
                                                        </IconButton>

                                                        <Typography
                                                            sx={{
                                                                fontSize: "10px",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            PAGE {page2}
                                                        </Typography>

                                                        <IconButton
                                                            onClick={handleNextPage2}
                                                            disabled={
                                                                page2 >=
                                                                Math.ceil(totalRecords2 / rowsPerPage2)
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
                                                            onClick={handleLastPage2}
                                                        >
                                                            JUMP TO LAST
                                                        </Typography>
                                                        <input
                                                            type="number"
                                                            placeholder="Jump to page"
                                                            min={1}
                                                            max={Math.ceil(totalRecords2 / rowsPerPage2)}
                                                            // value={page + 1}
                                                            onChange={(e) => {
                                                                // Just store the value, don't trigger page change
                                                                const value = e.target.value;
                                                                e.target.dataset.pageValue = value;
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
                                                        <Grid
                                                            mt={1}
                                                            sx={{ cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.previousSibling;
                                                                const pageValue = parseInt(input.value, 10);
                                                                if (
                                                                    pageValue >= 1 &&
                                                                    pageValue <= Math.ceil(totalRecords2 / rowsPerPage2)
                                                                ) {
                                                                    handlePageChange(pageValue);
                                                                    // input.value = ''; 
                                                                }
                                                            }}
                                                        >
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
                                                            value={postData.remarks}
                                                            onChange={(e) => handlePostDataChange("remarks", e.target.value)}
                                                            // onPaste={handleSerialNumberPaste}
                                                            // error={serialNumberInlineError.error}
                                                            // errorText={serialNumberInlineError.errorText}
                                                            inputProps={{
                                                                pattern: "[a-zA-Z0-9,\\s]*",
                                                                title: "Only alphanumeric characters are allowed",
                                                            }}
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
                                                            onClick={handleReject}
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
                                                            onClick={handlePost}
                                                        >
                                                            {"ACCEPT"}
                                                        </NuralTextButton>
                                                    </Grid>
                                                </Grid>
                                            </NuralAccordion2>
                                        </Grid>
                                        
                                      {  postStatus ? (
                                    <Grid item xs={12} sx={{ p: { xs: 1, sm: "" }, mt: "", display: 'flex', justifyContent: 'center' }}>
                                        <StatusModel
                                            width="100%" // Adjust width as needed
                                            status={postStatus}
                                            title={postTitle}
                                            onClose={() => setPostStatus(null)}
                                        />
                                    </Grid>):null}
                                        
                                        </>

                                                                                

                                )
                                : null
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default DemoConversionList;
