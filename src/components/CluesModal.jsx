import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close as CloseIcon, Search, Lightbulb } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';

export default function CluesModal({ open, onClose, onOpen }) {
  const { game } = useGame();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  const visibleAnalysis = game?.forensicAnalysis || [];
  const cluesCount = visibleAnalysis.length;

  useEffect(() => {
    if (!open) {
      setDragY(0);
      setIsDragging(false);
    }
  }, [open]);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = touch.clientY;
    touchStartTimeRef.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const touch = e.touches[0];
    const delta = touch.clientY - touchStartRef.current;
    setDragY(delta);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);
    const touchDuration = Date.now() - touchStartTimeRef.current;
    const delta = dragY;
    const velocity = Math.abs(delta) / (touchDuration || 1);

    // Swipe down (> 60px), swipe up (< -60px), or fast flick (> 25px with velocity > 0.35)
    if (delta > 60 || delta < -60 || (Math.abs(delta) > 25 && velocity > 0.35)) {
      onClose();
    }
    setDragY(0);
  };

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: () => {
      setIsDragging(false);
      setDragY(0);
    }
  };

  if (!game) return null;

  return (
    <>
      {/* Floating Clues Action Button (Mobile Thumb Zone - Bottom Left) */}
      {!game.finished && onOpen && (
        <Fab
          color="primary"
          aria-label="clues"
          onClick={open ? onClose : onOpen}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 24 },
            left: { xs: 16, sm: 24 },
            zIndex: 1050,
            display: { xs: open ? 'none' : 'flex', md: 'none' },
            bgcolor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(16px)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.45)',
            boxShadow: '0 0 18px rgba(59, 130, 246, 0.35), 0 8px 24px rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(30, 41, 59, 0.98)',
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.55)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Box sx={{ position: 'relative', display: 'flex' }}>
            <Search />
            {cluesCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  bgcolor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  border: '2px solid #070a13',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)',
                  animation: 'cluePulse 2s ease-in-out infinite',
                  '@keyframes cluePulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' }
                  }
                }}
              >
                {cluesCount}
              </Box>
            )}
          </Box>
        </Fab>
      )}

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(10, 15, 30, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: { xs: '20px 20px 0 0', sm: '16px' },
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(59, 130, 246, 0.2)',
            maxHeight: { xs: '80dvh', sm: '75dvh' },
            m: { xs: 0, sm: 2 },
            position: { xs: 'fixed', sm: 'relative' },
            bottom: { xs: 0, sm: 'auto' },
            left: { xs: 0, sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: 'auto' },
            transform: isMobile && dragY !== 0 ? `translateY(${dragY}px)` : 'none',
            opacity: isMobile && dragY !== 0 ? Math.max(0.15, 1 - Math.abs(dragY) / 300) : 1,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease',
          }
        }}
      >
        {/* Pull Handle (Mobile) with Swipe Up/Down Gesture */}
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1.2,
              pb: 0.5,
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }}
            {...swipeHandlers}
            onClick={onClose}
          >
            <Box sx={{ width: 44, height: 4, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.35)' }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.4)',
                mt: 0.4,
                fontFamily: '"Chakra Petch", sans-serif',
              }}
            >
              ↕ ปัดขึ้นหรือลงเพื่อปิด
            </Typography>
          </Box>
        )}

        {/* Title Header */}
        <DialogTitle
          {...(isMobile ? swipeHandlers : {})}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            bgcolor: 'rgba(59, 130, 246, 0.08)',
            cursor: isMobile ? 'grab' : 'default',
            touchAction: isMobile ? 'none' : 'auto',
            userSelect: 'none',
          }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}
          >
            <Lightbulb fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700, color: '#fff' }}>
              คำใบ้จากนักนิติวิทยาศาสตร์ AI
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--color-ink-muted)' }}>
              วิเคราะห์หลักฐานและอาวุธในที่เกิดเหตุ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${cluesCount} คำใบ้`}
            size="small"
            sx={{
              bgcolor: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 24
            }}
          />
          <IconButton size="small" onClick={onClose} sx={{ color: 'var(--color-ink-muted)', '&:hover': { color: '#fff' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Clues Content List */}
      <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {visibleAnalysis.length > 0 ? (
          visibleAnalysis.map((item, index) => {
            const title = game.analysis?.[index]?.title || `การวิเคราะห์ที่ ${index + 1}`;
            const text = typeof item === 'string' ? item : item?.selection || JSON.stringify(item);

            return (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                  <Chip
                    label={`คำใบ้ที่ ${index + 1}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: 'rgba(239, 69, 101, 0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 69, 101, 0.3)'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#60a5fa',
                      fontFamily: '"Chakra Petch", sans-serif',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#f1f5f9',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {text}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Search sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />
            <Typography variant="body1" sx={{ color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              ยังไม่มีคำใบ้ในรอบนี้
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-ink-dim)', mt: 0.5 }}>
              คำใบ้จาก AI จะปรากฏเมื่อเกมดำเนินสู่รอบถัดไป
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={onClose}
          sx={{
            borderRadius: '10px',
            fontFamily: '"Chakra Petch", sans-serif',
            fontWeight: 700,
            py: 1
          }}
        >
          ปิดหน้าต่าง
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
}
