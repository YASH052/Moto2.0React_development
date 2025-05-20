import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Select, MenuItem, Grid, Button } from "@mui/material";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  DARK_PURPLE,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralAutocomplete from "../NuralAutocomplete";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatNumber = (num) => {
    if (num == null) return ''; // Handle null or undefined input
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString(); // Ensure it returns a string
};

const ChannelProductSalesCharts = ({focusModelGroupDropdownList, focusModelGraphQuantityList, focusModelGraphValueList, focusModelMTDQuantityList, focusModelMTDValueList, setValue}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dataType, setDataType] = useState("QTY"); // Keep state for QTY/VAL

  // Keep handler
  const handleFocusModelGroupChange = (event, newValue) => {
    setValue(newValue?.modelID || 0);
    setSelectedProduct(newValue);
  };

  // Keep dynamic data selection
  const graphData = useMemo(() => (
    dataType === 'QTY' ? focusModelGraphQuantityList : focusModelGraphValueList
  ) || [], [dataType, focusModelGraphQuantityList, focusModelGraphValueList]);

  const mtdData = useMemo(() => (
    (dataType === 'QTY' ? focusModelMTDQuantityList : focusModelMTDValueList)?.[0]
  ) || {}, [dataType, focusModelMTDQuantityList, focusModelMTDValueList]);

  // Keep index calculation
  const selectedProductIndex = useMemo(() => {
    if (!selectedProduct || !graphData) return -1;
    return graphData.findIndex(item => item.model === selectedProduct.modelName);
  }, [selectedProduct, graphData]);

  // Keep dynamic chart data generation
  const chartData = useMemo(() => {
    // Always process graphData
    const labels = graphData.map(item => item.model);
    const activationData = graphData.map(item => item.activation);
    const lmtdData = graphData.map(item => item.lmtd);

    // Check if graphData itself was empty or invalid
    if (!labels.length || !activationData.length || !lmtdData.length) {
        return { labels: [], datasets: [] };
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'LMTD',
          data: lmtdData,
          backgroundColor: (context) => {
            const index = context.dataIndex;
            return index === selectedProductIndex ? '#00CED1' : '#DFDDDE';
          },
          barPercentage: 0.6,
          categoryPercentage: 0.8,
          borderRadius: 4,
        },
        {
          label: 'Activation',
          data: activationData,
          backgroundColor: (context) => {
            const index = context.dataIndex;
            return index === selectedProductIndex ? '#80E6E6' : '#E8E8E8';
          },
          barPercentage: 0.6,
          categoryPercentage: 0.8,
          borderRadius: 4,
        }
      ],
    };
  }, [graphData, selectedProductIndex]);


  // Keep dynamic chart options generation
  const chartOptions = useMemo(() => {
    const allData = [
      ...(chartData.datasets[0]?.data || []),
      ...(chartData.datasets[1]?.data || []),
    ].filter(val => val != null); // Filter out null/undefined before calculating max

    const maxDataValue = allData.length > 0 ? Math.max(...allData) : 0;
     // Adjust default yAxisMax based on dataType if data is empty
    const defaultMax = dataType === 'QTY' ? 80000 : 100000000; // Use original default max for QTY if empty
    const yAxisMax = maxDataValue > 0 ? maxDataValue * 1.2 : defaultMax; // Keep dynamic max calculation with padding


    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            // Original X grid settings
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
              size: 10, // Original font size
            },
            color: PRIMARY_BLUE2,
            // Remove autoSkip and rotation to revert to default behavior
             // autoSkip: true,
             // maxRotation: 0,
             // minRotation: 0,
          },
          border: { // Original X border
            display: true,
            color: PRIMARY_BLUE2
          }
        },
        y: {
          beginAtZero: true,
          max: yAxisMax, // Keep dynamic max based on data
          ticks: {
            // Conditionally set stepSize based on dataType
            stepSize: dataType === 'QTY' ? 20000 : undefined, // Original stepSize for QTY, dynamic for VAL
            font: {
              family: "Manrope",
              size: 10, // Original font size
            },
            callback: function (value) {
              return formatNumber(value); // Keep improved formatter for K/M
            },
            color: PRIMARY_BLUE2,
          },
          grid: { // Original Y grid settings
            color: "#E0E0E0",
            drawBorder: false,
            borderDash: [3, 3],
          },
          border: { // Original Y border
            display: true,
            color: PRIMARY_BLUE2
          }
        },
      },
      plugins: { // Keep plugins as they were in the previous step
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
          backgroundColor: 'white',
          titleColor: '#666666',
          bodyColor: DARK_PURPLE,
          borderColor: '#E0E0E0',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          bodyFont: {
            size: 10,
            family: 'Manrope'
          },
          bodySpacing: 4,
          callbacks: {
             label: (context) => {
                const label = context.dataset.label || '';
                const value = typeof context.parsed?.y === 'number' ? context.parsed.y : 0;
                return `${label}: ${formatNumber(value)}`;
             },
          },
        },
      },
      interaction: { // Keep interaction settings
        intersect: false,
        mode: 'index',
      },
      onClick: (event, elements) => { // Keep onClick logic
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          if (chartData.labels && chartData.labels[index]) {
             const clickedModelName = chartData.labels[index];
             const clickedModel = focusModelGroupDropdownList?.find(m => m.modelName === clickedModelName);
             if (clickedModel) {
                handleFocusModelGroupChange(null, clickedModel);
             }
          }
        }
      },
    };
  }, [chartData, dataType, selectedProductIndex, focusModelGroupDropdownList, handleFocusModelGroupChange]); // Keep dependencies

  // Keep dynamic MTD data generation
  const mtdDisplayData = useMemo(() => {
    const dataMap = [
      { key: 'lmtd', name: 'LMTD' },
      { key: 'activation', name: 'ACTIVATION' },
      { key: 'drr', name: 'DRR' },
      { key: 'm_1', name: 'M-1' },
      { key: 'm_2', name: 'M-2' },
      { key: 'm_3', name: 'M-3' },
      { key: 'm_4', name: 'M-4' },
      { key: 'm_5', name: 'M-5' },
      // Add other potential keys if needed based on focusModelMTDQuantityList/ValueList structure
    ];

    // Map data only if mtdData is not empty
    if (mtdData && Object.keys(mtdData).length > 0) {
        return dataMap
        .filter(item => mtdData.hasOwnProperty(item.key) && mtdData[item.key] != null) // Also check for null value
        .map((item, index) => ({
            id: index + 1, // Use index as key might not be unique if filtering changes order
            name: item.name,
            value: formatNumber(mtdData[item.key]), // Keep formatter
        }));
    }
    return []; // Return empty array if no mtdData

  }, [mtdData]);

  return (
    <Grid
      container
      spacing={2} // Reverted spacing
      mt={2} // Reverted margin
      ml={0} // Reverted margin
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: 2,
        // Removed padding p: 1
      }}
    >
      <Grid item xs={12} md={12} lg={12} xl={12} p={0}> {/* Reverted padding */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: 10, // Kept original size
            lineHeight: "100%",
            letterSpacing: "0%", // Kept original spacing
            color: PRIMARY_BLUE2,
             // Removed mb: 1
          }}
        >
          Product Sales
        </Typography>
      </Grid>

       {/* Reverted structure and layout */}
      <Grid item xs={12} md={12} lg={12} xl={12} p={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={12} lg={12} xl={12}>
              {/* This empty Grid item was in the original, keeping it */}
          </Grid>
          <Grid item xs={12} md={9.5} lg={9.5} xl={9.5}> {/* Reverted grid size */}
            <NuralAutocomplete
                 options={focusModelGroupDropdownList || []}
                 placeholder="Select Product (Optional Filter)" // Adjusted placeholder
                 width="100%"
                 backgroundColor={LIGHT_GRAY2}
                 getOptionLabel={(option) => option?.modelName || ""}
                 isOptionEqualToValue={(option, value) =>
                   option?.modelID === value?.modelID
                 }
                 onChange={handleFocusModelGroupChange}
                 value={selectedProduct}
            />
          </Grid>
          <Grid item xs={12} md={2.5} lg={2.5} xl={2.5} pr={2}> {/* Reverted grid size */}
            <Box sx={{ display: "flex", gap: 1 }}> {/* Kept gap */}
              <Button
                variant={dataType === 'QTY' ? "contained" : "outlined"} // Keep dynamic variant
                size="small" // Keep size
                onClick={() => setDataType('QTY')} // Keep onClick
                sx={{
                  // Keep dynamic styles for active state indication
                  backgroundColor: dataType === 'QTY' ? DARK_PURPLE : LIGHT_GRAY2,
                  color: dataType === 'QTY' ? 'white' : DARK_PURPLE,
                  fontSize: "8px",
                  fontWeight: 700,
                  borderRadius: "40px",
                  padding: "4px 12px", // Reverted padding
                  minWidth: "unset", // Reverted minWidth
                  border: dataType === 'QTY' ? 'none' : `1px solid ${DARK_PURPLE}`, // Dynamic border
                  "&:hover": {
                    // Keep hover, adjust if needed based on original
                    backgroundColor: dataType === 'QTY' ? "#2F3BC9" : "#E0E0FF", // Use appropriate hover colors
                     border: dataType === 'QTY' ? 'none' : `1px solid ${DARK_PURPLE}`, // Ensure border persists on hover for outlined
                  },
                }}
              >
                QTY
              </Button>
              <Button
                size="small" // Keep size
                variant={dataType === 'VAL' ? "contained" : "outlined"} // Keep dynamic variant
                onClick={() => setDataType('VAL')} // Keep onClick
                sx={{
                  // Keep dynamic styles for active state indication
                  backgroundColor: dataType === 'VAL' ? DARK_PURPLE : LIGHT_GRAY2,
                  color: dataType === 'VAL' ? 'white' : DARK_PURPLE, // Keep dynamic color
                  fontSize: "8px",
                  fontWeight: 700,
                  borderRadius: "40px",
                  padding: "4px 12px", // Reverted padding
                  minWidth: "unset", // Reverted minWidth
                  border: dataType === 'VAL' ? 'none' : `1px solid ${DARK_PURPLE}`, // Dynamic border
                  "&:hover": {
                     // Keep hover, adjust if needed based on original
                     backgroundColor: dataType === 'VAL' ? "#2F3BC9" : "#E0E0FF", // Use appropriate hover colors
                     border: dataType === 'VAL' ? 'none' : `1px solid ${DARK_PURPLE}`, // Ensure border persists on hover for outlined
                  },
                }}
              >
                VAL
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12} xl={12} p={2}> {/* Reverted padding */}
            <Box sx={{
              height: 165, // Reverted height
              width: '100%',
               // Removed mt: 1
              // Re-add original border styles if they were here
               '& canvas': {
                 borderLeft: '1px solid #E0E0E0',
                 borderRight: '1px solid #E0E0E0',
               }
            }}>
               {/* Remove the !selectedProduct check */}
               {/* Always attempt to render based on chartData content */}
               {chartData.labels && chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
                 <Bar options={chartOptions} data={chartData} />
               ) : (
                 // Show this only if graphData was actually empty/invalid
                 <Typography sx={{textAlign: 'center', mt: 5, color: PRIMARY_BLUE2}}>No data available for chart.</Typography>
               )}
            </Box>
          </Grid>
        </Grid>

         {/* Reverted MTD Section Layout */}
        <Grid
          container
          sx={{
            p: 2, // Reverted padding
            mt: 1, // Reverted margin
            backgroundColor: MEDIUM_BLUE,
            borderRadius: 2,
            justifyContent: "center", // Reverted justification
            height: "150px", // Reverted fixed height
          }}
        >
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: "10px", // Reverted size
                lineHeight: "100%", // Reverted line height
                letterSpacing: "0%", // Reverted spacing
                color: DARK_PURPLE,
                textAlign: "start",
                // Removed mb: 1
              }}
            >
               {/* Title remains OVERALL initially */}
               {selectedProduct ? selectedProduct.modelName : 'OVERALL'} SUMMARY ({dataType})
            </Typography>
          </Grid>
          {/* Keep conditional rendering */}
          {mtdDisplayData.length > 0 ? (
            <Grid item xs={12} md={10} lg={10} xl={10}> {/* Reverted grid size */}
              <Grid
                container
                spacing={0} // Keep spacing 0 for dividers
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap', // Keep flexWrap
                  justifyContent: 'center', // Reverted justification
                  alignItems: 'center', // Reverted alignment
                  mt: 1 // Reverted margin
                }}
              >
                {mtdDisplayData.map((item, index) => (
                  <Grid
                    item
                    xs={12/7} // Original dynamic width attempt
                    md={3}     // Original fallback md width
                    key={item.id}
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      '&::after': index < mtdDisplayData.length - 1 ? {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '15%',
                        height: '70%',
                        width: '1px',
                        backgroundColor: PRIMARY_BLUE2
                      } : {},
                      // Removed p: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1, // Reverted padding
                        // Removed height: '100%'
                      }}
                    >
                      <Typography
                        sx={{
                          color: DARK_PURPLE,
                          fontSize: "8px", // Reverted size
                          fontWeight: 500,
                          mb: 0.5,
                          textTransform: 'uppercase', // Keep uppercase
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: DARK_PURPLE,
                          fontSize: "14px", // Reverted size
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
          ) : (
             // Keep No data message styling
             <Grid item xs={12} sx={{textAlign: 'center', alignSelf: 'center' }}> {/* Center vertically */}
                 <Typography sx={{color: DARK_PURPLE, fontSize: '10px'}}>
                     No MTD data available.
                 </Typography>
             </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChannelProductSalesCharts;
