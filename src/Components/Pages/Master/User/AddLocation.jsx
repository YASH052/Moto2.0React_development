import { Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";

import NuralButton from "../../NuralCustomComponents/NuralButton";

import NuralTextField from "../../NuralCustomComponents/NuralTextField";

import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";

import StatusModel from "../../../Common/StatusModel";
import useHttp from "../../../../hooks.js/use-http";
import { UserMasterAPI } from "../Competiton/api";
import Required from "../../../Common/Required";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
  ];

// Helper function to determine required fields based on hierarchy
const getRequiredFieldsConfig = (hierarchyLevelName) => {
  const config = {
    hierarchyLevelID: true, // Always required
    parentOrgnhierarchyID: !!hierarchyLevelName && hierarchyLevelName !== "HO",
    countryId: false,
    RegionId: false,
    StateId: false,
    CityId: false,
    // Location Name and Code are implicitly always required by existing validation
  };

  if (hierarchyLevelName) {
    if (hierarchyLevelName === "HO" || hierarchyLevelName === "NSM") {
      config.countryId = true;
    } else if (hierarchyLevelName === "RSM") {
      config.countryId = true;
      config.RegionId = true;
    } else if (hierarchyLevelName === "ASM") {
      config.countryId = true;
      config.RegionId = true;
      config.StateId = true;
    } else if (hierarchyLevelName === "5SM") { // Added 5SM
      config.countryId = true;
      config.RegionId = true;
      config.StateId = true;
      config.CityId = true;
    } else if (hierarchyLevelName === "TSM") { // Added TSM
      config.countryId = true;
      config.RegionId = true;
      config.StateId = true;
      config.CityId = true;
    }
  }
  return config;
};

// Helper function to determine disabled state of fields based on hierarchy
const getDisabledFieldsState = (hierarchyLevelName) => {
  const disabled = {
    RegionId: false,
    StateId: false,
    CityId: false,
  };

  if (hierarchyLevelName) {
    if (hierarchyLevelName === "HO" || hierarchyLevelName === "NSM") {
      disabled.RegionId = true;
      disabled.StateId = true;
      disabled.CityId = true;
    } else if (hierarchyLevelName === "RSM") {
      disabled.StateId = true;
      disabled.CityId = true;
    } else if (hierarchyLevelName === "ASM") {
      disabled.CityId = true;
    }
    // TSM and 5SM do not have specific disabling rules here, they enable all.
  }
  return disabled;
};

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

