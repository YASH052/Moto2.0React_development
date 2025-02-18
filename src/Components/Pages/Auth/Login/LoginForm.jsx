import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DARK_PURPLE } from '../../../Common/colors';
import NuralLoginTextField from '../../NuralCustomComponents/NuralLoginTextField';
import NuralButton from '../../NuralCustomComponents/NuralButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add login logic here
    console.log('Login attempt with:', { email, password });
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
        Login
      </Typography>

      <Box sx={{ marginBottom: '24px' }}>
        <NuralLoginTextField
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Box sx={{ marginBottom: '32px' }}>
        <NuralLoginTextField
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>

      <NuralButton
        onClick={handleLogin}
        sx={{ width: '100%' }}
      >
        Login
      </NuralButton>
    </Box>
  );
};

export default LoginForm; 