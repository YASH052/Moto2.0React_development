import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { PRIMARY_BLUE2 } from '../../Constants/Colors';

const Spinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "none",
        "& .MuiCircularProgress-root": {
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        }
      }}
    >
      <CircularProgress 
        size={20} 
        sx={{ 
          color: PRIMARY_BLUE2,
          filter: "none",
        }} 
      />
    </Box>
  );
};

export default Spinner;