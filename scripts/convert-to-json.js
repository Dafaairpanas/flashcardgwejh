import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toRomaji, cleanReading } from '../src/romaji.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../public/datamatang.txt');
const outputPath = path.resolve(__dirname, '../public/datamatang.json');

function convertTxtToJson() {
  console.log(`Reading from: ${inputPath}`);
  
  if (!fs.existsSync(inputPath)) {
    console.error('File datamatang.txt not found!');
    process.exit(1);
  }

  const rawText = fs.readFileSync(inputPath, 'utf-8');
  const lines = rawText.split('\n').filter(line => line.trim().length > 0);

  const cards = [];
  const chapterSet = new Set();
  const levelStats = { n5: 0, n4: 0, n3: 0, n2: 0, n1: 0, unranked: 0 };
  const classStats = {};
  const importanceStats = { 1: 0, 2: 0, 3: 0 };

  lines.forEach((line, index) => {
    const parts = line.split(';');
    if (parts.length < 4) return;

    const kanji = parts[0].trim();
    const hiragana = parts[1].trim();
    const meaning = parts[2].trim();
    const rawChapter = parts[3] ? parts[3].trim() : '';
    const levelRaw = parts[4] ? parts[4].trim() : '-';
    const wordClassRaw = parts[5] ? parts[5].trim() : 'Unclassified';

    const isExtra = rawChapter.toLowerCase().endsWith('extra');
    const chapter = isExtra ? rawChapter.replace(/extra/i, '') : rawChapter;
    const chapterNumber = parseInt(chapter.replace(/\D/g, ''), 10) || 0;
    const level = levelRaw.toLowerCase();
    const wordClass = wordClassRaw || 'Unclassified';

    // Importantity mapping: 1 = Wajib, 2 = Extra, 3 = Tidak berguna
    // If parts[6] exists, use it; otherwise infer from isExtra (2 if extra, else 1)
    let importantity = 1;
    if (parts[6] && !isNaN(parseInt(parts[6].trim(), 10))) {
      importantity = parseInt(parts[6].trim(), 10);
    } else {
      importantity = isExtra ? 2 : 1;
    }

    chapterSet.add(chapter);

    if (levelStats[level] !== undefined) {
      levelStats[level]++;
    } else {
      levelStats.unranked++;
    }

    classStats[wordClass] = (classStats[wordClass] || 0) + 1;
    importanceStats[importantity] = (importanceStats[importantity] || 0) + 1;

    const cleanedHiragana = cleanReading(hiragana);
    const romaji = toRomaji(cleanedHiragana);

    cards.push({
      id: `card_${index}`,
      kanji,
      hiragana,
      cleanedHiragana,
      romaji,
      meaning,
      chapter,
      chapterNumber,
      importantity,
      level,
      wordClass
    });
  });

  const outputData = {
    metadata: {
      totalCards: cards.length,
      totalChapters: chapterSet.size,
      generatedAt: new Date().toISOString(),
      levelDistribution: levelStats,
      classDistribution: classStats,
      importanceDistribution: importanceStats
    },
    cards
  };

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`Successfully generated JSON: ${outputPath}`);
  console.log(`Total Cards: ${cards.length}`);
}

convertTxtToJson();
