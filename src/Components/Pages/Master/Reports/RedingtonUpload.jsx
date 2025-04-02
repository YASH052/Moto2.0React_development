import { Grid, Skeleton } from "@mui/material";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import { AQUA, LIGHT_GRAY2, PRIMARY_BLUE2 } from "../../../Common/colors";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { UploadRedigntionFile } from "../../../Api/Api";
import { useState, useRef, useEffect } from "react";
import StatusModel from "../../../Common/StatusModel";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RETRIES = 3;

const CustomUploadSkeleton = () => {
  return (
    <Grid container spacing={0} lg={12} mt={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pr: 2 }}>
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
          <Grid item mt={-1}>
            <Grid container spacing={1}>
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
                {/* Save Button Skeleton */}
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

const RegingtonUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [actionText, setActionText] = useState("RETRY UPLOAD");
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState("");
  const abortController = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial page load skeleton
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

  const handleFileChange = (uploadedFile) => {
    // Reset states
    setErrorDetails("");
    setRetryCount(0);
    setStatus(null);
    setTitle("");

    if (!uploadedFile) {
      setFile(null);
      return;
    }

    // Check file size
    if (uploadedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setStatus(400);
      setTitle("File Too Large");
      setErrorDetails(
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
      return;
    }

    // Check if file is a spreadsheet
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.oasis.opendocument.spreadsheet",
    ];

    if (validTypes.includes(uploadedFile.type)) {
      setFile(uploadedFile);
    } else {
      setFile(null);
      setStatus(400);
      setTitle("Invalid File Type");
      setErrorDetails(
        "Please upload only spreadsheet files (.xlsx, .xls, .csv, .ods)"
      );
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      setStatus(400);
      setTitle("Please select a file");
      setErrorDetails({
        statusCode: "400",
        statusMessage: "Please select a file",
      });
      return;
    }

    setIsLoading(true);

    if (retryCount >= MAX_RETRIES) {
      setStatus(400);
      setTitle("Maximum upload attempts reached");
      setErrorDetails("Please try again later");
      return;
    }

    try {
      setStatus(null);
      setTitle("");
      setErrorDetails("");

      const formData = new FormData();
      formData.append("UploadedFile", file);

      // Create new AbortController for this upload
      abortController.current = new AbortController();

      const response = await UploadRedigntionFile(
        formData,
        abortController.current.signal
      );

      // Handle 500 status code specifically
      if (response.statusCode == "500") {
        setStatus("500");
        setTitle( "Internal Server Error");
        return;
      }

      // Handle 400 or other error cases
      if (response.statusCode == "400") {
        setStatus("400");
        setTitle(response.statusMessage || "Something went wrong");
        return;
      }

      // Success case
      setStatus(response.statusCode);
      setTitle(response.statusMessage || "Upload Successful");
      setRetryCount(0);
      setErrorDetails("");
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      // Always show internal server error in case of any unhandled errors
      setStatus("500");
      setTitle("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (status == 400) {
      if (retryCount >= MAX_RETRIES) {
        setFile(null);
        setRetryCount(0);
        setErrorDetails("");
      } else {
        handleFileUpload(file);
      }
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setIsLoading(true);
    setTimeout(() => {
      setFile(null);
      setStatus(null);
      setTitle("");
      setErrorDetails("");
      setRetryCount(0);
      setResetKey((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        mt={3}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          ml: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Product" />
      </Grid>

      {isLoading ? (
        <CustomUploadSkeleton />
      ) : (
        <Grid container spacing={0} lg={12} mt={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralFileUpload
                  key={resetKey}
                  backgroundColor={LIGHT_GRAY2}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv,.ods"
                />
              </Grid>
              <Grid item sx={{ width: "100%" }}>
                {status && (
                  <StatusModel
                    width="100%"
                    status={status}
                    title={title}
                    onClose={() => setStatus(null)}
                    sx={{ width: "100%" }}
                  />
                )}
              </Grid>
              <Grid item mt={-1}>
                <Grid container spacing={1}>
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
                      text="Save"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={() => handleFileUpload(file)}
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

export default RegingtonUpload;
