import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Join from './views/Join';
import Game from './views/Game';
import Player from './views/Player';
import './App.css';

function App() {
  return (
    <div className="app-root">
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
