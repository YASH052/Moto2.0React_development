import { Grid, Typography, Button, Link, Box, Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralFileTemplate from "../../NuralCustomComponents/NuralFileTemplate";
import styled from "styled-components";
import {
  GetModelListForDropdown,
  GetPrimaryToTertiaryTrackReportMoto,
  GetSKUListForDropdown,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { LoadingSkeleton } from "../../../Common/SkeletonComponents";
import { useNavigate } from "react-router-dom";

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

const PrimaryToTertiary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("primary-to-tertiary");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [skuDropdown, setSkuDropdown] = React.useState([]);
  const [modelDropdown, setModelDropdown] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [status, setStatus] = React.useState(404);
  const [title, setTitle] = React.useState("Internal Server Error");
  const [searchParams, setSearchParams] = React.useState({
    SearchFile: null,
    dateType: null,
    fromDate: "",
    toDate: "",
    model: 0,
    sku: 0,
    imei: "",
  });
  const actualFileRef = React.useRef(null);
  const tabs = [
    { label: "Sale Report", value: "sales-report" },
    { label: "ISP Sales Report", value: "isp-sales-report" },
    { label: "Unique Sales Report", value: "unique-sales-report" },
    { label: "Primary to Tertiary Track", value: "primary-to-tertiary" },
    { label: "Competition Sales Report", value: "competition-sales-report" },
  ];

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const dateTypeOptions = [
    {
      label: "SMS Activation Date",
      value: "1",
    },
    {
      label: "Web Activation Date",
      value: "2",
    },
    {
      label: "ISP Tertiary Date",
      value: "3",
    },
    {
      label: "Tertiary Considered Date",
      value: "4",
    },
  ];

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];

  useEffect(() => {
    fetchModelList();
  }, []);

  const fetchModelList = async () => {
    let body = {
      categoryID: 0 /*product CategoryID*/,
      modelID: 0,
      subCategoryID: 0 /*productID*/,
      brandID: 0,
    };
    setIsLoading(true);
    try {
      let res = await GetModelListForDropdown(body);
      if (res.statusCode == 200) {
        setModelDropdown(res.modelDropdownList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };    

  const handleSearchClick = async () => {
    setShowModal(false);
    setIsLoading(true);
    try {
      let res = await GetPrimaryToTertiaryTrackReportMoto(searchParams);
      if (res.statusCode == 200) {
        window.location.href = res.reportLink;
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        window.location.href = res.invalidDataLink;
      } else {
        setShowModal(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowModal(true);
      setStatus(error.response.data.statusCode || 500);
      setTitle(error.response.data.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    if (field == "model") {
      if (!value) {
        setSkuDropdown([]);
        setSearchParams((prev) => ({
          ...prev,
          [field]: "",
        }));
      } else {
        fetchSku();
      }
    }

    if (field === "fromDate" || field === "toDate") {
      if (value) {
        const date = new Date(value);
        const formattedDate = date.toISOString().split("T")[0];
        value = formattedDate;
      }
    }

    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchSku = async () => {
    let body = {
      skuID: 0,
      categoryID: 0 /*product CategoryID*/,
      modelID: searchParams.model,
      subCategoryID: 0 /*productID*/,
      brandID: 0,
    };
    setIsLoading(true);
    try {
      let res = await GetSKUListForDropdown(body);
      if (res.statusCode == 200) {
        setSkuDropdown(res.skuDropdownList);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      SearchFile: null,
      dateType: null,
      fromDate: "",
      toDate: "",
      model: 0,
      sku: 0,
      imei: "",
    });
    setSelectedFile(null);
    if (actualFileRef.current) {
      actualFileRef.current.value = "";
    }
  };

  const handleClick = () => {
    actualFileRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is CSV
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        setShowModal(true);
        setStatus(400);
        setTitle("Please upload only CSV files");
        return;
      }

      // Check file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setShowModal(true);
        setStatus(400);
        setTitle("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setSearchParams((prev) => ({
        ...prev,
        SearchFile: file,
      }));
    }
  };

  const handleAttachClick = () => {
    actualFileRef.current?.click();
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Sales" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <Grid
          container
          spacing={0}
          lg={12}
          mt={{ xs: 0, md: 1 }}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} sx={{ p: { xs: 2, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Primary to Tertiary Track"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        DATE TYPE
                      </Typography>
                      <NuralAutocomplete
                        label="Date Type"
                        options={dateTypeOptions}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.value === value?.value
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "dateType",
                            newValue?.value || null,
                            newValue
                          );
                        }}
                        value={
                          dateTypeOptions.find(
                            (option) => option.value === searchParams.dateType
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
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
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YYYY"
                        onChange={(value) =>
                          handleSearchChange("fromDate", value)
                        }
                        value={searchParams.fromDate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
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
                      <NuralCalendar
                        width="100%"
                        placeholder="DD/MMM/YY"
                        onChange={(value) =>
                          handleSearchChange("toDate", value)
                        }
                        value={searchParams.toDate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        MODEL
                      </Typography>
                      <NuralAutocomplete
                        label="Model"
                        options={modelDropdown}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.modelName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.modelID === value?.modelID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "model",
                            newValue?.modelID || null,
                            newValue
                          );
                        }}
                        value={
                          modelDropdown.find(
                            (option) => option.modelID === searchParams.model
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        SKU
                      </Typography>
                      <NuralAutocomplete
                        label="sku"
                        options={skuDropdown}
                        placeholder="SELECT"
                        width="100%"
                        getOptionLabel={(option) => option.skuName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.skuID === value?.skuID
                        }
                        onChange={(event, newValue) => {
                          handleSearchChange(
                            "sku",
                            newValue?.skuID || null,
                            newValue
                          );
                        }}
                        value={
                          skuDropdown.find(
                            (option) => option.skuID === searchParams.sku
                          ) || null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        IMEI
                      </Typography>
                      <NuralTextField
                        width="100%"
                        placeholder="ENTER IMEI"
                        onChange={(e) => {
                          // Only allow alphanumeric characters
                          const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                          handleSearchChange("imei", value);
                        }}
                        value={searchParams.imei}
                        onKeyPress={(e) => {
                          // Prevent special characters from being entered
                          const regex = /^[a-zA-Z0-9]$/;
                          if (!regex.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    sx={{
                      gap: { xs: 0, sm: 0, md: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid item xs={12} md={12}>
                      <NuralFileTemplate
                        title="Upload IMEI For Search"
                        backgroundColor={MEDIUM_BLUE}
                      >
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              borderRight: {
                                sm: "none",
                                md: "1px solid #8D9EDB",
                              },
                            }}
                            borderRadius="0px"
                          >
                            <Box
                              sx={{
                                padding: "0px 16px",
                                mt: "10px",
                              }}
                            >
                              <Typography
                                textAlign={"start"}
                                fontSize={"10px"}
                                fontWeight={400}
                                color={DARK_PURPLE}
                              >
                                UPLOADED FILE
                              </Typography>
                            </Box>
                            <FileItem
                              sx={{
                                mt: "-10px",
                              }}
                              onClick={handleClick}
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
                                  {selectedFile
                                    ? selectedFile.name
                                    : "File Name"}
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
                                  <img
                                    src="./Images/atc.svg"
                                    alt="attach"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAttachClick();
                                    }}
                                  />
                                </Grid>
                              </FileContent>
                              <HiddenInput
                                ref={actualFileRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                              />
                            </FileItem>
                          </Grid>

                          <Grid item xs={12} md={6} mt={2}>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: DARK_PURPLE,
                              }}
                            >
                              Template
                            </Typography>
                            <Grid
                              mt={2}
                              display={"flex"}
                              justifyContent={"space-between"}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: DARK_PURPLE,
                                }}
                              >
                                Template
                              </Typography>

                              <FileDownloadIcon />
                            </Grid>
                          </Grid>
                        </Grid>
                      </NuralFileTemplate>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    mt={2}
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
              <Grid item md={6} lg={6} pr={2}>
                {showModal && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={title}
                    onClose={() => setShowModal(false)}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default PrimaryToTertiary;
