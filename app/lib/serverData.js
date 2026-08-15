import fs from 'fs';
import path from 'path';
import { toRomaji, cleanReading } from '../../src/romaji.js';

/**
 * Read all flashcard JSON files from src/data/ and return a unified card array.
 * Used at build-time by server components.
 *
 * Card format (normalized):
 *   { id, kanji, hiragana, romaji, meaning, level, importantity, isExtra, chapter, source, cleanedHiragana }
 */
export async function fetchAllCards() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  let allCards = [];

  // ═══ Minna no Nihongo (50 chapters) ═══
  const minnaDir = path.join(dataDir, 'minna');
  for (let i = 1; i <= 50; i++) {
    const num = String(i).padStart(2, '0');
    const filePath = path.join(minnaDir, `bab-${num}.json`);
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const cards = raw.map(card => ({
        id: card.id,
        kanji: card.kanji || '',
        hiragana: card.hiragana || '',
        romaji: card.romaji || toRomaji(cleanReading(card.hiragana || '')),
        meaning: card.meaning || '',
        level: card.level || '-',
        importantity: card.importinity ?? 1,
        isExtra: (card.importinity ?? 1) === 2,
        chapter: `Bab${num}`,
        source: 'minna',
        cleanedHiragana: cleanReading(card.hiragana || ''),
      }));
      allCards.push(...cards);
    } catch (e) {
      // File doesn't exist or parse error — skip
    }
  }

  // ═══ Irodori (a1, a2-1, a2-2 — each up to 18 chapters) ═══
  const irodoriSections = [
    { folder: 'a1', prefix: 'irA1' },
    { folder: 'a2-1', prefix: 'irA2.1' },
    { folder: 'a2-2', prefix: 'irA2.2' },
  ];

  for (const section of irodoriSections) {
    const sectionDir = path.join(dataDir, 'irodori', section.folder);
    let files = [];
    try {
      files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.json')).sort();
    } catch (e) {
      continue; // Section folder doesn't exist
    }

    for (const file of files) {
      const babNum = file.replace('bab-', '').replace('.json', '');
      const filePath = path.join(sectionDir, file);
      try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const cards = raw.map(card => ({
          id: card.id,
          kanji: card.kanji || '',
          hiragana: card.hiragana || '',
          romaji: card.romaji || toRomaji(cleanReading(card.hiragana || '')),
          meaning: card.meaning || '',
          level: card.level || '-',
          importantity: card.isExtra ? 2 : 1,
          isExtra: card.isExtra || false,
          chapter: `${section.prefix}-${babNum}`,
          source: 'irodori',
          cleanedHiragana: cleanReading(card.hiragana || ''),
        }));
        allCards.push(...cards);
      } catch (e) {
        // Skip bad files
      }
    }
  }

  return allCards;
}

/**
 * Read kanji data from src/data/kanji/ per-level files.
 * Returns flat array of kanji objects.
 */
export async function fetchKanjiByLevel() {
  const kanjiDir = path.join(process.cwd(), 'src', 'data', 'kanji');
  let allKanji = [];

  const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
  for (const level of levels) {
    const filePath = path.join(kanjiDir, `${level}.json`);
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allKanji.push(...raw);
    } catch (e) {
      // Skip missing level files
    }
  }

  return allKanji;
}

/**
 * Extract unique, sorted chapter names from a cards array.
 */
export function getChaptersFromCards(cards) {
  const chapSet = new Set(cards.map(c => c.chapter));
  return sortChapters([...chapSet]);
}

/**
 * Sort chapter names:
 *   - Bab chapters first, sorted numerically (Bab01, Bab02, …)
 *   - Irodori chapters second, sorted alphabetically (irA1-01, irA2.1-01, …)
 */
export function sortChapters(chapters) {
  return chapters.sort((a, b) => {
    const aIsBab = a.startsWith('Bab');
    const bIsBab = b.startsWith('Bab');

    if (aIsBab && bIsBab) {
      return parseInt(a.replace('Bab', ''), 10) - parseInt(b.replace('Bab', ''), 10);
    }
    if (aIsBab && !bIsBab) return -1;
    if (!aIsBab && bIsBab) return 1;

    // Both irodori — alphabetical is fine (irA1-01 < irA2.1-01 < irA2.2-01)
    return a.localeCompare(b);
  });
}
