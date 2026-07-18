/**
 * Hiragana & Katakana → Romaji Converter
 * Complete mapping including dakuten, combo, double consonants, and special cases
 */

const HIRAGANA_MAP = {
  // Basic vowels
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  // K-row
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  // S-row
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  // T-row
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  // N-row
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  // H-row
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  // M-row
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  // Y-row
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  // R-row
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  // W-row
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo',
  // N
  'ん': 'n',
  
  // Dakuten (voiced)
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  
  // Handakuten (semi-voiced)
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
};

// Combination characters (must be checked before single chars)
const HIRAGANA_COMBO = {
  // Ki combinations
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  // Shi combinations
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  // Chi combinations
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  // Ni combinations
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  // Hi combinations
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  // Mi combinations
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  // Ri combinations
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  // Gi combinations
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  // Ji combinations
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  // Bi combinations
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  // Pi combinations
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
};

const KATAKANA_MAP = {
  // Basic vowels
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  // K-row
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  // S-row
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  // T-row
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  // N-row
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  // H-row
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  // M-row
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  // Y-row
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  // R-row
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  // W-row
  'ワ': 'wa', 'ヰ': 'wi', 'ヱ': 'we', 'ヲ': 'wo',
  // N
  'ン': 'n',
  
  // Dakuten
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  
  // Handakuten
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  
  // Special katakana
  'ヴ': 'vu',
};

const KATAKANA_COMBO = {
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
  // Extended katakana combos
  'ティ': 'ti', 'ディ': 'di', 'デュ': 'dyu',
  'ファ': 'fa', 'フィ': 'fi', 'フェ': 'fe', 'フォ': 'fo',
  'ウィ': 'wi', 'ウェ': 'we', 'ウォ': 'wo',
  'ヴァ': 'va', 'ヴィ': 'vi', 'ヴェ': 've', 'ヴォ': 'vo',
};

/**
 * Convert a Japanese kana string to romaji
 * @param {string} input - Hiragana/Katakana string
 * @returns {string} Romaji string
 */
export function toRomaji(input) {
  if (!input) return '';
  
  let result = '';
  let i = 0;
  const str = input.trim();
  
  while (i < str.length) {
    const char = str[i];
    const nextChar = i + 1 < str.length ? str[i + 1] : '';
    const combo = char + nextChar;
    
    // Check for small tsu (っ/ッ) — doubles the next consonant
    if (char === 'っ' || char === 'ッ') {
      // Look ahead for the next consonant
      if (i + 1 < str.length) {
        const nextCombo = str[i + 1] + (i + 2 < str.length ? str[i + 2] : '');
        const nextRomaji = HIRAGANA_COMBO[nextCombo] || KATAKANA_COMBO[nextCombo]
          || HIRAGANA_MAP[str[i + 1]] || KATAKANA_MAP[str[i + 1]];
        if (nextRomaji && nextRomaji.length > 0) {
          result += nextRomaji[0]; // Double the first consonant
        }
      }
      i++;
      continue;
    }
    
    // Check for long vowel mark (ー) — extend previous vowel
    if (char === 'ー') {
      if (result.length > 0) {
        result += result[result.length - 1]; // Repeat last vowel
      }
      i++;
      continue;
    }
    
    // Check combo (2-char) first
    if (HIRAGANA_COMBO[combo]) {
      result += HIRAGANA_COMBO[combo];
      i += 2;
      continue;
    }
    if (KATAKANA_COMBO[combo]) {
      result += KATAKANA_COMBO[combo];
      i += 2;
      continue;
    }
    
    // Check single char
    if (HIRAGANA_MAP[char]) {
      // Special handling for ん before vowels or y-sounds
      if (char === 'ん' && nextChar && 'あいうえおやゆよアイウエオヤユヨ'.includes(nextChar)) {
        result += "n'";
      } else {
        result += HIRAGANA_MAP[char];
      }
      i++;
      continue;
    }
    if (KATAKANA_MAP[char]) {
      if (char === 'ン' && nextChar && 'あいうえおやゆよアイウエオヤユヨ'.includes(nextChar)) {
        result += "n'";
      } else {
        result += KATAKANA_MAP[char];
      }
      i++;
      continue;
    }
    
    // Not a kana character — pass through (spaces, punctuation, kanji, etc.)
    result += char;
    i++;
  }
  
  return result;
}

/**
 * Clean hiragana reading for TTS - remove markers like ＊, Ⅰ, Ⅱ, Ⅲ, brackets etc
 * @param {string} reading 
 * @returns {string}
 */
export function cleanReading(reading) {
  return reading
    .replace(/＊/g, '')
    .replace(/Ⅰ|Ⅱ|Ⅲ/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/（.*?）/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/～/g, '')
    .replace(/[、。]/g, ' ')
    .trim();
}
