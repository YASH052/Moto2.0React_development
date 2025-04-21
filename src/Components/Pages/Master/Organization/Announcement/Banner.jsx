import {
  Grid,
  Typography,
  Button,
  Switch,
  Box,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import VisibilityIcon from "@mui/icons-material/Visibility";

import NuralAccordion2 from "../../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  BLUE_COLOR,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../../Common/colors";
import NuralAutocomplete from "../../../NuralCustomComponents/NuralAutocomplete";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  tablePaginationStyle,
  toggleSectionStyle,
} from "../../../../Common/commonstyles";
import NuralTextField from "../../../NuralCustomComponents/NuralTextField";
import { useNavigate } from "react-router-dom";
import SelectionPanel from "../../../NuralCustomComponents/SelectionPanel";
import NuralReports from "../../../NuralCustomComponents/NuralReports";
import NuralExport from "../../../NuralCustomComponents/NuralExport";
import NuralActivityPanel from "../../../NuralCustomComponents/NuralActivityPanel";
import { styled } from "@mui/material/styles";
import Required from "../../../../Common/Required";
import {
  SaveImages,
  SaveBannerCMS,
  GetBannerCMSDetailList,
  UpdateStatusBannerCMS,
} from "../../../../Api/Api";
import StatusModel from "../../../../Common/StatusModel";
import { FormSkeleton, TableRowSkeleton } from "../../../../Common/Skeletons";

const FileItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    // backgroundColor: "rgba(235, 238, 245, 0.8)",
  },
});

const FileContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const FileIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(198, 206, 237, 0.5)",
  borderRadius: "4px",
  width: "24px",
  height: "24px",
  "& svg": {
    width: "20px",
    height: "20px",
    color: DARK_PURPLE,
  },
});

