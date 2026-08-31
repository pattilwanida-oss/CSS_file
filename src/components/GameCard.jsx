import React from 'react';
import { Box, Typography } from '@mui/material';
import { getCardImage } from '../data/cardImages.js';

export default function GameCard({ name, image: imageProp, type, selected, disabled, onClick }) {
  // type: 'means' (blue) | 'clues' (red)
  const isMeans = type === 'means';
  const image = imageProp || getCardImage(name, type);
  
  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      role={onClick && !disabled ? "button" : "presentation"}
      tabIndex={onClick && !disabled ? 0 : -1}
      aria-pressed={selected}
      aria-label={name}
      sx={{
        width: '100%',
        minWidth: '80px',
        maxWidth: { xs: '100%', sm: '140px' },
        cursor: disabled ? 'default' : (onClick ? 'pointer' : 'default'),
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: selected
          ? '2px solid var(--color-accent)'
          : '1px solid var(--color-border-subtle)',
        background: 'var(--color-surface)',
        boxShadow: selected ? 'var(--shadow-glow-accent)' : 'var(--shadow-card)',
        transform: selected ? 'translateY(-4px) scale(1.03)' : 'none',
        transition: `all var(--duration-fast) var(--ease-out-quart)`,
        opacity: disabled && !selected ? 0.6 : 1,
        position: 'relative',
        '&:hover': onClick && !disabled ? {
          borderColor: isMeans ? 'var(--color-primary)' : 'var(--color-accent)',
          boxShadow: isMeans ? 'var(--shadow-glow-primary)' : 'var(--shadow-glow-accent)',
          transform: 'translateY(-2px)',
        } : {},
        '&:focus-visible': {
          outline: '2px solid var(--color-accent)',
          outlineOffset: '2px',
        },
      }}
    >
      {/* Selected checkmark badge */}
      {selected && (
        <Box className="card-selected-badge" sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem',
          fontWeight: 700,
          zIndex: 1,
          boxShadow: '0 2px 8px var(--color-accent-glow)',
          animation: 'badgePop var(--duration-normal) var(--ease-out-expo)',
          '@keyframes badgePop': {
            from: { transform: 'scale(0)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 }
          }
        }}>
          ✓
        </Box>
      )}

      {/* Card Image Area */}
      <Box sx={{
        aspectRatio: '3/4',
        background: isMeans
          ? 'linear-gradient(135deg, oklch(0.18 0.04 250), oklch(0.14 0.02 250))'
          : 'linear-gradient(135deg, oklch(0.18 0.04 15), oklch(0.14 0.02 15))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {image ? (
          <img
            src={image}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Box sx={{ 
            width: '85%', 
            height: '85%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: isMeans ? 'rgba(220, 38, 38, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: '4px'
          }}>
            <Typography sx={{ opacity: 0.5, fontSize: '1.5rem', mb: 0.5 }}>
              {isMeans ? '🗡️' : '🔍'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.4, letterSpacing: '1px', fontSize: '0.5rem', textTransform: 'uppercase', textAlign: 'center' }}>
              IMAGE MOCKUP
            </Typography>
          </Box>
        )}
        
        {/* Subtle inner shadow overlay */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }} />
      </Box>

      {/* Card Name */}
      <Box sx={{
        p: { xs: 0.5, sm: 1 },
        textAlign: 'center',
        borderTop: `1px solid ${
          isMeans
            ? 'oklch(0.6 0.18 250 / 0.2)'
            : 'oklch(0.6 0.22 15 / 0.2)'
        }`,
        bgcolor: 'rgba(0,0,0,0.3)',
      }}>
        <Typography sx={{
          fontSize: { xs: '0.7rem', sm: 'var(--text-xs)' },
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: 'white',
          lineHeight: 1.2,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {name}
        </Typography>
      </Box>
    </Box>
  );
}
