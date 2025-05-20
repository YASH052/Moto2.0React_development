import { Grid, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  WHITE,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";

import NuralButton from "../../NuralCustomComponents/NuralButton";

import { Checkbox } from "@mui/material";

import NuralTextField from "../../NuralCustomComponents/NuralTextField";

import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";

import StatusModel from "../../../Common/StatusModel";
import useHttp from "../../../../hooks.js/use-http";
import { UserMasterAPI } from "../Competiton/api";
import Required from "../../../Common/Required";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
];
const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

const AddUser = ({
  editingUser,
  onCancelEdit,
  onCreationSuccess,
  isExpanded,
  onAccordionChange,
}) => {
  const [status, setStatus] = React.useState(null);
  const [statusMessage, setStatusMessage] = React.useState(null);
  const statusTimerRef = useRef(null);
  const [roleList, setRoleList] = React.useState([]);
  const [locationList, setLocationList] = React.useState([]);
  const api = useHttp();
  const [userFormData, setUserFormData] = React.useState({
    newUserId: 0,
    userLoginName: "",
    password: "",
    userRoleId: 0,
    firstName: "",
    lastName: "",
    displayName: "",
    emailId: "",
    status: 1,
    selectedRegions: "",
    isUserMapped: 1,
    allowAllHierarchy: 0,
    mobileNumber: "",
    AltmobileNumber: "",
  });

  const [errors, setErrors] = React.useState({
    firstName: "",
    mobileNumber: "",
    AltmobileNumber: "",
    emailId: "",
    userLoginName: "",
    password: "",
  });

  const [selectedLocations, setSelectedLocations] = React.useState([]);

  const handleLocationToggle = (location) => {
    if (location.status === 0) {
      setSelectedLocations((prev) => {
        if (prev.includes(location.orgnhierarchyID)) {
          return prev.filter((id) => id !== location.orgnhierarchyID);
        } else {
          return [...prev, location.orgnhierarchyID];
        }
      });
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
        if (!value) {
          newErrors.firstName = "Name is required";
        } else if (value.length > 20) {
          newErrors.firstName = "Name cannot exceed 20 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.firstName = "Name can only contain alphabets and spaces";
        } else {
          newErrors.firstName = "";
        }
        break;

      case "mobileNumber":
        if (!value) {
          newErrors.mobileNumber = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.mobileNumber = "Mobile number must be 10 digits";
        } else {
          newErrors.mobileNumber = "";
        }
        break;

      case "AltmobileNumber":
        if (value && !/^\d{10}$/.test(value)) {
          newErrors.AltmobileNumber =
            "Alternate mobile number must be 10 digits";
        } else {
          newErrors.AltmobileNumber = "";
        }
        break;

      case "emailId":
        if (!value) {
          newErrors.emailId = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.emailId = "Please enter a valid email address";
        } else {
          newErrors.emailId = "";
        }
        break;

      case "userLoginName":
        if (!value) {
          newErrors.userLoginName = "Login ID is required";
        } else if (/\s/.test(value)) {
          newErrors.userLoginName = "Login ID cannot contain spaces";
        } else {
          newErrors.userLoginName = "";
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (/\s/.test(value)) {
          newErrors.password = "Password cannot contain spaces";
        } else {
          newErrors.password = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return newErrors[field] === "";
  };

  const handleInputChange = (field, value) => {
    setUserFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  useEffect(() => {
    api.sendRequest(
      UserMasterAPI.roleDropdown,
      (response) => {
        console.log("Role response:", response.roleList);
        if (response.statusCode === "200") {
          setRoleList(response.roleList || []);
        } else {
          setRoleList([]);
        }
      },
      null,
      null,
      (error) => {
        console.error("Error fetching hierarchy data:", error);
        setRoleList([]);
      }
    );
  }, []);
  useEffect(() => {
    api.sendRequest(
      UserMasterAPI.locationCheckList,
      (response) => {
        console.log("Role response:", response.availedLocationsList);
        if (response.statusCode === "200") {
          setLocationList(response.availedLocationsList || []);
        } else {
          setLocationList([]);
        }
      },
      {
        countryId: 0, //
        roleId: userFormData.userRoleId,
        selectionMode: 0, // 1= to get location list to edit
        forUserId: 0, //send userId whose location list to get
      },
      null,
      (error) => {
        console.error("Error fetching hierarchy data:", error);
        setLocationList([]);

        const preCheckedIds = locationList
          .filter((loc) => loc.status === 1)
          .map((loc) => loc.orgnhierarchyID);
        setSelectedLocations(preCheckedIds);
      }
    );
  }, [userFormData.userRoleId]);

  useEffect(() => {
    if (editingUser) {
      setUserFormData({
        newUserId: editingUser.userID || 0,
        userLoginName: editingUser.loginName || "",
        password: editingUser.password || "", // Don't pre-fill password for security
        userRoleId: editingUser.roleID || 0,
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        displayName: editingUser.displayName || "",
        emailId: editingUser.email || "",
        status: editingUser.status === "A" ? 1 : 0,
        selectedRegions: editingUser.selectedRegions || "",
        isUserMapped: editingUser.isUserMapped || 1,
        allowAllHierarchy: editingUser.allowAllHierarchy || 0,
        mobileNumber: editingUser.mobileNo || "",
        AltmobileNumber: editingUser.AltmobileNo || "",
      });
      // TODO: Fetch and set selectedLocations based on editingUser
      // This might require another API call or parsing existing data if available
    }
  }, [editingUser]);

  const handlePostRequest = async () => {
    // Validate all required fields
    const newErrors = {};

    // Validate name
    if (!userFormData.firstName) {
      newErrors.firstName = "Name is required";
    } else if (userFormData.firstName.length > 20) {
      newErrors.firstName = "Name cannot exceed 20 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(userFormData.firstName)) {
      newErrors.firstName = "Name can only contain alphabets and spaces";
    }

    // Validate mobile number
    if (!userFormData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(userFormData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    // Validate alternate mobile number if provided
    if (
      userFormData.AltmobileNumber &&
      !/^\d{10}$/.test(userFormData.AltmobileNumber)
    ) {
      newErrors.AltmobileNumber = "Alternate mobile number must be 10 digits";
    }

    // Validate email
    if (!userFormData.emailId) {
      newErrors.emailId = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    // Validate login ID
    if (!userFormData.userLoginName) {
      newErrors.userLoginName = "Login ID is required";
    } else if (/\s/.test(userFormData.userLoginName)) {
      newErrors.userLoginName = "Login ID cannot contain spaces";
    }

    // Validate password
    if (!userFormData.password) {
      newErrors.password = "Password is required";
    } else if (/\s/.test(userFormData.password)) {
      newErrors.password = "Password cannot contain spaces";
    }

    // Validate role
    if (!userFormData.userRoleId) {
      newErrors.userRoleId = "User role is required";
    }

    // Set errors if any validation failed
    setErrors(newErrors);

    // If there are no errors, proceed with the API call
    if (Object.keys(newErrors).length === 0) {
      const xmlData = selectedLocations
        .map((id) => `<tblData><Value>${id}</Value></tblData>`)
        .join("");
      const selectedRegionsXML = `<DocumentElement>${xmlData}</DocumentElement>`;

      const isCreating = !editingUser; // Check if creating before API call
      const updatedFormData = {
        ...userFormData,
        selectedRegions: selectedRegionsXML,
        newUserId: editingUser ? editingUser.userID : 0, // Use userID for update
      };

      api.sendRequest(
        UserMasterAPI.saveUpdateUser,
        (response) => {
          console.log("Save User Response:", response);
          setStatus(response.statusCode);
          setStatusMessage(
            response.statusMessage || "An unknown response occurred."
          );

          if (response.statusCode === "200") {
            // Clear form data on success
            setUserFormData({
              newUserId: 0,
              userLoginName: "",
              password: "",
              userRoleId: 0, // Reset role dropdown correctly
              firstName: "",
              lastName: "",
              displayName: "",
              emailId: "",
              status: 1,
              selectedRegions: "",
              isUserMapped: 1,
              allowAllHierarchy: 0,
              mobileNumber: "",
              AltmobileNumber: "",
            });
            setSelectedLocations([]);
            setErrors({});
            // Notify parent to clear editing state
            if (onCancelEdit) {
              onCancelEdit();
            }
            if (isCreating && onCreationSuccess) {
              onCreationSuccess(); // Call refresh trigger only on create
            }
          }
        },
        updatedFormData, // Pass the formatted data
        null,
        (error) => {
          console.error("Error saving user:", error);
          setStatus("500");
          setStatusMessage(error.message || "An error occurred while saving.");
        }
      );
    }
  };

  const handleCancel = (notifyParent = true) => {
    setUserFormData({
      newUserId: 0,
      userLoginName: "",
      password: "",
      userRoleId: 0,
      firstName: "",
      lastName: "",
      displayName: "",
      emailId: "",
      status: 1,
      selectedRegions: "",
      isUserMapped: 1,
      allowAllHierarchy: 0,
      mobileNumber: "",
      AltmobileNumber: "",
    });
    setSelectedLocations([]);
    setErrors({});
    setStatus(null);
    setStatusMessage(null);
    // Notify parent to clear editing state
    if (notifyParent && onCancelEdit) {
      onCancelEdit();
    }
    // Location list will automatically clear/update due to useEffect dependency on userRoleId
  };

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
        setStatusMessage(null);
      }, 5000); // 5000ms = 5 seconds
    }

    // Cleanup function to clear timer when component unmounts or status changes
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [status]); // Only run effect when status changes

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
              <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                <NuralAccordion2
                  title="Create User"
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
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    Create User
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
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        USER ROLE
                      </Typography>

                      {/*   {
            "roleId": 90,
            "roleName": "AccXchange"
        }, 
        
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
        
        
        
        */}
                      <NuralAutocomplete
                        options={roleList}
                        isOptionEqualToValue={(option, value) =>
                          option?.roleId === value?.roleId
                        }
                        getOptionLabel={(option) => option?.roleName || ""}
                        value={
                          roleList.find(
                            (role) => role.roleId === userFormData.userRoleId
                          ) || null
                        }
                        onChange={(event, value) => {
                          setUserFormData({
                            ...userFormData,
                            userRoleId: value?.roleId,
                          });
                        }}
                        width="100%"
                        label="User Role"
                        placeholder="SELECT"
                      />
                      {errors.userRoleId && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.userRoleId}
                        </Typography>
                      )}
                    </Grid>

                    {/* Conditional rendering for the location checklist */}
                    {(() => {
                      // Determine the list to render based on edit mode
                      const listToRender = editingUser 
                        ? locationList 
                        : locationList.filter(loc => loc.status === 0);

                      // Only render the Grid container if there are items to show OR if editingUser is true (to show empty state if applicable)
                      if (editingUser || listToRender.length > 0) {
                        return (
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            {listToRender.map((option, index) => (
                              <Grid
                                item
                                xs={12}
                                md={3}
                                lg={3}
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  checked={
                                    option.status === 1 ||
                                    selectedLocations.includes(option.orgnhierarchyID)
                                  }
                                  disabled={option.status === 1}
                                  onChange={() => handleLocationToggle(option)}
                                  sx={{
                                    "&.Mui-checked": {},
                                    borderRadius: "8px",
                                  }}
                                />

                                <Typography
                                  sx={{
                                    color:
                                      option.status === 1 ||
                                      selectedLocations.includes(
                                        option.orgnhierarchyID
                                      )
                                        ? WHITE
                                        : BLACK,
                                    backgroundColor:
                                      option.status === 1 ||
                                      selectedLocations.includes(
                                        option.orgnhierarchyID
                                      )
                                        ? PRIMARY_BLUE
                                        : "transparent",
                                    padding: "8px",
                                    paddingLeft: "10px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    width: {
                                      xs: "100%",
                                      md: "226px",
                                    },
                                    textAlign: "left",
                                    opacity: option.status === 1 ? 0.5 : 1,
                                  }}
                                >
                                  {option.locationName}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        );
                      }
                      return null; // Return null if no items and not in edit mode
                    })()}
                  </Grid>
                </NuralAccordion2>
              </Grid>

              {isExpanded && selectedLocations.length > 0 && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  mt={2}
                  p={2}
                  borderRadius={2}
                  backgroundColor={LIGHT_GRAY2}
                  border={`1px solid ${LIGHT_GRAY2}`}
                >
                  {/* <NuralAccordion2 title="User Details"> */}
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
                      // marginLeft: "10px",
                      marginRight: "10px",
                      mb: 3,
                    }}
                  >
                    User Details
                  </Typography>
                  <Grid container spacing={4} pl={0}>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        NAME <Required />
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Name"
                        width="100%"
                        value={userFormData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        error={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.firstName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        MOBILE NO. <Required />
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Mobile No."
                        width="100%"
                        value={userFormData.mobileNumber}
                        onChange={(e) =>
                          handleInputChange("mobileNumber", e.target.value)
                        }
                        error={!!errors.mobileNumber}
                      />
                      {errors.mobileNumber && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.mobileNumber}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ALTERNATE MOBILE NO.
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Alternate Mobile No."
                        width="100%"
                        value={userFormData.AltmobileNumber}
                        onChange={(e) =>
                          handleInputChange("AltmobileNumber", e.target.value)
                        }
                        error={!!errors.AltmobileNumber}
                      />
                      {errors.AltmobileNumber && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.AltmobileNumber}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} mt={-2}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        EMAIL ID <Required />
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Email ID"
                        width="100%"
                        value={userFormData.emailId}
                        onChange={(e) =>
                          handleInputChange("emailId", e.target.value)
                        }
                        error={!!errors.emailId}
                      />
                      {errors.emailId && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.emailId}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} mt={-2}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        LOGIN ID <Required />
                      </Typography>
                      <NuralTextField
                        placeholder="Enter Login ID"
                        width="100%"
                        value={userFormData.userLoginName}
                        onChange={(e) =>
                          handleInputChange("userLoginName", e.target.value)
                        }
                        error={!!errors.userLoginName}
                      />
                      {errors.userLoginName && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.userLoginName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} mt={-2}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        PASSWORD <Required />
                      </Typography>
                      {/* <NuralTextField
                        placeholder="Enter Password"
                        width="100%"
                        value={userFormData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        error={!!errors.password}
                      />
                      {errors.password && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {errors.password}
                        </Typography>
                      )}
                       */}
                      <NuralTextField
                        value={userFormData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        width="100%"
                        placeholder="ENTER PASSWORD"
                        error={!!errors.password}
                        type="password"
                      />
                      {errors.password && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            fontSize: "0.75rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {errors.password}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  {/* </NuralAccordion2> */}
                </Grid>
              )}

              <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
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

              {isExpanded && selectedLocations.length > 0 && (
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
                      text={editingUser ? "UPDATE" : "SAVE"}
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

AddUser.propTypes = {
  editingUser: PropTypes.object,
  onCancelEdit: PropTypes.func.isRequired,
  onCreationSuccess: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onAccordionChange: PropTypes.func.isRequired,
};

AddUser.defaultProps = {
  editingUser: null,
};

export default AddUser;
