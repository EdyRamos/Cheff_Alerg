import GameScene from '../GameScene';

jest.mock('phaser', () => ({
  __esModule: true,
  default: { Scene: class {} }
}));

describe('GameScene recordLabelTime', () => {
  it('records elapsed time since labelTimerStart', () => {
    const scene = new GameScene({ phaseConfig: { items: [] } });
    scene.labelTimerStart = 1000;
    scene.time = { now: 4000 };
    scene.recordLabelTime();
    expect(scene.tempoLeituraRotulo).toEqual([3]);
    expect(scene.labelTimerStart).toBeNull();
  });
});
