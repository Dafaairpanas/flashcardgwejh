'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../src/store/useStore';
import { fsrs } from '../../src/state';

function CompleteContent() {
  const router = useRouter();
  
  const sessionResult = useStore((state) => state.sessionResult) || {
    reviewed: 0,
    duration: 0,
    accuracy: 0,
    weakCards: []
  };
  
  const setCustomCards = useStore((state) => state.setCustomCards);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const toggleSound = useStore((state) => state.toggleSound);

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  const handleReviewLagi = () => {
    if (sessionResult.weakCards.length > 0) {
      setCustomCards(sessionResult.weakCards.map(w => w.card));
      router.push('/study');
    }
  };

  const handleReset = () => {
    fsrs.reset();
    window.location.href = '/';
  };

  return (
    <div id="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center', color: '#fff' }}>Session Completed</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center', fontSize: '1rem' }}>All scheduled cards have been reviewed successfully.</p>
        
        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{sessionResult.reviewed}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>REVIEWED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{formatDuration(sessionResult.duration)}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DURATION</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{sessionResult.accuracy}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ACCURACY</div>
          </div>
        </div>

        {sessionResult.weakCards.length > 0 && (
          <div style={{ width: '100%', maxWidth: '500px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', margin: 0, color: '#fff' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Perlu Dipelajari Lagi
              </h3>
              <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sessionResult.weakCards.length} kartu</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
              {sessionResult.weakCards.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.card.hiragana !== item.card.kanji ? item.card.hiragana : ''}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{item.card.kanji}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.card.meaning}</div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    Salah {item.fails}x
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '500px' }}>
          <button 
            onClick={handleReviewLagi}
            disabled={sessionResult.weakCards.length === 0}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '1rem', fontWeight: 600, cursor: sessionResult.weakCards.length > 0 ? 'pointer' : 'not-allowed', opacity: sessionResult.weakCards.length > 0 ? 1 : 0.4, transition: 'all 0.2s' }}
          >
            Review Lagi
          </button>
          <button 
            onClick={() => router.push('/')}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(167, 139, 250, 0.25)', transition: 'all 0.2s' }}
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CompleteView() {
  return (
    <Suspense fallback={<div style={{color: 'white', padding: '20px', textAlign: 'center'}}>Loading...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
