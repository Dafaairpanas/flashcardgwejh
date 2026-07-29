import { $, state } from '../state.js';

// ── Hidden Menu ──
export function toggleHiddenMenu() {
  const menu = $('hidden-menu');
  const overlay = $('hidden-menu-overlay');
  if (!menu || !overlay) return;
  const isOpen = menu.classList.contains('active');
  if (isOpen) {
    closeHiddenMenu();
  } else {
    menu.classList.add('active');
    overlay.classList.add('active');
  }
}

export function closeHiddenMenu() {
  const menu = $('hidden-menu');
  const overlay = $('hidden-menu-overlay');
  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// ── Toast ──
let toastTimer = null;
export function showToast(msg) {
  const el = $('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Dynamic Theme Colors ──
export function changeThemeColor() {
  const h1 = Math.floor(Math.random() * 360);
  const h2 = (h1 + 30 + Math.floor(Math.random() * 60)) % 360;
  const color1 = `hsl(${h1}, 85%, 65%)`;
  const color2 = `hsl(${h2}, 85%, 60%)`;
  
  document.documentElement.style.setProperty('--accent-sakura', color1);
  document.documentElement.style.setProperty('--accent-violet', color2);
}

// ── Font ──
export function setJapaneseFont(font) {
  state.jpFont = font;
  localStorage.setItem('gw_jp_font', font);
  document.documentElement.style.setProperty('--font-jp', font);
}
