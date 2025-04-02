import { Grid, Typography, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  WHITE,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
// import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";

import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
// import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";

import {
  GetAllTemplateDataV2,
  GetPriceListName,
  UploadPriceList,
} from "../../../Api/Api";
import { templateUrl } from "../../../Common/urls";
import StatusModel from "../../../Common/StatusModel";
import { UploadPageSkeleton } from "../../../Common/SkeletonComponents";

// Get the template URL from environment variables
const templates = [
  {
    name: "Template 1",
    onDownload: () => {
      window.location.href = `${templateUrl}PriceMaster.xlsx`;
    },
  },
];

const PriceListName = () => {
  const [priceListDrop, setPriceListDrop] = useState([]);
  const fileInputRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("success");
  const [title, setTitle] = useState("Upload Successful");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    priceListID: null,
    effectiveDate: "",
    status: 1,
    mapWithAllState: 0,
    stateidstring: "",
  });

  useEffect(() => {
    fetchPriceListDropdown();
  }, []);
  const validateField = (name, value) => {
    switch (name) {
      case "priceListID":
        return !value ? "Price List is required" : "";
      case "effectiveDate":
        return !value ? "Effective Date is required" : "";

      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchPriceListDropdown = async () => {
    setIsLoading(true);
    let body = {
      Status: 1,
      Condition: 0 /*0 for Active Price List */,
    };
    try {
      const res = await GetPriceListName(body);
      if (res.statusCode == 200) {
        setPriceListDrop(res.priceList);
      } else {
        setPriceListDrop([]);
      }
    } catch (error) {
      console.log(error);
      setPriceListDrop([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    setIsLoading(true);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);

    // If there are validation errors, return early
    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.[0]) {
      setShowStatus(true);
      setStatus(String(400));
      setTitle("Please select a file to upload");
      setIsLoading(false);
      return;
    }
    let file = fileInput.files[0];

    try {
      const res = await UploadPriceList(formData, file);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        // Reset form
        fileInput.value = "";
        setFormData({
          priceListID: null,
          effectiveDate: "",
          status: 1,
          mapWithAllState: 0,
          stateidstring: "",
        });
        // Clear errors after successful upload
        setErrors({});
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        window.location.href = res.invalidDataLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Internal Server Error");
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceClick = async () => {
    setIsLoading(true);
    let body = {
      reqType: 6,
      entityId: 0 /*from login api*/,
      salesChanneLevel: 0,
      brandID: 0,
      targetName: "",
      countryID: 1,
    };

    try {
      const res = await GetAllTemplateDataV2(body);

      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        window.location.href = res.referenceDataLink;
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.statusCode);
      setTitle(error.statusMessage || "Internal Server Error");
      console.error("Error fetching reference data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset file
    setFile(null);
    setErrors({});
    // Reset form data
    setFormData({
      priceListID: null,
      effectiveDate: "",
      status: 1,
      mapWithAllState: 0,
      stateidstring: "",
    });
    // Hide status model
    setShowStatus(false);
  };

  const handleFileSelect = () => {
    setShowStatus(false);
  };

  return (
    <>
      {isLoading ? (
        <UploadPageSkeleton />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12} sx={{ pr: 2 }} ml={2}>
            <NuralAccordion2
              title="Create Price List"
              backgroundColor={WHITE}
              width
            >
              <Grid container spacing={2} p={0}>
                <Grid item xs={12} md={6} lg={6}>
                  <Grid
                    container
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      borderRadius: 2,
                      p: 2,
                      pb: 4,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: DARK_PURPLE,
                        mb: 3,
                      }}
                    >
                      Add Price List
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: DARK_PURPLE,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          PRICE LIST
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={priceListDrop}
                          getOptionLabel={(option) => option.priceListName}
                          placeholder="SELECT"
                          isOptionEqualToValue={(option, value) =>
                            option?.priceListID === value?.priceListID
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "priceListID",
                              newValue?.priceListID || null,
                              newValue
                            );
                          }}
                          value={
                            priceListDrop.find(
                              (option) =>
                                option.priceListID === formData.priceListID
                            ) || null
                          }
                          error={!!errors.priceListID}
                        />
                        {errors.priceListID && (
                          <FormHelperText error>
                            {errors.priceListID}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: DARK_PURPLE,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                          }}
                        >
                          EFFECTIVE DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YYYY"
                          backgroundColor={WHITE}
                          value={formData.effectiveDate}
                          onChange={(date) => {
                            // Format date to YYYY-MM-DD
                            const formattedDate = date
                              ? new Date(date).toISOString().split("T")[0]
                              : "";
                            handleChange("effectiveDate", formattedDate);
                          }}
                          error={!!errors.effectiveDate}
                        />
                        {errors.effectiveDate && (
                          <FormHelperText error>
                            {errors.effectiveDate}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <NuralAccordion
                      titleColor={DARK_PURPLE}
                      buttonColor={PRIMARY_BLUE2}
                      buttonBg={MEDIUM_BLUE}
                      backgroundColor={LIGHT_GRAY2}
                      width="100%"
                      // referenceIcon1={"./Icons/downloadIcon.svg"}
                      referenceIcon2={"./Icons/downloadIcon.svg"}
                      onClickReference={handleReferenceClick}
                      title="Templates"
                      templates={templates}
                      buttons={true}
                      eye={false}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <NuralFileUpload
                        width="100%"
                        fileRef={fileInputRef}
                        accept=".xlsx,.xls"
                        onFileSelect={handleFileSelect}
                      />
                    </Grid>
                    <Grid item pr={2}>
                      {showStatus && (
                        <StatusModel
                          width="100%"
                          height="160px"
                          status={status}
                          title={title}
                        />
                      )}
                    </Grid>

                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={handleCancel}
                            width="100%"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <NuralButton
                            text="PROCEED"
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handlePost}
                            width="100%"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </NuralAccordion2>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PriceListName;
