import { Grid, Typography, Switch, IconButton } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralPagination from "../../../Common/NuralPagination";
import useHttp from "../../../../hooks.js/use-http";
import { UserMasterAPI } from "../Competiton/api";
import StatusModel from "../../../Common/StatusModel";

const LocationColumns = [
  { id: "hierarchyLevelName", label: "HIERARCHY", sortable: true },
  { id: "locationName", label: "LOCATION NAME", sortable: true },
  { id: "locationCode", label: "LOCATION CODE", sortable: true },
  { id: "locationUserName", label: "USERNAME", sortable: true },
  { id: "parentLocationName", label: "PARENT LOCATION", sortable: true },
  { id: "parentLocationUserName", label: "PARENT USER NAME", sortable: true },
  { id: "status", label: "STATUS", sortable: false },
  { id: "edit", label: "EDIT", sortable: false },
];

const UserColumns = [
  { id: "roleName", label: "USER ROLE", sortable: true },
  { id: "name", label: "FULL NAME", sortable: true },
  { id: "email", label: "EMAIL", sortable: true },
  { id: "mobileNo", label: "MOBILE NUMBER", sortable: true },
  { id: "userLocationCodes", label: "LOCATION NAME", sortable: true },
  { id: "locationCode", label: "LOCATION CODE", sortable: false },
  { id: "loginName", label: "LOGIN NAME", sortable: true },
  { id: "password", label: "PASSWORD", sortable: false },
  { id: "status", label: "STATUS", sortable: true },
  { id: "edit", label: "EDIT", sortable: false },
];

const userType = [
  {
    id: 1,
    name: "Location",
  },
  {
    id: 2,
    name: "User",
  },
];

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

// Function to fetch Organization Hierarchy List
const getOrgHierarchyList = (
  api,
  params,
  setList,
  setTotalRecords,
  setShowSearchStatusModel,
  setSearchStatusType,
  setSearchStatusMessage
) => {
  api.sendRequest(
    UserMasterAPI.getOrgHierarchy,
    (response) => {
      console.log("Org Hierarchy List:", response.orgnHierarchyDataList);
      if (response.statusCode === "200") {
        const data = response.orgnHierarchyDataList || [];
        setList(data);
        setTotalRecords(response.totalRecords || 0);
        if (data.length === 0) {
          setSearchStatusType("info");
          setSearchStatusMessage("No location records found.");
          setShowSearchStatusModel(true);
        }
      } else {
        setList([]);
        setTotalRecords(0);
        setSearchStatusType("error");
        setSearchStatusMessage(
          response.statusMessage || "Error fetching locations."
        );
        setShowSearchStatusModel(true);
      }
    },
    params,
    null,
    (error) => {
      console.error("Error fetching org hierarchy list:", error);
      setList([]);
      setTotalRecords(0);
      setSearchStatusType("error");
      setSearchStatusMessage(
        error.message || "An error occurred while fetching locations."
      );
      setShowSearchStatusModel(true);
    }
  );
};

// Function to fetch User List
const getUserList = (
  api,
  params,
  setList,
  setTotalRecords,
  setShowSearchStatusModel,
  setSearchStatusType,
  setSearchStatusMessage
) => {
  api.sendRequest(
    UserMasterAPI.getUserList,
    (response) => {
      if (response.statusCode === "200") {
        const data = response.userDetailsList || [];
        setList(data);
        setTotalRecords(response.totalRecords || 0);
        if (data.length === 0) {
          setSearchStatusType("info");
          setSearchStatusMessage("No user records found.");
          setShowSearchStatusModel(true);
        }
      } else {
        setList([]);
        setTotalRecords(0);
        setSearchStatusType("error");
        setSearchStatusMessage(
          response.statusMessage || "Error fetching users."
        );
        setShowSearchStatusModel(true);
      }
    },
    params,
    null,
    (error) => {
      console.error("Error fetching user list:", error);
      setList([]);
      setTotalRecords(0);
      setSearchStatusType("error");
      setSearchStatusMessage(
        error.message || "An error occurred while fetching users."
      );
      setShowSearchStatusModel(true);
    }
  );
};

