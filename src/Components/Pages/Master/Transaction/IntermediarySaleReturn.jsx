import { Divider, Grid, Stack, Typography, Skeleton } from "@mui/material";
import React, { useState } from "react";
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
  GetStockBinTypeInfo,
  UploadIntermediarySalesReturn,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import secureLocalStorage from "react-secure-storage";
import { MenuConstants } from "../../../Common/MenuConstants";
import { UploadContentSkeleton } from "../../../Common/SkeletonComponents";
import NuralUploadSaleReturn from "../../NuralCustomComponents/NuralUploadSaleReturn";

// Radio buttons selection by default
const options = [
  { value: "interface", label: "Interface" },
  { value: "batch", label: "Batch" },
];
// Dropdown field
const option = [
  { id: 1, name: "Full Template" },
  { id: 2, name: "Serial Only" },
];
const log = JSON.parse(localStorage.getItem("log")) || {};

// console.log(log)
const IntermediarySaleReturn = () => {
  const [activeTab, setActiveTab] = React.useState("intermediary-sale-return");
  const navigate = useNavigate();
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [selectedFormat, setSelectedFormat] = React.useState("batch");
  const fileInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // New state for userId
  // console.log("selectedUserId", selectedDate);
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleUserIdChange = (newUserId) => {
    setSelectedUserId(newUserId); // Update userId in parent
    console.log("Selected userId:", newUserId);
  };
  // Format the selectedDate to YYYY-MM-DD
  let formattedDate = null;
  if (selectedDate) {
    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so +1
    const day = dateObj.getDate().toString().padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`; // e.g., "2025-03-24"
  }
  const tabs = [
    { label: "Primary", value: "primary-sale-return" },
    { label: "Intermediary", value: "intermediary-sale-return" },
    { label: "Secondary", value: "secondary-sale-return" },
    // { label: "Tertiary", value: "tertiary" },
  ];

  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("View Template 1"),
      onDownload: () => {
        setIsLoading(true);
        setTimeout(() => {
          window.location.href =
            "http://moto.nuralsales.com/Excel/Templates/IntermediarySalesSB.xlsx";
          setIsLoading(false);
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
      navigate("#");
    } else if (value === "batch") {
      navigate("#");
    }
  };

  const handleBinCodeClick = async () => {
    setIsLoading(true);
    try {
      let res = await GetStockBinTypeInfo();

      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;

        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      } else {
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setStatus(error.status || 500);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReferenceClick = async () => {
    setIsLoading(true);
    let body = {
      reqType: 2,
      entityId: log.entityId /*from login api*/,
      salesChanneLevel: 0,
      brandID: 0,
      targetName: "",
      countryID: 1,
    };
    try {
      let res = await GetAllTemplateDataV2(body);
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      } else {
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setStatus(error.status || 500);
      setTitle(error.statusMessage || "Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(formattedDate);
  const handleUploadClick = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) {
      setStatus(String(400));
      setTitle("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);
    const formData = new FormData();
    console.log("formData", formData);
    formData.append("UploadedFile", fileInput.files[0]);

    try {
      let res = await UploadIntermediarySalesReturn(
        formData,
        formattedDate,
        selectedUserId
      );
      if (res.statusCode == 200) {
        fileInput.value = "";
        setStatus(String(res.statusCode));
        setTitle("File uploaded successfully");
        setTimeout(handleClearStatus, 3000);
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
    setStatus(null);
    setTitle(null);
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
        mt={1}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          ml: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="Sales Return" />
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
                <NuralUploadSaleReturn
                  title="Upload Format"
                  onChange={handleFormatChange}
                  backgroundColor={LIGHT_GRAY2}
                  options={options}
                  value={selectedFormat}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  option={option}
                  onUserIdChange={handleUserIdChange} // Pass callback to update userId
                  selectedUserId={selectedUserId} // Pass selected userId to control the autocomplete
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
                  referenceIcon1={"./Icons/downloadIcon.svg"}
                  referenceIcon2={"./Icons/downloadIcon.svg"}
                  title="Templates"
                  templates={templates}
                  buttons={true}
                  eye={false}
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
                />
              </Grid>
              <Grid item md={6} lg={6} pr={2}>
                {status && title && (
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
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleClearStatus}
                      width="100%"
                      disabled={isUploading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
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

export default IntermediarySaleReturn;