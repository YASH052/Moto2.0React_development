import { Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import TransationCard from "./TransationCard";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import { DARK_PURPLE } from "../../../Common/colors";
import TabsBar from "../../../Common/TabsBar";

const salesTypes = [
  { title: "PRIMARY SALE", link: "/primary-transaction" },
  { title: "SECONDARY SALE", link: "/secondary-sale" },
  { title: "INTERMEDIARY SALE", link: "/intermediary-sale" },
 
];

const salesReturnTypes = [
  { title: "PRIMARY SALE RETURN", link: "/primary-sale-return" },
  { title: "SECONDARY SALE RETURN", link: "/secondary-sale-return" },
  { title: "INTERMEDIARY SALE RETURN", link: "/intermediary-sale-return" },
];

const otherTypes = [
  { title: "STOCK GRN", link: "/stock-grn" },
  { title: "STOCK ADJUSTMENT", link: "/stock-adjustment" },
  { title: "SAP INTEGRATION", link: "/sap-integration" },
];

const Transactions = () => {
  const [activeTab, setActiveTab] = React.useState("primary");

  const tabs = [
    { label: "Primary", value: "primary" },
    { label: "Intermediary", value: "intermediary" },
    { label: "Secondary", value: "secondary" },
    { label: "Tertiary", value: "tertiary" },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

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
          <BreadcrumbsHeader pageTitle="Transactions" />
        </Grid>
      </Grid>

      <Grid container spacing={0} p={1}>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={salesTypes} title="Sales" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={salesReturnTypes} title="Sales Return" />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <TransationCard salesTypes={otherTypes} title="Others" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Transactions;
