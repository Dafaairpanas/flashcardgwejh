import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { toRomaji, cleanReading } from '../src/romaji.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncChapters() {
  console.log('Starting chapter synchronization to Supabase...');
  
  const chaptersDir = path.join(__dirname, '../public/chapters');
  if (!fs.existsSync(chaptersDir)) {
    console.error(`Error: Directory not found at ${chaptersDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.txt'));
  if (files.length === 0) {
    console.log('No .txt files found in public/chapters. Nothing to sync.');
    process.exit(0);
  }

  let allParsedCards = [];
  let chaptersFound = new Set();

  for (const file of files) {
    const filePath = path.join(chaptersDir, file);
    const rawText = fs.readFileSync(filePath, 'utf-8');
    const lines = rawText.split('\n').filter(line => line.trim().length > 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(';');
      if (parts.length < 4) continue;

      const kanji = parts[0].trim();
      const hiragana = parts[1].trim();
      const meaning = parts[2].trim();
      const rawChapter = parts[3] ? parts[3].trim() : '';
      const levelRaw = parts[4] ? parts[4].trim() : '-';
      
      let wordClass = 'Unclassified';
      let importantity = 1;

      // Detect if column 5 is importantity or wordClass
      if (parts.length === 6) {
        if (!isNaN(parseInt(parts[5].trim(), 10))) {
          importantity = parseInt(parts[5].trim(), 10);
        } else {
          wordClass = parts[5].trim();
        }
      } else if (parts.length >= 7) {
        wordClass = parts[5].trim() || 'Unclassified';
        importantity = parseInt(parts[6].trim(), 10) || 1;
      }

      const isExtra = rawChapter.toLowerCase().endsWith('extra');
      const chapter = isExtra ? rawChapter.replace(/extra/i, '') : rawChapter;
      const level = levelRaw.toLowerCase();

      chaptersFound.add(chapter);

      allParsedCards.push({
        kanji,
        hiragana,
        meaning,
        chapter,
        level,
        importantity
      });
    }
  }

  const chaptersArray = Array.from(chaptersFound);
  console.log(`Found ${allParsedCards.length} cards across ${chaptersArray.length} chapters.`);
  console.log('Chapters:', chaptersArray.join(', '));

  // 1. Delete existing cards for these chapters
  console.log('\nDeleting existing data for these chapters in Supabase to avoid duplicates...');
  const { error: delError } = await supabase
    .from('cards')
    .delete()
    .in('chapter', chaptersArray);

  if (delError) {
    console.error('Error deleting old chapters:', delError.message);
    process.exit(1);
  }
  console.log('Successfully deleted old data.');

  // 2. Insert new parsed cards
  console.log('\nInserting fresh data from text files...');
  
  const BATCH_SIZE = 500;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allParsedCards.length; i += BATCH_SIZE) {
    const batch = allParsedCards.slice(i, i + BATCH_SIZE);
    
    const { error } = await supabase
      .from('cards')
      .insert(batch);

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
    }
  }

  console.log('\n--- Sync Completed ---');
  console.log(`Successfully inserted: ${successCount}`);
  if (errorCount > 0) {
    console.log(`Failed to insert: ${errorCount}`);
  }
}

syncChapters();
