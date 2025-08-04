import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import PauseScene from './scenes/PauseScene';

export default class PhaserGameEngine {
  constructor({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
    this.phaseConfig = phaseConfig;
    this.bitmask = bitmask;
    this.onGameOver = onGameOver;
    this.onReturnToMenu = onReturnToMenu;
    this.game = null;
    this.bgMusic = null;
  }

  init(parent) {
    if (this.game) return;
    const { phaseConfig, bitmask, onGameOver, onReturnToMenu } = this;

    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent,
      scene: [
        new GameScene({ phaseConfig, bitmask, onGameOver, engine: this }),
        new PauseScene({ onReturnToMenu }),
      ],
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    this.resizeHandler = () => {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  destroy() {
    if (this.game) {
      this.bgMusic?.stop();
      this.game.destroy(true);
      this.game = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
  }
}

