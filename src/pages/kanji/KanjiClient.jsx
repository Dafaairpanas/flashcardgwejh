
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { shuffleCards } from '@/data';

const RENDER_BATCH = 100;

export default function KanjiClient() {
  const [initialKanjiList, setInitialKanjiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentLevel, setCurrentLevel] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([5, 4, 3, 2, 1]);
  const [flashcardCount, setFlashcardCount] = useState(20);
  const [modalKanji, setModalKanji] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showReadings, setShowReadings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 75;

  const router = useNavigate();
  const setCustomCards = useStore(state => state.setCustomCards);
  const setStudyMode = useStore(state => state.setStudyMode);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch('/api/kanji.json')
      .then(res => res.json())
      .then(data => {
        const list = data.cards ? data.cards : Array.isArray(data) ? data : [];
        setInitialKanjiList(list);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch kanji', err);
        setIsLoading(false);
      });
  }, []);

  const filteredGrid = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return initialKanjiList.filter(k => {
      if (q) {
        const meaning = (k.meaning || '').toLowerCase();
        const onR = (k.onyomi || '').toLowerCase();
        const kunR = (k.kunyomi || '').toLowerCase();
        return meaning.includes(q) || onR.includes(q) || kunR.includes(q) || (k.kanji && k.kanji.includes(q));
      }
      return k.level === `N${currentLevel}`;
    });
  }, [initialKanjiList, currentLevel, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredGrid]);

  const totalPages = Math.ceil(filteredGrid.length / ITEMS_PER_PAGE);
  const displayedGrid = filteredGrid.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const availableForFlashcard = useMemo(() => {
    return initialKanjiList.filter(k => {
      if (!k.level) return false;
      const lvlNum = parseInt(k.level.replace('N', ''));
      return selectedLevels.includes(lvlNum);
    });
  }, [initialKanjiList, selectedLevels]);

  const toggleLevel = (lvl) => {
    if (selectedLevels.includes(lvl)) {
      setSelectedLevels(selectedLevels.filter(l => l !== lvl));
    } else {
      setSelectedLevels([...selectedLevels, lvl]);
    }
  };

  const startFlashcard = () => {
    if (availableForFlashcard.length === 0) {
      alert("Pilih minimal 1 level JLPT.");
      return;
    }
    const count = Math.min(flashcardCount, availableForFlashcard.length);
    if (count <= 0) return;

    const shuffled = shuffleCards(availableForFlashcard);
    const selected = shuffled.slice(0, count);

    const cards = selected.map(k => {
      const readings = [];
      if (k.onyomi) readings.push(k.onyomi);
      if (k.kunyomi) readings.push(k.kunyomi);

      return {
        id: `kanji_${k.kanji}`,
        kanji: k.kanji,
        meaning: k.meaning || 'Tidak ada arti',
        hiragana: readings.join('、 ') || 'Tidak ada bacaan',
        hideFuriganaFront: !showReadings,
        chapter: `Kanji ${k.level}`
      };
    });

    setStudyMode(1);
    setCustomCards(cards);
    router('/study');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ marginLeft: '12px' }}>Memuat data kanji...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="view page-view active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="page-header" style={{ flexShrink: 0 }}>
          <h2 className="page-title">Kanji Tunggal</h2>
          <p className="page-subtitle">Jelajahi kanji berdasarkan level JLPT</p>
        </div>
        
        <div className="kanji-controls" style={{ marginBottom: '24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[5, 4, 3, 2, 1].map(lvl => (
                <button 
                  key={lvl}
                  className={`chapter-chip ${currentLevel === lvl ? 'selected' : ''}`}
                  onClick={() => setCurrentLevel(lvl)}
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                >
                  N{lvl}
                </button>
              ))}
            </div>
            <button className="btn" onClick={() => setShowSetupModal(true)} style={{ whiteSpace: 'nowrap', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: 600 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'16px', height:'16px', marginRight:'6px'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="4"></circle></svg>
              Latihan Flashcard
            </button>
          </div>
          
          <div className="dict-search-wrap" style={{marginTop:'16px'}}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="dict-search" 
              placeholder="Cari meaning atau reading..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="dict-count">{filteredGrid.length} kanji</span>
          </div>
        </div>

        <div className="kanji-grid" ref={gridRef} style={{ flex: 1, alignContent: 'flex-start' }}>
          {displayedGrid.map((k, i) => (
            <div key={k.id || `${k.kanji}-${i}`} className="kanji-tile" onClick={() => setModalKanji(k)}>
              <div className="kanji-tile-char" style={{ fontFamily: 'var(--font-jp)' }}>{k.kanji}</div>
              <div className="kanji-tile-meaning">{k.meaning || ''}</div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px', marginBottom: '24px' }}>
            <button 
              className="btn btn-ghost" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ background: 'var(--bg-input)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'16px', height:'16px', marginRight:'6px'}}><polyline points="15 18 9 12 15 6"></polyline></svg>
              Sebelumnya
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Halaman {currentPage} dari {totalPages}
            </span>
            <button 
              className="btn btn-ghost" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ background: 'var(--bg-input)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Selanjutnya
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'16px', height:'16px', marginLeft:'6px'}}><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>

      {modalKanji && (
        <div className="kanji-modal-overlay active" onClick={(e) => { if (e.target.classList.contains('kanji-modal-overlay')) setModalKanji(null); }}>
          <div className="kanji-modal">
            <button className="kanji-modal-close" onClick={() => setModalKanji(null)}>&times;</button>
            <div className="kanji-modal-char" style={{ fontFamily: 'var(--font-jp)' }}>{modalKanji.kanji}</div>
            <div className="kanji-modal-info">
              <div className="km-section">
                <h4>Arti (Meaning)</h4>
                <p>{modalKanji.meaning || '—'}</p>
              </div>
              <div className="km-row">
                <div className="km-section">
                  <h4>On'yomi</h4>
                  <p>{modalKanji.onyomi || '—'}</p>
                </div>
                <div className="km-section">
                  <h4>Kun'yomi</h4>
                  <p>{modalKanji.kunyomi || '—'}</p>
                </div>
              </div>
              <div className="km-row">
                <div className="km-section">
                  <h4>Level</h4>
                  <p>{modalKanji.level || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSetupModal && (
        <div className="kanji-modal-overlay active" onClick={(e) => { if (e.target.classList.contains('kanji-modal-overlay')) setShowSetupModal(false); }}>
          <div className="kanji-modal" style={{ maxWidth: '400px' }}>
            <button className="kanji-modal-close" onClick={() => setShowSetupModal(false)}>&times;</button>
            <h3 style={{fontSize: '1.3rem', color: '#fff', marginBottom: '20px', fontWeight: 700}}>Setup Latihan Kanji</h3>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display:'block', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Pilih Level JLPT:</label>
              <div className="filter-group-wrap">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button 
                    key={lvl}
                    className={`filter-btn-sm ${selectedLevels.includes(lvl) ? 'active' : ''}`}
                    onClick={() => toggleLevel(lvl)}
                    style={{ flex: 'calc(33.333% - 4px)', padding: '10px 0', fontSize: '0.9rem' }}
                  >
                    N{lvl}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <label style={{display:'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                <span>Jumlah Soal</span>
                <span style={{color: '#fff', fontWeight: 600}}>{Math.min(flashcardCount, availableForFlashcard.length)} Kanji</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max={Math.max(1, availableForFlashcard.length)} 
                step="1" 
                value={flashcardCount} 
                onChange={(e) => setFlashcardCount(parseInt(e.target.value))}
                style={{width: '100%', accentColor: '#fff'}} 
              />
            </div>

            <div style={{marginBottom: '24px'}}>
              <label style={{display:'flex', alignItems:'center', gap:'12px', cursor:'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={showReadings} 
                  onChange={(e) => setShowReadings(e.target.checked)} 
                  style={{width:'18px', height:'18px', accentColor: '#fff'}} 
                />
                <span style={{color: 'var(--text-secondary)', fontSize:'0.9rem'}}>Tampilkan Cara Baca (On'yomi / Kun'yomi)</span>
              </label>
            </div>
            
            <button className="btn" onClick={startFlashcard} style={{width: '100%', padding: '14px', fontSize: '1rem', background: '#fff', color: '#000', borderRadius: '14px', fontWeight: 600}}>
              Mulai Flashcard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