const ViewUser = ({
  onEditLocation,
  onEditUser,
  refreshKey,
  isSearchExpanded,
  onSearchAccordionChange,
}) => {
  const [selectedType, setSelectedType] = React.useState(userType[0]);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const api = useHttp();
  const [orgSearchParams, setOrgSearchParams] = React.useState({
    hierarchyLevelId: 0,
    locationName: "",
    locationCode: "",
    parentLocationName: "",
    parentCode: "",
    userName: "",
    pageIndex: 1,
    pageSize: 10,
    parentHierarchyLevelID: 0,
    orgnHierarchyLevelID: 0,
  });
  const [orgHierarchyList, setOrgHierarchyList] = React.useState([]);
  const [roleList, setRoleList] = React.useState([]);
  const [userRoleList, setUserRoleList] = React.useState([]);
  const [hierarchyList, setHierarchyList] = React.useState([]);
  const [locationOptions, setLocationOptions] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [displayedData, setDisplayedData] = React.useState([]);
  const [userSearchParams, setUserSearchParams] = React.useState({
    roleId: 0,
    status: 2,
    name: "",
    mobileNumber: "",
    emailId: "",
    pageIndex: 1,
    pageSize: 10,
    createdUserId: 0,
  });
  const [totalUserRecords, setTotalUserRecords] = useState(0);
  const [totalLocationRecords, setTotalLocationRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const statusUpdateApi = useHttp();
  // State for Table Action Status Model (e.g., status toggle)
  const [showTableStatusModel, setShowTableStatusModel] = useState(false);
  const [tableStatusType, setTableStatusType] = useState("success"); // 'success' or 'error'
  const [tableStatusMessage, setTableStatusMessage] = useState("");
  const statusTimerRef = useRef(null); // For auto-dismiss
  // State for Search Action Status Model (e.g., search results, errors)
  const [showSearchStatusModel, setShowSearchStatusModel] = useState(false);
  const [searchStatusType, setSearchStatusType] = useState("success"); // 'success' or 'error'
  const [searchStatusMessage, setSearchStatusMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({}); // State for password visibility

  // Log the entire passwordVisibility state whenever the component re-renders
  console.log("Current passwordVisibility state:", passwordVisibility);

  const handleSort = (columnId) => {
    const column =
      selectedType?.id === 1
        ? LocationColumns.find((c) => c.id === columnId)
        : UserColumns.find((c) => c.id === columnId);

    if (!column || !column.sortable) {
      return;
    }

    let direction = "asc";
    if (sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key: columnId, direction });
  };

  const handlePaginationChange = (paginationState) => {
    const newPage = paginationState.page;
    const newRowsPerPage = paginationState.rowsPerPage;
    const newPageIndex = newPage + 1; // API uses 1-based index

    setPage(newPage);
    setRowsPerPage(newRowsPerPage);

    if (selectedType?.id === 1) {
      // Location type
      const updatedParams = {
        ...orgSearchParams,
        pageIndex: newPageIndex,
        pageSize: newRowsPerPage,
      };
      setOrgSearchParams(updatedParams);
      getOrgHierarchyList(
        api,
        updatedParams,
        setOrgHierarchyList,
        setTotalLocationRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    } else {
      // User type
      const updatedParams = {
        ...userSearchParams,
        pageIndex: newPageIndex,
        pageSize: newRowsPerPage,
      };
      setUserSearchParams(updatedParams);
      console.warn(
        "Updating User Search Params for Pagination:",
        updatedParams
      );
      // Call API to fetch user list for the new page/rows
      getUserList(
        api,
        updatedParams,
        setUserList,
        setTotalUserRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    }
  };

  // Fetch initial Org Hierarchy list using helper
  useEffect(() => {
    const initialParams = {
      ...orgSearchParams,
      pageIndex: page + 1, // Use current page state
      pageSize: rowsPerPage,
    };
    getOrgHierarchyList(
      api,
      initialParams,
      setOrgHierarchyList,
      setTotalLocationRecords,
      setShowSearchStatusModel,
      setSearchStatusType,
      setSearchStatusMessage
    );
  }, [page, rowsPerPage, refreshKey]);

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
        condition: "2",
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
    api.sendRequest(
      UserMasterAPI.getUserRoleList,
      (response) => {
        if (response.statusCode === "200") {
          setUserRoleList(response.bindEntityNameList || []);
        } else {
          setUserRoleList([]);
        }
      },
      {
        roleID: userSearchParams.roleId,
      },
      null,
      (error) => {
        console.error("Error fetching hierarchy data:", error);
        setUserRoleList([]);
      }
    );
  }, [userSearchParams.roleId]);

  // Fetch location options based on hierarchy selection (Location Search)
  useEffect(() => {
    if (selectedType?.id === 1 && orgSearchParams.hierarchyLevelID > 0) {
      setLocationOptions([]);
      api.sendRequest(
        UserMasterAPI.getLocationList,
        (response) => {
          if (response.statusCode === "200") {
            setLocationOptions(response.locationList || []);
          } else {
            setLocationOptions([]);
          }
        },
        {
          hierarchyLevelID: orgSearchParams.hierarchyLevelID,
          orgnHierarchyID: 0,
        },
        null,
        (error) => {
          console.error("Error fetching location list:", error);
          setLocationOptions([]);
        }
      );
    } else {
      setLocationOptions([]);
    }
  }, [orgSearchParams.hierarchyLevelID, selectedType]);

  // Fetch initial User list using helper
  useEffect(() => {
    if (selectedType?.id === 2) {
      const initialParams = {
        ...userSearchParams,
        pageIndex: page + 1, // Use current page state
        pageSize: rowsPerPage,
      };
      getUserList(
        api,
        initialParams,
        setUserList,
        setTotalUserRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    } else {
      setUserList([]); // Clear user list if type is not User
      setTotalUserRecords(0);
    }
  }, [selectedType, page, rowsPerPage, refreshKey]);

  useEffect(() => {
    const sourceData = selectedType?.id === 1 ? orgHierarchyList : userList;
    let sorted = [...sourceData];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    setDisplayedData(sorted);
  }, [orgHierarchyList, userList, selectedType, sortConfig]);

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

  // Handle Search Button Click
  const handleSearch = () => {
    setPage(0); // Reset to first page for new search
    const searchPageIndex = 1;
    setShowSearchStatusModel(false);

    if (selectedType?.id === 1) {
      const updatedParams = {
        ...orgSearchParams,
        pageIndex: searchPageIndex,
        pageSize: rowsPerPage,
      };
      setOrgSearchParams(updatedParams);
      getOrgHierarchyList(
        api,
        updatedParams,
        setOrgHierarchyList,
        setTotalLocationRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    } else {
      const updatedParams = {
        ...userSearchParams,
        pageIndex: searchPageIndex,
        pageSize: rowsPerPage,
      };
      setUserSearchParams(updatedParams);
      getUserList(
        api,
        updatedParams,
        setUserList,
        setTotalUserRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    }
  };

  // Handle Cancel Button Click
  const handleCancelSearch = () => {
    setPage(0); // Reset to first page
    const resetPageIndex = 1;
    setShowSearchStatusModel(false);

    if (selectedType?.id === 1) {
      const resetParams = {
        hierarchyLevelId: 0,
        locationName: "",
        locationCode: "",
        parentLocationName: "",
        parentCode: "",
        userName: "",
        pageIndex: resetPageIndex,
        pageSize: rowsPerPage,
        parentHierarchyLevelID: 0,
        orgnHierarchyID: 0, // Ensure this is reset too if used in search
      };
      setOrgSearchParams(resetParams);

      getOrgHierarchyList(
        api,
        resetParams,
        setOrgHierarchyList,
        setTotalLocationRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    } else {
      const resetParams = {
        roleId: 0,
        status: 2,
        name: "",
        mobileNumber: "",
        emailId: "",
        pageIndex: resetPageIndex,
        pageSize: rowsPerPage,
      };
      setUserSearchParams(resetParams);
      // Reset user-specific dropdowns/fields if needed
      getUserList(
        api,
        resetParams,
        setUserList,
        setTotalUserRecords,
        setShowSearchStatusModel,
        setSearchStatusType,
        setSearchStatusMessage
      );
    }
    setSortConfig({ key: null, direction: null }); // Reset sort
  };

  const handleTogglePasswordVisibility = (userId) => {
    console.log("handleTogglePasswordVisibility called with userId:", userId);
    setPasswordVisibility((prev) => {
      console.log(`Updating passwordVisibility for ${userId}:`, {
        current: prev[userId],
        new: !prev[userId],
      });
      return {
        ...prev,
        [userId]: !prev[userId],
      };
    });
  };

  const handleEditClick = (item) => {
    if (selectedType?.id === 1) {
      onEditLocation(item);
    } else {
      onEditUser(item);
    }
  };

  // Add useEffect for auto-dismissing success messages
  useEffect(() => {
    if (showTableStatusModel && tableStatusType === "success") {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
      statusTimerRef.current = setTimeout(() => {
        setShowTableStatusModel(false);
      }, 5000); // Auto-dismiss after 5 seconds
    }
    // Cleanup timer on unmount or when model is hidden
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [showTableStatusModel, tableStatusType]);

  // Function to handle Location Status Toggle
  const handleLocationStatusToggle = (item) => {
    const payload = {
      orgnhierarchyID: item.orgnhierarchyID,
    };

    statusUpdateApi.sendRequest(
      UserMasterAPI.updateStatus,
      (response) => {
        console.log("Location Status Update Response:", response);
        if (response.statusCode === "200") {
          // ... refetch list ...
          setTableStatusType("success");
          setTableStatusMessage(
            response.statusMessage || "Location status updated successfully."
          );
          setShowTableStatusModel(true);
        } else {
          console.error(
            "Failed to update location status:",
            response.statusMessage
          );
          setTableStatusType("error");
          setTableStatusMessage(
            response.statusMessage || "Failed to update location status."
          );
          setShowTableStatusModel(true);
        }
      },
      payload,
      null,
      (error) => {
        console.error("Error updating location status:", error);
        setTableStatusType("error");
        setTableStatusMessage(error.message || "An error occurred.");
        setShowTableStatusModel(true);
      }
    );
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      {/* Status Model Display */}

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
                title="Search"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                expanded={isSearchExpanded}
                onChange={onSearchAccordionChange}
              >
                <Grid
                  container
                  spacing={2}
                  mb={3}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TYPE
                    </Typography>
                    <NuralAutocomplete
                      options={userType}
                      value={selectedType}
                      onChange={(event, newValue) => {
                        setSelectedType(newValue);
                        console.log("Selected Type:", newValue);
                      }}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                      width="100%"
                      label="Type"
                      placeholder="SELECT"
                    />
                  </Grid>
                  {selectedType?.id === 1 ? (
                    <>
                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          HEIRARCHY
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
                                orgSearchParams.hierarchyLevelID
                            ) || null
                          }
                          onChange={(event, value) => {
                            setOrgSearchParams((prev) => ({
                              ...prev,
                              hierarchyLevelID: value?.hierarchyLevelID,
                            }));
                          }}
                          label="Hierarchy"
                          placeholder="SELECT"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          LOCATION CODE
                        </Typography>

                        {/* {
  "orgnhierarchyID": 459,
  "locationCode": "SouthLFR-NA",
  "locationName": "SouthLFR"
}
 */}
                        <NuralAutocomplete
                          options={locationOptions}
                          isOptionEqualToValue={(option, value) =>
                            option?.locationCode === value?.locationCode
                          }
                          getOptionLabel={(option) =>
                            option?.locationCode || ""
                          }
                          onChange={(event, value) => {
                            setOrgSearchParams((prev) => ({
                              ...prev,
                              orgnHierarchyLevelID: value?.orgnhierarchyID,
                            }));
                          }}
                          value={
                            locationOptions.find(
                              (location) =>
                                location.orgnhierarchyID ===
                                orgSearchParams.orgnHierarchyLevelID
                            ) || null
                          }
                          width="100%"
                          label="Location Code"
                          placeholder="SELECT"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          LOCATION NAME
                        </Typography>
                        <NuralAutocomplete
                          options={locationOptions}
                          isOptionEqualToValue={(option, value) =>
                            option?.locationName === value?.locationName
                          }
                          getOptionLabel={(option) =>
                            option?.locationName || ""
                          }
                          onChange={(event, value) => {
                            setOrgSearchParams((prev) => ({
                              ...prev,
                              orgnHierarchyLevelID: value?.orgnhierarchyID,
                            }));
                          }}
                          value={
                            locationOptions.find(
                              (location) =>
                                location.orgnhierarchyID ===
                                orgSearchParams.orgnHierarchyLevelID
                            ) || null
                          }
                          width="100%"
                          label="Location Code"
                          placeholder="SELECT"
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6} md={3} lg={3}>
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
                        <NuralAutocomplete
                          options={roleList}
                          isOptionEqualToValue={(option, value) =>
                            option?.roleId === value?.roleId
                          }
                          getOptionLabel={(option) => option?.roleName || ""}
                          value={
                            roleList.find(
                              (role) => role.roleId === userSearchParams.roleId
                            ) || null
                          }
                          onChange={(event, value) => {
                            setUserSearchParams({
                              ...userSearchParams,
                              roleId: value?.roleId,
                            });
                          }}
                          width="100%"
                          label="User Role"
                          placeholder="SELECT"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          USER NAME
                        </Typography>
                        {/*  {
            "entityTypeName": "A  Hemalatha (ISP)",
            "userID": 12049
        }, */}
                        <NuralAutocomplete
                          options={userRoleList}
                          isOptionEqualToValue={(option, value) =>
                            option?.userID === value?.userID
                          }
                          getOptionLabel={(option) =>
                            option?.entityTypeName || ""
                          }
                          value={
                            userRoleList.find(
                              (role) =>
                                role.userID === userSearchParams.createdUserId
                            ) || null
                          }
                          onChange={(event, value) => {
                            setUserSearchParams({
                              ...userSearchParams,
                              createdUserId: value?.userID,
                            });
                          }}
                          width="100%"
                          label="User Name"
                          placeholder="SELECT"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          MOBILE NUMBER
                        </Typography>
                        <NuralTextField
                          value={userSearchParams.mobileNumber}
                          onChange={(event) => {
                            setUserSearchParams({
                              ...userSearchParams,
                              mobileNumber: event.target.value,
                            });
                          }}
                          width="100%"
                          placeholder="MOBILE NUMBER"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={3} md={1}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={handleCancelSearch}
                      width="100%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={9} md={11}>
                    <NuralTextButton
                      icon={"./Icons/searchIcon.svg"}
                      iconPosition="right"
                      height="36px"
                      backgroundColor={PRIMARY_BLUE2}
                      color="#fff"
                      width="100%"
                      fontSize="12px"
                      onClick={handleSearch}
                    >
                      SEARCH
                    </NuralTextButton>
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
            {showTableStatusModel && (
              <Grid
                item
                xs={12}
                sx={{ position: "sticky", top: 80, zIndex: 1200 }}
              >
                {" "}
                {/* Adjust top offset as needed */}
                <StatusModel
                  width="100%"
                  status={tableStatusType === "success" ? "200" : "500"} // Or map type to status code
                  title={tableStatusMessage}
                  onClose={() => setShowTableStatusModel(false)}
                />
              </Grid>
            )}
            {/* Search Status Model Display */}
            {showSearchStatusModel && (
              <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
                <StatusModel
                  width="100%"
                  status={searchStatusType === "success" ? "200" : "500"}
                  title={searchStatusMessage}
                  onClose={() => setShowSearchStatusModel(false)}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {isSearchExpanded && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }} mt={-2}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: LIGHT_GRAY2,
              color: PRIMARY_BLUE2,
              maxHeight: "calc(100vh - 90px)",
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={15}
                    sx={{
                      backgroundColor: LIGHT_GRAY2,
                      position: "sticky",
                      top: 0,
                      zIndex: 1100,
                      borderBottom: "none",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "19.12px",
                        letterSpacing: "0%",
                        color: PRIMARY_BLUE2,
                        p: 1,
                      }}
                    >
                      List
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  <TableCell
                    sx={{
                      ...tableHeaderStyle,
                      position: "sticky",
                      top: "49px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>S.NO</Grid>
                    </Grid>
                  </TableCell>
                  {(selectedType?.id === 1 ? LocationColumns : UserColumns).map(
                    (column) => (
                      <TableCell
                        key={column.id}
                        onClick={() => column.sortable && handleSort(column.id)}
                        sx={{
                          ...tableHeaderStyle,
                          cursor: column.sortable ? "pointer" : "default",
                          position: "sticky",
                          top: "48px",
                          backgroundColor: LIGHT_GRAY2,
                          zIndex: 1100,
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>{column.label}</Grid>
                          {column.sortable && (
                            <Grid
                              item
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {sortConfig.key === column.id ? (
                                sortConfig.direction === "asc" ? (
                                  <ArrowUpwardIcon
                                    sx={{
                                      fontSize: 16,
                                      color: PRIMARY_BLUE2,
                                    }}
                                  />
                                ) : (
                                  <ArrowDownwardIcon
                                    sx={{
                                      fontSize: 16,
                                      color: PRIMARY_BLUE2,
                                    }}
                                  />
                                )
                              ) : (
                                <Grid
                                  container
                                  direction="column"
                                  alignItems="center"
                                  sx={{ height: 16, width: 16 }}
                                >
                                  <ArrowUpwardIcon
                                    sx={{ fontSize: 12, color: "grey.400" }}
                                  />
                                  <ArrowDownwardIcon
                                    sx={{ fontSize: 12, color: "grey.400" }}
                                  />
                                </Grid>
                              )}
                            </Grid>
                          )}
                        </Grid>
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        selectedType?.id === 1
                          ? LocationColumns.length + 1
                          : UserColumns.length + 1
                      }
                      align="center"
                    >
                      {api.isLoading ? (
                        <Typography>Loading...</Typography>
                      ) : (
                        "No data available"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((item, index) =>
                    selectedType?.id === 1 ? (
                      <TableRow key={item.orgnhierarchyID || index}>
                        <TableCell sx={{ ...rowstyle }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.hierarchyLevelName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.locationName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.locationCode}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.locationUserName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.parentLocationName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.parentLocationUserName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={item.status === 1}
                            onChange={() => handleLocationStatusToggle(item)}
                            disabled={statusUpdateApi.isLoading}
                            sx={toggleSectionStyle}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Edit
                            sx={{ color: DARK_PURPLE, cursor: "pointer" }}
                            fontSize="small"
                            onClick={() => handleEditClick(item)}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={item.userID || index}>
                        <TableCell sx={{ ...rowstyle }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.roleName}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>{item.name}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>{item.email}</TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.mobileNo}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.userLocationNames || "--"}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.userLocationCodes || "--"}
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          {item.loginName}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...rowstyle,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {(() => {
                            // Log details for this specific cell render
                            console.log(
                              `Rendering password cell for userID: ${
                                item.userID
                              }, visibility: ${
                                passwordVisibility[item.userID]
                              }, password available: ${!!item.password}`
                            );
                            return (
                              <span style={{ flexGrow: 1 }}>
                                {passwordVisibility[item.userID]
                                  ? item.password || "********"
                                  : "********"}
                              </span>
                            );
                          })()}
                          <IconButton
                            onClick={() => {
                              console.log(
                                "IconButton clicked for userID:",
                                item.userID
                              ); // Log on click
                              handleTogglePasswordVisibility(item.userID);
                            }}
                            size="small"
                            sx={{ ml: 1, color: PRIMARY_BLUE2 }}
                          >
                            {passwordVisibility[item.userID] ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Switch
                            checked={item.status === 1}
                            disabled={statusUpdateApi.isLoading}
                            sx={toggleSectionStyle}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ ...rowstyle }}>
                          <Edit
                            sx={{ color: DARK_PURPLE, cursor: "pointer" }}
                            fontSize="small"
                            onClick={() => handleEditClick(item)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>

            <NuralPagination
              key={`pagination-${selectedType?.id}-${page}-${rowsPerPage}`}
              totalRecords={
                selectedType?.id === 1 ? totalLocationRecords : totalUserRecords
              }
              initialPage={page}
              initialRowsPerPage={rowsPerPage}
              onPaginationChange={handlePaginationChange}
            />
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
};

ViewUser.propTypes = {
  onEditLocation: PropTypes.func.isRequired,
  onEditUser: PropTypes.func.isRequired,
  refreshKey: PropTypes.number.isRequired,
  isSearchExpanded: PropTypes.bool.isRequired,
  onSearchAccordionChange: PropTypes.func.isRequired,
};

export default ViewUser;
