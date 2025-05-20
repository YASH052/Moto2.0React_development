import React, { use, useEffect, useState } from "react";
import { Grid, Typography, FormHelperText, Skeleton } from "@mui/material";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  AQUA,
  AQUA_DARK,
  WHITE_COLOR,
} from "../../../Common/colors";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import { useNavigate } from "react-router-dom";
import StatusModel from "../../../Common/StatusModel";
import {
  GetRoleList,
  GetEntityListWithRoleID,
  GetLeaveTypeDropdownList,
  UserWiseUpdateBalanceLeave,
  GetUserLeaveDetailsListMoto,
} from "../../../Api/Api";
import { useDispatch, useSelector } from "react-redux";
import { setUserLeavesID } from "../../../Redux/action";
import Required from "../../../Common/Required";
import { FormSkeleton } from "../../../Common/Skeletons";

const BalanceLeaveUpdate = ({ expanded, onChange }) => {
  const navigate = useNavigate();
  const userLeavesID = useSelector((state) => state.userLeavesID);
  const [selectedFormat, setSelectedFormat] = useState("interface");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  // State for dropdowns
  const [roleName, setRoleName] = useState([]);
  const [name, setName] = useState([]);
  const [leaveValues, setLeaveValues] = useState({});
  const [leaveTypeList, setLeaveTypeList] = useState([]);

  const [searchParams, setSearchParams] = useState({
    roleId: 0,
    entityId: 0,
    userLeaveId: 0,
    leaveTypeList: [],
  });

  const [errors, setErrors] = useState({
    roleId: false,
    entityId: false,
    leaveType: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/manage");
    } else if (value === "batch") {
      navigate("/balance-leave-bulk");
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    if (userLeavesID) {
      fetchEditData(userLeavesID);
    }
  }, [userLeavesID]);

  const fetchEditData = async (userLeaveId) => {
    let body = {
      displayMode: 0,
      userLeaveId: userLeaveId,
      entityId: 0,
      pageIndex: 1,
      pageSize: 10,
      roleId: 0,
    };
    try {
      let res = await GetUserLeaveDetailsListMoto(body);
      if (res.statusCode == 200) {
        const data = res.userLeaveDetailListItems[0];
        // Only keep required fields
        setSearchParams({
          roleId: data.roleId || 0,
          entityId: data.entityId || 0,
          userLeaveId: data.userLeavesID || 0,
          leaveTypeList: data.leaveTypeList || [],
        });
      } else {
        console.log(res.statusMessage, "error fetching edit data");
      }
    } catch (error) {
      console.log(error, "error fetching edit data");
    }
  };

  const handleLeaveValueChange = (leaveTypeId, value) => {
    setSearchParams((prev) => {
      // Ensure leaveTypeList exists and is an array
      const currentLeaveTypeList = prev.leaveTypeList || [];

      const existingLeaveTypeIndex = currentLeaveTypeList.findIndex(
        (item) => item.leaveTypeId === leaveTypeId
      );

      let newLeaveTypeList = [...currentLeaveTypeList];

      if (existingLeaveTypeIndex >= 0) {
        // Update existing entry
        newLeaveTypeList[existingLeaveTypeIndex] = {
          leaveTypeId: leaveTypeId,
          noOfLeaves: parseInt(value) || 0,
        };
      } else {
        // Add new entry
        newLeaveTypeList.push({
          leaveTypeId: leaveTypeId,
          noOfLeaves: parseInt(value) || 0,
        });
      }

      return {
        ...prev,
        leaveTypeList: newLeaveTypeList,
      };
    });
  };

  // API Integration functions
  const GetRoleListName = async () => {
    try {
      const response = await GetRoleList();
      if (response.statusCode == 200) {
        // Filter only ISP roles
        const ispRoles = response.roleList.filter(
          (role) =>
            role.roleName.toLowerCase().includes("isp") ||
            role.entityType?.toLowerCase() === "isp"
        );
        setRoleName(ispRoles);
      }
    } catch (error) {
      console.log(error, "error fetching role list");
    }
  };

  const GetNamesList = async (roleId) => {
    // console.log(roleId, "roleId");

    try {
      const response = await GetEntityListWithRoleID(roleId);
      console.log(response, "response");
      if (response.statusCode == 200) {
        setName(response.entityTypeWithEntityTypeIDList);
      }
    } catch (error) {
      console.log(error, "error fetching entity list");
    }
  };

  const GetLeaveTypeList = async () => {
    try {
      const response = await GetLeaveTypeDropdownList();
      if (response.statusCode == 200) {
        setLeaveTypeList(response.leaveTypeList);
        // console.log(response.leaveTypeList, "leaveTypeList");
      }
    } catch (error) {
      console.log(error, "error fetching leave type list");
    }
  };

  const validateForm = () => {
    const newErrors = {
      roleId: !searchParams.roleId,
      entityId: !searchParams.entityId,
      leaveType: !searchParams.leaveTypeList?.length,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handlePostBalanceLeaveUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Create a clean payload with only required fields
      const payload = {
        roleId: searchParams.roleId,
        entityId: searchParams.entityId,
        userLeaveId: searchParams.userLeaveId,
        leaveTypeList: searchParams.leaveTypeList,
      };

      const response = await UserWiseUpdateBalanceLeave(payload);
      if (response.statusCode == 200) {
        setShowStatus(true);
        setStatus(String(response.statusCode));
        setTitle(response.statusMessage);
        // Reset all states
        setSearchParams({
          roleId: 0,
          entityId: 0,
          userLeaveId: 0,
          leaveTypeList: [],
        });
        setLeaveValues({}); // Clear leave fields
        setTimeout(() => {
          setShowStatus(false);
          setStatus(null);
          setTitle(null);
        }, 5000);
      } else {
        setShowStatus(true);
        setStatus(String(response.statusCode));
        setTitle(response.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus("500");
      setTitle(error.message || "Error updating balance leave");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      roleId: 0,
      entityId: 0,
      userLeaveId: 0,
      leaveTypeList: [],
    });
    setErrors({
      roleId: false,
      entityId: false,
      leaveType: false,
    });
    setLeaveValues({});
    setSelectedFormat("interface");
    setShowStatus(false);
    setStatus(null);
    setTitle(null);
  };

  useEffect(() => {
    GetRoleListName();
    GetLeaveTypeList();

    if (searchParams.roleId) {
      GetNamesList(searchParams.roleId);
    }
  }, [searchParams.roleId]);

  return (
    <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <NuralAccordion2
            title="Balance Leave Update"
            controlled={true}
            onChange={onChange}
            expanded={expanded}
          >
            {isSaving ? (
              // Skeleton loading state
              <FormSkeleton />
            ) : (
              // Actual form content
              <>
                <Typography
                  variant="h6"
                  sx={{
                    color: DARK_PURPLE,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "19.12px",
                    letterSpacing: "0%",
                    mb: 2,
                  }}
                >
                  Update
                </Typography>
                {/* <Grid item xs={12} md={6} lg={6} mb={2}>
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
                    SELECT MODE
                  </Typography>
                  <NuralRadioButton
                    onChange={handleFormatChange}
                    options={[
                      { value: "interface", label: "Interface" },
                      { value: "batch", label: "Batch", disabled: true },
                    ]}
                    value={selectedFormat}
                    width="100%"
                    gap="15px"
                    marginLeft="-15px"
                  />
                </Grid> */}
                <Grid
                  container
                  spacing={2}
                  // mb={0}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      ROLE <Required />
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={roleName}
                      getOptionLabel={(option) => option.roleName || ""}
                      onChange={(event, newValue) => {
                        handleSearchChange("roleId", newValue?.roleId || null);
                        setErrors((prev) => ({ ...prev, roleId: false }));
                      }}
                      value={
                        roleName.find(
                          (option) => option.roleId === searchParams.roleId
                        ) || null
                      }
                      error={errors.roleId}
                    />
                    {errors.roleId && (
                      <FormHelperText
                        error
                        sx={{ marginLeft: "14px", marginTop: "3px" }}
                      >
                        Role is required
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
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
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={name}
                      getOptionLabel={(option) => option.salesChannelName || ""}
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "entityId",
                          newValue?.salesChannelID || null
                        );
                        setErrors((prev) => ({ ...prev, entityId: false }));
                      }}
                      value={
                        name.find(
                          (option) =>
                            option.salesChannelID === searchParams.entityId
                        ) || null
                      }
                      disabled={!searchParams.roleId}
                      error={errors.entityId}
                    />
                    {errors.entityId && (
                      <FormHelperText
                        error
                        sx={{ marginLeft: "14px", marginTop: "3px" }}
                      >
                        Name is required
                      </FormHelperText>
                    )}
                  </Grid>
                  {/* Input for Leave Type Starts */}
                  <Grid
                    container
                    spacing={2}
                    mb={2}
                    mt={1}
                    ml={0}
                    sx={{
                      gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      mt={0}
                      ml={0}
                      sx={{
                        gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      {leaveTypeList.map((leaveType) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          lg={3}
                          key={leaveType.leaveTypeID}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              ...labelStyle,
                              fontSize: { xs: "12px", sm: "10px" },
                            }}
                            fontWeight={600}
                          >
                            {leaveType.leaveTypeName.toUpperCase()}
                          </Typography>
                          <NuralTextField
                            width="100%"
                            placeholder={`ENTER ${leaveType.leaveTypeName.toUpperCase()}`}
                            value={leaveValues[leaveType.leaveTypeID] || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleLeaveValueChange(
                                leaveType.leaveTypeID,
                                value
                              );
                              setLeaveValues((prev) => ({
                                ...prev,
                                [leaveType.leaveTypeID]: value,
                              }));
                              setErrors((prev) => ({
                                ...prev,
                                leaveType: false,
                              }));
                            }}
                            error={
                              errors.leaveType &&
                              !leaveValues[leaveType.leaveTypeID]
                            }
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    {errors.leaveType && (
                      <FormHelperText
                        error
                        sx={{ marginLeft: "14px", marginTop: "3px" }}
                      >
                        At least one leave type is required
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  color={PRIMARY_BLUE2}
                  fontSize={"10px"}
                  fontWeight={"700"}
                  sx={{
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  NOTE:BALANCE LEAVES WILL BE UPDATED AS ON DATE
                </Grid>
              </>
            )}
          </NuralAccordion2>
          {/* Second Row */}
          {showStatus && (
            <Grid item xs={12} pr={4} sx={{ position: "relative", mt: 2 }}>
              <StatusModel width="100%" status={status} title={title} />
            </Grid>
          )}

          {expanded && (
            <Grid
              container
              spacing={2}
              mt={1}
              px={1}
              sx={{ flexDirection: { xs: "column", sm: "row" } }}
            >
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  color={PRIMARY_BLUE2}
                  fontSize="12px"
                  height="36px"
                  borderColor={PRIMARY_BLUE2}
                  onClick={handleReset}
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <NuralButton
                  text="SAVE"
                  variant="contained"
                  color={AQUA_DARK}
                  height="36px"
                  backgroundColor={AQUA}
                  width="100%"
                  fontSize="12px"
                  onClick={handlePostBalanceLeaveUpdate}
                >
                  SAVE
                </NuralButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default BalanceLeaveUpdate;
