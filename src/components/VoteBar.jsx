import React from 'react';
import { Box, Button } from '@mui/material';

import { useGame } from '@/store/GameContext';
import './GamePlayLayout.css';

export default function VoteBar({ guess, onVoteClick, currentPlayer }) {
  const { game } = useGame();

  const isVotingPhase = game?.phase === 'voting';
  
  const hasActed = currentPlayer && (
    (game.passedTurns && game.passedTurns[currentPlayer.index]) || 
    (game.guesses && !!game.guesses[currentPlayer.index])
  );
  
  const isReadyToVote = guess?.player !== null && guess?.mean && guess?.key;
  const disableActions = !isVotingPhase || hasActed || !currentPlayer;

  let buttonText = 'เลือกอาวุธ 1 อย่าง & หลักฐาน 1 อย่าง';
  if (!isVotingPhase) {
    buttonText = 'รอช่วงลงคะแนน...';
  } else if (hasActed) {
    buttonText = 'ส่งผลโหวตแล้ว';
  } else if (isReadyToVote) {
    buttonText = 'ยืนยันการเดา';
  }

  const isButtonActive = isReadyToVote && isVotingPhase && !hasActed;

  return (
    <Box className="vote-bar" sx={{
      position: 'sticky',
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      p: { xs: 1.2, sm: 2 },
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
      zIndex: 50,
    }}>
      <Button 
        variant="outlined" 
        size="large" 
        onClick={onVoteClick}
        disabled={disableActions || !isReadyToVote}
        sx={{
          minWidth: { xs: '180px', sm: '240px' },
          maxWidth: { xs: '88vw', sm: 'none' },
          fontSize: { xs: '0.8rem', sm: '1.05rem', md: '1.2rem' },
          letterSpacing: { xs: '0.02em', sm: '0.08em' },
          px: { xs: 2, sm: 4 },
          py: { xs: 1, sm: 1.5 },
          whiteSpace: 'normal',
          lineHeight: 1.25,
          border: '2px solid',
          borderColor: isButtonActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)',
          color: isButtonActive ? 'var(--color-accent)' : 'white',
          background: isButtonActive ? 'rgba(239, 69, 101, 0.1)' : 'transparent',
          boxShadow: isButtonActive ? '0 0 15px rgba(239, 69, 101, 0.4)' : 'none',
          animation: isButtonActive ? 'pulse 2s infinite' : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: isButtonActive ? '#ff5c77' : 'white',
            background: isButtonActive ? 'rgba(239, 69, 101, 0.2)' : 'rgba(255,255,255,0.1)',
            transform: 'scale(1.02)'
          },
          '&.Mui-disabled': {
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.3)',
            boxShadow: 'none',
            background: 'transparent'
          }
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}
