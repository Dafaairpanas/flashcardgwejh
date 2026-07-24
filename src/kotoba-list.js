/**
 * Kotoba List Page Module
 * Displays vocabulary tables per chapter (Bab 1-50) with colored columns,
 * search filter, and mobile-responsive zoomable table view.
 */

import { loadData, getChapters, chapterDisplayName } from './data.js';

let allCards = [];
let chapters = [];
let currentBab = null;
let searchTimeout = null;

const $ = (id) => document.getElementById(id);

export async function initKotobaList() {
  allCards = await loadData();
  chapters = getChapters();

  // Populate Bab Grid (Selection view)
  renderBabGrid();

  // Populate Bab Dropdown (inside Table view)
  const babSelect = $('kotoba-bab-select');
  if (babSelect) {
    babSelect.innerHTML = '';
    chapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = chapterDisplayName(ch);
      babSelect.appendChild(opt);
    });
    babSelect.addEventListener('change', (e) => {
      loadKotobaBab(e.target.value);
    });
  }

  // Event Listeners
  const backBtn = $('kotoba-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', showKotobaSelect);
  }

  const searchInput = $('kotoba-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(renderKotobaTable, 150);
    });
  }
}

function renderBabGrid() {
  const grid = $('kotoba-bab-grid');
  if (!grid) return;

  grid.innerHTML = '';
  chapters.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'quiz-bab-btn';
    btn.textContent = chapterDisplayName(ch);
    btn.dataset.bab = ch;
    btn.addEventListener('click', () => loadKotobaBab(ch));
    grid.appendChild(btn);
  });
}

function loadKotobaBab(babKey) {
  currentBab = babKey;

  const selectView = $('kotoba-select');
  const tableArea = $('kotoba-table-area');
  const title = $('kotoba-bab-title');
  const babSelect = $('kotoba-bab-select');

  if (selectView) selectView.style.display = 'none';
  if (tableArea) tableArea.style.display = 'block';

  if (title) title.textContent = chapterDisplayName(babKey).toUpperCase();
  if (babSelect) babSelect.value = babKey;

  // Reset search
  const searchInput = $('kotoba-search');
  if (searchInput) searchInput.value = '';

  renderKotobaTable();
}

function renderKotobaTable() {
  if (!currentBab) return;

  const tbody = $('kotoba-tbody');
  const countEl = $('kotoba-count');
  const query = ($('kotoba-search')?.value || '').trim().toLowerCase();

  if (!tbody) return;

  // Filter cards for current Bab
  let babCards = allCards.filter(c => c.chapter === currentBab);

  if (query) {
    babCards = babCards.filter(c => 
      c.kanji.toLowerCase().includes(query) ||
      c.hiragana.toLowerCase().includes(query) ||
      c.meaning.toLowerCase().includes(query) ||
      c.romaji.toLowerCase().includes(query)
    );
  }

  if (countEl) countEl.textContent = `${babCards.length} kata`;

  tbody.innerHTML = '';

  if (babCards.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="3" style="text-align:center; padding:32px; color:var(--text-muted);">
        Tidak ada kosakata ditemukan.
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  const fragment = document.createDocumentFragment();

  babCards.forEach((card) => {
    const tr = document.createElement('tr');

    // If kanji is identical to hiragana, don't repeat it in kanji column
    const hasKanji = card.kanji !== card.hiragana;
    const kanjiDisplay = hasKanji ? card.kanji : '';

    tr.innerHTML = `
      <td class="col-kana">
        <span class="kana-text">${card.hiragana}</span>
      </td>
      <td class="col-kanji">
        ${hasKanji ? `<span class="kanji-text">${kanjiDisplay}</span>` : ''}
      </td>
      <td class="col-meaning">
        <span class="meaning-text">${card.meaning}</span>
        ${card.isExtra ? '<span class="dict-badge dict-badge-extra" style="margin-left:6px; font-size:0.7rem;">Extra</span>' : ''}
      </td>
    `;

    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
}

export function showKotobaSelect() {
  const selectView = $('kotoba-select');
  const tableArea = $('kotoba-table-area');

  if (selectView) selectView.style.display = 'block';
  if (tableArea) tableArea.style.display = 'none';

  currentBab = null;
}
