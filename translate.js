import fs from 'fs';
import translate from 'google-translate-api-x';

const FILE_PATH = './public/kanji_jlpt_only.json';
const DELAY_MS = 600; // jeda antar request agar tidak kena blokir (rate limit) Google

async function main() {
    console.log("Membaca file data...");
    let rawdata = fs.readFileSync(FILE_PATH);
    let data = JSON.parse(rawdata);
    let keys = Object.keys(data);
    let updatedCount = 0;
    
    console.log(`Total data kanji ditemukan: ${keys.length}`);
    console.log("Memulai proses terjemahan ke Bahasa Indonesia...\n");
    
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let item = data[key];
        
        // Lewati yang sudah diterjemahkan agar kalau script terhenti, bisa dilanjutkan (resume)
        if (item._is_translated_id) {
            continue;
        }

        if (item.meanings && item.meanings.length > 0) {
            // Gabungkan meaning menjadi satu teks agar cukup 1x request ke Google Translate
            let textToTranslate = item.meanings.join(' | ');
            try {
                let res = await translate(textToTranslate, { to: 'id' });
                
                // Pecah kembali menjadi array
                let translatedArray = res.text.split('|').map(s => s.trim());
                
                // Ubah data artinya menjadi hasil terjemahan
                item.meanings = translatedArray;
                
                // Tandai bahwa ini sudah diterjemahkan
                item._is_translated_id = true;
                
                updatedCount++;
                process.stdout.write(`\r[${i + 1}/${keys.length}] Diterjemahkan: ${key} -> ${translatedArray.join(', ')}`.substring(0, 80));
                
                // Jeda agar tidak terkena Rate Limit API
                await new Promise(r => setTimeout(r, DELAY_MS));
                
            } catch (err) {
                console.error(`\n[!] Gagal menerjemahkan kanji ${key}: ${err.message}`);
                console.log("Menyimpan progres sebelum berhenti...");
                break;
            }
        } else {
            // Jika kanji tidak punya meaning, tandai saja supaya dilewati kedepannya
            item._is_translated_id = true; 
        }
        
        // Auto-save tiap 50 kanji agar tidak hilang jika script di-stop / crash
        if (updatedCount > 0 && updatedCount % 50 === 0) {
            fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
        }
    }
    
    // Final save untuk sisa data yang belum tersave
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    
    console.log('\n\n✅ Proses terjemahan selesai atau dihentikan. Data telah tersimpan!');
}

main();
