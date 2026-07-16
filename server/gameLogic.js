import rules from '../src/api/rules.js';
import means from '../src/data/means.js';
import clues from '../src/data/clues.js';
import analysis from '../src/data/analysis.js';
import meansth from '../src/data/means-th.js';
import cluesth from '../src/data/clues-th.js';
import analysisth from '../src/data/analysis-th.js';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

let ai;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

let ioInstance = null;
const games = {};
const timeouts = {};

const INITIAL_AI_CLUES = 2;
const EVIDENCE_LEFT_BEHIND_TITLE_EN = 'Evidence left Behind';

function findEvidenceLeftBehindCategory(analysisList) {
  return analysisList.find(
    (item) =>
      item.title === EVIDENCE_LEFT_BEHIND_TITLE_EN ||
      item.title.startsWith('หลักฐานที่ทิ้ง')
  );
}

function isEvidenceLeftBehindCategory(category) {
  return (
    category?.title === EVIDENCE_LEFT_BEHIND_TITLE_EN ||
    category?.title?.startsWith('หลักฐานที่ทิ้ง')
  );
}

function buildAnalysisDeck(analysisList, isAiMode) {
  const analysisCause = analysisList.filter((item) => item.type === 0);

  if (isAiMode) {
    const evidenceCategory = findEvidenceLeftBehindCategory(analysisList);
    if (evidenceCategory) {
      const analysisLocation = rules.getRandom(
        analysisList.filter((item) => item.type === 1),
        1
      );
      const analysisOther = rules.getRandom(
        analysisList.filter(
          (item) =>
            item.type === 2 && item.title !== evidenceCategory.title
        ),
        5
      );
      return [
        ...analysisCause,
        evidenceCategory,
        ...analysisLocation,
        ...analysisOther,
      ];
    }
  }

  const analysisLocation = rules.getRandom(
    analysisList.filter((item) => item.type === 1),
    1
  );
  const analysisOther = rules.getRandom(
    analysisList.filter((item) => item.type === 2),
    6
  );
  return [...analysisCause, ...analysisLocation, ...analysisOther];
}

function pickRandomOption(category) {
  if (!category?.options?.length) return null;
  const randomIndex = Math.floor(Math.random() * category.options.length);
  return category.options[randomIndex];
}

