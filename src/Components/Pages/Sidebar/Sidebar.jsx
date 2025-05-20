import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  InputBase,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Dashboard,
  SwapHoriz,
  LocalOffer,
  EventNote,
  Poll,
  Person,
  Settings,
  Logout,
  Search as SearchIcon,
  Notifications,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  PRIMARY_BLUE,
  SECONDARY_BLUE,
  WHITE,
  NOTIFICATION_BLUE,
  HOVER_BLUE,
  GREEN_COLOR,
  DARK_PURPLE,
  PRIMARY_BLUE2,
  AQUA,
} from "../../Common/colors";
import close from "../../../assets/logo/close.svg";

const collapsedWidth = 90;
const expandedWidth = 280;

const menuGroups = [
  {
    title: "Primary Module",
    items: [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      {
        text: "Attendance",
        icon: <EventNote />,
        path: "/attendance-upload",
      },
      { text: "Transaction", icon: <SwapHoriz />, path: "/transaction" },
      {
        text: "Reports",
        icon: <LocalOffer />,
        path: "/reports",
      },
      { text: "Target ", icon: <EventNote />, path: "/target" },
    ],
  },
  {
    title: "Secondary Module",
    items: [
      {
        text: "Merchandising",
        icon: <LocalOffer />,
        path: "/merchandizing-report",
      },
      {
        text: "Prebooking",
        icon: <EventNote />,
        path: "/prebooking-sku-create",
      },
      { text: "Incentive", icon: <Poll />, path: "/create-scheme" },
      { text: "Survey", icon: <LocalOffer />, path: "/survey" },
    ],
  },
];

