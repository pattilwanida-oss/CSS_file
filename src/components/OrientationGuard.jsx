import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import './OrientationGuard.css';

export default function OrientationGuard() {
  useEffect(() => {
    // Attempt standard orientation lock if supported by the browser (e.g. mobile Chrome PWA/fullscreen)
    const lockPortrait = async () => {
      try {
        if (window.screen?.orientation?.lock) {
          await window.screen.orientation.lock('portrait');
        }
      } catch {
        // Ignored as orientation lock requires fullscreen or is unsupported on some browsers
      }
    };

    lockPortrait();

    const handleOrientationChange = () => {
      lockPortrait();
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <Box className="orientation-guard" role="alert" aria-live="assertive">
      <Box className="orientation-guard-card">
        <Box className="orientation-guard-icon-wrapper">
          <ScreenRotationIcon className="orientation-guard-icon" />
        </Box>
        <Typography variant="h6" className="orientation-guard-title">
          กรุณาหมุนโทรศัพท์เป็นแนวตั้ง
        </Typography>
        <Typography variant="body2" className="orientation-guard-desc">
          เกมนี้ถูกออกแบบมาเพื่อประสบการณ์การเล่นที่ดีที่สุดในหน้าจอแนวตั้งเท่านั้น
        </Typography>
      </Box>
    </Box>
  );
}
