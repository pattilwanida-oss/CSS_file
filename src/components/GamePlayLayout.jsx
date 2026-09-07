import React, { useMemo, useState } from 'react';
import { Box, Typography, Chip, useMediaQuery, useTheme } from '@mui/material';
import ForensicSidebar from './ForensicSidebar';
import PlayerPanel from './PlayerPanel';
import VoteBar from './VoteBar';
import { useGame } from '@/store/GameContext';

import './GamePlayLayout.css';

export default function GamePlayLayout({ isHost, currentPlayer, onOpenClues }) {
  const { game, actions } = useGame();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [guess, setGuess] = useState({ player: null, mean: null, key: null });

  const suspects = useMemo(() => {
    if (!game || !game.players) return [];
    const playerList = Object.keys(game.players).map((item) => game.players[item]);
    if (game.detective === -1) return playerList; 
    return playerList.filter((item) => item.index !== game.detective);
  }, [game]);

  const handleCardClick = (playerIndex, type, cardName) => {
    if (guess.player !== playerIndex) {
      setGuess({
        player: playerIndex,
        mean: type === 'means' ? cardName : null,
        key: type === 'clues' ? cardName : null,
      });
    } else {
      setGuess(prev => ({
        ...prev,
        mean: type === 'means' ? (prev.mean === cardName ? null : cardName) : prev.mean,
        key: type === 'clues' ? (prev.key === cardName ? null : cardName) : prev.key,
      }));
    }
  };

  const handleSendGuess = async () => {
    if (guess.player !== null && guess.mean && guess.key) {
      await actions.makeGuess({
        gamekey: game.gamekey,
        player: currentPlayer,
        guess,
      });
      setGuess({ player: null, mean: null, key: null });
    }
  };

  const myCard = useMemo(() => {
    if (!currentPlayer) return null;
    return suspects.find(s => s.index === currentPlayer.index);
  }, [suspects, currentPlayer]);

  const otherSuspects = useMemo(() => {
    if (!currentPlayer) return suspects;
    return suspects.filter(s => s.index !== currentPlayer.index);
  }, [suspects, currentPlayer]);

  const visibleAnalysis = game?.forensicAnalysis || [];
  const cluesCount = visibleAnalysis.length;
  const latestClue = visibleAnalysis[cluesCount - 1];
  const latestClueTitle = game?.analysis?.[cluesCount - 1]?.title || 'คำใบ้';
  const latestClueText = typeof latestClue === 'string' ? latestClue : latestClue?.selection || '';

  if (!game) return null;

  return (
    <Box className="game-play-wrapper">
      <Box className={`game-play-layout ${isDesktop ? 'desktop-layout' : 'mobile-layout'}`}>
        
        {/* Sidebar */}
        <Box className="game-play-layout__sidebar">
          <ForensicSidebar />
        </Box>

        {/* Players Area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          {/* Mobile Clue Bar */}
          <Box
            onClick={onOpenClues}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              bgcolor: 'rgba(59, 130, 246, 0.12)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
              cursor: 'pointer',
              flexShrink: 0,
              '&:active': { bgcolor: 'rgba(59, 130, 246, 0.22)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                🔍 คำใบ้ AI:
              </Typography>
              <Typography variant="caption" sx={{ color: '#f1f5f9', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                {latestClueText ? `${latestClueTitle}: ${latestClueText}` : 'แตะเพื่อดูคำใบ้ทั้งหมด'}
              </Typography>
            </Box>
            <Chip
              label={`${cluesCount} คำใบ้`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: 'rgba(59, 130, 246, 0.25)',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontWeight: 700,
                flexShrink: 0,
                ml: 1
              }}
            />
          </Box>

          {/* Instruction Hint */}
          {(!game.guesses || !game.guesses[currentPlayer?.index]) && !(game.passedTurns && game.passedTurns[currentPlayer?.index]) && (
            <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.6)', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <Typography variant="body2" sx={{ 
                color: game.phase === 'voting' ? 'var(--color-primary)' : '#ef4565', 
                letterSpacing: '0.02em',
                fontFamily: '"IBM Plex Sans Thai", "Sarabun", sans-serif',
                fontWeight: 'bold',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                lineHeight: 1.35
              }}>
                {game.phase === 'voting' 
                  ? 'เลือกผู้ต้องสงสัย เลือกอาวุธ 1 อย่าง + หลักฐาน 1 อย่าง แล้วยืนยันการลงคะแนน'
                  : 'ทบทวนคำใบ้ ช่วงลงคะแนนจะเริ่มในไม่ช้า...'}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, flex: 1, minHeight: 0, overflowY: { xs: 'auto', lg: 'hidden' } }}>
            
            {/* My Card Section */}
            {myCard && (
               <Box className="my-card-container" sx={{ 
                 flexShrink: 0, 
                 p: { xs: 1, sm: 1.5, lg: 3 }, 
                 borderRight: { xs: 'none', lg: '1px solid var(--color-border-subtle)' },
                 borderBottom: { xs: '1px solid var(--color-border-subtle)', lg: 'none' },
                 bgcolor: 'rgba(0,0,0,0.1)',
                 maxWidth: { xs: '100%', lg: '460px' },
                 overflowY: 'hidden'
               }}>
                 <PlayerPanel 
                   player={myCard} 
                   guess={guess}
                   onCardClick={handleCardClick}
                   currentPlayer={currentPlayer}
                 />
               </Box>
            )}

            {/* Other Suspects */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
               {otherSuspects.length > 0 && (
                 <Typography variant="subtitle2" sx={{ 
                   p: { xs: 1, sm: 2 }, 
                   pb: 0, 
                   color: '#ef4565', 
                   letterSpacing: '0.05em',
                   fontFamily: '"IBM Plex Sans Thai", "Sarabun", sans-serif',
                   fontWeight: 'bold',
                   fontSize: { xs: '0.95rem', sm: '1.1rem' }
                 }}>
                   🔎 ผู้ต้องสงสัยคนอื่น
                 </Typography>
               )}
               <Box className="game-play-layout__players" sx={{ flex: 1 }}>
                 {otherSuspects.map((player) => (
                   <PlayerPanel 
                     key={player.playerkey || player.index} 
                     player={player} 
                     guess={guess}
                     onCardClick={handleCardClick}
                     currentPlayer={currentPlayer}
                   />
                 ))}
               </Box>
            </Box>

          </Box>
        </Box>
      </Box>

      {/* Vote Bar */}
      <VoteBar guess={guess} onVoteClick={handleSendGuess} currentPlayer={currentPlayer} />
    </Box>
  );
}
