import React, { useState, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Divider,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Check, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';
import MurdererChoice from './MurdererChoice';

export default function Detective({ game, player, view }) {
  const { actions } = useGame();
  const { t } = useTranslate();

  const [guess, setGuess] = useState({ player: null, mean: null, key: null });

  const disableActions = useMemo(() => {
    return (
      game.phase !== 'voting' ||
      (game.passedTurns && game.passedTurns[player.index]) ||
      (game.guesses && !!game.guesses[player.index])
    );
  }, [game.phase, game.passedTurns, game.guesses, player.index]);

  const playerRole = useMemo(() => {
    if (player.index === game.murderer) {
      return t('the murderer');
    }
    return t('a detective');
  }, [player.index, game.murderer, t]);

  const players = useMemo(() => {
    return Object.keys(game.players)
      .map((item) => game.players[item])
      .filter(
        (item) =>
          (game.detective === -1 || item.index !== game.detective) && item.index !== player.index
      );
  }, [game.players, game.detective, player.index]);

  const selectedPlayer = useMemo(() => {
    return players.find((item) => item.index === guess.player);
  }, [players, guess.player]);

  const means = [...game.means].slice(player.index * 4, player.index * 4 + 4);
  const clues = [...game.clues].slice(player.index * 4, player.index * 4 + 4);

  const handlePassTurn = async () => {
    await actions.passTurn({
      gamekey: game.gamekey,
      player,
    });
  };

  const handleSendGuess = async () => {
    await actions.makeGuess({
      gamekey: game.gamekey,
      player,
      guess,
    });
  };

  const renderCards = () => (
    <Accordion defaultExpanded sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{t('My Role & Cards')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {player.name}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2">{t('Role')}: {playerRole}</Typography>
        {player.index === game.murderer && (
          <Box sx={{ mt: 2 }}>
            <MurdererChoice
              game={game}
              player={player}
              onChoice={() => {}}
            />
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {means.map((mean, index) => (
            <Chip
              key={index}
              label={mean}
              size="small"
              sx={{ 
                bgcolor: 'rgba(41, 98, 255, 0.1)', 
                color: '#2962ff', 
                border: '1px solid rgba(41, 98, 255, 0.5)' 
              }}
            />
          ))}
        </Box>
        <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
          {clues.map((clue, index) => (
            <Chip
              key={'clue' + index}
              label={clue}
              size="small"
              sx={{ 
                bgcolor: 'rgba(239, 69, 101, 0.1)', 
                color: '#ef4565', 
                border: '1px solid rgba(239, 69, 101, 0.5)' 
              }}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  const renderActions = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{t('Solve the crime')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button onClick={handlePassTurn} disabled={disableActions} color="secondary" variant="outlined" sx={{ mb: 2 }}>
          {t('Pass turn')}
        </Button>
        <Divider sx={{ mb: 2 }} />
        <Typography>{t('Who is the murderer?')}</Typography>
        <FormControl fullWidth sx={{ mt: 2 }} disabled={disableActions}>
          <InputLabel>{t('Who is the murderer?')}</InputLabel>
          <Select
            value={guess.player ?? ''}
            label={t('Who is the murderer?')}
            onChange={(e) =>
              setGuess((prev) => ({
                ...prev,
                player: e.target.value,
              }))
            }
          >
            {players.map((p) => (
              <MenuItem key={p.index} value={p.index}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedPlayer && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography>
                  {t('Select the means of murder:')}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {[...game.means]
                    .slice(
                      selectedPlayer.index * 4,
                      selectedPlayer.index * 4 + 4
                    )
                    .map((mean, index) => (
                      <Chip
                        key={index}
                        label={
                          <>
                            {guess.mean === mean && (
                              <Check
                                fontSize="small"
                                sx={{
                                  mr: 0.5,
                                  verticalAlign: 'middle',
                                }}
                              />
                            )}
                            {mean}
                          </>
                        }
                        size="small"
                        sx={{ 
                          bgcolor: guess.mean === mean ? 'rgba(41, 98, 255, 0.4)' : 'rgba(41, 98, 255, 0.1)', 
                          color: '#2962ff', 
                          border: '1px solid rgba(41, 98, 255, 0.5)' 
                        }}
                        variant={
                          guess.mean === mean ? 'filled' : 'outlined'
                        }
                        onClick={() =>
                          !disableActions && setGuess((prev) => ({
                            ...prev,
                            mean,
                          }))
                        }
                      />
                    ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography>
                  {t('Select the key evidence:')}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                  {[...game.clues]
                    .slice(
                      selectedPlayer.index * 4,
                      selectedPlayer.index * 4 + 4
                    )
                    .map((clue, index) => (
                      <Chip
                        key={index}
                        label={
                          <>
                            {guess.key === clue && (
                              <Check
                                fontSize="small"
                                sx={{
                                  mr: 0.5,
                                  verticalAlign: 'middle',
                                }}
                              />
                            )}
                            {clue}
                          </>
                        }
                        size="small"
                        sx={{ 
                          bgcolor: guess.key === clue ? 'rgba(239, 69, 101, 0.4)' : 'rgba(239, 69, 101, 0.1)', 
                          color: '#ef4565', 
                          border: '1px solid rgba(239, 69, 101, 0.5)' 
                        }}
                        variant={
                          guess.key === clue ? 'filled' : 'outlined'
                        }
                        onClick={() =>
                          !disableActions && setGuess((prev) => ({
                            ...prev,
                            key: clue,
                          }))
                        }
                      />
                    ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSendGuess} disabled={disableActions || guess.player === null || !guess.mean || !guess.key}>
            {t('Send guess')}
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      {(!view || view === 'cards') && renderCards()}
      {(!view || view === 'actions') && renderActions()}
    </Box>
  );
}