function sanitizeClueText(text, { weapon, evidence, maxLen = 80 } = {}) {
  if (!text) return null;
  let cleaned = text
    .trim()
    .replace(/^["'「『]|["'」』]$/g, '')
    .replace(/^คำใบ้:\s*/i, '')
    .split('\n')[0]
    .trim();
  if (cleaned.length > maxLen) {
    cleaned = cleaned.slice(0, maxLen).replace(/\s+\S*$/, '').trim();
  }
  const lower = cleaned.toLowerCase();
  if (weapon && lower.includes(String(weapon).toLowerCase())) return null;
  if (evidence && lower.includes(String(evidence).toLowerCase())) return null;
  return cleaned || null;
}

function getCategoryGuidance(category, lang) {
  const isCauseOfDeath =
    category.type === 0 ||
    category.title === 'Cause of death' ||
    category.title === 'สาเหตุการตาย';
  const isEvidenceLeftBehind = isEvidenceLeftBehindCategory(category);
  const isLocation =
    category.type === 1 ||
    category.title === 'Location of crime' ||
    category.title.startsWith('สถานที่');

  if (isCauseOfDeath) {
    return lang === 'th'
      ? 'อธิบายวิธีที่เหยื่อเสียชีวิตให้สอดคล้องกับอาวุธที่ใช้ (เช่น ถูกแทง → มีแผลลึกและเสียเลือดมาก, ถูกวางยา → ตรวจพบสารพิษ, ถูกรัดคอ → มีร่องรอยขาดอากาศหายใจ) ห้ามพูดชื่ออาวุธ'
      : 'Describe how the victim died in a way that matches the murder weapon (e.g. stabbed → deep wounds and blood loss, poison → toxic substance found, suffocation → signs of asphyxiation). Do NOT name the weapon.';
  }
  if (isEvidenceLeftBehind) {
    return lang === 'th'
      ? 'อธิบายลักษณะ วัสดุ รูปทรง หรือการใช้งานของหลักฐานที่ทิ้งไว้ ให้นักสืบเดาได้ว่าเป็นหลักฐานอะไร ห้ามพูดชื่อหลักฐานโดยตรง'
      : 'Describe the key evidence by its material, shape, purpose, or appearance so detectives can guess what it is. Do NOT name the evidence card directly.';
  }
  if (isLocation) {
    return lang === 'th'
      ? 'อธิบายบรรยากาศหรือร่องรอยในที่เกิดเหตuที่สอดคล้องกับหมวดสถานที่นี้ โดยไม่ระบุชื่อสถานที่ตรงๆ'
      : 'Describe the atmosphere or traces at the crime scene that fit this location category, without naming the exact location.';
  }
  return lang === 'th'
    ? 'เขียนคำใบ้สั้นๆ ในหมวดนี้ที่สอดคล้องกับอาวุธและหลักฐาน โดยไม่เปิดเผยชื่อการ์ดโดยตรง'
    : 'Write a short hint for this category that fits the weapon and evidence without revealing card names directly.';
}

function fallbackCustomClue({ weapon, evidence, category, lang }) {
  const isCauseOfDeath =
    category.type === 0 ||
    category.title === 'Cause of death' ||
    category.title === 'สาเหตุการตาย';
  const isEvidenceLeftBehind = isEvidenceLeftBehindCategory(category);

  if (isCauseOfDeath) {
    const w = String(weapon || '').toLowerCase();
    if (lang === 'th') {
      if (/ยา|พิษ|สลบ|venom|poison|drug|snake|งู/.test(w))
        return 'ตรวจพบสารต้องสงสัยในร่างกาย';
      if (/ปืน|ดิน|sniper|pistol|gun|ยิง/.test(w))
        return 'มีแผลจากวัตถุแหลมทะลุเข้าไปในร่างกาย';
      if (/เชือก|ถุง|สำลัก|suffoc|bag|rope|tape/.test(w))
        return 'มีร่องรอยการขาดอากาศหายใจ';
      if (/ไฟ|วางเพลิง|arson|current|electric|ไฟฟ้า/.test(w))
        return 'พบร่องรอยไฟไหม้หรือไฟฟ้าช็อต';
      return 'มีร่องรอยการบาดเจ็บรุนแรงทั่วร่างกาย';
    }
    if (/poison|drug|venom|snake/.test(w)) return 'Traces of a suspicious substance in the body';
    if (/gun|pistol|sniper|bullet/.test(w)) return 'Penetrating wounds consistent with a projectile';
    if (/rope|bag|suffoc|tape/.test(w)) return 'Clear signs of asphyxiation';
    if (/fire|arson|electric|current/.test(w)) return 'Signs of burns or electrical trauma';
    return 'Evidence of severe physical trauma';
  }

  if (isEvidenceLeftBehind) {
    const e = String(evidence || '').toLowerCase();
    if (lang === 'th') {
      if (/เหรียญ|การ์ด|เพชร|ถ้วย|trophy|coin|diamond/.test(e))
        return 'พบวัตถุขนาดเล็กที่มีค่าหรือมีความหมายเป็นส่วนตัว';
      if (/กล่อง|ถุง|พัสดุ|กระเป๋า|box|bag|package/.test(e))
        return 'พบบรรจุภัณฑ์หรือภาชนะที่ใช้บรรจุของ';
      if (/ไม้|ทราย|ดอก|plant|wood|sand|flower/.test(e))
        return 'พบวัสดุจากธรรมชาติทิ้งไว้ในที่เกิดเหตu';
      return 'พบวัตถุแปลกตาที่ไม่เข้ากับสถานที่เกิดเหตu';
    }
    if (/coin|card|diamond|trophy|jewel/.test(e))
      return 'A small personal or valuable object was left behind';
    if (/box|bag|package|suitcase/.test(e))
      return 'A container or packaging was found at the scene';
    if (/plant|wood|sand|flower|natural/.test(e))
      return 'Natural material unrelated to the room was found';
    return 'An unusual object was left at the crime scene';
  }

  return pickRandomOption(category) || (lang === 'th' ? 'มีร่องรอยที่น่าสงสัย' : 'Suspicious traces found');
}

async function generateCustomClue({
  weapon,
  evidence,
  category,
  lang,
  priorClues = [],
}) {
  if (!category) return fallbackCustomClue({ weapon, evidence, category, lang });

  let selected = null;

  try {
    if (ai) {
      const langNote =
        lang === 'th'
          ? 'เขียนเป็นภาษาไทย 1 ประโยคสั้นๆ (ไม่เกิน 25 คำ) เหมือนข้อความบนการ์ดวิเคราะห์'
          : 'Write in English as one short sentence (max 25 words), like text on an analysis card.';

      const priorContext =
        priorClues.length > 0
          ? lang === 'th'
            ? `\nคำใบ้ที่เปิดไปแล้ว (ต้องไม่ขัดแย้ง):\n${priorClues
                .map((clue) => `- ${clue.category}: ${clue.value}`)
                .join('\n')}`
            : `\nPreviously revealed clues (must stay consistent):\n${priorClues
                .map((clue) => `- ${clue.category}: ${clue.value}`)
                .join('\n')}`
          : '';

      const categoryGuidance = getCategoryGuidance(category, lang);

      const prompt =
        lang === 'th'
          ? `คุณคือนักนิติวิทยาศาสตร์ในเกม Deception: Murder in Hong Kong

ข้อมูลลับ (มีแค่คุณรู้):
- อาวุฆาตกรรม: ${weapon}
- หลักฐานสำคัญที่ทิ้งไว้: ${evidence}

หมวดการวิเคราะห์: ${category.title}

${categoryGuidance}
${priorContext}

กฎ:
- ห้ามใช้ชื่อการ์ด "${weapon}" หรือ "${evidence}" โดยตรง
- ห้ามอธิบายเพิ่มนอกเหนือจากคำใบ้
- ${langNote}
- ตอบเฉพาะข้อความคำใบ้เท่านั้น`
          : `You are the Forensic Scientist in "Deception: Murder in Hong Kong".

Secret facts (only you know):
- Murder weapon: ${weapon}
- Key evidence left at scene: ${evidence}

Analysis category: ${category.title}

${categoryGuidance}
${priorContext}

Rules:
- Do NOT use the exact card names "${weapon}" or "${evidence}"
- Do not add explanation outside the hint
- ${langNote}
- Return ONLY the hint text`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      selected = sanitizeClueText(response.text, { weapon, evidence });
    }
  } catch (error) {
    console.error('Gemini AI failed to generate custom clue', error);
  }

  return (
    selected ||
    fallbackCustomClue({ weapon, evidence, category, lang })
  );
}

async function generateInitialAiClues(game, choice) {
  const initialCount = Math.min(INITIAL_AI_CLUES, game.analysis.length);
  const selectedCategories = game.analysis.slice(0, initialCount);
  const clues = [];

  for (let i = 0; i < initialCount; i++) {
    const category = selectedCategories[i];
    const priorClues = selectedCategories.slice(0, i).map((item, idx) => ({
      category: item.title,
      value: clues[idx],
    }));
    const clue = await generateCustomClue({
      weapon: choice.mean,
      evidence: choice.key,
      category,
      lang: game.lang,
      priorClues,
    });
    clues.push(clue);
  }

  return clues;
}

async function checkEndGame(gamekey) {
  const game = games[gamekey];
  if (!game) return;

  const playerCount = Object.keys(game.players).length;
  const totalVoters = game.detective === -1 ? playerCount : playerCount - 1;
  const validGuesses =
    (game.guesses && game.guesses.filter((item) => item && item.key)) || [];
  const playersPassed =
    (game.passedTurns &&
      game.passedTurns.filter((item) => item === true)) ||
    [];

  let updates = {};

  if (
    game.guesses &&
    game.guesses.filter(
      (item) =>
        item &&
        item.player === game.murderer &&
        item.mean === game.murdererChoice?.mean &&
        item.key === game.murdererChoice?.key
    ).length > 0
  ) {
    updates = { finished: true, winner: 'detectives' };
  } else if (validGuesses.length === totalVoters) {
    updates = { finished: true, winner: 'murderer' };
  } else if (
    game.round === 3 &&
    validGuesses.length + playersPassed.length === totalVoters
  ) {
    updates = { finished: true, winner: 'murderer' };
  } else {
    const allActed =
      validGuesses.length + playersPassed.length === totalVoters;
    updates = {
      passedTurns: allActed
        ? new Array(playerCount).fill(false)
        : game.passedTurns,
      availableClues: allActed
        ? game.availableClues + 1
        : game.availableClues,
      round: allActed ? game.round + 1 : game.round,
    };
  }

  const updatedGame = { ...game, ...updates };

  // Generate new clue if round advanced and using AI Game Master
  if (
    updatedGame.round > game.round &&
    updatedGame.detective === -1 &&
    updatedGame.forensicAnalysis.length < updatedGame.availableClues
  ) {
    const clueIndex = updatedGame.forensicAnalysis.length;
    const newCategory = updatedGame.analysis[clueIndex];
    if (newCategory) {
      const priorClues = updatedGame.analysis
        .slice(0, clueIndex)
        .map((item, idx) => ({
          category: item.title,
          value: updatedGame.forensicAnalysis[idx],
        }));

      console.log(
        `Calling Gemini AI to generate new clue for round ${updatedGame.round}...`
      );
      const newClue = await generateCustomClue({
        weapon: updatedGame.murdererChoice?.mean,
        evidence: updatedGame.murdererChoice?.key,
        category: newCategory,
        lang: updatedGame.lang,
        priorClues,
      });

      updatedGame.forensicAnalysis = [...updatedGame.forensicAnalysis, newClue];
    }
  }

  games[gamekey] = updatedGame;

  if (updatedGame.finished) {
    if (timeouts[gamekey]) {
      clearTimeout(timeouts[gamekey]);
      delete timeouts[gamekey];
    }
    return updatedGame;
  }

  // If round advanced, start the playing phase for the new round
  if (updatedGame.round > game.round) {
    startPlayingPhase(gamekey);
  } else {
    // If not advanced yet, we should see if everyone voted. 
    // Wait, if not all acted, maybe we are still in voting phase?
    // Actually, if we are in voting phase, and not everyone acted, the timer is still running.
    // BUT we cleared it above! So we shouldn't clear it unless the round actually ends or everyone acted.
  }

  return updatedGame;
}

function startPlayingPhase(gamekey) {
  const game = games[gamekey];
  if (!game) return;

  if (timeouts[gamekey]) {
    clearTimeout(timeouts[gamekey]);
  }

  game.phase = 'playing';
  game.phaseEndsAt = Date.now() + 2 * 60 * 1000; // 2 minutes
  
  timeouts[gamekey] = setTimeout(() => {
    startVotingPhase(gamekey);
  }, 2 * 60 * 1000);

  games[gamekey] = game;
  if (ioInstance) {
    ioInstance.to(game.gameId).emit('gameState', game);
  }
}

function startVotingPhase(gamekey) {
  const game = games[gamekey];
  if (!game) return;

  if (timeouts[gamekey]) {
    clearTimeout(timeouts[gamekey]);
    delete timeouts[gamekey];
  }
  game.phase = 'voting';
  game.phaseEndsAt = Date.now() + 30 * 1000; // 30 seconds

  timeouts[gamekey] = setTimeout(() => {
    endVotingPhase(gamekey);
  }, 30 * 1000);

  games[gamekey] = game;
  if (ioInstance) {
    ioInstance.to(game.gameId).emit('gameState', game);
  }
}

async function endVotingPhase(gamekey) {
  const game = games[gamekey];
  if (!game) return;

  // Auto-pass players who haven't voted
  const playerCount = Object.keys(game.players).length;
  const turnsArray = game.passedTurns ? [...game.passedTurns] : new Array(playerCount).fill(false);
  const guessesArray = game.guesses ? [...game.guesses] : new Array(playerCount).fill(false);

  for (let i = 0; i < playerCount; i++) {
    // If they haven't guessed and haven't passed
    if (!guessesArray[i] && !turnsArray[i]) {
      // The detective doesn't vote, so we can ignore if i is detective
      if (i !== game.detective) {
        turnsArray[i] = true;
      }
    }
  }

  game.passedTurns = turnsArray;
  games[gamekey] = game;

  const updatedGame = await checkEndGame(gamekey);
  if (ioInstance && updatedGame) {
    ioInstance.to(game.gameId).emit('gameState', updatedGame);
  }
}

export default {
  setIo(io) {
    ioInstance = io;
  },

  getGames() {
    return games;
  },

  getGameById(gameId) {
    return Object.values(games).find((g) => g.gameId === gameId);
  },

  getGameByKey(gamekey) {
    return games[gamekey];
  },

  createGame(lang) {
    const gamekey = 'game_' + Date.now();
    const gameData = {
      gameId: rules.createRandomId(),
      players: {},
      detective: -1,
      gamekey,
      finished: false,
      availableClues: 2,
      round: 1,
      phase: 'setup',
      lang: lang || 'en',
      chat: [],
    };
    games[gamekey] = gameData;
    return gameData;
  },

  addPlayer(gameId, nickname, slug) {
    const game = this.getGameById(gameId);
    if (!game) return { error: 'Game not found' };

    const existingPlayer = Object.values(game.players || {}).find(
      (p) => p.slug === slug
    );
    if (existingPlayer && game.started) {
      return { game, player: existingPlayer };
    } else if (game.started) {
      return { error: 'Game has already started and no new players can join' };
    }

    const playerkey =
      'player_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 7);
    const playerData = { name: nickname, slug, playerkey };

    const updatedPlayers = { ...game.players, [playerkey]: playerData };
    game.players = updatedPlayers;
    games[game.gamekey] = game;
    return { game, player: playerData };
  },

  startGame(gamekey, playersObj, playersArr, detective, lang) {
    const gameclues = {
      en: { clues, means, analysis },
      th: { clues: cluesth, means: meansth, analysis: analysisth },
    };
    const l = lang || 'en';
    const gameMeans = rules.getRandom(
      gameclues[l].means,
      playersArr.length * 4
    );
    const gameClues = rules.getRandom(
      gameclues[l].clues,
      playersArr.length * 4
    );
    const isAiMode = detective === -1;
    const gameAnalysis = buildAnalysisDeck(gameclues[l].analysis, isAiMode);

    const updatedPlayers = { ...playersObj };
    let iterate = 0;
    for (let player in updatedPlayers) {
      updatedPlayers[player] = {
        index: iterate,
        ...updatedPlayers[player],
      };
      iterate++;
    }

    const game = games[gamekey];

    const updates = {
      started: true,
      means: gameMeans,
      clues: gameClues,
      players: updatedPlayers,
      analysis: gameAnalysis,
      availableClues: isAiMode ? INITIAL_AI_CLUES : game?.availableClues || 6,
      murderer: rules.chooseRandomMurderer(playersArr, detective),
      detective: detective,
    };

    const updatedGame = { ...game, ...updates };
    games[gamekey] = updatedGame;
    return updatedGame;
  },

  setDetective(gamekey, player) {
    const game = games[gamekey];
    if (game) {
      game.detective = player;
    }
    return game;
  },

  setAnalysis(gamekey, forensicAnalysis) {
    let game = games[gamekey];
    if (game) {
      game.forensicAnalysis = forensicAnalysis;
      if (game.phase === 'setup') {
        startPlayingPhase(gamekey);
        game = games[gamekey]; // Refresh from games since startPlayingPhase mutates it
      }
    }
    return game;
  },

  addChatMessage(gamekey, message) {
    const game = games[gamekey];
    if (game) {
      if (!game.chat) game.chat = [];
      game.chat.push(message);
    }
    return game;
  },

  async setMurdererChoice(gamekey, choice) {
    const game = games[gamekey];
    if (game) {
      game.murdererChoice = choice;
    }
    return game;
  },

  async generateAiForensicAnalysis(gamekey) {
    let game = games[gamekey];
    if (!game || game.detective !== -1 || !game.murdererChoice) {
      return game;
    }

    console.log('Calling Gemini AI to generate initial clues...');
    game.forensicAnalysis = await generateInitialAiClues(
      game,
      game.murdererChoice
    );
    games[gamekey] = game;

    if (game.phase === 'setup') {
      startPlayingPhase(gamekey);
      game = games[gamekey];
    }

    return game;
  },

  async passTurn(gamekey, player) {
    const game = games[gamekey];
    if (!game || game.phase !== 'voting') return game;
    const playerCount = Object.keys(game.players).length;
    const turnsArray = game.passedTurns
      ? [...game.passedTurns]
      : new Array(playerCount).fill(false);
    turnsArray[player.index] = true;
    game.passedTurns = turnsArray;
    return await checkEndGame(gamekey);
  },

  async makeGuess(gamekey, player, guess) {
    const game = games[gamekey];
    if (!game || game.phase !== 'voting') return game;
    const playerCount = Object.keys(game.players).length;
    const guessesArray = game.guesses
      ? [...game.guesses]
      : new Array(playerCount).fill(false);
    guessesArray[player.index] = guess;
    game.guesses = guessesArray;
    return await checkEndGame(gamekey);
  }
};

// Export for testing
export const _testing = { games, checkEndGame };
