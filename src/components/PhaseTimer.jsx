import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';


export default function PhaseTimer({ phase, phaseEndsAt, isFinished }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isFinished || !phaseEndsAt) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(phaseEndsAt).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
      return diff;
    };

    const initialDiff = updateTimer();
    if (initialDiff <= 0) return;

    const interval = setInterval(() => {
      const diff = updateTimer();
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phaseEndsAt, isFinished]);

  if (isFinished || !phaseEndsAt || timeLeft <= 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-ink-muted)' }}>
        <TimerIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>
          กำลังรอ...
        </Typography>
      </Box>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 30;

  // Assuming max time is roughly 2 mins (120s) for progress bar
  const progress = Math.min(100, (timeLeft / 120) * 100);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ width: { xs: 80, sm: 120 }, display: { xs: 'none', sm: 'block' } }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={isUrgent ? "error" : "primary"}
          sx={{ 
            height: 6, 
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.1)'
          }}
        />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        color: isUrgent ? '#ff4444' : '#ffffff',
        animation: isUrgent ? 'pulse 1s infinite alternate' : 'none',
        '@keyframes pulse': {
          from: { opacity: 1, transform: 'scale(1)' },
          to: { opacity: 0.7, transform: 'scale(1.05)' }
        }
      }}>
        <TimerIcon fontSize="small" />
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'monospace', 
            fontWeight: 'bold',
            fontSize: '1.2rem',
            textShadow: isUrgent ? '0 0 10px rgba(255,68,68,0.5)' : 'none'
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Typography>
      </Box>
    </Box>
  );
}
