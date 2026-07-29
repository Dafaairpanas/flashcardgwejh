import { FSRSStateManager } from './fsrs.js';

export const state = {
  // Setup
  selectedChapters: [],
  selectedGrades: [1, 2], // 1=Wajib, 2=Extra, 3=Trash
  jlptFilter: 'all',    // 'all' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1'
  studyMode: 1,         // 1-4
  soundEnabled: true,
  // Font
  jpFont: localStorage.getItem('gw_jp_font') || '"Noto Sans JP", sans-serif',

  // Study session
  sessionQueue: null,       // SessionQueue instance
  currentCard: null,        // Current card being shown
  isFlipped: false,
  sessionStartTime: null,
  totalReviewed: 0,
  totalCorrect: 0,       
  cardsUntilNextColor: Math.floor(Math.random() * 6) + 10,

  // Data
  allCards: [],
  chapters: [],
};

export const fsrs = new FSRSStateManager();

export const $ = (id) => document.getElementById(id);
