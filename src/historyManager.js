/**
 * History Manager — Tracks study history in localStorage
 * 
 * Stores:
 * - Session history (daily aggregated: cards played, duration, accuracy)
 * - Difficult cards (cards that got Again/Hard responses)
 * - Mastered cards (cards that got Easy response and stayed stable)
 * 
 * localStorage key: 'gw_history'
 */

const STORAGE_KEY = 'gw_history';
const MAX_SESSION_DAYS = 90; // Keep max 90 days of session data

function getDefaultData() {
  return {
    sessions: [],       // [{ date, cardsPlayed, durationSec, accuracy, totalCorrect, totalReviewed }]
    difficultCards: {},  // { [cardId]: { failCount, lastFailed } }
    masteredCards: {},   // { [cardId]: { masteredAt } }
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data = JSON.parse(raw);
    return {
      sessions: data.sessions || [],
      difficultCards: data.difficultCards || {},
      masteredCards: data.masteredCards || {},
    };
  } catch {
    return getDefaultData();
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[History] Failed to save:', e);
  }
}

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// ── Public API ──

export function recordSession(cardsPlayed, durationSec, accuracy) {
  const data = load();
  const today = todayStr();
  
  const existing = data.sessions.find(s => s.date === today);
  if (existing) {
    const prevTotal = existing.totalReviewed || existing.cardsPlayed;
    const prevCorrect = existing.totalCorrect || Math.round(prevTotal * (existing.accuracy / 100));
    const newCorrect = Math.round(cardsPlayed * (accuracy / 100));
    
    existing.cardsPlayed = prevTotal + cardsPlayed;
    existing.durationSec = (existing.durationSec || 0) + durationSec;
    existing.totalReviewed = prevTotal + cardsPlayed;
    existing.totalCorrect = prevCorrect + newCorrect;
    existing.accuracy = existing.totalReviewed > 0 
      ? Math.round((existing.totalCorrect / existing.totalReviewed) * 100) 
      : 0;
  } else {
    data.sessions.push({
      date: today,
      cardsPlayed,
      durationSec,
      accuracy,
      totalReviewed: cardsPlayed,
      totalCorrect: Math.round(cardsPlayed * (accuracy / 100)),
    });
  }
  
  data.sessions.sort((a, b) => b.date.localeCompare(a.date));
  if (data.sessions.length > MAX_SESSION_DAYS) {
    data.sessions = data.sessions.slice(0, MAX_SESSION_DAYS);
  }
  
  save(data);
}

export function recordCardResponse(cardId, rating) {
  const data = load();
  
  if (rating === 1 || rating === 2) {
    // Card is difficult: add/update in difficultCards, remove from mastered
    const existing = data.difficultCards[cardId];
    data.difficultCards[cardId] = {
      failCount: (existing?.failCount || 0) + 1,
      lastFailed: new Date().toISOString(),
    };
    // If it was mastered before, it's no longer mastered
    delete data.masteredCards[cardId];
  } else if (rating === 4) {
    // Easy: add to mastered, but do NOT remove from difficult.
    // A card that was Hard then Easy in the same session should stay
    // in the difficult list — because the user struggled with it.
    // It only leaves difficult via manual removal by the user.
    data.masteredCards[cardId] = {
      masteredAt: new Date().toISOString(),
    };
  }
  // Rating 3 (Good) doesn't change difficult/mastered status
  
  save(data);
}

export function getDifficultCards() {
  const data = load();
  return Object.entries(data.difficultCards)
    .map(([cardId, info]) => ({ cardId, ...info }))
    .sort((a, b) => b.failCount - a.failCount);
}

export function getMasteredCards() {
  const data = load();
  return Object.entries(data.masteredCards)
    .map(([cardId, info]) => ({ cardId, ...info }))
    .sort((a, b) => b.masteredAt.localeCompare(a.masteredAt));
}

export function removeDifficultCard(cardId) {
  const data = load();
  delete data.difficultCards[cardId];
  save(data);
}

export function removeDifficultCards(cardIds) {
  const data = load();
  for (const id of cardIds) {
    delete data.difficultCards[id];
  }
  save(data);
}

export function clearDifficultCards() {
  const data = load();
  data.difficultCards = {};
  save(data);
}

export function getSessionHistory(days = 14) {
  const data = load();
  const result = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const session = data.sessions.find(s => s.date === dateStr);
    result.push({
      date: dateStr,
      dayLabel: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      cardsPlayed: session?.cardsPlayed || 0,
      durationSec: session?.durationSec || 0,
      accuracy: session?.accuracy || 0,
    });
  }
  
  return result;
}

export function getAggregateStats() {
  const data = load();
  const sessions = data.sessions;
  
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalCards: 0,
      totalMinutes: 0,
      avgAccuracy: 0,
      difficultCount: Object.keys(data.difficultCards).length,
      masteredCount: Object.keys(data.masteredCards).length,
    };
  }
  
  const totalCards = sessions.reduce((sum, s) => sum + s.cardsPlayed, 0);
  const totalSec = sessions.reduce((sum, s) => sum + (s.durationSec || 0), 0);
  const avgAcc = Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length);
  
  return {
    totalSessions: sessions.length,
    totalCards,
    totalMinutes: Math.round(totalSec / 60),
    avgAccuracy: avgAcc,
    difficultCount: Object.keys(data.difficultCards).length,
    masteredCount: Object.keys(data.masteredCards).length,
  };
}

export function getProgressBySource(fsrsStates, allCards) {
  const KANJI_REGEX = /[\u4e00-\u9faf]/;
  
  function makeBucket() {
    return { total: 0, learned: 0, percent: 0 };
  }
  
  const result = {
    minna: {
      all: makeBucket(),
      wajib: makeBucket(),    // importantity 1
      extra: makeBucket(),    // importantity 2
      trash: makeBucket(),    // importantity 3
      kanji: makeBucket(),    // cards with kanji characters
    },
    irodori: {
      all: makeBucket(),
      wajib: makeBucket(),
      extra: makeBucket(),
      trash: makeBucket(),
      kanji: makeBucket(),
    },
  };
  
  for (const card of allCards) {
    const isMinna = card.chapter?.startsWith('Bab');
    const isIrodori = card.chapter?.startsWith('ir') || card.chapter?.startsWith('Iro');
    const source = isMinna ? result.minna : isIrodori ? result.irodori : null;
    
    if (!source) continue;
    
    const isLearned = fsrsStates[card.id] && fsrsStates[card.id].state !== 0;
    const hasKanji = KANJI_REGEX.test(card.kanji);
    const imp = card.importantity ?? 1;
    
    // All
    source.all.total++;
    if (isLearned) source.all.learned++;
    
    // By grade
    if (imp === 1) {
      source.wajib.total++;
      if (isLearned) source.wajib.learned++;
    } else if (imp === 2) {
      source.extra.total++;
      if (isLearned) source.extra.learned++;
    } else if (imp === 3) {
      source.trash.total++;
      if (isLearned) source.trash.learned++;
    }
    
    // Kanji
    if (hasKanji) {
      source.kanji.total++;
      if (isLearned) source.kanji.learned++;
    }
  }
  
  // Calculate percentages
  function calcPercent(bucket) {
    bucket.percent = bucket.total > 0 ? Math.round((bucket.learned / bucket.total) * 100) : 0;
  }
  
  for (const source of [result.minna, result.irodori]) {
    calcPercent(source.all);
    calcPercent(source.wajib);
    calcPercent(source.extra);
    calcPercent(source.trash);
    calcPercent(source.kanji);
  }
  
  return result;
}
