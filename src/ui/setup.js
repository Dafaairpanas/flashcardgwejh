import { $, state, fsrs } from '../state.js';
import { getChapterStats, chapterDisplayName, getCardsByChapters } from '../data.js';

export function savePreferences() {
  localStorage.setItem('fcgw_prefs', JSON.stringify({
    selectedChapters: state.selectedChapters,
    selectedGrades: state.selectedGrades,
    jlptFilter: state.jlptFilter,
    studyMode: state.studyMode,
    soundEnabled: state.soundEnabled,
  }));
}

export function restorePreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem('fcgw_prefs'));
    if (saved) {
      state.selectedChapters = saved.selectedChapters || [];
      state.selectedGrades = saved.selectedGrades || [1, 2];
      state.jlptFilter = saved.jlptFilter || 'all';
      state.studyMode = saved.studyMode || 1;
      state.soundEnabled = saved.soundEnabled !== false;
    }
  } catch { /* ignore */ }

  const svgs = {
    on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',
    off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
  };
  const navToggle = $('nav-sound-toggle');
  if (navToggle) navToggle.innerHTML = state.soundEnabled ? svgs.on : svgs.off;
}

export function buildChapterGrid() {
  const grid = $('chapter-grid');
  if (!grid) return;
  
  grid.innerHTML = '';

  state.chapters.forEach(ch => {
    const stats = getChapterStats(ch);
    const chip = document.createElement('div');
    chip.className = 'chapter-chip' + (state.selectedChapters.includes(ch) ? ' selected' : '');
    chip.dataset.chapter = ch;
    chip.textContent = chapterDisplayName(ch);
    chip.title = `Utama: ${stats.main} | Extra: ${stats.extra}`;
    grid.appendChild(chip);
  });

  setupDragSelect(grid);

  document.querySelectorAll('#grade-group .filter-btn').forEach(btn => {
    const grade = parseInt(btn.dataset.grade);
    btn.classList.toggle('active', state.selectedGrades.includes(grade));
  });
  document.querySelectorAll('#jlpt-group .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.jlpt === state.jlptFilter);
  });
  document.querySelectorAll('.mode-select-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.mode) === state.studyMode);
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
  updateStats();
}

function setupDragSelect(grid) {
  let isDragging = false;
  let dragAction = null; 
  let touchedChips = new Set();

  function getChipFromPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.chapter-chip');
  }

  function applyDragToChip(chip) {
    if (!chip || touchedChips.has(chip)) return;
    touchedChips.add(chip);
    const ch = chip.dataset.chapter;
    if (!ch) return;

    if (dragAction === 'select') {
      if (!state.selectedChapters.includes(ch)) {
        state.selectedChapters.push(ch);
      }
      chip.classList.add('selected');
    } else {
      const idx = state.selectedChapters.indexOf(ch);
      if (idx !== -1) state.selectedChapters.splice(idx, 1);
      chip.classList.remove('selected');
    }
  }

  function finishDrag() {
    if (isDragging) {
      isDragging = false;
      dragAction = null;
      touchedChips.clear();
      updateChapterBadge();
      updateCardCount();
      updateStats();
      savePreferences();
    }
  }

  grid.addEventListener('mousedown', (e) => {
    const chip = getChipFromPoint(e.clientX, e.clientY);
    if (!chip) return;
    e.preventDefault();
    isDragging = true;
    const ch = chip.dataset.chapter;
    dragAction = state.selectedChapters.includes(ch) ? 'deselect' : 'select';
    applyDragToChip(chip);
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const chip = getChipFromPoint(e.clientX, e.clientY);
    applyDragToChip(chip);
  });

  document.addEventListener('mouseup', finishDrag);

  grid.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const chip = getChipFromPoint(touch.clientX, touch.clientY);
    if (!chip) return;
    isDragging = true;
    const ch = chip.dataset.chapter;
    dragAction = state.selectedChapters.includes(ch) ? 'deselect' : 'select';
    applyDragToChip(chip);
  }, { passive: true });

  grid.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    const touch = e.touches[0];
    const chip = getChipFromPoint(touch.clientX, touch.clientY);
    applyDragToChip(chip);
  }, { passive: false });

  grid.addEventListener('touchend', finishDrag);
  grid.addEventListener('touchcancel', finishDrag);
}

export function toggleChapter(ch) {
  const idx = state.selectedChapters.indexOf(ch);
  if (idx === -1) {
    state.selectedChapters.push(ch);
  } else {
    state.selectedChapters.splice(idx, 1);
  }

  document.querySelectorAll('.chapter-chip').forEach(chip => {
    chip.classList.toggle('selected', state.selectedChapters.includes(chip.dataset.chapter));
  });

  updateChapterBadge();
  updateCardCount();
  updateStats();
  savePreferences();
}

export function updateChapterBadge() {
  const el = $('chapter-count-badge');
  if (el) el.textContent = `${state.selectedChapters.length} dipilih`;
}

export function updateCardCount() {
  const cards = getCardsByChapters(state.selectedChapters, state.selectedGrades, state.jlptFilter, state.studyMode);
  const count = cards.length;
  const label = $('card-count-label');
  if (label) {
    label.textContent = count > 0 ? `${count} kartu siap dipelajari` : 'Pilih bab untuk mulai';
  }
  const btn = $('start-btn');
  if (btn) btn.disabled = count === 0;
}

export function updateStats() {
  const cards = getCardsByChapters(state.selectedChapters, state.selectedGrades, state.jlptFilter, state.studyMode);
  const stats = fsrs.getStats(cards);
  if ($('stat-total')) $('stat-total').textContent = stats.total;
  if ($('stat-new')) $('stat-new').textContent = stats.newCount;
  if ($('stat-learning')) $('stat-learning').textContent = stats.learningCount;
  if ($('stat-due')) $('stat-due').textContent = stats.dueCount;
}
