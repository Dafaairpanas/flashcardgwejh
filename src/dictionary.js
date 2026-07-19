/**
 * Dictionary Page Module
 * Displays all vocabulary from datamatang.txt with search and filter
 */

import { loadData, getChapters, chapterDisplayName } from './data.js';

let allCards = [];
let filteredCards = [];
let chapters = [];
let searchTimeout = null;
const RENDER_BATCH = 100;
let renderedCount = 0;

const $ = (id) => document.getElementById(id);

export async function initDictionary() {
  allCards = await loadData();
  chapters = getChapters();

  // Populate bab filter
  const babSelect = $('dict-bab-filter');
  chapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = ch;
    opt.textContent = chapterDisplayName(ch);
    babSelect.appendChild(opt);
  });

  // Event listeners
  $('dict-search').addEventListener('input', debounceFilter);
  $('dict-bab-filter').addEventListener('change', applyFilter);
  $('dict-type-filter').addEventListener('change', applyFilter);
  $('dict-jlpt-filter').addEventListener('change', applyFilter);

  // Infinite scroll
  $('dict-list').addEventListener('scroll', handleScroll);

  applyFilter();
}

function debounceFilter() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(applyFilter, 200);
}

function applyFilter() {
  const query = $('dict-search').value.trim().toLowerCase();
  const bab = $('dict-bab-filter').value;
  const type = $('dict-type-filter').value;
  const jlpt = $('dict-jlpt-filter').value;

  filteredCards = allCards.filter(card => {
    // Bab filter
    if (bab !== 'all' && card.chapter !== bab) return false;
    // Type filter
    if (type === 'main' && card.isExtra) return false;
    if (type === 'extra' && !card.isExtra) return false;
    // JLPT filter
    if (jlpt !== 'all' && card.level.toLowerCase() !== jlpt) return false;
    // Search
    if (query) {
      const match =
        card.kanji.toLowerCase().includes(query) ||
        card.hiragana.toLowerCase().includes(query) ||
        card.romaji.toLowerCase().includes(query) ||
        card.meaning.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  $('dict-count').textContent = `${filteredCards.length} kata`;
  renderedCount = 0;
  $('dict-list').innerHTML = '';
  renderBatch();
}

function renderBatch() {
  const list = $('dict-list');
  const end = Math.min(renderedCount + RENDER_BATCH, filteredCards.length);
  const fragment = document.createDocumentFragment();

  for (let i = renderedCount; i < end; i++) {
    const card = filteredCards[i];
    const row = document.createElement('div');
    row.className = 'dict-row';
    row.innerHTML = `
      <div class="dict-kanji">${card.kanji}</div>
      <div class="dict-reading">
        <span class="dict-hiragana">${card.hiragana}</span>
        <span class="dict-romaji">${card.romaji}</span>
      </div>
      <div class="dict-meaning">${card.meaning}</div>
      <div class="dict-meta">
        <span class="dict-badge dict-badge-bab">${chapterDisplayName(card.chapter)}</span>
        ${card.level !== '-' ? `<span class="dict-badge dict-badge-jlpt">${card.level.toUpperCase()}</span>` : ''}
        ${card.isExtra ? '<span class="dict-badge dict-badge-extra">Extra</span>' : ''}
      </div>
    `;
    fragment.appendChild(row);
  }

  list.appendChild(fragment);
  renderedCount = end;
}

function handleScroll(e) {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    if (renderedCount < filteredCards.length) {
      renderBatch();
    }
  }
}
