const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');
const cssPath = path.join(__dirname, '..', 'src', 'fonts.css');

if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Inter: 400, 500, 600, 700
// Noto Sans JP: 400, 500, 700
const fonts = [
  { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', name: 'Inter' },
  { url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap', name: 'Noto_Sans_JP' }
];

async function fetchCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function downloadFont(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  let localCss = '';
  
  for (const font of fonts) {
    console.log(`Fetching CSS for ${font.name}...`);
    const css = await fetchCss(font.url);
    
    // Replace URL with local path and download
    let modifiedCss = css;
    const urlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
    
    let match;
    let index = 0;
    while ((match = urlRegex.exec(css)) !== null) {
      const woff2Url = match[1];
      const filename = `${font.name}_${index}.woff2`;
      const filepath = path.join(fontsDir, filename);
      
      console.log(`Downloading ${filename}...`);
      await downloadFont(woff2Url, filepath);
      
      // Replace URL in CSS
      modifiedCss = modifiedCss.replace(woff2Url, `/fonts/${filename}`);
      index++;
    }
    
    localCss += modifiedCss + '\n\n';
  }
  
  fs.writeFileSync(cssPath, localCss);
  console.log('Done! local CSS written to src/fonts.css');
}

run();
