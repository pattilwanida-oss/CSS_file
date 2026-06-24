import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';

export default function ForensicAnalysis({ game, player }) {
  const { actions } = useGame();
  const { t } = useTranslate();

  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    if (game.forensicAnalysis) {
      setAnalysis([...game.forensicAnalysis]);
    }
  }, []);

  const availableClues = useMemo(() => {
    return game.analysis.filter((item, index) => index < game.availableClues);
  }, [game.analysis, game.availableClues]);

  const murderer = useMemo(() => {
    const key = Object.keys(game.players).find(
      (item) => game.players[item].index === game.murderer
    );
    return game.players[key];
  }, [game.players, game.murderer]);

  const handleAnalysisChange = (index, value) => {
    setAnalysis((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSendAnalysis = async () => {
    await actions.setAnalysis({
      gamekey: game.gamekey,
      analysis,
    });
  };

  const isSendDisabled =
    analysis.length < availableClues.length ||
    (game.forensicAnalysis &&
      game.forensicAnalysis.length === availableClues.length);

  return (
    <Grid container spacing={2} sx={{ height: '100%' }} alignItems="center" justifyContent="center">
      <Grid
        item
        xs={12}
        lg={6}
        sx={{
          mt: 'auto',
          ...(! game.murdererChoice && { mb: 'auto' }),
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          {player.name}
        </Typography>

        {game.murdererChoice ? (
          <Typography variant="h4">
            {murderer.name} {t('used')}
            <span style={{ color: '#2196f3' }}>
              &nbsp;&nbsp;{game.murdererChoice.mean}
            </span>{' '}
            {t('to kill, and left behind')}
            <span style={{ color: '#f44336' }}>
              &nbsp;&nbsp;{game.murdererChoice.key}
            </span>{' '}
            {t('as a key evidence.')}
          </Typography>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ wordBreak: 'inherit' }}>
                {murderer.name}{' '}
                {t(
                  'is the murderer. Wait for means of murder and key evidence.'
                )}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography>
                {t(
                  'Ask all the players, but the murderer to close their eyes. As soon as you receive the murderer clues, you can ask them to open their eyes again.'
                )}
              </Typography>
            </CardContent>
          </Card>
        )}

        {!game.murdererChoice && (
          <LinearProgress color="error" sx={{ mt: 2, borderRadius: 1 }} />
        )}
      </Grid>

      {game.murdererChoice && (
        <Grid item xs={12} sx={{ mb: 'auto' }}>
          <Grid container spacing={2}>
            {availableClues.map((item, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography>{item.title}</Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>{item.title}</InputLabel>
                      <Select
                        value={analysis[index] || ''}
                        label={item.title}
                        disabled={
                          game.forensicAnalysis &&
                          !!game.forensicAnalysis[index]
                        }
                        onChange={(e) =>
                          handleAnalysisChange(index, e.target.value)
                        }
                      >
                        {item.options.map((option, optIdx) => (
                          <MenuItem key={optIdx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                disabled={isSendDisabled}
                onClick={handleSendAnalysis}
              >
                {t('Send analysis')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
