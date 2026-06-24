import React, { useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';
import './Board.css';

export default function Board() {
  const { game } = useGame();
  const { t, setLang } = useTranslate();

  useEffect(() => {
    if (game && game.lang) {
      setLang(game.lang);
    }
  }, [game]);

  const players = useMemo(() => {
    if (!game || !game.players) return false;
    return Object.keys(game.players).map((item) => game.players[item]);
  }, [game]);

  const suspects = useMemo(() => {
    if (!players) return [];
    if (game.detective === -1) return players; // AI mode: everyone is a suspect
    return players.filter((item) => item.index !== game.detective);
  }, [players, game]);

  const visibleAnalysis = useMemo(() => {
    if (!game?.forensicAnalysis?.length) return [];
    if (game.detective !== -1) return game.forensicAnalysis;
    const limit = game.availableClues ?? game.forensicAnalysis.length;
    return game.forensicAnalysis.slice(0, limit);
  }, [game?.forensicAnalysis, game?.availableClues, game?.detective]);

  // Compute random rotations once per suspect set, not on every render
  const rotations = useMemo(() => {
    if (!suspects.length) return { stamps: [], cards: [], analysis: [] };
    const stamps = suspects.map(() => Math.floor(3 - Math.random() * 6));
    const cards = suspects.map(() => Math.floor(3 - Math.random() * 6));
    const analysisCount = visibleAnalysis.length;
    const analysis = Array.from({ length: analysisCount }, () =>
      Math.floor(3 - Math.random() * 6)
    );
    return { stamps, cards, analysis };
  }, [suspects.length, visibleAnalysis.length]);

  if (!game || !players) return null;

  return (
    <Container sx={{ height: '100%' }}>
      <Grid container sx={{ height: '100%' }} alignItems="center" spacing={2}>
        <Grid item md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3">
                {t('Game')}{' '}
                <code style={{ color: '#ff5252', textTransform: 'uppercase' }}>
                  {game.gameId}
                </code>
                <Typography
                  component="small"
                  variant="body1"
                  sx={{ ml: { lg: 2 } }}
                >
                  {t('Round')} {game.round} {t('of')} 3
                </Typography>
              </Typography>
              <Typography variant="h4" sx={{ my: 2 }}>
                {t('Suspects of the crime:')}
              </Typography>
            </Grid>

            {suspects.map((player, idx) => (
              <Grid
                item
                md={6}
                xl={3}
                key={player.playerkey}
                className="suspect"
              >
                {game.finished && (
                  <div
                    className="stamp"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${rotations.stamps[idx]}deg)`,
                    }}
                  >
                    {game.murderer === player.index ? (
                      <span style={{ color: '#f44336' }}>Murderer</span>
                    ) : (
                      <span>Detective</span>
                    )}
                  </div>
                )}
                <Card
                  style={{
                    transform: `rotate(${rotations.cards[idx]}deg)`,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{player.name}</Typography>

                    {game.passedTurns && game.passedTurns[player.index] && (
                      <div
                        style={{
                          fontFamily: "'Shadows Into Light'",
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {t('Passed this turn')}
                      </div>
                    )}

                    {game.guesses && game.guesses[player.index] && (
                      <div
                        style={{
                          fontFamily: "'Shadows Into Light'",
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#5f6c7b',
                        }}
                      >
                        {t('Guessed that the murderer was')}{' '}
                        {players[game.guesses[player.index].player].name},{' '}
                        {t('the M.O. was')}{' '}
                        {game.guesses[player.index].mean}{' '}
                        {t('and the key evidence was')}{' '}
                        {game.guesses[player.index].key}
                      </div>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {[...game.means]
                        .slice(player.index * 4, player.index * 4 + 4)
                        .map((mean, index) => (
                          <Chip
                            key={index}
                            label={mean}
                            size="small"
                            sx={{ bgcolor: '#bbdefb' }}
                          />
                        ))}
                    </Box>

                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                      {[...game.clues]
                        .slice(player.index * 4, player.index * 4 + 4)
                        .map((clue, index) => (
                          <Chip
                            key={'clue' + index}
                            label={clue}
                            size="small"
                            sx={{ bgcolor: '#ffcdd2' }}
                          />
                        ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12}>
              {game.finished && (
                <div className="finished">
                  The game is finshed. The {game.winner} won!
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={3}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {t('Analysis')}
            <div className="signature">
              <span className="sign">
                {game.detective === -1 ? 'AI System' : players[game.detective]?.name}
              </span>
              <span className="text">{game.detective === -1 ? 'AI Game Master' : t('Forensic Scientist')}</span>
            </div>
          </Typography>
          <div className="subtitle-1" />

          {visibleAnalysis.map((item, index) => (
              <Card
                key={'fa' + index}
                sx={{ mb: 2 }}
                style={{
                  transform: `rotate(${rotations.analysis[index] || 0}deg)`,
                }}
              >
                <CardContent className="analysis">
                  <strong className="type">
                    {index + 1} {game.analysis[index]?.title || 'Analysis'}:
                  </strong>
                  <span className="text">{typeof item === 'string' ? item : item?.selection || JSON.stringify(item)}</span>
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>
    </Container>
  );
}
