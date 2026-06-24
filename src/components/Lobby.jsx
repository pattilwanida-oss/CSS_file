import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Typography,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'react-router-dom';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';
import LobbyPlayers from './LobbyPlayers';
import ChatBox from './ChatBox';

export default function Lobby({ isPlayerView }) {
  const { game, actions } = useGame();
  const { t, setLang } = useTranslate();
  const params = useParams();

  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    (async () => {
      await actions.loadGame(params.id);
    })();
  }, [params.id]);

  useEffect(() => {
    if (game && game.lang) {
      setLang(game.lang);
    }
  }, [game]);

  const location = useMemo(() => {
    const roomId = game?.gameId || params.id;
    if (!roomId) return '';
    return `${window.location.origin}/join?room=${roomId}`;
  }, [game, params.id]);

  const players = useMemo(() => {
    if (!game || !game.players) return false;
    return Object.keys(game.players).map((item) => game.players[item]);
  }, [game]);

  const playerCount = useMemo(() => {
    if (!game || !game.players) return t('No players joined yet.');
    if (players.length === 1) return `${players.length} ${t('player joined.')}`;
    return `${players.length} ${t('players joined.')}`;
  }, [game, players, t]);


  const handleStartGame = async () => {
    await actions.startGame({
      gamekey: game.gamekey,
      playersObj: game.players,
      players,
      detective: -1,
      lang: game.lang,
    });
  };

  const copyToClipboard = async (text) => {
    if (!text) return false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall through to legacy copy for non-secure contexts (e.g. HTTP over LAN).
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const handleCopyText = async (text) => {
    const copied = await copyToClipboard(text);
    setSnackbar({
      open: true,
      severity: copied ? 'success' : 'error',
      message: copied ? t('URL Copied') : t('Failed to copy URL'),
    });
  };

  if (!game) return null;

  return (
    <Container sx={{ height: '100%' }}>
      <Grid container sx={{ height: '100%' }} alignItems="center" spacing={2} justifyContent="center">
        <Grid item xs={12} md={isPlayerView ? 8 : 5} xl={isPlayerView ? 6 : 4} sx={{ mt: 5 }}>
          <Typography variant="h3">
            {t('Lobby for room')}{' '}
            <code style={{ color: '#ff5252', textTransform: 'uppercase' }}>
              {params.id}
            </code>
          </Typography>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            {t('Waiting for players')}. {playerCount}
          </Typography>
          <LinearProgress color="error" sx={{ borderRadius: 1 }} />

          {players && (
            <LobbyPlayers
              game={game}
              players={players}
            />
          )}

          {!isPlayerView && (
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{ mt: 2 }}
              disabled={!players || players.length < 5}
              onClick={handleStartGame}
            >
              {t('Start game')}
            </Button>
          )}
        </Grid>

        {!isPlayerView && (
          <Grid item xs={12} md={3} xl={2}>
            <Card>
              <CardContent>
                <QRCodeCanvas
                  value={location}
                  size={200}
                  bgColor="#fff"
                  fgColor="#091619"
                  style={{ maxWidth: '100%' }}
                />
                <Button
                  fullWidth
                  sx={{ mt: 2, color: '#ff5252' }}
                  onClick={() => handleCopyText(location)}
                >
                  {t('Copy game url')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ChatBox />
    </Container>
  );
}
