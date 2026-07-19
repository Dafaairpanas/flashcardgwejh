/**
 * FSRS (Free Spaced Repetition Scheduler) Implementation
 * Based on FSRS-5 algorithm with full DSR model
 * 
 * Core Variables per card:
 *   D (Difficulty): 1-10, how hard the card is
 *   S (Stability): days until R drops to target retention
 *   R (Retrievability): probability of recall (0-1)
 * 
 * Core Formula: R = 0.9^(t/S)
 */

// Default FSRS-5 parameters (17 weights)
const DEFAULT_PARAMS = {
  w: [
    0.4072, // w0: initial stability for Again
    1.1829, // w1: initial stability for Hard
    3.1262, // w2: initial stability for Good
    15.4722, // w3: initial stability for Easy
    7.2102, // w4: difficulty weight
    0.5316, // w5: difficulty decay
    1.0651, // w6: stability increase after success
    0.0046, // w7: stability decay factor
    1.5418, // w8: fail stability multiplier
    0.1693, // w9: fail stability min factor
    1.0264, // w10: hard penalty
    0.5857, // w11: easy bonus
    0.0012, // w12: difficulty penalty on stability
    0.2867, // w13: difficulty bonus on stability
    0.2398, // w14: stability recovery after fail
    0.5126, // w15: short-term stability
    3.2042, // w16: difficulty mean-reversion speed
  ],
  requestRetention: 0.9, // Target retention (90%)
  maximumInterval: 36500,  // Max interval in days (100 years)
};

// Card states
export const State = {
  NEW: 0,
  LEARNING: 1,
  REVIEW: 2,
  RELEARNING: 3,
};

// Rating values
export const Rating = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
};

/**
 * Create a new FSRS card state
 */
export function createCardState() {
  return {
    state: State.NEW,
    difficulty: 0,
    stability: 0,
    retrievability: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    lastReview: null,
    due: null,
  };
}

/**
 * Clamp difficulty to [1, 10]
 */
function clampDifficulty(d) {
  return Math.min(10, Math.max(1, d));
}

/**
 * Calculate initial difficulty based on rating
 */
function initDifficulty(rating, w) {
  return clampDifficulty(
    w[4] - Math.exp(w[5] * (rating - 1)) + 1
  );
}

/**
 * Calculate initial stability based on rating
 */
function initStability(rating, w) {
  return Math.max(w[rating - 1], 0.1);
}

/**
 * Calculate retrievability based on elapsed time and stability
 * R = 0.9^(t/S)
 */
export function calcRetrievability(elapsedDays, stability) {
  if (stability <= 0) return 0;
  return Math.pow(0.9, elapsedDays / stability);
}

/**
 * Calculate the next interval based on stability and desired retention
 * Derived from: R = 0.9^(t/S) → t = S * log(R) / log(0.9)
 */
function nextInterval(stability, requestRetention) {
  return Math.max(
    1,
    Math.round(
      (stability / (9 * (1 / requestRetention - 1))) * 1
    )
  );
}

/**
 * Mean revert difficulty towards initial
 */
function meanReversionDifficulty(currentD, initD, w) {
  return w[16] * initD + (1 - w[16]) * currentD;
}

/**
 * Calculate new difficulty after review
 */
function nextDifficulty(currentD, rating, w) {
  const initD = initDifficulty(Rating.GOOD, w);
  const deltaDifficulty = -w[5] * (rating - 3);
  const newD = currentD + deltaDifficulty;
  return clampDifficulty(meanReversionDifficulty(newD, initD, w));
}

/**
 * Calculate new stability after successful recall
 * Uses spacing effect: harder retrieval → bigger stability boost
 */
function nextStabilitySuccess(currentD, currentS, retrievability, rating, w) {
  const hardPenalty = rating === Rating.HARD ? w[10] : 1;
  const easyBonus = rating === Rating.EASY ? w[11] : 1;

  return currentS * (
    1 + 
    Math.exp(w[6]) *
    (11 - currentD) *
    Math.pow(currentS, -w[7]) *
    (Math.exp((1 - retrievability) * w[8]) - 1) *
    hardPenalty *
    easyBonus
  );
}

/**
 * Calculate new stability after failed recall (Again)
 * Post-retrieval reset: stability drops but not to zero
 */
function nextStabilityFail(currentD, currentS, retrievability, w) {
  return Math.max(
    0.1,
    w[9] *
    Math.pow(currentD, -w[12]) *
    (Math.pow(currentS + 1, w[13]) - 1) *
    Math.exp((1 - retrievability) * w[14])
  );
}

