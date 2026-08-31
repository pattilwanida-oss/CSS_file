import React, { useEffect, useRef, useState } from 'react';
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

export default function Player() {
  const { game, player, actions } = useGame();
  const params = useParams();
  const prevGameRef = useRef(null);

  // Initial mount: load player and set language
  useEffect(() => {
    const init = async () => {
      await actions.loadPlayer({
        game: params.id,
        player: params.slug,
      });
    };
    init();
  }, [params.id, params.slug]);



  // Watch for game start: reload player when game transitions from not started to started
  useEffect(() => {
    const prevGame = prevGameRef.current;
    if (prevGame && !prevGame.started && game?.started) {
      actions.loadPlayer({
        game: params.id,
        player: params.slug,
      });
    }
    prevGameRef.current = game;
  }, [game]);

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

  if (!player || !game) return null;

  if (!game.started) {
    return <Lobby isPlayerView={true} />;
  }

  if (showIntroVideo) {
    return <IntroVideo onComplete={() => setShowIntroVideo(false)} />;
  }

  const isNightPhase = !game.murdererChoice;
  const isMurderer = player.index === game.murderer;

  if (isNightPhase) {
    if (!isMurderer) {
      return <WaitingForCrime game={game} player={player} isMurderer={false} />;
    } else {
      return (
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', p: { xs: 2, md: 4 }, pt: { xs: 6, md: 10 } }}>
          <Box sx={{ maxWidth: '900px', mx: 'auto', width: '100%' }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontFamily: '"kingthings_trypewriter_2Rg", serif', color: 'var(--color-error-main)', textShadow: '0 0 15px rgba(239,69,101,0.5)' }}>
              ช่วงกลางคืน: ก่อเหตุอาชญากรรม
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', color: 'var(--color-ink-muted)' }}>
              เลือกอาวุธและหลักฐานของคุณเพื่อก่อเหตุ
            </Typography>
            <MurdererChoice game={game} player={player} />
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!game.finished && <GameHeader />}
      
      {game.finished ? (
        <GameSummary game={game} />
      ) : (
        <GamePlayLayout isHost={false} currentPlayer={player} />
      )}
      <ChatBox />
    </Box>
  );
}
