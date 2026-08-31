import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useGame } from '@/store/GameContext';

import Lobby from '@/components/Lobby';
import WaitingForCrime from '@/components/WaitingForCrime';
import ChatBox from '@/components/ChatBox';
import GameHeader from '@/components/GameHeader';
import GamePlayLayout from '@/components/GamePlayLayout';
import MurdererChoice from '@/components/MurdererChoice';
import GameSummary from '@/components/GameSummary';
import IntroVideo from '@/components/IntroVideo';
import murdererBg from '@/assets/murderer_choice.webp';
import showcaseBg from '@/assets/card_showcase.webp';

export default function Game() {
  const { game, player, actions } = useGame();
  const params = useParams();

  // Load game on mount
  useEffect(() => {
    actions.loadGame(params.id);
  }, [params.id]);

  const [showIntroVideo, setShowIntroVideo] = useState(false);

  // Check if we should play the intro video when the game starts
  useEffect(() => {
    if (game && game.started && !game.finished) {
      const videoKey = `intro_played_${game.gameId}`;
      if (!sessionStorage.getItem(videoKey)) {
        setShowIntroVideo(true);
        sessionStorage.setItem(videoKey, 'true');
      }
    }
  }, [game?.started, game?.gameId, game?.finished]);

  // If host player info is in localStorage but not in context, restore it
  useEffect(() => {
    if (game && !player) {
      const stored = localStorage.getItem('hostPlayer_' + game.gameId);
      if (stored) {
        const { slug } = JSON.parse(stored);
        actions.loadPlayer({ game: game.gameId, player: slug });
      }
    }
  }, [game, player]);

  if (!game) return null;

  if (!game.started) {
    return <Lobby />;
  }

  if (showIntroVideo) {
    return <IntroVideo onComplete={() => setShowIntroVideo(false)} />;
  }

  // Host is a player - check if we have their data
  const hostPlayer = player;
  const isNightPhase = !game.murdererChoice;
  const isMurderer = hostPlayer && hostPlayer.index === game.murderer;

  if (hostPlayer && isNightPhase) {
    if (!isMurderer) {
      return <WaitingForCrime game={game} player={hostPlayer} />;
    } else {
      return (
        <Box sx={{ 
          width: '100%', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          p: { xs: 2, md: 4 }, 
          pt: { xs: 6, md: 10 }
        }}>
          <Box sx={{ maxWidth: '900px', mx: 'auto', width: '100%' }}>
            <MurdererChoice game={game} player={hostPlayer} />
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {!game.finished && <GameHeader />}
      
      {game.finished ? (
        <GameSummary game={game} />
      ) : (
        <GamePlayLayout isHost={true} currentPlayer={hostPlayer} />
      )}
      
      <ChatBox />
    </Box>
  );
}
