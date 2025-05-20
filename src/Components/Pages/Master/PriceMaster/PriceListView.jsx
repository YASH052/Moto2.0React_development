import { Grid, Typography, Checkbox, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import { LIGHT_BLUE, LIGHT_GRAY2, PRIMARY_BLUE2 } from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";

import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
// import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";

import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";

import { useNavigate } from "react-router-dom";
import {
  Countrymasterlist,
  GetPriceListDataWithMappingAPI,
  GetPriceListName,
  GetPriceMasterListV2,
  GetSKUListForDropdown,
  GetStateListForDropdown,
  ManagePriceListWithMappingAPI,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../Common/Skeletons";
import PriceListTable from "./PriceListTable";
import PriceTable from "./PriceTable";
import PriceListEdit from './PriceListEdit';

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
const PriceListView = ({ accordionExpanded = false, onAccordionChange }) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(ListItemTwo[0]);

  // Price table pagination states
  const [pricePage, setPricePage] = React.useState(1);
  const [priceRowsPerPage, setPriceRowsPerPage] = React.useState(10);
  const [priceTotalRecords, setPriceTotalRecords] = React.useState(0);
  const [priceJumpToPage, setPriceJumpToPage] = useState(null);

  // Price list table pagination states
  const [priceListPage, setPriceListPage] = React.useState(1);
  const [priceListRowsPerPage, setPriceListRowsPerPage] = React.useState(10);
  const [priceListTotalRecords, setPriceListTotalRecords] = React.useState(0);
  const [priceListJumpToPage, setPriceListJumpToPage] = useState(null);

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
  const [accordionExpanded2, setAccordionExpanded2] = React.useState(true);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [priceListSortConfig, setPriceListSortConfig] = React.useState({
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

  const [isSkuLoading, setIsSkuLoading] = useState(false);
  const [isPriceListLoading, setIsPriceListLoading] = useState(false);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [isStateLoading, setIsStateLoading] = useState(false);

  const [editData, setEditData] = useState({
    priceListID: 0,
    priceListName: "",
    priceListType: 0,
    priceMappingList: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  const refreshTableData = async () => {
    if (selectedType.value === 0) {
      // Refresh price list table
      await fetchPriceListDataWithMapping();
    } else {
      // Refresh price table
      await fetchPriceMasterList();
    }
  };

  useEffect(() => {
    // fetchPriceListNameApi();
    fetchCountryDrop();
  }, []);

  // Add event listener for price list upload
  useEffect(() => {
    const handlePriceListUpload = () => {
      setPriceListFlag("refresh");
    };

    window.addEventListener("priceListUploaded", handlePriceListUpload);
    return () => {
      window.removeEventListener("priceListUploaded", handlePriceListUpload);
    };
  }, []);

  useEffect(() => {
    fetchPriceListName();
    fetchSkuDrop();
  }, []);

  // Add event listener for price list creation
  useEffect(() => {
    const handlePriceListCreated = () => {
      setPriceListFlag("refresh");
    };

    window.addEventListener("priceListCreated", handlePriceListCreated);
    return () => {
      window.removeEventListener("priceListCreated", handlePriceListCreated);
    };
  }, []);

  useEffect(() => {
    fetchPriceListDataWithMapping();
  }, [priceListPage, priceListRowsPerPage, priceListFlag]);

  // Add new useEffect to listen for priceListFlag changes
  useEffect(() => {
    if (priceListFlag) {
      refreshTableData();
      setPriceListFlag(""); // Reset the flag after refresh
    }
  }, [priceListFlag]);

  const fetchCountryDrop = async () => {
    setIsCountryLoading(true);
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
      setCountryDropdown([]);
    } finally {
      setIsCountryLoading(false);
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

  const handlePriceListSort = (columnName) => {
    let direction = "asc";

    if (priceListSortConfig.key === columnName) {
      if (priceListSortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setPriceListSortConfig({ key: null, direction: null });
        return;
      }
    }

    setPriceListSortConfig({ key: columnName, direction });

    const sortedRows = [...priceListData].sort((a, b) => {
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

    setPriceListData(sortedRows);
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

  const fetchSkuDrop = async () => {
    setIsSkuLoading(true);
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
    } finally {
      setIsSkuLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPriceMasterList();
  }, [pricePage, priceRowsPerPage]);

  const handleSearchClickPrice = () => {
    setPriceJumpToPage(1);
    setShow(false);

    // Add validation for To Date when From Date is selected
    if (searchParams.dateFrom && !searchParams.dateTo) {
      setDateError("Please select To Date");
      return;
    }

    // Add validation for From Date when To Date is selected
    if (!searchParams.dateFrom && searchParams.dateTo) {
      setDateError("Please select From Date");
      return;
    }

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
    setIsStateLoading(true);
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
      setStateDropdown([]);
    } finally {
      setIsStateLoading(false);
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
          stateID: "0",
          countryID: "0",
        });
        setStateDropdown([]);
        return;
      }
    }
    setPriceListSearchParams({
      ...priceListSearchParams,
      [field]: value,
    });
  };

  const fetchPriceListName = async () => {
    setIsPriceListLoading(true);
    let body = {
      Status: 1,
      Condition: 0 /*0 for Active Price List */,
    };
    try {
      let res = await GetPriceListName(body);
      if (res.statusCode == 200) {
        setPriceListNameDrop(res.priceList);
      } else {
        setPriceListNameDrop([]);
      }
    } catch (error) {
      console.log(error);
      setPriceListNameDrop([]);
    } finally {
      setIsPriceListLoading(false);
    }
  };

  const fetchPriceListDataWithMapping = async () => {
    setIsSearchLoading(true);
    try {
      let res = await GetPriceListDataWithMappingAPI(priceListSearchParams);
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
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsSearchLoading(false);
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
      countryID: 0,
      stateID: 0,
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
    // Only update jumpToPage for custom navigation
    if (action === "custom") {
      setPriceJumpToPage(newPage);
    }
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
    // Only update jumpToPage for custom navigation
    if (action === "custom") {
      setPriceListJumpToPage(newPage || 1);
    }
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue || ListItemTwo[0]);

    // Reset all search parameters based on type
    if (newValue?.value === 0) {
      // Reset price list search parameters
      setPriceListSearchParams({
        priceListName: "",
        countryID: "0",
        stateID: "0",
        pageIndex: 1,
        pageSize: 10,
      });
      setStateDropdown([]);
      setPriceListPage(1);
      setPriceListRowsPerPage(10);
      setPriceListJumpToPage(1);
    } else {
      // Reset price search parameters
      setSearchParams({
        priceListID: 0,
        skuID: null,
        dateFrom: "",
        dateTo: "",
        condition: 0,
        pageIndex: 1,
        pageSize: 10,
      });
      setDateError("");
      setPricePage(1);
      setPriceRowsPerPage(10);
      setPriceJumpToPage(1);
    }

    // Reset error states
    setShow(false);
    setStatus("");
    setTitle("");
  };

  useEffect(() => {
    if (!selectedType) {
      setSelectedType(ListItemTwo[0]);
    }
  }, [selectedType]);

  const handleStatusChange = async (priceListID) => {
    console.log("priceMasterID", priceListID);
    let body = {
      type: 3 /* 1: Create, 2: Update, 3: Status Update */,
      priceListType: 0 /* 1:Country, 2:State */,
      priceListID: priceListID,
      priceListName: "",
      priceMappingList: [],
    };

    try {
      const response = await ManagePriceListWithMappingAPI(body);

      if (response.statusCode == 200) {
        // Refresh the table data
        await fetchPriceListDataWithMapping();
      } else {
        setShow(true);
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Failed to update status");
      }
    } catch (error) {
      setShow(true);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = async (priceListID) => {
    // Find the price list data from the current list
    const priceList = priceListData.find(item => item.priceMasterID === priceListID);
    if (!priceList) return;

    let body = {
      type: 2, /* 1: Create, 2: Update, 3: Status Update */
      priceListType: 0, /* 1:Country, 2:State */
      priceListID: priceListID,
      priceListName: priceList.priceListName || "",
      priceMappingList: [], // You'll need to populate this based on your requirements
    };

    try {
      const response = await ManagePriceListWithMappingAPI(body);
      if (response.statusCode == 200) {
        setEditData({
          priceListID: priceListID,
          priceListName: priceList.priceListName || "",
          priceListType: 0,
          priceMappingList: []
        });
        setIsEditing(true);
        // You might want to open a modal or navigate to edit form here
      } else {
        setShow(true);
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Failed to load edit data");
      }
    } catch (error) {
      setShow(true);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Failed to load edit data");
      console.error("Error loading edit data:", error);
    }
  };

  const handleSaveEdit = async (editedData) => {
    try {
      const response = await ManagePriceListWithMappingAPI(editedData);
      if (response.statusCode == 200) {
        setIsEditing(false);
        // Refresh the table data
        await fetchPriceListDataWithMapping();
        setShow(true);
        setStatus(response.statusCode);
        setTitle("Price list updated successfully");
      } else {
        setShow(true);
        setStatus(response.statusCode);
        setTitle(response.statusMessage || "Failed to update price list");
      }
    } catch (error) {
      setShow(true);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Failed to update price list");
      console.error("Error updating price list:", error);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditData({
      priceListID: 0,
      priceListName: "",
      priceListType: 0,
      priceMappingList: [],
    });
  };

  return (
    <Grid container spacing={2} mt={0}>
      <Grid item xs={12} sx={{ pr: 2 }} ml={2} mb={2}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <NuralAccordion2
                title="Search"
                controlled={true}
                expanded={accordionExpanded}
                onChange={onAccordionChange}
                backgroundColor={LIGHT_GRAY2}
              >
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
                      value={selectedType || ListItemTwo[0]}
                      getOptionLabel={(option) => option?.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      onChange={handleTypeChange}
                      loading={false}
                      disabled={isLoading}
                    />
                  </Grid>

                  {/* Second Row - Only for "PRICE" */}

                  {selectedType?.value === 1 && (
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
                            option?.priceListName || ""
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
                          loading={isPriceListLoading}
                          disabled={isPriceListLoading}
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
                          getOptionLabel={(option) => option?.skuCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.skuID === value?.skuID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "skuID",
                              newValue?.skuID || null
                            );
                          }}
                          value={
                            skuDropDown.find(
                              (option) => option.skuID === searchParams.skuID
                            ) || null
                          }
                          placeholder="SELECT SKU"
                          loading={isSkuLoading}
                          disabled={isSkuLoading}
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
                          disableFutureDates={false}
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
                          disableFutureDates={false}
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

                  {selectedType?.value === 0 && accordionExpanded && (
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
                          getOptionLabel={(option) => option?.countryName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.countryID === value?.countryID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChangePriceList(
                              "countryID",
                              newValue?.countryID || 0
                            );
                          }}
                          value={
                            countryDropdown.find(
                              (option) =>
                                option.countryID ===
                                priceListSearchParams.countryID
                            ) || 0
                          }
                          placeholder="SELECT"
                          loading={isCountryLoading}
                          disabled={isCountryLoading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
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
                          getOptionLabel={(option) => option?.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChangePriceList(
                              "stateID",
                              newValue?.stateID || 0
                            );
                          }}
                          value={
                            stateDropdown.find(
                              (option) =>
                                option.stateID === priceListSearchParams.stateID
                            ) || 0
                          }
                          placeholder="SELECT"
                          loading={isStateLoading}
                          disabled={isStateLoading}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {/* price list search */}
                {selectedType?.value === 0 && (
                  <Grid container spacing={2} mt={1} pr={2} alignItems="center">
                    {/* First button - 20% width */}
                    <Grid item xs={12} sm={2} md={1} lg={1}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        color={PRIMARY_BLUE2}
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleResetPriceList}
                        width="100%"
                        height="36px"
                        fontSize="12px"
                      />
                    </Grid>

                    {/* Second button - 40% width */}
                    <Grid item xs={12} sm={10} md={11} lg={11}>
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
                {selectedType?.value === 1 && (
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
                {selectedType?.value === 1 && (
                  <Grid item xs={12} mt={2}>
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
                {selectedType?.value === 0 && accordionExpanded && (
                  <Grid item xs={12} mt={2}>
                    <PriceListTable
                      priceListData={priceListData}
                      isSearchLoading={isSearchLoading}
                      page={priceListPage}
                      rowsPerPage={priceListRowsPerPage}
                      totalRecords={priceListTotalRecords}
                      sortConfig={priceListSortConfig}
                      handleSort={handlePriceListSort}
                      handleChangeRowsPerPage={handlePriceListChangeRowsPerPage}
                      handlePreviousPage={handlePriceListPreviousPage}
                      handleNextPage={handlePriceListNextPage}
                      handleJumpToPage={handlePriceListJumpToPage}
                      jumpToPage={priceListJumpToPage}
                      setJumpToPage={setPriceListJumpToPage}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEdit}
                    />
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      
      <PriceListEdit
        open={isEditing}
        onClose={handleCloseEdit}
        editData={editData}
        onSave={handleSaveEdit}
        countryDropdown={countryDropdown}
        stateDropdown={stateDropdown}
        isCountryLoading={isCountryLoading}
        isStateLoading={isStateLoading}
        fetchStateDrop={fetchStateDrop}
      />
    </Grid>
  );
};

export default PriceListView;
