'use client';

import React, { useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '../../../src/store/useStore';
import { initializeData, getChapterStats, chapterDisplayName, getCardsByChapters } from '../../../src/data';
import { fsrs } from '../../../src/state';

function SetupContent({ initialCards, initialChapters }) {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('filter');
  const [filter, setFilter] = React.useState('minna');
  const router = useRouter();

  useEffect(() => {
    const activeFilter = urlFilter || localStorage.getItem('gw_last_filter') || 'minna';
    setFilter(activeFilter);
    if (activeFilter !== urlFilter) {
      router.replace(`/study/setup?filter=${activeFilter}`);
    } else {
      localStorage.setItem('gw_last_filter', activeFilter);
    }
  }, [urlFilter, router]);

  // Global State
  const chapters = useStore((state) => state.chapters);
  const selectedChapters = useStore((state) => state.selectedChapters);
  const setSelectedChapters = useStore((state) => state.setSelectedChapters);
  
  const selectedGrades = useStore((state) => state.selectedGrades);
  const toggleGrade = useStore((state) => state.toggleGrade);
  
  const jlptFilter = useStore((state) => state.jlptFilter);
  const setJlptFilter = useStore((state) => state.setJlptFilter);
  
  const studyMode = useStore((state) => state.studyMode);
  const setStudyMode = useStore((state) => state.setStudyMode);

  const soundEnabled = useStore((state) => state.soundEnabled);
  const toggleSound = useStore((state) => state.toggleSound);

  const setAllCards = useStore((state) => state.setAllCards);
  const setChapters = useStore((state) => state.setChapters);

  // Initialize data from server-provided props
  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      initializeData(initialCards);      // Populate module-level ALL_CARDS + localStorage cache
      setAllCards(initialCards);          // Zustand store
      setChapters(initialChapters);      // Zustand store
    }
  }, [initialCards, initialChapters, setAllCards, setChapters]);

  // Filter Chapters
  const chaptersToDisplay = useMemo(() => {
    if (filter === 'minna') return chapters.filter(ch => ch.startsWith('Bab'));
    if (filter === 'irodori') return chapters.filter(ch => ch.startsWith('ir') || ch.startsWith('Iro'));
    return chapters;
  }, [chapters, filter]);

  // Sanitize selected chapters so they don't cross-contaminate between Minna and Irodori
  useEffect(() => {
    if (filter === 'all' || chaptersToDisplay.length === 0) return;
    
    const validSelected = selectedChapters.filter(ch => chaptersToDisplay.includes(ch));
    if (validSelected.length !== selectedChapters.length) {
      setSelectedChapters(validSelected);
    }
  }, [filter, chaptersToDisplay, selectedChapters, setSelectedChapters]);

  // Group Chapters for Irodori
  const groupedChapters = useMemo(() => {
    if (filter === 'irodori') {
      const groups = {};
      chaptersToDisplay.forEach(ch => {
        const parts = ch.split('-');
        let groupName = parts.slice(0, -1).join('-');
        if (!groupName) groupName = 'Lainnya';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(ch);
      });
      return Object.entries(groups).map(([name, chs]) => ({ name, chapters: chs }));
    }
    return [{ name: null, chapters: chaptersToDisplay }];
  }, [chaptersToDisplay, filter]);

  // Derived Stats
  const cards = useMemo(() => getCardsByChapters(selectedChapters, selectedGrades, jlptFilter, studyMode), [selectedChapters, selectedGrades, jlptFilter, studyMode]);
  const stats = useMemo(() => {
    try {
      return fsrs.getStats(cards);
    } catch {
      return { total: 0, newCount: 0, learningCount: 0, dueCount: 0 };
    }
  }, [cards]);

  const [isDragging, setIsDragging] = React.useState(false);
  const [dragAction, setDragAction] = React.useState(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);
  const lastTouchedChRef = React.useRef(null);
  const isTouchRef = React.useRef(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragAction(null);
      lastTouchedChRef.current = null;
      setTimeout(() => { isTouchRef.current = false; }, 300);
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const applySelection = (ch, action) => {
    const currentSelected = useStore.getState().selectedChapters;
    const isSelected = currentSelected.includes(ch);
    if (action === 'add' && !isSelected) {
      setSelectedChapters([...currentSelected, ch]);
    } else if (action === 'remove' && isSelected) {
      setSelectedChapters(currentSelected.filter(c => c !== ch));
    }
  };

  const handleMouseDown = (ch) => {
    if (isTouchRef.current) return;
    const currentSelected = useStore.getState().selectedChapters;
    const isSelected = currentSelected.includes(ch);
    const action = isSelected ? 'remove' : 'add';
    setIsDragging(true);
    setDragAction(action);
    applySelection(ch, action);
  };

  const handleMouseEnter = (ch) => {
    if (!isDragging) return;
    applySelection(ch, dragAction);
  };

  const handleTouchStart = (ch) => {
    isTouchRef.current = true;
    const currentSelected = useStore.getState().selectedChapters;
    const isSelected = currentSelected.includes(ch);
    const action = isSelected ? 'remove' : 'add';
    setIsDragging(true);
    setDragAction(action);
    applySelection(ch, action);
    lastTouchedChRef.current = ch;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      const chapterChip = element.closest('.chapter-chip');
      if (chapterChip) {
        const ch = chapterChip.getAttribute('data-chapter');
        if (ch && ch !== lastTouchedChRef.current) {
          applySelection(ch, dragAction);
          lastTouchedChRef.current = ch;
        }
      }
    }
  };

  const handleSelectAll = () => setSelectedChapters([...chaptersToDisplay]);
  const handleClearAll = () => setSelectedChapters([]);
  const handleStart = () => router.push('/study');

  const handleReset = () => {
    fsrs.reset();
    window.location.reload();
  };

  return (
    <div id="app-container">
      <nav className="navbar" id="navbar" style={{ padding: '8px 32px', minHeight: '60px' }}>
        <a className="navbar-brand" onClick={() => router.push('/')} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <span className="nav-logo" id="nav-home-btn">
            <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="5"></rect>
              <text x="50%" y="54%" fontFamily="sans-serif" fontWeight="800" fontSize="12" fill="#fff" stroke="none" textAnchor="middle" dominantBaseline="middle">日</text>
            </svg>
          </span>
          <h1 className="nav-title" id="nav-menu-btn">AditFlashcard</h1>
        </a>
        <div className="navbar-actions">
          <div className="desktop-only" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px', gap: '4px', marginRight: '8px' }}>
            <button 
              onClick={() => router.push('/study/setup?filter=minna')}
              style={{
                background: filter === 'minna' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: filter === 'minna' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: filter === 'minna' ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              Minna
            </button>
            <button 
              onClick={() => router.push('/study/setup?filter=irodori')}
              style={{
                background: filter === 'irodori' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: filter === 'irodori' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: filter === 'irodori' ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              Irodori
            </button>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={toggleSound} title={soundEnabled ? "Mute" : "Unmute"}>
            {soundEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset Data">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px', marginRight: '4px'}}>
              <path d="M3 2v6h6"></path>
              <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
            </svg>
            Reset Data
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="view setup-view active" id="setup-view">
          <div className="bento-container">
            {/* Sidebar (Acts as Modal on Mobile) */}
            <aside className={`bento-sidebar ${isMobileModalOpen ? 'modal-active' : ''}`}>
              {/* Mobile Close Button */}
              <div className="mobile-modal-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Pengaturan</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setIsMobileModalOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'24px', height:'24px'}}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              {/* Grade Filter */}
              <div className="bento-card bento-filter">
                <div className="bento-header"><h3>Grade</h3></div>
                <div className="filter-group-row">
                  <button className={`filter-btn ${selectedGrades.includes(1) ? 'active' : ''}`} onClick={() => toggleGrade(1)}>1 Wajib</button>
                  <button className={`filter-btn ${selectedGrades.includes(2) ? 'active' : ''}`} onClick={() => toggleGrade(2)}>2 Extra</button>
                  <button className={`filter-btn ${selectedGrades.includes(3) ? 'active' : ''}`} onClick={() => toggleGrade(3)}>3 Trash</button>
                </div>
              </div>

              {/* JLPT Filter */}
              <div className={`bento-card bento-jlpt ${studyMode === 2 ? '' : 'hidden'}`}>
                <div className="bento-header"><h3>JLPT Level</h3></div>
                <div className="filter-group-wrap">
                  {['n1', 'n2', 'n3', 'n4', 'n5', 'all'].map(level => (
                    <button key={level} className={`filter-btn-sm ${jlptFilter === level ? 'active' : ''}`} onClick={() => setJlptFilter(level)}>
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Study Mode */}
              <div className="bento-card bento-mode">
                <div className="bento-header"><h3>Study Mode</h3></div>
                <div className="filter-group-wrap">
                  <button className={`filter-btn-sm ${studyMode === 1 ? 'active' : ''}`} onClick={() => setStudyMode(1)}>Standard</button>
                  <button className={`filter-btn-sm ${studyMode === 2 ? 'active' : ''}`} onClick={() => setStudyMode(2)}>Kanji</button>
                  <button className={`filter-btn-sm ${studyMode === 3 ? 'active' : ''}`} onClick={() => setStudyMode(3)}>Reverse</button>
                  <button className={`filter-btn-sm ${studyMode === 4 ? 'active' : ''}`} onClick={() => setStudyMode(4)}>Audio</button>
                </div>
              </div>

              <div className="bento-card bento-actions" style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
                <button className="btn btn-primary btn-start" onClick={handleStart} disabled={cards.length === 0} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                  START SESSION
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px', height:'16px', marginLeft:'8px'}}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="bento-main">
              {/* Library Toggle (Minna / Irodori) */}
              <div className="mobile-only" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px', gap: '4px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                <button 
                  onClick={() => router.push('/study/setup?filter=minna')}
                  style={{
                    background: filter === 'minna' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: filter === 'minna' ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 20px',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: filter === 'minna' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  Minna
                </button>
                <button 
                  onClick={() => router.push('/study/setup?filter=irodori')}
                  style={{
                    background: filter === 'irodori' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: filter === 'irodori' ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 20px',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: filter === 'irodori' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  Irodori
                </button>
              </div>
              <div className="bento-stats-row">
                <div className="bento-card stat-item-card">
                  <div className="stat-value text-cyan">{stats.total}</div>
                  <div className="stat-label">TOTAL CARDS</div>
                </div>
                <div className="bento-card stat-item-card">
                  <div className="stat-value text-purple">{stats.newCount}</div>
                  <div className="stat-label">NEW</div>
                </div>
                <div className="bento-card stat-item-card">
                  <div className="stat-value text-pink">{stats.learningCount}</div>
                  <div className="stat-label">LEARNING</div>
                </div>
                <div className="bento-card stat-item-card">
                  <div className="stat-value text-gray">{stats.dueCount}</div>
                  <div className="stat-label">REVIEW</div>
                </div>
              </div>

              <div className="bento-card bento-chapters">
                <div className="bento-header">
                  <h3>Library Select</h3>
                  <span className="badge">{selectedChapters.length} Selected</span>
                </div>
                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '16px', minHeight: 0 }}>
                  {groupedChapters.map((group, gIdx) => (
                    <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {group.name && (
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {group.name}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '8px' }}>
                        {group.chapters.map(ch => {
                          const chStats = getChapterStats(ch);
                          const isSelected = selectedChapters.includes(ch);
                          
                          let displayName = chapterDisplayName(ch);
                          if (filter === 'irodori' && ch.includes('-')) {
                            const numStr = ch.split('-').pop();
                            displayName = `Bab ${parseInt(numStr, 10)}`;
                          }

                          return (
                            <div
                              key={ch}
                              className={`chapter-chip ${isSelected ? 'selected' : ''}`}
                              title={`Utama: ${chStats.main} | Extra: ${chStats.extra}`}
                              data-chapter={ch}
                              onMouseDown={() => handleMouseDown(ch)}
                              onMouseEnter={() => handleMouseEnter(ch)}
                              onTouchStart={(e) => handleTouchStart(ch)}
                              onTouchMove={handleTouchMove}
                              style={{ touchAction: 'none' }}
                            >
                              {displayName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mobile Next Button */}
              <div className="mobile-setup-bar" style={{ marginTop: '24px', position: 'sticky', bottom: '24px', zIndex: 10 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)' }}
                  onClick={() => setIsMobileModalOpen(true)}
                  disabled={selectedChapters.length === 0}
                >
                  LANJUT ({selectedChapters.length} Bab)
                </button>
              </div>
            </main>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SetupClient({ initialCards, initialChapters }) {
  return (
    <Suspense fallback={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Loading setup...</div>}>
      <SetupContent initialCards={initialCards} initialChapters={initialChapters} />
    </Suspense>
  );
}
