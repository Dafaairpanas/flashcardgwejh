const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'data', 'bunpou');

// Make sure base directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Generate Minna (Bab 1-50)
const minnaDir = path.join(baseDir, 'minna');
if (!fs.existsSync(minnaDir)) fs.mkdirSync(minnaDir);

for (let i = 1; i <= 50; i++) {
  const file = `bab${String(i).padStart(2, '0')}.json`;
  const p = path.join(minnaDir, file);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, '[]\n', 'utf8');
  }
}

// Generate Irodori
const irodoriLevels = ['a1', 'a2.1', 'a2.2'];
const irodoriBase = path.join(baseDir, 'irodori');
if (!fs.existsSync(irodoriBase)) fs.mkdirSync(irodoriBase);

irodoriLevels.forEach(level => {
  const levelDir = path.join(irodoriBase, level);
  if (!fs.existsSync(levelDir)) fs.mkdirSync(levelDir, { recursive: true });
  
  for (let i = 1; i <= 18; i++) {
    const file = `bab${String(i).padStart(2, '0')}.json`;
    const p = path.join(levelDir, file);
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, '[]\n', 'utf8');
    }
  }
});

console.log("Structure generated successfully!");
