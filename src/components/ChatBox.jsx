import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Fab } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { useGame } from '@/store/GameContext';
import { useTranslate } from '@/i18n/TranslateContext';

export default function ChatBox() {
  const { game, player, actions } = useGame();
  const { t } = useTranslate();
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
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        {isOpen ? <CloseIcon /> : (
          <Box sx={{ position: 'relative', display: 'flex' }}>
            <ChatIcon />
            {unread > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {unread}
              </Box>
            )}
          </Box>
        )}
      </Fab>

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 320,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          {/* Header */}
          <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t('Chat')}
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'inherit' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.default' }}>
            {game.chat && game.chat.length > 0 ? (
              game.chat.map((msg, index) => {
                const isMe = msg.sender === player.name;
                return (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 0.5, mr: 0.5 }}>
                      {msg.sender}
                    </Typography>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        px: 1.5,
                        maxWidth: '85%',
                        bgcolor: isMe ? 'primary.main' : 'background.paper',
                        color: isMe ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Paper>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                {t('No messages yet.')}
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box component="form" onSubmit={handleSend} sx={{ p: 1, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder={t('Type a message...')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              autoComplete="off"
            />
            <IconButton type="submit" color="primary" disabled={!message.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
