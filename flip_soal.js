import fs from 'fs';
import path from 'path';

const soalDir = path.resolve('./public/soal');

function main() {
    const files = fs.readdirSync(soalDir).filter(f => f.endsWith('.json'));
    console.log('Memproses pembalikan soal (50% Indo->Jepang, 50% Jepang->Indo)...');

    for (const file of files) {
        const filePath = path.join(soalDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        if (data.length === 0) continue;

        const halfway = Math.floor(data.length / 2);
        
        for (let i = 0; i < data.length; i++) {
            const q = data[i].question;
            const a = data[i].answer;
            
            // Cek mana yang mengandung huruf Jepang
            const isQJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(q);
            const isAJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(a);
            
            // Menentukan mana string Indo dan mana string Jepang
            let idText = q;
            let jpText = a;
            
            if (isQJapanese && !isAJapanese) {
                idText = a;
                jpText = q;
            } else if (!isQJapanese && isAJapanese) {
                idText = q;
                jpText = a;
            }
            
            // Terapkan aturan pembagian setengah-setengah
            if (i < halfway) {
                // Setengah pertama: Tanya Indo, Jawab Jepang
                data[i].question = idText;
                data[i].answer = jpText;
            } else {
                // Setengah kedua: Tanya Jepang, Jawab Indo
                data[i].question = jpText;
                data[i].answer = idText;
            }
        }
        
        // Acak urutan soal (shuffle) agar posisinya random dan user tidak menebak polanya
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ ${file} (Diperbarui: 50% Indo->JP, 50% JP->Indo)`);
    }
    
    console.log('\nSelesai memperbarui format soal!');
}

main();
