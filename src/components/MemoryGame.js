import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameWrapper from './GameWrapper';
import LoadingScreen from './LoadingScreen';
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
  const [bitmask, setBitmask]         = useState(null);
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
      try {
        const profile = await loadProfile();
        setBitmask(profile?.bitmask || 0);
      } catch (err) {
        console.error('Erro ao carregar o perfil', err);
        setBitmask(0);
      }
    })();
  }, []);

  const handleReturnToMenu = () => {
    navigate('/modes');
  };
  const handleGameOver = () => {
    handleReturnToMenu();
  };

  if (!phaseConfig || bitmask === null) return <LoadingScreen />;
  return (
    <GameWrapper
      phaseConfig={phaseConfig}
      bitmask={bitmask}
      onGameOver={handleGameOver}
      onReturnToMenu={handleReturnToMenu}
    />
  );
}