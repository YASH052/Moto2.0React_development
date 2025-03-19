import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  AQUA,
  BLACK,
  DARK_PURPLE,
  LIGHT_BLUE,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
  WHITE,
} from "../../Common/colors";
import NuralTextField from "./NuralTextField";
import NuralButton from "./NuralButton";

const NuralReports = ({
  title = "View",
  columns = [ { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "city", label: "City" },],
  views = ["View 1", "View 2", "View 3"],
  showNameField = true,
  onSave,
  onColumnChange,
  onViewChange,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [name, setName] = useState("");

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
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          mt: -2,
        }}
      >
        {/* Column Selection */}

        {Array.isArray(views) && views.map((view, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={() => onViewChange?.(view)}
          >
            <img src={"./Icons/Rect.svg"} alt={view} />
            <Typography
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: "19.12px",
                letterSpacing: "0%",
                color: PRIMARY_BLUE2,
              }}
            >
              {view}
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default NuralReports;
