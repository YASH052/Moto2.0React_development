// import React from "react";
// import { Box, Typography, Paper, Button, Grid } from "@mui/material";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { PRIMARY_BLUE2, LIGHT_GRAY2, DARK_PURPLE, PRIMARY_LIGHT_PURPLE2, MEDIUM_BLUE ,BORDER_BOTTOM} from "../../colors";
// import NuralAutocomplete from "../../../Pages/NuralCustomComponents/NuralAutocomplete";
// import ISPZeroSaleTable from "../../../Pages/Dashboard/ISPZeroSaleTable";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const FocusModelPerformanceIncentive = ({ height = "300px" }) => {
//   const [selectedProduct, setSelectedProduct] = React.useState("ALL PRODUCTS");

//   const metrics = {
//     growth: -15.1,
//     lmtd: 450,
//     mtd: 450,
//     qtd: 450,
//     ytd: 450,
//   };

//   const chartData = {
//     labels: ["JAN", "MAR", "MAY", "JUN"],
//     datasets: [
//       {
//         data: [3000, 4000, 7000, 8500],
//         borderColor: "#ccc",
//         tension: 0.4,
//         pointRadius: 0,
//       },
//       {
//         data: [null, 4000],
//         borderColor: "#00D2D2",
//         pointBackgroundColor: "#00D2D2",
//         pointRadius: 6,
//         pointHoverRadius: 8,
//         tension: 0,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 16000,
//         ticks: {
//           stepSize: 4000,
//           callback: function (value) {
//             return value === 0 ? "0" : value / 1000 + "K";
//           },
//           color: PRIMARY_BLUE2,
//           font: {
//             size: 10,
//           },
//         },
//         grid: {
//           display: false,
//           drawBorder: false,
//           drawTicks: true,
//         },
//         border: {
//           display: true,
//           color: PRIMARY_BLUE2,
//         },
//       },
//       x: {
//         grid: {
//           display: true,
//           color: "rgba(0, 0, 0, 0.1)",
//           drawTicks: true,
//         },
//         ticks: {
//           callback: function (value, index) {
//             const label = this.getLabelForValue(value);
//             return label === "MAR" ? label : label;
//           },
//           color: (context) => {
//             const label = context.tick.label;
//             return label === "MAR" ? "#00D2D2" : PRIMARY_BLUE2;
//           },
//           font: {
//             size: 10,
//           },
//         },
//         border: {
//           display: true,
//           color: PRIMARY_BLUE2,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: "#00D2D2",
//         titleColor: "#fff",
//         bodyColor: "#fff",
//         titleFont: {
//           size: 12,
//           weight: "normal",
//         },
//         bodyFont: {
//           size: 12,
//           weight: "normal",
//         },
//         padding: 12,
//         displayColors: false,
//         callbacks: {
//           title: function (context) {
//             const date = context[0].label;
//             if (date === "MAR") {
//               return "16/03/24";
//             }
//             return date;
//           },
//           label: function (context) {
//             return `₹${context.parsed.y}`;
//           },
//         },
//         position: "average",
//       },
//     },
//     interaction: {
//       intersect: false,
//       mode: "index",
//     },
//   };

//   return (
//     <>
//       <Grid>
//         <Paper
//           sx={{
//             p: 2,
//             height: "88%",
//             backgroundColor: LIGHT_GRAY2,
//             borderRadius: "8px",
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontFamily: "Manrope",
//               fontWeight: 700,
//               fontSize: "10px",
//               lineHeight: "100%",
//               letterSpacing: "0%",
//               color: PRIMARY_BLUE2,
//               mb: 2,
//             }}
//           >
//             Focus Model Performance
//           </Typography>