const AddLocation = ({
  editingLocation,
  onCancelEdit,
  onCreationSuccess,
  isExpanded,
  onAccordionChange,
}) => {
  const api = useHttp();
  const reportingApi = useHttp();

  const [hierarchyList, setHierarchyList] = React.useState([]);
  const [reportingHierarchyList, setReportingHierarchyList] = useState([]);
  const [countryList, setCountryList] = React.useState([]);
  const [regionList, setRegionList] = React.useState([]);
  const [stateList, setStateList] = React.useState([]);
  const [cityList, setCityList] = React.useState([]);
  const [orgFormData, setOrgFormData] = React.useState({
    orgnhierarchyID: 0, // 0 = in case of saving
    hierarchyLevelID: 0,
    parentOrgnhierarchyID: 0,
    countryId: 0,
    RegionId: 0,
    StateId: 0,
    CityId: 0,
    locationName: "",
    locationCode: "",
    status: 1,
  });
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const statusTimerRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.sendRequest(
      UserMasterAPI.hierarchyDropdown,
      (response) => {
        if (response.statusCode === "200") {
          setHierarchyList(response.hierarchyLevelList || []);
        } else {
          setHierarchyList([]);
        }
      },
      {
        condition: "2", //0- for all, 1= like condition,2-specific condtion for DSR, 3-specific condition
        // send only 2 for ManageOrgnHierarchy
        HierarchyLevelName: "",
      },
      null,
      (error) => {
        console.error("Error fetching hierarchy data:", error);
        setHierarchyList([]);
      }
    );
  }, []);

  useEffect(() => {
    if (orgFormData.hierarchyLevelID) {
      reportingApi.sendRequest(
        UserMasterAPI.reportingHierarchyDropdown,
        (response) => {
          console.log("Reporting Hierarchy response:", response);
          if (response.statusCode === "200") {
            setReportingHierarchyList(response?.parentHierarchyList || []);
          } else {
            console.error(
              "Failed to fetch reporting hierarchy:",
              response.statusMessage
            );
            setReportingHierarchyList([]);
          }
        },
        {
          HierarchyLevelID: orgFormData.hierarchyLevelID,
          CountryID: 0, // No value will be sent for now
        },
        null,
        (error) => {
          console.error("Error fetching reporting hierarchy:", error);
          setReportingHierarchyList([]);
        }
      );
    } else {
      setReportingHierarchyList([]);
      setOrgFormData((prev) => ({ ...prev, parentOrgnhierarchyID: 0 }));
    }
  }, [orgFormData.hierarchyLevelID]);

  useEffect(() => {
    reportingApi.sendRequest(
      UserMasterAPI.countryDropdown,
      (response) => {
        console.log("Country response:", response);
        if (response.statusCode === "200") {
          setCountryList(response?.countryMasterList || []);
        } else {
          console.error(
            "Failed to fetch country list:",
            response.statusMessage
          );
          setCountryList([]);
        }
      },
      {
        CountryName: "",
        CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
        pageIndex: 1 /*-1 for export to excel */,
        pageSize: 10,
      },
      null,
      (error) => {
        console.error("Error fetching country list:", error);
        setCountryList([]);
      }
    );
  }, []);

  useEffect(() => {
    if (orgFormData.countryId) {
      reportingApi.sendRequest(
        UserMasterAPI.regionDropdown,
        (response) => {
          console.log("Country response:", response);
          if (response.statusCode === "200") {
            setRegionList(response?.regionDropdownList || []);
          } else {
            console.error(
              "Failed to fetch region list:",
              response.statusMessage
            );
            setRegionList([]);
          }
        },
        {
          countryID: orgFormData.countryId,
          regionID: 0,
        },
        null,
        (error) => {
          console.error("Error fetching region list:", error);
          setRegionList([]);
        }
      );
    } else {
      setRegionList([]);
      setOrgFormData((prev) => ({
        ...prev,
        RegionId: 0,
        StateId: 0,
        CityId: 0
      }));
      setStateList([]);
      setCityList([]);
    }
  }, [orgFormData.countryId]);

  // Fetch State Dropdown
  useEffect(() => {
    if (orgFormData.RegionId) {
      reportingApi.sendRequest(
        UserMasterAPI.stateDropdown,
        (response) => {
          console.log("State response:", response);
          if (response.statusCode === "200") {
            setStateList(response?.stateDropdownList || []);
          } else {
            console.error(
              "Failed to fetch state list:",
              response.statusMessage
            );
            setStateList([]);
          }
        },
        {
          countryID: orgFormData.countryId,
          regionID: orgFormData.RegionId,
          stateID: 0,
        },
        null,
        (error) => {
          console.error("Error fetching state list:", error);
          setStateList([]);
        }
      );
    } else {
      setStateList([]);
      setOrgFormData((prev) => ({
        ...prev,
        StateId: 0,
        CityId: 0
      }));
      setCityList([]);
    }
  }, [orgFormData.RegionId]);

  // Fetch City Dropdown
  useEffect(() => {
    if (orgFormData.StateId) {
      reportingApi.sendRequest(
        UserMasterAPI.cityDropdown,
        (response) => {
          console.log("City response:", response);
          if (response.statusCode === "200") {
            setCityList(response?.cityDropdownList || []);
          } else {
            console.error("Failed to fetch city list:", response.statusMessage);
            setCityList([]);
          }
        },
        {
          searchConditions: 1, // Based on City.jsx
          stateID: orgFormData.StateId,
          cityID: 0,
        },
        null,
        (error) => {
          console.error("Error fetching city list:", error);
          setCityList([]);
        }
      );
    } else {
      setCityList([]);
      setOrgFormData((prev) => ({ ...prev, CityId: "" }));
    }
  }, [orgFormData.StateId]);

  // Add useEffect to handle auto-dismiss for success messages
  useEffect(() => {
    // Only set timer for success messages (status code 200)
    if (status === "200") {
      // Clear any existing timer
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }

      // Set new timer to clear status after 5 seconds
      statusTimerRef.current = setTimeout(() => {
        setStatus(null);
        setStatusMessage("");
      }, 5000); // 5000ms = 5 seconds
    }

    // Cleanup function to clear timer when component unmounts or status changes
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [status]); // Only run effect when status changes

  // Add useEffect to handle editingLocation changes
  useEffect(() => {
    if (editingLocation) {
      setOrgFormData({
        orgnhierarchyID: editingLocation.orgnhierarchyID || "",
        hierarchyLevelID: editingLocation.hierarchyLevelID || 0,
        parentOrgnhierarchyID: editingLocation.parentOrgnhierarchyID || 0,
        countryId: editingLocation.countryID || 0,
        RegionId: editingLocation.regionID || 0,
        StateId: editingLocation.stateID || 0,
        CityId: editingLocation.cityID || 0,
        locationName: editingLocation.locationName || "",
        locationCode: editingLocation.locationCode || "",
        status: editingLocation.status || 1,
      });
    } else {
      // Reset form if editingLocation becomes null (e.g., after cancel/save)
      handleCancel(false); // Pass false to avoid calling onCancelEdit again
    }
  }, [editingLocation]);

  // Add handleCancel function
  const handleCancel = (notifyParent = true) => {
    // Reset form data
    const updatedForm = {
      orgnhierarchyID: 0,
      hierarchyLevelID: 0,
      parentOrgnhierarchyID: 0,
      countryId: 0,
      RegionId: 0,
      StateId: 0,
      CityId: 0,
      locationName: "",
      locationCode: "",
      status: 1,
    };
    setOrgFormData(updatedForm);


    setErrors({});

    // Clear status and message
    setStatus(null);
    setStatusMessage("");

    // Clear dependent dropdowns
    setRegionList([]);
    setStateList([]);
    setCityList([]);
    setReportingHierarchyList([]);

    // Notify parent to clear editing state
    if (notifyParent && onCancelEdit) {
      onCancelEdit();
    }
  };

  // Validation Function
  const validateForm = () => {
    const newErrors = {};
    const selectedHierarchy = hierarchyList.find(
      (h) => h.hierarchyLevelID === orgFormData.hierarchyLevelID
    );
    const hierarchyLevelName = selectedHierarchy?.hierarchyLevelName;
    const requiredFields = getRequiredFieldsConfig(hierarchyLevelName);

    if (requiredFields.hierarchyLevelID && (!orgFormData.hierarchyLevelID || orgFormData.hierarchyLevelID === 0)) {
      newErrors.hierarchyLevelID = "Hierarchy Level is required";
    }
    if (requiredFields.parentOrgnhierarchyID && (!orgFormData.parentOrgnhierarchyID || orgFormData.parentOrgnhierarchyID === 0)) {
      newErrors.parentOrgnhierarchyID = "Reporting Hierarchy is required";
    }
    if (requiredFields.countryId && (!orgFormData.countryId || orgFormData.countryId === 0)) {
      newErrors.countryId = 'Country is required' + (hierarchyLevelName ? ' for ' + hierarchyLevelName : '');
    }
    if (requiredFields.RegionId && (!orgFormData.RegionId || orgFormData.RegionId === 0)) {
      newErrors.RegionId = 'Region is required' + (hierarchyLevelName ? ' for ' + hierarchyLevelName : '');
    }
    if (requiredFields.StateId && (!orgFormData.StateId || orgFormData.StateId === 0)) {
      newErrors.StateId = 'State is required' + (hierarchyLevelName ? ' for ' + hierarchyLevelName : '');
    }
    if (requiredFields.CityId && (!orgFormData.CityId || orgFormData.CityId === 0)) {
      newErrors.CityId = 'City is required' + (hierarchyLevelName ? ' for ' + hierarchyLevelName : '');
    }

    // Existing validations for Location Name and Code
    if (!orgFormData.locationName || orgFormData.locationName.trim() === "") {
      newErrors.locationName = "Location Name is required";
    } else if (orgFormData.locationName.length > 20) {
      newErrors.locationName = "Location Name cannot exceed 20 characters";
    } else if (!/^[a-zA-Z0-9 -]+$/.test(orgFormData.locationName)) {
      newErrors.locationName =
        "Location Name can only contain alphanumeric characters, spaces, and hyphens";
    }

    if (!orgFormData.locationCode) {
      newErrors.locationCode = "Location Code is required";
    } else if (orgFormData.locationCode.length > 20) {
      newErrors.locationCode = "Location Code cannot exceed 20 characters";
    } else if (!/^[a-zA-Z0-9-]+$/.test(orgFormData.locationCode)) {
      newErrors.locationCode =
        "Location Code can only contain alphanumeric characters and hyphens (no spaces)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handlePostRequest = async () => {
    if (!validateForm()) {
      return; // Just return without showing status model for validation errors
    }

    const isCreating = !editingLocation; // Check if creating before API call
    const payload = {
      ...orgFormData,
      orgnhierarchyID: editingLocation ? editingLocation.orgnhierarchyID : 0, // Send ID for update, 0 for save
    };

    reportingApi.sendRequest(
      UserMasterAPI.saveUpdateOrgHierarchy,
      (response) => {
        console.log("Save Location Response:", response);
        setStatus(response.statusCode);
        setStatusMessage(
          response.statusMessage || "An unknown response occurred."
        );

        if (response.statusCode === "200") {
          // Reset form
          setOrgFormData({
            orgnhierarchyID: 0,
            hierarchyLevelID: 0,
            parentOrgnhierarchyID: 0,
            countryId: 0,
            RegionId: 0,
            StateId: 0,
            CityId: 0,
            locationName: "",
            locationCode: "",
            status: 1,
          });
          // Clear dependent lists only
          setRegionList([]);
          setStateList([]);
          setCityList([]);
          setReportingHierarchyList([]);
          // Notify parent to clear editing state after successful save/update
          if (onCancelEdit) {
            onCancelEdit();
          }
          if (isCreating && onCreationSuccess) {
            onCreationSuccess(); // Call refresh trigger only on create
          }
        }
      },
      payload,
      null,
      (error) => {
        console.error("Error saving location:", error);
        setStatus("500");
        setStatusMessage(error.message || "Failed to save location");
      }
    );
  };

  // Update handleChange function to handle dependent dropdowns
  const handleChange = (field, value) => {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      if (field === "hierarchyLevelID") {
        setOrgFormData((prev) => ({
          ...prev,
          hierarchyLevelID: 0,
          parentOrgnhierarchyID: 0, // Clear reporting hierarchy
        }));
        const newRequiredFields = getRequiredFieldsConfig(null); // Get config for no hierarchy
        const updatedErrors = { ...errors, hierarchyLevelID: "Hierarchy Level is required" };
        if (!newRequiredFields.countryId) delete updatedErrors.countryId;
        if (!newRequiredFields.RegionId) delete updatedErrors.RegionId;
        if (!newRequiredFields.StateId) delete updatedErrors.StateId;
        if (!newRequiredFields.CityId) delete updatedErrors.CityId;
        if (!newRequiredFields.parentOrgnhierarchyID) delete updatedErrors.parentOrgnhierarchyID;
        setErrors(updatedErrors);
        setReportingHierarchyList([]); // Clear reporting hierarchy list
        return;
      } else if (field === "countryId") {
        setOrgFormData((prev) => ({
          ...prev,
          countryId: 0,
          RegionId: 0, // Clear region
          StateId: 0, // Clear state
          CityId: 0, // Clear city
        }));
        // Only set country error if hierarchy is not HO
        const isHO =
          hierarchyList.find(
            (h) => h.hierarchyLevelID === orgFormData.hierarchyLevelID
          )?.hierarchyLevelName === "HO";
        if (!isHO) {
          setErrors((prev) => ({
            ...prev,
            countryId: "Country is required",
          }));
        }
        setRegionList([]); // Clear region list
        setStateList([]); // Clear state list
        setCityList([]); // Clear city list
        return;
      } else if (field === "RegionId") {
        setOrgFormData((prev) => ({
          ...prev,
          RegionId: 0,
          StateId: 0, // Clear state
          CityId: 0, // Clear city
        }));
        setStateList([]); // Clear state list
        setCityList([]); // Clear city list
        return;
      }
    }

    // Extract value from object if needed
    let newValue = value;
    if (typeof value === "object") {
      if (
        field === "hierarchyLevelID" &&
        value.hierarchyLevelID !== undefined
      ) {
        newValue = value.hierarchyLevelID;
      } else if (field === "countryId" && value.countryID !== undefined) {
        newValue = value.countryID;
      } else if (field === "RegionId" && value.regionID !== undefined) {
        newValue = value.regionID;
      }
    }

    // Update form data
    setOrgFormData((prev) => ({
      ...prev,
      [field]: field === "locationCode" ? newValue.trim().replace(/\s+/g, '') : newValue,
    }));

    // Clear error when valid value is entered for the current field
    // For other fields, errors are cleared/updated based on hierarchy change or on submit.
    if (newValue || (typeof newValue === 'number' && newValue !== 0) ) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Handle dependent dropdowns and error clearing for hierarchy changes
    if (field === "hierarchyLevelID") {
      const newHierarchyValue = newValue; // newValue is the hierarchyLevelID
      const selectedHierarchyObj = hierarchyList.find((h) => h.hierarchyLevelID === newHierarchyValue);
      const newHierarchyLevelName = selectedHierarchyObj?.hierarchyLevelName;

      const newDisabled = getDisabledFieldsState(newHierarchyLevelName);
      // const newRequired = getRequiredFieldsConfig(newHierarchyLevelName); // Already calculated for errors

      setOrgFormData(prev => {
        let updatedData = {
          ...prev,
          hierarchyLevelID: newHierarchyValue === null ? 0 : newHierarchyValue,
          // parentOrgnhierarchyID is reset when newHierarchyValue is 0 (handled earlier in the function)
          // or if newHierarchyLevelName is HO
          parentOrgnhierarchyID: (newHierarchyValue === null || newHierarchyValue === 0 || newHierarchyLevelName === "HO") ? 0 : prev.parentOrgnhierarchyID,
        };

        // Reset fields that become disabled by hierarchy change and their dependents
        if (newDisabled.RegionId) {
          if(updatedData.RegionId !== 0) updatedData.RegionId = 0;
          if(updatedData.StateId !== 0) updatedData.StateId = 0;
          if(updatedData.CityId !== 0) updatedData.CityId = 0;
          setRegionList([]);
          setStateList([]);
          setCityList([]);
        } else if (newDisabled.StateId) {
          // Region is not disabled, but State is
          if(updatedData.StateId !== 0) updatedData.StateId = 0;
          if(updatedData.CityId !== 0) updatedData.CityId = 0;
          setStateList([]); // State list might have been populated if region was selected
          setCityList([]);
        } else if (newDisabled.CityId) {
          // Region and State are not disabled, but City is
          if(updatedData.CityId !== 0) updatedData.CityId = 0;
          setCityList([]); // City list might have been populated if state was selected
        }
        return updatedData;
      });

      // Error clearing logic (existing, slightly adjusted for parentOrgnhierarchyID with HO)
      const updatedErrors = { ...errors };
      delete updatedErrors.countryId;
      delete updatedErrors.RegionId;
      delete updatedErrors.StateId;
      delete updatedErrors.CityId;
      // delete updatedErrors.parentOrgnhierarchyID; // Keep this deletion or re-evaluate based on immediate feedback needs

      if (!newHierarchyValue || newHierarchyValue === 0) {
        updatedErrors.hierarchyLevelID = "Hierarchy Level is required";
        delete updatedErrors.parentOrgnhierarchyID; // No parent if no hierarchy
      } else {
        delete updatedErrors.hierarchyLevelID;
        if (newHierarchyLevelName === "HO") {
          delete updatedErrors.parentOrgnhierarchyID; // HO has no parent
        }
      }
      setErrors(updatedErrors);

    } else if (field === "countryId") {
      // ... existing code ...
    } else if (field === "RegionId") {
      // ... existing code ...
    } else if (field === "StateId") {
      // ... existing code ...
    } else if (field === "CityId") {
      // ... existing code ...
    }

    // Validate specific fields (Location Name and Code) on change
    if (field === "locationName") {
      if (!newValue || newValue.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          locationName: "Location Name is required",
        }));
      } else if (newValue.length > 20) {
        setErrors((prev) => ({
          ...prev,
          locationName: "Location Name cannot exceed 20 characters",
        }));
      } else if (!/^[a-zA-Z0-9 -]+$/.test(newValue)) {
        setErrors((prev) => ({
          ...prev,
          locationName:
            "Location Name can only contain alphanumeric characters, spaces, and hyphens",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          locationName: "",
        }));
      }
    }

    if (field === "locationCode") {
      const processedValue = newValue.trim().replace(/\s+/g, '');
      if (!processedValue) {
        setErrors((prev) => ({
          ...prev,
          locationCode: "Location Code is required",
        }));
      } else if (processedValue.length > 20) {
        setErrors((prev) => ({
          ...prev,
          locationCode: "Location Code cannot exceed 20 characters",
        }));
      } else if (!/^[a-zA-Z0-9-]+$/.test(processedValue)) {
        setErrors((prev) => ({
          ...prev,
          locationCode:
            "Location Code can only contain alphanumeric characters and hyphens (no spaces)",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          locationCode: "",
        }));
      }
    }
  };

  const selectedHierarchy = hierarchyList.find(
    (h) => h.hierarchyLevelID === orgFormData.hierarchyLevelID
  );
  const currentHierarchyLevelName = selectedHierarchy?.hierarchyLevelName;
  const currentRequiredFields = getRequiredFieldsConfig(currentHierarchyLevelName);
  const currentDisabledFields = getDisabledFieldsState(currentHierarchyLevelName);

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Breadcrumbs Grid - Make it sticky with higher z-index */}

      {/* Rest of the content */}
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="Create Location"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                expanded={isExpanded}
                onChange={onAccordionChange}
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
                    marginBottom: "10px",
                    marginTop: "10px",
                    marginRight: "10px",
                    mb: 3,
                  }}
                >
                  Create Location
                </Typography>
                <Grid item xs={12} md={6} lg={6} mb={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 0,
                      color: PRIMARY_BLUE2,
                      fontFamily: "Manrope",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "13.66px",
                      letterSpacing: "4%",
                    }}
                  >
                    SELECT MODE
                  </Typography>
                  <NuralRadioButton
                    label="Store Type"
                    options={radioOptions}
                    value={radioOptions[0].value}
                    width="100%"
                    fontWeight={400}
                    fontSize="12px"
                    onChange={(value) => console.log(value)}
                  />
                </Grid>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={0.5}
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
                      HIERARCHY {currentRequiredFields.hierarchyLevelID && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      options={hierarchyList}
                      isOptionEqualToValue={(option, value) =>
                        option?.hierarchyLevelID === value?.hierarchyLevelID
                      }
                      getOptionLabel={(option) =>
                        option?.hierarchyLevelName || ""
                      }
                      value={
                        hierarchyList.find(
                          (hierarchy) =>
                            hierarchy.hierarchyLevelID ===
                            orgFormData.hierarchyLevelID
                        ) || null
                      }
                      onChange={(event, value) => {
                        handleChange("hierarchyLevelID", value);
                      }}
                      label="Hierarchy"
                      placeholder="SELECT"
                      error={!!errors.hierarchyLevelID}
                    />
                    {errors.hierarchyLevelID && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.hierarchyLevelID}
                      </Typography>
                    )}
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
                      REPORING HEIRARCHY {currentRequiredFields.parentOrgnhierarchyID && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      label="Reporting Hierarchy"
                      options={reportingHierarchyList}
                      isOptionEqualToValue={(option, value) =>
                        option?.orgnhierarchyID === value?.orgnhierarchyID
                      }
                      getOptionLabel={(option) => option?.locationName || ""}
                      onChange={(event, value) => {
                        setOrgFormData({
                          ...orgFormData,
                          parentOrgnhierarchyID: value.orgnhierarchyID,
                        });
                      }}
                      value={
                        reportingHierarchyList.find(
                          (hierarchy) =>
                            hierarchy.orgnhierarchyID ===
                            orgFormData.parentOrgnhierarchyID
                        ) || null
                      }
                      loading={reportingApi.isLoading}
                      placeholder="SELECT"
                      disabled={
                        !orgFormData.hierarchyLevelID ||
                        hierarchyList.find(
                          (h) =>
                            h.hierarchyLevelID === orgFormData.hierarchyLevelID
                        )?.hierarchyLevelName === "HO"
                      }
                      error={!!errors.parentOrgnhierarchyID}
                    />
                    {errors.parentOrgnhierarchyID && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.parentOrgnhierarchyID}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      COUNTRY {currentRequiredFields.countryId && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      options={countryList}
                      isOptionEqualToValue={(option, value) =>
                        option?.countryID === value?.countryID
                      }
                      getOptionLabel={(option) => option?.countryName || ""}
                      onChange={(event, value) => {
                        handleChange("countryId", value);
                      }}
                      value={countryList.find(
                        (c) => c.countryID === orgFormData.countryId
                      )|| null}
                      loading={reportingApi.isLoading}
                      label="Country"
                      placeholder="SELECT"
                      error={!!errors.countryId}
                    />
                    {errors.countryId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.countryId}
                      </Typography>
                    )}
                  </Grid>{" "}
                </Grid>

                {/* Second Row */}
                <Grid
                  container
                  spacing={2}
                  mt={0.5}
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
                      REGION {currentRequiredFields.RegionId && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      options={regionList}
                      isOptionEqualToValue={(option, value) =>
                        option?.regionID === value?.regionID
                      }
                      getOptionLabel={(option) => option?.regionName || ""}
                      onChange={(event, value) => {
                        const newRegionIdValue = value?.regionID || 0; // Use 0 if no value
                        setOrgFormData((prev) => ({
                          ...prev,
                          RegionId: newRegionIdValue, // Corrected to use 'RegionId' (uppercase R)
                          StateId: 0, // Reset to 0 for consistency
                          CityId: 0,  // Reset to 0 for consistency
                        }));
                        setStateList([]);
                        setCityList([]);
                      }}
                      value={regionList.find(
                        (r) => r.regionID === orgFormData.RegionId
                      )|| null}
                      loading={reportingApi.isLoading}
                      disabled={currentDisabledFields.RegionId || !orgFormData.countryId} // Updated disabled logic
                      label="Region"
                      placeholder="SELECT"
                      error={!!errors.RegionId}
                    />
                    {errors.RegionId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.RegionId}
                      </Typography>
                    )}
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
                      STATE {currentRequiredFields.StateId && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      options={stateList}
                      isOptionEqualToValue={(option, value) =>
                        option?.stateID === value?.stateID
                      }
                      getOptionLabel={(option) => option?.stateName || ""}
                      onChange={(event, value) => {
                        const newStateId = value?.stateID || 0; // Use 0 if no value
                        setOrgFormData((prev) => ({
                          ...prev,
                          StateId: newStateId,
                          CityId: 0, // Reset to 0 for consistency
                        }));
                        setCityList([]);
                      }}
                      value={stateList.find(
                        (s) => s.stateID === orgFormData.StateId || 0
                      )|| null}
                      loading={reportingApi.isLoading}
                      disabled={currentDisabledFields.StateId || currentDisabledFields.RegionId || !orgFormData.RegionId} // Updated disabled logic
                      label="State"
                      placeholder="SELECT"
                      error={!!errors.StateId}
                    />
                    {errors.StateId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.StateId}
                      </Typography>
                    )}
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
                      CITY {currentRequiredFields.CityId && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      options={cityList}
                      isOptionEqualToValue={(option, value) =>
                        option?.cityID === value?.cityID
                      }
                      getOptionLabel={(option) => option?.cityName || ""}
                      onChange={(event, value) => {
                        setOrgFormData((prev) => ({
                          ...prev,
                          CityId: value?.cityID || 0, // use 0 if no value
                        }));
                      }}
                      value={cityList.find (
                        (c) => c.cityID === orgFormData.CityId 
                      )|| 0}
                      loading={reportingApi.isLoading}
                      disabled={currentDisabledFields.CityId || currentDisabledFields.StateId || currentDisabledFields.RegionId || !orgFormData.StateId} // Updated disabled logic
                      label="City"
                      placeholder="SELECT"
                      error={!!errors.CityId}
                    />
                    {errors.CityId && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.CityId}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} mt={0.5}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      LOCATION NAME  <Required />
                    </Typography>
                    <NuralTextField
                      value={orgFormData.locationName}
                      onChange={(e) =>
                        handleChange("locationName", e.target.value)
                      }
                      placeholder="ENTER LOCATION NAME"
                      width="100%"
                      error={!!errors.locationName}
                    />
                    {errors.locationName && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.locationName}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} mt={0.5}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      LOCATION CODE  <Required />
                    </Typography>
                    <NuralTextField
                      value={orgFormData.locationCode}
                      onChange={(e) =>
                        handleChange("locationCode", e.target.value)
                      }
                      placeholder="ENTER LOCATION CODE"
                      width="100%"
                      error={!!errors.locationCode}
                    />
                    {errors.locationCode && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {errors.locationCode}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Third Row - Buttons */}
              </NuralAccordion2>
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5} pr={2}>
                {status && (
                <StatusModel
                  width="100%"
                    status={status}
                    title={statusMessage}
                    onClose={() => {
                      setStatus(null);
                      setStatusMessage("");
                    }}
                  />
                )}
              </Grid>

              {isExpanded && (
                <Grid
                  container
                  spacing={1}
                  mt={0.5}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={() => handleCancel(true)}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <NuralButton
                      text={editingLocation ? "UPDATE" : "SAVE"}
                      variant="contained"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      backgroundColor={AQUA}
                      onClick={handlePostRequest}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    
    </Grid>
  );
};

AddLocation.propTypes = {
  editingLocation: PropTypes.object,
  onCancelEdit: PropTypes.func.isRequired,
  onCreationSuccess: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onAccordionChange: PropTypes.func.isRequired,
};

AddLocation.defaultProps = {
  editingLocation: null,
};

export default AddLocation;
