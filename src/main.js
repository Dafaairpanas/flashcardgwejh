/**
 * FlashcardGW — Main Application Controller
 * Handles all views, user interactions, and state management
 */

import './style.css';
import { loadData, getChapters, getCardsByChapters, shuffleCards, chapterDisplayName, getChapterStats } from './data.js';
import { FSRSStateManager, Rating } from './fsrs.js';
import { initTTS, speak, stopSpeech } from './tts.js';
import { registerSW } from 'virtual:pwa-register';
import { initDictionary } from './dictionary.js';
import { initKanjiPage } from './kanji-page.js';
import { initQuiz } from './quiz.js';

// Register PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Optional: show a prompt to user to refresh for new version
    console.log('New content available, refresh to update.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

// ── App State ──
const state = {
  // Setup
  selectedChapters: [],
  filterMode: 'all',    // 'all' | 'main' | 'extra'
  jlptFilter: 'all',    // 'all' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
  studyMode: 1,          // 1-4
  soundEnabled: true,

  // Study session
  sessionCards: [],
  currentIndex: 0,
  isFlipped: false,
  sessionStartTime: null,
  totalReviewed: 0,
  totalCorrect: 0,       // Good + Easy count
  cardsUntilNextColor: Math.floor(Math.random() * 6) + 10, // 10 to 15

  // Data
  allCards: [],
  chapters: [],
};

// FSRS manager
const fsrs = new FSRSStateManager();

// ── DOM Refs ──
const $ = (id) => document.getElementById(id);
const views = {
  loading: $('loading-view'),
  setup: $('setup-view'),
  study: $('study-view'),
  complete: $('complete-view'),
  dictionary: $('dictionary-view'),
  kanji: $('kanji-view'),
  quiz: $('quiz-view'),
};

// Track which pages have been initialized
const pageInitialized = { dictionary: false, kanji: false, quiz: false };

function showView(name) {
  Object.values(views).forEach(v => { if (v) v.classList.remove('active'); });
  if (views[name]) views[name].classList.add('active');
  
  // Lazy-init pages on first visit
  if (name === 'dictionary' && !pageInitialized.dictionary) {
    initDictionary();
    pageInitialized.dictionary = true;
  }
  if (name === 'kanji' && !pageInitialized.kanji) {
    initKanjiPage();
    pageInitialized.kanji = true;
  }
  if (name === 'quiz' && !pageInitialized.quiz) {
    initQuiz();
    pageInitialized.quiz = true;
  }
}

// ── Hidden Menu ──
function toggleHiddenMenu() {
  const menu = $('hidden-menu');
  const overlay = $('hidden-menu-overlay');
  const isOpen = menu.classList.contains('active');
  if (isOpen) {
    closeHiddenMenu();
  } else {
    menu.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeHiddenMenu() {
  $('hidden-menu').classList.remove('active');
  $('hidden-menu-overlay').classList.remove('active');
}

// ── Toast ──
let toastTimer = null;
function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Dynamic Theme Colors ──
function changeThemeColor() {
  const h1 = Math.floor(Math.random() * 360);
  const h2 = (h1 + 30 + Math.floor(Math.random() * 60)) % 360;
  const color1 = `hsl(${h1}, 85%, 65%)`;
  const color2 = `hsl(${h2}, 85%, 60%)`;
  
  document.documentElement.style.setProperty('--accent-sakura', color1);
  document.documentElement.style.setProperty('--accent-violet', color2);
}

// ══════════════════════════════════
//  INITIALIZATION
// ══════════════════════════════════

async function init() {
  showView('loading');

  // Load data
  state.allCards = await loadData();
  if (state.allCards.length === 0) {
    $('loading-view').innerHTML = `
      <div class="loading-screen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:48px; height:48px; color:var(--accent-rose);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p class="loading-text">Failed to initialize workspace.</p>
        <p class="loading-text">Ensure <code>data.txt</code> exists in the <code>public/</code> directory.</p>
      </div>
    `;
    return;
  }

  state.chapters = getChapters();

  // Init TTS
  await initTTS();

  // Restore saved preferences
  restorePreferences();

  // Build UI
  buildChapterGrid();
  setupEventListeners();
  updateStats();

  // Show setup
  showView('setup');
}

// ── Preferences ──
function savePreferences() {
  localStorage.setItem('fcgw_prefs', JSON.stringify({
    selectedChapters: state.selectedChapters,
    filterMode: state.filterMode,
    jlptFilter: state.jlptFilter,
    studyMode: state.studyMode,
    soundEnabled: state.soundEnabled,
  }));
}

function restorePreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem('fcgw_prefs'));
    if (saved) {
      state.selectedChapters = saved.selectedChapters || [];
      state.filterMode = saved.filterMode || 'all';
      state.jlptFilter = saved.jlptFilter || 'all';
      state.studyMode = saved.studyMode || 1;
      state.soundEnabled = saved.soundEnabled !== false;
    }
  } catch { /* ignore */ }

  // Update sound icon
  const svgs = {
    on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',
    off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
  };
  $('nav-sound-toggle').innerHTML = state.soundEnabled ? svgs.on : svgs.off;
}

