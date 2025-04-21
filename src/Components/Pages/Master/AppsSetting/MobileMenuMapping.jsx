import { Grid, Typography, Button, Skeleton } from "@mui/material";
import React, { useEffect, useCallback, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import ToggleSection from "./ToggleSection";

import { useNavigate } from "react-router-dom";
import {
  GetClientAppRoleMenuMappingMoto,
  GetEntityListWithRoleID,
  GetRoleList,
  ManageClientAppRoleMenuMappingMoto,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton } from "../../../Common/Skeletons";
import Required from "../../../Common/Required";

// Define initial state for search parameters
const initialSearchParams = {
  clientId: 0,
  pageIndex: 1, //not in use
  pageSize: 10, //not in use
  selectionMode: 0, //not in use
  assignedTo: 1 /* 1= All (send RoleID), 2= for User (send EntityID) */,
  roleId: 0,
  entityUserId: 0, //ISP UserI
};

const MobileMenuMapping = () => {
  const [activeTab, setActiveTab] = React.useState("mobile-menu-setting");

  const tabs = [
    { label: "Web", value: "web-menu-setting" },
    { label: "Mobile", value: "mobile-menu-setting" },
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

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];

  const reportsOption = [
    "Fixture Audit Report",
    "MEZ Audit Report",
    "Store Ops Report",
    "Competition Assest Report",
    "Visibility Audit Report",
  ];
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Add these states for sorting
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Enhanced sorting function
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...rows]); // Reset to original order
        return;
      }
    }

    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (!a[columnName]) return 1;
      if (!b[columnName]) return -1;

      const aValue = a[columnName].toString().toLowerCase();
      const bValue = b[columnName].toString().toLowerCase();

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedRows);
  };

  // Add search/filter functionality

  // Update the search button click handler

  const [assignTo] = React.useState([
    {
      value: 1,
      label: "All",
    },
    {
      value: 2,
      label: "Indivisual",
    },
  ]);
  const [assingFlag, setAssingFlag] = React.useState(false);
  const [roleList, setRoleList] = React.useState([]);
  const [menuList, setMenuList] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [status, setStatus] = React.useState(null);
  const [title, setTitle] = React.useState("");
  // --- NEW --- State for field-specific errors
  const [errors, setErrors] = React.useState({});
  
  // --- REMOVED --- Individual loading states for dropdowns
  // const [roleListLoading, setRoleListLoading] = React.useState(false);
  // const [userListLoading, setUserListLoading] = React.useState(false);
  const [menuListLoading, setMenuListLoading] = React.useState(false);
  // --- NEW --- Combined form loading state
  const [formLoading, setFormLoading] = React.useState(true); // Start true as getRoleList runs on mount

  const [searchParams, setSearchParams] = React.useState(initialSearchParams);

  const [formData, setFormData] = React.useState({
    clientId: 0,
    assignedTo: 2 /* 1= All (send RoleID in roleId), 2= for User (send EntityUserId in EntityUserID) and roleID */,
    roleId: 48, // mandatory in both cases
    entityUserId: 57954, // EntityUserID
    menuList: [],
  });

  const timeoutIdRef = useRef(null); // Use useRef

  // Handle toggle state changes from ToggleSection
  const handleToggleStateChange = useCallback((toggleStates) => {
    // Format menuList in the requested format
    const formattedMenuList = [];

    // Process the toggle states into the format needed for the API
    Object.keys(toggleStates).forEach(sectionId => {
      const sectionToggles = toggleStates[sectionId];
      if (sectionToggles) {
        Object.keys(sectionToggles).forEach(menuId => {
          formattedMenuList.push({
            menuId: parseInt(menuId, 10), // Ensure menuId is a number
            status: sectionToggles[menuId] ? 1 : 0 // Set status to 1 or 0
          });
        });
      }
    });

    console.log("Updating formData menuList from callback:", formattedMenuList);
    // Update formData with the new menuList
    setFormData(prev => ({
      ...prev,
      menuList: formattedMenuList
    }));
  }, []);
  
  const handleReset = useCallback(() => {
    console.log("handleReset called (clearing form and list)");
    setSearchParams(initialSearchParams);
    setMenuList([]);
    setUserList([]);
    setAssingFlag(false);
    setFormData(prev => ({
      ...prev,
      menuList: [] 
    }));
    setErrors({}); // Clear field errors on reset
  }, []);

  const clearStatus = useCallback(() => {
    console.log("clearStatus called");
    setStatus(null);
    setTitle("");
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setErrors({}); // Clear field errors when status clears
  }, []);

  // handleCancel still calls the main form reset
  const handleCancel = useCallback(() => {
    console.log("Cancel button clicked");
    handleReset();
  }, [handleReset]);

  const getRoleList = async () => {
    setFormLoading(true); // Use formLoading
    try {
      const response = await GetRoleList();
      if (response.statusCode == "200") {
        setRoleList(response.roleList);
      } else {
        setRoleList([]);
      }
    } catch (error) {
      console.error("Error in getRoleList:", error);
      setRoleList([]);
    } finally {
      setFormLoading(false); // Use formLoading
    }
  };
  const getUserList = async (roleId) => {
    if (!roleId) return; // Don't fetch if roleId is invalid
    // setUserListLoading(true); // Removed
    setUserList([]); // Clear previous list while loading
    try {
      const response = await GetEntityListWithRoleID(roleId);
      if (response.statusCode == 200) {
        setUserList(response.entityTypeWithEntityTypeIDList);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.error("Error in getUserList:", error);
      setUserList([]);
    } finally {
      // setUserListLoading(false); // Removed
    }
  };
  const handleSearchChange = (field, value) => {
    const newSearchParams = { ...searchParams, [field]: value }; 
    setSearchParams(newSearchParams);
    
    // Clear specific error when field gets a valid value
    if (field === "roleId" && value) {
        setErrors(prev => ({ ...prev, roleId: '' }));
    }
    if (field === "assignTo" && value) {
        setErrors(prev => ({ ...prev, assignTo: '' }));
    }

    if (field === "assignTo") {
      if (value === 2) {
        setAssingFlag(true);
        if (newSearchParams.roleId) { // Use updated value
          getUserList(newSearchParams.roleId);
        }
      } else {
        setAssingFlag(false);
        setUserList([]); 
        // Also update searchParams state directly for immediate reset of entityUserId
        setSearchParams((prev) => ({ ...prev, entityUserId: 0 })); 
      }
       // Update formData based on assignTo value
      setFormData(prev => ({ ...prev, assignedTo: value }));
    } else if (field === "roleId" && assingFlag) { // Use assingFlag state here
      getUserList(value);
      setSearchParams((prev) => ({ ...prev, entityUserId: 0 })); 
       // Update formData based on roleId value
      setFormData(prev => ({ ...prev, roleId: value }));
    } else if (field === "entityUserId") {
       // Update formData based on entityUserId value
      setFormData(prev => ({ ...prev, entityUserId: value }));
    }
  };
  useEffect(() => {
    getRoleList();
  }, []);

  const fetchMenuMapping = useCallback(async () => {
    clearStatus(); // Clear any pending status/timeout before fetching
    setMenuList([]); 
    setMenuListLoading(true); // Set loading true
    console.log("Fetching menu mapping with params:", searchParams);
    try {
      const response = await GetClientAppRoleMenuMappingMoto(searchParams);
      console.log("fetchMenuMapping response", response);
      if (response.statusCode === "200") {
        setMenuList(response.menuRoot || []); // Ensure menuList is always an array
       
      } else {
        // Error: Reset form and set error status
        handleReset(); // Reset form on fetch error
        setStatus(response.statusCode || '400');
        setTitle(response.statusMessage || "Failed to fetch menu data.");
      }
    } catch (error) {
      // Error: Reset form and set error status
      handleReset(); // Reset form on fetch error
      console.error("Error in fetchMenuMapping:", error);
      setMenuList([]);
      setStatus(error.statusCode || '500'); 
      setTitle(error.statusMessage || "An error occurred while fetching menu data.");
    } finally {
      setMenuListLoading(false); // Set loading false
    }
  }, [searchParams, handleReset, clearStatus]); // Added dependencies

  useEffect(() => {
    // Optional: Fetch mapping automatically when searchParams change? 
    // Currently triggered by Search button click.
    // fetchMenuMapping(); 
  }, [searchParams, fetchMenuMapping]); // Include fetchMenuMapping if uncommented

  // --- NEW --- Validation function for Save
  const validateSaveForm = () => {
    const newErrors = {};
    if (!searchParams.roleId || searchParams.roleId === 0) {
      newErrors.roleId = "Role is required";
    }
    if (!searchParams.assignTo || searchParams.assignTo === 0) {
      newErrors.assignTo = "Assign To is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handlePostRequest = useCallback(async () => {
    console.log("Submitting formData:", formData);
    clearStatus(); // Clear previous status/timeout

    // --- MODIFIED --- Use validation function
    if (!validateSaveForm()) {
      console.error("Save validation failed.");
      return; // Stop if validation fails
    }

    // Proceed if validation passes
    try {
      const updatedFormData = { 
         ...formData,
         roleId: searchParams.roleId, 
         assignedTo: searchParams.assignTo,
         entityUserId: searchParams.assignTo === 1 ? 0 : searchParams.entityUserId
       };
      console.log("Sending updatedFormData to API:", updatedFormData);
      
      const response = await ManageClientAppRoleMenuMappingMoto(updatedFormData);
      console.log("handlePostRequest response", response);

      if (response.statusCode === "200") {
        handleReset(); 
        setStatus(response.statusCode); 
        setTitle(response.statusMessage || "Success");
        
        console.log("Setting 5-second timeout to clear success status.");
        timeoutIdRef.current = setTimeout(() => {
          console.log("Timeout triggered: Clearing success status.");
          clearStatus(); 
        }, 5000); 
        
      } else {
        handleReset(); 
        setStatus(response.statusCode || '400'); 
        setTitle(response.statusMessage || "Failed to save menu data.");
      }
    } catch (error) {
      handleReset(); 
      console.error("Error in handlePostRequest:", error);
      setStatus(error.statusCode || '500'); 
      setTitle(error.statusMessage || "An error occurred while saving menu data.");
    }
  }, [formData, searchParams, handleReset, clearStatus]); // Removed validateSaveForm dependency - it reads state directly

  // Effect to clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  // Calculate visibility flags
  const isError = status !== null && status !== '200'; // Error if status exists and is not "200"
  const showList = menuList && menuList.length > 0 && !menuListLoading && !isError;

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          //   pr: { xs: 0, sm: 0, md: "160px", lg: "260px" },
        }}
      >
        {/* Breadcrumbs Grid */}
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
          <Grid item xs={12} mt={1} mb={0} ml={1} pr={3}>
            <BreadcrumbsHeader pageTitle="App Settings" />
          </Grid>

          <Grid item xs={12} ml={1}>
            <TabsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Grid>
        </Grid>

        {/* Toggle Section */}

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
                  title="Mobile Menu Mapping"
                  backgroundColor={LIGHT_GRAY2}
                >
                  {/* --- MODIFICATION --- Conditional rendering for form area */} 
                  {formLoading ? (
                    <FormSkeleton />
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      {/* Role Dropdown Area */}
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ROLE <Required/>
                        </Typography>
                        <NuralAutocomplete
                          options={roleList}
                          getOptionLabel={(option) => option.roleName}
                          isOptionEqualToValue={(option, value) =>
                            option.roleId === value.roleId
                          }
                          value={
                            roleList?.find(
                              (role) =>
                                role.roleId === searchParams.roleId || null
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange("roleId", value?.roleId || 0);
                          }}
                          label="Role"
                          placeholder="SELECT"
                          width="100%"
                          error={!!errors.roleId}
                        />
                        {errors.roleId && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                            {errors.roleId}
                          </Typography>
                        )}
                      </Grid>

                      {/* Assign To Dropdown Area */}
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ASSIGN TO <Required/>
                        </Typography>
                        <NuralAutocomplete
                          options={assignTo}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          value={
                            assignTo?.find(
                              (assign) => assign.value === searchParams.assignTo
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange("assignTo", value?.value || 0);
                          }}
                          width="100%"
                          placeholder="SELECT"
                          error={!!errors.assignTo}
                        />
                        {errors.assignTo && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                            {errors.assignTo}
                          </Typography>
                        )}
                      </Grid>

                      {/* User Dropdown Area */}
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          USER
                        </Typography>
                        <NuralAutocomplete
                          options={userList}
                          getOptionLabel={(option) => option.salesChannelName}
                          isOptionEqualToValue={(option, value) =>
                            option.userID === value.userID
                          }
                          value={
                            userList?.find(
                              (user) => user.userID === searchParams.entityUserId
                            ) || null
                          }
                          onChange={(event, value) => {
                            handleSearchChange(
                              "entityUserId",
                              value?.userID || 0
                            );
                          }}
                          width="100%"
                          placeholder="SELECT"
                          disabled={!assingFlag} 
                        />
                      </Grid>
                    </Grid>
                  )}
                  
                  {/* Reset/Search Buttons */}
                  {/* Render buttons outside the loading check if they should always be visible */} 
                  {!formLoading && ( // Or maybe always show buttons?
                     <Grid
                       container
                       spacing={2}
                       sx={{
                         flexDirection: { xs: "column", sm: "row" },
                         // gap: { xs: 2, sm: 2 },
                       }}
                     >
                       <Grid item xs={12} sm={3} md={1}>
                         <NuralButton
                           text="RESET"
                           variant="outlined"
                           color={PRIMARY_BLUE2}
                           fontSize="12px"
                           height="36px"
                           borderColor={PRIMARY_BLUE2}
                           onClick={handleReset}
                           width="100%"
                         />
                       </Grid>
                       <Grid item xs={12} sm={7} md={11}>
                         <NuralTextButton
                           icon={"./Icons/searchIcon.svg"}
                           iconPosition="right"
                           height="36px"
                           backgroundColor={PRIMARY_BLUE2}
                           color="#fff"
                           width="100%"
                           fontSize="12px"
                           onClick={fetchMenuMapping}
                         >
                           SEARCH
                         </NuralTextButton>
                       </Grid>
                     </Grid>
                  )}

                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Loading Skeleton for ToggleSection List */} 
        {menuListLoading && (
          <Grid container spacing={2} sx={{ p: { xs: 1, sm: 2 }, width: '100%' }}>
            {[...Array(6)].map((_, index) => ( // Render 6 placeholders
              <Grid item xs={12} sm={6} md={4} lg={4} key={`skeleton-${index}`}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '8px' }} />
              </Grid>
            ))}
          </Grid>
        )}

        {showList && (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <ToggleSection
              toggleItems={menuList}
              onStateChange={handleToggleStateChange}
            />
          </Grid>
        )}

        {status !== null && (
          <Grid container item xs={12} mt={1} ml={1} pr={1}>
            {console.log("status", status)}
            <StatusModel
              width="100%"
              status={status} 
              title={title}
              onClose={clearStatus} // Manually closing clears status/timeout
            />
          </Grid>
        )}

        {showList && (
          <Grid container spacing={1} mt={1} ml={1} pr={1}>
            <Grid item xs={12} sm={6}>
              <NuralButton
                text="CANCEL"
                variant="outlined"
                borderColor={PRIMARY_BLUE2}
                onClick={handleCancel}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NuralButton
                text="SAVE"
                backgroundColor={AQUA}
                variant="contained"
                onClick={handlePostRequest}
                width="100%"
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default MobileMenuMapping;
