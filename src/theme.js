import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2962ff' }, // Deep Blue (Detective / Means)
    secondary: { main: '#0f172a' }, // Deep Navy (Surface)
    error: { main: '#ef4565' }, // Neon Pink (Murderer / Evidence)
    background: {
      default: 'transparent',
      paper: 'rgba(15, 23, 42, 0.85)', // Dark glassmorphism
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    }
  },
  typography: {
    fontFamily: '"IBM Plex Sans Thai", "IBM Plex Mono", monospace, sans-serif',
    h1: { fontFamily: '"Chakra Petch", sans-serif' },
    h2: { fontFamily: '"Chakra Petch", sans-serif' },
    h3: { fontFamily: '"Chakra Petch", sans-serif' },
    h4: { fontFamily: '"Chakra Petch", sans-serif' },
    h5: { fontFamily: '"Chakra Petch", sans-serif' },
    h6: { fontFamily: '"Chakra Petch", sans-serif' },
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
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }
      }
    }
  },
});

export default theme;
