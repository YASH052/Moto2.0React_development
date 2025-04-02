import { Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";

import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import { DARK_PURPLE } from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";
import TransationCard from "../Transaction/TransationCard";

const announcementTypes = [
  { title: "BULLETIN", link: "/bulletin" },
  { title: "BANNER", link: "/banner" },
];

const companyInfoTypes = [
  { title: "PAN", link: "/pan" },
  { title: "GST", link: "/gst" },
  { title: "REGISTRATION", link: "/registration" },
  { title: "CIN", link: "/cin" },
];

const geographyTypes = [
  { title: "COUNTRY", link: "/country" },
  { title: "REGION", link: "/region" },
  { title: "STATE", link: "/state" },
  { title: "CITY", link: "/city" },
  { title: "AREA", link: "/area" },
  { title: "BATCH", link: "/geography-bulk-upload" },
];

const hierarchyTypes = [
  { title: "ROLES/ENTITY", link: "/roles-entity" },
  { title: "TEAM/ROLES", link: "/team-roles" },
  { title: "REPORTING", link: "/reporting" },
  { title: "RELATIONS", link: "/relations" },
  { title: "VIEW", link: "/view" },
];

const queryTypes = [
  { title: "CATEGORY", link: "/q-category" },
  { title: "MAPPING", link: "/q-mapping" },
];

const AgencyTypes = [{ title: "AGENCY", link: "/add-agancy" }];

const Organization = () => {
  return (
    <Grid container spacing={2}>
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
          <BreadcrumbsHeader pageTitle="Organization" />
        </Grid>
      </Grid>

      <Grid container spacing={2} p={1}>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={announcementTypes} title="Announcement" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={companyInfoTypes} title="Company Info" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={geographyTypes} title="Geography" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={hierarchyTypes} title="Hierarchy" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={queryTypes} title="Query" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={AgencyTypes} title="Agency" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Organization;
