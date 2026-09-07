import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import GameCard from './GameCard';
import { useGame } from '@/store/GameContext';

import './GamePlayLayout.css';

export default function PlayerPanel({ player, guess, onCardClick, currentPlayer }) {
  const { game } = useGame();

  const means = (Array.isArray(game?.means) ? game.means : Object.values(game?.means || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);
  const clues = (Array.isArray(game?.clues) ? game.clues : Object.values(game?.clues || {})).slice((player?.index || 0) * 4, (player?.index || 0) * 4 + 4);

  const isVotingPhase = game.phase === 'voting';

  // Can click if the currentPlayer is playing, 
  // and currentPlayer hasn't guessed/passed, and the card doesn't belong to themselves.
  // We allow clicking even if not in voting phase, so they can pre-select.
  const canSelect = currentPlayer &&
    !(game.passedTurns && game.passedTurns[currentPlayer.index]) &&
    !(game.guesses && !!game.guesses[currentPlayer.index]) &&
    player.index !== currentPlayer.index;

  const isMyCard = currentPlayer && player.index === currentPlayer.index;

  return (
    <Box className={`player-panel ${isMyCard ? 'my-card-panel' : ''}`} sx={{
      p: { xs: 1.2, sm: 2 },
      borderRadius: 'var(--radius-lg)',
      bgcolor: isMyCard ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.03)',
      border: isMyCard ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
      boxShadow: isMyCard ? '0 0 15px rgba(59, 130, 246, 0.15)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1.2, sm: 2 },
      minWidth: { xs: '100%', md: '360px', lg: '420px' },
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isMyCard ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--color-border-subtle)', pb: 1, minWidth: 0 }}>
        <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"kingthings_trypewriter_2Rg", serif',
              color: ((isMyCard && game.murderer === player.index) || (game.finished && game.murderer === player.index)) ? '#ef4565' : '#ffffff',
              fontWeight: isMyCard ? 'bold' : 'normal',
              fontSize: { xs: '0.95rem', sm: '1.25rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block'
            }}
          >
            {isMyCard ? `🃏 การ์ดของฉัน - ${player.name}` : player.name}
          </Typography>
          {isMyCard && (
            <Typography variant="caption" sx={{ color: game.murderer === player.index ? '#ef4565' : 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
              บทบาท: {game.murderer === player.index ? 'ฆาตกร' : 'นักสืบ'}
            </Typography>
          )}
        </Box>
        {game.finished && game.murderer === player.index && !isMyCard && (
          <Typography variant="subtitle2" sx={{ color: '#ef4565', textShadow: '0 0 10px rgba(239, 69, 101, 0.8)', flexShrink: 0 }}>Murderer</Typography>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: { xs: 0.5, sm: 1 }, letterSpacing: '0.05em', color: '#ffffff', fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
          🔍 หลักฐาน
        </Typography>
        <Box className="player-panel__cards">
          {clues.map((clue, index) => (
            <GameCard
              key={'clue' + index}
              name={clue}
              type="clues"
              disabled={!canSelect}
              selected={guess?.player === player.index && guess?.key === clue}
              onClick={() => onCardClick && onCardClick(player.index, 'clues', clue)}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: { xs: 0.5, sm: 1 }, letterSpacing: '0.05em', color: '#ffffff', fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
          🗡️ อาวุธ
        </Typography>
        <Box className="player-panel__cards">
          {means.map((mean, index) => (
            <GameCard
              key={'mean' + index}
              name={mean}
              type="means"
              disabled={!canSelect}
              selected={guess?.player === player.index && guess?.mean === mean}
              onClick={() => onCardClick && onCardClick(player.index, 'means', mean)}
            />
          ))}
        </Box>
      </Box>

      {/* Show passed turns or guesses if any */}
      {(game.passedTurns && game.passedTurns[player.index]) && (
        <Typography variant="body2" sx={{ color: 'var(--color-warning)', mt: 1 }}>
          ผ่านเทิร์นนี้
        </Typography>
      )}
    </Box>
  );
}
