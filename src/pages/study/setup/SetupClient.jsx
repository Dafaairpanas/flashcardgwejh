
import React, { useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { initializeData, getChapterStats, chapterDisplayName, getCardsByChapters } from '@/data';
import { fsrs } from '@/state';
import { getMasteredCards } from '@/historyManager';
import jftKanjiData from '@/data/renshuu/jfta2kanji.json';
import irodoriExtraData from '@/data/renshuu/irodori_extra.json';

function SetupContent() {
  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter');
  const [filter, setFilter] = React.useState('minna');
  const router = useNavigate();
  
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const activeFilter = urlFilter || localStorage.getItem('gw_last_filter') || 'minna';
    setFilter(activeFilter);
    if (activeFilter !== urlFilter) {
      router(`/study/setup?filter=${activeFilter}`, { replace: true });
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

  const showChapterBadge = useStore((state) => state.showChapterBadge);
  const toggleChapterBadge = useStore((state) => state.toggleChapterBadge);

  const hideMastered = useStore((state) => state.hideMastered);
  const toggleHideMastered = useStore((state) => state.toggleHideMastered);

  const setAllCards = useStore((state) => state.setAllCards);
  const setChapters = useStore((state) => state.setChapters);
  
  const setCustomCards = useStore((state) => state.setCustomCards);
  const setCustomFsrs = useStore((state) => state.setCustomFsrs);

  const [kanjiLimit, setKanjiLimit] = React.useState(50);
  const [showJftModal, setShowJftModal] = React.useState(false);
  const [jftStats, setJftStats] = React.useState(null);

  const [irodoriLimit, setIrodoriLimit] = React.useState(50);
  const [showIrodoriModal, setShowIrodoriModal] = React.useState(false);
  const [irodoriStats, setIrodoriStats] = React.useState(null);
  const [irodoriMode, setIrodoriMode] = React.useState(1); // 1: Kotoba, 2: Kanji, 3: Reverse
  const [selectedIrodoriBatches, setSelectedIrodoriBatches] = React.useState([0]);

  const irodoriTotalBatches = Math.ceil((irodoriExtraData?.length || 0) / 50);
  const irodoriBatchOptions = Array.from({ length: irodoriTotalBatches }, (_, i) => i);
  const selectedIrodoriCardsCount = useMemo(() => {
    if (!irodoriExtraData) return 0;
    return irodoriExtraData.filter((_, idx) => selectedIrodoriBatches.includes(Math.floor(idx / 50))).length;
  }, [selectedIrodoriBatches]);

  useEffect(() => {
    if (irodoriLimit > selectedIrodoriCardsCount && selectedIrodoriCardsCount > 0) {
      setIrodoriLimit(selectedIrodoriCardsCount);
    }
  }, [selectedIrodoriCardsCount, irodoriLimit]);

  const toggleIrodoriBatch = (bIdx) => {
    if (selectedIrodoriBatches.includes(bIdx)) {
      setSelectedIrodoriBatches(prev => prev.filter(b => b !== bIdx));
    } else {
      setSelectedIrodoriBatches(prev => [...prev, bIdx]);
    }
  };

  const startJftKanji = () => {
    if (jftKanjiData && jftKanjiData.length > 0) {
      const sortedQueue = fsrs.getSortedQueue(jftKanjiData);
      const queueToStudy = sortedQueue.slice(0, kanjiLimit);
      setCustomCards(queueToStudy);
      setCustomFsrs(true);
      setStudyMode(2);
      router('/study');
    } else {
      alert("Data kanji tidak ditemukan!");
    }
  };

  const startIrodoriExtra = () => {
    if (irodoriExtraData && irodoriExtraData.length > 0) {
      const pool = irodoriExtraData.filter((_, idx) => selectedIrodoriBatches.includes(Math.floor(idx / 50)));
      if (pool.length === 0) {
        alert("Pilih minimal satu batch!");
        return;
      }
      const sortedQueue = fsrs.getSortedQueue(pool);
      const queueToStudy = sortedQueue.slice(0, Math.min(irodoriLimit, pool.length));
      setCustomCards(queueToStudy);
      setCustomFsrs(true);
      setStudyMode(irodoriMode);
      router('/study');
    } else {
      alert("Data tidak ditemukan!");
    }
  };

  const handleResetJft = () => {
    const ids = jftKanjiData.map(c => c.id);
    fsrs.resetCards(ids);
    setJftStats(fsrs.getStats(jftKanjiData || [])); 
  };

  const handleResetIrodori = () => {
    const ids = irodoriExtraData.map(c => c.id);
    fsrs.resetCards(ids);
    setIrodoriStats(fsrs.getStats(irodoriExtraData || []));
  };

  // Initialize data from API
  useEffect(() => {
    fetch('/api/kotoba.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.cards) {
          initializeData(data.cards);
          setAllCards(data.cards);
          setChapters(data.chapters);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch setup data', err);
        setIsLoading(false);
      });
  }, [setAllCards, setChapters]);

  // Filter Chapters
  const chaptersToDisplay = useMemo(() => {
    if (filter === 'minna') return chapters.filter(ch => ch.startsWith('Bab'));
    if (filter === 'irodori') return chapters.filter(ch => ch.startsWith('ir') || ch.startsWith('Iro'));
    if (filter === 'other') return [];
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
  const allCards = useStore((state) => state.allCards);
  const cards = useMemo(() => {
    let base = getCardsByChapters(selectedChapters, selectedGrades, jlptFilter, studyMode);
    if (hideMastered) {
      const masteredIds = new Set(getMasteredCards().map(m => m.cardId));
      base = base.filter(c => !masteredIds.has(c.id));
    }
    return base;
  }, [selectedChapters, selectedGrades, jlptFilter, studyMode, allCards, hideMastered]);
  
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
  const handleStart = () => router('/study');

  const handleReset = () => {
    fsrs.reset();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0b', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ marginLeft: '12px', fontSize: '1.1rem' }}>Mempersiapkan Library...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div id="app-container">
      <nav className="navbar" id="navbar" style={{ padding: '8px 32px', minHeight: '60px' }}>
        <a className="navbar-brand" onClick={() => router('/')} style={{ textDecoration: 'none', cursor: 'pointer' }}>
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
              onClick={() => router('/study/setup?filter=minna')}
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
              onClick={() => router('/study/setup?filter=irodori')}
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
            <button 
              onClick={() => router('/study/setup?filter=other')}
              style={{
                background: filter === 'other' ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: filter === 'other' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                fontWeight: filter === 'other' ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              Other
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
            {filter !== 'other' && (
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
                <div className="filter-group-wrap" style={{ marginBottom: '12px' }}>
                  <button className={`filter-btn-sm ${studyMode === 1 ? 'active' : ''}`} onClick={() => setStudyMode(1)}>Standard</button>
                  <button className={`filter-btn-sm ${studyMode === 2 ? 'active' : ''}`} onClick={() => setStudyMode(2)}>Kanji</button>
                  <button className={`filter-btn-sm ${studyMode === 5 ? 'active' : ''}`} onClick={() => setStudyMode(5)}>Mix</button>
                  <button className={`filter-btn-sm ${studyMode === 3 ? 'active' : ''}`} onClick={() => setStudyMode(3)}>Reverse</button>
                  <button className={`filter-btn-sm ${studyMode === 4 ? 'active' : ''}`} onClick={() => setStudyMode(4)}>Audio</button>
                </div>
                
                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Label Bab</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={showChapterBadge} onChange={toggleChapterBadge} style={{ display: 'none' }} />
                      <div style={{
                        width: '32px', height: '18px', background: showChapterBadge ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                        borderRadius: '9px', position: 'relative', transition: 'all 0.3s',
                        boxShadow: showChapterBadge ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '12px', height: '12px', background: '#fff', borderRadius: '50%',
                          position: 'absolute', top: '3px', left: showChapterBadge ? '17px' : '3px', transition: 'all 0.3s'
                        }}></div>
                      </div>
                    </label>
                  </div>
                  
                  <div style={{ 
                    display: 'none', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                      </svg>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Skip Dikuasai</span>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={hideMastered} onChange={toggleHideMastered} style={{ display: 'none' }} />
                      <div style={{
                        width: '32px', height: '18px', background: hideMastered ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                        borderRadius: '9px', position: 'relative', transition: 'all 0.3s',
                        boxShadow: hideMastered ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '12px', height: '12px', background: '#fff', borderRadius: '50%',
                          position: 'absolute', top: '3px', left: hideMastered ? '17px' : '3px', transition: 'all 0.3s'
                        }}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bento-card bento-actions" style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
                <button className="btn btn-primary btn-start" onClick={handleStart} disabled={cards.length === 0} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                  START SESSION
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px', height:'16px', marginLeft:'8px'}}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
              </div>
            </aside>
            )}

            {/* Main Content */}
            <main className="bento-main">
              {/* Library Toggle (Minna / Irodori) */}
              <div className="mobile-only" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px', gap: '4px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                <button 
                  onClick={() => router('/study/setup?filter=minna')}
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
                  onClick={() => router('/study/setup?filter=irodori')}
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
                <button 
                  onClick={() => router('/study/setup?filter=other')}
                  style={{
                    background: filter === 'other' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: filter === 'other' ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 20px',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: filter === 'other' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  Other
                </button>
              </div>
              {filter !== 'other' && (
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
                <div className="bento-card stat-item-card" onClick={() => router('/study/history')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '28px', height: '28px', opacity: 0.8}}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="stat-label">HISTORY</div>
                </div>
              </div>
              )}

              <div className="bento-card bento-chapters">
                <div className="bento-header">
                  <h3>Library Select</h3>
                  {filter !== 'other' && <span className="badge">{selectedChapters.length} Selected</span>}
                </div>
                {filter === 'minna' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => {
                        const num = parseInt(ch.replace(/\D/g, ''), 10);
                        return num >= 1 && num <= 10;
                      });
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>1-10</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => {
                        const num = parseInt(ch.replace(/\D/g, ''), 10);
                        return num >= 11 && num <= 25;
                      });
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>11-25</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => {
                        const num = parseInt(ch.replace(/\D/g, ''), 10);
                        return num >= 1 && num <= 25;
                      });
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>1-25</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => {
                        const num = parseInt(ch.replace(/\D/g, ''), 10);
                        return num >= 26 && num <= 37;
                      });
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>26-37</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => {
                        const num = parseInt(ch.replace(/\D/g, ''), 10);
                        return num >= 38 && num <= 50;
                      });
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>38-50</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      setSelectedChapters([...chaptersToDisplay]);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>All Minna</button>
                    <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>Clear</button>
                  </div>
                )}
                {filter === 'irodori' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => ch.startsWith('irA1'));
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>A1</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => ch.startsWith('irA2.1'));
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>A2.1</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      const range = chaptersToDisplay.filter(ch => ch.startsWith('irA2.2'));
                      setSelectedChapters(range);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>A2.2</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => {
                      setSelectedChapters([...chaptersToDisplay]);
                    }} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'var(--text-secondary)' }}>All Irodori</button>
                    <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>Clear</button>
                  </div>
                )}
                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '16px', minHeight: 0 }}>
                  {filter === 'other' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '8px' }}>
                      <div className="bento-card" style={{ 
                        padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', 
                        alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '400', fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                          漢字
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-primary)' }}>JFT A2 Kanji</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Latihan {jftKanjiData ? jftKanjiData.length : 0} Kanji khusus.</p>
                        </div>
                        <button 
                          onClick={() => {
                            const stats = fsrs.getStats(jftKanjiData || []);
                            setJftStats(stats);
                            setShowJftModal(true);
                          }}
                          className="btn"
                          style={{ 
                            width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 600, 
                            background: 'var(--color-primary)', color: '#ffffff', border: 'none', 
                            borderRadius: '12px', cursor: 'pointer'
                          }}
                        >
                          Mulai Latihan
                        </button>
                      </div>
                      
                      <div className="bento-card" style={{ 
                        padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', 
                        alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ fontSize: '32px', fontWeight: '400', fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                          語彙
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-primary)' }}>Minna Extra Irodori</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Latihan {irodoriExtraData ? irodoriExtraData.length : 0} kosakata tambahan.</p>
                        </div>
                        <button 
                          onClick={() => {
                            const stats = fsrs.getStats(irodoriExtraData || []);
                            setIrodoriStats(stats);
                            setShowIrodoriModal(true);
                          }}
                          className="btn"
                          style={{ 
                            width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 600, 
                            background: 'var(--color-primary)', color: '#ffffff', border: 'none', 
                            borderRadius: '12px', cursor: 'pointer'
                          }}
                        >
                          Mulai Latihan
                        </button>
                      </div>
                    </div>
                  ) : (
                    groupedChapters.map((group, gIdx) => (
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
                  )))}
                </div>
              </div>
              
              {/* Mobile Next Button */}
              <div className="mobile-setup-bar mobile-only" style={{ display: filter === 'other' ? 'none' : 'block', marginTop: '24px', position: 'sticky', bottom: '24px', zIndex: 10 }}>
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

        {/* Modal Pengaturan Latihan JFT */}
        {showJftModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowJftModal(false)}>
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              padding: '24px',
              borderRadius: '24px',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }} onClick={e => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Pengaturan Latihan</h3>
                <button 
                  onClick={() => setShowJftModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '24px', height: '24px'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {jftStats && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 4px 0' }}>Progress Hafalan</p>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{jftStats.reviewCount}</span> 
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0 4px' }}>/</span> 
                    <span style={{ fontSize: '1.2rem' }}>{jftStats.total}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>Kanji telah dikuasai</p>
                </div>
              )}

              <div style={{ width: '100%', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Show Label</span>
                </div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tampilkan Label Bab</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={showChapterBadge} onChange={toggleChapterBadge} style={{ display: 'none' }} />
                    <div style={{
                      width: '36px', height: '20px', background: showChapterBadge ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                      borderRadius: '10px', position: 'relative', transition: 'all 0.3s',
                      boxShadow: showChapterBadge ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                    }}>
                      <div style={{
                        width: '14px', height: '14px', background: '#fff', borderRadius: '50%',
                        position: 'absolute', top: '3px', left: showChapterBadge ? '19px' : '3px', transition: 'all 0.3s'
                      }}></div>
                    </div>
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Jumlah Kartu per Sesi</span>
                  <span style={{ color: 'var(--text-primary)' }}>{kanjiLimit}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max={jftKanjiData ? jftKanjiData.length : 1} 
                  value={kanjiLimit} 
                  onChange={(e) => setKanjiLimit(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={startJftKanji}
                  className="btn"
                  style={{ 
                    width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600, 
                    background: 'var(--color-primary)', color: '#ffffff', border: 'none', 
                    borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s, opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Mulai Sekarang
                </button>
                
                <button 
                  onClick={handleResetJft}
                  style={{ 
                    width: '100%', padding: '12px', fontSize: '0.85rem', fontWeight: 600, 
                    background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', 
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px'}}><path d="M3 2v6h6"></path><path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path></svg>
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Pengaturan Latihan Minna Extra Irodori */}
        {showIrodoriModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowIrodoriModal(false)}>
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              padding: '24px',
              borderRadius: '24px',
              width: '90%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }} onClick={e => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Minna Extra Irodori</h3>
                <button 
                  onClick={() => setShowIrodoriModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '24px', height: '24px'}}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {irodoriStats && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 4px 0' }}>Progress Hafalan</p>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{irodoriStats.reviewCount}</span> 
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: '0 4px' }}>/</span> 
                    <span style={{ fontSize: '1.2rem' }}>{irodoriStats.total}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', marginBottom: 0 }}>Kosakata telah dikuasai</p>
                </div>
              )}

              <div style={{ width: '100%', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch (Per 50 Kosakata)</span>
                  <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2px' }}>
                    <button onClick={() => setSelectedIrodoriBatches(irodoriBatchOptions)} style={{ background: selectedIrodoriBatches.length === irodoriBatchOptions.length ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: selectedIrodoriBatches.length === irodoriBatchOptions.length ? '#fff' : 'var(--text-muted)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>Semua</button>
                    <button onClick={() => setSelectedIrodoriBatches([])} style={{ background: selectedIrodoriBatches.length === 0 ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: selectedIrodoriBatches.length === 0 ? '#fff' : 'var(--text-muted)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>Reset</button>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))', 
                  gap: '8px', 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  marginTop: '12px',
                  paddingRight: '4px'
                }}>
                  {irodoriBatchOptions.map(bIdx => {
                    const isSelected = selectedIrodoriBatches.includes(bIdx);
                    return (
                      <div 
                        key={bIdx}
                        onClick={() => toggleIrodoriBatch(bIdx)}
                        className={`chapter-chip ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '8px 4px', fontSize: '0.85rem' }}
                      >
                        B-{bIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ width: '100%', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Study Mode</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px', marginBottom: '12px' }}>
                  <button 
                    onClick={() => setIrodoriMode(1)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      background: irodoriMode === 1 ? 'rgba(255,255,255,0.15)' : 'transparent',
                      color: irodoriMode === 1 ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}>
                    Kotoba
                  </button>
                  <button 
                    onClick={() => setIrodoriMode(2)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      background: irodoriMode === 2 ? 'rgba(255,255,255,0.15)' : 'transparent',
                      color: irodoriMode === 2 ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}>
                    Kanji
                  </button>
                  <button 
                    onClick={() => setIrodoriMode(3)}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      background: irodoriMode === 3 ? 'rgba(255,255,255,0.15)' : 'transparent',
                      color: irodoriMode === 3 ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}>
                    Reverse
                  </button>
                </div>

                {/* Tampilkan Bab Switch */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tampilkan Label Bab</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={showChapterBadge} onChange={toggleChapterBadge} style={{ display: 'none' }} />
                    <div style={{
                      width: '36px', height: '20px', background: showChapterBadge ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                      borderRadius: '10px', position: 'relative', transition: 'all 0.3s',
                      boxShadow: showChapterBadge ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                    }}>
                      <div style={{
                        width: '14px', height: '14px', background: '#fff', borderRadius: '50%',
                        position: 'absolute', top: '3px', left: showChapterBadge ? '19px' : '3px', transition: 'all 0.3s'
                      }}></div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ width: '100%', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Jumlah Kartu per Sesi</span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedIrodoriCardsCount === 0 ? 0 : irodoriLimit} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>/ {selectedIrodoriCardsCount}</span></span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max={selectedIrodoriCardsCount || 1} 
                  value={irodoriLimit} 
                  onChange={(e) => setIrodoriLimit(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  disabled={selectedIrodoriCardsCount === 0}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={startIrodoriExtra}
                  className="btn"
                  style={{ 
                    width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 600, 
                    background: 'var(--color-primary)', color: '#ffffff', border: 'none', 
                    borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.1s, opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Mulai Sekarang
                </button>
                
                <button 
                  onClick={handleResetIrodori}
                  style={{ 
                    width: '100%', padding: '12px', fontSize: '0.85rem', fontWeight: 600, 
                    background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', 
                    borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px'}}><path d="M3 2v6h6"></path><path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path></svg>
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}
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
