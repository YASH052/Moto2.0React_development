import { Divider, Grid, Stack, Typography, Skeleton } from "@mui/material";
import React, { useRef, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import {
  BulkLocationUploadAPIV2,
  LocationMasterUploadRefCode,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";

const GeographyBulkUpload = () => {
  const [activeTab, setActiveTab] = React.useState("geography-bulk-upload");
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const navigate = useNavigate();
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const options = [
    { value: "interface", label: "Interface" },
    { value: "batch", label: "Batch" },
  ];
  const tabs = [
    { label: "Upload", value: "geography-bulk-upload" },
    { label: "Country", value: "#" },
    { label: "State", value: "state" },
    { label: "City", value: "city" },
    { label: "Area", value: "area" },
  ];

  const handleDownloadRefCode = async () => {
    try {
      setIsLoading(true);
      const response = await LocationMasterUploadRefCode();
      if (response.statusCode === "200") {
        window.location.href = response?.referenceDataLink;
        setStatus(response?.statusCode);
        setTitle(response?.statusMessage);
        setTimeout(() => {
          if (response.statusCode === "200") {
            setStatus(null);
            setTitle("");
          }
        }, 5000);
      } else {
        setStatus(response?.statusCode);
        setTitle(response?.statusMessage);
      }
      console.log("Template Downloaded:", response);
    } catch (error) {
      console.error("Error in handleDownloadRefCode:", error);
      setStatus(500);
      setTitle("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsLoading(true);
      window.location.href = `${
        import.meta.env.VITE_TEMPLATE_URL
      }SingleUploadGeography.xlsx`;
      setStatus(200);
      setTitle("Template Downloaded Successfully");
      setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000);
    } catch (error) {
      console.error("Error in handleDownloadTemplate:", error);
      setStatus(500);
      setTitle("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateFileType = (file) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(file.type)) {
      return "Please upload a valid Excel (.xlsx, .xls) or CSV file";
    }
    return null;
  };

  const validateFileName = (file) => {
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return "File must have .xlsx, .xls, or .csv extension";
    }
    return null;
  };

  const handleFileChange = (file) => {
    setFileError(null);
    setStatus(null);
    setTitle("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    const typeError = validateFileType(file);
    if (typeError) {
      setFileError(typeError);
      setSelectedFile(null);
      return;
    }

    // Validate file name
    const nameError = validateFileName(file);
    if (nameError) {
      setFileError(nameError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleCancel = () => {
    setIsLoading(true);
    setStatus(null);
    setTitle("");
    setSelectedFile(null);
    setFileError(null);

    // Reset the file input element
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Show skeleton for a brief moment
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const uploadGeography = async () => {
    if (!selectedFile) {
      setStatus(400);
      setTitle("Please select a file to upload");
      return;
    }

    try {
      setIsLoading(true);

      const form = new FormData();
      form.append("UploadedFile", selectedFile);

      const response = await BulkLocationUploadAPIV2(form);
      if (response.statusCode === "200") {
        setStatus(response?.statusCode);
        setTitle(response?.statusMessage);
        setSelectedFile(null);
        setTimeout(() => {
          if (response.statusCode === "200") {
            setStatus(null);
            setTitle("");
          }
        }, 5000);
      } else if (response.statusCode === "400") {
        if (response?.invalidDataLink) {
          window.location.href = response?.invalidDataLink;
        }
        setStatus(response?.statusCode);
        setTitle(response?.statusMessage);
      } else {
        setStatus(response?.statusCode);
        setTitle(response?.statusMessage);
      }
    } catch (error) {
      console.error("Error in uploadGeography:", error);
      setStatus(500);
      setTitle("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const templates = [
    {
      name: "Geography Template Download",
      onView: () => console.log("View Template 1"),
      onDownload: handleDownloadTemplate,
    },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("#");
    } else if (value === "batch") {
      navigate("/product-bulk-upload");
    }
  };

  const renderSkeleton = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        mt={1.5}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          paddingBottom: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Geography" />
      </Grid>

      <Grid item xs={12} md={6} lg={12}>
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>

      <Grid container spacing={0} lg={12} mt={2}>
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion
                    titleColor={DARK_PURPLE}
                    buttonColor={PRIMARY_BLUE2}
                    buttonBg={MEDIUM_BLUE}
                    backgroundColor={LIGHT_GRAY2}
                    width="100%"
                    referenceIcon2={"./Icons/downloadIcon.svg"}
                    title="Templates"
                    templates={templates}
                    buttons={true}
                    eye={false}
                    onClickReference={() => handleDownloadRefCode()}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralFileUpload
                    backgroundColor={LIGHT_GRAY2}
                    fileRef={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.csv"
                    mandatory={true}
                  />
                </Grid>
                <Grid item>
                  {fileError && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ mt: 1, mb: 1 }}
                    >
                      {fileError}
                    </Typography>
                  )}
                  {status && (
                    <StatusModel
                      width="98%"
                      status={status || ""}
                      title={title || ""}
                      onClose={() => setStatus(null)}
                    />
                  )}
                </Grid>
                <Grid item mt={-1}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="CANCEL"
                        variant="outlined"
                        borderColor={PRIMARY_BLUE2}
                        onClick={handleCancel}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralButton
                        text="PROCEED"
                        backgroundColor={AQUA}
                        variant="contained"
                        onClick={uploadGeography}
                        width="100%"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default GeographyBulkUpload;
