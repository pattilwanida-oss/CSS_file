import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Button, TextField, Alert } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';

export default function Join() {
  const { actions } = useGame();
  const { t } = useTranslate();
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
    <Container sx={{ height: '100%' }}>
      <Grid
        container
        sx={{ height: '100%' }}
        alignItems="center"
        justifyContent="center"
      >
        {error && errorText && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(false)}>
              {errorText}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} md={6} sx={{ mt: 3 }}>
          <h2 className="display-2">{t('Join game')}</h2>
          <p className="subtitle-1" style={{ margin: '1rem 0' }}>
            {t('Enter a game code and a nickname to join a game:')}
          </p>
          <form onSubmit={joinGame}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  label={t('Game code')}
                  variant="filled"
                  required
                  sx={{ 
                    input: { color: '#fff' }, 
                    label: { color: 'rgba(255,255,255,0.7)' },
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px' 
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  label={t('Your nickname')}
                  variant="filled"
                  required
                  sx={{ 
                    input: { color: '#fff' }, 
                    label: { color: 'rgba(255,255,255,0.7)' },
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' } }}>
                <Button
                  component={Link}
                  to="/"
                  size="large"
                  sx={{
                    mr: 2,
                    mb: { xs: 2, lg: 0 },
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                  }}
                >
                  <ArrowBack sx={{ color: '#fff' }} />
                </Button>
                <Button
                  disabled={disabled}
                  type="submit"
                  size="large"
                  sx={{ 
                    mb: 2,
                    background: 'rgba(255, 100, 100, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 100, 100, 0.3)',
                    color: '#fff',
                    boxShadow: '0 4px 30px rgba(255, 0, 0, 0.1)',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    padding: '10px 24px',
                    '&:hover': {
                      background: 'rgba(255, 100, 100, 0.35)',
                      borderColor: 'rgba(255, 100, 100, 0.5)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  {t('Enter game')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
