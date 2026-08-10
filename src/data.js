import { toRomaji, cleanReading } from './romaji.js';
import { supabase } from './supabaseClient.js';

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
 * Load card data from Supabase
 * @returns {Promise<Array>}
 */
export async function loadData(forceRefresh = false) {
  if (ALL_CARDS.length > 0 && !forceRefresh) return ALL_CARDS;

  const CACHE_KEY = 'FC_OFFLINE_CARDS';

  // If browser explicitly says we are offline, skip network and load cache directly
  if (!navigator.onLine) {
    console.log('[Data] Device is offline, trying to load from local cache...');
    return loadFromCache(CACHE_KEY);
  }

  try {
    let allFetchedData = [];
    let start = 0;
    const PAGE_SIZE = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .range(start, start + PAGE_SIZE - 1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        allFetchedData.push(...data);
        if (data.length < PAGE_SIZE) {
          hasMore = false; // no more data
        } else {
          start += PAGE_SIZE;
        }
      } else {
        hasMore = false;
      }
    }
    
    if (allFetchedData.length > 0) {
      ALL_CARDS = allFetchedData.map(c => ({
        ...c,
        importantity: c.importantity ?? 1,
        get isExtra() { return this.importantity === 2; },
        cleanedHiragana: cleanReading(c.hiragana),
        romaji: toRomaji(cleanReading(c.hiragana)),
      }));
      console.log(`[Data] Loaded ${ALL_CARDS.length} cards from Supabase`);
      
      // Cache for offline use
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(ALL_CARDS));
      } catch (e) {
        console.warn('[Data] Failed to cache data to localStorage:', e);
      }
      
      return ALL_CARDS;
    }
  } catch (err) {
    console.error('[Data] Failed to load from Supabase:', err);
  }

  // If Supabase failed (e.g. network error, server down), fallback to cache
  console.warn('[Data] Fetch failed, falling back to local cache.');
  return loadFromCache(CACHE_KEY);
}

/**
 * Load cards from localStorage
 */
function loadFromCache(cacheKey) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // We need to reattach the getter for isExtra since JSON stringify strips it
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
  
  console.warn('[Data] No offline cache available.');
  return [];
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