/**
 * FSRS Scheduler class
 * Manages card scheduling and state updates
 */
export class FSRSScheduler {
  constructor(params = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.w = this.params.w;
  }

  /**
   * Schedule a card review and return next states for all ratings
   * @param {object} card - Current card state
   * @param {Date} now - Current timestamp
   * @returns {object} - Scheduling info for each rating
   */
  schedule(card, now = new Date()) {
    const result = {};
    
    for (const rating of [Rating.AGAIN, Rating.HARD, Rating.GOOD, Rating.EASY]) {
      result[rating] = this.reviewCard({ ...card }, rating, now);
    }

    return result;
  }

  /**
   * Review a card with a given rating
   * @param {object} card - Card state (will be mutated)
   * @param {number} rating - Rating (1-4)
   * @param {Date} now - Current timestamp
   * @returns {object} - Updated card state
   */
  reviewCard(card, rating, now = new Date()) {
    const updated = { ...card };
    updated.reps += 1;
    
    if (updated.state === State.NEW) {
      // First review — initialize
      updated.difficulty = initDifficulty(rating, this.w);
      updated.stability = initStability(rating, this.w);
      updated.retrievability = 1;
      
      if (rating === Rating.AGAIN) {
        updated.state = State.LEARNING;
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 1 * 60 * 1000); // 1 min
        updated.lapses += 1;
      } else if (rating === Rating.HARD) {
        updated.state = State.LEARNING;
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
      } else if (rating === Rating.GOOD) {
        updated.state = State.LEARNING;
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 10 * 60 * 1000); // 10 min
      } else {
        // Easy — skip learning, go straight to review
        updated.state = State.REVIEW;
        const interval = nextInterval(updated.stability, this.params.requestRetention);
        updated.scheduledDays = Math.min(interval, this.params.maximumInterval);
        updated.due = new Date(now.getTime() + updated.scheduledDays * 24 * 60 * 60 * 1000);
      }
    } else if (updated.state === State.LEARNING || updated.state === State.RELEARNING) {
      // In learning phase
      if (rating === Rating.AGAIN) {
        updated.state = updated.state === State.LEARNING ? State.LEARNING : State.RELEARNING;
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 1 * 60 * 1000); // 1 min
        updated.difficulty = nextDifficulty(updated.difficulty, rating, this.w);
        updated.lapses += 1;
      } else if (rating === Rating.HARD) {
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
        updated.difficulty = nextDifficulty(updated.difficulty, rating, this.w);
      } else if (rating === Rating.GOOD) {
        // Graduate to review
        updated.state = State.REVIEW;
        updated.difficulty = nextDifficulty(updated.difficulty, rating, this.w);
        updated.stability = initStability(Rating.GOOD, this.w);
        const interval = nextInterval(updated.stability, this.params.requestRetention);
        updated.scheduledDays = Math.min(interval, this.params.maximumInterval);
        updated.due = new Date(now.getTime() + updated.scheduledDays * 24 * 60 * 60 * 1000);
      } else {
        // Easy — graduate immediately with longer interval
        updated.state = State.REVIEW;
        updated.difficulty = nextDifficulty(updated.difficulty, rating, this.w);
        updated.stability = initStability(Rating.EASY, this.w);
        const interval = nextInterval(updated.stability, this.params.requestRetention);
        updated.scheduledDays = Math.min(interval, this.params.maximumInterval);
        updated.due = new Date(now.getTime() + updated.scheduledDays * 24 * 60 * 60 * 1000);
      }
    } else {
      // Review state — full FSRS calculation
      const elapsedDays = updated.lastReview
        ? Math.max(0, (now.getTime() - new Date(updated.lastReview).getTime()) / (24 * 60 * 60 * 1000))
        : 0;
      
      updated.elapsedDays = elapsedDays;
      updated.retrievability = calcRetrievability(elapsedDays, updated.stability);
      updated.difficulty = nextDifficulty(updated.difficulty, rating, this.w);
      
      if (rating === Rating.AGAIN) {
        // Failed — reset stability, enter relearning
        updated.stability = nextStabilityFail(
          updated.difficulty, updated.stability, updated.retrievability, this.w
        );
        updated.state = State.RELEARNING;
        updated.scheduledDays = 0;
        updated.due = new Date(now.getTime() + 1 * 60 * 1000);
        updated.lapses += 1;
      } else {
        // Success — increase stability using spacing effect
        updated.stability = nextStabilitySuccess(
          updated.difficulty, updated.stability, updated.retrievability, rating, this.w
        );
        const interval = nextInterval(updated.stability, this.params.requestRetention);
        updated.scheduledDays = Math.min(interval, this.params.maximumInterval);
        updated.due = new Date(now.getTime() + updated.scheduledDays * 24 * 60 * 60 * 1000);
        updated.state = State.REVIEW;
      }
    }

    updated.lastReview = now.toISOString();
    return updated;
  }
}