// ══════════════════════════════════
//  SETUP VIEW
// ══════════════════════════════════

function buildChapterGrid() {
  const grid = $('chapter-grid');
  grid.innerHTML = '';

  state.chapters.forEach(ch => {
    const stats = getChapterStats(ch);
    const chip = document.createElement('div');
    chip.className = 'chapter-chip' + (state.selectedChapters.includes(ch) ? ' selected' : '');
    chip.dataset.chapter = ch;
    chip.textContent = chapterDisplayName(ch);
    chip.title = `Utama: ${stats.main} | Extra: ${stats.extra}`;
    chip.addEventListener('click', () => toggleChapter(ch));
    grid.appendChild(chip);
  });

  // Update filter & mode UI from state
  document.querySelectorAll('#filter-group .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === state.filterMode);
  });
  document.querySelectorAll('#jlpt-group .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.jlpt === state.jlptFilter);
  });
  document.querySelectorAll('.mode-card').forEach(card => {
    card.classList.toggle('selected', parseInt(card.dataset.mode) === state.studyMode);
  });
  
  const jlptBento = document.getElementById('bento-jlpt');
  if (jlptBento) {
    if (state.studyMode === 2) {
      jlptBento.classList.remove('hidden');
    } else {
      jlptBento.classList.add('hidden');
    }
  }

  updateChapterBadge();
  updateCardCount();
}

function toggleChapter(ch) {
  const idx = state.selectedChapters.indexOf(ch);
  if (idx === -1) {
    state.selectedChapters.push(ch);
  } else {
    state.selectedChapters.splice(idx, 1);
  }

  // Update chip UI
  document.querySelectorAll('.chapter-chip').forEach(chip => {
    chip.classList.toggle('selected', state.selectedChapters.includes(chip.dataset.chapter));
  });

  updateChapterBadge();
  updateCardCount();
  updateStats();
  savePreferences();
}

function updateChapterBadge() {
  $('chapter-count-badge').textContent = `${state.selectedChapters.length} dipilih`;
}

function updateCardCount() {
  const cards = getCardsByChapters(state.selectedChapters, state.filterMode, state.jlptFilter, state.studyMode);
  const count = cards.length;
  $('card-count-label').textContent = count > 0
    ? `${count} kartu siap dipelajari`
    : 'Pilih bab untuk mulai';
  $('start-btn').disabled = count === 0;
}

function updateStats() {
  const cards = getCardsByChapters(state.selectedChapters, state.filterMode, state.jlptFilter, state.studyMode);
  const stats = fsrs.getStats(cards);
  $('stat-total').textContent = stats.total;
  $('stat-new').textContent = stats.newCount;
  $('stat-learning').textContent = stats.learningCount;
  $('stat-due').textContent = stats.dueCount;
}

// ══════════════════════════════════
//  STUDY SESSION
// ══════════════════════════════════

function startStudy() {
  const cards = getCardsByChapters(state.selectedChapters, state.filterMode, state.jlptFilter, state.studyMode);
  if (cards.length === 0) {
    showToast('Pilih minimal 1 bab!');
    return;
  }

  // Build queue: FSRS-sorted, then shuffle new cards
  const sorted = fsrs.getSortedQueue(cards);
  state.sessionCards = sorted;
  state.currentIndex = 0;
  state.isFlipped = false;
  state.sessionStartTime = Date.now();
  state.totalReviewed = 0;
  state.totalCorrect = 0;

  showView('study');
  showCard();
}

