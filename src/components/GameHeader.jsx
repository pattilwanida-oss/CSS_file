import React from 'react';
import { Box, Typography, IconButton, Chip, Tooltip, Button } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/store/GameContext';

import PhaseTimer from './PhaseTimer';
import './GamePlayLayout.css';

export default function GameHeader({ onOpenClues }) {
  const { game } = useGame();
  const navigate = useNavigate();
  const cluesCount = game?.forensicAnalysis?.length || 0;

  if (!game) return null;

  return (
    <Box className="game-header" sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: { xs: 0.8, sm: 1.5, md: 2 },
      px: { xs: 1, sm: 1.5, md: 2 },
      py: 0.8,
      borderBottom: '1px solid var(--color-border-subtle)',
      bgcolor: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(12px)',
      flexShrink: 0,
      minWidth: 0
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, minWidth: 0, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontFamily: '"kingthings_trypewriter_2Rg", serif', letterSpacing: '0.05em', fontSize: { xs: '0.8rem', sm: '1.25rem' } }}>
          ROOM
        </Typography>
        <Typography variant="h6" sx={{ color: 'var(--color-error-main)', fontWeight: 'bold', fontSize: { xs: '0.85rem', sm: '1.25rem' } }} className="accent-text">
          {game.gameId}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 }, flexShrink: 0 }}>
        <Chip 
          label={game.phase === 'voting' ? 'ลงคะแนน' : 'พูดคุย'}
          size="small"
          sx={{ 
            fontWeight: 'bold', 
            bgcolor: game.phase === 'voting' ? 'var(--color-accent)' : 'var(--color-primary)',
            color: 'white',
            height: { xs: 22, sm: 24 },
            fontSize: { xs: '0.7rem', sm: '0.75rem' }
          }}
        />
        <Typography variant="body2" sx={{ fontFamily: '"kingthings_trypewriter_2Rg", serif', fontSize: { xs: '0.75rem', sm: '1rem' }, whiteSpace: 'nowrap' }}>
          รอบ {game.round}/3
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 }, flexShrink: 0 }}>
        {/* Mobile Clue Shortcut Button */}
        {onOpenClues && (
          <Button
            size="small"
            variant="outlined"
            onClick={onOpenClues}
            sx={{
              display: { xs: 'none', sm: 'inline-flex', md: 'none' },
              borderColor: 'rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              fontFamily: '"Chakra Petch", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 700,
              py: 0.3,
              px: 1,
              minWidth: 'auto',
              borderRadius: '8px',
              bgcolor: 'rgba(59, 130, 246, 0.15)',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.25)',
              '&:hover': {
                bgcolor: 'rgba(59, 130, 246, 0.25)',
                borderColor: '#3b82f6'
              }
            }}
          >
            🔍 คำใบ้ ({cluesCount})
          </Button>
        )}

        <PhaseTimer phase={game.phase} phaseEndsAt={game.phaseEndsAt} isFinished={game.finished} />
        <Tooltip title={'ออกจากเกม'}>
          <IconButton size="small" sx={{ color: 'var(--color-error-main)' }} onClick={() => navigate('/')}>
            <ExitToApp fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
