import React, { useEffect, useRef } from 'react';
import PhaserGameEngine from '../gameEngine';

/**
 * Wraps the Phaser game engine inside a React component. Whenever the
 * provided phase configuration or bitmask changes, the PhaserGameEngine is
 * re-initialized. Game over and menu return events are bubbled up through the
 * supplied callbacks so routing logic can respond appropriately.
 */
export default function GameWrapper({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!phaseConfig || !containerRef.current) return;
    // Create a new game engine for this phase
    engineRef.current = new PhaserGameEngine({ phaseConfig, bitmask, onGameOver, onReturnToMenu });
    engineRef.current.init(containerRef.current);
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [phaseConfig, bitmask, onGameOver, onReturnToMenu]);

  return (
    <div
      ref={containerRef}
      className="game-container"
    />
  );
}

