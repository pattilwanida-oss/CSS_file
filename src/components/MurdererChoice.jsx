import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';

export default function MurdererChoice({ game, player, onChoice }) {
  const { actions } = useGame();
  const { t } = useTranslate();

  const [murdererChoice, setMurdererChoice] = useState({ mean: null, key: null });

  useEffect(() => {
    if (game.murdererChoice) {
      setMurdererChoice({
        mean: game.murdererChoice.mean,
        key: game.murdererChoice.key,
      });
    }
  }, []);

  const means = [...game.means].slice(player.index * 4, player.index * 4 + 4);
  const clues = [...game.clues].slice(player.index * 4, player.index * 4 + 4);

  const handleSendChoice = async () => {
    await actions.setMurdererChoice({
      gamekey: game.gamekey,
      choice: murdererChoice,
    });
    if (onChoice) onChoice();
  };

  return (
    <Grid container spacing={2} sx={{ textAlign: 'left' }}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            {t('Select your means of murder:')}
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              {means.map((mean, index) => (
                <Chip
                  key={index}
                  label={
                    <>
                      {murdererChoice.mean === mean && (
                        <Check fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      )}
                      {mean}
                    </>
                  }
                  size="small"
                  sx={{ 
                    bgcolor: murdererChoice.mean === mean ? 'rgba(41, 98, 255, 0.4)' : 'rgba(41, 98, 255, 0.1)', 
                    color: '#2962ff', 
                    border: '1px solid rgba(41, 98, 255, 0.5)',
                    opacity: 1 
                  }}
                  disabled={!!game.murdererChoice}
                  variant={murdererChoice.mean === mean ? 'filled' : 'outlined'}
                  onClick={() =>
                    setMurdererChoice((prev) => ({ ...prev, mean }))
                  }
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            {t('Select your key evidence:')}
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              {clues.map((clue, index) => (
                <Chip
                  key={index}
                  label={
                    <>
                      {murdererChoice.key === clue && (
                        <Check fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                      )}
                      {clue}
                    </>
                  }
                  size="small"
                  sx={{ 
                    bgcolor: murdererChoice.key === clue ? 'rgba(239, 69, 101, 0.4)' : 'rgba(239, 69, 101, 0.1)', 
                    color: '#ef4565', 
                    border: '1px solid rgba(239, 69, 101, 0.5)',
                    opacity: 1 
                  }}
                  disabled={!!game.murdererChoice}
                  variant={murdererChoice.key === clue ? 'filled' : 'outlined'}
                  onClick={() =>
                    setMurdererChoice((prev) => ({ ...prev, key: clue }))
                  }
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {!game.murdererChoice && (
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            disabled={!murdererChoice.mean || !murdererChoice.key}
            onClick={handleSendChoice}
          >
            {t('Send choice')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
