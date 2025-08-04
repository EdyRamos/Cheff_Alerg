import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
  constructor({ onReturnToMenu }) {
    super({ key: 'PauseScene' });
    this.onReturnToMenu = onReturnToMenu;
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .rectangle(0, 0, width, height, 0x000000, 0.5)
      .setOrigin(0);
    this.add
      .text(width / 2, height / 2 - 40, 'Jogo Pausado', {
        fontSize: '32px',
        fill: '#fff',
      })
      .setOrigin(0.5);
    const resume = this.add
      .text(width / 2, height / 2, 'Continuar', {
        fontSize: '24px',
        fill: '#0f0',
      })
      .setOrigin(0.5)
      .setInteractive();
    resume.on('pointerdown', () => {
      const gameScene = this.scene.get('GameScene');
      gameScene.bgMusic?.resume();
      this.scene.resume('GameScene');
      this.scene.stop();
    });
    const quit = this.add
      .text(width / 2, height / 2 + 40, 'Voltar ao Menu', {
        fontSize: '24px',
        fill: '#fff',
      })
      .setOrigin(0.5)
      .setInteractive();
    quit.on('pointerdown', () => {
      const gameScene = this.scene.get('GameScene');
      gameScene.bgMusic?.stop();
      if (typeof this.onReturnToMenu === 'function')
        this.onReturnToMenu();
    });
    this.input.keyboard.on('keydown-P', () => {
      const gameScene = this.scene.get('GameScene');
      gameScene.bgMusic?.resume();
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }
}

