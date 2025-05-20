import { Grid, Typography, Button, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import Required from "../../../Common/Required";
import {
  AQUA,
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";

import { useNavigate } from "react-router-dom";
import {
  GetRoleList,
  GetEntityListWithRoleID,
  ManageAttendanceRegularisation,
  GetLeaveTypeDropdownList,
} from "../../../Api/Api";
import { getTodayDate } from "../../../Common/commonFunction";
import StatusModel from "../../../Common/StatusModel";
import BalanceLeaveUpdate from "./BalanceLeaveUpdate";
import AttendanceSearch from "./AttendanceSearch";
const attendanceStatusOptions = [
  { id: 1, label: "Present" },
  { id: 2, label: "Absent" },
  { id: 4, label: "Leave" },
];
const Manage = () => {
  const [activeTab, setActiveTab] = React.useState("manage");
  const [roleName, setRoleName] = React.useState([]);
  const [entityList, setEntityList] = React.useState([]);
  const [leaveTypeList, setLeaveTypeList] = React.useState([]);
  const [leaveTypeDrop, setLeaveTypeDrop] = React.useState([]);
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [attendanceAccordionExpanded, setAttendanceAccordionExpanded] =
    useState(false);
  const [balanceLeaveAccordionExpanded, setBalanceLeaveAccordionExpanded] =
    useState(true);
  const [
    attendanceSearchAccordionExpanded,
    setAttendanceSearchAccordionExpanded,
  ] = useState(false);

  const [searchParams, setSearchParams] = useState({
    // entityTypeId: 0, // use API "GetEntityForLeaveAllocation"
    entityId: 0,
    attDate: getTodayDate(),
    leaveTypeId: 0,
    attStatus: 0,
    roleID: 0,
  });

  const tabs = [
    { label: "Attendance Upload", value: "attendance-upload" },

    { label: "Leave Type", value: "leave-type" },
    { label: "Leave Allocation", value: "leave-allocation" },
    { label: "Manage", value: "manage" },
    { label: "IMEI Binding", value: "imei-binding" },
  ];

  const navigate = useNavigate();
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [errors, setErrors] = useState({
    roleID: false,
    entityId: false,
    attStatus: false,
    leaveTypeId: false,
  });

  const validateFields = () => {
    const newErrors = {
      roleID: !searchParams.roleID,
      entityId: !searchParams.entityId,
      attStatus: !searchParams.attStatus,
      leaveTypeId: searchParams.attStatus === 4 && !searchParams.leaveTypeId,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSearchChange = (field, value) => {
    setSearchParams((p) => {
      if (field === "attStatus" && p.attStatus === 4 && value !== 4) {
        return {
          ...p,
          [field]: value,
          leaveTypeID: 0,
        };
      }
      return {
        ...p,
        [field]: value,
      };
    });
    // Clear error when field is filled
    if (value) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  const [loading, setLoading] = useState({
    role: false,
    entity: false,
    leaveType: false,
  });

  const GetRoleNameList = async () => {
    try {
      setLoading((prev) => ({ ...prev, role: true }));
      const response = await GetRoleList();
      if (response.statusCode == 200) {
        const ispRole = response.roleList.filter(
          (role) => role.roleName === "ISP"
        );
        setRoleName(ispRole);
      }
    } catch (error) {
      console.log(error, "error fetching role list");
    } finally {
      setLoading((prev) => ({ ...prev, role: false }));
    }
  };

  const GetEntityListWithID = async (roleID) => {
    try {
      setLoading((prev) => ({ ...prev, entity: true }));
      const response = await GetEntityListWithRoleID(roleID);
      if (response.statusCode == 200) {
        setEntityList(response.entityTypeWithEntityTypeIDList);
      }
    } catch (error) {
      console.log(error, "error fetching entity list");
    } finally {
      setLoading((prev) => ({ ...prev, entity: false }));
    }
  };

  const [showStatus, setShowStatus] = useState(false);

  const handlePostSaveAttendanceRegularisation = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await ManageAttendanceRegularisation(searchParams);

      if (response.statusCode == 200) {
        setShowStatus(true);
        setStatus(String(response.statusCode));
        setTitle(response.statusMessage);
        setSearchParams({
          entityId: 0,
          attDate: getTodayDate(),
          leaveTypeId: 0,
          attStatus: 0,
          roleID: 0,
        });
        setTimeout(() => {
          setShowStatus(false);
        }, 5000);
        setErrors({});
      } else {
        setShowStatus(true);
        setStatus(String(response.statusCode));
        setTitle(response.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus("500");
      setTitle(error.message || "Error updating attendance regularisation");
    }
  };

  useEffect(() => {
    GetRoleNameList();

    if (searchParams.roleID) {
      GetEntityListWithID(searchParams.roleID);
    }
  }, [searchParams.roleID]);

  useEffect(() => {
    GetLeaveTypeDropdown();
  }, []);

  const GetLeaveTypeDropdown = async () => {
    try {
      setLoading((prev) => ({ ...prev, leaveType: true }));
      const res = await GetLeaveTypeDropdownList();
      if (res.statusCode == 200) {
        setLeaveTypeDrop(res.leaveTypeList);
      } else {
        setLeaveTypeDrop([]);
      }
    } catch (error) {
      setLeaveTypeDrop([]);
      console.log(error, "error fetching leave type dropdown");
    } finally {
      setLoading((prev) => ({ ...prev, leaveType: false }));
    }
  };

  const handleDateChange = (date) => {
    // Convert the date to YYYY-MM-DD format
    const formattedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : "";

    // Update the searchParams with the formatted date
    handleSearchChange("attDate", formattedDate);
  };
  const handleReset = () => {
    setSearchParams({
      entityId: 0,
      attDate: getTodayDate(),
      leaveTypeId: 0,
      attStatus: 0,
      roleID: 0,
    });
    setErrors({});
    setStatus(null);
    setTitle(null);
    setShowStatus(false);
    setEntityList([]);
    setActiveTab("manage");
  };

  const handleAttendanceAccordionChange = (event, expanded) => {
    setAttendanceAccordionExpanded(expanded);
    if (expanded) {
      setBalanceLeaveAccordionExpanded(false);
      setAttendanceSearchAccordionExpanded(false);
    }
  };

  const handleBalanceLeaveAccordionChange = (event, expanded) => {
    setBalanceLeaveAccordionExpanded(expanded);
    if (expanded) {
      setAttendanceAccordionExpanded(false);
      setAttendanceSearchAccordionExpanded(false);
    }
  };

  const handleAttendanceSearchAccordionChange = (event, expanded) => {
    setAttendanceSearchAccordionExpanded(expanded);
    if (expanded) {
      setAttendanceAccordionExpanded(false);
      setBalanceLeaveAccordionExpanded(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Breadcrumbs Grid - Make it sticky with higher z-index */}
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
        <Grid item xs={12} mt={0} mb={0} ml={0} pr={2}>
          <BreadcrumbsHeader pageTitle="Attendance" />
        </Grid>

        <Grid item xs={12} ml={0}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Rest of the content */}
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <BalanceLeaveUpdate
          expanded={balanceLeaveAccordionExpanded}
          onChange={handleBalanceLeaveAccordionChange}
        />

        <Grid item xs={12} mt={-2} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item border>
              <NuralAccordion2
                title="Attendance Update"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                onChange={handleAttendanceAccordionChange}
                expanded={attendanceAccordionExpanded}
              >
                {/* First Row - 3 NuralAutocomplete */}

                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={6} lg={6} mb={1.5}>
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
                      label="Role"
                      options={roleName}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.roleName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.roleId === value?.roleId
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("roleID", newValue?.roleId || null);
                        handleSearchChange("entityId", 0);
                      }}
                      value={
                        roleName.find(
                          (option) => option.roleId === searchParams.roleID
                        ) || null
                      }
                      required
                      error={errors.roleID}
                      loading={loading.role}
                    />
                    {errors.roleID && (
                      <FormHelperText error>Role is required</FormHelperText>
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
                      options={entityList}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.salesChannelName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.salesChannelID === value?.salesChannelID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "entityId",
                          newValue?.salesChannelID || null
                        );
                      }}
                      value={
                        entityList.find(
                          (option) =>
                            option.salesChannelID === searchParams.entityId
                        ) || null
                      }
                      disabled={!searchParams.roleID}
                      required
                      error={errors.entityId}
                      loading={loading.entity}
                    />
                    {errors.entityId && (
                      <FormHelperText error>Name is required</FormHelperText>
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
                      DATE
                    </Typography>
                    <NuralCalendar
                      width="100%"
                      placeholder="DD/MMM/YYYY"
                      value={searchParams.attDate}
                      onChange={handleDateChange}
                    />
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
                      ATTENDANCE STATUS <Required />
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={attendanceStatusOptions}
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange("attStatus", newValue?.id || 0);
                      }}
                      value={
                        attendanceStatusOptions.find(
                          (option) => option.id === searchParams.attStatus
                        ) || null
                      }
                      required
                      error={errors.attStatus}
                    />
                    {errors.attStatus && (
                      <FormHelperText error>
                        Attendance status is required
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      LEAVE TYPE {searchParams.attStatus === 4 && <Required />}
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      placeholder="SELECT"
                      options={leaveTypeDrop}
                      getOptionLabel={(option) => option.leaveTypeName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.leaveTypeID === value.leaveTypeID
                      }
                      onChange={(event, newValue) => {
                        handleSearchChange(
                          "leaveTypeId",
                          newValue?.leaveTypeID || 0
                        );
                      }}
                      value={
                        leaveTypeDrop.find(
                          (option) =>
                            option.leaveTypeID === searchParams.leaveTypeId
                        ) || null
                      }
                      disabled={searchParams.attStatus !== 4}
                      loading={loading.leaveType}
                      required={searchParams.attStatus === 4}
                      error={errors.leaveTypeId}
                    />
                    {errors.leaveTypeId && (
                      <FormHelperText error>
                        Leave type is required
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                {/* Second Row */}
              </NuralAccordion2>
              {showStatus ? (
                <Grid item xs={12} pr={4} sx={{ position: "relative", mt: 2 }}>
                  <StatusModel width="100%" status={status} title={title} />
                </Grid>
              ) : (
                attendanceAccordionExpanded && (
                  <Grid
                    container
                    spacing={2}
                    mt={1}
                    px={1}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      // gap: { xs: 2, sm: 2 },
                    }}
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
                        onClick={handlePostSaveAttendanceRegularisation}
                      >
                        SAVE
                      </NuralButton>
                    </Grid>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AttendanceSearch
        expanded={attendanceSearchAccordionExpanded}
        onChange={handleAttendanceSearchAccordionChange}
      />
    </Grid>
  );
};

export default Manage;
