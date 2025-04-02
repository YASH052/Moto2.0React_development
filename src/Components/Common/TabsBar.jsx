import React from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { DARK_PURPLE, PRIMARY_LIGHT_PURPLE2 } from "./colors";

const TabsBar = ({ tabs, activeTab, onTabChange }) => {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          sx={{
          "& .MuiTab-root": {
            
            color: PRIMARY_LIGHT_PURPLE2,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            "&:focus": {
              outline: "none",
            },
            "&.Mui-focusVisible": {
              outline: "none",
            },
          },
          "& .Mui-selected": {
            color: `${DARK_PURPLE} !important`,
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "19.12px",
            letterSpacing: "0%",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: DARK_PURPLE,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default TabsBar;
