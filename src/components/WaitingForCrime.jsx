import React from 'react';
import { Box, Typography, Paper, Grid, Fade, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import GameCard from './GameCard';
import detectiveAvatar from '@/assets/detective_avatar_new.png';
import showcaseBg from '@/assets/card_showcase.webp';

export default function WaitingForCrime({ game, player }) {
  const navigate = useNavigate();

  const means = (Array.isArray(game?.means) ? game.means : Object.values(game?.means || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);
  const clues = (Array.isArray(game?.clues) ? game.clues : Object.values(game?.clues || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        position: 'relative',
        width: '100%', 
        p: { xs: 2, md: 4 },
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
              backgroundImage: `url(${detectiveAvatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid rgba(100, 255, 218, 0.5)',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 0 30px rgba(100, 255, 218, 0.1)'
            }}>
              
              {/* Name Tag removed as per user request to hide the English text, since it's already in the image */}
            </Box>
            
            {/* Waiting status text */}
            <Box sx={{ mt: { xs: 2, md: 4 }, display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} sx={{ color: '#64ffda' }} />
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                กำลังรอฆาตกร...
              </Typography>
            </Box>
          </Grid>

          {/* Right Column - Cards */}
          <Grid item xs={12} md={8}>
            
            {/* Evidence Row (Clues) */}
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
                หลักฐาน
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                {clues.length > 0 ? clues.map((clue, index) => (
                  <Box key={index}>
                    <GameCard name={clue} type="clues" disabled={true} />
                  </Box>
                )) : (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', gridColumn: 'span 4', textAlign: 'center' }}>
                    ไม่มีหลักฐาน
                  </Typography>
                )}
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
                {means.length > 0 ? means.map((mean, index) => (
                  <Box key={index}>
                    <GameCard name={mean} type="means" disabled={true} />
                  </Box>
                )) : (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', gridColumn: 'span 4', textAlign: 'center' }}>
                    ไม่มีอาวุธ
                  </Typography>
                )}
              </Box>
            </Box>
            
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
