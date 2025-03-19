import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  CircularProgress,
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

const NuralExport = ({
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
  downloadExcel,
  onViewChange,
  isDownloadLoading,
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
        "& > *:not(.spinner-visible)": {
          filter: isDownloadLoading ? "blur(2px)" : "none",
          pointerEvents: isDownloadLoading ? "none" : "auto",
        }
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

      <AccordionDetails sx={{ padding: 2, pt: 0 }}>
        {/* Column Selection */}

        <Box onClick={handleSelectAll} sx={{ cursor: "pointer", mb: 1, mt: 3 }}>
          <Typography
            sx={{
              fontFamily: "Manrope",
              fontWeight: 700,
              fontSize: 10,
              lineHeight: "13.66px",
              letterSpacing: "4%",
              color: PRIMARY_BLUE2,
            }}
          >
            SELECT ALL
          </Typography>
        </Box>

        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Checkbox
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "25%",
                // backgroundColor: WHITE,
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                // border: "1px solid white",
                padding: 0,
                "&.Mui-checked": {
                  // backgroundColor: WHITE,
                  border: "none",
                  "& .MuiSvgIcon-root": {
                    color: PRIMARY_BLUE,
                  },
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "24px",
                },
                "&:hover": {
                  // backgroundColor: WHITE,
                },
              }}
              checked={selectedColumns.includes(column.id)}
              onChange={() => handleColumnToggle(column.id)}
            />
            <Typography
              sx={{
                ml: 1,
                color: selectedColumns.includes(column.id) ? WHITE : BLACK,
                backgroundColor: selectedColumns.includes(column.id)
                  ? PRIMARY_BLUE
                  : "transparent",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                width: "200px",
                textAlign: "left",
              }}
            >
              {column.label}
            </Typography>
          </Box>
        ))}

        {/* Name Field */}
        {showNameField && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Manrope",
                fontWeight: 400,
                fontSize: 10,
                lineHeight: "13.66px",
                letterSpacing: "4%",
                color: PRIMARY_BLUE2,
              }}
            >
              NAME
            </Typography>
            <NuralTextField
              placeholder="xxxxx"
              backgroundColor={LIGHT_BLUE}
              width={"100%"}
            />
          </Box>
        )}

        {/* Save Button */}
        <Grid container spacing={2}>
          <Grid 
            item 
            xs={6} 
            md={6} 
            lg={6} 
            xl={6} 
            mt={2}
            className={isDownloadLoading ? "spinner-visible" : ""}
            sx={{
              position: "relative",
              zIndex: 10001,
            }}
          >
            {isDownloadLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "none",
                  "& .MuiCircularProgress-root": {
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                  }
                }}
              >
                <CircularProgress 
                  size={20} 
                  sx={{ 
                    color: PRIMARY_BLUE2,
                    filter: "none",
                  }} 
                />
              </Box>
            ) : (
              <img
                src="./Images/exceldownload.svg"
                alt="download"
                style={{ 
                  cursor: "pointer",
                  filter: "none",
                }}
                onClick={downloadExcel}
              />
            )}
          </Grid>
          <Grid 
            item 
            xs={6} 
            md={6} 
            lg={6} 
            xl={6} 
            mt={2}
            sx={{
              filter: isDownloadLoading ? "blur(2px)" : "none",
            }}
          >
            <NuralButton
              text="SAVE AS"
              border="none"
              onClick={handleSave}
              backgroundColor={AQUA}
              width={"100%"}
              fontSize="10px"
              lineHeight="13.66px"
              letterSpacing="4%"
              fontWeight={700}
              height={"31px"}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default NuralExport;
