import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { AQUA } from "../Common/colors";
import { useMediaQuery } from "@mui/material";

const applications = [
  {
    title: "DMS",
    subtitle: "Channel Sales &\nInventory management",
    color: "#E8EAF6",
    textColor: "#3F51B5",
  },
  {
    title: "ISP",
    subtitle: "Manage In-shop\nBrand Promoters",
    color: "#E8EAF6",
    textColor: "#3F51B5",
    isIsp: true,
  },
  {
    title: "SFA",
    subtitle: "Manage Outdoor\nSales Channels",
    color: "#E8EAF6",
    textColor: "#3F51B5",
  },
  {
    title: "VM",
    subtitle: "Manage Visual\nMerchandizing Activities",
    color: "#E8EAF6",
    textColor: "#3F51B5",
  },
  {
    title: "SCHEME",
    subtitle: "Channel Scheme\nManagement",
    color: "#E8EAF6",
    textColor: "#3F51B5",
  },
  {
    title: "LEADS",
    subtitle: "Lead Generation\n& Follow-up",
    color: "#E8EAF6",

    textColor: "#3F51B5",

    // comingSoon: true,
  },
];

const Slider = () => {
  const isLargeScreen = useMediaQuery("(min-width:512px)");

  const getCardBackgroundColor = (app) => {
    if (app.comingSoon) return app.color;
    return app.color;
  };

  const getCardTextColor = (app) => {
    return app.textColor;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        // border:"1px solid red",

      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          margin: "1px",
          // height: "140px",
          // border:"1px solid red",
          // bgcolor:"red",
          // position: "absolute",
          // left: 0,
          // paddingBottom: "10px",
          // bottom:0,
          animation: "scroll 30s linear infinite",
          "&:hover": {
            animationPlayState: "paused",

          },

          "@keyframes scroll": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: `translateX(calc(-300px * ${applications.length} - ${applications.length * 16}px))`,
            },
          },
        }}
      >
        {applications.map((app, index) => (
          <Paper
            key={`first-${index}`}
            // elevation={3}
            sx={{
              backgroundColor: getCardBackgroundColor(app),
              borderRadius: "8px",
              // padding: "1rem",
              // padding: "1rem",
              boxShadow: "none",
              width: "300px",
              height: "95%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: app.comingSoon ? "default" : "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              "&:hover": {
                // transform: app.comingSoon ? "none" : "scale(1.02)",
                backgroundColor: app.comingSoon ? app.color : AQUA,
                "& .MuiTypography-root": {
                  color: app.comingSoon ? app.textColor : "#FFFFFF",
                },
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: getCardTextColor(app),
                fontWeight: "bold",
                // marginBottom: 1,
                transition: "color 0.2s",
              }}
            >
              NURAL
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: getCardTextColor(app),
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "30.12px",
                lineHeight: "46.66px",
                letterSpacing: "0%",
                transition: "color 0.2s",
              }}
            >
              {app.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: getCardTextColor(app),
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "14px",
                width: "200px",
                lineHeight: "19.12px",
                letterSpacing: "0%",
                textAlign: "center",
                transition: "color 0.2s",
              }}
            >
              {app.subtitle}
            </Typography>
            {app.comingSoon && (
              <Box
                sx={{
                  // position: "fixed",
                  backgroundColor: app.textColor,
                  color: "#FFFFFF",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  marginTop: "10px",
                  height: "100%",
                }}
              >
                COMING SOON
              </Box>
            )}
          </Paper>
        ))}

        {applications.map((app, index) => (
          <Paper
            key={`second-${index}`}
            // elevation={3}
            sx={{
              backgroundColor: getCardBackgroundColor(app),
              borderRadius: "8px",
              // padding: "1rem",
              boxShadow: "none",
              width: "300px",
              height: "95%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: app.comingSoon ? "default" : "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              "&:hover": {
                // transform: app.comingSoon ? "none" : "scale(1.02)",
                backgroundColor: app.comingSoon ? app.color : AQUA,
                "& .MuiTypography-root": {
                  color: app.comingSoon ? app.textColor : "#FFFFFF",
                },
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: getCardTextColor(app),
                fontWeight: "bold",
                // marginBottom: 1,
                transition: "color 0.2s",
              }}
            >
              NURAL
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: getCardTextColor(app),
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "40.12px",
                lineHeight: "56.66px",
                letterSpacing: "0%",
                transition: "color 0.2s",
              }}
            >
              {app.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: getCardTextColor(app),
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: "14px",
                width: "200px",
                lineHeight: "19.12px",
                letterSpacing: "0%",
                textAlign: "center",
                transition: "color 0.2s",
              }}
            >
              {app.subtitle}
            </Typography>
            {app.comingSoon && (
              <Box
                sx={{
                  backgroundColor: app.textColor,
                  color: "#FFFFFF",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  marginTop: "8px",
                  // height: "95%",
                }}
              >
                COMING SOON
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Slider;
