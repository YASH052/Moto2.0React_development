import React, { useState } from 'react';
import { Box, Button, Typography, ButtonGroup } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sampleData = [
  { period: 'P1', value: 35000 },
  { period: 'P2', value: 58000 },
  { period: 'P3', value: 48000 },
  { period: 'P4', value: 35000 },
  { period: 'P5', value: 45000 },
  { period: 'P6', value: 48000 },
  { period: 'P7', value: 45000 },
  { period: 'P8', value: 42000 },
  { period: 'P9', value: 40000 },
  { period: 'P10', value: 38000 },
];

const metricsData = {
  M1: { value: '121K' },
  M2: { value: '111K' },
  M3: { value: '130K' },
  M4: { value: '120K' },
  M5: { value: '135K' },
  tertiary: { value: '151K' },
  lmtd: { value: '169K' },
  activation: { value: '150K' },
  dpr: { value: '15K' },
};

const ProductSalesChart = () => {
  const [viewMode, setViewMode] = useState('top');
  const [selectedProduct, setSelectedProduct] = useState('PRODUCT 4');

  const handleTooltip = (data) => {
    if (data.active && data.payload && data.payload.length) {
      const { period, value } = data.payload[0].payload;
      if (period === 'P4') {
        return (
          <Box
            sx={{
              backgroundColor: '#00E5CC',
              p: 1,
              borderRadius: 1,
              color: 'white',
            }}
          >
            <Typography variant="caption">TERTIARY 25</Typography>
            <br />
            <Typography variant="caption">LMTD 40</Typography>
            <br />
            <Typography variant="caption">ACTIVATION 40</Typography>
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#F8F9FE', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            {selectedProduct}
          </Typography>
        </Box>
        <ButtonGroup>
          <Button
            variant={viewMode === 'top' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('top')}
            sx={{
              backgroundColor: viewMode === 'top' ? '#3B3E99' : 'transparent',
              color: viewMode === 'top' ? 'white' : '#3B3E99',
              '&:hover': {
                backgroundColor: viewMode === 'top' ? '#3B3E99' : 'transparent',
              },
            }}
          >
            TOP 10
          </Button>
          <Button
            variant={viewMode === 'bottom' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('bottom')}
            sx={{
              backgroundColor: viewMode === 'bottom' ? '#3B3E99' : 'transparent',
              color: viewMode === 'bottom' ? 'white' : '#3B3E99',
              '&:hover': {
                backgroundColor: viewMode === 'bottom' ? '#3B3E99' : 'transparent',
              },
            }}
          >
            BOTTOM 10
          </Button>
        </ButtonGroup>
      </Box>

      <BarChart width={800} height={300} data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip content={handleTooltip} />
        <Bar
          dataKey="value"
          fill={(entry) => (entry.period === 'P4' ? '#00E5CC' : '#E6E8F0')}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>

      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#F1F2F9',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {Object.entries(metricsData).map(([key, { value }], index) => (
          <Box key={key} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#3B3E99', display: 'block' }}>
              {key.toUpperCase()}
            </Typography>
            <Typography variant="h6" sx={{ color: '#3B3E99' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductSalesChart; 