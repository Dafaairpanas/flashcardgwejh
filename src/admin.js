import { supabase } from './supabaseClient.js';
import { $ } from './state.js';
import { showToast } from './ui/layout.js';
import { getChapters, getWordClasses, loadData } from './data.js';

let currentPage = 1;
const ITEMS_PER_PAGE = 100;
let currentSearchQuery = '';
let currentChapterFilter = 'all';
let currentTypeFilter = 'all';

// Multi-Selection State
let adminSelectedIds = new Set();
let isAdminMouseDown = false;
let adminDragTargetState = null;

export function initAdmin() {
  const loginSection = $('admin-login-section');
  const dashboardSection = $('admin-dashboard-section');
  
  // Restore selection from sessionStorage to survive Vite HMR reloads
  try {
    const savedIds = sessionStorage.getItem('fcAdminSelection');
    if (savedIds) {
      adminSelectedIds = new Set(JSON.parse(savedIds));
    }
  } catch(e) {}
  
  // Auth State Listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      populateChapterFilter();
      populateTypeFilter();
      loadAdminData();
    } else {
      loginSection.style.display = 'block';
      dashboardSection.style.display = 'none';
    }
  });

  // Login Form
  $('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('admin-email').value;
    const password = $('admin-password').value;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      showToast('Login gagal: ' + error.message);
    } else {
      showToast('Login berhasil!');
      $('admin-login-form').reset();
    }
  });

  // Logout
  $('admin-logout-btn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showToast('Logout berhasil');
  });

  // Modal Controls
  $('admin-add-btn')?.addEventListener('click', () => {
    openForm();
  });

  $('admin-form-close')?.addEventListener('click', closeForm);

  // Tab Switching
  $('tab-data-table')?.addEventListener('click', () => {
    $('tab-data-table').classList.add('active');
    $('tab-statistics').classList.remove('active');
    $('admin-table-view').style.display = 'block';
    $('admin-stats-view').style.display = 'none';
  });

  $('tab-statistics')?.addEventListener('click', () => {
    $('tab-statistics').classList.add('active');
    $('tab-data-table').classList.remove('active');
    $('admin-stats-view').style.display = 'block';
    $('admin-table-view').style.display = 'none';
    renderAdminStats();
  });

  setupAdminDragSelection();

  // CRUD Form Submit
  $('admin-crud-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit();
  });

  // Pagination & Search
  $('admin-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadAdminData();
    }
  });

  $('admin-next-page')?.addEventListener('click', () => {
    currentPage++;
    loadAdminData();
  });

  let searchTimeout;
  $('admin-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearchQuery = e.target.value;
      currentPage = 1; // Reset to first page
      loadAdminData();
    }, 400);
  });

  $('admin-filter-chapter')?.addEventListener('change', (e) => {
    currentChapterFilter = e.target.value;
    currentPage = 1;
    loadAdminData();
  });

  $('admin-filter-tipe')?.addEventListener('change', (e) => {
    currentTypeFilter = e.target.value;
    currentPage = 1;
    loadAdminData();
  });
}

function populateTypeFilter() {
  const select = $('admin-filter-tipe');
  if (!select) return;
  
  select.innerHTML = `
    <option value="all">Semua Tipe</option>
    <option value="1">1 - Wajib</option>
    <option value="2">2 - Extra</option>
    <option value="3">3 - Trash</option>
  `;
}

function populateChapterFilter() {
  const select = $('admin-filter-chapter');
  if (!select) return;
  
  // Preserve the first "Semua Bab" option
  select.innerHTML = '<option value="all">Semua Bab</option>';
  
  const chapters = getChapters();
  chapters.forEach(chap => {
    const opt = document.createElement('option');
    opt.value = chap;
    opt.textContent = chap.replace('Bab', 'Bab ');
    select.appendChild(opt);
  });
}

