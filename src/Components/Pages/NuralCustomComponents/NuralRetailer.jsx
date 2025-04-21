import React, { useState } from "react";
import {
  Box,
  Checkbox,
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
  AQUA,
  BLACK,
  DARK_BLUE,
  DARK_PURPLE,
  LIGHT_BLUE,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";
import NuralTextField from "./NuralTextField";
import NuralButton from "./NuralButton";
import NuralTextButton from "./NuralTextButton";
import NuralAutocomplete from "./NuralAutocomplete";

const NuralReports = ({
  title = "View",
  columns = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "city", label: "City" },
  ],
  views = ["View 1", "View 2", "View 3"],
  showNameField = true,
  onSave,
  onColumnChange,
  onViewChange,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [name, setName] = useState("");
  const [isSwitchingRetailer, setIsSwitchingRetailer] = useState(false);

  const handleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
      onColumnChange?.([]);
    } else {
      setSelectedColumns(columns.map((col) => col.id));
      onColumnChange?.(columns.map((col) => col.id));
    }
  };

  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prev) => {
      const newSelection = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];
      onColumnChange?.(newSelection);
      return newSelection;
    });
  };

  const handleSave = () => {
    onSave?.({ selectedColumns, name });
  };

  const toggleSwitchRetailer = () => {
    setIsSwitchingRetailer(!isSwitchingRetailer);
  };

  const handleUpdateRetailer = () => {
    // Logic to update retailer
    setIsSwitchingRetailer(false);
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
            // px: 1,
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          Details
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
            // px: 1,
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "10px",
            letterSpacing: "0%",
            // color: DARK_PURPLE,
          }}
        >
          RETAILER
        </Typography>

        
        <Typography
          sx={{
            // px: 1,
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            color: DARK_PURPLE,
          }}
        >
          Retailer Name
        </Typography>

        {isSwitchingRetailer && (
          <>
            <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
              <NuralAutocomplete
                options={[]}
                placeholder="RETAILER NAME"
                onChange={() => {}}
                value={""}
                label="Retailer Name"
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
              <NuralAutocomplete
                options={[]}
                placeholder="RETAILER CODE"
                onChange={() => {}}
                value={""}
                label="Retailer Name"
                width="100%"
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
          {isSwitchingRetailer ? (
            <NuralButton
              text="UPDATE RETAILER"
              variant="outlined"
              backgroundColor={PRIMARY_BLUE2}
              color="#fff"
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              hoverColor="#fff"
              hoverColorText={PRIMARY_BLUE2}
              onClick={handleUpdateRetailer}
              width="100%"
            />
          ) : (
            <NuralButton
              text="SWITCH RETAILER"
              variant="outlined"
              backgroundColor={PRIMARY_BLUE2}
              color="#fff"
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              hoverColor="#fff"
              hoverColorText={PRIMARY_BLUE2}
              onClick={toggleSwitchRetailer}
              width="100%"
            />
          )}
        </Grid>
        
        {!isSwitchingRetailer && (
          <Grid item xs={12} sm={9} md={12} sx={{ mt: "16px" }}>
            <NuralButton
              text="EXIT ISP"
              variant="outlined"
              color={PRIMARY_BLUE2}
              fontSize="10px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              //   onClick={handleReset}
              width="100%"
            />
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default NuralReports;
