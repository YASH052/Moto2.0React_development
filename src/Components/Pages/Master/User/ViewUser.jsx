import { Grid } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import { useNavigate } from "react-router-dom";

const ViewUser = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("view-user");

  const tabbs = [
    { label: "Add Location", value: "add-location" },
    { label: "View Location", value: "view-location" },
    { label: "Add User", value: "add-user" },
    { label: "View User", value: "view-user" },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case "add-location":
        navigate("/add-location");
        break;
      case "view-location":
        navigate("/view-location");
        break;
      case "add-user":
        navigate("/add-user");
        break;
      case "view-user":
        navigate("/view-user");
        break;
      default:
        break;
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
          <BreadcrumbsHeader pageTitle="View User" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {/* Add your view user content here */}
        <div>View User Content</div>
      </Grid>
    </Grid>
  );
};

export default ViewUser;