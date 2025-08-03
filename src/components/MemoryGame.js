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
  const navigate         = useNavigate();
  const [phaseConfig, setPhaseConfig] = useState(null);
  const profile                   = useStore((s) => s.profile);
  const setProfile                = useStore((s) => s.setProfile);
  const setCurrentPhase           = useStore((s) => s.setCurrentPhase);

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

  // Ensure the profile is loaded so we can access the bitmask.
  useEffect(() => {
    if (!profile) {
      (async () => {
        try {
          const data = await loadProfile();
          setProfile(data || { bitmask: 0 });
        } catch (err) {
          console.error('Erro ao carregar o perfil', err);
          setProfile({ bitmask: 0 });
        }
      })();
    }
  }, [profile, setProfile]);

  const handleReturnToMenu = () => {
    navigate('/modes');
  };
  const handleGameOver = () => {
    handleReturnToMenu();
  };

  if (!phaseConfig || !profile) return <LoadingScreen />;
  return (
    <GameWrapper
      phaseConfig={phaseConfig}
      bitmask={profile.bitmask || 0}
      onGameOver={handleGameOver}
      onReturnToMenu={handleReturnToMenu}
    />
  );
}