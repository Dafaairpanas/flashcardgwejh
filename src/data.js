import { toRomaji, cleanReading } from './romaji.js';

/** Raw data will be loaded from public/data.txt at runtime */
let ALL_CARDS = [];

/**
 * Parse a single line from the data file
 * Format: kanji;hiragana;meaning;BabXX[extra]
 */
function parseLine(line, index) {
  const parts = line.split(';');
  if (parts.length < 4) return null;

  const kanji = parts[0].trim();
  const hiragana = parts[1].trim();
  const meaning = parts[2].trim();
  const rawChapter = parts[3].trim();

  // Determine if extra
  const isExtra = rawChapter.endsWith('extra');
  const chapter = isExtra ? rawChapter.replace('extra', '') : rawChapter;

  // Clean hiragana for romaji conversion
  const cleanedHiragana = cleanReading(hiragana);
  const romaji = toRomaji(cleanedHiragana);

  return {
    id: `card_${index}`,
    kanji,
    hiragana,
    meaning,
    chapter,
    isExtra,
    romaji,
    cleanedHiragana,
  };
}

/**
 * Load and parse data from the text file
 * @returns {Promise<Array>}
 */
export async function loadData() {
  if (ALL_CARDS.length > 0) return ALL_CARDS;

  try {
    const response = await fetch('/data.txt');
    const text = await response.text();
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    ALL_CARDS = lines
      .map((line, i) => parseLine(line, i))
      .filter(card => card !== null);

    console.log(`[Data] Loaded ${ALL_CARDS.length} cards`);
    return ALL_CARDS;
  } catch (err) {
    console.error('[Data] Failed to load data:', err);
    return [];
  }
}

/**
 * Get all unique chapters (sorted)
 */
export function getChapters() {
  const chapSet = new Set(ALL_CARDS.map(c => c.chapter));
  return [...chapSet].sort((a, b) => {
    const numA = parseInt(a.replace('Bab', ''));
    const numB = parseInt(b.replace('Bab', ''));
    return numA - numB;
  });
}

/**
 * Get cards filtered by chapters and filter mode
 * @param {string[]} chapters - Selected chapters
 * @param {'all'|'main'|'extra'} filter - Filter mode
 * @returns {Array}
 */
export function getCardsByChapters(chapters, filter = 'all') {
  return ALL_CARDS.filter(card => {
    if (!chapters.includes(card.chapter)) return false;
    if (filter === 'main' && card.isExtra) return false;
    if (filter === 'extra' && !card.isExtra) return false;
    return true;
  });
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} arr
 * @returns {Array} - New shuffled array
 */
export function shuffleCards(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get chapter display name
 */
export function chapterDisplayName(chapter) {
  const num = chapter.replace('Bab', '');
  return `Bab ${num}`;
}

/**
 * Check if a chapter has extra cards
 */
export function chapterHasExtra(chapter) {
  return ALL_CARDS.some(c => c.chapter === chapter && c.isExtra);
}

/**
 * Get card count per chapter
 */
export function getChapterStats(chapter) {
  const cards = ALL_CARDS.filter(c => c.chapter === chapter);
  return {
    total: cards.length,
    main: cards.filter(c => !c.isExtra).length,
    extra: cards.filter(c => c.isExtra).length,
  };
}
