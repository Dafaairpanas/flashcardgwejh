import { supabase } from './supabaseClient.js';
import { $ } from './state.js';
import { showToast } from './ui/layout.js';
import { getChapters, getWordClasses, loadData } from './data.js';

let currentPage = 1;
const ITEMS_PER_PAGE = 50;
let currentSearchQuery = '';
let currentChapterFilter = 'all';
let currentTypeFilter = 'all';

export function initAdmin() {
  const loginSection = $('admin-login-section');
  const dashboardSection = $('admin-dashboard-section');
  
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
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada data.</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  const fragment = document.createDocumentFragment();
  
  data.forEach(card => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
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
  }
}
