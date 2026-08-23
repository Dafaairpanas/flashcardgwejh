
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BunpouPage() {
  const [activeTab, setActiveTab] = useState('minna');

  const minnaChapters = Array.from({ length: 50 }, (_, i) => `Bab ${String(i + 1).padStart(2, '0')}`);
  const irodoriChapters = Array.from({ length: 18 }, (_, i) => `Bab ${String(i + 1).padStart(2, '0')}`);

  const irodoriLevels = [
    { id: 'a1', title: 'Irodori A1', path: 'irodori-a1' },
    { id: 'a2-1', title: 'Irodori A2.1', path: 'irodori-a2-1' },
    { id: 'a2-2', title: 'Irodori A2.2', path: 'irodori-a2-2' }
  ];

  return (
    <div id="app-container">
      <nav className="navbar" id="navbar">
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          <span className="nav-logo" id="nav-home-btn">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="#fff" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
            </svg>
          </span>
          <h1 className="nav-title" id="nav-menu-btn">AditFlashcard</h1>
        </Link>
      </nav>

      <main className="main-content">
        <div className="view active" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 700 }}>Tata Bahasa (文法)</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pilih bab untuk melihat rangkuman tata bahasa.</p>
            </div>
            
            <div className="filter-group-row" style={{ display: 'inline-flex' }}>
              <button 
                className={`filter-btn ${activeTab === 'minna' ? 'active' : ''}`}
                onClick={() => setActiveTab('minna')}
                style={{ padding: '8px 24px' }}
              >
                Minna
              </button>
              <button 
                className={`filter-btn ${activeTab === 'irodori' ? 'active' : ''}`}
                onClick={() => setActiveTab('irodori')}
                style={{ padding: '8px 24px' }}
              >
                Irodori
              </button>
            </div>
          </div>

          {activeTab === 'minna' ? (
            <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
              {minnaChapters.map(chap => (
                <Link 
                  to={`/bunpou/minna/${chap.toLowerCase().replace(' ', '')}`} 
                  key={chap} 
                  className="chapter-chip"
                  style={{ textDecoration: 'none', height: '48px', fontSize: '0.9rem' }}
                >
                  {chap}
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '80px 20px',
              gap: '16px',
              opacity: 0.5
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Coming Soon</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Bunpou Irodori sedang dalam pengembangan.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
