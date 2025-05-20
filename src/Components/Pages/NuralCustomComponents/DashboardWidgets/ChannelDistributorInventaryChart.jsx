import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NuralAutocomplete from "../NuralAutocomplete";
import { AQUA, BLUE_COLOR, DARK_PURPLE, LIGHT_GRAY2, MEDIUM_BLUE, PRIMARY_BLUE, PRIMARY_BLUE2, WHITE } from "../../../Common/colors";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "88%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  backgroundColor: LIGHT_GRAY2,
  borderRadius: "8px",
  boxShadow:"none",
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

// Helper function to format large numbers
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num;
};

const ChannelDistributorInventaryChart = ({inventoryDistributorDropdownList, distributorInventaryValueList, distributorInventaryQuantityList, distributorInventaryWOIValueList, distributorInventaryWOIQuantityList, setValue}) => {

  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [dataType, setDataType] = useState('qty');

  // Process data based on selected dataType
  // Keep original full names for tooltips
  const originalChartLabels = (dataType === 'qty' ? distributorInventaryQuantityList : distributorInventaryValueList)?.map(item => item.disName) || [];
  // Create labels for the legend (first word only)
  const legendChartLabels = originalChartLabels.map(label => label ? label.split(' ')[0] : '');
  const chartDataValues = (dataType === 'qty' ? distributorInventaryQuantityList : distributorInventaryValueList)?.map(item => dataType === 'qty' ? item.qty : item.sale) || [];

  const woiData = dataType === 'qty' ? distributorInventaryWOIQuantityList?.[0] : distributorInventaryWOIValueList?.[0];
  const centerValue = formatNumber(woiData?.[dataType === 'qty' ? 'qty' : 'sale'] || 0);
  const centerWoi = woiData?.woi || 0;

  const data = {
    // Use the shortened labels for the legend display
    labels: legendChartLabels.slice(0, 10),
    datasets: [
      {
        data: chartDataValues.slice(0, 10),
        backgroundColor: [PRIMARY_BLUE2, DARK_PURPLE, MEDIUM_BLUE, PRIMARY_BLUE, '#ADD8E6', '#ff33d7', '#FFA07A', '#20B2AA', '#87CEFA', '#778899'],
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
          boxWidth: 6,
          boxHeight: 6,
          padding: 12,
          font: {
            size: 8,
            family: "Manrope",
          },
          color: DARK_PURPLE,
          usePointStyle: true,
          pointStyle: 'circle',
          textAlign: 'left',
          filter: function(legendItem, chartData) {
            // Ensure filtering still works with potentially duplicate first names
            // We check if the corresponding data value exists
            return chartData.datasets[0].data[legendItem.index] !== undefined && chartData.datasets[0].data[legendItem.index] !== null;
          },
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
            const rawValue = context.raw;
            // Use the original full label for the tooltip from the originalChartLabels array
            const originalLabel = originalChartLabels[context.dataIndex];
            return `${originalLabel}: ${formatNumber(rawValue)}`;
          },
        },
      },
    },
  };

  const handleDistributorChange = (event, newValue) => {
    setValue(newValue?.disInvID || 0);
    setSelectedDistributor(newValue);
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
        <Grid item xs={12} md={11} lg={11} xl={11}>
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
            <Grid item xs={12} md={8} lg={8} xl={8}>
              <NuralAutocomplete
                options={inventoryDistributorDropdownList || []}
                placeholder="Select Distributor"
                width="100%"
                backgroundColor={LIGHT_GRAY2}
                getOptionLabel={(option) => option?.disInvName || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.disInvID === value?.disInvID
                }
                onChange={handleDistributorChange}
                value={selectedDistributor}
           />
            </Grid>
            <Grid item xs={12} md={3} lg={3} xl={3} pr={0}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant={dataType === 'qty' ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setDataType('qty')}
                  sx={{
                    backgroundColor: dataType === 'qty' ? DARK_PURPLE : LIGHT_GRAY2,
                    color: dataType === 'qty' ? WHITE : DARK_PURPLE,
                    fontSize: "8px",
                    fontWeight: 700,
                    borderRadius: "40px",
                    padding: "4px 12px",
                    minWidth: "unset",
                    border: dataType === 'qty' ? 'none' : `1px solid ${DARK_PURPLE}`,
                    "&:hover": {
                      backgroundColor: dataType === 'qty' ? "#2F3BC9" : '#e0e0e0',
                       border: dataType === 'qty' ? 'none' : `1px solid ${DARK_PURPLE}`,
                    },
                  }}
                >
                  QTY
                </Button>
                <Button
                   variant={dataType === 'val' ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setDataType('val')}
                  sx={{
                    backgroundColor: dataType === 'val' ? DARK_PURPLE : LIGHT_GRAY2,
                    color: dataType === 'val' ? WHITE : DARK_PURPLE,
                    fontSize: "8px",
                    fontWeight: 700,
                    borderRadius: "40px",
                    padding: "4px 12px",
                    minWidth: "unset",
                    border: dataType === 'val' ? 'none' : `1px solid ${DARK_PURPLE}`,
                    "&:hover": {
                      backgroundColor: dataType === 'val' ? "#2F3BC9" : '#e0e0e0',
                       border: dataType === 'val' ? 'none' : `1px solid ${DARK_PURPLE}`,
                    },
                  }}
                >
                  VAL
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ position: "relative", height: "300px" }}
        >
           {chartDataValues.length > 0 ? (
            <>
              <Doughnut data={data} options={options} />
              <CenterText>
                <h2 style={{ color: DARK_PURPLE }}>{centerValue}</h2>
                <p>{centerWoi} WEEKS</p>
              </CenterText>
            </>
          ) : (
            <Typography sx={{ textAlign: 'center', color: DARK_PURPLE, mt: 4 }}>
              No data available for the selected type.
            </Typography>
          )}
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default ChannelDistributorInventaryChart;