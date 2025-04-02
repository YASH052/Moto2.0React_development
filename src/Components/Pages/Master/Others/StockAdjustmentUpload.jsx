import { Grid, Skeleton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import {
  downloadBincode,
  downloadReferenceCode,
  fetchChannelName,
  fetchReason,
  uploadStockAdjustment,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import Required from './../../../Common/Required';
import NuralTextField from "../../NuralCustomComponents/NuralTextField";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RETRIES = 3;

const CustomUploadSkeleton = () => {
  return (
    <Grid container spacing={2} sx={{ px: { xs: 1, sm: 2, md: 2 }, mt: 2 }}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {/* Form Fields Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ bgcolor: "rgba(0, 0, 0, 0.1)", mb: 2 }}
            />
          </Grid>
          <Grid item>
            {/* Template Section Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {/* File Upload Area Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
            />
          </Grid>
          <Grid item>
            {/* Status Area Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
            />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                {/* Cancel Button Skeleton */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={36}
                  sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                {/* Proceed Button Skeleton */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={36}
                  sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const StockAdjustmentUpload = () => {
  const [activeTab, setActiveTab] = React.useState("stock-adjustment-upload");
  const [status, setStatus] = React.useState(null);
  const [tittle, setTittle] = React.useState(null);
  const [channelName, setChannelName] = React.useState([]);
  const [reason, setReason] = React.useState([]);
  const [retryCount, setRetryCount] = React.useState(0);
  const [formData, setFormData] = React.useState({
    UploadedFile: null,
    adjustmentDate: "",
    reasonID: 0,
    salesChannelTypeID: 0,
    remarks: "",
  });
  const navigate = useNavigate();
  const tabs = [
    { label: "Stock GRN", value: "stock-grn" },
    { label: "Stock adjust Upload", value: "stock-adjustment-upload" },
    { label: "Sap Integration", value: "sap-integration" },
    { label: "Unblock Finance IMEI", value: "unblock-finance-imei" },
  ];

  // Add loading state
  const [isLoading, setIsLoading] = React.useState(true);
  const abortController = React.useRef(null);

  // Initial page loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const templates = [
    {
      name: "Template ",
      onView: () => console.log("View Template 1"),
      onDownload: () => downloadTemplate(),
    },
  ];
  const downloadTemplate = () => {
    window.location.href = `${
      import.meta.env.VITE_TEMPLATE_URL
    }StockAdjustmentTemplate.xlsx`;
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };
  const handleDateChange = (field, value) => {
    // Clear any existing errors for this field
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Format date as YYYY-MM-DD if it's a Date object
    const formattedDate =
      value instanceof Date
        ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(value.getDate()).padStart(2, "0")}`
        : value;

    // Update the form data with the new date value
    setFormData((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));

    // Validate the date if needed
    if (!formattedDate) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field === "adjustmentDate" ? "Date" : field} is required`,
      }));
    }
  };

  const handleBincode = async () => {
    try {
      setIsLoading(true);
      const response = await downloadBincode();
      if (response.statusCode === "200") {
        window.location.href = response.referenceDataLink;
        setStatus(response.statusCode);
        setTittle(response.statusMessage);
      } else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      setStatus(error?.statusCode);
      setTittle(error?.statusMessage || "Something went wrong");
      console.error("Error in handleBincode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceCode = async () => {
    if (!formData.salesChannelTypeID || formData.salesChannelTypeID === 0) {
      setErrors((prev) => ({
        ...prev,
        salesChannelTypeID: "Please select Channel Name first",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const params = {
        salesChannelTypeID: formData?.salesChannelTypeID ?? 0,
        isSKURequired: "1",
        countryID: "0",
      };
      const response = await downloadReferenceCode(params);
      if (response.statusCode == 200) {
        window.location.href = response.referenceDataLink;
        setStatus(response.statusCode);
        setTittle(response.statusMessage);
      } else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
      }
    } catch (error) {
      setStatus(error?.statusCode);
      setTittle(error?.statusMessage || "Something went wrong");
      console.error("Error in handleReferenceCode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChannelName = async () => {
    try {
      setIsLoading(true);
      const params = {
        salesChannelTypeid: 0,
        forApproval: 0,
        loadRetailer: 1,
      };
      const response = await fetchChannelName(params);
      if (response.statusCode == "200") {
        setChannelName(response.salesChannelTypeList);
      } else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
        setChannelName([]);
      }
    } catch (error) {
      setStatus(error?.statusCode);
      setTittle(error?.statusMessage || "Something went wrong");
      console.error("Error in getChannelName:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReason = async () => {
    try {
      setIsLoading(true);
      const response = await fetchReason();
      if (response.statusCode == "200") {
        setReason(response.reasonList);
      } else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
        setReason([]);
      }
    } catch (error) {
      setStatus(error?.statusCode);
      setTittle(error?.statusMessage || "Something went wrong");
      console.error("Error in getReason:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    setIsLoading(true);
    Promise.all([getReason(), getChannelName()]).finally(() => {
      // Set loading to false after a short delay to ensure everything is loaded
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Immediate validation
    switch (field) {
      case "adjustmentDate":
        setErrors((prev) => ({
          ...prev,
          adjustmentDate: !value ? "Date is required" : "",
        }));
        break;
      case "salesChannelTypeID":
        setErrors((prev) => ({
          ...prev,
          salesChannelTypeID: !value ? "Channel Name is required" : "",
        }));
        break;
      case "reasonID":
        setErrors((prev) => ({
          ...prev,
          reasonID: !value ? "Reason is required" : "",
        }));
        break;
      case "remarks": {
        const inputValue = value;
        let remarkError = "";

        if (inputValue.length >= 100) {
          remarkError = "Maximum 100 characters allowed";
        } else if (!inputValue) {
          remarkError = "Remarks is required";
        }

        setErrors((prev) => ({ ...prev, remarks: remarkError }));
        break;
      }
    }
  };

  const handleFileUpload = (file) => {
    // Reset states
    setRetryCount(0);
    setStatus(null);
    setTittle("");

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        UploadedFile: null,
      }));
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFormData((prev) => ({
        ...prev,
        UploadedFile: null,
      }));
      setStatus(400);
      setTittle("File Too Large");
      return;
    }

    // Check file type by extension as MIME types can be inconsistent
    const validExtensions = [".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        UploadedFile: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        UploadedFile: null,
      }));
      setStatus(400);
      setTittle("Only Excel files are allowed");
    }
  };

  const [errors, setErrors] = React.useState({
    adjustmentDate: "",
    salesChannelTypeID: "",
    reasonID: "",
    remarks: "",
    upload: "",
  });

  const handleUpload = async () => {
    const newErrors = {
      adjustmentDate: !formData.adjustmentDate ? "Date is required" : "",
      salesChannelTypeID: !formData.salesChannelTypeID
        ? "Channel Name is required"
        : "",
      reasonID:
        !formData.reasonID || formData.reasonID === 0
          ? "Reason is required"
          : "",
      remarks: !formData.remarks
        ? "Remarks is required"
        : formData.remarks.length >= 100
        ? "Maximum 100 characters allowed"
        : "",
      upload: "",
    };

    setErrors(newErrors);

    // Check for file upload
    if (!formData.UploadedFile) {
      setStatus(400);
      setTittle("Please select a file");
      return;
    }

    if (Object.values(newErrors).some((error) => error !== "")) return;

    setIsLoading(true);

    if (retryCount >= MAX_RETRIES) {
      setStatus(400);
      setTittle("Maximum upload attempts reached");
      return;
    }

    try {
      setStatus(null);
      setTittle("");

      // Create new AbortController for this upload
      abortController.current = new AbortController();

      const form = new FormData();
      form.append("adjustmentDate", formData.adjustmentDate);
      form.append("salesChannelTypeID", formData.salesChannelTypeID);
      form.append("reasonID", formData.reasonID);
      form.append("remarks", formData.remarks);
      form.append("UploadedFile", formData.UploadedFile);

      const response = await uploadStockAdjustment(form);

      // Handle 500 status code specifically
      if (response.statusCode == 500) {
        setStatus("500");
        setTittle("Internal Server Error");
        return;
      }

      // Handle success case
      if (response.statusCode == 200) {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Upload Successful");
        setRetryCount(0);
      }
      // Handle invalid data file case
      else if (response.statusCode == 400 && response.invalidDataLink) {
        setStatus(response.statusCode);
        setTittle(
          "Error in uploaded file. Invalid data file is being downloaded."
        );
        window.location.href = response.invalidDataLink;
      }
      // Handle other error cases
      else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
        // Increment retry count for non-success cases
        setRetryCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error in handleUpload:", error);
      // Always show internal server error in case of any unhandled errors
      setStatus("500");
      setTittle("Internal Server Error");
      setRetryCount((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (status == 400) {
      if (retryCount >= MAX_RETRIES) {
        setFormData((prev) => ({
          ...prev,
          UploadedFile: null,
        }));
        setRetryCount(0);
        setStatus(null);
        setTittle(null);
      } else {
        handleUpload();
      }
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }

    setIsLoading(true);
    setTimeout(() => {
      setFormData({
        UploadedFile: null,
        adjustmentDate: "",
        reasonID: 0,
        salesChannelTypeID: 0,
        remarks: "",
      });
      setErrors({
        adjustmentDate: "",
        salesChannelTypeID: "",
        reasonID: "",
        remarks: "",
        upload: "",
      });
      setStatus(null);
      setTittle(null);
      setRetryCount(0);

      // Force clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      // Force component to remount
      setResetKey((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  // Add a reset key state to force remount when canceling
  const [resetKey, setResetKey] = React.useState(0);

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
          px: { xs: 1, sm: 2, md: 2 }
        }}
      >
        <BreadcrumbsHeader pageTitle="Others" />
      </Grid>

      <Grid item xs={12} sx={{ px: { xs: 1, sm: 2, md: 2 } }}>
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>

      {isLoading ? (
        <CustomUploadSkeleton />
      ) : (
        <Grid container spacing={2} sx={{ px: { xs: 1, sm: 2, md: 2 }, mt: 1 }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="STOCK ADJUSTMENT UPLOAD"
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
                        DATE <Required />
                      </Typography>

                      <NuralCalendar
                        placeholder="DD/MM/YY"
                        width="100%"
                        value={formData.adjustmentDate}
                        onChange={(newValue) =>
                          handleDateChange("adjustmentDate", newValue)
                        }
                        error={!!errors.adjustmentDate}
                        required
                      />
                      {errors.adjustmentDate && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.adjustmentDate}
                        </Typography>
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
                        CHANNEL NAME <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={channelName}
                        getOptionLabel={(option) =>
                          option.salesChannelTypeName || ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.salesChannelTypeID ===
                          value?.salesChannelTypeID
                        }
                        value={
                          channelName.find(
                            (option) =>
                              option.salesChannelTypeID ===
                              formData.salesChannelTypeID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange(
                            "salesChannelTypeID",
                            newValue?.salesChannelTypeID || 0
                          );
                          setErrors((prev) => ({
                            ...prev,
                            salesChannelTypeID: "",
                          }));
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        onBlur={() => {
                          if (!formData.salesChannelTypeID) {
                            setErrors((prev) => ({
                              ...prev,
                              salesChannelTypeID: "Channel Name is required",
                            }));
                          }
                        }}
                      />
                      {errors.salesChannelTypeID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.salesChannelTypeID}
                        </Typography>
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
                        REASON <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={reason}
                        getOptionLabel={(option) => option.reasonName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.reasonID === value?.reasonID
                        }
                        value={
                          reason.find(
                            (option) => option.reasonID === formData.reasonID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          const newID = newValue?.reasonID || 0;
                          handleChange("reasonID", newID);
                          setErrors((prev) => ({
                            ...prev,
                            reasonID: newID === 0 ? "Reason is required" : "",
                          }));
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        onBlur={() => {
                          // More thorough validation on blur
                          if (!formData.reasonID || formData.reasonID === 0) {
                            setErrors((prev) => ({
                              ...prev,
                              reasonID: "Reason is required",
                            }));
                          }
                        }}
                        error={!!errors.reasonID}
                      />
                      {errors.reasonID && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.reasonID}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mt={1}>
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
                        }}
                      >
                        REMARKS <Required />
                      </Typography>
                      <Grid item xs={12} md={12} lg={12} mt={1}>
                        <NuralTextField
                          placeholder="ENTER REMARKS"
                          width="100%"
                          value={formData.remarks}
                          onChange={(event) => {
                            handleChange("remarks", event.target.value);
                          }}
                          error={!!errors.remarks}
                          errorMessage={errors.remarks}
                          border={
                            errors.remarks ? "1px solid #FF0000" : undefined
                          }
                          maxLength={100}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
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
                  title="TEMPLATES"
                  templates={templates}
                  buttons={true}
                  eye={false}
                  onClickBin={() => handleBincode()}
                  onClickReference={() => handleReferenceCode()}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralFileUpload
                  key={resetKey}
                  backgroundColor={LIGHT_GRAY2}
                  onChange={handleFileUpload}
                  mandatory={true}
                  accept=".xlsx,.xls"
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                {status && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={tittle}
                    onClose={() => setStatus(null)}
                  />
                )}
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
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
                      text={
                        retryCount > 0 && status === "400" ? "RETRY" : "PROCEED"
                      }
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={
                        retryCount > 0 && status === "400"
                          ? handleRetry
                          : handleUpload
                      }
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default StockAdjustmentUpload;
