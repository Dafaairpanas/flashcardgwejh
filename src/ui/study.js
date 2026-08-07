import { $, state, fsrs } from '../state.js';
import { router } from '../router.js';
import { chapterDisplayName, getCardsByChapters } from '../data.js';
import { SessionQueue } from '../session-queue.js';
import { Rating } from '../fsrs.js';
import { speak, stopSpeech } from '../tts.js';
import { showToast, changeThemeColor } from './layout.js';

export function startStudy() {
  const cards = getCardsByChapters(state.selectedChapters, state.selectedGrades, state.jlptFilter, state.studyMode);
  if (cards.length === 0) {
    showToast('Pilih minimal 1 bab!');
    return;
  }

  const sorted = fsrs.getSortedQueue(cards);
  state.sessionQueue = new SessionQueue(sorted, {
    minCooldown: 3,
    maxCooldown: 8,
    repeatChance: 0.5,
  });
  state.currentCard = null;
  state.isFlipped = false;
  state.sessionStartTime = Date.now();
  state.totalReviewed = 0;
  state.totalCorrect = 0;
  state.sessionWeakCards.clear();

  router.navigate('/study');
  showCard();
}

export function startCustomStudy(customCards) {
  if (!customCards || customCards.length === 0) {
    showToast('Tidak ada kartu untuk dipelajari!');
    return;
  }

  state.studyMode = 1; 

  const sorted = fsrs.getSortedQueue(customCards);
  state.sessionQueue = new SessionQueue(sorted, {
    minCooldown: 3,
    maxCooldown: 8,
    repeatChance: 0.5,
  });
  state.currentCard = null;
  state.isFlipped = false;
  state.sessionStartTime = Date.now();
  state.totalReviewed = 0;
  state.totalCorrect = 0;
  state.sessionWeakCards.clear();

  router.navigate('/study');
  showCard();
}

function showCard() {
  const queue = state.sessionQueue;
  if (!queue || !queue.hasNext) {
    finishSession();
    return;
  }

  const card = queue.next();
  if (!card) {
    finishSession();
    return;
  }

  state.currentCard = card;
  state.isFlipped = false;

  $('card-back').classList.add('hidden');
  $('rating-area').classList.add('hidden');

  const served = queue.servedCount;
  const total = queue.totalCount;
  const progress = total > 0 ? (served / total) * 100 : 0;
  $('progress-fill').style.width = `${Math.min(progress, 100)}%`;
  $('progress-text').textContent = `${served}/${total}`;

  const pendingCards = queue.getPendingCards();
  const stats = fsrs.getStats(pendingCards);
  $('study-new').textContent = stats.newCount;
  $('study-learning').textContent = stats.learningCount;
  $('study-due').textContent = stats.dueCount;

  renderCardFront(card);
  renderCardBack(card);

  if (state.soundEnabled && state.studyMode !== 3 && state.studyMode !== 2) {
    setTimeout(() => playCardSound(card), 400);
  }
}

function highlightKanji(text) {
  if (!text) return '';
  const hasKanji = /[\u4e00-\u9faf]/.test(text);
  if (!hasKanji) return text;
  
  return text.split(/([\u4e00-\u9faf]+)/).map(part => {
    if (!part) return '';
    if (/[\u4e00-\u9faf]/.test(part)) {
      return `<span class="kanji-focus">${part}</span>`;
    }
    return `<span class="okurigana-fade">${part}</span>`;
  }).join('');
}

function renderCardFront(card) {
  const front = $('card-front');
  let html = '';
  
  const displayKanji = highlightKanji(card.kanji);

  switch (state.studyMode) {
    case 1: 
      html = `
        <div class="card-furigana">${card.hiragana}</div>
        <div class="card-kanji">${displayKanji}</div>
      `;
      break;
    case 2: 
      html = `
        <div class="card-furigana" id="hint-kana" style="opacity:0; transition:opacity 0.3s">${card.hiragana}</div>
        <div class="card-kanji">${displayKanji}</div>
        <button class="btn btn-ghost btn-sm" id="btn-show-hint" style="margin-top:12px; z-index:10" onclick="event.stopPropagation()">Reveal Hint</button>
      `;
      break;
    case 3: 
      html = `
        <div class="card-meaning">${card.meaning}</div>
      `;
      break;
    case 4: 
      html = `
        <button class="card-sound-btn" id="front-sound-btn" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        </button>
        <div class="card-romaji" style="margin-top:12px; font-size:0.85rem">Listen to the audio</div>
      `;
      break;
  }

  html += `<span class="card-chapter-tag">${chapterDisplayName(card.chapter)}${card.isExtra ? ' ✦' : ''}</span>`;
  html += `<span class="card-tap-hint">Tap untuk membalik</span>`;
  front.innerHTML = html;

  const soundBtn = front.querySelector('#front-sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playCardSound(card);
    });
  }

  const hintBtn = front.querySelector('#btn-show-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const kana = front.querySelector('#hint-kana');
      if (kana) kana.style.opacity = '1';
      hintBtn.style.display = 'none';
      if (state.soundEnabled) {
        playCardSound(card);
      }
    });
  }
}

