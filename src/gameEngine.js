import Phaser from 'phaser';
import DifficultyManager from './utils/DifficultyManager';

// IMPORTANTE: importe os ícones!
import pauseIcon from './assets/images/ui/pause.png';
import lifeFullIcon from './assets/images/ui/life_full.png';
import lifeEmptyIcon from './assets/images/ui/life_empty.png';
import scoreIcon from './assets/images/ui/score.png';
import timeIcon from './assets/images/ui/time.png';
import tipBgIcon from './assets/images/ui/card_tip_bg.png';

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
    const engine = this;
    const { phaseConfig, bitmask, onGameOver, onReturnToMenu } = this;

    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.lives = 3;
        this.activeItems = [];
        this.lastSpawn = 0;
        this.difficulty = new DifficultyManager();
        this.spawnRate =
          phaseConfig.itemSpawnRate || phaseConfig.spawnRate || 1500;
        this.simultaneous = phaseConfig.simultaneous || 2;
        this.speed = phaseConfig.speed || 1;
        this.duration = phaseConfig.duration || null;
        this.tips = phaseConfig.tips || [];
        this.tipText = null;
        this.tipCard = null;
        this.lifeIcons = [];
        this.chef = null;
      }
      preload() {
        phaseConfig.items.forEach((item) => {
          this.load.image(item.key, item.spriteUrl);
        });
        this.load.image('missing', '/assets/images/missing.png');
        // HUD ICONES:
        this.load.image('uiPause', pauseIcon);
        this.load.image('uiLifeFull', lifeFullIcon);
        this.load.image('uiLifeEmpty', lifeEmptyIcon);
        this.load.image('uiScore', scoreIcon);
        this.load.image('uiTime', timeIcon);
        this.load.image('uiTipBg', tipBgIcon);

        this.load.image('chefIdle', '/assets/images/chef/idle.png');
        this.load.image('chefCollect', '/assets/images/chef/collect.png');
        this.load.image('chefMiss', '/assets/images/chef/miss.png');
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
        const chefSize = width * 0.15;
        if (phaseConfig.background) {
          const bg = this.add.image(width / 2, height / 2, 'background');
          const scaleX = width / bg.width;
          const scaleY = height / bg.height;
          const scale = Math.max(scaleX, scaleY);
          bg.setScale(scale).setScrollFactor(0);
        }
        this.bgMusic = this.sound.add('bgMusic', { loop: true });
        this.bgMusic.play();
        engine.bgMusic = this.bgMusic;
        // Score HUD
        this.scoreIcon = this.add
          .image(16, 24, 'uiScore')
          .setOrigin(0, 0.5)
          .setDisplaySize(32, 32);
        this.scoreText = this.add.text(
          this.scoreIcon.x + this.scoreIcon.width + 8,
          16,
          `${this.score}`,
          {
            fontSize: '24px',
            fill: '#fff',
          }
        );
        // Life HUD
        for (let i = 0; i < 3; i++) {
          const icon = this.add
            .image(width - 16 - i * 32, 24, 'uiLifeFull')
            .setOrigin(1, 0.5)
            .setDisplaySize(32, 32);
          this.lifeIcons.push(icon);
        }
        // Timer HUD
        if (this.duration) {
          this.remainingTime = this.duration;
          this.timeIcon = this.add
            .image(width / 2 - 40, 24, 'uiTime')
            .setOrigin(0, 0.5)
            .setDisplaySize(32, 32);
          this.timeText = this.add.text(
            this.timeIcon.x + this.timeIcon.width + 8,
            16,
            `${this.remainingTime}`,
            { fontSize: '24px', fill: '#fff' }
          );
          this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.remainingTime -= 1;
              this.timeText.setText(`${this.remainingTime}`);
            },
            loop: true,
          });
        }
        // Tips
        this.tipCard = this.add
          .image(width / 2, height - 80, 'uiTipBg')
          .setOrigin(0.5)
          .setDepth(9)
          .setVisible(false)
          .setDisplaySize(300, 100);
        this.tipText = this.add
          .text(width / 2, height - 80, '', {
            fontSize: '20px',
            fill: '#000',
            align: 'center',
            wordWrap: { width: 260 },
          })
          .setOrigin(0.5)
          .setDepth(10)
          .setVisible(false);
        // Chef sprite (ANIMAÇÃO)
        this.chef = this.add
          .sprite(width / 2, height - 100, 'chefIdle')
          .setDepth(5)
          .setDisplaySize(chefSize, chefSize);
        this.tipTimer = null;
        // Pause
        const pauseButton = this.add
          .image(width - 40, 40, 'uiPause')
          .setDisplaySize(32, 32)
          .setInteractive();
        const launchPause = () => {
          this.bgMusic?.pause();
          this.scene.launch('PauseScene');
          this.scene.pause();
        };
        pauseButton.on('pointerdown', launchPause);
        this.input.keyboard.on('keydown-P', launchPause);
        this.time.addEvent({
          delay: this.spawnRate,
          loop: true,
          callback: () => {
            if (this.activeItems.length < this.simultaneous) {
              this.spawnItem();
            }
          },
        });
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
      spawnItem() {
        const { width } = this.scale;
        const item = Phaser.Utils.Array.GetRandom(phaseConfig.items);
        const x = Phaser.Math.Between(32, width - 32);
        const sprite = this.physics.add.image(x, -32, item.key);
        sprite.setData('itemData', item);
        sprite.setVelocityY(100 * this.speed);
        sprite.setInteractive();
        sprite.on('pointerdown', () => {
          this.handleItemClick(sprite);
        });
        this.activeItems.push(sprite);
      }
      animateChef(state) {
        if (!this.chef) return;
        const textures = {
          idle: 'chefIdle',
          collect: 'chefCollect',
          miss: 'chefMiss',
        };
        this.chef.setTexture(textures[state] || textures.idle);
        if (state !== 'idle') {
          this.time.delayedCall(500, () => {
            this.chef.setTexture('chefIdle');
          });
        }
      }
      handleItemClick(sprite) {
        const item = sprite.getData('itemData');
        const bit = item.bitmaskBit;
        const isAllergen =
          typeof bit === 'number' && (bitmask & (1 << bit)) !== 0;
        if (isAllergen) {
          this.lives -= 1;
          this.sound.play('allergenSound');
          this.updateLives();
          this.showTip();
          this.animateChef('miss');
        } else if (item.trap) {
          this.score = Math.max(0, this.score - (item.penalty || 10));
          this.sound.play('allergenSound');
          this.updateScore();
          this.animateChef('miss');
        } else {
          const bonus = item.bonus || 0;
          this.score += 10 + bonus;
          this.sound.play('safeSound');
          this.updateScore();
          this.animateChef('collect');
        }
        sprite.destroy();
        this.activeItems = this.activeItems.filter((i) => i !== sprite);
        if (this.lives <= 0) {
          this.endGame();
        }
      }
      updateScore() {
        this.scoreText.setText(`${this.score}`);
      }
      updateLives() {
        this.lifeIcons.forEach((icon, index) => {
          const key = index < this.lives ? 'uiLifeFull' : 'uiLifeEmpty';
          icon.setTexture(key);
        });
      }
      showTip() {
        if (this.tips.length === 0) return;
        const tip = Phaser.Utils.Array.GetRandom(this.tips);
        this.tipCard.setVisible(true);
        this.tipText.setText(tip).setVisible(true);
        if (this.tipTimer) this.tipTimer.remove(false);
        this.tipTimer = this.time.addEvent({
          delay: 5000,
          callback: () => {
            this.tipText.setText('').setVisible(false);
            this.tipCard.setVisible(false);
            this.tipTimer = null;
          },
        });
      }
      endGame() {
        this.scene.pause();
        this.bgMusic.stop();
        this.add
          .text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Fim de Jogo',
            {
              fontSize: '32px',
              fill: '#f00',
            }
          )
          .setOrigin(0.5);
        if (typeof onGameOver === 'function') onGameOver();
      }
      update() {
        this.activeItems.forEach((sprite) => {
          if (sprite.y > this.scale.height + 32) {
            sprite.destroy();
            this.activeItems = this.activeItems.filter((i) => i !== sprite);
          }
        });
      }
    }
    class PauseScene extends Phaser.Scene {
      constructor() {
        super({ key: 'PauseScene' });
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
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false },
      },
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
