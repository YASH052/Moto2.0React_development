import { Divider, Grid, Stack, Typography, Skeleton } from "@mui/material";
import React from "react";
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
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import {
  BulkProductUploadAPIv2,
  ProductMasterUploadRefCode,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { MenuConstants } from "../../../Common/MenuConstants";
import { UploadContentSkeleton } from "../../../Common/SkeletonComponents";
import { templateUrl } from "../../../Common/urls";
const options = [
  { value: "interface", label: "Interface" },
  { value: "batch", label: "Batch" },
];

const log = JSON.parse(localStorage.getItem("log")) || {};

const ProductBulkUpload = () => {
  const [activeTab, setActiveTab] = React.useState("product-bulk-upload");
  const [resetFile, setResetFile] = React.useState(false);

  const [showStatus, setShowStatus] = React.useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const tabs = [
    { label: "Upload", value: "product-bulk-upload" },
    { label: "Brand", value: "brand" },
    { label: "Category", value: "category" },
    { label: "Sub Category", value: "sub-category" },
    { label: "Model", value: "model" },
    { label: "Color", value: "color" },
    { label: "SKU", value: "sku" },
    { label: "Focus Model", value: "focus-model" },
    { label: "Price", value: "price" },
    { label: "Pre Booking", value: "preBooking" },
  ];
  const templates = [
    {
      name: "Product Bulk Upload",
      onView: () => console.log("View Template 1"),
      onDownload: () => {
        setIsLoading(true);
        setTimeout(() => {
          window.location.href = `${templateUrl}SingleUploadProductMaster.xlsx`;
          setShowStatus(true);
          setStatus(200);
          setTitle("Template downloaded successfully.");
          setIsLoading(false);
        }, 1000);
        setTimeout(() => {
          setShowStatus(false);
          setStatus(null);
          setTitle(null);
        }, [5000]);
      },
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
      navigate("/brand");
    } else if (value === "batch") {
      navigate("#");
    }
  };

  const handleReferenceClick = async () => {
    setIsLoading(true);
    try {
      let res = await ProductMasterUploadRefCode();
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(handleClearStatus, 5000);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || 500);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = async () => {
    setShowStatus(true);
    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.[0]) {
      setStatus(String(400));
      setTitle("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("UploadedFile", fileInput.files[0]);
    console.log(formData);
    try {
      let res = await BulkProductUploadAPIv2(formData);
      if (res.statusCode == 200) {
        fileInput.value = "";
        setStatus(String(res.statusCode));
        setTitle("File uploaded successfully");
        setTimeout(handleClearStatus, 5000);
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        setStatus(String(res.statusCode));
        setTitle("Error in all records. Please check the invalid data file.");
        window.location.href = res.invalidDataLink;
      } else {
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setStatus(String(error.status));
      setTitle(MenuConstants.somethingWentWrong);
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleClearStatus = () => {

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setStatus(null);
    setTitle(null);

    setShowStatus(false);
    setResetFile(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTimeout(() => {
      setResetFile(false);
    }, 100);

  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // if (isLoading) {
  //   return <UploadContentSkeleton />;
  // }

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        mt={2}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          ml: 0,
        }}
      >
        <BreadcrumbsHeader pageTitle="Product" />
      </Grid>

      <Grid item xs={12} md={6} lg={12}>
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>

      {isLoading ? (
        <UploadContentSkeleton />
      ) : (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralUploadFormat
                  title="Upload Format"
                  onChange={handleFormatChange}
                  backgroundColor={LIGHT_GRAY2}
                  options={options}
                  value={selectedFormat}
                />
              </Grid>
              <Grid item>
                <NuralAccordion
                  titleColor={DARK_PURPLE}
                  buttonColor={PRIMARY_BLUE2}
                  buttonBg={MEDIUM_BLUE}
                  backgroundColor={LIGHT_GRAY2}
                  width="100%"
                  // onClickBin={handleBinCodeClick}
                  onClickReference={handleReferenceClick}
                  // referenceIcon1={"./Icons/downloadIcon.svg"}
                  referenceIcon2={"./Icons/downloadIcon.svg"}
                  title="Templates"
                  templates={templates}
                  buttons={true}
                // eye={false}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralFileUpload
                  mandatory
                  backgroundColor={LIGHT_GRAY2}
                  fileRef={fileInputRef}
                  accept=".xlsx,.xls,.csv"
                  resetFile={resetFile}
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
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleClearStatus}
                      width="100%"
                      disabled={isUploading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <NuralButton
                      text={isUploading ? "UPLOADING..." : "SAVE"}
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={handleUploadClick}
                      width="100%"
                      disabled={isUploading}
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

export default ProductBulkUpload;
