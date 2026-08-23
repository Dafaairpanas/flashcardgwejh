import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ChapterSelect from './ChapterSelect';

async function getBunpouData(source, chapter) {
  try {
    const res = await fetch(`/api/bunpou/${source}/${chapter}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error reading bunpou data:", error);
    return null;
  }
}

export default function BunpouChapterPage() {
  const { source, chapter } = useParams();
  const [data, setData] = useState(null);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('bunpou-theme') === 'light';
  });

  const toggleTheme = () => {
    setIsLightMode(prev => {
      const next = !prev;
      localStorage.setItem('bunpou-theme', next ? 'light' : 'dark');
      return next;
    });
  };

  useEffect(() => {
    getBunpouData(source, chapter).then(setData);
  }, [source, chapter]);

  
  // Format chapter name nicely (e.g. bab01 -> Bab 01)
  const displayChapter = chapter ? chapter.replace('bab', 'Bab ') : '';
  
  let displaySource = source;
  if (source === 'minna') displaySource = 'Minna no Nihongo';
  else if (source === 'irodori-a1') displaySource = 'Irodori A1';
  else if (source === 'irodori-a2-1') displaySource = 'Irodori A2.1';
  else if (source === 'irodori-a2-2') displaySource = 'Irodori A2.2';

  return (
    <div id="app" style={isLightMode ? {
      '--bg-primary': '#fafafa',
      '--bg-secondary': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-glass': '#ffffff',
      '--bg-input': '#f4f4f5',
      '--text-primary': '#111827',
      '--text-secondary': '#4b5563',
      '--text-muted': '#9ca3af',
      '--border-glass': '#e5e7eb',
      '--border-accent': '#d1d5db',
    } : {}}>
      {isLightMode && (
        <style>{`
          body { background: #fafafa !important; color: #111827 !important; }
          .ambient-bg { display: none !important; }
          .navbar { background: #ffffff !important; border-bottom: 1px solid #e5e7eb !important; }
          .logo-svg rect { stroke: #111827 !important; }
          .logo-svg text { fill: #111827 !important; }
          .nav-title { color: #111827 !important; }
          .bento-card {
            background: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
            border-radius: 8px !important;
          }
          .btn-ghost { color: #4b5563 !important; border: 1px solid #e5e7eb !important; background: #ffffff !important; }
          .btn-ghost:hover { background: #f3f4f6 !important; }
        `}</style>
      )}
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
        <div className="view active" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/bunpou" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Kembali ke List
              </Link>
              
              <button onClick={toggleTheme} className="btn btn-ghost btn-sm" title={isLightMode ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"} style={{ whiteSpace: 'nowrap' }}>
                {isLightMode ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                )}
                <span style={{ marginLeft: '6px' }}>Mode Dokumen</span>
              </button>
            </div>
            
            <ChapterSelect source={source} currentChapter={chapter} />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ background: 'var(--bg-input)', padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {displaySource}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>{displayChapter}</span>
            </div>
            <h2 style={{ fontSize: '2rem', margin: '0', fontWeight: 700 }}>Tata Bahasa (文法)</h2>
          </div>

          {!data || data.length === 0 ? (
            <div className="bento-card" style={{ padding: '40px', textAlign: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ width: '48px', height: '48px', marginBottom: '16px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Materi Belum Tersedia</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Rangkuman tata bahasa untuk {displaySource} {displayChapter} sedang dalam tahap penulisan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {data.map((item, idx) => (
                <div key={item.id} className="bento-card" style={{ padding: '0', overflow: 'hidden' }}>
                  
                  {/* Header / Pola Kalimat */}
                  <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-accent)', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', lineHeight: '1.4' }}>
                          {item.title}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.romajiTitle}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Rumus */}
                    {item.formula && (
                      <div style={{ padding: '16px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid var(--border-accent)', borderRadius: '12px', display: 'inline-block' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-accent)', marginBottom: '8px', fontWeight: 600 }}>RUMUS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{item.formula}</div>
                      </div>
                    )}

                    {/* Arti dan Fungsi */}
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>FUNGSI</div>
                      <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-primary)' }}>{item.meaning}</p>
                    </div>

                    {/* Contoh Kalimat */}
                    {item.examples && item.examples.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>CONTOH KALIMAT</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {item.examples.map((ex, i) => (
                            <div key={i} style={{ paddingLeft: '16px', borderLeft: '3px solid var(--border-glass)' }}>
                              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-jp)', marginBottom: '4px', color: 'var(--text-primary)' }}>{ex.jp}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{ex.romaji}</div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{ex.id_translation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Catatan */}
                    {item.notes && (
                      <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" strokeWidth="2" style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>Catatan: </strong>
                          {item.notes}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {item.tags.map(tag => (
                          <span key={tag} style={{ background: 'var(--bg-input)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
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
