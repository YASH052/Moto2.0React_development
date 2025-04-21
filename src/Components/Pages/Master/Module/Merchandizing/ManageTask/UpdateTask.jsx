import React from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  BLACK,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  DARK_PURPLE,
} from "../../../../../Common/colors";
import { tableHeaderStyle, rowstyle } from "../../../../../Common/commonstyles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import NuralTextButton from "../../../../NuralCustomComponents/NuralTextButton";

const UpdateTask = ({
  labelStyle,
  options,
  filteredRows,
  page,
  rowsPerPage,
  handleSort,
  sortConfig,
  handleChangePage,
  handleChangeRowsPerPage,
  setPage,
  images,
}) => {
  return (
    <>
      <Grid
        marginLeft={0}
        container
        spacing={2}
        borderRadius={2}
        mb={2}
        backgroundColor={LIGHT_GRAY2}
        // padding={2}
        mt={1}
      >
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "12px", sm: "10px" },
            }}
            fontWeight={600}
          >
            LEAVE TYPE CODE
          </Typography>
          <NuralAutocomplete
            width="100%"
            options={["Pending", "Approved", "Rejected"]}
            placeholder="SELECT"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "12px", sm: "10px" },
            }}
            fontWeight={600}
          >
            LEAVE TYPE CODE
          </Typography>
          <NuralAutocomplete
            width="100%"
            options={["Pending", "Approved", "Rejected"]}
            placeholder="SELECT"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "12px", sm: "10px" },
            }}
            fontWeight={600}
          >
            DUE DATE
          </Typography>
          <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "12px", sm: "10px" },
            }}
            fontWeight={600}
          >
            DUE DATE
          </Typography>
          <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
        </Grid>

        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>

        <Grid item xs={12} sm={6} md={1} lg={1}>
          <NuralButton
            text="RESET"
            variant="outlined"
            color={PRIMARY_BLUE2}
            fontSize="12px"
            height="36px"
            borderColor={PRIMARY_BLUE2}
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={11} lg={11}>
          <NuralTextButton
            icon={"./Icons/searchIcon.svg"}
            iconPosition="right"
            height="36px"
            backgroundColor={PRIMARY_BLUE2}
            color="#fff"
            width="100%"
            fontSize="12px"
          >
            SEARCH
          </NuralTextButton>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: LIGHT_GRAY2,
            color: PRIMARY_BLUE2,
            maxHeight: "calc(100vh - 300px)", // Add max height for scrolling
            overflow: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={10}
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
                    LIST
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
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
                {[
                  "SERIAL NUMBER",
                  "SERIAL NUMBER 2",
                  "SKU CODE",
                  "SKU NAME",
                  "USER NAME",
                  "REQUEST TYPE",
                  "STATUS",
                  "REQUEST DATE & TIME",
                ].map((header, index) => (
                  <TableCell
                    key={header}
                    onClick={() => handleSort(`column${index + 1}`)}
                    sx={{
                      ...tableHeaderStyle,
                      cursor: "pointer",
                      position: "sticky",
                      top: "48px",
                      backgroundColor: LIGHT_GRAY2,
                      zIndex: 1100,
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>{header}</Grid>
                      <Grid
                        item
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {sortConfig.key === `column${index + 1}` ? (
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
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      sx={{
                        ...rowstyle,
                        color: PRIMARY_BLUE2,
                        fontWeight: 600,
                      }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.serialNumber}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.serialNumber2}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.skuCode}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.skuName}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.userName}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.requestType}
                    </TableCell>
                    <TableCell sx={{ ...rowstyle }}>{row.status}</TableCell>
                    <TableCell sx={{ ...rowstyle }}>
                      {row.requestDate}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Custom Pagination */}
          <Grid
            container
            sx={{
              p: 2,
              alignItems: "center",
              justifyContent: "space-between",
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
                  {filteredRows.length} /{" "}
                  {Math.ceil(filteredRows.length / rowsPerPage)} PAGES
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
                  //   gap: 1,
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
                        handleChangeRowsPerPage({ target: { value } })
                      }
                      sx={{
                        minWidth: "25px",
                        height: "24px",
                        padding: "4px",
                        borderRadius: "50%",
                        // border: `1px solid ${PRIMARY_BLUE2}`,
                        backgroundColor:
                          rowsPerPage === value
                            ? PRIMARY_BLUE2
                            : "transparent",
                        color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                        fontSize: "12px",
                        "&:hover": {
                          backgroundColor:
                            rowsPerPage === value
                              ? PRIMARY_BLUE2
                              : "transparent",
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
                }}
              >
                JUMP TO FIRST
              </Typography>
              <IconButton
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
                disabled={
                  page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
                }
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
                }}
                variant="body2"
              >
                JUMP TO LAST
              </Typography>
              <input
                type="number"
                placeholder="Jump to page"
                min={1}
                max={Math.ceil(filteredRows.length / rowsPerPage)}
                // value={page + 1}
                onChange={(e) => {
                  const newPage = parseInt(e.target.value, 10) - 1;
                  if (
                    newPage >= 0 &&
                    newPage < Math.ceil(filteredRows.length / rowsPerPage)
                  ) {
                    setPage(newPage);
                  }
                }}
                style={{
                  width: "100px",
                  height: "24px",
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  borderRadius: "8px",
                  borderWidth: "1px",
                  border: `1px solid ${PRIMARY_BLUE2}`,
                }}
              />
              <Grid mt={1}>
                <img src="./Icons/footerSearch.svg" alt="arrow" />
              </Grid>
            </Grid>
          </Grid>
        </TableContainer>
      </Grid>
      <Grid
        marginLeft={0}
        container
        spacing={2}
        borderRadius={2}
        mb={2}
        backgroundColor={LIGHT_GRAY2}
        padding={2}
        mt={1}
      >
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            variant="body1"
            sx={{
              ...labelStyle,
              fontSize: { xs: "14px", sm: "14px" },
              color: BLACK,
            }}
            fontWeight={600}
          >
            TASK TYPE
          </Typography>

          <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
        </Grid>
        <Typography
          variant="body1"
          sx={{
            ...labelStyle,
            fontSize: { xs: "14px", sm: "14px" },
            color: BLACK,
            marginTop: "20px",
            marginLeft: "15px", // Added marginLeft for consistency
          }}
          fontWeight={600}
        >
          IMAGES
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1, px: 2 }}> // Adjusted spacing and padding
          {images.map((label, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  backgroundColor: "#cfd8f0",
                  borderRadius: "12px",
                  height: "160px",
                  minWidth: "262px", // Consider making this responsive or removing
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%", // Ensure box takes grid item width
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="#202060"
                >
                  {label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Grid item>
          <Box backgroundColor={LIGHT_GRAY2} padding={2} borderRadius={2}>
            <Typography
              variant="h5"
              sx={{
                color: DARK_PURPLE,
                fontSize: "1.25rem",
                fontWeight: "bold",
                lineHeight: "1.5",
                marginBottom: "1rem",
              }}
            >
              REJECTION REMARK
            </Typography>
            {/* First Row - 3 NuralAutocomplete */}
            <Grid
              container
              spacing={2}
              mb={2}
              sx={{
                gap: { xs: 0, sm: 0, md: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography
                  variant="body1"
                  sx={{
                    ...labelStyle,
                    fontSize: { xs: "14px", sm: "14px" },
                    color: BLACK,
                  }}
                  fontWeight={600}
                >
                  REMARK
                </Typography>

                <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
              </Grid>
            </Grid>

            {/* Second Row */}

            {/* Third Row - Buttons */}
          </Box>
        </Grid>

        <Grid
          container
          spacing={2}
          mt={1}
          px={1}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <NuralButton
              text="APPROVE"
              variant="outlined"
              color={PRIMARY_BLUE2}
              fontSize="12px"
              height="36px"
              borderColor={PRIMARY_BLUE2}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <NuralButton
              text="REJECT"
              variant="contained"
              color={AQUA_DARK}
              height="36px"
              backgroundColor={AQUA}
              width="100%"
              fontSize="12px"
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateTask; 