// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Box, Button, Card, Grid, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import NuralAutocomplete from "../NuralAutocomplete";
// import { AQUA, DARK_PURPLE, LIGHT_GRAY2, MEDIUM_BLUE, PRIMARY_BLUE2, WHITE } from "../../../Common/colors";

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const StyledCard = styled(Card)(({ theme }) => ({
//   padding: theme.spacing(2),
//   height: "92%",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   position: "relative",
//   backgroundColor: LIGHT_GRAY2,
//   borderRadius: "8px",
// }));

// const CenterText = styled("div")({
//   position: "absolute",
//   top: "50%",
//   left: "45%",
//   transform: "translate(-50%, -50%)",
//   textAlign: "center",
//   "& h2": {
//     margin: 0,
//     fontSize: "24px",
//     fontWeight: "bold",
//     color: DARK_PURPLE,
//   },
//   "& p": {
//     margin: 0,
//     fontSize: "12px",
//     color: DARK_PURPLE,
//     opacity: 0.7,
//   },
// });

// const DistributorInventoryChart = () => {
//   const distributors = ["DIST. 1", "DIST. 2", "DIST. 3", "DIST. 4", "DIST. 5"];
//   const [selectedDistributor, setSelectedDistributor] = React.useState(
//     distributors[0]
//   );

//   const data = {
//     labels: ["DIST. 1", "DIST. 2", "DIST. 3", "DIST. 4", "DIST. 5", "DIST. 6", "DIST. 7", "DIST. 8", "DIST. 9", "DIST. 10"],
//     datasets: [
//       {
//         data: [35, 25, 15, 15, 10, 10, 10, 10, 10, 10],
//         backgroundColor: [PRIMARY_BLUE2, DARK_PURPLE, MEDIUM_BLUE, PRIMARY_BLUE2],
//         borderWidth: 0,
//         cutout: "75%",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "right",
//         align: "center",
//         labels: {
//           boxWidth: 6,
//           boxHeight: 6,
//           padding: 12,
//           font: {
//             size: 8,
//             family: "Manrope",
//           },
//           color: DARK_PURPLE,
//           usePointStyle: true,
//           pointStyle: 'circle',
//           textAlign: 'left'
//         },
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: WHITE,
//         titleColor: DARK_PURPLE,
//         bodyColor: DARK_PURPLE,
//         padding: 10,
//         displayColors: false,
//         callbacks: {
//           label: function (context) {
//             return `${context.parsed}%`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <StyledCard>
//       <Typography
//         variant="h6"
//         sx={{
//           fontWeight: 700,
//           color: DARK_PURPLE,
//           fontFamily: "Manrope",
//           fontSize: "10px",
//           lineHeight: "13.66px",
//           letterSpacing: "0%",
//           alignSelf: "flex-start",
//           mb: 2,
//         }}
//       >
//         Distributor Inventory
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={10} lg={12} xl={12}>
//           <Grid
//             container
//             spacing={2}
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               mb: 2,
//               alignItems: "center",
//             }}
//           >
//             <Grid item xs={12} md={8} lg={8} xl={8}>
//               <NuralAutocomplete
//                 options={distributors}
//                 placeholder={selectedDistributor}
//                 width="100%"
//                 backgroundColor={LIGHT_GRAY2}
//                 onChange={(value) => setSelectedDistributor(value)}
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
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sx={{ position: "relative", height: "300px", color: AQUA ,
//             marginTop: "40px",
//           }}
//         >
//           <Doughnut data={data} options={options}/>
//           <CenterText>
//             <h2 style={{ color: AQUA }}>103.72K</h2>
//             <p>4 WEEKS</p>
//           </CenterText>
//         </Grid>
//       </Grid>
//     </StyledCard>
//   );
// };

// export default DistributorInventoryChart;

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NuralAutocomplete from "../NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  WHITE,
} from "../../../Common/colors";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "92%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  backgroundColor: LIGHT_GRAY2,
  borderRadius: "8px",
}));

const CenterText = styled("div")({
  position: "absolute",
  top: "50%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  "& h2": {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: DARK_PURPLE,
  },
  "& p": {
    margin: 0,
    fontSize: "12px",
    color: DARK_PURPLE,
    opacity: 0.7,
  },
});

const DistributorInventoryChart = ({ button }) => {
  const distributors = ["ONLINE", "OFFLINE"];
  const [selectedDistributor, setSelectedDistributor] = React.useState(
    distributors[0]
  );

  const data = {
    labels: ["ONLINE", "OFFLINE"],
    datasets: [
      {
        data: [35, 25],
        backgroundColor: [PRIMARY_BLUE2, AQUA],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          display: false,
          boxWidth: 8,
          boxHeight: 8,
          padding: 15,
          font: {
            size: 8,
            family: "Manrope",
          },
          color: DARK_PURPLE,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: WHITE,
        titleColor: DARK_PURPLE,
        bodyColor: DARK_PURPLE,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <StyledCard>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: DARK_PURPLE,
          fontFamily: "Manrope",
          fontSize: "10px",
          lineHeight: "13.66px",
          letterSpacing: "0%",
          alignSelf: "flex-start",
          mb: 2,
        }}
      >
        Distributor Inventory
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={10} lg={12} xl={12}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={button ? 8 : 12}
              lg={button ? 8 : 12}
              xl={button ? 8 : 12}
            >
              <NuralAutocomplete
                options={distributors}
                placeholder={selectedDistributor}
                width="100%"
                backgroundColor={LIGHT_GRAY2}
                onChange={(value) => setSelectedDistributor(value)}
              />
            </Grid>
            {button && (
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
            )}
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            position: "relative",
          }}
        >
          {/* Chart and legend side by side */}
          <Box display="flex" alignItems="center">
            <Box position="relative" height="350px" width="350px">
              <Doughnut data={data} options={options} />
              <CenterText>
                <h2 style={{ color: AQUA }}>103.72K</h2>
                <p>4 WEEKS</p>
              </CenterText>
            </Box>

            {/* Custom Legend */}
          </Box>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default DistributorInventoryChart;
