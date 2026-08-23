
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function KotobaClient() {
  const [initialCards, setInitialCards] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentBab, setCurrentBab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('minna');
  const [displayMode, setDisplayMode] = useState('all'); // 'all', 'nihongo', 'arti'
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  const listRef = useRef(null);

  useEffect(() => {
    fetch('/api/kotoba.json')
      .then(res => res.json())
      .then(data => {
        if (data.cards) setInitialCards(data.cards);
        if (data.chapters) setChapters(data.chapters);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch kotoba', err);
        setIsLoading(false);
      });
  }, []);

  const chapterDisplayName = (chapter) => {
    if (!chapter) return '';
    if (chapter.startsWith('ir') || chapter.startsWith('Iro')) {
      const num = chapter.replace(/^ir/i, '').replace(/^Iro/i, '');
      return `Irodori ${num}`;
    }
    const num = chapter.replace('Bab', '');
    return `Bab ${num}`;
  };

  const filteredChapters = useMemo(() => {
    return chapters.filter(ch => {
      if (sourceFilter === 'minna') return !ch.startsWith('ir') && !ch.startsWith('Iro');
      if (sourceFilter === 'irodori') return ch.startsWith('ir') || ch.startsWith('Iro');
      return true;
    });
  }, [chapters, sourceFilter]);

  const babCards = useMemo(() => {
    if (!currentBab) return [];
    let cards = initialCards.filter(c => c.chapter === currentBab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/[\s~〜\-]/g, '')
                      .replace(/si/g, 'shi')
                      .replace(/ti/g, 'chi')
                      .replace(/tu/g, 'tsu')
                      .replace(/hu/g, 'fu')
                      .replace(/zi/g, 'ji')
                      .replace(/di/g, 'ji')
                      .replace(/du/g, 'zu');

      cards = cards.filter(c => c._searchString.includes(cleanQ) || c.meaning.toLowerCase().includes(q));
    }
    return cards;
  }, [initialCards, currentBab, searchQuery]);

  const globalFilteredCards = useMemo(() => {
    const query = globalSearchQuery.trim().toLowerCase();
    
    let cards = initialCards.filter(card => {
      if (sourceFilter === 'minna') return !card.chapter.startsWith('ir') && !card.chapter.startsWith('Iro');
      if (sourceFilter === 'irodori') return card.chapter.startsWith('ir') || card.chapter.startsWith('Iro');
      return true;
    });

    if (!query) return [];
    
    const cleanQ = query.replace(/[\s~〜\-]/g, '')
                        .replace(/si/g, 'shi')
                        .replace(/ti/g, 'chi')
                        .replace(/tu/g, 'tsu')
                        .replace(/hu/g, 'fu')
                        .replace(/zi/g, 'ji')
                        .replace(/di/g, 'ji')
                        .replace(/du/g, 'zu');

    return cards.filter(card => card._searchString.includes(cleanQ) || card.meaning.toLowerCase().includes(query));
  }, [initialCards, globalSearchQuery, sourceFilter]);

  // Virtualizer for the global search list
  const virtualizer = useVirtualizer({
    count: globalFilteredCards.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 85, // estimated height of dict-row
    overscan: 5,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ marginLeft: '12px' }}>Memuat data...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="view page-view active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {!currentBab ? (
          <div id="kotoba-select" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', flexShrink: 0 }}>
              <div>
                <h2 className="page-title">List Kotoba</h2>
                <p className="page-subtitle">Pilih bab untuk melihat daftar kosakata</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`chapter-chip ${sourceFilter === 'minna' ? 'selected' : ''}`}
                  onClick={() => setSourceFilter('minna')}
                  style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  Minna
                </button>
                <button 
                  className={`chapter-chip ${sourceFilter === 'irodori' ? 'selected' : ''}`}
                  onClick={() => setSourceFilter('irodori')}
                  style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  Irodori
                </button>
              </div>
            </div>

            <div className="dict-search-wrap" style={{ marginBottom: '24px', position: 'relative', flexShrink: 0 }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="dict-search" 
                placeholder="Cari kata (romaji, kanji, arti)..." 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                style={{ color: '#ffffff', paddingRight: '40px', paddingLeft: '40px' }}
              />
              {globalSearchQuery && (
                <button 
                  onClick={() => setGlobalSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>

            {globalSearchQuery ? (
              <div className="dict-list" ref={listRef} style={{ flex: 1, paddingRight: '8px', overflowY: 'auto' }}>
                <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                  {virtualizer.getVirtualItems().map(virtualItem => {
                    const card = globalFilteredCards[virtualItem.index];
                    return (
                      <div 
                        key={card.id || `${card.chapter}-${card.kanji}-${card.hiragana}`} 
                        className="dict-row"
                        data-index={virtualItem.index}
                        ref={virtualizer.measureElement}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <div className="dict-kanji">{card.kanji}</div>
                        <div className="dict-reading">
                          <span className="dict-hiragana">{card.hiragana}</span>
                          <span className="dict-romaji">{card.romaji}</span>
                        </div>
                        <div className="dict-meaning">{card.meaning}</div>
                        <div className="dict-meta">
                          <span className="dict-badge dict-badge-bab">{chapterDisplayName(card.chapter)}</span>
                          {card.level && card.level !== '-' && <span className="dict-badge dict-badge-jlpt">{card.level.toUpperCase()}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {globalFilteredCards.length === 0 && (
                  <div style={{padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)'}}>
                    <p>Tidak ada kosakata yang cocok dengan "{globalSearchQuery}" di {sourceFilter === 'minna' ? 'Minna no Nihongo' : 'Irodori'}</p>
                  </div>
                )}
              </div>
            ) : sourceFilter === 'irodori' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', paddingBottom: '20px', overflowY: 'auto' }}>
                {['A1', 'A2.1', 'A2.2'].map(groupName => {
                  const chaptersInGroup = filteredChapters.filter(ch => ch.startsWith(`ir${groupName}`));
                  if (chaptersInGroup.length === 0) return null;
                  
                  return (
                    <div key={groupName}>
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.2rem', paddingLeft: '12px', borderLeft: '4px solid #fff' }}>
                        Irodori {groupName}
                      </h3>
                      <div className="quiz-bab-grid">
                        {chaptersInGroup.map(ch => {
                          const numStr = ch.split('-')[1] || ch; 
                          const num = parseInt(numStr, 10);
                          return (
                            <button 
                              key={ch} 
                              className="quiz-bab-btn"
                              onClick={() => setCurrentBab(ch)}
                            >
                              Bab {num || numStr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="quiz-bab-grid" style={{ paddingBottom: '20px', overflowY: 'auto' }}>
                {filteredChapters.map(ch => (
                  <button 
                    key={ch} 
                    className="quiz-bab-btn"
                    onClick={() => setCurrentBab(ch)}
                  >
                    {chapterDisplayName(ch)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div id="kotoba-table-area" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            <div className="kotoba-table-header">
              <button className="btn btn-ghost btn-sm" id="kotoba-back-btn" onClick={() => setCurrentBab(null)}>
                ← Pilih Bab
              </button>
              <div className="kotoba-title-wrap">
                <h2 className="kotoba-bab-title" id="kotoba-bab-title">{chapterDisplayName(currentBab).toUpperCase()}</h2>
                <span className="kotoba-badge-count" id="kotoba-count">{babCards.length} kata</span>
              </div>
              <select 
                className="dict-select" 
                id="kotoba-bab-select" 
                style={{ maxWidth: '110px', padding: '6px 10px', fontSize: '0.85rem' }}
                value={currentBab || ''}
                onChange={(e) => setCurrentBab(e.target.value)}
              >
                {filteredChapters.map(ch => (
                  <option key={ch} value={ch}>{chapterDisplayName(ch)}</option>
                ))}
              </select>
            </div>

            {/* Search in Bab */}
            <div className="dict-search-wrap" style={{ marginBottom: '12px' }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="dict-search" 
                id="kotoba-search" 
                placeholder="Cari kana, kanji, atau arti..." 
                autoComplete="off" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: '#ffffff' }}
              />
            </div>

            {/* View Controls Floating Action Button */}
            <div className="kotoba-view-fab-container">
              <button 
                className="btn btn-primary btn-icon kotoba-view-fab" 
                id="kotoba-view-fab" 
                title="Ubah Tampilan" 
                onClick={() => setShowFabMenu(!showFabMenu)}
                style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'24px',height:'24px'}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              
              <div 
                className="kotoba-view-menu" 
                id="kotoba-view-menu" 
                style={{ 
                  position: 'fixed', bottom: '90px', right: '24px', 
                  background: 'rgba(20, 20, 22, 0.9)', backdropFilter: 'blur(10px)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', 
                  padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 999, width: '180px',
                  opacity: showFabMenu ? 1 : 0, pointerEvents: showFabMenu ? 'auto' : 'none', 
                  transform: showFabMenu ? 'translateY(0)' : 'translateY(10px)', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <button 
                  className={`btn btn-ghost btn-sm kotoba-view-item ${displayMode === 'all' ? 'active' : ''}`}
                  id="btn-view-all" 
                  onClick={() => { setDisplayMode('all'); setShowFabMenu(false); }}
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px',height:'16px',marginRight:'8px'}}><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  Tampil Semua
                </button>
                <button 
                  className={`btn btn-ghost btn-sm kotoba-view-item ${displayMode === 'nihongo' ? 'active' : ''}`}
                  id="btn-view-jp" 
                  onClick={() => { setDisplayMode('nihongo'); setShowFabMenu(false); }}
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px',height:'16px',marginRight:'8px'}}><path d="M4 6h16M4 12h8M4 18h16"></path></svg>
                  Hiragana, Kanji
                </button>
                <button 
                  className={`btn btn-ghost btn-sm kotoba-view-item ${displayMode === 'arti' ? 'active' : ''}`}
                  id="btn-view-id" 
                  onClick={() => { setDisplayMode('arti'); setShowFabMenu(false); }}
                  style={{ justifyContent: 'flex-start', border: 'none', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px',height:'16px',marginRight:'8px'}}><path d="M4 6h16M12 12h8M4 18h16"></path></svg>
                  Arti
                </button>
              </div>
            </div>

            {/* Responsive Zoomable Table */}
            <div className="kotoba-table-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="kotoba-table">
                <thead>
                  <tr>
                    {displayMode !== 'arti' && <th className="col-kana">日本語 <span className="th-sub">Kana</span></th>}
                    {displayMode !== 'arti' && <th className="col-kanji">漢字 <span className="th-sub">Kanji</span></th>}
                    {displayMode !== 'nihongo' && <th className="col-meaning">インドネシア語 <span className="th-sub">Arti</span></th>}
                  </tr>
                </thead>
                <tbody id="kotoba-tbody">
                  {babCards.map(card => (
                    <tr key={card.id || `${card.chapter}-${card.kanji}-${card.hiragana}`}>
                      {displayMode !== 'arti' && (
                        <td className="col-kana" style={{ color: 'var(--accent-cyan, #7dd3fc)', fontWeight: 500 }}>
                          {card.hiragana}
                        </td>
                      )}
                      {displayMode !== 'arti' && (
                        <td className="col-kanji" style={{ color: 'var(--accent-amber, #fcd34d)', fontSize: '1.1em', fontWeight: 500 }}>
                          {card.kanji}
                        </td>
                      )}
                      {displayMode !== 'nihongo' && (
                        <td className="col-meaning" style={{ color: 'var(--accent-emerald, #6ee7b7)' }}>
                          {card.meaning}
                          {card.isExtra && <span className="dict-badge dict-badge-extra" style={{ marginLeft: '8px' }}>Extra</span>}
                        </td>
                      )}
                    </tr>
                  ))}
                  {babCards.length === 0 && (
                    <tr>
                      <td colSpan={displayMode === 'all' ? 3 : (displayMode === 'arti' ? 1 : 2)} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Tidak ada kosakata ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
