/*
 * PhaserGameEngine
 *
 * This class encapsulates the Phaser 3 game loop used by Chef Alerg.
 * It provides a clean separation between the React UI and the game
 * engine.  The engine exposes a minimal API for starting and
 * stopping a phase.  Internally it defines the GameScene and
 * PauseScene classes which handle spawn logic, input, scoring and
 * pausing.  Consumers should instantiate PhaserGameEngine with a
 * configuration object and call init(parentElement) to mount the
 * canvas.  When finished, call destroy() to clean up resources.
 */

import Phaser from 'phaser';
import DifficultyManager from './utils/DifficultyManager';

export default class PhaserGameEngine {
  constructor({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
    this.phaseConfig    = phaseConfig;
    this.bitmask        = bitmask;
    this.onGameOver     = onGameOver;
    this.onReturnToMenu = onReturnToMenu;
    this.game           = null;
  }

  /**
   * Initialize the Phaser game and mount it into the provided DOM
   * element.  This method creates new instances of GameScene and
   * PauseScene for each run to avoid stale state carrying over
   * between plays.  It should only be called once per instance.
   * @param {HTMLElement} parent
   */
  init(parent) {
    if (this.game) return;
    const { phaseConfig, bitmask, onGameOver, onReturnToMenu } = this;

    // Define GameScene inside init so it can close over the config.
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
        this.score      = 0;
        this.lives      = 3;
        this.activeItems  = [];
        this.lastSpawn    = 0;
        this.difficulty   = new DifficultyManager();
        this.spawnRate    = phaseConfig.spawnRate || 1500;
        this.simultaneous = phaseConfig.simultaneous || 2;
      }
      preload() {
        // Load item sprites
        phaseConfig.items.forEach((item) => {
          this.load.image(item.key, item.spriteUrl);
        });
        this.load.image('missing', '/assets/images/missing.png');
         // Load audio assets
         this.load.audio('bgMusic', '/assets/audio/background.ogg');
         this.load.audio('safeSound', '/assets/audio/safe.ogg');
         this.load.audio('allergenSound', '/assets/audio/allergen.ogg');
      }
      create() {
        const { width } = this.scale;
         // Background music
         this.bgMusic = this.sound.add('bgMusic', { loop: true });
         this.bgMusic.play();
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
          this.scene.launch('PauseScene');
          this.scene.pause();
        };
        pauseButton.on('pointerdown', launchPause);
        this.input.keyboard.on('keydown-P', launchPause);
      }
      spawnItem(time) {
        if (this.activeItems.length >= this.simultaneous) return;
        if (time - this.lastSpawn < this.spawnRate) return;
        this.lastSpawn = time;
        const item = Phaser.Math.RND.pick(phaseConfig.items);
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(100, this.scale.height - 50);
        const sprite = this.add.image(x, y, item.key);
        sprite.setData('bit', item.bitmaskBit || 0);
        sprite.setInteractive();
        sprite.on('pointerdown', () => this.handleTap(sprite));
        this.activeItems.push(sprite);
        this.tweens.add({
          targets: sprite,
          y: this.scale.height + 50,
          duration: 6000,
          onComplete: () => {
            this.activeItems = this.activeItems.filter((s) => s !== sprite);
            sprite.destroy();
          },
        });
      }
      handleTap(sprite) {
        const bit = sprite.getData('bit');
        const isAllergen = (bitmask & (1 << bit)) !== 0;
        if (isAllergen) {
          this.sound.play('allergenSound');
          this.lives -= 1;
          this.lifeText.setText(`Vidas: ${this.lives}`);
          this.lifeText.setX(this.scale.width - this.lifeText.width - 16);
          this.lifeBg.setPosition(this.lifeText.x - 8, this.lifeText.y - 8);
          this.lifeBg.width = this.lifeText.width + 16;
          this.lifeBg.height = this.lifeText.height + 16;
          this.add
            .text(sprite.x, sprite.y - 20, 'Alergênico!', {
              fontSize: '14px',
              fill: '#f00',
            })
            .setOrigin(0.5, 1);
          this.difficulty.record(false);
        } else {
          this.sound.play('safeSound');
          this.score += 10;
          this.scoreText.setText(`Pontuação: ${this.score}`);
          this.scoreBg.width = this.scoreText.width + 16;
          this.scoreBg.height = this.scoreText.height + 16;
          this.difficulty.record(true);
          const emitter = this.add.particles('missing', {
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            lifespan: 500,
            scale: { start: 0.3, end: 0 },
            quantity: 0,
          });
          emitter.explode(20, sprite.x, sprite.y);
        }
        this.activeItems = this.activeItems.filter((s) => s !== sprite);
        sprite.destroy();
        if (this.lives <= 0) {
          this.scene.pause();
          this.add
            .text(this.scale.width / 2, this.scale.height / 2, 'Fim de Jogo', {
              fontSize: '32px',
              fill: '#f00',
            })
            .setOrigin(0.5);
          if (typeof onGameOver === 'function') onGameOver();
        }
      }
      update(time) {
        const params = this.difficulty.getParameters(
          phaseConfig.spawnRate,
          phaseConfig.simultaneous
        );
        this.spawnRate = params.spawnRate;
        this.simultaneous = params.simultaneous;
        this.spawnItem(time);
      }
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
          if (typeof onReturnToMenu === 'function') onReturnToMenu();
        });
        this.input.keyboard.on('keydown-P', () => {
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
  /**
   * Destroy the Phaser instance and free resources.  Must be called
   * when the game is unmounted to avoid memory leaks.
   */
  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}