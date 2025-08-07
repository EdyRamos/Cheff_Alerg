import Phaser from 'phaser';
import DifficultyManager from '../utils/DifficultyManager';
import { getHUDConfig } from '../utils/hudConfig';

import pauseIcon from '../assets/images/ui/pause.png';
import lifeFullIcon from '../assets/images/ui/life_full.png';
import lifeEmptyIcon from '../assets/images/ui/life_empty.png';
import scoreIcon from '../assets/images/ui/score.png';
import timeIcon from '../assets/images/ui/time.png';
import tipBgIcon from '../assets/images/ui/card_tip_bg.png';

export default class GameScene extends Phaser.Scene {
  constructor({ phaseConfig, bitmask, onGameOver, engine }) {
    super({ key: 'GameScene' });
    this.phaseConfig = phaseConfig;
    this.bitmask = bitmask;
    this.onGameOver = onGameOver;
    this.engine = engine;
    this.score = 0;
    this.lives = 3;
    this.activeItems = [];
    this.lastSpawn = 0;
    this.difficulty = new DifficultyManager();
    this.baseSpawnRate =
      phaseConfig.itemSpawnRate || phaseConfig.spawnRate || 1500;
    this.baseSimultaneous = phaseConfig.simultaneous || 2;
    this.spawnRate = this.baseSpawnRate;
    this.simultaneous = this.baseSimultaneous;
    this.speed = phaseConfig.speed || 1;
    this.duration = phaseConfig.duration || null;
    this.tips = phaseConfig.tips || [];
    this.music = phaseConfig.music || '/assets/audio/background.ogg';
    this.tipText = null;
    this.tipCard = null;
    this.lifeIcons = [];
    this.chef = null;
    this.hud = null;
  }

  preload() {
    const { phaseConfig } = this;
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
    this.load.audio('bgMusic', this.music);
    this.load.audio('safeSound', '/assets/audio/safe.ogg');
    this.load.audio('allergenSound', '/assets/audio/allergen.ogg');
  }

  create() {
    const { width, height } = this.scale;
    const base = Math.max(height, 320);
    const { phaseConfig } = this;
    const engine = this.engine;
    // RESOLVIDO: Usa chefSize mínimo e getHUDConfig mais flexível
    const chefSize = Math.max(base * 0.15, 32);
    this.hud = getHUDConfig(width, height, chefSize);
    const { margin, iconSize, textStyle } = this.hud;

    this.hudContainer = this.add.container(0, 0).setDepth(10);
    if (phaseConfig.background) {
      const bg = this.add.image(width / 2, height / 2, 'background');
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale).setScrollFactor(0);
    }
    this.bgMusic = this.sound.add('bgMusic', { loop: true });
    this.bgMusic.play();
    if (engine) {
      engine.bgMusic = this.bgMusic;
    }
    // Score HUD
    this.scoreContainer = this.add.container(margin, margin);
    this.scoreIcon = this.add
      .image(0, 0, 'uiScore')
      .setOrigin(0, 0.5)
      .setDisplaySize(iconSize, iconSize);
    this.scoreText = this.add
      .text(iconSize + margin / 2, 0, `${this.score}`, textStyle)
      .setOrigin(0, 0.5);
    this.scoreContainer.add([this.scoreIcon, this.scoreText]);
    this.hudContainer.add(this.scoreContainer);

    // Life HUD
    this.livesContainer = this.add.container(width - margin, margin);
    for (let i = 0; i < this.lives; i++) {
      const icon = this.add
        .image(-i * (iconSize + margin / 2), 0, 'uiLifeFull')
        .setOrigin(1, 0.5)
        .setDisplaySize(iconSize, iconSize);
      this.lifeIcons.push(icon);
      this.livesContainer.add(icon);
    }
    this.hudContainer.add(this.livesContainer);

