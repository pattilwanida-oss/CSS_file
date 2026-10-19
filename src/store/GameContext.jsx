import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin;
const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });

// Offset between the server clock and this device's clock, so countdowns match on every device
let serverOffset = 0;
const offsetSamples = [];

export function getServerNow() {
  return Date.now() + serverOffset;
}

function syncClock() {
  if (!socket.connected) return;
  const sentAt = Date.now();
  socket.emit('syncTime', (serverTime) => {
    const rtt = Date.now() - sentAt;
    offsetSamples.push({ rtt, offset: serverTime + rtt / 2 - Date.now() });
    if (offsetSamples.length > 3) offsetSamples.shift();
    // The sample with the lowest round trip is the most accurate
    serverOffset = offsetSamples.reduce((best, s) => (s.rtt < best.rtt ? s : best)).offset;
  });
}

const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const gameIdRef = useRef(null);
  const finishedRef = useRef(false);

  // Rejoin the room after a reconnect or when the tab/app returns to the foreground
  useEffect(() => {
    const resync = () => {
      if (gameIdRef.current && socket.connected) {
        socket.emit('loadGame', { gameId: gameIdRef.current });
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        resync();
        syncClock();
      }
    };
    const onConnect = () => {
      resync();
      syncClock();
    };
    if (socket.connected) syncClock();
    const clockTimer = setInterval(syncClock, 30000);
    socket.on('connect', onConnect);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', resync);
    // Safety net: if a broadcast is missed, catch up on the latest state
    const poll = setInterval(() => {
      if (!finishedRef.current) resync();
    }, 2000);
    return () => {
      clearInterval(poll);
      clearInterval(clockTimer);
      socket.off('connect', onConnect);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', resync);
    };
  }, []);

  useEffect(() => {
    socket.on('gameState', (newGameState) => {
      finishedRef.current = !!newGameState.finished;
      setGame(newGameState);
      if (player) {
        const updatedPlayer = Object.values(newGameState.players || {}).find(p => p.slug === player.slug);
        if (updatedPlayer) {
          setPlayer(updatedPlayer);
        }
      }
    });

    return () => {
      socket.off('gameState');
    };
  }, [player]);

  const actions = useCallback(() => ({
    createGame: (lang) => {
      return new Promise((resolve) => {
        socket.emit('createGame', lang, (response) => {
          if (response?.gameId) gameIdRef.current = response.gameId;
          resolve(response);
        });
      });
    },

    loadGame: (gameId) => {
      gameIdRef.current = gameId;
      socket.emit('loadGame', { gameId });
    },

    startGame: ({ gamekey, playersObj, players, detective, lang }) => {
      socket.emit('startGame', { gamekey, playersObj, playersArr: players, detective, lang });
    },

    setDetective: ({ gamekey, player }) => {
      socket.emit('setDetective', { gamekey, player });
    },

    setAnalysis: ({ gamekey, analysis: forensicAnalysis }) => {
      socket.emit('setAnalysis', { gamekey, forensicAnalysis });
    },

    setMurdererChoice: ({ gamekey, choice }) => {
      socket.emit('setMurdererChoice', { gamekey, choice });
    },

    passTurn: ({ gamekey, player }) => {
      socket.emit('passTurn', { gamekey, player });
    },

    makeGuess: ({ gamekey, player, guess }) => {
      socket.emit('makeGuess', { gamekey, player, guess });
    },

    sendChatMessage: ({ gamekey, player, text }) => {
      socket.emit('sendChatMessage', { 
        gamekey, 
        message: { 
          sender: player.name, 
          text, 
          timestamp: Date.now() 
        } 
      });
    },

    addPlayer: ({ nickname, slug, gameId, navigate }) => {
      return new Promise((resolve) => {
        socket.emit('addPlayer', { nickname, slug, gameId }, (response) => {
          if (response.error) {
            resolve(response.error);
          } else {
            gameIdRef.current = gameId;
            setPlayer(response.player);
            navigate(`/game/${gameId}/player/${slug}`);
            resolve(null);
          }
        });
      });
    },

    loadPlayer: ({ game: gameId, player: playerSlug }) => {
      setPlayer((prev) => prev ? prev : { slug: playerSlug });
      gameIdRef.current = gameId;
      socket.emit('loadGame', { gameId });
    },

    addPlayerDirect: ({ nickname, slug, gameId }) => {
      return new Promise((resolve) => {
        socket.emit('addPlayer', { nickname, slug, gameId }, (response) => {
          if (response.error) {
            resolve(response.error);
          } else {
            setPlayer(response.player);
            resolve(null);
          }
        });
      });
    },
  }), []);

  const actionsValue = actions();

  return (
    <GameContext.Provider
      value={{ game, player, actions: actionsValue }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
