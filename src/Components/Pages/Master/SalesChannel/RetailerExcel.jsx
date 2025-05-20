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
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import {
  GetAllTemplateDataV2,
  getSalesChannelExcelReferenceDataLink,
  GetStockBinTypeInfo,
  UploadPrimarySales,
  UploadRetailerMaster,
  UploadSalesChannelMasterMoto,
  UploadSecondarySales,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import secureLocalStorage from "react-secure-storage";
import { MenuConstants } from "../../../Common/MenuConstants";
import { UploadContentSkeleton } from "../../../Common/SkeletonComponents";
import { templateUrl } from "../../../Common/urls";
const options = [
  { value: "interface", label: "Interface" },
  { value: "batch", label: "Batch" },
];

const log = JSON.parse(localStorage.getItem("log")) || {};

const SalesExcel = () => {
  const [activeTab, setActiveTab] = React.useState("add-retailer");
  const navigate = useNavigate();
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTemplateDownloading, setIsTemplateDownloading] =
    React.useState(false);
  const [resetFile, setResetFile] = React.useState(false);
  const tabs = [
    { label: "Add Retailer", value: "add-retailer" },
    { label: "Search", value: "view-retailer" },
    { label: "Approve", value: "approveSaleschannel" },
  ];

  const templates = [
    {
      name: "Download Retailer Template",
      onView: () => console.log("View Template 1"),
      onDownload: () => {
        setIsTemplateDownloading(true);
        setShowStatus(true);
        setStatus("200");
        setTitle("Downloading template...");

        setTimeout(() => {
          window.location.href = `${templateUrl}Retailer Template.xlsx`;
          setIsTemplateDownloading(false);
          setStatus("200");
          setTitle("Template downloaded successfully");
          setTimeout(handleClearStatus, 3000);
        }, 1000);
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
      navigate("/add-retailer");
    } else if (value === "batch") {
      navigate("/retailer-excelUpload");
    }
  };

  const handleBinCodeClick = async () => {
    setIsLoading(true);
    try {
      let res = await GetStockBinTypeInfo();
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(handleClearStatus, 3000);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode);
      setTitle(error.statusMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceClick = async () => {
    setIsLoading(true);
    let body = {
      reqType: 5,
      entityId: 0 /*from login api*/,
      salesChanneLevel: 0,
      brandID: 0,
      targetName: "",
      countryID: 1,
    };
    try {
      let res = await GetAllTemplateDataV2(body);
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(handleClearStatus, 3000);
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

  const handleClearStatus = () => {
    
    setShowStatus(false);
    setStatus(null);
    setTitle(null);
    setResetFile(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTimeout(() => {
      setResetFile(false);
    }, 100);
  };

  const handleUploadClick = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.[0]) {
      setShowStatus(true);
      setStatus(String(400));
      setTitle("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("UploadedFile", fileInput.files[0]);

    try {
      let res = await UploadRetailerMaster(formData);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(String(res.statusCode));
        setTitle("File uploaded successfully");
        setTimeout(() => {
          handleClearStatus();
        }, 3000);
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        setShowStatus(true);
        setStatus(String(res.statusCode));
        setTitle(res.statusMessage);
        window.location.href = res.invalidDataLink;
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(String(error.status || 500));
      setTitle(error.statusMessage || "Internal Server Error");
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
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
          ml: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Retailer" />
      </Grid>

      <Grid item xs={12} md={6} ml={1} lg={12}>
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
                  onClickBin={handleBinCodeClick}
                  onClickReference={handleReferenceClick}
                  // referenceIcon1={"./Icons/downloadIcon.svg"}
                  referenceIcon2={"./Icons/downloadIcon.svg"}
                  title="Templates"
                  templates={templates}
                  buttons={true}
                  eye={false}
                  bin={false}
                  reference={true}
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
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleClearStatus}
                      width="100%"
                      disabled={isUploading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <NuralButton
                      text={isUploading ? "UPLOADING..." : "PROCEED"}
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

export default SalesExcel;
