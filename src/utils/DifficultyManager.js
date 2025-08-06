/**
 * Dynamic difficulty adjustment helper.  It keeps track of the
 * player's recent performance and adjusts the spawn rate and
 * number of simultaneous items accordingly.  This simple
 * implementation uses a sliding window of the last `windowSize`
 * events and linearly interpolates between min and max values.
 */
export default class DifficultyManager {
  constructor(windowSize = 20, bounds = {}) {
    this.windowSize = windowSize;
    this.events = [];
    this.minSpawnRate = bounds.minSpawnRate ?? 700;
    this.maxSpawnRate = bounds.maxSpawnRate ?? 3000;
    this.minSimultaneous = bounds.minSimultaneous ?? 1;
    this.maxSimultaneous = bounds.maxSimultaneous ?? 5;
  }

  /**
   * Record an event.  A correct event increments accuracy, an
   * incorrect one decrements lives.  Events beyond the window
   * size are discarded.
   * @param {boolean} correct
   */
  record(correct) {
    const timestamp = Date.now();
    this.events.push({ correct, timestamp });
    if (this.events.length > this.windowSize) this.events.shift();
  }

  /**
   * Compute the player's current accuracy.
   * @returns {number} value between 0 and 1
   */
  getAccuracy() {
    if (this.events.length === 0) return 1;
    const correctCount = this.events.filter((e) => e.correct).length;
    return correctCount / this.events.length;
  }

  /**
   * Get a speed factor and simultaneous count based on accuracy.
   * Lower accuracy slows the game down and reduces simultaneous
   * items; higher accuracy increases difficulty.
   * @returns {{ spawnRate: number, simultaneous: number }}
   */
  getParameters(baseSpawn = 1500, baseSimultaneous = 2) {
    const acc = this.getAccuracy();
    // Map accuracy [0,1] to spawn factor [0.5, 1.5].
    const factor = 0.5 + acc;
    const rawSpawn = baseSpawn / factor;
    const rawSim = Math.round(baseSimultaneous * factor);
    const spawnRate = Math.min(
      this.maxSpawnRate,
      Math.max(this.minSpawnRate, rawSpawn)
    );
    const simultaneous = Math.min(
      this.maxSimultaneous,
      Math.max(this.minSimultaneous, rawSim)
    );
    return { spawnRate, simultaneous };
  }
}