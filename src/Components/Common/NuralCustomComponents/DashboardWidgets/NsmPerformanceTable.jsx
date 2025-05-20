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
  Checkbox,
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
import { titleStyle } from "../../commonstyles";
import QtyValToggle from "../QtyValToggle";

// Helper function for K/M/B formatting
const formatNumberKMB = (num) => {
  if (typeof num !== "number" || isNaN(num)) {
    // Return original value or placeholder if input is not a valid number
    // Handle potential existing strings like '1234.24K' if necessary, although
    // this function expects raw numbers from props ideally.
    return num;
  }

  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  } else {
    // Show numbers less than 1000 with two decimal places as well
    return num.toFixed(2);
  }
};

const NsmPerformanceTable = ({
  onRowSelect,
  selectedRowId,
  performanceTableQTY = [],
  performanceTableVAL = [],
  title = "NSM Performance",
}) => {
  // console.log("performanceTableQTY", performanceTableQTY);
  // console.log("performanceTableVAL", performanceTableVAL);
  // Placeholder data similar to the image

  console.log("selectedRowId", selectedRowId);
  
  const defaultData = [
    {
      id: 1,
      name: "NSM 1",
      isp: "1234.24K",
      yesterday: "1234.24K",
      mtd: "1234.24K",
      avg: "1234.24K",
      counterSale: "1234.24K",
      marketShare: "1234.24K",
      zeroSale: "1234.24K",
    },
    {
      id: 2,
      name: "NSM 2",
      isp: "1234.24K",
      yesterday: "1234.24K",
      mtd: "1234.24K",
      avg: "1234.24K",
      counterSale: "1234.24K",
      marketShare: "1234.24K",
      zeroSale: "1234.24K",
    },
    {
      id: 3,
      name: "NSM 3",
      isp: "1234.24K",
      yesterday: "1234.24K",
      mtd: "1234.24K",
      avg: "1234.24K",
      counterSale: "1234.24K",
      marketShare: "1234.24K",
      zeroSale: "1234.24K",
    },
  ];

  const [alignment, setAlignment] = useState("qty");

  // Select original data based on alignment
  const originalData = useMemo(() => {
    return alignment === "qty" ? performanceTableQTY : performanceTableVAL;
  }, [alignment, performanceTableQTY, performanceTableVAL]);

  // Find the specific 'Total' row from the original data
  const extractedTotalRow = useMemo(() => {
    // Use defaultData if originalData is empty as a fallback for finding
    const dataToSearch = originalData.length > 0 ? originalData : defaultData;
    return dataToSearch.find((row) => row.name === "Total");
  }, [originalData, defaultData]); // Add defaultData dependency if used

  // Filter out the 'Total' row from the data to be mapped
  const currentData = useMemo(() => {
    // Use defaultData if originalData is empty as a fallback for filtering
    const dataToFilter = originalData.length > 0 ? originalData : defaultData;
    return dataToFilter.filter((row) => row.name !== "Total");
  }, [originalData, defaultData]); // Add defaultData dependency if used

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      // Add logic here to handle QTY/VAL data change if needed
    }
  };

  const headerCellStyle = {
    backgroundColor: LIGHT_GRAY2, // Background for the whole table container
    color: PRIMARY_BLUE2, // Header text color
    fontWeight: "bold",
    borderBottom: "none",
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
  };

  const bodyCellStyle = {
    borderBottom: `1px solid ${MEDIUM_BLUE}`, // Lighter separator line
    // Body text color
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
  };

  // Updated totalRowStyle for highlighted appearance (text styling only)
  const totalRowStyle = {
    color: PRIMARY_BLUE2,
    fontSize: "12px",
    padding: "8px 16px",
    textAlign: "left",
    fontWeight: "bold",
    border: "none", // Remove internal borders
    backgroundColor: MEDIUM_BLUE, // Make transparent to show row background
  };

  return (
    <Paper
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "8px",
        p: 2,
        boxShadow: "none",
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
        <QtyValToggle value={alignment} onChange={handleAlignment} />
      </Box>
      <TableContainer component={Box}>
        {" "}
        {/* Use Box instead of Paper for container to avoid double background */}
        <Table sx={{ minWidth: 650 }} aria-label="nsm performance table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle, minWidth: "150px" }}>
                NAME
              </TableCell>
              <TableCell sx={{ ...headerCellStyle }}>NO. OF ISP</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>YESTERDAY</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>MTD</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>AVG.</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>COUNTER SALE</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>MARKET SHARE</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>ZERO SALE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Display the extracted 'Total' Row if found */}
            {extractedTotalRow && (
              <TableRow
                sx={{
                  backgroundColor: PRIMARY_LIGHT_PURPLE, // Highlight background
                  borderRadius: "8px",
                  // Apply radius manually to first/last cell *within* the row for clipping
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
                {/* Apply totalRowStyle to each cell - Render data from extractedTotalRow */}
                <TableCell
                  sx={{
                    ...totalRowStyle,
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  {/* Render Checkbox for the Total row */}

                  {extractedTotalRow.name}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.noOfISP)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.yesterday)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.mtd)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.avg)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.counterSale)}
                </TableCell>
                <TableCell sx={totalRowStyle}>
                  {formatNumberKMB(extractedTotalRow.marketShare)}
                </TableCell>
                <TableCell
                  sx={{
                    ...totalRowStyle,
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  {formatNumberKMB(extractedTotalRow.zeroSale)}
                </TableCell>
              </TableRow>
            )}

            {/* Spacer Row */}
            <TableRow sx={{ height: "10px", backgroundColor: LIGHT_GRAY2 }}>
              {/* Adjusted colSpan to 8 since checkbox column was removed */}
              <TableCell colSpan={8} sx={{ padding: 0, border: "none" }} />
            </TableRow>

            {/* Map over currentData */}
            {currentData.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor:
                    selectedRowId === row.id ? PRIMARY_BLUE : LIGHT_GRAY2,
                  "&:hover": {
                    backgroundColor:
                      selectedRowId === row.id ? PRIMARY_BLUE : MEDIUM_BLUE,
                  },
                }}
              >
                {/* Cell with Checkbox and Name */}
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    display: "flex",
                    alignItems: "center",
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  
                  <Checkbox
                    checked={selectedRowId === row.id}
                    onChange={() => onRowSelect(row.id)}
                    size="small"
                    sx={{
                      padding: 0,
                      borderRadius: "6px",
                      backgroundColor: WHITE,
                      "&.Mui-checked": {
                        // Style when checked (optional, can be added if needed)
                        backgroundColor: PRIMARY_BLUE,
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                        fill: WHITE,
                      },
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                    }}
                  />{" "}
                  &nbsp;
                  <span style={{ fontSize: "12px" }}>{row.name}</span>
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.noOfISP)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.yesterday)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.mtd)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.avg)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.counterSale)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.marketShare)}
                </TableCell>
                <TableCell
                  sx={{
                    ...bodyCellStyle,
                    color: selectedRowId === row.id ? WHITE : PRIMARY_BLUE2,
                    fontWeight: selectedRowId === row.id ? "bold" : "normal",
                  }}
                >
                  {formatNumberKMB(row.zeroSale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NsmPerformanceTable;
