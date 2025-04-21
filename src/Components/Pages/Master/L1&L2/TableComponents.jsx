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
  Grid,
  Switch,
  Button,
  IconButton,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Edit,
} from "@mui/icons-material";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import {
  jumpToPageStyle,
  rowstyle,
  tableHeaderStyle,
  toggleSectionStyle,
} from "../../../Common/commonstyles";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const CustomPagination = ({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [jumpToPage, setJumpToPage] = React.useState("");

  const handleJumpToPage = () => {
    const newPage = parseInt(jumpToPage, 10) - 1;
    if (newPage >= 0 && newPage < Math.ceil(totalRows / rowsPerPage)) {
      onPageChange(newPage);
    }
  };

  return (
    <Grid
      container
      sx={{
        p: 2,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: LIGHT_GRAY2,
      }}
    >
      <Grid item>
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 400,
            fontSize: "10px",
            lineHeight: "13.66px",
            letterSpacing: "4%",
            textAlign: "center",
          }}
          variant="body2"
          color="text.secondary"
        >
          TOTAL RECORDS:{" "}
          <span style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}>
            {totalRows} / {Math.ceil(totalRows / rowsPerPage)} PAGES
          </span>
        </Typography>
      </Grid>

      <Grid item>
        <Grid
          container
          spacing={1}
          sx={{
            maxWidth: 300,
            ml: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: "10px",
              color: PRIMARY_BLUE2,
              fontWeight: 600,
            }}
          >
            SHOW :
          </Typography>
          {[10, 25, 50, 100].map((value) => (
            <Grid item key={value}>
              <Button
                onClick={() => onRowsPerPageChange(value)}
                sx={{
                  minWidth: "25px",
                  height: "24px",
                  padding: "4px",
                  borderRadius: "50%",
                  backgroundColor:
                    rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                  color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor:
                      rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                  },
                  mx: 0.5,
                }}
              >
                {value}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: PRIMARY_BLUE2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "8px",
            lineHeight: "10.93px",
            letterSpacing: "4%",
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              color: PRIMARY_BLUE2,
            },
          }}
          onClick={() => onPageChange(0)}
        >
          JUMP TO FIRST
        </Typography>
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          PAGE {page + 1}
        </Typography>

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}
        >
          <NavigateNextIcon />
        </IconButton>

        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "8px",
            lineHeight: "10.93px",
            letterSpacing: "4%",
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              color: PRIMARY_BLUE2,
            },
          }}
          variant="body2"
          onClick={() => onPageChange(Math.ceil(totalRows / rowsPerPage) - 1)}
        >
          JUMP TO LAST
        </Typography>
        <input
          type="number"
          placeholder="Jump to page"
          min={1}
          max={Math.ceil(totalRows / rowsPerPage)}
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          style={jumpToPageStyle}
        />
        <Grid mt={1} sx={{ cursor: "pointer" }} onClick={handleJumpToPage}>
          <img src="./Icons/footerSearch.svg" alt="arrow" />
        </Grid>
      </Grid>
    </Grid>
  );
};

