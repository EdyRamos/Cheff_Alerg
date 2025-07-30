import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import DifficultyManager from '../utils/DifficultyManager';
import { loadProfile } from '../services/firestore';

/**
 * Cena Phaser que contém o loop principal do jogo.
 * Definida fora do componente React para não ser recriada a cada render.
 */
class GameScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'GameScene' });
    this.phaseConfig   = config.phaseConfig;
    this.bitmask       = config.bitmask;
    this.difficulty    = new DifficultyManager();
    this.score         = 0;
    this.lives         = 3;
    this.lastSpawn     = 0;
    this.spawnRate     = this.phaseConfig.spawnRate     || 1500;
    this.simultaneous  = this.phaseConfig.simultaneous  || 2;
    this.activeItems   = [];
  }

  preload() {
    // Carrega cada sprite definido no JSON da fase.
    this.phaseConfig.items.forEach(item => {
      this.load.image(item.key, item.spriteUrl);
    });

    // Placeholder genérico (já gerado como missing.png).
    this.load.image('missing', '/assets/images/missing.png');
  }

  create() {
    const { width } = this.scale;
    this.scoreText = this.add.text(16,          16, `Pontuação: ${this.score}`, { fontSize: '20px', fill: '#000' });
    this.lifeText  = this.add.text(width - 120, 16, `Vidas: ${this.lives}`,     { fontSize: '20px', fill: '#000' });
  }

  /**
   * Faz spawn aleatório de um alimento na tela.
   */
  spawnItem(time) {
    if (this.activeItems.length >= this.simultaneous) return;
    if (time - this.lastSpawn < this.spawnRate)       return;

    this.lastSpawn = time;
    const item     = Phaser.Math.RND.pick(this.phaseConfig.items);
    const x        = Phaser.Math.Between(50, this.scale.width  - 50);
    const y        = Phaser.Math.Between(100, this.scale.height - 50);

    const sprite = this.add.image(x, y, item.key);
    sprite.setData('bit', item.bitmaskBit || 0);
    sprite.setInteractive();
    sprite.on('pointerdown', () => this.handleTap(sprite));

    this.activeItems.push(sprite);

    // Animação de descida (drift).
    this.tweens.add({
      targets: sprite,
      y:       this.scale.height + 50,
      duration: 6000,
      onComplete: () => {
        this.activeItems = this.activeItems.filter(s => s !== sprite);
        sprite.destroy();
      }
    });
  }

  /**
   * Lógica de toque em um item.
   */
  handleTap(sprite) {
    const bit        = sprite.getData('bit');
    const isAllergen = (this.bitmask & (1 << bit)) !== 0;

    if (isAllergen) {
      // Errou: perde vida e mostra dica.
      this.lives -= 1;
      this.lifeText.setText(`Vidas: ${this.lives}`);
      this.add
        .text(sprite.x, sprite.y - 20, 'Alergênico!', { fontSize: '14px', fill: '#f00' })
        .setOrigin(0.5, 1);
      this.difficulty.record(false);
    } else {
      // Acertou: ganha pontos.
      this.score += 10;
      this.scoreText.setText(`Pontuação: ${this.score}`);
      this.difficulty.record(true);

      // Efeito de confete – um emitter já configurado no ato da criação.
      const emitter = this.add.particles('missing', {
        speed:    { min: -100, max: 100 },
        angle:    { min:    0, max: 360 },
        lifespan: 500,
        scale:    { start: 0.3, end: 0 },
        quantity: 0          // 0, pois usaremos explode()
      });

      emitter.explode(20, sprite.x, sprite.y);
    }

    // Remove o sprite tocado.
    this.activeItems = this.activeItems.filter(s => s !== sprite);
    sprite.destroy();

    // Fim de jogo.
    if (this.lives <= 0) {
      this.scene.pause();
      this.add
        .text(this.scale.width / 2, this.scale.height / 2, 'Fim de Jogo', { fontSize: '32px', fill: '#f00' })
        .setOrigin(0.5);
    }
  }

  update(time) {
    const params = this.difficulty.getParameters(
      this.phaseConfig.spawnRate,
      this.phaseConfig.simultaneous
    );
    this.spawnRate    = params.spawnRate;
    this.simultaneous = params.simultaneous;
    this.spawnItem(time);
  }
}

/**
 * Componente React que hospeda o Phaser Game.
 */
export default function MemoryGame() {
  const { phase } = useParams();
  const [phaseConfig, setPhaseConfig] = useState(null);
  const [bitmask,     setBitmask]     = useState(0);

  const gameRef      = useRef(null);
  const containerRef = useRef(null);
  const navigate     = useNavigate();

  // Carrega o JSON da fase.
  useEffect(() => {
    (async () => {
      try {
        const cfg = await import(`../phases/${phase}.json`);
        setPhaseConfig(cfg.default || cfg);
      } catch (err) {
        console.error('Erro ao carregar a fase', err);
        alert('Fase não encontrada.');
        navigate('/modes');
      }
    })();
  }, [phase, navigate]);

  // Carrega a bitmask do perfil.
  useEffect(() => {
    (async () => {
      const profile = await loadProfile();
      setBitmask(profile?.bitmask || 0);
    })();
  }, []);

  // Instancia o jogo quando tiver tudo.
  useEffect(() => {
    if (!phaseConfig || gameRef.current) return;

    const config = {
      type:   Phaser.AUTO,
      width:  window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      scene:  new GameScene({ phaseConfig, bitmask })
    };

    gameRef.current = new Phaser.Game(config);

    // Clean‑up na desmontagem do componente.
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [phaseConfig, bitmask]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
