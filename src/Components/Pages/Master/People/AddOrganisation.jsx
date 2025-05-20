import { Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";

import { useNavigate } from "react-router-dom";

import AddUser from "../User/AddUser";
import AddLocation from "../User/AddLocation";
import ViewUser from "../User/ViewUser";
import NuralActivityPanel from "../../NuralCustomComponents/NuralActivityPanel";
import NuralExport from "../../NuralCustomComponents/NuralExport";

const AddOrganisation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("org-people");
  const [tabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "add-salesman" },
  ]);

  const [editingLocationItem, setEditingLocationItem] = useState(null);
  const [editingUserItem, setEditingUserItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState("location");

  const addLocationRef = useRef(null);
  const addUserRef = useRef(null);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleCreationSuccess = () => {
    console.log("Creation success, incrementing refresh key");
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleAccordionToggle = (panel) => {
    setExpandedAccordion((prev) => (prev === panel ? null : panel));
  };

  const handleEditLocation = (item) => {
    setEditingLocationItem(item);
    setEditingUserItem(null);
    setExpandedAccordion("location");
    addLocationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleEditUser = (item) => {
    setEditingUserItem(item);
    setEditingLocationItem(null);
    setExpandedAccordion("user");
    addUserRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditingLocationItem(null);
    setEditingUserItem(null);
  };

  const handleExport = () => {
    console.log("Export clicked in AddOrganisation");
    // Add export logic here later
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="People" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      {/* Main Content Area with Right Padding */}
      <Grid
        item
        xs={12} // Takes full width initially
        sx={{
          mt: 1,
          zIndex: 1,
          pr: { lg: '270px' }, // Add padding on large screens to avoid overlap with fixed sidebar
          width: '100%' // Ensure it tries to use full width before padding
        }}
      >
        <Grid container spacing={0} >
          <Grid
            item
            xs={12}
            sx={{ p: { xs: 2, sm: 2 }, pl: { xs: 3 }, pr: { xs: 0 } }}
          >
            {activeTab === "org-people" && (
              <>
                <div ref={addLocationRef}>
                  <AddLocation
                    editingLocation={editingLocationItem}
                    onCancelEdit={handleCancelEdit}
                    onCreationSuccess={handleCreationSuccess}
                    isExpanded={expandedAccordion === "location"}
                    onAccordionChange={() => handleAccordionToggle("location")}
                  />
                </div>
                <div ref={addUserRef}>
                  <AddUser
                    editingUser={editingUserItem}
                    onCancelEdit={handleCancelEdit}
                    onCreationSuccess={handleCreationSuccess}
                    isExpanded={expandedAccordion === "user"}
                    onAccordionChange={() => handleAccordionToggle("user")}
                  />
                </div>
                <ViewUser
                  onEditLocation={handleEditLocation}
                  onEditUser={handleEditUser}
                  refreshKey={refreshKey}
                  isSearchExpanded={expandedAccordion === "search"}
                  onSearchAccordionChange={() => handleAccordionToggle("search")}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Fixed Sidebar */}
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={3}
        mt={0}
        mr={0}
        position={"fixed"} // Re-applied fixed position
        right={{ // Positioned to the right
          xs: 0,
          sm: 5,
          md: 5,
          lg: 0,
        }}
        sx={{
          zIndex: 1000, // Ensure it's above content but below header potentially?
          top: "0px", // Position below the sticky header (adjust as needed)
          right: "1rem", // Spacing from the right edge
          height: "calc(100vh - 10px)", // Fill height below header
          overflowY: "auto",
          paddingBottom: "20px",
          "& > *": {
            marginBottom: "16px",
            transition: "filter 0.3s ease",
          },
          "& .export-button": {
            filter: "none !important",
          },
        }}
      >
        <NuralActivityPanel height="100%"> {/* Panel takes full height of its container */}
          <Grid item xs={12} md={12} lg={12} xl={12} mt={2}>
            <NuralExport
               title="Export "
               views={{}}
               downloadExcel={handleExport} // Connect the handler
              //  isDownloadLoading={isDownloadLoading}
            />
          </Grid>
        </NuralActivityPanel>
      </Grid>
    </Grid>
  );
};

export default AddOrganisation;
