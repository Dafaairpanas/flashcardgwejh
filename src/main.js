import './style.css';
import { loadData } from './data.js';
import { state, fsrs, $ } from './state.js';
import { router } from './router.js';
import { initTTS } from './tts.js';
import { registerSW } from 'virtual:pwa-register';

// Layout & UI
import { toggleHiddenMenu, closeHiddenMenu, showToast, changeThemeColor, setJapaneseFont } from './ui/layout.js';
import { restorePreferences, savePreferences, buildChapterGrid, toggleChapter, updateCardCount, updateStats } from './ui/setup.js';
import { startStudy, flipCard, rateCard, playCardSound, startCustomStudy } from './ui/study.js';

// Expose functions globally for HTML onclick handlers
window.toggleHiddenMenu = toggleHiddenMenu;
window.closeHiddenMenu = closeHiddenMenu;
window.startStudy = startStudy;
window.startCustomStudy = startCustomStudy;
window.flipCard = flipCard;
window.rateCard = rateCard;
window.toggleChapter = toggleChapter;

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh to update.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

async function init() {
  state.allCards = await loadData();
  if (state.allCards.length === 0) {
    $('loading-view').innerHTML = `
      <div class="loading-screen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:48px; height:48px; color:var(--accent-rose);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p class="loading-text">Failed to initialize workspace.</p>
        <p class="loading-text">Ensure <code>datamatang.txt</code> exists in the <code>public/</code> directory.</p>
        <p class="loading-text" style="font-size:0.75rem; opacity:0.6; margin-top:8px;">Jika masalah berlanjut, hapus cache browser / reinstall PWA.</p>
      </div>
    `;
    return;
  }
  
  const { getChapters } = await import('./data.js');
  state.chapters = getChapters();

  await initTTS();
  restorePreferences();
  buildChapterGrid();
  setupEventListeners();

  // Initialize router
  router.init();
  router.handleRouteChange();
}

function setupEventListeners() {
  $('nav-home-btn').addEventListener('click', () => {
    import('./tts.js').then(m => m.stopSpeech());
    updateStats();
    router.navigate('/');
    closeHiddenMenu();
    
    // Close mobile modal if open when navigating home
    const mobileModal = $('mobile-modal');
    if (mobileModal) {
      mobileModal.classList.remove('modal-active');
    }
  });

  $('nav-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleHiddenMenu();
  });

  $('hidden-menu-overlay').addEventListener('click', closeHiddenMenu);

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      closeHiddenMenu();
    });
  });

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

  $('nav-reset-btn').addEventListener('click', () => {
    fsrs.reset();
    showToast('Progress belajar berhasil direset', 'success');
    updateStats();
    updateCardCount();
  });

  document.querySelectorAll('.font-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const font = btn.dataset.font;
      setJapaneseFont(font);
      document.querySelectorAll('.font-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast('Font berhasil diubah');
    });
  });

  const currentFontBtn = document.querySelector(`.font-select-btn[data-font='${state.jpFont}']`);
  if (currentFontBtn) currentFontBtn.classList.add('active');

  $('select-all-btn').addEventListener('click', () => {
    state.selectedChapters = [...state.chapters];
    document.querySelectorAll('.chapter-chip').forEach(c => c.classList.add('selected'));
    import('./ui/setup.js').then(m => {
      m.updateChapterBadge();
      m.updateCardCount();
      m.updateStats();
      m.savePreferences();
    });
  });

  $('deselect-all-btn').addEventListener('click', () => {
    state.selectedChapters = [];
    document.querySelectorAll('.chapter-chip').forEach(c => c.classList.remove('selected'));
    import('./ui/setup.js').then(m => {
      m.updateChapterBadge();
      m.updateCardCount();
      m.updateStats();
      m.savePreferences();
    });
  });

  document.querySelectorAll('#grade-group .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grade = parseInt(btn.dataset.grade);
      const idx = state.selectedGrades.indexOf(grade);
      if (idx === -1) state.selectedGrades.push(grade);
      else state.selectedGrades.splice(idx, 1);
      btn.classList.toggle('active', state.selectedGrades.includes(grade));
      import('./ui/setup.js').then(m => {
        m.updateCardCount();
        m.updateStats();
        m.savePreferences();
      });
    });
  });

  document.querySelectorAll('#jlpt-group .filter-btn-sm').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#jlpt-group .filter-btn-sm').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.jlptFilter = btn.dataset.jlpt;
      import('./ui/setup.js').then(m => {
        m.updateCardCount();
        m.updateStats();
        m.savePreferences();
      });
    });
  });

  document.querySelectorAll('.mode-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.studyMode = parseInt(btn.dataset.mode);
      
      const jlptBento = document.getElementById('bento-jlpt');
      if (jlptBento) {
        if (state.studyMode === 2) {
          jlptBento.classList.remove('hidden');
        } else {
          jlptBento.classList.add('hidden');
        }
      }
      
      import('./ui/setup.js').then(m => {
        m.updateCardCount();
        m.updateStats();
        m.savePreferences();
      });
    });
  });

  // Mobile Setup Modal Listeners
  const mobileSetupBtn = $('mobile-setup-btn');
  const closeModalBtn = $('close-modal-btn');
  const mobileModal = $('mobile-modal');

  if (mobileSetupBtn && mobileModal) {
    mobileSetupBtn.addEventListener('click', () => {
      mobileModal.classList.add('modal-active');
    });
  }

  if (closeModalBtn && mobileModal) {
    closeModalBtn.addEventListener('click', () => {
      mobileModal.classList.remove('modal-active');
    });
  }

  $('start-btn').addEventListener('click', () => {
    if (mobileModal) {
      mobileModal.classList.remove('modal-active');
    }
    startStudy();
  });
  $('flashcard-container').addEventListener('click', flipCard);
  
  if ($('study-exit-btn')) {
    $('study-exit-btn').addEventListener('click', () => {
      import('./tts.js').then(m => m.stopSpeech());
      updateStats();
      router.navigate('/');
    });
  }
  
  document.querySelector('.rating-btn-again').addEventListener('click', (e) => { e.stopPropagation(); rateCard(1); });
  document.querySelector('.rating-btn-hard').addEventListener('click', (e) => { e.stopPropagation(); rateCard(2); });
  document.querySelector('.rating-btn-good').addEventListener('click', (e) => { e.stopPropagation(); rateCard(3); });
  document.querySelector('.rating-btn-easy').addEventListener('click', (e) => { e.stopPropagation(); rateCard(4); });
  
  if ($('complete-home-btn')) {
    $('complete-home-btn').addEventListener('click', () => {
      updateStats();
      router.navigate('/');
    });
  }

  // Keyboard shortcuts for Study View
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (!window.location.hash.includes('/study')) return;

    if (e.code === 'Space') {
      e.preventDefault(); // Prevent page scroll
      if (!state.isFlipped) {
        flipCard();
      } else {
        rateCard(3); // Default to Good on second space
      }
    } else if (e.key === '1') {
      if (state.isFlipped) rateCard(1);
    } else if (e.key === '2') {
      if (state.isFlipped) rateCard(2);
    } else if (e.key === '3') {
      if (state.isFlipped) rateCard(3);
    } else if (e.key === '4') {
      if (state.isFlipped) rateCard(4);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
