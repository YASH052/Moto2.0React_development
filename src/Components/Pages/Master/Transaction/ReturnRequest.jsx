import { Divider, Grid, Stack, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  LIGHT_BLUE,
} from "../../../Common/colors";

import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import Required from "../../../Common/Required";
import { labelStyle, titleStyle } from "../../../Common/commonstyles";

const tabs = [
  { label: "Upload", value: "competiton-upload" },
  { label: "Brand", value: "competition-brand" },
  { label: "Category", value: "competition-category" },
  { label: "Model", value: "competition-model" },
  { label: "Price Band", value: "competition-price-band" },
];

const ReturnRequest = () => {
  const [activeTab, setActiveTab] = React.useState("competiton-upload");
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    remarks: "",
    uploadedFile: null,
  });

  const [errors, setErrors] = useState({
    remarks: "",
    upload: "",
  });

  const [uploadStatus, setUploadStatus] = useState({
    status: null,
    title: null,
  });

  const options = [
    { value: "interface", label: "Interface" },
    { value: "batch", label: "Batch" },
  ];

  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("View Template 1"),
      onDownload: () => console.log("Download Template 1"),
    },
    {
      name: "Template 2",
      onView: () => console.log("View Template 2"),
      onDownload: () => console.log("Download Template 2"),
    },
    {
      name: "Template 3",
      onView: () => console.log("View Template 3"),
      onDownload: () => console.log("Download Template 3"),
    },
    {
      name: "Template 4",
      onView: () => console.log("View Template 4"),
      onDownload: () => console.log("Download Template 4"),
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
      navigate("/add-retailer");
    } else if (value === "batch") {
      navigate("/retailer-excelUpload");
    }
  };

  const handleRemarkChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      remarks: value,
    }));

    // Validate remarks
    let remarkError = "";
    if (value.length >= 100) {
      remarkError = "Maximum 100 characters allowed";
    } else if (!value) {
      remarkError = "Remarks is required";
    }
    setErrors((prev) => ({ ...prev, remarks: remarkError }));
  };

  const handleFileUpload = (file) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: null,
      }));
      return;
    }

    // Check file type
    const validExtensions = [".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: file,
      }));
      setUploadStatus({
        status: "success",
        title: "New Upload Verified",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: null,
      }));
      setUploadStatus({
        status: "failed",
        title: "Only Excel files are allowed",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      remarks: "",
      uploadedFile: null,
    });
    setUploadStatus({
      status: null,
      title: null,
    });
  };

  const handleProceed = () => {
    // Validate before proceeding
    const newErrors = {
      remarks: !formData.remarks
        ? "Remarks is required"
        : formData.remarks.length >= 100
        ? "Maximum 100 characters allowed"
        : "",
      upload: !formData.uploadedFile ? "Please select a file" : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Proceed with the upload
    console.log("Proceeding with upload:", formData);
  };

  return (
    <Grid item xs={12} pr={2}>
      <Grid container spacing={0} direction="column">
        <Grid item>
          <NuralAccordion2 title="Return Request" backgroundColor={"#fff"}>
            <Grid container spacing={0}>
              <Grid container spacing={0} lg={12} mt={2}>
                <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
                  <Grid container spacing={0} direction="column">
                    <Grid
                      mb={2}
                      item
                      backgroundColor={LIGHT_GRAY2}
                      sx={{ borderRadius: "8px" }}
                      p={2}
                    >
                      <Typography sx={titleStyle}>
                        Sales Return Request
                      </Typography>
                      <Typography sx={labelStyle}>
                        REMARKS <Required />
                      </Typography>
                      <Grid>
                        <NuralTextField
                          placeholder="ENTER REMARKS"
                          width="100%"
                          value={formData.remarks}
                          onChange={(e) => handleRemarkChange(e.target.value)}
                          error={!!errors.remarks}
                          errorMessage={errors.remarks}
                          backgroundColor={LIGHT_BLUE}
                          maxLength={100}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <NuralAccordion
                        titleColor={DARK_PURPLE}
                        buttonColor={PRIMARY_BLUE2}
                        buttonBg={MEDIUM_BLUE}
                        backgroundColor={LIGHT_GRAY2}
                        width="100%"
                        referenceIcon1={"./Icons/downloadIcon.svg"}
                        referenceIcon2={"./Icons/downloadIcon.svg"}
                        title="Templates"
                        templates={templates}
                        buttons={true}
                        eye={true}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
                  <Grid container spacing={2} direction="column">
                    <Grid item>
                      <NuralFileUpload
                        backgroundColor={LIGHT_GRAY2}
                        onChange={handleFileUpload}
                        accept=".xlsx,.xls"
                        error={!!errors.upload}
                        helperText={errors.upload}
                        mandatory={true}
                      />
                    </Grid>
                    {uploadStatus.status && (
                      <Grid item>
                        <NuralUploadStatus
                          width="98%"
                          status={uploadStatus.status}
                          title={uploadStatus.title}
                          actionText="RETRY UPLOAD"
                          onAction={() => handleFileUpload(null)}
                        />
                      </Grid>
                    )}
                    <Grid item mt={-1}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="CANCEL"
                      color={PRIMARY_BLUE2}

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
                            onClick={handleProceed}
                            width="100%"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </NuralAccordion2>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReturnRequest;
