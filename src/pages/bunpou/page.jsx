
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const bunpouModules = import.meta.glob('/src/data/bunpou/**/*.json');

export default function BunpouPage() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('bunpou_tab') || 'minna';
  });

  const [activeLevel, setActiveLevel] = useState(() => {
    return localStorage.getItem('bunpou_irodori_level') || 'a1';
  });

  const [chapterCounts, setChapterCounts] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadAllCounts = async () => {
      const counts = {};
      await Promise.all(
        Object.entries(bunpouModules).map(async ([path, loader]) => {
          try {
            const mod = await loader();
            const raw = mod.default || mod;
            if (Array.isArray(raw)) {
              counts[path] = raw.length;
            } else if (raw && typeof raw === 'object' && Object.keys(raw).length > 0) {
              counts[path] = 1;
            }
          } catch (e) {}
        })
      );
      if (isMounted) {
        setChapterCounts(counts);
      }
    };
    loadAllCounts();
    return () => { isMounted = false; };
  }, []);

  const minnaChapters = Array.from({ length: 50 }, (_, i) => `Bab ${String(i + 1).padStart(2, '0')}`);
  const irodoriChapters = Array.from({ length: 18 }, (_, i) => `Bab ${String(i + 1).padStart(2, '0')}`);

  const irodoriLevels = [
    { id: 'a1', title: 'Irodori A1', subtitle: 'Pemula (Starter)', path: 'irodori-a1' },
    { id: 'a2-1', title: 'Irodori A2.1', subtitle: 'Dasar 1 (Elementary 1)', path: 'irodori-a2-1' },
    { id: 'a2-2', title: 'Irodori A2.2', subtitle: 'Dasar 2 (Elementary 2)', path: 'irodori-a2-2' }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('bunpou_tab', tab);
  };

  const handleLevelChange = (lvlId) => {
    setActiveLevel(lvlId);
    localStorage.setItem('bunpou_irodori_level', lvlId);
  };

  const getChapterCount = (sourceKey, chapSlug) => {
    let candidates = [];
    const key = (sourceKey || '').toLowerCase();
    if (key === 'minna') {
      candidates = [`/src/data/bunpou/minna/${chapSlug}.json`];
    } else if (key === 'irodori-a1' || key === 'a1') {
      candidates = [`/src/data/bunpou/irodori/a1/${chapSlug}.json`];
    } else if (key === 'irodori-a2-1' || key === 'irodori-a2.1' || key === 'a2-1' || key === 'a2.1') {
      candidates = [
        `/src/data/bunpou/irodori/a2.1/${chapSlug}.json`,
        `/src/data/bunpou/irodori/a2-1/${chapSlug}.json`
      ];
    } else if (key === 'irodori-a2-2' || key === 'irodori-a2.2' || key === 'a2-2' || key === 'a2.2') {
      candidates = [
        `/src/data/bunpou/irodori/a2.2/${chapSlug}.json`,
        `/src/data/bunpou/irodori/a2-2/${chapSlug}.json`
      ];
    }

    for (const p of candidates) {
      if (typeof chapterCounts[p] === 'number') {
        return chapterCounts[p];
      }
    }
    return 0;
  };

  const currentLevelObj = irodoriLevels.find(l => l.id === activeLevel) || irodoriLevels[0];

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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 700 }}>Tata Bahasa (文法)</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pilih bab untuk melihat rangkuman tata bahasa.</p>
            </div>
            
            <div className="filter-group-row" style={{ display: 'inline-flex' }}>
              <button 
                className={`filter-btn ${activeTab === 'minna' ? 'active' : ''}`}
                onClick={() => handleTabChange('minna')}
                style={{ padding: '8px 24px' }}
              >
                Minna
              </button>
              <button 
                className={`filter-btn ${activeTab === 'irodori' ? 'active' : ''}`}
                onClick={() => handleTabChange('irodori')}
                style={{ padding: '8px 24px' }}
              >
                Irodori
              </button>
            </div>
          </div>

          {activeTab === 'minna' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Minna no Nihongo (Bab 01 - 50)
                </div>
              </div>
              <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                {minnaChapters.map(chap => {
                  const slug = chap.toLowerCase().replace(' ', '');
                  const count = getChapterCount('minna', slug);
                  return (
                    <Link 
                      to={`/bunpou/minna/${slug}`} 
                      key={chap} 
                      className="chapter-chip"
                      style={{ 
                        textDecoration: 'none', 
                        height: '52px', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{chap}</span>
                      {count > 0 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {count} pola
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Level Selector Pills */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {irodoriLevels.map(lvl => {
                  const isSelected = activeLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => handleLevelChange(lvl.id)}
                      className={`filter-btn ${isSelected ? 'active' : ''}`}
                      style={{
                        padding: '10px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '2px',
                        borderRadius: '12px',
                        border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--border-glass)',
                        background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-card)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--accent-violet)' : 'inherit' }}>
                        {lvl.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {lvl.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Header for current level */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {currentLevelObj.title} • {currentLevelObj.subtitle} (Bab 01 - 18)
                </div>
              </div>

              {/* 18 Chapters Grid */}
              <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                {irodoriChapters.map(chap => {
                  const slug = chap.toLowerCase().replace(' ', '');
                  const count = getChapterCount(currentLevelObj.path, slug);
                  const hasData = count > 0;

                  return (
                    <Link 
                      to={`/bunpou/${currentLevelObj.path}/${slug}`} 
                      key={chap} 
                      className="chapter-chip"
                      style={{ 
                        textDecoration: 'none', 
                        height: '52px', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2px',
                        border: hasData ? '1px solid rgba(168, 85, 247, 0.4)' : undefined,
                        background: hasData ? 'rgba(168, 85, 247, 0.08)' : undefined
                      }}
                    >
                      <span style={{ fontWeight: 600, color: hasData ? 'var(--text-primary)' : 'inherit' }}>
                        {chap}
                      </span>
                      {hasData ? (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-violet)', fontWeight: 600 }}>
                          {count} materi
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                          0 materi
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
