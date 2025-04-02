import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import EditIcon from "@mui/icons-material/Edit";
import { LIGHT_GRAY2, PRIMARY_BLUE2 } from "../../../Common/colors";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const SKELETON_ROWS = 10;

const PriceListTable = ({
  priceListData = [],
  isSearchLoading,
  page = 1,
  rowsPerPage = 10,
  totalRecords = 0,
  sortConfig,
  handleSort,
  handleChangeRowsPerPage,
  handlePreviousPage,
  handleNextPage,
  handleJumpToPage,
  jumpToPage,
  setJumpToPage,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        color: PRIMARY_BLUE2,
        maxHeight: "calc(100vh - 320px)",
        overflow: "auto",
        position: "relative",
        "& .MuiTable-root": {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
        outline: "none",
        "&:focus": {
          outline: "none",
        },
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                position: "sticky",
                top: 0,
                zIndex: 1100,
                borderBottom: "none",
                boxShadow: "0 2px 2px rgba(0,0,0,0.05)",
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
                List
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
            <TableCell
              sx={{
                ...tableHeaderStyle,
                position: "sticky",
                top: "45px",
                backgroundColor: LIGHT_GRAY2,
                zIndex: 1000,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  borderBottom: "2px solid #e0e0e0",
                },
              }}
            >
              <Grid container alignItems="center" spacing={1}>
                <Grid item>S.NO</Grid>
              </Grid>
            </TableCell>
            {[
              { key: "priceListName", label: "Price List" },
              { key: "country", label: "Country" },
              { key: "state", label: "State" },
              { key: "status", label: "Status" },
              { key: "edit", label: "Edit", noSort: true },
            ].map((column) => (
              <TableCell
                key={column.key}
                onClick={() => !column.noSort && handleSort(column.key)}
                sx={{
                  ...tableHeaderStyle,
                  cursor: column.noSort ? "default" : "pointer",
                  position: "sticky",
                  top: "45px",
                  backgroundColor: LIGHT_GRAY2,
                  zIndex: 1000,
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>{column.label}</Grid>
                  {!column.noSort && (
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUpwardIcon
                            sx={{
                              fontSize: 16,
                              color: PRIMARY_BLUE2,
                            }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            sx={{
                              fontSize: 16,
                              color: PRIMARY_BLUE2,
                            }}
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
                            sx={{
                              fontSize: 12,
                              color: "grey.400",
                            }}
                          />
                          <ArrowDownwardIcon
                            sx={{
                              fontSize: 12,
                              color: "grey.400",
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
     
        <TableBody>
          {isSearchLoading
            ? Array(SKELETON_ROWS)
                .fill(0)
                .map((_, index) => <TableRowSkeleton key={index} columns={6} />)
            : priceListData.map((row, index) => (
                <TableRow key={row.priceMasterID}>
                  <TableCell
                    sx={{
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                    }}
                  >
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                    }}
                  >
                    {row.priceListName}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                    }}
                  >
                    {row.countryName}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                    }}
                  >
                    {row.stateName}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.status === 1 ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Grid
        container
        sx={{
          p: 1,
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          bottom: 0,
          backgroundColor: LIGHT_GRAY2,
          zIndex: 1000,
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
            <span
              style={{
                fontWeight: 700,
                color: PRIMARY_BLUE2,
              }}
            >
              {totalRecords} / {Math.ceil(totalRecords / rowsPerPage)} PAGES
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
              }}
            >
              SHOW :
            </Typography>
            {[10, 25, 50, 100].map((value) => (
              <Grid item key={value}>
                <Button
                  onClick={() =>
                    handleChangeRowsPerPage({
                      target: { value },
                    })
                  }
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
                    outline: "none",
                    "&:focus": {
                      outline: "none",
                    },
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
            }}
            onClick={() => handleJumpToPage("first")}
          >
            JUMP TO FIRST
          </Typography>
          <IconButton 
            onClick={handlePreviousPage} 
            disabled={page <= 1}
            sx={{
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            PAGE {page}
          </Typography>

          <IconButton
            onClick={handleNextPage}
            disabled={page >= Math.ceil(totalRecords / rowsPerPage)}
            sx={{
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}
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
            }}
            variant="body2"
            onClick={() => handleJumpToPage("last")}
          >
            JUMP TO LAST
          </Typography>
          <input
            type="number"
            placeholder="Jump to page"
            min={1}
            max={Math.ceil(totalRecords / rowsPerPage)}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            style={{
              width: "100px",
              height: "24px",
              fontSize: "8px",
              paddingRight: "8px",
              paddingLeft: "8px",
              textAlign: "center",
              borderRadius: "8px",
              borderWidth: "1px",
              border: `1px solid ${PRIMARY_BLUE2}`,
              backgroundColor: LIGHT_GRAY2,
              outline: "none",
              "&:focus": {
                outline: "none",
              },
            }}
          />
          <Grid mt={1} sx={{ cursor: "pointer" }}>
            <img
              src="./Icons/footerSearch.svg"
              alt="arrow"
              onClick={() => handleJumpToPage("custom")}
            />
          </Grid>
        </Grid>
      </Grid>
    </TableContainer>
  );
};

export default PriceListTable;