function showCard() {
  if (state.currentIndex >= state.sessionCards.length) {
    finishSession();
    return;
  }

  const card = state.sessionCards[state.currentIndex];
  state.isFlipped = false;

  // Reset flip
  $('card-back').classList.add('hidden');
  $('rating-area').classList.add('hidden');

  // Update progress
  const progress = state.sessionCards.length > 0
    ? (state.currentIndex / state.sessionCards.length) * 100
    : 0;
  $('progress-fill').style.width = `${progress}%`;
  $('progress-text').textContent = `${state.currentIndex + 1}/${state.sessionCards.length}`;

  // Update study info
  const remainingCards = state.sessionCards.slice(state.currentIndex);
  const stats = fsrs.getStats(remainingCards);
  $('study-new').textContent = stats.newCount;
  $('study-learning').textContent = stats.learningCount;
  $('study-due').textContent = stats.dueCount;

  // Render card faces based on mode
  renderCardFront(card);
  renderCardBack(card);

  // Auto-play sound for mode 4 (Suara Saja)
  if (state.soundEnabled && state.studyMode === 4) {
    setTimeout(() => playCardSound(card), 400);
  }
}

function renderCardFront(card) {
  const front = $('card-front');
  let html = '';

  switch (state.studyMode) {
    case 1: // Kanji + Furigana → Arti
      html = `
        <div class="card-furigana">${card.hiragana}</div>
        <div class="card-kanji">${card.kanji}</div>
      `;
      break;

    case 2: // Kanji (Recall)
      html = `
        <div class="card-furigana" id="hint-kana" style="opacity:0; transition:opacity 0.3s">${card.hiragana}</div>
        <div class="card-kanji">${card.kanji}</div>
        <button class="btn btn-ghost btn-sm" id="btn-show-hint" style="margin-top:12px; z-index:10" onclick="event.stopPropagation()">Reveal Hint</button>
      `;
      break;

    case 3: // Arti → Kanji + Furigana
      html = `
        <div class="card-meaning">${card.meaning}</div>
      `;
      break;

    case 4: // Sound only → Arti
      html = `
        <button class="card-sound-btn" id="front-sound-btn" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        </button>
        <div class="card-romaji" style="margin-top:12px; font-size:0.85rem">Listen to the audio</div>
      `;
      break;
  }

  html += `<span class="card-chapter-tag">${chapterDisplayName(card.chapter)}${card.isExtra ? ' ✦' : ''}</span>`;
  html += `<span class="card-tap-hint">Tap untuk membalik</span>`;
  front.innerHTML = html;

  // Rebind sound button for Mode 4
  const soundBtn = front.querySelector('#front-sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playCardSound(card);
    });
  }

  // Handle hint button for Mode 2
  const hintBtn = front.querySelector('#btn-show-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const kana = front.querySelector('#hint-kana');
      if (kana) kana.style.opacity = '1';
      hintBtn.style.display = 'none';
      if (state.soundEnabled) {
        playCardSound(card);
      }
    });
  }
}

function renderCardBack(card) {
  const back = $('card-back');
  let html = '';

  switch (state.studyMode) {
    case 1: // Back: Arti
    case 2:
      html = `
        <div class="card-meaning">${card.meaning}</div>
        <div class="card-meaning-sub">${card.hiragana}</div>
      `;
      break;
 
    case 3: // Back: Kanji + Furigana
      html = `
        <div class="card-furigana">${card.hiragana}</div>
        <div class="card-kanji">${card.kanji}</div>
      `;
      break;
 
    case 4: // Back: Arti
      html = `
        <div class="card-meaning">${card.meaning}</div>
        <div class="card-meaning-sub">${card.kanji} — ${card.hiragana}</div>
      `;
      break;
  }

  html += `<span class="card-chapter-tag">${chapterDisplayName(card.chapter)}${card.isExtra ? ' ✦' : ''}</span>`;
  back.innerHTML = html;
}

