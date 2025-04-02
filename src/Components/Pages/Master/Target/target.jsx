import {
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_BLUE,
  WHITE,
  BLACK,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import { useNavigate } from "react-router-dom";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import {
  GetCityListForDropdown,
  GetRegionListDropdown,
  GetStateListForDropdown,
  GetTargetForDropdown,
  GetTargetReferenceCode,
  UploadTarget,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { UploadPageSkeleton } from "../../../Common/SkeletonComponents";
const options = [
  { value: "all", label: "ALL" },
  { value: "custom", label: "CUSTOM" },
];

const targetTypeOptions = [
  { value: 1, label: "QTY" },
  { value: 2, label: "VALUE" },
];

const targetBasedOnOptions = [
  { value: 1, label: "SALE" },
  { value: 2, label: "PURCHASE" },
];

const targetCategoryOptions = [
  { value: 1, label: "SKU" },
  { value: 2, label: "BRAND" },
  { value: 3, label: "PRODUCT CATEGORY (SUBCATEGORY)" },
  { value: 4, label: "PRODUCT (CATEGORY)" },
  { value: 5, label: "CONSOLIDATED" },
];

const tabs = [
  { label: "Add Target", value: "target" },
  { label: "Search", value: "view-target" },
];

const templates = [
  {
    name: "Template 1",
    onView: () => console.log("Reference Data 1"),
    onDownload: () => console.log("Download Reference Data 1"),
  },
];
const Target = () => {
  const [activeTab, setActiveTab] = React.useState("target");
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const [title, setTitle] = useState("");
  const [targetForDrop, setTargetForDrop] = useState([]);
  const [regionDrop, setRegionDrop] = useState([]);
  const [stateDrop, setStateDrop] = useState([]);
  const [cityDrop, setCityDrop] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    targetFor: false,
    region: false,
    state: false,
    city: false,
    upload: false,
    reference: false
  });
  const [errors, setErrors] = useState({
    targetName: "",
    targetUserTypeID: "",
    targetCategory: "",
    regionID: "",
    stateID: "",
    cityID: "",
    targetType: "",
    targetBasedOn: "",
    targetFrom: "",
    targetTo: "",
  });

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [formData, setFormData] = useState({
    targetName: "",
    regionID: 0,
    stateID: 0,
    cityID: 0,
    targetType: "",
    targetBasedOn: "",
    targetUserTypeID: "",
    targetCategory: "",
    targetFrom: "",
    targetTo: "",
  });

  useEffect(() => {
    fetchRegionListDropdown();
    getTargetForDropdown();
  }, []);

  const getTargetForDropdown = async () => {
    setLoading((prev) => ({ ...prev, targetFor: true }));
    const body = {
      callType: 4, //4 will be pass
    };

    try {
      let res = await GetTargetForDropdown(body);
      if (res.statusCode == 200) {
        setTargetForDrop(res.targetForDropdownList);
      } else {
        setTargetForDrop([]);
      }
    } catch (error) {
      console.error("Error in getTargetForDropdown:", error);
    } finally {
      setLoading((prev) => ({ ...prev, targetFor: false }));
    }
  };

  const getStateListForDropdown = async (regionID) => {
    setLoading((prev) => ({ ...prev, state: true }));
    const body = {
      countryID: 1,
      regionID: regionID,
      stateID: 0,
    };

    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDrop(res.stateDropdownList);
      } else {
        setStateDrop([]);
      }
    } catch (error) {
      console.error("Error in getStateListForDropdown:", error);
    } finally {
      setLoading((prev) => ({ ...prev, state: false }));
    }
  };

  const getCityListForDropdown = async (stateID) => {
    setLoading((prev) => ({ ...prev, city: true }));
    const body = {
      searchConditions: 1, //it will be 1
      stateID: stateID,
      cityID: 0,
    };

    try {
      let res = await GetCityListForDropdown(body);
      if (res.statusCode == 200) {
        setCityDrop(res.cityDropdownList);
      } else {
        setCityDrop([]);
      }
    } catch (error) {
      console.error("Error in getCityListForDropdown:", error);
    } finally {
      setLoading((prev) => ({ ...prev, city: false }));
    }
  };

  const fetchRegionListDropdown = async () => {
    setLoading((prev) => ({ ...prev, region: true }));
    const body = {
      countryID: 1,
      regionID: 0,
    };
    try {
      const res = await GetRegionListDropdown(body);
      if (res.statusCode == 200) {
        setRegionDrop(res.regionDropdownList);
      } else {
        setRegionDrop([]);
      }
    } catch (error) {
      console.error("Error in fetchRegionListDropdown:", error);
    } finally {
      setLoading((prev) => ({ ...prev, region: false }));
    }
  };

  const handleChange = (field, value) => {
    // Clear error for the field being changed
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "regionID") {
      if (value) {
        getStateListForDropdown(value);
      } else {
        setStateDrop([]);
        setCityDrop([]);
        setFormData((prev) => ({
          ...prev,
          stateID: null,
          cityID: null,
        }));
      }
    }
    if (field === "stateID") {
      if (value) {
        getCityListForDropdown(value);
      } else {
        setCityDrop([]);
        setFormData((prev) => ({
          ...prev,
          cityID: null,
        }));
      }
    }

    // Handle date validation
    if (field === "targetFrom" || field === "targetTo") {
      const fromDate = field === "targetFrom" ? value : formData.targetFrom;
      const toDate = field === "targetTo" ? value : formData.targetTo;
      
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        if (from > to) {
          setErrors((prev) => ({
            ...prev,
            targetFrom: "Target From date cannot be greater than Target To date",
          }));
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReference = async () => {
    setLoading((prev) => ({ ...prev, reference: true }));
    const body = {
      reqType: 1, //1 will be pass
    };

    try {
      let res = await GetTargetReferenceCode(body);
      if (res.statusCode == 200) {
        window.location.href = res.referenceDataLink;
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
      setStatus(error.status);
      setTitle(error.statusMessage);
      console.error("Error in handleReference:", error);
    } finally {
      setLoading((prev) => ({ ...prev, reference: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      targetName: "",
      targetUserTypeID: "",
      targetCategory: "",
      regionID: "",
      stateID: "",
      cityID: "",
      targetType: "",
      targetBasedOn: "",
      targetFrom: "",
      targetTo: "",
    };

    let isValid = true;

    if (!formData.targetName.trim()) {
      newErrors.targetName = "Target Name is required";
      isValid = false;
    }

    if (!formData.targetUserTypeID) {
      newErrors.targetUserTypeID = "Target For is required";
      isValid = false;
    }

    if (!formData.targetCategory) {
      newErrors.targetCategory = "Target Category is required";
      isValid = false;
    }

    if (!formData.regionID) {
      newErrors.regionID = "Region is required";
      isValid = false;
    }

    if (!formData.stateID) {
      newErrors.stateID = "State is required";
      isValid = false;
    }

    if (!formData.cityID) {
      newErrors.cityID = "City is required";
      isValid = false;
    }

    if (!formData.targetType) {
      newErrors.targetType = "Target Type is required";
      isValid = false;
    }

    if (!formData.targetBasedOn) {
      newErrors.targetBasedOn = "Target Based On is required";
      isValid = false;
    }

    if (!formData.targetFrom) {
      newErrors.targetFrom = "Target From date is required";
      isValid = false;
    }

    if (!formData.targetTo) {
      newErrors.targetTo = "Target To date is required";
      isValid = false;
    }

    // Validate date range
    if (formData.targetFrom && formData.targetTo) {
      const fromDate = new Date(formData.targetFrom);
      const toDate = new Date(formData.targetTo);
      if (fromDate > toDate) {
        newErrors.targetFrom = "Target From date cannot be greater than Target To date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      targetName: "",
      regionID: 0,
      stateID: 0,
      cityID: 0,
      targetType: "",
      targetBasedOn: "",
      targetUserTypeID: "",
      targetCategory: "",
      targetFrom: "",
      targetTo: "",
    });

    // Reset errors
    setErrors({
      targetName: "",
      targetUserTypeID: "",
      targetCategory: "",
      regionID: "",
      stateID: "",
      cityID: "",
      targetType: "",
      targetBasedOn: "",
      targetFrom: "",
      targetTo: "",
    });

    // Reset file related states
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Reset dropdowns
    setStateDrop([]);
    setCityDrop([]);
  };

  const handlePostClick = async () => {
    // First validate the form
    if (!validateForm()) {
      setShowStatus(true);
      setStatus(400);
      setTitle("Please fill all required fields correctly");
      return;
    }

    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.[0]) {
      setShowStatus(true);
      setStatus(400);
      setTitle("Please select a file to upload");
      return;
    }

    setLoading((prev) => ({ ...prev, upload: true }));
    const file = fileInput.files[0];

    try {
      let res = await UploadTarget(formData, file);

      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        handleCancel(); // Reset form on success
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        window.location.href = res.invalidDataLink;
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status);
      setTitle(error.statusMessage);
      console.error("Upload error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      setShowStatus(false);
      setStatus(false);
      setTitle("");
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ position: "relative" }}>
        {" "}
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
            <BreadcrumbsHeader pageTitle="Target" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>
        {Object.values(loading).some(value => value) ? (
          <UploadPageSkeleton />
        ) : (
          <Grid container spacing={2} p={2}>
            <Grid item xs={12} sx={{ pr: 2, mb: 0 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Create Target"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    {/* First Row - 1 TextField + 2 Dropdowns */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
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
                          TARGET NAME
                        </Typography>
                        <NuralTextField
                          width="100%"
                          value={formData.targetName}
                          onChange={(e) =>
                            handleChange("targetName", e.target.value)
                          }
                          placeholder="ENTER TARGET NAME"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.targetName}
                        />
                        {errors.targetName && (
                          <FormHelperText error>
                            {errors.targetName}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                          TARGET FOR
                        </Typography>
                        <NuralAutocomplete
                          label="TARGET FOR"
                          options={targetForDrop}
                          placeholder="SELECT"
                          width="100%"
                          loading={loading.targetFor}
                          getOptionLabel={(option) => option.entityType || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.entityTypeID === value?.entityTypeID
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "targetUserTypeID",
                              newValue?.entityTypeID || null
                            );
                          }}
                          value={
                            targetForDrop.find(
                              (option) =>
                                option.entityTypeID === formData.targetUserTypeID
                            ) || null
                          }
                          error={!!errors.targetUserTypeID}
                        />
                        {errors.targetUserTypeID && (
                          <FormHelperText error>
                            {errors.targetUserTypeID}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                          TARGET CATEGORY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={targetCategoryOptions}
                          getOptionLabel={(option) => option.label || ""}
                          onChange={(event, newValue) => {
                            handleChange(
                              "targetCategory",
                              newValue?.value || null
                            );
                          }}
                          value={
                            targetCategoryOptions.find(
                              (option) => option.value === formData.targetCategory
                            ) || null
                          }
                          error={!!errors.targetCategory}
                        />
                        {errors.targetCategory && (
                          <FormHelperText error>
                            {errors.targetCategory}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>

                    {/* Second Row - 4 Dropdowns */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={4}>
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
                          REGION
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={regionDrop}
                          loading={loading.region}
                          getOptionLabel={(option) => option.regionName || ""}
                          onChange={(event, newValue) => {
                            handleChange("regionID", newValue?.regionID || null);
                          }}
                          value={
                            regionDrop.find(
                              (option) => option.regionID === formData.regionID
                            ) || null
                          }
                          error={!!errors.regionID}
                        />
                        {errors.regionID && (
                          <FormHelperText error>{errors.regionID}</FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                          STATE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={stateDrop}
                          loading={loading.state}
                          getOptionLabel={(option) => option.stateName || ""}
                          onChange={(event, newValue) => {
                            handleChange("stateID", newValue?.stateID || null);
                          }}
                          value={
                            stateDrop.find(
                              (option) => option.stateID === formData.stateID
                            ) || null
                          }
                          error={!!errors.stateID}
                        />
                        {errors.stateID && (
                          <FormHelperText error>{errors.stateID}</FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                          CITY
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={cityDrop}
                          loading={loading.city}
                          getOptionLabel={(option) => option.cityName || ""}
                          onChange={(event, newValue) => {
                            handleChange("cityID", newValue?.cityID || null);
                          }}
                          value={
                            cityDrop.find(
                              (option) => option.cityID === formData.cityID
                            ) || null
                          }
                          error={!!errors.cityID}
                        />
                        {errors.cityID && (
                          <FormHelperText error>{errors.cityID}</FormHelperText>
                        )}
                      </Grid>
                    </Grid>

                    {/* Third Row - 2 Dropdowns + 2 TextFields */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={4}>
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
                          TARGET TYPE
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={targetTypeOptions}
                          getOptionLabel={(option) => option.label || ""}
                          onChange={(event, newValue) => {
                            handleChange("targetType", newValue?.value || null);
                          }}
                          value={
                            targetTypeOptions.find(
                              (option) => option.value === formData.targetType
                            ) || null
                          }
                          error={!!errors.targetType}
                        />
                        {errors.targetType && (
                          <FormHelperText error>
                            {errors.targetType}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                          TARGET BASED ON
                        </Typography>
                        <NuralAutocomplete
                          placeholder="SELECT"
                          width="100%"
                          options={targetBasedOnOptions}
                          getOptionLabel={(option) => option.label || ""}
                          onChange={(event, newValue) => {
                            handleChange(
                              "targetBasedOn",
                              newValue?.value || null
                            );
                          }}
                          value={
                            targetBasedOnOptions.find(
                              (option) => option.value === formData.targetBasedOn
                            ) || null
                          }
                          error={!!errors.targetBasedOn}
                        />
                        {errors.targetBasedOn && (
                          <FormHelperText error>
                            {errors.targetBasedOn}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={2}>
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
                          TARGET FROM
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          value={formData.targetFrom}
                          onChange={(date) => {
                            const formattedDate = date
                              ? new Date(date).toISOString().split("T")[0]
                              : "";
                            handleChange("targetFrom", formattedDate);
                          }}
                          placeholder="DD/MMM/YYYY"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.targetFrom}
                        />
                        {errors.targetFrom && (
                          <FormHelperText error>
                            {errors.targetFrom}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={2}>
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
                          TARGET TO
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          value={formData.targetTo}
                          onChange={(date) => {
                            const formattedDate = date
                              ? new Date(date).toISOString().split("T")[0]
                              : "";
                            handleChange("targetTo", formattedDate);
                          }}
                          placeholder="DD/MMM/YYYY"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.targetTo}
                        />
                        {errors.targetTo && (
                          <FormHelperText error>{errors.targetTo}</FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                  <Grid container spacing={2} sx={{ marginTop: 0, pr: 0 }}>
                    {/* Left Side - Templates Accordion */}
                    <Grid item xs={12} md={6} lg={6}>
                      <NuralAccordion
                        titleColor={DARK_PURPLE}
                        buttonColor={PRIMARY_BLUE2}
                        buttonBg={MEDIUM_BLUE}
                        backgroundColor={LIGHT_GRAY2}
                        width="100%"
                        // referenceIcon1={"./Icons/downloadIcon.svg"}
                        referenceIcon2={"./Icons/downloadIcon.svg"}
                        title="Templates"
                        onClickReference={handleReference}
                        templates={templates}
                        buttons={true}
                        eye={false}
                      />
                    </Grid>

                    {/* Right Side - File Upload */}
                    <Grid item xs={12} md={6} lg={6}>
                      <Grid item>
                        <NuralFileUpload
                          mandatory
                          backgroundColor={LIGHT_GRAY2}
                          fileRef={fileInputRef}
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileChange}
                          selectedFile={selectedFile}
                        />
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} mt={2} pr={2}>
                        {showStatus && (
                          <StatusModel
                            width="100%"
                            status={status}
                            title={title}
                          />
                        )}
                      </Grid>
                      <Grid container spacing={1} mt={1} mb={2}>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="CANCEL"
                            variant="outlined"
                            borderColor={PRIMARY_BLUE2}
                            onClick={()=>{
                              handleCancel();
                              setShowStatus(false);
                              setStatus(0);
                              setTitle("");
                            }}
                            width="98%"
                          />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <NuralButton
                            text="PROCEED"
                            backgroundColor={AQUA}
                            variant="contained"
                            onClick={handlePostClick}
                            width="98%"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Target;
