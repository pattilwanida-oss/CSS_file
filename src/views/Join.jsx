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
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' } }}>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  size="large"
                  sx={{
                    mr: 2,
                    mb: { xs: 2, lg: 0 },
                    bgcolor: '#fafafa',
                    color: '#094067',
                    '&:hover': { bgcolor: '#e0e0e0' },
                  }}
                >
                  <ArrowBack sx={{ color: '#ef4565' }} />
                </Button>
                <Button
                  disabled={disabled}
                  type="submit"
                  variant="contained"
                  size="large"
                  color="error"
                  sx={{ mb: 2 }}
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
