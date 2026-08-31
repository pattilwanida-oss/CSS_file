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
              fontWeight: 900, 
              mb: 1,
              fontFamily: '"kingthings_trypewriter_2Rg", serif',
              letterSpacing: '0.1em',
              color: isDetectivesWin ? '#64ffda' : '#ff4444',
              textShadow: isDetectivesWin ? '0 0 20px rgba(100,255,218,0.5)' : '0 0 20px rgba(255,68,68,0.5)'
            }}
          >
            {isDetectivesWin ? 'นักสืบชนะ' : 'ฆาตกรชนะ'}
          </Typography>
          
          <Typography variant="h6" sx={{ color: 'var(--color-ink-muted)', mb: 6, fontStyle: 'italic' }}>
            {isDetectivesWin 
              ? 'ไขคดีสำเร็จ ฆาตกรถูกจับได้แล้ว!'
              : 'ความจริงถูกฝังเอาไว้ ฆาตกรหลบหนีไปได้...'}
          </Typography>

          {/* Reveal Section */}
          <Paper elevation={24} sx={{
            p: { xs: 3, md: 5 },
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDetectivesWin ? 'rgba(100,255,218,0.2)' : 'rgba(255,68,68,0.2)'}`,
            borderRadius: 4,
            mb: 4
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
              ความจริงเปิดเผย
            </Typography>

            <Grid container spacing={4} justifyContent="center" alignItems="center">
              
              {/* Murderer Profile */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '2px solid #ff4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    mb: 2,
                    boxShadow: '0 0 20px rgba(255,68,68,0.3)'
                  }}>
                    🎭
                  </Box>
                  <Typography variant="h6" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
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
                    <Box sx={{ width: '120px', mx: 'auto' }}>
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
                    <Box sx={{ width: '120px', mx: 'auto' }}>
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
