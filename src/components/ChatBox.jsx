import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Fade,
  Slide,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  NotificationsActive as NotiIcon
} from '@mui/icons-material';
import { useGame } from '@/store/GameContext';

// Helper to synthesize a subtle, pleasant notification chime without external assets
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: E5 (659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Tone 2: A5 (880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  } catch {
    // Ignore autoplay or audio context constraints
  }
};

const formatTime = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const getSenderColor = (name, isMe) => {
  if (isMe) return 'var(--color-primary, #3b82f6)';
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#14b8a6'];
  return colors[Math.abs(hash) % colors.length];
};

export default function ChatBox() {
  const { game, player, actions } = useGame();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const [notification, setNotification] = useState(null);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  const messagesEndRef = useRef(null);
  const prevChatLenRef = useRef(0);
  const notifTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

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
      setIsOpen(false);
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

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const currentLen = game?.chat?.length || 0;

    if (isOpen) {
      scrollToBottom();
      setUnread(0);
      setNotification(null);
    } else if (currentLen > prevChatLenRef.current) {
      const newMessagesCount = currentLen - prevChatLenRef.current;
      setUnread((prev) => prev + newMessagesCount);

      const latestMsg = game.chat[currentLen - 1];
      if (latestMsg && latestMsg.sender !== player?.name) {
        setNotification(latestMsg);
        playNotificationSound();

        if (notifTimeoutRef.current) {
          clearTimeout(notifTimeoutRef.current);
        }
        notifTimeoutRef.current = setTimeout(() => {
          setNotification(null);
        }, 4500);
      }
    }

    prevChatLenRef.current = currentLen;
  }, [game?.chat, isOpen, player?.name]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && player && game) {
      actions.sendChatMessage({
        gamekey: game.gamekey,
        player,
        text: message.trim()
      });
      setMessage('');
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  };

  const handleOpenChatFromNoti = () => {
    setIsOpen(true);
    setNotification(null);
  };

  if (!game || !player) return null;

  return (
    <>
      {/* Top Banner Toast Notification */}
      <Slide in={Boolean(notification && !isOpen)} direction="down" mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          onClick={handleOpenChatFromNoti}
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 24 },
            left: { xs: 12, sm: 'auto' },
            right: { xs: 12, sm: 24 },
            width: { xs: 'calc(100vw - 24px)', sm: '380px' },
            zIndex: 2000,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            borderRadius: '16px',
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(2px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 24px rgba(59, 130, 246, 0.5)',
            }
          }}
        >
          <Avatar
            sx={{
              bgcolor: notification ? getSenderColor(notification.sender, false) : '#3b82f6',
              width: 40,
              height: 40,
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {notification?.sender?.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#60a5fa', fontSize: '0.88rem' }}>
                💬 {notification?.sender}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                {formatTime(notification?.timestamp)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#f1f5f9',
                fontSize: '0.85rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mt: 0.2
              }}
            >
              {notification?.text}
            </Typography>
          </Box>
          <Chip
            label="เปิดดู"
            size="small"
            sx={{
              bgcolor: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 26,
              flexShrink: 0
            }}
          />
        </Paper>
      </Slide>

      {/* Mobile Backdrop */}
      {isOpen && isMobile && (
        <Box
          onClick={() => setIsOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1100,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* Floating Action Button (Hidden on mobile when chat is opened) */}
      <Fab
        color={unread > 0 ? "error" : "primary"}
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1050,
          display: { xs: isOpen ? 'none' : 'flex', sm: 'flex' },
          boxShadow: unread > 0 ? 'var(--shadow-glow-accent, 0 0 20px rgba(239, 69, 101, 0.5))' : 'var(--shadow-glow-primary, 0 0 20px rgba(59, 130, 246, 0.4))',
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? <CloseIcon /> : (
          <Box sx={{ position: 'relative', display: 'flex' }}>
            <ChatIcon />
            {unread > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  bgcolor: 'var(--color-accent, #ef4565)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '2px solid #070a13',
                  boxShadow: '0 0 10px rgba(239, 69, 101, 0.7)',
                  animation: 'unreadPulse 1.8s ease-in-out infinite',
                  '@keyframes unreadPulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' }
                  }
                }}
              >
                {unread > 9 ? '9+' : unread}
              </Box>
            )}
          </Box>
        )}
      </Fab>

      {/* Chat Window (Bottom Sheet on Mobile, Floating Card on Desktop) */}
      <Fade in={isOpen}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            zIndex: 1200,
            bottom: { xs: 0, sm: 90 },
            right: { xs: 0, sm: 24 },
            left: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: 360 },
            height: { xs: '75dvh', sm: 500 },
            maxHeight: { xs: '85dvh', sm: 'calc(100vh - 120px)' },
            borderRadius: { xs: '20px 20px 0 0', sm: '16px' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--color-surface, rgba(15, 23, 42, 0.95))',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
            borderBottom: { xs: 'none', sm: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))' },
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            transform: isMobile && isOpen && dragY !== 0 ? `translateY(${dragY}px)` : 'none',
            opacity: isMobile && isOpen && dragY !== 0 ? Math.max(0.15, 1 - Math.abs(dragY) / 300) : 1,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s ease',
          }}
        >
          {/* Pull Handle Bar (Mobile Only) with Swipe Up/Down Gesture */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1.2,
              pb: 0.5,
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none',
            }}
            {...swipeHandlers}
            onClick={() => setIsOpen(false)}
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

          {/* Header */}
          <Box
            {...(isMobile ? swipeHandlers : {})}
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: 'rgba(59, 130, 246, 0.08)',
              borderBottom: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isMobile ? 'grab' : 'default',
              touchAction: isMobile ? 'none' : 'auto',
              userSelect: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'var(--color-primary, #3b82f6)', fontFamily: '"Chakra Petch", sans-serif', letterSpacing: '0.05em' }}>
                💬 แชทสืบสวน
              </Typography>
              {game?.chat?.length > 0 && (
                <Chip label={`${game.chat.length}`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }} />
              )}
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'var(--color-ink-muted, #94a3b8)', '&:hover': { color: '#fff' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {game.chat && game.chat.length > 0 ? (
              game.chat.map((msg, index) => {
                const isMe = msg.sender === player.name;
                const senderColor = getSenderColor(msg.sender, isMe);
                return (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.4, px: 0.5 }}>
                      {!isMe && (
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.65rem', bgcolor: senderColor, color: '#fff', fontWeight: 'bold' }}>
                          {msg.sender.slice(0, 1).toUpperCase()}
                        </Avatar>
                      )}
                      <Typography variant="caption" sx={{ color: isMe ? 'var(--color-ink-dim, #64748b)' : senderColor, fontWeight: 600, fontSize: '0.75rem' }}>
                        {isMe ? 'คุณ' : msg.sender}
                      </Typography>
                      {msg.timestamp && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
                          {formatTime(msg.timestamp)}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        maxWidth: { xs: '88%', sm: '80%' },
                        bgcolor: isMe ? 'var(--color-primary, #3b82f6)' : 'rgba(255, 255, 255, 0.08)',
                        color: 'white',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                        wordBreak: 'break-word',
                        boxShadow: isMe ? '0 4px 14px rgba(59, 130, 246, 0.35)' : '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: 'inherit' }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: 'var(--color-ink-dim, #64748b)', fontStyle: 'italic' }}>
                  ยังไม่มีข้อความ เริ่มบทสนทนาได้เลย!
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box component="form" onSubmit={handleSend} sx={{
            p: 1.5,
            pb: { xs: 'calc(12px + env(safe-area-inset-bottom, 0px))', sm: 1.5 },
            bgcolor: 'rgba(0,0,0,0.3)',
            borderTop: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))',
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}>
            <TextField
              size="small"
              fullWidth
              placeholder="พิมพ์ข้อความ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              autoComplete="off"
              inputProps={{ enterKeyHint: 'send' }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 'var(--radius-full, 9999px)',
                  bgcolor: 'rgba(0,0,0,0.3)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--color-primary, #3b82f6)' },
                },
                '& input': {
                  py: 1.2,
                  px: 2,
                  fontSize: '0.9rem',
                  color: '#fff',
                }
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!message.trim()}
              sx={{
                bgcolor: message.trim() ? 'var(--color-primary, #3b82f6)' : 'transparent',
                color: message.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: message.trim() ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none',
                '&:hover': { bgcolor: message.trim() ? '#2563eb' : 'transparent' },
                transition: 'all 0.2s ease',
                width: 40,
                height: 40,
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
