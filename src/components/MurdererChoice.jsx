import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Typography,
  Box,
  Fade,
  Paper,
  keyframes,
  IconButton,
  Tooltip
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/store/GameContext';

import GameCard from './GameCard';
import murdererAvatar from '@/assets/murderer_avatar_new.png';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

export default function MurdererChoice({ game, player, onChoice }) {
  const { actions } = useGame();
  const navigate = useNavigate();

  const [murdererChoice, setMurdererChoice] = useState({ mean: null, key: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (game.murdererChoice) {
      setMurdererChoice({
        mean: game.murdererChoice.mean,
        key: game.murdererChoice.key,
      });
    }
  }, [game.murdererChoice]);

  const means = (Array.isArray(game?.means) ? game.means : Object.values(game?.means || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);
  const clues = (Array.isArray(game?.clues) ? game.clues : Object.values(game?.clues || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);

  const handleSendChoice = async () => {
    setIsSubmitting(true);
    await actions.setMurdererChoice({
      gamekey: game.gamekey,
      choice: murdererChoice,
    });
    if (onChoice) onChoice();
  };

  const isComplete = murdererChoice.mean && murdererChoice.key;
  const hasSubmitted = !!game.murdererChoice;

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        position: 'relative',
        width: '100%', 
        p: { xs: 2, md: 3 },
        bgcolor: 'transparent',
        height: '100%',
        overflowY: 'auto',
      }}>
        <Tooltip title={'ออกจากเกม'}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'var(--color-error-main)', zIndex: 10 }}
          >
            <ExitToApp />
          </IconButton>
        </Tooltip>
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ maxWidth: '1200px', mx: 'auto' }}>
          
          {/* Left Column - Role */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                fontFamily: '"kingthings_trypewriter_2Rg", serif',
                letterSpacing: '0.05em',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                mb: { xs: 2, md: 4 },
                textAlign: 'center'
              }}
            >
              บทบาทของฉัน
            </Typography>
            
            {/* Avatar Card */}
            <Box sx={{
              width: '100%',
              maxWidth: { xs: '200px', sm: '260px', md: '300px' },
              aspectRatio: '3/4',
              bgcolor: '#111',
              backgroundImage: `url(${murdererAvatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid rgba(255, 68, 68, 0.5)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.2)'
            }}>
              
              {/* Name Tag removed as per user request to hide the English text, since it's already in the image */}
            </Box>
          </Grid>

          {/* Right Column - Cards */}
          <Grid item xs={12} md={8}>
            
            {/* Evidence Row (Clues) */}
            <Box sx={{ mb: { xs: 2.5, md: 4 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff', 
                  fontFamily: '"kingthings_trypewriter_2Rg", serif',
                  letterSpacing: '0.05em',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  mb: 1 
                }}
              >
                หลักฐาน
              </Typography>
              <Typography variant="body1" sx={{ color: 'var(--color-ink-muted)', mb: { xs: 1.5, sm: 3 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                เลือก 1 หลักฐานและ 1 อาวุธเพื่อก่ออาชญากรรม
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                {clues.map((clue, index) => (
                  <Box key={index} sx={{ animation: `${floatAnimation} ${3.5 + index * 0.5}s ease-in-out infinite` }}>
                    <GameCard
                      name={clue}
                      type="clues"
                      selected={murdererChoice.key === clue}
                      disabled={hasSubmitted}
                      onClick={() => !hasSubmitted && setMurdererChoice((prev) => ({ ...prev, key: clue }))}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Weapon Row (Means) */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff', 
                  fontFamily: '"kingthings_trypewriter_2Rg", serif',
                  letterSpacing: '0.1em',
                  mb: 2 
                }}
              >
                อาวุธ
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                {means.map((mean, index) => (
                  <Box key={index} sx={{ animation: `${floatAnimation} ${3 + index * 0.5}s ease-in-out infinite` }}>
                    <GameCard
                      name={mean}
                      type="means"
                      selected={murdererChoice.mean === mean}
                      disabled={hasSubmitted}
                      onClick={() => !hasSubmitted && setMurdererChoice((prev) => ({ ...prev, mean }))}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Confirm Button */}
            {!hasSubmitted && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, sm: 5 } }}>
                <Button
                  variant="outlined"
                  disabled={!isComplete || isSubmitting}
                  onClick={handleSendChoice}
                  sx={{
                    px: { xs: 3, sm: 6 },
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '0.95rem', sm: '1.2rem' },
                    letterSpacing: { xs: '0.05em', sm: '0.1em' },
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '4px',
                    bgcolor: isComplete ? 'rgba(220, 38, 38, 0.2)' : 'transparent',
                    boxShadow: isComplete ? '0 0 15px rgba(220, 38, 38, 0.4)' : 'none',
                    animation: isComplete ? `${pulseAnimation} 2s infinite` : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: isComplete ? 'rgba(220, 38, 38, 0.4)' : 'rgba(255,255,255,0.1)'
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255,255,255,0.3)',
                      borderColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  ยืนยัน
                </Button>
              </Box>
            )}
            
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
