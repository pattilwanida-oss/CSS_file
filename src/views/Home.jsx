import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TypeAnimation } from 'react-type-animation';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';


export default function Home() {
  const { actions } = useGame();
  const { t, lang, setLang } = useTranslate();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [hostName, setHostName] = useState('');

  const handleCreateClick = () => {
    setShowDialog(true);
  };

  const createNewGame = async () => {
    if (!hostName.trim()) return;
    setShowDialog(false);
    const game = await actions.createGame(lang);
    const slug = hostName.trim().replace(/\s+/g, '-').toLowerCase();
    // Auto-add creator as a player
    await actions.addPlayerDirect({
      nickname: hostName.trim(),
      slug,
      gameId: game.gameId,
    });
    // Store host info so Game.jsx can show player controls
    localStorage.setItem('hostPlayer_' + game.gameId, JSON.stringify({ name: hostName.trim(), slug }));
    navigate('/game/' + game.gameId);
  };

  return (
    <Container sx={{ height: '100%' }}>
      <Grid
        container
        sx={{ height: '100%' }}
        alignItems="center"
      >
        <Grid item xs={12} lg={6} xl={4} sx={{ marginLeft: { xl: '33.333%' } }}>
          <h1 style={{ marginBottom: '1rem' }}>CSS Files</h1>
          <h2 className="display-2">
            {t('A game of')}
            <TypeAnimation
              sequence={[t('deception'), 2000, '', 500, t('deduction'), 2000, '', 500]}
              wrapper="span"
              repeat={Infinity}
              style={{ color: '#3da9fc', display: 'block', fontFamily: 'kingthings_trypewriter_2Rg' }}
              speed={40}
            />
          </h2>
          <p className="credits" style={{ margin: '0.5em 0', fontSize: '1.5em' }}>
            {t("A web-version of Tobey Ho's")}{' '}
            <strong>Deception: Murder in Hong Kong</strong>.
          </p>
          <p className="subtitle-1" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
            {t(
              "In the game, players take on the roles of investigators attempting to solve a murder case – but there's a twist. The killer is one of the investigators! Find out who among you can cut through deception to find the truth and who is capable of getting away with murder!"
            )}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/join"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#fafafa',
                color: '#094067',
                mr: 2,
                mb: { xs: 2, lg: 0 },
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              {t('Join game')}
            </Button>
            <Button
              onClick={handleCreateClick}
              variant="contained"
              size="large"
              color="error"
              sx={{ mr: 2, mb: { xs: 2, lg: 0 } }}
            >
              {t('Create new game')}
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '2rem' }}>
            <Button 
              size="small" 
              variant={lang === 'en' ? 'contained' : 'outlined'} 
              onClick={() => setLang('en')}
            >
              EN
            </Button>
            <Button 
              size="small" 
              variant={lang === 'th' ? 'contained' : 'outlined'} 
              onClick={() => setLang('th')}
            >
              TH
            </Button>
          </div>


        </Grid>
      </Grid>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>{t('Enter your nickname')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            label={t('Your nickname')}
            variant="filled"
            sx={{ mt: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && createNewGame()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>{t('Cancel') || 'Cancel'}</Button>
          <Button onClick={createNewGame} variant="contained" color="error" disabled={!hostName.trim()}>
            {t('Create new game')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
