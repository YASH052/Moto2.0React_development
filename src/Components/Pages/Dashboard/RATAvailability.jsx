import { Grid, Typography, Button, Stack, IconButton } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  LIGHTAQUA,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";

import { useNavigate } from "react-router-dom";

import TabsBar from "../../Common/TabsBar";
import ShelfLifeGraph from "../../Common/ShelfLifeGraph";
import InventoryAgeGraph from "../../Common/InventoryAgeGraph";

import NuralAutocomplete from "../NuralCustomComponents/NuralAutocomplete";
import NuralDistributorSales from "../NuralCustomComponents/NuralDistributorSales";
import DistributorInventoryChart from "../NuralCustomComponents/DashboardWidgets/DistributorInventoryChart";
import ProductSalesChart from "../NuralCustomComponents/DashboardWidgets/ProductSalesChart";
import RetailerSalesChart from "../NuralCustomComponents/DashboardWidgets/RetailerSalesChart";
import ProductAvailabilityCard from "../../Common/ProductAvailabilityCard";

const data = [
  { date: "14/03", total: 3000, nsm: 2000 },
  { date: "15/03", total: 9000, nsm: 8000 },
  { date: "16/03", total: 4000, nsm: 7000 },
  { date: "17/03", total: 6000, nsm: 8000 },
  { date: "18/03", total: 8000, nsm: 4000 },
  { date: "19/03", total: 9000, nsm: 7000 },
  { date: "20/03", total: 8500, nsm: 8000 },
];
const salesMetrics = [
  {
    title: "Yesterday Sales",
    value: "₹14,200",
    trend: 5.2,
    comparedTo: "VS PREV. DAY",
    backgroundColor: "#F8F7FF",
  },

  {
    title: "MTD Sales",
    value: "₹2,85,400",
    trend: -12.3,
    comparedTo: "VS PREV. MONTH",
    backgroundColor: "#F8F7FF",
  },
  {
    title: "YTD Sales",
    value: "₹14.85Cr",
    trend: -2.7,
    comparedTo: "VS PREV. YEAR",
    backgroundColor: "#FFF1F1",
  },
  {
    title: "ISPs Present Yesterday",
    value: "115/124",
    trend: 92,
    comparedTo: "ATTENDANCE",
    subtitle: "93% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
  {
    title: "ISPs Present Yesterday",
    value: "78/124",
    trend: 56,
    comparedTo: "ATTENDANCE",
    subtitle: "89% ATTENDANCE",
    backgroundColor: "#FFFFFF",
  },
];

const productData = [
  {
    productName: "Product 1",
    scrCompliance: 52,
    zeroStock: 28,
    inventory: 10,
    totalStock: "11K",
  },
  {
    productName: "Product 2",
    scrCompliance: 75,
    zeroStock: 15,
    inventory: 25,
    totalStock: "15K",
  },
  {
    productName: "Product 3",
    scrCompliance: 45,
    zeroStock: 35,
    inventory: 8,
    totalStock: "8K",
  },
  {
    productName: "Product 4",
    scrCompliance: 88,
    zeroStock: 12,
    inventory: 30,
    totalStock: "20K",
  },
  {
    productName: "Product 5",
    scrCompliance: 62,
    zeroStock: 22,
    inventory: 15,
    totalStock: "12K",
  },
  {
    productName: "Product 6",
    scrCompliance: 78,
    zeroStock: 18,
    inventory: 20,
    totalStock: "18K",
  },
  {
    productName: "Product 7",
    scrCompliance: 55,
    zeroStock: 25,
    inventory: 12,
    totalStock: "10K",
  },
  {
    productName: "Product 8",
    scrCompliance: 92,
    zeroStock: 8,
    inventory: 35,
    totalStock: "25K",
  },
];

const RATAvailability = () => {
  const [activeTab, setActiveTab] = React.useState("availability");
  const [quickLinks, setQuickLinks] = React.useState([
    { id: 1, label: "QUICK LINK 4", path: "/quick-link-4" },
    null,
    null,
    null,
  ]);

  const tabs = [
    { label: "Business", value: "business" },
    { label: "Channels", value: "channels" },
    { label: "Availability", value: "availability" },
    { label: "Brand", value: "brand" },
    { label: "Inventory", value: "inventory" },
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
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Add these states for pagination

  // Replace the existing dummy data with this more realistic data

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
        }}
      >
        {/* Quick Links Row */}

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
            <Grid item xs={12} md={12} lg={12} mt={2}>
              <Stack direction="row" spacing={0}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "28px",
                    letterSpacing: "0%",
                  }}
                  color={DARK_PURPLE}
                >
                  Good Afternoon Name Surname
                </Typography>
              </Stack>
              <Stack>
                <Typography
                  sx={{
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "8px",
                    lineHeight: "100%",
                    letterSpacing: "4%",
                    textTransform: "uppercase",
                    color: SECONDARY_BLUE,
                    m: 1,
                  }}
                >
                  LAST LOGIN : 120:05 PM, 20 MARCH 2025
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12} ml={1}>
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
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={0} direction="column">
              <Grid item>
                {/* First Row - 3 NuralAutocomplete */}
                <Grid
                  container
                  spacing={2}
                  mb={2}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="All NSM"
                      options={options}
                      placeholder="ALL NSM"
                      backgroundColor={WHITE}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={3}>
                    <NuralAutocomplete
                      width="100%"
                      label="ALL RSM"
                      options={options}
                      backgroundColor={WHITE}
                      placeholder="ALL RSM"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {productData.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <ProductAvailabilityCard
                        productName={product.productName}
                        scrCompliance={product.scrCompliance}
                        zeroStock={product.zeroStock}
                        inventory={product.inventory}
                        totalStock={product.totalStock}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Add Shelf Life Graph */}
                <Grid container spacing={6} mt={-2}>
                  <Grid item xs={12} md={6} lg={6}>
                    <ShelfLifeGraph />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <InventoryAgeGraph />
                  </Grid>
                </Grid>
                {/* Add Product Sales Chart */}
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2} sx={{ mb: 2, px: 2 }}>
            {quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                {link ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(link.path)}
                    sx={{
                      backgroundColor: PRIMARY_BLUE2,
                      color: WHITE,
                      borderRadius: "40px",
                      textTransform: "uppercase",
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      padding: "12px",
                      height: "48px",
                      "&:hover": {
                        backgroundColor: DARK_PURPLE,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {link.label} {">"}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      const newLink = {
                        id: Date.now(),
                        label: `QUICK LINK ${index + 1}`,
                        path: `/quick-link-${index + 1}`,
                      };
                      const updatedLinks = [...quickLinks];
                      updatedLinks[index] = newLink;
                      setQuickLinks(updatedLinks);
                    }}
                    sx={{
                      borderColor: "transparent",
                      color: PRIMARY_BLUE2,
                      backgroundColor: LIGHT_GRAY2,
                      textTransform: "uppercase",
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      "&:hover": {
                        backgroundColor: LIGHT_GRAY2,
                        borderColor: "transparent",
                        opacity: 0.9,
                      },
                    }}
                  >
                    ADD NEW
                    <AddIcon sx={{ fontSize: 20 }} />

                  </Button>
                )}
              </Grid>
            ))}
          </Grid>
          {/* Add ISP Zero Sale Table */}
        </Grid>
      </Grid>
    </>
  );
};

export default RATAvailability;
