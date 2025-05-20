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
  const [issueEditData, setIssueEditData] = React.useState(null);
  const [categoryEditData, setCategoryEditData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("l1l2-issue");
  const [refreshView, setRefreshView] = React.useState(false);
  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-planogram" },
    { label: "Manage Audit", value: "manage-audit" },
    { label: "L1L2 Issue", value: "l1l2-issue" },
    { label: "RI Weightage", value: "ri-weightage" },
  ]);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const handleRecordAdded = () => {
    setRefreshView((prev) => !prev);
  };

  const handleEditIssue = (issue) => {
    setIssueEditData(issue);
  };

  const handleEditCategory = (category) => {
    setCategoryEditData(category);
  };

  return (
    <Grid container spacing={2}  sx={{ position: "relative" }}>
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
        <Grid item xs={12} mt={0} mb={0} ml={0}>
          <BreadcrumbsHeader pageTitle="Brand" />
        </Grid>

        <Grid item xs={12} ml={0}>
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
        mt={0}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Grid
          item
          xs={12}
          sx={{ p: { xs: 0, sm: 0, md: 0 }, pl: { xs: 2 }, pr: { xs: 2 } }}
        >
          <CreateCategory
            onRecordAdded={handleRecordAdded}
            editData={categoryEditData}
          />
          <CreateIssue
            onRecordAdded={handleRecordAdded}
            editData={issueEditData}
          />
          <View
            refreshTrigger={refreshView}
            onEditIssue={handleEditIssue}
            onEditCategory={handleEditCategory}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default L1L2Issue;
