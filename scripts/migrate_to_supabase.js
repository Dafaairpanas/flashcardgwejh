import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('Starting migration to Supabase...');
  
  const jsonPath = path.join(__dirname, '../public/dtmtjs.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Data file not found at ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    process.exit(1);
  }

  const cards = data.cards;
  if (!cards || !Array.isArray(cards)) {
    console.error('Error: JSON does not have a valid "cards" array.');
    process.exit(1);
  }

  console.log(`Found ${cards.length} cards. Preparing data...`);

  // Transform data to match the Supabase table schema
  const formattedCards = cards.map(c => ({
    kanji: c.kanji,
    hiragana: c.hiragana,
    meaning: c.meaning,
    chapter: c.chapter,
    importantity: c.importantity ?? 1,
    level: c.level || '-'
  }));

  // Batch insert to avoid huge single requests
  const BATCH_SIZE = 500;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < formattedCards.length; i += BATCH_SIZE) {
    const batch = formattedCards.slice(i, i + BATCH_SIZE);
    console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} rows)...`);
    
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

  console.log('Migration completed!');
  console.log(`Successfully inserted: ${successCount}`);
  console.log(`Failed to insert: ${errorCount}`);
}

migrateData();
