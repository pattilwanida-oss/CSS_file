import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, TextField, Alert, Typography, Paper } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useGame } from '@/store/GameContext';


export default function Join() {
  const { actions } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [nickname, setNickname] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    const room = searchParams.get('room');
    if (room) {
      setGameId(room);
    }
  }, [searchParams]);

  const joinGame = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setErrorText(null);
    setError(false);

    const result = await actions.addPlayer({
      nickname,
      slug: nickname.replace(/\s+/g, '-').toLowerCase(),
      gameId: gameId.toLowerCase(),
      navigate,
    });

    if (result) {
      setError(true);
      setErrorText(result);
      setDisabled(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100dvh', 
      overflow: 'hidden',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: { xs: 2, sm: 3 }
    }}>
      <Container maxWidth="sm">
        {error && errorText && (
          <Alert severity="error" onClose={() => setError(false)} sx={{ mb: 3 }}>
            {errorText === "Nickname already taken in this room" ? "ชื่อนี้ถูกใช้ไปแล้วในห้องนี้" : errorText}
          </Alert>
        )}
        
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            background: 'var(--color-surface)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-elevated)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle top border accent */}
          <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
            opacity: 0.5
          }} />

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Button
              component={Link}
              to="/"
              size="small"
              sx={{
                minWidth: 'auto',
                p: 1,
                mr: 2,
                color: 'var(--color-ink-muted)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                },
              }}
            >
              <ArrowBack fontSize="small" />
            </Button>
            <Typography variant="h4" sx={{ fontFamily: '"Chakra Petch", sans-serif', m: 0 }}>
              เข้าร่วมห้อง
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)', mb: 4, ml: 7, letterSpacing: '1px' }}>
            เข้าสู่คดี
          </Typography>

          <form onSubmit={joinGame}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>
                    รหัสห้อง
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="e.g. abcd-efgh"
                  variant="filled"
                  required
                />
                <Typography variant="caption" sx={{ color: 'var(--color-ink-dim)', mt: 0.5, display: 'block' }}>
                  ขอรหัสห้องจากผู้สร้างเกม
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-ink-muted)', letterSpacing: '0.05em' }}>
                    ชื่อนักสืบของคุณ
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-ink-dim)' }}>
                    {nickname.length}/20
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                  placeholder="ชื่อเล่นของคุณ"
                  variant="filled"
                  required
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={disabled || !nickname.trim() || !gameId.trim()}
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  size="large"
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  เข้าสู่เกม
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
