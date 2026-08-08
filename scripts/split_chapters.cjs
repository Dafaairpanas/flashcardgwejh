const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data.txt');
const outDir = path.join(__dirname, '../public/chapters');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

try {
  const content = fs.readFileSync(dataPath, 'utf-8');
  const lines = content.split('\n');
  
  const chapterMap = {};
  
  lines.forEach(line => {
    if (!line.trim()) return;
    const parts = line.split(';');
    if (parts.length >= 4) {
      const chapter = parts[3].trim();
      if (chapter) {
        if (!chapterMap[chapter]) {
          chapterMap[chapter] = [];
        }
        chapterMap[chapter].push(line.trim());
      }
    }
  });
  
  for (const [chapter, chapterLines] of Object.entries(chapterMap)) {
    const outFile = path.join(outDir, `${chapter}.txt`);
    fs.writeFileSync(outFile, chapterLines.join('\n'), 'utf-8');
  }
  
  console.log(`Berhasil memisahkan data menjadi ${Object.keys(chapterMap).length} bab di folder public/chapters/`);
} catch (error) {
  console.error("Gagal memproses file:", error);
}
