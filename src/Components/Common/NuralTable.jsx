import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { LIGHT_GRAY2, PRIMARY_BLUE2, PRIMARY_LIGHT_GRAY } from "./colors";
import { rowstyle, tableHeaderStyle } from "./commonstyles";

const NuralTable = ({
  columns,
  data,
  title = "List",
  showSerialNumber = true,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const [filteredRows, setFilteredRows] = React.useState(data);

  const handleSort = (columnName) => {
    let direction = 'asc';
    if (sortConfig.key === columnName && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnName, direction });

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (a[columnName] < b[columnName]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[columnName] > b[columnName]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredRows(sortedRows);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        color: PRIMARY_BLUE2,
        maxHeight: 'calc(100vh - 200px)',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "19.12px",
          ml: 2,
          mt: 2,
          mb: 2,
          color: PRIMARY_BLUE2,
          position: 'sticky',
          top: 0,
          backgroundColor: LIGHT_GRAY2,
          zIndex: 1200,
        }}
      >
        {title}
      </Typography>

      <Table 
        sx={{ 
          minWidth: 650,
          position: 'relative',
        }} 
        size="small"
        stickyHeader
      >
        <TableHead>
          <TableRow
            sx={{
              position: 'sticky',
              top: '48px',
              backgroundColor: LIGHT_GRAY2,
              zIndex: 1100,
              '& th': {
                backgroundColor: LIGHT_GRAY2,
              },
            }}
          >
            {showSerialNumber && (
              <TableCell
                sx={{
                  ...tableHeaderStyle,
                  position: "sticky",
                  top: "48px",
                  backgroundColor: LIGHT_GRAY2,
                  zIndex: 1100,
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>S.NO</Grid>
                </Grid>
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.key}
                onClick={() => handleSort(column.key)}
                sx={{
                  ...tableHeaderStyle,
                  cursor: "pointer",
                  position: "sticky",
                  top: "48px",
                  backgroundColor: LIGHT_GRAY2,
                  zIndex: 1100,
                  '&:hover': {
                    backgroundColor: `${LIGHT_GRAY2}ee`,
                  },
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>{column.label}</Grid>
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Grid container direction="column" alignItems="center" sx={{ height: 16, width: 16 }}>
                      <ArrowUpwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                      <ArrowDownwardIcon sx={{ fontSize: 12, color: "grey.400" }} />
                    </Grid>
                  </Grid>
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow 
                key={row.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#BCD4EC' : PRIMARY_LIGHT_GRAY,
                }}
              >
                {showSerialNumber && (
                  <TableCell 
                    sx={{ 
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                      fontWeight: 600
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                )}
                {columns.map(column => (
                  <TableCell key={column.key} sx={{ ...rowstyle }}>
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Add pagination component here */}
      {/* ... Copy pagination code from SaleReports ... */}
    </TableContainer>
  );
};

export default NuralTable; 