import React from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useTranslate } from '@/i18n/TranslateContext';

export default function WaitingForCrime({ isMurderer }) {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        bgcolor: '#000',
        color: '#fff',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: 'rgba(255,255,255,0.1)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Night Phase')}
        </Typography>
        
        <CircularProgress color="error" size={60} />
        
        <Typography variant="h6" sx={{ mt: 2 }}>
          {isMurderer 
            ? t('Select your weapon and evidence to commit the crime.')
            : t('A crime is taking place in the dark. Please wait for the Murderer...')}
        </Typography>
      </Paper>
    </Box>
  );
}
