import fs from 'fs';
import path from 'path';
import { translate } from 'google-translate-api-x';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'public', 'kanji_jlpt_only.json');
let kanjiData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Helper to save progress
function saveProgress() {
    fs.writeFileSync(jsonPath, JSON.stringify(kanjiData, null, 2), 'utf8');
    console.log('Progress saved to kanji_jlpt_only.json');
}

async function translateHeisig() {
    const keys = Object.keys(kanjiData);
    let count = 0;
    
    console.log(`Total kanjis loaded: ${keys.length}`);

    for (let i = 0; i < keys.length; i++) {
        const kanji = keys[i];
        const data = kanjiData[kanji];

        // Skip if already translated or no English heisig
        if (data.heisig_id || !data.heisig_en) {
            continue;
        }

        try {
            console.log(`Translating [${count+1}] ${kanji}: ${data.heisig_en} ...`);
            const res = await translate(data.heisig_en, { from: 'en', to: 'id' });
            
            data.heisig_id = res.text.toLowerCase();
            data._is_heisig_translated = true;
            
            console.log(` => ${data.heisig_id}`);
            count++;

            // Save every 20 translations to avoid losing progress if rate-limited
            if (count % 20 === 0) {
                saveProgress();
            }

            // Small delay to prevent rate-limiting (300ms)
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (error) {
            console.error(`Error translating ${kanji}:`, error.message);
            console.log('Stopping due to error. You can run the script again later to resume.');
            break;
        }
    }

    if (count > 0) {
        saveProgress();
        console.log(`Done! Successfully translated ${count} new items.`);
    } else {
        console.log('Nothing to translate or already fully translated.');
    }
}

translateHeisig();