const IssueTable = ({
  rows,
  sortConfig,
  handleSort,
  page,
  rowsPerPage,
  totalRows,
  handleToggleChange,
  onPageChange,
  onRowsPerPageChange,
  tableLoading,
}) => {
  const tableColumns = [
    { id: "name", label: "NAME", sortable: true },
    { id: "code", label: "CODE", sortable: true },
    { id: "category", label: "CATEGORY", sortable: true },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: LIGHT_GRAY2,
          color: PRIMARY_BLUE2,
          maxHeight: "calc(100vh - 300px)",
          overflow: "auto",
        }}
      >
        {tableLoading ? (
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={12}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "19.12px",
                      letterSpacing: "0%",
                      color: PRIMARY_BLUE2,
                      p: 1,
                    }}
                  >
                    Issue List
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: column.sortable ? "pointer" : "default",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    {column.sortable ? (
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === column.id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            )
                          ) : (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              sx={{ height: 16, width: 16 }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRowSkeleton key={`skeleton-${index}`} columns={12} />
                ))}
            </TableBody>
          </Table>
        ) : (
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={15}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "19.12px",
                      letterSpacing: "0%",
                      color: PRIMARY_BLUE2,
                      p: 1,
                    }}
                  >
                    Issue List
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: column.sortable ? "pointer" : "default",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    {column.sortable ? (
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === column.id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            )
                          ) : (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              sx={{ height: 16, width: 16 }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {tableColumns.map((column) => (
                      <TableCell key={column.id} sx={{ ...rowstyle }}>
                        {column.id === "status" ? (
                          <Switch
                            checked={row.status}
                            onChange={() => handleToggleChange(row.id)}
                            sx={{
                              ...toggleSectionStyle,
                              "& .MuiSwitch-thumb": {
                                backgroundColor: row.status
                                  ? PRIMARY_BLUE2
                                  : DARK_PURPLE,
                              },
                            }}
                          />
                        ) : column.id === "edit" ? (
                          <Edit sx={{ color: DARK_PURPLE }} fontSize="small" />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    align="center"
                    sx={{ py: 3 }}
                  >
                    <Typography>No issues found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <CustomPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

const IssueCategoryTable = ({
  rows,
  sortConfig,
  handleSort,
  page,
  rowsPerPage,
  totalRows,
  handleToggleChange,
  onPageChange,
  onRowsPerPageChange,
  tableLoading,
}) => {
  const tableColumns = [
    { id: "name", label: "NAME", sortable: true },
    { id: "code", label: "CODE", sortable: true },
    { id: "status", label: "STATUS", sortable: false },
    { id: "edit", label: "EDIT", sortable: false },
  ];

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: LIGHT_GRAY2,
          color: PRIMARY_BLUE2,
          maxHeight: "calc(100vh - 300px)",
          overflow: "auto",
        }}
      >
        {tableLoading ? (
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={12}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "19.12px",
                      letterSpacing: "0%",
                      color: PRIMARY_BLUE2,
                      p: 1,
                    }}
                  >
                    Issue Category List
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: column.sortable ? "pointer" : "default",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    {column.sortable ? (
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === column.id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            )
                          ) : (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              sx={{ height: 16, width: 16 }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRowSkeleton key={`skeleton-${index}`} columns={12} />
                ))}
            </TableBody>
          </Table>
        ) : (
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={15}
                  sx={{
                    backgroundColor: LIGHT_GRAY2,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    borderBottom: "none",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Manrope",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: "19.12px",
                      letterSpacing: "0%",
                      color: PRIMARY_BLUE2,
                      p: 1,
                    }}
                  >
                    Issue Category List
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    onClick={() => column.sortable && handleSort(column.id)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: column.sortable ? "pointer" : "default",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    {column.sortable ? (
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>{column.label}</Grid>
                        <Grid item sx={{ display: "flex", alignItems: "center" }}>
                          {sortConfig.key === column.id ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ fontSize: 16, color: PRIMARY_BLUE2 }}
                              />
                            )
                          ) : (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              sx={{ height: 16, width: 16 }}
                            >
                              <ArrowUpwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                              <ArrowDownwardIcon
                                sx={{ fontSize: 12, color: "grey.400" }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {tableColumns.map((column) => (
                      <TableCell key={column.id} sx={{ ...rowstyle }}>
                        {column.id === "status" ? (
                          <Switch
                            checked={row.status}
                            onChange={() => handleToggleChange(row.id)}
                            sx={{
                              ...toggleSectionStyle,
                              "& .MuiSwitch-thumb": {
                                backgroundColor: row.status
                                  ? PRIMARY_BLUE2
                                  : DARK_PURPLE,
                              },
                            }}
                          />
                        ) : column.id === "edit" ? (
                          <Edit sx={{ color: DARK_PURPLE }} fontSize="small" />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    align="center"
                    sx={{ py: 3 }}
                  >
                    <Typography>No issue categories found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <CustomPagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export { IssueTable, IssueCategoryTable };
