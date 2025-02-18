import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DARK_PURPLE } from '../../../Common/colors';
import NuralLoginTextField from '../../NuralCustomComponents/NuralLoginTextField';
import NuralButton from '../../NuralCustomComponents/NuralButton';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // Add reset password logic here
    console.log('New password:', { newPassword, confirmPassword });
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
        Reset Password
      </Typography>

      <Box sx={{ marginBottom: '24px' }}>
        <NuralLoginTextField
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Box>

      <Box sx={{ marginBottom: '32px' }}>
        <NuralLoginTextField
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Box>

      <NuralButton
        onClick={handleSubmit}
        sx={{ width: '100%' }}
      >
        Update Password
      </NuralButton>
    </Box>
  );
};

export default ResetPasswordForm; 