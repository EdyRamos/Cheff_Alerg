import Phaser from 'phaser';
import DifficultyManager from './utils/DifficultyManager';

export default class PhaserGameEngine {
  constructor({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
    this.config = { phaseConfig, bitmask, onGameOver, onReturnToMenu };
    this.game = null;
  }

  init(parent) {
    // TODO: instantiate Phaser.Game with GameScene and PauseScene.
    // See the patch provided for the full implementation.
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
