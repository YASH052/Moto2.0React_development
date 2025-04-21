import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  ERROR_RED,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralKYCAccordion from "../../NuralCustomComponents/NuralKYCAccordion";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import { useNavigate } from "react-router-dom";
import {
  Countrymasterlist,
  GetCityListForDropdown,
  GetParentSalesChannel,
  GetReportingHierarchyList,
  GetSalesChannelType,
  GetStateListForDropdown,
  ManageSalesChannelMoto,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import AddSalesChannelSkeleton from "../../../Common/AddSalesChannelSkeleton";

const tabs = [
  { label: "Add", value: "add-sales-channel" },
  { label: "Search", value: "sales-channel-view" },
  { label: "Approve", value: "approveSaleschannel" },
];

const options2 = [
  "Nural Network",
  "Deep Learning",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
];

const AddSalesChannel = () => {
  const [activeTab, setActiveTab] = React.useState("add-sales-channel");
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const [salesChannelTypeDrop, setSalesChannelTypeDrop] = React.useState([]);
  const [parentSalesChannelDrop, setParentSalesChannelDrop] = React.useState(
    []
  );
  const [countryDrop, setCountryDrop] = React.useState([]);
  const [cityDrop, setCityDrop] = React.useState([]);
  const [stateDrop, setStateDrop] = React.useState([]);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [reportingHierarchyNameDrop, setReportingHierarchyNameDrop] =
    React.useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    parentSalesChannelID: 0,
    salesChannelTypeId: 0,
    reportingHierarchyID: 0,
    contactPerson: "",
    salesChannelID: 0,
    salesChannelCode: "",
    salesChannelName: "",
    mobile: "",
    email: "",
    userName: "",
    password: "",
    countryID: 0,
    stateID: 0,
    cityID: 0,
    pinCode: "",
    address1: "",
    address2: "",
    openingStockDate: "",
    saveBankingDetails: 1,
    bankName: "",
    accountHolderName: "",
    bankAccountNumber: "",
    branchLocation: "",
    ifscCode: "",
    gstNumber: "",
    panNumber: "",
    PanFilePath: null,
    GstFilePath: null,
  });

  const fields = [
    {
      label: "GST NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "gst",
      value: formData.gstNumber || "",
      onChange: (e) => handleChange("gstNumber", e.target.value),
      fileName: formData.GstFilePath ? formData.GstFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        handleChange("GstFilePath", fileData.path);
        handleChange("GstFilePath", fileData.file);
      },
      accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
      error: !!errors.gstNumber,
      errorMessage: errors.gstNumber,
    },
    {
      label: "PAN NO.",
      placeholder: "XXXXXXXXXXXXX",
      name: "pan",
      value: formData.panNumber || "",
      onChange: (e) => handleChange("panNumber", e.target.value),
      fileName: formData.PanFilePath ? formData.PanFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        handleChange("PanFilePath", fileData.path);
        handleChange("PanFilePath", fileData.file);
      },
      accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
      error: !!errors.panNumber,
      errorMessage: errors.panNumber,
    },
  ];

  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    console.log(newValue);
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-sales-channel");
    } else if (value === "batch") {
      navigate("/sales-excel");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchSalesChannelTypeDrop(), fetchCountryDrop()]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStateDrop = async (value) => {
    let body = {
      countryID: value,
      regionID: 0,
      stateID: 0,
    };
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDrop(res.stateDropdownList);
      }
    } catch (error) {
      console.error("Error in fetchStateDrop:", error);
    }
  };

  const fetchCountryDrop = async () => {
    let body = {
      CountryName: "",
      CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
      pageIndex: 1 /*-1 for export to excel */,
      pageSize: 1000,
    };
    try {
      let res = await Countrymasterlist(body);
      if (res.statusCode == 200) {
        setCountryDrop(res.countryMasterList);
      }
    } catch (error) {
      console.error("Error in fetchCountryDrop:", error);
    }
  };

  const fetchCityDrop = async (value) => {
    let body = {
      searchConditions: 1, //it will be 1
      stateID: value,
      cityID: 0,
    };
    try {
      let res = await GetCityListForDropdown(body);
      if (res.statusCode == 200) {
        setCityDrop(res.cityDropdownList);
      }
    } catch (error) {
      console.error("Error in fetchCityDrop:", error);
    }
  };

  const fetchParentSalesChannelDrop = async (value) => {
    let body = {
      salesChannelTypeid: value,
      forApproval: 0,
      loadRetailer: 0,
    };

    try {
      let res = await GetParentSalesChannel(body);
      if (res.statusCode == 200) {
        setParentSalesChannelDrop(res.parentSalesChannelList);
      }
    } catch (error) {
      console.error("Error in fetchParentSalesChannelDrop:", error);
    }
  };

  const fetchSalesChannelTypeDrop = async () => {
    let body = {
      salesChannelTypeid: 0,
      forApproval: 0,
      loadRetailer: 0,
    };
    try {
      const res = await GetSalesChannelType(body);
      if (res.statusCode == 200) {
        setSalesChannelTypeDrop(res.salesChannelTypeList);
      }
    } catch (error) {
      console.error("Error in fetchSalesChannelTypeDrop:", error);
    }
  };

  const fetchReportingHierarchyNameDrop = async (value) => {
    let body = {
      salesChannelTypeID: formData.salesChannelTypeId,
      parentSalesChannelID: value,
      countryID: 1,
    };
    try {
      let res = await GetReportingHierarchyList(body);
      if (res.statusCode == 200) {
        setReportingHierarchyNameDrop(res.reportingHierarchyList);
      }
    } catch (error) {
      console.error("Error in fetchReportingHierarchyNameDrop:", error);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "salesChannelTypeId":
        return !value ? "Sales Channel Type is required" : "";
      case "parentSalesChannelID":
        return !value ? "Parent Sales Channel is required" : "";
      case "reportingHierarchyID":
        return !value ? "Reporting Hierarchy is required" : "";
      case "contactPerson":
        return !value ? "Contact Person is required" : "";
      case "salesChannelName":
        return !value ? "Sales Channel Name is required" : "";
      case "salesChannelCode":
        return !value ? "Sales Channel Code is required" : "";
      case "mobile":
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
      case "userName":
        return !value ? "Username is required" : "";
      case "password":
        return !value
          ? "Password is required"
          : value.length < 6
          ? "Password must be at least 6 characters"
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
      case "bankName":
        return !value ? "Bank Name is required" : "";
      case "accountHolderName":
        return !value ? "Account Holder Name is required" : "";
      case "bankAccountNumber":
        return !value
          ? "Bank Account Number is required"
          : !/^[0-9]{9,18}$/.test(value)
          ? "Invalid Bank Account Number"
          : "";
      case "branchLocation":
        return !value ? "Branch Location is required" : "";
      case "ifscCode":
        return !value
          ? "IFSC Code is required"
          : // : !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
            // ? "Invalid IFSC Code"
            "";
      case "panNumber":
        return !value
          ? "PAN Number is required"
          : !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
          ? "Invalid PAN Number (Format: ISOPK2565H)"
          : "";
      case "gstNumber":
        return !value
          ? "GST Number is required"
          : !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][1-9A-Z][0-9A-Z]$/.test(
              value
            )
          ? "Invalid GST Number (Format: 29ABCDE1234F1Z5)"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    // First validate the field
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Handle special cases for dependent dropdowns
    if (field === "salesChannelTypeId") {
      if (value) {
        fetchParentSalesChannelDrop(value);
      } else {
        setParentSalesChannelDrop([]);
        setReportingHierarchyNameDrop([]);
      }
    }
    if (field === "parentSalesChannelID") {
      if (value) {
        fetchReportingHierarchyNameDrop(value);
      } else {
        setReportingHierarchyNameDrop([]);
      }
    }
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
      "salesChannelCode",
      "password",
      "userName",
      "gstNumber",
      "bankAccountNumber",
      "ifscCode",
    ];

    if (noSpaceFields.includes(field)) {
      processedValue = value.replace(/\s/g, "");
    }

    // Character limit restrictions
    switch (field) {
      case "panNumber":
        processedValue = processedValue.slice(0, 10);
        break;
      case "pinCode":
        processedValue = processedValue.slice(0, 6);
        break;
      case "mobile":
        processedValue = processedValue.slice(0, 10);
        break;
      case "contactPerson":
      case "salesChannelName":
      case "salesChannelCode":
      case "bankName":
      case "bankAccountNumber":
      case "branchLocation":
        processedValue = processedValue.slice(0, 50);
        break;
      default:
        break;
    }

    // Update form data with processed value
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleClearStatus = () => {
    setShowStatus(false);
    setStatus(false);
    setTitle("");
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    // Validate form first
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);

    // If there are errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();

    // Append files if they exist
    if (formData.PanFilePath) {
      formDataToSend.append("panFile", formData.PanFilePath);
    }
    if (formData.GstFilePath) {
      formDataToSend.append("gstFile", formData.GstFilePath);
    }

    // Append other form data
    Object.keys(formData).forEach((key) => {
      if (key !== "PanFilePath" && key !== "GstFilePath") {
        formDataToSend.append(key, formData[key]);
      }
    });

    setIsLoading(true);
    try {
      let res = await ManageSalesChannelMoto(formDataToSend);
      if (res.statusCode == 200) {
        setShowStatus(true);

        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(() => {
          setShowStatus(false);
          setStatus(false);
          setTitle("");
        }, 3000);
      } else if (res.statusCode == 500) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle("Internal Server Error");
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(res.statusCode);
      setTitle(error.response?.data?.message || "Error Creating Sales Channel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to initial state
    setFormData({
      parentSalesChannelID: 0,
      salesChannelTypeId: 0,
      reportingHierarchyID: 0,
      contactPerson: "",
      salesChannelID: 0,
      salesChannelCode: "",
      salesChannelName: "",
      mobile: "",
      email: "",
      userName: "",
      password: "",
      countryID: 0,
      stateID: 0,
      cityID: 0,
      pinCode: "",
      address1: "",
      address2: "",
      openingStockDate: "",
      saveBankingDetails: 1,
      bankName: "",
      accountHolderName: "",
      bankAccountNumber: "",
      branchLocation: "",
      ifscCode: "",
      gstNumber: "",
      panNumber: "",
      PanFilePath: null,
      GstFilePath: null,
    });

    // Clear all errors
    setErrors({});

    // Reset only state and city dropdowns since they are dependent on country/state selection
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

  if (isLoading) {
    return <AddSalesChannelSkeleton />;
  }

  return (
    <Grid container spacing={0} mb={2}>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 1000,
          paddingBottom: 1,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            lg={12}
            mt={3}
            sx={{
              ml: 1,
            }}
          >
            <BreadcrumbsHeader pageTitle="Channel" />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={0} lg={12} mt={1}>
        <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
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
                        color: PRIMARY_BLUE2,
                        fontFamily: "Manrope",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "13.66px",
                        letterSpacing: "4%",
                        mb: 1,
                      }}
                    >
                      SALES CHANNEL TYPE
                    </Typography>
                    <NuralAutocomplete
                      label="Sale Type"
                      options={salesChannelTypeDrop}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) =>
                        option.salesChannelTypeName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.salesChannelTypeID == value?.salesChannelTypeID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "salesChannelTypeId",
                          newValue?.salesChannelTypeID || null
                        );
                      }}
                      value={
                        salesChannelTypeDrop.find(
                          (option) =>
                            option.salesChannelTypeID ==
                            formData.salesChannelTypeId
                        ) || null
                      }
                      error={!!errors.salesChannelTypeId}
                      errorMessage={errors.salesChannelTypeId}
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
                      PARENT SALES CHANNEL
                    </Typography>
                    <NuralAutocomplete
                      label="Parent Sales Channel"
                      options={parentSalesChannelDrop}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.salesChannelName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.salesChannelID == value?.salesChannelID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "parentSalesChannelID",
                          newValue?.salesChannelID || null
                        );
                      }}
                      value={
                        parentSalesChannelDrop.find(
                          (option) =>
                            option.salesChannelID ==
                            formData.parentSalesChannelID
                        ) || null
                      }
                      error={!!errors.parentSalesChannelID}
                      errorMessage={errors.parentSalesChannelID}
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
                      REPORTING HIERARCHY NAME
                    </Typography>
                    <NuralAutocomplete
                      label="Reporting Hierarchy Name"
                      options={reportingHierarchyNameDrop}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.locationName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.orgnhierarchyID == value?.orgnhierarchyID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "reportingHierarchyID",
                          newValue?.orgnhierarchyID || null
                        );
                      }}
                      value={
                        reportingHierarchyNameDrop.find(
                          (option) =>
                            option.orgnhierarchyID ==
                            formData.reportingHierarchyID
                        ) || null
                      }
                      error={!!errors.reportingHierarchyID}
                      errorMessage={errors.reportingHierarchyID}
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
                      CONTACT PERSON
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("contactPerson", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
                title="Sales Channel Details"
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
                      SALES CHANNEL NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("salesChannelName", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.salesChannelName}
                      errorMessage={errors.salesChannelName}
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
                      SALES CHANNEL CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("salesChannelCode", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.salesChannelCode}
                      errorMessage={errors.salesChannelCode}
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
                      MOBILE NO.
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("mobile", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.mobile}
                      errorMessage={errors.mobile}
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
                      onChange={(e) => {
                        handleChange("email", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
                      USER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("userName", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.userName}
                      errorMessage={errors.userName}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
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
                      PASSWORD
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("password", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.password}
                      errorMessage={errors.password}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
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
                      COUNTRY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={countryDrop}
                      getOptionLabel={(option) => option.countryName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.countryID == value?.countryID
                      }
                      onChange={(event, newValue) => {
                        handleChange("countryID", newValue?.countryID || null);
                      }}
                      value={
                        countryDrop.find(
                          (option) => option.countryID == formData.countryID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.countryID}
                      errorMessage={errors.countryID}
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
                      STATE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={stateDrop}
                      getOptionLabel={(option) => option.stateName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.stateID == value?.stateID
                      }
                      onChange={(event, newValue) => {
                        handleChange("stateID", newValue?.stateID || null);
                      }}
                      value={
                        stateDrop.find(
                          (option) => option.stateID == formData.stateID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.stateID}
                      errorMessage={errors.stateID}
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
                      CITY
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      options={cityDrop}
                      getOptionLabel={(option) => option.cityName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.cityID == value?.cityID
                      }
                      onChange={(event, newValue) => {
                        handleChange("cityID", newValue?.cityID || null);
                      }}
                      value={
                        cityDrop.find(
                          (option) => option.cityID == formData.cityID
                        ) || null
                      }
                      placeholder="SELECT"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.cityID}
                      errorMessage={errors.cityID}
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
                      PIN CODE
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("pinCode", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
                      onChange={(e) => {
                        handleChange("address1", e.target.value);
                      }}
                      value={formData.address1}
                      placeholder="XXXXXXXXXXXXX"
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
                      onChange={(e) => {
                        handleChange("address2", e.target.value);
                      }}
                      value={formData.address2}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.address2}
                      errorMessage={errors.address2}
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
                      OPENING STOCK DATE
                    </Typography>
                    <NuralCalendar
                      width="87%"
                      onChange={(date) => {
                        // Format date to YYYY-MM-DD
                        const formattedDate = date
                          ? new Date(date).toISOString().split("T")[0]
                          : "";
                        handleChange("openingStockDate", formattedDate);
                      }}
                      value={formData.openingStockDate}
                      placeholder="DD/MMM/YYYY"
                      backgroundColor={LIGHT_BLUE}
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
                      onChange={(e) => {
                        handleChange("bankName", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
                      onChange={(e) => {
                        handleChange("accountHolderName", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.accountHolderName}
                      errorMessage={errors.accountHolderName}
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
                      onChange={(e) => {
                        handleChange("bankAccountNumber", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.bankAccountNumber}
                      errorMessage={errors.bankAccountNumber}
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
                      onChange={(e) => {
                        handleChange("branchLocation", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
                      onChange={(e) => {
                        handleChange("ifscCode", e.target.value);
                      }}
                      placeholder="XXXXXXXXXXXXX"
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
              <NuralKYCAccordion fields={fields} />
            </Grid>
            <Grid item md={6} lg={6} pr={2}>
              {showStatus && (
                <StatusModel
                  width="100%"
                  status={status}
                  title={title}
                  onClose={handleClearStatus}
                />
              )}
            </Grid>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={6}>
                  <NuralButton
                    text="CANCEL"
                    variant="outlined"
                    borderColor={PRIMARY_BLUE2}
                    onClick={() => {
                      handleCancel();
                      handleClearStatus();
                    }}
                    width="100%"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <NuralButton
                    text="CREATE"
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

export default AddSalesChannel;
