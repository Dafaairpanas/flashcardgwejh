/**
 * Kanji Page Module
 * Displays single kanji from kanji_jlpt_only.json with JLPT filter and detail modal
 */

let kanjiData = {};
let kanjiList = [];
let currentLevel = 5;
let searchTimeout = null;

const $ = (id) => document.getElementById(id);

export async function initKanjiPage() {
  // Load kanji data
  try {
    const response = await fetch('/kanji_jlpt_only.json');
    kanjiData = await response.json();
    kanjiList = Object.values(kanjiData);
    console.log(`[Kanji] Loaded ${kanjiList.length} kanji`);
  } catch (err) {
    console.error('[Kanji] Failed to load kanji data:', err);
    return;
  }

  // Tab click listeners
  document.querySelectorAll('#kanji-tabs .kanji-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#kanji-tabs .kanji-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLevel = parseInt(tab.dataset.level);
      renderKanjiGrid();
    });
  });

  // Search
  $('kanji-search').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderKanjiGrid, 200);
  });

  // Modal close
  $('kanji-modal-close').addEventListener('click', closeModal);
  $('kanji-modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('kanji-modal-overlay')) closeModal();
  });

  renderKanjiGrid();
}

function renderKanjiGrid() {
  const query = $('kanji-search').value.trim().toLowerCase();
  const grid = $('kanji-grid');
  grid.innerHTML = '';

  const filtered = kanjiList.filter(k => {
    if (k.jlpt !== currentLevel) return false;
    if (query) {
      const meanings = (k.meanings || []).join(' ').toLowerCase();
      const onReadings = (k.on_readings || []).join(' ').toLowerCase();
      const kunReadings = (k.kun_readings || []).join(' ').toLowerCase();
      const heisig = (k.heisig_en || '').toLowerCase();
      return meanings.includes(query) || onReadings.includes(query) ||
             kunReadings.includes(query) || heisig.includes(query) ||
             k.kanji.includes(query);
    }
    return true;
  });

  $('kanji-count').textContent = `${filtered.length} kanji`;

  const fragment = document.createDocumentFragment();
  filtered.forEach(k => {
    const tile = document.createElement('div');
    tile.className = 'kanji-tile';
    tile.innerHTML = `
      <div class="kanji-tile-char">${k.kanji}</div>
      <div class="kanji-tile-meaning">${k.heisig_en || (k.meanings && k.meanings[0]) || ''}</div>
    `;
    tile.addEventListener('click', () => openModal(k));
    fragment.appendChild(tile);
  });
  grid.appendChild(fragment);
}

function openModal(k) {
  $('kanji-modal-char').textContent = k.kanji;

  const info = $('kanji-modal-info');
  info.innerHTML = `
    <div class="km-section">
      <h4>Meanings</h4>
      <p>${(k.meanings || []).join(', ')}</p>
    </div>
    <div class="km-row">
      <div class="km-section">
        <h4>On'yomi</h4>
        <p>${(k.on_readings || []).join('、 ') || '—'}</p>
      </div>
      <div class="km-section">
        <h4>Kun'yomi</h4>
        <p>${(k.kun_readings || []).join('、 ') || '—'}</p>
      </div>
    </div>
    <div class="km-row">
      <div class="km-section">
        <h4>Strokes</h4>
        <p>${k.stroke_count || '—'}</p>
      </div>
      <div class="km-section">
        <h4>Grade</h4>
        <p>${k.grade || '—'}</p>
      </div>
      <div class="km-section">
        <h4>JLPT</h4>
        <p>N${k.jlpt}</p>
      </div>
    </div>
    <div class="km-section">
      <h4>Contoh Penggunaan</h4>
      <p class="km-placeholder">Belum ada data contoh. Silakan tambahkan nanti.</p>
    </div>
  `;

  $('kanji-modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('kanji-modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
