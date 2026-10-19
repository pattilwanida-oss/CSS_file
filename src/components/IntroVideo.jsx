import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function IntroVideo({ onComplete }) {
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [mutedByBrowser, setMutedByBrowser] = useState(false);
  const videoRef = useRef(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }, [onComplete]);

  // Mobile browsers often block autoplay with sound: retry muted, and never leave the player stuck
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        video.muted = true;
        setMutedByBrowser(true);
        video.play().catch(() => {});
      });
    }
    const fallback = setTimeout(finish, 60000);
    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(fallback);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setMutedByBrowser(false);
    }
  };

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
      height: '100dvh',
      touchAction: 'manipulation',
      bgcolor: 'black',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <video 
        ref={videoRef}
        src="/1000007835.mp4" 
        autoPlay 
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={finish}
        onError={finish}
        style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
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

      <Button
        onClick={finish}
        variant="outlined"
        sx={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
          zIndex: 2,
          minWidth: 64,
          minHeight: 44,
          px: 2.5,
          color: 'white',
          borderColor: 'rgba(255,255,255,0.6)',
          bgcolor: 'rgba(0,0,0,0.5)',
          fontFamily: '"Chakra Petch", sans-serif',
          '&:hover': { borderColor: 'white', bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        ข้าม
      </Button>

      {mutedByBrowser && (
        <Button
          onClick={handleUnmute}
          size="small"
          sx={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
            left: 'calc(env(safe-area-inset-left, 0px) + 16px)',
            zIndex: 2,
            minHeight: 44,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
          }}
        >
          🔇 แตะเพื่อเปิดเสียง
        </Button>
      )}
    </Box>
  );
}
