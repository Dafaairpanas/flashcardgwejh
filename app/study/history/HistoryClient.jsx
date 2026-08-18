'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../src/store/useStore';
import { initializeData } from '../../../src/data';
import { fsrs } from '../../../src/state';
import {
  getDifficultCards,
  getMasteredCards,
  removeDifficultCard,
  clearDifficultCards,
  getSessionHistory,
  getAggregateStats,
  getProgressBySource,
} from '../../../src/historyManager';

function ProgressBar({ label, data, gradient }) {
  if (data.total === 0) return null;
  return (
    <div className="history-progress-item" style={{ marginBottom: '10px' }}>
      <div className="history-progress-header">
        <span className="history-progress-name" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
        <span className="history-progress-stat">{data.learned} / {data.total} ({data.percent}%)</span>
      </div>
      <div className="history-progress-track">
        <div className="history-progress-fill" style={{ width: `${data.percent}%`, background: gradient }}></div>
      </div>
    </div>
  );
}

export default function HistoryClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('difficult');
  const [isLoading, setIsLoading] = useState(true);
  const [allCardsData, setAllCardsData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [confirmClear, setConfirmClear] = useState(false);

  const setCustomCards = useStore((state) => state.setCustomCards);
  const setCustomFsrs = useStore((state) => state.setCustomFsrs);
  const setPracticeDifficultIds = useStore((state) => state.setPracticeDifficultIds);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const toggleSound = useStore((state) => state.toggleSound);

  // Load all cards data
  useEffect(() => {
    fetch('/api/all-cards')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setAllCardsData(data); // Store the full cache object for progress tracking
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Build card lookup map
  const cardMap = useMemo(() => {
    const map = {};
    if (!allCardsData || Array.isArray(allCardsData)) return map;
    
    for (const source of Object.values(allCardsData)) {
      if (Array.isArray(source)) {
        for (const card of source) {
          map[card.id] = card;
        }
      }
    }
    return map;
  }, [allCardsData]);

  // History data (re-read on refreshKey change)
  const difficultCards = useMemo(() => getDifficultCards(), [refreshKey, isLoading]);
  const masteredCards = useMemo(() => getMasteredCards(), [refreshKey, isLoading]);
  const sessionHistory = useMemo(() => getSessionHistory(14), [refreshKey, isLoading]);
  
  // Custom aggStats with unique cards
  const aggStats = useMemo(() => {
    const stats = getAggregateStats();
    const latestFsrsStates = fsrs._load();
    const uniqueCardsCount = Object.keys(latestFsrsStates).length;
    return { ...stats, uniqueCardsCount };
  }, [refreshKey, isLoading]);

  const progress = useMemo(() => {
    if (!allCardsData || Object.keys(allCardsData).length === 0) return { minna: { total: 0, learned: 0, percent: 0 }, irodori: { total: 0, learned: 0, percent: 0 } };
    
    // Force load from localStorage to ensure we have the absolute latest data,
    // bypassing any module caching or hydration staleness issues.
    const latestFsrsStates = fsrs._load();
    return getProgressBySource(latestFsrsStates, allCardsData);
  }, [allCardsData, refreshKey, isLoading]);

  // Difficult cards with slider limit
  const displayedDifficultCards = useMemo(() => {
    return difficultCards.slice(0, sliderValue);
  }, [difficultCards, sliderValue]);

  const handleRemoveDifficult = useCallback((cardId) => {
    removeDifficultCard(cardId);
    setRefreshKey(k => k + 1);
  }, []);

  const handleClearAll = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearDifficultCards();
    setConfirmClear(false);
    setRefreshKey(k => k + 1);
  }, [confirmClear]);

  const handlePracticeFromDifficult = useCallback(() => {
    const cards = displayedDifficultCards
      .map(d => cardMap[d.cardId])
      .filter(Boolean);
    if (cards.length === 0) return;
    setCustomCards(cards);
    setCustomFsrs(false); // false = "Review Lagi" mode (3x copies + shuffle)
    setPracticeDifficultIds(cards.map(c => c.id)); // track for auto-removal on success
    router.push('/study');
  }, [displayedDifficultCards, cardMap, setCustomCards, setCustomFsrs, setPracticeDifficultIds, router]);

  // Chart calculations
  const chartMax = useMemo(() => {
    const max = Math.max(...sessionHistory.map(s => s.cardsPlayed), 1);
    return Math.ceil(max / 10) * 10 || 10;
  }, [sessionHistory]);

  const durationMax = useMemo(() => {
    const max = Math.max(...sessionHistory.map(s => Math.round(s.durationSec / 60)), 1);
    return Math.ceil(max / 5) * 5 || 5;
  }, [sessionHistory]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0b', color: 'var(--text-muted)' }}>
        <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ marginLeft: '12px', fontSize: '1.1rem' }}>Memuat Riwayat...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div id="app-container">
      {/* Navbar */}
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
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/study/setup')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px', marginRight: '4px'}}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="history-view">
          {/* Header */}
          <div className="history-header">
            <h2>Riwayat Belajar</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Lacak progress dan identifikasi kartu yang perlu dipelajari lagi</p>
          </div>

          {/* Aggregate Stats Row */}
          <div className="history-agg-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
            <div className="history-agg-item">
              <div className="history-agg-value">{aggStats.totalSessions}</div>
              <div className="history-agg-label">Total Sesi</div>
            </div>
            <div className="history-agg-item">
              <div className="history-agg-value">{aggStats.uniqueCardsCount}</div>
              <div className="history-agg-label">Total Kartu</div>
            </div>
            <div className="history-agg-item">
              <div className="history-agg-value">{aggStats.totalCards}</div>
              <div className="history-agg-label">Total Review</div>
            </div>
            <div className="history-agg-item">
              <div className="history-agg-value">{aggStats.totalMinutes}m</div>
              <div className="history-agg-label">Total Waktu</div>
            </div>
            <div className="history-agg-item">
              <div className="history-agg-value">{aggStats.avgAccuracy}%</div>
              <div className="history-agg-label">Akurasi Rata²</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="history-tabs">
            <button className={`history-tab ${activeTab === 'difficult' ? 'active' : ''}`} onClick={() => setActiveTab('difficult')}>
              <span className="history-tab-icon">⚠</span>
              Sulit
              {difficultCards.length > 0 && <span className="history-tab-badge">{difficultCards.length}</span>}
            </button>
            <button className={`history-tab ${activeTab === 'mastered' ? 'active' : ''}`} onClick={() => setActiveTab('mastered')}>
              <span className="history-tab-icon">✓</span>
              Dikuasai
              {masteredCards.length > 0 && <span className="history-tab-badge history-tab-badge-green">{masteredCards.length}</span>}
            </button>
            <button className={`history-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
              <span className="history-tab-icon">📊</span>
              Statistik
            </button>
          </div>

          {/* Tab Content */}
          <div className="history-content">
            {/* ── Difficult Cards Tab ── */}
            {activeTab === 'difficult' && (
              <div className="history-tab-panel" key="difficult">
                {difficultCards.length === 0 ? (
                  <div className="history-empty">
                    <div className="history-empty-icon">🎉</div>
                    <p>Belum ada kartu sulit!</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kartu yang kamu jawab Again atau Hard akan muncul di sini</p>
                  </div>
                ) : (
                  <>
                    {/* Toolbar */}
                    <div className="history-toolbar">
                      <div className="history-toolbar-left">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Menampilkan {displayedDifficultCards.length} dari {difficultCards.length} kartu
                        </span>
                        <div className="history-slider-row">
                          <input
                            type="range"
                            min="5"
                            max={Math.max(difficultCards.length, 5)}
                            value={Math.min(sliderValue, difficultCards.length)}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="history-slider"
                          />
                          <span className="history-slider-val">{Math.min(sliderValue, difficultCards.length)}</span>
                        </div>
                      </div>
                      <div className="history-toolbar-right">
                        <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ color: confirmClear ? '#ef4444' : 'var(--text-secondary)' }}>
                          {confirmClear ? 'Yakin hapus semua?' : 'Hapus Semua'}
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handlePracticeFromDifficult} disabled={displayedDifficultCards.length === 0}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'14px', height:'14px', marginRight:'4px'}}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                          Latihan ({displayedDifficultCards.length})
                        </button>
                      </div>
                    </div>

                    {/* Card List */}
                    <div className="history-card-list">
                      {displayedDifficultCards.map((d) => {
                        const card = cardMap[d.cardId];
                        if (!card) return null;
                        return (
                          <div key={d.cardId} className="history-card-item">
                            <div className="history-card-info">
                              {card.hiragana !== card.kanji && (
                                <div className="history-card-furigana">{card.hiragana}</div>
                              )}
                              <div className="history-card-kanji">{card.kanji}</div>
                              <div className="history-card-meaning">{card.meaning}</div>
                            </div>
                            <div className="history-card-meta">
                              <div className="history-fail-badge">
                                Salah {d.failCount}x
                              </div>
                              <button className="history-card-remove" onClick={() => handleRemoveDifficult(d.cardId)} title="Hapus dari daftar sulit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'16px', height:'16px'}}>
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Mastered Cards Tab ── */}
            {activeTab === 'mastered' && (
              <div className="history-tab-panel" key="mastered">
                {masteredCards.length === 0 ? (
                  <div className="history-empty">
                    <div className="history-empty-icon">📚</div>
                    <p>Belum ada kartu dikuasai!</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kartu yang kamu jawab Easy akan muncul di sini</p>
                  </div>
                ) : (
                  <div className="history-card-list">
                    {masteredCards.map((m) => {
                      const card = cardMap[m.cardId];
                      if (!card) return null;
                      return (
                        <div key={m.cardId} className="history-card-item history-card-mastered">
                          <div className="history-card-info">
                            {card.hiragana !== card.kanji && (
                              <div className="history-card-furigana">{card.hiragana}</div>
                            )}
                            <div className="history-card-kanji">{card.kanji}</div>
                            <div className="history-card-meaning">{card.meaning}</div>
                          </div>
                          <div className="history-card-meta">
                            <div className="history-mastered-badge">
                              ✓ Dikuasai
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(m.masteredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Stats Tab ── */}
            {activeTab === 'stats' && (
              <div className="history-tab-panel" key="stats">
                {/* Daily Activity Chart */}
                <div className="history-chart-section">
                  <h3 className="history-section-title">Aktivitas 14 Hari Terakhir</h3>
                  
                  {/* Cards Bar Chart */}
                  <div className="history-chart-label">Kartu Dipelajari</div>
                  <div className="history-chart">
                    <div className="history-chart-y-axis">
                      <span>{chartMax}</span>
                      <span>{Math.round(chartMax / 2)}</span>
                      <span>0</span>
                    </div>
                    <div className="history-chart-bars">
                      {sessionHistory.map((s, i) => (
                        <div key={i} className="history-bar-col" title={`${s.dayLabel}: ${s.cardsPlayed} kartu`}>
                          <div className="history-bar-fill" style={{
                            height: `${Math.max((s.cardsPlayed / chartMax) * 100, s.cardsPlayed > 0 ? 4 : 0)}%`
                          }}>
                            {s.cardsPlayed > 0 && <span className="history-bar-value">{s.cardsPlayed}</span>}
                          </div>
                          <div className="history-bar-label">{s.dayLabel.split(' ')[1] || s.dayLabel}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration Chart */}
                  <div className="history-chart-label" style={{ marginTop: '32px' }}>Durasi Belajar (menit)</div>
                  <div className="history-chart">
                    <div className="history-chart-y-axis">
                      <span>{durationMax}</span>
                      <span>{Math.round(durationMax / 2)}</span>
                      <span>0</span>
                    </div>
                    <div className="history-chart-bars">
                      {sessionHistory.map((s, i) => {
                        const mins = Math.round(s.durationSec / 60);
                        return (
                          <div key={i} className="history-bar-col" title={`${s.dayLabel}: ${mins} menit`}>
                            <div className="history-bar-fill history-bar-fill-duration" style={{
                              height: `${Math.max((mins / durationMax) * 100, mins > 0 ? 4 : 0)}%`
                            }}>
                              {mins > 0 && <span className="history-bar-value">{mins}</span>}
                            </div>
                            <div className="history-bar-label">{s.dayLabel.split(' ')[1] || s.dayLabel}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Progress by Source */}
                <div className="history-chart-section" style={{ marginTop: '32px' }}>
                  <h3 className="history-section-title">Progress per Sumber</h3>
                  
                  {/* ── Minna ── */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-violet)', display: 'inline-block' }}></span>
                      Minna no Nihongo
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        ({progress.minna.all.learned}/{progress.minna.all.total})
                      </span>
                    </div>
                    
                    <ProgressBar label="Wajib" data={progress.minna.wajib} gradient="linear-gradient(90deg, #a78bfa, #c4b5fd)" />
                    <ProgressBar label="Extra" data={progress.minna.extra} gradient="linear-gradient(90deg, #fda4af, #fecdd3)" />
                    {progress.minna.trash.total > 0 && (
                      <ProgressBar label="Trash" data={progress.minna.trash} gradient="linear-gradient(90deg, #6b7280, #9ca3af)" />
                    )}
                    <ProgressBar label="Kanji" data={progress.minna.kanji} gradient="linear-gradient(90deg, #fcd34d, #fde68a)" />
                  </div>

                  {/* ── Irodori ── */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-cyan)', display: 'inline-block' }}></span>
                      Irodori
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        ({progress.irodori?.all?.learned || 0}/{progress.irodori?.all?.total || 0})
                      </span>
                    </div>

                    <ProgressBar label="Wajib" data={progress.irodori?.wajib || {total:0}} gradient="linear-gradient(90deg, #7dd3fc, #bae6fd)" />
                    <ProgressBar label="Extra" data={progress.irodori?.extra || {total:0}} gradient="linear-gradient(90deg, #6ee7b7, #a7f3d0)" />
                    {progress.irodori?.trash?.total > 0 && (
                      <ProgressBar label="Trash" data={progress.irodori.trash} gradient="linear-gradient(90deg, #6b7280, #9ca3af)" />
                    )}
                    <ProgressBar label="Kanji" data={progress.irodori?.kanji || {total:0}} gradient="linear-gradient(90deg, #fcd34d, #fde68a)" />
                  </div>

                  {/* ── Kanji ── */}
                  {progress.kanji?.all?.total > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-amber)', display: 'inline-block' }}></span>
                        Kanji Deck
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({progress.kanji.all.learned}/{progress.kanji.all.total})
                        </span>
                      </div>
                      <ProgressBar label="Semua Level" data={progress.kanji.all} gradient="linear-gradient(90deg, #f59e0b, #fcd34d)" />
                    </div>
                  )}

                  {/* ── Bunpou ── */}
                  {progress.bunpou?.all?.total > 0 && (
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
                        Tata Bahasa (Bunpou)
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          ({progress.bunpou.all.learned}/{progress.bunpou.all.total})
                        </span>
                      </div>
                      <ProgressBar label="Semua Bab" data={progress.bunpou.all} gradient="linear-gradient(90deg, #10b981, #6ee7b7)" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
