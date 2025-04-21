import React, { use, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
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
} from "../../../Api/Api";

const BalanceLeaveUpdate = () => {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState("interface");
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState(true);
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
  console.log(searchParams, "searchParams");

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

  const handleLeaveValueChange = (leaveTypeId, value) => {
    setSearchParams((prev) => {
      const existingLeaveTypeIndex = prev.leaveTypeList.findIndex(
        (item) => item.leaveTypeId === leaveTypeId
      );

      let newLeaveTypeList = [...prev.leaveTypeList];

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
        setRoleName(response.roleList);
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

  const handlePostBalanceLeaveUpdate = async () => {
    console.log(searchParams, "searchParams");
    console.log(leaveValues, "leaveValues");
    try {
      const response = await UserWiseUpdateBalanceLeave(searchParams);
      if (response.statusCode == 200) {
        setShowStatus(true);
        setStatus(String(response.statusCode));
        setTitle(response.statusMessage);
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
      setTimeout(() => {
        setShowStatus(false);
        setStatus(null);
        setTitle(null);
      }, 3000);
    }
  };

  const handleReset = () => {
    setSearchParams({
      roleId: 0,
      entityId: 0,
      userLeaveId: 0,
      leaveTypeList: [],
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
            onChange={(event, expanded) => setAccordionExpanded(expanded)}
            expanded={accordionExpanded}
            // backgroundColor={LIGHT_GRAY2}
          >
            {/* First Row - 3 NuralAutocomplete */}
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
            <Grid item xs={12} md={6} lg={6} mb={2}>
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
                  { value: "batch", label: "Batch" },
                ]}
                value={selectedFormat}
                width="100%"
                gap="15px"
                marginLeft="-15px"
              />
            </Grid>
            <Grid
              container
              spacing={2}
              mb={0}
              sx={{
                gap: { xs: 0, sm: 0, md: 0, lg: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={6} md={6} lg={6} mb={0}>
                <Typography
                  variant="body1"
                  sx={{
                    ...labelStyle,
                    fontSize: { xs: "12px", sm: "10px" },
                  }}
                  fontWeight={600}
                >
                  ROLE
                </Typography>
                <NuralAutocomplete
                  width="100%"
                  placeholder="SELECT"
                  options={roleName}
                  getOptionLabel={(option) => option.roleName || ""}
                  onChange={(event, newValue) => {
                    handleSearchChange("roleId", newValue?.roleId || null);
                  }}
                  value={
                    roleName.find(
                      (option) => option.roleId === searchParams.roleId
                    ) || null
                  }
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
                  NAME
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
                  }}
                  value={
                    name.find(
                      (option) =>
                        option.salesChannelID === searchParams.entityId
                    ) || null
                  }
                  disabled={!searchParams.roleId}
                />
              </Grid>
              {/* Input for Leave Type Starts */}
              <Grid
                container
                spacing={2}
                mb={0}
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
                        placeholder={`ENTER ${leaveType.leaveTypeName}`}
                        value={leaveValues[leaveType.leaveTypeID] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleLeaveValueChange(leaveType.leaveTypeID, value);
                          setLeaveValues((prev) => ({
                            ...prev,
                            [leaveType.leaveTypeID]: value,
                          }));
                        }}
                        // error={!!errors[leaveType.leaveTypeCode]}
                        // errorMessage={errors[leaveType.leaveTypeCode]}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
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
              Note:Balance Leaves will be updated as on date
            </Grid>
          </NuralAccordion2>
          {/* Second Row */}
          {showStatus ? (
            <Grid item xs={12} pr={4} sx={{ position: "relative", mt: 2 }}>
              <StatusModel width="100%" status={status} title={title} />
            </Grid>
          ) : (
            accordionExpanded && (
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
            )
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default BalanceLeaveUpdate;
