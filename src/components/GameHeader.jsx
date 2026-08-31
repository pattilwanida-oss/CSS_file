import React from 'react';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/store/GameContext';

import PhaseTimer from './PhaseTimer';
import './GamePlayLayout.css';

export default function GameHeader() {
  const { game } = useGame();
  const navigate = useNavigate();

  if (!game) return null;

  return (
    <Box className="game-header" sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: { xs: 1, md: 0 },
      p: { xs: 1.5, md: 2 },
      borderBottom: '1px solid var(--color-border-subtle)',
      bgcolor: 'rgba(10, 15, 30, 0.8)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: '"kingthings_trypewriter_2Rg", serif', letterSpacing: '2px' }}>
          ROOM
        </Typography>
        <Typography variant="h5" sx={{ color: 'var(--color-error-main)', fontWeight: 'bold' }} className="accent-text">
          {game.gameId}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          label={game.phase === 'voting' ? 'ลงคะแนน' : 'พูดคุย'}
          size="small"
          sx={{ 
            fontWeight: 'bold', 
            bgcolor: game.phase === 'voting' ? 'var(--color-accent)' : 'var(--color-primary)',
            color: 'white'
          }}
        />
        <Typography variant="subtitle1" sx={{ fontFamily: '"kingthings_trypewriter_2Rg", serif' }}>
          รอบที่ {game.round} จาก 3
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
        <Tooltip title={'ออกจากเกม'}>
          <IconButton size="small" sx={{ color: 'var(--color-error-main)' }} onClick={() => navigate('/')}>
            <ExitToApp />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
