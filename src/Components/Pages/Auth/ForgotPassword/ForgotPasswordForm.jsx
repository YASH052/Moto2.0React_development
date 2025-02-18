import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DARK_PURPLE } from '../../../Common/colors';
import NuralLoginTextField from '../../NuralCustomComponents/NuralLoginTextField';
import NuralButton from '../../NuralCustomComponents/NuralButton';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Add forgot password logic here
    console.log('Reset password for:', email);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        padding: '40px 20px',
      }}
    >
      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: 600,
          color: DARK_PURPLE,
          marginBottom: '32px',
          textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        Forgot Password
      </Typography>

      <Box sx={{ marginBottom: '32px' }}>
        <NuralLoginTextField
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <NuralButton
        onClick={handleSubmit}
        sx={{ width: '100%' }}
      >
        Reset Password
      </NuralButton>
    </Box>
  );
};

export default ForgotPasswordForm; 