import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { GameProvider } from './store/GameContext';
import theme from './theme';
import './styles/variables.css';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GameProvider>
          <App />
        </GameProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
