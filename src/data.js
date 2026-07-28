import { toRomaji, cleanReading } from './romaji.js';

/** Raw data will be loaded at runtime */
let ALL_CARDS = [];

/**
 * Parse a single line from dtmt.txt
 * Format: kanji;hiragana;meaning;BabXX;level;importantity
 * 
 * importantity (grade):
 *   1 = Wajib (must learn)
 *   2 = Extra (optional/supplementary)
 *   3 = Tidak berguna (useless, always excluded)
 */
function parseLine(line, index) {
  const parts = line.split(';');
  if (parts.length < 4) return null;

  const kanji = parts[0].trim();
  const hiragana = parts[1].trim();
  const meaning = parts[2].trim();
  const chapter = parts[3] ? parts[3].trim() : '';
  const level = parts[4] ? parts[4].trim() : '-';

  // Column 6 = importantity/grade (1, 2, or 3). Default to 1 if missing.
  let importantity = 1;
  if (parts[5] && !isNaN(parseInt(parts[5].trim(), 10))) {
    importantity = parseInt(parts[5].trim(), 10);
  }

  const cleanedHiragana = cleanReading(hiragana);
  const romaji = toRomaji(cleanedHiragana);

  return {
    id: `card_${index}`,
    kanji,
    hiragana,
    meaning,
    chapter,
    importantity,
    get isExtra() { return this.importantity === 2; },
    romaji,
    cleanedHiragana,
    level,
  };
}

/**
 * Load card data from dtmtjs.json
 * @returns {Promise<Array>}
 */
export async function loadData() {
  if (ALL_CARDS.length > 0) return ALL_CARDS;

  try {
    let response = await fetch('/dtmtjs.json');

    if (!response.ok) {
      console.warn(`[Data] First fetch failed (${response.status}), retrying with cache bust...`);
      response = await fetch('/dtmtjs.json?_t=' + Date.now(), { cache: 'no-store' });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    ALL_CARDS = json.cards.map(c => ({
      ...c,
      importantity: c.importantity ?? 1,
      get isExtra() { return this.importantity === 2; },
    }));

    console.log(`[Data] Loaded ${ALL_CARDS.length} cards from dtmtjs.json`);
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
 * Get cards filtered by chapters, selected grades, and JLPT level
 * 
 * Grades (from column 6 of dtmt.txt):
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
      if (card.level === '-') return false;
      
      if (jlpt !== 'all') {
        const jlptOrder = ['n5', 'n4', 'n3', 'n2', 'n1'];
        const selectedIdx = jlptOrder.indexOf(jlpt);
        const cardIdx = jlptOrder.indexOf(card.level.toLowerCase());
        
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
  const num = chapter.replace('Bab', '');
  return `Bab ${num}`;
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
