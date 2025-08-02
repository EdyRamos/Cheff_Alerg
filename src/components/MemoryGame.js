import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameWrapper from './GameWrapper';
import { useStore } from '../store';
import { loadProfile } from '../services/firestore';

/**
 * MemoryGame
 *
 * This component orchestrates loading the phase configuration and
 * player bitmask before rendering the Phaser canvas via GameWrapper.
 * It replaces the old implementation which embedded all Phaser
 * classes directly in a React component.  Separating these concerns
 * keeps React declarative and makes the game loop easier to test.
 */
export default function MemoryGame() {
  const { phase } = useParams();
  const navigate   = useNavigate();
  const [phaseConfig, setPhaseConfig] = useState(null);
  const [bitmask, setBitmask]         = useState(0);
  const setCurrentPhase               = useStore((s) => s.setCurrentPhase);

  // Load phase JSON on mount or when the route param changes.
  useEffect(() => {
    (async () => {
      try {
        const cfg = await import(`../phases/${phase}.json`);
        setPhaseConfig(cfg.default || cfg);
        setCurrentPhase(phase);
      } catch (err) {
        console.error('Erro ao carregar a fase', err);
        alert('Fase não encontrada.');
        navigate('/modes');
      }
    })();
  }, [phase, navigate, setCurrentPhase]);

  // Load the player's allergen bitmask from remote storage.
  useEffect(() => {
    (async () => {
      const profile = await loadProfile();
      setBitmask(profile?.bitmask || 0);
    })();
  }, []);

  const handleReturnToMenu = () => {
    navigate('/modes');
  };
  const handleGameOver = () => {
    handleReturnToMenu();
  };

  if (!phaseConfig) return null;
  return (
    <GameWrapper
      phaseConfig={phaseConfig}
      bitmask={bitmask}
      onGameOver={handleGameOver}
      onReturnToMenu={handleReturnToMenu}
    />
  );
}