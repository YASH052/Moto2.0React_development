import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Manrope, sans-serif',
    allVariants: {
      fontFamily: 'Manrope',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '*': {
            fontFamily: 'Manrope, sans-serif',
          },
        },
      },
    },
  },
});

export default theme; 