    // Timer HUD
    if (this.duration) {
      this.remainingTime = this.duration;
      this.timeContainer = this.add.container(width / 2, margin);
      this.timeIcon = this.add
        .image(-iconSize - margin / 2, 0, 'uiTime')
        .setOrigin(0, 0.5)
        .setDisplaySize(iconSize, iconSize);
      this.timeText = this.add
        .text(0, 0, `${this.remainingTime}`, textStyle)
        .setOrigin(0, 0.5);
      this.timeContainer.add([this.timeIcon, this.timeText]);
      this.hudContainer.add(this.timeContainer);
      this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.remainingTime -= 1;
          this.timeText.setText(`${this.remainingTime}`);
          this.animateHUD(this.timeContainer);
        },
        loop: true,
      });
    }
    // Tips
    this.tipCard = this.add
      .image(width / 2, this.hud.tip.y, 'uiTipBg')
      .setOrigin(0.5)
      .setDepth(9)
      .setVisible(false)
      .setDisplaySize(this.hud.tip.cardWidth, this.hud.tip.cardHeight);
    this.tipText = this.add
      .text(width / 2, this.hud.tip.y, '', {
        fontSize: `${iconSize * 0.6}px`,
        fill: '#000',
        align: 'center',
        wordWrap: { width: this.hud.tip.cardWidth - margin * 2 },
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setVisible(false);
    // Chef sprite (ANIMAÇÃO)
    this.chef = this.add
      .sprite(width / 2, height - chefSize / 2 - margin * 2, 'chefIdle')
      .setDepth(5)
      .setDisplaySize(chefSize, chefSize);
    this.tipTimer = null;
    // Pause
    this.pauseButton = this.add
      .image(width - margin * 2, margin * 2, 'uiPause')
      .setDisplaySize(iconSize, iconSize)
      .setInteractive();
    const launchPause = () => {
      this.bgMusic?.pause();
      this.scene.launch('PauseScene');
      this.scene.pause();
    };
    this.pauseButton.on('pointerdown', launchPause);
    this.input.keyboard.on('keydown-P', launchPause);
    this.spawnLoop = this.time.addEvent({
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
        this.endGame(true);
      });
    }

    this.scale.on('resize', this.handleResize, this);
    this.events.on('resize', this.handleResize, this);
  }

  handleResize(arg1, arg2) {
    let width;
    let height;
    if (typeof arg1 === 'object') {
      ({ width, height } = arg1);
    } else {
      width = arg1;
      height = arg2;
    }
    if (typeof width !== 'number' || typeof height !== 'number') return;

    const base = Math.min(width, height);
    const chefSize = Math.max(base * 0.15, 32);
    this.hud = getHUDConfig(width, height, chefSize);
    const { margin, iconSize, textStyle, tip } = this.hud;

    this.scoreContainer?.setPosition(margin, margin);
    this.scoreIcon?.setDisplaySize(iconSize, iconSize);
    this.scoreText?.setPosition(iconSize + margin / 2, 0).setStyle(textStyle);

    this.livesContainer?.setPosition(width - margin, margin);
    this.lifeIcons.forEach((icon, index) => {
      icon
        .setDisplaySize(iconSize, iconSize)
        .setPosition(-index * (iconSize + margin / 2), 0);
    });

    if (this.timeContainer) {
      this.timeContainer.setPosition(width / 2, margin);
      this.timeIcon
        .setDisplaySize(iconSize, iconSize)
        .setPosition(-iconSize - margin / 2, 0);
      this.timeText.setPosition(0, 0).setStyle(textStyle);
    }

    this.pauseButton
      ?.setPosition(width - margin * 2, margin * 2)
      .setDisplaySize(iconSize, iconSize);

    this.tipCard
      ?.setPosition(width / 2, tip.y)
      .setDisplaySize(tip.cardWidth, tip.cardHeight);
    this.tipText
      ?.setPosition(width / 2, tip.y)
      .setStyle({
        fontSize: `${iconSize * 0.6}px`,
        fill: '#000',
        align: 'center',
        wordWrap: { width: tip.cardWidth - margin * 2 },
      });

    this.chef
      ?.setDisplaySize(chefSize, chefSize)
      .setPosition(width / 2, height - chefSize / 2 - margin * 2);
  }

  spawnItem() {
    const { width, height } = this.scale;
    const base = Math.max(height, 320);
    const phaseConfig = this.phaseConfig;
    const item = Phaser.Utils.Array.GetRandom(phaseConfig.items);
    const sizeRatio = phaseConfig.itemScale || 0.1;
    const itemSize =
      phaseConfig.itemSize || Math.max(base * sizeRatio, 32);
    const x = Phaser.Math.Between(itemSize / 2, width - itemSize / 2);
    const sprite = this.physics.add.image(x, -itemSize / 2, item.key);
    sprite.setDisplaySize(itemSize, itemSize);
    const targetScaleX = sprite.scaleX;
    const targetScaleY = sprite.scaleY;
    sprite.setScale(0);
    sprite.setData('itemData', item);
    sprite.setVelocityY(100 * this.speed);
    this.tweens.add({
      targets: sprite,
      scaleX: { from: 0, to: targetScaleX },
      scaleY: { from: 0, to: targetScaleY },
      duration: 300,
      ease: 'Back.Out',
    });
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
      typeof bit === 'number' && (this.bitmask & (1 << bit)) !== 0;
    const correct = !isAllergen && !item.trap;
    if (isAllergen) {
      this.animateChef('miss');
      this.sound.play('allergenSound');
      this.lives -= 1;
      this.updateLives();
      this.showTip();
    } else if (item.trap) {
      this.animateChef('miss');
      this.sound.play('allergenSound');
      this.score = Math.max(0, this.score - (item.penalty || 10));
      this.updateScore();
    } else {
      const bonus = item.bonus || 0;
      this.animateChef('collect');
      this.sound.play('safeSound');
      this.score += 10 + bonus;
      this.updateScore();
    }

    this.difficulty.record(correct);
    const params = this.difficulty.getParameters(
      this.baseSpawnRate,
      this.baseSimultaneous
    );
    this.spawnRate = params.spawnRate;
    this.simultaneous = params.simultaneous;
    if (this.spawnLoop) this.spawnLoop.delay = this.spawnRate;
    sprite.disableInteractive();
    sprite.body.enable = false;
    this.activeItems = this.activeItems.filter((i) => i !== sprite);
    this.tweens.add({
      targets: sprite,
      scale: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        sprite.destroy();
        if (this.lives <= 0) {
          this.endGame();
        }
      },
    });
  }

  updateScore() {
    this.scoreText.setText(`${this.score}`);
    this.animateHUD(this.scoreContainer);
  }

  updateLives() {
    this.lifeIcons.forEach((icon, index) => {
      const key = index < this.lives ? 'uiLifeFull' : 'uiLifeEmpty';
      icon.setTexture(key);
    });
    this.animateHUD(this.livesContainer);
  }

  updateTipLayout() {
    if (!this.tipCard || !this.tipText || !this.hud) return;
    const { width } = this.scale;
    const { tip, margin, iconSize } = this.hud;
    this.tipCard
      .setPosition(width / 2, tip.y)
      .setDisplaySize(tip.cardWidth, tip.cardHeight);
    this.tipText
      .setPosition(width / 2, tip.y)
      .setStyle({
        fontSize: `${iconSize * 0.6}px`,
        fill: '#000',
        align: 'center',
        wordWrap: { width: tip.cardWidth - margin * 2 },
      });
  }

  showTip() {
    if (this.tips.length === 0) return;
    this.hud = getHUDConfig(
      this.scale.width,
      this.scale.height,
      this.chef.displayHeight
    );
    this.updateTipLayout();
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

  endGame(success = false) {
    this.scene.pause();
    this.bgMusic.stop();
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Fim de Jogo', {
        fontSize: '32px',
        fill: '#f00',
      })
      .setOrigin(0.5);
    if (typeof this.onGameOver === 'function') this.onGameOver({ success });
  }

  update() {
    this.activeItems.forEach((sprite) => {
      if (sprite.y > this.scale.height + sprite.displayHeight / 2) {
        this.activeItems = this.activeItems.filter((i) => i !== sprite);
        this.tweens.add({
          targets: sprite,
          alpha: 0,
          duration: 200,
          onComplete: () => sprite.destroy(),
        });
      }
    });
  }

  animateHUD(target) {
    this.tweens.add({
      targets: target,
      scale: { from: 1, to: 1.2 },
      duration: 200,
      yoyo: true,
    });
  }
}
