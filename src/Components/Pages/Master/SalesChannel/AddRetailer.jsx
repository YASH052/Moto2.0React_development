import { Grid, Typography, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  ERROR_MSSG,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralKYCAccordion from "../../NuralCustomComponents/NuralKYCAccordion";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { useNavigate } from "react-router-dom";
import {
  getRetailerlist,
  GetSalesChannelListForDropdown,
  getReportingHierarchyName,
  getSalesmaninfo,
  SCRCategoryList,
  Countrymasterlist,
  StateList,
  GetStateListForDropdown,
  GetCityListForDropdown,
  AddRetailerForMoto,
  getParentRetailerlist,
  getISPRetailerReferenceDataLink,
  getRetailer,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import AddSalesChannelSkeleton from "../../../Common/AddSalesChannelSkeleton";


const tabs = [
  { label: "Add Retailer", value: "add-retailer" },
  { label: "Search", value: "view-retailer" },
  { label: "Approve", value: "approveSaleschannel" },
];
const options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const options2 = [
  "Nural Network",
  "Deep Learning",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
];

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
  stringify: (option) => option.retailerCode + " " + option.retailerName,
});

const AddRetailer = () => {
  const retailerID = useSelector((state) => state.retailerID);
  console.log("retailerID", retailerID);
  const [activeTab, setActiveTab] = React.useState("add-retailer");
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const [isChild, setIsChild] = React.useState(0);
  const [retailerDrop, setRetailerDrop] = React.useState([]);
  const [SCRCategoryListDrop, setSCRCategoryListDrop] = React.useState([]);
  const [reportingHierarchyDrop, setReportingHierarchyDrop] = React.useState(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [countryDrop, setCountryDrop] = React.useState([]);
  const [stateDrop, setStateDrop] = React.useState([]);
  const [cityDrop, setCityDrop] = React.useState([]);
  const [salesChannelDrop, setSalesChannelDrop] = React.useState([]);
  const [salesmanDrop, setSalesmanDrop] = React.useState([]);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [parentRetailer, setParentRetailer] = React.useState([]);
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    address1: "",
    address2: "",
    approveRemarks: "",
    approveStatus: 0,
    areaID: 0,
    bankName: "",
    branchLocation: "",
    cityID: 0,
    contactPerson: "",
    counterPotentialVolume: null,
    counterPotentialValue: null,
    counterSize: null,
    countryID: 0,
    createLoginOrNot: 0,
    dateOfBirth: "",
    email: "",
    groupParentID: 0,
    gstin_No: "",
    ifscCode: "",
    isIsp: 0,
    latitute: "",
    longitute: "",
    mobileNumber: "",
    newRetailerCode: "",
    openingStockDate: "",
    panNo: "",
    password: "",
    passwordExpiryDays: 0,
    passwordSalt: "",
    phoneNumber: "",
    pinCode: null,
    referanceCode: "",
    retailerCode: "",
    retailerHierarchyLevelID: 0,
    retailerID: 0,
    retailerName: "",
    retailerOrgnHierarchyID: 0,
    retailerTypeId: 0,
    salesChannelID: 0,
    salesmanID: 0,
    stateID: 0,
    status: 0,
    tehsilID: 0,
    tinNumber: "",
    updateBankDetail: 0,
    userName: "",
    whatsAppNumber: "",
    scrCategoryID: 0,
    PanFilePath: "",
    GstFilePath: "",
  });

  const [errors, setErrors] = useState({});
  const [isParentRetailerLoading, setIsParentRetailerLoading] = useState(false);
  const validateField = (name, value) => {
    switch (name) {
      case "retailerTypeId":
        return !value ? "Retailer Type is required" : "";
      case "scrCategoryID":
        return !value ? "Retailer Category is required" : "";
      case "salesChannelID":
        return !value ? "Parent Sales Channel is required" : "";
      case "retailerHierarchyLevelID":
        return !value ? "Reporting Hierarchy is required" : "";
      case "contactPerson":
        return !value ? "Contact Person is required" : "";
      case "retailerName":
        return !value ? "Retailer Name is required" : "";
      case "mobileNumber":
        return !value
          ? "Mobile Number is required"
          : !/^[0-9]{10}$/.test(value)
          ? "Invalid mobile number"
          : "";
      case "email":
        return !value
          ? "Email is required"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Invalid email address"
          : "";
      case "countryID":
        return !value ? "Country is required" : "";
      case "stateID":
        return !value ? "State is required" : "";
      case "cityID":
        return !value ? "City is required" : "";
      case "pinCode":
        return !value
          ? "PIN Code is required"
          : !/^[0-9]{6}$/.test(value)
          ? "Invalid PIN Code"
          : "";
      case "address1":
        return !value ? "Address Line 1 is required" : "";
      case "panNo":
        return !value ? "PAN No. is required" : "";
      case "bankName":
        return "";
      case "accountHolder":
        return "";
      case "accountNumber":
        return !value
          ? ""
          : !/^[0-9]{9,18}$/.test(value)
          ? "Invalid Bank Account Number (9-18 digits)"
          : "";
      case "branchLocation":
        return "";
      case "ifscCode":
        return "";
      case "counterPotentialValue":
        return !value
          ? "Counter Potential Value is required"
          : isNaN(Number(value))
          ? "Counter Potential Value must be a number"
          : "";
      case "counterSize":
        return !value
          ? "Counter Size is required"
          : isNaN(Number(value))
          ? "Counter Size must be a number"
          : "";
      case "openingStockDate":
        return !value ? "Opening Stock Date is required" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    console.log("newErrors", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    // First validate the field
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
    if (field === "salesChannelID") {
      fetchReportingHierarchyDrop(value);
    }

    // Handle special cases for dependent dropdowns
    if (field === "countryID") {
      if (value) {
        fetchStateDrop(value);
      } else {
        setStateDrop([]);
        setCityDrop([]);
      }
    }
    if (field === "stateID") {
      if (value) {
        fetchCityDrop(value);
      } else {
        setCityDrop([]);
      }
    }

    // Add input restrictions for specific fields
    let processedValue = value;

    // Fields that should not contain spaces
    const noSpaceFields = [
      "retailerCode",
      "password",
      "userName",
      "gstin_No",
      "accountNumber",
      "ifscCode",
      "panNo",
    ];

    if (noSpaceFields.includes(field)) {
      processedValue = value.replace(/\s/g, "");
    }

    // Character limit restrictions and alphanumeric validation
    switch (field) {
      case "panNo":
        processedValue = processedValue.slice(0, 10);
        processedValue = processedValue.replace(/[^a-zA-Z0-9]/g, "");
        break;
      case "pinCode":
        processedValue = processedValue.slice(0, 6);
        break;
      case "mobileNumber":
        processedValue = processedValue.slice(0, 10);
        break;
      case "contactPerson":
      case "retailerName":
      case "retailerCode":
      case "bankName":
      case "accountNumber":
      case "branchLocation":
        processedValue = processedValue.slice(0, 50);
        break;
      default:
        break;
    }

    // Update form data with processed value
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handlePost = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let res = await AddRetailerForMoto(formData);
      if (res.statusCode == "200") {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage || "Retailer Added Successfully");
        setTimeout(() => {
          setShowStatus(false);
          setStatus(false);
          setTitle("");
        }, 3000);
        handleCancel(); // Reset form after successful creation
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage || "Error Adding Retailer");
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status);
      setTitle(error.message || "Something went wrong");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to initial state
    setFormData({
      accountHolder: "",
      accountNumber: "",
      address1: "",
      address2: "",
      approveRemarks: "",
      approveStatus: 0,
      areaID: 0,
      bankName: "",
      branchLocation: "",
      cityID: 0,
      contactPerson: "",
      counterPotentialVolume: null,
      counterPotentialValue: null,
      counterSize: null,
      countryID: 0,
      createLoginOrNot: 0,
      dateOfBirth: "",
      email: "",
      groupParentID: 0,
      gstin_No: "",
      ifscCode: "",
      isIsp: 0,
      latitute: "",
      longitute: "",
      mobileNumber: "",
      newRetailerCode: "",
      openingStockDate: "",
      panNo: "",
      password: "",
      passwordExpiryDays: 0,
      passwordSalt: "",
      phoneNumber: "",
      pinCode: null,
      referanceCode: "",
      retailerCode: "",
      retailerHierarchyLevelID: 0,
      retailerID: 0,
      retailerName: "",
      retailerOrgnHierarchyID: 0,
      retailerTypeId: 0,
      salesChannelID: 0,
      salesmanID: 0,
      stateID: 0,
      status: 0,
      tehsilID: 0,
      tinNumber: "",
      updateBankDetail: 0,
      userName: "",
      whatsAppNumber: "",
      scrCategoryID: 0,
      PanFilePath: "",
      GstFilePath: "",
    });

    // Reset isChild state
    setIsChild(0);

    // Clear all errors
    setErrors({});

    // Reset state and city dropdowns
    setStateDrop([]);
    setCityDrop([]);

    // Reset format selection
    setSelectedFormat("interface");

    // Reset all text field values
    const textFields = document.querySelectorAll(
      'input[type="text"], input[type="password"]'
    );
    textFields.forEach((field) => {
      field.value = "";
    });

    // Reset all autocomplete fields
    const autocompleteFields = document.querySelectorAll(
      ".MuiAutocomplete-root"
    );
    autocompleteFields.forEach((field) => {
      field.querySelector("input").value = "";
    });

    // Reset calendar field
    const calendarField = document.querySelector('input[type="date"]');
    if (calendarField) {
      calendarField.value = "";
    }
  };

  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-retailer");
    } else if (value === "batch") {
      navigate("/retailer-excelUpload");
    }
  };

  const getParentRetailer = async () => {
    const param = {
      salesChanneType: 0,
      roleType: 1, //for parent retailer =1, else 0
      salesChannelID: 0,
      retailerCode: "",
      retailerName: "",
      retailerID: 0,
    };

    try {
      setIsParentRetailerLoading(true);
      const res = await getParentRetailerlist(param);
      console.log("res.parentRetailerList", res.parentRetailerMasterList);
      if (res.statusCode == "200") {
        setParentRetailer(res.parentRetailerMasterList);
      } else {
        setParentRetailer([]);
      }
    } catch (error) {
      console.error("Error in getParentRetailer:", error);
      throw error;
    } finally {
      setIsParentRetailerLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailerDrop();
    fetchSCRCategoryDrop();
    fetchSalesChannelDrop();

    fetchSalesmanDrop();
    fetchCountryDrop();
  }, []);

  useEffect(() => {
    if (retailerID) {
      fetchRetailerData();
    }
  }, [retailerID]);

  const fetchRetailerData = async () => {
    let body = {
      pageIndex: 1,
      pageSize: 10,
      retailerID: retailerID,
      retailerName: "",
      salesChannelID: 0,
      type: 0,
      salesmanName: "",
      salesmanID: 0,
      loggedSalesChannelID: 0,
      retailerCode: "",
      status: 2,
      retailerApproval: 1,
      displayMode: 0,
      stateID: 0,
      salesChannelCode: "",
      ndID: 0,
      countryID: 0,
      leaveTypeID: 0,
    };
    try {
      let res = await getRetailer(body);
      if (res.statusCode == "200") {
        console.log("res.getRetailerList", res.getRetailerList[0]);
        let editData = res.getRetailerList[0];

        // setFormData({
        //   ...editData,
        //   retailerID: editData.retailerID,
        //   retailerName: editData.retailerName,
        //   retailerCode: editData.retailerCode,
        //   salesChannelID: editData.salesChannelID,
        //   stateID: editData.stateID,
        //   countryID: editData.countryID,
        //   retailerTypeID: editData.retailerTypeID,
        //   scrCategoryID: editData.scrCategoryID,
        //   groupParentID: editData.groupParentID,
        //   isIsp: editData.isIsp,

        // });
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage || "Error Fetching Retailer Data");
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || 500);
      setTitle(error.message || "Internal Server Error");
    }
  };

  const fetchCountryDrop = async () => {
    let body = {
      CountryName: "",
      CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
      pageIndex: 1 /*-1 for export to excel */,
      pageSize: 10,
    };
    try {
      let res = await Countrymasterlist(body);
      if (res.statusCode == "200") {
        setCountryDrop(res.countryMasterList);
      } else {
        setCountryDrop([]);
      }
    } catch (error) {}
  };

  const fetchStateDrop = async (countryID) => {
    let body = {
      countryID: countryID,
      regionID: 0,
      stateID: 0,
    };

    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == "200") {
        setStateDrop(res.stateDropdownList);
      } else {
        setStateDrop([]);
      }
    } catch (error) {}
  };

  const fetchCityDrop = async (stateID) => {
    let body = {
      searchConditions: 1, //it will be 1
      stateID: stateID,
      cityID: 0,
    };
    try {
      let res = await GetCityListForDropdown(body);
      if (res.statusCode == "200") {
        setCityDrop(res.cityDropdownList);
      } else {
        setCityDrop([]);
      }
    } catch (error) {}
  };

  const fetchSalesmanDrop = async () => {
    let body = {
      salesmanId: 0,
      salesmanName: "",
      salesmanCode: "",
      salesChannelID: 0,
      type: 1, // will be pass 1
      mapwithRetailer: 0,
    };
    try {
      const res = await getSalesmaninfo(body);
      if (res.statusCode == "200") {
        console.log("res.salesmanDropdownList", res.salesmanDropdownList);
        setSalesmanDrop(res.salesmanDropdownList);
      } else {
        setSalesmanDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchSalesmanDrop:", error);
    }
  };

  const fetchReportingHierarchyDrop = async (value) => {
    let body = {
      salesChannelID: value, //must be pass saleschannelID
    };

    try {
      const res = await getReportingHierarchyName(body);
      console.log(
        "res.reportingHierarchyDropdownList",
        res.reportingHierarchyList1
      );
      if (res.statusCode == "200") {
        console.log("res.reportingHierarchyList1", res.reportingHierarchyList1);
        setReportingHierarchyDrop(res.reportingHierarchyList1);
      } else {
        setReportingHierarchyDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchReportingHierarchyDrop:", error);
    }
  };

  const fetchSalesChannelDrop = async () => {
    let body = {
      salesChannelID: 0,
      stateID: 0,
      cityID: 0,
    };

    try {
      const res = await GetSalesChannelListForDropdown(body);
      if (res.statusCode == "200") {
        setSalesChannelDrop(res.salesChannelDropdownList);
      } else {
        setSalesChannelDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchSalesChannelDrop:", error);
    }
  };

  const fetchSCRCategoryDrop = async () => {
    let body = {
      scrCategoryId: 0,
      scrCategoryName: "",
      mode: 3 /* 0 = bind grid & excel export, 1= get list for editing, 3= bind dropdown list */,
      status: 1, //0-Deactive, 1-Active, 2-All
      pageIndex: 1, //1-UI,-1-export excel
      pageSize: 1000,
    };
    try {
      const res = await SCRCategoryList(body);
      if (res.statusCode == "200") {
        console.log("res.scrCategoryList", res.scrCategoryList);
        setSCRCategoryListDrop(res.scrCategoryList);
      } else {
        setSCRCategoryListDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchSCRCategoryDrop:", error);
    }
  };

  const fetchRetailerDrop = async () => {
    let body = {
      SearchConditions: 1, //default 1
    };
    try {
      const res = await getRetailerlist(body);
      if (res.statusCode == "200") {
        setRetailerDrop(res.retailerMasterList);
      } else {
        setRetailerDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchRetailerDrop:", error);
    }
  };

  const fields = [
    {
      label: "GST NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "gst",
      value: formData.gstin_No || "",
      onChange: (e) => handleChange("gstin_No", e.target.value),
      fileName: formData.GstFilePath ? formData.GstFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        handleChange("GstFilePath", fileData.file);
      },
      accept: ".pdf,.jpg,.jpeg,.png",
      error: !!errors.gstin_No,
      errorMessage: errors.gstin_No,
    },
    {
      label: "PAN NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "pan",
      value: formData.panNo || "",
      onChange: (e) => handleChange("panNo", e.target.value),
      fileName: formData.PanFilePath ? formData.PanFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        handleChange("PanFilePath", fileData.file);
      },
      accept: ".pdf,.jpg,.jpeg,.png",
      error: !!errors.panNo,
      errorMessage: errors.panNo,
    },
  ];

  if (loading) {
    return <AddSalesChannelSkeleton />;
  }


  return (
    <Grid container spacing={0}>
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
        <Grid item xs={12} mt={3} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Retailers" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} lg={12} mt={-1}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 0 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Organization Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      SELECT MODE
                    </Typography>
                    <NuralRadioButton
                      onChange={handleFormatChange}
                      options={[
                        { value: "interface", label: "Interface" },
                        { value: "batch", label: "Batch" },
                      ]}
                      value={selectedFormat}
                      width="100%"
                      gap="5px"
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      RETAILER TYPE
                    </Typography>
                    <NuralAutocomplete
                      label="Retailer Type"
                      options={retailerDrop}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.retailerTypeName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.retailerTypeId === value?.retailerTypeId
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "retailerTypeId",
                          newValue?.retailerTypeId || null
                        );
                      }}
                      value={
                        retailerDrop.find(
                          (option) =>
                            option.retailerTypeId === formData.retailerTypeId
                        ) || null
                      }
                      error={!!errors.retailerTypeId}
                      errorMessage={errors.retailerTypeId}
                    />
                    {errors.retailerTypeId && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.retailerTypeId}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      RETAILER CATEGORY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={SCRCategoryListDrop}
                      getOptionLabel={(option) => option.scrCategoryName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.scrCategoryID === value?.scrCategoryID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "scrCategoryID",
                          newValue?.scrCategoryID || null
                        );
                      }}
                      value={
                        SCRCategoryListDrop.find(
                          (option) =>
                            option.scrCategoryID === formData.scrCategoryID
                        ) || null
                      }
                      error={!!errors.scrCategoryID}
                      errorMessage={errors.scrCategoryID}
                    />
                    {errors.scrCategoryID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.scrCategoryID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      ISD ON COUNTER
                    </Typography>
                    <NuralRadioButton
                      onChange={(value) => handleChange("isIsp", value)}
                      options={[
                        { value: 1, label: "Yes" },
                        { value: 0, label: "No" },
                      ]}
                      value={formData.isIsp}
                      width="100%"
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      PARENT SALES CHANNEL
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={salesChannelDrop}
                      getOptionLabel={(option) => option.salesChannelName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.salesChannelID === value?.salesChannelID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "salesChannelID",
                          newValue?.salesChannelID || null
                        );
                      }}
                      value={
                        salesChannelDrop.find(
                          (option) =>
                            option.salesChannelID === formData.salesChannelID
                        ) || null
                      }
                      error={!!errors.salesChannelID}
                      errorMessage={errors.salesChannelID}
                    />
                    {errors.salesChannelID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.salesChannelID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      IS CHILD
                    </Typography>
                    <NuralRadioButton
                      options={[
                        { value: 1, label: "Yes" },
                        { value: 0, label: "No" },
                      ]}
                      onChange={(value) => {
                        console.log("Setting isChild to:", value);
                        setIsChild(value);
                        getParentRetailer();
                      }}
                      value={isChild}
                      margin="0px"
                      width="100%"
                    />
                  </Grid>
                  {isChild == 1 && (
                    <>
                      <Grid item xs={12} md={6} lg={6}>
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
                          PARENT RETAILER NAME
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          placeholder="SELECT"
                          options={parentRetailer}
                          getOptionLabel={(option) => option.retailerName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerID === value?.retailerID
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "groupParentID",
                              newValue?.retailerID || null
                            );
                          }}
                          value={
                            parentRetailer.find(
                              (option) =>
                                option.retailerID === formData.groupParentID
                            ) || null
                          }
                          loading={isParentRetailerLoading}
                          error={!!errors.groupParentID}
                          errorMessage={errors.groupParentID}
                          filterOptions={filterOptions}
                        />
                        {errors.groupParentID && (
                          <FormHelperText
                            sx={{
                              color: ERROR_MSSG,
                              fontSize: "12px",
                              marginTop: "4px",
                              fontFamily: "Manrope, sans-serif",
                              paddingLeft: "8px",
                              fontWeight: 400,
                            }}
                          >
                            {errors.groupParentID}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            ml: 2,
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          PARENT RETAILER CODE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          placeholder="SELECT"
                          options={parentRetailer}
                          getOptionLabel={(option) => option.retailerCode || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.retailerID === value?.retailerID
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "groupParentID",
                              newValue?.retailerID || null
                            );
                          }}
                          value={
                            parentRetailer.find(
                              (option) =>
                                option.retailerID === formData.groupParentID
                            ) || null
                          }
                          loading={isParentRetailerLoading}
                          error={!!errors.groupParentID}
                          errorMessage={errors.groupParentID}
                          filterOptions={filterOptions}
                        />
                        {errors.groupParentID && (
                          <FormHelperText
                            sx={{
                              color: ERROR_MSSG,
                              fontSize: "12px",
                              marginTop: "4px",
                              fontFamily: "Manrope, sans-serif",
                              paddingLeft: "8px",
                            }}
                          >
                            {errors.groupParentID}
                          </FormHelperText>
                        )}
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} md={6} lg={6}>
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
                      REPORTING HIERARCHY NAME
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={reportingHierarchyDrop}
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.orgnhierarchyID === value?.orgnhierarchyID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "retailerHierarchyLevelID",
                          newValue?.orgnhierarchyID || null
                        );
                      }}
                      value={
                        reportingHierarchyDrop.find(
                          (option) =>
                            option.orgnhierarchyID ===
                            formData.retailerHierarchyLevelID
                        ) || null
                      }
                      error={!!errors.retailerHierarchyLevelID}
                      errorMessage={errors.retailerHierarchyLevelID}
                    />
                    {errors.retailerHierarchyLevelID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                          fontWeight: 400,
                        }}
                      >
                        {errors.retailerHierarchyLevelID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 2,
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      SALESMAN
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={salesmanDrop}
                      getOptionLabel={(option) => option.salesmanName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.salesmanID === value?.salesmanID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "salesmanID",
                          newValue?.salesmanID || null
                        );
                      }}
                      value={
                        salesmanDrop.find(
                          (option) => option.salesmanID === formData.salesmanID
                        ) || null
                      }
                      error={!!errors.salesmanID}
                      errorMessage={errors.salesmanID}
                    />
                    {errors.salesmanID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.salesmanID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12} lg={12}>
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
                      CONTACT PERSON
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        handleChange("contactPerson", e.target.value)
                      }
                      placeholder="ENTER CONTACT PERSON"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.contactPerson}
                      errorMessage={errors.contactPerson}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
              <NuralAccordion2
                title="Retailer Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      RETAILER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.retailerName}
                      onChange={(e) =>
                        handleChange("retailerName", e.target.value)
                      }
                      placeholder="ENTER RETAILER NAME"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.retailerName}
                      errorMessage={errors.retailerName}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      RETAILER CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      disabled
                      placeholder="AUTO GENERATED"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        handleChange("mobileNumber", e.target.value)
                      }
                      placeholder="ENTER MOBILE NO."
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.mobileNumber}
                      errorMessage={errors.mobileNumber}
                      maxLength={10}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 10) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      EMAIL ID
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="ENTER EMAIL ID"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.email}
                      errorMessage={errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      COUNTRY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={countryDrop}
                      getOptionLabel={(option) => option.countryName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.countryID === value?.countryID
                      }
                      onChange={(event, newValue) => {
                        handleChange("countryID", newValue?.countryID || null);
                      }}
                      value={
                        countryDrop.find(
                          (option) => option.countryID === formData.countryID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.countryID}
                      errorMessage={errors.countryID}
                    />
                    {errors.countryID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.countryID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      STATE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={stateDrop}
                      getOptionLabel={(option) => option.stateName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.stateID === value?.stateID
                      }
                      onChange={(event, newValue) => {
                        handleChange("stateID", newValue?.stateID || null);
                      }}
                      value={
                        stateDrop.find(
                          (option) => option.stateID === formData.stateID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.stateID}
                      errorMessage={errors.stateID}
                    />
                    {errors.stateID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.stateID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      CITY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={cityDrop}
                      getOptionLabel={(option) => option.cityName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.cityID === value?.cityID
                      }
                      onChange={(event, newValue) => {
                        handleChange("cityID", newValue?.cityID || null);
                      }}
                      value={
                        cityDrop.find(
                          (option) => option.cityID === formData.cityID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.cityID}
                      errorMessage={errors.cityID}
                    />
                    {errors.cityID && (
                      <FormHelperText
                        sx={{
                          color: ERROR_MSSG,
                          fontSize: "12px",
                          marginTop: "4px",
                          fontFamily: "Manrope, sans-serif",
                          paddingLeft: "8px",
                        }}
                      >
                        {errors.cityID}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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
                      PIN CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.pinCode}
                      onChange={(e) => handleChange("pinCode", e.target.value)}
                      placeholder="ENTER PIN CODE"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.pinCode}
                      errorMessage={errors.pinCode}
                      maxLength={6}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 6) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                      ADDRESS LINE 1
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.address1}
                      onChange={(e) => handleChange("address1", e.target.value)}
                      placeholder="ENTER ADDRESS LINE 1"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.address1}
                      errorMessage={errors.address1}
                    />
                  </Grid>

                  <Grid item xs={12}>
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
                      ADDRESS LINE 2
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.address2}
                      onChange={(e) => handleChange("address2", e.target.value)}
                      placeholder="ENTER ADDRESS LINE 2"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Business Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12}>
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
                      OPENING STOCK DATE*
                    </Typography>
                    <NuralCalendar
                      value={formData.openingStockDate}
                      onChange={(date) =>
                        handleChange("openingStockDate", date)
                      }
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      backgroundColor={LIGHT_BLUE}
                      name="openingStockDate"
                      error={!!errors.openingStockDate}
                    />
                    {errors.openingStockDate && (
                      <FormHelperText error sx={{ mt: 0.5, ml: 1 }}>
                        {errors.openingStockDate}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      COUNTER POTENTIAL (VALUE)
                    </Typography>
                    <NuralTextField
                      value={formData.counterPotentialValue}
                      onChange={(e) =>
                        handleChange("counterPotentialValue", e.target.value)
                      }
                      width="100%"
                      placeholder="ENTER COUNTER POTENTIAL (VALUE)"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.counterPotentialValue}
                      errorMessage={errors.counterPotentialValue}
                      onKeyPress={(e) => {
                        if (!/[0-9.]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      COUNTER POTENTIAL (VOLUME)
                    </Typography>
                    <NuralTextField
                      value={formData.counterSize}
                      onChange={(e) =>
                        handleChange("counterSize", e.target.value)
                      }
                      width="100%"
                      placeholder="ENTER COUNTER POTENTIAL"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.counterSize}
                      errorMessage={errors.counterSize}
                      onKeyPress={(e) => {
                        if (!/[0-9.]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item>
              <NuralAccordion2
                title="Banking Details"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      NAME OF BANK
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      placeholder="ENTER NAME OF BANK"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.bankName}
                      errorMessage={errors.bankName}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      ACCOUNT HOLDER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.accountHolder}
                      onChange={(e) =>
                        handleChange("accountHolder", e.target.value)
                      }
                      placeholder="ENTER ACCOUNT HOLDER NAME"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.accountHolder}
                      errorMessage={errors.accountHolder}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      BANK ACCOUNT NUMBER
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleChange("accountNumber", e.target.value)
                      }
                      placeholder="ENTER BANK ACCOUNT NUMBER"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.accountNumber}
                      errorMessage={errors.accountNumber}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      BRANCH LOCATION
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.branchLocation}
                      onChange={(e) =>
                        handleChange("branchLocation", e.target.value)
                      }
                      placeholder="ENTER BRANCH LOCATION"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.branchLocation}
                      errorMessage={errors.branchLocation}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={12}>
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
                      IFSC CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.ifscCode}
                      onChange={(e) => handleChange("ifscCode", e.target.value)}
                      placeholder="ENTER IFSC CODE"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.ifscCode}
                      errorMessage={errors.ifscCode}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralAccordion2
                title="Geolocation"
                backgroundColor={LIGHT_GRAY2}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
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
                      LATITUDE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.latitude}
                      onChange={(e) => handleChange("latitude", e.target.value)}
                      placeholder="ENTER LATITUDE"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
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
                      LONGITUDE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleChange("longitude", e.target.value)
                      }
                      placeholder="ENTER LONGITUDE"
                      backgroundColor={LIGHT_BLUE}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            <Grid item>
              <NuralKYCAccordion fields={fields} />
            </Grid>
            <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
              {showStatus && (
                <StatusModel width="100%" status={status} title={title} />
              )}
            </Grid>
            <Grid item mt={-2} mb={2}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={6}>
                  <NuralButton
                    text="CANCEL"
                    variant="outlined"
                    borderColor={PRIMARY_BLUE2}
                    onClick={() => {
                      handleCancel();
                      setErrors({});
                      setShowStatus(false);
                    }}
                    width="100%"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <NuralButton
                    text="PROCEED"
                    backgroundColor={AQUA}
                    variant="contained"
                    onClick={handlePost}
                    width="100%"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddRetailer;
