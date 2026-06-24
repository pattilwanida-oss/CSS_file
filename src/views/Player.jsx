import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, LinearProgress, Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';
import Detective from '@/components/Detective';
import Board from '@/components/Board';
import Lobby from '@/components/Lobby';
import WaitingForCrime from '@/components/WaitingForCrime';
import ChatBox from '@/components/ChatBox';
import PhaseTimer from '@/components/PhaseTimer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Player() {

  const { game, player, actions } = useGame();
  const { t, setLang } = useTranslate();
  const params = useParams();
  const prevGameRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [tabValue, setTabValue] = useState(0);

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

  // Set language when game is loaded
  useEffect(() => {
    if (game?.lang) {
      setLang(game.lang);
    }
  }, [game?.lang]);

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

  // Force navigate to voting tab when voting phase starts
  useEffect(() => {
    if (game?.phase === 'voting' && !isDesktop) {
      setTabValue(2);
    }
  }, [game?.phase, isDesktop]);

  const handleTabChange = (event, newValue) => {
    if (game?.phase === 'voting' && newValue !== 2) {
      // Prevent leaving voting tab during voting phase
      return;
    }
    setTabValue(newValue);
  };

  if (!player || !game) return null;

  if (!game.started) {
    return <Lobby isPlayerView={true} />;
  }

  const isNightPhase = !game.murdererChoice;
  const isMurderer = player.index === game.murderer;

  if (isNightPhase && !isMurderer) {
    return <WaitingForCrime isMurderer={false} />;
  }

  if (isDesktop) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: 2, borderRight: 1, borderColor: 'divider', overflow: 'auto', p: 2 }}>
            <Board />
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'background.paper' }}>
            <Detective game={game} player={player} />
          </Box>
          <ChatBox />
        </Box>
      </Box>
    );
  }

  // Mobile Layout
  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          <Board />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Detective game={game} player={player} view="cards" />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Detective game={game} player={player} view="actions" />
        </TabPanel>
      </Box>
      <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label={t('Public Board')} />
          <Tab label={t('Personal Cards')} />
          <Tab label={t('Voting')} />
        </Tabs>
      </Box>
      <ChatBox />
    </Box>
  );
}
