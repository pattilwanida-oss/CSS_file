import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentCopy, ExitToApp, PlayArrow, HourglassEmpty } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';

import LobbyPlayers from './LobbyPlayers';
import ChatBox from './ChatBox';

export default function Lobby({ isPlayerView }) {
  const { game, actions } = useGame();
  const params = useParams();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    (async () => {
      await actions.loadGame(params.id);
    })();
  }, [params.id]);

  const location = useMemo(() => {
    const roomId = game?.gameId || params.id;
    if (!roomId) return '';
    return `${window.location.origin}/join?room=${roomId}`;
  }, [game, params.id]);

  const players = useMemo(() => {
    if (!game || !game.players) return false;
    return Object.keys(game.players).map((item) => game.players[item]);
  }, [game]);

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
        // Fall through
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
      message: copied ? 'คัดลอกลิงก์สำเร็จ' : 'คัดลอกลิงก์ล้มเหลว',
    });
  };

  if (!game) return null;

  return (
    <Box sx={{ height: '100dvh', overflowY: 'auto', pt: { xs: 3, md: 6 }, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 4 
        }}>
          <Box>
            <Typography variant="h3" sx={{ fontFamily: '"Chakra Petch", sans-serif', mb: 1 }}>
              ห้องรอล็อบบี้
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--color-ink-muted)' }}>
                รหัสห้อง:
              </Typography>
              <Chip 
                label={params.id} 
                onClick={() => handleCopyText(params.id)}
                icon={<ContentCopy style={{ fontSize: 16 }} />}
                sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  bgcolor: 'rgba(239, 69, 101, 0.15)',
                  color: 'var(--color-accent)',
                  border: '1px solid rgba(239, 69, 101, 0.3)',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(239, 69, 101, 0.25)',
                  }
                }} 
              />
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            color="inherit" 
            startIcon={<ExitToApp />}
            onClick={() => navigate('/')}
            sx={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-ink-muted)' }}
          >
            ออก
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Main Content - Players */}
          <Grid item xs={12} md={isPlayerView ? 12 : 8}>
            <Card sx={{ p: 1, bgcolor: 'var(--color-surface)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: '1px solid var(--color-border-subtle)', pb: 2 }}>
                  <Typography sx={{ fontWeight: 600, color: 'var(--color-ink-muted)', letterSpacing: '1px' }}>
                    👥 ผู้เล่น ({players ? players.length : 0}/12)
                  </Typography>
                </Box>

                {players ? (
                  <LobbyPlayers game={game} players={players} />
                ) : (
                  <Typography sx={{ color: 'var(--color-ink-dim)', textAlign: 'center', py: 4 }}>
                    กำลังรอผู้เล่น...
                  </Typography>
                )}

                {!isPlayerView && (
                  <Box sx={{ mt: 5 }}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      size="large"
                      disabled={!players || players.length < 5}
                      onClick={handleStartGame}
                      startIcon={(!players || players.length < 5) ? <HourglassEmpty /> : <PlayArrow />}
                      sx={{ 
                        py: 2, 
                        fontSize: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {(!players || players.length < 5) 
                        ? 'กำลังรอผู้เล่น...' + ` (${players ? players.length : 0}/5)` 
                        : 'เริ่มสืบสวน'}
                    </Button>
                    {(!players || players.length < 5) && (
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'var(--color-ink-dim)', wordBreak: 'break-word', overflowWrap: 'anywhere', px: 1 }}>
                        ต้องการผู้เล่นอย่างน้อย 5 คนเพื่อเริ่มเกม แชร์รหัสห้องให้เพื่อนๆ สิ!
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar - QR Code */}
          {!isPlayerView && (
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'var(--color-surface)', height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontFamily: '"Chakra Petch", sans-serif' }}>
                    เชิญชวนผู้เล่น
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)', mb: 3 }}>
                    สแกนเพื่อเข้าร่วมการสืบสวนนี้
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'white', 
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-block'
                  }}>
                    <QRCodeCanvas
                      value={location}
                      size={200}
                      bgColor="#fff"
                      fgColor="#0a0e1a"
                    />
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 4, color: 'var(--color-accent)', borderColor: 'var(--color-border-accent)' }}
                    onClick={() => handleCopyText(location)}
                    startIcon={<ContentCopy />}
                  >
                    คัดลอกลิงก์เกม
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

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
    </Box>
  );
}
