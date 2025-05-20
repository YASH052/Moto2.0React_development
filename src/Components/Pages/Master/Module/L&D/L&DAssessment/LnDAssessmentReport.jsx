import {
  Box,
  Checkbox,
  Grid,
  Typography,
  Switch,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../../../Common/commonstyles";
import { useNavigate } from "react-router-dom";
import BreadcrumbsHeader from "../../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../../Common/TabsBar";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  WHITE,
  LIGHT_BLUE,
  PRIMARY_BLUE,
  BLACK,
  DARK_BLUE,
} from "../../../../../Common/colors";
import {
  FormSkeleton,
  TableRowSkeleton,
} from "../../../../../Common/Skeletons";
import NuralAccordion2 from "../../../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import Required from "../../../../../Common/Required";
import StatusModel from "../../../../../Common/StatusModel";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import NuralActivityPanel from "../../../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../../../NuralCustomComponents/NuralExport";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";

// --- Dummy Data ---
const dummyTrainingCategories = [
  { id: 1, name: "Sales Training" },
  { id: 2, name: "Product Knowledge" },
  { id: 3, name: "Soft Skills" },
];

const dummyContentList = [
  { contentID: 101, contentName: "Introduction to Sales" },
  { contentID: 102, contentName: "Advanced Negotiation" },
  { contentID: 103, contentName: "CRM Usage Guide" },
];

const dummyRoleList = [
  { roleID: 1, roleName: "Admin Role" },
  { roleID: 2, roleName: "Manager Role" },
  { roleID: 3, roleName: "User Role" },
  { roleID: 4, roleName: "Viewer Role" },
  { roleID: 5, roleName: "Analyst Role" },
  { roleID: 6, roleName: "Trainer Role" },
];
// --- End Dummy Data ---

const tabs = [
  { label: "Content", value: "competiton-content" },
  { label: "Assessment", value: "lnd-assessment-report" },
];

// Helper function for label styles (similar to ManageAudit)
const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_BLUE, // Using DARK_BLUE from existing imports
  marginBottom: "5px",
  fontWeight: 400,
};

const LnDAssessmentReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lnd-assessment-report");
  // Removed unused state: page, rowsPerPage, sortConfig, filteredRows, totalRecords, tableLoading
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  // Removed unused state: errors, statusUpdateLoading, updatingRowId
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchFormLoading, setSearchFormLoading] = useState(false);
  // Removed unused state: brandLoading
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  // Removed unused state: searchParams, formData

  // State for selections using dummy data
  const [selectedTrainingCategory, setSelectedTrainingCategory] =
    useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [programmeDuration, setProgrammeDuration] = useState("");
  const [programmeDurationUnit, setProgrammeDurationUnit] = useState({ label: "MINS", value: "MINS" });

  // State for Questions & Answers
  const [questions, setQuestions] = React.useState([
    {
      id: 1,
      type: "Yes/No",
      question: "",
      description: "",
    },
  ]);

  // Use dummy data directly for lists
  const trainingCategoryList = dummyTrainingCategories;
  const contentList = dummyContentList;
  const userRoleList = dummyRoleList; // For the single select dropdown
  const roleCheckList = dummyRoleList; // For the multi-select checkboxes

  const createAccordionRef = React.useRef(null);

  const scrollToTop = (elementRef = null) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAccordionChange = (event, expanded) => {
    if (!expanded) {
      setAccordionExpanded(false);
      setSearchAccordionExpanded(false);
    } else {
      setAccordionExpanded(true);
      setSearchAccordionExpanded(false);
      if (isEditMode) {
        handleCancel(); // Reset form if switching back to create mode
      }
    }
  };

  const handleSearchAccordionChange = (event, expanded) => {
    if (!expanded) {
      setSearchAccordionExpanded(false);
      setAccordionExpanded(false);
    } else {
      setSearchAccordionExpanded(true);
      setAccordionExpanded(false);
    }
  };

  // Removed unused handleSort function

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Removed unused API fetching functions: getBrandDropdown, getCategoryList, getMappedBrandList

  const handleRoleSelection = (role) => {
    setSelectedRoles((prev) => {
      const isSelected = prev.some((r) => r.roleID === role.roleID);
      if (isSelected) {
        return prev.filter((r) => r.roleID !== role.roleID);
      } else {
        return [...prev, { roleID: role.roleID }];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRoles.length === roleCheckList.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roleCheckList.map((role) => ({ roleID: role.roleID })));
    }
  };

  // Removed unused validateForm function

  const handlePostRequest = () => {
    if (
      !selectedTrainingCategory ||
      !selectedContent ||
      !selectedUserRole ||
      selectedRoles.length === 0
    ) {
      setStatus("400");
      setTitle("Please fill all fields and select at least one role.");
      return;
    }

    console.log("Simulating Save..."); // Simplified from Save/Update
    console.log("Selected Training Category:", selectedTrainingCategory);
    console.log("Selected Content:", selectedContent);
    console.log("Selected User Role:", selectedUserRole);
    console.log("Selected Roles:", selectedRoles);

    setStatus("200");
    // Title is static now as isEditMode doesn't change form behavior meaningfully here
    setTitle("Programme Saved Successfully (Dummy)");
    handleCancel();
    setAccordionExpanded(false); // Close accordion on success
  };

  // Placeholder Edit function - not triggered by UI anymore
  const handleEdit = () => {
    console.warn(
      "handleEdit called, but no edit functionality is currently implemented."
    );
    // In a real scenario, this would likely involve setting isEditMode to true,
    // populating the form with specific data (e.g., fetched based on an ID),
    // and potentially scrolling to the form.
    // Since there's no list to select from, the previous implementation was removed.
    setIsEditMode(true); // Still set the mode if needed for other logic
    // Example: Maybe pre-fill with some default edit values if required
    // resetSelections(); // Clear previous potentially
    // setSelectedTrainingCategory(trainingCategoryList[0]);
    // ... etc ...
    setAccordionExpanded(true);
    setSearchAccordionExpanded(false);
    setTimeout(() => scrollToTop(createAccordionRef), 100);
  };

  // Removed unused handleStatus function

  const resetSelections = () => {
    setSelectedTrainingCategory(null);
    setSelectedContent(null);
    setSelectedUserRole(null);
    setSelectedRoles([]);
    setProgrammeDuration("");
    setProgrammeDurationUnit({ label: "MINS", value: "MINS" });
  };

  const handleCancel = () => {
    resetSelections();
    setIsEditMode(false); // Ensure edit mode is reset
    setStatus(null);
    setTitle("");
    // setAccordionExpanded(true); // Keep accordion open as per original behavior potentially
  };

  const handleSearch = () => {
    console.log("Simulating Search...");
    setSearchStatus("200");
    setSearchTitle("Search action triggered (Dummy - no results shown)");
  };

  const handleSearchCancel = () => {
    console.log("Simulating Search Cancel/Clear...");
    setSearchStatus(null);
    setSearchTitle("");
    // Reset any search-related state if implemented
  };

  // Removed unused handlePaginationChange function

  const handleExport = async () => {
    setIsDownloadLoading(true);
    setSearchStatus(null);
    setSearchTitle("");
    console.log("Simulating Export...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.2;
    if (success) {
      setSearchStatus("200");
      setSearchTitle("Dummy Export Generated (No actual file)");
    } else {
      setSearchStatus("500");
      setSearchTitle("Dummy Export Failed");
    }
    setIsDownloadLoading(false);
  };

  // Removed initial useEffect for data fetching

  useEffect(() => {
    if (status && title) {
      const timer = setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, title]);

  useEffect(() => {
    if (searchStatus && searchTitle) {
      const timer = setTimeout(() => {
        setSearchStatus(null);
        setSearchTitle("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchStatus, searchTitle]);

  // Function to add a new question
  const addNewQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, question: "", description: "" },
    ]);
  };

  // Function to remove a question
  const removeQuestion = (idToRemove) => {
    if (questions.length > 1) {
      // Prevent removing the last question
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== idToRemove)
      );
    }
  };

  // Function to update a specific question field
  const updateQuestionField = (id, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pl: { xs: 1, sm: 1 },
          pr: { xs: 0, sm: 0, md: "240px", lg: "270px" },
          isolation: "isolate",
        }}
      >
        {/* Header and Tabs */}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1300,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={1} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="L&D " />
          </Grid>
          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Programme Accordion */}
        <Grid item xs={12} pr={1.5} id="programme-form">
          <Grid container spacing={2} direction="column">
            <Grid item>
              <div
                ref={createAccordionRef}
                style={{ position: "relative", zIndex: 1000 }}
              >
                {formLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <NuralAccordion2
                      title={"Programme"} // Reverted to static title
                      backgroundColor={LIGHT_GRAY2}
                      expanded={accordionExpanded}
                      onChange={handleAccordionChange}
                      controlled={true}
                    >
                      <Grid container spacing={2} sx={{ width: "100%", p: 2 }}>
                        {/* Training Category Autocomplete */}
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              mb: 1,
                            }}
                          >
                            TRAINING CATEGORY *
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                            options={trainingCategoryList}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
                            getOptionLabel={(option) => option?.name || ""}
                            onChange={(event, value) => {
                              setSelectedTrainingCategory(value);
                            }}
                            value={selectedTrainingCategory}
                          />
                        </Grid>
                        {/* Content Autocomplete */}
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              mb: 1,
                            }}
                          >
                            CONTENT *
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                            options={contentList}
                            isOptionEqualToValue={(option, value) =>
                              option?.contentID === value?.contentID
                            }
                            getOptionLabel={(option) =>
                              option?.contentName || ""
                            }
                            onChange={(event, value) => {
                              setSelectedContent(value);
                            }}
                            value={selectedContent}
                          />
                        </Grid>
                        {/* Choose User Role Autocomplete */}
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: DARK_BLUE,
                              fontFamily: "Manrope",
                              fontWeight: 400,
                              fontSize: "10px",
                              mb: 1,
                            }}
                          >
                            CHOOSE USER ROLE *
                          </Typography>
                          <NuralAutocomplete
                            width="100%"
                            placeholder="SELECT"
                            backgroundColor={LIGHT_BLUE}
                            options={userRoleList}
                            isOptionEqualToValue={(option, value) =>
                              option?.roleID === value?.roleID
                            }
                            getOptionLabel={(option) => option?.roleName || ""}
                            onChange={(event, value) => {
                              setSelectedUserRole(value);
                            }}
                            value={selectedUserRole}
                          />
                        </Grid>

                        {/* Select Roles Checkboxes */}
                        <Grid item xs={12} mt={2}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: PRIMARY_BLUE2,
                                fontWeight: 700,
                                fontSize: "10px",
                                letterSpacing: "4%",
                                ml: 0,
                              }}
                            >
                              SELECT ROLES *
                            </Typography>
                            <Typography
                              variant="h6"
                              onClick={handleSelectAll}
                              sx={{
                                color: PRIMARY_BLUE2,
                                fontWeight: 700,
                                fontSize: "10px",
                                letterSpacing: "4%",
                                cursor: "pointer",
                                mr: 2,
                              }}
                            >
                              {selectedRoles.length === roleCheckList.length
                                ? "DESELECT ALL"
                                : "SELECT ALL"}
                            </Typography>
                          </Box>

                          <Grid
                            container
                            spacing={1}
                            sx={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              pr: 1,
                              mt: 1,
                            }}
                          >
                            {roleCheckList.map((role) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={role.roleID}
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Checkbox
                                  checked={selectedRoles.some(
                                    (r) => r.roleID === role.roleID
                                  )}
                                  onChange={() => handleRoleSelection(role)}
                                  sx={{ p: 0.5, mr: 0.5 }}
                                />
                                <Typography
                                  sx={{
                                    color: selectedRoles.some(
                                      (r) => r.roleID === role.roleID
                                    )
                                      ? WHITE
                                      : BLACK,
                                    backgroundColor: selectedRoles.some(
                                      (r) => r.roleID === role.roleID
                                    )
                                      ? PRIMARY_BLUE
                                      : "transparent",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    width: "100%",
                                    textAlign: "left",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {role.roleName}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ width: "100%", p: 2 }}>
                        {/* Training Category Autocomplete */}
                        <Grid item xs={12} md={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                              mb: 1,
                            }}
                          >
                            ADD PROGRAMME TITLE
                          </Typography>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs>
                              <NuralTextField
                                width="100%"
                                placeholder="ENTER PROGRAMME TITLE"
                              />
                            </Grid>
                            <Grid
                              item
                              xs="auto"
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
                              xs="auto"
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
                                  cursor: "pointer",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Combined NO OF ATTEMPTS and MINIMUM PERCENTAGE */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                              mb: 1,
                            }}
                          >
                            NO. OF ATTEMPTS
                          </Typography>
                          <NuralTextField
                            width="100%"
                            placeholder="ENTER ATTEMPTS"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                              mb: 1,
                            }}
                          >
                            MINIMUM PERCENTAGE(%)
                          </Typography>
                          <NuralTextField
                            width="100%"
                            placeholder="ENTER PERCENTAGE"
                          />
                        </Grid>

                        {/* Combined FROM DATE and TO DATE */}
                        <Grid item xs={12} md={6}>
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
                            FROM DATE
                          </Typography>
                          <NuralCalendar
                            width="100%"
                            placeholder="DD/MM/YY"
                            backgroundColor={LIGHT_BLUE}
                            name="fromDate"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                            TO DATE
                          </Typography>
                          <NuralCalendar
                            width="100%"
                            placeholder="DD/MM/YY"
                            backgroundColor={LIGHT_BLUE}
                            name="toDate"
                          />
                        </Grid>

                        {/* ADD DESCRIPTION */}
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
                          <NuralTextField
                            width="100%"
                            placeholder="ENTER DESCRIPTION"
                          />
                        </Grid>

                        {/* ADD PROGRAMME DURATION - Aligned with Dates row */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                              mb: 1,
                            }}
                          >
                            ADD PROGRAMME DURATION
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={2.5}>
                              <NuralTextField
                                width="100%"
                                placeholder="ENTER DURATION"
                                value={programmeDuration}
                                onChange={(e) => setProgrammeDuration(e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6} md={2.7}>
                              <NuralAutocomplete
                                width="100%"
                                placeholder="MINS"
                                backgroundColor={LIGHT_BLUE}
                                options={[programmeDurationUnit]}
                                value={programmeDurationUnit}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                readOnly
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </NuralAccordion2>

                    {/* Buttons and Status for Programme Accordion */}
                    
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* Questions & Answers Accordion (Simplified) */}
        <Grid item xs={12} pr={1.5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              {searchFormLoading ? (
                <FormSkeleton />
              ) : (
                <>
                  <NuralAccordion2
                    title="Questions & Answers"
                    backgroundColor={LIGHT_GRAY2}
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                  >
                    <Grid
                      container
                      spacing={2}
                      sx={{ width: "100%", minHeight: "100px", p: 2 }}
                    >
                      <Typography>
                        Questions & Answers section content goes here. (Add
                        relevant components as needed)
                      </Typography>
                      {/* TODO: Add components for displaying/managing questions and answers */}
                    </Grid>

                    {/* Buttons for Search Accordion */}
                    {searchAccordionExpanded && (
                      <Grid container spacing={1} mt={1} pr={1} pl={1}>
                        {searchStatus && (
                          <Grid item xs={12}>
                            <StatusModel
                              width="100%"
                              status={searchStatus}
                              title={searchTitle}
                              onClose={() => {
                                setSearchStatus(null);
                                setSearchTitle("");
                              }}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                          <NuralButton
                            text="Clear/Reset"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={handleSearchCancel}
                            width="100%"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <NuralButton
                            text="Search/Filter"
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handleSearch}
                            width="100%"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </NuralAccordion2>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Activity Panel */}
      <Grid
        item
        xs={12}
        sm={3}
        md={2}
        lg={2}
        mt={1}
        mr={0}
        position={"fixed"}
        right={10}
        sx={{
          zIndex: 10000,
          top: "70px",
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
          },
        }}
      >
        <NuralActivityPanel>
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2} mb={2}>
            <NuralExport
              title="Export Report"
              views={""}
              downloadExcel={handleExport}
              isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </>
  );
};

export default LnDAssessmentReport;
