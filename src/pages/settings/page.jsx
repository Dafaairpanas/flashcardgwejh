
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

export default function SettingsPage() {
  const router = useNavigate();
  const jpFont = useStore((state) => state.jpFont);
  const setJpFont = useStore((state) => state.setJpFont);

  const FONT_OPTIONS = [
    { value: '"Noto Sans JP", sans-serif', label: 'Noto Sans JP (Modern & Bersih)' },
    { value: '"Noto Serif JP", serif', label: 'Noto Serif JP (Klasik & Elegan)' },
    { value: '"Klee One", cursive', label: 'Klee One (Mirip Tulisan Tangan)' },
    { value: '"UDDigiKyokasho", sans-serif', label: 'UD Digi Kyokasho (Buku Pelajaran)' },
  ];

  return (
    <div id="app">
      <nav className="navbar" id="navbar">
        <a className="navbar-brand" onClick={() => router('/')} style={{ cursor: 'pointer' }}>
          <span className="nav-logo" id="nav-home-btn">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </span>
          <h1 className="nav-title" id="nav-menu-btn">Settings</h1>
        </a>
      </nav>

      <main className="main-content">
        <div className="bento-container" style={{ margin: '0 auto', maxWidth: '600px', flexDirection: 'column' }}>
          <div className="bento-card">
            <div className="bento-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
              <h3>Pengaturan Font Jepang (Nihongo)</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Pilih font khusus untuk teks huruf Jepang (Kanji, Hiragana, Katakana).
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FONT_OPTIONS.map((font) => (
                <div 
                  key={font.value}
                  onClick={() => setJpFont(font.value)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: jpFont === font.value ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${jpFont === font.value ? 'var(--accent-violet)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: jpFont === font.value ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {font.label}
                    </strong>
                    {jpFont === font.value && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div style={{ 
                    fontFamily: font.value, 
                    fontSize: '1.5rem', 
                    color: 'var(--text-primary)',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    日本語の勉強
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
