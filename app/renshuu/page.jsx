'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../src/store/useStore';
import { fsrs } from '../../src/state';
import jftKanjiData from '../../src/data/renshuu/jfta2kanji.json';

export default function RenshuuPage() {
  const router = useRouter();
  const setCustomCards = useStore((state) => state.setCustomCards);
  const setCustomFsrs = useStore((state) => state.setCustomFsrs);
  const setStudyMode = useStore((state) => state.setStudyMode);
  
  const [kanjiLimit, setKanjiLimit] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [jftStats, setJftStats] = useState(null);

  const maxKanji = jftKanjiData ? jftKanjiData.length : 0;

  const startJftKanji = () => {
    if (jftKanjiData && jftKanjiData.length > 0) {
      // Ambil kartu berdasarkan FSRS (yang due / new), lalu limit sesuai slider
      const sortedQueue = fsrs.getSortedQueue(jftKanjiData);
      const queueToStudy = sortedQueue.slice(0, kanjiLimit);
      
      setCustomCards(queueToStudy);
      setCustomFsrs(true); // Gunakan algoritma FSRS
      setStudyMode(2); // Mode 2 = Kanji Mode
      router.push('/study');
    } else {
      alert("Data kanji tidak ditemukan!");
    }
  };

  const handleResetData = () => {
    const ids = jftKanjiData.map(c => c.id);
    fsrs.resetCards(ids);
  };

  return (
    <div id="app">
      {/* Navbar */}
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
        <div className="view active" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Link href="/" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Kembali
            </Link>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 700 }}>Renshuu</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Pilih mode latihan khusus di bawah ini.</p>
          </div>
          
          <div className="bento-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            
            {/* JFT A2 Kanji Card - SMALL */}
            <div className="bento-card" style={{ 
              width: '100%', 
              maxWidth: '320px', 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              alignItems: 'center', 
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', fontWeight: '400', fontFamily: 'var(--font-jp)', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                漢字
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-primary)' }}>JFT A2 Kanji</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Latihan {maxKanji} Kanji khusus.</p>
              </div>

              <button 
                onClick={() => {
                  const stats = fsrs.getStats(jftKanjiData || []);
                  setJftStats(stats);
                  setShowModal(true);
                }}
                className="btn"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  background: 'var(--color-primary)', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  transition: 'transform 0.1s, opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1'; }}
              >
                Mulai Latihan
              </button>
            </div>

          </div>
          
        </div>

        {/* Modal Pengaturan Latihan JFT */}
        {showModal && (
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
          }} onClick={() => setShowModal(false)}>
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              padding: '24px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }} onClick={e => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Pengaturan Latihan</h3>
                <button 
                  onClick={() => setShowModal(false)}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Jumlah Kartu per Sesi</span>
                  <span style={{ color: 'var(--text-primary)' }}>{kanjiLimit}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max={maxKanji} 
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
                  onClick={() => { 
                    handleResetData();
                    setJftStats(fsrs.getStats(jftKanjiData || [])); 
                  }}
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
