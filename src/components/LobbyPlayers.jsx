import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { CheckCircle, PersonOutline } from '@mui/icons-material';

export default function LobbyPlayers({ players, game }) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
      gap: 2, 
      mt: 3 
    }}>
      {players.map((player) => {
        const isHost = player.index === 0;
        
        return (
          <Box 
            key={player.playerkey}
            sx={{
              p: 2,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all var(--duration-fast) var(--ease-out-quart)',
              '&:hover': {
                borderColor: 'var(--color-primary-glow)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-ink-muted)'
            }}>
              <PersonOutline />
            </Box>
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography sx={{ 
                fontWeight: 600, 
                fontSize: '0.95rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {player.name}
              </Typography>
            </Box>

            <Chip 
              label={isHost ? "HOST" : "JOINED"} 
              size="small"
              icon={isHost ? undefined : <CheckCircle style={{ fontSize: 14 }} />}
              sx={{
                flexShrink: 0,
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                background: isHost ? 'rgba(41, 98, 255, 0.2)' : 'rgba(104, 211, 145, 0.2)',
                color: isHost ? '#60a5fa' : '#68d391',
                border: `1px solid ${isHost ? 'rgba(41, 98, 255, 0.3)' : 'rgba(104, 211, 145, 0.3)'}`,
                '& .MuiChip-icon': {
                  color: 'inherit',
                  ml: 0.5
                }
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
