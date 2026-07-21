import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

const baseDir = path.resolve('./public/bunpou');

async function main() {
    console.log('Memulai Mesin Pengekstrak Teks (OCR)...');
    
    // Membuat worker tesseract, jpn+eng karena materi bahasa jepang 
    // biasanya juga mengandung romaji/teks latin penjelasan bahasa indonesia/inggris
    console.log('Sedang memuat data bahasa (Jepang + Inggris)...');
    let worker;
    try {
        worker = await createWorker('jpn+eng');
    } catch (err) {
        console.error('Gagal memuat worker Tesseract:', err);
        return;
    }
    
    try {
        if (!fs.existsSync(baseDir)) {
            console.error(`Folder tidak ditemukan: ${baseDir}`);
            return;
        }

        // Ambil semua sub-folder di dalam public/bunpou (misal: "1", "20", dll)
        const folders = fs.readdirSync(baseDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
            
        console.log(`Ditemukan ${folders.length} folder untuk diproses.\n`);

        for (const folder of folders) {
            const folderPath = path.join(baseDir, folder);
            
            // Ambil semua gambar lalu urutkan secara alfabetik
            const files = fs.readdirSync(folderPath)
                .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
                .sort(); 
                
            if (files.length === 0) {
                console.log(`[Folder: ${folder}] Tidak ada file gambar. Melewati...`);
                continue;
            }
            
            console.log(`[Folder: ${folder}] Mulai mengekstrak ${files.length} gambar...`);
            let combinedText = '';
            
            for (let i = 0; i < files.length; i++) {
                const imgName = files[i];
                const filePath = path.join(folderPath, imgName);
                process.stdout.write(`  -> Membaca ${imgName} ... `);
                
                try {
                    const { data: { text } } = await worker.recognize(filePath);
                    combinedText += `\n--- Halaman: ${imgName} ---\n\n`;
                    combinedText += text;
                    process.stdout.write(`(Selesai)\n`);
                } catch (readErr) {
                    process.stdout.write(`(GAGAL: ${readErr.message})\n`);
                }
            }
            
            // Simpan menjadi misal: public/bunpou/1/1.txt
            const outPath = path.join(folderPath, `${folder}.txt`);
            fs.writeFileSync(outPath, combinedText.trim(), 'utf-8');
            console.log(`✅ Teks gabungan berhasil disimpan di: ${outPath}\n`);
        }

    } catch (err) {
        console.error('\nTerjadi error saat membaca folder:', err);
    } finally {
        if (worker) {
            await worker.terminate();
        }
        console.log('🏁 Semua operasi selesai!');
    }
}

main();
