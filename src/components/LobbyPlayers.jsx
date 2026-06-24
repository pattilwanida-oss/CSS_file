import React, { useState } from 'react';
import {
  Card,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function LobbyPlayers({ players, game }) {
  return (
    <Card sx={{ mt: 2 }}>
      <List>
        {players.map((player, index) => (
          <ListItem key={player.playerkey}>
            <ListItemText
              primary={<strong>{player.name}</strong>}
              secondary={`/game/${game.gameId}/player/${player.slug}`}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
