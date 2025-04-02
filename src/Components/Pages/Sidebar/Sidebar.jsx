import React, { useState } from "react";
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
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Dashboard,
  SwapHoriz,
  GpsFixed as TargetIcon,
  EmojiEvents,
  LocalOffer,
  School,
  Flag as FlagIcon,
  Assessment,
  EventNote,
  Poll,
  HelpOutline,
  Person,
  Settings,
  Logout,
  Search as SearchIcon,
  Notifications,
  Menu as MenuIcon,
  KeyboardArrowDown,
  Add as AddIcon,
  Edit,
} from "@mui/icons-material";
import {
  PRIMARY_BLUE,
  SECONDARY_BLUE,
  WHITE,
  LIGHT_GRAY,
  TRANSPARENT_WHITE_15,
  TRANSPARENT_WHITE_25,
  NOTIFICATION_BLUE,
  HOVER_BLUE,
  GREEN_COLOR,
  DARK_PURPLE,
} from "../../Common/colors";
// Make sure to update the path to the actual image location

const collapsedWidth = 90; // Reduced from 80
const expandedWidth = 280; // Reduced from 300

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: TRANSPARENT_WHITE_15,
  "&:hover": {
    backgroundColor: TRANSPARENT_WHITE_25,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "80%",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(4),
    width: "100%",
  },
}));

const menuGroups = [
  {
    title: "Primary Module",
    items: [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
      {
        text: "Attendance",
        icon: <EventNote />,
        path: "/view-attendance-report",
      },
      { text: "Tertiary Sale", icon: <SwapHoriz />, path: "/tertiary-sale" },
      {
        text: "Inventory",
        icon: <LocalOffer />,
        path: "/stock-adjustment-report",
      },
      { text: "Competition", icon: <FlagIcon />, path: "/competition-brand" },
    ],
  },
  {
    title: "Secondary Module",
    items: [
      { text: "Merchandising", icon: <LocalOffer />, path: "/merchandizing" },
      {
        text: "Prebooking",
        icon: <EventNote />,
        path: "/prebooking-sku-create",
      },
      { text: "Learning & Dev.", icon: <School />, path: "/learning" },
      { text: "Survey", icon: <Poll />, path: "/survey" },
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
  const [myAppsExpanded, setMyAppsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isSelected = (path) => {
    return location.pathname === path;
  };

  const renderSidebarContent = (collapsed) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        p: 1,
        bgcolor: WHITE,
        flexDirection: "column",
      }}
    >
      {/* Scrollable content */}
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
        <Box sx={{ p: 2 }}>
          {/* Logo section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              mb: 2,
            }}
          >
            {!collapsed ? (
              <Box
                sx={{
                  height: 50,
                  width: "100%",
                  bgcolor: LIGHT_GRAY,
                  borderRadius: 1,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "gray",
                }}
              >
                {" "}
                Client Logo
              </Box>
            ) : (
              <img
                src={"./Images/ClientLogo.png"}
                alt="Powered by Nural"
                style={{
                  maxWidth: "150%",
                  padding: "8px",
                  transform: "scale(1.2)",
                }}
              />
            )}
          </Box>

          {/* Search and notification */}
          {!collapsed ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 0,
                alignItems: "center",
                mb: 2,
                ml: -2,
              }}
            >
              <IconButton color="inherit">
                <img
                  width={45}
                  height={45}
                  src="./Icons/Notification.png"
                  alt="notification"
                />
              </IconButton>
              <SearchWrapper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #DFDDDE",
                  borderRadius: "5px",
                  height: "45px",
                  width: "145px",
                  backgroundColor: DARK_PURPLE,
                 
                }}
              >
                <IconButton
                  sx={{ position: "absolute", p: 1, color: "white", left: 15 }}
                >
                  <SearchIcon />
                </IconButton>

                <StyledInputBase
                  sx={{
                    width: "152px",
                    height: "45px",
                    marginLeft: "30px",
                    color: "white",
                    backgroundColor: 'none',
                   
                  }}
                  placeholder="Search"

                  inputProps={{ "aria-label": "search" }}
                />
              </SearchWrapper>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Search Icon */}
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

              {/* Notification Icon */}
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

              {/* Dashboard Icon */}
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

              {/* Grid Icon */}
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

              {/* Edit/Pen Icon */}
              {/* <Box
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: '#',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#1976d2' }
                }}
              >
                <Edit sx={{ color: 'white' }} />
              </Box> */}
            </Box>
          )}

          {/* My Apps section */}
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
                  pl: 2,
                  pr: 2,
                  "&:focus": {
                    outline: "none",
                  },
                },
                "& .MuiAccordionSummary-content": {
                  m: 0,
                  border: "1px solid transparent",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <KeyboardArrowDown
                    sx={{
                      color: "#fff",
                      marginRight: "px",
                      fontSize: "1.2rem",
                    }}
                  />
                }
                sx={{
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: SECONDARY_BLUE }}>
                  My Apps
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0, pt: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Dashboard button */}
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid #DFDDDE",
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

                  {/* DMS and ISP row */}
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

        {/* Main menu items */}
        {!collapsed ? (
          <Box sx={{ px: 2 }}>
            {menuGroups.map((group) => (
              <Accordion
                key={group.title}
                defaultExpanded
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
                    p: 1,
                    my: 0.5,
                    pr: 2,
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
                      sx={{ color: "#fff", fontSize: "1.2rem" }}
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
                    sx={{ color: SECONDARY_BLUE, px: 1 }}
                  >
                    {group.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List sx={{ p: 0 }}>
                    {group.items.map((item) => (
                      <ListItem
                        button
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                          borderRadius: 1,
                          pb: 0.5,
                          pt: 1,
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
                            minWidth: 35 
                          }}
                        >
                          <Box sx={{ fontSize: "1.2rem" }}>{item.icon}</Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            mb: 1.5,
                            "& .MuiTypography-root": {
                              fontSize: "0.875rem",
                              color: isSelected(item.path) ? WHITE : SECONDARY_BLUE,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <List>
            {menuGroups.map((group) =>
              group.items.map((item) => (
                <ListItem
                  button
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
                      minWidth: "auto" 
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

      {/* Fixed bottom section with white background */}
      <Box
        sx={{
          mt: "auto",
          bgcolor: WHITE,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          py: 1,
        }}
      >
        {/* Bottom menu items */}
        <List sx={{ py: 0, px: 2 }}>
          {bottomMenuItems.map((item) => (
            <ListItem
              button
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
          sx={
            collapsed
              ? { p: 0.5, textAlign: "center" }
              : { p: 0, textAlign: "center" }
          }
        >
          <img
            src={
              collapsed ? "./Images/Wordmark.png" : "./Images/NuralFootLogo.png"
            }
            alt="Powered by Nural"
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: collapsed ? "80%" : "15rem",
              height: collapsed ? "40%" : "5%",
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: isExpanded ? expandedWidth : collapsedWidth,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isExpanded ? expandedWidth : collapsedWidth,
          transition: "width 0.3s",
          boxSizing: "border-box",
          backgroundColor: WHITE,
          color: SECONDARY_BLUE,
          overflowX: "hidden",
          overflowY: "hidden",
          border: "none",
        },
      }}
    >
      {renderSidebarContent(!isExpanded)}
    </Drawer>
  );
};

export default Sidebar;
