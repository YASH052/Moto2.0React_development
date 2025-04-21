import { Grid, Switch, Typography, Box } from "@mui/material";
import React from "react";
import PropTypes from 'prop-types';
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
} from "../../../Common/colors";
import { toggleSectionStyle } from "../../../Common/commonstyles";

// Helper function for sorting
const sortByDisplayOrder = (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0);

const ToggleSection = ({ toggleItems, onStateChange }) => {
  const [toggleStates, setToggleStates] = React.useState({});
  const [innerToggleStates, setInnerToggleStates] = React.useState({});

  React.useEffect(() => {
      const safeToggleItems = Array.isArray(toggleItems) ? [...toggleItems] : [];
      safeToggleItems.sort(sortByDisplayOrder);

      const newToggleStates = safeToggleItems.reduce((acc, item) => {
          if (item && item.appMenuId !== undefined) {
              acc[item.appMenuId] = false;
          }
          return acc;
      }, {});
      setToggleStates(newToggleStates);

      const newInnerStates = safeToggleItems.reduce((acc, item) => {
            if (item && item.appMenuId !== undefined && item.menuList && item.menuList.length > 0) {
                const sortedMenuList = [...item.menuList].sort(sortByDisplayOrder);
                acc[item.appMenuId] = sortedMenuList.reduce(
                    (contentAcc, contentItem) => {
                        if (contentItem && contentItem.appMenuId !== undefined) {
                            contentAcc[contentItem.appMenuId] = contentItem.mappingStatus === 1;
                        }
                        return contentAcc;
                    },
                    {}
                );
            }
            return acc;
          }, {});
      setInnerToggleStates(newInnerStates);
      // Pass initial state back up on load/data change
      if (onStateChange) {
          onStateChange(newInnerStates);
      }

    }, [toggleItems, onStateChange]);

  const handleToggleChange = (id) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInnerToggleChange = (sectionId, itemMenuId) => {
    let updatedInnerStates;
    setInnerToggleStates((prev) => {
        const currentSectionState = prev[sectionId] || {};
        const newItemState = !currentSectionState[itemMenuId];
        console.log(`Toggled inner item: sectionId=${sectionId}, itemMenuId=${itemMenuId}, newState=${newItemState}`);
        updatedInnerStates = {
            ...prev,
            [sectionId]: {
                ...currentSectionState,
                [itemMenuId]: newItemState,
            },
        };
        return updatedInnerStates; // Return the new state object
    });

    // Call the callback AFTER state update (using the captured updated state)
    if (onStateChange && updatedInnerStates) {
      onStateChange(updatedInnerStates);
    }
  };

  if (!Array.isArray(toggleItems)) {
      return null;
  }

  const sortedToggleItems = [...toggleItems].sort(sortByDisplayOrder);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {sortedToggleItems.map((item) => {
        if (!item || item.appMenuId === undefined) {
            console.warn("ToggleSection: Skipping invalid item structure", item);
            return null;
        }
        const hasMenuList = item.menuList && item.menuList.length > 0;
        const sortedInnerList = hasMenuList ? [...item.menuList].sort(sortByDisplayOrder) : [];

        return (
        <Grid item xs={12} sm={6} md={4} lg={4} key={item.appMenuId}>
          <Grid
            container
            sx={{
              backgroundColor: SECONDARY_BLUE,
              alignItems: "flex-start",
              width: "100%",
              borderRadius: "8px",
              padding: "20px",
              gap: "16px",
              transition: "all 0.3s ease",
              minHeight: "80px",
              height: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "4%",
                  color: PRIMARY_BLUE2,
                  pr: 1,
                }}
              >
                {item.menuName || `Menu ID: ${item.appMenuId}`}
              </Typography>
              <Switch
                checked={!!toggleStates[item.appMenuId]}
                onChange={() => handleToggleChange(item.appMenuId)}
                sx={{
                  ...toggleSectionStyle,
                  "& .MuiSwitch-thumb": {
                    backgroundColor: toggleStates[item.appMenuId]
                      ? PRIMARY_BLUE2
                      : DARK_PURPLE,
                  },
                }}
                disabled={!hasMenuList}
              />
            </Grid>

            {toggleStates[item.appMenuId] && hasMenuList && (
              <Box sx={{ width: "100%", mt: 2 }}>
                {sortedInnerList.map((contentItem) => {
                  if (!contentItem || contentItem.appMenuId === undefined) {
                    console.warn("ToggleSection: Skipping invalid content item structure", contentItem);
                    return null;
                  }
                  return (
                    <Box
                      key={contentItem.appMenuId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        backgroundColor: LIGHT_GRAY2,
                        borderRadius: "8px",
                        marginBottom: "8px",
                        px: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "4%",
                          verticalAlign: "middle",
                          textTransform: "uppercase",
                          color: PRIMARY_BLUE2,
                          pr: 1,
                        }}
                      >
                        {contentItem.menuName || `SubMenu ID: ${contentItem.appMenuId}`}
                      </Typography>
                      <Switch
                        checked={!!innerToggleStates[item.appMenuId]?.[contentItem.appMenuId]}
                        onChange={() =>
                          handleInnerToggleChange(item.appMenuId, contentItem.appMenuId)
                        }
                        sx={{
                          ...toggleSectionStyle,
                          transform: "scale(0.8)",
                          "& .MuiSwitch-thumb": {
                            backgroundColor: innerToggleStates[item.appMenuId]?.[contentItem.appMenuId]
                              ? PRIMARY_BLUE2
                              : DARK_PURPLE,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Grid>
        </Grid>
      );
    })}
    </Grid>
  );
};

ToggleSection.propTypes = {
    toggleItems: PropTypes.arrayOf(PropTypes.shape({
      appMenuId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      menuName: PropTypes.string,
      displayOrder: PropTypes.number,
      menuList: PropTypes.arrayOf(PropTypes.shape({
        appMenuId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        menuName: PropTypes.string,
        mappingStatus: PropTypes.number,
        displayOrder: PropTypes.number,
      }))
    })),
    onStateChange: PropTypes.func,
  };

export default ToggleSection;
