import { toRomaji, cleanReading } from './romaji.js';

/** Raw data loaded in memory */
let ALL_CARDS = [];

/**
 * Initialize ALL_CARDS from server-provided data.
 * Called by the setup page after receiving data from a server component.
 * Also caches to localStorage for offline/direct-access scenarios.
 *
 * @param {Array} cards — Normalized card objects from serverData.js
 * @returns {Array}
 */
export function initializeData(cards) {
  ALL_CARDS = cards.map(c => ({
    ...c,
    importantity: c.importantity ?? 1,
    get isExtra() { return this.importantity === 2; },
    cleanedHiragana: c.cleanedHiragana || cleanReading(c.hiragana || ''),
    romaji: c.romaji || toRomaji(cleanReading(c.hiragana || '')),
  }));

  // Cache for offline use
  try {
    localStorage.setItem('FC_OFFLINE_CARDS', JSON.stringify(ALL_CARDS));
  } catch (e) {
    console.warn('[Data] Failed to cache data:', e);
  }

  return ALL_CARDS;
}

/**
 * Load data — uses already-loaded cards or falls back to localStorage cache.
 * Kept for backward compatibility (study page may access directly on page reload).
 */
export async function loadData(forceRefresh = false) {
  if (ALL_CARDS.length > 0 && !forceRefresh) return ALL_CARDS;

  // Try localStorage cache
  try {
    const cached = localStorage.getItem('FC_OFFLINE_CARDS');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Re-attach getter that JSON.stringify strips
      ALL_CARDS = parsed.map(c => ({
        ...c,
        get isExtra() { return this.importantity === 2; }
      }));
      console.log(`[Data] Loaded ${ALL_CARDS.length} cards from offline cache`);
      return ALL_CARDS;
    }
  } catch (err) {
    console.error('[Data] Failed to read from offline cache:', err);
  }

  console.warn('[Data] No data available.');
  return [];
}

/**
 * Get all unique chapters (sorted)
 */
export function getChapters() {
  const chapSet = new Set(ALL_CARDS.map(c => c.chapter));
  return sortChapters([...chapSet]);
}

/**
 * Sort chapter names:
 *   Bab chapters first (numerically), then irodori (alphabetically)
 */
function sortChapters(chapters) {
  return chapters.sort((a, b) => {
    const aIsBab = a.startsWith('Bab');
    const bIsBab = b.startsWith('Bab');

    if (aIsBab && bIsBab) {
      return parseInt(a.replace('Bab', ''), 10) - parseInt(b.replace('Bab', ''), 10);
    }
    if (aIsBab && !bIsBab) return -1;
    if (!aIsBab && bIsBab) return 1;

    return a.localeCompare(b);
  });
}

/**
 * Get cards filtered by chapters, selected grades, and JLPT level
 * 
 * Grades (importantity):
 *   1 = Wajib (must learn)
 *   2 = Extra (optional/supplementary)
 *   3 = Trash (tidak berguna)
 * 
 * @param {string[]} chapters - Selected chapters
 * @param {number[]} selectedGrades - Which grades to include, e.g. [1, 2]
 * @param {string} jlpt - 'all', 'n5', 'n4', etc.
 * @param {number} mode - study mode (2 = kanji only)
 * @returns {Array}
 */
export function getCardsByChapters(chapters, selectedGrades = [1, 2], jlpt = 'all', mode = 1) {
  return ALL_CARDS.filter(card => {
    if (!chapters.includes(card.chapter)) return false;
    
    // Only include cards whose grade is in the selected grades
    if (!selectedGrades.includes(card.importantity)) return false;
    
    // JLPT Filter logic (Only applicable if in Kanji mode i.e. Mode 2)
    if (mode === 2) {
      // 1. Must actually have kanji
      const hasKanji = /[\u4e00-\u9faf]/.test(card.kanji);
      if (!hasKanji) return false;
      
      // 2. JLPT level filtering (if not 'all')
      if (jlpt !== 'all') {
        const jlptOrder = ['n5', 'n4', 'n3', 'n2', 'n1'];
        const selectedIdx = jlptOrder.indexOf(jlpt);
        const cardIdx = jlptOrder.indexOf(card.level ? card.level.toLowerCase() : '-');
        
        if (cardIdx === -1 || cardIdx > selectedIdx) {
          return false;
        }
      }
    }
    
    return true;
  });
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} arr
 * @returns {Array}
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
  if (chapter.startsWith('ir') || chapter.startsWith('Iro')) {
    const num = chapter.replace(/^ir/i, '').replace(/^Iro/i, '');
    return `Irodori ${num}`;
  }
  const num = chapter.replace('Bab', '');
  return `Bab ${num}`;
}

/**
 * Get unique word classes from cards
 */
export function getWordClasses() {
  const classes = new Set(ALL_CARDS.map(c => c.wordClass || 'Unclassified'));
  return Array.from(classes).sort();
}

/**
 * Check if a chapter has extra (grade 2) cards
 */
export function chapterHasExtra(chapter) {
  return ALL_CARDS.some(c => c.chapter === chapter && c.importantity === 2);
}

/**
 * Get card count per chapter
 */
export function getChapterStats(chapter) {
  const cards = ALL_CARDS.filter(c => c.chapter === chapter);
  return {
    total: cards.length,
    main: cards.filter(c => c.importantity === 1).length,
    extra: cards.filter(c => c.importantity === 2).length,
    useless: cards.filter(c => c.importantity === 3).length,
  };
}
