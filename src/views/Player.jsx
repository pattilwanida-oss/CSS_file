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
import CluesModal from '@/components/CluesModal';

export default function Player() {
  const { game, player, actions } = useGame();
  const params = useParams();
  const prevGameRef = useRef(null);
  const [cluesOpen, setCluesOpen] = useState(false);

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
        <Box sx={{ width: '100%', height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column', p: { xs: 1, md: 3 }, pt: { xs: 2, md: 4 } }}>
          <Box sx={{ maxWidth: '900px', mx: 'auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" sx={{ mb: 1.5, textAlign: 'center', fontFamily: '"kingthings_trypewriter_2Rg", serif', color: 'var(--color-error-main)', textShadow: '0 0 15px rgba(239,69,101,0.5)' }}>
              ช่วงกลางคืน: ก่อเหตุอาชญากรรม
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5, textAlign: 'center', color: 'var(--color-ink-muted)' }}>
              เลือกอาวุธและหลักฐานของคุณเพื่อก่อเหตุ
            </Typography>
            <MurdererChoice game={game} player={player} />
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ width: '100%', height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {!game.finished && <GameHeader onOpenClues={() => setCluesOpen(true)} />}
      
      {game.finished ? (
        <GameSummary game={game} />
      ) : (
        <GamePlayLayout isHost={false} currentPlayer={player} onOpenClues={() => setCluesOpen(true)} />
      )}
      <ChatBox />
      <CluesModal open={cluesOpen} onClose={() => setCluesOpen(false)} onOpen={() => setCluesOpen(true)} />
    </Box>
  );
}