//           <Grid
//             container
//             spacing={4}
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Grid item xs={12} mt={1.5} md={9} lg={9} xl={9}>
//               <NuralAutocomplete
//                 options={["ALL PRODUCTS"]}
//                 placeholder="ALL PRODUCTS"
//                 width="100%"
//                 backgroundColor={LIGHT_GRAY2}
//               />
//             </Grid>
//             <Grid item xs={12} md={3} lg={3} xl={3}>
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   sx={{
//                     backgroundColor: DARK_PURPLE,
//                     fontSize: "8px",
//                     fontWeight: 700,
//                     borderRadius: "40px",
//                     padding: "4px 12px",
//                     minWidth: "unset",
//                     "&:hover": {
//                       backgroundColor: "#2F3BC9",
//                     },
//                   }}
//                 >
//                   QTY
//                 </Button>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     backgroundColor: LIGHT_GRAY2,
//                     color: DARK_PURPLE,
//                     fontSize: "8px",
//                     fontWeight: 700,
//                     borderRadius: "40px",
//                     padding: "4px 12px",
//                     minWidth: "unset",
//                     border: "none",
//                     "&:hover": {
//                       backgroundColor: "#2F3BC9",
//                     },
//                   }}
//                 >
//                   VAL
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>

//           <Grid container spacing={4}></Grid>

//           <Grid container spacing={4}>
//             <Grid item xs={7} md={7} lg={7} xl={7} mt={3}>
//               <Typography
//                 variant="caption"
//                 sx={{
//                   fontFamily: "Manrope",
//                   fontWeight: 700,
//                   fontSize: "8px",
//                   lineHeight: "100%",
//                   letterSpacing: "4%",
//                   textTransform: "uppercase",
//                   color: PRIMARY_LIGHT_PURPLE2,
//                   mt: 1,
//                 }}
//               >
//                 LAST 6 MONTHS TREND
//               </Typography>

//               <Box sx={{ height: "250px" }}>
//                 <Line data={chartData} options={options} />
//               </Box>
//             </Grid>
//             <Grid item xs={4} md={4} lg={4} xl={4} mt={3}>
//               <Paper
//                 sx={{
//                   backgroundColor: LIGHT_GRAY2,
//                   p: 2,
//                   width: "120%", // Adjust based on your layout
//                   marginLeft: "-10%",
//                   marginTop: "20%",
//                 }}
//               >
//                 <Typography variant="subtitle2" gutterBottom color={PRIMARY_BLUE2}>
//                   lAST MTD vs MTD
//                 </Typography>

//                 <Grid
//                   container
//                   spacing={2}
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   {/* Top Row */}
//                   <Grid item xs={4}>
//                     <Typography variant="caption" color={BORDER_BOTTOM}>
//                       M1
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       165
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography
//                       variant="caption"
//                       color={BORDER_BOTTOM}
//                       align="center"
//                     >
//                       M2
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       12
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography variant="caption" color={BORDER_BOTTOM}>
//                       M3
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       15
//                     </Typography>
//                   </Grid>

//                   {/* Bottom Row */}
//                   <Grid item xs={4}>
//                     <Typography variant="caption" color={BORDER_BOTTOM}>
//                       M4
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       5
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Typography variant="caption" color={BORDER_BOTTOM}>
//                       M5
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       21
//                     </Typography>
//                   </Grid>

//                   <Grid item xs={4}>
//                     <Typography variant="caption" color={BORDER_BOTTOM}>
//                       M6
//                     </Typography>
//                     <Typography variant="h6" fontWeight="bold" color="primary">
//                       2
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Paper>
//       </Grid>
//     </>
//   );
// };

// export default FocusModelPerformanceIncentive;

import React from "react";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  PRIMARY_BLUE2,
  LIGHT_GRAY2,
  DARK_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
  MEDIUM_BLUE,
  BORDER_BOTTOM,
  lightGray,
  PRIMARY_BLUE,
  LIGHT_BLUE,
} from "../../colors";
import NuralAutocomplete from "../../../Pages/NuralCustomComponents/NuralAutocomplete";
import ISPZeroSaleTable from "../../../Pages/Dashboard/ISPZeroSaleTable";
import { CenterFocusStrong } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FocusModelPerformanceIncentive = ({ height = "300px" }) => {
  const [selectedProduct, setSelectedProduct] = React.useState("ALL PRODUCTS");

  const metrics = {
    growth: -15.1,
    lmtd: 450,
    mtd: 450,
    qtd: 450,
    ytd: 450,
  };

  const chartData = {
    labels: ["JAN", "MAR", "MAY", "JUN"],
    datasets: [
      {
        data: [3000, 4000, 7000, 8500],
        borderColor: "#ccc",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        data: [null, 4000],
        borderColor: "#00D2D2",
        pointBackgroundColor: "#00D2D2",
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 16000,
        ticks: {
          stepSize: 4000,
          callback: function (value) {
            return value === 0 ? "0" : value / 1000 + "K";
          },
          color: PRIMARY_BLUE2,
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
          drawTicks: true,
        },
        border: {
          display: true,
          color: PRIMARY_BLUE2,
        },
      },
      x: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          drawTicks: true,
        },
        ticks: {
          callback: function (value, index) {
            const label = this.getLabelForValue(value);
            return label === "MAR" ? label : label;
          },
          color: (context) => {
            const label = context.tick.label;
            return label === "MAR" ? "#00D2D2" : PRIMARY_BLUE2;
          },
          font: {
            size: 10,
          },
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
        backgroundColor: "#00D2D2",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: {
          size: 12,
          weight: "normal",
        },
        bodyFont: {
          size: 12,
          weight: "normal",
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (context) {
            const date = context[0].label;
            if (date === "MAR") {
              return "16/03/24";
            }
            return date;
          },
          label: function (context) {
            return `₹${context.parsed.y}`;
          },
        },
        position: "average",
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <>
      <Grid>
        <Paper
          sx={{
            p: 2,
            height: "88%",
            backgroundColor: LIGHT_GRAY2,
            borderRadius: "8px",
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
              color: PRIMARY_BLUE2,
              mb: 2,
            }}
          >
            Focus Model Performance
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={12} mt={1.5} md={9} lg={9} xl={9}>
              <NuralAutocomplete
                options={["ALL PRODUCTS"]}
                placeholder="ALL PRODUCTS"
                width="100%"
                backgroundColor={LIGHT_GRAY2}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3} xl={3}>
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
          </Grid>

          <Grid container spacing={4}></Grid>

          <Grid container spacing={4}>
            <Grid item xs={7} md={7} lg={7} xl={7} mt={3} marginTop={5}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Manrope",
                  fontWeight: 700,
                  fontSize: "8px",
                  lineHeight: "100%",
                  letterSpacing: "4%",
                  textTransform: "uppercase",
                  color: PRIMARY_LIGHT_PURPLE2,
                }}
              >
                LAST 6 MONTHS TREND
              </Typography>

              <Box sx={{ height: "250px" }}>
                <Line data={chartData} options={options} />
              </Box>
            </Grid>
            <Grid item xs={4} md={4} lg={4} xl={4} mt={3}>
              <Grid
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  p: 2,
                  width: "120%", // Adjust based on your layout
                  marginLeft: "0%",
                  marginTop: "10%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color={PRIMARY_BLUE2}
                >
                  LAST MTD vs MTD
                </Typography>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                  backgroundColor={MEDIUM_BLUE}
                  borderRadius={4}
                  padding={2}
                >
                  <Grid item textAlign="center">
                    <Typography
                      fontSize={10}
                      fontWeight="bold"
                      color={BORDER_BOTTOM}
                    >
                      Growth
                    </Typography>
                    <Typography
                      fontSize={24}
                      fontWeight="bold"
                      color={PRIMARY_BLUE}
                    >
                      +5.5%
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  marginLeft={2}
                >
                  {/* Top Row */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color={BORDER_BOTTOM}>
                      M1
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      165
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="caption"
                      color={BORDER_BOTTOM}
                      align="center"
                    >
                      M2
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      12
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color={BORDER_BOTTOM}>
                      M3
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      15
                    </Typography>
                  </Grid>

                  {/* Bottom Row */}
                  <Grid item xs={4}>
                    <Typography variant="caption" color={BORDER_BOTTOM}>
                      M4
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      5
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color={BORDER_BOTTOM}>
                      M5
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      21
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="caption" color={BORDER_BOTTOM}>
                      M6
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={PRIMARY_BLUE2}
                    >
                      2
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default FocusModelPerformanceIncentive;
