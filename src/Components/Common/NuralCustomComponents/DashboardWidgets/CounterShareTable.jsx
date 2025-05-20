import React from "react";
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
} from "@mui/material";
import { LIGHT_GRAY2, PRIMARY_BLUE, WHITE, LIGHT_GRAY3, PRIMARY_BLUE2, MEDIUM_BLUE, DARK_PURPLE } from "../../colors"; // Assuming colors are defined here
import { titleStyle } from "../../commonstyles"; // Import titleStyle

// Styles adapted from IspPerformanceTable
const headerCellStyle = {
  backgroundColor: LIGHT_GRAY2, // Background for the whole table container
  color: PRIMARY_BLUE2, // Header text color
  fontWeight: "bold",
  borderBottom: "none",
  fontSize: "12px",
  padding: "8px 16px",
  textAlign: "center", // Keep centered for this table
  whiteSpace: "nowrap", // Prevent header text wrapping
};

const bodyCellStyle = {
  borderBottom: `1px solid ${MEDIUM_BLUE}`, // Lighter separator line
  color: PRIMARY_BLUE2, // Body text color
  fontSize: "12px",
  padding: "8px 16px",
  textAlign: "center", // Keep centered for this table
  whiteSpace: "nowrap", // Prevent data text wrapping
};

const totalRowStyle = {
  color: PRIMARY_BLUE2,
  fontSize: "12px",
  padding: "8px 16px",
  textAlign: "center", // Keep centered
  fontWeight: "bold",
  border: "none", // Remove internal borders
  backgroundColor: "transparent", // Make cell background transparent
  whiteSpace: "nowrap", // Prevent total text wrapping
};

const CounterShareTable = ({ data, title = "Counter Share" }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  // Extract headers dynamically from the first data object, converting keys to uppercase
  const headers = Object.keys(data[0]).map((key) => {
    if (key === "priceBand") return "PRICE BAND";
    if (key === "counterPercent") return "COUNTER %";
    return key.toUpperCase();
  });
  const dataKeys = Object.keys(data[0]); // Keep original keys for data access

  const totalRow = data.find((row) => row.priceBand === "TOTAL"); // Assuming 'TOTAL' identifies the total row
  const tableData = data.filter((row) => row.priceBand !== "TOTAL");

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        p: 2,
        borderRadius: "8px", // Match ISP table radius
        // width: "100%",
        overflowX: "auto", // Ensure horizontal scrolling on smaller screens
        boxShadow: "none", // Match ISP table shadow
      }}
    >
      <Typography variant="h6" sx={{ ...titleStyle, mb: 2 }}> {/* Use imported titleStyle */}
        {title}
      </Typography>
      <TableContainer component={Box} sx={{ maxHeight: 440 }}> {/* Use Box, Optional: Add max height for scrolling */}
        <Table stickyHeader aria-label="sticky counter share table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header} sx={headerCellStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Total Row - Render first if exists */}
            {totalRow && (
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
                {dataKeys.map((key) => (
                  <TableCell key={key} sx={totalRowStyle}>
                     {/* Apply bold style specifically to TOTAL label if needed */}
                    {key === 'priceBand' ? <strong>{totalRow[key]}</strong> : totalRow[key]}
                  </TableCell>
                ))}
              </TableRow>
            )}
             {/* Spacer Row if Total Row exists */}
             {totalRow && (
              <TableRow sx={{ height: "10px", backgroundColor: LIGHT_GRAY2 }}>
                <TableCell colSpan={headers.length} sx={{ padding: 0, border: "none" }} />
              </TableRow>
            )}
            {/* Regular Data Rows */}
            {tableData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex} // Use a unique key if possible, e.g., row.id
                sx={{
                  "&:hover": { backgroundColor: MEDIUM_BLUE + '40' }, // Subtle hover, adjust opacity as needed
                  // Remove default last row border removal if using custom borders
                }}
              >
                {dataKeys.map((key) => (
                  <TableCell key={key} sx={bodyCellStyle}>
                    {row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CounterShareTable; 