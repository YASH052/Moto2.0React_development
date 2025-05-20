import React, { useState } from "react";
import PropTypes from "prop-types";
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
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  DARK_PURPLE,
  WHITE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_BLUE,
  MEDIUM_BLUE,
} from "../../Common/colors"; // Ensure these colors are defined or adjust as needed

// Dummy data matching the structure suggested by the image
const dummyData = Array.from({ length: 10 }, (_, i) => ({
  name: `ISP ${i + 1}`,
  code: "1234.24K",
  agency: "Column 1",
  city: "Column 1",
  retailerName: "Column 1",
  mtdVolume: "1234.24K",
  mtdValue: "1234.24K",
  mtdAsp: "1234.24K",
  lmtdVolume: "1234.24K",
  lmtdValue: "1234.24K",
  lmtdAsp: "1234.24K",
}));

// Styled components for consistent styling
const StyledTableCell = styled(TableCell)(({ theme, align }) => ({
  fontFamily: "Manrope",
  fontSize: "10px",
  fontWeight: 700,
  // lineHeight: "13.66px",
  letterSpacing: "0.04em",
  color: DARK_PURPLE, // Using imported color
  borderBottom: "none", // Removing default border
  padding: "12px 16px",
  textAlign: align || "left", // Default to left, allow override
  // backgroundColor: "red",
}));

const StyledTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "inherit" : "inherit", // Alternating row colors, ensure WHITE is defined
  "&:hover": {
    backgroundColor: "#EFEFFD", // Subtle hover effect
  },
}));

const TotalRowTableCell = styled(StyledTableCell)({
  fontWeight: 700,
  fontSize: "10px", // Slightly larger font for total
  color: PRIMARY_BLUE2,
});

const ISPPerformanceTable = ({
  targetISPPerformanceList,
  targetDashboardBottom10,
  handleGetTargetDashboardBottom10,
}) => {
  const [viewType, setViewType] = useState("top10");

  const handleViewTypeChange = (newViewType) => {
    if (newViewType !== viewType) {
      setViewType(newViewType);
      if (newViewType === "bot10") {
        handleGetTargetDashboardBottom10();
      }
    }
  };

  // Extract total row and remaining data based on viewType
  const currentData = viewType === "top10" ? targetISPPerformanceList : targetDashboardBottom10;

  const totalRow = currentData?.find(
    (item) => item.name === "Total"
  );
  const ispData =
    currentData?.filter((item) => item.name !== "Total") || [];

  const columns = [
    { id: "name", label: "NAME", align: "left" },
    { id: "code", label: "CODE", align: "right" },
    { id: "agency", label: "AGENCY", align: "left" },
    { id: "city", label: "CITY", align: "left" },
    { id: "retailerName", label: "RETAILER NAME", align: "left" },
    { id: "mtdVolume", label: "MTD VOLUME", align: "right" },
    { id: "mtdValue", label: "MTD VALUE", align: "right" },
    { id: "mtdasp", label: "MTD ASP", align: "right" },
    { id: "lmtdVolume", label: "LMTD VOLUME", align: "right" },
    { id: "lmtdValue", label: "LMTD VALUE", align: "right" },
    { id: "lmtdasp", label: "LMTD ASP", align: "right" },
  ];

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "12px", // Rounded corners like the image
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow
        backgroundColor: LIGHT_GRAY2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          backgroundColor: LIGHT_GRAY2, // White background for the header area
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "14px", // Title font size
            color: PRIMARY_BLUE2,
          }}
        >
          ISP Performance
        </Typography>

        <Grid container sx={{ width: 'auto', display: 'inline-flex' }} gap={1}>
          <Grid
            item
            onClick={() => handleViewTypeChange("top10")}
            sx={{
              height: "32px",
              minWidth: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: viewType === "top10" ? PRIMARY_BLUE : "inherit",
              color: viewType === "top10" ? WHITE : DARK_PURPLE,
              fontSize: "8px",
              fontWeight: 700,
              borderRadius: "8px",
            }}
          >
            TOP 10
          </Grid>
          <Grid
            item
            onClick={() => handleViewTypeChange("bot10")}
            sx={{
              height: "32px",
              minWidth: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: viewType === "bot10" ? PRIMARY_BLUE : "inherit",
              color: viewType === "bot10" ? WHITE : DARK_PURPLE,
              fontSize: "8px",
              fontWeight: 700,
              borderRadius: "8px",

            }}
          >
            BOT 10
          </Grid>
        </Grid>
      </Box>

      <TableContainer>
        <Table stickyHeader aria-label="isp performance table">
          <TableHead >
            <TableRow >
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} sx={{ backgroundColor: MEDIUM_BLUE }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Total Row */}
            {totalRow && (
              <TableRow>
                <TotalRowTableCell >TOTAL</TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.code}
                </TotalRowTableCell>
                <TotalRowTableCell align="left">
                  {totalRow.agency}
                </TotalRowTableCell>
                <TotalRowTableCell align="left">
                  {totalRow.city}
                </TotalRowTableCell>
                <TotalRowTableCell align="left">
                  {totalRow.retailerName}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.mtdVolume}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.mtdValue}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.mtdasp}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.lmtdVolume}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.lmtdValue}
                </TotalRowTableCell>
                <TotalRowTableCell align="right">
                  {totalRow.lmtdasp}
                </TotalRowTableCell>
              </TableRow>
            )}
            {/* Data Rows */}
            {ispData.map((row, index) => (
              <StyledTableRow key={row.name} index={index}>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align}>
                    {row[column.id]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

ISPPerformanceTable.propTypes = {
  targetISPPerformanceList: PropTypes.array,
  targetDashboardBottom10: PropTypes.array,
  handleGetTargetDashboardBottom10: PropTypes.func,
};

export default ISPPerformanceTable;
