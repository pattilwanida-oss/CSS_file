import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useTranslate } from '@/i18n/TranslateContext';

export default function PhaseTimer({ phase, phaseEndsAt, isFinished }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { t } = useTranslate();

  useEffect(() => {
    if (!phaseEndsAt || isFinished) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((phaseEndsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 500);

    return () => clearInterval(interval);
  }, [phaseEndsAt, isFinished]);

  if (!phaseEndsAt || phase === 'setup' || phase === undefined || isFinished) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const isVoting = phase === 'voting';

  return (
    <Box sx={{ 
      p: 1, 
      textAlign: 'center', 
      bgcolor: isVoting ? 'error.main' : 'primary.main',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    }}>
      {isVoting ? `${t('Voting Time')}: ${seconds}s` : `${t('Round Time')}: ${minutes}:${seconds}`}
    </Box>
  );
}
