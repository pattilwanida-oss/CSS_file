import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import gameLogic from './gameLogic.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

gameLogic.setIo(io);

// A reconnected socket is no longer in its room; rejoin on any game action
const ensureRoom = (socket, game) => {
  if (game?.gameId) socket.join(game.gameId);
  return game;
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('syncTime', (callback) => {
    if (typeof callback === 'function') callback(Date.now());
  });

  socket.on('createGame', (lang, callback) => {
    const game = gameLogic.createGame(lang);
    socket.join(game.gameId);
    callback({ gameId: game.gameId, gamekey: game.gamekey });
    io.to(game.gameId).emit('gameState', game);
  });

  socket.on('addPlayer', ({ nickname, slug, gameId }, callback) => {
    const result = gameLogic.addPlayer(gameId, nickname, slug);
    if (result.error) {
      if (callback) callback({ error: result.error });
      return;
    }
    socket.join(gameId);
    io.to(gameId).emit('gameState', result.game);
    if (callback) callback({ player: result.player, game: result.game });
  });

  socket.on('loadGame', ({ gameId }) => {
    const game = gameLogic.getGameById(gameId);
    if (game) {
      socket.join(gameId);
      socket.emit('gameState', game);
    }
  });

  socket.on('startGame', ({ gamekey, playersObj, playersArr, detective, lang }) => {
    const game = gameLogic.startGame(gamekey, playersObj, playersArr, detective, lang);
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('setDetective', ({ gamekey, player }) => {
    const game = gameLogic.setDetective(gamekey, player);
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('setAnalysis', ({ gamekey, forensicAnalysis }) => {
    const game = ensureRoom(socket, gameLogic.setAnalysis(gamekey, forensicAnalysis));
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('setMurdererChoice', async ({ gamekey, choice }) => {
    let game = ensureRoom(socket, await gameLogic.setMurdererChoice(gamekey, choice));
    if (game) io.to(game.gameId).emit('gameState', game);

    if (game?.detective === -1) {
      game = await gameLogic.generateAiForensicAnalysis(gamekey);
      if (game) io.to(game.gameId).emit('gameState', game);
    }
  });

  socket.on('passTurn', async ({ gamekey, player }) => {
    const game = ensureRoom(socket, await gameLogic.passTurn(gamekey, player));
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('makeGuess', async ({ gamekey, player, guess }) => {
    const game = ensureRoom(socket, await gameLogic.makeGuess(gamekey, player, guess));
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('sendChatMessage', ({ gamekey, message }) => {
    const game = ensureRoom(socket, gameLogic.addChatMessage(gamekey, message));
    if (game) io.to(game.gameId).emit('gameState', game);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