async function loadAdminData() {
  const tbody = $('admin-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading...</td></tr>';
  
  let query = supabase
    .from('cards')
    .select('*', { count: 'exact' });
    
  if (currentChapterFilter !== 'all') {
    query = query.eq('chapter', currentChapterFilter);
  }
  
  if (currentTypeFilter !== 'all') {
    query = query.eq('importantity', parseInt(currentTypeFilter));
  }
    
  if (currentSearchQuery) {
    query = query.or(`kanji.ilike.%${currentSearchQuery}%,hiragana.ilike.%${currentSearchQuery}%,meaning.ilike.%${currentSearchQuery}%`);
  }
  
  // Pagination
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  
  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(from, to);
    
  if (error) {
    showToast('Gagal memuat data: ' + error.message);
    return;
  }
  
  $('admin-page-info').textContent = `Page ${currentPage} (Total: ${count})`;
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data.</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  const fragment = document.createDocumentFragment();
  
  // Check header checkbox state
  const allSelected = data.length > 0 && data.every(card => adminSelectedIds.has(card.id));
  if ($('admin-check-all-page')) {
    $('admin-check-all-page').checked = allSelected;
  }
  
  data.forEach(card => {
    const isSelected = adminSelectedIds.has(card.id);
    const tr = document.createElement('tr');
    tr.className = `data-row ${isSelected ? 'row-selected' : ''}`;
    tr.dataset.id = card.id;
    
    tr.innerHTML = `
      <td style="text-align: center;" onclick="event.stopPropagation()">
        <input type="checkbox" class="row-checkbox" data-id="${card.id}" ${isSelected ? 'checked' : ''}>
      </td>
      <td>${card.kanji || '-'}</td>
      <td>${card.hiragana}</td>
      <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${card.meaning}">${card.meaning}</td>
      <td>${card.chapter}</td>
      <td>
        <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-size:0.8rem; background: ${
          card.importantity === 1 ? 'var(--color-good)' : 
          card.importantity === 2 ? 'var(--color-hard)' : 'var(--color-again)'
        }; color: #000; font-weight: bold;">
          Tipe ${card.importantity}
        </span>
      </td>
      <td>
        <button class="btn btn-ghost btn-icon edit-btn" style="color:var(--accent-cyan); margin-right:4px;" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn btn-ghost btn-icon delete-btn" style="color:var(--color-again);" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    
    tr.querySelector('.edit-btn').addEventListener('click', () => openForm(card));
    tr.querySelector('.delete-btn').addEventListener('click', () => deleteCard(card.id));
    
    fragment.appendChild(tr);
  });
  
  tbody.appendChild(fragment);
}

function openForm(card = null) {
  const form = $('admin-crud-form');
  form.reset();
  
  $('admin-form-id').value = card ? card.id : '';
  $('admin-form-kanji').value = card ? card.kanji : '';
  $('admin-form-hiragana').value = card ? card.hiragana : '';
  $('admin-form-meaning').value = card ? card.meaning : '';
  $('admin-form-chapter').value = card ? card.chapter : '';
  $('admin-form-level').value = card ? card.level : '-';
  $('admin-form-importantity').value = card ? card.importantity : '1';
  
  $('admin-form-title').textContent = card ? 'Edit Kartu' : 'Tambah Kartu Baru';
  $('admin-form-overlay').classList.add('active');
}

function closeForm() {
  $('admin-form-overlay').classList.remove('active');
}

async function handleFormSubmit() {
  const id = $('admin-form-id').value;
  
  const payload = {
    kanji: $('admin-form-kanji').value,
    hiragana: $('admin-form-hiragana').value,
    meaning: $('admin-form-meaning').value,
    chapter: $('admin-form-chapter').value,
    level: $('admin-form-level').value,
    importantity: parseInt($('admin-form-importantity').value)
  };
  
  let error;
  if (id) {
    // Update
    const res = await supabase.from('cards').update(payload).eq('id', id);
    error = res.error;
  } else {
    // Insert
    const res = await supabase.from('cards').insert([payload]);
    error = res.error;
  }
  
  if (error) {
    showToast('Gagal menyimpan: ' + error.message);
  } else {
    showToast('Berhasil disimpan!');
    closeForm();
    loadAdminData();
    // Refresh the offline cache and in-memory ALL_CARDS
    loadData(true).catch(console.error);
  }
}

async function deleteCard(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus kartu ini?')) return;
  
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) {
    showToast('Gagal menghapus: ' + error.message);
  } else {
    showToast('Berhasil dihapus');
    loadAdminData();
    // Refresh the offline cache and in-memory ALL_CARDS
    loadData(true).catch(console.error);
    if ($('tab-statistics')?.classList.contains('active')) {
      renderAdminStats();
    }
  }
}

// =======================
// MULTI-SELECT LOGIC
// =======================

function setupAdminDragSelection() {
  const tbody = $('admin-tbody');
  if (!tbody) return;

  function getRowFromElement(el) {
    return el ? el.closest('tr.data-row') : null;
  }

  function handleRowDrag(tr) {
    if (!tr) return;
    const id = tr.dataset.id;
    if (!id) return;

    if (adminDragTargetState === true) {
      adminSelectedIds.add(id);
      tr.classList.add('row-selected');
      const cb = tr.querySelector('.row-checkbox');
      if (cb) cb.checked = true;
    } else {
      adminSelectedIds.delete(id);
      tr.classList.remove('row-selected');
      const cb = tr.querySelector('.row-checkbox');
      if (cb) cb.checked = false;
    }
    updateAdminSelectionUI();
  }

  tbody.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    
    const tr = getRowFromElement(e.target);
    if (!tr) return;

    isAdminMouseDown = true;
    const id = tr.dataset.id;
    
    adminDragTargetState = !adminSelectedIds.has(id);
    handleRowDrag(tr);
  });

  tbody.addEventListener('mouseover', (e) => {
    if (!isAdminMouseDown) return;
    const tr = getRowFromElement(e.target);
    if (tr) handleRowDrag(tr);
  });

  document.addEventListener('mouseup', () => {
    isAdminMouseDown = false;
  });

  tbody.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-checkbox')) {
      const id = e.target.dataset.id;
      const tr = tbody.querySelector(`tr[data-id="${id}"]`);
      if (e.target.checked) {
        adminSelectedIds.add(id);
        if (tr) tr.classList.add('row-selected');
      } else {
        adminSelectedIds.delete(id);
        if (tr) tr.classList.remove('row-selected');
      }
      updateAdminSelectionUI();
    }
  });

  // Select all on page
  $('admin-check-all-page')?.addEventListener('click', (e) => {
    const checkboxes = tbody.querySelectorAll('.row-checkbox');
    checkboxes.forEach(cb => {
      const id = cb.dataset.id;
      const tr = cb.closest('tr.data-row');
      if (e.target.checked) {
        adminSelectedIds.add(id);
        if (tr) tr.classList.add('row-selected');
        cb.checked = true;
      } else {
        adminSelectedIds.delete(id);
        if (tr) tr.classList.remove('row-selected');
        cb.checked = false;
      }
    });
    updateAdminSelectionUI();
  });

  // Batch action buttons
  $('admin-multi-imp-1')?.addEventListener('click', () => setMultiImportantity(1));
  $('admin-multi-imp-2')?.addEventListener('click', () => setMultiImportantity(2));
  $('admin-multi-imp-3')?.addEventListener('click', () => setMultiImportantity(3));
  
  $('admin-deselect-all')?.addEventListener('click', () => {
    adminSelectedIds.clear();
    loadAdminData(); // Refresh UI
    updateAdminSelectionUI();
  });

  $('admin-multi-delete')?.addEventListener('click', async () => {
    if (adminSelectedIds.size === 0) return;
    if (!confirm(`Hapus ${adminSelectedIds.size} kartu terpilih sekaligus?`)) return;
    
    const idsArray = Array.from(adminSelectedIds);
    const { error } = await supabase.from('cards').delete().in('id', idsArray);
    
    if (error) {
      showToast('Gagal menghapus kartu: ' + error.message);
    } else {
      showToast(`Berhasil menghapus ${idsArray.length} kartu`);
      adminSelectedIds.clear();
      updateAdminSelectionUI();
      loadAdminData();
      loadData(true).catch(console.error);
    }
  });
}

function updateAdminSelectionUI() {
  const count = adminSelectedIds.size;
  const actionBar = $('admin-selection-bar');
  const label = $('admin-selected-count');

  if (label) label.textContent = `${count} Kartu Dipilih`;
  if (actionBar) {
    if (count > 0) {
      actionBar.classList.add('active');
      actionBar.style.display = 'flex';
    } else {
      actionBar.classList.remove('active');
      actionBar.style.display = 'none';
    }
  }
  
  // Save selection to sessionStorage
  try {
    sessionStorage.setItem('fcAdminSelection', JSON.stringify(Array.from(adminSelectedIds)));
  } catch(e) {}
}

async function setMultiImportantity(value) {
  if (adminSelectedIds.size === 0) return;
  const idsArray = Array.from(adminSelectedIds);
  
  const { error } = await supabase
    .from('cards')
    .update({ importantity: value })
    .in('id', idsArray);

  if (error) {
    showToast('Gagal mengubah tipe: ' + error.message);
  } else {
    showToast(`Berhasil mengubah ${idsArray.length} kartu menjadi Tipe ${value}`);
    adminSelectedIds.clear();
    updateAdminSelectionUI();
    loadAdminData();
    loadData(true).catch(console.error); // refresh cache
  }
}

// =======================
// STATISTICS & CHARTS
// =======================

let chartChapters = null;
let chartJlpt = null;
let chartTypes = null;

async function renderAdminStats() {
  const data = await loadData();
  
  if (!data || data.length === 0) {
    showToast('Gagal memuat data statistik');
    return;
  }

  const chaptersMap = new Map();
  const jlptCounts = { n1: 0, n2: 0, n3: 0, n4: 0, n5: 0, none: 0 };
  const typeCounts = { 1: 0, 2: 0, 3: 0 };

  data.forEach(card => {
    // JLPT
    const lvl = (card.level || '-').toLowerCase();
    if (jlptCounts.hasOwnProperty(lvl)) jlptCounts[lvl]++;
    else jlptCounts.none++;

    // Type
    const tipe = card.importantity || 1;
    if (typeCounts[tipe] !== undefined) typeCounts[tipe]++;

    // Chapters
    const chap = card.chapter || 'Unknown';
    if (!chaptersMap.has(chap)) {
      chaptersMap.set(chap, { 1: 0, 2: 0, 3: 0 });
    }
    chaptersMap.get(chap)[tipe]++;
  });

  // Sort chapters
  const sortedChapters = Array.from(chaptersMap.keys()).sort((a, b) => {
    const numA = parseInt(a.replace('Bab', '')) || 0;
    const numB = parseInt(b.replace('Bab', '')) || 0;
    return numA - numB;
  });

  const chapLabels = sortedChapters;
  const chapData1 = sortedChapters.map(c => chaptersMap.get(c)[1]);
  const chapData2 = sortedChapters.map(c => chaptersMap.get(c)[2]);
  const chapData3 = sortedChapters.map(c => chaptersMap.get(c)[3]);

  // Chart defaults
  if (window.Chart) {
    window.Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    window.Chart.defaults.font.family = "'Inter', sans-serif";
  }

  // Destroy previous
  if (chartChapters) chartChapters.destroy();
  if (chartJlpt) chartJlpt.destroy();
  if (chartTypes) chartTypes.destroy();

  const ctxChap = document.getElementById('chart-chapters');
  if (ctxChap) {
    chartChapters = new window.Chart(ctxChap.getContext('2d'), {
      type: 'bar',
      data: {
        labels: chapLabels,
        datasets: [
          { label: 'Tipe 1 (Wajib)', data: chapData1, backgroundColor: '#10b981' },
          { label: 'Tipe 2 (Extra)', data: chapData2, backgroundColor: '#f59e0b' },
          { label: 'Tipe 3 (Trash)', data: chapData3, backgroundColor: '#ef4444' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)' } },
          y: { stacked: true, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
      }
    });
  }

  const ctxJlpt = document.getElementById('chart-jlpt');
  if (ctxJlpt) {
    chartJlpt = new window.Chart(ctxJlpt.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['N1', 'N2', 'N3', 'N4', 'N5', 'None'],
        datasets: [{
          data: [jlptCounts.n1, jlptCounts.n2, jlptCounts.n3, jlptCounts.n4, jlptCounts.n5, jlptCounts.none],
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6b7280'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  const ctxTypes = document.getElementById('chart-types');
  if (ctxTypes) {
    chartTypes = new window.Chart(ctxTypes.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Tipe 1 (Wajib)', 'Tipe 2 (Extra)', 'Tipe 3 (Trash)'],
        datasets: [{
          data: [typeCounts[1], typeCounts[2], typeCounts[3]],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}
