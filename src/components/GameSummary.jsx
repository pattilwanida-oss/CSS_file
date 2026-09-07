import React from 'react';
import { Box, Typography, Paper, Grid, Fade, Button } from '@mui/material';
import GameCard from './GameCard';

export default function GameSummary({ game }) {

  const isDetectivesWin = game.winner === 'detectives';
  const murdererPlayer = Object.values(game.players).find(p => p.index === game.murderer);

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        background: isDetectivesWin 
          ? 'radial-gradient(circle at center, #0a192f 0%, #020c1b 100%)'
          : 'radial-gradient(circle at center, #2b0505 0%, #0a0000 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '300px', md: '600px' },
          height: { xs: '300px', md: '600px' },
          background: isDetectivesWin 
            ? 'radial-gradient(circle, rgba(100,255,218,0.1) 0%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(255,68,68,0.1) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          zIndex: 0,
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '900px' }}>
          
          {/* Winner Title */}
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.75rem' },
              fontWeight: 900, 
              mb: 1,
              fontFamily: '"kingthings_trypewriter_2Rg", serif',
              letterSpacing: '0.05em',
              color: isDetectivesWin ? '#64ffda' : '#ff4444',
              textShadow: isDetectivesWin ? '0 0 20px rgba(100,255,218,0.5)' : '0 0 20px rgba(255,68,68,0.5)'
            }}
          >
            {isDetectivesWin ? 'นักสืบชนะ' : 'ฆาตกรชนะ'}
          </Typography>
          
          <Typography variant="h6" sx={{ color: 'var(--color-ink-muted)', mb: { xs: 3, md: 6 }, fontStyle: 'italic', fontSize: { xs: '0.95rem', sm: '1.25rem' }, px: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            {isDetectivesWin 
              ? 'ไขคดีสำเร็จ ฆาตกรถูกจับได้แล้ว!'
              : 'ความจริงถูกฝังเอาไว้ ฆาตกรหลบหนีไปได้...'}
          </Typography>

          {/* Reveal Section */}
          <Paper elevation={24} sx={{
            p: { xs: 2, sm: 3, md: 5 },
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDetectivesWin ? 'rgba(100,255,218,0.2)' : 'rgba(255,68,68,0.2)'}`,
            borderRadius: 4,
            mb: { xs: 3, md: 4 }
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: { xs: 2, md: 4 }, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              ความจริงเปิดเผย
            </Typography>

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" alignItems="center">
              
              {/* Murderer Profile */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '2px solid #ff4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: { xs: '2.2rem', sm: '3rem' },
                    mb: 1.5,
                    boxShadow: '0 0 20px rgba(255,68,68,0.3)'
                  }}>
                    🎭
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ff4444', fontWeight: 'bold', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {murdererPlayer?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)' }}>
                    ฆาตกร
                  </Typography>
                </Box>
              </Grid>

              {/* Crime Details */}
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-ink-muted)' }}>อาวุธ</Typography>
                    <Box sx={{ width: { xs: '100px', sm: '120px' }, mx: 'auto' }}>
                      <GameCard 
                        name={game.murdererChoice?.mean} 
                        type="means" 
                        selected={true} 
                        disabled={true} 
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-ink-muted)' }}>หลักฐาน</Typography>
                    <Box sx={{ width: { xs: '100px', sm: '120px' }, mx: 'auto' }}>
                      <GameCard 
                        name={game.murdererChoice?.key} 
                        type="clues" 
                        selected={true} 
                        disabled={true} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Action Button */}
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => window.location.href = '/'}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            กลับไปหน้าหลัก
          </Button>

        </Box>
      </Box>
    </Fade>
  );
}
