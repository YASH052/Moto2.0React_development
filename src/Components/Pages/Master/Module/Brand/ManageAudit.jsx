import {
  Grid,
  Typography,
  Button,
  Chip,
  Switch,
  Divider,
  FormHelperText,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  AQUA_DARK,
  DARK_PURPLE,
  ERROR_MSSG,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
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
import QuestionSettings from "./QuestionSettings";

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
import EditIcon from "@mui/icons-material/Edit";
import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import Required from "../../../../Common/Required";
import {
  GetAuditMasterList,
  GetAuditTypeDropdownList,
  ManageAuditAPI,
  UpdStatusBrandAudit,
} from "../../../../Api/Api";
import StatusModel from "../../../../Common/StatusModel";

// Placeholder for your actual API call function

const ManageAudit = () => {
  const [activeTab, setActiveTab] = React.useState("manage-audit");
  const [auditTypeDropdownList, setAuditTypeDropdownList] = React.useState([]);
  const [flag, setFlag] = useState(false);
  const [formData, setFormData] = useState({
    callType: 0,
    brandAuditId: 0,
    auditTypeID: 0,
    auditStatus: 0,
    auditQuestionList: [
      {
        brandAuditQuestionID: 0,
        questionTypeId: 1,
        question: "",
        questionDescription: "",
        uploadedMediaPath: "",
        isImgRequired: 0,
        imgCount: 1,
        isOtherOptionSelected: 0,
        otherOptionValue: "",
        mcqAnswerOption: "",
      },
    ],
  });

  // Add validation states
  const [validationErrors, setValidationErrors] = useState({
    auditTypeID: false,
    auditStatus: false,
    questions: Array(formData.auditQuestionList.length).fill(false), // Initialize with correct length
  });

  const statusOptions = [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 2 },
  ];

  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(0); // Initialize with first question open

  // Handle Accordion Expansion Change
  const handleAccordionChange = (index) => (event, isExpanded) => {
    // If there's only one question, keep it expanded
    if (formData.auditQuestionList.length === 1) {
      setExpandedAccordionIndex(0);
      return;
    }

    // For multiple questions, only allow one to be open at a time
    setExpandedAccordionIndex(isExpanded ? index : null);
  };

  // Add useEffect to handle the default state when question count changes
  useEffect(() => {
    // If there's only one question, keep it expanded
    if (formData.auditQuestionList.length === 1) {
      setExpandedAccordionIndex(0);
    } else if (formData.auditQuestionList.length > 1) {
      // If we have multiple questions, close all by default
      setExpandedAccordionIndex(null);
    }
  }, [formData.auditQuestionList.length]);

  const addNewQuestion = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      auditQuestionList: [
        ...prevFormData.auditQuestionList,
        {
          brandAuditQuestionID: 0,
          questionTypeId: 1, // Default to Yes/No
          question: "",
          questionDescription: "",
          uploadedMediaPath: "",
          isImgRequired: 0,
          imgCount: 0,
          isOtherOptionSelected: 0,
          otherOptionValue: "",
          mcqAnswerOption: "",
        },
      ],
    }));
    // Update validation errors array to include the new question
    setValidationErrors((prev) => ({
      ...prev,
      questions: [...prev.questions, false], // Add false for the new question
    }));
    // Close all accordions when adding a new question
    setExpandedAccordionIndex(null);
  };

  const removeQuestion = (indexToRemove) => {
    // Only remove if there's more than one question
    if (formData.auditQuestionList.length > 1) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        auditQuestionList: prevFormData.auditQuestionList.filter(
          (_, index) => index !== indexToRemove
        ),
      }));

      // Update validation errors array to remove the corresponding error
      setValidationErrors((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== indexToRemove),
      }));

      // If we're removing the currently expanded question, close it
      if (expandedAccordionIndex === indexToRemove) {
        setExpandedAccordionIndex(null);
      }
      // If we're removing a question before the expanded one, adjust the index
      else if (expandedAccordionIndex > indexToRemove) {
        setExpandedAccordionIndex(expandedAccordionIndex - 1);
      }
    }
  };

  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-planogram" },
    { label: "Manage Audit", value: "manage-audit" },
    { label: "L1L2 Issue", value: "l1l2-issue" },
    { label: "RI Weightage", value: "ri-weightage" },
  ]);

  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Update initial states
  const [page, setPage] = useState(1); // Start from page 1
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ message: null, type: null }); // type: 'success' or 'error'
  const [auditMasterList, setAuditMasterList] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState({ message: null, type: null }); // type: 'success' or 'error'
  const [title, setTitle] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [detailLoading, setDetailLoading] = useState(false); // Loading state for fetching details

  // Add new states for table status
  const [showTableStatus, setShowTableStatus] = useState(false);
  const [tableStatus, setTableStatus] = useState({ message: null, type: null });
  const [tableTitle, setTableTitle] = useState(null);

  const [searchParams, setSearchParams] = useState({
    callType: 0,
    auditTypeId: 0,
    auditStatus: 101,
    questionTypeID: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  // Update fetchAuditMasterList
  const fetchAuditMasterList = async () => {
    try {
      setAuditMasterList([]); // Clear existing data before fetching
      const res = await GetAuditMasterList({
        ...searchParams,
        pageIndex: page,
        pageSize: rowsPerPage,
      });
      if (res.statusCode == 200) {
        setAuditMasterList(res.brandAuditList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setTableStatus(true);
        setTableStatus(res.statusCode);
        setTableTitle(res.statusMessage);
        setAuditMasterList([]);
        setTotalRecords(res.totalRecords);
      }
    } catch (error) {
      setTableStatus(true);
      setTableStatus(error.statusCode || 500);
      setTableTitle(error.statusMessage || "Internal Server Error");
      setAuditMasterList([]);
      setTotalRecords(0);
      console.error("Error in fetchAuditMasterList:", error);
    }
  };

  const fetchAuditTypeDropdownList = async () => {
    try {
      const res = await GetAuditTypeDropdownList();
      if (res.statusCode == 200) {
        setAuditTypeDropdownList(res.auditTypeList);
      } else {
        setAuditTypeDropdownList([]);
      }
    } catch (error) {
      setAuditTypeDropdownList([]);
      console.error("Error in fetchAuditTypeDropdownList:", error);
    }
  };
  // Column definitions for the table header

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

  // Update pagination handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Convert to 1-based page number
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page
  };

  const handleJumpToPage = (pageNumber) => {
    const maxPage = Math.ceil(totalRecords / rowsPerPage);
    if (pageNumber >= 1 && pageNumber <= maxPage) {
      setPage(pageNumber);
    }
  };

  // Add useEffect to fetch data when page, rowsPerPage, or searchParams change
  useEffect(() => {
    fetchAuditMasterList();
  }, [page, rowsPerPage, flag]);

  useEffect(() => {
    fetchAuditTypeDropdownList();
  }, []);

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

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Reset validation error when field is changed
    if (field === "auditTypeID" || field === "auditStatus") {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Update cancel handler
  const handleCancel = () => {
    setFormData({
      callType: 0,
      brandAuditId: 0,
      auditTypeID: 0,
      auditStatus: 0,
      auditQuestionList: [
        {
          brandAuditQuestionID: 0,
          questionTypeId: 1,
          question: "",
          questionDescription: "",
          uploadedMediaPath: "",
          isImgRequired: 0,
          imgCount: 1,
          isOtherOptionSelected: 0,
          otherOptionValue: "",
          mcqAnswerOption: "",
        },
      ],
    });
    setValidationErrors({
      auditTypeID: false,
      auditStatus: false,
      questions: Array(formData.auditQuestionList.length).fill(false),
    });
    setShowStatus(false);
    setStatus(0);
    setTitle("");
    setError({});
    setIsEditing(false); // Reset editing mode
    // Clear existing data
    setFlag(!flag);
  };

  // Update search/filter functionality
  const handleSearch = () => {
    setFlag(!flag);
    setPage(1); // Reset to first page when searching
    // Clear existing data
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

  const handleEdit = async (row) => {
    console.log("Edit row:", row);
    const editData = row;

    setFormData({
      callType: 1,
      brandAuditId: editData.brandAuditId,
      auditTypeID: editData.brandAuditTypeId,
      auditStatus: editData.status,
      auditQuestionList: editData.auditQuestionList,
    });

    setShowStatus(false); // Hide previous status messages
  };

  // Update the question text for a specific question index
  const handleQuestionTextChange = (index, value) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      updatedList[index] = { ...updatedList[index], question: value };
      return { ...prevFormData, auditQuestionList: updatedList };
    });

    // Reset validation error for this question when it's changed
    setValidationErrors((prev) => ({
      ...prev,
      questions: prev.questions.map((error, i) =>
        i === index ? !value.trim() : error
      ),
    }));
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [field]: value,
    }));
    // Clear existing data when search params change
  };

  // Update the question description for a specific question index
  const handleQuestionDescriptionChange = (index, value) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      updatedList[index] = {
        ...updatedList[index],
        questionDescription: value,
      };
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  const resetStatus = () => {
    setShowStatus(false);
    setStatus(0);
    setTitle("");
  };
  const handleSave = async () => {
    console.log("handleSave", formData);
    setSaveLoading(true);
    setSaveStatus({ message: null, type: null });

    // Validate form data
    if (!formData.auditTypeID) {
      setValidationErrors((prev) => ({ ...prev, auditTypeID: true }));
    }

    if (!formData.auditStatus) {
      setValidationErrors((prev) => ({ ...prev, auditStatus: true }));
    }

    // Validate questions
    const questionErrors = formData.auditQuestionList.map(
      (question) => !question.question.trim()
    );
    const hasEmptyQuestions = questionErrors.some((error) => error);

    if (hasEmptyQuestions) {
      setValidationErrors((prev) => ({ ...prev, questions: questionErrors }));

      return;
    }

    // Reset validation errors if all validations pass
    setValidationErrors({
      auditTypeID: false,
      auditStatus: false,
      questions: Array(formData.auditQuestionList.length).fill(false),
    });

    try {
      // Prepare the payload
      const payload = {
        ...formData,
        auditTypeID: formData.auditTypeID || 0,
        callType: formData.callType, // Use callType from state (0 for save, 1 for update)
        brandAuditId: formData.brandAuditId, // Use brandAuditId from state (0 for save, >0 for update)
        auditStatus: formData.auditStatus || 1, // Default to active if not set
        auditQuestionList: formData.auditQuestionList.map((question) => ({
          ...question,
          // Use existing ID for updates, 0 for new questions
          brandAuditQuestionID: question.brandAuditQuestionID || 0,
          question: question.question.trim(),
          questionDescription: question.questionDescription?.trim() || "",
          uploadedMediaPath: question.uploadedMediaPath || "",
          isImgRequired: question.isImgRequired || 0,
          imgCount: question.imgCount || 0, // Assuming imgCount handling is correct elsewhere
          isOtherOptionSelected: question.isOtherOptionSelected || 0,
          otherOptionValue: question.otherOptionValue || "",
          mcqAnswerOption: question.mcqAnswerOption || "",
        })),
      };

      // Call the API
      console.log("payload", payload);
      const res = await ManageAuditAPI(payload);

      if (res.statusCode == 200) {
        setShowStatus(true);
        setTitle(res.statusMessage);
        setStatus(res.statusCode);
        setTimeout(() => {
          resetStatus();
        }, 5000);

        // Reset form
        setFormData({
          callType: 0,
          brandAuditId: 0,
          auditTypeID: 0,
          auditStatus: 0,
          auditQuestionList: [
            {
              brandAuditQuestionID: 0,
              questionTypeId: 1,
              question: "",
              questionDescription: "",
              uploadedMediaPath: "",
              isImgRequired: 0,
              imgCount: 0,
              isOtherOptionSelected: 0,
              otherOptionValue: "",
              mcqAnswerOption: "",
            },
          ],
        });
        setFlag(!flag);

        // Refresh the list if needed
        // You can add a function to refresh the audit list here
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      console.error("Error saving audit:", error);
      setShowStatus(true);
      setStatus(error.statusCode);
      setTitle(error.statusMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  // Update the question type for a specific question index
  const handleQuestionTypeChange = (index, value) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      updatedList[index] = { ...updatedList[index], questionTypeId: value };
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  // Toggle Image Required status
  const handleToggleImageRequired = (index, isChecked) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      updatedList[index] = {
        ...updatedList[index],
        isImgRequired: isChecked ? 1 : 0,
      };
      // Reset count to 1 if toggled on, or handle as needed
      if (isChecked && updatedList[index].imgCount < 1) {
        updatedList[index].imgCount = 1;
      }
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  // Change Image Count
  const handleImageCountChange = (index, newCount) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      // Ensure count doesn't go below 1 if image is required
      const finalCount = Math.max(1, newCount);
      updatedList[index] = { ...updatedList[index], imgCount: finalCount };
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  // Toggle Other Option Selected status
  const handleToggleOtherOption = (index, isChecked) => {
    setFormData((prevFormData) => {
      const updatedList = [...prevFormData.auditQuestionList];
      updatedList[index] = {
        ...updatedList[index],
        isOtherOptionSelected: isChecked ? 1 : 0,
      };
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  // Duplicate Question
  const handleDuplicateQuestion = (indexToDuplicate) => {
    setFormData((prevFormData) => {
      const questionToDuplicate =
        prevFormData.auditQuestionList[indexToDuplicate];
      const newQuestion = {
        ...questionToDuplicate,
        brandAuditQuestionID: 0, // Reset ID for new question
        // tempId: Date.now() // Add a new temporary unique ID if needed for keys
      };
      const updatedList = [
        ...prevFormData.auditQuestionList.slice(0, indexToDuplicate + 1),
        newQuestion,
        ...prevFormData.auditQuestionList.slice(indexToDuplicate + 1),
      ];
      return { ...prevFormData, auditQuestionList: updatedList };
    });
  };

  const handleSearchCancel = () => {
    setSearchParams({
      callType: 0,
      auditTypeId: 0,
      auditStatus: 0,
      questionTypeID: 0,
      pageIndex: 1,
      pageSize: 10,
    });
    setPage(1);
    setFlag(!flag);
  };

  const handleStatusChange = async (brandAuditId, status) => {
    console.log("brandAuditId", brandAuditId);
    const payload = {
      brandAuditId: brandAuditId, // 0 while saving
      auditStatus: status === 1 ? 0 : 1,
    };

    try {
      let res = await UpdStatusBrandAudit(payload);
      if (res.statusCode == 200) {
        setShowTableStatus(true);
        setTableTitle(res.statusMessage);
        setTableStatus(res.statusCode);
        setTimeout(() => {
          resetTableStatus();
        }, 3000);
        setFlag(!flag);
      } else {
        setShowTableStatus(true);
        setTableStatus(res.statusCode);
        setTableTitle(res.statusMessage);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setShowTableStatus(true);
      setTableStatus(error.statusCode);
      setTableTitle(error.statusMessage);
    }
  };

  // Add new reset function for table status
  const resetTableStatus = () => {
    setShowTableStatus(false);
    setTableStatus(0);
    setTableTitle("");
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
          <Grid item xs={12} mt={0} mb={0} ml={0}>
            <BreadcrumbsHeader pageTitle="Brand" />
          </Grid>

          <Grid item xs={12} ml={0}>
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
                        AUDIT TYPE <Required />
                      </Typography>
                      <NuralAutocomplete
                        label="Audit Type"
                        options={auditTypeDropdownList}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.auditType || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.auditTypeID === value?.auditTypeID
                        }
                        onChange={(event, newValue) => {
                          handleChange(
                            "auditTypeID",
                            newValue?.auditTypeID || 0
                          );
                        }}
                        value={
                          auditTypeDropdownList.find(
                            (option) =>
                              option.auditTypeID === formData.auditTypeID
                          ) || null
                        }
                        error={validationErrors.auditTypeID}
                      />
                      {validationErrors.auditTypeID && (
                        <FormHelperText
                          color="error"
                          sx={{ fontSize: "12px", color: ERROR_MSSG }}
                        >
                          {validationErrors.auditTypeID
                            ? "Audit Type is required"
                            : ""}
                        </FormHelperText>
                      )}
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
                        STATUS <Required />
                      </Typography>
                      <NuralAutocomplete
                        width="100%"
                        options={statusOptions}
                        placeholder="SELECT"
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        onChange={(event, newValue) => {
                          handleChange("auditStatus", newValue?.value ?? null);
                        }}
                        value={
                          statusOptions.find(
                            (option) => option.value === formData.auditStatus
                          ) || null
                        }
                        error={validationErrors.auditStatus}
                      />
                      {validationErrors.auditStatus && (
                        <FormHelperText
                          color="error"
                          sx={{ fontSize: "12px", color: ERROR_MSSG }}
                        >
                          Status is required
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                {formData.auditTypeID !== 1 && ( // Assuming 1 is Demo Audit type ID
                  <Grid mt={2}>
                    <NuralAccordion2
                      expandedBackgroundColor={LIGHT_GRAY2}
                      expandedFontColor={DARK_PURPLE}
                      title="Question & Answer"
                      backgroundColor={LIGHT_GRAY2}
                    >
                      {formData.auditQuestionList.map((question, index) => (
                        <React.Fragment key={index}>
                          <NuralAccordion2
                            key={index}
                            title={`Q${index + 1}- ${
                              question.questionTypeId === 1
                                ? "Yes/No"
                                : "Other Type"
                            }`}
                            expanded={expandedAccordionIndex === index}
                            onChange={handleAccordionChange(index)}
                            backgroundColor={LIGHT_GRAY2}
                            expandedBackgroundColor={LIGHT_GRAY2}
                            expandedFontColor={DARK_PURPLE}
                          >
                            <Grid container spacing={2} mb={2}>
                              <Grid item xs={12} md={12}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
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
                                    <Grid
                                      container
                                      alignItems="center"
                                      spacing={0}
                                    >
                                      <Grid item xs={10}>
                                        <NuralTextField
                                          width="100%"
                                          placeholder="ENTER QUESTION"
                                          value={question.question}
                                          onChange={(e) =>
                                            handleQuestionTextChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          error={
                                            validationErrors.questions[index]
                                          }
                                          errorMessage={
                                            validationErrors.questions[index]
                                              ? "Question is required"
                                              : ""
                                          }
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
                                        <span
                                          style={{
                                            fontFamily: "Manrope",
                                            fontWeight: 700,
                                            fontSize: "10px",
                                            color: PRIMARY_BLUE2,
                                          }}
                                        >
                                          Upload Media
                                        </span>
                                        &nbsp;
                                        <img
                                          src="./Icons/uploadicon.svg"
                                          alt="upload"
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
                                          src="./Icons/crossicon.svg"
                                          alt="remove"
                                          style={{
                                            cursor:
                                              formData.auditQuestionList
                                                .length > 1
                                                ? "pointer"
                                                : "not-allowed",
                                            opacity:
                                              formData.auditQuestionList
                                                .length > 1
                                                ? 1
                                                : 0.5,
                                          }}
                                          onClick={() => removeQuestion(index)}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>

                                  <Grid item xs={12}>
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
                                    <Grid
                                      container
                                      alignItems="center"
                                      spacing={0}
                                    >
                                      <Grid item xs={11.5}>
                                        <NuralTextField
                                          width="100%"
                                          placeholder="ENTER QUESTION"
                                          value={question.questionDescription}
                                          onChange={(e) =>
                                            handleQuestionDescriptionChange(
                                              index,
                                              e.target.value
                                            )
                                          }
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
                                          src="./Icons/crossicon.svg"
                                          alt="remove"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleQuestionDescriptionChange(
                                              index,
                                              ""
                                            )
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </NuralAccordion2>
                          {/* Add Divider after each question */}
                          <Divider
                            sx={{ my: 2, backgroundColor: DARK_PURPLE }}
                          />
                        </React.Fragment>
                      ))}
                      {/* Remove the existing Divider here as it's now added within the loop */}
                      {/* <Divider
                        style={{
                          backgroundColor: DARK_PURPLE,
                          height: "1px",
                        }}
                      /> */}
                      {/* Add Save Button */}
                      <Grid container justifyContent="flex-end" mt={2} mb={2}>
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            width="100%"
                            height="48px"
                            onClick={handleCancel}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <NuralButton
                            text={isEditing ? "UPDATE AUDIT" : "SAVE AUDIT"}
                            variant="contained"
                            backgroundColor={PRIMARY_BLUE2}
                            color="#fff"
                            width="100%"
                            height="48px"
                            onClick={handleSave}
                            disabled={saveLoading || detailLoading}
                          />
                        </Grid>
                      </Grid>
                      {/* Display Status Message (Integrate with your statusModel) */}
                      {saveStatus.message && (
                        <Typography
                          color={saveStatus.type === "error" ? "red" : "green"}
                          mt={1}
                          textAlign="center"
                        >
                          {saveStatus.message}
                        </Typography>
                      )}
                    </NuralAccordion2>
                  </Grid>
                )}
                <Grid item xs={12} mt={2} pr={2} mb={2}>
                  {showStatus && (
                    <StatusModel width="100%" status={status} title={title} />
                  )}
                </Grid>
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

                <NuralAccordion2 title="View" backgroundColor={LIGHT_GRAY2}>
                  <Typography variant="h6" sx={titleStyle}>
                    Search
                  </Typography>
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
                        options={auditTypeDropdownList}
                        getOptionLabel={(option) => option.auditType || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.auditTypeID === value?.auditTypeID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "auditTypeId",
                            newValue?.auditTypeID || 0
                          );
                        }}
                        value={
                          auditTypeDropdownList.find(
                            (option) =>
                              option.auditTypeID === searchParams.auditTypeId
                          ) || null
                        }
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
                        options={statusOptions}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "auditStatus",
                            newValue?.value ?? 0
                          );
                        }}
                        value={
                          statusOptions.find(
                            (option) =>
                              option.value === searchParams.auditStatus
                          ) || null
                        }
                        placeholder="SELECT"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
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
                        onClick={handleSearchCancel}
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
                        onClick={handleSearch}
                      >
                        SEARCH
                      </NuralTextButton>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} pr={4} mb={2}>
            {showTableStatus && (
              <StatusModel
                width="100%"
                status={tableStatus}
                title={tableTitle}
              />
            )}
          </Grid>
          <Grid item xs={11.5} mt={-2} ml={2} >
            {auditMasterList.length === 0 ? (
              <StatusModel
                width="100%"
                status={404}
                title="No data available"
              />
            ) 
            
            : (
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
                    {auditMasterList.map((row) => (
                      <TableRow key={row.brandAuditId}>
                        <TableCell sx={{ ...rowstyle }}>{row.sNo}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.brandAuditType}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {row.creationDate}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={row.status == 1}
                            onChange={() =>
                              handleStatusChange(row.brandAuditId, row.status)
                            }
                            sx={{
                              ...toggleSectionStyle,
                              "& .MuiSwitch-thumb": {
                                backgroundColor:
                                  row.status == 1
                                    ? PRIMARY_BLUE2
                                    : PRIMARY_BLUE,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            disabled={detailLoading}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
          {/* Always render Question Settings */}
          {(() => {
            // Determine which question index to show settings for
            let settingsIndex = 0; // Default to the first question
            if (expandedAccordionIndex !== null) {
              settingsIndex = expandedAccordionIndex;
            }

            // Handle case where there are no questions
            if (formData.auditQuestionList.length === 0) {
              return (
                <Grid item xs={12} mt={2} sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ color: PRIMARY_BLUE2, fontStyle: "italic" }}
                  >
                    No questions added yet. Add a question to configure
                    settings.
                  </Typography>
                </Grid>
              );
            }

            // Ensure the settingsIndex is valid (should not happen if logic is correct, but good practice)
            if (settingsIndex >= formData.auditQuestionList.length) {
              settingsIndex = 0; // Fallback to first question if index is out of bounds
            }

            const questionToShow = formData.auditQuestionList[settingsIndex];

            // Safety check in case questionToShow is somehow undefined
            if (!questionToShow) {
              return (
                <Grid item xs={12} mt={2} sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ color: PRIMARY_BLUE2, fontStyle: "italic" }}
                  >
                    Error loading question settings.
                  </Typography>
                </Grid>
              );
            }

            // Render the QuestionSettings component
            return (
              <Grid item xs={12} mt={2}>
                <QuestionSettings
                  question={questionToShow}
                  index={settingsIndex}
                  onTypeChange={handleQuestionTypeChange}
                  onDuplicate={handleDuplicateQuestion}
                  onDelete={removeQuestion}
                  onToggleImageRequired={handleToggleImageRequired}
                  onImageCountChange={handleImageCountChange}
                  onToggleOtherOption={handleToggleOtherOption}
                  totalQuestions={formData.auditQuestionList.length}
                />
              </Grid>
            );
          })()}

          {/* Keep other panels if needed */}

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
      {/* Update the table status model */}
    </>
  );
};

export default ManageAudit;
