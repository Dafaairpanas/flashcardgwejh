
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getCardsByChapters } from '@/data';
import { fsrs } from '@/state';
import { recordCardResponse } from '@/historyManager';

import { useTheme } from '../ThemeProvider';

export default function StudyView() {
  const router = useNavigate();
  
  const [currentCard, setCurrentCard] = useState(null);
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({ newCount: 0, learningCount: 0, dueCount: 0 });
  const [showHint, setShowHint] = useState(false);
  const [animState, setAnimState] = useState(null); // 'wrong' or 'correct'
  
  const { setOverrideTheme, generateRandomTheme } = useTheme();
  const cardsUntilThemeChange = useRef(Math.floor(Math.random() * 5) + 8); // 8-12
  
  const customCards = useStore((state) => state.customCards);
  const setCustomCards = useStore((state) => state.setCustomCards);
  const customFsrs = useStore((state) => state.customFsrs);
  const setCustomFsrs = useStore((state) => state.setCustomFsrs);
  const selectedChapters = useStore((state) => state.selectedChapters);
  const selectedGrades = useStore((state) => state.selectedGrades);
  const jlptFilter = useStore((state) => state.jlptFilter);
  const studyMode = useStore((state) => state.studyMode);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const showChapterBadge = useStore((state) => state.showChapterBadge);
  const toggleSound = useStore((state) => state.toggleSound);
  const setSessionResult = useStore((state) => state.setSessionResult);
  
  const sessionStartTimeRef = useRef(Date.now());
  const weakCardsRef = useRef(new Map());
  const streakRef = useRef(0);
  const totalCorrectRef = useRef(0);
  const totalReviewedRef = useRef(0);
  const isInitialized = useRef(false);
  const isProcessingRef = useRef(false);
  const queueRef = useRef([]);

  // Keep queueRef in sync with queue state
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const speak = useCallback((text) => {
    if (!soundEnabled) return;
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'ja-JP';
    speechSynthesis.speak(ut);
  }, [soundEnabled]);

  useEffect(() => {
    if (isInitialized.current) return;
    
    let cards = [];
    let isReviewLagi = false;
    if (customCards && customCards.length > 0) {
      cards = [...customCards]; // Copy array
      setCustomCards([]);
      if (!customFsrs) {
        isReviewLagi = true;
      }
      setCustomFsrs(false); // Reset for next time
    } else {
      cards = getCardsByChapters(selectedChapters, selectedGrades, jlptFilter, studyMode);
    }
    
    isInitialized.current = true;
    
    if (cards.length === 0) {
      alert('Tidak ada kartu! Kembali ke menu.');
      router('/study/setup');
      return;
    }
    
    let studyQueue = [];
    if (isReviewLagi) {
      const multiplied = [];
      for (let i = 0; i < 3; i++) {
        multiplied.push(...cards);
      }
      // Fisher-Yates shuffle
      for (let i = multiplied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [multiplied[i], multiplied[j]] = [multiplied[j], multiplied[i]];
      }
      studyQueue = multiplied;
    } else {
      studyQueue = fsrs.getSortedQueue(cards);
    }

    if (studyQueue.length === 0) {
      alert('Semua kartu untuk hari ini sudah direview!');
      router('/study/setup');
      return;
    }
    
    setQueue(studyQueue);
    setCurrentCard(studyQueue[0]);
    setStats(fsrs.getStats(cards));
    sessionStartTimeRef.current = Date.now();

    // Play audio for the first card
    if (soundEnabled && studyMode !== 2 && studyMode !== 3 && studyQueue[0]) {
      setTimeout(() => speak(studyQueue[0].hiragana), 300);
    }
  }, [selectedChapters, selectedGrades, jlptFilter, studyMode, customCards, setCustomCards, router, soundEnabled, speak]);

  const handleRating = useCallback((rating) => {
    if (!currentCard || animState || isProcessingRef.current) return;
    isProcessingRef.current = true; // Synchronous guard against rapid key presses

    if (rating <= 2) {
      setAnimState('wrong');
    } else {
      setAnimState('correct');
    }

    const animDuration = rating <= 2 ? 600 : 200;

    setTimeout(() => {
      setAnimState(null);
      
      if (rating === 1 || rating === 2) { // Again or Hard
        if (rating === 1) streakRef.current = 0;
        const fails = weakCardsRef.current.get(currentCard.id)?.fails || 0;
        weakCardsRef.current.set(currentCard.id, { card: currentCard, fails: fails + 1 });
      } else {
        streakRef.current += 1;
        totalCorrectRef.current += 1;
      }
      totalReviewedRef.current += 1;

      fsrs.reviewCard(currentCard.id, rating);
      recordCardResponse(currentCard.id, rating);
      
      // Use queueRef for fresh data (avoids stale closure in setTimeout)
      const currentQueue = queueRef.current;
      let newQueue = currentQueue.slice(1).filter(c => c.id !== currentCard.id);
      
      let copiesToAdd = 0;
      if (rating === 1) copiesToAdd = 3;
      else if (rating === 2) copiesToAdd = 2;
      else if (rating === 3) copiesToAdd = 0; // Good tidak perlu diulang di sesi ini

      for (let i = 0; i < copiesToAdd; i++) {
        if (newQueue.length === 0) {
          newQueue.push(currentCard);
        } else {
          const minIdx = Math.min(1, newQueue.length);
          const randomIdx = Math.floor(Math.random() * (newQueue.length - minIdx + 1)) + minIdx;
          newQueue.splice(randomIdx, 0, currentCard);
        }
      }

      if (newQueue.length === 0) {
        // Session Complete
        const durationSec = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
        const accuracy = totalReviewedRef.current > 0 ? Math.round((totalCorrectRef.current / totalReviewedRef.current) * 100) : 0;
        
        setSessionResult({
          reviewed: totalReviewedRef.current,
          duration: durationSec,
          accuracy: accuracy,
          weakCards: Array.from(weakCardsRef.current.values())
        });

        router('/complete');
      } else {
        setQueue(newQueue);
        setCurrentCard(newQueue[0]);
        setShowHint(false);
        
        // Theme logic
        cardsUntilThemeChange.current -= 1;
        if (cardsUntilThemeChange.current <= 0) {
          setOverrideTheme(generateRandomTheme());
          cardsUntilThemeChange.current = Math.floor(Math.random() * 5) + 8; // Reset to 8-12
        }

        // Play audio automatically if mode is not 2 (Kanji) and not 3 (Reverse)
        if (soundEnabled && studyMode !== 2 && studyMode !== 3 && newQueue[0]) {
          setTimeout(() => speak(newQueue[0].hiragana), 100);
        }
      }
      isProcessingRef.current = false; // Release guard
    }, animDuration);
  }, [currentCard, router, soundEnabled, speak, studyMode, animState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!showHint) setShowHint(true);
      } else if (showHint) {
        if (e.key === '1') handleRating(1);
        if (e.key === '2') handleRating(2);
        if (e.key === '3') handleRating(3);
        if (e.key === '4') handleRating(4);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHint, handleRating]);

  useEffect(() => {
    if (showHint) {
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
      // Play audio on flip for Kanji, Reverse, and Audio Mode
      if (soundEnabled && (studyMode === 2 || studyMode === 3 || studyMode === 4) && currentCard) {
        speak(currentCard.hiragana);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showHint, soundEnabled, studyMode, currentCard, speak]);

  useEffect(() => {
    // Override the global background theme when studying
    setOverrideTheme(generateRandomTheme());
    
    return () => {
      // Restore global rotation when exiting study mode
      setOverrideTheme(null);
    };
  }, [setOverrideTheme, generateRandomTheme]);

  // Compute dynamic interval texts based on current card's FSRS state
  const intervalTexts = useMemo(() => {
    if (!currentCard) return { 1: '<1m', 2: '5m', 3: '10m', 4: '1d' };
    return {
      1: fsrs.getIntervalText(currentCard.id, 1),
      2: fsrs.getIntervalText(currentCard.id, 2),
      3: fsrs.getIntervalText(currentCard.id, 3),
      4: fsrs.getIntervalText(currentCard.id, 4),
    };
  }, [currentCard]);

  if (!currentCard) return <div style={{color:'white', padding: '20px'}}>Memuat Flashcard...</div>;

  return (
    <div id="app">
      <nav className="navbar" id="navbar">
        <a className="navbar-brand" onClick={() => router('/')}>
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
          <button className="btn btn-ghost btn-sm" onClick={() => {
            fsrs.reset();
            window.location.href = '/study/setup';
          }} title="Reset Progress">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '14px', height: '14px', marginRight: '4px'}}>
              <path d="M3 2v6h6"></path>
              <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
            </svg>
            Reset Data
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="view study-view active" id="study-view">
          
          {/* Progress */}
          <div className="study-progress-bar">
            <div className="progress-track">
              <div className="progress-fill" id="progress-fill" style={{ width: `${(totalReviewedRef.current / (totalReviewedRef.current + queue.length)) * 100}%` }}></div>
            </div>
            <span className="progress-text" id="progress-text">{totalReviewedRef.current + 1}/{totalReviewedRef.current + queue.length}</span>
          </div>

          {/* Info Tags */}
          <div className="study-info-row">
            <div className="study-info-tag">
              <span className="dot dot-new"></span>
              <span>New: <strong id="study-new">{stats.newCount}</strong></span>
            </div>
            <div className="study-info-tag">
              <span className="dot dot-learning"></span>
              <span>Learning: <strong id="study-learning">{stats.learningCount}</strong></span>
            </div>
            <div className="study-info-tag">
              <span className="dot dot-due"></span>
              <span>Review: <strong id="study-due">{stats.dueCount}</strong></span>
            </div>
            <button className="btn btn-ghost btn-sm" id="study-exit-btn" style={{ marginLeft: 'auto' }} onClick={() => router('/study/setup')}>Exit</button>
          </div>

          {/* Flashcard */}
          <div className="flashcard-container" id="flashcard-container" onClick={() => !showHint && setShowHint(true)}>
            <div 
              className={`flashcard ${animState ? `anim-${animState}` : ''}`} 
              id="flashcard"
            >
              <div className="flashcard-face flashcard-front" id="card-front">
                {studyMode === 1 && (
                  <>
                    {!currentCard.hideFuriganaFront && <div className="card-furigana">{currentCard.hiragana}</div>}
                    {currentCard.kanji !== currentCard.hiragana ? (
                      <div className="card-kanji">{currentCard.kanji}</div>
                    ) : (
                      <div className="card-kanji">{currentCard.hiragana}</div>
                    )}
                  </>
                )}
                {studyMode === 2 && (
                  <>
                    <div className="card-kanji">
                      {(() => {
                        const isPureKana = currentCard.kanji === currentCard.hiragana;
                        const text = isPureKana ? currentCard.hiragana : currentCard.kanji;
                        
                        if (!text) return null;
                        
                        if (isPureKana) {
                          return <span>{text}</span>;
                        }

                        const parts = text.split(/([ぁ-んァ-ヶー]+)/g);
                        return parts.map((part, i) => {
                          if (!part) return null;
                          if (/^[ぁ-んァ-ヶー]+$/.test(part)) {
                            return <span key={i} style={{ opacity: 0.2 }}>{part}</span>;
                          }
                          return <span key={i}>{part}</span>;
                        });
                      })()}
                    </div>
                  </>
                )}
                {studyMode === 3 && (
                  <div className="card-kanji" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentCard.meaning}
                  </div>
                )}
                {studyMode === 4 && (
                  <div className="card-kanji" style={{ opacity: 0.3, letterSpacing: '4px' }}>
                    ••••
                  </div>
                )}
                {/* Tap hint — hides smoothly when flipped */}
                <div className={`card-tap-hint ${showHint ? 'fade-out' : ''}`}>TAP UNTUK MEMBALIK</div>
              </div>
              <div className={`flashcard-face flashcard-back ${!showHint ? 'hidden' : ''}`} id="card-back">
                {studyMode === 3 ? (
                  <>
                    <div className="card-furigana">{currentCard.hiragana}</div>
                    {currentCard.kanji !== currentCard.hiragana ? (
                      <div className="card-kanji" style={{ fontSize: '3.5rem' }}>{currentCard.kanji}</div>
                    ) : (
                      <div className="card-kanji" style={{ fontSize: '3.5rem' }}>{currentCard.hiragana}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="card-meaning">{currentCard.meaning}</div>
                    {(studyMode === 1 || studyMode === 2 || studyMode === 4) && currentCard.hiragana && currentCard.hiragana !== 'Tidak ada bacaan' && currentCard.hiragana !== currentCard.kanji && (
                      <div className="card-romaji">{currentCard.hiragana}</div>
                    )}
                    {studyMode === 4 && currentCard.kanji && (
                      <div className="card-kanji" style={{ fontSize: '2rem', marginTop: '16px' }}>{currentCard.kanji}</div>
                    )}
                  </>
                )}
              </div>
              {/* Single chapter tag — always visible, not duplicated */}
              {showChapterBadge && (
                <div className="card-chapter-tag">{currentCard.chapter}</div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className={`rating-area ${!showHint ? 'hidden' : ''}`} id="rating-area">
            <div className="rating-buttons">
              <button className="rating-btn rating-btn-again" onClick={() => handleRating(1)}>
                <span className="rating-label">Again</span>
                <span className="rating-interval" id="interval-again">{intervalTexts[1]}</span>
              </button>
              <button className="rating-btn rating-btn-hard" onClick={() => handleRating(2)}>
                <span className="rating-label">Hard</span>
                <span className="rating-interval" id="interval-hard">{intervalTexts[2]}</span>
              </button>
              <button className="rating-btn rating-btn-good" onClick={() => handleRating(3)}>
                <span className="rating-label">Good</span>
                <span className="rating-interval" id="interval-good">{intervalTexts[3]}</span>
              </button>
              <button className="rating-btn rating-btn-easy" onClick={() => handleRating(4)}>
                <span className="rating-label">Easy</span>
                <span className="rating-interval" id="interval-easy">{intervalTexts[4]}</span>
              </button>
            </div>
            <div className="shortcut-hints">
              <span><kbd>Space</kbd> Flip</span>
              <span><kbd>1</kbd> Again</span>
              <span><kbd>2</kbd> Hard</span>
              <span><kbd>3</kbd> Good</span>
              <span><kbd>4</kbd> Easy</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
