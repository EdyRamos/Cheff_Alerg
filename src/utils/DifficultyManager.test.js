import DifficultyManager from './DifficultyManager';

describe('DifficultyManager', () => {
  test('calculates accuracy across event sequences', () => {
    const dm = new DifficultyManager(3);
    expect(dm.getAccuracy()).toBe(1);
    dm.record(true);
    expect(dm.getAccuracy()).toBe(1);
    dm.record(false);
    expect(dm.getAccuracy()).toBeCloseTo(0.5);
    dm.record(false);
    expect(dm.getAccuracy()).toBeCloseTo(1/3);
    dm.record(false);
    expect(dm.getAccuracy()).toBe(0);
  });

  test('parameters scale with accuracy bounds', () => {
    const dmLow = new DifficultyManager();
    for (let i = 0; i < dmLow.windowSize; i++) dmLow.record(false);
    const low = dmLow.getParameters();

    const dmHigh = new DifficultyManager();
    for (let i = 0; i < dmHigh.windowSize; i++) dmHigh.record(true);
    const high = dmHigh.getParameters();

    expect(low.spawnRate).toBeGreaterThan(high.spawnRate);
    expect(low.simultaneous).toBeLessThan(high.simultaneous);
    expect(low).toEqual({ spawnRate: 3000, simultaneous: 1 });
    expect(high).toEqual({ spawnRate: 1000, simultaneous: 3 });
  });
});

