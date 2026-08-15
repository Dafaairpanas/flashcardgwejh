'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../src/store/useStore';
import { shuffleCards } from '../../src/data';

export default function KanjiClient({ initialKanjiList }) {
  const [currentLevel, setCurrentLevel] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([5, 4, 3, 2, 1]);
  const [flashcardCount, setFlashcardCount] = useState(20);
  const [modalKanji, setModalKanji] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showReadings, setShowReadings] = useState(true);

  const router = useRouter();
  const setCustomCards = useStore(state => state.setCustomCards);
  const setStudyMode = useStore(state => state.setStudyMode);

  const filteredGrid = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return initialKanjiList.filter(k => {
      if (k.jlpt !== currentLevel) return false;
      if (q) {
        const meanings = (k.meanings || []).join(' ').toLowerCase();
        const onR = (k.on_readings || []).join(' ').toLowerCase();
        const kunR = (k.kun_readings || []).join(' ').toLowerCase();
        const h = (k.heisig_id || k.heisig_en || '').toLowerCase();
        return meanings.includes(q) || onR.includes(q) || kunR.includes(q) || h.includes(q) || k.kanji.includes(q);
      }
      return true;
    });
  }, [initialKanjiList, currentLevel, searchQuery]);

  const availableForFlashcard = useMemo(() => {
    return initialKanjiList.filter(k => selectedLevels.includes(k.jlpt));
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
      if (k.on_readings) readings.push(...k.on_readings);
      if (k.kun_readings) readings.push(...k.kun_readings);

      return {
        id: `kanji_${k.kanji}`,
        kanji: k.kanji,
        meaning: k.heisig_id || k.heisig_en || (k.meanings && k.meanings[0]) || 'Tidak ada arti',
        hiragana: showReadings ? (readings.join('、 ') || 'Tidak ada bacaan') : '',
        chapter: `Kanji N${k.jlpt}`
      };
    });

    setStudyMode(1);
    setCustomCards(cards);
    router.push('/study');
  };

  return (
    <div className="view page-view active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="page-header">
          <h2 className="page-title">Kanji Tunggal</h2>
          <p className="page-subtitle">Jelajahi kanji berdasarkan level JLPT</p>
        </div>
        
        <div className="kanji-controls" style={{ marginBottom: '24px' }}>
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

        <div className="kanji-grid" style={{ flex: 1, overflowY: 'auto', alignContent: 'flex-start' }}>
          {filteredGrid.map(k => (
            <div key={k.kanji} className="kanji-tile" onClick={() => setModalKanji(k)}>
              <div className="kanji-tile-char" style={{ fontFamily: 'var(--font-jp)' }}>{k.kanji}</div>
              <div className="kanji-tile-meaning">{k.heisig_id || k.heisig_en || (k.meanings && k.meanings[0]) || ''}</div>
            </div>
          ))}
        </div>
      </div>

      {modalKanji && (
        <div className="kanji-modal-overlay active" onClick={(e) => { if (e.target.classList.contains('kanji-modal-overlay')) setModalKanji(null); }}>
          <div className="kanji-modal">
            <button className="kanji-modal-close" onClick={() => setModalKanji(null)}>&times;</button>
            <div className="kanji-modal-char" style={{ fontFamily: 'var(--font-jp)' }}>{modalKanji.kanji}</div>
            <div className="kanji-modal-info">
              <div className="km-section">
                <h4>Meanings</h4>
                <p>{(modalKanji.meanings || []).join(', ')}</p>
              </div>
              <div className="km-row">
                <div className="km-section">
                  <h4>On'yomi</h4>
                  <p>{(modalKanji.on_readings || []).join('、 ') || '—'}</p>
                </div>
                <div className="km-section">
                  <h4>Kun'yomi</h4>
                  <p>{(modalKanji.kun_readings || []).join('、 ') || '—'}</p>
                </div>
              </div>
              <div className="km-row">
                <div className="km-section">
                  <h4>JLPT</h4>
                  <p>N{modalKanji.jlpt}</p>
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
