import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tabs, Tab, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';
import Lobby from '@/components/Lobby';
import Board from '@/components/Board';
import Detective from '@/components/Detective';
import WaitingForCrime from '@/components/WaitingForCrime';
import ChatBox from '@/components/ChatBox';
import PhaseTimer from '@/components/PhaseTimer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Game() {
  const { game, player, actions } = useGame();
  const { t } = useTranslate();
  const params = useParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [tabValue, setTabValue] = useState(0);

  // Load game on mount
  useEffect(() => {
    actions.loadGame(params.id);
  }, [params.id]);

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

  // Host is a player - check if we have their data
  const hostPlayer = player;
  const isNightPhase = !game.murdererChoice;
  const isMurderer = hostPlayer && hostPlayer.index === game.murderer;

  // Desktop layout: Board + Player controls side by side
  if (isDesktop) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{ flex: 2, borderRight: 1, borderColor: 'divider', overflow: 'auto', p: 2 }}>
            <Board />
          </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'background.paper' }}>
          {hostPlayer ? (
            isNightPhase && !isMurderer ? (
              <WaitingForCrime isMurderer={false} />
            ) : (
              <Detective game={game} player={hostPlayer} />
            )
          ) : (
            <Typography sx={{ p: 2 }}>{t('Loading player data...')}</Typography>
          )}
        </Box>
        </Box>
        <ChatBox />
      </Box>
    );
  }

  // Mobile layout: Tabs
  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          <Board />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {hostPlayer ? (
            isNightPhase && !isMurderer ? (
              <WaitingForCrime isMurderer={false} />
            ) : (
              <Detective game={game} player={hostPlayer} view="cards" />
            )
          ) : (
            <Typography sx={{ p: 2 }}>{t('Loading player data...')}</Typography>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {hostPlayer ? (
            isNightPhase && !isMurderer ? (
              <WaitingForCrime isMurderer={false} />
            ) : (
              <Detective game={game} player={hostPlayer} view="actions" />
            )
          ) : (
            <Typography sx={{ p: 2 }}>{t('Loading player data...')}</Typography>
          )}
        </TabPanel>
      </Box>
      <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
          <Tab label={t('Public Board')} />
          <Tab label={t('Personal Cards')} />
          <Tab label={t('Voting')} />
        </Tabs>
      </Box>
      <ChatBox />
    </Box>
  );
}
