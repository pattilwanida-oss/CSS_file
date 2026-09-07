import React, { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useGame } from '@/store/GameContext';
import './GamePlayLayout.css';

export default function ForensicSidebar() {
  const { game, players } = useGame();

  const visibleAnalysis = game?.forensicAnalysis || [];
  
  if (!game) return null;

  return (
    <Box className="forensic-sidebar" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-error-main)', boxShadow: '0 0 8px var(--color-error-main)' }} />
          <Typography variant="h6" sx={{ fontFamily: '"kingthings_trypewriter_2Rg", serif', color: 'var(--color-ink-muted)' }}>
            นักนิติวิทยาศาสตร์ AI
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleAnalysis.map((item, index) => {
          const title = game.analysis?.[index]?.title || 'การวิเคราะห์';
          const text = typeof item === 'string' ? item : item?.selection || JSON.stringify(item);
          
          return (
            <Box key={index} className="forensic-sidebar__clue">
              <Typography variant="subtitle2" className="accent-text" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                คำใบ้: {text}
              </Typography>
            </Box>
          );
        })}
        
        {visibleAnalysis.length === 0 && (
          <Typography variant="body2" sx={{ color: 'var(--color-ink-dim)', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            คำใบ้จะปรากฏที่นี่เมื่อเกมดำเนินไป...
          </Typography>
        )}
      </Box>
    </Box>
  );
}
