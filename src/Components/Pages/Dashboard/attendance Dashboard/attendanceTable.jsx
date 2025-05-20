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
  Checkbox,
} from "@mui/material";
import { LIGHT_GRAY2, DARK_BLUE, DARK_PURPLE } from "../../../Common/colors";
import React from "react";

const RowStyles = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "4%",
  textAlign: "start",
  color: DARK_BLUE,
  p: 2,
};

const CellStyles = {
  fontFamily: "Manrope",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "0%",
};

const Attendancetable = ({
  columns = [],
  rows = [],
  title = "Table",
  headerActions = null,
  checkbox = false,
  onCheckboxChange = () => {},
}) => {
  const [selectedRows, setSelectedRows] = React.useState({});

  const handleCheckboxChange = (row, checked) => {
    const newSelectedRows = { ...selectedRows };
    if (checked) {
      newSelectedRows[row.id] = true;
    } else {
      delete newSelectedRows[row.id];
    }
    setSelectedRows(newSelectedRows);
    onCheckboxChange(row, checked);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          backgroundColor: LIGHT_GRAY2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: DARK_BLUE,
            p: 2,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ p: 2 }}>{headerActions}</Box>
      </Box>

      <TableContainer sx={{ backgroundColor: LIGHT_GRAY2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
              {columns.map((column) => (
                <TableCell key={column.field} sx={RowStyles}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={`row-${rowIndex}`}
                sx={{
                  borderRadius: "8px",
                  paddingLeft: "5px",
                  margin: selectedRows[row.id] ? "8px" : "0",
                  backgroundColor: selectedRows[row.id] ? DARK_PURPLE : LIGHT_GRAY2,
                  color: selectedRows[row.id] ? "#FFFFFF" : "inherit",
                  "& .MuiTableCell-root": {
                    color: selectedRows[row.id] ? "#FFFFFF" : "inherit",
                    padding: selectedRows[row.id] ? "12px 16px" : "8px 16px",
                    border: "none",
                  },
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: selectedRows[row.id] ? "8px" : "0",
                    borderBottomLeftRadius: selectedRows[row.id] ? "8px" : "0",
                  },
                  "& .MuiTableCell-root:last-child": {
                    borderTopRightRadius: selectedRows[row.id] ? "8px" : "0",
                    borderBottomRightRadius: selectedRows[row.id] ? "8px" : "0",
                  },
                }}
              >
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={`${column.field}-${rowIndex}`}
                    sx={CellStyles}
                  >
                    {columnIndex === 0 && checkbox ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={Boolean(selectedRows[row.id])}
                          onChange={(e) =>
                            handleCheckboxChange(row, e.target.checked)
                          }
                          sx={{
                            color: selectedRows[row.id] ? "#FFFFFF" : "inherit",
                            "&.Mui-checked": {
                              color: selectedRows[row.id] ? "#FFFFFF" : "inherit",
                            },
                            padding: 0,
                            marginRight: 1,
                          }}
                        />
                        {row[column.field] !== undefined &&
                        row[column.field] !== null
                          ? String(row[column.field])
                          : "-"}
                      </Box>
                    ) : row[column.field] !== undefined &&
                      row[column.field] !== null ? (
                      String(row[column.field])
                    ) : (
                      "-"
                    )}
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

Attendancetable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  headerActions: PropTypes.node,
  checkbox: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
};

export default Attendancetable;
