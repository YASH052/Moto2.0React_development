import { Grid, Typography, Checkbox, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_BLUE,
  WHITE,
  BLACK,
  MEDIUM_BLUE,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
// import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
// import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import { Search, FileDownload } from "@mui/icons-material";
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
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import { useNavigate } from "react-router-dom";
import {
  Countrymasterlist,
  GetPriceListDataWithMappingAPI,
  GetPriceListName,
  GetPriceMasterListV2,
  GetSKUListForDropdown,
  GetStateListForDropdown,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import PriceListTable from "./PriceListTable";
import PriceTable from "./PriceTable";

const ListItemTwo = [
  {
    label: "PRICE LIST",
    value: 0,
  },
  {
    label: "PRICE",
    value: 1,
  },
];

const SKELETON_ROWS = 10;
const PriceListView = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(ListItemTwo[0]);

  // Price table pagination states
  const [pricePage, setPricePage] = React.useState(1);
  const [priceRowsPerPage, setPriceRowsPerPage] = React.useState(10);
  const [priceTotalRecords, setPriceTotalRecords] = React.useState(0);
  const [priceJumpToPage, setPriceJumpToPage] = useState(1);

  // Price list table pagination states
  const [priceListPage, setPriceListPage] = React.useState(1);
  const [priceListRowsPerPage, setPriceListRowsPerPage] = React.useState(10);
  const [priceListTotalRecords, setPriceListTotalRecords] = React.useState(0);
  const [priceListJumpToPage, setPriceListJumpToPage] = useState(1);

  const [priceData, setPriceData] = React.useState([]);
  const [priceListData, setPriceListData] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [skuDropDown, setSkuDropDown] = useState([]);
  const [filteredSkuDropDown, setFilteredSkuDropDown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [countryDropdown, setCountryDropdown] = useState([]);
  const [show, setShow] = useState("");
  const [priceListFlag, setPriceListFlag] = useState("");
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [priceListNameDrop, setPriceListNameDrop] = React.useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [searchParams, setSearchParams] = useState({
    priceListID: 0,
    skuID: null,
    dateFrom: "",
    dateTo: "",
    condition: 0,
    pageIndex: pricePage,
    pageSize: priceRowsPerPage,
  });

  const [priceListSearchParams, setPriceListSearchParams] = useState({
    priceListName: "",
    countryID: "0",
    stateID: "0",
    pageIndex: priceListPage,
    pageSize: priceListRowsPerPage,
  });

  useEffect(() => {
    // fetchPriceListNameApi();
    fetchCountryDrop();
  }, []);

  const fetchCountryDrop = async () => {
    let body = {
      CountryName: "",
      CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
      pageIndex: 1 /*-1 for export to excel */,
      pageSize: 10,
    };
    try {
      let res = await Countrymasterlist(body);
      if (res.statusCode == 200) {
        setCountryDropdown(res.countryMasterList);
      } else {
        setCountryDropdown([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePriceChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPriceRowsPerPage(newRowsPerPage);
    setSearchParams({
      ...searchParams,
      pageIndex: 1,
      pageSize: newRowsPerPage,
    });
    setPricePage(1);
    fetchPriceMasterList();
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleSort = (columnName) => {
    let direction = "asc";

    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...priceData].sort((a, b) => {
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

    setPriceData(sortedRows);
  };

  const fetchPriceMasterList = async () => {
    setIsSearchLoading(true);
    let body = {
      priceListID: searchParams.priceListID || 0,
      skuID: searchParams.skuID || 0,
      dateFrom: searchParams.dateFrom || "",
      dateTo: searchParams.dateTo || "",
      condition: searchParams.condition || 0,
      pageIndex: searchParams.pageIndex || 1,
      pageSize: searchParams.pageSize || 10,
    };
    try {
      let res = await GetPriceMasterListV2(body);
      if (res.statusCode == 200) {
        setPriceData(res.priceList);
        setPriceTotalRecords(res.totalRecords);
      } else {
        setPriceData([]);
        setShow(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setPriceData([]);
      setShow(true);
      setStatus(error.status);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceListName();
    fetchSkuDrop();
  }, []);

  useEffect(() => {
    fetchPriceListDataWithMapping();
  }, [priceListPage, priceListRowsPerPage, priceListFlag]);

  const fetchPriceListDataWithMapping = async () => {
    setIsSearchLoading(true);
    let body = {
      priceListID: priceListSearchParams.priceListID,
      countryID: priceListSearchParams.countryID,
      stateID: priceListSearchParams.stateID,
      pageIndex: priceListSearchParams.pageIndex,
      pageSize: priceListSearchParams.pageSize,
    };
    try {
      let res = await GetPriceListDataWithMappingAPI(body);
      if (res.statusCode == 200) {
        setPriceListData(res.priceListData);
        setPriceListTotalRecords(res.totalRecords);
      } else {
        setShow(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setShow(true);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Something went wrong");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const fetchSkuDrop = async () => {
    let body = {
      skuID: 0,
      categoryID: 0 /*product CategoryID*/,
      modelID: 0,
      subCategoryID: 0 /*productID*/,
      brandID: 0,
    };
    try {
      let res = await GetSKUListForDropdown(body);
      if (res.statusCode == 200) {
        setSkuDropDown(res.skuDropdownList);
        setFilteredSkuDropDown(res.skuDropdownList);
      } else {
        setSkuDropDown([]);
        setFilteredSkuDropDown([]);
      }
    } catch (error) {
      setSkuDropDown([]);
      setFilteredSkuDropDown([]);
      console.log(error);
    }
  };

  const handleSkuSearch = (searchText) => {
    if (!searchText) {
      setFilteredSkuDropDown(skuDropDown);
      return;
    }
    const filtered = skuDropDown.filter(
      (sku) =>
        sku.skuCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        sku.skuName?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSkuDropDown(filtered);
  };

  React.useEffect(() => {
    fetchPriceMasterList();
  }, [pricePage, priceRowsPerPage]);

  const handleSearchClickPrice = () => {
    setPriceJumpToPage(1);
    setShow(false);
    if (dateError) {
      return;
    }
    setPricePage(1);
    setPriceRowsPerPage(10);
    setSearchParams({
      ...searchParams,
      pageIndex: 1,
      pageSize: 10,
    });
    fetchPriceMasterList();
  };

  const handlePricePreviousPage = () => {
    if (pricePage > 1) {
      setPricePage(pricePage - 1);
      setSearchParams({
        ...searchParams,
        pageIndex: pricePage - 1,
      });
      fetchPriceMasterList();
    }
  };

  const handlePriceNextPage = () => {
    const maxPage = Math.ceil(priceTotalRecords / priceRowsPerPage);
    if (pricePage < maxPage) {
      setPricePage(pricePage + 1);
      setSearchParams({
        ...searchParams,
        pageIndex: pricePage + 1,
      });
      fetchPriceMasterList();
    }
  };

  const handleSearchChange = (field, value) => {
    console.log(field, value);
    setSearchParams({
      ...searchParams,
      [field]: value,
    });
  };

  const fetchStateDrop = async (value) => {
    let body = {
      countryID: value,
      regionID: 0,
      stateID: 0,
    };
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDropdown(res.stateDropdownList);
      } else {
        setStateDropdown([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChangePriceList = (field, value) => {
    console.log(field, value);
    if (field == "countryID") {
      if (value) {
        fetchStateDrop(value);
      } else {
        setPriceListSearchParams({
          ...priceListSearchParams,
          stateID: 0,
        });
        setStateDropdown([]);
      }
    }
    setPriceListSearchParams({
      ...priceListSearchParams,
      [field]: value,
    });
  };

  const fetchPriceListName = async () => {
    let body = {
      Status: 1,
      Condition: 0 /*0 for Active Price List */,
    };
    setIsLoading(true);
    try {
      let res = await GetPriceListName(body);
      if (res.statusCode == 200) {
        setPriceListNameDrop(res.priceList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFromDateChange = (newValue) => {
    console.log(newValue);
    setDateError(""); // Clear error on change
    if (searchParams.dateTo && newValue > searchParams.dateTo) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    // Format date to DD-MMM-YYYY
    const formattedDate = newValue
      ? new Date(newValue).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";
    handleSearchChange("dateFrom", formattedDate);
  };

  const handleToDateChange = (newValue) => {
    console.log(newValue);
    setDateError(""); // Clear error on change
    if (searchParams.dateFrom && newValue < searchParams.dateFrom) {
      setDateError("To date cannot be less than From date");
      return;
    }
    // Format date to DD-MMM-YYYY
    const formattedDate = newValue
      ? new Date(newValue).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";
    handleSearchChange("dateTo", formattedDate);
  };

  const handleResetPrice = async () => {
    // Reset search parameters
    setSearchParams({
      priceListID: 0,
      skuID: null,
      dateFrom: "",
      dateTo: "",
      condition: 0,
      pageIndex: 1,
      pageSize: 10,
    });

    // Reset other states
    setDateError("");
    setShow(false);
    setStatus("");
    setTitle("");

    // Reset pagination
    setPricePage(1);
    setPriceRowsPerPage(10);
    setPriceJumpToPage(1);

    // Reset SKU dropdowns to original state
    setFilteredSkuDropDown(skuDropDown);
    
    // Force a re-fetch of SKU dropdown data
    await fetchSkuDrop();

    // Fetch fresh data
    let body = {
      priceListID: 0,
      skuID: 0,
      dateFrom: "",
      dateTo: "",
      condition: 0,
      pageIndex: 1,
      pageSize: 10,
    };
    setIsSearchLoading(true);
    try {
      let res = await GetPriceMasterListV2(body);
      if (res.statusCode == 200) {
        setPriceData(res.priceList);
        setPriceTotalRecords(res.totalRecords);
      } else {
        setShow(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShow(true);
      setStatus(error.status);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Add this useEffect to ensure filtered dropdown is properly initialized
  useEffect(() => {
    if (skuDropDown.length > 0) {
      setFilteredSkuDropDown(skuDropDown);
    }
  }, [skuDropDown]);

  const handleResetPriceList = async () => {
    // Reset price list search parameters
    setPriceListSearchParams({
      priceListName: "",
      countryID: "0",
      stateID: "0",
      pageIndex: 1,
      pageSize: 10,
    });

    // Reset other states
    setShow(false);
    setStatus("");
    setTitle("");

    // Reset pagination
    setPriceListPage(1);
    setPriceListRowsPerPage(10);
    setPriceListJumpToPage(1);

    setStateDropdown([]);

    // Fetch fresh data
    let body = {
      priceListID: 0,
      countryID: "0",
      stateID: "0",
      pageIndex: 1,
      pageSize: 10,
    };
    try {
      let res = await GetPriceListDataWithMappingAPI(body);
      if (res.statusCode == 200) {
        setPriceListData(res.priceListData);
        setPriceListTotalRecords(res.totalRecords);
      } else {
        setShow(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShow(true);
      setStatus(error.statusCode);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    }
    setIsSearchLoading(false);
  };

  const handlePriceJumpToPage = (action) => {
    const maxPage = Math.ceil(priceTotalRecords / priceRowsPerPage);
    let newPage = pricePage;

    switch (action) {
      case "first":
        newPage = 1;
        break;
      case "last":
        newPage = maxPage;
        break;
      case "custom":
        newPage = parseInt(priceJumpToPage, 10);
        if (newPage < 1 || newPage > maxPage) {
          return;
        }
        break;
      default:
        return;
    }

    setPricePage(newPage);
    setSearchParams({
      ...searchParams,
      pageIndex: newPage,
    });
    setPriceJumpToPage(newPage);
    fetchPriceMasterList();
  };

  const handleSearchClickPriceList = () => {
    setShow(false);
    setPriceListPage(1);
    setPriceListRowsPerPage(10);
    setPriceListJumpToPage(1);
    setPriceListSearchParams({
      ...priceListSearchParams,
      pageIndex: "1",
      pageSize: "10",
    });
    fetchPriceListDataWithMapping();
  };

  const handlePriceListChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPriceListRowsPerPage(newRowsPerPage);
    setPriceListSearchParams({
      ...priceListSearchParams,
      pageIndex: "1",
      pageSize: newRowsPerPage.toString(),
    });
    setPriceListPage(1);
  };

  const handlePriceListPreviousPage = () => {
    if (priceListPage > 1) {
      setPriceListPage(priceListPage - 1);
      setPriceListSearchParams({
        ...priceListSearchParams,
        pageIndex: (priceListPage - 1).toString(),
      });
    }
  };

  const handlePriceListNextPage = () => {
    const maxPage = Math.ceil(priceListTotalRecords / priceListRowsPerPage);
    if (priceListPage < maxPage) {
      setPriceListPage(priceListPage + 1);
      setPriceListSearchParams({
        ...priceListSearchParams,
        pageIndex: (priceListPage + 1).toString(),
      });
    }
  };

  const handlePriceListJumpToPage = (action) => {
    const maxPage = Math.ceil(priceListTotalRecords / priceListRowsPerPage);
    let newPage = priceListPage;

    switch (action) {
      case "first":
        newPage = 1;
        break;
      case "last":
        newPage = maxPage;
        break;
      case "custom":
        newPage = parseInt(priceListJumpToPage, 10);
        if (newPage < 1 || newPage > maxPage) {
          return;
        }
        break;
      default:
        return;
    }

    setPriceListPage(newPage);
    setPriceListSearchParams({
      ...priceListSearchParams,
      pageIndex: newPage || 1,
    });
    setPriceListJumpToPage(newPage||1);
  };

  return (
    <Grid container spacing={2} mt={0}>
      <Grid item xs={12} sx={{ pr: 2 }} ml={2}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <NuralAccordion2 title="Search" backgroundColor={LIGHT_GRAY2}>
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  {/* First Row - Always 3 Fields */}
                  <Grid item xs={12} md={4} sm={6}>
                    <Typography
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
                      TYPE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={ListItemTwo}
                      placeholder="PRICE LIST"
                      backgroundColor={LIGHT_BLUE}
                      value={selectedType}
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      onChange={(event, newValue) => setSelectedType(newValue)}
                    />
                  </Grid>

                  {/* Second Row - Only for "PRICE" */}

                  {selectedType.value == 1 && (
                    <>
                      <Grid item xs={12} md={4} sm={6}>
                        <Typography
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
                          PRICE LIST
                        </Typography>
                        <NuralAutocomplete
                          label="Price List"
                          options={priceListNameDrop}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            option.priceListName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.priceListID === value?.priceListID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "priceListID",
                              newValue?.priceListID || null
                            );
                          }}
                          value={
                            priceListNameDrop.find(
                              (option) =>
                                option.priceListID === searchParams.priceListID
                            ) || null
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={4} sm={6}>
                        <Typography
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
                          SKU
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={skuDropDown}
                          getOptionLabel={(option) => option.skuCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.skuID === value?.skuID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "skuID",
                              newValue?.skuID || null
                            );
                            // Reset filtered options when an option is selected
                          }}
                          value={
                            skuDropDown.find(
                              (option) => option.skuID === searchParams.skuID
                            ) || null
                          }
                          placeholder="ENTER SKU"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} sm={6}>
                        <Typography
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
                          FROM DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          value={searchParams.dateFrom}
                          onChange={handleFromDateChange}
                          placeholder="DD/MMM/YYYY"
                          error={!!dateError}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} sm={6}>
                        <Typography
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
                          TO DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          value={searchParams.dateTo}
                          onChange={handleToDateChange}
                          placeholder="DD/MMM/YYYY"
                          error={!!dateError}
                        />
                      </Grid>
                      {dateError && (
                        <Grid item xs={12}>
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: -1,
                            }}
                          >
                            {dateError}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}

                  {selectedType.value == 0 && (
                    <>
                      <Grid item xs={12} md={4} sm={6}>
                        <Typography
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
                          COUNTRY
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={countryDropdown}
                          getOptionLabel={(option) => option.countryName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.countryID === value?.countryID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChangePriceList(
                              "countryID",
                              newValue?.countryID || null
                            );
                          }}
                          value={
                            countryDropdown.find(
                              (option) =>
                                option.countryID ===
                                priceListSearchParams.countryID
                            ) || null
                          }
                          placeholder="SELECT"
                        />
                      </Grid>
                      <Grid item xs={12} md={4} sm={6}>
                        <Typography
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
                          STATE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={stateDropdown}
                          getOptionLabel={(option) => option.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChangePriceList(
                              "stateID",
                              newValue?.stateID || null
                            );
                          }}
                          value={
                            stateDropdown.find(
                              (option) =>
                                option.stateID === priceListSearchParams.stateID
                            ) || null
                          }
                          placeholder="SELECT"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {/* price list search */}
                {selectedType.value == 0 && (
                  <Grid container spacing={2} mt={1} pr={2} alignItems="center">
                    {/* First button - 20% width */}
                    <Grid item xs={12} md={1} lg={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleResetPriceList}
                        width="100%"
                        height="36px"
                        fontSize="12px"
                      />
                    </Grid>

                    {/* Second button - 40% width */}
                    <Grid item xs={12} md={11} lg={11}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        height="36px"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
                        fontSize="12px"
                        onClick={handleSearchClickPriceList}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>

                    {/* Third button - 40% width */}
                  </Grid>
                )}
                {/* price  search */}
                {selectedType.value == 1 && (
                  <Grid container spacing={2} mt={1} pr={2} alignItems="center">
                    {/* First button - 20% width */}
                    <Grid item xs={12} md={1} lg={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleResetPrice}
                        width="100%"
                        height="36px"
                        fontSize="12px"
                      />
                    </Grid>

                    {/* Second button - 40% width */}
                    <Grid item xs={12} md={11} lg={11}>
                      <NuralTextButton
                        icon={"./Icons/searchIcon.svg"}
                        iconPosition="right"
                        height="36px"
                        backgroundColor={PRIMARY_BLUE2}
                        color="#fff"
                        width="100%"
                        fontSize="12px"
                        onClick={handleSearchClickPrice}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>

                    {/* Third button - 40% width */}
                  </Grid>
                )}
              </NuralAccordion2>
            )}
            {show ? (
              <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
                <StatusModel width="100%" status={status} title={title} />
              </Grid>
            ) : (
              <>
                {selectedType.value == 1 && (
                  <Grid item xs={12} mt={3}>
                    <PriceTable
                      priceData={priceData}
                      isSearchLoading={isSearchLoading}
                      page={pricePage}
                      rowsPerPage={priceRowsPerPage}
                      totalRecords={priceTotalRecords}
                      sortConfig={sortConfig}
                      handleSort={handleSort}
                      handleChangeRowsPerPage={handlePriceChangeRowsPerPage}
                      handlePreviousPage={handlePricePreviousPage}
                      handleNextPage={handlePriceNextPage}
                      handleJumpToPage={handlePriceJumpToPage}
                      jumpToPage={priceJumpToPage}
                      setJumpToPage={setPriceJumpToPage}
                    />
                  </Grid>
                )}
                {selectedType.value == 0 && (
                  <Grid item xs={12} mt={3}>
                    <PriceListTable
                      priceListData={priceListData}
                      isSearchLoading={isSearchLoading}
                      page={priceListPage}
                      rowsPerPage={priceListRowsPerPage}
                      totalRecords={priceListTotalRecords}
                      sortConfig={sortConfig}
                      handleSort={handleSort}
                      handleChangeRowsPerPage={handlePriceListChangeRowsPerPage}
                      handlePreviousPage={handlePriceListPreviousPage}
                      handleNextPage={handlePriceListNextPage}
                      handleJumpToPage={handlePriceListJumpToPage}
                      jumpToPage={priceListJumpToPage}
                      setJumpToPage={setPriceListJumpToPage}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PriceListView;