function flipCard() {
  if (state.isFlipped) return;
  state.isFlipped = true;
  
  // Reveal back and rating area
  $('card-back').classList.remove('hidden');
  $('rating-area').classList.remove('hidden');
  
  // Scroll to rating area if needed
  setTimeout(() => {
    $('rating-area').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 50);

  // Show intervals
  const card = state.sessionCards[state.currentIndex];
  $('interval-again').textContent = fsrs.getIntervalText(card.id, Rating.AGAIN);
  $('interval-hard').textContent = fsrs.getIntervalText(card.id, Rating.HARD);
  $('interval-good').textContent = fsrs.getIntervalText(card.id, Rating.GOOD);
  $('interval-easy').textContent = fsrs.getIntervalText(card.id, Rating.EASY);

  // Play sound on flip for modes 1, 3
  if (state.soundEnabled && (state.studyMode === 1 || state.studyMode === 3)) {
    const currentCard = state.sessionCards[state.currentIndex];
    playCardSound(currentCard);
  }
}

function rateCard(rating) {
  if (!state.isFlipped) return;

  const card = state.sessionCards[state.currentIndex];
  fsrs.reviewCard(card.id, rating);

  state.totalReviewed++;
  if (rating >= Rating.GOOD) state.totalCorrect++;

  // Handle dynamic colors
  state.cardsUntilNextColor--;
  if (state.cardsUntilNextColor <= 0) {
    changeThemeColor();
    state.cardsUntilNextColor = Math.floor(Math.random() * 6) + 10;
  }

  // Reinforcement repeats based on rating:
  // Again = 3 repeats, Hard = 2, Good = 1, Easy = 0
  const repeatMap = {
    [Rating.AGAIN]: 3,
    [Rating.HARD]: 2,
    [Rating.GOOD]: 1,
    [Rating.EASY]: 0,
  };
  const repeats = repeatMap[rating] ?? 0;

  // Insert repeated copies at random positions ahead in the queue
  const remaining = state.sessionCards.length - (state.currentIndex + 1);
  for (let i = 0; i < repeats; i++) {
    // Random offset: 3-8 cards ahead, capped to remaining queue length
    const minOffset = 3;
    const maxOffset = Math.max(minOffset + 1, Math.min(8, remaining + i + 1));
    const offset = minOffset + Math.floor(Math.random() * (maxOffset - minOffset));
    const insertAt = Math.min(
      state.currentIndex + 1 + offset,
      state.sessionCards.length
    );
    state.sessionCards.splice(insertAt, 0, card);
  }

  state.currentIndex++;
  stopSpeech();
  showCard();
}

async function playCardSound(card) {
  const soundBtn = document.querySelector('.card-sound-btn');
  if (soundBtn) {
    soundBtn.classList.add('playing');
  }

  // Use the cleaned hiragana for better TTS
  await speak(card.cleanedHiragana || card.hiragana);

  if (soundBtn) {
    soundBtn.classList.remove('playing');
  }
}

function finishSession() {
  const elapsed = Date.now() - state.sessionStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  const accuracy = state.totalReviewed > 0
    ? Math.round((state.totalCorrect / state.totalReviewed) * 100)
    : 0;

  $('complete-reviewed').textContent = state.totalReviewed;
  $('complete-time').textContent = timeStr;
  $('complete-correct').textContent = `${accuracy}%`;

  showView('complete');
}

// ══════════════════════════════════
//  EVENT LISTENERS
// ══════════════════════════════════

function setupEventListeners() {
  // Navigation — Logo goes home
  $('nav-home-btn').addEventListener('click', () => {
    stopSpeech();
    updateStats();
    showView('setup');
    closeHiddenMenu();
  });

  // Hidden Menu toggle
  $('nav-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleHiddenMenu();
  });

  // Hidden menu overlay close
  $('hidden-menu-overlay').addEventListener('click', closeHiddenMenu);

  // Hidden menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      showView(page);
      closeHiddenMenu();
    });
  });

  // Sound toggle
  $('nav-sound-toggle').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    const svgs = {
      on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',
      off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
    };
    $('nav-sound-toggle').innerHTML = state.soundEnabled ? svgs.on : svgs.off;
    savePreferences();
    showToast(state.soundEnabled ? 'Audio Enabled' : 'Audio Disabled');
  });

  // Reset
  $('nav-reset-btn').addEventListener('click', () => {
    if (confirm('Reset semua progress belajar? Data FSRS akan dihapus.')) {
      fsrs.reset();
      updateStats();
      showToast('Progress direset');
    }
  });

  // Select all / Deselect all
  $('select-all-btn').addEventListener('click', () => {
    state.selectedChapters = [...state.chapters];
    document.querySelectorAll('.chapter-chip').forEach(c => c.classList.add('selected'));
    updateChapterBadge();
    updateCardCount();
    updateStats();
    savePreferences();
  });

  $('deselect-all-btn').addEventListener('click', () => {
    state.selectedChapters = [];
    document.querySelectorAll('.chapter-chip').forEach(c => c.classList.remove('selected'));
    updateChapterBadge();
    updateCardCount();
    updateStats();
    savePreferences();
  });

  // Filter buttons
  document.querySelectorAll('#filter-group .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-group .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterMode = btn.dataset.filter;
      updateCardCount();
      updateStats();
      savePreferences();
    });
  });

  // JLPT Filter buttons
  document.querySelectorAll('#jlpt-group .filter-btn-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#jlpt-group .filter-btn-sm').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.jlptFilter = btn.dataset.jlpt;
      updateCardCount();
      updateStats();
      savePreferences();
    });
  });

  // Mode selection
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      const mode = parseInt(card.dataset.mode);
      document.querySelectorAll(`.mode-card[data-mode="${mode}"]`).forEach(c => c.classList.add('selected'));
      state.studyMode = mode;
      
      const jlptBento = document.getElementById('bento-jlpt');
      if (jlptBento) {
        if (state.studyMode === 2) {
          jlptBento.classList.remove('hidden');
        } else {
          jlptBento.classList.add('hidden');
        }
      }
      
      updateCardCount();
      updateStats();
      savePreferences();
    });
  });

  // Mobile Modal Setup
  const mobileSetupBtn = $('mobile-setup-btn');
  const closeModalBtn = $('close-modal-btn');
  const mobileModal = $('mobile-modal');
  
  if (mobileSetupBtn && closeModalBtn && mobileModal) {
    mobileSetupBtn.addEventListener('click', () => {
      mobileModal.classList.add('modal-active');
      document.body.style.overflow = 'hidden';
    });
    
    closeModalBtn.addEventListener('click', () => {
      mobileModal.classList.remove('modal-active');
      document.body.style.overflow = '';
    });
  }

  // Start study
  $('start-btn').addEventListener('click', () => {
    if (mobileModal) {
      mobileModal.classList.remove('modal-active');
      document.body.style.overflow = '';
    }
    startStudy();
  });

  // Flashcard flip
  $('flashcard-container').addEventListener('click', () => {
    if (!state.isFlipped) {
      flipCard();
    }
  });

  // Rating buttons
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      rateCard(parseInt(btn.dataset.rating));
    });
  });

  // Exit study
  $('study-exit-btn').addEventListener('click', () => {
    stopSpeech();
    updateStats();
    showView('setup');
  });

  // Complete → home
  $('complete-home-btn').addEventListener('click', () => {
    updateStats();
    showView('setup');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Only in study view
    if (!views.study.classList.contains('active')) return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (!state.isFlipped) flipCard();
        break;
      case '1':
        if (state.isFlipped) rateCard(Rating.AGAIN);
        break;
      case '2':
        if (state.isFlipped) rateCard(Rating.HARD);
        break;
      case '3':
        if (state.isFlipped) rateCard(Rating.GOOD);
        break;
      case '4':
        if (state.isFlipped) rateCard(Rating.EASY);
        break;
      case 's':
      case 'S':
        // Replay sound
        if (state.sessionCards[state.currentIndex]) {
          playCardSound(state.sessionCards[state.currentIndex]);
        }
        break;
    }
  });

  // Touch swipe for mobile
  let touchStartY = 0;
  $('flashcard-container').addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  $('flashcard-container').addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 50 && !state.isFlipped) {
      flipCard();
    }
  }, { passive: true });
}

// ── Bootstrap ──
init();