const HiddenInput = styled("input")({
  display: "none",
});
const Banner = () => {
  // Form states
  const [activeTab, setActiveTab] = React.useState("banner");
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  // Table states
  const [tableData, setTableData] = React.useState([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableLoading, setTableLoading] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [title, setTitle] = React.useState(null);
  const [bannerTitleDrop, setBannerTitleDrop] = React.useState([]);
  const [errors, setErrors] = React.useState({
    bannerType: "",
    bannerTitle: "",
    bannerText: "",
    bannerPath: "",
  });
  const [formData, setFormData] = React.useState({
    bannerType: "",
    bannerTitle: "",
    bannerPath: "",
    bannerText: "",
    status: 1,
  });
  const [searchParams, setSearchParams] = useState({
    bannerType: "",
    BannerTitle: "",
    pageIndex: 1,
    pageSize: 10,
  });
  const [flag, setFlag] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [selectedType, setSelectedType] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState({
    status: null,
    title: null,
  });

  const [tableStatus, setTableStatus] = React.useState({
    show: false,
    status: null,
    title: null,
  });
  const [selectedBannerTitle, setSelectedBannerTitle] = React.useState(null);
  const [jumpToPageInput, setJumpToPageInput] = React.useState("");
  const [jumpToPageError, setJumpToPageError] = React.useState("");
  const [searchType, setSearchType] = React.useState(null);
  const [createType, setCreateType] = React.useState(null);
  const [searchBannerTitleDrop, setSearchBannerTitleDrop] = React.useState([]);
  const [createBannerTitleDrop, setCreateBannerTitleDrop] = React.useState([]);

  // New states for accordion management
  const [createAccordionExpanded, setCreateAccordionExpanded] =
    React.useState(true);
  const [searchAccordionExpanded, setSearchAccordionExpanded] =
    React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const [showCreateButtons, setShowCreateButtons] = React.useState(true);

  const [openFormatDialog, setOpenFormatDialog] = React.useState(false);
  const [selectedSample, setSelectedSample] = React.useState(null);
  const [formatTab, setFormatTab] = React.useState(0);
  const [formatOptions, setFormatOptions] = React.useState({
    backgroundColor: "#FFFFFF",
    fontColor: "#000000",
    fontSize: 14,
    fontFamily: "Arial",
    fontWeight: "normal",
    textAlign: "center",
  });

  const [selectedSampleIndex, setSelectedSampleIndex] = React.useState(null);
  const [sampleStyles, setSampleStyles] = React.useState([
    { backgroundColor: MEDIUM_BLUE, fontColor: BLUE_COLOR },
    { backgroundColor: MEDIUM_BLUE, fontColor: BLUE_COLOR },
    { backgroundColor: MEDIUM_BLUE, fontColor: BLUE_COLOR },
    { backgroundColor: MEDIUM_BLUE, fontColor: BLUE_COLOR },
  ]);

  const tabs = [
    { label: "Banner", value: "banner" },
    { label: "Tab", value: "#" },
  ];
  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: PRIMARY_BLUE2,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    {
      value: 0,
      title: "TEXT",
    },
    {
      value: 1,
      title: "IMAGE",
    },
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const fetchBannerTableList = async () => {
    setTableLoading(true);
    let body = {
      bannerType: searchParams.bannerType || "",
      BannerTitle: searchParams.BannerTitle || "",
      pageIndex: page,
      pageSize: rowsPerPage,
    };
    try {
      let res = await GetBannerCMSDetailList(body);
      if (res.statusCode === "200") {
        setTableData(res.bannerCMSDetailsList || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setTableData([]);
        setTableStatus({
          show: true,
          status: res.statusCode,
          title: res.statusMessage,
        });
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching banner list:", error);
      setTableData([]);
      setTableStatus({
        show: true,
        status: "500",
        title: "Failed to fetch banner list",
      });
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerTableList();
  }, [flag]);

  const fetchBannerTypeDrop = async (value, isSearch = false) => {
    let body = {
      bannerType: value,
      BannerTitle: "",
      pageIndex: 1,
      pageSize: 100,
    };
    try {
      let res = await GetBannerCMSDetailList(body);
      if (res.statusCode == "200") {
        if (isSearch) {
          setSearchBannerTitleDrop(res.bannerCMSDetailsList);
        } else {
          setCreateBannerTitleDrop(res.bannerCMSDetailsList);
        }
      } else {
        if (isSearch) {
          setSearchBannerTitleDrop([]);
        } else {
          setCreateBannerTitleDrop([]);
        }
      }
    } catch (error) {
      console.error("Error fetching banner list:", error);
      if (isSearch) {
        setSearchBannerTitleDrop([]);
      } else {
        setCreateBannerTitleDrop([]);
      }
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    setFlag(!flag);
  };

  const handleSort = (columnName) => {
    let direction = "asc";
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig({ key: null, direction: null });
        setTableData([...tableData]);
        return;
      }
    }
    setSortConfig({ key: columnName, direction });

    const sortedData = [...tableData].sort((a, b) => {
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

    setTableData(sortedData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is changed
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      bannerType: !formData.bannerType ? "Type is required" : "",
      bannerTitle: !formData.bannerTitle
        ? "Banner title is required"
        : formData.bannerTitle.length > 50
        ? "Maximum 50 characters allowed"
        : "",
      bannerText:
        selectedType === "TEXT" && !formData.bannerText
          ? "Text is required"
          : selectedType === "TEXT" && formData.bannerText.length > 50
          ? "Maximum 50 characters allowed"
          : "",
      bannerPath:
        selectedType === "IMAGE" && !formData.bannerPath
          ? "Please upload an image"
          : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          bannerPath: "Please upload a valid image (JPEG, PNG, GIF)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          bannerPath: "File size should be less than 5MB",
        }));
        return;
      }

      setSelectedFile(file);
      setIsLoading(true);
      setErrors((prev) => ({ ...prev, bannerPath: "" }));

      try {
        const formData = new FormData();
        formData.append("UploadedFile", file);

        const response = await SaveImages(formData);
        if (response.statusCode === "200") {
          setFormData((prev) => ({
            ...prev,
            bannerPath: response.imageUploadPath,
          }));
          setShowStatus(true);
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
        } else {
          setShowStatus(true);
          setStatus(response.statusCode);
          setTitle(response.statusMessage);
        }
      } catch (error) {
        setShowStatus(true);
        setStatus(error.response?.statusCode || "500");
        setTitle(error.response?.statusMessage || "Failed to upload image");
        console.error("Upload error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePost = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await SaveBannerCMS(formData);
      if (response.statusCode == "200") {
        // Reset form after successful save
        setFormData({
          bannerType: "",
          bannerTitle: "",
          bannerPath: "",
          bannerText: "",
          status: 1,
        });
        setSelectedFile(null);
        setShowStatus(true);
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
        setFlag(!flag);
        setTimeout(() => {
          setShowStatus(false);
        }, 3000);
      } else {
        setShowStatus(true);
        setStatus(response.statusCode);
        setTitle(response.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.response?.statusCode || "500");
      setTitle(error.response?.statusMessage || "Failed to save banner");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      bannerType: "",
      bannerTitle: "",
      bannerPath: "",
      bannerText: "",
    });
    setSelectedFile(null);
    setSelectedType(null);
    setErrors({});
    setCreateType(null);
  };

  const handleStatusChange = async (bannerId, newStatus) => {
    let body = {
      BannerId: bannerId,
      Status: newStatus,
    };
    try {
      const response = await UpdateStatusBannerCMS(body);
      if (response.statusCode === "200") {
        setTableData((prevData) =>
          prevData.map((item) =>
            item.bannerId === bannerId ? { ...item, status: newStatus } : item
          )
        );
        setTableStatus({
          show: true,
          status: response.statusCode,
          title: response.statusMessage,
        });
        setTimeout(() => {
          setTableStatus((prev) => ({ ...prev, show: false }));
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setTableStatus({
        show: true,
        status: "500",
        title: "Failed to update status",
      });
      setTimeout(() => {
        setTableStatus((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleJumpToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(totalRecords / rowsPerPage)
    ) {
      setPage(pageNumber);
      setFlag(!flag);
    }
  };

  const handleJumpToPageInput = (e) => {
    const value = e.target.value;
    setJumpToPageInput(value);
    setJumpToPageError("");
  };

  const handleJumpToPageSubmit = () => {
    if (!jumpToPageInput) {
      setJumpToPageError("Please enter a page number");
      return;
    }

    const pageNumber = parseInt(jumpToPageInput, 10);
    if (isNaN(pageNumber)) {
      setJumpToPageError("Please enter a valid number");
      return;
    }

    if (pageNumber < 1 || pageNumber > Math.ceil(totalRecords / rowsPerPage)) {
      setJumpToPageError(
        `Page number must be between 1 and ${Math.ceil(
          totalRecords / rowsPerPage
        )}`
      );
      return;
    }

    handleJumpToPage(pageNumber);
    setJumpToPageInput("");
  };

  const handleSearch = () => {
    setPage(1);
    setJumpToPageInput("");
    setJumpToPageError("");
    setFlag(!flag);
  };

  const handleSearchChange = (field, value) => {
    if (field === "bannerType") {
      setSearchType(value?.title || null);
      if (value) {
        fetchBannerTypeDrop(value.title, true);
      } else {
        setSearchBannerTitleDrop([]);
      }
    }
    setSearchParams((prev) => ({
      ...prev,
      [field]: value?.title || value?.bannerTitle || null,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const handleSearchCancel = () => {
    setSearchParams({
      bannerType: "",
      BannerTitle: "",
      pageIndex: 1,
      pageSize: 10,
    });
    setSearchType(null);
    setSelectedBannerTitle(null);
    setSearchBannerTitleDrop([]);
    setFlag(!flag);
  };

  const handleCreateTypeChange = (event, value) => {
    setCreateType(value?.title || null);
    if (value) {
      fetchBannerTypeDrop(value.title, false);
    } else {
      setCreateBannerTitleDrop([]);
    }
    handleChange("bannerType", value?.title || "");
  };

  const handleSampleClick = (sample, index) => {
    setSelectedSampleIndex(index);
    setSelectedSample(sample);
    setOpenFormatDialog(true);
    // Set current format options based on selected sample
    setFormatOptions(prev => ({
      ...prev,
      backgroundColor: sampleStyles[index].backgroundColor,
      fontColor: sampleStyles[index].fontColor,
    }));
  };

  const handleFormatChange = (field, value) => {
    setFormatOptions(prev => ({
      ...prev,
      [field]: value,
    }));
    // Update the selected sample's style immediately
    if (selectedSampleIndex !== null) {
      setSampleStyles(prev => {
        const newStyles = [...prev];
        newStyles[selectedSampleIndex] = {
          ...newStyles[selectedSampleIndex],
          [field]: value,
        };
        return newStyles;
      });
    }
  };

  const handleFormatApply = () => {
    setOpenFormatDialog(false);
  };

  const handleFormatCancel = () => {
    // Revert changes if cancelled
    if (selectedSampleIndex !== null) {
      setSampleStyles(prev => {
        const newStyles = [...prev];
        newStyles[selectedSampleIndex] = {
          backgroundColor: MEDIUM_BLUE,
          fontColor: BLUE_COLOR,
        };
        return newStyles;
      });
    }
    setOpenFormatDialog(false);
  };

  const tableColumns = [
    { id: "bannerType", label: "TYPE" },
    { id: "bannerTitle", label: "TITLE" },
    { id: "status", label: "STATUS" },
    { id: "bannerPath", label: "IMAGE" },
  ];

  const handleCreateAccordionChange = (event, expanded) => {
    setCreateAccordionExpanded(expanded);
    setShowCreateButtons(expanded);
    // setShowTable(!expanded);
    if (expanded) {
      setSearchAccordionExpanded(false);
    }
  };

  const handleSearchAccordionChange = (event, expanded) => {
    setSearchAccordionExpanded(expanded);
    setShowTable(expanded);
    if (expanded) {
      setCreateAccordionExpanded(false);
      setShowCreateButtons(false);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          pr: { xs: 0, sm: 0, md: "160px", lg: "260px" }, // Add padding to make space for activity panel
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
          <Grid item xs={12} ml={1} pr={2}>
            <BreadcrumbsHeader pageTitle="Announcement" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
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
              {isLoading ? (
                <FormSkeleton />
              ) : (
                <Grid item>
                  <NuralAccordion2
                    title="Add"
                    backgroundColor={LIGHT_GRAY2}
                    expanded={createAccordionExpanded}
                    onChange={handleCreateAccordionChange}
                    controlled={true}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: PRIMARY_BLUE2,
                        mb: 4,
                        mt: 1,
                      }}
                    >
                      Banner CMS
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
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TYPE <Required />
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="Type"
                          getOptionLabel={(option) => option.title}
                          options={options}
                          placeholder="SELECT"
                          onChange={handleCreateTypeChange}
                          value={
                            options.find(
                              (option) => option.title === formData.bannerType
                            ) || null
                          }
                          error={!!errors.bannerType}
                          errorMessage={errors.bannerType}
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
                          BANNER TITLE <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="ENTER BANNER TITLE"
                          value={formData.bannerTitle}
                          onChange={(e) =>
                            handleChange("bannerTitle", e.target.value)
                          }
                          error={!!errors.bannerTitle}
                          errorMessage={errors.bannerTitle}
                        />
                      </Grid>

                      {createType === "IMAGE" && (
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <Box
                            sx={{
                              padding: "12px 16px",
                              marginBottom: "-30px",
                              mt: "-10",
                            }}
                          >
                            <Typography
                              textAlign={"start"}
                              fontSize={"10px"}
                              fontWeight={400}
                              color={DARK_PURPLE}
                            >
                              UPLOADED FILE <Required />
                            </Typography>
                          </Box>
                          <FileItem
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                              mt: "5px",
                              border: errors.bannerPath
                                ? "1px solid red"
                                : "none",
                            }}
                          >
                            <FileIcon>
                              <img
                                src={"./Icons/IconPlaceholder.svg"}
                                alt="file"
                              />
                            </FileIcon>
                            &nbsp; &nbsp;
                            <FileContent>
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: DARK_PURPLE,
                                }}
                              >
                                {selectedFile ? selectedFile.name : "File Name"}
                              </Typography>
                              <Grid
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                display={"flex"}
                                flexWrap={"wrap"}
                                alignItems={"center"}
                                justifyContent={"end"}
                              >
                                <img src="./Images/export_btn.svg" alt="" />
                              </Grid>
                            </FileContent>
                            <HiddenInput
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </FileItem>
                          {errors.bannerPath && (
                            <Typography
                              sx={{
                                color: "error.main",
                                fontSize: "12px",
                                mt: 1,
                              }}
                            >
                              {errors.bannerPath}
                            </Typography>
                          )}
                        </Grid>
                      )}

                      {createType === "TEXT" && (
                        <>
                          <Grid item xs={12} sm={6} md={12} lg={12}>
                            <Typography
                              variant="body1"
                              sx={{
                                ...labelStyle,
                                fontSize: { xs: "12px", sm: "10px" },
                              }}
                              fontWeight={600}
                            >
                              WRITE TEXT <Required />
                            </Typography>
                            <NuralTextField
                              width="100%"
                              placeholder="ENTER TEXT"
                              value={formData.bannerText}
                              onChange={(e) =>
                                handleChange("bannerText", e.target.value)
                              }
                              error={!!errors.bannerText}
                              errorMessage={errors.bannerText}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              sx={{
                                ...labelStyle,
                                fontSize: { xs: "12px", sm: "10px" },
                                mt: 2,
                              }}
                              fontWeight={600}
                            >
                              SELECT DESIGN <Required />
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                              {[
                                "Sample 1",
                                "Sample 2",
                                "Sample 3",
                                "Sample 4",
                              ].map((sample, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                  <Box
                                    sx={{
                                      height: "160px",
                                      backgroundColor: sampleStyles[index].backgroundColor,
                                      borderRadius: "8px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      border: "1px solid rgba(198, 206, 237, 0.5)",
                                      "&:hover": {
                                        backgroundColor: "rgba(198, 206, 237, 0.3)",
                                      },
                                    }}
                                    onClick={() => handleSampleClick(sample, index)}
                                  >
                                    <Typography
                                      sx={{
                                        color: sampleStyles[index].fontColor,
                                        fontSize: "14px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {sample}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>

                    {/* Third Row - Buttons */}
                  </NuralAccordion2>

                  <Grid item md={12} lg={12} mt={1} pr={2}>
                    {showStatus && (
                      <StatusModel
                        width="100%"
                        status={status}
                        title={title}
                        onClose={() => setShowStatus(false)}
                      />
                    )}
                  </Grid>
                  {showCreateButtons && (
                    <Grid container spacing={1} my={2}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          borderColor={PRIMARY_BLUE2}
                          onClick={handleCancel}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <NuralButton
                          text="SAVE"
                          backgroundColor={AQUA}
                          variant="contained"
                          onClick={handlePost}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
              {
                <Grid item>
                  <NuralAccordion2
                    title="Search"
                    backgroundColor={LIGHT_GRAY2}
                    expanded={searchAccordionExpanded}
                    onChange={handleSearchAccordionChange}
                    controlled={true}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: PRIMARY_BLUE2,
                        mb: 4,
                        mt: 1,
                      }}
                    >
                      Banner Search
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
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TYPE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="Type"
                          getOptionLabel={(option) => option.title}
                          options={options}
                          placeholder="SELECT"
                          value={
                            options.find(
                              (option) =>
                                option.title === searchParams.bannerType
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange("bannerType", value);
                          }}
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
                          BANNER TITLE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={searchBannerTitleDrop}
                          label="Banner Title"
                          getOptionLabel={(option) => option.bannerTitle}
                          value={
                            searchBannerTitleDrop.find(
                              (item) =>
                                item.bannerTitle === searchParams.BannerTitle
                            ) || null
                          }
                          onChange={(event, value) => {
                            setSelectedBannerTitle(value?.bannerTitle || null);
                            handleSearchChange("BannerTitle", value);
                          }}
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
                      <Grid item xs={12} sm={3} md={1}>
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
                      <Grid item xs={12} sm={7} md={11}>
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
                  {tableStatus.show && (
                    <Grid item xs={12} mt={1} pr={2}>
                      <StatusModel
                        width="100%"
                        status={tableStatus.status}
                        title={tableStatus.title}
                        onClose={() =>
                          setTableStatus((prev) => ({ ...prev, show: false }))
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              }
            </Grid>
          </Grid>
        </Grid>

        {/* Add this after the NuralAccordion2 component */}
        {showTable && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                color: PRIMARY_BLUE2,
                maxHeight: "calc(100vh - 100px)",
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                    <TableCell
                      sx={{
                        ...tableHeaderStyle,
                        position: "sticky",
                        top: "48px",
                        backgroundColor: LIGHT_GRAY2,
                        zIndex: 1100,
                      }}
                    >
                      S.NO
                    </TableCell>
                    {[
                      { id: "bannerType", label: "TYPE" },
                      { id: "bannerTitle", label: "TITLE" },
                      { id: "status", label: "STATUS" },
                      { id: "bannerPath", label: "IMAGE" },
                    ].map(({ id, label }) => (
                      <TableCell
                        key={id}
                        onClick={() => handleSort(id)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: "pointer",
                          position: "sticky",
                          top: "48px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{label}</Grid>
                          <Grid
                            item
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {sortConfig.key === id ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUpwardIcon
                                  sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                                />
                              ) : (
                                <ArrowDownwardIcon
                                  sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
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
                        </Grid>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableLoading ? (
                    Array(rowsPerPage)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton
                          key={index}
                          columns={tableColumns.length + 1} // +1 for S.NO column
                        />
                      ))
                  ) : tableData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography>No data available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map((row, index) => (
                      <TableRow key={row.bannerId}>
                        <TableCell sx={{ ...rowstyle }}>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        {tableColumns.map((column) => (
                          <TableCell key={column.id} sx={{ ...rowstyle }}>
                            {column.id === "status" ? (
                              <Grid
                                container
                                alignItems="center"
                                justifyContent="start"
                              >
                                <Switch
                                  checked={row.status === 1}
                                  onChange={() =>
                                    handleStatusChange(
                                      row.bannerId,
                                      row.status === 1 ? 0 : 1
                                    )
                                  }
                                  sx={{
                                    ...toggleSectionStyle,
                                    "& .MuiSwitch-thumb": {
                                      backgroundColor:
                                        row.status === 1
                                          ? PRIMARY_BLUE2
                                          : DARK_PURPLE,
                                    },
                                  }}
                                />
                              </Grid>
                            ) : column.id === "bannerPath" ? (
                              <Button
                                sx={{
                                  color: PRIMARY_BLUE2,
                                  textTransform: "none",
                                  fontSize: "12px",
                                }}
                                onClick={() =>
                                  window.open(row.bannerPath, "_blank")
                                }
                              >
                                View &nbsp; <VisibilityIcon fontSize="small" />
                              </Button>
                            ) : (
                              row[column.id]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
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
                      {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)}{" "}
                      PAGES
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
                      cursor: "pointer",
                    }}
                    onClick={() => handleJumpToPage(1)}
                  >
                    JUMP TO FIRST
                  </Typography>
                  <IconButton
                    onClick={() => handleJumpToPage(1)}
                    disabled={page === 1}
                    sx={{
                      "&:focus": {
                        outline: "none",
                      },
                    }}
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
                    onClick={() => handleJumpToPage(page + 1)}
                    disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
                    sx={{
                      "&:focus": {
                        outline: "none",
                      },
                    }}
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
                      cursor: "pointer",
                    }}
                    variant="body2"
                    onClick={() =>
                      handleJumpToPage(Math.ceil(totalRecords / rowsPerPage))
                    }
                  >
                    JUMP TO LAST
                  </Typography>
                  <input
                    type="number"
                    placeholder="Jump to page"
                    value={jumpToPageInput}
                    onChange={handleJumpToPageInput}
                    style={{
                      ...jumpToPageStyle,
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  />
                  <Grid
                    mt={1}
                    sx={{
                      cursor: "pointer",
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                    onClick={handleJumpToPageSubmit}
                  >
                    <img src="./Icons/footerSearch.svg" alt="arrow" />
                  </Grid>
                </Grid>
              </Grid>
            </TableContainer>
          </Grid>
        )}
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
      {uploadStatus.status && (
        <Grid item xs={12} mt={2}>
          <Typography
            sx={{
              color:
                uploadStatus.status === "success"
                  ? "success.main"
                  : "error.main",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {uploadStatus.title}
          </Typography>
        </Grid>
      )}

      {/* Table Status Model */}
      <Dialog
        open={openFormatDialog}
        onClose={handleFormatCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Format Text</DialogTitle>
        <DialogContent>
          <Tabs
            value={formatTab}
            onChange={(e, newValue) => setFormatTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Font" />
            <Tab label="Background" />
          </Tabs>

          {formatTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "12px", mb: 1 }}>
                  Font Color
                </Typography>
                <input
                  type="color"
                  value={formatOptions.fontColor}
                  onChange={(e) =>
                    handleFormatChange("fontColor", e.target.value)
                  }
                  style={{ width: "100%", height: "36px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "12px", mb: 1 }}>
                  Font Size
                </Typography>
                <NuralTextField
                  width="100%"
                  type="number"
                  value={formatOptions.fontSize}
                  onChange={(e) =>
                    handleFormatChange("fontSize", parseInt(e.target.value))
                  }
                  placeholder="Enter size"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "12px", mb: 1 }}>
                  Font Family
                </Typography>
                <NuralAutocomplete
                  width="100%"
                  options={[
                    { value: "Arial", label: "Arial" },
                    { value: "Helvetica", label: "Helvetica" },
                    { value: "Times New Roman", label: "Times New Roman" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={{
                    value: formatOptions.fontFamily,
                    label: formatOptions.fontFamily,
                  }}
                  onChange={(e, value) =>
                    handleFormatChange("fontFamily", value?.value || "Arial")
                  }
                  placeholder="Select font"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: "12px", mb: 1 }}>
                  Font Weight
                </Typography>
                <NuralAutocomplete
                  width="100%"
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "bold", label: "Bold" },
                    { value: "lighter", label: "Lighter" },
                  ]}
                  getOptionLabel={(option) => option.label}
                  value={{
                    value: formatOptions.fontWeight,
                    label: formatOptions.fontWeight,
                  }}
                  onChange={(e, value) =>
                    handleFormatChange("fontWeight", value?.value || "normal")
                  }
                  placeholder="Select weight"
                />
              </Grid>
            </Grid>
          )}

          {formatTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "12px", mb: 1 }}>
                  Background Color
                </Typography>
                <input
                  type="color"
                  value={formatOptions.backgroundColor}
                  onChange={(e) =>
                    handleFormatChange("backgroundColor", e.target.value)
                  }
                  style={{ width: "100%", height: "36px" }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <NuralButton
            text="CANCEL"
            variant="outlined"
            borderColor={PRIMARY_BLUE2}
            onClick={handleFormatCancel}
            width="100px"
          />
          <NuralButton
            text="APPLY"
            backgroundColor={AQUA}
            variant="contained"
            onClick={handleFormatApply}
            width="100px"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Banner;
