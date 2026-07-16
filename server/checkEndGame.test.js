import test from 'node:test';
import assert from 'node:assert';
import gameLogic, { _testing } from './gameLogic.js';

const { games, checkEndGame } = _testing;

test('checkEndGame Tests', async (t) => {
  const gamekey = 'test-room';

  // Helper function to setup a fresh game state
  const setupGame = () => {
    games[gamekey] = {
      players: { 0: { index: 0 }, 1: { index: 1 }, 2: { index: 2 }, 3: { index: 3 } },
      detective: 0, // This is just for setup, the actual check looks at validGuesses and playersPassed. If detective === -1 then totalVoters = 4, else 3.
      murderer: 2, // Player index 2 is the murderer
      murdererChoice: { mean: 'Knife', key: 'Gloves' },
      guesses: new Array(4).fill(false),
      passedTurns: new Array(4).fill(false),
      round: 1,
      availableClues: 0
    };
  };

  await t.test('TC1: ทายถูกครบ 3 อย่าง (player ✅ + mean ✅ + key ✅) -> จบเกม', async () => {
    setupGame();
    // Player 1 (voter) guesses correctly
    games[gamekey].guesses[1] = { player: 2, mean: 'Knife', key: 'Gloves' };
    games[gamekey].passedTurns[2] = true;
    games[gamekey].passedTurns[3] = true;

    await checkEndGame(gamekey);

    assert.strictEqual(games[gamekey].finished, true);
    assert.strictEqual(games[gamekey].winner, 'detectives');
  });

  await t.test('TC2: ชี้ผิดคน แต่ถูกอาวุธ+หลักฐาน (player ❌ + mean ✅ + key ✅) -> ไม่จบเกม', async () => {
    setupGame();
    // Player 1 points to the wrong player (index 3) but correct mean and key
    games[gamekey].guesses[1] = { player: 3, mean: 'Knife', key: 'Gloves' };
    games[gamekey].passedTurns[2] = true;
    games[gamekey].passedTurns[3] = true;

    await checkEndGame(gamekey);

    assert.strictEqual(games[gamekey].finished, undefined); // Should not finish
    assert.strictEqual(games[gamekey].winner, undefined);
    assert.strictEqual(games[gamekey].round, 2); // Should advance to next round since all acted
  });

  await t.test('TC3: ชี้ถูกคน แต่ผิดอาวุธ (player ✅ + mean ❌ + key ✅) -> ไม่จบเกม', async () => {
    setupGame();
    // Player 1 guesses correct player and key, but wrong mean
    games[gamekey].guesses[1] = { player: 2, mean: 'Poison', key: 'Gloves' };
    games[gamekey].passedTurns[2] = true;
    games[gamekey].passedTurns[3] = true;

    await checkEndGame(gamekey);

    assert.strictEqual(games[gamekey].finished, undefined);
    assert.strictEqual(games[gamekey].winner, undefined);
    assert.strictEqual(games[gamekey].round, 2);
  });

  await t.test('TC4: ทุกคนทายผิดหมด Round 3 -> ฆาตกรชนะ', async () => {
    setupGame();
    games[gamekey].round = 3;
    // Everyone guesses wrong or passes
    games[gamekey].guesses[1] = { player: 3, mean: 'Knife', key: 'Gloves' };
    games[gamekey].passedTurns[2] = true;
    games[gamekey].passedTurns[3] = true;

    await checkEndGame(gamekey);

    assert.strictEqual(games[gamekey].finished, true);
    assert.strictEqual(games[gamekey].winner, 'murderer');
  });
});
