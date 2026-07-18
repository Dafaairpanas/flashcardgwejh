/**
 * Text-to-Speech module for Japanese flashcards
 * Uses Web Speech API with Japanese voice
 * Falls back to romaji pronunciation if no Japanese voice available
 */

let japaneseVoice = null;
let voicesLoaded = false;

/**
 * Initialize TTS and find Japanese voice
 */
export function initTTS() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('[TTS] Speech synthesis not supported');
      resolve(false);
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Try to find a Japanese voice
      japaneseVoice = voices.find(v => v.lang.startsWith('ja')) || null;
      
      if (japaneseVoice) {
        console.log(`[TTS] Using Japanese voice: ${japaneseVoice.name}`);
      } else {
        console.warn('[TTS] No Japanese voice found, will use default');
      }
      voicesLoaded = true;
      resolve(true);
    };

    // Voices may load asynchronously
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.onvoiceschanged = loadVoices;
      // Timeout fallback
      setTimeout(() => {
        if (!voicesLoaded) {
          loadVoices();
        }
      }, 1000);
    }
  });
}

/**
 * Speak Japanese text using the kana reading
 * @param {string} text - The hiragana/katakana text to speak
 * @param {object} options - { rate, volume, pitch }
 * @returns {Promise<void>}
 */
export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
      utterance.lang = 'ja-JP';
    } else {
      utterance.lang = 'ja-JP';
    }
    
    utterance.rate = options.rate || 0.85;
    utterance.volume = options.volume || 1.0;
    utterance.pitch = options.pitch || 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('[TTS] Speech error:', e);
      resolve(); // Don't reject, just continue
    };

    speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

/**
 * Check if TTS is available
 */
export function isTTSAvailable() {
  return 'speechSynthesis' in window;
}

/**
 * Check if Japanese voice is available
 */
export function hasJapaneseVoice() {
  return japaneseVoice !== null;
}
