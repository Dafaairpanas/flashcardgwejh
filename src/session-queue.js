/**
 * SessionQueue — Randomized card queue with repeat management
 * 
 * Problem: When cards are rated Hard/Again, they need to repeat.
 * Simply inserting them N positions ahead is predictable.
 * 
 * Solution: Maintain two pools:
 *   1. mainQueue — primary cards, pre-shuffled
 *   2. repeatPool — cards awaiting re-appearance, each with a cooldown counter
 * 
 * On each next() call, we decrement cooldowns, then randomly decide
 * whether to serve a card from repeatPool (if any are ready) or mainQueue.
 * This makes repeat appearances truly unpredictable.
 */

/**
 * Fisher-Yates shuffle (in-place)
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class SessionQueue {
  /**
   * @param {Array} cards — the full list of cards for this session (already FSRS-sorted)
   * @param {Object} options
   * @param {number} options.minCooldown — minimum cards before a repeat can appear (default: 3)
   * @param {number} options.maxCooldown — maximum cards before a repeat can appear (default: 8)
   * @param {number} options.repeatChance — probability (0-1) of serving a ready repeat vs main card (default: 0.5)
   */
  constructor(cards, options = {}) {
    this.minCooldown = options.minCooldown ?? 3;
    this.maxCooldown = options.maxCooldown ?? 8;
    this.repeatChance = options.repeatChance ?? 0.5;

    // Main queue: cards in order (already sorted/shuffled by FSRS)
    this.mainQueue = [...cards];

    // Repeat pool: { card, cooldown, repeatsLeft }
    this.repeatPool = [];

    // History of served cards (for progress tracking)
    this.served = [];

    // Total expected cards (grows as repeats are added)
    this._totalExpected = cards.length;
  }

  /**
   * How many cards have been served
   */
  get servedCount() {
    return this.served.length;
  }

  /**
   * Total expected cards (original + all pending repeats)
   */
  get totalCount() {
    return this._totalExpected;
  }

  /**
   * How many cards are remaining (main + repeat pool)
   */
  get remaining() {
    const repeatRemaining = this.repeatPool.reduce((sum, entry) => sum + entry.repeatsLeft, 0);
    return this.mainQueue.length + repeatRemaining;
  }

  /**
   * Whether there are any more cards to serve
   */
  get hasNext() {
    return this.mainQueue.length > 0 || this.repeatPool.length > 0;
  }

  /**
   * Get the next card from the queue.
   * Randomly selects between ready repeats and main queue.
   * Returns null if no cards remaining.
   */
  next() {
    if (!this.hasNext) return null;

    // Decrement cooldowns for all repeat entries
    for (const entry of this.repeatPool) {
      entry.cooldown = Math.max(0, entry.cooldown - 1);
    }

    // Find which repeat entries are ready (cooldown reached 0)
    const readyRepeats = this.repeatPool.filter(e => e.cooldown <= 0);

    let card = null;

    if (readyRepeats.length > 0 && this.mainQueue.length > 0) {
      // Both available — randomly choose
      if (Math.random() < this.repeatChance) {
        card = this._serveRepeat(readyRepeats);
      } else {
        card = this._serveMain();
      }
    } else if (readyRepeats.length > 0) {
      // Only repeats available
      card = this._serveRepeat(readyRepeats);
    } else if (this.mainQueue.length > 0) {
      // Only main queue available
      card = this._serveMain();
    } else {
      // Repeats exist but none are ready yet — force the one with lowest cooldown
      this.repeatPool.sort((a, b) => a.cooldown - b.cooldown);
      card = this._serveRepeat(this.repeatPool.filter(e => true));
    }

    if (card) {
      this.served.push(card);
    }

    return card;
  }

  /**
   * Serve a card from the main queue
   */
  _serveMain() {
    return this.mainQueue.shift();
  }

  /**
   * Serve a random card from the ready repeats
   */
  _serveRepeat(readyList) {
    if (readyList.length === 0) return null;

    // Pick a random ready repeat
    const idx = Math.floor(Math.random() * readyList.length);
    const entry = readyList[idx];

    entry.repeatsLeft--;

    if (entry.repeatsLeft <= 0) {
      // Remove from repeat pool entirely
      const poolIdx = this.repeatPool.indexOf(entry);
      if (poolIdx !== -1) this.repeatPool.splice(poolIdx, 1);
    } else {
      // Reset cooldown for next repeat appearance
      entry.cooldown = this._randomCooldown();
    }

    return entry.card;
  }

  /**
   * Add a card to the repeat pool with N repeats.
   * Called after rating a card (Again=3, Hard=2, Good=1, Easy=0).
   * 
   * @param {Object} card — the card to repeat
   * @param {number} repeats — how many times to repeat (0 = no repeat)
   */
  addRepeat(card, repeats) {
    if (repeats <= 0) return;

    // Check if card is already in repeat pool (e.g., rated Hard twice)
    const existing = this.repeatPool.find(e => e.card.id === card.id);
    if (existing) {
      // Add more repeats to existing entry
      existing.repeatsLeft += repeats;
      // Reset cooldown to new random value
      existing.cooldown = this._randomCooldown();
    } else {
      this.repeatPool.push({
        card,
        cooldown: this._randomCooldown(),
        repeatsLeft: repeats,
      });
    }

    // Update total expected count
    this._totalExpected += repeats;
  }

  /**
   * Generate a random cooldown between min and max
   */
  _randomCooldown() {
    return this.minCooldown + Math.floor(Math.random() * (this.maxCooldown - this.minCooldown + 1));
  }

  /**
   * Get current cards in main queue (for stats calculation)
   * Returns a snapshot array containing all pending cards (main + repeat pool)
   */
  getPendingCards() {
    const pending = [...this.mainQueue];
    for (const entry of this.repeatPool) {
      for (let i = 0; i < entry.repeatsLeft; i++) {
        pending.push(entry.card);
      }
    }
    return pending;
  }
}
