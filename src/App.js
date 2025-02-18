import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import AllRoutes from './Components/Routes/AllRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AllRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App; 