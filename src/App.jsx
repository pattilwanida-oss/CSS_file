import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './views/Home';
import Join from './views/Join';
import Game from './views/Game';
import Player from './views/Player';
import './App.css';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`app-root ${isHome ? 'home-bg' : ''}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/game/:id/player/:slug" element={<Player />} />
      </Routes>
    </div>
  );
}

export default App;
