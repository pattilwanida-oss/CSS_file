import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6', light: '#60a5fa', dark: '#1d4ed8' }, // Deep Blue (Detective / Means)
    secondary: { main: '#0f172a' }, // Deep Navy (Surface)
    error: { main: '#ef4565', light: '#f87171', dark: '#dc2626' }, // Crimson (Murderer / Evidence)
    background: {
      default: 'transparent',
      paper: 'rgba(10, 15, 30, 0.75)', // Darker glassmorphism
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
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
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: '10px',
          letterSpacing: '0.02em',
          transition: 'all 250ms cubic-bezier(0.25, 1, 0.5, 1)',
        },
        containedError: {
          boxShadow: '0 4px 14px 0 rgba(239, 69, 101, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(239, 69, 101, 0.5)',
            transform: 'translateY(-2px)',
          }
        },
        containedPrimary: {
          boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
            transform: 'translateY(-2px)',
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          backgroundImage: 'none',
          transition: 'border-color 250ms ease, transform 250ms ease, box-shadow 250ms ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(10, 15, 30, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          backgroundImage: 'none',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 15, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          '&:before': {
            display: 'none', // Remove default divider line
          },
          '&.Mui-expanded': {
            margin: '0 0 16px 0',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(0,0,0,0.25)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)',
            '&:before, &:after': {
              display: 'none', // Remove bottom line
            },
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.35)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid #3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            }
          }
        }
      }
    }
  },
});

export default theme;
