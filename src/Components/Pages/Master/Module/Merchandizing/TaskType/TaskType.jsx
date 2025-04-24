import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  BLACK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../../../Common/colors";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../../../NuralCustomComponents/NuralAccordion";
import BreadcrumbsHeader from "../../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../../Common/TabsBar";
import NuralAccordion2 from "../../../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import { headTitle,labelStyle } from "../../../../../Common/commonstyles";

const TaskType = () => {
  

  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];
  const [activeTab, setActiveTab] = React.useState("task-type");
  const navigate = useNavigate();

  const tabs = [
    { label: "Task Type", value: "task-type" },
    { label: "Search", value: "task-search" },
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <Grid container spacing={0} ml={0} sx={{ padding: "0px",position:"relative" }}>

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
        <Box mt={2} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="Mechandizing" />
        </Box>

        <Box ml={2}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Grid item xs={12} md={12} lg={12} pr={2}>
          <Grid backgroundColor={LIGHT_GRAY2} padding={2} borderRadius={2}>
            <Typography
              variant="h5"
              sx={headTitle}
            >
              Create Task Type
            </Typography>
            {/* First Row - 3 NuralAutocomplete */}
            <Grid
              container
              spacing={2}
              mb={2}
              sx={{
                gap: { xs: 0, sm: 0, md: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography
                  
                  sx={labelStyle}
                  
                >
                 TASK TYPE
                </Typography>

                <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
              </Grid>
            </Grid>

            {/* Second Row */}

            {/* Third Row - Buttons */}
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          mt={1}
          px={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <NuralButton
              text="CANCEL"
              variant="outlined"
              color={PRIMARY_BLUE2}
              fontSize="12px"
              height="48px"
              borderColor={PRIMARY_BLUE2}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <NuralButton
              text="SAVE"
              variant="contained"
              color={AQUA_DARK}
              height="48px"
              backgroundColor={AQUA}
              width="100%"
              fontSize="12px"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TaskType;
