import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  LIGHT_GRAY2,
  DARK_PURPLE,
  PRIMARY_BLUE,
  WHITE,
  PRIMARY_LIGHT_PURPLE,
  SECONDARY_BLUE,
  MEDIUM_BLUE,
  PRIMARY_BLUE2, // Assuming this color for text
} from "../../colors"; // Adjust the path as needed
import { titleStyle, toggleButtonStyle } from "../../commonstyles";

// Helper function for K/M/B formatting
const formatNumberKMB = (num) => {
  if (typeof num !== "number" || isNaN(num)) {
    // Return original value or placeholder if input is not a valid number
    return num || "N/A"; // Return N/A if undefined/null/NaN
  }

  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  } else {
    // Show numbers less than 1000 with two decimal places
    // Handle potential strings here too if needed, but ideally props are numbers
    return typeof num === "number" ? num.toFixed(2) : num;
  }
};

const IspPerformanceTable = ({
  onRowSelect,
  ispdata = [], // Default empty array if no data provided
  title = "ISP Performance", // Default title updated
}) => {
  console.log("ispdata", ispdata);

  const [viewType, setViewType] = useState("0"); // Initialize with "0" for top

  const handleViewChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
      // Call the onRowSelect callback with the selected value
      if (onRowSelect) {
        onRowSelect(newViewType);
      }
    }
  };

  // Use the ispdata directly
  const originalData = useMemo(() => {
    return ispdata;
  }, [ispdata]);

  // Find the specific 'Total' row from the original data
  const extractedTotalRow = useMemo(() => {
    return originalData.find((row) => row.name === "Total");
  }, [originalData]);

  // Filter out the 'Total' row from the data to be mapped
  const currentData = useMemo(() => {
    return originalData.filter((row) => row.name !== "Total");
  }, [originalData]);

  

  const headerCellStyle = {
    backgroundColor: LIGHT_GRAY2, // Background for the whole table container
    color: PRIMARY_BLUE2, // Header text color
    fontWeight: "bold",
    borderBottom: "none",
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
    whiteSpace: "nowrap", // Prevent header text wrapping
  };

  const bodyCellStyle = {
    borderBottom: `1px solid ${MEDIUM_BLUE}`, // Lighter separator line
    color: PRIMARY_BLUE2, // Body text color
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
    whiteSpace: "nowrap", // Prevent data text wrapping
  };

  // Updated totalRowStyle for highlighted appearance
  const totalRowStyle = {
    color: PRIMARY_BLUE2,
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
    fontWeight: "bold",
    border: "none", // Remove internal borders
    backgroundColor: "transparent", // Make cell background transparent
    whiteSpace: "nowrap", // Prevent total text wrapping
  };

  return (
    <Paper
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "8px",
        p: 2,
        boxShadow: "none",
        overflowX: "auto", // Add horizontal scroll if needed
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" sx={titleStyle}>
          {title}
        </Typography>
        {/* Top 10 / Bot 10 Toggle */}
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewChange}
          aria-label="view type"
          sx={{ height: "30px" }}
        >
          <ToggleButton
            value="0"
            aria-label="top"
            sx={toggleButtonStyle}
          >
            TOP
          </ToggleButton>
          <ToggleButton
            value="1"
            aria-label="bottom"
            sx={toggleButtonStyle}
          >
            BOTTOM
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <TableContainer component={Box}>
        <Table sx={{ minWidth: 1100 }} aria-label="isp performance table">
          {" "}
          {/* Adjusted minWidth */}
          <TableHead>
            <TableRow>
              {/* Updated Headers */}
              <TableCell sx={{ ...headerCellStyle, minWidth: "150px" }}>
                NAME
              </TableCell>
              <TableCell sx={headerCellStyle}>CODE</TableCell>
              <TableCell sx={headerCellStyle}>AGENCY</TableCell>
              <TableCell sx={headerCellStyle}>CITY</TableCell>
              <TableCell sx={headerCellStyle}>RETAILER NAME</TableCell>
              <TableCell sx={headerCellStyle}>MTD VOLUME</TableCell>
              <TableCell sx={headerCellStyle}>MTD VALUE</TableCell>
              <TableCell sx={headerCellStyle}>MTD ASP</TableCell>
              <TableCell sx={headerCellStyle}>LMTD VOLUME</TableCell>
              <TableCell sx={headerCellStyle}>LMTD VALUE</TableCell>
              <TableCell sx={headerCellStyle}>LMTD ASP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Display the extracted 'Total' Row */}
            {extractedTotalRow && (
              <TableRow
                sx={{
                  backgroundColor: MEDIUM_BLUE, // Highlight background for the row
                  borderRadius: "8px", // Apply border radius to the row itself
                  // Apply radius manually to first/last cell *within* the row for proper clipping
                  "& > th:first-of-type, & > td:first-of-type": {
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  },
                  "& > th:last-of-type, & > td:last-of-type": {
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  },
                }}
              >
                {/* Render "TOTAL" label, spanning first 5 columns */}
                <TableCell
                  sx={{
                    ...totalRowStyle,
                    fontWeight: "bold", // Ensure TOTAL is bold
                    borderTopLeftRadius: "8px", // Apply radius to the first cell
                    borderBottomLeftRadius: "8px",
                  }}
                  colSpan={5} // Span across Name, Code, Agency, City, Retailer Name
                >
                  {extractedTotalRow.name}
                </TableCell>
                {/* Render Total values, assuming keys match */}
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.mtdVolume)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.mtdValue)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.mtdasp)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.lmtdVolume)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.lmtdValue)}
                </TableCell>
                <TableCell
                  sx={{
                    ...totalRowStyle,
                    borderTopRightRadius: "8px", // Apply radius to the last cell
                    borderBottomRightRadius: "8px",
                  }}
                >
                  {formatNumberKMB(extractedTotalRow.lmtdasp)}
                </TableCell>
              </TableRow>
            )}

            {/* Spacer Row if Total Row exists */}
            {extractedTotalRow && (
              <TableRow sx={{ height: "10px", backgroundColor: LIGHT_GRAY2 }}>
                <TableCell colSpan={11} sx={{ padding: 0, border: "none" }} />{" "}
                {/* Updated colSpan */}
              </TableRow>
            )}

            {/* Map through currentData for regular rows */}
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:hover": { backgroundColor: MEDIUM_BLUE } }}
                >
                  <TableCell sx={bodyCellStyle}>{row.name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{row.code}</TableCell>
                  <TableCell sx={bodyCellStyle}>{row.agency}</TableCell>
                  <TableCell sx={bodyCellStyle}>{row.city}</TableCell>
                  <TableCell sx={bodyCellStyle}>{row.retailerName}</TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.mtdVolume)}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.mtdValue)}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.mtdasp)}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.lmtdVolume)}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.lmtdValue)}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>
                    {formatNumberKMB(row.lmtdasp)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={11} 
                  sx={{ 
                    ...bodyCellStyle, 
                    textAlign: 'center',
                    color: PRIMARY_BLUE2,
                    padding: '20px'
                  }}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default IspPerformanceTable;
