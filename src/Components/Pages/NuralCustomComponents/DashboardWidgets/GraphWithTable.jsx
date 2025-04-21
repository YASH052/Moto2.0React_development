import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";

import { Bar } from "react-chartjs-2";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  DARK_PURPLE,
  MEDIUM_BLUE,
  SECONDARY_BLUE,
} from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";
import ISPZeroSaleTable from "../../Dashboard/ISPZeroSaleTable";

const brandData = [
  { id: 1, name: "PRIMARY", value: "140.15K" },
  { id: 2, name: "SECONDARY", value: "169K" },
];

const databar = {
  labels: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"],
  datasets: [
    {
      data: [
        58000, 58000, 48000, 35000, 45000, 55000, 55000, 55000, 58000, 58000,
      ],
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index === 3 ? "#00CED1" : "#DFDDDE";
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderRadius: 4,
    },
    {
      data: [
        48000, 48000, 58000, 75000, 49000, 95000, 25000, 15000, 78000, 88000,
      ],
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index === 3 ? "#00CED1" : "#DFDDDE";
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderRadius: 4,
    },
    {
      data: [
        35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000, 35000,
      ],
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return index === 3 ? "#80E6E6" : "#E8E8E8";
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderRadius: 4,
    },
  ],
};
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: true,
        drawBorder: true,
        borderColor: PRIMARY_BLUE2,
        borderWidth: 1,
        drawOnChartArea: true,
        drawTicks: false,
      },
      ticks: {
        font: {
          family: "Manrope",
          size: 10,
        },
        color: PRIMARY_BLUE2,
      },
      border: {
        display: true,
        color: PRIMARY_BLUE2,
      },
    },
    y: {
      beginAtZero: true,
      max: 80000,
      ticks: {
        stepSize: 20000,
        font: {
          family: "Manrope",
          size: 10,
        },
        callback: function (value) {
          return value / 1000 + "K";
        },
        color: PRIMARY_BLUE2,
      },
      grid: {
        color: "#E0E0E0",
        drawBorder: false,
        borderDash: [3, 3],
      },
      border: {
        display: true,
        color: PRIMARY_BLUE2,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      position: "nearest",
      callbacks: {
        title: () => "",
        label: (context) => {
          const index = context.dataIndex;
          if (index === 3) {
            return ["TERTIARY 25", "LMTD 40", "ACTIVATION 60"];
          }
          return [];
        },
      },
      backgroundColor: "white",
      titleColor: "#666666",
      bodyColor: "#00CED1",
      borderColor: "#E0E0E0",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      bodyFont: {
        size: 12,
        family: "Manrope",
      },
      bodySpacing: 6,
      yAlign: "bottom",
      xAlign: "center",
    },
  },
  onClick: (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index;
      setSelectedBar(index);
    }
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const GraphWithTable = () => {
  const [selectedRetailer, setSelectedRetailer] = useState("RETAILER 4");
  const [viewMode, setViewMode] = useState("group");
  const [selectedBar, setSelectedBar] = useState(3);
  const [selectedDistributor, setSelectedDistributor] = useState("DIST. 1");
  const [activeButtons, setActiveButtons] = useState({
    group: true,
    individual: false,
    top: true,
    bottom: false,
  });

  const handleButtonClick = (buttonType) => {
    if (buttonType === "group" || buttonType === "individual") {
      setActiveButtons({
        ...activeButtons,
        group: buttonType === "group",
        individual: buttonType === "individual",
      });
      setViewMode(buttonType);
    } else {
      setActiveButtons({
        ...activeButtons,
        top: buttonType === "top",
        bottom: buttonType === "bottom",
      });
    }
  };

  return (
    <Grid
      container
      spacing={2}
      mt={2}
      ml={0}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: 2,
      }}
    >
      <Grid item xs={12} md={12} lg={12} xl={12} p={0}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: 10,
            lineHeight: "100%",
            letterSpacing: "0%",
            color: PRIMARY_BLUE2,
          }}
        >
          Retailer Sales
        </Typography>
      </Grid>

      <Grid item xs={12} md={12} lg={12} xl={12} p={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Grid container spacing={1}>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.group ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.group ? DARK_PURPLE : "transparent",
                    color: activeButtons.group ? "white" : DARK_PURPLE,
                    border: activeButtons.group
                      ? `1px solid ${DARK_PURPLE}`
                      : "none",
                    "&:hover": {
                      bgcolor: activeButtons.group
                        ? "#2F3BC9"
                        : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("group")}
                >
                  GROUP
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.individual ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.individual
                      ? DARK_PURPLE
                      : "transparent",
                    color: activeButtons.individual ? "white" : DARK_PURPLE,
                    border: activeButtons.individual
                      ? `1px solid ${DARK_PURPLE}`
                      : "none",
                    "&:hover": {
                      bgcolor: activeButtons.individual
                        ? "#2F3BC9"
                        : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("individual")}
                >
                  INDIVIDUAL
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.top ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.top ? DARK_PURPLE : "transparent",
                    color: activeButtons.top ? "white" : DARK_PURPLE,
                    border: activeButtons.top
                      ? `1px solid ${DARK_PURPLE}`
                      : "none",
                    "&:hover": {
                      bgcolor: activeButtons.top
                        ? "#2F3BC9"
                        : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("top")}
                >
                  TOP 10
                </Button>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <Button
                  variant={activeButtons.bottom ? "contained" : "outlined"}
                  sx={{
                    padding: "6px",
                    height: "30px",
                    bgcolor: activeButtons.bottom ? DARK_PURPLE : "transparent",
                    color: activeButtons.bottom ? "white" : DARK_PURPLE,
                    border: activeButtons.bottom
                      ? `1px solid ${DARK_PURPLE}`
                      : "none",
                    "&:hover": {
                      bgcolor: activeButtons.bottom
                        ? "#2F3BC9"
                        : "rgba(47, 59, 201, 0.1)",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "8px",
                    borderRadius: "12px",
                    width: "100%",
                  }}
                  onClick={() => handleButtonClick("bottom")}
                >
                  BOTTOM 10
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={10} xl={10}>
            <NuralAutocomplete
              options={["RETAILER 1", "RETAILER 2", "RETAILER 3"]}
              placeholder="RETAILER 4"
              value={selectedRetailer}
              onChange={(e) => setSelectedRetailer(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2} xl={2}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: DARK_PURPLE,
                  fontSize: "8px",
                  fontWeight: 700,
                  borderRadius: "40px",
                  padding: "4px 12px",
                  minWidth: "unset",
                  "&:hover": {
                    backgroundColor: "#2F3BC9",
                  },
                }}
              >
                QTY
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: DARK_PURPLE,
                  fontSize: "8px",
                  fontWeight: 700,
                  borderRadius: "40px",
                  padding: "4px 12px",
                  minWidth: "unset",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#2F3BC9",
                  },
                }}
              >
                VAL
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12} xl={12} p={2}>
            <Box
              sx={{
                height: 200,
                width: "100%",
                "& canvas": {
                  borderLeft: "1px solid #E0E0E0",
                  borderRight: "1px solid #E0E0E0",
                },
              }}
            >
              <Bar options={options} data={databar} />
            </Box>
          </Grid>
        </Grid>

        <Grid
          // container
          sx={{
            p: 1,
            // mt: 1,
            backgroundColor: MEDIUM_BLUE,
            borderRadius: 2,
            justifyContent: "center",
            // height: "70px",
          }}
        >
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "10px",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: DARK_PURPLE,
                textAlign: "start",
              }}
            >
              RETAILER 4.
            </Typography>
          </Grid>

          <Grid item xs={12} md={10} lg={10} xl={10}>
            <Grid
              container
              spacing={0}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                mt: 1,
              }}
            >
              {brandData.map((item, index) => (
                <Grid
                  item
                  xs={12 / 7}
                  md={3}
                  key={item.id}
                  sx={{
                    textAlign: "center",
                    position: "relative",
                    "&::after":
                      index < brandData.length - 1
                        ? {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            top: "15%",
                            height: "70%",
                            width: "1px",
                            backgroundColor: PRIMARY_BLUE2,
                          }
                        : {},
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "8px",
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: DARK_PURPLE,
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12} mt={0}>
          {/* Product Ageing Table */}
          <Box
            sx={{
              backgroundColor: LIGHT_GRAY2, // Light lavender background similar to image
              p: 2,
              borderRadius: 2,
              // Dashed purple border
            }}
          >
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              sx={{
                color: SECONDARY_BLUE, // Purple color for title
                fontWeight: "bold",
                textTransform: "uppercase",
                // Dashed purple underline
                pb: 1,

                fontSize: "10px", // Match size if needed
                letterSpacing: "0.05em", // Adjust spacing if needed
              }}
            >
              Product Ageing
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <Table size="small" aria-label="product ageing table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: PRIMARY_BLUE2, // Use existing color
                        borderBottom: "1px solid #C5CAE9", // Light border
                        fontSize: "10px",
                      }}
                    >
                      MODEL
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontWeight: "bold",
                        color: PRIMARY_BLUE2,
                        borderBottom: "1px solid #C5CAE9",
                        fontSize: "10px",
                      }}
                    >
                      <TableSortLabel
                        active={true} // Mark as active to show direction
                        direction="asc" // or 'desc' based on actual state
                        IconComponent={ArrowUpward}
                        sx={{
                          "& .MuiTableSortLabel-icon": {
                            color: `${PRIMARY_BLUE2} !important`,
                          },
                        }} // Style icon
                      >
                        AGE RANGE
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontWeight: "bold",
                        color: PRIMARY_BLUE2,
                        borderBottom: "1px solid #C5CAE9",
                        fontSize: "10px",
                      }}
                    >
                      <TableSortLabel
                        active={true}
                        direction="asc"
                        IconComponent={ArrowUpward}
                        sx={{
                          "& .MuiTableSortLabel-icon": {
                            color: `${PRIMARY_BLUE2} !important`,
                          },
                        }}
                      >
                        STOCK
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productAgeingData.map((row) => (
                    <TableRow
                      key={row.model}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          color: PRIMARY_BLUE2,
                          borderBottom: "1px solid #C5CAE9",
                          fontSize: "10px",
                        }}
                      >
                        {row.model}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: PRIMARY_BLUE2,
                          borderBottom: "1px solid #C5CAE9",
                          fontSize: "10px",
                        }}
                      >
                        {row.ageRange}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: PRIMARY_BLUE2,
                          borderBottom: "1px solid #C5CAE9",
                          fontSize: "10px",
                        }}
                      >
                        {row.stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

// Define table data outside the component or fetch from API
const productAgeingData = [
  { model: "Model 1", ageRange: "<15 Days", stock: 637 },
  { model: "Model 2", ageRange: "15-30 Days", stock: 4838 },
  { model: "Model 3", ageRange: "31-45 Days", stock: 4890 },
  { model: "Model 4", ageRange: "<15 Days", stock: 2290 },
  
  
];

export default GraphWithTable;
