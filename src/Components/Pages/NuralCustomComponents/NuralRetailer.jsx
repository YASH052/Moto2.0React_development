import { useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  DARK_PURPLE,
  LIGHT_BLUE,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  SECONDARY_BLUE,
} from "../../Common/colors";
import NuralButton from "./NuralButton";
import NuralAutocomplete from "./NuralAutocomplete";
import NuralCalendar from "./NuralCalendar";

const NuralRetailer = ({
  title = "Details",
  itemNameLabel = "ITEM",
  selectedItem,
  itemList,
  itemListLoading = false,
  itemIdField = "id",
  itemPrimaryDisplayField = "name",
  itemSecondaryDisplayField = "code",
  filterOptions,
  actionLabel = "",
  onUpdate,
  onExit,
  showExitButton = true,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isSwitchingItem, setIsSwitchingItem] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    selectedNewItemId: null,
  });
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const handleInitiateSwitchOrMap = () => {
    if (!selectedItem) {
      alert("Please select an item first.");
      return;
    }
    console.log("Initiating switch/map for item:", selectedItem);
    console.log(`Using itemIdField: '${itemIdField}'`);
    const initialItemId = selectedItem?.[itemIdField] || null;
    console.log("Initial selectedNewItemId:", initialItemId);

    setNewItemForm({ selectedNewItemId: initialItemId });
    setEffectiveDate(new Date().toISOString().split("T")[0]);
    setIsSwitchingItem(true);
  };

  const handleUpdateAction = async () => {
    if (!selectedItem) {
      alert("No item selected.");
      return;
    }
    if (!newItemForm.selectedNewItemId && newItemForm.selectedNewItemId !== 0) {
      alert("Please select a new item.");
      return;
    }
    if (!effectiveDate) {
      alert("Please select an effective date.");
      return;
    }

    if (onUpdate) {
      setInternalLoading(true);
      try {
        await onUpdate({
          newItemId: newItemForm.selectedNewItemId,
          effectiveDate: effectiveDate,
          currentItem: selectedItem,
        });
        setIsSwitchingItem(false);
        setEffectiveDate(null);
        setNewItemForm({ selectedNewItemId: null });
      } catch (error) {
        console.error("Error during onUpdate callback:", error);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const handleExitAction = async () => {
    if (!selectedItem) {
      alert("No item selected.");
      return;
    }

    if (onExit) {
      setInternalLoading(true);
      try {
        await onExit({ currentItem: selectedItem });
      } catch (error) {
        console.error("Error during onExit callback:", error);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        width: "100%",
        maxWidth: "240px",
        bgcolor: MEDIUM_BLUE,
        borderRadius: "8px !important",
        "&:before": {
          display: "none",
        },
        boxShadow: "none",
        "&.MuiAccordion-root": {
          outline: "none",
        },
        "& .MuiAccordionSummary-root": {
          outline: "none",
          minHeight: "unset",
        },
        "& .MuiAccordionSummary-root.Mui-focused": {
          outline: "none",
          backgroundColor: "transparent",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
        sx={{
          padding: 1,
          "& .MuiAccordionSummary-content": {
            margin: 0,
          },
          "&.Mui-focused": {
            outline: "none",
            backgroundColor: "transparent",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          mt: -2,
        }}
      >
        <Divider
          sx={{
            backgroundColor: SECONDARY_BLUE,
            width: "100%",
            margin: "16px 0",
          }}
        />
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "10px",
            letterSpacing: "0%",
          }}
        >
          {itemNameLabel}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          {selectedItem?.[itemPrimaryDisplayField] || `Select ${itemNameLabel}`}
        </Typography>

        {isSwitchingItem && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} ml={2} mt={2}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "10px",
                  letterSpacing: "0%",
                }}
              >
                NEW {itemNameLabel}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography
                variant="h6"
                sx={{
                  color: PRIMARY_BLUE2,
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: { xs: "10px", sm: "10px" },
                  lineHeight: "13.66px",
                  letterSpacing: "4%",
                  mb: 1,
                }}
              >
                EFFECTIVE AS ON
              </Typography>
              <NuralCalendar
                value={effectiveDate}
                onChange={(value) => setEffectiveDate(value)}
                placeholder="DD/MMM/YYYY"
                disableFutureDates={false}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography
                variant="h6"
                sx={{
                  color: PRIMARY_BLUE2,
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: { xs: "10px", sm: "10px" },
                  lineHeight: "13.66px",
                  letterSpacing: "4%",
                  mb: 1,
                }}
              >
                {`${itemNameLabel} NAME`}
              </Typography>
              <NuralAutocomplete
                options={itemList}
                getOptionLabel={(option) => option?.[itemPrimaryDisplayField] || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.[itemIdField] === value?.[itemIdField]
                }
                value={
                  itemList.find(
                    (item) => item?.[itemIdField] === newItemForm.selectedNewItemId
                  ) || null
                }
                onChange={(event, newValue) => {
                  setNewItemForm({
                    selectedNewItemId: newValue?.[itemIdField] ?? null,
                  });
                }}
                placeholder="SELECT"
                width="100%"
                backgroundColor={LIGHT_BLUE}
                loading={itemListLoading}
                filterOptions={filterOptions}
              />
            </Grid>
            {itemSecondaryDisplayField && (
              <Grid item xs={12} sm={12}>
                <Typography
                  variant="h6"
                  sx={{
                    color: PRIMARY_BLUE2,
                    fontFamily: "Manrope",
                    fontWeight: 400,
                    fontSize: { xs: "10px", sm: "10px" },
                    lineHeight: "13.66px",
                    letterSpacing: "4%",
                    mb: 1,
                  }}
                >
                  {`${itemNameLabel} ${itemSecondaryDisplayField.toUpperCase()}`}
                </Typography>
                <NuralAutocomplete
                  options={itemList}
                  getOptionLabel={(option) => option?.[itemSecondaryDisplayField] || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.[itemIdField] === value?.[itemIdField]
                  }
                  value={
                    itemList.find(
                      (item) =>
                        item?.[itemIdField] === newItemForm.selectedNewItemId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setNewItemForm({
                      selectedNewItemId: newValue?.[itemIdField] ?? null,
                    });
                  }}
                  placeholder={`SELECT ${itemSecondaryDisplayField.toUpperCase()}`}
                  width="100%"
                  backgroundColor={LIGHT_BLUE}
                  loading={itemListLoading}
                  filterOptions={filterOptions}
                />
              </Grid>
            )}
          </Grid>
        )}

        <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
          {isSwitchingItem ? (
            <NuralButton
              text="UPDATE ITEM"
              variant="outlined"
              backgroundColor={PRIMARY_BLUE2}
              color="#fff"
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              hoverColor="#fff"
              hoverColorText={PRIMARY_BLUE2}
              onClick={handleUpdateAction}
              width="100%"
              disabled={internalLoading || !newItemForm.selectedNewItemId || !effectiveDate}
            />
          ) : (
            <NuralButton
              text={
                actionLabel === "MAPPING" ? "Switch Mapping" : "Switch Retailer"
              }
              variant="outlined"
              backgroundColor={PRIMARY_BLUE2}
              color="#fff"
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              hoverColor="#fff"
              hoverColorText={PRIMARY_BLUE2}
              onClick={handleInitiateSwitchOrMap}
              width="100%"
              disabled={internalLoading}
            />
          )}
        </Grid>

        {!isSwitchingItem && showExitButton && (
          <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
            <NuralButton
              text="EXIT ITEM"
              variant="outlined"
              color={PRIMARY_BLUE2}
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              onClick={handleExitAction}
              width="100%"
              disabled={internalLoading}
            />
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

NuralRetailer.propTypes = {
  title: PropTypes.string,
  itemNameLabel: PropTypes.string,
  selectedItem: PropTypes.object,
  itemList: PropTypes.array.isRequired,
  itemListLoading: PropTypes.bool,
  itemIdField: PropTypes.string,
  itemPrimaryDisplayField: PropTypes.string,
  itemSecondaryDisplayField: PropTypes.string,
  filterOptions: PropTypes.func,
  actionLabel: PropTypes.string,
  onUpdate: PropTypes.func,
  onExit: PropTypes.func,
  showExitButton: PropTypes.bool,
};

export default NuralRetailer;
