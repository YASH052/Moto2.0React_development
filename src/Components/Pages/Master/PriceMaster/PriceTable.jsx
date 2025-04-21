import React from 'react';
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
import { LIGHT_GRAY2, PRIMARY_BLUE2 } from "../../../Common/colors";
import { rowstyle, tableHeaderStyle } from "../../../Common/commonstyles";
import { TableRowSkeleton } from "../../../Common/Skeletons";

const SKELETON_ROWS = 10;

const PriceTable = ({
  priceData,
  isSearchLoading,
  page,
  rowsPerPage,
  totalRecords,
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
        maxHeight: "calc(100vh - 100px)",
        overflow: "auto",
        position: "relative",
        "& .MuiTable-root": {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={14}
              sx={{
                backgroundColor: LIGHT_GRAY2,
                position: "sticky",
                top: 0,
                zIndex: 1000,

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
              { key: "skuCode", label: "SKU Code" },
              { key: "skuName", label: "SKU Name" },
              { key: "model", label: "Model" },
              { key: "priceListName", label: "Price List" },
              { key: "whPrice", label: "WH Price" },
              { key: "sdPrice", label: "SD Price" },
              { key: "mdPrice", label: "MD Price" },
              { key: "retailerPrice", label: "Retailer Price" },
              { key: "mop", label: "MOP" },
              { key: "mrp", label: "MRP" },
              { key: "effectiveDate", label: "Effective Date" },
              { key: "validTill", label: "Valid Till" },
              // { key: "status", label: "Status", noSort: true },
            ].map((column) => (
              <TableCell
                key={column.key}
                onClick={column.noSort ? undefined : () => handleSort(column.key)}
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
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {!column.noSort && (
                      sortConfig.key === column.key ? (
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
                      )
                    )}
                  </Grid>
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isSearchLoading
            ? Array(SKELETON_ROWS)
                .fill(0)
                .map((_, index) => (
                  <TableRowSkeleton key={index} columns={14} />
                ))
            : priceData.map((row, index) => (
                <TableRow key={row.priceMasterID}>
                  <TableCell
                    sx={{
                      ...rowstyle,
                      color: PRIMARY_BLUE2,
                      fontWeight: 600,
                    }}
                  >
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.skuCode}</TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.skuName}</TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.model}</TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.priceListName}</TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.whPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.sdPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.mdPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.retailerPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.mop?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>
                    {row.mrp?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.effectiveDate}</TableCell>
                  <TableCell sx={{ ...rowstyle }}>{row.validTill || "-"}</TableCell>
                  
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
                fontWeight: 600,
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

export default PriceTable; 