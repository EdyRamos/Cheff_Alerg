import React, { useEffect, useRef } from 'react';
import PhaserGameEngine from '../gameEngine';

/**
 * GameWrapper
 *
 * This React component wraps the Phaser engine and ties it into the
 * lifecycle of React.  When the provided phase configuration or
 * bitmask changes, the wrapper re‑initializes the PhaserGameEngine.
 * The `onGameOver` and `onReturnToMenu` callbacks bubble events
 * up to the parent so that routing logic can respond appropriately.
 */
export default function GameWrapper({ phaseConfig, bitmask, onGameOver, onReturnToMenu }) {
  const containerRef = useRef(null);
  const engineRef    = useRef(null);

  useEffect(() => {
    if (!phaseConfig || !containerRef.current) return;
    // Create a new game engine for this phase.
    engineRef.current = new PhaserGameEngine({ phaseConfig, bitmask, onGameOver, onReturnToMenu });
    engineRef.current.init(containerRef.current);
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [phaseConfig, bitmask, onGameOver, onReturnToMenu]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} />;
}