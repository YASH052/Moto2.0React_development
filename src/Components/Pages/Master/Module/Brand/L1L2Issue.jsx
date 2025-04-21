import { Grid } from "@mui/material";
import React from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../Common/TabsBar";
import { useNavigate } from "react-router-dom";
import CreateCategory from "../../L1&L2/CreateCategory";
import CreateIssue from "../../L1&L2/CreateIssue";
import View from "../../L1&L2/View";

const L1L2Issue = () => {
  const navigate = useNavigate();
  const [showModel, setShowModel] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("l1l2-issue");
  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-categorization" },
    { label: "Manage Audit", value: "manage-audit" },
    { label: "L1L2 Issue", value: "l1l2-issue" },
    { label: "RIAudit Score", value: "riaudit-score" },
  ]);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination

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
        <Grid item xs={12} mt={0} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Brand" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabbs}
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
        mt={-1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid
          item
          xs={12}
          sx={{ p: { xs: 2, sm: 2 }, pl: { xs: 3 }, pr: { xs: 0 } }}
        >
          <CreateCategory />
          <CreateIssue />
          <View />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default L1L2Issue;
