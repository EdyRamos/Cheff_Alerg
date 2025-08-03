import Phaser from 'phaser';
import DifficultyManager from './utils/DifficultyManager';

export default class PhaserGameEngine {
  constructor({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
    this.phaseConfig    = phaseConfig;
    this.bitmask        = bitmask;
    this.onGameOver     = onGameOver;
    this.onReturnToMenu = onReturnToMenu;
    this.game           = null;
    this.bgMusic        = null;
  }

  /**
   * Initialize the Phaser game and mount it into the provided DOM
   * element.
   */
  init(parent) {
    if (this.game) return;
    const engine = this;
    const { phaseConfig, bitmask, onGameOver, onReturnToMenu } = this;

    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
        this.score        = 0;
        this.lives        = 3;
        this.activeItems  = [];
        this.lastSpawn    = 0;
        this.difficulty   = new DifficultyManager();
        this.spawnRate    =
          phaseConfig.itemSpawnRate || phaseConfig.spawnRate || 1500;
        this.simultaneous = phaseConfig.simultaneous || 2;
        this.speed        = phaseConfig.speed || 1;
        this.duration     = phaseConfig.duration || null;
        this.tips         = phaseConfig.tips || [];
        this.tipText      = null;
      }
      preload() {
        phaseConfig.items.forEach((item) => {
          this.load.image(item.key, item.spriteUrl);
        });
        this.load.image('missing', '/assets/images/missing.png');
        if (phaseConfig.background) {
          this.load.image('background', phaseConfig.background);
        }
        const music = phaseConfig.music || '/assets/audio/background.ogg';
        this.load.audio('bgMusic', music);
        this.load.audio('safeSound', '/assets/audio/safe.ogg');
        this.load.audio('allergenSound', '/assets/audio/allergen.ogg');
      }
      create() {
        const { width, height } = this.scale;

        // Render background if available
        if (phaseConfig.background) {
          this.add
            .image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(width, height);
        }
        // Background music
        this.bgMusic = this.sound.add('bgMusic', { loop: true });
        this.bgMusic.play();
        engine.bgMusic = this.bgMusic;

        // Score HUD
        this.scoreText = this.add.text(16, 16, `Pontuação: ${this.score}`, {
          fontSize: '24px',
          fill: '#fff',
        });
        this.scoreBg = this.add
          .rectangle(
            this.scoreText.x - 8,
            this.scoreText.y - 8,
            this.scoreText.width + 16,
            this.scoreText.height + 16,
            0x000000,
            0.5
          )
          .setOrigin(0, 0)
          .setDepth(this.scoreText.depth - 1);
        // Lives HUD
        this.lifeText = this.add.text(0, 16, `Vidas: ${this.lives}`, {
          fontSize: '24px',
          fill: '#fff',
        });
        this.lifeText.setX(width - this.lifeText.width - 16);
        this.lifeBg = this.add
          .rectangle(
            this.lifeText.x - 8,
            this.lifeText.y - 8,
            this.lifeText.width + 16,
            this.lifeText.height + 16,
            0x000000,
            0.5
          )
          .setOrigin(0, 0)
          .setDepth(this.lifeText.depth - 1);
        // Pause button
        const pauseButton = this.add
          .text(width - 80, 50, 'Pausar', { fontSize: '20px', fill: '#000' })
          .setInteractive();
        const launchPause = () => {
          this.bgMusic?.pause();
          this.scene.launch('PauseScene');
          this.scene.pause();
        };
        pauseButton.on('pointerdown', launchPause);
        this.input.keyboard.on('keydown-P', launchPause);
        if (this.duration) {
          this.time.delayedCall(this.duration * 1000, () => {
            this.scene.pause();
            this.bgMusic.stop();
            this.add
              .text(width / 2, height / 2, 'Fim de Jogo', {
                fontSize: '32px',
                fill: '#f00',
              })
              .setOrigin(0.5);
            if (typeof onGameOver === 'function') onGameOver();
          });
        }
      }
      // ... resto do código (sem alteração)
      // (o restante não tinha conflito)
      // Pode copiar exatamente igual do seu arquivo base
      // (mantive só o início acima porque o conflito estava só nesse ponto!)
      // ...
    }

    class PauseScene extends Phaser.Scene {
      constructor() {
        super({ key: 'PauseScene' });
      }
      create() {
        const { width, height } = this.scale;
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);
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
          if (typeof onReturnToMenu === 'function') onReturnToMenu();
        });
        this.input.keyboard.on('keydown-P', () => {
          const gameScene = this.scene.get('GameScene');
          gameScene.bgMusic?.resume();
          this.scene.resume('GameScene');
          this.scene.stop();
        });
      }
    }

    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent,
      scene: [new GameScene(), new PauseScene()],
    });
  }

  destroy() {
    if (this.game) {
      this.bgMusic?.stop();
      this.game.destroy(true);
      this.game = null;
    }
  }
}
