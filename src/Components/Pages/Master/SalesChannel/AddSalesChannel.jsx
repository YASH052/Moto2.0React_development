import { FormHelperText, Grid, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  GetSalesChannelMasterList,
  GetSalesChannelType,
  GetStateListForDropdown,
  ManageSalesChannelMoto,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import AddSalesChannelSkeleton from "../../../Common/AddSalesChannelSkeleton";
import Required from "../../../Common/Required";
import { useSelector, useDispatch } from "react-redux";
import { setSalesChannelID } from "../../../Redux/action";

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
  const { salesChannelID } = useSelector((store) => store);
  const dispatch = useDispatch();
  console.log("salesChannelID", salesChannelID);
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Loading states for individual dropdowns
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [isReportingLoading, setIsReportingLoading] = useState(false);
  const [isStateLoading, setIsStateLoading] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);

  // Add state for accordion expansion
  const [organizationDetailsExpanded, setOrganizationDetailsExpanded] =
    useState(true);
  const [salesChannelDetailsExpanded, setSalesChannelDetailsExpanded] =
    useState(true);
  const [businessDetailsExpanded, setBusinessDetailsExpanded] = useState(true);
  const [bankingDetailsExpanded, setBankingDetailsExpanded] = useState(true);
  const [kycDetailsExpanded, setKycDetailsExpanded] = useState(true);

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
    openingStockDate: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    )
      .toISOString()
      .split("T")[0],
    saveBankingDetails: 1,
    bankName: "",
    accountHolderName: "",
    bankAccountNumber: 0,
    branchLocation: "",
    ifscCode: "",
    gstNumber: "",
    panNumber: "",
    PanFilePath: null,
    GstFilePath: null,
  });

  const [fileInputKey, setFileInputKey] = useState(0);

  const fields = [
    {
      label: "GST NO.",
      placeholder: "ENTER GST NUMBER",
      name: "gst",
      value: formData.gstNumber || "",
      onChange: (e) => handleChange("gstNumber", e.target.value),
      fileName: formData.GstFilePath ? formData.GstFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        if (!fileData) {
          handleChange("GstFilePath", null);
          setErrors((prev) => ({
            ...prev,
            gstFile: "",
          }));
          return;
        }

        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (fileData.file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            gstFile: "File size should not exceed 5MB",
          }));
          return;
        }

        // Check file type
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(fileData.file.type)) {
          setErrors((prev) => ({
            ...prev,
            gstFile: "Only JPEG, PNG, and PDF files are allowed",
          }));
          return;
        }

        handleChange("GstFilePath", fileData.path);
        handleChange("GstFilePath", fileData.file);
        setErrors((prev) => ({
          ...prev,
          gstFile: "",
        }));
      },
      accept: ".pdf,.jpg,.jpeg,.png",
      error: !!errors.gstFile,
      errorMessage: errors.gstFile,
      textFieldError: !!errors.gstNumber,
      textFieldErrorMessage: errors.gstNumber,
      key: `gst-${fileInputKey}`,
      maxLength: 20,
      onKeyPress: (e) => {
        if (e.target.value.length >= 20) {
          e.preventDefault();
        }
      },
      onPaste: (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const truncatedText = pastedText.slice(0, 20);
        e.target.value = truncatedText;
        handleChange("gstNumber", truncatedText);
      },
    },
    {
      label: "PAN NO.",
      placeholder: "ENTER PAN NUMBER",
      name: "pan",
      value: formData.panNumber || "",
      onChange: (e) => handleChange("panNumber", e.target.value),
      fileName: formData.PanFilePath ? formData.PanFilePath.name : "File Name",
      onFileSelect: (fileData) => {
        if (!fileData) {
          handleChange("PanFilePath", null);
          setErrors((prev) => ({
            ...prev,
            panFile: "",
          }));
          return;
        }

        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        if (fileData.file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            panFile: "File size should not exceed 5MB",
          }));
          return;
        }

        // Check file type
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(fileData.file.type)) {
          setErrors((prev) => ({
            ...prev,
            panFile: "Only JPEG, PNG, and PDF files are allowed",
          }));
          return;
        }

        handleChange("PanFilePath", fileData.path);
        handleChange("PanFilePath", fileData.file);
        setErrors((prev) => ({
          ...prev,
          panFile: "",
        }));
      },
      accept: ".pdf,.jpg,.jpeg,.png",
      error: !!errors.panFile,
      errorMessage: errors.panFile,
      textFieldError: !!errors.panNumber,
      textFieldErrorMessage: errors.panNumber,
      key: `pan-${fileInputKey}`,
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
    setIsStateLoading(true);
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDrop(res.stateDropdownList);
      }
    } catch (error) {
      console.error("Error in fetchStateDrop:", error);
    } finally {
      setIsStateLoading(false);
    }
  };

  const fetchCountryDrop = async () => {
    let body = {
      CountryName: "",
      CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
      pageIndex: 1 /*-1 for export to excel */,
      pageSize: 1000,
    };
    setIsLoading(true);
    try {
      let res = await Countrymasterlist(body);
      if (res.statusCode == 200) {
        setCountryDrop(res.countryMasterList);
      }
    } catch (error) {
      console.error("Error in fetchCountryDrop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCityDrop = async (value) => {
    let body = {
      searchConditions: 1, //it will be 1
      stateID: value,
      cityID: 0,
    };
    setIsCityLoading(true);
    try {
      let res = await GetCityListForDropdown(body);
      if (res.statusCode == 200) {
        setCityDrop(res.cityDropdownList);
      }
    } catch (error) {
      console.error("Error in fetchCityDrop:", error);
    } finally {
      setIsCityLoading(false);
    }
  };

  const fetchParentSalesChannelDrop = async (value) => {
    let body = {
      salesChannelID: 0,
      salesChannelTypeID: value,
      countryID: 0, // no filter
    };

    setIsParentLoading(true);
    try {
      let res = await GetParentSalesChannel(body);
      if (res.statusCode == 200) {
        setParentSalesChannelDrop(res.parentSalesChannelList);
      }
    } catch (error) {
      console.error("Error in fetchParentSalesChannelDrop:", error);
    } finally {
      setIsParentLoading(false);
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
      salesChannelTypeID: value == 14 ? value : formData.salesChannelTypeId,
      parentSalesChannelID: value == 14 ? 0 : value,
      countryID: 1,
    };
    setIsReportingLoading(true);
    try {
      let res = await GetReportingHierarchyList(body);
      if (res.statusCode == 200) {
        setReportingHierarchyNameDrop(res.reportingHierarchyList);
      }
    } catch (error) {
      console.error("Error in fetchReportingHierarchyNameDrop:", error);
    } finally {
      setIsReportingLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "salesChannelTypeId":
        return !value ? "Sales Channel Type is required" : "";
      case "parentSalesChannelID":
        // Skip validation for parent sales channel if type is Warehouse
        const selectedType = salesChannelTypeDrop.find(
          (type) => type.salesChannelTypeID === formData.salesChannelTypeId
        );
        if (selectedType?.salesChannelTypeName === "Warehouse") {
          return "";
        }
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
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (value.length > 16) return "Password must not exceed 16 characters";
        if (!/[A-Za-z]/.test(value))
          return "Password must contain at least one letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return "Password must contain at least one special character";
        return "";
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
      case "accountHolderName":
      case "bankAccountNumber":
      case "branchLocation":
      case "ifscCode":
        return ""; // No validation for bank details as they are optional
      case "panNumber":
        return ""; // No validation for PAN number as it's optional
      case "gstNumber":
        return ""; // No validation for GST number as it's optional
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
      // Find the selected type object to check its name
      const selectedType = salesChannelTypeDrop.find(
        (type) => type.salesChannelTypeID === value
      );
      const isWarehouse = selectedType?.salesChannelTypeName === "Warehouse";

      // Reset dependent fields and errors if type is Warehouse or cleared
      if (isWarehouse || !value) {
        setFormData((prev) => ({
          ...prev,
          parentSalesChannelID: 0,
          reportingHierarchyID: 0,
        }));
        setParentSalesChannelDrop([]);
        setReportingHierarchyNameDrop([]);
        setErrors((prev) => ({
          ...prev,
          parentSalesChannelID: "",
          reportingHierarchyID: "",
        }));
      } else {
        // Reset parent sales channel and reporting hierarchy when type changes
        setFormData((prev) => ({
          ...prev,
          parentSalesChannelID: 0,
          reportingHierarchyID: 0,
        }));
        setParentSalesChannelDrop([]);
        setReportingHierarchyNameDrop([]);
        setErrors((prev) => ({
          ...prev,
          parentSalesChannelID: "",
          reportingHierarchyID: "",
        }));
      }

      if (isWarehouse) {
        if (value) {
          fetchReportingHierarchyNameDrop(value);
        }
      }

      // Fetch parent channels only if it's NOT Warehouse and a value is selected
      if (!isWarehouse && value) {
        fetchParentSalesChannelDrop(value);
      }
    }

    if (field === "parentSalesChannelID") {
      if (value) {
        fetchReportingHierarchyNameDrop(value);
      } else {
        // Clear reporting hierarchy if parent is cleared
        setFormData((prev) => ({ ...prev, reportingHierarchyID: 0 }));
        setReportingHierarchyNameDrop([]);
        setErrors((prev) => ({ ...prev, reportingHierarchyID: "" }));
      }
    }
    if (field === "countryID") {
      if (value) {
        setIsStateLoading(true);
        fetchStateDrop(value);
      } else {
        // Clear state and city if country is cleared
        setFormData((prev) => ({ ...prev, stateID: 0, cityID: 0 }));
        setStateDrop([]);
        setCityDrop([]);
        setErrors((prev) => ({ ...prev, stateID: "", cityID: "" }));
      }
    }
    if (field === "stateID") {
      if (value) {
        setIsCityLoading(true);
        fetchCityDrop(value);
      } else {
        // Clear city if state is cleared
        setFormData((prev) => ({ ...prev, cityID: 0 }));
        setCityDrop([]);
        setErrors((prev) => ({ ...prev, cityID: "" }));
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

    // Debug logging
  };

  const handleClearStatus = () => {
    setShowStatus(false);
    setStatus(false);
    setTitle("");
  };

  const handlePost = async () => {
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
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
      setShowStatus(true);
      setStatus(400);
      setTitle("Please fill all mandatory fields correctly");
      setIsLoading(false);
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

    try {
      let res = await ManageSalesChannelMoto(formDataToSend);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage || "Sales Channel created successfully");

        // Clear all fields after successful save
        handleCancel();

        // Auto-hide the status model after 5 seconds
        setTimeout(() => {
          setShowStatus(false);
          setStatus(0);
          setTitle("");
        }, 5000);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode || 400);
        setTitle(res.statusMessage || "Error creating Sales Channel");
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || 500);
      setTitle(error.response?.data?.message || "Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(true);
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
      openingStockDate: new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
        .toISOString()
        .split("T")[0],
      saveBankingDetails: 1,
      bankName: "",
      accountHolderName: "",
      bankAccountNumber: 0,
      branchLocation: "",
      ifscCode: "",
      gstNumber: "",
      panNumber: "",
      PanFilePath: null,
      GstFilePath: null,
    });

    // Clear all errors
    setErrors({});

    // Reset dropdowns
    setStateDrop([]);
    setCityDrop([]);
    setParentSalesChannelDrop([]);
    setReportingHierarchyNameDrop([]);

    // Reset accordion states
    setOrganizationDetailsExpanded(true);
    setSalesChannelDetailsExpanded(true);
    setBusinessDetailsExpanded(true);
    setBankingDetailsExpanded(true);
    setKycDetailsExpanded(true);

    // Clear edit data from store
    dispatch(setSalesChannelID(0));
    setIsLoading(false);

    // Reset file input key to clear file inputs
    setFileInputKey(prev => prev + 1);
  };

  // Add function to handle last field filled
  const handleLastFieldFilled = (accordionName) => {
    switch (accordionName) {
      case "organizationDetails":
        setOrganizationDetailsExpanded(false);
        setSalesChannelDetailsExpanded(true);
        break;
      case "salesChannelDetails":
        setSalesChannelDetailsExpanded(false);
        setBusinessDetailsExpanded(true);
        break;
      case "businessDetails":
        setBusinessDetailsExpanded(false);
        setBankingDetailsExpanded(true);
        break;
      case "bankingDetails":
        setBankingDetailsExpanded(false);
        setKycDetailsExpanded(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (salesChannelID) {
        setIsEditLoading(true);
        let body = {
          salesChannelID: salesChannelID,
          salesChannelTypeID: 0,
          salesChannelName: "",
          salesChannelCode: "",
          billToRetailer: 0,
          showDetail: 0 /*1=SHOW DETAIL*/,
          searchType: 0,
          brandId: 0,
          status: 2 /*1=Active, 0=InActive, 2=ALL*/,
          bindChild: 0,
          pageIndex: 1,
          pageSize: 10,
          countryID: 1,
        };
        setIsLoading(true);
        try {
          let res = await GetSalesChannelMasterList(body);
          if (res.statusCode == 200) {
            console.log("res", res);
            let editData = res.salesChannelMasterDataList[0];
            setFormData({
              parentSalesChannelID: editData.parentID || 0,
              salesChannelTypeId: editData.salesChannelTypeID || 0,
              reportingHierarchyID: editData.orgnhierarchyID || 0,
              contactPerson: editData.contactPerson || "",
              salesChannelID: editData.salesChannelID || 0,
              salesChannelCode: editData.salesChannelCode || "",
              salesChannelName: editData.salesChannelName || "",
              mobile: editData.mobileNumber || "",
              email: editData.email || "",
              userName: editData.loginName || "",
              password: editData.password || "",
              countryID: editData.countryID || 0,
              stateID: editData.stateID || 0,
              cityID: editData.cityID || 0,
              pinCode: editData.pinCode || "",
              address1: editData.address1 || "",
              address2: editData.address2 || "",
              openingStockDate:
                editData.openingStockDate ||
                new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                  .toISOString()
                  .split("T")[0],
              saveBankingDetails: 1,
              bankName: editData.bankName || "",
              accountHolderName: editData.accountHolderName || "",
              bankAccountNumber: editData.bankAccountNumber || 0,
              branchLocation: editData.branchLocation || "",
              ifscCode: editData.ifscCode || "",
              gstNumber: editData.gstNumber || "",
              panNumber: editData.panNO || "",
              PanFilePath: null,
              GstFilePath: null,
            });

            // Fetch state dropdown when country is available
            if (editData.countryID) {
              let stateBody = {
                countryID: editData.countryID,
                regionID: 0,
                stateID: 0,
              };
              setIsStateLoading(true);
              try {
                let stateRes = await GetStateListForDropdown(stateBody);
                if (stateRes.statusCode == 200) {
                  setStateDrop(stateRes.stateDropdownList);
                }
              } catch (error) {
                console.error("Error fetching states:", error);
              } finally {
                setIsStateLoading(false);
              }

              // Fetch city dropdown when state is available
              if (editData.stateID) {
                let cityBody = {
                  searchConditions: 1,
                  stateID: editData.stateID,
                  cityID: 0,
                };
                setIsCityLoading(true);
                try {
                  let cityRes = await GetCityListForDropdown(cityBody);
                  if (cityRes.statusCode == 200) {
                    setCityDrop(cityRes.cityDropdownList);
                  }
                } catch (error) {
                  console.error("Error fetching cities:", error);
                } finally {
                  setIsCityLoading(false);
                }
              }
            }

            // Fetch parent sales channel when sales channel type is available
            if (editData.salesChannelTypeID) {
              let parentBody = {
                salesChannelID: 0,
                salesChannelTypeID: editData.salesChannelTypeID,
                countryID: 0, // no filter
              };
              setIsParentLoading(true);
              try {
                let parentRes = await GetParentSalesChannel(parentBody);
                if (parentRes.statusCode == 200) {
                  setParentSalesChannelDrop(parentRes.parentSalesChannelList);
                }
              } catch (error) {
                console.error("Error fetching parent sales channels:", error);
              } finally {
                setIsParentLoading(false);
              }
            }

            // Fetch reporting hierarchy when parent sales channel is available
            if (editData.parentID) {
              let reportingBody = {
                salesChannelTypeID: editData.salesChannelTypeID,
                parentSalesChannelID: editData.parentID,
                countryID: editData.countryID || 1,
              };
              setIsReportingLoading(true);
              try {
                let reportingRes = await GetReportingHierarchyList(
                  reportingBody
                );
                if (reportingRes.statusCode == 200) {
                  setReportingHierarchyNameDrop(
                    reportingRes.reportingHierarchyList
                  );
                }
              } catch (error) {
                console.error("Error fetching reporting hierarchy:", error);
              } finally {
                setIsReportingLoading(false);
              }
            }
          }
        } catch (error) {
          console.log("error", error);
        } finally {
          setIsLoading(false);
          setIsEditLoading(false);
        }
      }
    };

    fetchData();
  }, [salesChannelID]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Clear edit data when component unmounts or page refreshes
      dispatch(setSalesChannelID(0));
    };
  }, [dispatch]);

  if (isLoading || isEditLoading) {
    return <AddSalesChannelSkeleton title="Sales Channel Details" />;
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
            mt={2}
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
                expanded={organizationDetailsExpanded}
                onChange={(event, expanded) =>
                  setOrganizationDetailsExpanded(expanded)
                }
                controlled={true}
                onLastFieldFilled={() =>
                  handleLastFieldFilled("organizationDetails")
                }
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
                      SALES CHANNEL TYPE <Required />
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
                    {errors.salesChannelTypeId && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.salesChannelTypeId}
                      </FormHelperText>
                    )}
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
                      PARENT SALES CHANNEL <Required />
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
                      loading={isParentLoading}
                      disabled={
                        salesChannelTypeDrop.find(
                          (type) =>
                            type.salesChannelTypeID ===
                            formData.salesChannelTypeId
                        )?.salesChannelTypeName === "Warehouse"
                      }
                    />
                    {errors.parentSalesChannelID && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.parentSalesChannelID}
                      </FormHelperText>
                    )}
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
                      REPORTING HIERARCHY NAME <Required />
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
                      loading={isReportingLoading}
                    />
                    {errors.reportingHierarchyID && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.reportingHierarchyID}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={12} lg={12}>
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
                      CONTACT PERSON <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.contactPerson}
                      onChange={(e) => {
                        handleChange("contactPerson", e.target.value);
                      }}
                      placeholder="ENTER CONTACT PERSON NAME"
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
                expanded={salesChannelDetailsExpanded}
                onChange={(event, expanded) =>
                  setSalesChannelDetailsExpanded(expanded)
                }
                controlled={true}
                onLastFieldFilled={() =>
                  handleLastFieldFilled("salesChannelDetails")
                }
              >
                <Grid container spacing={2}>
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
                      SALES CHANNEL NAME <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.salesChannelName}
                      onChange={(e) => {
                        handleChange("salesChannelName", e.target.value);
                        // If sales channel code is empty, auto-fill it with the name without spaces
                        if (!formData.salesChannelName) {
                          handleChange(
                            "salesChannelName",
                            e.target.value.replace(/\s/g, "")
                          );
                        }
                      }}
                      placeholder="ENTER SALES CHANNEL NAME"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.salesChannelName}
                      errorMessage={errors.salesChannelName}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        handleChange("salesChannelName", pastedText);
                        if (!formData.salesChannelName) {
                          handleChange(
                            "salesChannelName",
                            pastedText.replace(/\s/g, "")
                          );
                        }
                      }}
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
                      SALES CHANNEL CODE <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="ENTER SALES CHANNEL CODE"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.salesChannelCode}
                      errorMessage={errors.salesChannelCode}
                      maxLength={50}
                      value={formData.salesChannelCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "");
                        handleChange("salesChannelCode", value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const valueWithoutSpaces = pastedText.replace(
                          /\s/g,
                          ""
                        );
                        e.target.value = valueWithoutSpaces;
                        handleChange("salesChannelCode", valueWithoutSpaces);
                      }}
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
                      MOBILE NO. <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.mobile}
                      onChange={(e) => {
                        // Remove any non-numeric characters
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange("mobile", numericValue);
                      }}
                      placeholder="ENTER MOBILE NUMBER"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.mobile}
                      errorMessage={errors.mobile}
                      maxLength={10}
                      onKeyPress={(e) => {
                        // Prevent non-numeric input
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                        if (e.target.value.length >= 10) {
                          e.preventDefault();
                        }
                      }}
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
                      EMAIL ID <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange("email", e.target.value);
                      }}
                      placeholder="ENTER EMAIL ID"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.email}
                      errorMessage={errors.email}
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
                      USER NAME <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        const valueWithoutSpaces = e.target.value.replace(
                          /\s/g,
                          ""
                        );
                        handleChange("userName", valueWithoutSpaces);
                      }}
                      placeholder="ENTER USERNAME"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.userName}
                      errorMessage={errors.userName}
                      value={formData.userName}
                      autoComplete="off"
                      disabled={!!salesChannelID}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const valueWithoutSpaces = pastedText.replace(
                          /\s/g,
                          ""
                        );
                        e.target.value = valueWithoutSpaces;
                        handleChange("userName", valueWithoutSpaces);
                      }}
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
                      PASSWORD <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.password}
                      onChange={(e) => {
                        const valueWithoutSpaces = e.target.value.replace(
                          /\s/g,
                          ""
                        );
                        handleChange("password", valueWithoutSpaces);
                      }}
                      placeholder="ENTER PASSWORD"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.password}
                      errorMessage={errors.password}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={!!salesChannelID}
                      helperText="Password must contain at least 8 characters, one letter, one number, and one special character"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        ),
                      }}
                      onKeyPress={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const valueWithoutSpaces = pastedText.replace(
                          /\s/g,
                          ""
                        );
                        e.target.value = valueWithoutSpaces;
                        handleChange("password", valueWithoutSpaces);
                      }}
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
                      COUNTRY <Required />
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
                    {errors.countryID && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.countryID}
                      </FormHelperText>
                    )}
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
                      STATE <Required />
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
                      loading={isStateLoading}
                    />
                    {errors.stateID && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.stateID}
                      </FormHelperText>
                    )}
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
                      CITY <Required />
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
                      loading={isCityLoading}
                    />
                    {errors.cityID && (
                      <FormHelperText error sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {errors.cityID}
                      </FormHelperText>
                    )}
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
                      PIN CODE <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      value={formData.pinCode}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange("pinCode", numericValue);
                      }}
                      placeholder="ENTER PIN CODE"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.pinCode}
                      errorMessage={errors.pinCode}
                      maxLength={6}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                        if (e.target.value.length >= 6) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const numericValue = pastedText.replace(/\D/g, "");
                        handleChange("pinCode", numericValue);
                      }}
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
                      ADDRESS LINE 1 <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("address1", e.target.value);
                      }}
                      value={formData.address1}
                      placeholder="ENTER ADDRESS LINE 1"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.address1}
                      errorMessage={errors.address1}
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
                      ADDRESS LINE 2
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("address2", e.target.value);
                      }}
                      value={formData.address2}
                      placeholder="ENTER ADDRESS LINE 2"
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
                expanded={businessDetailsExpanded}
                onChange={(event, expanded) =>
                  setBusinessDetailsExpanded(expanded)
                }
                controlled={true}
                onLastFieldFilled={() =>
                  handleLastFieldFilled("businessDetails")
                }
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={12} lg={12}>
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
                      OPENING STOCK DATE <Required />
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
                expanded={bankingDetailsExpanded}
                onChange={(event, expanded) =>
                  setBankingDetailsExpanded(expanded)
                }
                controlled={true}
                onLastFieldFilled={() =>
                  handleLastFieldFilled("bankingDetails")
                }
              >
                <Grid container spacing={2}>
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
                      NAME OF BANK
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("bankName", e.target.value);
                      }}
                      value={formData.bankName}
                      placeholder="ENTER BANK NAME"
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
                      ACCOUNT HOLDER NAME
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        // Only allow alphabets and spaces
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                        handleChange("accountHolderName", value);
                      }}
                      value={formData.accountHolderName}
                      placeholder="ENTER ACCOUNT HOLDER NAME"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.accountHolderName}
                      errorMessage={errors.accountHolderName}
                      onKeyPress={(e) => {
                        // Prevent non-alphabet keys (except space)
                        if (!/^[A-Za-z\s]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const sanitizedText = pastedText.replace(/[^A-Za-z\s]/g, '');
                        handleChange("accountHolderName", sanitizedText);
                      }}
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
                      BANK ACCOUNT NUMBER
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleChange("bankAccountNumber", numericValue);
                      }}
                      value={
                        formData.bankAccountNumber
                          ? formData.bankAccountNumber
                          : ""
                      }
                      placeholder="ENTER BANK ACCOUNT NUMBER"
                      backgroundColor={LIGHT_BLUE}
                      error={!!errors.bankAccountNumber}
                      errorMessage={errors.bankAccountNumber}
                      maxLength={50}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                        if (e.target.value.length >= 50) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData("text");
                        const numericValue = pastedText.replace(/\D/g, "");
                        handleChange("bankAccountNumber", numericValue);
                      }}
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
                      BRANCH LOCATION
                    </Typography>
                    <NuralTextField
                      width="100%"
                      onChange={(e) => {
                        handleChange("branchLocation", e.target.value);
                      }}
                      value={formData.branchLocation}
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
                      onChange={(e) => {
                        handleChange("ifscCode", e.target.value);
                      }}
                      value={formData.ifscCode}
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
              <NuralKYCAccordion
                fields={fields}
                expanded={kycDetailsExpanded}
                onChange={(event, expanded) => setKycDetailsExpanded(expanded)}
                controlled={true}
              />
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
              <Grid container spacing={1} mt={-2}>
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
                    text={salesChannelID ? "UPDATE" : "SAVE"}
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