const bottomMenuItems = [
  { text: "Profile", icon: <Person />, path: "/profile" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
  { text: "Log Out", icon: <Logout />, path: "/logout" },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [myAppsExpanded, setMyAppsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem("log");
    localStorage.removeItem("userId");
    localStorage.removeItem("authKey");
    localStorage.removeItem("token");

    navigate("/login");
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  const isSelected = (path) => {
    return location.pathname === path;
  };

  const renderSidebarContent = (collapsed) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        p: 1.5,
        bgcolor: WHITE,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: PRIMARY_BLUE,
          overflowX: "hidden",
          width: "100%",
          borderRadius: "5px 5px 10px 10px",
          margin: "auto",
        }}
      >
        <Box sx={{ p: 0 }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {!collapsed ? (
              <>
                <Box
                  sx={{
                    height: 35,
                   backgroundColor: "white",
                    borderRadius: 1,
                    p: 1,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: PRIMARY_BLUE2,
                    flexGrow: 1,
                    mr: 1,
                  }}
                >
                  {/* <Typography sx={{ fontWeight: "bold", color: PRIMARY_BLUE2 }}>
                    MOTOROLAs
                  </Typography> */}

                  <img src={import.meta.env.VITE_MOTO_LOGO_NAME} alt="MOTOROLA" style={{ width: "100%", height: "90%" }} />
                </Box>

                <Box
                  sx={{
                    width: "1px",
                    height: "50px",
                    bgcolor: "#fff",
                    mx: 0.5,
                  }}
                />

                <IconButton
                  onClick={toggleSidebar}
                  size="small"
                  sx={{ color: PRIMARY_BLUE2 }}
                >
                  <img
                    src={close}
                    alt="close"
                    style={{ width: "40px", height: "40px" }}
                  />
                </IconButton>
              </>
            ) : (
              <Box
                onClick={toggleSidebar}
                sx={{
                  ml: -2,
                  mt: -1,
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    import.meta.env.VITE_MOTO_LOGO
                  }
                  alt="Powered by Nural"
                  style={{
                    maxWidth: "100%",
                    height: "100%",
                    padding: "8px",
                    transform: "scale(1.2)",
                  }}
                />
              </Box>
            )}
          </Box>

          {!collapsed ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                mb: 2,
                mt: -2,
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: NOTIFICATION_BLUE,
                  width: 45,
                  height: 45,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: NOTIFICATION_BLUE,
                  },
                }}
              >
                <Notifications sx={{ color: WHITE }} />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: DARK_PURPLE,
                  borderRadius: "8px",
                  border: "1px solid rgb(244, 240, 242)",
                  height: 45,
                  flex: 1,
                  px: 2,
                }}
              >
                <SearchIcon sx={{ color: WHITE, mr: 1 }} />
                <InputBase
                  placeholder="Search"
                  sx={{
                    color: WHITE,
                    flex: 1,
                    "& .MuiInputBase-input": {
                      "&::placeholder": {
                        color: WHITE,
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: -3,
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: DARK_PURPLE,
                  border: "1px solid #DFDDDE",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <SearchIcon sx={{ color: "white", fontSize: "1.2rem" }} />
              </Box>

              <Box
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: NOTIFICATION_BLUE,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Notifications sx={{ color: "white" }} />
              </Box>

              <Box
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "#",
                  border: "1px solid #DFDDDE",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: HOVER_BLUE },
                }}
              >
                <Dashboard sx={{ color: "white" }} />
              </Box>

              <Box
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "#",
                  border: "1px solid #DFDDDE",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#1976d2" },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 0.5,
                    width: 24,
                    height: 24,
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: "100%",
                        height: "100%",
                        bgcolor: "white",
                        borderRadius: 0.5,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {!collapsed ? (
            <Accordion
              expanded={myAppsExpanded}
              onChange={() => setMyAppsExpanded(!myAppsExpanded)}
              sx={{
                outline: "none",
                bgcolor: "transparent",
                color: SECONDARY_BLUE,
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
                "& .MuiAccordionSummary-root": {
                  minHeight: "auto",
                  p: 2,
                  mt: -2,
                  "&:focus": {
                    outline: "none",
                  },
                },
                "& .MuiAccordionSummary-content": {
                  m: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <KeyboardArrowDown
                    sx={{
                      color: "#fff",
                      fontSize: "1.2rem",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                }
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: SECONDARY_BLUE,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  My Apps
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgb(244, 240, 242)",
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                    }}
                  >
                    <Dashboard sx={{ fontSize: "1.2rem" }} />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                      }}
                    >
                      DASHBOARD
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#",
                          border: "1px solid #DFDDDE",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                          }}
                        >
                          DMS
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "#",
                          border: "1px solid rgb(185, 182, 182)",
                          borderRadius: 2,
                          p: 1,
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                        }}
                      >
                        <Typography
                          sx={{ color: "gray", fontSize: "0.875rem" }}
                        >
                          ADD +
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: WHITE,
                          color: PRIMARY_BLUE,
                          border: "1px solid #DFDDDE",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          cursor: "pointer",
                          "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                        }}
                      >
                        <Typography sx={{ fontWeight: 500 }}>ISP</Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "#",
                          border: "1px solid rgb(185, 182, 182)",
                          borderRadius: 2,
                          mt: 0.5,
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          "&:hover": { bgcolor: WHITE, color: PRIMARY_BLUE },
                        }}
                      >
                        <Typography
                          sx={{ color: "gray", fontSize: "0.875rem" }}
                        >
                          ADD +
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <></>
          )}
        </Box>

        {!collapsed ? (
          <Box sx={{ px: 0 }}>
            <List sx={{ p: 0 }}>
              {menuGroups
                .flatMap((group) => group.items)
                .map((item) => (
                  <ListItem
                    button={true}
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      borderRadius: 1,
                      position: "relative",
                      ...(isSelected(item.path) && {
                        "& .MuiListItemText-root": {
                          position: "relative",
                          "& .MuiTypography-root": {
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: -4,
                              left: 0,
                              width: "100%",
                              height: "2px",
                              backgroundColor: WHITE,
                            },
                          },
                        },
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isSelected(item.path) ? WHITE : SECONDARY_BLUE,
                        minWidth: 35,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{
                        cursor: "pointer",
                        "& .MuiTypography-root": {
                          fontSize: "0.875rem",
                          color: isSelected(item.path) ? WHITE : SECONDARY_BLUE,
                        },
                      }}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : (
          <List>
            {menuGroups.map((group) =>
              group.items.map((item) => (
                <ListItem
                  button={true}
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    py: 0.5,
                    justifyContent: "center",
                    ...(isSelected(item.path) && {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected(item.path) ? WHITE : SECONDARY_BLUE,
                      minWidth: "auto",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>

      <Box
        sx={{
          mt: "auto",
          bgcolor: WHITE,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          py: 1,
        }}
      >
        <List sx={{ py: 0, px: 0 }}>
          {bottomMenuItems.map((item) => (
            <ListItem
              button={true}
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                py: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                minHeight: 35,
                color: GREEN_COLOR,
                position: "relative",
                ...(isSelected(item.path) && {
                  "& .MuiListItemText-root": {
                    position: "relative",
                    "& .MuiTypography-root": {
                      position: "relative",
                      display: "inline-block",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: GREEN_COLOR,
                      },
                    },
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected(item.path) ? GREEN_COLOR : "inherit",
                  minWidth: collapsed ? "auto" : 35,
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.2rem",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: PRIMARY_BLUE,
                    cursor: "pointer",
                    "& .MuiTypography-root": {
                      fontWeight: 550,
                      fontSize: "0.813rem",
                    },
                    my: 0,
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        {/* Powered by section */}
        <Box
          sx={collapsed ? { p: 0 } : { p: 0, mt: 3 }}
          bgcolor={AQUA}
          borderRadius={collapsed ? "8px" : "8px"}
        >
          <img
            src={
              collapsed ? "./Images/Wordmark.svg" : "./Images/NuralFootLogo.png"
            }
            alt="Powered by Nural"
            style={{
              borderRadius: collapsed ? "0px" : "8px",
              marginTop: "8px",
              marginBottom: "5px",
              marginLeft: "auto",
              marginRight: "auto",
              width: collapsed ? "85%" : "100%",
              height: collapsed ? "40%" : "30px", 
              objectFit: collapsed ? "contain" : "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={(theme) => ({
        width: isExpanded ? expandedWidth : collapsedWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
        "& .MuiDrawer-paper": {
          width: isExpanded ? expandedWidth : collapsedWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          boxSizing: "border-box",
          backgroundColor: WHITE,
          color: SECONDARY_BLUE,
          overflowX: "hidden",
          overflowY: "hidden",
          border: "none",
        },
      })}
    >
      {renderSidebarContent(!isExpanded)}
    </Drawer>
  );
};

export default Sidebar;