/**
 * FSRS State Manager — persists card states to localStorage
 */
export class FSRSStateManager {
  constructor(storageKey = 'fsrs_cards') {
    this.storageKey = storageKey;
    this.states = this._load();
    this.scheduler = new FSRSScheduler();
  }

  _load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  _save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.states));
  }

  /**
   * Get card state, creating if new
   */
  getCardState(cardId) {
    if (!this.states[cardId]) {
      this.states[cardId] = createCardState();
    }
    return { ...this.states[cardId] };
  }

  /**
   * Review a card with a rating
   */
  reviewCard(cardId, rating, now = new Date()) {
    const currentState = this.getCardState(cardId);
    const newState = this.scheduler.reviewCard(currentState, rating, now);
    this.states[cardId] = newState;
    this._save();
    return newState;
  }

  /**
   * Check if a card is due for review
   */
  isDue(cardId, now = new Date()) {
    const state = this.states[cardId];
    if (!state || state.state === State.NEW) return true; // New cards are always "due"
    if (!state.due) return true;
    return new Date(state.due) <= now;
  }

  /**
   * Check if card is new (never reviewed)
   */
  isNew(cardId) {
    return !this.states[cardId] || this.states[cardId].state === State.NEW;
  }

  /**
   * Get cards sorted by due date (due first, then new)
   * @param {Array} cards - Array of card objects with 'id' field
   * @param {Date} now
   * @returns {Array} - Sorted cards: due cards first, then new cards
   */
  getSortedQueue(cards, now = new Date()) {
    const due = [];
    const learning = [];
    const newCards = [];

    for (const card of cards) {
      const state = this.states[card.id];
      if (!state || state.state === State.NEW) {
        newCards.push(card);
      } else if (state.state === State.LEARNING || state.state === State.RELEARNING) {
        learning.push(card);
      } else if (this.isDue(card.id, now)) {
        due.push(card);
      }
    }

    // Helper to shuffle arrays
    const shuffle = (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Shuffle the categories so they don't appear in a predictable order
    return [...shuffle(learning), ...shuffle(due), ...shuffle(newCards)];
  }

  /**
   * Get stats for a set of cards
   */
  getStats(cards) {
    const now = new Date();
    let newCount = 0, learningCount = 0, reviewCount = 0, dueCount = 0;

    for (const card of cards) {
      const state = this.states[card.id];
      if (!state || state.state === State.NEW) {
        newCount++;
      } else if (state.state === State.LEARNING || state.state === State.RELEARNING) {
        learningCount++;
      } else {
        reviewCount++;
        if (this.isDue(card.id, now)) {
          dueCount++;
        }
      }
    }

    return { newCount, learningCount, reviewCount, dueCount, total: cards.length };
  }

  /**
   * Get the interval text for display
   */
  getIntervalText(cardId, rating) {
    const currentState = this.getCardState(cardId);
    const now = new Date();
    const nextState = this.scheduler.reviewCard({ ...currentState }, rating, now);
    
    if (nextState.scheduledDays === 0) {
      // Learning step — show minutes
      const diffMs = new Date(nextState.due).getTime() - now.getTime();
      const mins = Math.round(diffMs / (60 * 1000));
      return mins <= 0 ? '<1m' : `${mins}m`;
    } else if (nextState.scheduledDays < 30) {
      return `${nextState.scheduledDays}d`;
    } else if (nextState.scheduledDays < 365) {
      return `${Math.round(nextState.scheduledDays / 30)}mo`;
    } else {
      return `${(nextState.scheduledDays / 365).toFixed(1)}y`;
    }
  }

  /**
   * Reset all progress
   */
  reset() {
    this.states = {};
    this._save();
  }

  /**
   * Reset progress for specific cards
   */
  resetCards(cardIds) {
    for (const id of cardIds) {
      delete this.states[id];
    }
    this._save();
  }
}
