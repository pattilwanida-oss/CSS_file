import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function IntroVideo({ onComplete }) {
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);

  const narrativeTexts = [
    "คดีฆาตกรรมสะเทือนขวัญกลางฮ่องกงเริ่มต้นขึ้นแล้ว! ทีมนักสืบต้องตามหา วิธีการฆ่า และ หลักฐานสำคัญ จากเบาะแสของนักนิติเวช",
    "แต่จงระวังให้ดี... ฆาตกรแฝงตัวอยู่ในกลุ่มพวกคุณ และมันจะคอยปั่นหัวทุกคนให้หลงทาง",
    "จงใช้ไหวพริบกระชากหน้ากากคนร้ายออกมา ก่อนที่มันจะก่ออาชญากรรมสมบูรณ์แบบและลอยนวลไปตลอดกาล... เริ่มการสืบสวนได้!"
  ];

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      const progress = video.currentTime / video.duration;
      const index = Math.min(
        narrativeTexts.length - 1,
        Math.floor(progress * narrativeTexts.length)
      );
      if (index !== currentSubtitleIndex) {
        setCurrentSubtitleIndex(index);
      }
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      bgcolor: 'black',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <video 
        src="/1000007835.mp4" 
        autoPlay 
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={onComplete}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      
      {/* Subtitles Overlay */}
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: '800px',
        textAlign: 'center',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {narrativeTexts.map((text, i) => (
          <Typography
            key={i}
            sx={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              color: 'white',
              fontFamily: '"kingthings_trypewriter_2Rg", serif',
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              textShadow: '0px 2px 10px rgba(0,0,0,0.8), 0px 4px 20px rgba(0,0,0,0.6)',
              opacity: currentSubtitleIndex === i ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              lineHeight: 1.5,
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>

      <Typography 
        onClick={onComplete}
        sx={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          fontFamily: '"Chakra Petch", sans-serif',
          '&:hover': { color: 'white' },
          pointerEvents: 'auto'
        }}
      >
        ข้าม
      </Typography>
    </Box>
  );
}
