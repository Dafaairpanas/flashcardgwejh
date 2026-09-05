import fs from 'fs';
import path from 'path';

// Helper to convert chapter names based on old serverData logic
function formatMinnaChapter(file) {
  const num = file.replace('bab-', '').replace('.json', '');
  return num === 'extra' ? 'Bab Extra' : `Bab ${num}`;
}

function formatIrodoriChapter(folder, file) {
  let prefix = 'irA1';
  if (folder === 'a2-1') prefix = 'irA2.1';
  if (folder === 'a2-2') prefix = 'irA2.2';
  const babNum = file.replace('bab-', '').replace('.json', '');
  return `${prefix}-${babNum}`;
}

const dataDir = path.join(process.cwd(), 'src', 'data');
const allCards = [];
const kotobaCards = [];
const kanjiCards = [];

// For allSearchData
const searchCache = {
  minna: [],
  irodori: [],
  kanji: [],
  bunpou: [],
  renshuu: []
};

const seenGlobalIds = new Set();

function ensureUniqueId(item) {
  let id = item.id;
  if (!id) {
    // Generate an ID if it's completely missing
    id = item.kanji || item.pattern || item.title || `gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
  
  if (seenGlobalIds.has(id)) {
    let suffix = 1;
    while (seenGlobalIds.has(`${id}-dup${suffix}`)) {
      suffix++;
    }
    id = `${id}-dup${suffix}`;
  }
  seenGlobalIds.add(id);
  item.id = id;
  return item;
}

// 1. Minna Kotoba
const minnaDir = path.join(dataDir, 'minna');
if (fs.existsSync(minnaDir)) {
  const files = fs.readdirSync(minnaDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(minnaDir, file), 'utf8'));
      const chapterLabel = formatMinnaChapter(file);
      data.forEach(item => {
        const uniqueItem = ensureUniqueId(item);
        const card = { ...uniqueItem, chapter: chapterLabel, source: 'minna' };
        allCards.push(card);
        kotobaCards.push(card);
        searchCache.minna.push({ ...uniqueItem, chapter: chapterLabel, _category: 'minna' });
      });
    } catch (e) {}
  });
}

// 2. Irodori Kotoba
['a1', 'a2-1', 'a2-2'].forEach(folder => {
  const sectionDir = path.join(dataDir, 'irodori', folder);
  if (fs.existsSync(sectionDir)) {
    const files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(sectionDir, file), 'utf8'));
        const chapterLabel = formatIrodoriChapter(folder, file);
        data.forEach(item => {
          const uniqueItem = ensureUniqueId(item);
          const card = { ...uniqueItem, chapter: chapterLabel, source: 'irodori' };
          allCards.push(card);
          kotobaCards.push(card);
          searchCache.irodori.push({ ...uniqueItem, chapter: file.replace('.json', ''), _category: 'irodori' });
        });
      } catch (e) {}
    });
  }
});

// 3. Kanji
const kanjiDir = path.join(dataDir, 'kanji');
if (fs.existsSync(kanjiDir)) {
  const files = fs.readdirSync(kanjiDir).filter(f => f.endsWith('.json') && f !== 'irodorikanjidasar.json');
  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(kanjiDir, file), 'utf8'));
      const chapterLabel = file.replace('.json', '');
      
      // Keep track of exact duplicates to drop them entirely for Kanji
      const exactSeen = new Set();
      
      data.forEach(item => {
        const checkId = item.id || item.kanji;
        if (exactSeen.has(checkId)) return;
        exactSeen.add(checkId);
        
        const uniqueItem = ensureUniqueId(item);
        const card = { ...uniqueItem, chapter: chapterLabel, source: 'kanji', _sourceFile: file };
        allCards.push(card);
        kanjiCards.push(card);
        searchCache.kanji.push({ ...uniqueItem, chapter: chapterLabel, _category: 'kanji' });
      });
    } catch (e) {}
  });
}

// 4. Bunpou
const bunpouDir = path.join(dataDir, 'bunpou');
const apiBunpouDir = path.join(process.cwd(), 'public', 'api', 'bunpou');
if (!fs.existsSync(apiBunpouDir)) fs.mkdirSync(apiBunpouDir, { recursive: true });

if (fs.existsSync(bunpouDir)) {
  const bunpouSections = [
    { subPath: 'minna', apiTarget: 'minna', sourceName: 'minna' },
    { subPath: path.join('irodori', 'a1'), apiTarget: 'irodori-a1', sourceName: 'irodori' },
    { subPath: path.join('irodori', 'a2.1'), apiTarget: 'irodori-a2-1', sourceName: 'irodori' },
    { subPath: path.join('irodori', 'a2.2'), apiTarget: 'irodori-a2-2', sourceName: 'irodori' }
  ];

  bunpouSections.forEach(({ subPath, apiTarget, sourceName }) => {
    const subDir = path.join(bunpouDir, subPath);
    const apiSubDir = path.join(apiBunpouDir, apiTarget);
    if (!fs.existsSync(apiSubDir)) fs.mkdirSync(apiSubDir, { recursive: true });
    
    if (fs.existsSync(subDir)) {
      const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        try {
          const rawData = fs.readFileSync(path.join(subDir, file), 'utf8');
          const data = JSON.parse(rawData);
          
          // Ensure unique IDs before writing the processed JSON back out
          const rawList = Array.isArray(data)
            ? data
            : (data && typeof data === 'object' && Object.keys(data).length > 0 ? [data] : []);
          const processedData = rawList.map(item => ensureUniqueId(item));
          fs.writeFileSync(path.join(apiSubDir, file), JSON.stringify(processedData));

          // Also mirror for dot/dash aliases (e.g. irodori-a2-1 <-> irodori-a2.1)
          const altApiTarget = apiTarget.includes('a2-')
            ? apiTarget.replace('a2-', 'a2.')
            : apiTarget.replace('a2.', 'a2-');
          if (altApiTarget !== apiTarget) {
            const altSubDir = path.join(apiBunpouDir, altApiTarget);
            if (!fs.existsSync(altSubDir)) fs.mkdirSync(altSubDir, { recursive: true });
            fs.writeFileSync(path.join(altSubDir, file), JSON.stringify(processedData));
          }
          
          processedData.forEach(item => {
            searchCache.bunpou.push({
              ...item,
              chapter: item.chapter || file.replace('.json', ''),
              source: item.source || sourceName,
              _category: 'bunpou'
            });
          });
        } catch (e) {
          console.error(`Error processing bunpou file ${path.join(subDir, file)}:`, e);
        }
      });
    }
  });
}

// 5. Renshuu
const renshuuDir = path.join(dataDir, 'renshuu');
if (fs.existsSync(renshuuDir)) {
  const files = fs.readdirSync(renshuuDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(renshuuDir, file), 'utf8'));
      data.forEach(item => {
        const uniqueItem = ensureUniqueId(item);
        searchCache.renshuu.push({ ...uniqueItem, chapter: uniqueItem.chapter || file.replace('.json', ''), _category: 'renshuu' });
      });
    } catch (e) {}
  });
}


function extractChapters(cards) {
  const chapSet = new Set(cards.map(c => c.chapter));
  const chapters = [...chapSet];
  // Sort logic
  return chapters.sort((a, b) => {
    const aIsBab = a.startsWith('Bab');
    const bIsBab = b.startsWith('Bab');
    if (aIsBab && bIsBab) return parseInt(a.replace('Bab ', '')) - parseInt(b.replace('Bab ', ''));
    if (aIsBab && !bIsBab) return -1;
    if (!aIsBab && bIsBab) return 1;
    return a.localeCompare(b);
  });
}

const addSearchString = (cards) => cards.map(c => {
  const k = (c.kanji || '').toLowerCase().replace(/[\s~〜\-]/g, '');
  const h = (c.hiragana || '').toLowerCase().replace(/[\s~〜\-]/g, '');
  const r = (c.romaji || '').toLowerCase().replace(/[\s~〜\-]/g, '');
  const m = (c.meaning || '').toLowerCase();
  return { ...c, _searchString: `${k} ${h} ${r} ${m}` };
});

const apiDir = path.join(process.cwd(), 'public', 'api');
if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });

fs.writeFileSync(path.join(apiDir, 'all-cards.json'), JSON.stringify({
  cards: addSearchString(allCards),
  chapters: extractChapters(allCards)
}));

fs.writeFileSync(path.join(apiDir, 'kotoba.json'), JSON.stringify({
  cards: addSearchString(kotobaCards),
  chapters: extractChapters(kotobaCards)
}));

fs.writeFileSync(path.join(apiDir, 'kanji.json'), JSON.stringify({
  cards: addSearchString(kanjiCards),
  chapters: extractChapters(kanjiCards)
}));

fs.writeFileSync(path.join(apiDir, 'all-search-data.json'), JSON.stringify(searchCache));

console.log('API JSONs generated in public/api/');
