import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#094067' },
    secondary: { main: '#3da9fc' },
    error: { main: '#ef4565' },
    background: {
      default: 'transparent',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Mono", monospace',
    h1: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
    h2: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
    h3: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
    h4: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
    h5: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
    h6: { fontFamily: '"kingthings_trypewriter_2Rg", serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bolder',
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
