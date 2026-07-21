import fs from 'fs';
import translate from 'google-translate-api-x';

const FILE_PATH = './public/kanji_jlpt_only.json';
const DELAY_MS = 600; // Jeda 600ms anti rate-limit

async function main() {
    console.log("Membaca file data...");
    let rawdata = fs.readFileSync(FILE_PATH);
    let data = JSON.parse(rawdata);
    let keys = Object.keys(data);
    let updatedCount = 0;
    
    console.log(`Total data kanji: ${keys.length}`);
    console.log("Memulai proses terjemahan 'heisig_en' ke Bahasa Indonesia...\n");
    
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let item = data[key];
        
        // Lewati jika tidak ada heisig_en atau jika sudah diterjemahkan
        if (!item.heisig_en || item._is_heisig_translated) {
            continue;
        }

        try {
            let textToTranslate = item.heisig_en;
            let res = await translate(textToTranslate, { to: 'id' });
            
            // Simpan hasil terjemahannya (menimpa atau bisa tambah key baru heisig_id)
            item.heisig_id = res.text.toLowerCase(); // Biasanya Heisig kata kuncinya kecil
            
            // Tandai sudah di-translate
            item._is_heisig_translated = true;
            
            updatedCount++;
            process.stdout.write(`\r[${i + 1}/${keys.length}] Diterjemahkan: ${key} (Heisig: ${item.heisig_en} -> ${item.heisig_id})`.substring(0, 80));
            
            await new Promise(r => setTimeout(r, DELAY_MS));
            
        } catch (err) {
            console.error(`\n[!] Gagal menerjemahkan heisig kanji ${key}: ${err.message}`);
            break; // Berhenti sementara kalau kena limit
        }
        
        // Auto-save tiap 50 data
        if (updatedCount > 0 && updatedCount % 50 === 0) {
            fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
        }
    }
    
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    
    console.log('\n\n✅ Proses terjemahan Heisig selesai atau dihentikan! Data telah disimpan.');
}

main();
