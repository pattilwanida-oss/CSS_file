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
  Box,
  Paper,
} from '@mui/material';
import { HourglassEmpty } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';


export default function ForensicAnalysis({ game, player }) {
  const { actions } = useGame();

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
    <Box sx={{ p: { xs: 1, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ 
        fontFamily: '"kingthings_trypewriter_2Rg", serif',
        color: 'white',
        mb: 4
      }}>
        นักนิติวิทยาศาสตร์: {player.name}
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Murderer Info */}
        <Grid item xs={12} lg={4}>
          {game.murdererChoice ? (
            <Paper sx={{ 
              p: 4, 
              bgcolor: 'rgba(239, 69, 101, 0.05)',
              border: '1px solid rgba(239, 69, 101, 0.2)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <Typography variant="h5" sx={{ mb: 3, fontFamily: '"Chakra Petch", sans-serif' }}>
                <span style={{ color: 'white' }}>{murderer.name}</span> ใช้
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  🗡️ {game.murdererChoice.mean}
                </Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 3, fontFamily: '"Chakra Petch", sans-serif' }}>
                เป็นอาวุธสังหาร และทิ้ง
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  🔍 {game.murdererChoice.key}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                ไว้เป็นหลักฐานสำคัญ
              </Typography>
            </Paper>
          ) : (
            <Card sx={{ bgcolor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <HourglassEmpty sx={{ fontSize: '3rem', color: 'var(--color-ink-muted)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  {murderer.name} คือฆาตกร รอให้เลือกอาวุธและหลักฐานสำคัญ
                </Typography>
                <LinearProgress color="error" sx={{ mt: 4, borderRadius: 1 }} />
              </CardContent>
            </Card>
          )}

          {/* Instructions Box */}
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'rgba(0,0,0,0.3)', border: '1px dashed var(--color-border-subtle)' }}>
            <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
              ขอให้ผู้เล่นทุกคนหลับตา ยกเว้นฆาตกร ทันทีที่คุณได้รับคำใบ้จากฆาตกร คุณสามารถขอให้พวกเขาลืมตาได้อีกครั้ง
            </Typography>
          </Paper>
        </Grid>

        {/* Right Column - Analysis Tiles */}
        {game.murdererChoice && (
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              {availableClues.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ 
                    bgcolor: 'var(--color-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'var(--color-primary-glow)' }
                  }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
                        {item.title}
                      </Typography>
                      <FormControl fullWidth variant="filled">
                        <InputLabel sx={{ color: 'var(--color-ink-muted)' }}>{item.title}</InputLabel>
                        <Select
                          value={analysis[index] || ''}
                          disabled={game.forensicAnalysis && !!game.forensicAnalysis[index]}
                          onChange={(e) => handleAnalysisChange(index, e.target.value)}
                          sx={{ color: 'white' }}
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
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSendDisabled}
                  onClick={handleSendAnalysis}
                  fullWidth
                  sx={{ py: 2, fontSize: '1.1rem' }}
                >
                  ส่งการวิเคราะห์
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
