const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/renshuu/jfta2kanji.txt');
const text = fs.readFileSync(filePath, 'utf8');

// Clean up the text:
// Remove the header
let cleanText = text.replace('番号 漢字 読み方 意味', '');

// Split by tokens
const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const items = [];
let currentItem = null;
let expectedNumber = 1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Try to match the start of a new item: "Number Kanji Reading" or just "Number"
  const matchFull = line.match(/^(\d+)\s+([^\s]+)\s+([^\s]+)\s*(.*)$/);
  const matchPartial = line.match(/^(\d+)\s+([^\s]+)\s+([^\s]+)$/);
  const matchNumOnly = line.match(/^(\d+)$/);

  let numStr = null;
  if (matchFull) numStr = matchFull[1];
  else if (matchPartial) numStr = matchPartial[1];
  else if (matchNumOnly) numStr = matchNumOnly[1];

  if (numStr && parseInt(numStr) === expectedNumber) {
    // Found the next item
    if (currentItem) items.push(currentItem);
    
    currentItem = {
      id: `jfta2_kanji_${expectedNumber}`,
      chapter: 'JFT A2',
      kanji: '',
      hiragana: '',
      meaning: '',
      importantity: 1
    };

    if (matchFull) {
      currentItem.kanji = matchFull[2];
      currentItem.hiragana = matchFull[3];
      currentItem.meaning = matchFull[4];
    } else if (matchPartial) {
      currentItem.kanji = matchPartial[2];
      currentItem.hiragana = matchPartial[3];
    } else if (matchNumOnly) {
      // The kanji and reading are likely on the next line
    }
    
    expectedNumber++;
  } else {
    // If we have a current item, this line belongs to it
    if (currentItem) {
      if (!currentItem.kanji) {
        // Next line after a NumOnly might be "Kanji Reading"
        const krMatch = line.match(/^([^\s]+)\s+([^\s]+)\s*(.*)$/);
        if (krMatch) {
          currentItem.kanji = krMatch[1];
          currentItem.hiragana = krMatch[2];
          if (krMatch[3]) currentItem.meaning += krMatch[3];
        } else {
          // Fallback
          currentItem.meaning += (currentItem.meaning ? ' ' : '') + line;
        }
      } else {
        // Just append to meaning
        currentItem.meaning += (currentItem.meaning ? ' ' : '') + line;
      }
    }
  }
}

if (currentItem) items.push(currentItem);

// Write to JSON
const outPath = path.join(__dirname, 'src/data/renshuu/jfta2kanji.json');
fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');

console.log(`Successfully parsed ${items.length} items to ${outPath}`);
