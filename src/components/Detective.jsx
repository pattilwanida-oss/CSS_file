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
import MurdererChoice from './MurdererChoice';
import GameCard from './GameCard';

export default function Detective({ game, player, view }) {
  const { actions } = useGame();

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
      return 'ฆาตกร';
    }
    return 'นักสืบ';
  }, [player.index, game.murderer]);

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
        <Typography variant="h6">บทบาทและการ์ดของฉัน</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {player.name}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2">บทบาท: {playerRole}</Typography>
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
        <Box className="card-grid" gap={0.5}>
          {means.map((mean, index) => (
            <GameCard key={index} name={mean} type="means" disabled />
          ))}
        </Box>
        <Box className="card-grid" gap={0.5} mt={1}>
          {clues.map((clue, index) => (
            <GameCard key={'clue' + index} name={clue} type="clues" disabled />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  const renderActions = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">ไขคดี</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button onClick={handlePassTurn} disabled={disableActions} color="secondary" variant="outlined" sx={{ mb: 2 }}>
          ข้ามเทิร์น
        </Button>
        <Divider sx={{ mb: 2 }} />
        <Typography>ใครคือฆาตกร?</Typography>
        <FormControl fullWidth sx={{ mt: 2 }} disabled={disableActions}>
          <InputLabel>ใครคือฆาตกร?</InputLabel>
          <Select
            value={guess.player ?? ''}
            label="ใครคือฆาตกร?"
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
                  เลือกอาวุธสังหาร:
                </Typography>
                <Box className="card-grid" gap={0.5} mt={1}>
                  {[...game.means]
                    .slice(
                      selectedPlayer.index * 4,
                      selectedPlayer.index * 4 + 4
                    )
                    .map((mean, index) => (
                      <GameCard
                        key={index}
                        name={mean}
                        type="means"
                        selected={guess.mean === mean}
                        disabled={disableActions}
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
                  เลือกหลักฐานสำคัญ:
                </Typography>
                <Box className="card-grid" gap={0.5} mt={1}>
                  {[...game.clues]
                    .slice(
                      selectedPlayer.index * 4,
                      selectedPlayer.index * 4 + 4
                    )
                    .map((clue, index) => (
                      <GameCard
                        key={index}
                        name={clue}
                        type="clues"
                        selected={guess.key === clue}
                        disabled={disableActions}
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
            ส่งการเดา
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
