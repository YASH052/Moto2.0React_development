import { Box, Grid, Typography, Paper } from "@mui/material";
import React from "react";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";
import pdcard from "../../../../assets/carousel/pdcard.png";
// import logo from "../../../../assets/logo/Symbol.png";
import { AQUA, PRIMARY_BLUE } from "../../../Common/colors";
import { useMediaQuery } from "@mui/material";
const images = [pdcard, one, two, five, four, three];

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
    color: "#E0E0E0",
    textColor: "#9E9E9E",
    comingSoon: true,
  },
];

const LoginFormHome = () => {
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const [activeTab, setActiveTab] = React.useState("ISP");

  const handleTabClick = (title) => {
    if (title !== "LEADS") {
      setActiveTab(title);
    }
  };

  const getCardBackgroundColor = (app) => {
    if (app.comingSoon) return app.color;
    if (activeTab === app.title) return AQUA;
    // if (app.isIsp) return "#00BCD4";
    return app.color;
  };

  const getCardTextColor = (app) => {
    if (activeTab === app.title) return "#FFFFFF";
    // if (app.isIsp) return "#FFFFFF";
    return app.textColor;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header section */}
      <Box sx={{ flex: '0 0 auto' }}>
        <Box
          sx={{
            marginTop: "1%",
            marginBottom: "1%",
            marginLeft: "20%",
            fontSize: "24px",
            lineHeight: "32.78px",
            letterSpacing: "0%",
            fontFamily: "Manrope",
            fontWeight: 400,
            color: PRIMARY_BLUE,
          }}
        >
          Welcome to
        </Box>
        <Box
          sx={{
            //   width: "100%",
            height: "15%",
            display: "flex",
            marginLeft: "20%",
            alignItems: "center",
            fixed: "middle",
          }}
        >
          <img
            src="/Images/Symbol.png"
            alt="logo"
            style={{ maxWidth: "90px" }} // Adjust image size as needed
          />

          <img
            src="/Images/Frame 4.png"
            alt="logo"
            style={{ maxWidth: "150px", marginLeft: "30px" }} // Adjust image size as needed
          />
          <Box
            sx={{
              height: "100%", // Adjust height of the line
              width: "1px", // Adjust width of the line
              backgroundColor: PRIMARY_BLUE, // Color of the line
              marginLeft: "50px",
            }}
          />
          {isLargeScreen && (
            <Grid
              sx={{
                color: PRIMARY_BLUE,
                fontSize: "36px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Your unified platform for sales operations
            </Grid>
          )}
        </Box>
      </Box>

      {/* Main content section */}
      <Box sx={{ flex: '1 0 auto', paddingBottom: '60px' }}> {/* Add padding bottom to prevent footer overlap */}
        <Grid
          sx={{
            color: PRIMARY_BLUE,
            fontSize: "36px",
            padding: "0px",
            textAlign: "center",
            marginTop: "1%",
          }}
        >
          <Typography fontSize={20} color={PRIMARY_BLUE} marginTop="1%" sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            
          }}>
            Select Your Nural Application
          </Typography>
          <Box
            sx={{
              width: "98%",
              height: "1px",
              backgroundColor: PRIMARY_BLUE,
              margin: "auto",
            }}
          />
        </Grid>

        <Grid container spacing={2} padding={2}>
          {applications.map((app, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                width: "458px",
                height: "240px",
              }}
            >
              <Paper
                elevation={3}
                onClick={() => handleTabClick(app.title)}
                sx={{
                  backgroundColor: getCardBackgroundColor(app),
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow:"none",
                  // width:"358px",
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: app.comingSoon ? "default" : "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: app.comingSoon ? "none" : "scale(1.02)",
                    backgroundColor: app.comingSoon
                      ? app.color
                      : activeTab === app.title
                      ? AQUA
                      : `${AQUA}22`,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: getCardTextColor(app),
                    fontWeight: "bold",
                    marginBottom: 1,
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
                    fontSize: "56.12px",
                    lineHeight: "76.66px",
                    letterSpacing: "0%",
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
                    width:"200px",
                    lineHeight: "19.12px",
                    letterSpacing: "0%",
                    textAlign: "center",
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
                    }}
                  >
                    COMING SOON
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer section */}
      <Box
        component="footer"
        sx={{
          flex: '0 0 auto',
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          backgroundColor: '#fff', // Add background color to prevent content showing through
        }}
      >
        <Grid
          container
          sx={{
            width: "98%",
            margin: "auto",
            textAlign: "center",
            padding: "0px",
          }}
        >
          <Grid item xs={12}>
            <img
              src="/Images/footerImg.png"
              alt="logo"
              style={{
                height: '40px',
                width: '100%',
                display: 'block', // Ensures proper image display
                marginBottom: '0',
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginFormHome;