function renderCardBack(card) {
  const back = $('card-back');
  let html = '';
  
  const displayKanji = highlightKanji(card.kanji);

  switch (state.studyMode) {
    case 1: 
    case 2:
      html = `
        <div class="card-meaning">${card.meaning}</div>
        <div class="card-meaning-sub">${card.hiragana}</div>
      `;
      break;
    case 3: 
      html = `
        <div class="card-furigana">${card.hiragana}</div>
        <div class="card-kanji">${displayKanji}</div>
      `;
      break;
    case 4: 
      html = `
        <div class="card-meaning">${card.meaning}</div>
        <div class="card-meaning-sub">${displayKanji} — ${card.hiragana}</div>
      `;
      break;
  }

  html += `<span class="card-chapter-tag">${chapterDisplayName(card.chapter)}${card.isExtra ? ' ✦' : ''}</span>`;
  back.innerHTML = html;
}

export function flipCard() {
  if (state.isFlipped) return;
  state.isFlipped = true;
  
  $('card-back').classList.remove('hidden');
  $('rating-area').classList.remove('hidden');
  
  setTimeout(() => {
    $('rating-area').scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 50);

  const card = state.currentCard;
  $('interval-again').textContent = fsrs.getIntervalText(card.id, Rating.AGAIN);
  $('interval-hard').textContent = fsrs.getIntervalText(card.id, Rating.HARD);
  $('interval-good').textContent = fsrs.getIntervalText(card.id, Rating.GOOD);
  $('interval-easy').textContent = fsrs.getIntervalText(card.id, Rating.EASY);

  if (state.soundEnabled && (state.studyMode === 1 || state.studyMode === 2 || state.studyMode === 3)) {
    playCardSound(card);
  }
}

export function rateCard(rating) {
  if (!state.isFlipped) return;

  const card = state.currentCard;
  fsrs.reviewCard(card.id, rating);

  state.totalReviewed++;
  if (rating >= Rating.GOOD) state.totalCorrect++;

  if (rating === Rating.AGAIN || rating === Rating.HARD) {
    const fails = state.sessionWeakCards.get(card.id)?.fails || 0;
    state.sessionWeakCards.set(card.id, { card, fails: fails + 1 });
  }

  state.cardsUntilNextColor--;
  if (state.cardsUntilNextColor <= 0) {
    changeThemeColor();
    state.cardsUntilNextColor = Math.floor(Math.random() * 6) + 10;
  }

  const repeatMap = {
    [Rating.AGAIN]: 3,
    [Rating.HARD]: 2,
    [Rating.GOOD]: 1,
    [Rating.EASY]: 0,
  };
  const repeats = repeatMap[rating] ?? 0;

  if (repeats > 0) {
    state.sessionQueue.addRepeat(card, repeats);
  }

  stopSpeech();
  showCard();
}

export async function playCardSound(card) {
  const soundBtn = document.querySelector('.card-sound-btn');
  if (soundBtn) {
    soundBtn.classList.add('playing');
  }

  try {
    await speak(card.cleanedHiragana || card.hiragana);
  } finally {
    if (soundBtn) {
      soundBtn.classList.remove('playing');
    }
  }
}

function finishSession() {
  const elapsed = Date.now() - state.sessionStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  const accuracy = state.totalReviewed > 0
    ? Math.round((state.totalCorrect / state.totalReviewed) * 100)
    : 0;

  $('complete-reviewed').textContent = state.totalReviewed;
  $('complete-time').textContent = timeStr;
  $('complete-correct').textContent = `${accuracy}%`;

  const weakCardsContainer = $('complete-analysis');
  const weakCardsList = $('weak-cards-list');
  if (weakCardsContainer && weakCardsList) {
    if (state.sessionWeakCards.size > 0) {
      weakCardsContainer.style.display = 'block';
      weakCardsList.innerHTML = '';
      
      const fragment = document.createDocumentFragment();
      for (const [id, data] of state.sessionWeakCards) {
        const c = data.card;
        const item = document.createElement('div');
        item.className = 'weak-card-item';
        
        const hasKanji = c.kanji !== c.hiragana;
        const kanjiHtml = hasKanji ? `<div style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${c.kanji}</div>` : '';
        
        item.innerHTML = `
          <div style="flex:1;">
            <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:2px;">${c.hiragana}</div>
            ${kanjiHtml}
            <div style="font-size:0.9rem; color:var(--text-muted);">${c.meaning}</div>
          </div>
          <div style="background:rgba(239, 68, 68, 0.15); color:var(--color-again); padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:600; white-space:nowrap; height:fit-content; margin-top:4px;">
            Salah ${data.fails}x
          </div>
        `;
        fragment.appendChild(item);
      }
      weakCardsList.appendChild(fragment);
    } else {
      weakCardsContainer.style.display = 'none';
    }
  }

  router.navigate('/complete');
}
