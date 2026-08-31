import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Fab, Fade } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';


export default function ChatBox() {
  const { game, player, actions } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const prevChatLenRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const currentLen = game?.chat?.length || 0;
    
    if (isOpen) {
      scrollToBottom();
      setUnread(0);
    } else if (currentLen > prevChatLenRef.current) {
      setUnread(prev => prev + (currentLen - prevChatLenRef.current));
    }
    
    prevChatLenRef.current = currentLen;
  }, [game?.chat, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && player && game) {
      actions.sendChatMessage({
        gamekey: game.gamekey,
        player,
        text: message.trim()
      });
      setMessage('');
    }
  };

  if (!game || !player) return null;

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color={unread > 0 ? "error" : "primary"}
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 24 },
          right: 24,
          zIndex: 1000,
          boxShadow: unread > 0 ? 'var(--shadow-glow-accent)' : 'var(--shadow-glow-primary)',
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
                  bgcolor: 'var(--color-surface)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '2px solid var(--color-accent)'
                }}
              >
                {unread > 9 ? '9+' : unread}
              </Box>
            )}
          </Box>
        )}
      </Fab>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: { xs: 140, sm: 90 },
            right: { xs: 16, sm: 24 },
            width: { xs: 'calc(100vw - 32px)', sm: 340 },
            height: { xs: 360, sm: 480 },
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(59, 130, 246, 0.1)', 
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
              💬 แชทกลุ่ม
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'var(--color-ink-muted)' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {game.chat && game.chat.length > 0 ? (
              game.chat.map((msg, index) => {
                const isMe = msg.sender === player.name;
                return (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <Typography variant="caption" sx={{ color: 'var(--color-ink-dim)', mb: 0.5, ml: 1, mr: 1, fontSize: '0.7rem' }}>
                      {msg.sender}
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        maxWidth: '85%',
                        bgcolor: isMe ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                        color: 'white',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        border: isMe ? 'none' : '1px solid var(--color-border-subtle)',
                        wordBreak: 'break-word',
                        boxShadow: isMe ? 'var(--shadow-glow-primary)' : 'none'
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: 'var(--color-ink-dim)', fontStyle: 'italic' }}>
                  ยังไม่มีข้อความ เริ่มบทสนทนาได้เลย!
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box component="form" onSubmit={handleSend} sx={{ 
            p: 1.5, 
            bgcolor: 'rgba(0,0,0,0.2)', 
            borderTop: '1px solid var(--color-border-subtle)', 
            display: 'flex', 
            gap: 1 
          }}>
            <TextField
              size="small"
              fullWidth
              placeholder={'พิมพ์ข้อความ...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              autoComplete="off"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 'var(--radius-full)',
                  bgcolor: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'var(--color-border-subtle)' },
                  '&:hover fieldset': { borderColor: 'var(--color-ink-muted)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
                },
                '& input': {
                  py: 1.5,
                  px: 2,
                }
              }}
            />
            <IconButton 
              type="submit" 
              color="primary" 
              disabled={!message.trim()}
              sx={{ 
                bgcolor: message.trim() ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
