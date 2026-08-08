const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncChapter(chapterName) {
  const txtPath = path.join(__dirname, `../public/chapters/${chapterName}.txt`);

  if (!fs.existsSync(txtPath)) {
    console.error(`File tidak ditemukan: ${txtPath}`);
    return;
  }

  console.log(`\n=== Sinkronisasi ${chapterName} ===`);
  const content = fs.readFileSync(txtPath, 'utf-8');
  const lines = content.split('\n');

  const newCards = [];
  lines.forEach(line => {
    if (!line.trim()) return;
    const parts = line.split(';');
    if (parts.length >= 4) {
      const kanji = parts[0].trim();
      const hiragana = parts[1].trim();
      const meaning = parts[2].trim();
      const chapter = parts[3].trim();
      const level = parts[4] ? parts[4].trim() : '-';
      
      let importantity = 1;
      if (parts[5] && !isNaN(parseInt(parts[5].trim(), 10))) {
        importantity = parseInt(parts[5].trim(), 10);
      }

      newCards.push({
        kanji,
        hiragana,
        meaning,
        chapter,
        level,
        importantity
      });
    }
  });

  console.log(`Ditemukan ${newCards.length} kosakata.`);

  const { error: deleteError } = await supabase
    .from('cards')
    .delete()
    .eq('chapter', chapterName);

  if (deleteError) {
    console.error('Gagal menghapus data lama:', deleteError.message);
    return;
  }
  
  if (newCards.length > 0) {
    const BATCH_SIZE = 500;
    let successCount = 0;
    
    for (let i = 0; i < newCards.length; i += BATCH_SIZE) {
      const batch = newCards.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase
        .from('cards')
        .insert(batch);
      
      if (insertError) {
        console.error('Gagal memasukkan data baru:', insertError.message);
        return;
      }
      successCount += batch.length;
    }
    console.log(`Berhasil memasukkan ${successCount} kosakata baru untuk ${chapterName}!`);
  } else {
    console.log('Tidak ada data untuk dimasukkan.');
  }
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Harap masukkan nama bab. Contoh: node scripts/sync_chapter.cjs Bab26');
    console.error('Atau jalankan semua bab: node scripts/sync_chapter.cjs all');
    process.exit(1);
  }

  if (args[0].toLowerCase() === 'all') {
    const chaptersDir = path.join(__dirname, '../public/chapters');
    const files = fs.readdirSync(chaptersDir);
    const chapterNames = files
      .filter(f => f.endsWith('.txt'))
      .map(f => f.replace('.txt', ''))
      .sort();
      
    console.log(`Akan menyinkronkan ${chapterNames.length} bab ke Supabase...`);
    for (const chap of chapterNames) {
      await syncChapter(chap);
    }
    console.log('\n=== Semua sinkronisasi selesai! ===');
  } else {
    for (const chap of args) {
      await syncChapter(chap);
    }
  }
}

run();
