'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
        <Link href="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
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
                  href={`/bunpou/minna/${chap.toLowerCase().replace(' ', '')}`} 
                  key={chap} 
                  className="chapter-chip"
                  style={{ textDecoration: 'none', height: '48px', fontSize: '0.9rem' }}
                >
                  {chap}
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {irodoriLevels.map(level => (
                <div key={level.id}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    marginBottom: '16px', 
                    paddingLeft: '12px', 
                    borderLeft: '4px solid var(--text-accent)',
                    color: 'var(--text-primary)'
                  }}>
                    {level.title}
                  </h3>
                  <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                    {irodoriChapters.map(chap => (
                      <Link 
                        href={`/bunpou/${level.path}/${chap.toLowerCase().replace(' ', '')}`} 
                        key={chap} 
                        className="chapter-chip"
                        style={{ textDecoration: 'none', height: '48px', fontSize: '0.9rem' }}
                      >
                        {chap}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
