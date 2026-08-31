import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin;
const socket = io(BACKEND_URL);

const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    socket.on('gameState', (newGameState) => {
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
          resolve(response);
        });
      });
    },

    loadGame: (gameId) => {
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
            setPlayer(response.player);
            navigate(`/game/${gameId}/player/${slug}`);
            resolve(null);
          }
        });
      });
    },

    loadPlayer: ({ game: gameId, player: playerSlug }) => {
      setPlayer((prev) => prev ? prev : { slug: playerSlug });
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
